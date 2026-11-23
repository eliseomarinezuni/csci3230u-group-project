import { mapTmdbMovie } from '../lib/tmdb.mjs' // AI-assisted - see AI-USAGE.md #3

export default async function searchMovies(request) { //AI ASSISTED
  if (request.method !== 'GET') { //AI ASSISTED
    return Response.json({ error: 'Use GET to search for movies.' }, { //AI ASSISTED
      status: 405, //AI ASSISTED
      headers: { Allow: 'GET' }, //AI ASSISTED
    }) //AI ASSISTED
  } //AI ASSISTED

  const query = new URL(request.url).searchParams.get('q')?.trim() //AI ASSISTED
  if (!query || query.length > 200) { //AI ASSISTED
    return Response.json({ error: 'Enter a movie title of 1 to 200 characters.' }, { status: 400 }) //AI ASSISTED
  } //AI ASSISTED

  const token = process.env.TMDB_READ_TOKEN?.trim() //AI ASSISTED
  if (!token) { //AI ASSISTED
    return Response.json({ error: 'Movie search is not configured.' }, { status: 503 }) //AI ASSISTED
  } //AI ASSISTED

  const url = new URL('https://api.themoviedb.org/3/search/movie') //AI ASSISTED
  url.searchParams.set('query', query) //AI ASSISTED
  url.searchParams.set('include_adult', 'false') //AI ASSISTED

  try { //AI ASSISTED
    const response = await fetch(url, { //AI ASSISTED
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, //AI ASSISTED
      signal: AbortSignal.timeout(8000), //AI ASSISTED
    }) //AI ASSISTED

    if (!response.ok) { //AI ASSISTED
      console.warn('TMDB movie search returned HTTP', response.status) //AI ASSISTED
      return Response.json({ error: 'Movie search is temporarily unavailable.' }, { status: 502 }) //AI ASSISTED
    } //AI ASSISTED

    const { results } = await response.json() //AI ASSISTED
    const movies = results.map(mapTmdbMovie) // AI-assisted - see AI-USAGE.md #3

    return Response.json({ movies }) //AI ASSISTED
  } catch (error) { //AI ASSISTED
    const timedOut = error.name === 'TimeoutError' //AI ASSISTED
    console.warn('TMDB movie search failed:', error.name) //AI ASSISTED
    return Response.json({ error: 'Movie search is temporarily unavailable.' }, { //AI ASSISTED
      status: timedOut ? 504 : 502, //AI ASSISTED
    }) //AI ASSISTED
  } //AI ASSISTED
} //AI ASSISTED
