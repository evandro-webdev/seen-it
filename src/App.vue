<script setup>
import Header from "./components/layout/Header.vue";
import NavigationBar from "./components/layout/NavigationBar.vue";
import SearchBar from "./components/forms/SearchBar.vue";
import MovieCard from "./components/movies/MovieCard.vue";
import MovieCardDetailed from "./components/movies/MovieCardDetailed.vue";
import MovieModal from "./components/movies/MovieModal.vue";

import { onMounted, ref, computed, watch } from "vue";
import { useWatchedMoviesStore } from "./stores/watchedMovies.js";
import { useSavedMoviesStore } from "./stores/savedMovies.js";
import { useDiscoverMoviesStore } from "./stores/discoverMovies.js";
import { removeAccents } from "./utils/formatters.js";

import { SlidersHorizontal, Flame, Award } from "@lucide/vue";

const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();
const discoverMoviesStore = useDiscoverMoviesStore();

onMounted(() => {
  watchedMoviesStore.loadWatchedMoviesDetailed();
  savedMoviesStore.loadSavedMoviesDetailed();
  discoverMoviesStore.loadDiscover();
});

const selectedMovie = ref(null);
const currentTab = ref("discover");
const searchQuery = ref("");
const searchResults = ref([]);

function openMovieModal(id) {
  const movie =
    watchedMoviesStore.watchedMoviesDetailed.find((m) => m.id === id) ||
    savedMoviesStore.savedMoviesDetailed.find((m) => m.id === id);

  selectedMovie.value = movie;
}

watch(currentTab, () => {
  searchQuery.value = "";
  searchResults.value = [];
  discoverMoviesStore.isSearching = false;
});

const activeMovies = computed(() => {
  if (currentTab.value === "watched") return watchedMoviesStore.watchedMovies;
  if (currentTab.value === "saved") return savedMoviesStore.savedMovies;
  return searchResults.value;
});

const filteredMovies = computed(() => {
  if (currentTab.value === "discover") return activeMovies.value;
  if (!searchQuery.value.trim()) return activeMovies.value;

  const query = removeAccents(searchQuery.value.toLowerCase());

  return activeMovies.value.filter((movie) =>
    removeAccents(movie.title.toLowerCase()).includes(query),
  );
});

const moviesCount =
  currentTab.value === "discover"
    ? discoverMoviesStore.searchResults.length
    : computed(() => filteredMovies.value.length);
</script>

<template>
  <Header />

  <main class="max-w-7xl mx-auto">
    <div class="py-2 px-4 lg:py-14 mb-2 space-y-3">
      <SearchBar
        v-model="searchQuery"
        :current-tab="currentTab"
        @search="discoverMoviesStore.searchForMovies(searchQuery)"
      />

      <div
        v-if="currentTab !== 'discover' || discoverMoviesStore.isSearching"
        class="flex justify-between items-center"
      >
        <div class="flex items-center gap-1">
          <SlidersHorizontal class="w-4 h-4 text-[#0088FF]" />

          <span class="block text-xs text-gray-700 dark:text-gray-300">Ordernar por: Nota</span>
        </div>

        <span class="block text-xs text-gray-600 dark:text-gray-300"
          >{{ moviesCount }} filmes</span
        >
      </div>
    </div>

    <div class="py-2 px-4">
      <section
        v-if="currentTab === 'watched' || currentTab === 'saved'"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4"
      >
        <MovieCard
          v-for="movie in filteredMovies"
          :key="movie.id"
          :movie="movie"
          @click="openMovieModal(movie.id)"
        />
      </section>

      <section v-if="currentTab === 'discover'">
        <div
          v-if="!discoverMoviesStore.isSearching"
          class="space-y-6"
        >
          <div>
            <div class="flex justify-between items-center mb-4">
              <div class="flex gap-1 items-center">
                <Flame class="w-5 h-5 text-[#0088FF]" />

                <h2 class="font-bold text-[#10355E] dark:text-white">Mais vistos do momento</h2>
              </div>
              <button class="text-xs font-semibold text-[#0088FF]">
                Ver todos
              </button>
            </div>

            <div class="-mr-4 pr-4 flex gap-x-2 overflow-x-auto">
              <MovieCard
                v-for="movie in discoverMoviesStore.popularMovies"
                :key="movie.id"
                :movie="movie"
                class="flex-shrink-0"
                @click="selectedMovie = movie"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-4">
              <div class="flex gap-1 items-center">
                <Award class="w-5 h-5 text-[#0088FF]" />

                <h2 class="font-bold text-[#10355E] dark:text-white">Melhores avaliados</h2>
              </div>
              <button class="text-xs font-semibold text-[#0088FF]">
                Ver todos
              </button>
            </div>

            <div class="-mr-4 pr-4 flex gap-x-2 overflow-x-auto">
              <MovieCard
                v-for="movie in discoverMoviesStore.topRatedMovies"
                :key="movie.id"
                :movie="movie"
                class="flex-shrink-0"
                @click="selectedMovie = movie"
              />
            </div>
          </div>
        </div>

        <div
          v-if="discoverMoviesStore.isSearching"
          class="space-y-4"
        >
          <MovieCardDetailed
            v-for="movie in discoverMoviesStore.searchResults"
            :key="movie.id"
            :movie="movie"
            @click="
              selectedMovie = discoverMoviesStore.searchResults.find(
                (m) => m.id === movie.id,
              )
            "
          />
        </div>
      </section>
    </div>
  </main>

  <footer class="w-full px-4 py-10 text-center"></footer>

  <MovieModal
    v-if="selectedMovie"
    :movie="selectedMovie"
    @close="selectedMovie = null"
  />

  <NavigationBar v-model="currentTab" />
</template>
