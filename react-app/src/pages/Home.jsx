import { Link } from 'react-router' //AI ASSISTED
import SearchBar from '../components/SearchBar.jsx'

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="accent">Notflix</span></h1>
          <p className="hero-subtitle">Discover movies you might want to watch.</p>
          <SearchBar variant="home" />
          <Link to="/recommended" className="btn btn-primary">Browse Recommended Movies</Link>{/* //AI ASSISTED */}
        </div>
      </section>

      <section className="features" aria-label="Site features">
        <div className="features-grid">
          <article className="feature-card">
            <h2>Curated Picks</h2>
            <p>Hand-selected movie recommendations across every genre.</p>
          </article>
          <article className="feature-card">
            <h2>Your Favourites</h2>
            <p>Save the movies you love and come back to them anytime.</p>
          </article>
          <article className="feature-card">
            <h2>Watch Anywhere</h2>
            <p>Browse on any device &mdash; desktop, tablet, or phone.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
