import MovieCard from '../components/MovieCard.jsx' //AI ASSISTED
import { useWatchedMovies, watchedMovieKey } from '../components/WatchedMoviesContext.jsx' //AI ASSISTED
import '../styles/Watchedstyles.css'

export default function Watched() {
  const { watchedMovies } = useWatchedMovies() //AI ASSISTED

  return (
    <main className="watched-page">
      <section className="page-section" aria-labelledby="watched-heading">
        <h1 id="watched-heading">Watched Movies</h1>
        <p className="section-subtitle">
          Movies you have already watched.
        </p>

        {watchedMovies.length === 0 && ( //AI ASSISTED
          <p>Use the checkmark on any movie to add it here.</p> //AI ASSISTED
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