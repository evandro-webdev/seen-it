import { defineStore } from "pinia";
import { ref } from "vue";
import {
  db,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
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
    const activeGroup = groupStore.activeGroup;

    if (!activeGroup) {
      const snapshot = await getDocs(collection(db, "savedMovies"));

      const movies = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      savedMovies.value = movies;
      savedMoviesIds.value = savedMovies.value.map((movie) => movie.id);
    }

    const snapshot = await getDocs(
      collection(db, "groups", activeGroup.id, "savedMovies"),
    );

    savedMovies.value = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    savedMoviesIds.value = savedMovies.value.map((movie) => movie.id);
  }

  async function saveMovie(movie) {
    const groupStore = useGroupsStore();
    const notificationsStore = useNotificationsStore();
    const authStore = useAuthStore();
    const activeGroup = groupStore.activeGroup;

    if (!activeGroup) {
      // Handle the case when there is no active group
      return;
    }

    const groupMoviesCollectionRef = collection(
      db,
      "groups",
      activeGroup.id,
      "savedMovies",
    );

    const docRef = await addDoc(groupMoviesCollectionRef, {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    });

    await notificationsStore.dispatchSavedMovieNotification(
      authStore.user.uid,
      authStore.user.displayName,
      movie.id,
      movie.title,
    );

    return docRef;
  }

  async function unsaveMovie(docId) {
    const groupStore = useGroupsStore();

    const activeGroup = groupStore.activeGroup;

    if (!activeGroup) {
      return await deleteDoc(doc(db, "savedMovies", docId));
    }

    await deleteDoc(doc(db, "groups", activeGroup.id, "savedMovies", docId));
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
