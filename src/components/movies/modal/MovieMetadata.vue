<script setup>
import { ref } from "vue";
import MovieGenre from "../ui/MovieGenre.vue";
import { formatRuntime, truncateText } from "@/utils/formatters.js";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const showFullOverview = ref(false);
</script>

<template>
  <div>
    <div
      class="mt-2 mb-4 text-xs text-[#5E5E5E] dark:text-white flex items-center flex-wrap gap-2"
    >
      <div class="flex gap-2">
        <MovieGenre
          v-for="genre in movie.genres"
          :key="genre.id"
          :genre="genre.name"
        />
      </div>
      <span>·</span>
      <span>{{ movie.release_date.slice(0, 4) }}</span>
      <span>·</span>
      <span>{{ formatRuntime(movie.runtime) }}</span>
    </div>

    <div>
      <p
        class="text-[16px] text-[#8C8C8C] dark:text-gray-200 font-light leading-[20px]"
      >
        {{
          showFullOverview ? movie.overview : truncateText(movie.overview, 250)
        }}
      </p>

      <button
        v-if="movie.overview?.length > 250"
        @click="showFullOverview = !showFullOverview"
        class="mt-1 text-sm text-[#0088FF]"
      >
        {{ showFullOverview ? "Ler menos" : "Ler mais" }}
      </button>
    </div>
  </div>
</template>
