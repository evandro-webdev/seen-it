<script setup>

import { ref } from "vue";
import { Menu, Sun, Moon, Bell } from "@lucide/vue";

import { useDarkMode } from '../../composables/useDarkMode'
const { isDarkMode, toggleDarkMode } = useDarkMode()

</script>

<template>
  <header class="p-4">
    <div class="flex justify-between items-center">
      <button class="text-[#0088FF]">
        <Menu class="w-6 h-6" />
      </button>

      <div class="space-x-3 flex items-center">
        <button class="text-[#0088FF]" @click="toggleDarkMode">
          <Sun v-if="!isDarkMode" class="w-6 h-6" />
          <Moon v-else class="w-6 h-6" />
        </button>
        <button class="text-[#0088FF]">
          <Bell class="w-6 h-6" />
        </button>
      </div>
    </div>
  </header>
</template>
