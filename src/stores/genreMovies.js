import { defineStore } from "pinia";
import { ref } from "vue";
import { getGenres, getMoviesByGenre } from "@/services/tmdb.js";

export const useGenreMoviesStore = defineStore("genreMovies", () => {
  const genres = ref([]);
  const selectedGenreId = ref(null);
  const genreMovies = ref([]);

  const currentPage = ref(1);
  const totalPages = ref(1);

  const isLoadingGenres = ref(false);
  const isLoadingGenreMovies = ref(false);
  const isLoadingMoreGenreMovies = ref(false);

  async function loadGenres() {
    if (genres.value.length > 0) return;

    try {
      isLoadingGenres.value = true;
      const genresData = await getGenres();

      genres.value = genresData.genres || [];
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingGenres.value = false;
    }
  }

  async function selectGenre(genreId) {
    if (selectedGenreId.value === genreId) {
      selectedGenreId.value = null;
      genreMovies.value = [];
      currentPage.value = 1;
      totalPages.value = 1;
      return;
    }

    selectedGenreId.value = genreId;
    currentPage.value = 1;
    isLoadingGenreMovies.value = true;

    try {
      const data = await getMoviesByGenre(genreId, 1);
      genreMovies.value = data.results || [];
      totalPages.value = data.total_pages || 1;
    } catch (error) {
      console.error("Erro ao buscar filmes por gênero:", error);
    } finally {
      isLoadingGenreMovies.value = false;
    }
  }

  async function loadMoreGenreMovies() {
    if (
      isLoadingMoreGenreMovies.value ||
      currentPage.value >= totalPages.value ||
      !selectedGenreId.value
    ) {
      return;
    }

    isLoadingMoreGenreMovies.value = true;
    const nextPage = currentPage.value + 1;

    try {
      const data = await getMoviesByGenre(selectedGenreId.value, nextPage);

      const newMovies = data.results || [];

      genreMovies.value = [...genreMovies.value, ...newMovies];
      currentPage.value = nextPage;
    } catch (error) {
      console.error("Erro ao carregar mais filmes do gênero:", error);
    } finally {
      isLoadingMoreGenreMovies.value = false;
    }
  }

  return {
    genres,
    selectedGenreId,
    genreMovies,
    isLoadingGenres,
    isLoadingGenreMovies,
    isLoadingMoreGenreMovies,
    loadGenres,
    selectGenre,
    loadMoreGenreMovies,
  };
});
