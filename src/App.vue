<script setup>
import Header from "./components/layout/Header.vue";
import NavigationBar from "./components/layout/NavigationBar.vue";
import MovieModal from "./components/movies/MovieModal.vue";
import GroupListModal from "./components/groups/GroupListModal.vue";

import { ref, watch, Transition } from "vue";
import { useRoute } from "vue-router";
import { useWatchedMoviesStore } from "./stores/watchedMovies.js";
import { useSavedMoviesStore } from "./stores/savedMovies.js";
import { useDiscoverMoviesStore } from "./stores/discoverMovies.js";
import { useAuthStore } from "./stores/auth.js";
import { useGroupsStore } from "./stores/groups.js";

const route = useRoute();
const authStore = useAuthStore();
const groupsStore = useGroupsStore();

const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();
const discoverMoviesStore = useDiscoverMoviesStore();

const selectedMovie = ref(null);

async function openMovieModal(id) {
  const currentRouteName = route.name;

  const movie =
    currentRouteName === "watched"
      ? await watchedMoviesStore.loadDetailedMovie(id)
      : currentRouteName === "saved"
        ? await savedMoviesStore.loadDetailedMovie(id)
        : await discoverMoviesStore.loadDetailedMovie(id);

  selectedMovie.value = movie;
}

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
  { immediate: true },
);
</script>

<template>
  <Header />

  <main class="max-w-7xl mx-auto h-[90%]">
    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        @open-movie-modal="openMovieModal"
      />
    </router-view>

    <footer
      class="h-33"
    ></footer>
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

  <NavigationBar />
</template>
