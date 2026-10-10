<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups";
import { useAuthStore } from "@/stores/auth";
import { getGroupTheme } from "@/constants/colors.js";

import { ChevronDown } from "@lucide/vue";

const groupsStore = useGroupsStore();
const authStore = useAuthStore();

const groupTheme = computed(() => {
  if (!groupsStore.activeGroup?.theme) return null;
  return getGroupTheme(groupsStore.activeGroup.theme);
});

const activeGroupName = computed(() => {
  return groupsStore.activeGroup?.name || "Meus Filmes";
});
</script>

<template>
  <template v-if="authStore.isAuthenticated">
    <div
      v-if="groupsStore.isLoading"
      class="flex items-center gap-2 px-2 py-1.5 rounded-xl animate-pulse select-none"
    >
      <div
        class="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0"
      />

      <div class="h-5 w-18 bg-gray-300 dark:bg-gray-700 rounded-md shrink-0" />

      <div class="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded shrink-0" />
    </div>

    <button
      v-else
      type="button"
      @click="groupsStore.openGroupsModal"
      class="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-transform duration-100 active:scale-95 select-none"
    >
      <div
        class="w-2.5 h-2.5 rounded-full shrink-0"
        :style="{
          backgroundColor: groupTheme?.primary || '#90a1b9',
        }"
      />

      <span
        class="font-bold text-base tracking-tight text-gray-900 dark:text-gray-100"
      >
        {{ activeGroupName }}
      </span>

      <ChevronDown class="w-4 h-4 text-gray-400 shrink-0" />
    </button>
  </template>
</template>
