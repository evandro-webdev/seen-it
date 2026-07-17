<script setup>
import { BookHeart, Compass, Bookmark } from "@lucide/vue";
import NavButton from "./navigation/NavButton.vue";
</script>

<template>
  <nav
    id="navigation-bar"
    class="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 dark:border-[#292B37] bg-white/95 dark:bg-[#0F111D]/95 backdrop-blur-md shadow-lg grid grid-cols-3 items-center justify-items-stretch z-10 pb-safe"
  >
    <NavButton
      link="/watched"
      :icon="BookHeart"
      label="Assistidos"
    />

    <NavButton
      link="/discover"
      :icon="Compass"
      label="Descobrir"
    />

    <NavButton
      link="/saved"
      :icon="Bookmark"
      label="Salvos"
    />
  </nav>
</template>
