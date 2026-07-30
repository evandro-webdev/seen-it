<script setup>
import { computed } from "vue";
import { useSavedMoviesStore } from "@/stores/savedMovies.js";
import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

const savedMoviesStore = useSavedMoviesStore();

defineEmits(["open-movie-modal"]);

const sortedMovies = computed(() => {
  return [...savedMoviesStore.savedMovies].sort(
    (a, b) => b.vote_average - a.vote_average,
  );
});

</script>

<template>
  <MoviesCollection
    :movies="sortedMovies"
    :group-by-member="true"
    @open-movie-modal="$emit('open-movie-modal', $event)"
    type="saved"
  />
</template>
