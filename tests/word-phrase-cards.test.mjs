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
  // 1枚ごとに「英検◯級」→「熟語／構文」→見出し→意味の順で並び、「説明」の文字は出さない（2026-10-22 の依頼）。
  const cards = html.split(/(?=<li )/).filter((part) => part.includes('data-word-phrase-card='))
  assert.equal(cards.length, expected.length, label)
  cards.forEach((card, index) => {
    const phrase = expected[index]
    const text = card.replace(/<[^>]+>/g, '\u0001').split('\u0001')
      .map((part) => part.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim())
      .filter(Boolean)
    const level = `英検${levels.getLevel(phrase.level).label}`
    const kind = phrase.kind === 'syntax' ? '構文' : '熟語'
    assert.equal(text[0], level, `${label}: ${phrase.id} の1つ目は級 ${JSON.stringify(text.slice(0, 4))}`)
    assert.equal(text[1], kind, `${label}: ${phrase.id} の2つ目は種類`)
    assert.equal(text[2], phrase.phrase.trim(), `${label}: ${phrase.id} の3つ目は見出し`)
    // 意味は見出しの後（解説の部品が語ごとに分けるので、つなげて比べる）。
    assert.ok(text.slice(3).join('').replace(/\s+/g, '').startsWith(String(phrase.meaning).replace(/\s+/g, '').slice(0, 2)), `${label}: ${phrase.id} の4つ目からは意味 ${JSON.stringify(text.slice(3, 6))}`)
    assert.ok(!text.includes('説明'), `${label}: ${phrase.id} に「説明」の文字`)
    assert.ok(!/<svg/.test(card.replace(/<button[^>]*title="[^"]*"[\s\S]*?<\/button>/, '')), `${label}: ${phrase.id} に矢印`)
  })
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
