import { useEffect, useState } from 'react' //AI ASSISTED
import { useNavigate, useParams } from 'react-router' //AI ASSISTED
import MovieDetails from '../components/MovieDetails.jsx' //AI ASSISTED
import { withGenreNames } from '../data/searchMovies.js' //AI ASSISTED
import { getTmdbMovie } from '../data/tmdb.js' //AI ASSISTED

export default function MoviePage({ overlay = false }) { //AI ASSISTED
  const { id } = useParams() //AI ASSISTED
  const navigate = useNavigate() //AI ASSISTED
  const [result, setResult] = useState(null) //AI ASSISTED
  const validId = /^[1-9]\d{0,9}$/.test(id) //AI ASSISTED
  const current = result?.id === id ? result : null //AI ASSISTED

  useEffect(() => { //AI ASSISTED
    if (!validId) return //AI ASSISTED

    const controller = new AbortController() //AI ASSISTED
    getTmdbMovie(id, { signal: controller.signal }) //AI ASSISTED
      .then((movie) => { //AI ASSISTED
        if (!controller.signal.aborted) setResult({ id, movie: withGenreNames(movie) }) //AI ASSISTED
      }) //AI ASSISTED
      .catch((error) => { //AI ASSISTED
        if (!controller.signal.aborted) setResult({ id, error: error.message }) //AI ASSISTED
      }) //AI ASSISTED
    return () => controller.abort() //AI ASSISTED
  }, [id, validId]) //AI ASSISTED

  return ( //AI ASSISTED
    <MovieDetails /* //AI ASSISTED */
      movie={current?.movie} /* //AI ASSISTED */
      message={validId ? current?.error ?? 'Loading movie details…' : 'Invalid movie ID.'} /* //AI ASSISTED */
      onClose={overlay ? () => navigate(-1) : undefined} /* //AI ASSISTED */
    /> //AI ASSISTED
  ) //AI ASSISTED
} //AI ASSISTED
