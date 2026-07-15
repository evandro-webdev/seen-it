<script setup>
import { useDarkMode } from "@/composables/useDarkMode";
import { computed } from "vue";

const { isDarkMode } = useDarkMode();

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 10 },
  step: { type: Number, default: 0.5 },
  avatarUrl: { type: String, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100;
});

function onInput(event) {
  emit("update:modelValue", Number(event.target.value));
}
</script>

<template>
  <div class="flex items-center gap-4 w-full">
    <img
      :src="avatarUrl"
      class="w-12 h-12 rounded-full object-cover shrink-0"
    />

    <div class="w-full relative h-9 flex items-center">
      <div
        class="absolute left-0 right-0 h-[10px] bg-[#DEE9F8] dark:bg-[#1D3555] rounded-full"
      ></div>

      <div
        class="absolute left-0 h-[10px] bg-[#338CD5] dark:bg-[#1765A4] rounded-l-full transition-all duration-150"
        :style="{ width: percentage + '%' }"
      ></div>

      <div
        class="absolute top-1/2 w-[6px] h-[35px] bg-[#338CD5] dark:bg-[#1765A4] rounded-sm -translate-y-1/2 -translate-x-1/2 transition-all duration-150 pointer-events-none"
        :style="{
          left: percentage + '%',
          boxShadow: isDarkMode
            ? '-4px 0 0 0 #0F111D, 4px 0 0 0 #0F111D'
            : '-4px 0 0 0 white, 4px 0 0 0 white',
        }"
      >
        <span
          class="absolute -top-8 left-1/2 -translate-x-1/2 py-1 px-2 rounded-md text-[14px] bg-[#338CD5] dark:bg-[#1765A4] text-white font-medium whitespace-nowrap"
        >
          {{ modelValue }}
        </span>
      </div>

      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="onInput"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
    </div>
  </div>
</template>
