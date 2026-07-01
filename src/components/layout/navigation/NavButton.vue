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
      class="py-[10px] px-[5px] flex flex-1 justify-center items-center gap-2 transition-colors duration-300 cursor-pointer"
      :class="isActive ? 'text-[#0088FF]' : 'text-gray-400'"
    >
      <component
        :is="icon"
        class="w-4 h-4"
      />

      <span class="text-sm font-medium text-nowrap">{{ label }}</span>
    </a>
  </RouterLink>
</template>
