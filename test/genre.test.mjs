//AI-assisted - see AI-USAGE.md #6
// Tests for the Genre page. Run them with: npm test
import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router'
import { createServer } from 'vite'
import genreTitles from '../netlify/functions/tmdb-genre.mjs'
import { findGenre, mergeTitles } from '../react-app/src/data/genres.js'

test('genre function asks TMDB for the right list and returns our shape', async (t) => {
  process.env.TMDB_READ_TOKEN = 'test-token'
  t.after(() => delete process.env.TMDB_READ_TOKEN)

  // A fake fetch, so the test doesn't call the real TMDB
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url.pathname, '/3/discover/tv')
    assert.equal(url.searchParams.get('with_genres'), '35')
    assert.equal(url.searchParams.get('sort_by'), 'vote_average.desc')
    return Response.json({
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [{ id: 1396, name: 'Breaking Bad', vote_count: 100, vote_average: 8.9, genre_ids: [18] }],
    })
  })

  const response = await genreTitles(new Request('https://notflix.test/api/genre?type=tv&genre=35'))
  const data = await response.json()
  assert.equal(data.results[0].title, 'Breaking Bad') // TMDB's "name" became our "title"
  assert.equal(data.results[0].mediaType, 'tv')

  // Bad input is rejected before TMDB is called
  const bad = await genreTitles(new Request('https://notflix.test/api/genre?type=podcast'))
  assert.equal(bad.status, 400)
})

test('genre helpers find the right genre and merge pages without duplicates', () => {
  assert.equal(findGenre('movie', 'sci-fi').id, 878)
  assert.equal(findGenre('tv', 'sci-fi'), undefined) // TV calls it "Sci-Fi & Fantasy"

  const merged = mergeTitles([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }])
  assert.deepEqual(merged.map((title) => title.id), [1, 2, 3])
})

test('genre page shows the selected filters and a labelled sort dropdown', async () => {
  // Vite lets Node load our .jsx files
  const vite = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom', logLevel: 'silent' })
  try {
    const { default: Genre } = await vite.ssrLoadModule('/src/pages/Genre.jsx')
    const page = createElement(Routes, null, createElement(Route, { path: '/genre/:mediaType/:genreSlug', element: createElement(Genre) }))
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/genre/tv/comedy'] }, page))

    assert.match(html, /aria-pressed="true"[^>]*>TV Shows<\/button>/)
    assert.match(html, /aria-pressed="true"[^>]*>Comedy<\/button>/)
    assert.match(html, /<label for="genre-sort">Sort by<\/label>/)
    assert.match(html, /role="status">Loading TV shows…<\/p>/)
  } finally {
    await vite.close()
  }
})