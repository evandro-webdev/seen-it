<script setup>
import { ref, computed, watch } from "vue";
import { removeAccents } from "@/utils/formatters.js";
import { useAuthStore } from "@/stores/auth.js";
import { useGroupsStore } from "@/stores/groups.js";

import MovieCard from "../cards/MovieCard.vue";
import AuthForm from "@/components/auth/AuthForm.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MovieSearchEmpty from "../ui/messages/MovieSearchEmpty.vue";
import MoviesTrackedEmpty from "../ui/messages/MoviesTrackedEmpty.vue";
import CollectionToolbar from "@/components/layout/CollectionToolbar.vue";

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
  groupByMember: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: String,
    default: "rating_desc",
  },
});

const emit = defineEmits(["open-movie-modal", "pick-random", "update:sortBy"]);

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

const groupedSections = computed(() => {
  if (!props.groupByMember) return [];

  const members = groupsStore.activeGroupMembers || {};
  const groups = {};

  filteredMovies.value.forEach((movie) => {
    const uid = movie.saved_by || null;
    if (!groups[uid]) groups[uid] = [];
    groups[uid].push(movie);
  });

  return Object.entries(groups).map(([uid, userMovies]) => {
    let memberData = members[uid];

    if (!memberData && uid === authStore.user?.uid) {
      memberData = {
        name: authStore.user?.displayName || "Você",
        color: "#338CD5",
      };
    }

    return {
      uid,
      userName: memberData?.name || "Membro",
      userColor: memberData?.color || "#338CD5",
      movies: userMovies,
    };
  });
});

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
        v-model:cols="gridCols"
        @update:sort-by="emit('update:sortBy', $event)"
        @pick-random="$emit('pick-random')"
      />

      <div class="h-[100%] py-2 flex flex-col flex-1">
        <div
          v-if="isLoading"
          class="flex flex-1 justify-center items-center py-12"
        >
          <LoadingSpinner />
        </div>

        <div
          v-else-if="
            filteredMovies.length > 0 &&
            groupByMember &&
            groupsStore.activeGroup
          "
          class="space-y-6"
        >
          <section
            v-for="section in groupedSections"
            :key="section.uid"
            class="space-y-3"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-3 h-3 rounded-full shrink-0"
                :style="{ backgroundColor: section.userColor }"
              ></span>
              <h2 class="font-bold text-sm text-[#10355E] dark:text-[#B0D5FE]">
                Salvos por {{ section.userName }}
              </h2>
              <span
                class="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                ({{ section.movies.length }})
              </span>
            </div>

            <div :class="gridClass">
              <MovieCard
                v-for="movie in section.movies"
                :key="movie.id"
                :movie="movie"
                @click="$emit('open-movie-modal', movie.id)"
              />
            </div>
          </section>
        </div>

        <section
          v-else-if="filteredMovies.length > 0"
          :class="gridClass"
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
          v-else-if="!isLoading"
          :type="type"
        />
      </div>
    </template>
  </div>
</template>
