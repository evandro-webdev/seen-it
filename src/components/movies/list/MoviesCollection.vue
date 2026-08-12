<script setup>
import { ref, computed, watch } from "vue";
import { removeAccents } from "@/utils/formatters.js";
import { useAuthStore } from "@/stores/auth.js";
import { useGroupsStore } from "@/stores/groups.js";
import { useMovieGrouping } from "@/composables/useMovieGrouping.js";

import MovieCard from "../cards/MovieCard.vue";
import AuthForm from "@/components/auth/AuthForm.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MovieSearchEmpty from "../ui/messages/MovieSearchEmpty.vue";
import MoviesTrackedEmpty from "../ui/messages/MoviesTrackedEmpty.vue";
import CollectionToolbar from "@/components/layout/CollectionToolbar.vue";
import MoviesGroupedSection from "./MoviesGroupedSection.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true,
  },
  customSections: {
    type: Array,
    default: () => [],
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
  sortBy: {
    type: String,
    default: "rating_desc",
  },
  groupBy: {
    type: String,
    default: "none",
  },
});

const emit = defineEmits([
  "open-movie-modal",
  "pick-random",
  "update:sortBy",
  "update:groupBy",
]);

const authStore = useAuthStore();
const groupsStore = useGroupsStore();

const searchQuery = ref("");

const savedCols = localStorage.getItem("app_grid_cols");
const gridCols = ref(savedCols ? Number(savedCols) : 2);

watch(gridCols, (newVal) => {
  localStorage.setItem("app_grid_cols", newVal.toString());
});

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
  if (props.type !== "watched" || !authStore.user?.uid) return [];

  const uid = authStore.user.uid;
  return filteredMovies.value.filter((movie) => {
    return !movie.reviews || !movie.reviews[uid];
  });
});

const ratedMovies = computed(() => {
  if (props.type !== "watched" || !authStore.user?.uid)
    return filteredMovies.value;

  const uid = authStore.user.uid;
  return filteredMovies.value.filter(
    (movie) => movie.reviews && movie.reviews[uid],
  );
});

const { activeGroupSections } = useMovieGrouping(
  ratedMovies,
  computed(() => props.groupBy),
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
        v-model="searchQuery"
        :type="type"
        :total-count="filteredMovies.length"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :group-by="groupBy"
        v-model:cols="gridCols"
        @update:sort-by="emit('update:sortBy', $event)"
        @update:group-by="emit('update:groupBy', $event)"
        @pick-random="$emit('pick-random')"
      />

      <div class="h-[100%] py-2 flex flex-col flex-1">
        <div
          v-if="isLoading"
          class="flex flex-1 justify-center items-center py-12"
        >
          <LoadingSpinner />
        </div>

        <template v-else>
          <section
            v-if="type === 'watched' && pendingMovies.length > 0"
            class="mb-6 pb-6 space-y-3 border-b border-gray-100 dark:border-gray-800/60"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-2.5 h-2.5 rounded-full bg-[#10355E] dark:bg-[#B0D5FE] animate-pulse"
              ></span>
              <h2
                class="text-base font-semibold text-[#10355E] dark:text-[#B0D5FE]"
              >
                {{ authStore.user?.displayName?.split(" ")[0] }}, você ainda não
                avaliou:
              </h2>
            </div>

            <div :class="gridClass">
              <MovieCard
                v-for="movie in pendingMovies"
                :key="movie.id"
                :movie="movie"
                @click="$emit('open-movie-modal', movie.id)"
              />
            </div>
          </section>

          <MoviesGroupedSection
            v-if="
              ratedMovies.length > 0 &&
              groupBy !== 'none' &&
              activeGroupSections.length > 0
            "
            :active-group-sections="activeGroupSections"
            :grid-class="gridClass"
            :type="type"
            @open-movie-modal="$emit('open-movie-modal', $event)"
          />

          <section
            v-else-if="ratedMovies.length > 0"
            :class="gridClass"
          >
            <MovieCard
              v-for="movie in ratedMovies"
              :key="movie.id"
              :movie="movie"
              @click="$emit('open-movie-modal', movie.id)"
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
