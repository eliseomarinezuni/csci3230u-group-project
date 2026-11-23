// AI-assisted - see AI-USAGE.md #3
export function mapTmdbMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    description: movie.overview,
    releaseDate: movie.release_date || null,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null,
    rating: movie.vote_count > 0 ? movie.vote_average : null,
    genreIds: movie.genre_ids,
  }
}
