import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./auth.js";
import { useNotificationsStore } from "./notifications";
import { createGroupSchema } from "@/schemas/group.schema";
import {
  createGroupsListener,
  fetchGroupMembers,
  createGroupDocument,
  searchUsersByUsernameQuery,
  deleteGroupDocument,
} from "@/services/groupService.js";

export const useGroupsStore = defineStore("groups", () => {
  const groups = ref([]);
  const activeGroupId = ref(getInitialActiveGroupId());
  const activeGroupMembers = ref({});

  const isGroupsModalOpen = ref(false);
  const isLoading = ref(false);

  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();

  let unsubscribeListener = null;

  const activeGroup = computed(() => {
    if (!activeGroupId.value) return null;
    return groups.value.find((g) => g.id === activeGroupId.value) || null;
  });

  function getInitialActiveGroupId() {
    return localStorage.getItem("activeGroupId");
  }

  function setActiveGroup(group) {
    if (!group) {
      clearActiveGroup();
      return;
    }

    activeGroupId.value = group.id;
    localStorage.setItem("activeGroupId", group.id);
    loadGroupMembers();
  }

  function clearActiveGroup() {
    activeGroupId.value = null;
    activeGroupMembers.value = {};
    localStorage.removeItem("activeGroupId");
  }

  function openGroupsModal() {
    isGroupsModalOpen.value = true;
  }
  function closeGroupsModal() {
    isGroupsModalOpen.value = false;
  }

  function stopListeners() {
    if (unsubscribeListener) {
      unsubscribeListener();
      unsubscribeListener = null;
    }
  }

  function setupListeners() {
    stopListeners();

    isLoading.value = true;

    unsubscribeListener = createGroupsListener(
      authStore.user?.uid,
      (updatedGroups) => {
        groups.value = updatedGroups;
        isLoading.value = false;

        if (activeGroupId.value) {
          loadGroupMembers();
        }
      },
      (error) => {
        console.error("Erro ao buscar grupos do usuário:", error);
        isLoading.value = false;
      },
    );
  }

  async function loadGroupMembers(targetMemberIds = null) {
    const memberIds = targetMemberIds ?? activeGroup.value?.members;

    try {
      const membersMap = await fetchGroupMembers(memberIds);
      if (!targetMemberIds) activeGroupMembers.value = membersMap;
      return membersMap;
    } catch (error) {
      console.error("Erro ao carregar membros do grupo:", error);
      return {};
    }
  }

  async function createGroup(payload) {
    const parseResult = createGroupSchema.safeParse(payload);
    
    if (!parseResult.success) {
      throw new Error("Dados inválidos. Tente novamente.");
    }

    const { group, invitedMembersIds } = await createGroupDocument(
      parseResult.data,
      authStore.user?.uid,
    );

    await notificationsStore.dispatchCreatedGroupNotification(
      group,
      invitedMembersIds,
    );

    setActiveGroup(group);
    closeGroupsModal();
  }

  // todo: extract to another store or composable
  async function searchUsersByUsername(searchQuery) {
    return searchUsersByUsernameQuery(searchQuery, authStore.user?.uid);
  }

  async function deleteGroup(groupId) {
    const targetGroup = groups.value.find((g) => g.id === groupId);

    if (!targetGroup) {
      throw new Error("Grupo não encontrado.");
    }

    await deleteGroupDocument(groupId, targetGroup, authStore.user?.uid);

    if (activeGroup.value?.id === groupId) clearActiveGroup();
  }

  return {
    groups,
    isGroupsModalOpen,
    activeGroup,
    isLoading,
    activeGroupMembers,
    openGroupsModal,
    closeGroupsModal,
    setupListeners,
    stopListeners,
    createGroup,
    deleteGroup,
    setActiveGroup,
    clearActiveGroup,
    loadGroupMembers,
    searchUsersByUsername,
  };
});
