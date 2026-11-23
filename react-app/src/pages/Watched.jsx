import MovieCard from '../components/MovieCard.jsx' //AI ASSISTED
import { useWatchedMovies, watchedMovieKey } from '../components/WatchedMoviesContext.jsx' //AI ASSISTED
import '../styles/Watchedstyles.css'

export default function Watched() {
  const { account, watchedMovies, loading } = useWatchedMovies() // AI-assisted - see AI-USAGE.md #3

  return (
    <main className="watched-page">
      <section className="page-section" aria-labelledby="watched-heading">
        <h1 id="watched-heading">Watched Movies</h1>
        <p className="section-subtitle">
          Movies you have already watched.
        </p>

        {loading && <p role="status">Loading your watched movies…</p>}{/* AI-assisted - see AI-USAGE.md #3 */}
        {!loading && !account && <p><a href="#/login">Log in</a> to see your watched movies.</p>}
        {account && watchedMovies.length === 0 && ( //AI ASSISTED
          <p>Use the Watched button on any movie to add it here.</p> //AI ASSISTED
        )}{/* //AI ASSISTED */}
        <div className="movie-grid">
          {watchedMovies.map((movie) => (
            <MovieCard key={watchedMovieKey(movie)} movie={movie} /> //AI ASSISTED
          ))}
        </div>
      </section>
    </main>
  )
}
