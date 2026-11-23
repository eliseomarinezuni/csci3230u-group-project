// AI-assisted - see AI-USAGE.md #3
import { movieGenres } from '../../react-app/src/data/searchMovies.js'
import { mapTmdbMovie } from './tmdb.mjs'

const genreIds = new Map(Object.entries(movieGenres).map(([id, name]) => [name, Number(id)]))
const pageSize = 20
const maxPages = 5

function topGenreIds(movies = []) {
  const counts = new Map()
  for (const movie of movies) {
    for (const genre of new Set(movie.genres)) {
      const id = genreIds.get(genre)
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort(([firstId, firstCount], [secondId, secondCount]) => secondCount - firstCount || firstId - secondId)
    .slice(0, 3)
    .map(([id]) => id)
}

export function recommendationProfile(account) {
  // AI-assisted - see AI-USAGE.md #4
  const watched = topGenreIds(account?.watchedMovies)
  if (watched.length) return { source: 'watched', genres: watched }

  return { source: 'top-rated', genres: [] }
}

export async function recommendMovies(account, discoverPage) {
  const profile = recommendationProfile(account)
  const excluded = new Set(account?.watchedMovies?.map((movie) => movie.id))
  const picks = []

  async function addPicks(genres) {
    for (let page = 1; page <= maxPages && picks.length < pageSize; page++) {
      const result = await discoverPage(genres, page)
      for (const movie of result.results) {
        if (!excluded.has(movie.id)) {
          picks.push(movie)
          excluded.add(movie.id)
        }
        if (picks.length === pageSize) break
      }
      if (page >= result.total_pages || !result.results.length) break
    }
  }

  await addPicks(profile.genres)
  if (profile.genres.length && picks.length < pageSize) await addPicks([])
  picks.sort((first, second) => second.vote_average - first.vote_average || second.vote_count - first.vote_count)
  return { source: profile.source, movies: picks.map(mapTmdbMovie) }
}
