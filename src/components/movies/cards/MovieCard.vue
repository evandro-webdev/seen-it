<script setup>
import { computed, ref } from "vue";
import { Calendar, Star } from "@lucide/vue";
import { formatRating } from "@/utils/formatters";
import { useGroupsStore } from "@/stores/groups";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
  releaseDate: {
    type: String,
    default: null,
  },
  showUserColor: {
    type: Boolean,
    default: false,
  },
});

const groupsStore = useGroupsStore();
const imageError = ref(false);

const posterUrl = computed(() => {
  if (props.movie?.poster_path) {
    return `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`;
  }
  return null;
});

const rating = computed(() => {
  const val = props.movie?.average_rating ?? props.movie?.vote_average;
  return val ? formatRating(val) : null;
});

const badgeColorMap = {
  "#338CD5": "#2168A4",
  "#9367EB": "#6E32CF",
  "#D75870": "#A92B45",
  "#55C06E": "#2A7C3F",
  "#F69F40": "#B25900",
};

const badgeBackgroundColor = computed(() => {
  if (!props.showUserColor) return null;

  const uid = props.movie?.saved_by;
  const originalColor = groupsStore.activeGroupMembers?.[uid]?.color;

  if (originalColor) {
    return badgeColorMap[originalColor] || originalColor;
  }

  return null;
});

function handleImageError() {
  imageError.value = true;
}

function formatDate(dateString) {
  if (!dateString) return "Em breve";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}`;
}
</script>

<template>
  <div
    class="group space-y-1.5 overflow-hidden cursor-pointer flex flex-col transition-transform duration-200 active:scale-95 select-none snap-start"
    :class="fixedWidth ? 'w-[125px] sm:w-[140px] shrink-0' : 'w-full'"
  >
    <div
      class="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#161f30]"
    >
      <img
        v-if="posterUrl && !imageError"
        :src="posterUrl"
        :alt="movie.title"
        loading="lazy"
        @error="handleImageError"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center p-2 text-center text-gray-400 bg-gray-100 dark:bg-[#161f30]"
      >
        <span
          class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-2"
        >
          {{ movie.title }}
        </span>
      </div>

      <div
        v-if="releaseDate"
        class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md flex items-center gap-1 backdrop-blur-md bg-black/60 border border-white/10"
      >
        <Calendar class="w-2.5 h-2.5 text-white" />
        <span>{{ formatDate(releaseDate) }}</span>
      </div>

      <div
        v-else-if="rating"
        class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md flex items-center gap-1 backdrop-blur-sm transition-colors duration-200"
        :class="{
          'bg-black/65 border border-white/10': !badgeBackgroundColor,
        }"
        :style="
          badgeBackgroundColor
            ? { backgroundColor: badgeBackgroundColor }
            : {}
        "
      >
        <Star class="w-2.5 h-2.5 fill-white text-white" />
        <span>{{ rating }}</span>
      </div>
    </div>

    <div class="pt-0.5">
      <h3
        class="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-1 group-hover:text-[#0088FF] transition-colors"
        :title="movie.title"
      >
        {{ movie.title }}
      </h3>
    </div>
  </div>
</template>