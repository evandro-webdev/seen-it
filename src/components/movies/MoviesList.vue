<script setup>
import MovieCardSkeleton from "../ui/MovieCardSkeleton.vue";
import MovieCard from "./MovieCard.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
  icon: {
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["open-movie-modal"]);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-1 items-center">
        <component
          :is="icon"
          class="w-5 h-5 text-[#0088FF]"
        />

        <h2 class="font-bold text-[#10355E] dark:text-[#B0D5FE]">
          {{ title }}
        </h2>
      </div>
      <button class="text-xs font-semibold text-[#0088FF]">Ver todos</button>
    </div>

    <div class="-mr-4 pr-4 flex gap-x-2 overflow-x-auto">
      <template v-if="loading">
        <MovieCardSkeleton
          v-for="n in 4"
          :key="'skeleton-' + n"
          fixed-width
        />
      </template>

      <template v-else>
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          class="flex-shrink-0"
          @click="emit('open-movie-modal', movie.id)"
          fixed-width
        />
      </template>
    </div>
  </div>
</template>
