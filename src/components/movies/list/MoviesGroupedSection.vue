<script setup>
import { storeToRefs } from "pinia";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";
import { useCollectionFilter } from "@/stores/collectionFilter.js";
import { getUserColor } from "@/constants/colors.js";

import MovieCard from "../cards/MovieCard.vue";

defineProps({
  activeGroupSections: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ["saved", "watched"].includes(value),
  },
  gridClass: {
    type: String,
    required: true,
  },
});

const movieDetailsStore = useMovieDetailsStore();
const filterStore = useCollectionFilter();

const { groupBy } = storeToRefs(filterStore);
</script>

<template>
  <div class="space-y-6">
    <section
      v-for="section in activeGroupSections"
      :key="section.id || section.title"
      class="space-y-3"
    >
      <div
        class="pb-2 border-b border-gray-100 dark:border-gray-800/60 flex items-center gap-2"
      >
        <span
          v-if="section.userColor"
          class="w-3 h-3 rounded-full shrink-0"
          :style="{ backgroundColor: getUserColor(section.userColor).primary }"
        ></span>

        <h2 class="font-bold text-sm text-[#10355E] dark:text-[#B0D5FE]">
          {{ section.title }}
        </h2>
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
          ({{ section.movies.length }})
        </span>
      </div>

      <div :class="gridClass">
        <MovieCard
          v-for="movie in section.movies"
          @click="movieDetailsStore.openModal(movie.id)"
          :key="movie.id"
          :movie="movie"
          :show-user-color="type === 'saved' || groupBy === 'members'"
        />
      </div>
    </section>
  </div>
</template>
