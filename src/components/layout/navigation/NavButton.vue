<script setup>
defineProps({
  currentTab: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    required: true,
  },
});
</script>

<template>
  <button
    class="py-[10px] px-[5px] flex flex-1 justify-center items-center gap-2 transition-colors 300ms"
    :class="currentTab ? 'text-[#0088FF]' : 'text-gray-400'"
  >
    <component
      :is="icon"
      class="w-4 h-4"
    />

    <span class="text-sm font-medium text-nowrap">{{ label }}</span>
  </button>
</template>
