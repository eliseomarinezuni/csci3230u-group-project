import { useId, useLayoutEffect, useRef } from 'react' //AI ASSISTED
import { createPortal } from 'react-dom' //AI ASSISTED
import WatchedButton from './WatchedButton.jsx' //AI ASSISTED
import '../styles/MovieDetails.css' //AI ASSISTED

export default function MovieDetails({ movie, onClose }) { //AI ASSISTED
  const dialog = useRef(null) //AI ASSISTED
  const pressedBackdrop = useRef(false) //AI ASSISTED
  const titleId = useId() //AI ASSISTED
  const descriptionId = useId() //AI ASSISTED
  const year = movie.releaseDate?.slice(0, 4) ?? movie.releaseYear //AI ASSISTED
  const genres = movie.genres.join(' / ') //AI ASSISTED

  useLayoutEffect(() => { //AI ASSISTED
    if (!dialog.current.open) dialog.current.showModal() //AI ASSISTED
  }, []) //AI ASSISTED

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
      <div className={movie.poster ? 'movie-details__layout movie-details__layout--with-poster' : 'movie-details__layout'}>{/* //AI ASSISTED */}
        <form method="dialog" className="movie-details__close-form">{/* //AI ASSISTED */}
          <button type="submit" className="movie-details__close" aria-label="Close movie details">{/* //AI ASSISTED */}
            <span aria-hidden="true">×</span>{/* //AI ASSISTED */}
          </button>{/* //AI ASSISTED */}
        </form>{/* //AI ASSISTED */}
        {movie.poster && <img className="movie-details__poster" src={movie.poster} alt="" />}{/* //AI ASSISTED */}
        <div className="movie-details__content">{/* //AI ASSISTED */}
          <h2 id={titleId}>{movie.title}</h2>{/* //AI ASSISTED */}
          {(year || genres || movie.rating != null) && ( //AI ASSISTED
            <ul className="movie-details__metadata">{/* //AI ASSISTED */}
              {year && <li>{year}</li>}{/* //AI ASSISTED */}
              {genres && <li>{genres}</li>}{/* //AI ASSISTED */}
              {movie.rating != null && ( //AI ASSISTED
                <li className="movie-details__rating">Rating: {movie.rating.toFixed(1)} / 10</li> //AI ASSISTED
              )}{/* //AI ASSISTED */}
            </ul> //AI ASSISTED
          )}{/* //AI ASSISTED */}
          <p id={descriptionId}>{movie.description?.trim() || 'Description unavailable.'}</p>{/* //AI ASSISTED */}
          <WatchedButton movie={movie} />{/* //AI ASSISTED */}
        </div>{/* //AI ASSISTED */}
      </div>{/* //AI ASSISTED */}
    </dialog>, //AI ASSISTED
    document.body, //AI ASSISTED
  ) //AI ASSISTED
} //AI ASSISTED
