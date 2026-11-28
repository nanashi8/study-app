// 中学の社会・理科の入試の段の全問を、演習の画面で開いて答える確認（依頼台帳 requests/2026-11-28-junior-exam-questions.json の
// exam-screens）。全102単元の入試の段の問題（もとの3問と、実際の公立高校入試の問題をもとに足した問題）を、375px の幅の
// Chromium で10問ずつ開き、正解で答え合わせができて、選ぶ問題は表示した選択肢すべての説明、並べる問題は順の理由、
// 数を入れる問題は解き方が出ること、図を使う問題は図と図の読み取り方が出ること、横にはみ出さないことを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { ALL_SUBJECT_UNITS, SUBJECTS } from '../src/data/subjects/index.js'
import { EXAM_BASED_QUESTIONS_PER_UNIT } from '../src/data/subjects/meta.js'
import { creditDisplays } from './credit-display.mjs'

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
    if (window.__subjectTest) return
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    // 正解で自動で次へ進むと答え合わせの中身を読めないので、確かめる間は止める。
    useStore.getState().setContentSetting(null, 'autoAdvanceCorrect', false)
    window.__subjectTest = { store: useStore }
  })
}

async function waitScreen(screen) {
  await page.waitForFunction((name) => {
    const main = document.querySelector('.study-app-content')
    return window.__subjectTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__subjectTest.store.getState()
    state.closeSpeechSettings()
    state.navigate(name, screenParams)
  }, [screen, params])
  await waitScreen(screen)
}

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

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-subject-test',
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


const JUNIOR_BOOKS = Object.keys(EXAM_BASED_QUESTIONS_PER_UNIT)
const juniorUnits = ALL_SUBJECT_UNITS.filter((unit) => JUNIOR_BOOKS.includes(unit.book))
const examQuestions = juniorUnits.flatMap((unit) => unit.questions.filter((question) => question.level === 'exam'))

// 正解の選択肢（表示の読みがなを除いた文字が答えと同じもの）。
const correctChoice = (answer) => page.locator('[data-subject-choice]').evaluateAll((elements, text) => elements.find((element) => {
  const copy = element.querySelector('.min-w-0')?.cloneNode(true)
  copy?.querySelectorAll('rt, rp').forEach((node) => node.remove())
  return (copy?.textContent ?? '').trim() === text
})?.getAttribute('data-subject-choice'), answer)

test('入試の段の全問（中学の全102単元）：開いて正解で答え合わせができ、説明・順の理由・解き方・図の読み取り方まで出る', async () => {
  // 社会58単元×（3＋17）問、理科44単元×（3＋23）問。
  assert.equal(juniorUnits.length, 102)
  assert.equal(examQuestions.length, 58 * (3 + 17) + 44 * (3 + 23))
  // 演習は1回に10問までなので、単元ごとに10問ずつ開く。
  const decks = juniorUnits.flatMap((unit) => {
    const all = unit.questions.filter((question) => question.level === 'exam')
    return Array.from({ length: Math.ceil(all.length / 10) }, (_, index) => [unit, all.slice(index * 10, index * 10 + 10)])
  })
  assert.equal(decks.reduce((sum, [, list]) => sum + list.length, 0), examQuestions.length)
  const problems = []
  for (const [unit, list] of decks) {
    // 同じ演習の画面を続けて開くと前の結果が残るので、いったんポータルへ戻る。
    await open('portal')
    await open(SUBJECTS[unit.subject].screens.practice, { ids: list.map((question) => question.id), preserveOrder: true, title: '入試の演習' })
    for (const [index, question] of list.entries()) {
      const at = `[data-subject-practice-question="${question.id}"]`
      await page.waitForSelector(at)
      if (question.figure) {
        const height = await page.evaluate((selector) => document.querySelector(`${selector} [data-subject-figure]`)?.getBoundingClientRect().height ?? 0, at)
        if (height < 24) problems.push(`${question.id}: 問題に図が出ない`)
      }
      if (question.kind === 'choice') {
        const choice = await correctChoice(question.answer)
        assert.ok(choice !== undefined, `${question.id}: 正解の選択肢が見つからない`)
        await page.click(`[data-subject-choice="${choice}"]`)
      } else if (question.kind === 'number') {
        for (const key of String(question.answer)) await page.click(`[data-subject-number-key="${key}"]`)
        await page.click('[data-subject-practice-check]')
      } else {
        for (const item of question.items) await page.click(`[data-subject-order-item="${item}"]`)
        await page.click('[data-subject-practice-check]')
      }
      await page.waitForSelector('[data-subject-practice-review]')
      const review = await page.evaluate(() => ({
        label: document.querySelector('[data-subject-practice-result-label]')?.innerText ?? '',
        explanations: document.querySelectorAll('[data-subject-practice-review] [data-choice-explanation]').length,
        choices: document.querySelectorAll('[data-subject-choice]').length,
        steps: document.querySelectorAll('[data-subject-practice-steps] li').length,
        read: document.querySelectorAll('[data-subject-practice-read] li').length,
        text: document.querySelector('[data-subject-practice-review]')?.innerText ?? '',
      }))
      if (!/正解/.test(review.label)) problems.push(`${question.id}: 正解で答え合わせができない（${review.label}）`)
      if (question.kind === 'choice' && review.explanations !== review.choices) problems.push(`${question.id}: 選択肢の説明が ${review.explanations}/${review.choices}`)
      if (question.kind === 'order' && review.explanations !== question.items.length) problems.push(`${question.id}: 順の理由が ${review.explanations}/${question.items.length}`)
      if (question.kind === 'number' && review.steps !== question.steps.length) problems.push(`${question.id}: 解き方が ${review.steps}/${question.steps.length}`)
      if (question.read?.length && review.read !== question.read.length) problems.push(`${question.id}: 図の読み取り方が ${review.read}/${question.read.length}`)
      if (review.text.trim().length < 20) problems.push(`${question.id}: 解説が出ない`)
      await checkWidth(`演習 ${question.id}`)
      const shown = await page.evaluate(() => document.querySelector('.study-app-content').innerText)
      if (creditDisplays(shown).length) problems.push(`${question.id}: 出典の表示がある`)
      await page.getByRole('button', { name: index + 1 >= list.length ? /結果を見る/ : /次の問題へ/ }).last().click()
      await settle()
    }
    await page.waitForSelector('[data-subject-practice-result]')
  }
  assert.deepEqual(problems, [])
})

test('開いた演習の画面は、どれも 375px の幅で横にはみ出さない', () => {
  assert.deepEqual(overflow, [])
})
