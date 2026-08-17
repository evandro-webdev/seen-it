<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  variant: {
    type: String,
    default: "primary",
    validator: (val) =>
      ["primary", "secondary", "ghost", "danger", "danger-outline"].includes(
        val,
      ),
  },
  size: {
    type: String,
    default: "md",
    validator: (val) => ["sm", "md", "lg"].includes(val),
  },
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);

const variantClasses = computed(() => {
  switch (props.variant) {
    case "primary":
      return "text-white bg-[#0088FF] active:bg-blue-600 active:scale-95 shadow-lg shadow-blue-500/10";
    case "secondary":
      return "text-gray-700 dark:text-white bg-gray-100 dark:bg-[#161f30] border border-gray-200 dark:border-[#242C3C] active:bg-gray-200 dark:active:bg-[#1f2b42] active:scale-95";
    case "ghost":
      return "text-gray-700 dark:text-white active:bg-gray-100 dark:active:bg-[#161f30] active:scale-95";
    case "danger":
      return "text-white bg-red-600 dark:bg-red-700 active:bg-red-700 dark:active:bg-red-800 active:scale-95 shadow-lg shadow-red-500/10";
    case "danger-outline":
      return "text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 dark:border-red-500/30 active:bg-red-500/20 active:scale-95";
    default:
      return "";
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "py-1.5 px-3 text-xs rounded-lg";
    case "md":
      return "py-2.5 px-4 text-sm rounded-lg";
    case "lg":
      return "py-3 px-4 text-base rounded-xl";
    default:
      return "py-2.5 px-4 text-sm rounded-lg";
  }
});

const iconSizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-3.5 h-3.5";
    case "md":
      return "w-4 h-4";
    case "lg":
      return "w-5 h-5";
    default:
      return "w-4 h-4";
  }
});
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    @click="$emit('click', $event)"
    class="inline-flex justify-center items-center gap-2 font-medium whitespace-nowrap transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none"
    :class="[variantClasses, sizeClasses, block ? 'w-full' : '']"
  >
    <slot name="icon">
      <component
        :is="icon"
        v-if="icon"
        :class="iconSizeClasses"
      />
    </slot>

    <span class="font-medium whitespace-nowrap">{{ label }}</span>
  </button>
</template>
