// AI-assisted - see AI-USAGE.md #3
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const deriveKey = promisify(scrypt)
const sessionAge = 7 * 24 * 60 * 60
const cookieName = 'notflix_session'

export class AccountError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function normalizeUsername(value) {
  const username = typeof value === 'string' ? value.trim() : ''
  return /^[a-z0-9_]{3,24}$/i.test(username) ? username.toLowerCase() : null
}

async function passwordKey(password, salt) {
  return deriveKey(password, salt, 64, { N: 2 ** 17, r: 8, p: 1, maxmem: 160 * 1024 * 1024 })
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const key = await passwordKey(password, salt)
  return { salt, hash: key.toString('hex') }
}

export async function checkPassword(password, saved) {
  const key = await passwordKey(password, saved?.salt ?? '0'.repeat(32))
  return Boolean(saved && timingSafeEqual(key, Buffer.from(saved.hash, 'hex')))
}

function sessionKey(token) {
  return createHash('sha256').update(token).digest('hex')
}

function readToken(request) {
  const value = request.headers.get('cookie')
    ?.split(';').map((part) => part.trim()).find((part) => part.startsWith(cookieName + '='))
    ?.slice(cookieName.length + 1)
  return /^[a-f0-9]{64}$/.test(value ?? '') ? value : null
}

function sessionCookie(request, token, age) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${cookieName}=${token}; Path=/; Max-Age=${age}; HttpOnly; SameSite=Lax${secure}`
}

export async function startSession(request, store, username) {
  const token = randomBytes(32).toString('hex')
  await endSession(request, store)
  await store.setJSON(sessionKey(token), { username, expiresAt: Date.now() + sessionAge * 1000 })
  return sessionCookie(request, token, sessionAge)
}

export async function endSession(request, store) {
  const token = readToken(request)
  if (token) await store.delete(sessionKey(token))
  return sessionCookie(request, '', 0)
}

export async function signedInUsername(request, store) {
  const token = readToken(request)
  if (!token) return null
  const key = sessionKey(token)
  const session = await store.get(key, { type: 'json' })
  if (!session) return null
  if (session.expiresAt <= Date.now()) {
    await store.delete(key)
    return null
  }
  return session.username
}

export function publicAccount(account) {
  return { username: account.username, watchedMovies: account.watchedMovies } // AI-assisted - see AI-USAGE.md #4
}

export function reply(data, status = 200, cookie) {
  const headers = { 'Cache-Control': 'no-store' }
  if (cookie) headers['Set-Cookie'] = cookie
  return Response.json(data, { status, headers })
}

export function requireSameOrigin(request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    throw new AccountError(403, 'This request must come from Notflix.')
  }
}

export async function readJson(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new AccountError(415, 'Send a JSON request.')
  }
  const reader = request.body?.getReader()
  if (!reader) throw new AccountError(400, 'Invalid request.')
  const decoder = new TextDecoder()
  let body = ''
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 12_000) {
      await reader.cancel()
      throw new AccountError(413, 'The request is too large.')
    }
    body += decoder.decode(value, { stream: true })
  }
  try {
    const parsed = JSON.parse(body + decoder.decode())
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error()
    return parsed
  } catch {
    throw new AccountError(400, 'Invalid request.')
  }
}

export function movieId(movie) {
  const id = movie?.tmdbId ?? movie?.id
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function cleanMovie(movie) {
  const id = movieId(movie)
  if (!id || typeof movie.title !== 'string' || !movie.title.trim() ||
      !Array.isArray(movie.genres) || movie.genres.length > 19 ||
      movie.genres.some((genre) => typeof genre !== 'string' || genre.length > 30)) {
    throw new AccountError(400, 'Invalid movie.')
  }

  const poster = typeof movie.poster === 'string' &&
    /^(?:https:\/\/image\.tmdb\.org\/t\/p\/w342\/[\w.-]+|\/prototype\/images\/[\w.-]+)$/.test(movie.poster)
    ? movie.poster
    : null
  return {
    id,
    title: movie.title.trim().slice(0, 320),
    genres: [...new Set(movie.genres)],
    poster,
    description: typeof movie.description === 'string' ? movie.description.slice(0, 3000) : '',
    rating: Number.isFinite(movie.rating) && movie.rating >= 0 && movie.rating <= 10 ? movie.rating : null,
    releaseDate: /^\d{4}-\d{2}-\d{2}$/.test(movie.releaseDate ?? '') ? movie.releaseDate : null,
    releaseYear: Number.isInteger(movie.releaseYear) ? movie.releaseYear : null,
  }
}

export async function saveMovieStatus(store, username, { list, movie, enabled }) {
  // AI-assisted - see AI-USAGE.md #4
  if (list !== 'watchedMovies' || typeof enabled !== 'boolean') {
    throw new AccountError(400, 'Invalid movie action.')
  }
  const id = movieId(movie)
  if (!id) throw new AccountError(400, 'Invalid movie ID.')
  const entry = enabled ? { ...cleanMovie(movie), watchedOn: new Date().toISOString().slice(0, 10) } : null

  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await store.getWithMetadata(username, { type: 'json' })
    if (!current) throw new AccountError(401, 'Log in to save movies.')
    const account = current.data
    const movies = account.watchedMovies
    if (movies.some((saved) => saved.id === id) === enabled) return account
    if (enabled && movies.length >= 500) throw new AccountError(409, 'This list is full.')

    const update = {
      ...account,
      watchedMovies: enabled ? [entry, ...movies] : movies.filter((item) => item.id !== id),
    }
    const result = await store.setJSON(username, update, { onlyIfMatch: current.etag })
    if (result.modified) return update
  }
  throw new AccountError(409, 'Your list changed. Please try again.')
}
