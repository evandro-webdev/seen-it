<script setup>
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
  groupBy: {
    type: String,
    default: "none",
  },
  gridClass: {
    type: String,
  },
});

const emit = defineEmits(["open-movie-modal"]);
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
          :style="{ backgroundColor: section.userColor }"
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
          :key="movie.id"
          :movie="movie"
          @click="$emit('open-movie-modal', movie.id)"
          :show-user-color="type === 'saved' || groupBy === 'members'"
        />
      </div>
    </section>
  </div>
</template>
