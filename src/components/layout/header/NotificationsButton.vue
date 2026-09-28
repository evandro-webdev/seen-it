<script setup>
import { useAuthStore } from "@/stores/auth";
import { useNotificationsStore } from "@/stores/notifications";

import { Bell } from "@lucide/vue";

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

async function openNotificationsModal() {
  notificationsStore.openNotificationsModal();
  await notificationsStore.cleanOldNotifications();
}
</script>

<template>
  <div
    v-if="authStore.loading"
    class="text-gray-400 dark:text-slate-400 opacity-50 animate-pulse pointer-events-none"
  >
    <Bell class="w-6 h-6" />
  </div>

  <button
    v-else-if="authStore.isAuthenticated"
    @click="openNotificationsModal"
    class="relative text-gray-400 dark:text-slate-400 transition-opacity"
  >
    <Bell class="w-6 h-6" />
    <span
      v-if="notificationsStore.unreadCount > 0"
      class="absolute -top-1.5 -right-1.5 w-4 h-4 text-xs font-semibold rounded-full text-white bg-red-600 block"
    >
      {{ notificationsStore.unreadCount }}
    </span>
  </button>
</template>
