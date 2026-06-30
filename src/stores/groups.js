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
  arrayUnion
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

  async function createGroup({ groupName, emails, color }) {
    const authStore = useAuthStore();
    const currentUserId = authStore.user.uid;
    const currentUserEmail = authStore.user.email;

    let memberIds = [currentUserId];

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
          memberIds.push(doc.id);
        });

        if (querySnapshot.length < emailsToSearch.length) {
          throw new Error(
            "Um ou mais e-mails digitados não possuem conta no aplicativo. Verifique a lista.",
          );
        }
      }
    }

    const groupRef = await addDoc(collection(db, "groups"), {
      name: groupName,
      created_by: currentUserId,
      members: memberIds,
      color: color,
      created_at: new Date(),
    });

    const newGroupId = groupRef.id;

    for (const memberId of memberIds) {
      await updateDoc(doc(db, "users", memberId), {
        my_groups: arrayUnion(newGroupId),
      });
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
