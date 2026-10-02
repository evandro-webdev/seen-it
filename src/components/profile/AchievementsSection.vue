<script setup>
import { Trophy } from "@lucide/vue";
</script>

<template>
  <section class="space-y-2.5">
    <h2
      class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1"
    >
      Conquistas (EM BREVE)
    </h2>

    <div class="space-y-2.5">
      <div
        v-for="index in 3"
        :key="index"
        class="p-3.5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/40 flex items-center gap-3.5 transition-colors"
      >
        <div
          class="w-11 h-11 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-100/50 dark:bg-slate-800/40 flex items-center justify-center text-gray-400 dark:text-slate-600 shrink-0"
        >
          <Trophy class="w-5 h-5 opacity-60" />
        </div>

        <div class="min-w-0 flex-1 space-y-1">
          <div
            class="h-3.5 w-28 bg-gray-200 dark:bg-slate-800 rounded-md animate-pulse"
          />
          <div
            class="h-2.5 w-44 bg-gray-100 dark:bg-slate-800/60 rounded-md animate-pulse"
          />
        </div>
      </div>
    </div>
  </section>
</template>
