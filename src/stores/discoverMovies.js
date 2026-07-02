import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getMovieWithCredits,
  getMovie,
  searchMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../services/tmdb.js";

import { useWatchedMoviesStore } from "./watchedMovies.js";

export const useDiscoverMoviesStore = defineStore("discoverMovies", () => {
  const searchResults = ref([]);
  const popularMovies = ref([]);
  const topRatedMovies = ref([]);
  const upcomingMovies = ref([]);
  const isSearching = ref(false);

  async function loadDiscover() {
    const [popular, topRated, upcoming] = await Promise.all([
      getPopularMovies(),
      getTopRatedMovies(),
      getUpcomingMovies(),
    ]);

    popularMovies.value = popular.results;
    topRatedMovies.value = topRated.results;
    upcomingMovies.value = upcoming.results;
  }

  async function loadDetailedMovie(id) {
    const watchedMoviesStore = useWatchedMoviesStore();

    const tmdbData = await getMovie(id);

    if (watchedMoviesStore.isAlreadyWatched(id)) {
      const watchedEntry = watchedMoviesStore.watchedMovies.find(
        (m) => String(m.id) === String(id),
      );

      return {
        ...watchedEntry,
        ...tmdbData
      }
    }


    return tmdbData;
  }

  async function searchForMovies(query) {
    searchResults.value = [];
    isSearching.value = true;
    const data = await searchMovies(query);

    searchResults.value = await Promise.all(
      data.results.map((movie) => getMovieWithCredits(movie.id)),
    );
  }

  function clearSearch() {
    isSearching.value = false;
    searchResults.value = [];
  }

  return {
    searchResults,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    searchForMovies,
    isSearching,
    clearSearch,
    loadDiscover,
    loadDetailedMovie,
  };
});
