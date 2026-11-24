// AI-assisted - see AI-USAGE.md #3
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router' //AI ASSISTED
import { useWatchedMovies } from '../components/WatchedMoviesContext.jsx'
import '../styles/Account.css'

export default function Account({ mode }) {
  const { account, loading, pending, error, clearError, submit } = useWatchedMovies()
  const navigate = useNavigate() //AI ASSISTED
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isSignup = mode === 'signup'
  const title = isSignup ? 'Sign Up' : 'Log In'

  useEffect(() => {
    if (account) navigate('/recommended', { replace: true }) //AI ASSISTED
  }, [account, navigate]) //AI ASSISTED

  function handleSubmit(event) {
    event.preventDefault()
    submit(mode, { username, password })
  }

  return (
    <main className="account-page page-section">
      <h1>{title}</h1>
      <form className="account-form" onSubmit={handleSubmit} aria-busy={loading || pending}>
        <label htmlFor="account-username">Username</label>
        <input id="account-username" name="username" autoComplete="username" autoCapitalize="none"
          spellCheck={false} required minLength={3} maxLength={24} pattern="[A-Za-z0-9_]{3,24}"
          aria-describedby={isSignup ? 'username-help' : undefined}
          value={username} onChange={(event) => setUsername(event.target.value)} />
        {isSignup && <p id="username-help">Use 3 to 24 letters, numbers or underscores.</p>}
        <label htmlFor="account-password">Password</label>
        <input id="account-password" name="password" type="password" required minLength={8}
          maxLength={128} autoComplete={isSignup ? 'new-password' : 'current-password'}
          aria-describedby={isSignup ? 'password-help' : undefined}
          value={password} onChange={(event) => setPassword(event.target.value)} />
        {isSignup && <p id="password-help">Use at least 8 characters.</p>}
        {error && <p className="account-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading || pending || Boolean(account)}>
          {pending ? 'Please wait…' : title}
        </button>
      </form>
      {isSignup ? (
        <p>Already have an account? <Link to="/login" onClick={clearError}>Log in</Link>.</p> //AI ASSISTED
      ) : (
        <p>Need an account? <Link to="/signup" onClick={clearError}>Sign up</Link>.</p> //AI ASSISTED
      )}
    </main>
  )
}
