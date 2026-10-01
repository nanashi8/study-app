// 社会・理科の図の文字が、ほかの文字と重ならず、図の外にはみ出さず、読める大きさであることの確認
// （依頼台帳 requests/2026-09-30-subject-katakana-quality.json の figure-layout と、
//  requests/2026-10-01-subject-figure-enrich.json の layout-375）。
// 2026-09-30 利用者「コンテンツの品質を精査しなさい。」／2026-10-01「中学理科社会の図表を充実させて生徒の理解を助けるように改善しなさい。」
// 375px の幅の Chromium で、全102単元のページの要点の図（図の組の中の図もふくむ）と、図を使う全問の問題の図を描き、
// 図（svg）ごとに、文字どうしの重なり・読みがなとふちどりのかかり・地名と点の印のかかり・図の外へのはみ出し・
// 文字の大きさ（8px以上）を確かめる。判定の中身は tests/subject-figure-inspect.mjs。
// あわせて、描いた図の文字（svg と、図の中の文）に読みがなが付くことを確かめる。図の部品（src/components の
// Subject…Diagrams.jsx など）は、図の文字を Halo で描き、src/data/subjects/readings.js の辞書で読みがなを付ける。
// 学習者の日本語の台帳（docs/audits/learner-japanese-review.json）は、この確かめを頼りに図の部品を rubyMaterials に置く。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { ALL_SUBJECT_QUESTIONS, ALL_SUBJECT_UNITS, SUBJECTS } from '../src/data/subjects/index.js'
import { tokenizeSubjectText } from '../src/lib/subjectText.js'
import { inspectSubjectFigures } from './subject-figure-inspect.mjs'

const require = createRequire(import.meta.url)
const { kanji: JOYO_KANJI } = require('joyo-kanji')
const JOYO = new Set(JOYO_KANJI)
// 常用漢字表にない字を、読みを添えずに残すと決めた語（地図記号の卍、仮名のもとになった漢字など。理由は台帳に書く）。
const JOYO_EXCEPTIONS = JSON.parse(readFileSync(new URL('../docs/audits/learner-japanese-review.json', import.meta.url), 'utf8')).joyoExceptions ?? {}

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 375
const HEIGHT = 740
// 図の中の文字の大きさの下限（375pxの幅の画面のpx）。2026-10-01 に決めた（依頼台帳 layout-375）。
const MIN_TEXT_PX = 8

let vite
let browser
let page
let base

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))

async function waitScreen(screen) {
  await page.waitForFunction((name) => {
    const main = document.querySelector('.study-app-content')
    return window.__figureTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__figureTest.store.getState()
    state.closeSpeechSettings()
    state.navigate(name, screenParams)
  }, [screen, params])
  await waitScreen(screen)
}

// root の中の図（いちばん外の svg）ごとに、文字の重なり・はみ出し・印へのかかり・文字の大きさを並べる（tests/subject-figure-inspect.mjs）。
const inspect = (root, where) => page.evaluate(inspectSubjectFigures, [root, where, MIN_TEXT_PX])

// root の中の図（図の枠の中）の、見えている文字と、その文字に付いた読みがな。
//   svg … 文字ごとに、同じ Halo の中の読みがな（data-subject-ruby）を集める。
//   文 … 図の中の表・凡例などの文。<ruby> の中の文字は、読みがなが付いている。
const figureTexts = (root) => page.evaluate((selector) => {
  const rows = []
  for (const figure of document.querySelectorAll(`${selector} [data-subject-figure]`)) {
    for (const node of figure.querySelectorAll('svg text')) {
      if (node.getAttribute('fill') === 'none' || node.closest('[data-subject-ruby]')) continue
      const text = node.textContent.trim()
      if (!text) continue
      const halo = node.closest('[data-subject-halo]')
      const rubies = halo ? [...halo.querySelectorAll('[data-subject-ruby] text')].filter((ruby) => ruby.getAttribute('fill') !== 'none').map((ruby) => ruby.textContent) : []
      rows.push({ name: node.closest('svg[aria-label]')?.getAttribute('aria-label') ?? '図', text, rubies })
    }
    const walker = document.createTreeWalker(figure, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement
      if (!parent || parent.closest('svg, rt, rp, ruby')) continue
      const text = node.textContent.trim()
      if (text) rows.push({ name: '図の中の文', text, rubies: null })
    }
  }
  return rows
}, root)

// 描いた図の文字の読みがなの抜け。辞書の語には読みがなが付き、常用漢字表にない字をふくむ語は、
// 読みがな・文の中の（よみ）・理由つきの例外のどれかがある。
const KANJI_RUN = /[\p{Script=Han}々〆ヶ]+/gu
const readingProblems = (rows, where) => {
  const problems = []
  for (const { name, text, rubies } of rows) {
    const segments = tokenizeSubjectText(text)
    const left = [...(rubies ?? [])]
    for (const segment of segments) {
      if (!segment.reading || JOYO_EXCEPTIONS[segment.text]) continue
      const at = left.indexOf(segment.reading)
      if (at < 0) problems.push(`${where}「${name}」: 「${text}」の「${segment.text}」に読みがな（${segment.reading}）が付いていない`)
      else left.splice(at, 1)
    }
    for (const segment of segments) {
      if (segment.reading) continue
      for (const match of segment.text.matchAll(KANJI_RUN)) {
        if (![...match[0]].some((char) => !'々〆ヶ'.includes(char) && !JOYO.has(char)) || JOYO_EXCEPTIONS[match[0]]) continue
        const after = segment.text.slice(match.index + match[0].length, match.index + match[0].length + 2)
        if (/^[(（][ぁ-ゖー・]/u.test(after)) continue
        problems.push(`${where}「${name}」: 「${text}」の「${match[0]}」は常用漢字表にない字をふくむのに、読みがない`)
      }
    }
  }
  return problems
}

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'error',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-figure-layout-test',
    // 画面の依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, strictPort: true, host: '127.0.0.1', hmr: false, watch: null },
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })
  // 外への通信（Firebase・フォント）は止める。開発版の Firebase は本番のデータベースにつながっている。
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  page = await context.newPage()
  await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  await page.evaluate(async () => {
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    useStore.getState().setContentSetting(null, 'autoAdvanceCorrect', false)
    window.__figureTest = { store: useStore }
  })
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('全102単元の要点の図で、文字が重ならず、図の外にはみ出さない（375px）', async () => {
  const problems = []
  let figures = 0
  for (const unit of ALL_SUBJECT_UNITS) {
    await open(SUBJECTS[unit.subject].screens.unit, { unitId: unit.id })
    const root = `[data-subject-unit-page="${unit.id}"] [data-subject-unit-points]`
    await page.waitForSelector(root)
    // 図（図の枠の中のいちばん外の svg）。「大きく見る」の虫めがねのような小さな印（40px未満）は数えない。
    figures += await page.evaluate((selector) => [...document.querySelectorAll(`${selector} [data-subject-figure] svg`)].filter((svg) => {
      const rect = svg.getBoundingClientRect()
      return !svg.parentElement.closest('svg') && rect.width >= 40 && rect.height >= 40
    }).length, root)
    problems.push(...await inspect(root, unit.id))
  }
  assert.deepEqual(problems, [])
  // 表・流れ図・年表などは svg ではないので数えない（2026-09-30 に378、図表を充実させた 2026-10-01 に581）。
  assert.ok(figures >= 581, `描いた図（svg）の数（${figures}）`)
})

test('図を使う全問の問題の図で、文字が重ならず、図の外にはみ出さない（375px）', async () => {
  const questions = ALL_SUBJECT_QUESTIONS.filter((question) => question.figure)
  assert.ok(questions.length >= 47, '図を使う問題の数')
  const problems = []
  // 演習は1回に10問までなので、教科ごとに10問ずつ開く。答えずに図だけを見て、次の問題へは画面を開き直して進む。
  for (const question of questions) {
    await open('portal')
    await open(SUBJECTS[question.subject].screens.practice, { ids: [question.id], preserveOrder: true, title: '図の確認' })
    const root = `[data-subject-practice-question="${question.id}"]`
    await page.waitForSelector(root)
    problems.push(...await inspect(root, question.id))
  }
  assert.deepEqual(problems, [])
})

test('全102単元の要点の図と、図を使う全問の問題の図で、描いた文字に読みがなが付く（辞書の語・常用漢字表にない字）', async () => {
  const problems = []
  let texts = 0
  for (const unit of ALL_SUBJECT_UNITS) {
    await open(SUBJECTS[unit.subject].screens.unit, { unitId: unit.id })
    const root = `[data-subject-unit-page="${unit.id}"] [data-subject-unit-points]`
    await page.waitForSelector(root)
    const rows = await figureTexts(root)
    texts += rows.length
    problems.push(...readingProblems(rows, unit.id))
  }
  for (const question of ALL_SUBJECT_QUESTIONS.filter((item) => item.figure)) {
    await open('portal')
    await open(SUBJECTS[question.subject].screens.practice, { ids: [question.id], preserveOrder: true, title: '図の確認' })
    const root = `[data-subject-practice-question="${question.id}"]`
    await page.waitForSelector(root)
    const rows = await figureTexts(root)
    texts += rows.length
    problems.push(...readingProblems(rows, question.id))
  }
  assert.deepEqual(problems, [])
  // 2026-10-01 に数えた、図の中の文字（svg の文字と、図の中の文）の数。
  assert.ok(texts >= 32058, `確かめた図の中の文字の数（${texts}）`)
})
