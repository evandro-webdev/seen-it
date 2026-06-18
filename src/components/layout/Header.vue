<script setup>
import { ref } from "vue";
import { Sun, Moon, Bell, CircleUserRound } from "@lucide/vue";
import { onClickOutside } from "@vueuse/core";

import { useAuthStore } from "../../stores/auth.js";
import { useDarkMode } from "../../composables/useDarkMode";

const { isDarkMode, toggleDarkMode } = useDarkMode();
const authStore = useAuthStore();

const isMenuOpen = ref(false);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <header class="p-4">
    <div class="flex justify-between items-center relative">
      <button
        class="text-[#0088FF]"
        @click="isMenuOpen = !isMenuOpen"
      >
        <CircleUserRound class="w-6 h-6" />
      </button>

      <div class="space-x-3 flex items-center">
        <button
          class="text-[#0088FF]"
          @click="toggleDarkMode"
        >
          <Sun
            v-if="!isDarkMode"
            class="w-6 h-6"
          />
          <Moon
            v-else
            class="w-6 h-6"
          />
        </button>
        <button class="text-[#0088FF]">
          <Bell class="w-6 h-6" />
        </button>
      </div>

      <Transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="isMenuOpen"
          ref="menuRef"
          class="absolute z-10 left-0 top-10 rounded-lg border border-gray-200 dark:border-[#242942] bg-[#f7f7f7] dark:bg-[#0f111c] overflow-hidden flex flex-col"
        >
          <a
            class="p-2 pr-6 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1a1d30] transition-colors 300ms"
            >Perfil</a
          >
          <a
            class="p-2 pr-6 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1a1d30] transition-colors 300ms"
            >Configurações</a
          >
          <a
            @click="authStore.logout"
            class="p-2 pr-6 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1a1d30] transition-colors 300ms"
            >Sair</a
          >
        </div>
      </Transition>
    </div>
  </header>
</template>
