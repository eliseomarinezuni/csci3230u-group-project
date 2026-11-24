import assert from 'node:assert/strict' //AI ASSISTED
import test from 'node:test' //AI ASSISTED
import movieDetails from '../netlify/functions/tmdb-movie.mjs' //AI ASSISTED

function useTestToken(t, value) { //AI ASSISTED
  const original = process.env.TMDB_READ_TOKEN //AI ASSISTED
  if (value) process.env.TMDB_READ_TOKEN = value //AI ASSISTED
  else delete process.env.TMDB_READ_TOKEN //AI ASSISTED
  t.after(() => { //AI ASSISTED
    if (original === undefined) delete process.env.TMDB_READ_TOKEN //AI ASSISTED
    else process.env.TMDB_READ_TOKEN = original //AI ASSISTED
  }) //AI ASSISTED
} //AI ASSISTED

test('movie details fetch a TMDB movie by ID and return the shared movie shape', async (t) => { //AI ASSISTED
  useTestToken(t, 'test-token') //AI ASSISTED
  t.mock.method(globalThis, 'fetch', async (url, options) => { //AI ASSISTED
    assert.equal(url, 'https://api.themoviedb.org/3/movie/550') //AI ASSISTED
    assert.equal(options.headers.Authorization, 'Bearer test-token') //AI ASSISTED
    return Response.json({ //AI ASSISTED
      id: 550, //AI ASSISTED
      title: 'Fight Club', //AI ASSISTED
      overview: 'A test description.', //AI ASSISTED
      release_date: '1999-10-15', //AI ASSISTED
      poster_path: '/poster.jpg', //AI ASSISTED
      vote_count: 1, //AI ASSISTED
      vote_average: 8.4, //AI ASSISTED
      genres: [{ id: 18, name: 'Drama' }], //AI ASSISTED
    }) //AI ASSISTED
  }) //AI ASSISTED

  for (const path of ['/api/movies/550', '/.netlify/functions/tmdb-movie/550']) { //AI ASSISTED
    const response = await movieDetails(new Request(`https://notflix.example${path}`)) //AI ASSISTED
    assert.equal(response.status, 200) //AI ASSISTED
    assert.deepEqual(await response.json(), { //AI ASSISTED
      movie: { //AI ASSISTED
        id: 550, //AI ASSISTED
        title: 'Fight Club', //AI ASSISTED
        description: 'A test description.', //AI ASSISTED
        releaseDate: '1999-10-15', //AI ASSISTED
        poster: 'https://image.tmdb.org/t/p/w342/poster.jpg', //AI ASSISTED
        rating: 8.4, //AI ASSISTED
        genreIds: [18], //AI ASSISTED
      }, //AI ASSISTED
    }) //AI ASSISTED
  } //AI ASSISTED
}) //AI ASSISTED

test('movie details reject unsupported methods, invalid IDs, and missing configuration', async (t) => { //AI ASSISTED
  useTestToken(t) //AI ASSISTED
  const fetchMock = t.mock.method(globalThis, 'fetch', () => { //AI ASSISTED
    throw new Error('Unexpected upstream request.') //AI ASSISTED
  }) //AI ASSISTED
  const url = 'https://notflix.example/api/movies/' //AI ASSISTED
  assert.equal((await movieDetails(new Request(url + '550', { method: 'POST' }))).status, 405) //AI ASSISTED
  assert.equal((await movieDetails(new Request(url + 'abc'))).status, 400) //AI ASSISTED
  assert.equal((await movieDetails(new Request(url + '550'))).status, 503) //AI ASSISTED
  assert.equal(fetchMock.mock.callCount(), 0) //AI ASSISTED
}) //AI ASSISTED

test('movie details return controlled errors for missing movies and upstream failures', async (t) => { //AI ASSISTED
  useTestToken(t, 'test-token') //AI ASSISTED
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 404 })) //AI ASSISTED
  const request = new Request('https://notflix.example/api/movies/550') //AI ASSISTED
  let response = await movieDetails(request) //AI ASSISTED
  assert.equal(response.status, 404) //AI ASSISTED
  assert.deepEqual(await response.json(), { error: 'Movie not found.' }) //AI ASSISTED

  globalThis.fetch.mock.mockImplementation(async () => new Response('test-token', { status: 401 })) //AI ASSISTED
  response = await movieDetails(request) //AI ASSISTED
  assert.equal(response.status, 502) //AI ASSISTED
  assert.deepEqual(await response.json(), { error: 'Movie details are temporarily unavailable.' }) //AI ASSISTED
}) //AI ASSISTED
