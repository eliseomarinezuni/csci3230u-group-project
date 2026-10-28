import movies from './movies.js'

// Normalize query
// Allow lowercase, strip punctuation (including accents).
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function getSearchQuery(hash = window.location.hash) {
  const queryString = hash.split('?')[1] ?? ''
  return (new URLSearchParams(queryString).get('q') ?? '').trim()
}

export function getSearchHash(query) {
  return `#/search?q=${encodeURIComponent(query.trim())}`
}

export default function searchMovies(query) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []

  const words = normalizedQuery.split(' ')
  const compactQuery = normalizedQuery.replaceAll(' ', '')

  const matches = movies.filter((movie) => {
    const title = normalize(movie.title)
    return words.every((word) => title.includes(word)) || title.replaceAll(' ', '').includes(compactQuery)
  })

  return matches.sort((a, b) => {
    const aStarts = normalize(a.title).startsWith(normalizedQuery)
    const bStarts = normalize(b.title).startsWith(normalizedQuery)
    return Number(bStarts) - Number(aStarts)
  })
}
