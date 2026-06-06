<script setup>
import { useSavedMoviesStore } from "../../stores/savedMovies.js";
import { defineProps } from "vue";
import { Bookmark } from "@lucide/vue";

const savedMoviesStore = useSavedMoviesStore();

defineProps({
  isAlreadySaved: {
    type: Boolean,
    required: true,
  },
  movie: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <button
    @click="async () => await savedMoviesStore.toggleSaved(movie)"
    class="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#314066] flex justify-center items-center gap-2 transition-colors duration-200"
    :class="isAlreadySaved ? 'text-[#0088FF] dark:text-white bg-blue-100 dark:bg-[#314066]' : 'text-gray-500 bg-white dark:bg-[#0F111D] dark:text-gray-300'"
  >
    <Bookmark
      :fill="isAlreadySaved ? 'currentColor' : 'none'"
      :stroke="'currentColor'"
      :class="[
        'w-4 h-4',
        isAlreadySaved ? 'text-[#0088FF] dark:text-white' : 'text-gray-500 dark:text-white'
      ]"
    />
    <span
      class="font-medium"
      >{{ isAlreadySaved ? "Salvo" : "Salvar" }}</span
    >
  </button>
</template>
