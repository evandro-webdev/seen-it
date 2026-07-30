const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
};

async function fetchTMDB(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      throw new Error(`Erro TMDB (${res.status}): ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Falha na requisição TMDB [${endpoint}]:`, error);
    throw error;
  }
}

export async function searchMovies(query, page = 1) {
  if (!query?.trim()) return { results: [], page: 1, total_pages: 0 };
  return fetchTMDB(
    `/search/movie?include_adult=false&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`
  );
}

export async function getMovie(movieId) {
  return fetchTMDB(`/movie/${movieId}?language=pt-BR`);
}

export async function getMovieWithCredits(movieId) {
  return fetchTMDB(`/movie/${movieId}?language=pt-BR&append_to_response=credits`);
}

export async function getPopularMovies() {
  const allowedLanguages = "en|pt|fr|ko|ja";
  return fetchTMDB(
    `/discover/movie?include_adult=false&language=pt-BR&page=1` +
      `&with_original_language=${allowedLanguages}` +
      `&vote_count.gte=50` +
      `&sort_by=popularity.desc`
  );
}

export async function getTopRatedMovies() {
  const allowedLanguages = "en|pt|fr|ko|ja";
  return fetchTMDB(
    `/discover/movie?include_adult=false&language=pt-BR&page=1` +
      `&vote_count.gte=300` +
      `&with_original_language=${allowedLanguages}` +
      `&sort_by=vote_average.desc`
  );
}

export async function getUpcomingMovies() {
  const today = new Date().toISOString().split("T")[0];
  const allowedLanguages = "en|pt|fr|ko|ja";

  return fetchTMDB(
    `/discover/movie?include_adult=false&region=BR&language=pt-BR&page=1` +
      `&primary_release_date.gte=${today}` +
      `&with_original_language=${allowedLanguages}` +
      `&popularity.gte=5` +
      `&sort_by=popularity.desc`
  );
}

export async function getTrendingMovies() {
  return fetchTMDB(`/trending/movie/day?language=pt-BR`);
}

export async function getGenres() {
  return fetchTMDB(`/genre/movie/list?language=pt-BR`);
}

export async function getMoviesByGenre(genreId, page = 1) {
  const allowedLanguages = "en|pt|fr|ko|ja";
  return fetchTMDB(
    `/discover/movie?language=pt-BR&page=${page}` +
      `&with_genres=${genreId}` +
      `&with_original_language=${allowedLanguages}` +
      `&vote_count.gte=20` +
      `&sort_by=popularity.desc`
  );
}