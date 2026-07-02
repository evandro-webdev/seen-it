import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getMovieWithCredits,
  getMovie,
  searchMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/services/tmdb.js";

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
  };
});
