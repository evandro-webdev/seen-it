<script setup>
import { Quote } from "@lucide/vue";

defineProps({
  reviewerName: String,
  comment: String,
});
</script>

<template>
  <div
    class="mt-3 p-3 bg-[#1e3653] rounded-lg rounded-tl-none relative overflow-hidden"
  >
    <Quote class="absolute -top-1 -right-1 w-10 h-10 text-white/10" />

    <span class="text-xs text-gray-400 capitalize block mb-1">
      {{ reviewerName }}
    </span>
    <p class="text-sm text-white pl-2">
      {{ comment }}
    </p>
  </div>
</template>
