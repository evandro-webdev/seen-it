<script setup>
import { RouterLink } from "vue-router";

defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <RouterLink
    :to="link"
    custom
    v-slot="{ navigate, isActive }"
  >
    <a
      @click="navigate"
      class="flex flex-col items-center justify-center flex-1 h-full py-2 transition-all duration-200 cursor-pointer select-none gap-1"
      :class="[
        isActive
          ? 'text-[#0088FF] dark:text-[#0088FF]'
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300',
      ]"
    >
      <!-- Ícone (muda o preenchimento ou peso visual indiretamente pela cor) -->
      <component
        :is="icon"
        class="w-5 h-5 transition-transform duration-200"
      />

      <!-- Texto (sempre visível, mudando apenas o peso e a cor) -->
      <span
        class="text-[10px] tracking-wide transition-colors duration-200"
        :class="isActive ? 'font-semibold' : 'font-medium'"
      >
        {{ label }}
      </span>
    </a>
  </RouterLink>
</template>
