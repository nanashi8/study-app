// 基礎長文で上の帯（戻る・アプリ名・メニュー）が画面の外へ押し出されないことの確認
// （依頼台帳 requests/2026-10-28-basic-reading-top-bar.json の top-bar-stays-on-every-screen）。
// 問題の sr-only の見出しが外枠を基準に置かれ、外枠がはみ出していたため、「ルールの問題へ」や文のタップの
// スクロールで外枠ごと動き、上の帯が見えなくなっていた。長文と同じく、外枠は動かずスクロールは本文の欄だけになることを、
// 375px の幅の Chromium で基礎長文の全画面・全操作のあとに確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import {
  BASIC_READING_LEVEL_IDS,
  BASIC_READING_PASSAGES,
  basicReadingQuestionId,
} from '../src/data/basic-reading/index.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 375
const HEIGHT = 740

let vite
let browser
let page
let base
const problems = []
let checks = 0

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
    return window.__topBarTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__topBarTest.store.getState()
    state.closeSpeechSettings()
    state.navigate(name, screenParams)
  }, [screen, params])
  await waitScreen(screen)
}

// なめらかなスクロールが止まるまで待つ。
async function scrollsSettled() {
  await page.evaluate(() => new Promise((resolve) => {
    const read = () => [...document.querySelectorAll('.study-app-surface, .study-app-content, [data-return-scroll]')]
      .map((element) => element.scrollTop).join(',')
    let last = read()
    let still = 0
    const tick = () => {
      const now = read()
      still = now === last ? still + 1 : 0
      last = now
      if (still >= 6) resolve()
      else requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }))
}

// 外枠が動かず伸びず、上の帯の3つのボタンと長文の見出しが画面の上にあること。
async function checkBar(where, { lessonHeader = false } = {}) {
  await scrollsSettled()
  const found = await page.evaluate(([label, header]) => {
    const out = []
    const surface = document.querySelector('.study-app-surface')
    if (surface.scrollTop !== 0) out.push(`${label}: 外枠が${surface.scrollTop}px 動いた`)
    if (surface.scrollHeight > surface.clientHeight + 1) out.push(`${label}: 外枠が${surface.scrollHeight - surface.clientHeight}px はみ出す`)
    if (document.scrollingElement.scrollTop !== 0) out.push(`${label}: ページが動いた`)
    const inView = (element) => {
      if (!element) return false
      const rect = element.getBoundingClientRect()
      return rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight
    }
    for (const [name, selector] of [['戻る', '[data-global-back-button]'], ['アプリ名', '[data-global-home-button]'], ['メニュー', '[data-global-menu-button]']]) {
      if (!inView(document.querySelector(selector))) out.push(`${label}: 上の帯の「${name}」が見えない`)
    }
    if (header && !inView(document.querySelector('[data-basic-reading-lesson] > header button[aria-label="閉じる"]'))) {
      out.push(`${label}: 長文の見出しの「閉じる」が見えない`)
    }
    return out
  }, [where, lessonHeader])
  checks += 1
  problems.push(...found)
}

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-basic-reading-top-bar-test',
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
  await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  await page.evaluate(async () => {
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    window.__topBarTest = { store: useStore }
  })
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('級の一覧と級ごとの長文の一覧で、一番下までスクロールしても上の帯が見える', async () => {
  await open('basicReading')
  await checkBar('級の一覧')
  await page.locator('[data-basic-reading-level]').last().scrollIntoViewIfNeeded()
  await checkBar('級の一覧の一番下')
  for (const level of BASIC_READING_LEVEL_IDS) {
    await open('basicReading')
    await page.click(`[data-basic-reading-level="${level}"]`)
    await waitScreen('basicReading')
    await checkBar(`${level}級の長文の一覧`)
    await page.locator('[data-basic-reading-passage]').last().scrollIntoViewIfNeeded()
    await checkBar(`${level}級の長文の一覧の一番下`)
  }
  assert.deepEqual(problems, [])
})

test('全50本で、スクロール・ルールの問題へ・答え合わせ・解き直す・全611文のタップのあとも上の帯が見える', async () => {
  let sentences = 0
  for (const passage of BASIC_READING_PASSAGES) {
    const id = passage.id
    await open('basicReadingLesson', { passageId: id })
    await checkBar(`${id}を開いたとき`, { lessonHeader: true })
    await page.evaluate(() => {
      const scroller = document.querySelector('[data-return-scroll="basicReadingLesson"]')
      scroller.scrollTop = scroller.scrollHeight
    })
    await checkBar(`${id}の一番下`, { lessonHeader: true })
    await page.evaluate(() => { document.querySelector('[data-return-scroll="basicReadingLesson"]').scrollTop = 0 })

    // 答える前の「ルールの問題へ」は問題の欄へスクロールする。
    await page.click('[data-basic-reading-check]')
    await checkBar(`${id}のルールの問題へ`, { lessonHeader: true })

    for (const lesson of passage.lessons) {
      const box = page.locator(`[data-basic-reading-question="${basicReadingQuestionId(passage, lesson)}"]`)
      await box.getByRole('button', { name: lesson.choices[lesson.answer][0], exact: true }).click()
    }
    await checkBar(`${id}の問題に答えたあと`, { lessonHeader: true })
    await page.click('[data-basic-reading-check]')
    await page.waitForSelector('[data-basic-reading-score]')
    await checkBar(`${id}の答え合わせ`, { lessonHeader: true })
    await page.getByRole('button', { name: '解き直す' }).click()
    await checkBar(`${id}の解き直す`, { lessonHeader: true })

    // 文は1つずつ押して開き（押す前に文が見える位置までスクロールする）、閉じてから次の文を押す。
    for (const index of passage.sentences.keys()) {
      await page.click(`[data-basic-reading-sentence="${index + 1}"]`)
      await page.waitForSelector('[data-basic-reading-sentence-navigation]')
      await checkBar(`${id}の第${index + 1}文の解説`)
      await page.keyboard.press('Escape')
      await page.waitForSelector('[data-basic-reading-sentence-navigation]', { state: 'detached' })
      sentences += 1
    }
    await checkBar(`${id}の解説を閉じたあと`, { lessonHeader: true })

    // 解説の中で前後の文へ移っても動かない。
    await page.click('[data-basic-reading-sentence="1"]')
    await page.locator('[data-basic-reading-sentence-navigation] button', { hasText: '次の文' }).click()
    await checkBar(`${id}の解説で次の文へ`)
    await page.keyboard.press('Escape')
    await page.waitForSelector('[data-basic-reading-sentence-navigation]', { state: 'detached' })
  }
  assert.equal(sentences, 611)
  assert.deepEqual(problems.slice(0, 20), [])
  assert.ok(checks >= 50 * 7 + 611)
})
