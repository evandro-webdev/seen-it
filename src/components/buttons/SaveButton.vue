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
    class="py-2 px-3 rounded-lg hover:bg-gray-100 flex justify-center items-center gap-2"
    :class="isAlreadySaved ? 'text-[#0088FF] bg-blue-100' : 'text-gray-500 bg-white'"
  >
    <Bookmark
      :fill="isAlreadySaved ? '#0088FF' : 'none'"
      :stroke="isAlreadySaved ? '#0088FF' : 'currentColor'"
      class="w-4 h-4"
    />
    <span
      class="font-medium"
      >{{ isAlreadySaved ? "Salvo" : "Salvar" }}</span
    >
  </button>
</template>
