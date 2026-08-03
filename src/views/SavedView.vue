<script setup>
import { computed } from "vue";
import { useSavedMoviesStore } from "@/stores/savedMovies.js";
import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const savedMoviesStore = useSavedMoviesStore();

const emit = defineEmits(["open-movie-modal"]);

const sortedMovies = computed(() => {
  return [...savedMoviesStore.savedMovies].sort(
    (a, b) => b.vote_average - a.vote_average,
  );
});

function pickRandomMovie() {
  const movies = savedMoviesStore.savedMovies;
  if (!movies || movies.length === 0) return;

  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];

  emit("open-movie-modal", randomMovie.id);
}

</script>

<template>
  <MoviesCollection
    :movies="sortedMovies"
    :is-loading="savedMoviesStore.isLoading"
    :group-by-member="true"
    @open-movie-modal="$emit('open-movie-modal', $event)"
    @pick-random="pickRandomMovie"
    type="saved"
  />
</template>
