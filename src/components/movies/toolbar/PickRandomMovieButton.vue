<script setup>
import { ref } from "vue";
import { useSavedMoviesStore } from "@/stores/savedMovies";

import { Dices } from "@lucide/vue";

const savedMoviesStore = useSavedMoviesStore();

const isRolling = ref(false);

function handlePickRandom() {
  if (isRolling.value) return;
  isRolling.value = true;

  savedMoviesStore.pickRandomMovie();

  setTimeout(() => {
    isRolling.value = false;
  }, 600);
}
</script>

<template>
  <button
    @click="handlePickRandom"
    type="button"
    title="Escolher filme aleatório"
    aria-label="Escolher filme aleatório"
    :disabled="isRolling"
    class="h-[54px] w-[54px] rounded-2xl bg-[#0062b8] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-80"
  >
    <Dices
      class="w-6 h-6 transition-transform duration-500"
      :class="{ 'animate-spin': isRolling }"
    />
  </button>
</template>
