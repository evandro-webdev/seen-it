<script setup>
import { Frown, UsersRound, X } from "@lucide/vue";
import GroupListItem from "./GroupListItem.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useGroupsStore } from "../../stores/groups.js";
import GroupCreateForm from "./GroupCreateForm.vue";

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

const groupsStore = useGroupsStore();
const showCreateGroupForm = ref(false);

</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-center items-end"
  >
    <div
      class="w-full py-6 px-4 bg-white dark:bg-[#121825] rounded-t-2xl overflow-y-auto space-y-8"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="p-4 rounded-full bg-[#273056]">
            <UsersRound class="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 class="text-3xl font-semibold text-white">
              {{ !showCreateGroupForm ? "Seus grupos" : "Criar grupo" }}
            </h2>
            <span
              v-if="!showCreateGroupForm"
              class="text-[#9EB2CD]"
              >{{ groups.length }} grupos</span
            >
          </div>
        </div>

        <button
          @click="groupsStore.closeGroupsModal"
          type="button"
          class="p-1.5 rounded-full bg-[#222838] active:scale-98"
        >
          <X class="text-[#A7B0C9]" />
        </button>
      </div>

      <div v-if="!showCreateGroupForm">
        <div
          v-if="groups.length > 0"
          class="space-y-2.5"
        >
          <GroupListItem v-for="group in groups" :group="group"/>
        </div>

        <div
          v-else
          class="flex flex-col items-center gap-2.5"
        >
          <div class="p-8.5 rounded-full bg-[#222838]">
            <Frown class="w-17 h-17 text-[#aab6d8]" />
          </div>
          <p class="text-center text-white">
            Você não possui nenhum grupo, clique no botão abaixo para criar um
            novo grupo
          </p>
        </div>
      </div>

      <GroupCreateForm v-else @close-form="showCreateGroupForm = false" />

      <button
        v-if="!showCreateGroupForm"
        @click="showCreateGroupForm = true"
        class="w-full py-2 px-3 rounded-lg text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2"
      >
        <UsersRound class="w-4 h-4" />
        <span class="font-medium text-nowrap">Novo Grupo</span>
      </button>
    </div>
  </div>
</template>
