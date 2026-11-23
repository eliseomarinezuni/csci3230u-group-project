import { useId, useLayoutEffect, useRef, useState } from 'react' //AI ASSISTED
import { createPortal } from 'react-dom' //AI ASSISTED
import { useWatchedMovies, watchedMovieKey } from './WatchedMoviesContext.jsx' //AI ASSISTED

export default function WatchedButton({ movie }) { //AI ASSISTED
  const { watchedMovies, setMovieWatched, loading, pending } = useWatchedMovies() // AI-assisted - see AI-USAGE.md #3
  const [confirmingRemoval, setConfirmingRemoval] = useState(false) //AI ASSISTED
  const confirmation = useRef(null) //AI ASSISTED
  const titleId = useId() //AI ASSISTED
  const key = watchedMovieKey(movie) //AI ASSISTED
  const isWatched = watchedMovies.some((saved) => watchedMovieKey(saved) === key) //AI ASSISTED

  useLayoutEffect(() => { //AI ASSISTED
    if (confirmingRemoval && !confirmation.current.open) { //AI ASSISTED
      confirmation.current.showModal() //AI ASSISTED
    } //AI ASSISTED
  }, [confirmingRemoval]) //AI ASSISTED

  function handleClick(event) { //AI ASSISTED
    if (isWatched) { //AI ASSISTED
      event.currentTarget.focus() //AI ASSISTED
      setConfirmingRemoval(true) //AI ASSISTED
    } else { //AI ASSISTED
      setMovieWatched(movie, true) //AI ASSISTED
    } //AI ASSISTED
  } //AI ASSISTED

  function handleConfirmationClose(event) { //AI ASSISTED
    if (event.target !== event.currentTarget) return //AI ASSISTED
    setConfirmingRemoval(false) //AI ASSISTED
    if (event.currentTarget.returnValue === 'remove') { //AI ASSISTED
      setMovieWatched(movie, false) //AI ASSISTED
    } //AI ASSISTED
  } //AI ASSISTED

  return ( //AI ASSISTED
    <>{/* //AI ASSISTED */}
      <button /* //AI ASSISTED */
        type="button" /* //AI ASSISTED */
        className="watched-toggle" /* //AI ASSISTED */
        aria-label={`Watched: ${movie.title}`} /* //AI ASSISTED */
        aria-pressed={isWatched} /* //AI ASSISTED */
        aria-haspopup={isWatched ? 'dialog' : undefined} /* //AI ASSISTED */
        title={isWatched ? 'Remove from Watched' : 'Mark as watched'} /* //AI ASSISTED */
        disabled={loading || pending} /* AI-assisted - see AI-USAGE.md #3 */
        onClick={handleClick} /* //AI ASSISTED */
      >{/* //AI ASSISTED */}
        <span className="watched-toggle__icon" aria-hidden="true">{isWatched ? '✓' : '+'}</span>{/* //AI ASSISTED */}
        Watched{/* //AI ASSISTED */}
      </button>{/* //AI ASSISTED */}
      {confirmingRemoval && createPortal( //AI ASSISTED
        <dialog /* //AI ASSISTED */
          ref={confirmation} /* //AI ASSISTED */
          className="watched-confirmation" /* //AI ASSISTED */
          aria-labelledby={titleId} /* //AI ASSISTED */
          onClose={handleConfirmationClose} /* //AI ASSISTED */
        >{/* //AI ASSISTED */}
          <h2 id={titleId}>Remove “{movie.title}” from Watched?</h2>{/* //AI ASSISTED */}
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
