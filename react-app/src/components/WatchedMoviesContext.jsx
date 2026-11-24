// AI-assisted - see AI-USAGE.md #3
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router' //AI ASSISTED

const AccountContext = createContext(null)
const emptyMovies = []

export function watchedMovieKey(movie) {
  return String(movie.tmdbId ?? movie.id)
}

export function favouriteMovieKey(movie) {
  return String(movie.tmdbId ?? movie.id)
}

async function accountRequest({ action, data, signal } = {}) {
  const options = action
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...data }) }
    : { signal }
  const response = await fetch('/api/account', options)
  if (response.status === 429) throw new Error('Too many account requests. Try again in a minute.')
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Accounts require Netlify Dev or a Netlify deployment.')
  }
  const result = await response.json()
  if (!response.ok) {
    throw Object.assign(new Error(result.error || 'Account request failed.'), { status: response.status })
  }
  return result.account
}

export function WatchedMoviesProvider({ children }) {
  const navigate = useNavigate() //AI ASSISTED
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const requestPending = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    accountRequest({ signal: controller.signal })
      .then((loadedAccount) => {
        if (!controller.signal.aborted) setAccount(loadedAccount)
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  async function submit(action, data) {
    if (loading || requestPending.current) return false
    requestPending.current = true
    setPending(true)
    setError('')
    try {
      setAccount(await accountRequest({ action, data }))
      return true
    } catch (failure) {
      if (action === 'save-movie' && failure.status === 401) setAccount(null)
      setError(failure.message)
      return false
    } finally {
      requestPending.current = false
      setPending(false)
    }
  }

  function setMovieWatched(movie, enabled) { // AI-assisted - see AI-USAGE.md #4
    if (!account) {
      navigate('/login') //AI ASSISTED
      return
    }
    return submit('save-movie', { list: 'watchedMovies', movie, enabled })
  }

  function setMovieFavourited(movie, enabled) { // AI-assisted - see AI-USAGE.md #4
    if (!account) {
      navigate('/login') //AI ASSISTED
      return
    }
    return submit('save-movie', { list: 'favouriteMovies', movie, enabled })
  }

  const value = {
    account, loading, pending, error, submit,
    clearError: () => setError(''),
    watchedMovies: account?.watchedMovies ?? emptyMovies,
    favouriteMovies: account?.favouriteMovies ?? emptyMovies,
    setMovieWatched,
    setMovieFavourited
  }

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useWatchedMovies() {
  return useContext(AccountContext)
}

export function useFavouriteMovies() {
  return useContext(AccountContext)
}