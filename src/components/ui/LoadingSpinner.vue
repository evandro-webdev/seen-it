<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "md"
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-6 w-6 border-b-2";
    case "md":
      return "h-8 w-8 border-b-2";
    case "lg":
      return "h-12 w-12 border-b-3";
    default:
      return "h-6 w-6 border-b-2";
  }
});
</script>

<template>
  <div
    class="w-full flex justify-center items-center"
    :class="fullScreen ? 'min-h-[calc(100dvh-150px)]' : 'py-4'"
  >
    <div
      class="animate-spin rounded-full border-[#0088FF]"
      :class="sizeClasses"
    ></div>
  </div>
</template>