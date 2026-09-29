// 中学の社会・理科の画面の確認（依頼台帳 requests/2026-09-29-junior-social-science.json の screens-work・learn-every-unit・credits-page）。
// 375px の幅の Chromium で動かし、次を確かめる。
//   入口   … ポータルのタイルとメニューの教材の行から社会・理科へ入れる。全102単元に「暗記」「演習」「要点を読む」の入口があり、
//            押すとその単元の暗記カード・演習・単元のページが開く。
//   単元   … 全102単元のページに、めあて・要点（図つき）・重要語句・基礎／標準／入試の演習の一覧がそろう。
//   学ぶ   … 暗記カードはめくると意味が出て、「覚えた」「まだ」が記録され、最後に全教材共通の終わりの報告が出る。
//            語句テストは3択＋わからないで答え、3択すべての説明が出て、結果が記録される。
//   演習   … 選ぶ・数を入れる・並べるの3つの形で答え合わせができ、正解・解説・説明が出て、結果の画面と記録まで進む。
//            まちがえた問題は、入口の「解き直し」に入る。
//   出典   … メニューのいちばん下の区切りから出典のページが開き、出典をすべて並べる。学習の画面には出典の文字を出さない。
//   読み   … 社会・理科の語句と問題は、一覧・単語帳・学習の記録の画面でも、常用漢字にない字をふくむ語に読みがなが出る。
//   幅     … 開いたどの画面も、375px の幅で横にはみ出さない（表などの横に送る欄の中は除く）。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import {
  ALL_SUBJECT_QUESTIONS,
  ALL_SUBJECT_TERMS,
  ALL_SUBJECT_UNITS,
  SUBJECTS,
  getSubjectQuestion,
  subjectUnits,
} from '../src/data/subjects/index.js'
import { CREDIT_IDS } from '../src/data/credits.js'
import { contentQuizKey } from '../src/lib/contentProgress.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 375
const HEIGHT = 740
// 学習の画面に出さない、出典のページだけの言葉。
const CREDIT_WORDS = ['出典', 'Natural Earth', '東京書籍']

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

const current = () => page.evaluate(() => {
  const state = window.__subjectTest.store.getState()
  return { screen: state.screen, params: JSON.parse(JSON.stringify(state.params ?? {})) }
})

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

const mainText = () => page.evaluate(() => document.querySelector('.study-app-content').innerText)

async function checkNoCredits(where) {
  const text = await mainText()
  const words = CREDIT_WORDS.filter((word) => text.includes(word))
  assert.deepEqual(words, [], `${where}: 学習の画面に出典の言葉がある`)
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

test('ポータルのタイルとメニューの教材の行から、社会・理科の入口へ入れる', async () => {
  for (const subject of ['social', 'science']) {
    const meta = SUBJECTS[subject]
    await open('portal')
    await page.locator('.study-app-content button', { hasText: meta.appLabel }).first().click()
    await waitScreen(meta.screens.home)
    await checkWidth(`${meta.label}の入口`)
    await checkNoCredits(`${meta.label}の入口`)

    await page.evaluate(() => window.__subjectTest.store.getState().openSpeechSettings())
    await page.click(`[data-menu-content-settings="${meta.screens.home}"]`)
    await page.click(`[data-content-settings="${meta.screens.home}"] [data-content-settings-open]`)
    await waitScreen(meta.screens.home)
  }
})

test('全102単元に「暗記」「演習」「要点を読む」の入口があり、押すとその単元の暗記カード・演習・ページが開く', async () => {
  let checked = 0
  for (const subject of ['social', 'science']) {
    const meta = SUBJECTS[subject]
    for (const book of meta.books) {
      const units = subjectUnits(subject, book.id)
      await open(meta.screens.home, { book: book.id })
      const cards = await page.locator(`[data-subject-units="${book.id}"] [data-subject-unit]`).evaluateAll((elements) => elements.map((element) => element.getAttribute('data-subject-unit')))
      assert.deepEqual(cards, units.map((unit) => unit.id), `${meta.label}・${book.label}の単元の入口が教科書の順にそろう`)
      await checkWidth(`${meta.label}・${book.label}の単元の一覧`)
      for (const unit of units) {
        const card = page.locator(`[data-subject-unit="${unit.id}"]`)
        await card.getByRole('button', { name: `${unit.title}の重要語句${unit.terms.length}語句を暗記` }).click()
        await waitScreen(meta.screens.study)
        let state = await current()
        assert.deepEqual(state.params.ids, unit.terms.map((term) => term.id), `${unit.id}: 暗記の入口がこの単元の重要語句を開く`)
        await page.waitForSelector('[data-subject-card]')

        await open(meta.screens.home, { book: book.id })
        await page.locator(`[data-subject-unit="${unit.id}"]`).getByRole('button', { name: `${unit.title}の演習（基礎・標準・入試 ${unit.questions.length}問）` }).click()
        await waitScreen(meta.screens.practice)
        state = await current()
        assert.equal(state.params.unitId, unit.id, `${unit.id}: 演習の入口がこの単元の演習を開く`)
        const shown = await page.getAttribute('[data-subject-practice-question]', 'data-subject-practice-question')
        assert.equal(getSubjectQuestion(shown)?.unitId, unit.id, `${unit.id}: 演習にこの単元の問題が出る`)

        await open(meta.screens.home, { book: book.id })
        await page.locator(`[data-subject-unit="${unit.id}"]`).getByRole('button', { name: `${unit.title}の要点・重要語句・問題の一覧を見る` }).click()
        await waitScreen(meta.screens.unit)
        await page.waitForSelector(`[data-subject-unit-page="${unit.id}"]`)
        await open(meta.screens.home, { book: book.id })
        checked += 1
      }
    }
  }
  assert.equal(checked, 102)
  assert.equal(ALL_SUBJECT_UNITS.length, 102)
})

test('全102単元のページに、めあて・要点（図）・重要語句・基礎／標準／入試の演習がそろい、横にはみ出さない', async () => {
  for (const unit of ALL_SUBJECT_UNITS) {
    const meta = SUBJECTS[unit.subject]
    await open(meta.screens.unit, { unitId: unit.id })
    const shape = await page.evaluate((id) => {
      const root = document.querySelector(`[data-subject-unit-page="${id}"]`)
      return root && {
        goal: root.querySelector('[data-subject-unit-goal]')?.innerText ?? '',
        points: root.querySelectorAll('[data-subject-point]').length,
        figures: root.querySelectorAll('[data-subject-unit-points] [data-subject-figure]').length,
        terms: [...root.querySelectorAll('[data-subject-term]')].map((element) => element.getAttribute('data-subject-term')),
        levels: [...root.querySelectorAll('[data-subject-level-section]')].map((section) => [
          section.getAttribute('data-subject-level-section'),
          section.querySelectorAll('[data-subject-question-row]').length,
        ]),
      }
    }, unit.id)
    assert.ok(shape, `${unit.id}: 単元のページが開かない`)
    assert.ok(shape.goal.includes('めあて'), `${unit.id}: めあてがない`)
    assert.equal(shape.points, unit.points.length, `${unit.id}: 要点の数`)
    assert.equal(shape.figures, unit.points.filter((point) => point.figure).length, `${unit.id}: 要点の図の数`)
    assert.deepEqual(shape.terms, unit.terms.map((term) => term.id), `${unit.id}: 重要語句`)
    assert.deepEqual(shape.levels, [['basic', 3], ['standard', 3], ['exam', 3]], `${unit.id}: 基礎・標準・入試の演習`)
    await checkWidth(`${unit.id}のページ`)
    await checkNoCredits(`${unit.id}のページ`)
  }
})

test('暗記カード：めくると意味が出て、「覚えた」「まだ」が記録され、終わりの報告が出る', async () => {
  const unit = ALL_SUBJECT_UNITS.find((item) => item.id === 'his-08')
  const meta = SUBJECTS.social
  const ids = unit.terms.slice(0, 4).map((term) => term.id)
  await open(meta.screens.study, { ids, title: `${unit.title}の重要語句`, preserveOrder: true })
  for (const [position, id] of ids.entries()) {
    await page.waitForSelector(`[data-subject-card="${id}"]`)
    await page.click(`[data-subject-card="${id}"]`)
    await page.waitForSelector('[data-subject-card-answer]')
    const answer = await page.innerText('[data-subject-card-answer]')
    const term = ALL_SUBJECT_TERMS.find((item) => item.id === id)
    assert.ok(answer.replace(/\s/g, '').includes(term.meaning.replace(/\s/g, '').slice(0, 8)), `${id}: めくると意味が出る`)
    await checkWidth(`暗記カード ${id}`)
    await checkNoCredits(`暗記カード ${id}`)
    await page.getByRole('button', { name: position % 2 ? 'まだ🤔' : '覚えた👍' }).click()
    await settle()
  }
  await page.waitForSelector(`[data-study-completion-report="${meta.termDomain}"]`)
  await checkWidth('暗記の終わりの報告')
  const srs = await page.evaluate(([field, termIds]) => {
    const state = window.__subjectTest.store.getState()[field] ?? {}
    return termIds.map((id) => Boolean(state[id]))
  }, [meta.termSrsField, ids])
  assert.deepEqual(srs, ids.map(() => true), '暗記の記録（語句ごとの記録）が残る')
})

test('語句テスト：3択＋わからないで答え、3択すべての説明が出て、結果の画面と記録まで進む', async () => {
  const unit = ALL_SUBJECT_UNITS.find((item) => item.id === 'sc2-15')
  const meta = SUBJECTS.science
  const ids = unit.terms.slice(0, 3).map((term) => term.id)
  await open(meta.screens.quiz, { ids, title: `${unit.title}の語句テスト` })
  for (let round = 0; round < ids.length; round += 1) {
    const questionId = await page.getAttribute('[data-subject-quiz-question]', 'data-subject-quiz-question')
    const term = ALL_SUBJECT_TERMS.find((item) => item.id === questionId)
    const buttons = page.locator('.study-app-content button')
    const labels = await buttons.allInnerTexts()
    assert.ok(labels.some((label) => label.includes('わからない')), `${questionId}: わからないの選択肢がある`)
    if (round === 0) await page.getByRole('button', { name: /わからない/ }).click()
    else await page.locator('.study-app-content button', { hasText: term.term }).first().click()
    await page.waitForSelector('[data-choice-explanations]')
    const rows = await page.locator('[data-choice-explanations] [data-choice-explanation]').count()
    assert.equal(rows, 3, `${questionId}: 3択すべての説明が出る`)
    await checkWidth(`語句テスト ${questionId}`)
    await checkNoCredits(`語句テスト ${questionId}`)
    await page.getByRole('button', { name: /次の問題へ|結果を見る/ }).last().click()
    await settle()
  }
  await page.waitForSelector('[data-subject-quiz-result]')
  await checkWidth('語句テストの結果')
  const recorded = await page.evaluate((keys) => {
    const results = window.__subjectTest.store.getState().contentQuizResults ?? {}
    return keys.filter((key) => results[key])
  }, ids.map((id) => contentQuizKey(meta.termDomain, id)))
  assert.equal(recorded.length, ids.length, '語句テストの結果が語句ごとに記録される')
})

test('演習：選ぶ・数を入れる・並べるの3つの形で答え合わせができ、結果の画面・記録・解き直しまで進む', async () => {
  const meta = SUBJECTS.science
  // 刺激と反応（選ぶ・並べる・数を入れる）と、電流の性質（小数の数を入れる）。
  const ids = ['sc2-09-q01', 'sc2-09-q04', 'sc2-09-q07', 'sc2-14-q04']
  await open(meta.screens.practice, { ids, preserveOrder: true, title: '確かめの演習' })

  // 選ぶ：わざとまちがえる（解き直しに入る）。
  let question = getSubjectQuestion(ids[0])
  await page.waitForSelector(`[data-subject-practice-question="${question.id}"]`)
  const wrongChoice = await page.locator('[data-subject-choice]').evaluateAll((elements, answer) => elements.find((element) => !element.innerText.includes(answer))?.getAttribute('data-subject-choice'), question.answer)
  await page.click(`[data-subject-choice="${wrongChoice}"]`)
  await page.waitForSelector('[data-subject-practice-review]')
  assert.match(await page.innerText('[data-subject-practice-result-label]'), /ここを確かめよう/)
  assert.equal(await page.locator('[data-subject-practice-review] [data-choice-explanation]').count(), 3, '3択すべての説明が出る')
  assert.ok((await page.innerText('[data-subject-practice-review]')).includes(question.answer), '正解が出る')
  await checkWidth('演習（選ぶ）')
  await checkNoCredits('演習（選ぶ）')
  await page.getByRole('button', { name: /次の問題へ/ }).last().click()

  // 並べる：正しい順に押す。
  question = getSubjectQuestion(ids[1])
  await page.waitForSelector(`[data-subject-practice-question="${question.id}"]`)
  for (const item of question.items) await page.click(`[data-subject-order-item="${item}"]`)
  await page.click('[data-subject-practice-check]')
  await page.waitForSelector('[data-subject-practice-review]')
  assert.match(await page.innerText('[data-subject-practice-result-label]'), /正解/)
  assert.equal(await page.locator('[data-subject-practice-review] [data-choice-explanation]').count(), question.items.length, '順の理由がすべて出る')
  await checkWidth('演習（並べる）')
  await page.getByRole('button', { name: /次の問題へ/ }).last().click()

  // 数を入れる：数字キーで 0.27 を入れる。
  question = getSubjectQuestion(ids[2])
  await page.waitForSelector(`[data-subject-practice-question="${question.id}"]`)
  for (const key of String(question.answer)) await page.click(`[data-subject-number-key="${key}"]`)
  assert.equal(await page.innerText('[data-subject-number-value]'), String(question.answer))
  await page.click('[data-subject-practice-check]')
  await page.waitForSelector('[data-subject-practice-steps]')
  assert.match(await page.innerText('[data-subject-practice-result-label]'), /正解/)
  assert.equal(await page.locator('[data-subject-practice-steps] li').count(), question.steps.length, '解き方がすべて出る')
  await checkWidth('演習（数を入れる）')
  await page.getByRole('button', { name: /次の問題へ/ }).last().click()

  // 数を入れる：わからない。
  question = getSubjectQuestion(ids[3])
  await page.waitForSelector(`[data-subject-practice-question="${question.id}"]`)
  await page.click('[data-subject-practice-unknown]')
  await page.waitForSelector('[data-subject-practice-review]')
  assert.match(await page.innerText('[data-subject-practice-result-label]'), /答えを確かめよう/)
  await page.getByRole('button', { name: /結果を見る/ }).last().click()

  await page.waitForSelector('[data-subject-practice-result]')
  assert.match(await page.innerText('[data-subject-practice-result]'), /2 \/ 4問 正解/)
  assert.ok(await page.locator('[data-subject-missed-units] button').count() >= 1, 'まちがえた問題の単元へ戻る入口が出る')
  await checkWidth('演習の結果')

  const log = await page.evaluate(([field, questionIds]) => {
    const entries = window.__subjectTest.store.getState()[field] ?? {}
    return questionIds.map((id) => entries[id]?.at(-1)?.result ?? null)
  }, [meta.practiceLogField, ids])
  const quizResults = await page.evaluate((keys) => {
    const results = window.__subjectTest.store.getState().contentQuizResults ?? {}
    return keys.map((key) => results[key]?.lastResult ?? null)
  }, ids.map((id) => contentQuizKey(meta.practiceDomain, id)))
  assert.deepEqual(quizResults, ['wrong', 'correct', 'correct', 'wrong'], '全教材共通の問題ごとの結果（出題順に使う）にも記録される')
  assert.deepEqual(log, ['wrong', 'correct', 'correct', 'unknown'], '演習の結果が問題ごとに記録される')

  // まちがえた問題とわからなかった問題が、入口の「解き直し」に入る。
  await open(meta.screens.home, { book: 'science2' })
  const retry = await page.getAttribute('[data-subject-retry]', 'aria-label')
  assert.match(retry, /解き直し。2問/)
})

test('出典のページは、メニューのいちばん下の区切りから開き、出典をすべて並べる', async () => {
  await open('portal')
  await page.evaluate(() => window.__subjectTest.store.getState().openSpeechSettings())
  await page.waitForSelector('[data-menu-section]')
  const lastSection = await page.locator('[data-menu-section]').evaluateAll((sections) => sections.at(-1).getAttribute('data-menu-section'))
  assert.equal(lastSection, 'about')
  await page.click('[data-menu-section="about"] [data-menu-destination="credits"]')
  await waitScreen('credits')
  const credits = await page.locator('[data-credits-page] [data-credit]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-credit')))
  assert.deepEqual(credits, [...CREDIT_IDS])
  await checkWidth('出典のページ')
})

test('一覧・単語帳・学習の記録の画面でも、社会・理科の語句と問題に読みがなが出る', async () => {
  const term = ALL_SUBJECT_TERMS.find((item) => item.term === '琵琶湖')
  const question = ALL_SUBJECT_QUESTIONS.find((item) => item.kind === 'choice' && item.answer === '琵琶湖')
  const meta = SUBJECTS[term.subject]
  const readingsIn = (selector) => page.evaluate((target) => (
    [...document.querySelectorAll(target)]
      .flatMap((element) => [...element.querySelectorAll('ruby.subject-ruby rt')].map((rt) => rt.textContent))
  ), selector)

  // 暗記の記録を1つ残し（学習の記録の成績表に出る）、単語帳にも入れる。
  await page.evaluate(([subject, id, domain]) => {
    const state = window.__subjectTest.store.getState()
    state.reviewSubjectTerm(subject, id, 'remembered')
    if (!state.learningNotebook?.entries?.[`${domain}:${id}`]?.saved) state.toggleNotebookItem(domain, id)
  }, [term.subject, term.id, meta.notebookTerms])

  // 社会のホームの重要語句の一覧（学習の記録の行）。
  await open(meta.screens.home, { view: 'list', query: term.term })
  await page.waitForSelector(`[data-learning-record-item="${term.id}"]`)
  assert.ok((await readingsIn(`[data-learning-record-item="${term.id}"]`)).includes('びわ'), 'ホームの重要語句の一覧')
  await checkWidth('ホームの重要語句の一覧')

  // 暗記・テストの記録（全教材の一覧）の重要語句と演習。
  await open('myLearning', {
    view: 'catalog',
    contentId: meta.termDomain,
    catalogState: { key: `${meta.termDomain}:all`, filters: { query: term.term } },
  })
  await page.waitForSelector(`[data-learning-record-item="${term.id}"]`)
  assert.ok((await readingsIn(`[data-learning-record-item="${term.id}"]`)).includes('びわ'), '全教材の一覧の重要語句')
  await checkWidth('全教材の一覧の重要語句')
  await open('portal')
  await open('myLearning', {
    view: 'catalog',
    contentId: meta.practiceDomain,
    catalogState: { key: `${meta.practiceDomain}:all`, filters: { query: term.term } },
  })
  await page.waitForSelector(`[data-learning-catalog-item="${question.id}"]`)
  assert.ok((await readingsIn(`[data-learning-catalog-item="${question.id}"]`)).includes('びわ'), '全教材の一覧の演習')

  // マイ学習ノート（単語帳に入れた語句）。
  await open('myList', { tab: 'notebook', domain: meta.notebookTerms, filter: 'saved' })
  const notebookRow = `[data-notebook-item-ref="${meta.notebookTerms}:${term.id}"]`
  await page.waitForSelector(notebookRow)
  assert.ok((await readingsIn(notebookRow)).includes('びわ'), 'マイ学習ノート')
  await checkWidth('マイ学習ノート')

  // 学習の記録の成績表（項目ごと）。
  await open('progress')
  await page.waitForSelector('#gradebook-search-item')
  await page.fill('#gradebook-search-item', term.term)
  // 読みがな（rt・rp）を除いた文で、探した語句の行が出るのを待つ。
  await page.waitForFunction((label) => [...document.querySelectorAll('[data-gradebook-row] h3')].some((heading) => {
    const copy = heading.cloneNode(true)
    copy.querySelectorAll('rt, rp').forEach((node) => node.remove())
    return copy.textContent.includes(label)
  }), term.term)
  assert.ok((await readingsIn('[data-gradebook-row] h3')).includes('びわ'), '学習の記録の成績表')
  await checkWidth('学習の記録の成績表')
})

test('開いたどの画面も、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(overflow, [])
})
