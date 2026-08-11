<script setup>
import { computed, ref } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";
import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const watchedMoviesStore = useWatchedMoviesStore();

const currentSort = ref("rating_desc");
const currentGroupBy = ref("none");

function getMovieTimestamp(movie) {
  const rawDate = movie.created_at || movie.watched_at || movie.added_at;
  if (!rawDate) return 0;
  if (typeof rawDate.toDate === "function") return rawDate.toDate().getTime();
  if (rawDate.seconds) return rawDate.seconds * 1000;
  return new Date(rawDate).getTime() || 0;
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
    :movies="sortedMovies"
    :is-loading="watchedMoviesStore.isLoading"
    type="watched"
    v-model:sort-by="currentSort"
    v-model:group-by="currentGroupBy"
    @open-movie-modal="$emit('open-movie-modal', $event)"
  />
</template>
