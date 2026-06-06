import { defineStore } from "pinia";
import { ref } from "vue";

import {
  db,
  doc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
} from "../services/firebase.js";
import { getMovie } from "../services/tmdb.js";

import { useSavedMoviesStore } from "./savedMovies.js";

export const useWatchedMoviesStore = defineStore("watchedMovies", () => {
  const watchedMovies = ref([]);
  const watchedMoviesIds = ref([]);
  const watchedMoviesDetailed = ref([]);

  async function loadWatchedMovies() {
    const snapshot = await getDocs(collection(db, "watchedMovies"));

    watchedMovies.value = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    watchedMoviesIds.value = watchedMovies.value.map((movie) => movie.id);

    watchedMovies.value.sort((a, b) => b.average_rating - a.average_rating);
  }

  async function loadWatchedMoviesDetailed() {
    await loadWatchedMovies();

    watchedMoviesDetailed.value = await Promise.all(
      watchedMovies.value.map(async (movie) => {
        const tmdbData = await getMovie(movie.id);

        return {
          ...movie,
          genres: tmdbData.genres,
          overview: tmdbData.overview,
          tagline: tmdbData.tagline,
          release_date: tmdbData.release_date,
          runtime: tmdbData.runtime,
          vote_average: tmdbData.vote_average.toFixed(1),
        };
      }),
    );
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
      docId: docRef.id,
      genres: movie.genres,
      overview: movie.overview,
      tagline: movie.tagline,
      release_date: movie.release_date,
      runtime: movie.runtime,
      average_rating: average_rating,
    });

    const savedMoviesStore = useSavedMoviesStore();
    if (savedMoviesStore.isAlreadySaved(movie.id)) {
      await savedMoviesStore.toggleSaved(movie);
    }
  }

  async function deleteWatchedMovie(id) {
    await deleteDoc(doc(db, "watchedMovies", id));
  }

  function isAlreadyWatched(movieId) {
    return watchedMoviesIds.value.includes(movieId);
  }

  return {
    watchedMovies,
    watchedMoviesDetailed,
    loadWatchedMoviesDetailed,
    saveWatchedMovie,
    deleteWatchedMovie,
    isAlreadyWatched,
  };
});
