// 文法の実力診断を、375px の Chromium の開発版のアプリで動かす（依頼台帳 requests/2026-11-13-grammar-diagnostic-in-app.json の works-in-app）。
// 文法のトップの入口から高校入試の診断を始め、全43単元を文法テストの画面で最後まで解き（確かめの2問目を含む）、
// 結果のマップの全単元の出来が答えたとおりになること、弱点から参考書・単元のテストへ進んで戻れること、
// 難関大の全127単元のマップが横にはみ出さないことを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 375

let vite
let browser
let page
// 第1回（高校入試）で答えたとおりの単元の出来と、出した問題。受け直しのテストで使う。
let firstAttempt = null

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
    return window.__diagnosticTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

const overflow = () => page.evaluate((width) => {
  const out = []
  if (document.scrollingElement.scrollWidth > width) out.push(`ページの幅 ${document.scrollingElement.scrollWidth}px`)
  for (const element of document.querySelectorAll('.study-app-content *')) {
    const rect = element.getBoundingClientRect()
    if (rect.width && rect.right > width + 0.5) {
      out.push(`${element.tagName.toLowerCase()} ${element.textContent.slice(0, 20)} の右端 ${Math.round(rect.right)}px`)
      break
    }
  }
  return out
}, WIDTH)

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    cacheDir: 'node_modules/.vite-grammar-diagnostic-test',
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  const base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: WIDTH, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  page = await context.newPage()
  await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  await page.evaluate(async () => {
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    // 文法のデータと診断の部品は、まだ読み込まれていない（画面を開くときに読む）ので、同じ道で読む。
    const grammar = await import(moduleUrl('/src/data/grammar.js') ?? '/src/data/grammar.js')
    const diagnostic = await import(moduleUrl('/src/lib/grammarDiagnostic.js') ?? '/src/lib/grammarDiagnostic.js')
    window.__diagnosticTest = { store: useStore, grammar, diagnostic }
  })
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('高校入試の全43単元を文法テストの画面で解き、結果のマップ・弱点の一覧・参考書と単元のテストへ進める', async () => {
  await page.evaluate(() => window.__diagnosticTest.store.getState().navigate('grammar'))
  await waitScreen('grammar')
  await page.click('[data-grammar-diagnostic-entry]')
  await waitScreen('grammarDiagnostic')
  assert.deepEqual(await overflow(), [], '範囲を選ぶ画面')
  await page.click('[data-grammar-diagnostic-scope="high"]')
  await page.click('[data-grammar-diagnostic-begin]')

  const answered = {} // 単元 → [1問目の正誤, 2問目の正誤]
  const seen = new Set()
  let rounds = 0
  for (let guard = 0; guard < 20; guard += 1) {
    await waitScreen('grammarQuiz')
    rounds += 1
    if (rounds === 1) assert.deepEqual(await overflow(), [], 'テストの画面')
    const ids = await page.evaluate(() => window.__diagnosticTest.store.getState().params.source.ids)
    for (let index = 0; index < ids.length; index += 1) {
      const { key, answer, type } = await page.evaluate((id) => {
        const item = window.__diagnosticTest.grammar.getGrammar(id)
        return { key: `${item.level}|${item.topic}`, answer: item.answer, type: item.type ?? null }
      }, ids[index])
      assert.ok(!seen.has(ids[index]), `同じ問題 ${ids[index]} が2回出た`)
      seen.add(ids[index])
      const slot = answered[key] ? 1 : 0
      // まちがえる問題：1問目は3問に1問、2問目は2問に1問。
      const count = Object.values(answered).flat().length
      const right = slot === 0 ? count % 3 !== 0 : count % 2 !== 0
      const choice = page.locator('.study-app-content button.border-2', { hasText: answer }).filter({ hasText: new RegExp(`^${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) })
      const canPick = right && await choice.count() === 1
      if (canPick) await choice.click()
      else await page.locator('.study-app-content button', { hasText: 'わからない' }).click()
      ;(answered[key] ??= []).push(canPick)
      await page.locator('.study-app-content ~ * button, .study-app-content button').filter({ hasText: /^(次へ|結果を見る)/ }).last().click()
    }
    await waitScreen('sessionResult')
    await page.locator('button', { hasText: '診断の結果へ' }).click()
    await waitScreen('grammarDiagnostic')
    if (!await page.locator('[data-grammar-diagnostic-next]').count()) break
    await page.click('[data-grammar-diagnostic-next]')
  }
  assert.equal(rounds, 6, '5回＋確かめだけの最後の回')
  assert.equal(Object.keys(answered).length, 43)
  assert.ok(Object.values(answered).every((list) => list.length === (list[0] ? 1 : 2)), '2問目はまちがえた単元にだけ')

  const cells = await page.$$eval('[data-grammar-diagnostic-cell]', (buttons) => buttons.map((button) => [button.dataset.grammarDiagnosticCell, button.dataset.verdict]))
  assert.equal(cells.length, 43)
  const expected = Object.fromEntries(Object.entries(answered).map(([key, [first, second]]) => [key, first ? 'ok' : second ? 'unsure' : 'weak']))
  assert.deepEqual(Object.fromEntries(cells), expected)
  firstAttempt = { expected, ids: new Set(seen) }
  const weak = Object.values(expected).filter((verdict) => verdict === 'weak').length
  assert.ok(weak > 0)
  assert.match(await page.locator('[data-grammar-diagnostic-summary] h2').innerText(), new RegExp(`^弱点は ${weak}単元$`))
  assert.deepEqual(await overflow(), [], '結果の画面')
  // 一覧は最初の5単元、残りは開く。
  assert.equal(await page.locator('[data-grammar-diagnostic-unit]').count(), Math.min(5, weak))
  if (weak > 5) {
    await page.locator('button', { hasText: /^残り/ }).click()
    assert.equal(await page.locator('[data-grammar-diagnostic-unit]').count(), weak)
  }
  assert.equal(await page.locator('[data-grammar-diagnostic-weak-test]').count(), weak > 1 ? 1 : 0)

  // 弱点の四角を押すと、その単元の2問の正誤が出る。
  const weakKey = Object.keys(expected).find((key) => expected[key] === 'weak')
  await page.click(`[data-grammar-diagnostic-cell="${weakKey}"]`)
  assert.equal(await page.locator(`[data-grammar-diagnostic-sheet="${weakKey}"] [data-grammar-diagnostic-answer]`).count(), 2)
  // 参考書へ進み、戻ると同じ単元を開いたまま。
  await page.locator(`[data-grammar-diagnostic-sheet="${weakKey}"] button`, { hasText: '参考書で学習' }).click()
  await waitScreen('grammarReference')
  const [level, topic] = weakKey.split('|')
  assert.ok((await page.locator('.study-app-content').innerText()).includes(topic))
  await page.evaluate(() => window.__diagnosticTest.store.getState().back())
  await waitScreen('grammarDiagnostic')
  assert.equal(await page.locator(`[data-grammar-diagnostic-sheet="${weakKey}"]`).count(), 1)
  // 単元のテストは、その単元の問題で、診断の記録には入らない。
  const before = await page.evaluate(() => JSON.stringify(window.__diagnosticTest.store.getState().grammarDiagnostic))
  await page.locator(`[data-grammar-diagnostic-sheet="${weakKey}"] button`, { hasText: 'この単元をテスト' }).click()
  await waitScreen('grammarQuiz')
  const source = await page.evaluate(() => window.__diagnosticTest.store.getState().params.source)
  assert.deepEqual(source, { type: 'grammar', level, topic, questionType: 'mixed' })
  await page.locator('.study-app-content button', { hasText: 'わからない' }).click()
  assert.equal(await page.evaluate(() => JSON.stringify(window.__diagnosticTest.store.getState().grammarDiagnostic)), before)
  // 文法のトップの入口に、解き終えた診断の弱点の数が出る。
  await page.evaluate(() => window.__diagnosticTest.store.getState().navigate('grammar'))
  await waitScreen('grammar')
  assert.match(await page.locator('[data-grammar-diagnostic-entry]').innerText(), new RegExp(`弱点 ${weak}単元`))
})

test('受け直すと前の回と別の問題が出て、これまでの回の一覧から第1回の結果を開ける', async () => {
  assert.ok(firstAttempt, '第1回のテストが先に通っていること')
  await page.evaluate(() => window.__diagnosticTest.store.getState().navigate('grammarDiagnostic', { view: 'start' }))
  await waitScreen('grammarDiagnostic')
  await page.click('[data-grammar-diagnostic-scope="high"]')
  assert.match(await page.locator('[data-grammar-diagnostic-begin]').innerText(), /第2回/)
  await page.click('[data-grammar-diagnostic-begin]')
  await waitScreen('grammarQuiz')
  const ids = await page.evaluate(() => window.__diagnosticTest.store.getState().params.source.ids)
  assert.equal(ids.length, 10)
  assert.deepEqual(ids.filter((id) => firstAttempt.ids.has(id)), [], '第1回と同じ問題が出た')
  for (let index = 0; index < ids.length; index += 1) {
    await page.locator('.study-app-content button', { hasText: 'わからない' }).click()
    await page.locator('.study-app-content button').filter({ hasText: /^(次へ|結果を見る)/ }).last().click()
  }
  await waitScreen('sessionResult')
  await page.locator('button', { hasText: '診断の結果へ' }).click()
  await waitScreen('grammarDiagnostic')
  // これまでの回：第2回（途中）と第1回。
  const rows = await page.$$eval('[data-grammar-diagnostic-attempt]', (buttons) => buttons.map((button) => [button.dataset.grammarDiagnosticAttempt, button.innerText]))
  assert.deepEqual(rows.map(([attempt]) => attempt), ['1', '0'])
  assert.match(rows[0][1], /第2回・高校入試[\s\S]*途中 10\/43単元/)
  const firstWeak = Object.values(firstAttempt.expected).filter((verdict) => verdict === 'weak').length
  assert.match(rows[1][1], new RegExp(`第1回・高校入試[\\s\\S]*弱点 ${firstWeak}[\\s\\S]*43単元・正答率`))
  // 第1回を開くと、その回の答えのままのマップ。
  await page.click('[data-grammar-diagnostic-attempt="0"]')
  await settle()
  assert.equal(await page.locator('[data-grammar-diagnostic-past]').count(), 1)
  assert.equal(await page.locator('[data-grammar-diagnostic-next]').count(), 0)
  const cells = await page.$$eval('[data-grammar-diagnostic-cell]', (buttons) => buttons.map((button) => [button.dataset.grammarDiagnosticCell, button.dataset.verdict]))
  assert.deepEqual(Object.fromEntries(cells), firstAttempt.expected)
  assert.deepEqual(await overflow(), [], '履歴から開いた回の結果')
  // いまの回へ戻ると、続きを解くボタンと第2回の出来。
  await page.locator('button', { hasText: 'いまの回の結果へ戻る' }).click()
  await settle()
  assert.equal(await page.locator('[data-grammar-diagnostic-next]').count(), 1)
  assert.equal(await page.locator('[data-grammar-diagnostic-cell][data-verdict="todo"]').count(), 33)
})

test('難関大の全127単元・25系統・7級のマップが375pxに収まる', async () => {
  await page.evaluate(() => {
    const { store, diagnostic } = window.__diagnosticTest
    let record = diagnostic.startGrammarDiagnostic(null, 'nankan', 0)
    for (let n = 0; n < 40; n += 1) {
      const ids = diagnostic.nextGrammarDiagnosticRound(record)
      if (!ids.length) break
      ids.forEach((id, index) => { record = diagnostic.recordGrammarDiagnosticAnswer(record, id, index % 4 !== 0) })
    }
    store.setState({ grammarDiagnostic: record })
    store.getState().navigate('grammarDiagnostic', { view: 'result' })
  })
  await waitScreen('grammarDiagnostic')
  assert.equal(await page.locator('[data-grammar-diagnostic-cell]').count(), 127)
  assert.equal(await page.locator('[data-grammar-diagnostic-cell][data-verdict="todo"]').count(), 0)
  const columns = await page.$$eval('[data-grammar-diagnostic-map] > span', (spans) => spans.slice(1, 8).map((span) => span.textContent))
  assert.deepEqual(columns, ['5級', '4級', '3級', '準2級', '2級', '準1級', '1級'])
  assert.deepEqual(await overflow(), [], '難関大の結果の画面')
})
