<script setup>
import { formatRating } from "../../utils/formatters.js";

import { Star } from "@lucide/vue";

defineProps({
  user: {
    type: String,
    required: true,
  },
  rating: {
    type: [Number, String],
    required: true,
  },
});

const reviewerColors = {
  evandro: "#338CD5",
  tauane: "#d75870",
  kauane: "#9367eb",
};
</script>

<template>
  <div
    class="text-white flex flex-shrink-0 items-center gap-2"
    :class="reviewerColors[user]"
  >
    <img
      :src="'/img/' + user + '.jpg'"
      class="w-9 rounded-full border"
      :style="{ borderColor: reviewerColors[user] }"
    />
    <div>
      <div class="flex items-center gap-1">
        <Star
          class="w-4 h-4"
          :style="{
            color: reviewerColors[user],
            fill: reviewerColors[user],
          }"
        />
        <span class="block text-md font-medium text-gray-800 dark:text-white">{{
          formatRating(rating)
        }}</span>
      </div>
      <span class="text-xs capitalize text-gray-500 dark:text-gray-200 block">{{
        user
      }}</span>
    </div>

    <div class="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
  </div>
</template>
