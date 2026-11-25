import { useId, useLayoutEffect, useRef } from 'react' //AI ASSISTED
import { createPortal } from 'react-dom' //AI ASSISTED
import WatchedButton from './WatchedButton.jsx' //AI ASSISTED
import FavouriteButton from './FavouriteButton.jsx'
import '../styles/MovieDetails.css' //AI ASSISTED

export default function MovieDetails({ movie, message, onClose }) { //AI ASSISTED
  const dialog = useRef(null) //AI ASSISTED
  const pressedBackdrop = useRef(false) //AI ASSISTED
  const titleId = useId() //AI ASSISTED
  const descriptionId = useId() //AI ASSISTED
  const year = movie?.releaseDate?.slice(0, 4) ?? movie?.releaseYear //AI ASSISTED
  const genres = movie?.genres.join(' / ') //AI ASSISTED
  const isOverlay = Boolean(onClose) //AI ASSISTED
  const Heading = isOverlay ? 'h2' : 'h1' //AI ASSISTED

  useLayoutEffect(() => { //AI ASSISTED
    if (isOverlay && !dialog.current.open) dialog.current.showModal() //AI ASSISTED
  }, [isOverlay]) //AI ASSISTED

  const content = ( //AI ASSISTED
    <div className={movie?.poster ? 'movie-details__layout movie-details__layout--with-poster' : 'movie-details__layout'}>{/* //AI ASSISTED */}
      {isOverlay && ( //AI ASSISTED
        <form method="dialog" className="movie-details__close-form">{/* //AI ASSISTED */}
          <button type="submit" className="movie-details__close" aria-label="Close movie details">{/* //AI ASSISTED */}
            <span aria-hidden="true">×</span>{/* //AI ASSISTED */}
          </button>{/* //AI ASSISTED */}
        </form> //AI ASSISTED
      )}{/* //AI ASSISTED */}
      {movie?.poster && <img className="movie-details__poster" src={movie.poster} alt="" />}{/* //AI ASSISTED */}
      <div className="movie-details__content">{/* //AI ASSISTED */}
        <Heading id={titleId} className="movie-details__title">{movie?.title ?? 'Movie details'}</Heading>{/* //AI ASSISTED */}
        {movie && (year || genres || movie.rating != null) && ( //AI ASSISTED
          <ul className="movie-details__metadata">{/* //AI ASSISTED */}
            {year && <li>{year}</li>}{/* //AI ASSISTED */}
            {genres && <li>{genres}</li>}{/* //AI ASSISTED */}
            {movie.rating != null && ( //AI ASSISTED
              <li className="movie-details__rating">Rating: {movie.rating.toFixed(1)} / 10</li> //AI ASSISTED
            )}{/* //AI ASSISTED */}
          </ul> //AI ASSISTED
        )}{/* //AI ASSISTED */}
        {movie ? ( //AI ASSISTED
          <>{/* //AI ASSISTED */}
            <p id={descriptionId}>{movie.description?.trim() || 'Description unavailable.'}</p>{/* //AI ASSISTED */}
            <FavouriteButton movie={movie} />
            <WatchedButton movie={movie} />{/* //AI ASSISTED */}
          </> //AI ASSISTED
        ) : <p id={descriptionId} role="status">{message}</p>}{/* //AI ASSISTED */}
      </div>{/* //AI ASSISTED */}
    </div> //AI ASSISTED
  ) //AI ASSISTED

  if (!isOverlay) { //AI ASSISTED
    return ( //AI ASSISTED
      <main className="page-section">{/* //AI ASSISTED */}
        <div className="movie-details movie-details--page">{content}</div>{/* //AI ASSISTED */}
      </main> //AI ASSISTED
    ) //AI ASSISTED
  } //AI ASSISTED

  return createPortal( //AI ASSISTED
    <dialog /* //AI ASSISTED */
      ref={dialog} /* //AI ASSISTED */
      className="movie-details" /* //AI ASSISTED */
      aria-labelledby={titleId} /* //AI ASSISTED */
      aria-describedby={descriptionId} /* //AI ASSISTED */
      onClose={(event) => { /* //AI ASSISTED */
        if (event.target === event.currentTarget) onClose() //AI ASSISTED
      }} /* //AI ASSISTED */
      onPointerDown={(event) => { /* //AI ASSISTED */
        pressedBackdrop.current = event.target === event.currentTarget //AI ASSISTED
      }} /* //AI ASSISTED */
      onClick={(event) => { /* //AI ASSISTED */
        if (pressedBackdrop.current && event.target === event.currentTarget) { //AI ASSISTED
          event.currentTarget.close() //AI ASSISTED
        } //AI ASSISTED
      }} /* //AI ASSISTED */
    >{/* //AI ASSISTED */}
      {content}{/* //AI ASSISTED */}
    </dialog>, //AI ASSISTED
    document.body, //AI ASSISTED
  ) //AI ASSISTED
} //AI ASSISTED
