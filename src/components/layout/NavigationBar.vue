<script setup>

import { BookHeart, Compass, Bookmark } from "@lucide/vue";

defineProps({
  currentTab: {
    type: String,
    required: true,
  },
});

const currentTab = defineModel();
</script>

<template>
  <nav
    id="navigation-bar"
    class="fixed bottom-4 p-1 inset-x-4 rounded-lg border border-gray-200 bg-white shadow-sm flex gap-2"
  >
    <button
      class="py-[10px] px-[5px] flex flex-1 justify-center items-center gap-2"
      :class="{
        'text-[#0088FF]': currentTab === 'watched',
        'text-gray-400': currentTab !== 'watched',
      }"
      @click="currentTab = 'watched'"
    >
      <BookHeart class="w-4 h-4" />

      <span class="text-sm font-medium text-nowrap">Meus filmes</span>
    </button>

    <button
      class="py-[10px] px-[5px] flex flex-1 justify-center items-center gap-2"
      :class="{
        'text-[#0088FF]': currentTab === 'discover',
        'text-gray-400': currentTab !== 'discover',
      }"
      @click="currentTab = 'discover'"
    >
      <Compass class="w-4 h-4" />

      <span class="text-sm font-medium text-nowrap">Descobrir</span>
    </button>

    <button
      class="py-[10px] px-[5px] flex flex-1 justify-center items-center gap-2"
      :class="{
        'text-[#0088FF]': currentTab === 'saved',
        'text-gray-400': currentTab !== 'saved',
      }"
      @click="currentTab = 'saved'"
    >
      <Bookmark class="w-4 h-4" />

      <span class="text-sm font-medium text-nowrap">Salvos</span>
    </button>
  </nav>
</template>
