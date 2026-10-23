// 品詞・級・分野を「ー」のまま登録した英単語のカードを、実ブラウザ（375px）で開く（依頼台帳 requests/2026-10-23-custom-card-unset-attrs.json）。
// 登録の画面の選択欄の既定が「ー」で、辞書ページ・暗記カード・テスト・一覧が落ちずに「級ー」と出る。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

import { entryValues, startCustomCardBrowser } from './custom-cards-browser.mjs'

let ui
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-unset-test' })
})
after(async () => {
  await ui?.close()
})

const BARE = entryValues({ front: 'sunriseglow', back: '朝焼けの光', posId: '', level: '', field: '' })

async function bareId() {
  const words = (await ui.state(['customWords'])).customWords
  const found = words.find((word) => word.word === 'sunriseglow')
  if (found) return found.id
  const result = await ui.act('saveCustomEntry', { template: 'english', category: 'subject:english', values: BARE })
  assert.equal(result.status, 'saved')
  return result.id
}

test('「ー」のまま登録でき、品詞・級・分野は空で残る', async () => {
  const id = await bareId()
  const word = (await ui.state(['customWords'])).customWords.find((item) => item.id === id)
  assert.deepEqual([word.pos, word.level, word.field], ['', '', ''])
})

test('「ー」で登録したカードの編集画面は、品詞・級・分野が「ー」のまま', async () => {
  const id = await bareId()
  await ui.open('customWords', { form: { kind: 'word', id } })
  await ui.page.waitForSelector('[data-custom-card-input="level"]')
  const shown = await ui.page.evaluate(() => ['posId', 'level', 'field'].map((key) => {
    const select = document.querySelector(`[data-custom-card-input="${key}"]`)
    return select ? { value: select.value, text: select.selectedOptions[0]?.textContent } : null
  }))
  assert.ok(shown.every(Boolean), '英単語の登録欄が3つとも出る')
  for (const item of shown) assert.deepEqual(item, { value: '', text: 'ー' })
  await ui.checkWidth('登録の画面')
})

test('新しく作る英単語の登録画面も、品詞・級・分野が「ー」が既定', async () => {
  await ui.open('customWords', { form: { category: 'subject:english' } })
  await ui.page.waitForSelector('[data-custom-card-input="level"]')
  const shown = await ui.page.evaluate(() => ['posId', 'level', 'field'].map((key) => {
    const select = document.querySelector(`[data-custom-card-input="${key}"]`)
    return select ? { value: select.value, text: select.selectedOptions[0]?.textContent } : null
  }))
  for (const item of shown) assert.deepEqual(item, { value: '', text: 'ー' })
})

test('辞書ページ・暗記カード・テスト・一覧が、級ー・品詞なしで落ちずに出る', async () => {
  const id = await bareId()
  await ui.open('wordDetail', { id })
  let text = await ui.mainText()
  assert.ok(text.includes('sunriseglow') && text.includes('級ー'), '辞書ページ')
  await ui.checkWidth('辞書ページ')
  await ui.open('vocabStudy', { source: { type: 'mylist', ids: [id] }, title: 'ー', mode: 'study' })
  text = await ui.mainText()
  assert.ok(text.includes('sunriseglow') && text.includes('級ー'), '暗記カード')
  await ui.checkWidth('暗記カード')
  await ui.open('vocabQuiz', { source: { type: 'mylist', ids: [id] }, title: 'ー', mode: 'quiz' })
  text = await ui.mainText()
  assert.ok(text.includes('朝焼けの光') || text.includes('sunriseglow'), 'テスト')
  await ui.checkWidth('テスト')
  await ui.open('customWords', {})
  text = await ui.mainText()
  assert.ok(!text.includes('画面の読み込みに失敗'))
  await ui.checkWidth('自作カードの入口')
})

test('375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
