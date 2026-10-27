import MovieCard from '../components/MovieCard.jsx'
import movies from '../data/movies.js'

export default function Recommended() {
  return (
    <main>
      <section className="page-section">
        <h1>Recommended</h1>
        <div className="movie-grid">
          {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>
    </main>
  )
}
