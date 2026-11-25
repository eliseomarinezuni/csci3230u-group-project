// AI-assisted - see AI-USAGE.md #3
import assert from 'node:assert/strict'
import test from 'node:test'
import { handleAccount } from '../netlify/functions/account.mjs'

function memoryStore() {
  const values = new Map()
  let revision = 0
  return {
    async get(key) {
      return structuredClone(values.get(key)?.data ?? null)
    },
    async getWithMetadata(key) {
      return structuredClone(values.get(key) ?? null)
    },
    async setJSON(key, data, options = {}) {
      const current = values.get(key)
      if ((options.onlyIfNew && current) || (options.onlyIfMatch && current?.etag !== options.onlyIfMatch)) {
        return { modified: false }
      }
      const etag = String(++revision)
      values.set(key, { data: structuredClone(data), etag })
      return { modified: true, etag }
    },
    async delete(key) {
      values.delete(key)
    },
  }
}

function accountApi() {
  const stores = { accounts: memoryStore(), sessions: memoryStore() }
  return (body, cookie, origin = 'https://notflix.example') => handleAccount(
    new Request('https://notflix.example/api/account', {
      method: body ? 'POST' : 'GET',
      headers: {
        ...(body && { 'content-type': 'application/json', origin }),
        ...(cookie && { cookie }),
      },
      body: body && JSON.stringify(body),
    }),
    async () => stores,
  )
}

const credentials = { username: 'MovieFan', password: 'correct demo password' }
const movie = { id: 'inception', tmdbId: 27205, title: 'Inception', genres: ['Sci-Fi'] }

test('username uniqueness, password verification, and session invalidation', async () => {
  const call = accountApi()
  const signup = await call({ action: 'signup', ...credentials })
  assert.equal(signup.status, 201)
  const cookie = signup.headers.get('set-cookie')
  assert.match(cookie, /HttpOnly; SameSite=Lax; Secure/)
  assert.deepEqual((await signup.json()).account, {
    username: 'moviefan',
    watchedMovies: [],
    favouriteMovies: [],
  })
  assert.equal((await call({ action: 'signup', ...credentials, username: 'MOVIEFAN' })).status, 409)
  assert.equal((await call({ action: 'login', ...credentials, password: 'wrong demo password' })).status, 401)
  assert.equal((await call({ action: 'login', ...credentials })).status, 200)
  assert.equal((await call({ action: 'logout' }, cookie, 'https://elsewhere.example')).status, 403)
  assert.equal((await call({ action: 'logout' }, cookie)).status, 200)
  assert.equal((await (await call(null, cookie)).json()).account, null)
})

// AI-assisted - see AI-USAGE.md #4
test('watched movies are private and concurrent updates preserve both movies', async () => {
  const call = accountApi()
  const first = await call({ action: 'signup', ...credentials })
  const second = await call({ action: 'signup', ...credentials, username: 'anotherfan' })
  const firstCookie = first.headers.get('set-cookie')
  const secondCookie = second.headers.get('set-cookie')
  const watch = { action: 'save-movie', list: 'watchedMovies', movie, enabled: true }
  assert.equal((await call(watch)).status, 401)
  assert.equal((await call({ ...watch, list: 'favourites' }, firstCookie)).status, 400)
  const updates = await Promise.all([
    call(watch, firstCookie),
    call({ ...watch, movie: { id: 603, title: 'The Matrix', genres: ['Sci-Fi'] } }, firstCookie),
  ])
  assert.deepEqual(updates.map((response) => response.status), [200, 200])
  const { account } = await (await call(null, firstCookie)).json()
  assert.deepEqual(account.watchedMovies.map(({ id }) => id).sort((first, second) => first - second), [603, 27205])
  assert.deepEqual((await (await call(null, secondCookie)).json()).account.watchedMovies, [])
  const removed = await call({ ...watch, enabled: false, movie: { id: 27205 } }, firstCookie)
  assert.deepEqual((await removed.json()).account.watchedMovies.map(({ id }) => id), [603])
})

// AI-assisted - see AI-USAGE.md #4
test('favourite movies can be saved for accounts that predate the list', async () => {
  const call = accountApi()
  const signup = await call({ action: 'signup', ...credentials })
  const cookie = signup.headers.get('set-cookie')
  const favour = { action: 'save-movie', list: 'favouriteMovies', movie, enabled: true }
  const saved = await call(favour, cookie)
  assert.equal(saved.status, 200)
  const { account } = await saved.json()
  assert.deepEqual(account.favouriteMovies.map(({ id }) => id), [27205])
  assert.equal(account.favouriteMovies[0].watchedOn, undefined)
  assert.deepEqual(account.watchedMovies, [])
})
