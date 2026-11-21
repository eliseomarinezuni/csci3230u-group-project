import { useEffect, useState } from 'react' //AI ASSISTED
import MovieCard from '../components/MovieCard.jsx'
import searchMovies from '../data/searchMovies.js'

export default function Search({ query }) {
  const [search, setSearch] = useState(null) //AI ASSISTED
  const currentSearch = search?.query === query ? search : null //AI ASSISTED
  const results = currentSearch?.results ?? [] //AI ASSISTED

  useEffect(() => { //AI ASSISTED
    if (!query) return //AI ASSISTED

    const controller = new AbortController() //AI ASSISTED
    setSearch(null) //AI ASSISTED

    searchMovies(query, { signal: controller.signal }) //AI ASSISTED
      .then((results) => { //AI ASSISTED
        if (!controller.signal.aborted) setSearch({ query, results }) //AI ASSISTED
      }) //AI ASSISTED
      .catch((error) => { //AI ASSISTED
        if (!controller.signal.aborted) setSearch({ query, error: error.message }) //AI ASSISTED
      }) //AI ASSISTED

    return () => controller.abort() //AI ASSISTED
  }, [query]) //AI ASSISTED

  return (
    <main className="search-page">
      <section className="page-section" aria-labelledby="search-heading">
        <h1 id="search-heading">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search'}
        </h1>
        <p className="section-subtitle" aria-live="polite">
          {!query && 'Type a movie title into the search bar to get started.'}
          {query && !currentSearch && 'Searching for movies…' /* //AI ASSISTED */}
          {currentSearch?.error /* //AI ASSISTED */}
          {query && results.length > 0 && `${results.length} movie${results.length === 1 ? '' : 's'} found.`}
          {currentSearch?.results?.length === 0 && 'No movies matched your search. Try a different title.' /* //AI ASSISTED */}
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
