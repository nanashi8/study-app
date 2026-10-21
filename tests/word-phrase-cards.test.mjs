// 単語の辞書ページ・暗記カードの裏の「◯◯を含む熟語・構文」「同じ意味の熟語」を、級つきで詳細を開けるカードで出す
// （requests/2026-10-21-word-phrase-cards.json）。全見出し語の欄をサーバーで描いて、全行を確かめる。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test, { after, before } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

let vite
let relations
let detail
let vocab
let phrases
let wordRelations
let levels

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  relations = await vite.ssrLoadModule('/src/components/WordRelations.jsx')
  detail = await vite.ssrLoadModule('/src/components/PhraseDetailSheet.jsx')
  vocab = await vite.ssrLoadModule('/src/data/vocab.js')
  phrases = await vite.ssrLoadModule('/src/lib/wordPhrases.js')
  wordRelations = await vite.ssrLoadModule('/src/lib/wordRelations.js')
  levels = await vite.ssrLoadModule('/src/data/levels.js')
})

after(async () => {
  await vite?.close()
})

const render = (component, props) => renderToStaticMarkup(React.createElement(component, props))
const cardsIn = (html) => [...html.matchAll(/data-word-phrase-card="([^"]+)"/g)].map((match) => match[1])
const levelsIn = (html) => [...html.matchAll(/data-word-phrase-level="([^"]+)"/g)].map((match) => match[1])

/** カードの並び1つを描き、全行がカード・級つき・説明を開くボタンつきかを確かめる。 */
function checkCards(html, expected, label) {
  assert.deepEqual(cardsIn(html), expected.map((phrase) => phrase.id), label)
  assert.deepEqual(levelsIn(html), expected.map((phrase) => phrase.level), label)
  for (const phrase of expected) {
    const level = levels.getLevel(phrase.level)
    assert.ok(level?.label, `${label}: ${phrase.id} の級 ${phrase.level}`)
    assert.ok(html.includes(`英検${level.label}`), `${label}: ${phrase.id}`)
  }
  const buttons = html.match(/aria-label="[^"]*の説明を見る"/g) ?? []
  assert.equal(buttons.length, expected.length, label)
}

test('「◯◯を含む熟語・構文」の全行（ほかの品詞の形の欄・畳んだ欄を含む）が級つきのカード', () => {
  let words = 0
  let rows = 0
  const kinds = { idiom: 0, syntax: 0 }
  for (const word of vocab.ALL_WORDS) {
    const groups = phrases.phraseGroupsForWord(word)
    if (!groups.all.length && !groups.viaForms.length) continue
    words += 1
    const html = render(relations.WordPhraseSection, { word, groups })
    const shown = [...groups.all, ...groups.viaForms.filter((group) => !group.collapsed).flatMap((group) => group.phrases)]
    checkCards(html, shown, word.id)
    // 畳んだ欄は開くと同じカードの並びを出す（FormPhraseGroup の open）。
    for (const group of groups.viaForms.filter((item) => item.collapsed)) {
      checkCards(render(relations.PhraseCardList, { phrases: group.phrases }), group.phrases, `${word.id}/${group.form.word}`)
    }
    for (const phrase of [...groups.all, ...groups.viaForms.flatMap((group) => group.phrases)]) {
      rows += 1
      kinds[phrase.kind] += 1
    }
  }
  assert.equal(words, 1739)
  assert.equal(rows, 6721)
  assert.deepEqual(kinds, { idiom: 6577, syntax: 144 })
})

test('「同じ意味の熟語」の全行も級つきのカード', () => {
  let words = 0
  let rows = 0
  for (const word of vocab.ALL_WORDS) {
    const idioms = wordRelations.idiomEquivalentsFor(word)
    if (!idioms.length) continue
    words += 1
    rows += idioms.length
    checkCards(render(relations.IdiomEquivalentSection, { phrases: idioms }), idioms, word.id)
  }
  assert.equal(words, 356)
  assert.equal(rows, 483)
})

test('カードが開く詳細は、熟語・構文の一覧と同じ中身（級・意味・例文）を全件で出す', () => {
  const unique = new Map()
  for (const word of vocab.ALL_WORDS) {
    const groups = phrases.phraseGroupsForWord(word)
    for (const phrase of [...groups.all, ...groups.viaForms.flatMap((group) => group.phrases), ...wordRelations.idiomEquivalentsFor(word)]) {
      unique.set(phrase.id, phrase)
    }
  }
  assert.ok(unique.size > 0)
  for (const phrase of unique.values()) {
    const html = render(detail.PhraseDetail, { phrase })
    const level = levels.getLevel(phrase.level)
    assert.ok(html.includes(`data-phrase-detail="${phrase.id}"`), phrase.id)
    assert.ok(html.includes(`英検${level.label}`), phrase.id)
    assert.ok(phrase.example?.en && html.includes(phrase.example.en.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')), phrase.id)
  }
})

test('カードを押すとその熟語・構文の詳細シートを開き、熟語・構文の一覧も同じシートを使う', () => {
  const component = read('src/components/WordRelations.jsx')
  assert.match(component, /onClick=\{\(\) => setDetail\(phrase\)\}/)
  assert.match(component, /<PhraseDetailSheet\s+phrase=\{detail\}/)
  assert.match(read('src/screens/Phrases.jsx'), /<PhraseDetailSheet\s+phrase=\{detail\}/)
  // 暗記の途中から同じ形の仲間を学ぶときは、記録を残してから移る。
  const study = read('src/screens/VocabStudy.jsx')
  assert.match(study, /<WordPhraseSection word=\{word\} groups=\{relatedPhrases\} navigateTo=\{saveBeforeReference\}/)
  assert.match(study, /<IdiomEquivalentSection phrases=\{relations\.idioms\} navigateTo=\{saveBeforeReference\}/)
})
