export default function Header({ page }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#/" className="logo" aria-label="Notflix Home">
          NOTFLIX
        </a>

        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <a
                href="#/"
                className={`nav-link${page === 'home' ? ' active' : ''}`}
                aria-current={page === 'home' ? 'page' : undefined}
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="#/recommended"
                className={`nav-link${page === 'recommended' ? ' active' : ''}`}
                aria-current={page === 'recommended' ? 'page' : undefined}
              >
                Recommended
              </a>
            </li>

            <li>
              <a
                href="#/watched"
                className={`nav-link${page === 'watched' ? ' active' : ''}`}
                aria-current={page === 'watched' ? 'page' : undefined}
              >
                Watched
              </a>
            </li>

            <li>
              <span className="nav-link disabled" aria-disabled="true">
                Favourites
              </span>
            </li>

            <li>
              <a href="/prototype/Genre.html" className="nav-link">
                Genre
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}