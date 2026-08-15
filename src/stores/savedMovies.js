import { defineStore } from "pinia";
import { ref, watch } from "vue";
import {
  db,
  collection,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  increment,
} from "@/services/firebase.js";
import { useGroupsStore } from "./groups";
import { useNotificationsStore } from "./notifications";
import { useAuthStore } from "./auth";

export const useSavedMoviesStore = defineStore("savedMovies", () => {
  const savedMovies = ref([]);
  const savedMoviesIds = ref([]);
  const isLoading = ref(false);
  let unsubscribeListener = null;

  const groupsStore = useGroupsStore();
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();

  function getTargetCollectionPath() {
    const activeGroup = groupsStore.activeGroup;
    if (!activeGroup) {
      if (!authStore.user?.uid) return null;
      return `users/${authStore.user.uid}/savedMovies`;
    }
    return `groups/${activeGroup.id}/savedMovies`;
  }

  async function setupSavedMoviesListener() {
    if (unsubscribeListener) {
      unsubscribeListener();
      unsubscribeListener = null;
    }

    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) {
      savedMovies.value = [];
      savedMoviesIds.value = [];
      return;
    }

    isLoading.value = true;

    unsubscribeListener = onSnapshot(
      collection(db, collectionPath),
      (snapshot) => {
        savedMovies.value = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        savedMoviesIds.value = savedMovies.value.map((movie) =>
          String(movie.id),
        );
        isLoading.value = false;
      },
      (error) => {
        console.error(
          "Erro ao escutar filmes assistidos em tempo real:",
          error,
        );
        isLoading.value = false;
      },
    );
  }

  watch(
    [() => groupsStore.activeGroup?.id, () => authStore.user?.uid],
    ([groupId, userId]) => {
      if (groupId || userId) {
        setupSavedMoviesListener();
      } else {
        if (unsubscribeListener) unsubscribeListener();
        savedMovies.value = [];
        savedMoviesIds.value = [];
      }
    },
    { immediate: true },
  );

  async function saveMovie(movie) {
    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) return null;

    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      runtime: movie.runtime,
    };

    if (groupsStore.activeGroup) {
      movieData.saved_by = authStore.user.uid;
    }

    const movieDocRef = doc(db, collectionPath, String(movie.id));
    await setDoc(movieDocRef, movieData);

    if (groupsStore.activeGroup) {
      const groupDocRef = doc(db, "groups", groupsStore.activeGroup.id);

      await updateDoc(groupDocRef, {
        total_saved: increment(1),
      });

      await notificationsStore.dispatchSavedMovieNotification(
        movie.id,
        movie.title,
      );
    }

    return movieDocRef;
  }

  async function unsaveMovie(movieId) {
    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) return;

    const movieDocRef = doc(db, collectionPath, String(movieId));
    await deleteDoc(movieDocRef);

    if (groupsStore.activeGroup) {
      const groupDocRef = doc(db, "groups", groupsStore.activeGroup.id);
      await updateDoc(groupDocRef, {
        total_saved: increment(-1),
      });
    }
  }

  async function toggleSaved(movie) {
    const strMovieId = String(movie.id);

    if (isAlreadySaved(strMovieId)) {
      await unsaveMovie(strMovieId);
    } else {
      await saveMovie(movie);
    }
  }

  function isAlreadySaved(movieId) {
    return savedMoviesIds.value.includes(String(movieId));
  }

  return {
    savedMovies,
    savedMoviesIds,
    setupSavedMoviesListener,
    isAlreadySaved,
    toggleSaved,
    isLoading,
  };
});
