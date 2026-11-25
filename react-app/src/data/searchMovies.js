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

export function getSearchQuery(search) { //AI ASSISTED
  return (new URLSearchParams(search).get('q') ?? '').trim() //AI ASSISTED
}

// AI-assisted - see AI-USAGE.md #7
// Search filters live in the URL (e.g. /search?q=dark&director=nolan&yearFrom=2000)
// so a filtered search can be shared, refreshed, and undone with the Back button.
export const searchFilterNames = ['director', 'yearFrom', 'yearTo', 'minRating', 'genre', 'sort']

export const searchSortOptions = [
  { value: 'relevance', label: 'Best match' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'lowest-rated', label: 'Lowest rated' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
]

export const emptySearchFilters = {
  director: '', yearFrom: '', yearTo: '', minRating: '', genre: '', sort: 'relevance',
}

// '?q=x&director=nolan' -> { director: 'nolan', yearFrom: '', ..., sort: 'relevance' }
export function getSearchFilters(search) {
  const params = new URLSearchParams(search)
  const filters = { ...emptySearchFilters }
  for (const name of searchFilterNames) {
    const value = params.get(name)?.trim()
    if (value) filters[name] = value
  }
  return filters
}

// True when a filter (not just the sort order) narrows the search
export function hasSearchFilters(filters) {
  return searchFilterNames.some((name) => name !== 'sort' && Boolean(filters[name]))
}

// Builds the /search URL, leaving out empty filters and the default sort
export function getSearchPath(query, filters = {}) {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  for (const name of searchFilterNames) {
    const value = String(filters[name] ?? '').trim()
    if (value && !(name === 'sort' && value === 'relevance')) params.set(name, value)
  }
  return params.size ? `/search?${params}` : '/search'
}

// Checks the filter form before searching.
// Returns { field, message } for the first problem ('years' or 'minRating'), or null when it's fine.
export function validateSearchFilters(filters, now = new Date()) {
  const maxYear = now.getFullYear() + 10
  for (const name of ['yearFrom', 'yearTo']) {
    const value = filters[name]
    if (value && (!/^\d{4}$/.test(value) || value < 1870 || value > maxYear)) {
      return { field: 'years', message: `Enter years between 1870 and ${maxYear}.` }
    }
  }
  if (filters.yearFrom && filters.yearTo && Number(filters.yearFrom) > Number(filters.yearTo)) {
    return { field: 'years', message: 'The "from" year must be before or the same as the "to" year.' }
  }
  const rating = String(filters.minRating ?? '').trim()
  if (rating && !(/^(\d+(\.\d*)?|\.\d+)$/.test(rating) && Number(rating) <= 10)) {
    return { field: 'minRating', message: 'Enter a minimum rating from 0 to 10, e.g. 7.5.' }
  }
  return null
}

// Returns { movies, director } with readable genre names on each movie
export default async function searchMovies(query, options) { //AI ASSISTED
  const { movies, director } = await searchTmdbMovies(query, options) // AI-assisted - see AI-USAGE.md #7
  return { movies: movies.map(withGenreNames), director } // AI-assisted - see AI-USAGE.md #7
}

export function withGenreNames(movie) { // AI-assisted - see AI-USAGE.md #3
  return {
    ...movie, //AI ASSISTED
    genres: (movie.genreIds ?? []).map((id) => movieGenres[id]).filter(Boolean), //AI ASSISTED
  }
}
