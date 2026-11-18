import {
  db,
  doc,
  collection,
  runTransaction,
  onSnapshot,
  increment,
  serverTimestamp,
} from "@/services/firebase.js";

function getTargetCollectionPath(activeGroup, userId) {
  if (!activeGroup) {
    if (!userId) return null;
    return `users/${userId}/watched_movies`;
  }
  return `groups/${activeGroup.id}/watched_movies`;
}

export function createWatchedMoviesListener(activeGroup, userId, onUpdate, onError) {
  const collectionPath = getTargetCollectionPath(activeGroup, userId);
  
  if (!collectionPath) {
    onUpdate([]);
    return null;
  }

  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const movies = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      onUpdate(movies);
    },
    onError
  );
}

function calculateAverageRating(reviews) {
  const ratings = Object.values(reviews).map((r) => Number(r.rating));
  if (ratings.length === 0) return "0.0";
  return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
}

function formatNewMoviePayload(movie, currentUserId, userReview, activeGroupId) {
  const cast =
    movie.credits?.cast?.slice(0, 15).map((actor) => ({
      id: actor.id,
      name: actor.name,
    })) || [];

  const directorObj = movie.credits?.crew?.find((m) => m.job === "Director");
  const director = directorObj
    ? { id: directorObj.id, name: directorObj.name }
    : null;

  const movieData = {
    id: movie.id,
    title: movie.title,
    original_title: movie.original_title || "",
    poster_path: movie.poster_path || "",
    reviews: { [currentUserId]: userReview },
    average_rating: Number(userReview.rating).toFixed(1),
    release_date: movie.release_date || "",
    cast,
    director,
    created_at: serverTimestamp(),
  };

  if (activeGroupId) {
    movieData.saved_by = movie.saved_by || currentUserId;
  }

  return movieData;
}

export async function saveWatchedMovieDocument(movie, review, activeGroup, currentUserId) {
  const collectionPath = getTargetCollectionPath(activeGroup, currentUserId);
  if (!collectionPath || !currentUserId) return;

  const movieDocRef = doc(db, collectionPath, String(movie.id));

  const newUserReview = {
    rating: review.rating,
    comment: review.comment || "",
    updatedAt: new Date(),
  };

  let isNewMovieInGroup = false;

  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(movieDocRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const finalReviews = {
        ...existingData.reviews,
        [currentUserId]: newUserReview,
      };

      transaction.update(movieDocRef, {
        [`reviews.${currentUserId}`]: newUserReview,
        average_rating: calculateAverageRating(finalReviews),
        updated_at: new Date(),
      });
    } else {
      isNewMovieInGroup = true;

      const newMovieData = formatNewMoviePayload(
        movie,
        currentUserId,
        newUserReview,
        activeGroup?.id
      );

      transaction.set(movieDocRef, newMovieData);
    }

    if (activeGroup && isNewMovieInGroup) {
      const groupDocRef = doc(db, "groups", activeGroup.id);
      transaction.update(groupDocRef, {
        total_saved: increment(-1), // opcional caso precise ajustar contadores
        total_watched: increment(1),
      });
    }
  });

  return isNewMovieInGroup;
}

export async function removeMyRatingDocument(movieId, activeGroup, currentUserId) {
  const collectionPath = getTargetCollectionPath(activeGroup, currentUserId);
  if (!collectionPath || !currentUserId) return;

  const movieDocRef = doc(db, collectionPath, String(movieId));

  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(movieDocRef);
    if (!docSnap.exists()) return;

    const existingData = docSnap.data();
    const updatedReviews = { ...existingData.reviews };

    delete updatedReviews[currentUserId];

    const remainingUserIds = Object.keys(updatedReviews);

    if (remainingUserIds.length === 0) {
      if (activeGroup) {
        const groupDocRef = doc(db, "groups", activeGroup.id);
        transaction.update(groupDocRef, {
          total_watched: increment(-1),
        });
      }
      transaction.delete(movieDocRef);
    } else {
      transaction.update(movieDocRef, {
        reviews: updatedReviews,
        average_rating: calculateAverageRating(updatedReviews),
        updated_at: new Date(),
      });
    }
  });
}