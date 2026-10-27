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
        <img src={movie.poster} alt="" />
        <span className="movie-card__title">{movie.title}</span>
        <span className="movie-card__genres">{movie.genres.join(' / ')}</span>
        <span className="movie-card__rating">Rating: {movie.rating.toFixed(1)} / 10</span>
      </button>
      <p id={descriptionId} className="movie-card__description" hidden={!expanded}>
        {movie.description}
      </p>
    </div>
  )
}
