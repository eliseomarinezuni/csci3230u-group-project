//AI-assisted - see AI-USAGE.md #6
//Details for one TV show: /api/tv/1396 -> TMDB's /tv/1396
import { mapTmdbShow } from '../lib/tmdb.mjs'

function errorResponse(status, message) {
  return Response.json({ error: message }, { status })
}

export default async function tvDetails(request) {
  //last part of address 
  const id = new URL(request.url).pathname.split('/').pop()
  if (!/^\d+$/.test(id)) return errorResponse(400, 'Invalid TV show ID.')

  const token = process.env.TMDB_READ_TOKEN
  if (!token) return errorResponse(503, 'TV show details are not set up (missing TMDB token).')

  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.status === 404) return errorResponse(404, 'TV show not found.')
    if (!response.ok) return errorResponse(502, 'TMDB is not responding. Try again soon.')

    const show = await response.json()

    show.genre_ids = show.genres.map((genre) => genre.id)
    return Response.json({ show: mapTmdbShow(show) })
  } catch {
    return errorResponse(502, 'TMDB is not responding. Try again soon.')
  }
}