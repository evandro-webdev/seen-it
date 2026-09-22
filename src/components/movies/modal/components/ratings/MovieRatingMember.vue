<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import { useAuthStore } from "@/stores/auth.js";

import { useDarkMode } from "@/composables/useDarkMode";
import { getUserColor } from "@/constants/colors";
import { formatRating } from "@/utils/formatters.js";
const { isDarkMode } = useDarkMode();

import { Star, Quote } from "@lucide/vue";

const props = defineProps({
  uid: {
    type: String,
    required: true,
  },
  review: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const groupsStore = useGroupsStore();

const groupMembers = computed(() =>
  groupsStore.activeGroup ? groupsStore.activeGroupMembers : null,
);

const defaultAvatar = computed(() => {
  return isDarkMode.value
    ? "/img/avatars/default-dark.svg"
    : "/img/avatars/default-light.svg";
});

const name = computed(() => {
  return groupMembers.value
    ? groupMembers.value[props.uid]?.name
    : authStore.user?.displayName;
});

const userColor = computed(() => {
  return groupMembers.value
    ? getUserColor(groupMembers.value[props.uid]?.color)
    : getUserColor(authStore.user?.color);
});

const hasComment = computed(() => {
  return !!props.review.comment;
});
</script>

<template>
  <div class="text-white flex flex-shrink-0 items-center gap-2.5">
    <div class="relative">
      <img
        :src="`https://grfzzenmfxpdswksztzh.supabase.co/storage/v1/object/public/avatars/${uid}.jpg`"
        @error="$event.target.src = defaultAvatar"
        class="w-8 h-8 rounded-full border object-cover"
        :style="{ borderColor: userColor.primary }"
      />

      <div
        v-if="hasComment"
        class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
        :style="{ backgroundColor: userColor.primary }"
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
          class="w-3.5 h-3.5"
          :style="{
            color: userColor.primary,
            fill: userColor.primary,
          }"
        />
        <span class="block text-sm font-bold text-gray-800 dark:text-white">{{
          formatRating(review.rating)
        }}</span>
      </div>
      <span
        class="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-200 block"
        >{{ name.split(" ")[0] }}</span
      >
    </div>

    <div class="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
  </div>
</template>
