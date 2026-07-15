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
  discoverMoviesStore.clearSearch();
});

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    discoverMoviesStore.clearSearch();
  }
});
</script>

<template>
  <div>
    <div class="py-2 px-4 lg:py-14 space-y-3">
      <SearchBar
        v-model="searchQuery"
        current-tab="discover"
        @search="discoverMoviesStore.searchForMovies(searchQuery)"
      />

      <div
        v-if="discoverMoviesStore.isSearching && !discoverMoviesStore.isLoading"
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
          :loading="discoverMoviesStore.isLoading"
        />
        <MoviesList
          :icon="Award"
          title="Melhores avaliados"
          :movies="discoverMoviesStore.topRatedMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          :loading="discoverMoviesStore.isLoading"
        />
        <MoviesList
          :icon="Clapperboard"
          title="Mais esperados"
          :movies="discoverMoviesStore.upcomingMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          :loading="discoverMoviesStore.isLoading"
        />
      </div>

      <div
        v-if="discoverMoviesStore.isSearching"
        class="space-y-4"
      >
        <div
          v-if="discoverMoviesStore.isLoading"
          class="absolute inset-0 flex items-center justify-center bg-transparent"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0088FF]"
          ></div>
        </div>

        <template v-else>
          <div
            v-if="discoverMoviesStore.searchResults.length === 0"
            class="text-center py-12 text-gray-500"
          >
            Nenhum filme encontrado para "{{ searchQuery }}".
          </div>

          <MovieCardDetailed
            v-else
            v-for="movie in discoverMoviesStore.searchResults"
            :key="movie.id"
            :movie="movie"
            @click="$emit('open-movie-modal', movie.id)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
