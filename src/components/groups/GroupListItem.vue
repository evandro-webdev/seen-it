<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import { useToastStore } from "@/stores/toast";

import { Bookmark, Check, Eye, MoreVertical, UsersRound } from "@lucide/vue";

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["openDetails"]);
const groupsStore = useGroupsStore();
const toastStore = useToastStore();

const isActive = computed(() => groupsStore.activeGroup?.id === props.group.id);

function handleSelectGroup() {
  groupsStore.setActiveGroup(props.group);
  groupsStore.closeGroupsModal();
  toastStore.success(`Entrou em: ${props.group.name}`);
}

function handleOpenMenu(event) {
  event.stopPropagation();
  emit("openDetails", props.group);
}
</script>

<template>
  <div
    @click="handleSelectGroup"
    class="px-3 py-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center relative"
    :class="[
      isActive
        ? 'border-blue-500/50 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-500/40'
        : 'border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F] hover:border-gray-200 dark:hover:border-slate-700',
    ]"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div
        class="p-3 rounded-2xl shrink-0 flex items-center justify-center text-white"
        :style="{
          backgroundImage: `linear-gradient(135deg, ${group.color?.primary || '#205FE2'}, ${group.color?.secondary || '#29A4FF'})`,
        }"
      >
        <UsersRound class="w-5 h-5" />
      </div>

      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h3
            class="text-base font-bold text-gray-900 dark:text-white truncate"
          >
            {{ group.name }}
          </h3>
        </div>

        <p class="text-xs text-gray-500 dark:text-[#ABB3C3]">
          {{ group.members?.length || 0 }}
          {{ group.members?.length === 1 ? "participante" : "participantes" }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3 pl-2 shrink-0">
      <div
        class="flex items-center gap-2 text-xs font-semibold"
        :style="{ color: `${group.color?.secondary || '#29A4FF'}` }"
      >
        <div
          class="flex items-center gap-1"
          title="Assistidos"
        >
          <Eye class="w-3.5 h-3.5" />
          <span>{{ group.total_watched || 0 }}</span>
        </div>
        <div
          class="flex items-center gap-1"
          title="Salvos"
        >
          <Bookmark class="w-3.5 h-3.5" />
          <span>{{ group.total_saved || 0 }}</span>
        </div>
      </div>

      <button
        type="button"
        @click="handleOpenMenu"
        class="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:text-[#A4ADC5] dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-slate-700/50 transition-colors"
        title="Opções do grupo"
      >
        <MoreVertical class="w-5 h-5" />
      </button>
    </div>

    <span
      v-if="isActive"
      class="absolute -bottom-3 px-2 py-0.5 rounded-full border text-[10px] font-bold border-blue-500/50 dark:border-blue-500/40 bg-blue-50/40 dark:bg-[#131b2e] text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0"
    >
      <Check class="w-3 h-3" /> Ativo
    </span>
  </div>
</template>
