<script setup>
import { ref } from "vue";
import { Menu, Bell } from "@lucide/vue";

import { useGroupsStore } from "@/stores/groups.js";
import { useAuthStore } from "@/stores/auth.js";
import MenuDropdown from "./Menu.vue";
import ToggleThemeButton from "@/components/ui/ToggleThemeButton.vue";

const authStore = useAuthStore();
const groupsStore = useGroupsStore();

const isMenuOpen = ref(false);
const menuButtonRef = ref(null);

async function handleLogout() {
  isMenuOpen.value = false;

  try {
    await authStore.logout();
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

function openGroupsModal() {
  isMenuOpen.value = false;
  groupsStore.openGroupsModal();
}
</script>

<template>
  <header class="p-4">
    <div class="flex justify-between items-center relative">
      <button
        v-if="authStore.isAuthenticated"
        @click="isMenuOpen = !isMenuOpen"
        ref="menuButtonRef"
        class="text-[#0088FF]"
      >
        <Menu class="w-6 h-6" />
      </button>

      <div class="space-x-3 flex items-center ml-auto">
        <ToggleThemeButton />
        <button
          v-if="authStore.isAuthenticated"
          class="text-[#0088FF]"
        >
          <Bell class="w-6 h-6" />
        </button>
      </div>

      <Transition
        name="fade"
        mode="out-in"
      >
        <MenuDropdown
          v-if="isMenuOpen"
          :display-name="authStore.user?.displayName"
          :ignore-ref="menuButtonRef"
          @close="isMenuOpen = false"
          @open-groups-modal="openGroupsModal"
          @logout="handleLogout"
        />
      </Transition>
    </div>
  </header>
</template>
