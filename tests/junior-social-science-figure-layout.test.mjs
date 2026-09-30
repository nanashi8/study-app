// 社会・理科の図の文字が、ほかの文字と重ならず、図の外にはみ出さないことの確認
// （依頼台帳 requests/2026-09-30-subject-katakana-quality.json の figure-layout）。
// 2026-09-30 利用者「コンテンツの品質を精査しなさい。」
// 375px の幅の Chromium で、全102単元のページの要点の図（図の組の中の図もふくむ）と、図を使う全問の問題の図を描き、
// 図（svg）ごとに、見えている文字（text）どうしの重なりと、文字が svg の枠の外に出ていないかを確かめる。
// 文字のふちどりのために同じ文字を同じ位置に2回かいたもの（下の1つは白い線）は、1つの文字として数える。
// 地図のラベルの上に小さく出す読みがなは、そのラベル自身とは重なりを数えない（ルビとしてすぐ上に付けている）。
// ほかのラベルや、ほかのラベルの読みがなとの重なりは数える。読みがなは、ほかの文字の白いふちどりの幅（1.5px）まで離れていること。
// 比べるのは字の枠（行の高さ）ではなく、字の見える部分。アプリの字体では、字の枠は基準線の上1.04字・下0.34字あり、
// 漢字の見える部分は上0.88字・下0.12字なので、枠の上を12%、下を16%けずって比べる（2026-09-30 に測った）。
// 文字の始まりの全角の「（」の左半分と、終わりの「）」の右半分も空いているので、けずって比べる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { ALL_SUBJECT_QUESTIONS, ALL_SUBJECT_UNITS, SUBJECTS } from '../src/data/subjects/index.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 375
const HEIGHT = 740

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

// root の中の図（いちばん外の svg）ごとに、文字の重なりとはみ出しを並べる。
const inspect = (root, where) => page.evaluate(([selector, label]) => {
  const found = []
  const scope = document.querySelector(selector)
  if (!scope) return [`${label}: 画面が見つからない`]
  const figureName = (svg) => {
    const figure = svg.closest('[data-subject-figure]')
    const caption = figure?.querySelector('figcaption, [data-subject-figure-caption]')?.textContent?.trim()
    return caption || figure?.getAttribute('data-subject-figure') || 'の図'
  }
  for (const svg of scope.querySelectorAll('svg')) {
    if (svg.parentElement.closest('svg')) continue
    const frame = svg.getBoundingClientRect()
    if (frame.width < 40 || frame.height < 40) continue
    const texts = []
    for (const element of svg.querySelectorAll('text')) {
      const text = (element.textContent ?? '').trim()
      if (!text) continue
      const style = getComputedStyle(element)
      if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) continue
      const box = element.getBoundingClientRect()
      if (!box.width || !box.height) continue
      // 全角のかっこは、外側の半字が空いている（「（」は左、「）」は右）。
      const em = box.height / 1.38
      const left = box.left + (/^[（「『【〔]/.test(text) ? em * 0.5 : 0)
      const right = box.right - (/[）」』】〕]$/.test(text) ? em * 0.5 : 0)
      const rect = { left, right, top: box.top + box.height * 0.12, bottom: box.bottom - box.height * 0.16, width: right - left, height: box.height * 0.72 }
      // ふちどり用に同じ文字を同じ位置に重ねたものは1つに数える。
      if (texts.some((other) => other.text === text && Math.abs(other.rect.left - rect.left) < 1.5 && Math.abs(other.rect.top - rect.top) < 1.5)) continue
      texts.push({ text, rect, halo: element.closest('[data-subject-halo]'), ruby: Boolean(element.closest('[data-subject-ruby]')) })
    }
    const name = figureName(svg)
    for (const { text, rect } of texts) {
      const out = Math.max(frame.left - rect.left, rect.right - frame.right, frame.top - rect.top, rect.bottom - frame.bottom)
      if (out > 1.5) found.push(`${label}「${name}」: 「${text.slice(0, 14)}」が図の外に${Math.round(out)}px はみ出す`)
    }
    for (let i = 0; i < texts.length; i += 1) {
      for (let j = i + 1; j < texts.length; j += 1) {
        // ラベルと、そのラベル自身の読みがな。
        if (texts[i].halo && texts[i].halo === texts[j].halo && texts[i].ruby !== texts[j].ruby) continue
        const a = texts[i].rect
        const b = texts[j].rect
        const x = Math.min(a.right, b.right) - Math.max(a.left, b.left)
        const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
        // 読みがなは字が小さく、ほかのラベルの白いふちどり（字の見える部分の外1.5px）に少しかかっただけで欠けて読めなくなる
        // （2026-09-30、牧ノ原の「まきのはら」が焼津港のふちどりで「まぞのはら」に見えた）。読みがなは、ふちどりの幅まで離す。
        if ((texts[i].ruby || texts[j].ruby) && x > -1.5 && y > -1.5) {
          found.push(`${label}「${name}」: 読みがな「${(texts[i].ruby ? texts[i] : texts[j]).text}」が「${(texts[i].ruby ? texts[j] : texts[i]).text.slice(0, 14)}」のふちどりにかかる`)
          continue
        }
        if (x <= 1.5 || y <= 1.5) continue
        const smaller = Math.min(a.width * a.height, b.width * b.height)
        if (x * y < smaller * 0.12) continue
        found.push(`${label}「${name}」: 「${texts[i].text.slice(0, 14)}」と「${texts[j].text.slice(0, 14)}」が重なる（${Math.round(x)}×${Math.round(y)}px）`)
      }
    }
  }
  return found
}, [root, where])

before(async () => {
  const port = await freePort()
  vite = await createServer({ root: ROOT, logLevel: 'error', server: { port, strictPort: true, host: '127.0.0.1' } })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })
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
    figures += await page.evaluate((selector) => [...document.querySelectorAll(`${selector} svg`)].filter((svg) => !svg.parentElement.closest('svg')).length, root)
    problems.push(...await inspect(root, unit.id))
  }
  assert.deepEqual(problems, [])
  // 表・流れ図・年表などは svg ではないので数えない（2026-09-30 に378）。
  assert.ok(figures >= 370, `描いた図（svg）の数（${figures}）`)
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
