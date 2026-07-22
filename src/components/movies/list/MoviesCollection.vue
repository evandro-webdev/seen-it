<script setup>
import { ref, computed } from "vue";
import { removeAccents } from "@/utils/formatters.js";
import { useAuthStore } from "@/stores/auth.js";
import { SlidersHorizontal } from "@lucide/vue";

import SearchBar from "@/components/layout/SearchBar.vue";
import MovieCard from "../cards/MovieCard.vue";
import AuthForm from "@/components/auth/AuthForm.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MovieSearchEmpty from "../ui/messages/MovieSearchEmpty.vue";
import MoviesTrackedEmpty from "../ui/messages/MoviesTrackedEmpty.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ["saved", "watched"].includes(value),
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

function clearSearch() {
  searchQuery.value = "";
}
</script>

<template>
  <div class="relative w-full">
    <LoadingSpinner v-if="authStore.loading" full-screen/>

    <AuthForm v-else-if="!authStore.isAuthenticated" />

    <template v-else>
      <div class="py-2 lg:py-14 mb-2 space-y-3">
        <SearchBar v-model="searchQuery" />

        <div
          v-if="filteredMovies.length > 0"
          class="flex justify-between items-center"
        >
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

      <div class="h-[100%] py-2 flex flex-col flex-1">
        <section
          v-if="filteredMovies.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4"
        >
          <MovieCard
            v-for="movie in filteredMovies"
            :key="movie.id"
            :movie="movie"
            @click="$emit('open-movie-modal', movie.id)"
          />
        </section>

        <MovieSearchEmpty
          v-else-if="searchQuery"
          :search-query="searchQuery"
          @clear="clearSearch"
        />

        <MoviesTrackedEmpty
          v-else
          :type="type"
        />
      </div>
    </template>
  </div>
</template>
