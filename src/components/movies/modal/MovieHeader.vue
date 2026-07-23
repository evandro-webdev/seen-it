<script setup>
import { ArrowLeft, EllipsisVertical, Clapperboard } from "@lucide/vue";

defineProps({
  posterPath: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: "",
  },
});

defineEmits(["close"]);
</script>

<template>
  <div class="relative w-full h-[540px] overflow-hidden bg-[#161f30]">
    <template v-if="posterPath">
      <div
        class="skeleton absolute inset-0 bg-gray-300 dark:bg-[#1f293d] animate-pulse"
      ></div>
      <img
        :src="'https://image.tmdb.org/t/p/w780' + posterPath"
        :alt="title"
        class="poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
        onload="
          this.classList.add('opacity-100');
          if (this.previousElementSibling) this.previousElementSibling.remove();
        "
      />
    </template>

    <div
      v-else
      class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1a2638] to-[#0F111D]"
    >
      <Clapperboard class="w-16 h-16 text-[#0088FF]/40 mb-2" />
      <span class="text-sm font-medium text-gray-400"
        >Poster não disponível</span
      >
    </div>

    <div
      class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white dark:from-[#0F111D] to-transparent pointer-events-none"
    ></div>
    <div
      class="fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10"
    ></div>

    <div
      class="fixed top-0 left-0 w-full p-4 text-white flex justify-between z-20"
    >
      <button
        @click="$emit('close')"
        type="button"
        class="p-2 rounded-full bg-black/30 backdrop-blur-md active:scale-95 transition-transform"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>
      <button
        type="button"
        class="p-2 rounded-full bg-black/30 backdrop-blur-md active:scale-95 transition-transform"
      >
        <EllipsisVertical class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
