<script setup></script>

<template>
  <div
    class="relative w-full h-[320px] rounded-2xl overflow-hidden bg-gray-200 dark:bg-[#161f30] border border-gray-100 dark:border-[#242C3C] animate-pulse p-5 pb-9 flex items-end"
  >
    <div class="space-y-2 w-full z-10">
      <div class="h-6 w-3/4 bg-gray-300 dark:bg-[#242C3C] rounded-lg"></div>

      <div class="space-y-1.5 pt-1">
        <div class="h-3 w-full bg-gray-300 dark:bg-[#242C3C] rounded-xs"></div>
        <div class="h-3 w-4/5 bg-gray-300 dark:bg-[#242C3C] rounded-xs"></div>
      </div>
    </div>

    <div
      class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 py-2 px-1"
    >
      <div class="h-1.5 w-5 bg-gray-300 dark:bg-[#242C3C] rounded-full"></div>
      <div class="h-1.5 w-2 bg-gray-300 dark:bg-[#242C3C] rounded-full"></div>
      <div class="h-1.5 w-2 bg-gray-300 dark:bg-[#242C3C] rounded-full"></div>
    </div>
  </div>
</template>
