// AI-assisted - see AI-USAGE.md #3
import { getStore } from '@netlify/blobs'
import { reply, signedInUsername } from '../lib/accounts.mjs'
import { recommendMovies } from '../lib/recommendations.mjs'

export default async function recommendationsHandler(request) {
  if (request.method !== 'GET') return reply({ error: 'Method not allowed.' }, 405)
  const token = process.env.TMDB_READ_TOKEN?.trim()
  if (!token) return reply({ error: 'Movie recommendations are not configured.' }, 503)

  try {
    const sessions = getStore({ name: 'notflix-sessions', consistency: 'strong' })
    const username = await signedInUsername(request, sessions)
    const account = username
      ? await getStore({ name: 'notflix-accounts', consistency: 'strong' }).get(username, { type: 'json' })
      : null
    const timeout = AbortSignal.timeout(10_000)
    const recommendations = await recommendMovies(account, async (genres, page) => {
      const url = new URL('https://api.themoviedb.org/3/discover/movie')
      url.searchParams.set('sort_by', 'vote_average.desc')
      url.searchParams.set('vote_count.gte', '500')
      url.searchParams.set('include_adult', 'false')
      url.searchParams.set('page', page)
      if (genres.length) url.searchParams.set('with_genres', genres.join('|'))
      const response = await fetch(url, {
        signal: AbortSignal.any([request.signal, timeout]),
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`TMDB returned ${response.status}`)
      return response.json()
    })
    return reply(recommendations)
  } catch (error) {
    console.error('Notflix recommendations failed:', error.name)
    return reply({ error: 'Movie recommendations are temporarily unavailable.' }, 502)
  }
}
