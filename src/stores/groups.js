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
} from "../services/firebase";
import { useAuthStore } from "./auth.js";
import { ref } from "vue";

export const useGroupsStore = defineStore("groups", () => {
  const groups = ref([]);
  const activeGroup = ref(
    JSON.parse(localStorage.getItem("activeGroup")) || null,
  );
  const activeGroupMembers = ref({});
  const isGroupsModalOpen = ref(false);
  const isLoading = ref(false);

  function openGroupsModal() {
    isGroupsModalOpen.value = true;
  }

  function closeGroupsModal() {
    isGroupsModalOpen.value = false;
  }

  function setActiveGroup(group) {
    activeGroup.value = group;
    localStorage.setItem("activeGroup", JSON.stringify(group));
    closeGroupsModal();
  }

  function clearActiveGroup() {
    activeGroup.value = null;
    localStorage.removeItem("activeGroup");
  }

  async function getGroups() {
    const authStore = useAuthStore();

    if (!authStore.user?.uid) return [];

    isLoading.value = true;

    try {
      const q = query(
        collection(db, "groups"),
        where("membersIds", "array-contains", authStore.user.uid),
      );

      const querySnapshot = await getDocs(q);

      groups.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } finally {
      isLoading.value = false;
    }
  }

  async function createGroup({ groupName, emails, color }) {
    const authStore = useAuthStore();
    const currentUserId = authStore.user.uid;
    const currentUserEmail = authStore.user.email;

    let memberObjects = [
      { id: currentUserId, name: authStore.user.displayName },
    ];

    if (emails && emails.length > 0) {
      const emailsToSearch = emails.filter(
        (email) => email !== currentUserEmail,
      );

      if (emailsToSearch.length > 0) {
        const usersQuery = query(
          collection(db, "users"),
          where("email", "in", emailsToSearch),
        );

        const querySnapshot = await getDocs(usersQuery);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();

          memberObjects.push({ id: doc.id, name: userData.name });
        });

        if (querySnapshot.size < emailsToSearch.length) {
          throw new Error(
            "Um ou mais e-mails digitados não possuem conta no aplicativo. Verifique a lista.",
          );
        }
      }
    }

    const newGroupPayload = {
      name: groupName,
      created_by: currentUserId,
      members: memberObjects,
      membersIds: memberObjects.map((member) => member.id),
      color: color,
      created_at: new Date(),
    };

    const groupRef = await addDoc(collection(db, "groups"), newGroupPayload);

    for (const member of memberObjects) {
      await updateDoc(doc(db, "users", member.id), {
        my_groups: arrayUnion(groupRef.id),
      });
    }

    const createdGroup = {
      id: groupRef.id,
      ...newGroupPayload,
    };

    groups.value.push(createdGroup);
    setActiveGroup(createdGroup);

    closeGroupsModal();
  }

  async function loadActiveGroupMembers() {
    if (!activeGroup.value || !activeGroup.value.membersIds) return;

    try {
      const q = query(
        collection(db, "users"),
        where("__name__", "in", activeGroup.value.membersIds),
      );

      const snapshot = await getDocs(q);

      const membersMap = {};
      snapshot.forEach((doc) => {
        membersMap[doc.id] = doc.data();
      });

      activeGroupMembers.value = membersMap;
    } catch (error) {
      console.error("Erro ao carregar membros do grupo:", error);
    }
  }

  return {
    getGroups,
    createGroup,
    groups,
    isGroupsModalOpen,
    openGroupsModal,
    closeGroupsModal,
    activeGroup,
    setActiveGroup,
    clearActiveGroup,
    loadActiveGroupMembers,
    activeGroupMembers,
  };
});
