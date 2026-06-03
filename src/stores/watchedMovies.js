import { defineStore } from "pinia";
import { ref } from "vue";
import { getDocs, collection, db } from "../services/firebase.js";
import { getMovie } from "../services/tmdb.js";

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
          average_rating: tmdbData.vote_average.toFixed(1),
        };
      }),
    );
  }

  function isAlreadyWatched(movieId) {
    return watchedMoviesIds.value.includes(movieId);
  }

  return {
    watchedMovies,
    watchedMoviesDetailed,
    loadWatchedMoviesDetailed,
    isAlreadyWatched,
  };
});
