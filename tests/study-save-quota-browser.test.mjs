// 暗記の途中で次の単語へ進まなくなった不具合（requests/2026-10-07-study-save-quota.json）を、ブラウザ（Chromium）で確かめる。
// 2026-10-07 利用者:
//   英単語を1回のカード数を100で10問中10問未習からの出題で英検準1級を暗記していたところ、途中から自動で次の単語に
//   進まなくなる不具合が発生したので、原因を究明して、同様の不具合が発生しないようにしなさい。
//
// ・capacity-all-content：全教材20,492項目を暗記とテストで学んだ最大の記録（localStorage の上限を超える）を保存し、読み直しても同じ。
// ・migrate-local-storage：前の版が localStorage に残した記録を、読み直したときにそのまま引き継ぐ（前の版の読み戻しと全欄が一致）。
// ・user-scenario：localStorage がいっぱいの端末で、準1級・100枚・未修だけの暗記を100枚とも進め、記録が読み直しても残る。
// ・save-failure-notice：保存できない端末（IndexedDB なし・localStorage いっぱい）で知らせが出て、カードは進み、空いたら消える。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'

import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import { buildFullLearningState } from './study-save-quota-state.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const KEY = 'eigo-quest'
let vite
let browser
let base

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    cacheDir: 'node_modules/.vite-save-quota-test',
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

// 新しい端末（保存が空のブラウザ）を1つ開く。init は読み込みの前に毎回流す台本。
async function openPhone(init = null) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  // 外への通信（Firebase・フォント）は止める。開発版の Firebase は本番のデータベースにつながっている。
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  if (init) await context.addInitScript(init.script, init.arg)
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(String(error)))
  await load(page)
  return { context, page, errors }
}

async function load(page, reload = false) {
  if (reload) await page.reload()
  else await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  await page.evaluate(async () => {
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path) ?? path
    window.__store = (await import(moduleUrl('/src/store/useStore.js'))).useStore
    window.__progress = await import(moduleUrl('/src/lib/progressCode.js'))
    window.__readIdb = () => new Promise((resolve, reject) => {
      const request = indexedDB.open('eigo-quest-store')
      request.onsuccess = () => {
        const db = request.result
        const get = db.transaction('kv').objectStore('kv').get('eigo-quest')
        get.onsuccess = () => {
          db.close()
          resolve(get.result ?? null)
        }
        get.onerror = () => reject(get.error)
      }
      request.onerror = () => reject(request.error)
    })
  })
}

// 保存の書き込みが落ち着くまで待つ（IndexedDB の記録が止まって同じになるまで）。
async function waitSaved(page, predicate = 'true') {
  await page.waitForFunction(`(async () => {
    const raw = await window.__readIdb()
    if (!raw) return false
    const state = JSON.parse(raw).state
    return ${predicate}
  })()`, null, { timeout: 120_000, polling: 200 })
}

const persistedFields = (page) => page.evaluate(() => (
  JSON.stringify(window.__progress.selectProgressState(window.__store.getState()))
))

// localStorage を残りがなくなるまで埋める（容量がいっぱいの端末）。埋めた文字数を返す。
const FILL_LOCAL_STORAGE = () => {
  let chunk = 'x'.repeat(1 << 20)
  let index = 0
  while (chunk.length >= 1) {
    try {
      localStorage.setItem(`filler${index}`, chunk)
      index += 1
    } catch {
      chunk = chunk.slice(0, Math.floor(chunk.length / 2))
    }
  }
  let used = 0
  for (let at = 0; at < localStorage.length; at += 1) {
    const key = localStorage.key(at)
    used += key.length + localStorage.getItem(key).length
  }
  return used
}

test('全教材20,492項目を暗記とテストで学んだ最大の記録（localStorage の上限を超える）を保存し、読み直しても同じ記録が戻る', async () => {
  const { state, itemCount, counts } = buildFullLearningState()
  assert.equal(LEARNING_CONTENTS.length, 24)
  assert.equal(itemCount, 20492)
  const text = JSON.stringify({ state, version: 11 })

  const { context, page, errors } = await openPhone()
  try {
    // この端末の localStorage の上限（Chromium は 5,242,880 文字）より大きいこと。前の作りでは保存できなかった大きさ。
    const blank = await browser.newContext()
    const probe = await blank.newPage()
    await probe.route('**/*', (route) => route.fulfill({ body: '<html></html>', contentType: 'text/html' }))
    await probe.goto(base)
    const localLimit = await probe.evaluate(FILL_LOCAL_STORAGE)
    await blank.close()
    assert.ok(text.length > localLimit, `最大の記録 ${text.length} 文字が localStorage の上限 ${localLimit} 文字に収まってしまう`)

    await page.evaluate((json) => window.__store.setState(JSON.parse(json).state), text)
    await waitSaved(page, `Object.keys(state.srs).length >= ${counts.vocab}`)
    const stored = JSON.parse(await page.evaluate(() => window.__readIdb()))
    for (const field of PERSISTED_PROGRESS_FIELDS) {
      assert.equal(JSON.stringify(stored.state[field]), JSON.stringify(state[field]), `保存した ${field} が書いた記録と違う`)
    }

    await load(page, true)
    const reloaded = JSON.parse(await persistedFields(page))
    for (const field of PERSISTED_PROGRESS_FIELDS) {
      assert.equal(JSON.stringify(reloaded[field]), JSON.stringify(state[field]), `読み直した ${field} が書いた記録と違う`)
    }
    // 暗記・テストで記録する教材は、全項目の記録が戻っている。
    for (const content of LEARNING_CONTENTS.filter((item) => item.kind === 'srs')) {
      const missing = content.items.filter((item) => !reloaded[content.store]?.[item.id])
      assert.deepEqual(missing.map((item) => item.id), [], `${content.label} の記録が戻らない`)
    }
    assert.equal(await page.locator('[data-save-failure-notice]').count(), 0)
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})

test('前の版が localStorage に残した記録を、前の版の読み戻しと全欄同じに引き継ぎ、IndexedDB へ写して localStorage から消す。読み戻すまで画面を出さない', async () => {
  // 前の版の記録：全教材の記録を、localStorage に入る大きさ（欄ごとに先頭400件）にしたもの。
  const { state } = buildFullLearningState()
  const legacyState = Object.fromEntries(Object.entries(state).map(([field, value]) => [
    field,
    value && typeof value === 'object' && !Array.isArray(value) && field.endsWith('Srs') || field === 'srs'
      ? Object.fromEntries(Object.entries(value).slice(0, 400))
      : value,
  ]))
  const legacy = JSON.stringify({ state: legacyState, version: 11 })
  assert.ok(legacy.length < 2_000_000)

  // 前の版と同じ読み戻し（IndexedDB の無いブラウザは、前の版と同じく localStorage から読む）。
  const old = await openPhone({
    script: (arg) => {
      Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true })
      localStorage.setItem(arg.key, arg.value)
    },
    arg: { key: KEY, value: legacy },
  })
  const expected = JSON.parse(await persistedFields(old.page))
  await old.context.close()

  // 新しい版：最初の読み込みだけ、前の版の記録を localStorage に置き、IndexedDB を開くのを1.5秒遅らせる。
  // そのあいだは画面を出さず、localStorage の記録も書き換えないことを確かめる。
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  await context.addInitScript(({ key, value }) => {
    if (sessionStorage.getItem('first-load-done')) return
    sessionStorage.setItem('first-load-done', '1')
    localStorage.setItem(key, value)
    const open = IDBFactory.prototype.open
    IDBFactory.prototype.open = function slowOpen(...args) {
      const request = open.apply(this, args)
      const wrapper = {}
      Object.defineProperty(wrapper, 'result', { get: () => request.result })
      Object.defineProperty(wrapper, 'error', { get: () => request.error })
      request.onupgradeneeded = (event) => wrapper.onupgradeneeded?.(event)
      request.onsuccess = (event) => setTimeout(() => wrapper.onsuccess?.(event), 1500)
      request.onerror = (event) => wrapper.onerror?.(event)
      request.onblocked = (event) => wrapper.onblocked?.(event)
      return wrapper
    }
  }, { key: KEY, value: legacy })
  const page = await context.newPage()
  try {
    await page.goto(base)
    await page.waitForTimeout(700)
    assert.equal(await page.locator('.study-app-content').count(), 0, '読み戻す前に画面を出した')
    assert.equal(await page.evaluate((key) => localStorage.getItem(key)?.length ?? 0, KEY), legacy.length, '読み戻す前に localStorage の記録を書き換えた')
    await load(page)
    const migrated = JSON.parse(await persistedFields(page))
    for (const field of PERSISTED_PROGRESS_FIELDS) {
      assert.equal(JSON.stringify(migrated[field]), JSON.stringify(expected[field]), `引き継いだ ${field} が前の版の読み戻しと違う`)
    }
    assert.equal(PERSISTED_PROGRESS_FIELDS.length, 52)
    assert.equal(await page.evaluate(() => window.__readIdb()), legacy, '引き継いだ記録をそのまま IndexedDB へ写していない')
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), KEY), null, 'localStorage の古い記録が残った')
    // 読み直しても、IndexedDB から同じ記録が戻る。
    await load(page, true)
    assert.equal(await persistedFields(page), JSON.stringify(migrated))
  } finally {
    await context.close()
  }
})

test('利用者の場面：localStorage がいっぱいの端末で、準1級・1回100枚・未修だけの暗記を100枚とも進め、記録は読み直しても残る', async () => {
  const { context, page, errors } = await openPhone()
  try {
    const filled = await page.evaluate(FILL_LOCAL_STORAGE)
    assert.ok(filled > 5_000_000)
    await page.evaluate(() => {
      const store = window.__store.getState()
      store.setContentSetting(null, 'sessionSize', 100)
      store.setContentSetting(null, 'vocabMix', 'fresh-only')
      store.navigate('vocabStudy', { source: { type: 'level', levelId: 'pre1' }, title: '英検準1級', mode: 'study', returnTo: { screen: 'vocabLevels' } })
    })
    await page.waitForSelector('[data-vocab-study-actions]')
    const card = () => page.evaluate(() => ({
      head: document.querySelector('.study-app-content h2')?.textContent ?? null,
      status: document.querySelector('[data-question-session-controls] [data-question-session-progress]')?.innerText ?? '',
      screen: window.__store.getState().screen,
    }))
    const seen = []
    for (let count = 0; count < 100; count += 1) {
      const before = await card()
      assert.equal(before.screen, 'vocabStudy', `${count + 1}枚目の前に暗記を抜けた`)
      seen.push(before.head)
      const label = count % 3 === 0 ? 'まだ🤔' : '覚えた👍'
      await page.getByRole('button', { name: label, exact: true }).click()
      await page.waitForFunction((head) => (
        window.__store.getState().screen !== 'vocabStudy'
        || document.querySelector('.study-app-content h2')?.textContent !== head
      ), before.head, { timeout: 5_000 }).catch(() => {})
      const afterCard = await card()
      if (count < 99) assert.notEqual(afterCard.head, before.head, `${count + 1}枚目（${before.head}）で次のカードへ進まなかった`)
    }
    await page.waitForFunction(() => window.__store.getState().screen === 'sessionResult')
    assert.equal(new Set(seen).size, 100)
    assert.equal(await page.locator('[data-save-failure-notice]').count(), 0, '保存できたのに知らせが出た')
    const answered = await page.evaluate(() => Object.keys(window.__store.getState().srs).length)
    assert.equal(answered, 100)
    await waitSaved(page, 'Object.keys(state.srs).length === 100')
    await load(page, true)
    const kept = await page.evaluate(() => Object.keys(window.__store.getState().srs).length)
    assert.equal(kept, 100, '読み直したら記録が消えた')
    assert.equal(await page.evaluate(() => localStorage.getItem('eigo-quest')), null)
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})

test('保存できない端末（IndexedDB なし・localStorage いっぱい）では知らせを出し、カードは進み、空きができて保存できたら知らせが消える', async () => {
  const { context, page, errors } = await openPhone({
    script: () => Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true }),
  })
  try {
    await page.evaluate(FILL_LOCAL_STORAGE)
    await page.evaluate(() => {
      const store = window.__store.getState()
      store.navigate('vocabStudy', { source: { type: 'level', levelId: 'pre1' }, title: '英検準1級', mode: 'study', returnTo: { screen: 'vocabLevels' } })
    })
    await page.waitForSelector('[data-vocab-study-actions]')
    const head = () => page.evaluate(() => document.querySelector('.study-app-content h2')?.textContent)
    const first = await head()
    await page.getByRole('button', { name: '覚えた👍', exact: true }).click()
    await page.waitForSelector('[data-save-failure-notice="quota"]')
    assert.notEqual(await head(), first, '保存できなくてもカードは進む')
    const notice = await page.locator('[data-save-failure-notice]').innerText()
    assert.match(notice, /学習の記録を保存できませんでした/)
    assert.match(notice, /端末の空き容量が足りません/)
    // 375px の画面で、知らせが横にはみ出さない。
    const overflow = await page.evaluate(() => document.querySelector('[data-save-failure-notice]').scrollWidth - document.querySelector('[data-save-failure-notice]').clientWidth)
    assert.ok(overflow <= 0)
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) if (key.startsWith('filler')) localStorage.removeItem(key)
    })
    await page.getByRole('button', { name: 'まだ🤔', exact: true }).click()
    await page.waitForSelector('[data-save-failure-notice]', { state: 'detached' })
    assert.ok(await page.evaluate(() => localStorage.getItem('eigo-quest')?.length > 0))
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})
