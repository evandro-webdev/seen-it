<script setup>
import { CircleUserRound, SquareArrowRightExit, UsersRound } from "@lucide/vue";

import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const props = defineProps({
  displayName: {
    type: String,
    default: "Usuário",
  },
  ignoreRef: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "close",
  "open-profile-modal",
  "open-groups-modal",
  "logout",
]);

const menuRef = ref(null);

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
    class="absolute z-10 left-0 top-11 min-w-[200px] py-1 rounded-xl border border-gray-200 dark:border-[#242942] bg-[#f7f7f7] dark:bg-[#0f111c] shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden flex flex-col"
  >
    <button
      @click="emit('open-profile-modal')"
      class="py-3 px-4 text-gray-800 dark:text-white border-b border-gray-200/50 dark:border-[#242942]/50 flex items-center gap-3"
    >
      <CircleUserRound class="w-5 h-5 text-[#0088FF] shrink-0" />
      <span class="font-medium text-sm truncate">
        {{ displayName }}
      </span>
    </button>

    <button
      @click="emit('open-groups-modal')"
      type="button"
      class="py-3 px-4 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-[#1a1d30] transition-colors duration-300 flex items-center gap-3 w-full"
    >
      <UsersRound class="w-5 h-5 text-[#0088FF] shrink-0" />
      <span class="text-sm font-medium">Grupos</span>
    </button>

    <button
      @click="emit('logout')"
      type="button"
      class="py-3 px-4 text-left text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-300 flex items-center gap-3 w-full"
    >
      <SquareArrowRightExit
        class="w-5 h-5 scale-x-[-1] text-red-500 dark:text-red-400 shrink-0"
      />
      <span class="text-sm font-medium">Sair</span>
    </button>
  </div>
</template>
