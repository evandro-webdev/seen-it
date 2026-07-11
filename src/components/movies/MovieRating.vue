<script setup>
import { formatRating } from "@/utils/formatters.js";
import { Star, Quote } from "@lucide/vue";
import { computed } from "vue";

import { useDarkMode } from "@/composables/useDarkMode";

const { isDarkMode } = useDarkMode();

defineProps({
  uid: {
    type: String,
    required: true,
  },
  review: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  hasComment: {
    type: Boolean,
    required: true,
  },
});

const defaultAvatar = computed(() => {
  return isDarkMode.value
    ? "/img/avatars/default-dark.jpg"
    : "/img/avatars/default-light.jpg";
});
</script>

<template>
  <div class="text-white flex flex-shrink-0 items-center gap-2">
    <div class="relative">
      <img
        :src="`https://grfzzenmfxpdswksztzh.supabase.co/storage/v1/object/public/avatars/${uid}.jpg`"
        @error="$event.target.src = defaultAvatar"
        class="w-9 h-9 rounded-full border object-cover"
        :style="{ borderColor: color }"
      />
      <div
        v-if="hasComment"
        class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
        :style="{ backgroundColor: color }"
      >
        <Quote
          class="w-2 h-2 text-white"
          fill="white"
        />
      </div>
    </div>
    <div>
      <div class="flex items-center gap-1">
        <Star
          class="w-4 h-4"
          :style="{
            color: color,
            fill: color,
          }"
        />
        <span class="block text-md font-medium text-gray-800 dark:text-white">{{
          formatRating(review.rating)
        }}</span>
      </div>
      <span class="text-xs capitalize text-gray-500 dark:text-gray-200 block">{{
        review.name.toLowerCase()
      }}</span>
    </div>

    <div class="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
  </div>
</template>
