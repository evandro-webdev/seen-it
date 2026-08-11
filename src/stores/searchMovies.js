import { defineStore } from "pinia";
import { ref } from "vue";
import { getMovieWithCredits, searchMovies } from "@/services/tmdb.js";

export const useSearchMoviesStore = defineStore("searchMovies", () => {
  const searchResults = ref([]);
  const isSearching = ref(false);

  const currentPage = ref(1);
  const totalPages = ref(1);
  const lastQuery = ref("");
  
  const isLoading = ref(false);
  const isLoadingMore = ref(false);

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

      const moviesWithCredits = await Promise.all(
        data.results.map((movie) =>
          getMovieWithCredits(movie.id).catch(() => null),
        ),
      );

      searchResults.value = moviesWithCredits.filter(Boolean);
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
        data.results.map((movie) =>
          getMovieWithCredits(movie.id).catch(() => null),
        ),
      );

      const validNewMovies = newMovies.filter(Boolean);
      searchResults.value = [...searchResults.value, ...validNewMovies];
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
    searchForMovies,
    isSearching,
    isLoading,
    clearSearch,
    currentPage,
    totalPages,
    isLoadingMore,
    loadMoreMovies,
  };
});
