<script setup>
import { Bookmark, ChevronRight, Eye, UsersRound } from "@lucide/vue";

defineProps({
  group: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="px-2.5 py-4 rounded-xl border border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F] flex justify-between items-center transition-colors"
  >
    <div class="flex items-center gap-2.5">
      <div
        class="p-3 rounded-full bg-gradient-to-tr from-[#205FE2] to-[#29A4FF]"
        :style="{
          backgroundImage: `linear-gradient(135deg, ${group.color.primary}, ${group.color.secondary})`,
        }"
      >
        <UsersRound class="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ group.name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-[#ABB3C3]">
          {{ group.members.map((m) => m.name.split(" ")[0]).join(", ") }}
        </p>
      </div>
    </div>

    <div
      class="pl-4 border-l border-gray-200 dark:border-[#40475A] flex items-center gap-4"
    >
      <div :style="{ color: `${group.color.secondary}` }">
        <div class="flex items-center gap-1.5">
          <Eye class="w-4" />
          <span class="text-sm font-medium">
            {{ group.watchedMovies ? group.watchedMovies.length : "0" }}
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <Bookmark class="w-4" />
          <span class="text-sm font-medium">
            {{ group.savedMovies ? group.savedMovies.length : "0" }}
          </span>
        </div>
      </div>

      <ChevronRight class="text-gray-400 dark:text-[#A4ADC5]" />
    </div>
  </div>
</template>
