const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
};

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`,
    options,
  );
  return res.json();
}

export async function getMovie(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?language=pt-BR`,
    options,
  );
  return res.json();
}

export async function getMovieWithCredits(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?language=pt-BR&append_to_response=credits`,
    options,
  );
  return res.json();
}

export async function getPopularMovies() {
  const allowedLanguages = "en|pt|fr|ko|ja";

  const res = await fetch(
    `${BASE_URL}/discover/movie?include_adult=false&language=pt-BR&page=1` +
      `&with_original_language=${allowedLanguages}` +
      `&vote_count.gte=50` +
      `&sort_by=popularity.desc`,
    options,
  );

  return await res.json();
}

export async function getTopRatedMovies() {
  const allowedLanguages = "en|pt|fr|ko|ja";

  const res = await fetch(
    `${BASE_URL}/discover/movie?include_adult=false&language=pt-BR&page=1` +
      `&vote_count.gte=300` +
      `&with_original_language=${allowedLanguages}` +
      `&sort_by=vote_average.desc`,
    options,
  );

  return await res.json();
}

export async function getUpcomingMovies() {
  const today = new Date().toISOString().split("T")[0];

  const allowedLanguages = "en|pt|fr|ko|ja";

  const res = await fetch(
    `${BASE_URL}/discover/movie?include_adult=false&region=BR&language=pt-BR&page=1` +
      `&primary_release_date.gte=${today}` +
      `&with_original_language=${allowedLanguages}` +
      `&popularity.gte=5` +
      `&sort_by=popularity.desc`,
    options,
  );

  return await res.json();
}

export async function getTrendingMovies() {
  const response = await fetch(
    `${BASE_URL}/trending/movie/day?language=pt-BR`,
    options,
  );
  return await response.json();
}

export async function getGenres() {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?language=pt-BR`,
    options,
  );
  return await response.json();
}

export async function getMoviesByGenre(genreId, page = 1) {
  const allowedLanguages = "en|pt|fr|ko|ja";

  const response = await fetch(
    `${BASE_URL}/discover/movie?language=pt-BR&page=${page}` +
      `&with_genres=${genreId}` +
      `&with_original_language=${allowedLanguages}` +
      `&vote_count.gte=20` +
      `&sort_by=popularity.desc`,
    options,
  );

  return await response.json();
}
