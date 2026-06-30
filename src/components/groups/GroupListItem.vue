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
    class="px-2.5 py-4 rounded-xl border border-[#242C3C] bg-[#181F2F] flex justify-between items-center"
  >
    <div class="flex items-center gap-2.5">
      <div
        class="p-3 rounded-full bg-gradient-to-tr from-[#205FE2] to-[#29A4FF]"
      >
        <UsersRound class="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-white">{{ group.name }}</h3>
        <p class="text-sm text-[#ABB3C3]">John, Jane, Josh</p>
      </div>
    </div>

    <div class="pl-4 border-l border-[#40475A] flex items-center gap-4">
      <div>
        <div class="text-[#29A4FF] flex items-center gap-1.5">
          <Eye class="w-4" />
          <span class="text-sm">20</span>
        </div>
        <div class="text-[#29A4FF] flex items-center gap-1.5">
          <Bookmark class="w-4" />
          <span class="text-sm">20</span>
        </div>
      </div>

      <ChevronRight class="text-[#A4ADC5]" />
    </div>
  </div>
</template>
