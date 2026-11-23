// AI-assisted - see AI-USAGE.md #3
import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { useWatchedMovies } from '../components/WatchedMoviesContext.jsx'
import { withGenreNames } from '../data/searchMovies.js'

const descriptions = {
  watched: 'Top-rated movies based on what you’ve watched.',
  'top-rated': 'Top-rated movies across all genres.',
}

export default function Recommended() {
  const { account, loading: loadingAccount } = useWatchedMovies()
  const [result, setResult] = useState(null)
  const current = !loadingAccount && result?.account === account ? result : null

  useEffect(() => {
    if (loadingAccount) return
    const controller = new AbortController()
    setResult(null)

    async function load() {
      try {
        const response = await fetch('/api/movies/recommendations', { signal: controller.signal })
        if (!response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Recommendations require Netlify Dev or a Netlify deployment.')
        }
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load recommendations.')
        if (!controller.signal.aborted) {
          setResult({ account, ...data, movies: data.movies.map(withGenreNames) })
        }
      } catch (error) {
        if (!controller.signal.aborted) setResult({ account, error: error.message })
      }
    }

    load()
    return () => controller.abort()
  }, [account, loadingAccount])

  return (
    <main>
      <section className="page-section" aria-labelledby="recommended-heading">
        <h1 id="recommended-heading">Recommended</h1>
        {!current && <p className="section-subtitle" role="status">Loading recommendations…</p>}
        {current?.error && <p role="alert">{current.error}</p>}
        {current?.movies && (
          <>
            <p className="section-subtitle">{descriptions[current.source]}</p>
            {current.movies.length === 0 && <p>No recommendations found.</p>}
            <div className="movie-grid">
              {current.movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
