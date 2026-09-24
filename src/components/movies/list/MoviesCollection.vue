<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { removeAccents } from "@/utils/formatters.js";
import { useAuthStore } from "@/stores/auth.js";
import { useGroupsStore } from "@/stores/groups.js";
import { useMovieDetailsStore } from "@/stores/movieDetails.js";
import { useCollectionFilter } from "@/stores/collectionFilter.js";
import { useMovieGrouping } from "@/composables/useMovieGrouping.js";

import MovieCard from "../cards/MovieCard.vue";
import AuthForm from "@/components/auth/AuthForm.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MovieSearchEmpty from "../ui/messages/MovieSearchEmpty.vue";
import MoviesTrackedEmpty from "../ui/messages/MoviesTrackedEmpty.vue";
import MoviesGroupedSection from "./MoviesGroupedSection.vue";
import CollectionToolbar from "../toolbar/CollectionToolbar.vue";
import MoviesPendingSection from "./MoviesPendingSection.vue";

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
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const movieDetailsStore = useMovieDetailsStore();
const filterStore = useCollectionFilter();

const { groupBy, gridCols } = storeToRefs(filterStore);

const searchQuery = ref("");

const gridClass = computed(() => {
  return gridCols.value === 3
    ? "grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4";
});

const filteredMovies = computed(() => {
  if (!searchQuery.value.trim()) return props.movies;
  const query = removeAccents(searchQuery.value.trim().toLowerCase());

  return props.movies.filter((movie) =>
    removeAccents(movie.title.toLowerCase()).includes(query),
  );
});

const pendingMovies = computed(() => {
  if (props.type !== "watched") return [];

  const uid = authStore.user.uid;
  return filteredMovies.value.filter((movie) => {
    return !movie.reviews || !movie.reviews[uid];
  });
});

const displayMovies = computed(() => {
  if (props.type !== "watched") return filteredMovies.value;

  const uid = authStore.user.uid;
  return filteredMovies.value.filter(
    (movie) => movie.reviews && movie.reviews[uid],
  );
});

const { activeGroupSections } = useMovieGrouping(
  displayMovies,
  groupBy,
  {
    activeGroupMembers: computed(() => groupsStore.activeGroupMembers),
    currentUid: computed(() => authStore.user?.uid),
    currentUserDisplayName: computed(() => authStore.user?.displayName),
  },
);

function clearSearch() {
  searchQuery.value = "";
}
</script>

<template>
  <div class="relative w-full">
    <LoadingSpinner
      v-if="authStore.loading"
      full-screen
    />

    <AuthForm v-else-if="!authStore.isAuthenticated" />

    <template v-else>
      <CollectionToolbar
        v-model:search-query="searchQuery"
        :type="type"
        :total-count="filteredMovies.length"
        :is-loading="isLoading"
      />

      <div class="h-[100%] py-2 flex flex-col flex-1">
        <div
          v-if="isLoading"
          class="flex flex-1 justify-center items-center py-12"
        >
          <LoadingSpinner />
        </div>

        <template v-else>
          <MoviesPendingSection
            v-if="type === 'watched' && pendingMovies.length > 0"
            :movies="pendingMovies"
            :grid-class="gridClass"
          />

          <MoviesGroupedSection
            v-if="
              displayMovies.length > 0 &&
              groupBy !== 'none' &&
              activeGroupSections.length > 0
            "
            :active-group-sections="activeGroupSections"
            :grid-class="gridClass"
            :type="type"
          />

          <section
            v-else-if="displayMovies.length > 0"
            :class="gridClass"
          >
            <MovieCard
              v-for="movie in displayMovies"
              @click="movieDetailsStore.openModal(movie.id)"
              :key="movie.id"
              :movie="movie"
              show-user-color
            />
          </section>

          <MovieSearchEmpty
            v-else-if="searchQuery"
            :search-query="searchQuery"
            @clear="clearSearch"
          />

          <MoviesTrackedEmpty
            v-else-if="pendingMovies.length === 0"
            :type="type"
          />
        </template>
      </div>
    </template>
  </div>
</template>
