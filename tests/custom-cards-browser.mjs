// 自作カードの画面テストが共通で使う、開発サーバーと 375px のブラウザ。
// tests/custom-cards-english.test.mjs・custom-cards-subjects.test.mjs・custom-cards-screens.test.mjs から使う（これ自体はテストではない）。
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
export const WIDTH = 375
export const HEIGHT = 740

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

/**
 * 開発サーバーとブラウザを立て、アプリのストアを window.__customTest.store に置いたページを返す。
 * cacheDir はテストごとに分ける（動いている開発サーバーの依存の置き場を書き換えない）。
 */
export async function startCustomCardBrowser({ cacheDir }) {
  const port = await freePort()
  const vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    cacheDir,
    // 画面の依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  const base = `http://127.0.0.1:${port}/`
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  // 外への通信（Firebase・フォント）は止める。開発版の Firebase は本番のデータベースにつながっている。
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  const page = await context.newPage()
  const overflow = []

  const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))

  async function boot() {
    await page.goto(base)
    await page.waitForSelector('.study-app-content', { timeout: 60_000 })
    await page.evaluate(async () => {
      if (window.__customTest) return
      const moduleUrl = (path) => performance.getEntriesByType('resource')
        .map((entry) => entry.name)
        .find((name) => new URL(name).pathname === path)
      const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
      // 正解で自動で次へ進むと答え合わせの中身を読めないので、確かめる間は止める。
      useStore.getState().setContentSetting(null, 'autoAdvanceCorrect', false)
      window.__customTest = { store: useStore }
    })
  }

  const current = () => page.evaluate(() => {
    const state = window.__customTest.store.getState()
    return { screen: state.screen, params: JSON.parse(JSON.stringify(state.params ?? {})) }
  })

  async function waitScreen(screen) {
    await page.waitForFunction((name) => {
      const main = document.querySelector('.study-app-content')
      return window.__customTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
    }, screen, { timeout: 30_000 })
    await settle()
  }

  async function open(screen, params = {}) {
    await page.evaluate(([name, screenParams]) => {
      const state = window.__customTest.store.getState()
      state.closeSpeechSettings()
      state.navigate(name, screenParams)
    }, [screen, params])
    await waitScreen(screen)
  }

  /** ストアの操作を1つ呼ぶ（テストの準備に使う）。戻り値は JSON にできる形で返す。 */
  const act = (name, ...args) => page.evaluate(([action, values]) => (
    JSON.parse(JSON.stringify(window.__customTest.store.getState()[action](...values) ?? null))
  ), [name, args])

  const state = (keys) => page.evaluate((names) => {
    const current = window.__customTest.store.getState()
    return JSON.parse(JSON.stringify(Object.fromEntries(names.map((name) => [name, current[name]]))))
  }, keys)

  const mainText = () => page.evaluate(() => document.querySelector('.study-app-content').innerText)
  const topBarLabel = () => page.evaluate(() => document.querySelector('[data-global-home-button]')?.innerText.trim() ?? '')

  // 375px の幅で横にはみ出す要素（横に送る欄の中は除く）。見つけたら overflow にためて、最後にまとめて確かめる。
  async function checkWidth(where) {
    const problems = await page.evaluate((label) => {
      const width = window.innerWidth
      const found = []
      if (document.documentElement.scrollWidth > width + 1) found.push(`${label}: ページが横に${document.documentElement.scrollWidth - width}px はみ出す`)
      const main = document.querySelector('.study-app-content')
      const inScroller = (element) => {
        for (let node = element.parentElement; node && node !== main; node = node.parentElement) {
          if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(node).overflowX)) return true
        }
        return false
      }
      for (const element of main.querySelectorAll('*')) {
        const rect = element.getBoundingClientRect()
        if (!rect.width || !rect.height) continue
        if ((rect.right > width + 1 || rect.left < -1) && !inScroller(element)) {
          found.push(`${label}: <${element.tagName.toLowerCase()}>「${(element.textContent ?? '').trim().slice(0, 16)}」が横にはみ出す（${Math.round(rect.left)}〜${Math.round(rect.right)}px）`)
          if (found.length >= 3) break
        }
      }
      return found
    }, where)
    overflow.push(...problems)
  }

  async function close() {
    await browser?.close()
    await vite?.close()
  }

  await boot()
  return { page, base, boot, open, waitScreen, current, act, state, mainText, topBarLabel, checkWidth, overflow, settle, close }
}

/** 登録欄の中身（lib/customEntryForm.js の emptyEntryValues と同じ形）。 */
export function entryValues(patch = {}) {
  return {
    front: '',
    back: '',
    reading: '',
    kanji: '',
    pos: '',
    posId: '名',
    example: '',
    exampleTranslation: '',
    note: '',
    level: '5',
    field: '基本・日常',
    phonetic: '',
    otherSenses: [],
    derivatives: [],
    synonyms: [],
    antonyms: [],
    confusables: [],
    phrases: [],
    etymology: '',
    ...patch,
  }
}
