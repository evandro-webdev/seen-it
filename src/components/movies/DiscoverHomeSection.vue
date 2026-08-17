<script setup>
import MoviesHeroCarousel from "./list/MoviesHeroCarousel.vue";
import MoviesList from "./list/MoviesRow.vue";
import { Flame, Clapperboard, Award } from "@lucide/vue";

defineProps({
  heroMovies: { type: Array, required: true },
  popularMovies: { type: Array, required: true },
  upcomingMovies: { type: Array, required: true },
  topRatedMovies: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
});

const emit = defineEmits(["open-movie-modal", "see-all"]);

function handleSeeAllMovies(category, title) {
  window.scrollTo({ top: 0, behavior: "smooth" });
  emit('see-all', category, title)
}
</script>

<template>
  <div class="space-y-8">
    <MoviesHeroCarousel
      :movies="heroMovies"
      :loading="isLoading"
      @open-movie-modal="emit('open-movie-modal', $event)"
    />

    <MoviesList
      :icon="Flame"
      title="Mais vistos do momento"
      category="popular"
      :movies="popularMovies"
      :loading="isLoading"
      @open-movie-modal="emit('open-movie-modal', $event)"
      @see-all="handleSeeAllMovies('popular', 'Mais vistos do momento')"
    />

    <MoviesList
      :icon="Clapperboard"
      title="Mais esperados"
      category="upcoming"
      :movies="upcomingMovies"
      :loading="isLoading"
      upcoming
      @open-movie-modal="emit('open-movie-modal', $event)"
      @see-all="handleSeeAllMovies('upcoming', 'Mais esperados')"
    />

    <MoviesList
      :icon="Award"
      title="Melhores avaliados"
      category="top_rated"
      :movies="topRatedMovies"
      :loading="isLoading"
      @open-movie-modal="emit('open-movie-modal', $event)"
      @see-all="handleSeeAllMovies('top_rated', 'Melhores avaliados')"
    />
  </div>
</template>
