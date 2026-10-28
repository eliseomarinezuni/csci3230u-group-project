import { useId, useState } from 'react'
import { getSearchHash } from '../data/searchMovies.js'
import '../styles/Search.css'

// 'nav' for compact search bar, 'home' for homepage search bar.
export default function SearchBar({ initialQuery = '', variant = 'nav' }) {
  const [query, setQuery] = useState(initialQuery)
  const inputId = useId()

  function handleSubmit(event) {
    event.preventDefault()
    if (!query.trim()) return

    window.location.hash = getSearchHash(query)
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
