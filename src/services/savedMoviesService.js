import {
  db,
  collection,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  increment,
} from "@/services/firebase.js";

function getTargetCollectionPath(activeGroup, userId) {
  if (!activeGroup) {
    if (!userId) return null;
    return `users/${userId}/saved_movies`;
  }
  return `groups/${activeGroup.id}/saved_movies`;
}

export function createSavedMoviesListener(activeGroup, userId, onUpdate, onError) {
  const collectionPath = getTargetCollectionPath(activeGroup, userId);
  
  if (!collectionPath) {
    onUpdate([], []);
    return null;
  }

  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const movies = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      const movieIds = movies.map((movie) => String(movie.id));
      onUpdate(movies, movieIds);
    },
    onError
  );
}

export async function saveMovieDocument(movie, activeGroup, userId) {
  const collectionPath = getTargetCollectionPath(activeGroup, userId);
  if (!collectionPath) return null;

  const movieData = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    runtime: movie.runtime,
  };

  if (activeGroup) {
    movieData.saved_by = userId;
  }

  const movieDocRef = doc(db, collectionPath, String(movie.id));
  await setDoc(movieDocRef, movieData);

  if (activeGroup) {
    const groupDocRef = doc(db, "groups", activeGroup.id);
    await updateDoc(groupDocRef, { total_saved: increment(1) });
  }

  return movieDocRef;
}

export async function unsaveMovieDocument(movieId, activeGroup, userId) {
  const collectionPath = getTargetCollectionPath(activeGroup, userId);
  if (!collectionPath) return;

  const movieDocRef = doc(db, collectionPath, String(movieId));
  await deleteDoc(movieDocRef);

  if (activeGroup) {
    const groupDocRef = doc(db, "groups", activeGroup.id);
    await updateDoc(groupDocRef, { total_saved: increment(-1) });
  }
}