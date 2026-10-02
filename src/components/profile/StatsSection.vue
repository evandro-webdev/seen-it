<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups";

import { Film, Users, CheckCircle2 } from "@lucide/vue";

const groupsStore = useGroupsStore();

const totalWatched = computed(() => {
  return groupsStore.groups.reduce((acc, group) => {
    return acc + (group.total_watched || 0);
  }, 0);
});

const totalSaved = computed(() => {
  return groupsStore.groups.reduce((acc, group) => {
    return acc + (group.total_saved || 0);
  }, 0);
});

// TODO: Exibir dados verdadeiros e reativos
const stats = computed(() => [
  {
    label: "Assistidos",
    value: totalWatched.value,
    icon: Film,
    color: "text-[#0088FF]",
  },
  {
    label: "Salvos",
    value: totalSaved.value,
    icon: CheckCircle2,
    color: "text-amber-500",
  },
  {
    label: "Grupos",
    value: groupsStore.groups.length,
    icon: Users,
    color: "text-emerald-500",
  },
]);
</script>

<template>
  <section class="grid grid-cols-3 gap-3">
    <div
      v-for="item in stats"
      :key="item.label"
      class="p-3 bg-gray-100 dark:bg-[#1A1F33] rounded-2xl flex flex-col items-center justify-center text-center space-y-1"
    >
      <component
        :is="item.icon"
        class="w-4 h-4"
        :class="item.color"
      />
      <span
        class="text-lg font-bold text-gray-900 dark:text-white leading-none"
      >
        {{ item.value }}
      </span>
      <span
        class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
      >
        {{ item.label }}
      </span>
    </div>
  </section>
</template>
