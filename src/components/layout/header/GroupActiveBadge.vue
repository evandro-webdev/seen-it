<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups";
import { useToastStore } from "@/stores/toast";
import { getGroupTheme } from "@/constants/colors.js";

import { FolderHeart, X } from "@lucide/vue";

const groupsStore = useGroupsStore();
const toastStore = useToastStore();

const groupTheme = computed(() => {
  return getGroupTheme(groupsStore.activeGroup?.theme);
});

function handleCloseGroup() {
  toastStore.success(`Fechou o grupo: ${groupsStore.activeGroup.name}`);
  groupsStore.clearActiveGroup();
}
</script>

<template>
  <div
    v-if="groupsStore.activeGroup"
    class="py-1 px-3 rounded-full border text-xs font-semibold flex items-center gap-1.5"
    :style="{
      backgroundColor: groupTheme.primary + '1F',
      borderColor: groupTheme.primary + '40',
      color: groupTheme.primary,
    }"
  >
    <FolderHeart class="w-3.5 h-3.5" />
    <span>{{ groupsStore.activeGroup.name }}</span>

    <button
      @click.stop="handleCloseGroup"
      class="ml-1 p-0.5 rounded-full"
    >
      <X class="w-3 h-3" />
    </button>
  </div>
</template>
