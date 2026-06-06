<script setup>
import { Star } from "@lucide/vue";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
//   size: {
//     type: String,
//     default: "md",
//   },
});

// const posterSizes = {
//   sm: "w-[160px]",
//   md: "w-[160px]",
// };
</script>

<template>
  <div class="space-y-1 overflow-hidden cursor-pointer flex flex-col">
    <div
      class="relative w-160px max-w-[160px] aspect-[185/280] rounded-lg overflow-hidden"
    >
      <div class="skeleton absolute inset-0 bg-gray-300 animate-pulse"></div>
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        :alt="movie.title"
        class="poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
        onload="
          this.classList.add('opacity-100');
          this.previousElementSibling.remove();
        "
      />
      <div
        class="absolute top-2 right-2 p-[4px] rounded-md text-xs font-medium text-white bg-linear-to-t from-[#194476] to-[#215DA2] flex items-center gap-1"
      >
        <Star
          class="w-[10px] h-[10px]"
          fill="white"
        />
        <span class="text-[10px] font-medium">{{
          movie.average_rating ?? movie.vote_average.toFixed(1)
        }}</span>
      </div>
    </div>
    <div class="h-[8%] max-w-[160px]">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-white truncate">
        {{ movie.title }}
      </h3>
    </div>
  </div>
</template>
