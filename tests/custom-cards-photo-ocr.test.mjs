// 自作カードの「写真から作る」を、本物の読み取りエンジン（「教科書から単語追加」と同じ PaddleOCR の PP-OCRv6）で動かす。
// 依頼 requests/2026-10-22-custom-cards-photo-ocr.json の受け入れ条件 photo-real-engine。
// 利用者：「自作カードのところに、OCRでテキストを読み取って単語を登録する機能を配置しなさい。」
//
// 開発サーバー（375px の Chromium）でアプリの画面を開き、試料の画像（tests/fixtures/vocab-ocr/、書き起こしは samples.json）を選んで
// 「文字を読み取る」を押し、出た候補を確かめる。モデルは開発サーバーが /ocr-models/ から配る（scripts/ocr-models.mjs が取り込む）。
// 外への通信は止める。テストのブラウザには WebGPU がないので wasm で読む。
//   word-list            新出単語の表：7行がそのまま単語・品詞・意味のカード（最初から選ぶ）
//   textbook-translation 本文と訳：単語と意味の組を作らず、英文の語を辞書の意味つきで出す（最初は選ばない）
//   inline-mixed・exercise 日本語の説明・問題文にまざる英語：組を作らず、英文の語として出す
//   japanese-only        英単語のテンプレートでは候補なし、「その他」なら1行1枚
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'

import { ensureOcrModels } from '../scripts/ocr-models.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const sample = (id) => fileURLToPath(new URL(`./fixtures/vocab-ocr/${id}.png`, import.meta.url))

let vite
let browser
let page
let base
const externalRequests = []
const messages = []

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

before(async () => {
  await ensureOcrModels()
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    cacheDir: 'node_modules/.vite-custom-photo-ocr-test',
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'], include: ['@paddleocr/paddleocr-js'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 375, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  // 自分のサーバーにだけ通す（モデルも ONNX Runtime の本体も同じサイトから読む）。外へ出ようとした読み取りの部品を数える
  // （アプリを開いたときのフォントの読み込みは読み取りと関係がないので数えない）。
  await context.route((url) => !url.href.startsWith(base) && !url.href.startsWith('blob:') && !url.href.startsWith('data:'), (route) => {
    if (/ocr|onnx|paddle|\.wasm|\.tar|wordlist|compromise/i.test(route.request().url())) externalRequests.push(route.request().url())
    return route.abort()
  })
  page = await context.newPage()
  page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource/.test(message.text())) messages.push(message.text())
  })
  await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  await page.evaluate(async () => {
    const moduleUrl = (path) => performance.getEntriesByType('resource').map((entry) => entry.name).find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    window.__photoTest = { store: useStore }
  })
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

async function openPhoto(params) {
  await page.evaluate((value) => {
    const state = window.__photoTest.store.getState()
    state.navigate('portal', {})
    state.navigate('customWords', value)
  }, params)
  await page.locator('[data-custom-photo]').waitFor({ timeout: 30_000 })
}

async function read(id) {
  await page.locator('[data-custom-photo] input[type=file]:not([capture])').setInputFiles(sample(id))
  const started = Date.now()
  await page.getByRole('button', { name: '文字を読み取る' }).click()
  await page.locator('[data-custom-photo-summary]').waitFor({ timeout: 180_000 })
  return {
    ms: Date.now() - started,
    text: await page.locator('#custom-photo-text').inputValue(),
    japaneseRows: await page.locator('[data-custom-photo-japanese-rows]').count() ? await page.locator('[data-custom-photo-japanese-rows]').innerText() : '',
    rows: await page.locator('[data-custom-photo-candidate]').evaluateAll((items) => items.map((item) => ({
      front: item.querySelector('[data-custom-photo-front]').value,
      back: item.querySelector('[data-custom-photo-back]').value,
      checked: item.querySelector('[data-custom-photo-check]').checked,
      details: item.querySelector('[data-custom-photo-details]')?.textContent ?? '',
      notes: [...item.querySelectorAll('[data-custom-photo-note]')].map((note) => note.textContent),
    }))),
    wordHeading: await page.locator('[data-custom-photo-word-heading]').count(),
  }
}

test('新出単語の表（word-list）：7行がそのまま単語・意味・品詞のカードの候補になり、最初から選んで、7枚を登録できる', async () => {
  await openPhoto({ view: 'photo', category: 'subject:english' })
  const result = await read('word-list')
  assert.deepEqual(result.rows.map(({ front, back, checked }) => [front, back, checked]), [
    ['library', '図書館', true],
    ['borrow', '借りる', true],
    ['animal', '動物', true],
    ['interesting', 'おもしろい', true],
    ['librarian', '司書', true],
    ['wanted', 'want の過去形', true],
    ['showed', 'show の過去形', true],
  ], result.text)
  assert.deepEqual(result.rows.map((row) => row.details.split('・')[0]), ['名詞', '動詞', '名詞', '形容詞', '名詞', '動詞', '動詞'])
  assert.match(result.japaneseRows, /日本語だけの行（1行）/)
  assert.equal(result.wordHeading, 0)
  await page.locator('[data-custom-photo-book]').selectOption('')
  await page.locator('[data-custom-photo-save]').click()
  assert.equal(await page.locator('[data-custom-photo-notice] p').innerText(), '7枚を「英語」に登録しました。')
  const words = await page.evaluate(() => window.__photoTest.store.getState().customWords.map((word) => [word.word, word.meanings.join('・'), word.pos]))
  assert.deepEqual(words, [
    ['library', '図書館', '名'],
    ['borrow', '借りる', '動'],
    ['animal', '動物', '名'],
    ['interesting', 'おもしろい', '形'],
    ['librarian', '司書', '名'],
    ['wanted', 'want の過去形', '動'],
    ['showed', 'show の過去形', '動'],
  ])
  console.log(`word-list: ${result.ms}ms`)
})

test('本文と訳（textbook-translation）：単語と意味の組を作らず、英文の語を辞書の意味つきで出し、どれも最初は選ばない', async () => {
  await openPhoto({ view: 'photo', category: 'subject:english' })
  const result = await read('textbook-translation')
  assert.equal(result.wordHeading, 1)
  assert.ok(result.rows.every((row) => !row.checked), JSON.stringify(result.rows.filter((row) => row.checked)))
  const fronts = result.rows.map((row) => row.front)
  for (const front of ['library', 'school', 'borrow', 'book', 'animal', 'librarian', 'interesting', 'want', 'show', 'go']) {
    assert.ok(fronts.includes(front), `${front}：${fronts.join(',')}`)
  }
  // 分類に前のテストで登録した語（library など）は「この分類にもうあります」。過去形は辞書の形（wanted → want）。
  assert.ok(result.rows.find((row) => row.front === 'library').notes.includes('この分類にもうあります。'))
  assert.ok(result.rows.find((row) => row.front === 'want').notes.includes('wanted → want'))
  assert.ok(result.rows.filter((row) => row.back).every((row) => row.notes.includes('意味は辞書から入れました。') || row.notes.includes('この分類にもうあります。')))
  assert.match(result.japaneseRows, /日本語だけの行（2行）/)
})

test('日本語の説明・問題文にまざる英語（inline-mixed・exercise）：単語と意味の組を作らず、英文の語として出す', async () => {
  for (const id of ['inline-mixed', 'exercise']) {
    await openPhoto({ view: 'photo', category: 'subject:english' })
    const result = await read(id)
    assert.ok(result.rows.length > 0, id)
    assert.equal(result.wordHeading, 1, `${id}：${JSON.stringify(result.rows.slice(0, 3))}`)
    assert.equal(await page.locator('[data-custom-photo-candidate]').first().locator('xpath=preceding-sibling::li[@data-custom-photo-word-heading]').count(), 1, `${id}：最初の候補から英文の語`)
    assert.ok(result.rows.every((row) => !row.checked), `${id}：${JSON.stringify(result.rows.filter((row) => row.checked))}`)
    const fronts = result.rows.map((row) => row.front)
    for (const front of id === 'inline-mixed' ? ['study', 'decide', 'science', 'visit'] : ['school', 'piano', 'baseball', 'park']) {
      assert.ok(fronts.includes(front), `${id}：${front}`)
    }
  }
})

test('日本語だけのページ（japanese-only）：英単語のテンプレートでは候補なし、「その他」なら1行を1枚の候補にする', async () => {
  await openPhoto({ view: 'photo', category: 'subject:english' })
  const english = await read('japanese-only')
  assert.equal(english.rows.length, 0)
  assert.match(await page.locator('main').innerText(), /カードにできる行がありませんでした/)
  assert.match(english.japaneseRows, /日本語だけの行（4行）/)
  await page.locator('[data-custom-photo] [data-custom-card-template="other"]').click()
  const rows = await page.locator('[data-custom-photo-candidate]').evaluateAll((items) => items.map((item) => [
    item.querySelector('[data-custom-photo-front]').value,
    item.querySelector('[data-custom-photo-back]').value,
    item.querySelector('[data-custom-photo-check]').checked,
  ]))
  assert.equal(rows.length, 4, JSON.stringify(rows))
  // 区切りのない行（見出しの「第2章人の体のつくりとはたらき」はエンジンが続けて読む・本文の文）は、表だけの候補（意味を書けば登録できる）。
  assert.match(rows[0][0], /^第2章/)
  assert.ok(rows.every(([front, back, checked]) => front.length > 10 && back === '' && !checked), JSON.stringify(rows))
  assert.deepEqual(externalRequests, [])
  assert.deepEqual(messages, [])
})
