import { mapTmdbMovie } from '../lib/tmdb.mjs' // AI-assisted - see AI-USAGE.md #3
import { findMovies, parseSearchFilters } from '../lib/searchFilters.mjs' // AI-assisted - see AI-USAGE.md #7

// AI-assisted - see AI-USAGE.md #7
class TmdbError extends Error {
  constructor(status) {
    super(`TMDB returned HTTP ${status}`)
    this.status = status
  }
}

export default async function searchMovies(request) { //AI ASSISTED
  if (request.method !== 'GET') { //AI ASSISTED
    return Response.json({ error: 'Use GET to search for movies.' }, { //AI ASSISTED
      status: 405, //AI ASSISTED
      headers: { Allow: 'GET' }, //AI ASSISTED
    }) //AI ASSISTED
  } //AI ASSISTED

  // AI-assisted - see AI-USAGE.md #7: title is optional when filters are chosen
  const { filters, error } = parseSearchFilters(new URL(request.url).searchParams)
  if (error) return Response.json({ error }, { status: 400 })

  const token = process.env.TMDB_READ_TOKEN?.trim() //AI ASSISTED
  if (!token) { //AI ASSISTED
    return Response.json({ error: 'Movie search is not configured.' }, { status: 503 }) //AI ASSISTED
  } //AI ASSISTED

  // AI-assisted - see AI-USAGE.md #7: one helper for every TMDB call the filters need
  async function tmdbGet(path, params) {
    const url = new URL(`https://api.themoviedb.org/3${path}`)
    for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value)
    const response = await fetch(url, { //AI ASSISTED
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, //AI ASSISTED
      signal: AbortSignal.timeout(8000), //AI ASSISTED
    }) //AI ASSISTED
    if (!response.ok) throw new TmdbError(response.status)
    return response.json()
  }

  try { //AI ASSISTED
    const result = await findMovies(filters, tmdbGet) // AI-assisted - see AI-USAGE.md #7
    const movies = result.movies.map(mapTmdbMovie) // AI-assisted - see AI-USAGE.md #3
    const body = { movies } // AI-assisted - see AI-USAGE.md #7
    if (filters.director) body.director = result.director // AI-assisted - see AI-USAGE.md #7

    return Response.json(body) // AI-assisted - see AI-USAGE.md #7
  } catch (error) { //AI ASSISTED
    const timedOut = error.name === 'TimeoutError' //AI ASSISTED
    if (error instanceof TmdbError) console.warn('TMDB movie search returned HTTP', error.status) // AI-assisted - see AI-USAGE.md #7
    else console.warn('TMDB movie search failed:', error.name) // AI-assisted - see AI-USAGE.md #7
    return Response.json({ error: 'Movie search is temporarily unavailable.' }, { //AI ASSISTED
      status: timedOut ? 504 : 502, //AI ASSISTED
    }) //AI ASSISTED
  } //AI ASSISTED
} //AI ASSISTED
