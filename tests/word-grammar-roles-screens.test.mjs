// 疑問詞・関係詞の語の「文の中での働き」を画面で確かめる（requests/2026-10-01-wh-word-grammar-roles.json の screens）。
// 375px の幅の Chromium で動かし、次を確かめる。
//   辞書ページ・暗記カードの裏 … 11語すべてで、意味のすぐ下に働き（疑問詞・関係代名詞など）ごとの意味・形・解説・例文・
//                               参考書の単元が出て、「ほかの意味」の欄に重ならず、横にはみ出さない
//   参考書へのリンク            … 押すとその単元のページが開き、戻ると元の辞書ページ・暗記カードに戻る
//   本文のタップ                … 長文と参考書の本文で who・where を押すと、関係詞の意味が働きつきで出る
//   検索                        … 辞書の検索で「関係代名詞」「関係副詞」から引ける
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { WORD_GRAMMAR_ROLES } from '../src/data/word-grammar-roles.js'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'

const HEADWORDS = Object.keys(WORD_GRAMMAR_ROLES)
let ui

before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-wh-roles-test' })
})

after(async () => {
  await ui?.close()
})

// 画面の働きの欄の中身（働きごとの文字）と、意味の欄・例文の欄との上下の並び。
const rolesOnScreen = () => ui.page.evaluate(() => {
  const box = document.querySelector('[data-word-grammar-roles]')
  if (!box) return null
  const items = [...box.querySelectorAll('[data-word-grammar-role]')].map((item) => item.innerText.replace(/\s+/gu, ' '))
  const links = [...box.querySelectorAll('[data-word-grammar-ref]')].map((button) => button.getAttribute('data-word-grammar-ref'))
  const main = document.querySelector('.study-app-content')
  return { items, links, top: box.getBoundingClientRect().top + main.scrollTop, otherSenses: main.innerText.includes('ほかの意味') }
})

function checkRoles(id, shown, where) {
  const expected = WORD_GRAMMAR_ROLES[id]
  assert.ok(shown, `${where} ${id}: 働きの欄がない`)
  assert.equal(shown.items.length, expected.length, `${where} ${id}: 働きの数`)
  expected.forEach((item, index) => {
    const text = shown.items[index]
    for (const part of [item.role, item.meaning, item.form, item.explain.slice(0, 12), item.example?.en].filter(Boolean)) {
      assert.ok(text.includes(part.replace(/\s+/gu, ' ')), `${where} ${id} ${item.role}: 「${part}」が出ない（${text.slice(0, 80)}）`)
    }
  })
  assert.deepEqual(shown.links, expected.flatMap((item) => item.grammar), `${where} ${id}: 参考書の単元`)
  assert.equal(shown.otherSenses, false, `${where} ${id}: ほかの意味の欄に重ねない`)
}

test('辞書ページ: 11語すべてで、意味のすぐ下に働きごとの意味・形・解説・例文・参考書の単元が出る', async () => {
  for (const id of HEADWORDS) {
    await ui.open('wordDetail', { id })
    await ui.page.waitForSelector('[data-word-grammar-roles]')
    const shown = await rolesOnScreen()
    checkRoles(id, shown, '辞書ページ')
    // 意味（見出しのカード）の次、例文の欄より上に出る。
    const exampleTop = await ui.page.evaluate(() => {
      const main = document.querySelector('.study-app-content')
      const label = [...main.querySelectorAll('div')].find((node) => node.textContent === '例文')
      return label ? label.getBoundingClientRect().top + main.scrollTop : null
    })
    assert.ok(exampleTop === null || shown.top < exampleTop, `辞書ページ ${id}: 例文より上`)
    await ui.checkWidth(`辞書ページ ${id}`)
  }
})

test('暗記カードの裏: 11語すべてで、意味のすぐ下に働きの欄が出る', async () => {
  await ui.act('setContentSetting', null, 'revealAnswers', true)
  try {
    for (const id of HEADWORDS) {
      // 同じ画面のまま開き直すと前のカードが残るので、いったん辞書ページへ移ってから開く。
      await ui.open('wordDetail', { id })
      await ui.open('vocabStudy', { source: { type: 'mylist', ids: [id] }, title: '疑問詞・関係詞', mode: 'study' })
      await ui.page.waitForSelector('[data-word-grammar-roles]')
      checkRoles(id, await rolesOnScreen(), '暗記カード')
      await ui.checkWidth(`暗記カード ${id}`)
    }
  } finally {
    await ui.act('setContentSetting', null, 'revealAnswers', false)
  }
})

test('参考書へのリンクを押すと単元のページが開き、戻ると元の辞書ページ・暗記カードに戻る', async () => {
  const back = () => ui.page.evaluate(() => window.__customTest.store.getState().back())

  await ui.open('wordDetail', { id: 'who' })
  await ui.page.locator('[data-word-grammar-ref="gref_3_relative"]').first().click()
  await ui.waitScreen('grammarReference')
  assert.equal((await ui.current()).params.unitId, 'gref_3_relative')
  assert.ok((await ui.mainText()).includes('関係代名詞（who / which / that）'))
  await back()
  await ui.waitScreen('wordDetail')
  assert.equal((await ui.current()).params.id, 'who')
  await ui.page.waitForSelector('[data-word-grammar-roles]')

  await ui.act('setContentSetting', null, 'revealAnswers', true)
  try {
    await ui.open('vocabStudy', { source: { type: 'mylist', ids: ['which'] }, title: '疑問詞・関係詞', mode: 'study' })
    await ui.page.locator('[data-word-grammar-ref="gref_pre2_preprel"]').first().click()
    await ui.waitScreen('grammarReference')
    assert.equal((await ui.current()).params.unitId, 'gref_pre2_preprel')
    await back()
    await ui.waitScreen('vocabStudy')
    await ui.page.waitForSelector('[data-word-grammar-roles]')
    const shown = await rolesOnScreen()
    assert.ok(shown.items[0].includes('どれ・どちら'), '戻ると which のカードのまま')
  } finally {
    await ui.act('setContentSetting', null, 'revealAnswers', false)
  }
})

test('長文と参考書の本文で語を押すと、関係詞の意味が働きつきで出る', async () => {
  // 長文：older people who knew … の who
  await ui.open('reader', { passageId: 'p_3_school_garden' })
  await ui.page.locator('.study-app-content button', { hasText: 'older people who knew many useful farming tips' }).first().click()
  await ui.page.locator('[data-reading-role-sentence] button', { hasText: /^who$/u }).first().click()
  await ui.page.waitForFunction(() => document.body.innerText.includes('（関係代名詞）〜する(人)'))
  assert.ok((await ui.page.evaluate(() => document.body.innerText)).includes('（疑問詞）誰が・誰'))
  await ui.checkWidth('長文のタップ')

  // 参考書：関係副詞の単元の where
  await ui.open('grammarReference', { unitId: 'gref_pre2_reladv' })
  await ui.page.locator('[data-grammar-ref-word="where"]').first().click()
  await ui.page.waitForSelector('[data-grammar-ref-peek]')
  const peek = await ui.page.evaluate(() => document.querySelector('[data-grammar-ref-peek]').innerText)
  assert.ok(peek.includes('（関係副詞）〜する(場所)'), peek)
  await ui.checkWidth('参考書のタップ')
})

test('辞書の検索で「関係代名詞」「関係副詞」から引ける', async () => {
  for (const [query, ids] of [['関係代名詞', ['who', 'whom', 'whose', 'which', 'what', 'that']], ['関係副詞', ['when', 'where', 'why', 'how']]]) {
    await ui.open('vocabSearch', {})
    const input = ui.page.locator('input[placeholder^="単語・熟語・構文・意味で検索"]')
    await input.fill(query)
    await ui.page.waitForFunction((words) => {
      const text = document.querySelector('.study-app-content').innerText
      return words.every((word) => new RegExp(`(^|\\n)${word}(\\s|$)`, 'u').test(text))
    }, ids, { timeout: 15_000 })
    await ui.checkWidth(`検索 ${query}`)
  }
})

test('働きの欄のある画面は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
