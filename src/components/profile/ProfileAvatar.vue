<script setup>
import { Camera, User } from '@lucide/vue';

defineProps({
  avatarPreview: {
    type: String,
    default: null
  },
});

defineEmits(['file-change'])
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 pt-2">
    <label
      for="avatar"
      class="relative cursor-pointer group active:scale-95 transition-transform"
    >
      <div
        class="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/30 dark:border-blue-500/20 bg-gray-100 dark:bg-[#181F2F] flex items-center justify-center shadow-inner"
      >
        <img
          v-if="avatarPreview"
          :src="avatarPreview"
          class="w-full h-full object-cover"
        />
        <User
          v-else
          class="w-10 h-10 text-gray-400"
        />
      </div>

      <div
        class="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-lg border-2 border-white dark:border-[#121825]"
      >
        <Camera class="w-4 h-4" />
      </div>
    </label>

    <span class="text-xs font-medium text-gray-500 dark:text-[#ABB3C3]">
      Toque na foto para alterar
    </span>

    <input
      type="file"
      id="avatar"
      accept="image/*"
      @change="$emit('file-change', $event)"
      class="hidden"
    />
  </div>
</template>
