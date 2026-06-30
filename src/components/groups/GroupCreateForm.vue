<script setup>
import { useGroupsStore } from "../../stores/groups.js";
import {
  ArrowLeft,
  Check,
  Plus,
  Popcorn,
  Users,
  UsersRound,
  X,
} from "@lucide/vue";
import { ref } from "vue";

const groupsStore = useGroupsStore();

const colorOptions = [
  { primary: "#205FE2", secondary: "#29A4FF" },
  { primary: "#A23BD1", secondary: "#B27AF1" },
  { primary: "#2CA886", secondary: "#55C06E" },
  { primary: "#F7516A", secondary: "#FA818D" },
  { primary: "#FA7F39", secondary: "#F69F40" },
  { primary: "#613FE5", secondary: "#855CF4" },
];

const groupName = ref("");
const currentMember = ref("");
const members = ref([]);
const selectedColor = ref(colorOptions[0]);

function addMember() {
  const email = currentMember.value.trim().toLowerCase();

  if (email && email.includes("@") && !members.value.includes(email)) {
    members.value.push(email);
    currentMember.value = "";
  }
}

function removeMember(member) {
  members.value = members.value.filter((item) => item !== member);
}

async function handleCreateGroup() {
  if (!groupName.value.trim()) return;

  try {
    await groupsStore.createGroup({
      groupName: groupName.value,
      emails: members.value,
      color: selectedColor.value,
    });

    groupName.value = "";
    members.value = [];
    groupsStore.closeGroupsModal();
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <form
    @submit.prevent="handleCreateGroup"
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
          v-model="currentMember"
          type="email"
          class="w-full p-4 pl-13.5 rounded-2xl border text-[#9EB2CD] dark:text-gray-300 border-[#242C3C] bg-[#F7F7F7] dark:bg-[#181f2f] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Digite o email do participante"
        />
        <button
          @click="addMember"
          type="button"
          class="absolute right-5 top-1/2 -translate-y-1/2"
        >
          <Plus class="w-5 h-5 text-[#A7B0C9]" />
        </button>
      </div>

      <div class="flex flex-wrap gap-2.5">
        <span
          v-for="member in members"
          :key="member"
          class="py-1 px-3 rounded-xl text-sm text-white bg-[#242C3C] flex items-center gap-2"
        >
          {{ member }}
          <button
            type="button"
            @click="removeMember(member)"
          >
            <X class="w-4" />
          </button>
        </span>
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

    <div class="flex gap-2">
      <button
        @click="$emit('closeForm')"
        type="button"
        class="py-2 px-4 rounded-lg text-white hover:bg-gray-100 dark:hover:bg-[#314066] flex justify-center items-center gap-2"
      >
        <ArrowLeft class="w-4 h-4" />
        <span class="font-medium text-nowrap">Voltar</span>
      </button>

      <button
        class="w-full py-2 px-3 rounded-lg text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2"
      >
        <UsersRound class="w-4 h-4" />
        <span class="font-medium text-nowrap">Novo Grupo</span>
      </button>
    </div>
  </form>
</template>
