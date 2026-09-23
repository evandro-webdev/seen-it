<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useDiscoverMoviesStore } from "@/stores/discoverMovies.js";
import { useSearchMoviesStore } from "@/stores/searchMovies.js";
import { useGenreMoviesStore } from "@/stores/genreMovies.js";
import { useOnline } from "@vueuse/core";

import SearchBar from "@/components/movies/SearchBar.vue";
import MovieGenrePill from "@/components/movies/ui/MovieGenrePill.vue";
import DiscoverHomeSection from "@/components/movies/discover/DiscoverHomeSection.vue";
import MoviesSearchResults from "@/components/movies/discover/MoviesSearchResults.vue";
import MoviesGrid from "@/components/movies/list/MoviesGrid.vue";
import NotInternetConnection from "@/components/movies/ui/messages/NotInternetConnection.vue";

const discoverMoviesStore = useDiscoverMoviesStore();
const searchMoviesStore = useSearchMoviesStore();
const genreMoviesStore = useGenreMoviesStore();

const searchQuery = ref("");

const isOnline = useOnline();

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
});

onUnmounted(() => {
  searchQuery.value = "";
  searchMoviesStore.clearSearch();
  window.removeEventListener("scroll", handleScroll);
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
      />
    </div>

    <NotInternetConnection v-if="!isOnline" />

    <div
      v-else
      class="h-full pt-2 flex flex-col"
    >
      <MoviesSearchResults
        v-if="searchMoviesStore.isSearching"
        :search-query="searchQuery"
        @clear-search="clearSearch"
      />

      <MoviesGrid
        v-else-if="genreMoviesStore.selectedGenreId"
        :title="genreMoviesStore.genreTitle"
        :movies="genreMoviesStore.genreMovies"
        :is-loading="genreMoviesStore.isLoadingGenreMovies"
        :is-loading-more="genreMoviesStore.isLoadingMoreGenreMovies"
      />

      <MoviesGrid
        v-else-if="discoverMoviesStore.selectedCategory"
        :title="discoverMoviesStore.categoryTitle"
        :movies="discoverMoviesStore.categoryMovies"
        :is-loading="discoverMoviesStore.isLoadingCategoryMovies"
        :is-loading-more="discoverMoviesStore.isLoadingMoreCategoryMovies"
        show-back-button
        @back="discoverMoviesStore.clearCategory()"
      />

      <DiscoverHomeSection v-else />
    </div>
  </div>
</template>
