<script setup>
import { ref, computed } from "vue";
import { removeAccents } from "@/utils/formatters.js";
import { useAuthStore } from "@/stores/auth.js";
import { useGroupsStore } from "@/stores/groups.js"; // 1. Importa a store de grupos
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
  groupByMember: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["open-movie-modal"]);

const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const searchQuery = ref("");

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
    const uid = movie.saved_by || authStore.user?.uid || "unknown";
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
      <div class="py-2 lg:py-14 mb-2 space-y-3">
        <SearchBar v-model="searchQuery" />

        <div
          v-if="filteredMovies.length > 0 && type === 'watched'"
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
        <div
          v-if="
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

            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4"
            >
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
