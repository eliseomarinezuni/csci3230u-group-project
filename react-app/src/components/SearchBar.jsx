import { useId, useState } from 'react'
import { useNavigate } from 'react-router' //AI ASSISTED
import { getSearchPath, hasSearchFilters } from '../data/searchMovies.js' // AI-assisted - see AI-USAGE.md #7
import '../styles/Search.css'

// 'nav' for compact search bar, 'home' for homepage search bar.
// AI-assisted - see AI-USAGE.md #7: `filters` are the Search page's current filters, kept on a new search
export default function SearchBar({ initialQuery = '', variant = 'nav', filters }) {
  const [query, setQuery] = useState(initialQuery)
  const inputId = useId()
  const navigate = useNavigate() //AI ASSISTED

  function handleSubmit(event) {
    event.preventDefault()
    if (!query.trim() && !(filters && hasSearchFilters(filters))) return // AI-assisted - see AI-USAGE.md #7

    navigate(getSearchPath(query, filters)) // AI-assisted - see AI-USAGE.md #7
  }

  return (
    <form
      className={`search-bar search-bar--${variant}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <label htmlFor={inputId} className="visually-hidden">
        Search movies by title
      </label>
      <svg className="search-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
      <input
        id={inputId}
        className="search-bar__input"
        type="search"
        placeholder={variant === 'home' ? 'Search for a movie...' : 'Search movies'}
        autoComplete="off"
        enterKeyHint="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {variant === 'home' && (
        <button type="submit" className="search-bar__submit">
          Search
        </button>
      )}
    </form>
  )
}
