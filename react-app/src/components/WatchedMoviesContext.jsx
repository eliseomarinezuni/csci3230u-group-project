import { createContext, useContext, useEffect, useRef, useState } from 'react' //AI ASSISTED
import movies from '../data/movies.js' //AI ASSISTED

const storageKey = 'notflix.watchedMovies' //AI ASSISTED
const WatchedMoviesContext = createContext(null) //AI ASSISTED

const starterMovies = [ //AI ASSISTED
  { //AI ASSISTED
    ...movies.find((movie) => movie.id === 'inception'), //AI ASSISTED
    watchedOn: '2026-09-12', //AI ASSISTED
  }, //AI ASSISTED
  { //AI ASSISTED
    id: 'the-matrix', //AI ASSISTED
    tmdbId: 603, //AI ASSISTED
    title: 'The Matrix', //AI ASSISTED
    poster: '/prototype/images/Matrix.jpeg', //AI ASSISTED
    genres: ['Sci-Fi', 'Action'], //AI ASSISTED
    rating: 8.7, //AI ASSISTED
    releaseYear: 1999, //AI ASSISTED
    description: 'A computer hacker learns that his world is a simulation and joins a group fighting to free humanity.', //AI ASSISTED
    watchedOn: '2026-09-05', //AI ASSISTED
  }, //AI ASSISTED
  { //AI ASSISTED
    ...movies.find((movie) => movie.id === 'spider-man-into-the-spider-verse'), //AI ASSISTED
    watchedOn: '2026-08-28', //AI ASSISTED
  }, //AI ASSISTED
  { //AI ASSISTED
    ...movies.find((movie) => movie.id === 'mad-max-fury-road'), //AI ASSISTED
    watchedOn: '2026-08-19', //AI ASSISTED
  }, //AI ASSISTED
] //AI ASSISTED

export function watchedMovieKey(movie) { //AI ASSISTED
  return String(movie.tmdbId ?? movie.id) //AI ASSISTED
} //AI ASSISTED

function readWatchedMovies() { //AI ASSISTED
  try { //AI ASSISTED
    const saved = JSON.parse(window.localStorage.getItem(storageKey)) //AI ASSISTED
    return Array.isArray(saved) //AI ASSISTED
      ? saved.filter((movie) => movie?.id != null && typeof movie.title === 'string' && Array.isArray(movie.genres)) //AI ASSISTED
      : null //AI ASSISTED
  } catch { //AI ASSISTED
    return null //AI ASSISTED
  } //AI ASSISTED
} //AI ASSISTED

function today() { //AI ASSISTED
  const date = new Date() //AI ASSISTED
  const month = String(date.getMonth() + 1).padStart(2, '0') //AI ASSISTED
  const day = String(date.getDate()).padStart(2, '0') //AI ASSISTED
  return `${date.getFullYear()}-${month}-${day}` //AI ASSISTED
} //AI ASSISTED

export function WatchedMoviesProvider({ children }) { //AI ASSISTED
  const [watchedMovies, setWatchedMovies] = useState(() => readWatchedMovies() ?? starterMovies) //AI ASSISTED
  const storageFailed = useRef(false) //AI ASSISTED

  useEffect(() => { //AI ASSISTED
    function syncWatchedMovies(event) { //AI ASSISTED
      if (!storageFailed.current && (event.key === storageKey || event.key === null)) { //AI ASSISTED
        setWatchedMovies(readWatchedMovies() ?? starterMovies) //AI ASSISTED
      } //AI ASSISTED
    } //AI ASSISTED

    window.addEventListener('storage', syncWatchedMovies) //AI ASSISTED
    return () => window.removeEventListener('storage', syncWatchedMovies) //AI ASSISTED
  }, []) //AI ASSISTED

  function setMovieWatched(movie, isWatched) { //AI ASSISTED
    const key = watchedMovieKey(movie) //AI ASSISTED
    const current = storageFailed.current ? watchedMovies : readWatchedMovies() ?? watchedMovies //AI ASSISTED
    const remaining = current.filter((saved) => watchedMovieKey(saved) !== key) //AI ASSISTED
    const wasWatched = remaining.length !== current.length //AI ASSISTED
    if (wasWatched === isWatched) { //AI ASSISTED
      setWatchedMovies(current) //AI ASSISTED
      return //AI ASSISTED
    } //AI ASSISTED

    const updated = isWatched ? [{ ...movie, watchedOn: today() }, ...current] : remaining //AI ASSISTED

    setWatchedMovies(updated) //AI ASSISTED
    if (storageFailed.current) return //AI ASSISTED
    try { //AI ASSISTED
      window.localStorage.setItem(storageKey, JSON.stringify(updated)) //AI ASSISTED
    } catch { //AI ASSISTED
      // Keep the list usable for this session if storage is unavailable. //AI ASSISTED
      storageFailed.current = true //AI ASSISTED
    } //AI ASSISTED
  } //AI ASSISTED

  return ( //AI ASSISTED
    <WatchedMoviesContext.Provider value={{ watchedMovies, setMovieWatched }}>{/* //AI ASSISTED */}
      {children}{/* //AI ASSISTED */}
    </WatchedMoviesContext.Provider> //AI ASSISTED
  ) //AI ASSISTED
} //AI ASSISTED

export function useWatchedMovies() { //AI ASSISTED
  return useContext(WatchedMoviesContext) //AI ASSISTED
} //AI ASSISTED
