<script setup>
import { X } from '@lucide/vue';
import UserAvatar from './UserAvatar.vue';

defineProps({
  members: {
    type: Array,
    default: () => []
  },
});

defineEmits(['remove'])
</script>

<template>
  <div class="mt-3 flex flex-wrap gap-2">
    <span
      v-for="member in members"
      :key="member.uid"
      class="py-1.5 pl-2 pr-3 rounded-xl text-sm border border-gray-200 dark:border-transparent text-gray-700 dark:text-white bg-gray-100 dark:bg-[#242C3C] flex items-center gap-2"
    >
      <UserAvatar
        :user="member"
        size="sm"
      />
      <span class="font-medium">{{ member.name }}</span>
      <span class="text-xs text-gray-400">(@{{ member.username }})</span>

      <button
        type="button"
        @click="$emit('remove', member.uid)"
        class="transition-colors ml-1 hover:text-red-500"
      >
        <X class="w-4 h-4" />
      </button>
    </span>
  </div>
</template>
