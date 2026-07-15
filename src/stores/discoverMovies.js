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
  const isLoading = ref(false);

  async function loadDiscover() {
    if (popularMovies.value.length > 0) return;

    try {
      isLoading.value = true;

      const [popular, topRated, upcoming] = await Promise.all([
        getPopularMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
      ]);

      popularMovies.value = popular.results;
      topRatedMovies.value = topRated.results;
      upcomingMovies.value = upcoming.results;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function searchForMovies(query) {
    if (!query.trim()) return;

    searchResults.value = [];
    isSearching.value = true;
    isLoading.value = true;

    try {
      const data = await searchMovies(query);

      searchResults.value = await Promise.all(
        data.results.map((movie) => getMovieWithCredits(movie.id)),
      );
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      isLoading.value = false;
    }
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
    isLoading,
    clearSearch,
    loadDiscover,
  };
});
