import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { isChunkLoadError, importWithRetry } from '../src/lib/appRecovery.js'

// 画面が真っ白になる主因は、古い index.html が消えた JS を読みに行く失敗。
// ブラウザごとの文言をひととおり拾えていること。
test('画面チャンクの読み込み失敗をブラウザ横断で見分ける', () => {
  const chunkErrors = [
    new Error('Failed to fetch dynamically imported module: https://example.com/assets/Home-abc.js'),
    new Error('error loading dynamically imported module'),
    new TypeError('Importing a module script failed.'),
    new Error('Unable to preload CSS for /assets/index-abc.css'),
    new Error(
      'Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html".',
    ),
  ]
  for (const error of chunkErrors) assert.equal(isChunkLoadError(error), true, error.message)

  assert.equal(isChunkLoadError(new Error('words is not iterable')), false)
  assert.equal(isChunkLoadError(undefined), false)
})

test('一時的な読み込み失敗は1回だけ再試行して復帰する', async () => {
  let calls = 0
  const module = await importWithRetry(() => {
    calls += 1
    return calls === 1
      ? Promise.reject(new Error('Failed to fetch dynamically imported module: x.js'))
      : Promise.resolve({ ok: true })
  })
  assert.equal(calls, 2)
  assert.deepEqual(module, { ok: true })
})

test('チャンク以外の失敗は再試行せずそのまま投げる', async () => {
  let calls = 0
  await assert.rejects(
    importWithRetry(() => {
      calls += 1
      return Promise.reject(new Error('本物のバグ'))
    }),
    /本物のバグ/,
  )
  assert.equal(calls, 1)
})

// 境界が外れると1画面のエラーでアプリ全体が真っ白に戻ってしまう。
test('画面描画はエラー境界に包まれている', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(app, /<ErrorBoundary[\s\S]*<Suspense[\s\S]*<Screen \/>/)
  assert.match(app, /resetKey=\{destination\.screen\}/)

  const main = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8')
  assert.match(main, /<ErrorBoundary>[\s\S]*<App \/>/)
})
