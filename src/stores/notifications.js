import { defineStore } from "pinia";
import { ref } from "vue";
import { useGroupsStore } from "./groups";
import { addDoc, db, collection, onSnapshot, query, where, orderBy } from "@/services/firebase";
import { useAuthStore } from "./auth";

export const useNotificationsStore = defineStore("notifications", () => {
  const isNotificationsModalOpen = ref(false);
  const notifications = ref([]);
  const loading = ref(false);
  let unsubscribe = null;

  function openNotificationsModal() {
    isNotificationsModalOpen.value = true;
  }

  function closeNotificationsModal() {
    isNotificationsModalOpen.value = false;
  }

  function listenToNotifications() {
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

  async function dispatchSavedMovieNotification(
    senderId,
    senderName,
    movieId,
    movieTitle,
  ) {
    const groupStore = useGroupsStore();

    const membersIds = Object.keys(groupStore.activeGroupMembers);

    const membersToNotificate = membersIds.filter(
      (memberId) => senderId !== memberId,
    );

    const promises = membersToNotificate.map((uid) => {
      return addDoc(collection(db, "notifications"), {
        userId: uid,
        sender_id: senderId,
        sender_name: senderName,
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

  return {
    isNotificationsModalOpen,
    listenToNotifications,
    notifications,
    openNotificationsModal,
    closeNotificationsModal,
    dispatchSavedMovieNotification,
  };
});
