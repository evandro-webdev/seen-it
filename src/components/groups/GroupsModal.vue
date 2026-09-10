<script setup>
import { ref, computed } from "vue";
import { UsersRound } from "@lucide/vue";
import { useGroupsStore } from "@/stores/groups.js";

import BaseModal from "../ui/BaseModal.vue";
import ModalHeader from "../ui/ModalHeader.vue";
import GroupCreateForm from "./GroupCreateForm.vue";
import GroupDetails from "./GroupDetails.vue";
import GroupList from "./GroupList.vue";

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const groupsStore = useGroupsStore();

const currentView = ref("list");
const selectedGroupForDetails = ref(null);

const isModalOpen = computed(() => groupsStore.isGroupsModalOpen);

function handleClose() {
  groupsStore.closeGroupsModal();
}

function navigateTo(view, group = null) {
  selectedGroupForDetails.value = group;
  currentView.value = view;
}

function handleOpenDetails(group) {
  navigateTo("details", group);
}

function resetView() {
  currentView.value = "list";
  selectedGroupForDetails.value = null;
}
</script>

<template>
  <BaseModal
    :is-open="isModalOpen"
    @close="handleClose"
    @after-leave="resetView"
  >
    <ModalHeader
      v-if="currentView !== 'details'"
      :title="currentView === 'list' ? 'Seus grupos' : 'Criar grupo'"
      :subtitle="
        currentView === 'list'
          ? `${groups.length} ${groups.length === 1 ? 'grupo' : 'grupos'}`
          : ''
      "
      :icon="UsersRound"
      @close="handleClose"
    />

    <Transition
      name="fade"
      mode="out-in"
    >
      <GroupList
        v-if="currentView === 'list'"
        :groups="groups"
        key="list"
        @open-details="handleOpenDetails"
        @create-group="currentView = 'create'"
      />

      <GroupCreateForm
        v-else-if="currentView === 'create'"
        key="create"
        @close-form="resetView"
      />

      <GroupDetails
        v-else-if="currentView === 'details' && selectedGroupForDetails"
        key="details"
        :group="selectedGroupForDetails"
        @back="resetView"
      />
    </Transition>
  </BaseModal>
</template>
