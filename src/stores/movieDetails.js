import { ref } from "vue";
import { defineStore } from "pinia";
import { getMovie } from "@/services/tmdb.js";

import { useWatchedMoviesStore } from "./watchedMovies.js";
import { useSavedMoviesStore } from "./savedMovies.js";

export const useMovieDetailsStore = defineStore("movieDetails", () => {
  const selectedMovie = ref(null);
  const isLoading = ref(false);

  async function openMovie(id, currentRoute) {
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

      if (currentRoute === "watched" && localWatched) {
        selectedMovie.value = { ...localWatched, ...tmdbData };
      } else if (currentRoute === "saved" && localSaved) {
        selectedMovie.value = { ...localSaved, ...tmdbData };
      } else if (watchedStore.isAlreadyWatched(id) && localWatched) {
        selectedMovie.value = { ...localWatched, ...tmdbData };
      } else {
        selectedMovie.value = tmdbData;
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do filme:", error);
    } finally {
      isLoading.value = false;
    }
  }

  function closeMovie() {
    selectedMovie.value = null;
  }

  return {
    selectedMovie,
    isLoading,
    openMovie,
    closeMovie,
  };
});
