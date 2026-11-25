// AI-assisted - see AI-USAGE.md #6
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import MovieDetails from '../components/MovieDetails.jsx'
import { getTvShow } from '../data/genres.js'

export default function TvPage({ overlay = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setShow(null)
    setError('')

    getTvShow(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setShow(data)
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })

    return () => controller.abort()
  }, [id])

  return (
    <MovieDetails
      movie={show}
      message={error || 'Loading TV show details…'}
      onClose={overlay ? () => navigate(-1) : undefined}
    />
  )
}