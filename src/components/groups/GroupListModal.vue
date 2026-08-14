<script setup>
import { Frown, UsersRound, X } from "@lucide/vue";
import { ref, computed } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import { onClickOutside } from "@vueuse/core";
import { useModalHistory } from "@/composables/useModalHistory.js";

import GroupListItem from "./GroupListItem.vue";
import GroupCreateForm from "./GroupCreateForm.vue";
import GroupDetails from "./GroupDetails.vue";
import BaseButton from "../ui/BaseButton.vue";

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const groupsStore = useGroupsStore();
const groupModalRef = ref(null);

const currentView = ref("list");
const selectedGroupForDetails = ref(null);

const isModalOpen = computed(() => groupsStore.isGroupsModalOpen);
const { handleCloseClick } = useModalHistory(isModalOpen, () =>
  groupsStore.closeGroupsModal(),
);

onClickOutside(groupModalRef, () => {
  groupsStore.closeGroupsModal();
});

function handleOpenDetails(group) {
  selectedGroupForDetails.value = group;
  currentView.value = "details";
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
        ref="groupModalRef"
        class="w-full py-6 px-4 bg-white dark:bg-[#121825] rounded-t-2xl overflow-y-auto space-y-6 modal-content max-h-[85vh]"
      >
        <div
          v-if="currentView !== 'details'"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-2xl bg-blue-50 dark:bg-[#273056] shrink-0">
              <UsersRound class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h2
                class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                {{ currentView === "list" ? "Seus grupos" : "Criar grupo" }}
              </h2>
              <span
                v-if="currentView === 'list'"
                class="text-xs font-medium text-gray-500 dark:text-[#9EB2CD]"
              >
                {{ groups.length }}
                {{ groups.length === 1 ? "grupo" : "grupos" }}
              </span>
            </div>
          </div>

          <button
            @click="handleCloseClick"
            type="button"
            class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#222838] dark:hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Fechar"
          >
            <X class="w-5 h-5 text-gray-600 dark:text-[#A7B0C9]" />
          </button>
        </div>

        <div v-if="currentView === 'list'">
          <div
            v-if="groups.length > 0"
            class="space-y-4"
          >
            <GroupListItem
              v-for="group in groups"
              :key="group.id"
              :group="group"
              @open-details="handleOpenDetails"
            />
          </div>

          <div
            v-else
            class="flex flex-col items-center gap-2.5 py-6"
          >
            <div class="p-6 rounded-full bg-gray-100 dark:bg-[#222838]">
              <Frown class="w-12 h-12 text-gray-500 dark:text-[#aab6d8]" />
            </div>
            <p
              class="text-center text-sm max-w-sm text-gray-600 dark:text-gray-300"
            >
              Você não possui nenhum grupo, clique no botão abaixo para criar um
              novo grupo
            </p>
          </div>
        </div>

        <GroupCreateForm
          v-else-if="currentView === 'create'"
          @close-form="resetView"
        />

        <GroupDetails
          v-else-if="currentView === 'details' && selectedGroupForDetails"
          :group="selectedGroupForDetails"
          @back="resetView"
        />

        <BaseButton
          v-if="currentView === 'list'"
          @click="currentView = 'create'"
          label="Novo Grupo"
          :icon="UsersRound"
          variant="primary"
          size="lg"
          block
        />
      </div>
    </div>
  </Transition>
</template>
