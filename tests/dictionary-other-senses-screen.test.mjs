// 辞書の検索で、ほかの意味で当たった語の行に当たった意味が出ることを、画面で確かめる
// （requests/2026-10-02-dictionary-search-other-senses.json の result-row-shows-sense）。
// 375px の幅の Chromium で動かし、次を確かめる。
//   辞書の語   … 「権利」で right の行に「ほかの意味」と品詞・「権利」が出る。代表義で当たった行には出さない
//   働きの意味 … 「そしてその人は」で who の行に「文の中での働き」と（関係代名詞・継続用法）が出る
//   自作カード … ほかの意味の欄の訳語で、自作カードの英単語の行に当たったほかの意味が出る
//   幅         … どの検索結果も横にはみ出さない
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'

let ui

before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-dictionary-other-senses-test' })
})

after(async () => {
  await ui?.close()
})

async function search(query, rowSelector) {
  await ui.open('vocabSearch', {})
  await ui.page.locator('input[placeholder^="単語・熟語・構文・意味で検索"]').fill(query)
  await ui.page.waitForSelector(rowSelector, { timeout: 15_000 })
  await ui.settle()
}

const rowText = (selector) => ui.page.evaluate((target) => {
  const row = document.querySelector(target)
  if (!row) return null
  const sense = row.querySelector('[data-dictionary-other-sense]')
  return { row: row.innerText.replace(/\s+/gu, ' '), sense: sense ? sense.innerText.replace(/\s+/gu, ' ') : null }
}, selector)

test('「権利」で、right の行に当たったほかの意味（品詞と「権利」）が出る', async () => {
  await search('権利', '[data-dictionary-word="right"]')
  const right = await rowText('[data-dictionary-word="right"]')
  assert.ok(right.row.includes('正しい'), right.row)
  assert.ok(right.sense, 'ほかの意味の行がない')
  assert.match(right.sense, /ほかの意味/u)
  assert.match(right.sense, /権利/u)
  assert.match(right.sense, /名/u)
  // 代表義で当たった語（entitle など）の行には、ほかの意味を添えない。
  const entitle = await rowText('[data-dictionary-word="entitle"]')
  assert.ok(entitle, 'entitle が出ない')
  assert.equal(entitle.sense, null)
  await ui.checkWidth('検索「権利」')
})

test('代表義で当たったときは、その語にほかの意味があっても添えない', async () => {
  await search('正しい', '[data-dictionary-word="right"]')
  assert.equal((await rowText('[data-dictionary-word="right"]')).sense, null)
})

test('疑問詞・関係詞の働きの意味で当たったときは「文の中での働き」として出す', async () => {
  await search('そしてその人は', '[data-dictionary-word="who"]')
  const who = await rowText('[data-dictionary-word="who"]')
  assert.ok(who.sense, '働きの行がない')
  assert.match(who.sense, /文の中での働き/u)
  assert.match(who.sense, /（関係代名詞・継続用法）そしてその人は/u)
  await ui.checkWidth('検索「そしてその人は」')
})

test('自作カードの英単語は、ほかの意味の欄の訳語で出て、当たった意味が行に出る', async () => {
  const saved = await ui.act('saveCustomWord', {
    word: 'glimmer',
    meanings: 'かすかな光',
    pos: '名',
    level: '2',
    otherSenses: [{ pos: '動', meaning: 'ちらちら光る' }],
  })
  assert.equal(saved.status, 'saved')
  try {
    const selector = `[data-dictionary-custom-word="${saved.id}"]`
    await search('ちらちら光る', selector)
    const row = await rowText(selector)
    assert.ok(row.row.includes('glimmer') && row.row.includes('かすかな光'), row.row)
    assert.ok(row.sense, 'ほかの意味の行がない')
    assert.match(row.sense, /ほかの意味/u)
    assert.match(row.sense, /ちらちら光る/u)
    await ui.checkWidth('検索「ちらちら光る」')
  } finally {
    await ui.act('deleteCustomWord', saved.id)
  }
})

test('ほかの意味を添えた検索結果は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
