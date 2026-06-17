<script setup>
import { BookHeart, Compass, Bookmark } from "@lucide/vue";
import NavButton from "./navigation/NavButton.vue";

const currentTab = defineModel();
</script>

<template>
  <nav
    id="navigation-bar"
    class="fixed bottom-4 p-1 inset-x-4 rounded-lg border border-gray-200 dark:border-[#292B37] bg-white dark:bg-[#0F111D] shadow-sm flex gap-2"
  >
    <NavButton
      @click="currentTab = 'watched'"
      :current-tab="currentTab === 'watched'"
      :icon="BookHeart"
      label="Assistidos"
    />

    <NavButton
      @click="currentTab = 'discover'"
      :current-tab="currentTab === 'discover'"
      :icon="Compass"
      label="Descobrir"
    />

    <NavButton
      @click="currentTab = 'saved'"
      :current-tab="currentTab === 'saved'"
      :icon="Bookmark"
      label="Salvos"
    />
  </nav>
</template>
