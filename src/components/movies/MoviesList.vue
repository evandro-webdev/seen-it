<script setup>
import MovieCard from "./components/movies/MovieCard.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-1 items-center">
        <Flame class="w-5 h-5 text-[#0088FF]" />

        <h2 class="font-bold text-[#10355E] dark:text-white">
          {{ title }}
        </h2>
      </div>
      <button class="text-xs font-semibold text-[#0088FF]">Ver todos</button>
    </div>

    <div class="-mr-4 pr-4 flex gap-x-2 overflow-x-auto">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        class="flex-shrink-0"
        @click="async () => await openMovieModal(movie.id)"
      />
    </div>
  </div>
</template>
