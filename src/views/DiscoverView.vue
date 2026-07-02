<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useDiscoverMoviesStore } from "../stores/discoverMovies.js";
import { Flame, Award, Clapperboard } from "@lucide/vue";

import SearchBar from "../components/layout/SearchBar.vue";
import MovieCardDetailed from "../components/movies/MovieCardDetailed.vue";
import MoviesList from "../components/movies/MoviesList.vue";

defineEmits(["open-movie-modal"]);

const discoverMoviesStore = useDiscoverMoviesStore();
const searchQuery = ref("");

onMounted(() => {
  discoverMoviesStore.loadDiscover();
});

onUnmounted(() => {
  searchQuery.value = "";
  discoverMoviesStore.isSearching = false;
  discoverMoviesStore.searchResults = [];
});

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    discoverMoviesStore.isSearching = false;
  }
});
</script>

<template>
  <div>
    <div class="py-2 px-4 lg:py-14 mb-2 space-y-3">
      <SearchBar
        v-model="searchQuery"
        current-tab="discover"
        @search="discoverMoviesStore.searchForMovies(searchQuery)"
      />

      <div
        v-if="discoverMoviesStore.isSearching"
        class="flex justify-end items-center"
      >
        <span class="block text-xs text-gray-600 dark:text-gray-300">
          {{ discoverMoviesStore.searchResults.length }} filmes encontrados
        </span>
      </div>
    </div>

    <div class="h-[100%] pt-2 px-4 flex flex-col">
      <div
        v-if="!discoverMoviesStore.isSearching || !searchQuery"
        class="space-y-6"
      >
        <MoviesList
          :icon="Flame"
          title="Mais vistos do momento"
          :movies="discoverMoviesStore.popularMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
        />
        <MoviesList
          :icon="Award"
          title="Melhores avaliados"
          :movies="discoverMoviesStore.topRatedMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
        />
        <MoviesList
          :icon="Clapperboard"
          title="Mais esperados"
          :movies="discoverMoviesStore.upcomingMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
        />
      </div>

      <div
        v-if="discoverMoviesStore.isSearching"
        class="space-y-4"
      >
        <MovieCardDetailed
          v-for="movie in discoverMoviesStore.searchResults"
          :key="movie.id"
          :movie="movie"
          @click="$emit('open-movie-modal', movie.id)"
        />
      </div>
    </div>
  </div>
</template>
