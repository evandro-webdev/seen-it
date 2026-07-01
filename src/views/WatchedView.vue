<script setup>
import { onMounted, ref, computed } from "vue";
import { useWatchedMoviesStore } from "../stores/watchedMovies.js";
import { useAuthStore } from "../stores/auth.js";
import { removeAccents } from "../utils/formatters.js";
import { SlidersHorizontal } from "@lucide/vue";

import SearchBar from "../components/layout/SearchBar.vue";
import MovieCard from "../components/movies/MovieCard.vue";
import AuthForm from "../components/auth/AuthForm.vue";

defineEmits(["open-movie-modal"]);

const authStore = useAuthStore();
const watchedMoviesStore = useWatchedMoviesStore();
const searchQuery = ref("");

onMounted(() => {
  if (authStore.isAuthenticated) {
    watchedMoviesStore.loadWatchedMovies();
  }
});

const sortedMovies = computed(() => {
  return [...watchedMoviesStore.watchedMovies].sort(
    (a, b) => b.average_rating - a.average_rating,
  );
});

const filteredMovies = computed(() => {
  if (!searchQuery.value.trim()) return sortedMovies.value;

  const query = removeAccents(searchQuery.value.trim().toLowerCase());

  return sortedMovies.value.filter((movie) => {
    removeAccents(movie.title.toLowerCase()).includes(query);
  });
});
</script>

<template>
  <div
    v-if="authStore.isAuthenticated"
    class="py-2 px-4 lg:py-14 mb-2 space-y-3"
  >
    <SearchBar
      v-model="searchQuery"
      current-tab="watched"
    />

    <div class="flex justify-between items-center">
      <div class="flex items-center gap-1">
        <SlidersHorizontal class="w-4 h-4 text-[#0088FF]" />
        <span class="block text-xs text-gray-700 dark:text-gray-300"
          >Ordenar por: Nota</span
        >
      </div>
      <span class="block text-xs text-gray-600 dark:text-gray-300"
        >{{ filteredMovies.length }} filmes</span
      >
    </div>
  </div>

  <div class="h-[100%] py-2 px-4 flex flex-col">
    <AuthForm v-if="!authStore.isAuthenticated" />

    <section
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4"
    >
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
        @click="$emit('open-movie-modal', movie.id)"
      />
    </section>
  </div>
</template>
