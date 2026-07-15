<script setup>
import { useNotificationsStore } from "@/stores/notifications";
import { Bell, X } from "@lucide/vue";
import NotificationItem from "./NotificationItem.vue";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";

const movieDetailStore = useMovieDetailsStore();
const notificationsStore = useNotificationsStore();

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}

async function handleNotificationClick(notification) {
  if (!notification.isRead) {
    await notificationsStore.markAsRead(notification.id);
  }

  await movieDetailStore.openMovie(notification.movie_id);
}
</script>

<template>
  <Transition
    name="fade-tab"
    mode="out-in"
    @enter="lockScroll"
    @after-leave="unlockScroll"
  >
    <div
      v-if="notificationsStore.isNotificationsModalOpen"
      class="fixed inset-0 z-40 px-4 bg-black/40 backdrop-blur-sm flex justify-center items-center"
    >
      <div
        ref="notificationsModalRef"
        class="w-full max-h-[70vh] h-[550px] flex flex-col p-6 bg-white dark:bg-[#121825] rounded-2xl overflow-hidden modal-content"
      >
        <div
          class="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-[#1e293b]"
        >
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-full bg-blue-50 dark:bg-[#162845]">
              <Bell class="text-[#0088FF]" />
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Notificações
            </h2>
          </div>

          <button
            @click="notificationsStore.closeNotificationsModal"
            type="button"
            class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#222838] dark:hover:bg-slate-800 active:scale-98 transition-colors"
          >
            <X class="text-gray-600 dark:text-[#A7B0C9]" />
          </button>
        </div>

        <div
          class="flex-1 overflow-y-auto py-5 -mr-3 pr-3 space-y-2.5 standard-scrollbar"
        >
          <div
            v-if="notificationsStore.notifications.length === 0"
            class="px-2.5 py-4 rounded-xl border border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F]"
          >
            <p class="text-sm/5 text-gray-500 dark:text-[#ABB3C3]">
              Nenhuma notificação no momento
            </p>
          </div>

          <div class="space-y-2.5 mr-0.5">
            <NotificationItem
              v-for="notification in notificationsStore.notifications"
              @click="handleNotificationClick(notification)"
              :notification="notification"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
