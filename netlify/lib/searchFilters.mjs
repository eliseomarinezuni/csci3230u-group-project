// AI-assisted - see AI-USAGE.md #7
// Filtered movie search for /api/movies/search.
//
// TMDB has no single endpoint that takes a title AND filters, so we pick one of three ways:
//   1. Director given  -> find the person, then use the movies they directed.
//   2. Title only      -> TMDB title search, then filter the results ourselves.
//   3. Filters only    -> TMDB "discover", which filters and sorts on TMDB's side.

export const searchSorts = ['relevance', 'rating', 'lowest-rated', 'newest', 'oldest']

const MIN_YEAR = 1870
const MAX_RESULTS = 60
const SEARCH_PAGES_WITH_FILTERS = 3 // a title search returns 20 per page; filtering can remove most of them

const discoverSorts = {
  relevance: 'popularity.desc',
  rating: 'vote_average.desc',
  'lowest-rated': 'vote_average.asc',
  newest: 'primary_release_date.desc',
  oldest: 'primary_release_date.asc',
}

// Reads the URL's search params. Returns { filters } or { error } (a message for the user).
export function parseSearchFilters(params, now = new Date()) {
  const text = (name) => params.get(name)?.trim() ?? ''
  const maxYear = now.getFullYear() + 10

  const query = text('q')
  const director = text('director')
  if (query.length > 200) return { error: 'Enter a movie title of 200 characters or fewer.' }
  if (director.length > 100) return { error: 'Enter a director name of 100 characters or fewer.' }

  const years = {}
  for (const name of ['yearFrom', 'yearTo']) {
    const value = text(name)
    if (!value) continue
    const year = Number(value)
    if (!/^\d{4}$/.test(value) || year < MIN_YEAR || year > maxYear) {
      return { error: `Years must be between ${MIN_YEAR} and ${maxYear}.` }
    }
    years[name] = year
  }
  if (years.yearFrom && years.yearTo && years.yearFrom > years.yearTo) {
    return { error: 'The "from" year must be before or the same as the "to" year.' }
  }

  let minRating = null
  if (text('minRating')) {
    minRating = Number(text('minRating'))
    // Any decimal from 0 to 10, e.g. 7, 7.5, 7.25 or .5
    if (!/^(\d+(\.\d*)?|\.\d+)$/.test(text('minRating')) || minRating > 10) {
      return { error: 'Minimum rating must be a number from 0 to 10.' }
    }
  }

  let genre = null
  if (text('genre')) {
    if (!/^\d{1,9}$/.test(text('genre'))) return { error: 'Invalid genre.' }
    genre = Number(text('genre'))
  }

  const sort = text('sort') || 'relevance'
  if (!searchSorts.includes(sort)) return { error: 'Invalid sort option.' }

  const filters = {
    query,
    director,
    yearFrom: years.yearFrom ?? null,
    yearTo: years.yearTo ?? null,
    minRating,
    genre,
    sort,
  }
  if (!query && !hasFilters(filters)) {
    return { error: 'Enter a movie title or choose at least one filter.' }
  }
  return { filters }
}

// True when anything other than the title (and sort) narrows the search.
export function hasFilters({ director, yearFrom, yearTo, minRating, genre }) {
  return Boolean(director || yearFrom || yearTo || minRating != null || genre)
}

// Returns { movies, director } where movies are raw TMDB movie objects.
// tmdbGet(path, params) fetches a TMDB path and returns its JSON.
export async function findMovies(filters, tmdbGet) {
  if (filters.director) return findByDirector(filters, tmdbGet)
  if (filters.query) return { movies: await findByTitle(filters, tmdbGet) }
  return { movies: await discover(filters, tmdbGet) }
}

async function findByDirector(filters, tmdbGet) {
  const people = await tmdbGet('/search/person', { query: filters.director, include_adult: 'false' })
  // Prefer someone TMDB knows as a director, e.g. "Nolan" -> Christopher Nolan, not an actor named Nolan
  const person = people.results.find((p) => p.known_for_department === 'Directing') ?? people.results[0]
  if (!person) return { movies: [], director: null }

  const credits = await tmdbGet(`/person/${person.id}/movie_credits`, {})
  const directed = uniqueById(credits.crew.filter((credit) => credit.job === 'Director'))

  const title = filters.query.toLocaleLowerCase()
  const matching = directed.filter((movie) => (
    !title ||
    movie.title?.toLocaleLowerCase().includes(title) ||
    movie.original_title?.toLocaleLowerCase().includes(title)
  ))

  // A director's credits come in no useful order, so "best match" means most popular
  const sort = filters.sort === 'relevance' ? 'popular' : filters.sort
  return {
    movies: sortMovies(matching.filter((movie) => matchesFilters(movie, filters)), sort).slice(0, MAX_RESULTS),
    director: { id: person.id, name: person.name },
  }
}

async function findByTitle(filters, tmdbGet) {
  const params = { query: filters.query, include_adult: 'false' }
  // A single year can be narrowed on TMDB's side
  if (filters.yearFrom && filters.yearFrom === filters.yearTo) params.primary_release_year = filters.yearFrom

  const first = await tmdbGet('/search/movie', { ...params, page: 1 })
  let results = first.results

  // With filters on, look a little deeper so filtering doesn't leave an almost empty page
  if (hasFilters(filters)) {
    const lastPage = Math.min(first.total_pages ?? 1, SEARCH_PAGES_WITH_FILTERS)
    const more = []
    for (let page = 2; page <= lastPage; page++) more.push(tmdbGet('/search/movie', { ...params, page }))
    for (const data of await Promise.all(more)) results = results.concat(data.results)
  }

  const matching = uniqueById(results).filter((movie) => matchesFilters(movie, filters))
  return sortMovies(matching, filters.sort).slice(0, MAX_RESULTS)
}

async function discover(filters, tmdbGet) {
  const params = {
    sort_by: discoverSorts[filters.sort],
    include_adult: 'false',
    // Skip barely-rated titles, which otherwise top (or bottom) the list with a single vote
    'vote_count.gte': filters.sort === 'rating' || filters.sort === 'lowest-rated' ? '500' : '50',
  }
  if (filters.yearFrom) params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`
  if (filters.yearTo) params['primary_release_date.lte'] = `${filters.yearTo}-12-31`
  if (filters.minRating != null) params['vote_average.gte'] = String(filters.minRating)
  if (filters.genre) params.with_genres = String(filters.genre)

  const pages = await Promise.all([1, 2].map((page) => tmdbGet('/discover/movie', { ...params, page })))
  return uniqueById(pages.flatMap((data) => data.results)).filter((movie) => matchesFilters(movie, filters))
}

function releaseYear(movie) {
  return Number(movie.release_date?.slice(0, 4)) || null
}

export function matchesFilters(movie, { yearFrom, yearTo, minRating, genre }) {
  const year = releaseYear(movie)
  if ((yearFrom || yearTo) && !year) return false
  if (yearFrom && year < yearFrom) return false
  if (yearTo && year > yearTo) return false
  if (minRating != null && (!movie.vote_count || movie.vote_average < minRating)) return false
  if (genre && !movie.genre_ids?.includes(genre)) return false
  return true
}

// Sorts a copy. Movies missing the sorted value always go last.
export function sortMovies(movies, sort) {
  const by = {
    popular: (movie) => movie.popularity ?? null,
    rating: (movie) => (movie.vote_count ? movie.vote_average : null),
    'lowest-rated': (movie) => (movie.vote_count ? movie.vote_average : null),
    newest: (movie) => movie.release_date || null,
    oldest: (movie) => movie.release_date || null,
  }[sort]
  if (!by) return [...movies] // relevance: keep TMDB's order

  const direction = sort === 'oldest' || sort === 'lowest-rated' ? 1 : -1
  return [...movies].sort((a, b) => {
    const left = by(a)
    const right = by(b)
    if (left === right) return 0
    if (left === null) return 1
    if (right === null) return -1
    return left < right ? -direction : direction
  })
}

function uniqueById(movies) {
  const seen = new Set()
  return movies.filter((movie) => !seen.has(movie.id) && seen.add(movie.id))
}
