import MovieCard from '../components/MovieCard.jsx'
import searchMovies from '../data/searchMovies.js'

export default function Search({ query }) {
  const results = searchMovies(query)

  return (
    <main className="search-page">
      <section className="page-section" aria-labelledby="search-heading">
        <h1 id="search-heading">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search'}
        </h1>
        <p className="section-subtitle" aria-live="polite">
          {!query && 'Type a movie title into the search bar to get started.'}
          {query && results.length > 0 && `${results.length} movie${results.length === 1 ? '' : 's'} found.`}
          {query && results.length === 0 && 'No movies matched your search. Try a different title.'}
        </p>

        {results.length > 0 && (
          <div className="movie-grid">
            {results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </section>
    </main>
  )
}
