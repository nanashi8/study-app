// 社会・理科の図を、押すと画面いっぱいに大きくして見られることの確認
// （依頼台帳 requests/2026-10-01-subject-figure-enrich.json の figure-zoom）。
// 2026-10-01 利用者「中学理科社会の図表を充実させて生徒の理解を助けるように改善しなさい。」
// スマホでは画面を指で拡大できないので、svg で描く図はすべて、図そのものを押しても「大きく見る」を押しても大きくなる
// （src/components/SubjectFigureZoom.jsx）。375px の幅の Chromium で、全102単元のページの要点の図（図の組の中の図も1枚ずつ）と、
// 図を使う全問の問題の図を1枚ずつ開き、次を確かめる。
//   ・画面いっぱいに出る（大きくした図の枠が、見えている範囲を覆う）
//   ・大きくした図の文字が16px以上、読みがなが8px以上
//   ・図が画面より広く、縦横に動かして見られる
//   ・閉じると大きくした図が消え、元の画面のスクロールの位置が開く前と同じ
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
let base
let browser
let page

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
    if (window.__zoomTest) return
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    useStore.getState().setContentSetting(null, 'autoAdvanceCorrect', false)
    window.__zoomTest = { store: useStore }
  })
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__zoomTest.store.getState()
    state.closeSpeechSettings()
    state.navigate(name, screenParams)
  }, [screen, params])
  await page.waitForFunction((name) => {
    const main = document.querySelector('.study-app-content')
    return window.__zoomTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

// root の中の図（いちばん外の svg）を1枚ずつ、図を押して開く・「大きく見る」で開くの両方で開いて確かめる。
const zoomAll = (root, where) => page.evaluate(async ([selector, label]) => {
  const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  const scrollerOf = (node) => {
    let el = node.parentElement
    while (el && !(el.scrollHeight > el.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowY))) el = el.parentElement
    return el
  }
  const measure = (layer) => {
    let text = Infinity
    let ruby = Infinity
    for (const node of layer.querySelectorAll('svg text')) {
      if (!node.textContent.trim()) continue
      const ctm = node.getScreenCTM()
      const px = parseFloat(getComputedStyle(node).fontSize) * (ctm ? Math.hypot(ctm.a, ctm.b) : 1)
      if (node.closest('[data-subject-ruby]')) ruby = Math.min(ruby, px)
      else text = Math.min(text, px)
    }
    return { text, ruby }
  }
  const container = document.querySelector(selector)
  // 図（図の枠の中のいちばん外の svg）。「大きく見る」の虫めがねのような小さな印（40px未満）は図に数えない。
  const svgs = [...container.querySelectorAll('[data-subject-figure] svg')].filter((svg) => {
    if (svg.parentElement.closest('svg')) return false
    const rect = svg.getBoundingClientRect()
    return rect.width >= 40 && rect.height >= 40
  })
  const problems = []
  // svg で描く図は、どれも押すと大きくなる部品の中にある。
  for (const svg of svgs) {
    if (!svg.closest('[data-subject-figure-zoom-target]')) problems.push(`${label}: 「${svg.getAttribute('aria-label') ?? svg.dataset.subjectDiagram ?? 'svg'}」を押しても大きくならない`)
  }
  const targets = [...container.querySelectorAll('[data-subject-figure-zoom-target]')]
  for (const [index, target] of targets.entries()) {
    const name = `${label} の図${index + 1}（${target.getAttribute('aria-label')}）`
    const button = target.previousElementSibling?.querySelector('[data-subject-figure-zoom-button]')
    if (!button) problems.push(`${name}: 「大きく見る」がない`)
    for (const how of ['図', '大きく見る']) {
      target.scrollIntoView({ block: 'center' })
      await frame()
      const scroller = scrollerOf(target)
      const before = scroller ? scroller.scrollTop : null
      if (how === '図') target.click()
      else button?.click()
      await frame()
      const layer = document.querySelector('[data-subject-figure-zoom-layer]')
      if (!layer) {
        problems.push(`${name}: ${how}を押しても開かない`)
        continue
      }
      const rect = layer.getBoundingClientRect()
      if (rect.width < window.innerWidth - 1 || rect.height < window.innerHeight * 0.9) problems.push(`${name}: 画面いっぱいに出ない（${Math.round(rect.width)}×${Math.round(rect.height)}）`)
      const { text, ruby } = measure(layer)
      if (!(text >= 16 - 0.05)) problems.push(`${name}: 大きくした図の文字が${Math.round(text * 10) / 10}px（16px未満）`)
      if (Number.isFinite(ruby) && !(ruby >= 8 - 0.05)) problems.push(`${name}: 大きくした図の読みがなが${Math.round(ruby * 10) / 10}px（8px未満）`)
      const pan = layer.querySelector('[data-subject-figure-zoom-scroll]')
      if (!(pan && pan.scrollWidth > pan.clientWidth + 1)) problems.push(`${name}: 図が画面より広くなく、横に動かせない`)
      layer.querySelector('[data-subject-figure-zoom-close]').click()
      await frame()
      if (document.querySelector('[data-subject-figure-zoom-layer]')) problems.push(`${name}: 閉じても消えない`)
      const after = scroller ? scroller.scrollTop : null
      if (before !== null && Math.abs(after - before) > 1) problems.push(`${name}: 閉じたあと元の位置に戻らない（${before}→${after}）`)
    }
  }
  return { problems, count: targets.length, svgs: svgs.length }
}, [root, where])

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'error',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-figure-zoom-test',
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
  await boot()
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('全102単元の要点の図（図の組の中の図も1枚ずつ）を、押すと画面いっぱいに大きくして読め、閉じると元の位置に戻る', async () => {
  const problems = []
  let count = 0
  for (const unit of ALL_SUBJECT_UNITS) {
    await open(SUBJECTS[unit.subject].screens.unit, { unitId: unit.id })
    const root = `[data-subject-unit-page="${unit.id}"] [data-subject-unit-points]`
    await page.waitForSelector(root)
    const result = await zoomAll(root, unit.id)
    problems.push(...result.problems)
    count += result.count
  }
  assert.deepEqual(problems, [])
  // 2026-10-01 に数えた、要点の svg の図の数（表・流れ図・年表は svg ではないので数えない）。
  assert.ok(count >= 560, `大きくして確かめた要点の図の数（${count}）`)
})

test('図を使う全問の問題の図を、押すと画面いっぱいに大きくして読め、閉じると元の位置に戻る', async () => {
  const questions = ALL_SUBJECT_QUESTIONS.filter((question) => question.figure)
  const problems = []
  let count = 0
  for (const question of questions) {
    await open('portal')
    await open(SUBJECTS[question.subject].screens.practice, { ids: [question.id], preserveOrder: true, title: '図の確認' })
    const root = `[data-subject-practice-question="${question.id}"]`
    await page.waitForSelector(root)
    const result = await zoomAll(root, question.id)
    problems.push(...result.problems)
    count += result.count
  }
  assert.deepEqual(problems, [])
  // 図を使う47問のうち、表だけの問題をのぞいた svg の図の数（2026-10-01 に数えた）。
  assert.ok(count >= 30, `大きくして確かめた問題の図の数（${count}）`)
})
