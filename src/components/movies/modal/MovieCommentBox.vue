<script setup>
import { getUserColor } from "@/constants/colors";
import { computed } from "vue";

const props = defineProps({
  comment: {
    type: String,
    required: true,
  },
  reviewerName: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: null,
  },
});

const userColor = computed(() => {
  return getUserColor(props.color);
});
</script>

<template>
  <div
    v-if="comment"
    class="mt-3 p-3 rounded-xl border transition-all duration-200 overflow-hidden bg-gray-50/80 dark:bg-slate-800/40 border-gray-200/80 dark:border-gray-700/60"
    :style="{ borderLeftColor: userColor.primary, borderLeftWidth: '3px' }"
  >
    <div class="flex items-center gap-1.5 mb-1.5">
      <span
        class="w-1.5 h-1.5 rounded-full"
        :style="{ backgroundColor: userColor || 'currentColor' }"
      />

      <span
        class="text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400"
      >
        {{ reviewerName }}
      </span>
    </div>

    <p
      class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed pl-3"
      :style="{ borderColor: userColor ? `${userColor}40` : 'currentColor' }"
    >
      {{ comment }}
    </p>
  </div>
</template>
