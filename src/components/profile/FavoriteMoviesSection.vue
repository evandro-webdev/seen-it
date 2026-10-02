<script setup>
import { Film } from "@lucide/vue";
</script>

<template>
  <section class="space-y-2.5">
    <h2
      class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1"
    >
      Filmes Favoritos (EM BREVE)
    </h2>

    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="index in 3"
        :key="index"
        class="aspect-[2/3] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center text-gray-400 dark:text-slate-600 transition-colors"
      >
        <Film class="w-6 h-6 opacity-60" />
      </div>
    </div>
  </section>
</template>
