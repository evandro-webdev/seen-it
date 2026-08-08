<script setup>
import { Play, ChevronDown } from "@lucide/vue";

defineProps({
  movie: {
    type: Object,
    required: true,
  }
});

const isTrailerOpen = defineModel("isTrailerOpen", {
  type: Boolean,
  default: false,
});
</script>

<template>
  <div
    class="my-4"
  >
    <button
      @click="isTrailerOpen = !isTrailerOpen"
      type="button"
      class="w-full flex items-center justify-between py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
    >
      <div class="flex items-center gap-2">
        <div
          class="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
        >
          <Play class="w-4 h-4 fill-current" />
        </div>
        <span>Trailer Oficial</span>
      </div>

      <ChevronDown
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isTrailerOpen }"
      />
    </button>

    <div
      v-if="isTrailerOpen"
      class="mt-3"
    >
      <div
        class="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg"
      >
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${movie.trailerKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`"
          title="Trailer do filme"
          class="w-full h-full border-0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>
