<script setup>
defineProps({
  genre: {
    type: String,
    required: true,
  }
});

</script>

<template>
  <span
    class="px-2 py-[2px] rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 bg-[#EDEDED] dark:bg-[#1D3555]"
  >
    {{ genre }}
  </span>
</template>
