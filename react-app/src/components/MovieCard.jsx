import { Link, useLocation } from 'react-router' //AI ASSISTED
import WatchedButton from './WatchedButton.jsx' //AI ASSISTED
import FavouriteButton from './FavouriteButton.jsx'

function formatWatchedDate(value) { //AI ASSISTED
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-CA', { //AI ASSISTED
    year: 'numeric', //AI ASSISTED
    month: 'long', //AI ASSISTED
    day: 'numeric', //AI ASSISTED
  }) //AI ASSISTED
} //AI ASSISTED

export default function MovieCard({ movie }) {
  const location = useLocation() //AI ASSISTED
  const tmdbId = movie.tmdbId ?? movie.id //AI ASSISTED
  const poster = movie.poster && <img src={movie.poster} alt="" /> //AI ASSISTED
  const movieInfo = ( //AI ASSISTED
    <>{/* //AI ASSISTED */}
      <span className="movie-card__title">{movie.title}</span>{/* //AI ASSISTED */}
      <span className="movie-card__genres">{movie.genres.join(' / ')}</span>{/* //AI ASSISTED */}
      <span className="movie-card__rating">{/* //AI ASSISTED */}
        {movie.rating == null ? 'Rating unavailable' : `Rating: ${movie.rating.toFixed(1)} / 10` /* //AI ASSISTED */}
      </span>{/* //AI ASSISTED */}
    </> //AI ASSISTED
  ) //AI ASSISTED

  return (
    <div className="movie-card" data-genre={movie.genres.join(' ')}>
      <Link /* //AI ASSISTED */
        to={`/movies/${tmdbId}`} /* //AI ASSISTED */
        state={{ background: location }} /* //AI ASSISTED */
        className="movie-card__toggle"
        aria-haspopup="dialog" /* //AI ASSISTED */
      >
        {movie.watchedOn ? ( //AI ASSISTED
          <>{/* //AI ASSISTED */}
            {poster}{/* //AI ASSISTED */}
            <span className="watched-body">{/* //AI ASSISTED */}
              {movieInfo}{/* //AI ASSISTED */}
              <span className="watched-date">{/* //AI ASSISTED */}
                Watched on{' '}{/* //AI ASSISTED */}
                <time dateTime={movie.watchedOn}>{formatWatchedDate(movie.watchedOn)}</time>{/* //AI ASSISTED */}
              </span>{/* //AI ASSISTED */}
            </span>{/* //AI ASSISTED */}
          </> //AI ASSISTED
        ) : ( //AI ASSISTED
          <>{/* //AI ASSISTED */}
            {poster}{/* //AI ASSISTED */}
            {movieInfo}{/* //AI ASSISTED */}
          </> //AI ASSISTED
        )}{/* //AI ASSISTED */}
      </Link>{/* //AI ASSISTED */}
      <div className="movie-card__actions">{/* //AI ASSISTED */}
        <FavouriteButton movie={movie} />
        <WatchedButton movie={movie} />{/* //AI ASSISTED */}
      </div>{/* //AI ASSISTED */}
    </div>
  )
}
