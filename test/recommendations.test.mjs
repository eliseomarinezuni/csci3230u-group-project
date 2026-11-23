// AI-assisted - see AI-USAGE.md #3
import assert from 'node:assert/strict'
import test from 'node:test'
import { recommendationProfile, recommendMovies } from '../netlify/lib/recommendations.mjs'

// AI-assisted - see AI-USAGE.md #4
const watchedMovies = [{ id: 1, genres: ['Sci-Fi', 'Thriller'] }]
const favourites = [{ id: 3, genres: ['Animation'] }]

test('uses watched genres or the global catalogue regardless of legacy favourites', () => {
  assert.deepEqual(recommendationProfile({ watchedMovies, favourites }), { source: 'watched', genres: [53, 878] })
  assert.deepEqual(recommendationProfile({ watchedMovies: [], favourites }), { source: 'top-rated', genres: [] })
  assert.deepEqual(recommendationProfile(null), { source: 'top-rated', genres: [] })
})

test('higher ratings beat extra genre matches, and watched titles and duplicates are dropped', async () => {
  const movie = (id, rating, genres) => ({
    id, title: `Movie ${id}`, vote_average: rating, vote_count: 700, genre_ids: genres,
  })
  const queries = []
  const result = await recommendMovies({ watchedMovies, favourites }, async (genres, page) => {
    queries.push({ genres, page })
    return {
      total_pages: 1,
      results: genres.length
        ? [movie(1, 9.7, [53, 878]), movie(3, 9, [878]), movie(4, 8.5, [53, 878])]
        : [movie(1, 9.7, [53, 878]), movie(3, 9, [878]), movie(5, 8.8, [18])],
    }
  })
  assert.deepEqual(queries, [{ genres: [53, 878], page: 1 }, { genres: [], page: 1 }])
  assert.deepEqual(result.movies.map(({ id }) => id), [3, 5, 4])
})
