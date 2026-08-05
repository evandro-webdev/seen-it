<script setup>
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
  userColor: {
    type: String,
    default: null,
  },
});

const userColorStyle = computed(() => {
  if (!props.userColor) return {};
  return {
    borderLeftColor: props.userColor,
    borderLeftWidth: "3px",
  };
});
</script>

<template>
  <div
    v-if="comment"
    class="mt-3 p-3 rounded-xl border transition-all duration-200 overflow-hidden bg-gray-50/80 dark:bg-slate-800/40 border-gray-200/80 dark:border-gray-700/60"
    :style="userColorStyle"
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
      class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed pl-3 "
      :style="{ borderColor: userColor ? `${userColor}40` : 'currentColor' }"
    >
      {{ comment }}
    </p>
  </div>
</template>
