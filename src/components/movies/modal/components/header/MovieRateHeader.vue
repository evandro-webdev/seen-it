<script setup>
import { computed } from "vue";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";

import { ArrowLeft } from "@lucide/vue";

import BaseButton from "@/components/ui/BaseButton.vue";

const movieDetailsStore = useMovieDetailsStore();
const movie = computed(() => movieDetailsStore.selectedMovie);
</script>

<template>
  <div
    class="p-4 border-b border-gray-100 dark:border-[#1E2638] flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <BaseButton
        :icon="ArrowLeft"
        variant="ghost"
        size="sm"
        @click="$emit('hideRateForm')"
      />
      <div>
        <h3 class="text-sm font-semibold text-slate-800 dark:text-white">
          Avaliar Filme
        </h3>
        <p class="text-xs text-gray-500 truncate max-w-[200px]">
          {{ movie.title }}
        </p>
      </div>
    </div>
  </div>
</template>
