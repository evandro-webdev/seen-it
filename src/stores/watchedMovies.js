import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useAuthStore } from "./auth.js";
import { useSavedMoviesStore } from "./savedMovies.js";
import { useGroupsStore } from "./groups.js";
import { useNotificationsStore } from "./notifications.js";
import {
  createWatchedMoviesListener,
  saveWatchedMovieDocument,
  removeMyRatingDocument,
} from "@/services/watchedMoviesService.js";

export const useWatchedMoviesStore = defineStore("watched_movies", () => {
  const watchedMovies = ref([]);
  const isLoading = ref(false);
  let unsubscribeListener = null;

  const groupsStore = useGroupsStore();
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();
  const savedMoviesStore = useSavedMoviesStore();

  function stopListeners() {
    if (unsubscribeListener) {
      unsubscribeListener();
      unsubscribeListener = null;
    }
  }

  function setupListeners() {
    stopListeners();

    const activeGroup = groupsStore.activeGroup;
    const userId = authStore.user?.uid;

    if (!activeGroup && !userId) {
      watchedMovies.value = [];
      return;
    }

    isLoading.value = true;

    unsubscribeListener = createWatchedMoviesListener(
      activeGroup,
      userId,
      (movies) => {
        watchedMovies.value = movies;
        isLoading.value = false;
      },
      (error) => {
        console.error("Erro ao buscar filmes assistidos:", error);
        isLoading.value = false;
      },
    );
  }

  watch(
    [() => groupsStore.activeGroup?.id, () => authStore.user?.uid],
    () => {
      setupListeners();
    },
    { immediate: true },
  );

  async function saveWatchedMovie(movie, review) {
    const activeGroup = groupsStore.activeGroup;
    const currentUserId = authStore.user?.uid;

    const isNewMovie = await saveWatchedMovieDocument(
      movie,
      review,
      activeGroup,
      currentUserId,
    );

    if (activeGroup && isNewMovie) {
      await notificationsStore.dispatchWatchedMovieNotification(movie);
    }

    if (savedMoviesStore.isSaved(movie.id)) {
      await savedMoviesStore.toggleSaved(movie);
    }
  }

  async function removeMyRating(movieId) {
    const activeGroup = groupsStore.activeGroup;
    const currentUserId = authStore.user?.uid;

    await removeMyRatingDocument(movieId, activeGroup, currentUserId);
  }

  function isAlreadyWatched(movieId) {
    const currentUserId = authStore.user?.uid;
    if (!currentUserId) return false;

    const targetId = String(movieId);
    const movie = watchedMovies.value.find((m) => String(m.id) === targetId);

    if (!movie) return false;

    return !!(movie.reviews && movie.reviews[currentUserId]);
  }

  return {
    watchedMovies,
    isLoading,
    setupListeners,
    stopListeners,
    saveWatchedMovie,
    removeMyRating,
    isAlreadyWatched,
  };
});
