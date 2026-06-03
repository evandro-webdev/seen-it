<script setup>
import { defineProps } from "vue";
import { Sparkles } from "@lucide/vue";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <button
    class="w-full py-2 px-3 rounded-lg text-white bg-[#0088FF] hover:bg-blue-600 flex justify-center items-center gap-2"
  >
    <Sparkles class="w-4 h-4" />
    <span class="font-medium text-nowrap">Avaliar Filme</span>
  </button>
</template>
