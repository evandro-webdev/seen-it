<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";
import { useCollectionFilter } from "@/stores/collectionFilter";

import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const watchedMoviesStore = useWatchedMoviesStore();
const filterStore = useCollectionFilter();

const { sortBy } = storeToRefs(filterStore);

function getMovieTimestamp(movie) {
  return new Date(movie.created_at).getTime();
}

const sortedMovies = computed(() => {
  const list = [...watchedMoviesStore.watchedMovies];
  return list.sort((a, b) => {
    if (sortBy.value === "rating_desc")
      return b.average_rating - a.average_rating;
    if (sortBy.value === "rating_asc")
      return a.average_rating - b.average_rating;
    if (sortBy.value === "date_desc")
      return getMovieTimestamp(b) - getMovieTimestamp(a);
    return 0;
  });
});

onMounted(() => {
  filterStore.resetFilters();
});
</script>

<template>
  <MoviesCollection
    :movies="sortedMovies"
    :is-loading="watchedMoviesStore.isLoading"
    type="watched"
  />
</template>
