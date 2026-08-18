import { defineStore } from "pinia";
import {
  addDoc,
  collection,
  db,
  query,
  where,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  orderBy,
  startAt,
  endAt,
  limit,
  writeBatch,
  onSnapshot,
  arrayRemove,
} from "../services/firebase";
import { useAuthStore } from "./auth.js";
import { ref } from "vue";
import { slugifyUsername } from "@/utils/username";

export const useGroupsStore = defineStore("groups", () => {
  const groups = ref([]);

  const activeGroup = ref(getInitialActiveGroup());
  const activeGroupMembers = ref({});

  const isGroupsModalOpen = ref(false);
  const isLoading = ref(false);
  let unsubscribeListener = null;

  const authStore = useAuthStore();

  function getInitialActiveGroup() {
    try {
      const item = localStorage.getItem("activeGroup");
      return item ? JSON.parse(item) : null;
    } catch (e) {
      localStorage.removeItem("activeGroup");
      return null;
    }
  }

  function setActiveGroup(group) {
    activeGroup.value = group;
    if (group) {
      localStorage.setItem("activeGroup", JSON.stringify(group));
      loadGroupMembers();
    } else {
      clearActiveGroup();
    }
  }

  function setupGroupsListener() {
    if (unsubscribeListener) {
      unsubscribeListener();
      unsubscribeListener = null;
    }

    isLoading.value = true;

    unsubscribeListener = onSnapshot(
      collection(db, "groups"),
      (snapshot) => {
        groups.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        isLoading.value = false;
      },
      (error) => {
        console.error("Erro ao buscar grupos:", error);
        isLoading.value = false;
      },
    );
  }

  async function loadGroupMembers(targetMemberIds = null) {
    const isCustomTarget = Array.isArray(targetMemberIds);

    const memberIds = isCustomTarget
      ? targetMemberIds
      : activeGroup.value?.members;

    if (!memberIds || !memberIds.length) {
      if (!isCustomTarget) activeGroupMembers.value = {};
      return {};
    }

    try {
      const q = query(
        collection(db, "users"),
        where("__name__", "in", memberIds),
      );

      const snapshot = await getDocs(q);

      const membersMap = {};
      snapshot.forEach((docSnap) => {
        membersMap[docSnap.id] = {
          uid: docSnap.id,
          ...docSnap.data(),
        };
      });

      if (!isCustomTarget) {
        activeGroupMembers.value = membersMap;
      }

      return membersMap;
    } catch (error) {
      console.error("Erro ao carregar membros do grupo:", error);
      return {};
    }
  }

  async function createGroup({ groupName, invitedMembersIds = [], color }) {
    const currentUserId = authStore.user.uid;

    if (!currentUserId) return;

    const allMembersIds = Array.from(
      new Set([currentUserId, ...invitedMembersIds]),
    );

    const newGroupPayload = {
      name: groupName,
      members: allMembersIds,
      color: color,
      created_by: currentUserId,
      created_at: new Date(),
    };

    const groupRef = await addDoc(collection(db, "groups"), newGroupPayload);

    const updatePromises = allMembersIds.map((memberId) =>
      updateDoc(doc(db, "users", memberId), {
        my_groups: arrayUnion(groupRef.id),
      }),
    );

    await Promise.all(updatePromises);

    const createdGroup = {
      id: groupRef.id,
      ...newGroupPayload,
    };

    setActiveGroup(createdGroup);

    closeGroupsModal();
  }

  async function searchUsersByUsername(searchQuery) {
    const cleanQuery = slugifyUsername(searchQuery);

    if (!cleanQuery || cleanQuery.length < 2) return [];

    const usersRef = collection(db, "users");

    const q = query(
      usersRef,
      orderBy("username"),
      startAt(cleanQuery),
      endAt(cleanQuery + "\uf8ff"),
      limit(8),
    );

    const querySnapshot = await getDocs(q);
    const results = [];

    querySnapshot.forEach((docSnap) => {
      if (docSnap.id === authStore.user?.uid) return;

      const data = docSnap.data();

      results.push({
        uid: docSnap.id,
        name: data.name,
        username: data.username,
        avatar_url: data.avatar_url,
        color: data.color,
      });
    });

    return results;
  }

  async function deleteGroup(groupId) {
    const currentUserId = authStore.user?.uid;
    const targetGroup =
      groups?.value.find((g) => g.id === groupId) || activeGroup;

    if (
      !currentUserId ||
      !targetGroup ||
      targetGroup.created_by !== currentUserId
    ) {
      throw new Error("Operação não permitida.");
    }

    const batch = writeBatch(db);

    const savedMoviesRef = collection(db, `groups/${groupId}/savedMovies`);
    const watchedMoviesRef = collection(db, `groups/${groupId}/watchedMovies`);
    const groupNotificationsQuery = query(
      collection(db, "notifications"),
      where("group_id", "==", groupId),
    );

    const [savedSnap, watchedSnap, groupNotificationsSnap] = await Promise.all([
      getDocs(savedMoviesRef),
      getDocs(watchedMoviesRef),
      getDocs(groupNotificationsQuery),
    ]);

    savedSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    watchedSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    groupNotificationsSnap.forEach((docSnap) => batch.delete(docSnap.ref));

    const membersIds = Array.isArray(targetGroup.members)
      ? targetGroup.members
      : Object.keys(targetGroup.members || {});

    membersIds.forEach((memberId) => {
      const userDocRef = doc(db, "users", memberId);

      batch.update(userDocRef, {
        my_groups: arrayRemove(groupId),
      });
    });

    const groupDocRef = doc(db, "groups", groupId);
    batch.delete(groupDocRef);

    await batch.commit();

    if (activeGroup.value?.id === groupId) {
      clearActiveGroup();
    }
  }

  function clearActiveGroup() {
    activeGroup.value = null;
    activeGroupMembers.value = {};
    localStorage.removeItem("activeGroup");
  }

  function openGroupsModal() {
    isGroupsModalOpen.value = true;
  }

  function closeGroupsModal() {
    isGroupsModalOpen.value = false;
  }

  return {
    groups,
    isGroupsModalOpen,
    activeGroup,
    activeGroupMembers,
    openGroupsModal,
    closeGroupsModal,
    setupGroupsListener,
    createGroup,
    deleteGroup,
    setActiveGroup,
    clearActiveGroup,
    loadGroupMembers,
    searchUsersByUsername,
  };
});
