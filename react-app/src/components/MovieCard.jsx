import { useState } from 'react'

export default function MovieCard({ movie }) {
  const [expanded, setExpanded] = useState(false)
  const descriptionId = `movie-description-${movie.id}`

  return (
    <div className="movie-card" data-genre={movie.genres.join(' ')}>
      <button
        type="button"
        className="movie-card__toggle"
        aria-expanded={expanded}
        aria-controls={descriptionId}
        onClick={() => setExpanded((previous) => !previous)}
      >
        {movie.poster && <img src={movie.poster} alt="" /> /* //AI ASSISTED */}
        <span className="movie-card__title">{movie.title}</span>
        <span className="movie-card__genres">{movie.genres.join(' / ')}</span>
        <span className="movie-card__rating">{/* //AI ASSISTED */}
          {movie.rating == null ? 'Rating unavailable' : `Rating: ${movie.rating.toFixed(1)} / 10` /* //AI ASSISTED */}
        </span>{/* //AI ASSISTED */}
      </button>
      <p id={descriptionId} className="movie-card__description" hidden={!expanded}>
        {movie.description}
      </p>
    </div>
  )
}
