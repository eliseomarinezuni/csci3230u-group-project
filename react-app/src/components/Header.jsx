import { Link } from 'react-router' //AI ASSISTED
import SearchBar from './SearchBar.jsx'
import { useWatchedMovies } from './WatchedMoviesContext.jsx' // AI-assisted - see AI-USAGE.md #3

export default function Header({ page, searchQuery }) {
  const { account, loading, pending, error, submit } = useWatchedMovies() // AI-assisted - see AI-USAGE.md #3
  const onAccountPage = page === 'login' || page === 'signup'
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="Notflix Home">{/* //AI ASSISTED */}
          NOTFLIX
        </Link>{/* //AI ASSISTED */}

        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <Link /* //AI ASSISTED */
                to="/" /* //AI ASSISTED */
                className={`nav-link${page === 'home' ? ' active' : ''}`}
                aria-current={page === 'home' ? 'page' : undefined}
              >
                Home
              </Link>{/* //AI ASSISTED */}
            </li>

            <li>
              <Link /* //AI ASSISTED */
                to="/recommended" /* //AI ASSISTED */
                className={`nav-link${page === 'recommended' ? ' active' : ''}`}
                aria-current={page === 'recommended' ? 'page' : undefined}
              >
                Recommended
              </Link>{/* //AI ASSISTED */}
            </li>

            <li>
              <Link /* //AI ASSISTED */
                to="/watched" /* //AI ASSISTED */
                className={`nav-link${page === 'watched' ? ' active' : ''}`}
                aria-current={page === 'watched' ? 'page' : undefined}
              >
                Watched
              </Link>{/* //AI ASSISTED */}
            </li>

            <li>
              <Link /* //AI ASSISTED */
                to="/favourites" /* //AI ASSISTED */
                className={`nav-link${page === 'favourites' ? ' active' : ''}`}
                aria-current={page === 'favourites' ? 'page' : undefined}
              >
                Favourites
              </Link>{/* //AI ASSISTED */}
            </li>

            <li>
              <Link to="/genre" /* //AI ASSISTED */
              className={`nav-link${page === 'genre' ? ' active' : ''}`}
              aria-current={page === 'genre' ? 'page' : undefined}
              >
                Genre
              </Link>{/* //AI ASSISTED */}
            </li>
          </ul>
        </nav>

        <SearchBar key={searchQuery} initialQuery={searchQuery} />
        {/* AI-assisted - see AI-USAGE.md #3 */}
        {account ? (
          <div className="account-nav">
            <span>{account.username}</span>
            <button type="button" className="watched-toggle" disabled={pending} onClick={() => submit('logout')}>
              Log Out
            </button>
          </div>
        ) : !loading && (
          <div className="account-nav">
            <Link className="nav-link" to="/login" aria-current={page === 'login' ? 'page' : undefined}>Log In</Link>{/* //AI ASSISTED */}
            <Link className="nav-link" to="/signup" aria-current={page === 'signup' ? 'page' : undefined}>Sign Up</Link>{/* //AI ASSISTED */}
          </div>
        )}
      </div>
      {error && !onAccountPage && <p className="account-error" role="alert">{error}</p>}
    </header>
  )
}
