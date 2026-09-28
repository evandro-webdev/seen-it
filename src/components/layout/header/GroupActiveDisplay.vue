<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups";
import { getGroupTheme } from "@/constants/colors.js";

import { ChevronDown, Users } from "@lucide/vue";

const groupsStore = useGroupsStore();

const groupTheme = computed(() => {
  if (!groupsStore.activeGroup?.theme) return null;
  return getGroupTheme(groupsStore.activeGroup.theme);
});

const activeGroupName = computed(() => {
  return groupsStore.activeGroup?.name || "Meus Filmes";
});
</script>

<template>
  <button
    type="button"
    @click="groupsStore.openGroupsModal"
    class="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-transform duration-100 active:scale-95 select-none"
  >
    <div
      v-if="groupsStore.activeGroup"
      class="w-2.5 h-2.5 rounded-full shrink-0"
      :style="{
        backgroundColor: groupTheme?.primary || '#0088FF',
      }"
    />

    <Users
      v-else
      class="w-4 h-4 text-gray-400 shrink-0"
    />

    <span
      class="font-bold text-base tracking-tight text-gray-900 dark:text-gray-100"
    >
      {{ activeGroupName }}
    </span>

    <ChevronDown class="w-4 h-4 text-gray-400 shrink-0" />
  </button>
</template>
