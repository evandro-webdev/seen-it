import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useAuthStore } from "./auth.js";
import { useSavedMoviesStore } from "./savedMovies.js";
import { useGroupsStore } from "./groups.js";

import {
  db,
  doc,
  getDocs,
  collection,
  deleteDoc,
  runTransaction,
} from "@/services/firebase.js";
import { useNotificationsStore } from "./notifications.js";

export const useWatchedMoviesStore = defineStore("watchedMovies", () => {
  const watchedMovies = ref([]);
  const watchedMoviesIds = ref([]);
  const isLoading = ref(false);

  const groupStore = useGroupsStore();
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();
  const savedMoviesStore = useSavedMoviesStore();

  function getTargetCollectionPath() {
    const activeGroup = groupStore.activeGroup;
    if (!activeGroup) {
      if (!authStore.user?.uid) return null;
      return `users/${authStore.user.uid}/watchedMovies`;
    }
    return `groups/${activeGroup.id}/watchedMovies`;
  }

  async function loadWatchedMovies() {
    if (watchedMovies.value.length > 0) return;

    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) return;

    isLoading.value = true;

    try {
      const snapshot = await getDocs(collection(db, collectionPath));
      watchedMovies.value = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      watchedMoviesIds.value = watchedMovies.value.map((movie) => movie.id);
    } catch (error) {
      console.error("Erro ao carregar filmes assistidos:", error);
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    [() => groupStore.activeGroup?.id, () => authStore.user?.uid],
    async ([groupId, userId]) => {
      watchedMovies.value = [];
      watchedMoviesIds.value = [];

      if (groupId || userId) {
        await loadWatchedMovies();
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
        finalReviews = {
          [currentUserId]: newUserReview,
        };
        average_rating = Number(review.rating).toFixed(1);

        transaction.set(movieDocRef, {
          id: movie.id,
          title: movie.title,
          original_title: movie.original_title || "",
          poster_path: movie.poster_path || "",
          reviews: finalReviews,
          average_rating,
          created_at: new Date(),
        });
      }
    });

    const existingLocalIndex = watchedMovies.value.findIndex(
      (m) => String(m.id) === String(movie.id),
    );

    const localMovieData = {
      ...movie,
      docId: String(movie.id),
      reviews: finalReviews,
      average_rating,
    };

    if (existingLocalIndex !== -1) {
      watchedMovies.value[existingLocalIndex] = localMovieData;
    } else {
      watchedMovies.value.push(localMovieData);
      watchedMoviesIds.value.push(movie.id);
    }

    if (groupStore.activeGroup) {
      await notificationsStore.dispatchWatchedMovieNotification(movie);
    }

    if (savedMoviesStore.isAlreadySaved(movie.id)) {
      await savedMoviesStore.toggleSaved(movie);
    }
  }

  async function deleteWatchedMovie(id) {
    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) return;

    await deleteDoc(doc(db, collectionPath, String(id)));

    watchedMovies.value = watchedMovies.value.filter(
      (movie) => String(movie.id) !== String(id),
    );

    watchedMoviesIds.value = watchedMoviesIds.value.filter(
      (movieId) => String(movieId) !== String(id),
    );
  }

  function isAlreadyWatched(movieId) {
    const currentUserId = authStore.user?.uid;
    if (!currentUserId) return false;

    if (!groupStore.activeGroup) {
      return watchedMoviesIds.value.includes(movieId);
    }

    const groupMovie = watchedMovies.value.find(
      (movie) => String(movie.id) === String(movieId),
    );

    if (!groupMovie) {
      return false;
    }

    return !!(groupMovie.reviews && groupMovie.reviews[currentUserId]);
  }

  return {
    watchedMovies,
    loadWatchedMovies,
    saveWatchedMovie,
    deleteWatchedMovie,
    isAlreadyWatched,
  };
});
