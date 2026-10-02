<script setup>
import { useAuthStore } from "@/stores/auth";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";

import MovieCard from "../cards/MovieCard.vue";

defineProps({
  movies: {
    type: Array,
    required: true,
  },
  gridClass: {
    type: String,
    required: true,
  },
});

const authStore = useAuthStore();
const movieDetailsStore = useMovieDetailsStore();
</script>

<template>
  <section
    class="mb-6 pb-6 space-y-3 border-b border-gray-100 dark:border-gray-800/60"
  >
    <div class="flex items-center gap-2">
      <span
        class="w-2.5 h-2.5 rounded-full bg-[#10355E] dark:bg-[#B0D5FE] animate-pulse"
      ></span>
      <h2 class="text-base font-semibold text-[#10355E] dark:text-[#B0D5FE]">
        {{ authStore.user?.name }}, você ainda não avaliou:
      </h2>
    </div>

    <div :class="gridClass">
      <MovieCard
        v-for="movie in movies"
        @click="movieDetailsStore.openModal(movie.id)"
        :key="movie.id"
        :movie="movie"
      />
    </div>
  </section>
</template>
