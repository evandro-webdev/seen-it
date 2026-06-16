<script setup>
import { Star } from "@lucide/vue";
import { formatRating } from "@/utils/formatters";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="space-y-1 overflow-hidden cursor-pointer flex flex-col"
    :class="{ 'max-w-[140px]': fixedWidth }"
  >
    <div class="relative w-full aspect-[185/280] rounded-lg overflow-hidden">
      <div class="skeleton absolute inset-0 bg-gray-300 animate-pulse"></div>
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        :alt="movie.title"
        class="poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
        onload="
          this.classList.add('opacity-100');
          this.previousElementSibling.remove();
        "
        onerror="this.src = '../img/placeholder.jpg'"
      />
      <div
        class="absolute top-2 right-2 p-[4px] rounded-md text-xs font-medium text-white bg-linear-to-t from-[#194476] to-[#215DA2] flex items-center gap-1"
      >
        <Star
          class="w-[10px] h-[10px]"
          fill="white"
        />
        <span class="text-[10px] font-medium">{{
          movie.average_rating ? formatRating(movie.average_rating) : formatRating(movie.vote_average)
        }}</span>
      </div>
    </div>
    <div class="h-5 max-w-[160px]">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-white truncate">
        {{ movie.title }}
      </h3>
    </div>
  </div>
</template>
