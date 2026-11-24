export async function searchTmdbMovies(query, { signal } = {}) { //AI ASSISTED
  const title = query.trim() //AI ASSISTED
  if (!title) return [] //AI ASSISTED

  const params = new URLSearchParams({ q: title }) //AI ASSISTED
  const response = await fetch(`/api/movies/search?${params}`, { signal }) //AI ASSISTED

  if (!response.headers.get('content-type')?.includes('application/json')) { //AI ASSISTED
    throw new Error('Movie search requires Netlify Dev or a Netlify deployment.') //AI ASSISTED
  } //AI ASSISTED

  const { movies, error } = await response.json() //AI ASSISTED
  if (!response.ok) throw new Error(error || 'Movie search is temporarily unavailable.') //AI ASSISTED

  return movies //AI ASSISTED
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
