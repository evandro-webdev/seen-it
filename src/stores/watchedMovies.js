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
        console.error(
          "Erro ao escutar filmes assistidos em tempo real:",
          error,
        );
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
    let average_rating = "0";

    let cast = [];
    let director = null;
    let savedBy = currentUserId;

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(movieDocRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        finalReviews = {
          ...existingData.reviews,
          [currentUserId]: newUserReview,
        };

        const ratings = Object.values(finalReviews).map((r) =>
          Number(r.rating),
        );
        average_rating = (
          ratings.reduce((a, b) => a + b, 0) / ratings.length
        ).toFixed(1);

        transaction.update(movieDocRef, {
          [`reviews.${currentUserId}`]: newUserReview,
          average_rating,
          updated_at: new Date(),
        });
      } else {
        finalReviews = { [currentUserId]: newUserReview };
        average_rating = Number(review.rating).toFixed(1);

        cast =
          movie.credits?.cast?.slice(0, 15).map((actor) => ({
            id: actor.id,
            name: actor.name,
          })) || [];

        const crewList = movie.credits?.crew || [];
        const directorObj = crewList.find(
          (member) => member.job === "Director",
        );
        director = directorObj
          ? { id: directorObj.id, name: directorObj.name }
          : null;

        const movieData = {
          id: movie.id,
          title: movie.title,
          original_title: movie.original_title || "",
          poster_path: movie.poster_path || "",
          reviews: finalReviews,
          average_rating,
          release_date: movie.release_date || "",
          cast,
          director,
          created_at: new Date(),
        };

        if (groupsStore.activeGroup) {
          movieData.saved_by = movie.saved_by || currentUserId;
        }

        transaction.set(movieDocRef, movieData);
      }
    });

    const existingLocalIndex = watchedMovies.value.findIndex(
      (m) => String(m.id) === String(movie.id),
    );

    if (existingLocalIndex !== -1) {
      watchedMovies.value[existingLocalIndex] = {
        ...watchedMovies.value[existingLocalIndex],
        reviews: finalReviews,
        average_rating,
      };
    } else {
      const newLocalMovie = {
        ...movie,
        docId: String(movie.id),
        reviews: finalReviews,
        average_rating,
        cast,
        director,
        saved_by: savedBy,
        created_at: new Date(),
      };

      watchedMovies.value.push(newLocalMovie);
      watchedMoviesIds.value.push(movie.id);
    }

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
        transaction.delete(movieDocRef);
      } else {
        const ratings = Object.values(updatedReviews).map((r) =>
          Number(r.rating),
        );

        const newAverage = (
          ratings.reduce((a, b) => a + b, 0) / ratings.length
        ).toFixed(1);

        transaction.update(movieDocRef, {
          reviews: updatedReviews,
          average_rating: newAverage,
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
    setupWatchedMoviesListener,
    saveWatchedMovie,
    removeMyRating,
    isAlreadyWatched,
    isLoading,
  };
});
