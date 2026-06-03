import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getDocs,
  collection,
  db,
  addDoc,
  deleteDoc,
  doc,
} from "../services/firebase.js";
import { getMovie } from "../services/tmdb.js";

export const useSavedMoviesStore = defineStore("savedMovies", () => {
  const savedMovies = ref([]);
  const savedMoviesIds = ref([]);
  const savedMoviesDetailed = ref([]);

  async function loadSavedMovies() {
    const snapshot = await getDocs(collection(db, "savedMovies"));

    const movies = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })).sort((a, b) => b.vote_average - a.vote_average);

    savedMovies.value = movies;
    savedMoviesIds.value = savedMovies.value.map((movie) => movie.id);
  }

  async function loadSavedMoviesDetailed() {
    await loadSavedMovies();

    savedMoviesDetailed.value = await Promise.all(
      savedMovies.value.map(async (movie) => {
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

  async function saveMovie(movie) {
    return await addDoc(collection(db, "savedMovies"), {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    });
  }

  async function unsaveMovie(docId) {
    await deleteDoc(doc(db, "savedMovies", docId));
  }

  async function toggleSaved(movie) {
    if (isAlreadySaved(movie.id)) {
      const savedEntry = savedMovies.value.find(m => String(m.id) === String(movie.id))

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
    return savedMoviesIds.value.includes(movieId);
  }

  return {
    savedMovies,
    savedMoviesDetailed,
    loadSavedMoviesDetailed,
    isAlreadySaved,
    toggleSaved,
  };
});
