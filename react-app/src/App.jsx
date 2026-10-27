import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Recommended from './pages/Recommended.jsx'
import Watched from './pages/Watched.jsx'
import Genre from './pages/Genre.jsx'

function getPage() {
  switch (window.location.hash) {
    case '#/recommended':
      return 'recommended'
    case '#/watched':
      return 'watched'
    case '#/genre': 
      return 'genre'
    default:
      return 'home'
  }
}

const pageTitles = {
  home: 'Notflix - Home',
  recommended: 'Notflix - Recommended',
  watched: 'Notflix - Watched',
  genre: 'Notflix - Genre',
}

export default function App() {
  const [page, setPage] = useState(getPage)

  useEffect(() => {
    function handleNavigation() {
      setPage(getPage())
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
      <Header page={page} />

      {page === 'home' && <Home />}
      {page === 'recommended' && <Recommended />}
      {page === 'watched' && <Watched />}
       {page === 'genre' && <Genre />}

      <Footer />
    </>
  )
}