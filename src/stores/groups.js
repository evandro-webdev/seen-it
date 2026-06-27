import { defineStore } from "pinia";
import {
  addDoc,
  collection,
  db,
  getDocs,
  updateDoc,
} from "../services/firebase";
import { useAuthStore } from "./auth.js";
import { ref } from "vue";

export const useGroupsStore = defineStore("groups", () => {
  const groups = ref([]);
  const isGroupsModalOpen = ref(false);

  function openGroupsModal() {
    isGroupsModalOpen.value = true;
  }

  function closeGroupsModal() {
    isGroupsModalOpen.value = false;
  }

  async function getGroups() {
    const authStore = useAuthStore();

    if (!authStore.user?.uid) return [];

    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", authStore.user.uid),
    );
    const querySnapshot = await getDocs(q);

    groups.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async function createGroup(groupName, members) {
    const authStore = useAuthStore();
    const currentUserId = authStore.user.uid;

    if (!members.includes(currentUserId)) {
      members.push(currentUserId);
    }

    const groupRef = await addDoc(collection(db, "groups"), {
      name: groupName,
      created_by: currentUserId,
      members: members,
      created_at: new Date(),
    });

    const newGroupId = groupRef.id;

    const userRef = doc(db, "users", currentUserId);
    await updateDoc(userRef, {
      my_groups: arrayUnion(newGroupId),
    });

    for (const memberId of members) {
      if (memberId !== currentUserId) {
        await updateDoc(doc(db, "users", memberId), {
          my_groups: arrayUnion(newGroupId),
        });
      }
    }

    return newGroupId;
  }

  return {
    getGroups,
    createGroup,
    groups,
    isGroupsModalOpen,
    openGroupsModal,
    closeGroupsModal,
  };
});
