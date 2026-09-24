<script setup>
import { useCollectionFilter } from "@/stores/collectionFilter";
import { storeToRefs } from "pinia";

import { Grid2x2, Grid3x3 } from "@lucide/vue";

const filterStore = useCollectionFilter();

const { gridCols } = storeToRefs(filterStore);
</script>

<template>
  <div
    class="flex items-center bg-gray-100 dark:bg-[#161f30] p-0.5 rounded-lg sm:hidden"
  >
    <button
      @click="gridCols = 2"
      type="button"
      :class="[
        'p-1 rounded-md transition-all cursor-pointer',
        gridCols === 2
          ? 'bg-white dark:bg-[#202c42] text-[#0088FF] shadow-xs'
          : 'text-gray-400',
      ]"
      title="2 Colunas"
    >
      <Grid2x2 class="w-3.5 h-3.5" />
    </button>
    <button
      @click="gridCols = 3"
      type="button"
      :class="[
        'p-1 rounded-md transition-all cursor-pointer',
        gridCols === 3
          ? 'bg-white dark:bg-[#202c42] text-[#0088FF] shadow-xs'
          : 'text-gray-400',
      ]"
      title="3 Colunas"
    >
      <Grid3x3 class="w-3.5 h-3.5" />
    </button>
  </div>
</template>
