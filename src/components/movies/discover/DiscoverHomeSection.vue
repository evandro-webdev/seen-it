<script setup>
import { useDiscoverMoviesStore } from "@/stores/discoverMovies.js";

import { Flame, Clapperboard, Award } from "@lucide/vue";

import MoviesHeroCarousel from "./MoviesHeroCarousel.vue";
import MoviesRow from "../list/MoviesRow.vue";

const discoverMoviesStore = useDiscoverMoviesStore();
</script>

<template>
  <div class="space-y-8">
    <MoviesHeroCarousel />

    <MoviesRow
      :icon="Flame"
      title="Mais vistos do momento"
      category="popular"
      :movies="discoverMoviesStore.popularMovies"
    />

    <MoviesRow
      :icon="Clapperboard"
      title="Mais esperados"
      category="upcoming"
      :movies="discoverMoviesStore.upcomingMovies"
      upcoming
    />

    <MoviesRow
      :icon="Award"
      title="Melhores avaliados"
      category="topRated"
      :movies="discoverMoviesStore.topRatedMovies"
    />
  </div>
</template>
