// 和訳ONの一文ごとの交互表示（依頼台帳 requests/2026-10-28-reading-interleaved-translation.json の interleaved-every-sentence）。
// 375px の Chromium で、基礎長文50本の全611文と、長文読解42本（通常38本・語彙強化4本の全節）の全文を和訳ONで開き、
// どの文も英文のすぐ下にその文の和訳が出て、段落ごとにまとめた和訳が出ないこと、英文を押すと一文の構文解説が開くこと、
// 和訳OFFでは英文だけになることを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { BASIC_READING_PASSAGES } from '../src/data/basic-reading/index.js'
import { ALL_PASSAGES } from '../src/data/passages.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 375
const HEIGHT = 740

let vite
let browser
let page
let base
const overflow = []

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))

async function boot() {
  await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  await page.evaluate(async () => {
    if (window.__interleaveTest) return
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    const { buildLearningContentProgress } = await import(moduleUrl('/src/lib/learningContentProgress.js') ?? '/src/lib/learningContentProgress.js')
    window.__interleaveTest = { store: useStore, progress: buildLearningContentProgress }
  })
}

const current = () => page.evaluate(() => {
  const state = window.__interleaveTest.store.getState()
  return { screen: state.screen, params: JSON.parse(JSON.stringify(state.params ?? {})) }
})

async function waitScreen(screen) {
  await page.waitForFunction((name) => {
    const main = document.querySelector('.study-app-content')
    return window.__interleaveTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__interleaveTest.store.getState()
    state.closeSpeechSettings()
    state.navigate(name, screenParams)
  }, [screen, params])
  await waitScreen(screen)
}

// 375px の幅で横にはみ出す要素（横に送る欄の中は除く）。
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

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-interleave-test',
    // 画面の依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  // 外への通信（Firebase・フォント）は止める。開発版の Firebase は本番のデータベースにつながっている。
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  page = await context.newPage()
  await boot()
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

// 画面に並ぶ「英文と和訳の組」を、上から順に読む。
const pairs = () => page.evaluate(() => [...document.querySelectorAll('[data-sentence-translation-pair]')].map((pair) => ({
  en: pair.querySelector('[data-reading-sentence-tap]')?.innerText.replace(/\s+/g, ' ').trim() ?? pair.innerText,
  ja: pair.querySelector('[data-sentence-translation]')?.innerText.replace(/\s+/g, ' ').trim() ?? '',
})))
const norm = (text) => String(text).replace(/\s+/g, ' ').trim()

test('基礎長文50本の全611文：和訳ONで英文と和訳が一文ごとに交互に並び、英文を押すと一文の構文解説が開く', async () => {
  let checked = 0
  for (const passage of BASIC_READING_PASSAGES) {
    await open('basicReadingLesson', { passageId: passage.id, showJa: true })
    const shown = await pairs()
    assert.equal(shown.length, passage.sentences.length, passage.id)
    passage.sentences.forEach((sentence, index) => {
      assert.ok(shown[index].en.includes(norm(sentence.en)), `${passage.id}#${index + 1}: 英文`)
      assert.equal(shown[index].ja, norm(sentence.ja), `${passage.id}#${index + 1}: 和訳`)
      checked += 1
    })
    await checkWidth(`${passage.id}の和訳ON`)
  }
  assert.equal(checked, 611)
  await page.click('[data-basic-reading-sentence="2"]')
  await page.waitForSelector('[data-reading-role-card="direct-labels"]')
  await open('basicReadingLesson', { passageId: BASIC_READING_PASSAGES[0].id, showJa: false })
  assert.equal((await pairs()).length, 0, '和訳OFFでは英文だけ')
})

test('長文読解42本の全文：和訳ONで英文と和訳が一文ごとに交互に並び（語彙強化長文は全節）、段落ごとにまとめた和訳は出ない', async () => {
  assert.equal(ALL_PASSAGES.length, 42)
  let checked = 0
  for (const passage of ALL_PASSAGES) {
    if (passage.extended) {
      for (const [sectionIndex, section] of passage.sections.entries()) {
        await page.evaluate(([id, index]) => sessionStorage.setItem(`study-app:extended-reading-section:v1:${id}`, String(index)), [passage.id, sectionIndex])
        await open('home')
        await open('reader', { passageId: passage.id, showJa: true })
        const shown = await pairs()
        assert.equal(shown.length, section.sentences.length, `${passage.id} 節${sectionIndex + 1}`)
        section.sentences.forEach((sentence, index) => {
          assert.ok(norm(shown[index].en).length > 0, `${passage.id} 節${sectionIndex + 1} 第${index + 1}文: 英文`)
          // 語彙強化長文の和訳は、難読語に（よみ）を添える部品で出すので、読みを除いて比べる。
          assert.equal(shown[index].ja.replace(/（[ぁ-んー]+）/gu, ''), norm(sentence.ja), `${passage.id} 節${sectionIndex + 1} 第${index + 1}文: 和訳`)
          checked += 1
        })
        await checkWidth(`${passage.id} 節${sectionIndex + 1}の和訳ON`)
      }
      continue
    }
    await open('reader', { passageId: passage.id, showJa: true })
    const shown = await pairs()
    assert.equal(shown.length, passage.sentences.length, passage.id)
    passage.sentences.forEach((sentence, index) => {
      assert.ok(shown[index].en.includes(norm(sentence.en)), `${passage.id}#${index + 1}: 英文`)
      assert.equal(shown[index].ja, norm(sentence.ja), `${passage.id}#${index + 1}: 和訳`)
      checked += 1
    })
    await checkWidth(`${passage.id}の和訳ON`)
  }
  const total = ALL_PASSAGES.reduce((sum, passage) => sum + (passage.extended
    ? passage.sections.reduce((count, section) => count + section.sentences.length, 0)
    : passage.sentences.length), 0)
  assert.equal(checked, total)
  // 通常の長文は、交互に並べた英文を押すと一文の構文解説が開く。和訳OFFでは英文だけ。
  await open('reader', { passageId: ALL_PASSAGES[0].id, showJa: true })
  await page.locator('[data-sentence-translation-pair] [data-reading-sentence-tap]').first().click()
  await page.waitForSelector('[data-reading-role-card="direct-labels"]')
  await open('reader', { passageId: ALL_PASSAGES[0].id, showJa: false })
  assert.equal((await pairs()).length, 0, '和訳OFFでは英文だけ')
})

test('開いたどの画面も、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(overflow, [])
})
