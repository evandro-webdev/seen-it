<script setup>
import { computed, onMounted } from "vue";
import { useSavedMoviesStore } from "@/stores/savedMovies.js";
import { useCollectionFilter } from "@/stores/collectionFilter";

import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const savedMoviesStore = useSavedMoviesStore();
const filterStore = useCollectionFilter();

const sortedMovies = computed(() => {
  return [...savedMoviesStore.savedMovies].sort(
    (a, b) => b.vote_average - a.vote_average,
  );
});

onMounted(() => {
  filterStore.resetFilters();
});
</script>

<template>
  <MoviesCollection
    :movies="sortedMovies"
    :is-loading="savedMoviesStore.isLoading"
    type="saved"
  />
</template>
