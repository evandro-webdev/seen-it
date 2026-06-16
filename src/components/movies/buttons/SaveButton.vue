<script setup>
import { useSavedMoviesStore } from "../../../stores/savedMovies.js";
import { defineProps, ref } from "vue";
import { Bookmark, Loader, Loader2 } from "@lucide/vue";

const savedMoviesStore = useSavedMoviesStore();

const props = defineProps({
  isAlreadySaved: {
    type: Boolean,
    required: true,
  },
  movie: {
    type: Object,
    required: true,
  },
});

const isLoading = ref(false);

async function handleToggleSaved() {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    await savedMoviesStore.toggleSaved(props.movie);
  } catch (error) {
    console.error("Erro ao salvar/remover filme: ".$error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <button
    @click="handleToggleSaved"
    class="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#314066] flex justify-center items-center gap-2 transition-colors duration-200"
    :class="
      isAlreadySaved
        ? 'text-[#0088FF] dark:text-white bg-blue-100 dark:bg-[#314066]'
        : 'text-gray-500 bg-white dark:bg-[#0F111D] dark:text-gray-300'
    "
  >
    <Loader2
      v-if="isLoading"
      class="w-4 h-4 animate-spin text-current"
    />

    <Bookmark
      v-else
      :fill="isAlreadySaved ? 'currentColor' : 'none'"
      :stroke="'currentColor'"
      :class="[
        'w-4 h-4',
        isAlreadySaved
          ? 'text-[#0088FF] dark:text-white'
          : 'text-gray-500 dark:text-white',
      ]"
    />
    <span class="font-medium">{{ isAlreadySaved ? "Salvo" : "Salvar" }}</span>
  </button>
</template>
