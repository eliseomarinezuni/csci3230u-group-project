// AI-assisted - see AI-USAGE.md #7
// Tests for search filters (year, rating, director, genre, sort). Run them with: npm test
import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { createServer } from 'vite'
import searchMovies from '../netlify/functions/tmdb-search.mjs'
import { parseSearchFilters, sortMovies } from '../netlify/lib/searchFilters.mjs'
import {
  getSearchFilters,
  getSearchPath,
  hasSearchFilters,
  validateSearchFilters,
} from '../react-app/src/data/searchMovies.js'

const movie = (id, title, releaseDate, rating, genreIds = [18], extra = {}) => ({
  id, title, release_date: releaseDate, vote_average: rating, vote_count: 1000, genre_ids: genreIds, ...extra,
})

function search(params) {
  return searchMovies(new Request(`https://notflix.test/api/movies/search?${new URLSearchParams(params)}`))
}

function useToken(t) {
  process.env.TMDB_READ_TOKEN = 'test-token'
  t.after(() => delete process.env.TMDB_READ_TOKEN)
}

test('a title search with filters looks at more pages and keeps only matching movies', async (t) => {
  useToken(t)
  const pages = {
    1: [movie(1, 'Batman', '1989-06-23', 7.2, [28]), movie(2, 'Batman Begins', '2005-06-15', 7.7, [28])],
    2: [movie(3, 'The Batman', '2022-03-01', 7.7, [80]), movie(4, 'Batman Forever', '1995-06-16', 5.4, [28])],
    3: [movie(5, 'The Dark Knight', '2008-07-16', 8.5, [28]), movie(6, 'Batman: Undated', '', 9, [28])],
  }
  const requested = []
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url.pathname, '/3/search/movie')
    assert.equal(url.searchParams.get('query'), 'batman')
    const page = Number(url.searchParams.get('page'))
    requested.push(page)
    return Response.json({ page, total_pages: 7, results: pages[page] })
  })

  const response = await search({ q: 'batman', yearFrom: '1990', minRating: '7.5', genre: '28', sort: 'rating' })
  const { movies } = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(requested.sort(), [1, 2, 3]) // stops at 3 pages even though TMDB has 7
  // 1989, below-7.5, Crime-only and undated movies are filtered out; highest rated comes first
  assert.deepEqual(movies.map((m) => m.title), ['The Dark Knight', 'Batman Begins'])
  assert.equal(movies[0].releaseDate, '2008-07-16') // mapped to the app's own shape
})

test('a title search without filters only asks for one page, in TMDB order', async (t) => {
  useToken(t)
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url.searchParams.get('page'), '1')
    return Response.json({ page: 1, total_pages: 9, results: [movie(1, 'Up', '2009-05-28', 7.9), movie(2, 'Up in the Air', '2009-09-05', 6.8)] })
  })

  const { movies } = await (await search({ q: 'up' })).json()
  assert.deepEqual(movies.map((m) => m.title), ['Up', 'Up in the Air'])
})

test('a director filter finds the person, then filters the movies they directed', async (t) => {
  useToken(t)
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url.pathname === '/3/search/person') {
      assert.equal(url.searchParams.get('query'), 'nolan')
      return Response.json({
        results: [
          { id: 99, name: 'Nolan Gould', known_for_department: 'Acting' },
          { id: 525, name: 'Christopher Nolan', known_for_department: 'Directing' },
        ],
      })
    }
    assert.equal(url.pathname, '/3/person/525/movie_credits')
    return Response.json({
      crew: [
        movie(1, 'Inception', '2010-07-15', 8.4, [878], { job: 'Director', popularity: 50 }),
        movie(1, 'Inception', '2010-07-15', 8.4, [878], { job: 'Writer', popularity: 50 }),
        movie(2, 'Interstellar', '2014-11-05', 8.4, [878], { job: 'Director', popularity: 90 }),
        movie(3, 'Memento', '2000-10-11', 8.2, [53], { job: 'Director', popularity: 20 }),
        movie(4, 'Man of Steel', '2013-06-12', 6.6, [878], { job: 'Producer', popularity: 80 }),
      ],
    })
  })

  const response = await search({ director: 'nolan', yearFrom: '2005' })
  const data = await response.json()
  // Picks the director over the actor, drops non-directing credits and duplicates, most popular first
  assert.deepEqual(data.director, { id: 525, name: 'Christopher Nolan' })
  assert.deepEqual(data.movies.map((m) => m.title), ['Interstellar', 'Inception'])

  // A title narrows the director's movies
  const withTitle = await (await search({ director: 'nolan', q: 'inter' })).json()
  assert.deepEqual(withTitle.movies.map((m) => m.title), ['Interstellar'])
})

test('an unknown director returns no movies and director: null', async (t) => {
  useToken(t)
  t.mock.method(globalThis, 'fetch', async () => Response.json({ results: [] }))

  const data = await (await search({ director: 'zzzz' })).json()
  assert.deepEqual(data, { movies: [], director: null })
})

test('filters without a title use TMDB discover with the right parameters', async (t) => {
  useToken(t)
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url.pathname, '/3/discover/movie')
    assert.equal(url.searchParams.get('primary_release_date.gte'), '1990-01-01')
    assert.equal(url.searchParams.get('primary_release_date.lte'), '1999-12-31')
    assert.equal(url.searchParams.get('vote_average.gte'), '8')
    assert.equal(url.searchParams.get('with_genres'), '35')
    assert.equal(url.searchParams.get('sort_by'), 'vote_average.desc')
    assert.equal(url.searchParams.get('vote_count.gte'), '500')
    const page = Number(url.searchParams.get('page'))
    return Response.json({ page, results: [movie(page, `Comedy ${page}`, '1994-01-01', 8.1, [35])] })
  })

  const response = await search({ yearFrom: '1990', yearTo: '1999', minRating: '8', genre: '35', sort: 'rating' })
  const { movies } = await response.json()
  assert.equal(response.status, 200)
  assert.deepEqual(movies.map((m) => m.title), ['Comedy 1', 'Comedy 2'])
})

test('lowest rated uses TMDB discover ascending, with the same vote minimum as highest rated', async (t) => {
  useToken(t)
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url.searchParams.get('sort_by'), 'vote_average.asc')
    assert.equal(url.searchParams.get('vote_count.gte'), '500')
    return Response.json({ results: [] })
  })
  assert.equal((await search({ genre: '27', sort: 'lowest-rated' })).status, 200)
})

test('bad filters are rejected before TMDB is called', async (t) => {
  useToken(t)
  t.mock.method(globalThis, 'fetch', async () => assert.fail('TMDB should not be called'))

  for (const params of [
    {}, // no title and no filters
    { q: 'x', yearFrom: '2010', yearTo: '2000' },
    { q: 'x', yearFrom: '99' },
    { q: 'x', minRating: '11' },
    { q: 'x', minRating: '7..5' },
    { q: 'x', genre: 'action' },
    { q: 'x', sort: 'random' },
  ]) {
    const response = await search(params)
    assert.equal(response.status, 400, JSON.stringify(params))
    assert.ok((await response.json()).error)
  }
})

test('TMDB errors become a friendly 502', async (t) => {
  useToken(t)
  t.mock.method(console, 'warn', () => {})
  t.mock.method(globalThis, 'fetch', async () => new Response('nope', { status: 500 }))

  const response = await search({ q: 'alien' })
  assert.equal(response.status, 502)
  assert.equal((await response.json()).error, 'Movie search is temporarily unavailable.')
})

test('server-side parsing and sorting helpers', () => {
  const { filters } = parseSearchFilters(new URLSearchParams('director= Greta Gerwig &yearTo=2023'))
  assert.equal(filters.director, 'Greta Gerwig')
  assert.equal(filters.yearTo, 2023)
  assert.equal(filters.sort, 'relevance')

  const decimal = parseSearchFilters(new URLSearchParams('minRating=7.25'))
  assert.equal(decimal.filters.minRating, 7.25)

  const movies = [movie(1, 'A', '2001-01-01', 6), movie(2, 'B', '', 9), movie(3, 'C', '1999-01-01', 7)]
  assert.deepEqual(sortMovies(movies, 'oldest').map((m) => m.id), [3, 1, 2]) // undated last
  assert.deepEqual(sortMovies(movies, 'rating').map((m) => m.id), [2, 3, 1])
  assert.deepEqual(sortMovies(movies, 'lowest-rated').map((m) => m.id), [1, 3, 2])
  const unrated = { ...movie(4, 'D', '2020-01-01', 0), vote_count: 0 }
  assert.deepEqual(sortMovies([unrated, ...movies], 'lowest-rated').map((m) => m.id), [1, 3, 2, 4]) // unrated last
  assert.deepEqual(sortMovies(movies, 'newest').map((m) => m.id), [1, 3, 2])
  assert.deepEqual(sortMovies(movies, 'relevance').map((m) => m.id), [1, 2, 3])
})

test('search URLs keep filters, skip empty ones, and read back the same', () => {
  const path = getSearchPath(' alien ', { director: 'Ridley Scott', yearFrom: '1979', minRating: '', sort: 'relevance' })
  assert.equal(path, '/search?q=alien&director=Ridley+Scott&yearFrom=1979')

  const filters = getSearchFilters(path.slice('/search'.length))
  assert.equal(filters.director, 'Ridley Scott')
  assert.equal(filters.yearFrom, '1979')
  assert.equal(filters.sort, 'relevance')
  assert.equal(hasSearchFilters(filters), true)
  assert.equal(hasSearchFilters(getSearchFilters('?q=alien&sort=newest')), false) // sort alone isn't a filter
  assert.equal(getSearchPath('', {}), '/search')
})

test('the filter form catches bad years and ratings', () => {
  const now = new Date('2026-06-01')
  assert.equal(validateSearchFilters({ yearFrom: '1990', yearTo: '2000', minRating: '7.25' }, now), null)
  assert.equal(validateSearchFilters({ minRating: '.5' }, now), null)
  assert.equal(validateSearchFilters({ minRating: '10' }, now), null)

  const backwards = validateSearchFilters({ yearFrom: '2000', yearTo: '1990' }, now)
  assert.equal(backwards.field, 'years')
  assert.match(backwards.message, /before/)
  assert.match(validateSearchFilters({ yearFrom: '123', yearTo: '' }, now).message, /between 1870 and 2036/)

  for (const minRating of ['10.5', '7..5', 'abc', '-1', '7,5']) {
    assert.equal(validateSearchFilters({ minRating }, now)?.field, 'minRating', minRating)
  }
})

test('search page shows the filter form filled in from the URL', async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    logLevel: 'silent',
    optimizeDeps: { noDiscovery: true }, // SSR rendering doesn't need the browser dependency scan
  })
  try {
    const { default: Search } = await vite.ssrLoadModule('/src/pages/Search.jsx')
    const render = (query, search) => renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(Search, { query, search })),
    )

    const html = render('', '?director=Nolan&yearFrom=2000&minRating=7.5&genre=878&sort=lowest-rated')
    assert.match(html, /<h1 id="search-heading">Filtered movies<\/h1>/)
    assert.match(html, /<label for="[^"]+">Director<\/label><input[^>]*value="Nolan"/)
    assert.match(html, /<legend>Release year<\/legend>/)
    assert.match(html, /<input[^>]*placeholder="From"[^>]*value="2000"/)
    assert.match(html, /<label for="[^"]+">Minimum rating<\/label><input[^>]*inputMode="decimal"[^>]*value="7.5"/)
    assert.match(html, /<option value="878" selected="">Sci-Fi<\/option>/)
    assert.match(html, /<option value="lowest-rated" selected="">Lowest rated<\/option>/)
    assert.match(html, /Searching for movies…/)

    // Nothing to search yet: a hint, no sort dropdown, and nothing to clear
    const empty = render('', '')
    assert.match(empty, /choose filters to browse movies/)
    assert.doesNotMatch(empty, /Sort by/)
    assert.match(empty, /<button type="button" class="search-filters__clear" disabled="">/)
  } finally {
    await vite.close()
  }
})
