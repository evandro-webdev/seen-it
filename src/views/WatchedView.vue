<script setup>
import { watch, computed } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";
import { useAuthStore } from "@/stores/auth.js";

import MoviesCollection from "@/components/movies/MoviesCollection.vue";

const authStore = useAuthStore();
const watchedMoviesStore = useWatchedMoviesStore();

defineEmits(["open-movie-modal"]);

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      watchedMoviesStore.loadWatchedMovies();
    }
  },
  { immediate: true },
);

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
  />
</template>
