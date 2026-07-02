import { defineStore } from "pinia";
import { ref } from "vue";

import {
  db,
  doc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
} from "@/services/firebase.js";

import { useSavedMoviesStore } from "./savedMovies.js";

export const useWatchedMoviesStore = defineStore("watchedMovies", () => {
  const watchedMovies = ref([]);
  const watchedMoviesIds = ref([]);

  async function loadWatchedMovies() {
    const snapshot = await getDocs(collection(db, "watchedMovies"));

    watchedMovies.value = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    watchedMoviesIds.value = watchedMovies.value.map((movie) => movie.id);
  }

  async function saveWatchedMovie(movie, reviews) {
    if (isAlreadyWatched(movie.id)) return;

    const ratings = Object.values(reviews).map((r) => r.rating);
    const average_rating = Number(
      ratings.reduce((a, b) => a + b, 0) / ratings.length,
    ).toFixed(1);

    const docRef = await addDoc(collection(db, "watchedMovies"), {
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      poster_path: movie.poster_path,
      reviews,
      average_rating,
      watched_at: new Date().toISOString(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    watchedMovies.value.push({
      ...movie,
      docId: docRef.id,
      reviews,
      average_rating,
    });

    watchedMoviesIds.value.push(movie.id);

    const savedMoviesStore = useSavedMoviesStore();
    if (savedMoviesStore.isAlreadySaved(movie.id)) {
      await savedMoviesStore.toggleSaved(movie);
    }
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
    return watchedMoviesIds.value.includes(movieId);
  }

  return {
    watchedMovies,
    loadWatchedMovies,
    saveWatchedMovie,
    deleteWatchedMovie,
    isAlreadyWatched,
  };
});
