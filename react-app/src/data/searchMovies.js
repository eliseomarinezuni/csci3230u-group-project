import { searchTmdbMovies } from './tmdb.js' //AI ASSISTED

export const movieGenres = { //AI ASSISTED
  28: 'Action', //AI ASSISTED
  12: 'Adventure', //AI ASSISTED
  16: 'Animation', //AI ASSISTED
  35: 'Comedy', //AI ASSISTED
  80: 'Crime', //AI ASSISTED
  99: 'Documentary', //AI ASSISTED
  18: 'Drama', //AI ASSISTED
  10751: 'Family', //AI ASSISTED
  14: 'Fantasy', //AI ASSISTED
  36: 'History', //AI ASSISTED
  27: 'Horror', //AI ASSISTED
  10402: 'Music', //AI ASSISTED
  9648: 'Mystery', //AI ASSISTED
  10749: 'Romance', //AI ASSISTED
  878: 'Sci-Fi', //AI ASSISTED
  10770: 'TV Movie', //AI ASSISTED
  53: 'Thriller', //AI ASSISTED
  10752: 'War', //AI ASSISTED
  37: 'Western', //AI ASSISTED
}

export function getSearchQuery(hash = window.location.hash) {
  const queryString = hash.split('?')[1] ?? ''
  return (new URLSearchParams(queryString).get('q') ?? '').trim()
}

export function getSearchHash(query) {
  return `#/search?q=${encodeURIComponent(query.trim())}`
}

export default async function searchMovies(query, options) { //AI ASSISTED
  const movies = await searchTmdbMovies(query, options) //AI ASSISTED
  return movies.map(withGenreNames) // AI-assisted - see AI-USAGE.md #3
}

export function withGenreNames(movie) { // AI-assisted - see AI-USAGE.md #3
  return {
    ...movie, //AI ASSISTED
    genres: (movie.genreIds ?? []).map((id) => movieGenres[id]).filter(Boolean), //AI ASSISTED
  }
}
