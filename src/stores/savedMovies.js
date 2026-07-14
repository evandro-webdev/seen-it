import { defineStore } from "pinia";
import { ref, watch } from "vue";
import {
  db,
  getDocs,
  collection,
  addDoc,
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

  async function loadSavedMovies() {
    if (savedMovies.value.length > 0) return;

    const groupStore = useGroupsStore();
    const authStore = useAuthStore();
    const activeGroup = groupStore.activeGroup;

    let targetCollectionPath = "";

    if (!activeGroup) {
      if (!authStore.user?.uid) return;
      targetCollectionPath = `users/${authStore.user.uid}/savedMovies`;
    } else {
      targetCollectionPath = `groups/${activeGroup.id}/savedMovies`;
    }

    const snapshot = await getDocs(collection(db, targetCollectionPath));

    savedMovies.value = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    savedMoviesIds.value = savedMovies.value.map((movie) => movie.id);
  }

  const groupStore = useGroupsStore();
  watch(
    () => groupStore.activeGroup,
    async (newGroup) => {
      savedMovies.value = [];
      savedMoviesIds.value = [];

      if (newGroup) {
        await groupStore.loadActiveGroupMembers();
      }

      await loadSavedMovies();
    },
    { immediate: true },
  );

  async function saveMovie(movie) {
    const groupStore = useGroupsStore();
    const authStore = useAuthStore();
    const notificationsStore = useNotificationsStore();

    const activeGroup = groupStore.activeGroup;
    let targetCollectionPath = "";

    if (!activeGroup) {
      if (!authStore.user?.uid) return;
      targetCollectionPath = `users/${authStore.user.uid}/savedMovies`;
    } else {
      targetCollectionPath = `groups/${activeGroup.id}/savedMovies`;
    }

    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    };

    if (activeGroup) {
      movieData.saved_by = authStore.user.uid;
    }

    const movieDocRef = doc(db, targetCollectionPath, String(movie.id));
    await setDoc(movieDocRef, movieData);

    if (activeGroup) {
      await notificationsStore.dispatchSavedMovieNotification(
        movie.id,
        movie.title,
      );
    }

    return movieDocRef;
  }

  async function unsaveMovie(docId) {
    const groupStore = useGroupsStore();
    const authStore = useAuthStore();
    const activeGroup = groupStore.activeGroup;

    if (!activeGroup) {
      if (!authStore.user?.uid) return;
      await deleteDoc(
        doc(db, "users", authStore.user.uid, "savedMovies", String(docId)),
      );
    } else {
      await deleteDoc(
        doc(db, "groups", activeGroup.id, "savedMovies", String(docId)),
      );
    }
  }

  async function toggleSaved(movie) {
    if (isAlreadySaved(movie.id)) {
      const savedEntry = savedMovies.value.find(
        (m) => String(m.id) === String(movie.id),
      );

      await unsaveMovie(savedEntry.docId);

      savedMovies.value = savedMovies.value.filter((m) => m.id !== movie.id);
      savedMoviesIds.value = savedMoviesIds.value.filter(
        (id) => id !== movie.id,
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
        savedMoviesIds.value.push(movie.id);
      }
    }
  }

  function isAlreadySaved(movieId) {
    const movie = savedMovies.value.find(
      (movie) => String(movie.id) === String(movieId),
    );

    return !!movie;
  }

  return {
    savedMovies,
    savedMoviesIds,
    loadSavedMovies,
    isAlreadySaved,
    toggleSaved,
  };
});
