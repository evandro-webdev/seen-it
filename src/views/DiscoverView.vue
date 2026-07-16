<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useDiscoverMoviesStore } from "@/stores/discoverMovies.js";
import { Flame, Award, Clapperboard, SearchX } from "@lucide/vue";

import SearchBar from "@/components/layout/SearchBar.vue";
import MovieCardDetailed from "@/components/movies/cards/MovieCardDetailed.vue";
import MoviesList from "@/components/movies/list/MoviesList.vue";

defineEmits(["open-movie-modal"]);

const discoverMoviesStore = useDiscoverMoviesStore();
const searchQuery = ref("");

function handleScroll() {
  if (
    !discoverMoviesStore.isSearching ||
    discoverMoviesStore.isLoading ||
    discoverMoviesStore.isLoadingMore
  ) {
    return;
  }

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const clientHeight = window.innerHeight;

  if (scrollHeight - scrollTop - clientHeight < 200) {
    discoverMoviesStore.loadMoreMovies();
  }
}

onMounted(() => {
  discoverMoviesStore.loadDiscover();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  searchQuery.value = "";
  discoverMoviesStore.clearSearch();
  window.removeEventListener("scroll", handleScroll);
});

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    discoverMoviesStore.clearSearch();
  }
});

function clearSearch() {
  searchQuery.value = "";
}
</script>

<template>
  <div>
    <div class="py-2 px-4 lg:py-14 space-y-3">
      <SearchBar
        v-model="searchQuery"
        current-tab="discover"
        @search="discoverMoviesStore.searchForMovies(searchQuery)"
      />

      <div
        v-if="discoverMoviesStore.isSearching && !discoverMoviesStore.isLoading"
        class="flex justify-end items-center"
      >
        <span
          v-if="discoverMoviesStore.searchResults.length !== 0"
          class="block text-xs text-gray-600 dark:text-gray-300"
        >
          {{ discoverMoviesStore.searchResults.length }} filmes encontrados
        </span>
      </div>
    </div>

    <div class="h-[100%] pt-2 px-4 flex flex-col">
      <div
        v-if="!discoverMoviesStore.isSearching || !searchQuery"
        class="space-y-6"
      >
        <MoviesList
          :icon="Flame"
          title="Mais vistos do momento"
          :movies="discoverMoviesStore.popularMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          :loading="discoverMoviesStore.isLoading"
        />
        <MoviesList
          :icon="Award"
          title="Melhores avaliados"
          :movies="discoverMoviesStore.topRatedMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          :loading="discoverMoviesStore.isLoading"
        />
        <MoviesList
          :icon="Clapperboard"
          title="Mais esperados"
          :movies="discoverMoviesStore.upcomingMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          :loading="discoverMoviesStore.isLoading"
        />
      </div>

      <div
        v-if="discoverMoviesStore.isSearching"
        class="space-y-4"
      >
        <div
          v-if="discoverMoviesStore.isLoading"
          class="absolute inset-0 flex items-center justify-center bg-transparent"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0088FF]"
          ></div>
        </div>

        <template v-else>
          <div
            v-if="discoverMoviesStore.searchResults.length === 0"
            class="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 animate-fade-in"
          >
            <div class="space-y-4 max-w-xs">
              <div
                class="mx-auto w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#161f30] flex items-center justify-center border border-gray-100 dark:border-[#242C3C] shadow-xs"
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
                class="inline-flex items-center text-xs font-semibold text-[#0088FF] hover:underline"
              >
                Limpar pesquisa
              </button>
            </div>
          </div>

          <MovieCardDetailed
            v-else
            v-for="movie in discoverMoviesStore.searchResults"
            :key="movie.id"
            :movie="movie"
            @click="$emit('open-movie-modal', movie.id)"
          />

          <div
            v-if="discoverMoviesStore.isLoadingMore"
            class="py-4 flex justify-center items-center"
          >
            <div
              class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0088FF]"
            ></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
