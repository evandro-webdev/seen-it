import { defineStore } from "pinia";
import { ref, computed } from "vue";
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
} from "@/services/firebase";
import { useAuthStore } from "./auth";

export const useNotificationsStore = defineStore("notifications", () => {
  const isNotificationsModalOpen = ref(false);
  const notifications = ref([]);
  const loading = ref(false);
  let unsubscribe = null;

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.isRead).length;
  });

  function openNotificationsModal() {
    isNotificationsModalOpen.value = true;
  }

  function closeNotificationsModal() {
    isNotificationsModalOpen.value = false;
  }

  function listenToNotifications() {
    stopListening();

    const authStore = useAuthStore();
    const uid = authStore.user?.uid;

    if (!uid) return;

    loading.value = true;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", uid),
      orderBy("created_at", "desc"),
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      notifications.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      loading.value = false;
    });
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    notifications.value = [];
  }

  async function dispatchSavedMovieNotification(movieId, movieTitle) {
    const authStore = useAuthStore();
    const groupStore = useGroupsStore();

    const membersIds = Object.keys(groupStore.activeGroupMembers);

    const membersToNotificate = membersIds.filter(
      (memberId) => authStore.user.uid !== memberId,
    );

    const promises = membersToNotificate.map((uid) => {
      return addDoc(collection(db, "notifications"), {
        userId: uid,
        sender_id: authStore.user.uid,
        sender_name: authStore.user.displayName,
        group_id: groupStore.activeGroup.id,
        movie_id: movieId,
        movie_title: movieTitle,
        type: "movie_saved",
        isRead: false,
        created_at: new Date(),
      });
    });

    await Promise.all(promises);
  }

  async function dispatchWatchedMovieNotification(movie) {
    const authStore = useAuthStore();
    const groupStore = useGroupsStore();

    const membersIds = Object.keys(groupStore.activeGroupMembers);

    const alreadyRated = movie.reviews ? Object.keys(movie.reviews) : [];

    const membersToNotificate = membersIds.filter(
      (memberId) =>
        !alreadyRated.includes(memberId) && memberId !== authStore.user.uid,
    );

    const promises = membersToNotificate.map((uid) => {
      return addDoc(collection(db, "notifications"), {
        userId: uid,
        sender_id: authStore.user.uid,
        sender_name: authStore.user.displayName,
        group_id: groupStore.activeGroup.id,
        movie_id: movie.id,
        movie_title: movie.title,
        type: "movie_rated",
        isRead: false,
        created_at: new Date(),
      });
    });

    await Promise.all(promises);
  }

  async function markAsRead(notificationId) {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        isRead: true,
      });
    } catch (error) {
      console.error("Erro ao marcar como lida: ", error);
    }
  }

  return {
    isNotificationsModalOpen,
    listenToNotifications,
    notifications,
    openNotificationsModal,
    closeNotificationsModal,
    dispatchSavedMovieNotification,
    dispatchWatchedMovieNotification,
    unreadCount,
    markAsRead,
    stopListening,
  };
});
