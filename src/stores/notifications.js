import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useGroupsStore } from "./groups";
import {
  addDoc,
  db,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  writeBatch,
  limit,
  getDocs,
} from "@/services/firebase";
import { useAuthStore } from "./auth";

export const useNotificationsStore = defineStore("notifications", () => {
  const isNotificationsModalOpen = ref(false);
  const notifications = ref([]);
  const loading = ref(false);

  const groupsStore = useGroupsStore();
  const authStore = useAuthStore();

  let unsubscribe = null;

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.is_read).length;
  });

  function openNotificationsModal() {
    isNotificationsModalOpen.value = true;
  }

  function closeNotificationsModal() {
    isNotificationsModalOpen.value = false;
  }

  function listenToNotifications() {
    stopListening();

    const uid = authStore.user?.uid;
    const activeGroup = groupsStore.activeGroup;

    if (!uid || !activeGroup?.id) return;

    loading.value = true;

    const q = query(
      collection(db, "notifications"),
      where("user_id", "==", uid),
      where("group_id", "==", activeGroup.id),
      orderBy("created_at", "desc"),
      limit(25),
    );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        notifications.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        loading.value = false;
      },
      (error) => {
        console.error("Erro no listener de notificações:", error);
        loading.value = false;
      },
    );
  }

  watch(
    () => groupsStore.activeGroup?.id,
    (newGroupId) => {
      if (newGroupId) {
        listenToNotifications();
      } else {
        stopListening();
      }
    },
    { immediate: true },
  );

  function stopListening() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    notifications.value = [];
    loading.value = false;
  }

  async function dispatchWatchedMovieNotification(movie) {
    const membersIds = Object.keys(groupsStore.activeGroupMembers || {});
    const recipients = membersIds.filter((id) => id !== authStore.user.uid);

    if (recipients.length === 0) return;

    const title = "Confira minha nota!";
    const body = `${authStore.user.displayName} avaliou "${movie.title}".`;

    const payload = {
      type: "movie_rated",
      message: "avaliou o filme",
      entity_name: movie.title,
      entity_id: movie.id,
      group_id: groupsStore.activeGroup.id,
    };

    await Promise.all([
      persistNotifications(recipients, payload),
      sendPushNotification(recipients, title, body, "movie_rated"),
    ]);
  }

  async function dispatchSavedMovieNotification(movie) {
    const membersIds = Object.keys(groupsStore.activeGroupMembers || {});
    const recipients = membersIds.filter((id) => id !== authStore.user.uid);

    if (recipients.length === 0) return;

    const title = "Vamos assistir?";
    const body = `${authStore.user.displayName} salvou o filme "${movie.title}"`;

    const payload = {
      type: "movie_rated",
      message: "salvou o filme",
      entity_name: movie.title,
      entity_id: movie.id,
      group_id: groupsStore.activeGroup.id,
    };

    await Promise.all([
      persistNotifications(recipients, payload),
      sendPushNotification(recipients, title, body, "movie_saved"),
    ]);
  }

  // FIX: atualmente só chega notificações quando um grupo está ativo, ou seja, a notificação não vai pra lugar nenhum se o grupo foi criado agora
  async function dispatchCreatedGroupNotification(group, recipients) {
    if (!recipients || recipients.length === 0) return;

    const title = "Novo grupo criado!";
    const body = `${authStore.user.displayName} criou o grupo "${group.name}"`;

    const payload = {
      type: "group_created",
      message: "criou o grupo",
      entity_name: group.name,
      entity_id: group.id,
      group_id: group.id,
    };

    await Promise.all([
      persistNotifications(recipients, payload),
      sendPushNotification(recipients, title, body, "group_created"),
    ]);
  }

  async function persistNotifications(recipients, notificationData) {
    const promises = recipients.map((uid) => {
      return addDoc(collection(db, "notifications"), {
        user_id: uid,
        sender_id: authStore.user.uid,
        sender_name: authStore.user.displayName,
        is_read: false,
        created_at: new Date(),
        ...notificationData,
      });
    });

    await Promise.all(promises);
  }

  async function markAsRead(notificationId) {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        is_read: true,
      });
    } catch (error) {
      console.error("Erro ao marcar como lida: ", error);
    }
  }

  async function markAllAsRead() {
    const activeGroupId = groupsStore.activeGroup?.id;

    if (!activeGroupId) return;

    const unreadNotifications = notifications.value.filter(
      (n) => !n.is_read && n.group_id === activeGroupId,
    );

    if (unreadNotifications.length === 0) return;

    try {
      const batch = writeBatch(db);

      unreadNotifications.forEach((notification) => {
        const notiRef = doc(db, "notifications", notification.id);
        batch.update(notiRef, { is_read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error("Erro ao marcar todas como lidas: ", error);
    }
  }

  async function cleanOldNotifications() {
    const activeGroupId = groupsStore.activeGroup?.id;

    if (!activeGroupId) return;

    const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
    const fourteenDaysAgo = new Date(Date.now() - TWO_WEEKS_MS);

    try {
      const q = query(
        collection(db, "notifications"),
        where("group_id", "==", activeGroupId),
        where("created_at", "<=", fourteenDaysAgo),
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) return;

      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      await batch.commit();
      console.log(
        `[CleanUp] ${snapshot.size} notificações antigas removidas com sucesso.`,
      );
    } catch (error) {
      console.error("Erro ao limpar notificações antigas:", error);
    }
  }

  async function sendPushNotification(targetUserIds, title, body, type) {
    if (!targetUserIds || targetUserIds.length === 0) return;

    const url = "https://onesignal.com/api/v1/notifications";

    const payload = {
      app_id: import.meta.env.VITE_ONESIGNAL_API_KEY,
      include_aliases: {
        external_id: targetUserIds,
      },
      target_channel: "push",
      contents: {
        en: body,
        pt: body,
      },
      headings: {
        en: title,
        pt: title,
      },
      android_group: `${type}_${Date.now()}`,
      web_push_topic: `${type}_${Date.now()}`,
      android_group_message: { pt: "$[notif_count] novos filmes adicionados!" },
    };

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${import.meta.env.VITE_ONESIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("Push OneSignal enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar push via OneSignal:", error);
    }
  }

  return {
    isNotificationsModalOpen,
    loading,
    notifications,
    unreadCount,
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
