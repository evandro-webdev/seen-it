import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useGroupsStore } from "./groups";
import { useNotificationsStore } from "./notifications";
import { useAuthStore } from "./auth";
import { useMovieDetailsStore } from "./movieDetails";
import {
  createSavedMoviesListener,
  saveMovieDocument,
  unsaveMovieDocument,
} from "@/services/savedMoviesService.js";

export const useSavedMoviesStore = defineStore("savedMovies", () => {
  const savedMovies = ref([]);
  const savedMoviesIds = ref([]);
  const isLoading = ref(false);
  let unsubscribeListener = null;

  const groupsStore = useGroupsStore();
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();

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
      savedMovies.value = [];
      savedMoviesIds.value = [];
      return;
    }

    isLoading.value = true;

    unsubscribeListener = createSavedMoviesListener(
      activeGroup,
      userId,
      (movies, movieIds) => {
        savedMovies.value = movies;
        savedMoviesIds.value = movieIds;
        isLoading.value = false;
      },
      (error) => {
        console.error("Erro ao escutar filmes salvos em tempo real:", error);
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

  async function saveMovie(movie) {
    const activeGroup = groupsStore.activeGroup;
    const userId = authStore.user?.uid;

    const docRef = await saveMovieDocument(movie, activeGroup, userId);

    if (activeGroup) {
      await notificationsStore.dispatchSavedMovieNotification(movie);
    }

    return docRef;
  }

  async function unsaveMovie(movieId) {
    const activeGroup = groupsStore.activeGroup;
    const userId = authStore.user?.uid;

    await unsaveMovieDocument(movieId, activeGroup, userId);
  }

  async function toggleSaved(movie) {
    const strMovieId = String(movie.id);

    if (isSaved(strMovieId)) {
      await unsaveMovie(strMovieId);
    } else {
      await saveMovie(movie);
    }
  }

  function isSaved(movieId) {
    return savedMoviesIds.value.includes(String(movieId));
  }

  function pickRandomMovie() {
    if (!savedMovies.value.length) return;

    const randomIndex = Math.floor(Math.random() * savedMovies.value.length);
    const randomMovie = savedMovies.value[randomIndex];

    const movieDetailsStore = useMovieDetailsStore();
    movieDetailsStore.openModal(randomMovie.id);
  }

  return {
    savedMovies,
    savedMoviesIds,
    isLoading,
    setupListeners,
    stopListeners,
    isSaved,
    toggleSaved,
    pickRandomMovie,
  };
});
