// 基礎長文の「準備して読む」「本文から読む」と読解の準備の確認（依頼台帳 requests/2026-10-29-basic-reading-prep.json）。
//   入口   … 級ごとの長文一覧で、全50本に「準備して読む」「本文から読む」が並び、それぞれ準備・本文を開く。
//            本文の画面には、長文と同じく準備（単語・熟語・表現）と読解ルールへの入口があり、単語・熟語の欄は準備へ移した。
//   ルール … 準備に、テーマと文章の種類に合わせた読み方（説明と、問題で学ぶ3ルールの手順）と、
//            問題で学ぶ3ルール・本文の文で使うルールを段ごとに紹介する。
//   単語   … その級の単語を暗記・テスト・一覧を確認で学べ、終えると準備へ戻る。一覧は全語、押すと辞書のページ。
//   熟語   … 熟語・表現を暗記・テスト・一覧を確認で学べ、終えると準備へ戻る。一覧は全項目、押すと説明。熟語のない長文は押せない。
// 375px の幅の Chromium で動かす。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import {
  BASIC_READING_LEVEL_IDS,
  BASIC_READING_PASSAGES,
  basicReadingPassagesForLevel,
} from '../src/data/basic-reading/index.js'
import { BASIC_READING_APPROACHES } from '../src/data/basic-reading/approaches.js'
import { READING_RULES_BY_ID } from '../src/data/reading-rules.js'
import { basicReadingLevelWords, basicReadingPhrases } from '../src/lib/basicReading.js'
import { basicReadingPassageRules } from '../src/lib/basicReadingSentence.js'

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

const current = () => page.evaluate(() => {
  const state = window.__prepTest.store.getState()
  return { screen: state.screen, params: JSON.parse(JSON.stringify(state.params ?? {})) }
})

async function waitScreen(screen) {
  await page.waitForFunction((name) => {
    const main = document.querySelector('.study-app-content')
    return window.__prepTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__prepTest.store.getState()
    state.closeSpeechSettings()
    state.navigate(name, screenParams)
  }, [screen, params])
  await waitScreen(screen)
}

// 375px の幅で横にはみ出す要素（横に送る欄の中は除く）と、外枠のはみ出し。
async function checkWidth(where) {
  const problems = await page.evaluate((label) => {
    const width = window.innerWidth
    const found = []
    if (document.documentElement.scrollWidth > width + 1) found.push(`${label}: ページが横にはみ出す`)
    const surface = document.querySelector('.study-app-surface')
    if (surface.scrollHeight > surface.clientHeight + 1) found.push(`${label}: 外枠が縦にはみ出す`)
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
        found.push(`${label}: <${element.tagName.toLowerCase()}>「${(element.textContent ?? '').trim().slice(0, 16)}」が横にはみ出す`)
        if (found.length >= 3) break
      }
    }
    return found
  }, where)
  overflow.push(...problems)
}

const prepEntry = (kind) => page.locator(`[data-basic-reading-prep-entry="${kind}"]`)

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-basic-reading-prep-test',
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
    window.__prepTest = { store: useStore }
  })
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('全50本に、テーマの読み方（説明と、問題で学ぶ3ルールの手順）があり、問題の答えを書いていない', () => {
  assert.equal(Object.keys(BASIC_READING_APPROACHES).length, BASIC_READING_PASSAGES.length)
  for (const passage of BASIC_READING_PASSAGES) {
    const approach = BASIC_READING_APPROACHES[passage.id]
    assert.ok(approach?.title && approach.summary, `${passage.id}: 読み方`)
    assert.equal(approach.steps.length, passage.lessons.length, `${passage.id}: 手順はルールの問題と同じ数`)
    for (const [index, lesson] of passage.lessons.entries()) {
      const step = approach.steps[index]
      const label = step.split('：')[0]
      assert.ok(label.length >= 2 && step.includes('：'), `${passage.id}: 手順${index + 1}にルールの見出しがない`)
      const answer = lesson.choices[lesson.answer][0]
      // 答えの全体を書かない。英語1語の答え（room・tired など）は、その語を手順に書かない。
      for (const text of [step, approach.summary, approach.title]) {
        assert.ok(!text.includes(answer), `${passage.id}: 「${answer}」（${lesson.rule}の答え）を読み方に書いている`)
      }
      if (/^[A-Za-z]+$/.test(answer)) {
        assert.ok(!new RegExp(`(^|[^A-Za-z])${answer}([^A-Za-z]|$)`, 'i').test(step), `${passage.id}: 答えの語「${answer}」を手順に書いている`)
      }
    }
  }
})

test('全50本で、本文の文と問題で使う読解ルールを段の順に集め、問題で学ぶ3ルールを含む', () => {
  let lessonRules = 0
  for (const passage of BASIC_READING_PASSAGES) {
    const uses = basicReadingPassageRules(passage)
    const ids = uses.map((use) => use.rule.id)
    assert.equal(new Set(ids).size, ids.length, passage.id)
    for (const lesson of passage.lessons) {
      const use = uses.find((item) => item.rule.id === lesson.rule)
      assert.ok(use?.lesson, `${passage.id}: ${lesson.rule}`)
      lessonRules += 1
    }
    for (const use of uses) assert.ok(use.lesson || use.sentences.length > 0, `${passage.id}: ${use.rule.id}`)
  }
  assert.equal(lessonRules, 150)
  // 級ごとに、問題で学ぶルールが30ルールをすべて覆う。
  for (const level of BASIC_READING_LEVEL_IDS) {
    const rules = new Set(basicReadingPassagesForLevel(level).flatMap((passage) => passage.lessons.map((lesson) => lesson.rule)))
    assert.equal(rules.size, 30, `${level}級`)
  }
})

test('級ごとの長文一覧で、全50本に「準備して読む」「本文から読む」が並び、それぞれ準備と本文を開く', async () => {
  let checked = 0
  for (const level of BASIC_READING_LEVEL_IDS) {
    for (const passage of basicReadingPassagesForLevel(level)) {
      await open('basicReading', { level })
      const card = page.locator(`[data-basic-reading-passage="${passage.id}"]`)
      await card.locator('[data-basic-reading-start="prep"]').click()
      await waitScreen('basicReadingPrep')
      assert.equal((await current()).params.passageId, passage.id)
      await open('basicReading', { level })
      await page.locator(`[data-basic-reading-passage="${passage.id}"] [data-basic-reading-start="direct"]`).click()
      await waitScreen('basicReadingLesson')
      assert.equal((await current()).params.passageId, passage.id)
      // 本文の画面：単語・熟語の欄はなく、準備と読解ルールへの入口がある。
      assert.equal(await page.locator('[data-basic-reading-vocabulary]').count(), 0, `${passage.id}: 本文の画面に単語の欄が残っている`)
      assert.equal(await page.locator('[data-basic-reading-lesson-tools] button', { hasText: '読解ルール' }).count(), 1)
      await page.click('[data-basic-reading-lesson-prep]')
      await waitScreen('basicReadingPrep')
      assert.equal((await current()).params.passageId, passage.id)
      checked += 1
    }
    await open('basicReading', { level })
    await checkWidth(`${level}級の長文一覧`)
  }
  assert.equal(checked, 50)
})

test('全50本の読解の準備で、テーマの読み方・読解ルール・単語・熟語・表現の暗記・テスト・一覧がそろう', async () => {
  let words = 0
  let phrases = 0
  for (const passage of BASIC_READING_PASSAGES) {
    const id = passage.id
    const approach = BASIC_READING_APPROACHES[id]
    const levelWords = basicReadingLevelWords(passage)
    const levelPhrases = basicReadingPhrases(passage)
    await open('basicReadingPrep', { passageId: id })

    // テーマの読み方
    const approachText = await page.locator(`[data-basic-reading-approach="${id}"]`).innerText()
    for (const text of [approach.title, approach.summary, ...approach.steps]) assert.ok(approachText.includes(text), `${id}: 「${text.slice(0, 12)}」`)
    const stepRules = await page.locator('[data-basic-reading-approach-step]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-basic-reading-approach-step')))
    assert.deepEqual(stepRules, passage.lessons.map((lesson) => lesson.rule), id)

    // 読解ルール：段の順に全部、問題で学ぶ3つに印、どれもルールのカード
    const shownRules = await page.locator('[data-basic-reading-prep-rule]').evaluateAll((elements) => elements.map((element) => [
      element.getAttribute('data-basic-reading-prep-rule'),
      element.getAttribute('data-basic-reading-prep-rule-lesson') === 'true',
      element.querySelectorAll('[data-reading-rule-id]').length,
    ]))
    const uses = basicReadingPassageRules(passage)
    assert.deepEqual(shownRules.map(([rule, lesson]) => [rule, lesson]), uses.map((use) => [use.rule.id, use.lesson]), `${id}: 読解ルール`)
    for (const [rule, , cards] of shownRules) assert.ok(cards >= 1, `${id}: ${rule} のカード`)
    for (const lesson of passage.lessons) {
      assert.ok((await page.locator(`[data-basic-reading-prep-rule="${lesson.rule}"]`).innerText()).includes(READING_RULES_BY_ID[lesson.rule].title))
    }
    await checkWidth(`${id}の読解の準備`)

    // 単語：暗記・テストはこの長文の単語だけ、終えると準備へ戻る
    await prepEntry('words').getByRole('button', { name: `${passage.titleJa}の単語を暗記` }).click()
    await waitScreen('vocabStudy')
    let { params } = await current()
    assert.deepEqual(params.source.ids, levelWords.map((word) => word.id), `${id}: 単語の暗記`)
    assert.equal(params.continueTo.screen, 'basicReadingPrep')
    assert.equal(params.returnTo.params.passageId, id)
    await open('basicReadingPrep', { passageId: id })
    await prepEntry('words').getByRole('button', { name: `${passage.titleJa}の単語をテスト` }).click()
    await waitScreen('vocabQuiz')
    ;({ params } = await current())
    assert.deepEqual(params.source.ids, levelWords.map((word) => word.id), `${id}: 単語のテスト`)
    assert.equal(params.continueTo.screen, 'basicReadingPrep')

    // 単語の一覧：全語、押すと辞書のページ
    await open('basicReadingPrep', { passageId: id })
    await prepEntry('words').getByRole('button', { name: `${passage.titleJa}の単語を一覧で確認する` }).click()
    await page.waitForSelector('[data-basic-reading-prep-catalog="words"] [data-normal-learning-record-rows]')
    const wordRows = await page.locator('[data-normal-learning-record-row-container]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-normal-learning-record-row-container')))
    assert.deepEqual(wordRows, levelWords.map((word) => word.id), `${id}: 単語の一覧`)
    assert.equal(await page.locator('[data-basic-reading-prep-word-book]').count(), 1)
    await checkWidth(`${id}の単語の一覧`)
    await page.locator(`[data-normal-learning-record-row-container="${levelWords[0].id}"] button`).first().click()
    await waitScreen('wordDetail')
    assert.equal((await current()).params.id, levelWords[0].id)
    words += levelWords.length

    // 熟語・表現
    await open('basicReadingPrep', { passageId: id })
    const phraseButtons = prepEntry('phrases').getByRole('button')
    if (!levelPhrases.length) {
      for (const name of ['暗記', 'テスト', '一覧で確認する']) {
        assert.ok(await prepEntry('phrases').getByRole('button', { name: `${passage.titleJa}の熟語・表現を${name}` }).isDisabled(), `${id}: 熟語がないのに${name}を押せる`)
      }
      assert.ok((await prepEntry('phrases').innerText()).includes('覚えておく熟語・表現はありません'))
      continue
    }
    assert.ok(await phraseButtons.count() >= 3)
    await prepEntry('phrases').getByRole('button', { name: `${passage.titleJa}の熟語・表現を暗記` }).click()
    await waitScreen('phraseStudy')
    ;({ params } = await current())
    assert.deepEqual(params.source.items.map((item) => item.id), levelPhrases.map((phrase) => phrase.id), `${id}: 熟語の暗記`)
    assert.equal(params.continueTo.screen, 'basicReadingPrep')
    await open('basicReadingPrep', { passageId: id })
    await prepEntry('phrases').getByRole('button', { name: `${passage.titleJa}の熟語・表現をテスト` }).click()
    await waitScreen('phraseQuiz')
    ;({ params } = await current())
    assert.deepEqual(params.source.items.map((item) => item.id), levelPhrases.map((phrase) => phrase.id), `${id}: 熟語のテスト`)
    assert.equal(params.continueTo.screen, 'basicReadingPrep')

    await open('basicReadingPrep', { passageId: id })
    await prepEntry('phrases').getByRole('button', { name: `${passage.titleJa}の熟語・表現を一覧で確認する` }).click()
    await page.waitForSelector('[data-basic-reading-prep-catalog="phrases"] [data-normal-learning-record-rows]')
    const phraseRows = await page.locator('[data-normal-learning-record-row-container]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-normal-learning-record-row-container')))
    assert.deepEqual(phraseRows, levelPhrases.map((phrase) => phrase.id), `${id}: 熟語の一覧`)
    await checkWidth(`${id}の熟語の一覧`)
    await page.locator(`[data-normal-learning-record-row-container="${levelPhrases[0].id}"] button`).first().click()
    await page.waitForSelector(`[data-phrase-detail="${levelPhrases[0].id}"]`)
    await page.keyboard.press('Escape')
    phrases += levelPhrases.length
  }
  assert.equal(words, 702)
  assert.equal(phrases, 368)
})

test('読解の準備の「本文を読む」は、その長文の本文を開く', async () => {
  for (const passage of BASIC_READING_PASSAGES) {
    await open('basicReadingPrep', { passageId: passage.id })
    await page.click('[data-basic-reading-prep-read]')
    await waitScreen('basicReadingLesson')
    assert.equal((await current()).params.passageId, passage.id)
  }
})

test('開いたどの画面も、375px の幅で横にはみ出さず、外枠も伸びない', () => {
  assert.deepEqual(overflow, [])
})
