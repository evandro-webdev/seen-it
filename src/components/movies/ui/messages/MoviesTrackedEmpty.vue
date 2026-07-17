<script setup>
import { computed } from "vue";
import { Bookmark, Clapperboard } from "@lucide/vue";
import { useGroupsStore } from "@/stores/groups";

const groupsStore = useGroupsStore();

defineProps({
  type: {
    type: String,
    required: true,
  },
});

const notSavedMessage = computed(() => {
  return groupsStore.activeGroup
    ? "Vocês não salvaram nenhum filme para assistir ainda. Que tal explorar a aba de descobrir e guardar algumas ideias?"
    : "Você não salvou nenhum filme para assistir ainda. Que tal explorar a aba de descobrir e guardar algumas ideias?";
});

const notWatchedMessage = computed(() => {
  return groupsStore.activeGroup
    ? "Vocês não avaliaram nenhum filme ainda. Que tal registrar o último filme que o grupo assistiu?"
    : "Você não avaliou nenhum filme ainda. Que tal registrar o último filme que você assistiu?";
});
</script>

<template>
  <div
    class="px-6 py-12 text-center flex-1 flex flex-col items-center justify-center animate-fade-in"
  >
    <div class="space-y-4 max-w-xs">
      <template v-if="type === 'saved'">
        <div
          class="mx-auto w-16 h-16 rounded-2xl border border-blue-50 dark:border-[#1a3154] bg-blue-50/50 dark:bg-[#162845]/30 flex items-center justify-center shadow-xs"
        >
          <Bookmark class="w-8 h-8 text-[#0088FF]" />
        </div>
        <div class="space-y-1.5">
          <h3 class="text-md font-semibold text-gray-800 dark:text-white">
            Lista de desejos vazia
          </h3>
          <p
            class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]"
          >
            {{ notSavedMessage }}
          </p>
        </div>
      </template>

      <template v-else-if="type === 'watched'">
        <div
          class="w-16 h-16 mx-auto rounded-2xl border border-blue-50 dark:border-[#1a3154] bg-blue-50/50 dark:bg-[#162845]/30 flex items-center justify-center shadow-xs"
        >
          <Clapperboard class="w-8 h-8 text-[#0088FF]" />
        </div>
        <div class="space-y-1.5">
          <h3 class="text-md font-semibold text-gray-800 dark:text-white">
            Nenhum filme avaliado
          </h3>
          <p
            class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]"
          >
            {{ notWatchedMessage }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
