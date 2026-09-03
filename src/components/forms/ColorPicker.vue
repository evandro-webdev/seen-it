<script setup>
import { Check } from "@lucide/vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  colorOptions: {
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
  return color.id === props.modelValue;
}

function getButtonStyle(color) {
  if (color.dark) {
    return { backgroundColor: color.primary };
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
        v-for="color in colorOptions"
        :key="color.id"
        @click="emit('update:modelValue', color.id)"
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
