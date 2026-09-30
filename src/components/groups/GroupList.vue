<script setup>
import { useGroupsStore } from "@/stores/groups.js";

import { Check, Frown, User, UsersRound } from "@lucide/vue";

import GroupListItem from "./GroupListItem.vue";
import BaseButton from "../ui/BaseButton.vue";

const groupsStore = useGroupsStore();
const groups = groupsStore.groups;

const emit = defineEmits(["open-details", "create-group"]);

function handleSelectPersonalList() {
  groupsStore.clearActiveGroup();
  groupsStore.closeGroupsModal();
}
</script>

<template>
  <div class="space-y-6">
    <div
      @click="handleSelectPersonalList"
      class="px-3 py-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center relative active:scale-[0.99]"
      :class="[
        !groupsStore.activeGroup
          ? 'border-blue-500/50 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-500/40'
          : 'border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F]',
      ]"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="p-3 rounded-2xl shrink-0 flex items-center justify-center text-white relative bg-gradient-to-br from-blue-500 to-indigo-600"
        >
          <User class="w-5 h-5" />
        </div>

        <div class="min-w-0">
          <h3
            class="text-base font-bold text-gray-900 dark:text-white truncate"
          >
            Meus Filmes
          </h3>
          <p class="text-xs text-gray-500 dark:text-[#ABB3C3]">
            Sua biblioteca pessoal
          </p>
        </div>
      </div>

      <span
        v-if="!groupsStore.activeGroup"
        class="absolute -bottom-3 left-4 px-2 py-0.5 rounded-full border text-[10px] font-bold border-blue-500/50 dark:border-blue-500/40 bg-blue-50/40 dark:bg-[#131b2e] text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0"
      >
        <Check class="w-3 h-3" /> Ativo
      </span>
    </div>

    <div class="flex items-center gap-3">
      <div class="h-px flex-1 bg-gray-200 dark:bg-[#242C3C]" />
      <span
        class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
      >
        Seus Grupos ({{ groups.length }})
      </span>
      <div class="h-px flex-1 bg-gray-200 dark:bg-[#242C3C]" />
    </div>

    <div
      v-if="groups.length > 0"
      class="space-y-4"
    >
      <GroupListItem
        v-for="group in groups"
        :key="group.id"
        :group="group"
        @open-details="$emit('open-details', group)"
      />
    </div>

    <div
      v-else
      class="flex flex-col items-center gap-2.5 py-6"
    >
      <div class="p-6 rounded-full bg-gray-100 dark:bg-[#222838]">
        <Frown class="w-12 h-12 text-gray-500 dark:text-[#aab6d8]" />
      </div>
      <p class="text-center text-sm max-w-sm text-gray-600 dark:text-gray-300">
        Você não possui nenhum grupo, clique no botão abaixo para criar um novo
        grupo
      </p>
    </div>

    <BaseButton
      @click="$emit('create-group')"
      label="Novo Grupo"
      :icon="UsersRound"
      variant="primary"
      size="lg"
      block
    />
  </div>
</template>
