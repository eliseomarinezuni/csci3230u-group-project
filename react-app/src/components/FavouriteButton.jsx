import { useId, useLayoutEffect, useRef, useState } from 'react' //AI ASSISTED
import { createPortal } from 'react-dom' //AI ASSISTED
import { useFavouriteMovies, favouriteMovieKey } from './WatchedMoviesContext.jsx' //AI ASSISTED

export default function FavouriteButton({ movie }) { //AI ASSISTED
  const { favouriteMovies, setMovieFavourited, loading, pending } = useFavouriteMovies() // AI-assisted - see AI-USAGE.md #3
  const [confirmingRemoval, setConfirmingRemoval] = useState(false) //AI ASSISTED
  const confirmation = useRef(null) //AI ASSISTED
  const titleId = useId() //AI ASSISTED
  const key = favouriteMovieKey(movie) //AI ASSISTED
  const isFavourited = favouriteMovies.some((saved) => favouriteMovieKey(saved) === key) //AI ASSISTED

  useLayoutEffect(() => { //AI ASSISTED
    if (confirmingRemoval && !confirmation.current.open) { //AI ASSISTED
      confirmation.current.showModal() //AI ASSISTED
    } //AI ASSISTED
  }, [confirmingRemoval]) //AI ASSISTED

  function handleClick(event) { //AI ASSISTED
    if (isFavourited) { //AI ASSISTED
      event.currentTarget.focus() //AI ASSISTED
      setConfirmingRemoval(true) //AI ASSISTED
    } else { //AI ASSISTED
      setMovieFavourited(movie, true) //AI ASSISTED
    } //AI ASSISTED
  } //AI ASSISTED

  function handleConfirmationClose(event) { //AI ASSISTED
    if (event.target !== event.currentTarget) return //AI ASSISTED
    setConfirmingRemoval(false) //AI ASSISTED
    if (event.currentTarget.returnValue === 'remove') { //AI ASSISTED
      setMovieFavourited(movie, false) //AI ASSISTED
    } //AI ASSISTED
  } //AI ASSISTED

  return ( //AI ASSISTED
    <>{/* //AI ASSISTED */}
      <button /* //AI ASSISTED */
        type="button" /* //AI ASSISTED */
        className="favourite-toggle" /* //AI ASSISTED */
        aria-label={`Favourited: ${movie.title}`} /* //AI ASSISTED */
        aria-pressed={isFavourited} /* //AI ASSISTED */
        aria-haspopup={isFavourited ? 'dialog' : undefined} /* //AI ASSISTED */
        title={isFavourited ? 'Remove from Favourites' : 'Mark as Favourite'} /* //AI ASSISTED */
        disabled={loading || pending} /* AI-assisted - see AI-USAGE.md #3 */
        onClick={handleClick} /* //AI ASSISTED */
      >{/* //AI ASSISTED */}
        <span className="favourite-toggle__icon" aria-hidden="true">{isFavourited ? '★' : '☆'}</span>{/* //AI ASSISTED */}
      </button>{/* //AI ASSISTED */}
      {confirmingRemoval && createPortal( //AI ASSISTED
        <dialog /* //AI ASSISTED */
          ref={confirmation} /* //AI ASSISTED */
          className="watched-confirmation" /* //AI ASSISTED */
          aria-labelledby={titleId} /* //AI ASSISTED */
          onClose={handleConfirmationClose} /* //AI ASSISTED */
        >{/* //AI ASSISTED */}
          <h2 id={titleId}>Remove “{movie.title}” from Favourites?</h2>{/* //AI ASSISTED */}
          <form method="dialog" className="watched-confirmation__actions">{/* //AI ASSISTED */}
            <button value="keep">Keep movie</button>{/* //AI ASSISTED */}
            <button value="remove" className="watched-confirmation__remove">Remove</button>{/* //AI ASSISTED */}
          </form>{/* //AI ASSISTED */}
        </dialog>, //AI ASSISTED
        document.body, //AI ASSISTED
      )}{/* //AI ASSISTED */}
    </> //AI ASSISTED
  ) //AI ASSISTED
} //AI ASSISTED
