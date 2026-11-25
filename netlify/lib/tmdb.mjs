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

//AI-assisted - see AI-USAGE.md #6
// Turns a TV show from TMDB into the same shape our movies use, so MovieCard can show it.
// TMDB calls some TV fields by different names (name, first_air_date).
export function mapTmdbShow(show) {
  return {
    id: show.id,
    title: show.name,
    description: show.overview,
    releaseDate: show.first_air_date || null,
    poster: show.poster_path ? `https://image.tmdb.org/t/p/w342${show.poster_path}` : null,
    rating: show.vote_count > 0 ? show.vote_average : null,
    genreIds: show.genre_ids,
    mediaType: 'tv', //tells MovieCard its a tv show 
  }
}