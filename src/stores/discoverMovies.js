import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getTrendingMovies,
} from "@/services/tmdb.js";

export const useDiscoverMoviesStore = defineStore("discoverMovies", () => {
  const heroMovies = ref([]);
  const popularMovies = ref([]);
  const topRatedMovies = ref([]);
  const upcomingMovies = ref([]);

  const isLoading = ref(false);
  const isLoadingCategoryMovies = ref(false);
  const isLoadingMoreCategoryMovies = ref(false);

  const selectedCategory = ref(null);
  const categoryTitle = ref("");
  const categoryMovies = ref([]);

  const categoryCurrentPage = ref(1);
  const categoryTotalPages = ref(1);

  async function loadDiscover() {
    if (popularMovies.value.length > 0) return;

    try {
      isLoading.value = true;

      const [trending, popular, topRated, upcoming] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
      ]);

      heroMovies.value = trending.results.slice(0, 5);
      popularMovies.value = popular.results;
      topRatedMovies.value = topRated.results;
      upcomingMovies.value = upcoming.results;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  function getCategoryFetcher(category) {
    switch (category) {
      case "popular":
        return getPopularMovies;
      case "topRated":
        return getTopRatedMovies;
      case "upcoming":
        return getUpcomingMovies;
      default:
        return getPopularMovies;
    }
  }

  async function selectCategory(categoryKey, title) {
    selectedCategory.value = categoryKey;
    categoryTitle.value = title;
    categoryMovies.value = [];
    categoryCurrentPage.value = 1;

    isLoadingCategoryMovies.value = true;

    try {
      const fetcher = getCategoryFetcher(categoryKey);
      const data = await fetcher(1);

      categoryMovies.value = data.results || [];
      categoryTotalPages.value = data.total_pages || 1;
    } catch (error) {
      console.error("Erro ao buscar filmes da categoria:", error);
    } finally {
      isLoadingCategoryMovies.value = false;
    }
  }

  async function loadMoreCategoryMovies() {
    if (
      isLoadingMoreCategoryMovies.value ||
      categoryCurrentPage.value >= categoryTotalPages.value ||
      !selectedCategory.value
    ) {
      return;
    }

    isLoadingMoreCategoryMovies.value = true;
    const nextPage = categoryCurrentPage.value + 1;

    try {
      const fetcher = getCategoryFetcher(selectedCategory.value);
      const data = await fetcher(nextPage);

      categoryMovies.value = [...categoryMovies.value, ...(data.results || [])];
      categoryCurrentPage.value = nextPage;
    } catch (error) {
      console.error("Erro ao carregar mais filmes da categoria:", error);
    } finally {
      isLoadingMoreCategoryMovies.value = false;
    }
  }

  function clearCategory(){
    selectedCategory.value = null;
    categoryTitle.value = "";
    categoryMovies.value = [];
    categoryCurrentPage.value = 1;
    categoryTotalPages.value = 1;
  }

  return {
    heroMovies,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    isLoading,
    loadDiscover,

    selectedCategory,
    categoryTitle,
    categoryMovies,
    isLoadingCategoryMovies,
    isLoadingMoreCategoryMovies,
    categoryCurrentPage,
    categoryTotalPages,
    selectCategory,
    loadMoreCategoryMovies,
    clearCategory,
  };
});
