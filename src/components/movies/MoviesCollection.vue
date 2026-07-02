<script setup>

import { ref, computed } from "vue";
import { removeAccents } from "../../utils/formatters.js";
import { useAuthStore } from "../../stores/auth.js";
import { SlidersHorizontal } from "@lucide/vue";

import SearchBar from "../../components/layout/SearchBar.vue";
import MovieCard from "../../components/movies/MovieCard.vue";
import AuthForm from "../../components/auth/AuthForm.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true,
  },
});

defineEmits(["open-movie-modal"]);

const authStore = useAuthStore();
const searchQuery = ref("");

const filteredMovies = computed(() => {
  if (!searchQuery.value.trim()) return props.movies;

  const query = removeAccents(searchQuery.value.trim().toLowerCase());

  return props.movies.filter((movie) =>
    removeAccents(movie.title.toLowerCase()).includes(query),
  );
});
</script>

<template>
  <div class="relative min-h-[90vh] flex flex-col">
    <div
      v-if="authStore.loading"
      class="absolute inset-0 flex items-center justify-center bg-transparent"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0088FF]"
      ></div>
    </div>

    <div
      v-else-if="!authStore.isAuthenticated"
      class="absolute inset-0 flex items-center justify-center p-4 z-10"
    >
      <AuthForm />
    </div>

    <template v-else>
      <div class="py-2 px-4 lg:py-14 mb-2 space-y-3">
        <SearchBar v-model="searchQuery" />

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

      <div class="h-[100%] py-2 px-4 flex flex-col flex-1">
        <section
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
  </div>
</template>
