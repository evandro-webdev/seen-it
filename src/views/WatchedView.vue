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

function get5YearRange(year) {
  if (!year || isNaN(year)) return "Ano desconhecido";
  const startYear = Math.floor(year / 5) * 5;
  const endYear = startYear + 4;
  return `${startYear} - ${endYear}`;
}

const activeSections = computed(() => {
  if (currentGroupBy.value !== "5years") return [];

  const groups = {};
  sortedMovies.value.forEach((movie) => {
    const releaseYear = movie.release_date
      ? parseInt(movie.release_date.slice(0, 4), 10)
      : null;
    const rangeLabel = get5YearRange(releaseYear);

    if (!groups[rangeLabel]) {
      groups[rangeLabel] = {
        title: rangeLabel,
        sortKey:
          releaseYear && !isNaN(releaseYear)
            ? Math.floor(releaseYear / 5) * 5
            : -1,
        movies: [],
      };
    }
    groups[rangeLabel].movies.push(movie);
  });

  return Object.values(groups).sort((a, b) => b.sortKey - a.sortKey);
});
</script>

<template>
  <MoviesCollection
    :movies="sortedMovies"
    :custom-sections="activeSections"
    :is-loading="watchedMoviesStore.isLoading"
    type="watched"
    v-model:sort-by="currentSort"
    v-model:group-by="currentGroupBy"
    @open-movie-modal="$emit('open-movie-modal', $event)"
  />
</template>
