import '../styles/Watchedstyles.css'

const watchedMovies = [
  {
    id: 'inception',
    title: 'Inception',
    poster: '/prototype/images/Inception.jpeg',
    genres: ['Sci-Fi', 'Thriller'],
    rating: 8.8,
    watchedOn: '2026-09-12',
  },
  {
    id: 'the-matrix',
    title: 'The Matrix',
    poster: '/prototype/images/Matrix.jpeg',
    genres: ['Sci-Fi', 'Action'],
    rating: 8.7,
    watchedOn: '2026-09-05',
  },
  {
    id: 'spider-man-into-the-spider-verse',
    title: 'Spider-Man: Into the Spider-Verse',
    poster: '/prototype/images/IntoTheSpiderverse.jpeg',
    genres: ['Animation', 'Action'],
    rating: 8.4,
    watchedOn: '2026-08-28',
  },
  {
    id: 'mad-max-fury-road',
    title: 'Mad Max: Fury Road',
    poster: '/prototype/images/MadMax.jpeg',
    genres: ['Action', 'Adventure'],
    rating: 8.1,
    watchedOn: '2026-08-19',
  },
]

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Watched() {
  return (
    <main className="watched-page">
      <section className="page-section" aria-labelledby="watched-heading">
        <h1 id="watched-heading">Watched Movies</h1>
        <p className="section-subtitle">
          Movies you have already watched.
        </p>

        <div className="movie-grid">
          {watchedMovies.map((movie) => (
            <article className="movie-card" key={movie.id}>
              <div className="watched-poster">
                <img
                  src={movie.poster}
                  alt={`Poster for ${movie.title}`}
                />
                <span className="watched-badge">✓ Watched</span>
              </div>

              <div className="watched-body">
                <h2 className="movie-card__title">{movie.title}</h2>

                <p className="movie-card__genres">
                  {movie.genres.join(' / ')}
                </p>

                <p className="movie-card__rating">
                  Rating: {movie.rating.toFixed(1)} / 10
                </p>

                <p className="watched-date">
                  Watched on{' '}
                  <time dateTime={movie.watchedOn}>
                    {formatDate(movie.watchedOn)}
                  </time>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}