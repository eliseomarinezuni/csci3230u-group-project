import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Recommended from './pages/Recommended.jsx'
import Watched from './pages/Watched.jsx'
import Genre from './pages/Genre.jsx'
import Search from './pages/Search.jsx'
import { getSearchQuery } from './data/searchMovies.js'

function getPage() {
  switch (window.location.hash.split('?')[0]) {
    case '#/recommended':
      return 'recommended'
    case '#/watched':
      return 'watched'
    case '#/genre': 
      return 'genre'
    case '#/search':
      return 'search'
    default:
      return 'home'
  }
}

const pageTitles = {
  home: 'Notflix - Home',
  recommended: 'Notflix - Recommended',
  watched: 'Notflix - Watched',
  genre: 'Notflix - Genre',
  search: 'Notflix - Search',
}

export default function App() {
  const [page, setPage] = useState(getPage)
  const [searchQuery, setSearchQuery] = useState(() => getSearchQuery())

  useEffect(() => {
    function handleNavigation() {
      setPage(getPage())
      setSearchQuery(getSearchQuery())
    }

    window.addEventListener('hashchange', handleNavigation)

    return () => {
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [])

  useEffect(() => {
    document.title = pageTitles[page]
  }, [page])

  return (
    <>
      <Header page={page} searchQuery={page === 'search' ? searchQuery : ''} />

      {page === 'home' && <Home />}
      {page === 'recommended' && <Recommended />}
      {page === 'watched' && <Watched />}
       {page === 'genre' && <Genre />}
      {page === 'search' && <Search query={searchQuery} />}

      <Footer />
    </>
  )
}