<script setup>
import { watch, computed } from "vue";
import { useWatchedMoviesStore } from "@/stores/watchedMovies.js";
import { useAuthStore } from "@/stores/auth.js";

import MoviesCollection from "@/components/movies/list/MoviesCollection.vue";

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

// const sortedMovies = computed(() => {
//   return [...watchedMoviesStore.watchedMovies].sort(
//     (a, b) => b.average_rating - a.average_rating,
//   );
// });

//função temporária para avaliar os que não foram avaliados
const sortedWatchedMovies = computed(() => {
  const currentUid = authStore.user?.uid;
  if (!currentUid) return watchedMoviesStore.watchedMovies;

  return [...watchedMoviesStore.watchedMovies].sort((a, b) => {
    const hasMyReviewA = Boolean(a.reviews && a.reviews[currentUid]);
    const hasMyReviewB = Boolean(b.reviews && b.reviews[currentUid]);

    if (!hasMyReviewA && hasMyReviewB) return -1;
    if (hasMyReviewA && !hasMyReviewB) return 1;

    const dateA = new Date(a.updated_at || a.created_at || 0);
    const dateB = new Date(b.updated_at || b.created_at || 0);
    return dateB - dateA;
  });
});
</script>

<template>
  <MoviesCollection
    :movies="sortedWatchedMovies"
    @open-movie-modal="$emit('open-movie-modal', $event)"
    type="watched"
  />
</template>
