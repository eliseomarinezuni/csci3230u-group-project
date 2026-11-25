// AI-assisted - see AI-USAGE.md #7
// The filter form on the Search page. It's a controlled form: React state holds what the
// user has typed, and nothing changes in the URL until they press "Apply filters".
import { useId, useState } from 'react'
import {
  emptySearchFilters,
  getSearchPath,
  hasSearchFilters,
  movieGenres,
  validateSearchFilters,
} from '../data/searchMovies.js'

// Genres sorted by name for the dropdown, e.g. [['28', 'Action'], ['12', 'Adventure'], ...]
const genreOptions = Object.entries(movieGenres).sort((a, b) => a[1].localeCompare(b[1]))

export default function SearchFilters({ filters, onApply }) {
  const [draft, setDraft] = useState(filters)
  const [error, setError] = useState(null) // { field, message } from validateSearchFilters

  // When the URL's filters change (Apply, Clear, Back button), show them in the form.
  // Updating state here instead of re-creating the form keeps keyboard focus where it was,
  // and changing only the sort order doesn't throw away edits the user hasn't applied yet.
  const appliedKey = getSearchPath('', { ...filters, sort: '' })
  const [shownKey, setShownKey] = useState(appliedKey)
  if (shownKey !== appliedKey) {
    setShownKey(appliedKey)
    setDraft(filters)
    setError(null)
  }
  const id = useId()
  const maxYear = new Date().getFullYear() + 10

  const applied = hasSearchFilters(filters)
  const changed = ['director', 'yearFrom', 'yearTo', 'minRating', 'genre']
    .some((name) => draft[name].trim() !== filters[name])

  function update(name) {
    return (event) => setDraft((current) => ({ ...current, [name]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const problem = validateSearchFilters(draft)
    setError(problem)
    if (problem) return
    // Tidy what was typed so the form matches the URL, e.g. " nolan " -> "nolan", ".50" -> "0.5"
    const tidy = {
      ...draft,
      director: draft.director.trim(),
      minRating: draft.minRating.trim() && String(Number(draft.minRating)),
    }
    onApply({ ...tidy, sort: filters.sort })
    setDraft(tidy)
  }

  function handleClear() {
    setDraft(emptySearchFilters)
    setError(null)
    onApply({ ...emptySearchFilters, sort: filters.sort })
  }

  return (
    <form className="search-filters" onSubmit={handleSubmit} aria-labelledby={`${id}-heading`} noValidate>
      <h2 id={`${id}-heading`} className="search-filters__heading">Filters</h2>

      <div className="search-filters__fields">
        <div className="search-filters__field search-filters__field--wide">
          <label htmlFor={`${id}-director`}>Director</label>
          <input
            id={`${id}-director`}
            type="text"
            placeholder="e.g. Christopher Nolan"
            autoComplete="off"
            maxLength={100}
            value={draft.director}
            onChange={update('director')}
          />
        </div>

        <fieldset className="search-filters__field search-filters__years">
          <legend>Release year</legend>
          <label htmlFor={`${id}-year-from`} className="visually-hidden">From year</label>
          <input
            id={`${id}-year-from`}
            type="number"
            inputMode="numeric"
            placeholder="From"
            min={1870}
            max={maxYear}
            value={draft.yearFrom}
            onChange={update('yearFrom')}
            aria-invalid={error?.field === 'years' || undefined}
            aria-describedby={error?.field === 'years' ? `${id}-error` : undefined}
          />
          <span aria-hidden="true">&ndash;</span>
          <label htmlFor={`${id}-year-to`} className="visually-hidden">To year</label>
          <input
            id={`${id}-year-to`}
            type="number"
            inputMode="numeric"
            placeholder="To"
            min={1870}
            max={maxYear}
            value={draft.yearTo}
            onChange={update('yearTo')}
            aria-invalid={error?.field === 'years' || undefined}
            aria-describedby={error?.field === 'years' ? `${id}-error` : undefined}
          />
        </fieldset>

        <div className="search-filters__field">
          <label htmlFor={`${id}-rating`}>Minimum rating</label>
          <input
            id={`${id}-rating`}
            // A text box (with a decimal keypad on phones) rather than type="number": number boxes
            // report "" for input like "7..5", which would silently drop the filter instead of
            // showing an error.
            type="text"
            inputMode="decimal"
            placeholder="0–10, e.g. 7.5"
            autoComplete="off"
            maxLength={6}
            value={draft.minRating}
            onChange={update('minRating')}
            aria-invalid={error?.field === 'minRating' || undefined}
            aria-describedby={error?.field === 'minRating' ? `${id}-error` : undefined}
          />
        </div>

        <div className="search-filters__field">
          <label htmlFor={`${id}-genre`}>Genre</label>
          <select id={`${id}-genre`} value={draft.genre} onChange={update('genre')}>
            <option value="">Any genre</option>
            {genreOptions.map(([genreId, name]) => (
              <option key={genreId} value={genreId}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p id={`${id}-error`} className="search-filters__error" role="alert">{error.message}</p>}

      <div className="search-filters__actions">
        <button type="submit" className="search-filters__apply" disabled={!changed}>
          Apply filters
        </button>
        <button
          type="button"
          className="search-filters__clear"
          disabled={!applied && !hasSearchFilters(draft)}
          onClick={handleClear}
        >
          Clear filters
        </button>
      </div>
    </form>
  )
}
