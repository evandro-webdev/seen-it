<script setup>
import { ref } from "vue";
import { Menu, Bell, X, FolderHeart } from "@lucide/vue";

import { useGroupsStore } from "@/stores/groups.js";
import { useProfileStore } from "@/stores/profile.js";
import { useAuthStore } from "@/stores/auth.js";
import MenuDropdown from "./Menu.vue";
import ToggleThemeButton from "@/components/ui/ToggleThemeButton.vue";
import { useNotificationsStore } from "@/stores/notifications.js";

const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const profileStore = useProfileStore();
const notificationsStore = useNotificationsStore();

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

function openProfileModal() {
  isMenuOpen.value = false;
  profileStore.openProfileModal();
}
</script>

<template>
  <header class="p-4">
    <div class="flex justify-between items-center relative">
      <div class="mr-auto space-x-3 flex items-center">
        <button
          v-if="authStore.isAuthenticated"
          @click="isMenuOpen = !isMenuOpen"
          ref="menuButtonRef"
          class="text-[#0088FF]"
        >
          <Menu class="w-6 h-6" />
        </button>

        <div
          v-if="groupsStore.activeGroup"
          class="py-1.5 px-3 rounded-full text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-1.5"
          :style="{
            backgroundImage: `linear-gradient(135deg, ${groupsStore.activeGroup.color.primary}, ${groupsStore.activeGroup.color.secondary})`,
          }"
        >
          <FolderHeart class="w-3.5 h-3.5" />
          <span>{{ groupsStore.activeGroup.name }}</span>

          <button
            @click.stop="groupsStore.clearActiveGroup"
            class="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <div class="ml-auto space-x-3 flex items-center">
        <ToggleThemeButton />
        <button
          v-if="authStore.isAuthenticated"
          @click="notificationsStore.openNotificationsModal"
          class="relative text-[#0088FF]"
        >
          <Bell class="w-6 h-6" />
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-1.5 -right-1.5 w-4 h-4 text-xs font-semibold rounded-full text-white bg-red-600 block"
            >{{ notificationsStore.unreadCount }}</span
          >
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
          @open-profile-modal="openProfileModal"
          @logout="handleLogout"
        />
      </Transition>
    </div>
  </header>
</template>
