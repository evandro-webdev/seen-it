<script setup>
import { ref, watch } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import { useToastStore } from "@/stores/toast.js";

import {
  ArrowLeft,
  AtSign,
  Check,
  Plus,
  Popcorn,
  UsersRound,
  X,
} from "@lucide/vue";

import BaseButton from "../ui/BaseButton.vue";

const emit = defineEmits(["closeForm"]);
const groupsStore = useGroupsStore();
const toastStore = useToastStore();

const colorOptions = [
  { primary: "#205FE2", secondary: "#29A4FF" },
  { primary: "#A23BD1", secondary: "#B27AF1" },
  { primary: "#2CA886", secondary: "#55C06E" },
  { primary: "#F7516A", secondary: "#FA818D" },
  { primary: "#FA7F39", secondary: "#F69F40" },
  { primary: "#613FE5", secondary: "#855CF4" },
];

const groupName = ref("");
const searchQuery = ref("");
const searchResults = ref([]);
const isSearching = ref(false);
const members = ref([]);
const selectedColor = ref(colorOptions[0]);

watch(searchQuery, async (newQuery) => {
  const cleanQuery = newQuery.trim();

  if (cleanQuery.length < 2) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  try {
    const results = await groupsStore.searchUsersByUsername(cleanQuery);
    searchResults.value = results.filter(
      (user) => !members.value.some((m) => m.uid === user.uid),
    );
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  } finally {
    isSearching.value = false;
  }
});

function selectUser(user) {
  if (!members.value.some((m) => m.uid === user.uid)) {
    members.value.push(user);
  }
  searchQuery.value = "";
  searchResults.value = [];
}

function removeMember(uid) {
  members.value = members.value.filter((item) => item.uid !== uid);
}

async function handleCreateGroup() {
  if (!groupName.value.trim()) return;

  try {
    await groupsStore.createGroup({
      groupName: groupName.value,
      invitedMembersIds: members.value.map((m) => m.uid),
      color: selectedColor.value,
    });

    groupName.value = "";
    members.value = [];
    searchQuery.value = "";

    toastStore.success(`Grupo ${groupName.value} criado com sucesso.`)
    emit("closeForm");
  } catch (error) {
    toastStore.error(`Erro ao criar grupo`)
    console.error("Erro ao criar grupo:", error.message);
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
        class="w-full p-4 pl-13.5 rounded-2xl border text-gray-900 placeholder-gray-400 dark:text-gray-300 border-gray-200 dark:border-[#242C3C] bg-gray-50 dark:bg-[#181f2f] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        placeholder="Digite o nome do grupo"
        required
      />
    </div>

    <div class="relative">
      <div class="relative">
        <AtSign
          stroke-width="1"
          class="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          v-model="searchQuery"
          type="text"
          class="w-full p-4 pl-13.5 rounded-2xl border text-gray-900 placeholder-gray-400 dark:text-gray-300 border-gray-200 dark:border-[#242C3C] bg-gray-50 dark:bg-[#181f2f] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Nome de usuário do participante"
        />
      </div>

      <div
        v-if="searchResults.length > 0"
        class="absolute z-20 left-0 right-0 max-h-56 mt-2 rounded-2xl border border-gray-200 dark:border-[#242C3C] bg-white dark:bg-[#181f2f] shadow-xl overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800"
      >
        <button
          v-for="user in searchResults"
          :key="user.uid"
          type="button"
          @click="selectUser(user)"
          class="w-full p-3 text-left transition-colors flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-full text-sm font-medium text-white flex items-center justify-center overflow-hidden"
              :style="{ backgroundColor: user.color || '#1D4776' }"
            >
              <img
                v-if="user.avatar_url"
                :src="user.avatar_url"
                :alt="user.name"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ user.name?.[0]?.toUpperCase() }}</span>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @{{ user.username }}
              </p>
            </div>
          </div>

          <Plus class="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div
        v-if="members.length"
        class="mt-3 flex flex-wrap gap-2"
      >
        <span
          v-for="member in members"
          :key="member.uid"
          class="py-1.5 pl-2 pr-3 rounded-xl text-sm border border-gray-200 dark:border-transparent text-gray-700 dark:text-white bg-gray-100 dark:bg-[#242C3C] flex items-center gap-2"
        >
          <div
            class="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center overflow-hidden"
            :style="{ backgroundColor: member.color || '#1D4776' }"
          >
            <img
              v-if="member.avatar_url"
              :src="member.avatar_url"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ member.name?.[0]?.toUpperCase() }}</span>
          </div>

          <span class="font-medium">{{ member.name }}</span>
          <span class="text-xs text-gray-400">(@{{ member.username }})</span>

          <button
            type="button"
            @click="removeMember(member.uid)"
            class="transition-colors ml-1"
          >
            <X class="w-4 h-4" />
          </button>
        </span>
      </div>
    </div>

    <div class="space-y-2.5">
      <label class="font-medium text-gray-700 dark:text-white block">
        Escolha a cor do grupo:
      </label>
      <div class="flex gap-2">
        <button
          v-for="(color, index) in colorOptions"
          @click="selectedColor = color"
          :key="index"
          type="button"
          class="w-8 h-8 rounded-full active:scale-95 flex items-center justify-center transition-transform"
          :style="{
            backgroundImage: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
          }"
        >
          <Check
            v-if="selectedColor.primary === color.primary"
            class="text-white w-4 h-4"
          />
        </button>
      </div>
    </div>

    <div class="flex gap-2 pt-2">
      <BaseButton
        label="Voltar"
        :icon="ArrowLeft"
        variant="ghost"
        size="md"
        type="button"
        @click="$emit('closeForm')"
      />

      <BaseButton
        label="Criar Grupo"
        :icon="UsersRound"
        variant="primary"
        size="lg"
        type="submit"
        block
      />
    </div>
  </form>
</template>
