const BASE_URL = 'https://api.themoviedb.org/3';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
  }
};

export async function searchMovies(query){
  const res = await fetch(`${BASE_URL}/search/movie?language=pt-BR&query=${encodeURIComponent(query)}`, options);
  return res.json();
}

export async function getMovie(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?language=pt-BR`, options)
  return res.json()
}

export async function getMovieWithCredits(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?language=pt-BR&append_to_response=credits`, 
    options
  )
  return res.json()
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?include_adult=false&language=pt-BR&page=1`, options)
  const data = await res.json()
  return {
    ...data,
    results: data.results.filter(movie => movie.vote_count > 100)
  }
}

export async function getTopRatedMovies() {
  const res = await fetch(`${BASE_URL}/movie/top_rated?include_adult=false&language=pt-BR&page=1`, options)
  return res.json()
}

export async function getUpcomingMovies() {
    const res = await fetch(`${BASE_URL}/movie/upcoming?include_adult=false&region=BR&language=pt-BR&page=1`, options)
    return res.json()
}