<script setup>
import { computed } from "vue";
import { getUserColor } from "@/constants/colors";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: "md",
  },
});

const userColor = computed(() => {
  return getUserColor(props.user.color);
});
</script>

<template>
  <div
    class="rounded-full font-medium text-white flex items-center justify-center overflow-hidden shrink-0"
    :class="size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-9 h-9 text-sm'"
    :style="{ backgroundColor: userColor.primary }"
  >
    <img
      v-if="user.avatar_url"
      :src="user.avatar_url"
      :alt="user.name"
      class="w-full h-full object-cover"
    />
    <span v-else>{{ user.name?.[0]?.toUpperCase() }}</span>
  </div>
</template>
