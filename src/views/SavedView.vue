<script setup>
import { computed, ref } from "vue";
import { useSavedMoviesStore } from "@/stores/savedMovies.js";

import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const savedMoviesStore = useSavedMoviesStore();

const currentGroupBy = ref("none");

const sortedMovies = computed(() => {
  return [...savedMoviesStore.savedMovies].sort(
    (a, b) => b.vote_average - a.vote_average,
  );
});
</script>

<template>
  <MoviesCollection
    :movies="sortedMovies"
    :is-loading="savedMoviesStore.isLoading"
    v-model:group-by="currentGroupBy"
    type="saved"
  />
</template>
