import { ref } from "vue";
import { defineStore } from "pinia";
import { getMovie } from "@/services/tmdb.js";

import { useWatchedMoviesStore } from "./watchedMovies.js";
import { useSavedMoviesStore } from "./savedMovies.js";

export const useMovieDetailsStore = defineStore("movieDetails", () => {
  const selectedMovie = ref(null);
  const isLoading = ref(false);
  const isModalOpen = ref(false);

  async function openMovie(id) {
    isLoading.value = true;

    try {
      const tmdbData = await getMovie(id);

      const watchedStore = useWatchedMoviesStore();
      const savedStore = useSavedMoviesStore();

      const localWatched = watchedStore.watchedMovies.find(
        (m) => String(m.id) === String(id),
      );

      const localSaved = savedStore.savedMovies.find(
        (m) => String(m.id) === String(id),
      );

      let mergedMovie = { ...tmdbData };

      if (localSaved) {
        mergedMovie = {
          ...mergedMovie,
          ...localSaved,
        };
      }

      if (localWatched) {
        mergedMovie = {
          ...mergedMovie,
          ...localWatched,
        };
      }

      selectedMovie.value = mergedMovie;
    } catch (error) {
      console.error("Erro ao carregar detalhes do filme:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function openModal(id) {
    await openMovie(id);
    isModalOpen.value = true;
  }

  function closeModal() {
    selectedMovie.value = null;
    isModalOpen.value = false;
  }

  return {
    selectedMovie,
    isLoading,
    isModalOpen,
    openMovie,
    openModal,
    closeModal,
  };
});
