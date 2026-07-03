<script setup>
import { Sun, Moon } from "@lucide/vue";

import { useDarkMode } from "@/composables/useDarkMode";

const { isDarkMode, toggleDarkMode } = useDarkMode();
</script>

<template>
  <button
    class="text-[#0088FF] p-1.5 rounded-lg active:scale-95 transition-transform overflow-hidden flex items-center justify-center"
    @click="toggleDarkMode"
  >
    <Transition
      name="theme-toggle"
      mode="out-in"
    >
      <Sun
        v-if="!isDarkMode"
        class="w-6 h-6"
      />
      <Moon
        v-else
        class="w-6 h-6"
      />
    </Transition>
  </button>
</template>
