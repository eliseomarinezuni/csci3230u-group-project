//AI-assisted - see AI-USAGE.md #6
import { useEffect, useState } from 'react'
import MovieCard from './MovieCard.jsx'
import { getGenreTitles, mergeTitles } from '../data/genres.js'

// Loads and shows the list for one type + genre + sort.
// Genre.jsx gives this component a `key`, so when the genre or sort changes React
// starts a fresh copy (empty list, page 1) instead of reusing the old state.
export default function GenreResults({ mediaType, genre, sort }) {
    const [titles, setTitles] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalResults, setTotalResults] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        //cancels request if user moves on before finishing
        const controller = new AbortController()
        setLoading(true)
        setError('')

        getGenreTitles({ type: mediaType.slug, genreId: genre.id, sort, page }, controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return
                // Page 1 starts the list; "Load more" adds to the end of it
                setTitles((current) => (page === 1 ? data.results : mergeTitles(current, data.results)))
                setTotalPages(data.totalPages)
                setTotalResults(data.totalResults)
                setLoading(false)
            })
            .catch((failure) => {
                if (controller.signal.aborted) return
                setError(failure.message)
                setLoading(false)
            })

        return () => controller.abort() // runs when the inputs change or the page closes
    }, [mediaType.slug, genre.id, sort, page, retryCount])

    // The line under the heading
    let status = ''
    if (titles.length > 0) {
        status = `Showing ${titles.length} of ${totalResults.toLocaleString()} ${mediaType.plural}`
    } else if (loading) {
        status = `Loading ${mediaType.plural}…`
    } else if (!error) {
        status = `No ${mediaType.plural} found in this genre.`
    }

    const heading = genre.id ? `${genre.name} ${mediaType.plural}` : `All ${mediaType.plural}`
    const showLoadMore = titles.length > 0 && page < totalPages && !error

    return (
        <section aria-labelledby='genre-results-heading'>
            <h2 id='genre-results-heading'>{heading}</h2>

            {/* role="status" makes screen readers read this out when it changes */}
            <p className='genre-count' role='status'>{status}</p>

            {error && (
                <div className='genre-error' role='alert'>
                    <p>{error}</p>
                    <button type='button' className='genre-btn' onClick={() => setRetryCount(retryCount + 1)}>
                        Try again
                    </button>
                </div>
            )}

            {/*Making cards - MovieCard handles TV shows too*/}
            <div className='movie-grid'>
                {titles.map((title) => (
                    <MovieCard key={title.id} movie={title}/>
                ))}
            </div>

            {showLoadMore && (
                <button
                    type='button'
                    className='genre-load-more'
                    disabled={loading}
                    onClick={() => setPage(page + 1)}
                >
                    {loading ? 'Loading…' : 'Load more'}
                </button>
            )}
        </section>
    )
}