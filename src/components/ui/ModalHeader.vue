<script setup>
import { X } from "@lucide/vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
});

defineEmits(["close"]);
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="p-3 rounded-2xl bg-blue-50 dark:bg-[#273056] shrink-0">
        <component
          :is="icon"
          class="w-6 h-6 text-blue-600 dark:text-blue-400"
        />
      </div>

      <div>
        <h2
          class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
        >
          {{ title }}
        </h2>
        <span
          v-if="subtitle"
          class="text-xs font-medium text-gray-500 dark:text-[#9EB2CD] block"
        >
          {{ subtitle }}
        </span>
      </div>
    </div>

    <button
      @click="$emit('close')"
      type="button"
      class="p-2 rounded-full bg-gray-100 dark:bg-[#222838] active:scale-95 transition-all"
      aria-label="Fechar"
    >
      <X class="w-5 h-5 text-gray-600 dark:text-[#A7B0C9]" />
    </button>
  </div>
</template>
