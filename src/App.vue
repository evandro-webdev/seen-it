<script setup>
import { watch } from "vue";
import { useAuthStore } from "./stores/auth.js";
import { useGroupsStore } from "./stores/groups.js";
import { useNotificationsStore } from "./stores/notifications.js";
import { useWatchedMoviesStore } from "./stores/watchedMovies.js";
import { useSavedMoviesStore } from "./stores/savedMovies.js";

import Header from "./components/layout/Header.vue";
import NavigationBar from "./components/layout/NavigationBar.vue";
import MovieModal from "./components/movies/modal/MovieModal.vue";
import GroupsModal from "./components/groups/GroupsModal.vue";
import NotificationsModal from "./components/notifications/NotificationsModal.vue";
import ToastContainer from "./components/ui/ToastContainer.vue";

const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const notificationsStore = useNotificationsStore();
const watchedMoviesStore = useWatchedMoviesStore();
const savedMoviesStore = useSavedMoviesStore();

watch(
  () => authStore.user?.uid,
  (newUid, oldUid) => {
    if (newUid) {
      groupsStore.setupListeners();
      savedMoviesStore.setupListeners();
      watchedMoviesStore.setupListeners();
      notificationsStore.setupListeners();
    } else if (oldUid && !newUid) {
      groupsStore.groups = [];
      groupsStore.clearActiveGroup();

      groupsStore.stopListeners();
      savedMoviesStore.stopListeners();
      watchedMoviesStore.stopListeners();
      notificationsStore.stopListeners();
    }
  },
  { immediate: true },
);
</script>

<template>
  <Header />

  <main class="w-full max-w-7xl mx-auto flex-1 pb-20 px-4">
    <RouterView v-slot="{ Component }">
      <Transition
        name="fade-tab"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <MovieModal />
  <GroupsModal />
  <NotificationsModal />
  <ToastContainer />

  <NavigationBar />
</template>
