<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MoviesHeroCarouselSkeleton from "./MoviesHeroCarouselSkeleton.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["open-movie-modal"]);

const currentIndex = ref(0);
let timer = null;

let touchStartX = 0;
let touchEndX = 0;

function nextSlide() {
  if (props.movies.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % props.movies.length;
}

function prevSlide() {
  if (props.movies.length === 0) return;
  currentIndex.value =
    (currentIndex.value - 1 + props.movies.length) % props.movies.length;
}

function goToSlide(index) {
  currentIndex.value = index;
  startTimer();
}

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  stopTimer();
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  startTimer();
}

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchStartX - touchEndX > swipeThreshold) {
    nextSlide();
  } else if (touchEndX - touchStartX > swipeThreshold) {
    prevSlide();
  }
}

function startTimer() {
  stopTimer();
  timer = setInterval(nextSlide, 5000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
}

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <MoviesHeroCarouselSkeleton v-if="loading" />

  <div
    v-else-if="movies.length > 0"
    class="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-[#242C3C] touch-pan-y"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <transition-group name="fade">
      <div
        v-for="(movie, index) in movies"
        @click="$emit('open-movie-modal', movie.id)"
        v-show="index === currentIndex"
        :key="movie.id"
        class="absolute inset-0 p-5 pb-9 rounded-2xl bg-cover bg-center flex items-end"
        :style="{
          backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95) 12%, rgba(15, 23, 42, 0.35) 60%, transparent 100%), url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`,
        }"
      >
        <div class="space-y-2 text-white max-w-full z-10">
          <h1 class="text-xl font-black drop-shadow-md line-clamp-1">
            {{ movie.title }}
          </h1>

          <p class="text-xs text-gray-300 line-clamp-2 leading-relaxed">
            {{ movie.overview || "Sem sinopse disponível." }}
          </p>
        </div>
      </div>
    </transition-group>

    <div
      class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-50"
    >
      <button
        v-for="(_, idx) in movies"
        :key="idx"
        @click="goToSlide(idx)"
        type="button"
        class="py-2 px-1 flex items-center justify-center transition-all duration-300"
      >
        <span
          class="block h-1.5 rounded-full transition-all duration-300"
          :class="idx === currentIndex ? 'w-5 bg-[#0088FF]' : 'w-2 bg-white/50'"
        ></span>
      </button>
    </div>
  </div>
</template>
