<script setup>
import { ref, computed } from "vue";

import { useGroupsStore } from "@/stores/groups.js";
import { useProfileStore } from "@/stores/profile.js";
import { useAuthStore } from "@/stores/auth.js";
import { useNotificationsStore } from "@/stores/notifications.js";
import { useToastStore } from "@/stores/toast.js";

import { getGroupTheme } from "@/constants/colors.js";

import { Menu, Bell, X, FolderHeart } from "@lucide/vue";

import MenuDropdown from "./Menu.vue";
import ToggleThemeButton from "@/components/ui/ToggleThemeButton.vue";

const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const profileStore = useProfileStore();
const notificationsStore = useNotificationsStore();
const toastStore = useToastStore();

const isMenuOpen = ref(false);
const menuButtonRef = ref(null);

const groupTheme = computed(() => {
  return getGroupTheme(groupsStore.activeGroup?.theme);
});

async function handleLogout() {
  isMenuOpen.value = false;

  try {
    await authStore.logout();
    toastStore.success("Você saiu da sua conta.");
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

async function openNotificationsModal() {
  notificationsStore.openNotificationsModal();
  await notificationsStore.cleanOldNotifications();
}

function handleCloseGroup() {
  toastStore.success(`Fechou o grupo: ${groupsStore.activeGroup.name}`);
  groupsStore.clearActiveGroup();
}
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

        <div
          v-if="groupsStore.activeGroup"
          class="py-1 px-3 rounded-full border text-xs font-semibold flex items-center gap-1.5"
          :style="{
            backgroundColor: groupTheme.primary + '1F',
            borderColor: groupTheme.primary + '40',
            color: groupTheme.primary,
          }"
        >
          <FolderHeart class="w-3.5 h-3.5" />
          <span>{{ groupsStore.activeGroup.name }}</span>

          <button
            @click.stop="handleCloseGroup"
            class="ml-1 p-0.5 rounded-full"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <div class="ml-auto space-x-3 flex items-center">
        <ToggleThemeButton />

        <div
          v-if="authStore.loading"
          class="text-[#0088FF] opacity-50 animate-pulse pointer-events-none"
        >
          <Bell class="w-6 h-6" />
        </div>

        <button
          v-else-if="authStore.isAuthenticated"
          @click="openNotificationsModal"
          class="relative text-[#0088FF] transition-opacity"
        >
          <Bell class="w-6 h-6" />
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-1.5 -right-1.5 w-4 h-4 text-xs font-semibold rounded-full text-white bg-red-600 block"
          >
            {{ notificationsStore.unreadCount }}
          </span>
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
