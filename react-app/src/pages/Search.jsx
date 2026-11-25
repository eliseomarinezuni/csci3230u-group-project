import { useEffect, useMemo, useState } from 'react' //AI ASSISTED
import { useNavigate } from 'react-router' // AI-assisted - see AI-USAGE.md #7
import MovieCard from '../components/MovieCard.jsx'
import SearchFilters from '../components/SearchFilters.jsx' // AI-assisted - see AI-USAGE.md #7
import searchMovies, { // AI-assisted - see AI-USAGE.md #7
  getSearchFilters,
  getSearchPath,
  hasSearchFilters,
  searchSortOptions,
} from '../data/searchMovies.js'
import '../styles/Search.css' // AI-assisted - see AI-USAGE.md #7

// AI-assisted - see AI-USAGE.md #7: `search` is the URL's ?query string, which holds the filters
export default function Search({ query, search = '' }) {
  const navigate = useNavigate()
  const filters = useMemo(() => getSearchFilters(search), [search])
  const filtered = hasSearchFilters(filters)
  const searchKey = getSearchPath(query, filters) // the same search always gives the same key
  const active = Boolean(query) || filtered

  const [result, setResult] = useState(null) //AI ASSISTED
  const currentSearch = result?.key === searchKey ? result : null // AI-assisted - see AI-USAGE.md #7
  const results = currentSearch?.movies ?? [] // AI-assisted - see AI-USAGE.md #7

  useEffect(() => { //AI ASSISTED
    if (!query && !hasSearchFilters(filters)) return // AI-assisted - see AI-USAGE.md #7

    const controller = new AbortController() //AI ASSISTED
    const key = getSearchPath(query, filters) // AI-assisted - see AI-USAGE.md #7

    searchMovies(query, { signal: controller.signal, filters }) // AI-assisted - see AI-USAGE.md #7
      .then(({ movies, director }) => { // AI-assisted - see AI-USAGE.md #7
        if (!controller.signal.aborted) setResult({ key, movies, director }) // AI-assisted - see AI-USAGE.md #7
      }) //AI ASSISTED
      .catch((error) => { //AI ASSISTED
        if (!controller.signal.aborted) setResult({ key, error: error.message }) // AI-assisted - see AI-USAGE.md #7
      }) //AI ASSISTED

    return () => controller.abort() //AI ASSISTED
  }, [query, filters]) // AI-assisted - see AI-USAGE.md #7

  // AI-assisted - see AI-USAGE.md #7
  function showSearch(nextFilters) {
    navigate(getSearchPath(query, nextFilters))
  }

  let heading = 'Search' // AI-assisted - see AI-USAGE.md #7
  if (query) heading = <>Results for &ldquo;{query}&rdquo;</>
  else if (filtered) heading = 'Filtered movies'

  return (
    <main className="search-page">
      <section className="page-section" aria-labelledby="search-heading">
        <h1 id="search-heading">{heading}</h1>{/* AI-assisted - see AI-USAGE.md #7 */}

        <SearchFilters filters={filters} onApply={showSearch} />{/* AI-assisted - see AI-USAGE.md #7 */}

        {/* AI-assisted - see AI-USAGE.md #7 */}
        <div className="search-results-bar">
          <p className="section-subtitle" aria-live="polite">
            {!active && 'Type a movie title into the search bar, or choose filters to browse movies.'}
            {active && !currentSearch && 'Searching for movies…' /* //AI ASSISTED */}
            {currentSearch?.error /* //AI ASSISTED */}
            {results.length > 0 && `${results.length} movie${results.length === 1 ? '' : 's'} found`}
            {results.length > 0 && currentSearch.director && ` directed by ${currentSearch.director.name}`}
            {results.length > 0 && '.'}
            {currentSearch?.movies?.length === 0 && (
              currentSearch.director === null
                ? <>No director matched &ldquo;{filters.director}&rdquo;. Check the spelling and try again.</>
                : filtered
                  ? 'No movies matched your search and filters. Try removing a filter.'
                  : 'No movies matched your search. Try a different title.'
            )}
          </p>

          {active && (
            <div className="search-sort">
              <label htmlFor="search-sort">Sort by</label>
              <select
                id="search-sort"
                value={filters.sort}
                onChange={(event) => showSearch({ ...filters, sort: event.target.value })}
              >
                {searchSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="movie-grid">
            {results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </section>
    </main>
  )
}
