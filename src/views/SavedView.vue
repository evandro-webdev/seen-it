<script setup>
import { watch, computed } from "vue";
import { useSavedMoviesStore } from "../stores/savedMovies.js";
import { useAuthStore } from "../stores/auth.js";

import MoviesCollection from "@/components/movies/MoviesCollection.vue";

const authStore = useAuthStore();
const savedMoviesStore = useSavedMoviesStore();

defineEmits(["open-movie-modal"]);

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      savedMoviesStore.loadSavedMovies();
    }
  },
  { immediate: true },
);

const sortedMovies = computed(() => {
  return [...savedMoviesStore.savedMovies].sort(
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