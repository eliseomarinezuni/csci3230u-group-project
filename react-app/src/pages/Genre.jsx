import { useState } from 'react'
import GenreFilter from '../components/GenreFilter.jsx'
import MovieCard from '../components/MovieCard.jsx'
import movies from '../data/movies.js'
import '../styles/Genre.css'

const genres = ['All', 'Action', 'Adventure', 'Animation', 'Sci-Fi', 'Thriller']

export default function Genre(){
    const [selectedGenre, setSelectedGenre] = useState('All') 
    {/*default genre 'all', tells react*/}

    const visibleMovies = movies.filter(
        (movie) => selectedGenre === 'All' || movie.genres.includes(selectedGenre),
    )

    return(
        <main className='genre-page'>
            <section className='page-section'>
                <h1>Browse by Genre</h1>
                <p className='section-subtitle'>
                    Pick a genre to filter the list. 
                </p>

                {/*Filter*/}
                <GenreFilter
                    genres={genres}
                    selected={selectedGenre}
                    onSelect={setSelectedGenre}
                />

                <p className='genre-count'>Movies found: {visibleMovies.length}</p>

                {/*Making movie cards*/}
                <div className='movie-grid'>
                    {visibleMovies.map((movie) => ( 
                        <MovieCard key={movie.id} movie={movie}/>
                    ))}
                </div>
            </section>
        </main>
    )

}
