import { mapTmdbMovie } from '../lib/tmdb.mjs' //AI ASSISTED

export default async function movieDetails(request) { //AI ASSISTED
  if (request.method !== 'GET') { //AI ASSISTED
    return Response.json({ error: 'Use GET to load movie details.' }, { //AI ASSISTED
      status: 405, //AI ASSISTED
      headers: { Allow: 'GET' }, //AI ASSISTED
    }) //AI ASSISTED
  } //AI ASSISTED

  const id = new URL(request.url).pathname.match(/\/([1-9]\d{0,9})\/?$/)?.[1] //AI ASSISTED
  if (!id) return Response.json({ error: 'Invalid movie ID.' }, { status: 400 }) //AI ASSISTED

  const token = process.env.TMDB_READ_TOKEN?.trim() //AI ASSISTED
  if (!token) return Response.json({ error: 'Movie details are not configured.' }, { status: 503 }) //AI ASSISTED

  const unavailable = 'Movie details are temporarily unavailable.' //AI ASSISTED
  try { //AI ASSISTED
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, { //AI ASSISTED
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, //AI ASSISTED
      signal: AbortSignal.timeout(8000), //AI ASSISTED
    }) //AI ASSISTED

    if (response.status === 404) return Response.json({ error: 'Movie not found.' }, { status: 404 }) //AI ASSISTED
    if (!response.ok) return Response.json({ error: unavailable }, { status: 502 }) //AI ASSISTED

    const movie = await response.json() //AI ASSISTED
    if (movie?.id !== Number(id) || !movie.title?.trim()) { //AI ASSISTED
      return Response.json({ error: unavailable }, { status: 502 }) //AI ASSISTED
    } //AI ASSISTED

    return Response.json({ //AI ASSISTED
      movie: mapTmdbMovie({ ...movie, genre_ids: movie.genres?.map((genre) => genre.id) ?? [] }), //AI ASSISTED
    }) //AI ASSISTED
  } catch (error) { //AI ASSISTED
    return Response.json({ error: unavailable }, { //AI ASSISTED
      status: error.name === 'TimeoutError' ? 504 : 502, //AI ASSISTED
    }) //AI ASSISTED
  } //AI ASSISTED
} //AI ASSISTED
