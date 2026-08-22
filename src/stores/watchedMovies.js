import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useAuthStore } from "./auth.js";
import { useSavedMoviesStore } from "./savedMovies.js";
import { useGroupsStore } from "./groups.js";

import {
  db,
  doc,
  collection,
  runTransaction,
  onSnapshot,
  increment,
} from "@/services/firebase.js";
import { useNotificationsStore } from "./notifications.js";

export const useWatchedMoviesStore = defineStore("watchedMovies", () => {
  const watchedMovies = ref([]);
  const watchedMoviesIds = ref([]);
  const isLoading = ref(false);
  let unsubscribeListener = null;

  const groupsStore = useGroupsStore();
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();
  const savedMoviesStore = useSavedMoviesStore();

  function getTargetCollectionPath() {
    const activeGroup = groupsStore.activeGroup;
    if (!activeGroup) {
      if (!authStore.user?.uid) return null;
      return `users/${authStore.user.uid}/watchedMovies`;
    }
    return `groups/${activeGroup.id}/watchedMovies`;
  }

  function setupWatchedMoviesListener() {
    if (unsubscribeListener) {
      unsubscribeListener();
      unsubscribeListener = null;
    }

    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) {
      watchedMovies.value = [];
      watchedMoviesIds.value = [];
      return;
    }

    isLoading.value = true;

    unsubscribeListener = onSnapshot(
      collection(db, collectionPath),
      (snapshot) => {
        watchedMovies.value = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        watchedMoviesIds.value = watchedMovies.value.map((movie) =>
          String(movie.id),
        );
        isLoading.value = false;
      },
      (error) => {
        console.error("Erro ao buscar filmes:", error);
        isLoading.value = false;
      },
    );
  }

  watch(
    [() => groupsStore.activeGroup?.id, () => authStore.user?.uid],
    ([groupId, userId]) => {
      if (groupId || userId) {
        setupWatchedMoviesListener();
      } else {
        if (unsubscribeListener) unsubscribeListener();
        watchedMovies.value = [];
        watchedMoviesIds.value = [];
      }
    },
    { immediate: true },
  );

  function calculateAverageRating(reviews) {
    const ratings = Object.values(reviews).map((r) => Number(r.rating));
    if (ratings.length === 0) return "0.0";
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  }

  function formatNewMoviePayload(
    movie,
    currentUserId,
    userReview,
    activeGroupId,
  ) {
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
      created_at: new Date(),
    };

    if (activeGroupId) {
      movieData.saved_by = movie.saved_by || currentUserId;
    }

    return movieData;
  }

  async function saveWatchedMovie(movie, review) {
    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) return null;

    const currentUserId = authStore.user?.uid;
    if (!currentUserId) return;

    const movieDocRef = doc(db, collectionPath, String(movie.id));

    const newUserReview = {
      rating: review.rating,
      comment: review.comment || "",
      updatedAt: new Date(),
    };

    let finalReviews = {};
    let isNewMovieInGroup = false;

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(movieDocRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        finalReviews = {
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
          groupsStore.activeGroup?.id,
        );

        transaction.set(movieDocRef, newMovieData);
      }

      if (groupsStore.activeGroup && isNewMovieInGroup) {
        const groupDocRef = doc(db, "groups", groupsStore.activeGroup.id);
        transaction.update(groupDocRef, {
          total_watched: increment(1),
        });
      }
    });

    if (groupsStore.activeGroup) {
      await notificationsStore.dispatchWatchedMovieNotification(movie);
    }

    if (savedMoviesStore.isAlreadySaved(movie.id)) {
      await savedMoviesStore.toggleSaved(movie);
    }
  }

  async function removeMyRating(movieId) {
    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) return;

    const currentUserId = authStore.user?.uid;
    if (!currentUserId) return;

    const movieDocRef = doc(db, collectionPath, String(movieId));

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(movieDocRef);
      if (!docSnap.exists()) return;

      const existingData = docSnap.data();
      const updatedReviews = { ...existingData.reviews };

      delete updatedReviews[currentUserId];

      const remainingUserIds = Object.keys(updatedReviews);

      if (remainingUserIds.length === 0) {
        if (groupsStore.activeGroup) {
          const groupDocRef = doc(db, "groups", groupsStore.activeGroup.id);
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

  function isAlreadyWatched(movieId) {
    const currentUserId = authStore.user?.uid;
    if (!currentUserId) return false;

    const targetId = String(movieId);

    const movie = watchedMovies.value.find((m) => String(m.id) === targetId);

    if (!movie) {
      return false;
    }

    return !!(movie.reviews && movie.reviews[currentUserId]);
  }

  return {
    watchedMovies,
    isLoading,
    setupWatchedMoviesListener,
    saveWatchedMovie,
    removeMyRating,
    isAlreadyWatched,
  };
});
