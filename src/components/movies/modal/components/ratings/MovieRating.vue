<script setup>
import { computed } from "vue";
import { formatRating } from "@/utils/formatters.js";
import { Star } from "@lucide/vue";

const props = defineProps({
  rating: {
    type: [Number, String],
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: "blue",
    validator: (value) => ["blue", "teal"].includes(value),
  },
});

const formattedRatingValue = computed(() => {
  const numericRating = Number(props.rating);
  return numericRating && numericRating > 0
    ? formatRating(numericRating)
    : "N/A";
});

const styles = computed(() => {
  if (props.variant === "teal") {
    return {
      container: "bg-[#e9f5f2] dark:bg-[#399c8d1e]",
      iconWrapper: "border-[#399c8d]",
      text: "text-[#399c8d]",
    };
  }

  return {
    container: "bg-[#edf3fc] dark:bg-[#356dd51e]",
    iconWrapper: "border-[#356dd5]",
    text: "text-[#356dd5] dark:text-[#4787ff]",
  };
});
</script>

<template>
  <div
    class="px-3 py-1.5 rounded-xl flex flex-shrink-0 items-center gap-2"
    :class="styles.container"
  >
    <div
      class="p-1.5 rounded-full border flex items-center justify-center"
      :class="styles.iconWrapper"
    >
      <slot name="icon" />
    </div>

    <div>
      <div class="flex items-center gap-1">
        <Star
          class="w-3.5 h-3.5"
          :class="styles.text"
          fill="currentColor"
        />
        <span
          class="block text-sm font-bold"
          :class="styles.text"
        >
          {{ formattedRatingValue }}
        </span>
      </div>

      <span
        class="text-[10px] uppercase tracking-wider font-semibold block"
        :class="styles.text"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>
