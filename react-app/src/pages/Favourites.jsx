import { Link } from 'react-router' //AI ASSISTED
import MovieCard from '../components/MovieCard.jsx' //AI ASSISTED
import { useFavouriteMovies, favouriteMovieKey } from '../components/FavouriteMoviesContext.jsx' //AI ASSISTED
import '../styles/Watchedstyles.css'

export default function Favourites() {
  const { account, favouriteMovies, loading } = useFavouriteMovies() // AI-assisted - see AI-USAGE.md #3

  return (
    <main className="favourites-page">
      <section className="page-section" aria-labelledby="favourites-heading">
        <h1 id="favourites-heading">Favourite Movies</h1>
        <p className="section-subtitle">
          Your personal favourites.
        </p>

        {loading && <p role="status">Loading your favourite movies…</p>}{/* AI-assisted - see AI-USAGE.md #3 */}
        {!loading && !account && <p><Link to="/login">Log in</Link> to see your favourite movies.</p>}{/* //AI ASSISTED */}
        {account && favouriteMovies.length === 0 && ( //AI ASSISTED
          <p>Use the Favourite button on any movie to add it here.</p> //AI ASSISTED
        )}{/* //AI ASSISTED */}
        <div className="movie-grid">
          {favouriteMovies.map((movie) => (
            <MovieCard key={favouriteMovieKey(movie)} movie={movie} /> //AI ASSISTED
          ))}
        </div>
      </section>
    </main>
  )
}
