<script setup>
defineProps({
  user: { 
    type: Object, 
    required: true 
  },
  size: { 
    type: String, 
    default: "md" 
  },
});
</script>

<template>
  <div
    class="rounded-full font-medium text-white flex items-center justify-center overflow-hidden shrink-0"
    :class="size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-9 h-9 text-sm'"
    :style="{ backgroundColor: user.color || '#1D4776' }"
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
