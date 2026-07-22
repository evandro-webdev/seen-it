<script setup>
import { computed } from "vue";
import { Star } from "@lucide/vue"; // ou de onde importar o ícone Star
import { formatRating } from "@/utils/formatters";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
});

const posterUrl = computed(() => {
  if (props.movie?.poster_path) {
    return `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`;
  }
  return null;
});

const rating = computed(() => {
  const val = props.movie?.average_rating ?? props.movie?.vote_average;
  return val ? formatRating(val) : null;
});
</script>

<template>
  <div
    class="group space-y-1.5 overflow-hidden cursor-pointer flex flex-col transition-transform duration-200 active:scale-95 select-none"
    :class="fixedWidth ? 'w-[125px] sm:w-[140px] shrink-0' : 'w-full'"
  >
    <div
      class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#161f30]"
    >
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="movie.title"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center p-2 text-center text-gray-400 bg-gray-100 dark:bg-[#161f30]"
      >
        <span
          class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-2"
        >
          {{ movie.title }}
        </span>
      </div>

      <div
        v-if="rating"
        class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white bg-gradient-to-r from-[#194476] to-[#215DA2] shadow-md  flex items-center gap-1 backdrop-blur-xs"
      >
        <Star class="w-2.5 h-2.5 fill-white text-white" />
        <span>{{ rating }}</span>
      </div>
    </div>

    <div class="pt-0.5">
      <h3
        class="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-1 group-hover:text-[#0088FF] transition-colors"
        :title="movie.title"
      >
        {{ movie.title }}
      </h3>
    </div>
  </div>
</template>
