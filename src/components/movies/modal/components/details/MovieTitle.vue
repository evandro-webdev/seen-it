<script setup>
import { computed } from "vue";
import { useMovieDetailsStore } from "@/stores/movieDetails";

const movieDetailsStore = useMovieDetailsStore();
const movie = computed(() => movieDetailsStore.selectedMovie);
</script>

<template>
  <h2 class="text-3xl font-semibold text-slate-800 dark:text-white">
    {{ movie.title }}
  </h2>
  <!-- <p class="text-[14px] font-light text-[#8C8C8C] dark:text-gray-200">
    {{ movie.tagline }}
  </p> -->
</template>
