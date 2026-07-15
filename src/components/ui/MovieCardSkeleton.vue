<script setup>
defineProps({
  fixedWidth: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="space-y-1 overflow-hidden animate-pulse flex flex-col shrink-0"
    :class="{ 'w-[140px]': fixedWidth }"
  >
    <div
      class="relative w-full aspect-[185/280] rounded-lg bg-[#DEE9F8]/60 dark:bg-[#1D3555]/60 overflow-hidden"
    ></div>

    <div class="h-5 flex items-center">
      <div
        class="w-full h-3.5 bg-[#DEE9F8]/60 dark:bg-[#1D3555]/60 rounded-md"
      ></div>
    </div>
  </div>
</template>
