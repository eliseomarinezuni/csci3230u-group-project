// AI-assisted - see AI-USAGE.md #6
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import GenreFilter from '../components/GenreFilter.jsx'
import GenreResults from '../components/GenreResults.jsx'
import { findGenre, findMediaType, genresByType, mediaTypes, sortOptions } from '../data/genres.js'
import '../styles/Genre.css'

export default function Genre(){
    // What to show comes from the URL, e.g. /genre/tv/comedy
    // so the page can be shared, refreshed, and the Back button works.
    const { mediaType: typeSlug, genreSlug } = useParams()
    const navigate = useNavigate()

    // The sort choice; highest rated first by default.
    const [sort, setSort] = useState('top-rated')

    const mediaType = findMediaType(typeSlug)
    const genre = findGenre(typeSlug, genreSlug)

    // Bad address, e.g. /genre/movie/banana
    if (!mediaType || !genre) {
        return (
            <main className='genre-page'>
                <section className='page-section genre-error' role='alert'>
                    <h1>Genre not found</h1>
                    <p>
                        That page doesn&rsquo;t exist. Try{' '}
                        <Link to='/genre/movie/all'>all movies</Link> or{' '}
                        <Link to='/genre/tv/all'>all TV shows</Link>.
                    </p>
                </section>
            </main>
        )
    }

    return(
        <main className='genre-page'>
            <section className='page-section' aria-labelledby='genre-heading'>
                <h1 id='genre-heading'>Browse by Genre</h1>
                <p className='section-subtitle'>
                    Choose movies or TV shows, pick a genre, then choose how to sort the list.
                </p>

                {/*Movies or TV - switching starts again at "All"*/}
                <GenreFilter
                    genres={mediaTypes}
                    selected={mediaType.slug}
                    onSelect={(type) => navigate(`/genre/${type}/all`)}
                    label='Show movies or TV shows'
                />

                {/*Genre filter*/}
                <GenreFilter
                    genres={genresByType[mediaType.slug]}
                    selected={genre.slug}
                    onSelect={(slug) => navigate(`/genre/${mediaType.slug}/${slug}`)}
                    label='Filter by genre'
                />

                {/*Sort - a controlled select: React state decides what is selected*/}
                <div className='genre-controls'>
                    <label htmlFor='genre-sort'>Sort by</label>
                    <select id='genre-sort' value={sort} onChange={(event) => setSort(event.target.value)}>
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <GenreResults
                    key={`${mediaType.slug}-${genre.slug}-${sort}`}
                    mediaType={mediaType}
                    genre={genre}
                    sort={sort}
                />
            </section>
        </main>
    )
}