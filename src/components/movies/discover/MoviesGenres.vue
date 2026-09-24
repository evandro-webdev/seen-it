<script setup>
import { useGenreMoviesStore } from "@/stores/genreMovies";
import { useScrollMask } from "@/composables/useScrollMask";

const genreMoviesStore = useGenreMoviesStore();

const {
  scrollContainer,
  showLeftGradient,
  showRightGradient,
  checkScrollPosition,
} = useScrollMask(() => genreMoviesStore.genres);
</script>

<template>
  <div
    ref="scrollContainer"
    @scroll="checkScrollPosition"
    class="w-full flex items-center gap-2 overflow-x-auto scrollbar-none transition-all duration-300"
    :class="[
      showLeftGradient && showRightGradient ? 'mask-both' : '',
      showLeftGradient && !showRightGradient ? 'mask-left' : '',
      !showLeftGradient && showRightGradient ? 'mask-right' : '',
    ]"
  >
    <button
      @click="genreMoviesStore.clearGenre"
      type="button"
      class="px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap"
      :class="
        genreMoviesStore.selectedGenreId === null
          ? 'bg-[#0088FF] text-white border-[#0088FF] shadow-xs'
          : 'bg-gray-100 dark:bg-[#161f30] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#242C3C]'
      "
    >
      Tudo
    </button>

    <button
      v-for="genre in genreMoviesStore.genres"
      :key="genre.id"
      @click="genreMoviesStore.selectGenre(genre.id)"
      type="button"
      class="px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0"
      :class="
        genreMoviesStore.selectedGenreId === genre.id
          ? 'bg-[#0088FF] text-white border-[#0088FF] shadow-xs'
          : 'bg-gray-100 dark:bg-[#161f30] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#242C3C]'
      "
    >
      {{ genre.name }}
    </button>
  </div>
</template>

<style scoped>
.mask-left {
  mask-image: linear-gradient(to right, transparent 0%, black 32px);
}

.mask-right {
  mask-image: linear-gradient(to left, transparent 0%, black 32px);
}

.mask-both {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 32px,
    black calc(100% - 32px),
    transparent 100%
  );
}
</style>
