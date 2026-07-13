<script setup>
import { computed } from "vue";
import { ChevronRight } from "@lucide/vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { formatRelativeTime } from "@/utils/formatters";

const { isDarkMode } = useDarkMode();

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const defaultAvatar = computed(() => {
  return isDarkMode.value
    ? "/img/avatars/default-dark.jpg"
    : "/img/avatars/default-light.jpg";
});

const actionDescription =
  props.notification.type === "movie_rated"
    ? " avaliou o filme "
    : " salvou o filme ";
</script>

<template>
  <div
    class="relative px-3 py-4 rounded-xl border flex justify-between items-center transition-all duration-300 cursor-pointer"
    :class="[
      !notification.isRead
        ? 'border-blue-100 dark:border-[#2b3a55] bg-blue-50/30 dark:bg-[#1e2638] shadow-sm'
        : 'border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F]',
    ]"
  >
    <div
      class="flex items-center gap-3 transition-opacity duration-300"
      :class="notification.isRead ? 'opacity-65' : 'opacity-100'"
    >
      <img
        :src="`https://grfzzenmfxpdswksztzh.supabase.co/storage/v1/object/public/avatars/${notification.sender_id}.jpg`"
        @error="$event.target.src = defaultAvatar"
        class="w-11 h-11 rounded-full object-cover border border-gray-100 dark:border-[#242C3C]"
      />

      <div>
        <h3 class="text-sm/5 text-gray-500 dark:text-[#ABB3C3]">
          <span
            class="font-semibold"
            :class="
              !notification.isRead
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-300'
            "
          >
            {{ notification.sender_name.split(" ")[0] }}
          </span>

          <span class="dark:text-[#ABB3C3]"> {{ actionDescription }} </span>

          <span class="font-medium text-[#0088FF] dark:text-[#38a3ff]">
            {{ notification.movie_title }}
          </span>
        </h3>

        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-gray-400 dark:text-[#8892b0]">
            {{ formatRelativeTime(notification.created_at) }}
          </span>
          <span
            v-if="!notification.isRead"
            class="text-[10px] font-bold text-[#0088FF] dark:text-[#38a3ff] uppercase tracking-wider"
          >
            • Nova
          </span>
        </div>
      </div>
    </div>

    <ChevronRight
      class="w-5 h-5 transition-opacity"
      :class="
        notification.isRead
          ? 'text-gray-300 dark:text-[#242C3C] opacity-50'
          : 'text-gray-400 dark:text-[#A4ADC5]'
      "
    />
  </div>
</template>
