import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Recommended from './pages/Recommended.jsx'

export default function App() {
  const [page, setPage] = useState(
    () => window.location.hash === '#/recommended' ? 'recommended' : 'home',
  )

  useEffect(() => {
    function handleNavigation() {
      if (window.location.hash === '#/recommended') {
        setPage('recommended')
      } else if (window.location.hash === '#/') {
        setPage('home')
      }
    }

    window.addEventListener('hashchange', handleNavigation)
    return () => window.removeEventListener('hashchange', handleNavigation)
  }, [])

  useEffect(() => {
    document.title = page === 'recommended' ? 'Notflix - Recommended' : 'Notflix - Home'
  }, [page])

  return (
    <>
      <Header page={page} />
      {page === 'recommended' ? <Recommended /> : <Home />}
      <Footer />
    </>
  )
}
