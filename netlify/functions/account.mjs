// AI-assisted - see AI-USAGE.md #3
import {
  AccountError, checkPassword, endSession, hashPassword, normalizeUsername, publicAccount,
  readJson, reply, requireSameOrigin, saveMovieStatus, signedInUsername, startSession,
} from '../lib/accounts.mjs'

export const config = {
  path: '/api/account',
  rateLimit: { windowLimit: 45, windowSize: 60, aggregateBy: ['ip', 'domain'] },
}

export default function accountHandler(request) {
  return handleAccount(request, async () => {
    const { getStore } = await import('@netlify/blobs')
    return {
      accounts: getStore({ name: 'notflix-accounts', consistency: 'strong' }),
      sessions: getStore({ name: 'notflix-sessions', consistency: 'strong' }),
    }
  })
}

export async function handleAccount(request, openStores) {
  try {
    if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'Method not allowed.' }, 405)
    const { accounts, sessions } = await openStores()

    if (request.method === 'GET') {
      const username = await signedInUsername(request, sessions)
      const account = username && await accounts.get(username, { type: 'json' })
      return reply({ account: account ? publicAccount(account) : null })
    }

    requireSameOrigin(request)
    const { action, ...body } = await readJson(request)
    if (action === 'logout') return reply({ account: null }, 200, await endSession(request, sessions))
    if (action === 'save-movie') {
      const username = await signedInUsername(request, sessions)
      if (!username) throw new AccountError(401, 'Log in to save movies.')
      return reply({ account: publicAccount(await saveMovieStatus(accounts, username, body)) })
    }
    if (action !== 'signup' && action !== 'login') throw new AccountError(400, 'Invalid account action.')

    const username = normalizeUsername(body.username)
    const password = body.password
    if (action === 'signup' && !username) {
      throw new AccountError(400, 'Use 3 to 24 letters, numbers or underscores for your username.')
    }
    if (!username || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      throw new AccountError(action === 'signup' ? 400 : 401, action === 'signup'
        ? 'Use a password with 8 to 128 characters.'
        : 'Invalid username or password.')
    }

    if (action === 'signup') {
      const account = { username, password: await hashPassword(password), watchedMovies: [] } // AI-assisted - see AI-USAGE.md #4
      const result = await accounts.setJSON(username, account, { onlyIfNew: true })
      if (!result.modified) throw new AccountError(409, 'That username is taken.')
      return reply({ account: publicAccount(account) }, 201, await startSession(request, sessions, username))
    }
    const account = await accounts.get(username, { type: 'json' })
    if (!await checkPassword(password, account?.password)) {
      throw new AccountError(401, 'Invalid username or password.')
    }
    return reply({ account: publicAccount(account) }, 200, await startSession(request, sessions, username))
  } catch (error) {
    if (error instanceof AccountError) return reply({ error: error.message }, error.status)
    console.error('Notflix account request failed:', error.name)
    return reply({ error: 'Account services are temporarily unavailable.' }, 503)
  }
}
