import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useAuthStore } from "./auth.js";
import { useSavedMoviesStore } from "./savedMovies.js";
import { useGroupsStore } from "./groups.js";

import {
  db,
  doc,
  getDocs,
  collection,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "@/services/firebase.js";
import { useNotificationsStore } from "./notifications.js";

export const useWatchedMoviesStore = defineStore("watchedMovies", () => {
  const watchedMovies = ref([]);
  const watchedMoviesIds = ref([]);

  async function loadWatchedMovies() {
    if (watchedMovies.value.length > 0) return;

    const groupStore = useGroupsStore();
    const authStore = useAuthStore();
    const activeGroup = groupStore.activeGroup;

    let targetCollectionPath = "";

    if (!activeGroup) {
      if (!authStore.user?.uid) return;
      targetCollectionPath = `users/${authStore.user.uid}/watchedMovies`;
    } else {
      targetCollectionPath = `groups/${activeGroup.id}/watchedMovies`;
    }

    const snapshot = await getDocs(collection(db, targetCollectionPath));

    watchedMovies.value = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    watchedMoviesIds.value = watchedMovies.value.map((movie) => movie.id);
  }

  const groupStore = useGroupsStore();
  watch(
    () => groupStore.activeGroup,
    async (newGroup) => {
      watchedMovies.value = [];
      watchedMoviesIds.value = [];

      if (newGroup) {
        await groupStore.loadActiveGroupMembers();
      }

      await loadWatchedMovies();
    },
    { immediate: true },
  );

  async function saveWatchedMovie(movie, review) {
    const groupStore = useGroupsStore();
    const authStore = useAuthStore();
    const notificationsStore = useNotificationsStore();
    const savedMoviesStore = useSavedMoviesStore();

    const activeGroup = groupStore.activeGroup;
    let targetCollectionPath = "";

    if (!activeGroup) {
      if (!authStore.user?.uid) return;
      targetCollectionPath = `users/${authStore.user.uid}/watchedMovies`;
    } else {
      targetCollectionPath = `groups/${activeGroup.id}/watchedMovies`;
    }

    const movieDocRef = doc(db, targetCollectionPath, String(movie.id));

    const docSnap = await getDoc(movieDocRef);
    const isAlreadyWatched = docSnap.exists();

    let updatedReviews = {};
    let average_rating = "0.0";

    if (isAlreadyWatched) {
      const existingData = docSnap.data();
      updatedReviews = { ...existingData.reviews, ...review };

      const ratings = Object.values(updatedReviews).map((r) =>
        Number(r.rating),
      );

      average_rating = Number(
        ratings.reduce((a, b) => a + b, 0) / ratings.length,
      ).toFixed(1);

      await updateDoc(movieDocRef, {
        reviews: updatedReviews,
        average_rating,
        updated_at: new Date(),
      });
    } else {
      updatedReviews = { ...review };

      const ratings = Object.values(updatedReviews).map((r) =>
        Number(r.rating),
      );

      average_rating = Number(
        ratings.reduce((a, b) => a + b, 0) / ratings.length,
      ).toFixed(1);

      await setDoc(movieDocRef, {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        poster_path: movie.poster_path,
        reviews: updatedReviews,
        average_rating,
        created_at: new Date(),
      });
    }

    const existingLocalIndex = watchedMovies.value.findIndex(
      (m) => String(m.id) === String(movie.id),
    );

    const localMovieData = {
      ...movie,
      docId: String(movie.id),
      reviews: updatedReviews,
      average_rating,
    };

    if (existingLocalIndex !== -1) {
      watchedMovies.value[existingLocalIndex] = localMovieData;
    } else {
      watchedMovies.value.push(localMovieData);
      watchedMoviesIds.value.push(movie.id);
    }

    if (activeGroup) {
      await notificationsStore.dispatchWatchedMovieNotification(movie);
    }

    if (savedMoviesStore.isAlreadySaved(movie.id)) {
      await savedMoviesStore.toggleSaved(movie);
    }
  }

  async function deleteWatchedMovie(id) {
    const groupStore = useGroupsStore();
    const authStore = useAuthStore();
    const activeGroup = groupStore.activeGroup();

    if (!activeGroup) {
      if (!authStore.user?.uid) return;
      await deleteDoc(
        doc(db, "users", authStore.user.uid, "watchedMovies", String(id)),
      );
    } else {
      await deleteDoc(
        doc(db, "groups", activeGroup.id, "watchedMovies", String(id)),
      );
    }

    watchedMovies.value = watchedMovies.value.filter(
      (movie) => String(movie.id) !== String(id),
    );
    watchedMoviesIds.value = watchedMoviesIds.value.filter(
      (id) => String(id) !== String(id),
    );
  }

  function isAlreadyWatched(movieId) {
    const authStore = useAuthStore();
    const groupStore = useGroupsStore();

    const activeGroup = groupStore.activeGroup;
    const currentUserId = authStore.user?.uid;

    if (!currentUserId) return false;

    if (!activeGroup) {
      return watchedMoviesIds.value.includes(movieId);
    }

    const groupMovie = watchedMovies.value.find(
      (movie) => String(movie.id) === String(movieId),
    );

    if (!groupMovie) {
      return false;
    }

    return !!(groupMovie.reviews && groupMovie.reviews[currentUserId]);
  }

  return {
    watchedMovies,
    loadWatchedMovies,
    saveWatchedMovie,
    deleteWatchedMovie,
    isAlreadyWatched,
  };
});
