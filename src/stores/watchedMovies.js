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
  addDoc,
  deleteDoc,
  updateDoc,
} from "@/services/firebase.js";

export const useWatchedMoviesStore = defineStore("watchedMovies", () => {
  const watchedMovies = ref([]);
  const watchedMoviesIds = ref([]);

  async function loadWatchedMovies() {
    if (watchedMovies.value.length > 0) return;

    const groupStore = useGroupsStore();
    const activeGroup = groupStore.activeGroup;

    if (!activeGroup) {
      const snapshot = await getDocs(collection(db, "watchedMovies"));

      watchedMovies.value = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      watchedMoviesIds.value = watchedMovies.value.map((movie) => movie.id);

      return;
    }

    const snapshot = await getDocs(
      collection(db, "groups", activeGroup.id, "watchedMovies"),
    );

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
    const activeGroup = groupStore.activeGroup;

    if (!activeGroup) {
      // Handle the case when there is no active group
      return;
    }

    const groupMoviesCollectionRef = collection(
      db,
      "groups",
      activeGroup.id,
      "watchedMovies",
    );

    const existingGroupMovie = watchedMovies.value.find(
      (m) => m.id === movie.id,
    );

    if (existingGroupMovie) {
      const updatedReviews = { ...existingGroupMovie.reviews, ...review };

      const ratings = Object.values(updatedReviews).map((r) =>
        Number(r.rating),
      );
      const average_rating = Number(
        ratings.reduce((a, b) => a + b, 0) / ratings.length,
      ).toFixed(1);

      const movieDocRef = doc(
        db,
        "groups",
        activeGroup.id,
        "watchedMovies",
        existingGroupMovie.docId,
      );

      await updateDoc(movieDocRef, {
        reviews: updatedReviews,
        average_rating,
        updated_at: new Date(),
      });

      existingGroupMovie.reviews = updatedReviews;
      existingGroupMovie.average_rating = average_rating;
    } else {
      const ratings = Object.values(review).map((r) => Number(r.rating));
      const average_rating = Number(
        ratings.reduce((a, b) => a + b, 0) / ratings.length,
      ).toFixed(1);

      const docRef = await addDoc(groupMoviesCollectionRef, {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        poster_path: movie.poster_path,
        reviews: review,
        average_rating,
        created_at: new Date(),
      });

      watchedMovies.value.push({
        ...movie,
        docId: docRef.id,
        reviews: review,
        average_rating,
      });
      watchedMoviesIds.value.push(movie.id);
    }

    // const savedMoviesStore = useSavedMoviesStore();
    // if (savedMoviesStore.isAlreadySaved(movie.id)) {
    //   await savedMoviesStore.toggleSaved(movie);
    // }
  }

  async function deleteWatchedMovie(id) {
    const movieEntry = watchedMovies.value.find(
      (m) => String(m.id) === String(id),
    );

    await deleteDoc(doc(db, "watchedMovies", movieEntry.docId));

    watchedMovies.value = watchedMovies.value.filter(
      (movie) => movie.id !== id,
    );
    watchedMoviesIds.value = watchedMoviesIds.value.filter(
      (movieId) => movieId !== id,
    );
  }

  function isAlreadyWatched(movieId) {
    const authStore = useAuthStore();
    const groupStore = useGroupsStore();

    const activeGroup = groupStore.activeGroup;
    const currentUserId = authStore.user.uid;

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
