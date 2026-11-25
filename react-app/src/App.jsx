import { useEffect } from 'react' //AI ASSISTED
import { matchPath, Navigate, Route, Routes, useLocation } from 'react-router' //AI ASSISTED
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { WatchedMoviesProvider } from './components/WatchedMoviesContext.jsx' //AI ASSISTED
import Home from './pages/Home.jsx'
import Recommended from './pages/Recommended.jsx'
import Watched from './pages/Watched.jsx'
import Genre from './pages/Genre.jsx'
import Search from './pages/Search.jsx'
import Account from './pages/Account.jsx' // AI-assisted - see AI-USAGE.md #3
import MoviePage from './pages/MoviePage.jsx' //AI ASSISTED
import TvPage from './pages/TvPage.jsx' // AI-assisted - see AI-USAGE.md #6
import { getSearchQuery } from './data/searchMovies.js'

const pageTitles = {
  home: 'Notflix - Home',
  recommended: 'Notflix - Recommended',
  watched: 'Notflix - Watched',
  genre: 'Notflix - Genre',
  search: 'Notflix - Search',
  login: 'Notflix - Log In', // AI-assisted - see AI-USAGE.md #3
  signup: 'Notflix - Sign Up',
  movie: 'Notflix - Movie Details', //AI ASSISTED
}

export default function App() {
  const location = useLocation() //AI ASSISTED
  const isMovieRoute = Boolean( // AI-assisted - see AI-USAGE.md #6 (TV details open as a pop-up too)
    matchPath('/movies/:id', location.pathname) || matchPath('/tv/:id', location.pathname),
  )
  const background = isMovieRoute ? location.state?.background : null //AI ASSISTED
  const pageLocation = background ?? location //AI ASSISTED
  const section = pageLocation.pathname.split('/')[1] //AI ASSISTED
  const page = Object.hasOwn(pageTitles, section) ? section : 'home' //AI ASSISTED
  const searchQuery = page === 'search' ? getSearchQuery(pageLocation.search) : '' //AI ASSISTED

  useEffect(() => {
    document.title = isMovieRoute ? pageTitles.movie : pageTitles[page] //AI ASSISTED
  }, [isMovieRoute, page]) //AI ASSISTED

  if (location.pathname === '/' && /^#\/(?:recommended|watched|genre|search|login|signup)?(?:\?|$)/.test(location.hash)) { //AI ASSISTED
    return <Navigate to={location.hash.slice(1)} replace /> //AI ASSISTED
  } //AI ASSISTED

  return (
    <WatchedMoviesProvider>{/* //AI ASSISTED */}
      <Header page={isMovieRoute && !background ? 'movie' : page} searchQuery={searchQuery} />{/* //AI ASSISTED */}

      <Routes location={pageLocation}>{/* //AI ASSISTED */}
        <Route path="/" element={<Home />} />{/* //AI ASSISTED */}
        <Route path="/recommended" element={<Recommended />} />{/* //AI ASSISTED */}
        <Route path="/watched" element={<Watched />} />{/* //AI ASSISTED */}
        
        {/* AI-assisted - see AI-USAGE.md #6: /genre opens all movies */}
        <Route path="/genre" element={<Navigate to="/genre/movie/all" replace />} />
        <Route path="/genre/:mediaType/:genreSlug" element={<Genre />} />

        <Route path="/search" element={<Search query={searchQuery} />} />{/* //AI ASSISTED */}
        {/* AI-assisted - see AI-USAGE.md #3 */}{/* //AI ASSISTED */}
        <Route path="/login" element={<Account key="login" mode="login" />} />{/* //AI ASSISTED */}
        <Route path="/signup" element={<Account key="signup" mode="signup" />} />{/* //AI ASSISTED */}
        <Route path="/movies/:id" element={<MoviePage />} />{/* //AI ASSISTED */}
        <Route path="/tv/:id" element={<TvPage />} />{/* AI-assisted - see AI-USAGE.md #6 */}
        <Route path="*" element={<Home />} />{/* //AI ASSISTED */}
      </Routes>{/* //AI ASSISTED */}
      {background && ( //AI ASSISTED
        <Routes>{/* //AI ASSISTED */}
          <Route path="/movies/:id" element={<MoviePage overlay />} />{/* //AI ASSISTED */}
          <Route path="/tv/:id" element={<TvPage overlay />} />{/* AI-assisted - see AI-USAGE.md #6 */}
        </Routes> //AI ASSISTED
      )}{/* //AI ASSISTED */}

      <Footer />
    </WatchedMoviesProvider>
  )
}
