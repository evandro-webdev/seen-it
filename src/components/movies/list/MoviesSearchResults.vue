<script setup>
import { computed } from "vue";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";
import { useSearchMoviesStore } from "@/stores/searchMovies.js";

import MovieCardDetailed from "../cards/MovieCardDetailed.vue";
import MovieSearchEmpty from "../ui/messages/MovieSearchEmpty.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["clear-search"]);

const movieDetailsStore = useMovieDetailsStore();
const searchMoviesStore = useSearchMoviesStore();

const searchResults = computed(() => searchMoviesStore.searchResults);
</script>

<template>
  <div class="space-y-4">
    <LoadingSpinner
      v-if="searchMoviesStore.isLoading"
      full-screen
    />

    <template v-else>
      <MovieSearchEmpty
        v-if="searchResults.length === 0"
        :search-query="searchQuery"
        @clear="emit('clear-search')"
      />

      <MovieCardDetailed
        v-else
        v-for="movie in searchResults"
        :key="movie.id"
        :movie="movie"
        @click="movieDetailsStore.openModal(movie.id)"
      />

      <LoadingSpinner
        v-if="searchMoviesStore.isLoadingMore"
        size="sm"
      />
    </template>
  </div>
</template>
