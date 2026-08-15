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
  deleteDoc,
  writeBatch,
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

  function openGroupsModal() {
    isGroupsModalOpen.value = true;
  }

  function closeGroupsModal() {
    isGroupsModalOpen.value = false;
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

  function clearActiveGroup() {
    activeGroup.value = null;
    activeGroupMembers.value = {};
    localStorage.removeItem("activeGroup");
  }

  async function getGroups() {
    if (!authStore.user?.uid) return [];

    isLoading.value = true;

    try {
      const q = query(
        collection(db, "groups"),
        where("members", "array-contains", authStore.user.uid),
      );

      const querySnapshot = await getDocs(q);

      groups.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Erro ao buscar grupos do usuário:", error);
    } finally {
      isLoading.value = false;
    }
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

    groups.value.push(createdGroup);
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
    )
      return;

    const batch = writeBatch(db);

    const savedMoviesRef = collection(db, `groups/${groupId}/savedMovies`);
    const watchedMoviesRef = collection(db, `groups/${groupId}/watchedMovies`);

    const [savedSnap, watchedSnap] = await Promise.all([
      getDocs(savedMoviesRef),
      getDocs(watchedMoviesRef),
    ]);

    savedSnap.forEach((docSnap) => batch.delete(docSnap.ref));
    watchedSnap.forEach((docSnap) => batch.delete(docSnap.ref));

    const groupDocRef = doc(db, "groups", groupId);
    batch.delete(groupDocRef);

    await batch.commit();

    if (activeGroup?.id === groupId) {
      clearActiveGroup();
    }
  }

  return {
    groups,
    isGroupsModalOpen,
    activeGroup,
    activeGroupMembers,
    openGroupsModal,
    closeGroupsModal,
    getGroups,
    createGroup,
    deleteGroup,
    setActiveGroup,
    clearActiveGroup,
    loadGroupMembers,
    searchUsersByUsername,
  };
});
