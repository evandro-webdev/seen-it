<script setup>
import Header from "./components/layout/Header.vue";
import NavigationBar from "./components/layout/NavigationBar.vue";
import SearchBar from "./components/layout/SearchBar.vue";
import MovieCard from "./components/movies/MovieCard.vue";
import MovieCardDetailed from "./components/movies/MovieCardDetailed.vue";
import MovieModal from "./components/movies/MovieModal.vue";
import AuthForm from "./components/auth/AuthForm.vue";

import { onMounted, ref, computed, watch, Transition } from "vue";
import { useWatchedMoviesStore } from "./stores/watchedMovies.js";
import { useSavedMoviesStore } from "./stores/savedMovies.js";
import { useDiscoverMoviesStore } from "./stores/discoverMovies.js";
import { useAuthStore } from "./stores/auth.js";
import { useGroupsStore } from "./stores/groups.js";
import { removeAccents } from "./utils/formatters.js";

const authStore = useAuthStore();
const groupsStore = useGroupsStore();

import { SlidersHorizontal, Flame, Award, Clapperboard } from "@lucide/vue";

import MoviesList from "./components/movies/MoviesList.vue";
import GroupListModal from "./components/groups/GroupListModal.vue";

const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();
const discoverMoviesStore = useDiscoverMoviesStore();

onMounted(() => {
  watchedMoviesStore.loadWatchedMovies();
  savedMoviesStore.loadSavedMovies();
  discoverMoviesStore.loadDiscover();
  groupsStore.getGroups();
});

const selectedMovie = ref(null);
const currentTab = ref("discover");
const searchQuery = ref("");

async function openMovieModal(id) {
  const movie =
    currentTab.value === "watched"
      ? await watchedMoviesStore.loadDetailedMovie(id)
      : currentTab.value === "saved"
        ? await savedMoviesStore.loadDetailedMovie(id)
        : await discoverMoviesStore.loadDetailedMovie(id);

  selectedMovie.value = movie;
}

watch(currentTab, () => {
  searchQuery.value = "";
  discoverMoviesStore.isSearching = false;
});

const activeMovies = computed(() => {
  if (currentTab.value === "watched")
    return watchedMoviesStore.watchedMovies.sort(
      (a, b) => b.average_rating - a.average_rating,
    );
  if (currentTab.value === "saved")
    return savedMoviesStore.savedMovies.sort(
      (a, b) => b.vote_average - a.vote_average,
    );
});

const filteredMovies = computed(() => {
  if (!searchQuery.value.trim()) return activeMovies.value;

  const query = removeAccents(searchQuery.value.toLowerCase());

  return activeMovies.value.filter((movie) =>
    removeAccents(movie.title.toLowerCase()).includes(query),
  );
});

const moviesCount = computed(() => {
  if (currentTab.value === "discover")
    return discoverMoviesStore.searchResults.length;
  return filteredMovies.value.length;
});

const myGroups = ref([]);
const isLoading = ref(true);

async function fetchGroups() {
  if (!authStore.user?.uid) return;

  isLoading.value = true;
  myGroups.value = await groupsStore.getGroups(); 
  isLoading.value = false;
}

watch(
  () => authStore.user?.uid,
  (newUid) => {
    if (newUid) {
      fetchGroups();
    }
  },
  { immediate: true }
);
</script>

<template>
  <Header />

  <main class="max-w-7xl mx-auto h-[90%]">
    <div
      v-if="authStore.isAuthenticated || currentTab === 'discover'"
      class="py-2 px-4 lg:py-14 mb-2 space-y-3"
    >
      <SearchBar
        v-model="searchQuery"
        :current-tab="currentTab"
        @search="discoverMoviesStore.searchForMovies(searchQuery)"
      />

      <Transition
        name="fade-tab"
        mode="out-in"
      >
        <div
          v-if="currentTab !== 'discover' || discoverMoviesStore.isSearching"
          class="flex justify-between items-center"
        >
          <div class="flex items-center gap-1">
            <SlidersHorizontal class="w-4 h-4 text-[#0088FF]" />

            <span class="block text-xs text-gray-700 dark:text-gray-300"
              >Ordernar por: Nota</span
            >
          </div>

          <span class="block text-xs text-gray-600 dark:text-gray-300"
            >{{ moviesCount }} filmes</span
          >
        </div>
      </Transition>
    </div>

    <div class="h-[100%] py-2 px-4 flex flex-col">
      <Transition
        name="fade-tab"
        mode="out-in"
      >
        <AuthForm
          v-if="
            !authStore.isAuthenticated &&
            (currentTab === 'watched' || currentTab === 'saved')
          "
          key="login-screen"
        />

        <section
          v-else-if="currentTab === 'watched' || currentTab === 'saved'"
          :key="currentTab"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4"
        >
          <MovieCard
            v-for="movie in filteredMovies"
            :key="movie.id"
            :movie="movie"
            @click="async () => await openMovieModal(movie.id)"
          />
        </section>

        <section
          v-else-if="currentTab === 'discover'"
          key="discover"
        >
          <div
            v-if="!discoverMoviesStore.isSearching || !searchQuery"
            class="space-y-6"
          >
            <MoviesList
              :icon="Flame"
              title="Mais vistos do momento"
              :movies="discoverMoviesStore.popularMovies"
              @open-modal="openMovieModal"
            />

            <MoviesList
              :icon="Award"
              title="Melhores avaliados"
              :movies="discoverMoviesStore.topRatedMovies"
              @open-modal="openMovieModal"
            />

            <MoviesList
              :icon="Clapperboard"
              title="Mais esperados"
              :movies="discoverMoviesStore.upcomingMovies"
              @open-modal="openMovieModal"
            />
          </div>

          <div
            v-if="discoverMoviesStore.isSearching"
            class="space-y-4"
          >
            <MovieCardDetailed
              v-for="movie in discoverMoviesStore.searchResults"
              :key="movie.id"
              :movie="movie"
              @click="selectedMovie = movie"
            />
          </div>
        </section>
      </Transition>
    </div>
  </main>

  <Transition name="slide-up">
    <MovieModal
      v-if="selectedMovie"
      :movie="selectedMovie"
      @close="selectedMovie = null"
    />
  </Transition>

  <Transition name="slide-up">
    <GroupListModal
      v-if="groupsStore.isGroupsModalOpen"
      :groups="groupsStore.groups"
    />
  </Transition>

  <NavigationBar v-model="currentTab" />
</template>
