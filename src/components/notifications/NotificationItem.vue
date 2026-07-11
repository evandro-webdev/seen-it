<script setup>
import { computed } from "vue";
import { ChevronRight } from "@lucide/vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useMovieDetailsStore } from "@/stores/movieDetails";

const { isDarkMode } = useDarkMode();

defineProps({
  senderName: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
});

const movieDetailStore = useMovieDetailsStore();

const defaultAvatar = computed(() => {
  return isDarkMode.value
    ? "/img/avatars/default-dark.jpg"
    : "/img/avatars/default-light.jpg";
});
</script>

<template>
  <div
    @click="movieDetailStore.openMovie(movieId)"
    class="px-2.5 py-4 rounded-xl border border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F] flex justify-between items-center transition-colors"
  >
    <div class="flex items-center gap-2">
      <img
        :src="`https://grfzzenmfxpdswksztzh.supabase.co/storage/v1/object/public/avatars/${senderId}.jpg`"
        @error="$event.target.src = defaultAvatar"
        class="w-15 h-15 rounded-full object-cover"
      />

      <div>
        <h3 class="text-sm/5 text-gray-500 dark:text-[#ABB3C3]">
          <span class="font-medium text-gray-800 dark:text-white">{{
            senderName
          }}</span>
          salvou o filme
          <span class="font-medium text-[#0088FF]">{{ movieTitle }}</span>
        </h3>
        <span class="text-xs text-gray-500 dark:text-[#ABB3C3]"
          >Agora há pouco</span
        >
      </div>
    </div>

    <ChevronRight class="text-gray-400 dark:text-[#A4ADC5]" />
  </div>
</template>
