<script setup>
import { computed } from "vue";
import { ChevronRight } from "@lucide/vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { formatRelativeTime } from "@/utils/formatters";
import { useGroupsStore } from "@/stores/groups";
import { getUserColor } from "@/constants/colors";

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const { isDarkMode } = useDarkMode();

const groupsStore = useGroupsStore();

const defaultAvatar = computed(() => {
  return isDarkMode.value
    ? "/img/avatars/default-dark.svg"
    : "/img/avatars/default-light.svg";
});

const userColor = computed(() => {
  const member = groupsStore.activeGroupMembers?.[props.notification.sender_id];
  return getUserColor(member?.color);
});
</script>

<template>
  <div
    class="relative px-3 py-4 rounded-xl border flex justify-between items-center transition-all duration-300 cursor-pointer active:scale-[0.99]"
    :class="[
      !notification.is_read
        ? 'border-blue-100 dark:border-[#2b3a55] bg-blue-50/30 dark:bg-[#1e2638] shadow-sm'
        : 'border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F]',
    ]"
  >
    <div
      class="flex items-start gap-3 transition-opacity duration-300 min-w-0 w-full"
      :class="notification.is_read ? 'opacity-65' : 'opacity-100'"
    >
      <img
        :src="`https://grfzzenmfxpdswksztzh.supabase.co/storage/v1/object/public/avatars/${notification.sender_id}.jpg`"
        @error="$event.target.src = defaultAvatar"
        class="w-11 h-11 rounded-full object-cover border border-gray-100 dark:border-[#242C3C] shrink-0"
        :style="{ borderColor: userColor.primary }"
        alt="Avatar"
      />

      <div class="min-w-0 flex-1 flex flex-col gap-1.5">
        <p
          class="text-sm/5 break-words"
          :class="
            !notification.is_read
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-[#ABB3C3]'
          "
        >
          <span class="font-semibold">
            {{ notification.sender_name?.split(" ")[0] }}
          </span>

          <span>&nbsp;{{ notification.message }}&nbsp;</span>

          <span
            v-if="notification.entity_name"
            class="font-medium text-[#0088FF] dark:text-[#38a3ff] inline-block max-w-[180px] align-bottom truncate"
          >
            "{{ notification.entity_name }}"
          </span>
        </p>

        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 dark:text-[#8892b0]">
            {{ formatRelativeTime(notification.created_at) }}
          </span>
          <span
            v-if="!notification.is_read"
            class="text-[10px] font-bold text-[#0088FF] dark:text-[#38a3ff] uppercase tracking-wider"
          >
            • Nova
          </span>
        </div>
      </div>
    </div>

    <ChevronRight
      class="w-5 h-5 transition-opacity shrink-0 ml-2"
      :class="
        notification.is_read
          ? 'text-gray-300 dark:text-[#242C3C] opacity-50'
          : 'text-gray-400 dark:text-[#A4ADC5]'
      "
    />
  </div>
</template>
