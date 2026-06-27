<script setup>
import { Check, Frown, Plus, Popcorn, Users, UsersRound, X } from "@lucide/vue";
import GroupListItem from "./GroupListItem.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useGroupsStore } from "../../stores/groups.js";

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

const colorOptions = [
  { primary: "#205FE2", secondary: "#29A4FF" },
  { primary: "#A23BD1", secondary: "#B27AF1" },
  { primary: "#2CA886", secondary: "#55C06E" },
  { primary: "#F7516A", secondary: "#FA818D" },
  { primary: "#FA7F39", secondary: "#F69F40" },
  { primary: "#613FE5", secondary: "#855CF4" },
];

const groupName = ref("");
const members = ref([]);
const selectedColor = ref(colorOptions[0]);
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
          v-if="groups.length"
          class="space-y-2.5"
        >
          <GroupListItem />
          <GroupListItem />
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

      <div v-else>
        <form
          action=""
          class="space-y-5"
        >
          <div class="relative">
            <Popcorn
              stroke-width="1"
              class="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              v-model="groupName"
              class="w-full p-4 pl-13.5 rounded-2xl border text-[#9EB2CD] dark:text-gray-300 border-[#242C3C] bg-[#F7F7F7] dark:bg-[#181f2f] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Digite o nome do grupo"
            />
          </div>

          <div class="space-y-2.5">
            <div class="relative">
              <Users
                stroke-width="1"
                class="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="email"
                class="w-full p-4 pl-13.5 rounded-2xl border text-[#9EB2CD] dark:text-gray-300 border-[#242C3C] bg-[#F7F7F7] dark:bg-[#181f2f] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Digite o email do participante"
              />
              <button
                type="button"
                class="absolute right-5 top-1/2 -translate-y-1/2"
              >
                <Plus class="w-5 h-5 text-[#A7B0C9]" />
              </button>
            </div>

            <div class="flex flex-wrap gap-2.5">
              <span class="py-1 px-3 rounded-xl text-sm text-white bg-[#242C3C]"
                >john@email.com</span
              >
              <span class="py-1 px-3 rounded-xl text-sm text-white bg-[#242C3C]"
                >jane@email.com</span
              >
              <span class="py-1 px-3 rounded-xl text-sm text-white bg-[#242C3C]"
                >evandro@email.com</span
              >
            </div>
          </div>

          <div class="space-y-2.5">
            <label class="font-medium text-white block"
              >Escolha a cor do grupo:
            </label>
            <div class="flex gap-2">
              <button
                v-for="(color, index) in colorOptions"
                @click="selectedColor = color"
                :key="index"
                type="button"
                class="w-8 h-8 rounded-full active:scale-95 flex items-center justify-center"
                :style="{
                  backgroundImage: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
                }"
              >
                <Check
                  v-if="selectedColor.primary === color.primary"
                  class="text-white"
                />
              </button>
            </div>
          </div>
        </form>
      </div>

      <button
        @click="showCreateGroupForm = true"
        class="w-full py-2 px-3 rounded-lg text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2"
      >
        <UsersRound class="w-4 h-4" />
        <span class="font-medium text-nowrap">Novo Grupo</span>
      </button>
    </div>
  </div>
</template>
