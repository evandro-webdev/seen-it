<script setup>
import { computed } from "vue";
import { useMovieDetailsStore } from "@/stores/movieDetails";
import { useWatchedMoviesStore } from "@/stores/watchedMovies";

import { Sparkles, ArrowLeft, Check, X, SquarePen } from "@lucide/vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import SaveButton from "./SaveButton.vue";

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submitRating", "openConfirmDelete"]);

const showRateForm = defineModel("showRateForm", {
  type: Boolean,
  default: false,
});

const movieDetailsStore = useMovieDetailsStore();
const watchedMoviesStore = useWatchedMoviesStore();

const movie = computed(() => movieDetailsStore.selectedMovie);

const isAlreadyWatched = computed(() => {
  if (!movie.value?.id) return false;
  return watchedMoviesStore.isAlreadyWatched(movie.value.id);
});

const isUnreleased = computed(() => {
  if (!movie.value?.release_date) return false;
  return new Date(movie.value.release_date) > new Date();
});
</script>

<template>
  <div
    class="shrink-0 p-4 border-t border-gray-100 dark:border-[#1E2638] bg-white/90 dark:bg-[#0F111D]/90 backdrop-blur-md z-30"
  >
    <div
      v-if="showRateForm"
      class="flex items-center gap-3 w-full"
    >
      <BaseButton
        label="Cancelar"
        :icon="ArrowLeft"
        variant="ghost"
        @click="showRateForm = false"
      />
      <BaseButton
        label="Confirmar Avaliação"
        :icon="Check"
        variant="primary"
        :loading="isSubmitting"
        block
        @click="emit('submitRating')"
      />
    </div>

    <template v-else>
      <div
        v-if="isAlreadyWatched"
        class="flex items-center gap-3 w-full"
      >
        <BaseButton
          label="Remover nota"
          :icon="X"
          size="md"
          variant="ghost"
          @click="emit('openConfirmDelete')"
        />
        <BaseButton
          label="Editar avaliação"
          :icon="SquarePen"
          size="md"
          block
          @click="showRateForm = true"
        />
      </div>

      <div
        v-else
        class="flex items-center gap-3 w-full"
      >
        <SaveButton />
        <BaseButton
          label="Avaliar filme"
          :icon="Sparkles"
          size="md"
          block
          :disabled="isUnreleased"
          @click="showRateForm = true"
        />
      </div>
    </template>
  </div>
</template>
