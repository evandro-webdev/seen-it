<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
  },
});

const modelValue = defineModel({ type: String, default: "" });
</script>

<template>
  <select
    class="bg-transparent font-medium border-none focus:outline-none focus:ring-0 cursor-pointer p-0 text-xs text-ellipsis overflow-hidden whitespace-nowrap max-w-[105px] sm:max-w-none"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="dark:bg-[#121825]"
    >
      {{ option.label }}
    </option>
  </select>
</template>
