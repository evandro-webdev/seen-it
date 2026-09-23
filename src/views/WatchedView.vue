<script setup>
import { computed, ref } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";

import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const watchedMoviesStore = useWatchedMoviesStore();

const currentSort = ref("rating_desc");
const currentGroupBy = ref("none");

function getMovieTimestamp(movie) {
  return new Date(movie.created_at).getTime();
}

const sortedMovies = computed(() => {
  const list = [...watchedMoviesStore.watchedMovies];
  return list.sort((a, b) => {
    if (currentSort.value === "rating_desc")
      return b.average_rating - a.average_rating;
    if (currentSort.value === "rating_asc")
      return a.average_rating - b.average_rating;
    if (currentSort.value === "date_desc")
      return getMovieTimestamp(b) - getMovieTimestamp(a);
    return 0;
  });
});
</script>

<template>
  <MoviesCollection
    type="watched"
    :movies="sortedMovies"
    :is-loading="watchedMoviesStore.isLoading"
    v-model:sort-by="currentSort"
    v-model:group-by="currentGroupBy"
  />
</template>
