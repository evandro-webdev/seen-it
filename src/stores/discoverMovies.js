import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getMovieWithCredits,
  searchMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/services/tmdb.js";

export const useDiscoverMoviesStore = defineStore("discoverMovies", () => {
  const popularMovies = ref([]);
  const topRatedMovies = ref([]);
  const upcomingMovies = ref([]);

  const searchResults = ref([]);
  const isSearching = ref(false);

  const currentPage = ref(1);
  const totalPages = ref(1);
  const lastQuery = ref("");
  const isLoadingMore = ref(false);

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
    currentPage.value = 1;
    totalPages.value = 1;
    lastQuery.value = query;

    isSearching.value = true;
    isLoading.value = true;

    try {
      const data = await searchMovies(query, 1);
      totalPages.value = data.total_pages;

      searchResults.value = await Promise.all(
        data.results.map((movie) => getMovieWithCredits(movie.id)),
      );
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMoreMovies() {
    if (
      isLoadingMore.value ||
      currentPage.value >= totalPages.value ||
      !lastQuery.value
    ) {
      return;
    }

    isLoadingMore.value = true;
    const nextPage = currentPage.value + 1;

    try {
      const data = await searchMovies(lastQuery.value, nextPage);

      const newMovies = await Promise.all(
        data.results.map((movie) => getMovieWithCredits(movie.id)),
      );

      searchResults.value = [...searchResults.value, ...newMovies];
      currentPage.value = nextPage;
    } catch (error) {
      console.error("Erro ao carregar mais filmes:", error);
    } finally {
      isLoadingMore.value = false;
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
    currentPage,
    totalPages,
    isLoadingMore,
    loadMoreMovies,
  };
});
