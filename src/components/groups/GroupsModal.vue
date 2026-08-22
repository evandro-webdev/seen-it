<script setup>
import { UsersRound } from "@lucide/vue";
import { ref, computed } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import { onClickOutside } from "@vueuse/core";
import { useModalHistory } from "@/composables/useModalHistory.js";

import GroupCreateForm from "./GroupCreateForm.vue";
import GroupDetails from "./GroupDetails.vue";
import GroupList from "./GroupList.vue";
import ModalHeader from "../ui/ModalHeader.vue";

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const groupsStore = useGroupsStore();
const groupsModalRef = ref(null);

const currentView = ref("list");
const selectedGroupForDetails = ref(null);

const isModalOpen = computed(() => groupsStore.isGroupsModalOpen);
const { handleCloseClick } = useModalHistory(isModalOpen, () =>
  groupsStore.closeGroupsModal(),
);

onClickOutside(groupsModalRef, () => {
  groupsStore.closeGroupsModal();
});

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

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}
</script>

<template>
  <Transition
    name="modal"
    appear
    @enter="lockScroll"
    @after-leave="
      unlockScroll();
      resetView();
    "
  >
    <div
      v-if="groupsStore.isGroupsModalOpen"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end"
    >
      <div
        ref="groupsModalRef"
        class="w-full py-6 px-4 bg-white dark:bg-[#121825] rounded-t-2xl overflow-y-auto space-y-6 modal-content max-h-[85vh]"
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
          @close="handleCloseClick"
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
      </div>
    </div>
  </Transition>
</template>
