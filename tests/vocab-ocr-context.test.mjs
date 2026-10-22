// 「教科書から単語追加」の読み取りで、saw のように見出し語でもあり別の見出し語の変化形でもある語を、文脈（前後の語）から
// 読み分ける依頼（requests/2026-10-13-camera-ocr-japanese.json の context-inflection）の受け入れ条件。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import nlp from 'compromise/two'

import { IRREGULAR_WORD_FORMS } from '../src/data/phrase-irregular-links.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import { CONTEXT_FORMS, contextReadingAt, createContextReading, tagEnglishText } from '../src/lib/ocrContext.js'
import { matchOcrTextToWords } from '../src/lib/vocabOcr.js'

const { labels } = JSON.parse(readFileSync(new URL('./fixtures/vocab-ocr/context-labels.json', import.meta.url), 'utf8'))
const ids = new Set(ALL_WORDS.map((word) => word.id))
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))

// 読み分ける並び：IRREGULAR_WORD_FORMS の不規則形のうち、別のカードと同じつづりになるもの。be・do・have の形で、そのカード自体が
// 動詞の変化形のカード（is・was・did・had…）は読み分けない（being ＝ 存在 は名詞のカードなので読み分ける）。比較級・最上級（better・
// most…、元の語が形容詞・副詞）もそのままのカードがよいので読み分けない。
function formsSpelledLikeAnotherCard() {
  const cardsBySpelling = new Map()
  for (const word of ALL_WORDS) {
    const spelling = String(word.word).toLowerCase()
    cardsBySpelling.set(spelling, [...(cardsBySpelling.get(spelling) ?? []), word])
  }
  const forms = new Set()
  for (const [baseId, list] of Object.entries(IRREGULAR_WORD_FORMS)) {
    const base = byId.get(baseId)
    if (!base || ['形', '副'].includes(base.pos)) continue
    for (const form of list) {
      const others = (cardsBySpelling.get(form) ?? []).filter((card) => card.id !== baseId)
      if (!others.length) continue
      if (['be', 'do', 'have'].includes(baseId) && others.every((card) => card.pos === '動')) continue
      forms.add(form)
    }
  }
  return forms
}

test('読み分ける並びは、不規則形が別のカードと同じつづりになる全件（16語）', () => {
  assert.deepEqual([...CONTEXT_FORMS].sort(), [...formsSpelledLikeAnotherCard()].sort())
  assert.equal(CONTEXT_FORMS.length, 16)
})

test('正解の表（辞書の全例文 280・手作り 39・決まりを作るのに使わなかった文 40・長文 49）の全 408 か所で、正しいカードを選ぶ', () => {
  const counts = {}
  for (const label of labels) counts[label.source] = (counts[label.source] ?? 0) + 1
  assert.deepEqual(counts, { dictionary: 280, hand: 39, heldout: 40, passage: 49 })
  const wrong = []
  for (const label of labels) {
    assert.ok(ids.has(label.expected), `${label.expected} のカードがない`)
    assert.ok(CONTEXT_FORMS.includes(label.form), label.form)
    const words = tagEnglishText(nlp, label.en)
    const starts = [...label.en.matchAll(new RegExp(`(?<![A-Za-z])${label.form}(?![A-Za-z])`, 'gi'))].map((match) => match.index)
    const got = contextReadingAt(words, starts[label.nth], label.form, (id) => ids.has(id)) ?? label.form
    if (got !== label.expected) wrong.push(`${label.form}: ${label.expected} ≠ ${got} | ${label.en}`)
  }
  assert.deepEqual(wrong, [])
})

test('正解の表は、16語のそれぞれについて、ほかのカードの読みも1件以上ふくむ', () => {
  for (const form of CONTEXT_FORMS) {
    const expected = new Set(labels.filter((label) => label.form === form).map((label) => label.expected))
    assert.ok(expected.size >= 2, `${form}: ${[...expected]}`)
  }
})

test('写真の文字から候補を作るとき、文脈で読み分けたカードを出す（saw → see・のこぎり、left → 左・残る・去る）', () => {
  const text = '動物園でセイウチを見ました。\nEmi saw a walrus at the zoo.\nHe cut the board with a saw.\nTurn left at the corner. She left the room. Only two tickets are left.'
  const match = matchOcrTextToWords(text, ALL_WORDS, { contextReading: createContextReading(nlp, text, ALL_WORDS) })
  const ids = match.candidates.map((item) => item.id)
  for (const id of ['see', 'saw', 'left', 'leave', 'left_2']) assert.ok(ids.includes(id), id)
  assert.deepEqual(match.candidates.find((item) => item.id === 'see').observed, ['saw'])
  // 文脈がないとき（品詞の道具を読み込めなかったなど）は、これまでどおりそのままの見出し語。
  const plain = matchOcrTextToWords('Emi saw a walrus.', ALL_WORDS)
  assert.ok(plain.candidates.some((item) => item.id === 'saw'))
})

test('画面は品詞の道具を読み取りのときに読み込み、候補を作るたびに文脈の読み分けを渡す', () => {
  // 読み込みは写真を読む共通の部品（教科書から単語追加と自作カードの「写真から作る」。2026-10-22 に VocabCamera.jsx から移した）。
  const picker = readFileSync(new URL('../src/components/PhotoOcrPicker.jsx', import.meta.url), 'utf8')
  assert.match(picker, /loadEnglishTagger\(\)/)
  const screen = readFileSync(new URL('../src/screens/VocabCamera.jsx', import.meta.url), 'utf8')
  assert.match(screen, /usePhotoOcr\(/)
  assert.match(screen, /contextReading: taggerRef\.current \? createContextReading\(taggerRef\.current, text, ALL_WORDS\) : null/)
  const photo = readFileSync(new URL('../src/components/CustomCardPhoto.jsx', import.meta.url), 'utf8')
  assert.match(photo, /usePhotoOcr\(/)
  assert.match(photo, /contextReading: info\?\.tagger \? \(joined\) => createContextReading\(info\.tagger, joined, ALL_WORDS\) : null/)
  const source = readFileSync(new URL('../src/lib/ocrContext.js', import.meta.url), 'utf8')
  assert.match(source, /import\('compromise\/two'\)/)
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  assert.ok(packageJson.dependencies.compromise)
})
