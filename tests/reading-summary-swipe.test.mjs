// 長文の単語まとめをスワイプで記録できるようにした依頼（requests/2026-10-09-reading-summary-swipe.json）の受け入れ条件。
// 2026-10-09 利用者: 長文の単語まとめは、単語の一覧の確認のようにスワイプ処理をできるように改修しなさい。
//
// 単語まとめ（src/screens/ReadingSummary.jsx）の単語の一覧を、単語の一覧の確認・語源カードの紐づく単語と同じ
// 共通の一覧 NormalLearningRecordList（contentId 'vocab'）で描く。左で覚えた（正解）、右でまだ（不正解）を
// 単語の記録へ書き、その行を隠す。前の行にあった級の印・読み上げ・1語ずつの単語帳は残す。
// 2026-10-09 利用者（requests/2026-10-09-reading-summary-row-badges.json）: 級の印と発音ボタンは、一覧のカード中にあったほうがいいんじゃないの？
//   → 級の印は見出しの行（品詞の隣）、発音と単語帳のボタンはカードの右下に置き、行と一緒に横へ動かす。行の下には何も出さない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import net from 'node:net'
import { fileURLToPath } from 'node:url'

import { ALL_PASSAGES } from '../src/data/passages.js'
import { getWord } from '../src/data/vocab.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import {
  learningContentCatalogReviewCommand,
  learningContentCatalogSupportsReview,
} from '../src/lib/learningContentCatalogReview.js'
import { vocabularyCatalogResultForDirection } from '../src/lib/vocabCatalog.js'
import { isAmbiguousSpeechText } from '../src/lib/speechGuard.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const source = readFileSync(new URL('../src/screens/ReadingSummary.jsx', import.meta.url), 'utf8')
// 長文の数と、単語まとめに出る語（長文×語の組）の数。長文や語を足したら確かめてから直す。
const PASSAGE_COUNT = 42
const SUMMARY_PAIR_COUNT = 2_431

test('summary-rows-swipe: 全42本の単語まとめの語がすべて共通スワイプ一覧に載り、左右のスワイプで単語の記録へ書ける', () => {
  assert.equal(ALL_PASSAGES.length, PASSAGE_COUNT)
  const vocab = LEARNING_CONTENTS.find((content) => content.id === 'vocab')
  const vocabIds = new Set(vocab.items.map((item) => item.id))
  assert.equal(learningContentCatalogSupportsReview('vocab'), true)

  // 左右の向きと、学習・テストで記録する答え。
  const results = ['memory', 'test'].flatMap((activity) => ['left', 'right']
    .map((direction) => vocabularyCatalogResultForDirection(activity, direction)))
  assert.deepEqual(results, ['remembered', 'forgot', 'correct', 'wrong'])

  let pairs = 0
  for (const passage of ALL_PASSAGES) {
    assert.ok(passage.vocab?.length, `${passage.id}: 単語まとめの語がない`)
    for (const id of passage.vocab) {
      pairs += 1
      // 画面は getWord で引けた語だけを並べる。引けない語は黙って消えるので、ここで止める。
      const word = getWord(id)
      assert.ok(word, `${passage.id}:${id}: 辞書で引けない`)
      assert.ok(vocabIds.has(word.id), `${passage.id}:${word.id}: 単語の記録の母集団にない`)
      for (const result of results) {
        assert.ok(learningContentCatalogReviewCommand('vocab', word.id, result), `${passage.id}:${word.id}:${result}`)
      }
    }
  }
  assert.equal(pairs, SUMMARY_PAIR_COUNT)

  // 画面は共通の一覧で、全語を1度に出す（前の一覧と同じく「さらに表示」で切らない）。
  assert.match(source, /<NormalLearningRecordList/)
  assert.match(source, /contentId="vocab"/)
  assert.match(source, /items=\{words\}/)
  assert.match(source, /pageSize=\{Math\.max\(words\.length, 1\)\}/)
  assert.match(source, /entryId=\{`reading-summary:\$\{passageId\}`\}/)
  // 自前の行（スワイプできない button の並び）は残さない。
  assert.doesNotMatch(source, /words\.map\(\(w\) => \{/)
})

test('summary-keeps-controls: 行の4つ・上の3つ・下の2つの操作を残す', () => {
  // 行：単語の詳細へ・級の印・読み上げ・1語ずつの単語帳
  assert.match(source, /onOpen=\{\(item\) => navigate\('wordDetail', \{ id: item\.id \}\)\}/)
  assert.match(source, /badgeFor=\{\(item\) => <WordLevelBadge word=\{item\} \/>\}/)
  assert.match(source, /actionsFor=\{\(item\) => <WordRowActions word=\{item\} \/>\}/)
  assert.doesNotMatch(source, /renderAfter=/)
  const badge = source.slice(source.indexOf('function WordLevelBadge'), source.indexOf('function WordRowActions'))
  assert.match(badge, /\{level\.label\}/)
  const actions = source.slice(source.indexOf('function WordRowActions'), source.indexOf('function WordRowBookButton'))
  assert.match(actions, /<SpeakButton text=\{word\.word\}/)
  assert.match(actions, /<WordRowBookButton word=\{word\} \/>/)
  // 上：暗記・テスト・全語を単語帳へ
  assert.match(source, /navigate\('vocabStudy', \{ source: \{ type: 'mylist', ids \}/)
  assert.match(source, /navigate\('vocabQuiz', \{ source: \{ type: 'mylist', ids \}/)
  assert.match(source, /data-reading-summary-word-book/)
  // 下：もう一度読む・教材一覧へ戻る
  assert.match(source, /navigate\('reader', \{ passageId, returnTo: params\.returnTo \}\)/)
  assert.match(source, /教材一覧へ戻る/)
})

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

// 開発版の画面（vite の開発サーバー＋Chromium）。実ブラウザの確かめのときだけ立てる。
async function openDevBrowser() {
  const { createServer } = await import('vite')
  const { chromium } = await import('playwright')
  const port = await freePort()
  const vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-reading-summary-test',
    // 全画面の依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  const browser = await chromium.launch()
  return { vite, browser, base: `http://127.0.0.1:${port}/` }
}

// 指で行を横へなでる（touchstart → touchmove を数回 → touchend）。dx が負なら左へ。
async function swipeRow(page, cdp, selector, dx) {
  // 画面の上の見出し（固定の header）に隠れない、画面の中ほどまで送ってから触る。
  await page.locator(selector).evaluate((element) => element.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(50)
  const box = await page.locator(selector).boundingBox()
  const y = Math.round(box.y + box.height / 2)
  const x0 = Math.round(box.x + box.width / 2)
  const point = (x) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }]
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(x0) })
  for (let step = 1; step <= 6; step += 1) {
    await page.waitForTimeout(16)
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x0 + Math.round((dx * step) / 6)) })
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(80)
}

test('summary-swipe-in-browser: 開発版の画面で、行を左右にスワイプすると記録して隠し、再表示で戻る。カードの中のボタンではスワイプにならない', { timeout: 180_000 }, async () => {
  // ふつうの長文1本と、語の最も多い長文（語彙強化長文）1本。
  const longest = ALL_PASSAGES.reduce((best, passage) => (passage.vocab.length > best.vocab.length ? passage : best))
  const passages = [ALL_PASSAGES[0], longest]
  assert.ok(longest.vocab.length > 80, '語の多い長文が「さらに表示」で切れないことも確かめる')

  const { vite, browser, base } = await openDevBrowser()
  try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 760 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  // 外への通信（Firebase・フォント）は止める。開発版の Firebase は本番のデータベースにつながっている。
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  // 起動の直後の測り直しが終わるまで待つ。
  await page.waitForTimeout(1500)

  for (const passage of passages) {
    await page.evaluate(async (passageId) => {
      const moduleUrl = performance.getEntriesByType('resource').map((entry) => entry.name)
        .find((name) => new URL(name).pathname === '/src/store/useStore.js')
      const { useStore } = await import(moduleUrl)
      useStore.getState().navigate('readingSummary', { passageId })
    }, passage.id)
    const list = `[data-normal-learning-record-list="reading-summary:${passage.id}"]`
    await page.waitForSelector(list, { timeout: 30_000 })
    const shownIds = await page.$$eval(`${list} [data-learning-record-item]`, (rows) => rows.map((row) => row.getAttribute('data-learning-record-item')))
    const expectedIds = passage.vocab.map(getWord).map((word) => word.id)
    assert.deepEqual(shownIds, expectedIds, `${passage.id}: 全語を元の順に並べる`)
    // 全行で、級の印は行（button）の中、発音・単語帳のボタンはカードの枠の中にあり、行の下には何も出さない。
    const placement = await page.$$eval(`${list} [data-normal-learning-record-row-container]`, (containers) => containers.map((container) => {
      const id = container.getAttribute('data-normal-learning-record-row-container')
      const card = container.querySelector('[data-learning-record-swipe-row]')
      const row = card.querySelector('[data-learning-record-item]')
      const badge = row.querySelector(`[data-reading-summary-word-level="${id}"]`)
      const actions = card.querySelector(`[data-learning-record-actions="${id}"] [data-reading-summary-word-actions="${id}"]`)
      const cardBox = card.getBoundingClientRect()
      const actionsBox = actions?.getBoundingClientRect()
      return {
        id,
        badge: Boolean(badge?.textContent.trim()),
        actionsInside: Boolean(actionsBox) && actionsBox.left >= cardBox.left && actionsBox.right <= cardBox.right
          && actionsBox.top >= cardBox.top && actionsBox.bottom <= cardBox.bottom,
        buttons: actions ? actions.querySelectorAll('button').length : 0,
        below: [...container.children].filter((child) => child !== card).length,
      }
    }))
    assert.equal(placement.length, expectedIds.length)
    // 使い方で発音が変わる語（heteronyms.js）は読み上げボタンを出さないので、単語帳ボタンだけ。
    const wordById = new Map(passage.vocab.map(getWord).map((word) => [word.id, word]))
    for (const row of placement) {
      const buttons = isAmbiguousSpeechText(wordById.get(row.id).word) ? 1 : 2
      assert.deepEqual(row, { id: row.id, badge: true, actionsInside: true, buttons, below: 0 }, `${passage.id}:${row.id}`)
    }

    const [first, second, third] = expectedIds
    const rowOf = (id) => `${list} [data-learning-record-item="${id}"]`

    // 指で横へ引いている間、カードの右下のボタンも行と同じだけ動く。離す前に元へ戻すと記録しない。
    {
      await page.locator(rowOf(first)).evaluate((element) => element.scrollIntoView({ block: 'center' }))
      await page.waitForTimeout(50)
      const box = await page.locator(rowOf(first)).boundingBox()
      const y = Math.round(box.y + box.height / 2)
      const x0 = Math.round(box.x + box.width / 2)
      const point = (x) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }]
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(x0) })
      for (const dx of [-15, -30, -45, -60]) {
        await page.waitForTimeout(16)
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x0 + dx) })
      }
      await page.waitForTimeout(50)
      const moved = await page.evaluate((id) => ({
        row: document.querySelector(`[data-learning-record-item="${id}"]`).style.transform,
        actions: document.querySelector(`[data-learning-record-actions="${id}"]`).style.transform,
      }), first)
      assert.match(moved.row, /translate3d\(-\d+px/, `${passage.id}: 行が指について動く`)
      assert.equal(moved.actions, moved.row, `${passage.id}: ボタンが行と一緒に動く`)
      for (const dx of [-40, -20, 0]) {
        await page.waitForTimeout(16)
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x0 + dx) })
      }
      await page.waitForTimeout(400)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForTimeout(80)
      assert.equal(await page.locator(rowOf(first)).count(), 1, `${passage.id}: 戻した行は隠れない`)
    }

    // カードの中の単語帳ボタン・読み上げを押しても、行は隠れず、押したボタンだけが動く。
    const bookButton = page.locator(`${list} [data-reading-summary-word-actions="${third}"] button[aria-pressed]`)
    const before = await bookButton.getAttribute('aria-pressed')
    await bookButton.tap()
    await page.waitForTimeout(150)
    assert.notEqual(await bookButton.getAttribute('aria-pressed'), before, `${passage.id}: 単語帳ボタンが効く`)
    await page.locator(`${list} [data-reading-summary-word-actions="${third}"] button`).nth(0).tap()
    await page.waitForTimeout(150)
    assert.equal(await page.locator(rowOf(third)).count(), 1, `${passage.id}: ボタンを押しても行は隠れない`)

    // 学習：左へなでると「覚えた」、右へなでると「まだ」。行は隠れる。
    await swipeRow(page, cdp, rowOf(first), -120)
    await swipeRow(page, cdp, rowOf(second), 120)
    assert.equal(await page.locator(rowOf(first)).count(), 0, `${passage.id}: 左へなでた行が隠れる`)
    assert.equal(await page.locator(rowOf(second)).count(), 0, `${passage.id}: 右へなでた行が隠れる`)
    assert.match(await page.locator(`${list} [data-normal-learning-record-message]`).innerText(), /「まだ」として記録しました/)

    // 再表示で戻り、記録した答えが行に出る。
    await page.locator(`${list} [data-normal-learning-record-restore]`).tap()
    await page.waitForSelector(rowOf(first))
    assert.equal(await page.locator(rowOf(first)).getAttribute('data-learning-record-status'), '覚えた')
    assert.equal(await page.locator(rowOf(second)).getAttribute('data-learning-record-status'), 'まだ')

    // テスト：左で「正解」、右で「不正解」。
    await page.locator(`${list} [data-normal-learning-record-activity-tab="test"]`).tap()
    await swipeRow(page, cdp, rowOf(first), -120)
    await swipeRow(page, cdp, rowOf(second), 120)
    await page.locator(`${list} [data-normal-learning-record-restore]`).tap()
    await page.waitForSelector(rowOf(first))
    assert.equal(await page.locator(rowOf(first)).getAttribute('data-learning-record-status'), '正解')
    assert.equal(await page.locator(rowOf(second)).getAttribute('data-learning-record-status'), '不正解')

    // 行をタップすると単語の詳細へ。
    await page.locator(rowOf(third)).tap()
    await page.waitForFunction(() => document.querySelector('.study-app-content')?.innerText.length > 0)
    const screen = await page.evaluate(async () => {
      const moduleUrl = performance.getEntriesByType('resource').map((entry) => entry.name)
        .find((name) => new URL(name).pathname === '/src/store/useStore.js')
      const { useStore } = await import(moduleUrl)
      return useStore.getState().screen
    })
    assert.equal(screen, 'wordDetail', `${passage.id}: タップで単語の詳細へ`)
  }
  await context.close()
  } finally {
    await browser.close()
    await vite.close()
  }
})
