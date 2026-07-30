<script setup>
import { computed } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";

import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const watchedMoviesStore = useWatchedMoviesStore();

defineEmits(["open-movie-modal"]);

const sortedMovies = computed(() => {
  return [...watchedMoviesStore.watchedMovies].sort(
    (a, b) => b.average_rating - a.average_rating,
  );
});
</script>

<template>
  <MoviesCollection
    :movies="sortedMovies"
    @open-movie-modal="$emit('open-movie-modal', $event)"
    type="watched"
  />
</template>
