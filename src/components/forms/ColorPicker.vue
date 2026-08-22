<script setup>
import { Check } from "@lucide/vue";

const props = defineProps({
  modelValue: {
    type: [String, Object],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

function isSelected(color) {
  if (typeof color === "string") {
    return props.modelValue === color;
  }
  return props.modelValue?.primary === color.primary;
}

function getButtonStyle(color) {
  if (typeof color === "string") {
    return { backgroundColor: color };
  }
  return {
    backgroundImage: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
  };
}
</script>

<template>
  <div class="space-y-2.5">
    <label
      v-if="label"
      class="text-xs font-semibold text-gray-700 dark:text-gray-300 block select-none"
    >
      {{ label }}
    </label>

    <div class="flex gap-2.5 flex-wrap">
      <button
        v-for="(color, index) in options"
        :key="typeof color === 'string' ? color : index"
        @click="emit('update:modelValue', color)"
        type="button"
        class="w-8 h-8 rounded-full active:scale-95 flex items-center justify-center transition-transform"
        :style="getButtonStyle(color)"
      >
        <Check
          v-if="isSelected(color)"
          class="text-white w-4 h-4"
        />
      </button>
    </div>

    <p
      v-if="description"
      class="text-[11px] text-gray-500 dark:text-[#9EB2CD]"
    >
      {{ description }}
    </p>
  </div>
</template>
