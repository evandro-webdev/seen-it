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

export const useSavedMoviesStore = defineStore("savedMovies", () => {
  const savedMovies = ref([]);
  const savedMoviesIds = ref([]);

  async function loadSavedMovies() {
    const snapshot = await getDocs(collection(db, "savedMovies"));

    const movies = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    savedMovies.value = movies;
    savedMoviesIds.value = savedMovies.value.map((movie) => movie.id);
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
    return savedMoviesIds.value.includes(movieId);
  }

  return {
    savedMovies,
    savedMoviesIds,
    loadSavedMovies,
    isAlreadySaved,
    toggleSaved,
  };
});
