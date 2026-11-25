//AI-assisted - see AI-USAGE.md #6
//The Genre page calls /api/genre?type=movie&genre=28&sort=top-rated&page=1

//Ask TMDB for list, TMDB does the genre filtering and sorting.
import { mapTmdbMovie, mapTmdbShow } from '../lib/tmdb.mjs'

//Our sort names -> what TMDB calls them
const movieSorts = {
  'top-rated': 'vote_average.desc',
  popular: 'popularity.desc',
  newest: 'primary_release_date.desc',
}
const tvSorts = {
  'top-rated': 'vote_average.desc',
  popular: 'popularity.desc',
  newest: 'first_air_date.desc',
}

function errorResponse(status, message) {
  return Response.json({ error: message }, { status })
}

export default async function genreTitles(request) {
  //Read the inputs from the URL
  const params = new URL(request.url).searchParams
  const type = params.get('type') || 'movie'
  const genre = params.get('genre') || ''
  const sort = params.get('sort') || 'top-rated'
  const page = Number(params.get('page') || '1')

  //Check them before calling TMDB
  if (type !== 'movie' && type !== 'tv') return errorResponse(400, 'Type must be movie or tv.')
  const sorts = type === 'movie' ? movieSorts : tvSorts
  if (!Object.hasOwn(sorts, sort)) return errorResponse(400, 'Invalid sort option.')
  if (genre !== '' && !/^\d+$/.test(genre)) return errorResponse(400, 'Invalid genre.')
  if (!Number.isInteger(page) || page < 1 || page > 500) return errorResponse(400, 'Invalid page number.')

  const token = process.env.TMDB_READ_TOKEN
  if (!token) return errorResponse(503, 'Genre browsing is not set up (missing TMDB token).')

  //Build the TMDB address, e.g. https://api.themoviedb.org/3/discover/tv?sort_by=...
  const url = new URL(`https://api.themoviedb.org/3/discover/${type}`)
  url.searchParams.set('sort_by', sorts[sort])
 let minVotes = type === 'movie' ? '1000' : '300'
  if (sort === 'top-rated') minVotes = type === 'movie' ? '5000' : '1000'
  url.searchParams.set('vote_count.gte', minVotes)
  url.searchParams.set('include_adult', 'false') //skipping movies with adult titles, presentation purpose
  url.searchParams.set('page', page)
  if (genre) url.searchParams.set('with_genres', genre) // no genre = all genres

  //Ask TMDB, and send back the results in our own shape
  try {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!response.ok) return errorResponse(502, 'TMDB is not responding. Try again soon.')

    const data = await response.json()
    const toOurShape = type === 'movie' ? mapTmdbMovie : mapTmdbShow
    return Response.json({
      results: data.results.map(toOurShape),
      page: data.page,
      totalPages: Math.min(data.total_pages, 500), //TMDB doesnt return pages past 500
      totalResults: data.total_results,
    })
  } catch {
    return errorResponse(502, 'TMDB is not responding. Try again soon.')
  }
}