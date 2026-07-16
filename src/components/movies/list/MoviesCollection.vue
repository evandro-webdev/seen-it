<script setup>
import { ref, computed } from "vue";
import { removeAccents } from "@/utils/formatters.js";
import { useAuthStore } from "@/stores/auth.js";
import {
  SlidersHorizontal,
  Bookmark,
  Clapperboard,
  SearchX,
} from "@lucide/vue";

import SearchBar from "@/components/layout/SearchBar.vue";
import MovieCard from "../cards/MovieCard.vue";
import AuthForm from "@/components/auth/AuthForm.vue";

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
  <div class="relative h-[80vh] flex flex-col">
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

      <div class="h-[100%] py-2 px-4 flex flex-col flex-1">
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

        <div
          v-else
          class="px-6 py-12 text-center flex-1 flex flex-col items-center justify-center animate-fade-in"
        >
          <div
            v-if="searchQuery"
            class="max-w-xs space-y-4"
          >
            <div
              class="w-16 h-16 mx-auto rounded-2xl border border-gray-100 dark:border-[#242C3C] bg-gray-50 dark:bg-[#161f30] flex items-center justify-center shadow-xs"
            >
              <SearchX class="w-8 h-8 text-gray-400 dark:text-[#52627a]" />
            </div>
            <div class="space-y-1">
              <h3 class="text-md font-semibold text-gray-800 dark:text-white">
                Nenhum resultado encontrado
              </h3>
              <p
                class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]"
              >
                Não encontramos nada para "<span
                  class="font-medium text-gray-600 dark:text-gray-300"
                  >{{ searchQuery }}</span
                >". Verifique a grafia ou tente outro título.
              </p>
            </div>
            <button
              @click="clearSearch"
              type="button"
              class="text-xs font-semibold hover:underline inline-flex items-center text-[#0088FF]"
            >
              Limpar pesquisa
            </button>
          </div>

          <div
            v-else
            class="space-y-4 max-w-xs"
          >
            <template v-if="props.type === 'saved'">
              <div
                class="mx-auto w-16 h-16 rounded-2xl border border-blue-50 dark:border-[#1a3154] bg-blue-50/50 dark:bg-[#162845]/30 flex items-center justify-center shadow-xs"
              >
                <Bookmark class="w-8 h-8 text-[#0088FF]" />
              </div>
              <div class="space-y-1.5">
                <h3 class="text-md font-semibold text-gray-800 dark:text-white">
                  Lista de desejos vazia
                </h3>
                <p
                  class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]"
                >
                  Vocês não salvaram nenhum filme para assistir ainda. Que tal
                  explorar a aba de descobrir e guardar algumas ideias?
                </p>
              </div>
            </template>

            <template v-else-if="props.type === 'watched'">
              <div
                class="w-16 h-16 mx-auto rounded-2xl border border-blue-50 dark:border-[#1a3154] bg-blue-50/50 dark:bg-[#162845]/30 flex items-center justify-center  shadow-xs"
              >
                <Clapperboard class="w-8 h-8 text-[#0088FF]" />
              </div>
              <div class="space-y-1.5">
                <h3 class="text-md font-semibold text-gray-800 dark:text-white">
                  Nenhuma sessão registrada
                </h3>
                <p
                  class="text-xs/5 [text-wrap:balance] text-gray-400 dark:text-[#8892b0]"
                >
                  Vocês ainda não avaliaram ou marcaram nenhum filme como
                  assistido. Que tal registrar o último filme que o grupo
                  assistiu?
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
