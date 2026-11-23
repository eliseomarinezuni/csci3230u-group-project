// AI-assisted - see AI-USAGE.md #3
import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('login and signup show labelled username and password fields', async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
  })
  try {
    const { default: Account } = await vite.ssrLoadModule('/src/pages/Account.jsx')
    const { WatchedMoviesProvider } = await vite.ssrLoadModule('/src/components/WatchedMoviesContext.jsx')
    for (const [mode, passwordAutocomplete] of [['login', 'current-password'], ['signup', 'new-password']]) {
      const markup = renderToStaticMarkup(createElement(WatchedMoviesProvider, null, createElement(Account, { mode })))
      assert.match(markup, /<label for="account-username">Username<\/label>/)
      assert.match(markup, /<label for="account-password">Password<\/label>/)
      assert.match(markup, /type="password"/)
      assert.match(markup, new RegExp(`autoComplete="${passwordAutocomplete}"`, 'i'))
      assert.doesNotMatch(markup, /type="email"/)
    }
  } finally {
    await vite.close()
  }
})
