import { defineStore } from "pinia";
import { ref, watch } from "vue";
import {
  db,
  getDocs,
  collection,
  deleteDoc,
  doc,
  setDoc,
} from "@/services/firebase.js";
import { useGroupsStore } from "./groups";
import { useNotificationsStore } from "./notifications";
import { useAuthStore } from "./auth";

export const useSavedMoviesStore = defineStore("savedMovies", () => {
  const savedMovies = ref([]);
  const savedMoviesIds = ref([]);
  const isLoading = ref(false);

  const groupStore = useGroupsStore();
  const authStore = useAuthStore();
  const notificationsStore = useNotificationsStore();

  function getTargetCollectionPath() {
    const activeGroup = groupStore.activeGroup;
    if (!activeGroup) {
      if (!authStore.user?.uid) return null;
      return `users/${authStore.user.uid}/savedMovies`;
    }
    return `groups/${activeGroup.id}/savedMovies`;
  }

  async function loadSavedMovies(forceReload = true) {
    if (!forceReload && savedMovies.value.length > 0) return;

    const collectionPath = getTargetCollectionPath();
    if (!collectionPath) return;

    isLoading.value = true;

    try {
      const snapshot = await getDocs(collection(db, collectionPath));

      savedMovies.value = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      savedMoviesIds.value = savedMovies.value.map((movie) => String(movie.id));
    } catch (error) {
      console.error("Erro ao carregar filmes salvos:", error);
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    [() => groupStore.activeGroup?.id, () => authStore.user?.uid],
    async ([groupId, userId]) => {
      savedMovies.value = [];
      savedMoviesIds.value = [];

      if (groupId || userId) {
        await loadSavedMovies(true);
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
    };

    if (groupStore.activeGroup) {
      movieData.saved_by = authStore.user.uid;
    }

    const movieDocRef = doc(db, collectionPath, String(movie.id));
    await setDoc(movieDocRef, movieData);

    if (groupStore.activeGroup) {
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

    await deleteDoc(doc(db, collectionPath, String(movieId)));
  }

  async function toggleSaved(movie) {
    const strMovieId = String(movie.id);

    if (isAlreadySaved(strMovieId)) {
      await unsaveMovie(strMovieId);

      savedMovies.value = savedMovies.value.filter(
        (m) => String(m.id) !== strMovieId,
      );
      savedMoviesIds.value = savedMoviesIds.value.filter(
        (id) => String(id) !== strMovieId,
      );
    } else {
      const docRef = await saveMovie(movie);

      if (docRef) {
        savedMovies.value.push({
          docId: docRef.id,
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        });
        savedMoviesIds.value.push(strMovieId);
      }
    }
  }

  function isAlreadySaved(movieId) {
    return savedMoviesIds.value.includes(String(movieId));
  }

  return {
    savedMovies,
    savedMoviesIds,
    loadSavedMovies,
    isAlreadySaved,
    toggleSaved,
    isLoading,
  };
});
