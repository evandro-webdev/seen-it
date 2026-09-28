<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useGroupsStore } from "@/stores/groups";
import { useProfileStore } from "@/stores/profile";
import { useToastStore } from "@/stores/toast";
import { onClickOutside } from "@vueuse/core";

import { CircleUserRound, SquareArrowRightExit, UsersRound } from "@lucide/vue";

const props = defineProps({
  ignoreRef: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const profileStore = useProfileStore();
const toastStore = useToastStore();

const menuRef = ref(null);

function openProfileModal() {
  emit("close");
  profileStore.openProfileModal();
}

function openGroupsModal() {
  emit("close");
  groupsStore.openGroupsModal();
}

async function handleLogout() {
  emit("close");

  try {
    await authStore.logout();
    toastStore.success("Você saiu da sua conta.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

onClickOutside(
  menuRef,
  () => {
    emit("close");
  },
  {
    ignore: [props.ignoreRef],
  },
);
</script>

<template>
  <div
    ref="menuRef"
    class="absolute z-10 left-0 top-11 min-w-[160px] py-1 rounded-xl border border-gray-200 dark:border-[#242942] bg-[#f7f7f7] dark:bg-[#0f111c] shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden flex flex-col"
  >
    <button
      @click="openProfileModal"
      class="py-3 px-4 text-gray-800 dark:text-white border-b border-gray-200/50 dark:border-[#242942]/50 flex items-center gap-3"
    >
      <CircleUserRound class="w-5 h-5 text-[#0088FF] shrink-0" />
      <span class="font-medium text-sm truncate">
        {{ authStore.user?.displayName }}
      </span>
    </button>

    <button
      @click="handleLogout"
      type="button"
      class="w-full py-3 px-4 text-left text-red-500 dark:text-red-400 flex items-center gap-3"
    >
      <SquareArrowRightExit
        class="w-5 h-5 scale-x-[-1] text-red-500 dark:text-red-400 shrink-0"
      />
      <span class="text-sm font-medium">Sair</span>
    </button>
  </div>
</template>
