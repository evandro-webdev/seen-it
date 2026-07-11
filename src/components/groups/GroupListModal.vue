<script setup>
import { Frown, UsersRound, X } from "@lucide/vue";
import GroupListItem from "./GroupListItem.vue";
import { ref } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import GroupCreateForm from "./GroupCreateForm.vue";
import { onClickOutside } from "@vueuse/core";

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const groupModalRef = ref(null);
const groupsStore = useGroupsStore();
const showCreateGroupForm = ref(false);

onClickOutside(groupModalRef, () => {
  groupsStore.closeGroupsModal();
});

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
    @after-leave="(unlockScroll, (showCreateGroupForm = false))"
  >
    <div
      v-if="groupsStore.isGroupsModalOpen"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end"
    >
      <div
        ref="groupModalRef"
        class="w-full py-6 px-4 bg-white dark:bg-[#121825] rounded-t-2xl overflow-y-auto space-y-8 modal-content"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="p-4 rounded-full bg-blue-50 dark:bg-[#273056]">
              <UsersRound class="w-7 h-7 text-blue-600 dark:text-white" />
            </div>
            <div>
              <h2 class="text-3xl font-semibold text-gray-900 dark:text-white">
                {{ !showCreateGroupForm ? "Seus grupos" : "Criar grupo" }}
              </h2>
              <span
                v-if="!showCreateGroupForm"
                class="text-gray-500 dark:text-[#9EB2CD]"
              >
                {{ groups.length }} grupos
              </span>
            </div>
          </div>

          <button
            @click="groupsStore.closeGroupsModal"
            type="button"
            class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#222838] dark:hover:bg-slate-800 active:scale-98 transition-colors"
          >
            <X class="text-gray-600 dark:text-[#A7B0C9]" />
          </button>
        </div>

        <div v-if="!showCreateGroupForm">
          <div
            v-if="groups.length > 0"
            class="space-y-2.5"
          >
            <GroupListItem
              v-for="group in groups"
              :key="group.id"
              :group="group"
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
          v-else
          @close-form="showCreateGroupForm = false"
        />

        <button
          v-if="!showCreateGroupForm"
          @click="showCreateGroupForm = true"
          class="w-full py-3 px-3 rounded-xl text-white bg-[#0088FF] hover:bg-blue-600 active:scale-99 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/10"
        >
          <UsersRound class="w-5 h-5" />
          <span class="font-medium text-nowrap">Novo Grupo</span>
        </button>
      </div>
    </div>
  </Transition>
</template>
