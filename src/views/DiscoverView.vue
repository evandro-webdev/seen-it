<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useDiscoverMoviesStore } from "@/stores/discoverMovies.js";
import { useSearchMoviesStore } from "@/stores/searchMovies.js";
import { useGenreMoviesStore } from "@/stores/genreMovies.js";

import { Flame, Award, Clapperboard, ArrowLeft } from "@lucide/vue";

import SearchBar from "@/components/layout/SearchBar.vue";
import MovieCardDetailed from "@/components/movies/cards/MovieCardDetailed.vue";
import MoviesList from "@/components/movies/list/MoviesList.vue";
import MoviesHeroCarousel from "@/components/movies/list/MoviesHeroCarousel.vue";
import MovieGenrePill from "@/components/movies/ui/MovieGenrePill.vue";
import MovieSearchEmpty from "@/components/movies/ui/messages/MovieSearchEmpty.vue";
import MovieCard from "@/components/movies/cards/MovieCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import NotInternetConnection from "@/components/movies/ui/messages/NotInternetConnection.vue";

defineEmits(["open-movie-modal"]);

const discoverMoviesStore = useDiscoverMoviesStore();
const searchMoviesStore = useSearchMoviesStore();
const genreMoviesStore = useGenreMoviesStore();

const searchQuery = ref("");

const isOnline = ref(navigator.onLine);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

function handleScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const clientHeight = window.innerHeight;

  if (scrollHeight - scrollTop - clientHeight >= 200) {
    return;
  }

  if (searchMoviesStore.isSearching) {
    if (searchMoviesStore.isLoading || searchMoviesStore.isLoadingMore) return;

    searchMoviesStore.loadMoreMovies();
    return;
  }

  if (genreMoviesStore.selectedGenreId) {
    if (
      genreMoviesStore.isLoadingGenreMovies ||
      genreMoviesStore.isLoadingMoreGenreMovies
    )
      return;

    genreMoviesStore.loadMoreGenreMovies();
    return;
  }

  if (discoverMoviesStore.selectedCategory) {
    if (
      discoverMoviesStore.isLoadingCategoryMovies ||
      discoverMoviesStore.isLoadingMoreCategoryMovies
    )
      return;
    discoverMoviesStore.loadMoreCategoryMovies();
    return;
  }
}

onMounted(() => {
  discoverMoviesStore.loadDiscover();
  genreMoviesStore.loadGenres();
  window.addEventListener("scroll", handleScroll);

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
});

onUnmounted(() => {
  searchQuery.value = "";
  searchMoviesStore.clearSearch();
  window.removeEventListener("scroll", handleScroll);

  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
});

watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    searchMoviesStore.clearSearch();
  }
});

function clearSearch() {
  searchQuery.value = "";
}
</script>

<template>
  <div>
    <div class="py-2 lg:py-14 space-y-3">
      <SearchBar
        v-model="searchQuery"
        current-tab="discover"
        @search="searchMoviesStore.searchForMovies(searchQuery)"
      />

      <div
        v-if="searchMoviesStore.isSearching && !discoverMoviesStore.isLoading"
        class="flex justify-end items-center"
      >
        <span
          v-if="searchMoviesStore.searchResults.length !== 0"
          class="text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          {{ searchMoviesStore.searchResults.length }} filmes encontrados
        </span>
      </div>

      <MovieGenrePill
        v-if="
          !searchMoviesStore.isSearching &&
          !genreMoviesStore.isLoading &&
          isOnline
        "
        :genres="genreMoviesStore.genres"
        :selected-genre-id="genreMoviesStore.selectedGenreId"
        @select-genre="genreMoviesStore.selectGenre"
      />
    </div>

    <NotInternetConnection v-if="!isOnline" />

    <div
      v-else
      class="h-[100%] pt-2 flex flex-col"
    >
      <div
        v-if="searchMoviesStore.isSearching"
        class="space-y-4"
      >
        <LoadingSpinner
          v-if="searchMoviesStore.isLoading"
          full-screen
        />

        <template v-else>
          <MovieSearchEmpty
            v-if="searchMoviesStore.searchResults.length === 0"
            :search-query="searchQuery"
            @clear="clearSearch"
          />

          <MovieCardDetailed
            v-else
            v-for="movie in searchMoviesStore.searchResults"
            :key="movie.id"
            :movie="movie"
            @click="$emit('open-movie-modal', movie.id)"
          />

          <LoadingSpinner
            v-if="searchMoviesStore.isLoadingMore"
            size="sm"
          />
        </template>
      </div>

      <div
        v-else-if="genreMoviesStore.selectedGenreId"
        class="pt-2 space-y-4"
      >
        <h2 class="font-bold text-[#10355E] dark:text-[#B0D5FE] text-base">
          Filmes de
          {{
            genreMoviesStore.genres.find(
              (g) => g.id === genreMoviesStore.selectedGenreId,
            )?.name
          }}
        </h2>

        <LoadingSpinner
          v-if="genreMoviesStore.isLoadingGenreMovies"
          full-screen
        />

        <template v-else>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <MovieCard
              v-for="movie in genreMoviesStore.genreMovies"
              :key="movie.id"
              :movie="movie"
              @click="$emit('open-movie-modal', movie.id)"
            />
          </div>

          <LoadingSpinner
            v-if="genreMoviesStore.isLoadingMoreGenreMovies"
            size="sm"
          />
        </template>
      </div>

      <div
        v-else-if="discoverMoviesStore.selectedCategory"
        class="pt-2 space-y-4"
      >
        <div class="flex items-center gap-2">
          <button
            @click="discoverMoviesStore.clearCategory()"
            class="p-1 text-gray-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h2 class="font-bold text-[#10355E] dark:text-[#B0D5FE] text-base">
            {{ discoverMoviesStore.categoryTitle }}
          </h2>
        </div>

        <LoadingSpinner
          v-if="discoverMoviesStore.isLoadingCategoryMovies"
          full-screen
        />

        <template v-else>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            <MovieCard
              v-for="movie in discoverMoviesStore.categoryMovies"
              :key="movie.id"
              :movie="movie"
              @click="$emit('open-movie-modal', movie.id)"
            />
          </div>

          <LoadingSpinner
            v-if="discoverMoviesStore.isLoadingMoreCategoryMovies"
            size="sm"
          />
        </template>
      </div>

      <div
        v-else
        class="space-y-8"
      >
        <MoviesHeroCarousel
          :movies="discoverMoviesStore.heroMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          :loading="discoverMoviesStore.isLoading"
        />

        <MoviesList
          :icon="Flame"
          title="Mais vistos do momento"
          category="popular"
          :movies="discoverMoviesStore.popularMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          @see-all="
            discoverMoviesStore.selectCategory(
              'popular',
              'Mais vistos do momento',
            )
          "
          :loading="discoverMoviesStore.isLoading"
        />

        <MoviesList
          :icon="Clapperboard"
          title="Mais esperados"
          category="upcoming"
          :movies="discoverMoviesStore.upcomingMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          @see-all="
            discoverMoviesStore.selectCategory('upcoming', 'Mais esperados')
          "
          :loading="discoverMoviesStore.isLoading"
          upcoming
        />

        <MoviesList
          :icon="Award"
          title="Melhores avaliados"
          category="top_rated"
          :movies="discoverMoviesStore.topRatedMovies"
          @open-movie-modal="$emit('open-movie-modal', $event)"
          @see-all="
            discoverMoviesStore.selectCategory(
              'top_rated',
              'Melhores avaliados',
            )
          "
          :loading="discoverMoviesStore.isLoading"
        />
      </div>
    </div>
  </div>
</template>
