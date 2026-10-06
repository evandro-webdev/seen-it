import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useGroupsStore } from "./groups";
import { useAuthStore } from "./auth";

import {
  persistNotificationsForRecipients,
  markNotificationAsRead,
  markMultipleNotificationsAsRead,
  purgeGroupOldNotifications,
  createNotificationsListener,
} from "@/services/notificationsService";

import { sendPushNotification } from "@/services/pushService";

export const useNotificationsStore = defineStore("notifications", () => {
  const isNotificationsModalOpen = ref(false);
  const allNotifications = ref([]);
  const loading = ref(false);

  const groupsStore = useGroupsStore();
  const authStore = useAuthStore();

  let unsubscribe = null;

  function stopListening() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  function listenToNotifications() {
    stopListening();

    const uid = authStore.user?.uid;
    if (!uid) return;

    loading.value = true;

    unsubscribe = createNotificationsListener(
      uid,
      (notifications) => {
        allNotifications.value = notifications;
        loading.value = false;
      },
      (error) => {
        console.error("Erro no listener de notificações:", error);
        loading.value = false;
      },
    );
  }

  const activeNotifications = computed(() => {
    const activeGroupId = groupsStore.activeGroup?.id;

    return allNotifications.value.filter((n) => {
      if (!n.group_id || n.type === "group_created") return true;
      return n.group_id === activeGroupId;
    });
  });

  const unreadCount = computed(() => {
    return activeNotifications.value.filter((n) => !n.is_read).length;
  });

  const unreadGroupsMap = computed(() => {
    const map = {};
    allNotifications.value.forEach((n) => {
      if (!n.is_read && n.group_id) {
        map[n.group_id] = true;
      }
    });
    return map;
  });

  async function dispatchWatchedMovieNotification(movie) {
    const membersIds = Object.keys(groupsStore.activeGroupMembers || {});
    const recipients = membersIds.filter((id) => id !== authStore.user.uid);

    if (recipients.length === 0) return;

    const title = "Confira minha nota!";
    const body = `${authStore.firstName} avaliou "${movie.title}".`;
    const payload = {
      type: "movie_rated",
      message: "avaliou o filme",
      entity_name: movie.title,
      entity_id: movie.id,
      group_id: groupsStore.activeGroup.id,
    };

    await Promise.all([
      persistNotificationsForRecipients(recipients, authStore.user, payload),
      sendPushNotification(recipients, title, body, "movie_rated"),
    ]);
  }

  async function dispatchSavedMovieNotification(movie) {
    const membersIds = Object.keys(groupsStore.activeGroupMembers || {});
    const recipients = membersIds.filter((id) => id !== authStore.user.uid);

    if (recipients.length === 0) return;

    const title = "Vamos assistir?";
    const body = `${authStore.firstName} salvou o filme "${movie.title}"`;
    const payload = {
      type: "movie_saved",
      message: "salvou o filme",
      entity_name: movie.title,
      entity_id: movie.id,
      group_id: groupsStore.activeGroup.id,
    };

    await Promise.all([
      persistNotificationsForRecipients(recipients, authStore.user, payload),
      sendPushNotification(recipients, title, body, "movie_saved"),
    ]);
  }

  async function dispatchCreatedGroupNotification(group, recipients) {
    if (!recipients || recipients.length === 0) return;

    const title = "Novo grupo criado!";
    const body = `${authStore.firstName} criou o grupo "${group.name}"`;
    const payload = {
      type: "group_created",
      message: "criou o grupo",
      entity_name: group.name,
      entity_id: group.id,
      group_id: group.id,
    };

    await Promise.all([
      persistNotificationsForRecipients(recipients, authStore.user, payload),
      sendPushNotification(recipients, title, body, "group_created"),
    ]);
  }

  async function markAsRead(notificationId) {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  }

  async function markAllAsRead() {
    const unreadNotifications = activeNotifications.value.filter(
      (n) => !n.is_read,
    );
    if (unreadNotifications.length === 0) return;

    try {
      await markMultipleNotificationsAsRead(unreadNotifications);
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  }

  async function cleanOldNotifications() {
    const activeGroupId = groupsStore.activeGroup?.id;
    if (!activeGroupId) return;

    try {
      await purgeGroupOldNotifications(activeGroupId, 14);
    } catch (error) {
      console.error("Erro ao limpar notificações antigas:", error);
    }
  }

  function openNotificationsModal() {
    isNotificationsModalOpen.value = true;
  }

  function closeNotificationsModal() {
    isNotificationsModalOpen.value = false;
  }

  return {
    isNotificationsModalOpen,
    loading,
    notifications: activeNotifications,
    unreadCount,
    unreadGroupsMap,
    listenToNotifications,
    openNotificationsModal,
    closeNotificationsModal,
    dispatchSavedMovieNotification,
    dispatchWatchedMovieNotification,
    dispatchCreatedGroupNotification,
    markAsRead,
    markAllAsRead,
    cleanOldNotifications,
    stopListening,
  };
});
