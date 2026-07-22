<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useDiscoverMoviesStore } from "@/stores/discoverMovies.js";
import { Flame, Award, Clapperboard, SearchX } from "@lucide/vue";

import SearchBar from "@/components/layout/SearchBar.vue";
import MovieCardDetailed from "@/components/movies/cards/MovieCardDetailed.vue";
import MoviesList from "@/components/movies/list/MoviesList.vue";
import MoviesHeroCarousel from "@/components/movies/list/MoviesHeroCarousel.vue";
import MovieGenrePill from "@/components/movies/ui/MovieGenrePill.vue";
import MovieSearchEmpty from "@/components/movies/ui/messages/MovieSearchEmpty.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MovieCard from "@/components/movies/cards/MovieCard.vue";

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
    <div class="py-2 lg:py-14 space-y-3">
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

      <MovieGenrePill
        v-if="
          !discoverMoviesStore.isSearching && !discoverMoviesStore.isLoading
        "
        :genres="discoverMoviesStore.genres"
        :selected-genre-id="discoverMoviesStore.selectedGenreId"
        @select-genre="discoverMoviesStore.selectGenre"
      />
    </div>

    <div class="h-[100%] pt-2 flex flex-col">
      <div
        v-if="discoverMoviesStore.isSearching"
        class="space-y-4"
      >
        <LoadingSpinner v-if="discoverMoviesStore.isLoading" full-screen/>

        <template v-else>
          <MovieSearchEmpty
            v-if="discoverMoviesStore.searchResults.length === 0"
            :search-query="searchQuery"
            @clear="clearSearch"
          />

          <MovieCardDetailed
            v-else
            v-for="movie in discoverMoviesStore.searchResults"
            :key="movie.id"
            :movie="movie"
            @click="$emit('open-movie-modal', movie.id)"
          />

          <LoadingSpinner v-if="discoverMoviesStore.isLoadingMore" size="sm"/>
        </template>
      </div>

      <div
        v-else-if="discoverMoviesStore.selectedGenreId"
        class="pt-2 space-y-4"
      >
        <h2 class="font-bold text-[#10355E] dark:text-[#B0D5FE] text-base">
          Filmes de
          {{
            discoverMoviesStore.genres.find(
              (g) => g.id === discoverMoviesStore.selectedGenreId,
            )?.name
          }}
        </h2>

        <LoadingSpinner v-if="discoverMoviesStore.isLoadingGenreMovies" full-screen/>

        <div
          v-else
          class="grid grid-cols-3 sm:grid-cols-4 gap-2"
        >
          <MovieCard
            v-for="movie in discoverMoviesStore.genreMovies"
            :key="movie.id"
            :movie="movie"
            @click="$emit('open-movie-modal', movie.id)"
          />
        </div>
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
    </div>
  </div>
</template>
