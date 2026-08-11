<script setup>
import { watch } from "vue";
import { useAuthStore } from "./stores/auth.js";
import { useGroupsStore } from "./stores/groups.js";
import { useMovieDetailsStore } from "./stores/movieDetails.js";
import { useNotificationsStore } from "./stores/notifications.js";
import { useWatchedMoviesStore } from "./stores/watchedMovies.js";
import { useSavedMoviesStore } from "./stores/savedMovies.js";

import Header from "./components/layout/Header.vue";
import NavigationBar from "./components/layout/NavigationBar.vue";
import MovieModal from "./components/movies/modal/MovieModal.vue";
import GroupListModal from "./components/groups/GroupListModal.vue";
import ProfileModal from "./components/profile/ProfileModal.vue";
import NotificationsModal from "./components/notifications/NotificationsModal.vue";
import ToastContainer from "./components/ui/ToastContainer.vue";

const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const movieDetailsStore = useMovieDetailsStore();
const notificationsStore = useNotificationsStore();
const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();

watch(
  () => authStore.user?.uid,
  (newUid, oldUid) => {
    if (newUid) {
      groupsStore.getGroups();
      if (groupsStore.activeGroup) {
        groupsStore.loadActiveGroupMembers();
      }

      savedMoviesStore.setupSavedMoviesListener();
      watchedMoviesStore.setupWatchedMoviesListener();

      notificationsStore.listenToNotifications();
      authStore.setupNotifications();
    } else if (oldUid && !newUid) {
      groupsStore.groups = [];
      notificationsStore.stopListening();
    }
  },
  { immediate: true },
);
</script>

<template>
  <Header />

  <main class="w-full max-w-7xl mx-auto flex-1 pb-20 px-4">
    <router-view v-slot="{ Component }">
      <Transition
        name="fade-tab"
        mode="out-in"
      >
        <component
          :is="Component"
          @open-movie-modal="movieDetailsStore.openMovie($event, $route.name)"
        />
      </Transition>
    </router-view>
  </main>

  <MovieModal
    :movie="movieDetailsStore.selectedMovie"
    @close="movieDetailsStore.closeMovie"
  />

  <GroupListModal :groups="groupsStore.groups" />
  <ProfileModal />
  <NotificationsModal />
  <ToastContainer />

  <NavigationBar />
</template>
