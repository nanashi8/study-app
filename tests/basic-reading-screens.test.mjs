// 基礎長文の画面の確認（依頼台帳 requests/2026-10-28-basic-reading.json の screens-and-records）。
// 375px の幅の Chromium で動かし、次を確かめる。
//   入口   … 英語アプリの「コンテンツを選ぶ」で「長文」のすぐ後に「基礎長文」が並び、押すと級の一覧が開く。
//   級     … 5つの級が並び、押すとその級の10本の長文が並ぶ。
//   長文   … 全50本で、本文は全文が並び、和訳を出せる（単語・熟語の暗記・テスト・一覧は読解の準備へ移した。
//            tests/basic-reading-prep.test.mjs が確かめる）。ルールの問題3問は3択＋わからないで答え、
//            答え合わせで当てはめ方の解説・使う文・出した選択肢すべての説明・ルールのカードが出る。
//   記録   … 答え合わせで、問題ごとの結果と読んだ長文が記録され、全教材の進み具合に基礎長文として数えられる。
//   一文   … 全611文で、文を押すと長文と同じ一文の構文解説が開き、前後の文へ移れ、単語を押すと意味が出る（2026-10-28 追加）。
//   幅     … 開いたどの画面も、375px の幅で横にはみ出さない。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import {
  BASIC_READING_LEVEL_IDS,
  BASIC_READING_PASSAGES,
  BASIC_READING_QUIZ_DOMAIN,
  basicReadingPassagesForLevel,
  basicReadingQuestionId,
} from '../src/data/basic-reading/index.js'
import { analyzeBasicReadingSentence } from '../src/lib/basicReadingSentence.js'
import { contentQuizKey } from '../src/lib/contentProgress.js'
import { limitQuizChoices } from '../src/lib/quizChoices.js'

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
    if (window.__basicReadingTest) return
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    const { buildLearningContentProgress } = await import(moduleUrl('/src/lib/learningContentProgress.js') ?? '/src/lib/learningContentProgress.js')
    window.__basicReadingTest = { store: useStore, progress: buildLearningContentProgress }
  })
}

const current = () => page.evaluate(() => {
  const state = window.__basicReadingTest.store.getState()
  return { screen: state.screen, params: JSON.parse(JSON.stringify(state.params ?? {})) }
})

async function waitScreen(screen) {
  await page.waitForFunction((name) => {
    const main = document.querySelector('.study-app-content')
    return window.__basicReadingTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__basicReadingTest.store.getState()
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
    cacheDir: 'node_modules/.vite-basic-reading-test',
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

test('英語アプリの「コンテンツを選ぶ」で、「長文」のすぐ後に「基礎長文」が並び、押すと級の一覧が開く', async () => {
  await open('home')
  const modes = await page.locator('[data-home-mode-group="primary"] [data-home-mode]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-home-mode')))
  const index = modes.indexOf('reading')
  assert.ok(index >= 0)
  assert.equal(modes[index + 1], 'basic-reading')
  await page.click('[data-home-mode="basic-reading"]')
  await waitScreen('basicReading')
  const levels = await page.locator('[data-basic-reading-level]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-basic-reading-level')))
  assert.deepEqual(levels, [...BASIC_READING_LEVEL_IDS])
  await checkWidth('級の一覧')
})

test('級を押すと、その級の10本の長文が並び、押すとその長文の学習が開く', async () => {
  for (const level of BASIC_READING_LEVEL_IDS) {
    await open('basicReading')
    await page.click(`[data-basic-reading-level="${level}"]`)
    await waitScreen('basicReading')
    const ids = await page.locator('[data-basic-reading-passage]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-basic-reading-passage')))
    assert.deepEqual(ids, basicReadingPassagesForLevel(level).map((passage) => passage.id), `${level}級`)
    await checkWidth(`${level}級の長文の一覧`)
    const first = basicReadingPassagesForLevel(level)[0]
    await page.click(`[data-basic-reading-passage="${first.id}"] [data-basic-reading-start="direct"]`)
    await waitScreen('basicReadingLesson')
    assert.equal((await current()).params.passageId, first.id)
  }
})

test('全50本で、本文・ルールの問題の答え合わせがそろい、結果が記録される', async () => {
  await page.evaluate(() => sessionStorage.clear())
  for (const passage of BASIC_READING_PASSAGES) {
    await open('basicReadingLesson', { passageId: passage.id })
    const text = await page.locator('[data-basic-reading-passage-text]').innerText()
    for (const sentence of passage.sentences) assert.ok(text.includes(sentence.en), `${passage.id}: 本文「${sentence.en}」`)

    // 1問目は正解、2問目はまちがい、3問目は「わからない」で答える。
    for (const [index, lesson] of passage.lessons.entries()) {
      const questionId = basicReadingQuestionId(passage, lesson)
      const box = page.locator(`[data-basic-reading-question="${questionId}"]`)
      const shown = limitQuizChoices(lesson.choices, (_, choiceIndex) => choiceIndex === lesson.answer, { seed: questionId })
      const buttons = box.locator('button[aria-pressed]')
      assert.equal(await buttons.count(), shown.length + 1, `${questionId}: 3択＋わからない`)
      if (index === 0) await box.getByRole('button', { name: lesson.choices[lesson.answer][0], exact: true }).click()
      else if (index === 1) await box.getByRole('button', { name: shown.find(([text]) => text !== lesson.choices[lesson.answer][0])[0], exact: true }).click()
      else await box.getByRole('button', { name: 'わからない🙈' }).click()
    }
    await checkWidth(`${passage.id}の学習`)
    await page.click('[data-basic-reading-check]')
    await page.waitForSelector('[data-basic-reading-score]')
    assert.equal(await page.getAttribute('[data-basic-reading-score]', 'data-basic-reading-score'), `1/${passage.lessons.length}`)
    for (const lesson of passage.lessons) {
      const questionId = basicReadingQuestionId(passage, lesson)
      const explanation = page.locator(`[data-basic-reading-explanation="${questionId}"]`)
      assert.ok((await explanation.innerText()).includes(lesson.how), `${questionId}: 当てはめ方`)
      assert.equal(await explanation.locator('[data-choice-explanation]').count(), 3, `${questionId}: 出した選択肢すべての説明`)
      assert.equal(await explanation.locator(`[data-reading-rule-id="${lesson.rule}"]`).count(), 1, `${questionId}: ルールのカード`)
    }
    await checkWidth(`${passage.id}の答え合わせ`)

    const record = await page.evaluate(([domain, keys, id]) => {
      const state = window.__basicReadingTest.store.getState()
      return {
        results: keys.map((key) => state.contentQuizResults[key]?.lastResult ?? null),
        done: state.readingsDone.includes(id),
      }
    }, [BASIC_READING_QUIZ_DOMAIN, passage.lessons.map((lesson) => contentQuizKey(BASIC_READING_QUIZ_DOMAIN, basicReadingQuestionId(passage, lesson))), passage.id])
    assert.deepEqual(record, { results: ['correct', 'wrong', 'wrong'], done: true }, passage.id)
  }

  const progress = await page.evaluate(() => {
    const content = window.__basicReadingTest.progress(window.__basicReadingTest.store.getState()).find((item) => item.id === 'basic-reading')
    return { total: content.progress.total, quizTotal: content.progress.quizTotal, quiz: content.progress.quiz }
  })
  assert.equal(progress.total, 50)
  assert.equal(progress.quizTotal, 150)
  assert.equal(progress.quiz.correct, 50)
  assert.equal(progress.quiz.incorrect, 100)
})

// 依頼 2026-10-28-basic-reading-sentence-detail の条件 tap-opens-sentence-detail。
test('全611文で、文を押すと一文の構文解説（文の要素・語順訳・読解ルール・和訳）が開き、次の文へ移れる', async () => {
  let opened = 0
  for (const passage of BASIC_READING_PASSAGES) {
    await open('basicReadingLesson', { passageId: passage.id })
    await page.click('[data-basic-reading-sentence="1"]')
    for (const [index, sentence] of passage.sentences.entries()) {
      const analysis = analyzeBasicReadingSentence(passage, index)
      await page.waitForFunction(([count, en]) => {
        const card = document.querySelector('[data-reading-role-card="direct-labels"]')
        return card?.getAttribute('data-reading-structure') === 'ledger' &&
          document.querySelectorAll('[data-reading-phrase-status]').length === count &&
          document.body.innerText.includes(en.slice(0, 12))
      }, [analysis.meaningPhraseSequence.length, sentence.en], { timeout: 10_000 })
      const detail = await page.evaluate(() => ({
        rules: document.querySelectorAll('[data-reading-rules-for-sentence] [data-reading-rule-id]').length,
        pattern: Boolean(document.querySelector('[data-reading-sentence-pattern]')),
        fragment: Boolean(document.querySelector('[data-reading-sentence-fragment]')),
        position: document.querySelector('[data-basic-reading-sentence-navigation] [aria-live]')?.textContent,
      }))
      const where = `${passage.id}#${index + 1}`
      assert.ok(detail.rules > 0, `${where}: 読解ルールがない`)
      assert.equal(detail.fragment, Boolean(analysis.structure && !analysis.structure.patterns.length), `${where}: 動詞のない文の表示`)
      assert.equal(detail.pattern, !detail.fragment, `${where}: 文型の表示`)
      assert.equal(detail.position, `${index + 1}/${passage.sentences.length}`, where)
      assert.ok((await page.locator('text=きれいな日本語訳').count()) > 0, `${where}: 和訳がない`)
      if (index === 0) await checkWidth(`${passage.id}の一文の構文解説`)
      opened += 1
      if (index < passage.sentences.length - 1) {
        await page.locator('[data-basic-reading-sentence-navigation] button', { hasText: '次の文' }).click()
      }
    }
  }
  assert.equal(opened, 611)
})

test('一文の構文解説で単語を押すと、その語の意味が出る', async () => {
  const passage = BASIC_READING_PASSAGES.find((item) => item.id === 'br4_elephants')
  await open('basicReadingLesson', { passageId: passage.id })
  await page.click('[data-basic-reading-sentence="1"]')
  await page.waitForSelector('[data-reading-role-card="direct-labels"]')
  await page.locator('[data-reading-role-card="direct-labels"] button', { hasText: /^Elephants$/ }).first().click()
  await page.waitForFunction(() => document.body.innerText.includes('ゾウ'))
  assert.ok((await page.evaluate(() => document.body.innerText)).includes('ゾウ'))
})

test('開いたどの画面も、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(overflow, [])
})
