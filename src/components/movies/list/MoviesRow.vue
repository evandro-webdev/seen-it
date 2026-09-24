<script setup>
import { useMovieDetailsStore } from "@/stores/movieDetails.js";
import { useDiscoverMoviesStore } from "@/stores/discoverMovies.js";
import { useScrollMask } from "@/composables/useScrollMask.js";

import MovieCard from "../cards/MovieCard.vue";
import MovieCardSkeleton from "../cards/MovieCardSkeleton.vue";

const props = defineProps({
  icon: {
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    default: "",
  },
  upcoming: {
    type: Boolean,
    default: false,
  },
});

const movieDetailsStore = useMovieDetailsStore();
const discoverMoviesStore = useDiscoverMoviesStore();

const { scrollContainer, showRightGradient, checkScrollPosition } =
  useScrollMask(() => props.movies);

function handleSeeAllMovies() {
  discoverMoviesStore.selectCategory(props.category, props.title);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div v-if="discoverMoviesStore.isLoading || movies.length > 0">
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
      <button
        @click="handleSeeAllMovies"
        class="text-xs font-semibold text-[#0088FF]"
      >
        Ver todos
      </button>
    </div>

    <div
      ref="scrollContainer"
      @scroll="checkScrollPosition"
      class="-mr-4 pr-4 flex gap-x-3 overflow-x-auto scrollbar-none snap-x snap-mandatory transition-all duration-300"
      :class="[showRightGradient ? 'mask-right' : '']"
    >
      <template v-if="discoverMoviesStore.isLoading">
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
          @click="movieDetailsStore.openModal(movie.id)"
          fixed-width
          :releaseDate="upcoming ? movie.release_date : null"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.mask-right {
  mask-image: linear-gradient(to left, transparent 0%, black 24px);
}
</style>
