<script setup>
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MovieCard from "../cards/MovieCard.vue";
import { ArrowLeft } from "@lucide/vue";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";

defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isLoadingMore: {
    type: Boolean,
    default: false,
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back"]);

const movieDetailsStore = useMovieDetailsStore();
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <button
        v-if="showBackButton"
        @click="emit('back')"
        class="p-1 text-gray-500"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h2 class="font-bold text-[#10355E] dark:text-[#B0D5FE] text-base">
        {{ title }}
      </h2>
    </div>

    <LoadingSpinner
      v-if="isLoading"
      full-screen
    />

    <template v-else>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          @click="movieDetailsStore.openModal(movie.id)"
        />
      </div>

      <LoadingSpinner
        v-if="isLoadingMore"
        size="sm"
      />
    </template>
  </div>
</template>
