<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const modelValue = defineModel({
  type: [String, Number],
  default: "",
});

const paddingClasses = computed(() => {
  return props.icon ? "pl-11 pr-4" : "px-4";
});
</script>

<template>
  <div class="space-y-1.5 w-full text-left">
    <label
      v-if="label"
      class="text-xs font-semibold text-gray-700 dark:text-gray-300 block select-none"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500"
        >*</span
      >
    </label>

    <div class="relative w-full">
      <div
        v-if="icon || $slots.icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 flex items-center justify-center"
      >
        <slot name="icon">
          <component
            :is="icon"
            stroke-width="1.5"
            class="w-5 h-5"
          />
        </slot>
      </div>

      <input
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full py-3.5 text-sm rounded-xl border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-[#242C3C] bg-gray-50 dark:bg-[#151926] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          paddingClasses,
          error ? 'border-red-500 focus:ring-red-500' : '',
        ]"
      />
    </div>

    <p
      v-if="error"
      class="text-xs text-red-500 font-medium pt-0.5"
    >
      {{ error }}
    </p>
  </div>
</template>
