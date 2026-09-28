<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";

import { Menu } from "@lucide/vue";

import MenuDropdown from "./Menu.vue";
import NotificationsButton from "./header/NotificationsButton.vue";
import ToggleThemeButton from "./header/ToggleThemeButton.vue";
import GroupActiveDisplay from "./header/GroupActiveDisplay.vue";

const authStore = useAuthStore();

const isMenuOpen = ref(false);
const menuButtonRef = ref(null);
</script>

<template>
  <header class="p-4">
    <div class="flex justify-between items-center relative">
      <div class="mr-auto space-x-3 flex items-center">
        <div
          v-if="authStore.loading"
          class="text-[#0088FF] opacity-50 animate-pulse pointer-events-none"
        >
          <Menu class="w-6 h-6" />
        </div>

        <button
          v-else-if="authStore.isAuthenticated"
          @click="isMenuOpen = !isMenuOpen"
          ref="menuButtonRef"
          class="text-[#0088FF] transition-opacity"
        >
          <Menu class="w-6 h-6" />
        </button>

        <GroupActiveDisplay />
      </div>

      <div class="ml-auto space-x-3 flex items-center">
        <ToggleThemeButton />
        <NotificationsButton />
      </div>

      <Transition
        name="fade"
        mode="out-in"
      >
        <MenuDropdown
          v-if="isMenuOpen"
          :ignore-ref="menuButtonRef"
          @close="isMenuOpen = false"
        />
      </Transition>
    </div>
  </header>
</template>
