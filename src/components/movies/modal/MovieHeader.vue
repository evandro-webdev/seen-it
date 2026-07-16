<script setup>
import { ArrowLeft, EllipsisVertical } from "@lucide/vue";

defineProps({
  posterPath: String,
  title: String,
});

defineEmits(["close"]);
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <div class="relative w-full">
      <div class="skeleton absolute inset-0 bg-gray-300 animate-pulse"></div>
      <img
        :src="
          posterPath
            ? 'https://image.tmdb.org/t/p/w500' + posterPath
            : '/placeholder-image.png'
        "
        :alt="title"
        class="poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
        onload="
          this.classList.add('opacity-100');
          this.previousElementSibling.remove();
        "
      />

      <div
        class="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white dark:from-[#0F111D] to-transparent pointer-events-none"
      ></div>
      <div
        class="fixed top-0 left-0 w-full h-1/5 bg-gradient-to-b from-black to-transparent pointer-events-none"
      ></div>

      <div
        class="fixed top-0 left-0 w-full p-4 text-white flex justify-between z-10"
      >
        <button @click="$emit('close')">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <button>
          <EllipsisVertical class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>
