<script setup>
import { ref, computed } from "vue";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";

import { Play, ChevronDown } from "@lucide/vue";

const movieDetailsStore = useMovieDetailsStore();
const movie = computed(() => movieDetailsStore.selectedMovie);

const isOpen = ref(false);
</script>

<template>
  <div
    v-if="movie?.trailerKey"
    class="my-4"
  >
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="w-full py-1 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <div
          class="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
        >
          <Play class="w-4 h-4 fill-current" />
        </div>
        <span>Trailer Oficial</span>
      </div>

      <ChevronDown
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="mt-3"
    >
      <div
        class="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg"
      >
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${movie.trailerKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`"
          title="Trailer do filme"
          class="w-full h-full border-0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>
