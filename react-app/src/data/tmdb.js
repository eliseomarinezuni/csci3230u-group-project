// AI-assisted - see AI-USAGE.md #7: accepts filters, and an empty title when filters are set
// Returns { movies, director } - director is the matched person when filtering by director.
export async function searchTmdbMovies(query, { signal, filters = {} } = {}) {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  for (const [name, value] of Object.entries(filters)) {
    if (String(value ?? '').trim()) params.set(name, String(value).trim())
  }
  if (!params.size) return { movies: [] }

  const response = await fetch(`/api/movies/search?${params}`, { signal }) //AI ASSISTED

  if (!response.headers.get('content-type')?.includes('application/json')) { //AI ASSISTED
    throw new Error('Movie search requires Netlify Dev or a Netlify deployment.') //AI ASSISTED
  } //AI ASSISTED

  const { movies, director, error } = await response.json() // AI-assisted - see AI-USAGE.md #7
  if (!response.ok) throw new Error(error || 'Movie search is temporarily unavailable.') //AI ASSISTED

  return { movies, director } // AI-assisted - see AI-USAGE.md #7
} //AI ASSISTED

export async function getTmdbMovie(id, { signal } = {}) { //AI ASSISTED
  const response = await fetch(`/api/movies/${encodeURIComponent(id)}`, { signal }) //AI ASSISTED
  if (!response.headers.get('content-type')?.includes('application/json')) { //AI ASSISTED
    throw new Error('Movie details require Netlify Dev or a Netlify deployment.') //AI ASSISTED
  } //AI ASSISTED

  const { movie, error } = await response.json() //AI ASSISTED
  if (!response.ok) throw new Error(error || 'Movie details are temporarily unavailable.') //AI ASSISTED
  return movie //AI ASSISTED
} //AI ASSISTED
