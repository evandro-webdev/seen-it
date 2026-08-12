<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useDiscoverMoviesStore } from "@/stores/discoverMovies.js";
import { useSearchMoviesStore } from "@/stores/searchMovies.js";
import { useGenreMoviesStore } from "@/stores/genreMovies.js";

import SearchBar from "@/components/layout/SearchBar.vue";
import MovieGenrePill from "@/components/movies/ui/MovieGenrePill.vue";
import NotInternetConnection from "@/components/movies/ui/messages/NotInternetConnection.vue";
import DiscoverHomeSection from "@/components/movies/DiscoverHomeSection.vue";
import MoviesSearchResults from "@/components/movies/list/MoviesSearchResults.vue";
import MoviesGrid from "@/components/movies/list/MoviesGrid.vue";

defineEmits(["open-movie-modal"]);

const discoverMoviesStore = useDiscoverMoviesStore();
const searchMoviesStore = useSearchMoviesStore();
const genreMoviesStore = useGenreMoviesStore();

const searchQuery = ref("");

const isOnline = ref(navigator.onLine);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

function handleScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const clientHeight = window.innerHeight;

  if (scrollHeight - scrollTop - clientHeight >= 200) {
    return;
  }

  if (searchMoviesStore.isSearching) {
    if (searchMoviesStore.isLoading || searchMoviesStore.isLoadingMore) return;

    searchMoviesStore.loadMoreMovies();
    return;
  }

  if (genreMoviesStore.selectedGenreId) {
    if (
      genreMoviesStore.isLoadingGenreMovies ||
      genreMoviesStore.isLoadingMoreGenreMovies
    )
      return;

    genreMoviesStore.loadMoreGenreMovies();
    return;
  }

  if (discoverMoviesStore.selectedCategory) {
    if (
      discoverMoviesStore.isLoadingCategoryMovies ||
      discoverMoviesStore.isLoadingMoreCategoryMovies
    )
      return;
    discoverMoviesStore.loadMoreCategoryMovies();
    return;
  }
}

onMounted(() => {
  discoverMoviesStore.loadDiscover();
  genreMoviesStore.loadGenres();
  window.addEventListener("scroll", handleScroll);

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
});

onUnmounted(() => {
  searchQuery.value = "";
  searchMoviesStore.clearSearch();
  window.removeEventListener("scroll", handleScroll);

  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
});

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    searchMoviesStore.clearSearch();
  }
});

function clearSearch() {
  searchQuery.value = "";
}
</script>

<template>
  <div>
    <div class="py-2 lg:py-14 space-y-3">
      <SearchBar
        v-model="searchQuery"
        current-tab="discover"
        @search="searchMoviesStore.searchForMovies(searchQuery)"
      />

      <div
        v-if="searchMoviesStore.isSearching && !discoverMoviesStore.isLoading"
        class="flex justify-end items-center"
      >
        <span
          v-if="searchMoviesStore.searchResults.length !== 0"
          class="text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          {{ searchMoviesStore.searchResults.length }} filmes encontrados
        </span>
      </div>

      <MovieGenrePill
        v-if="
          !searchMoviesStore.isSearching &&
          !genreMoviesStore.isLoading &&
          isOnline
        "
        :genres="genreMoviesStore.genres"
        :selected-genre-id="genreMoviesStore.selectedGenreId"
        @select-genre="genreMoviesStore.selectGenre"
      />
    </div>

    <NotInternetConnection v-if="!isOnline" />

    <div
      v-else
      class="h-full pt-2 flex flex-col"
    >
      <MoviesSearchResults
        v-if="searchMoviesStore.isSearching"
        :search-results="searchMoviesStore.searchResults"
        :is-loading="searchMoviesStore.isLoading"
        :is-loading-more="searchMoviesStore.isLoadingMore"
        :search-query="searchQuery"
        @open-movie-modal="$emit('open-movie-modal', $event)"
        @clear-search="clearSearch"
      />

      <MoviesGrid
        v-else-if="genreMoviesStore.selectedGenreId"
        :title="`Filmes de ${genreMoviesStore.genres.find((g) => g.id === genreMoviesStore.selectedGenreId)?.name}`"
        :movies="genreMoviesStore.genreMovies"
        :is-loading="genreMoviesStore.isLoadingGenreMovies"
        :is-loading-more="genreMoviesStore.isLoadingMoreGenreMovies"
        @open-movie-modal="$emit('open-movie-modal', $event)"
      />

      <MoviesGrid
        v-else-if="discoverMoviesStore.selectedCategory"
        :title="discoverMoviesStore.categoryTitle"
        :movies="discoverMoviesStore.categoryMovies"
        :is-loading="discoverMoviesStore.isLoadingCategoryMovies"
        :is-loading-more="discoverMoviesStore.isLoadingMoreCategoryMovies"
        show-back-button
        @back="discoverMoviesStore.clearCategory()"
        @open-movie-modal="$emit('open-movie-modal', $event)"
      />

      <DiscoverHomeSection
        v-else
        :hero-movies="discoverMoviesStore.heroMovies"
        :popular-movies="discoverMoviesStore.popularMovies"
        :upcoming-movies="discoverMoviesStore.upcomingMovies"
        :top-rated-movies="discoverMoviesStore.topRatedMovies"
        :is-loading="discoverMoviesStore.isLoading"
        @open-movie-modal="$emit('open-movie-modal', $event)"
        @see-all="discoverMoviesStore.selectCategory"
      />
    </div>
  </div>
</template>
