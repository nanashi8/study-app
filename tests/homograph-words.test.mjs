import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { quizMeaning } from '../src/data/compact.js'
import { HOMOGRAPH_WORDS } from '../src/data/homograph-words.js'
import { resolvePassageWord } from '../src/data/passage-gloss.js'
import {
  ALL_WORDS,
  etymologyStoryForWord,
  getWord,
  homographsFor,
  pickDistractors,
  wordsByLevel,
} from '../src/data/vocab.js'
import { WORD_SENSES } from '../src/data/word-senses.js'
import { searchDictionary } from '../src/lib/dictionary.js'
import { phrasesForWord } from '../src/lib/wordPhrases.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const seeded = (seed) => {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
}

test('同じつづりの別の語は、元の語のカードの一枠ではなく独立した見出し語になっている', () => {
  assert.equal(HOMOGRAPH_WORDS.length, 78)
  // ほかの意味の欄には、同じ語の意味の枝分かれだけを置く。
  for (const [id, senses] of Object.entries(WORD_SENSES)) {
    assert.equal(senses.some((sense) => 'separateWord' in sense || 'note' in sense), false, id)
  }
  const ids = new Set(ALL_WORDS.map((word) => word.id))
  for (const entry of HOMOGRAPH_WORDS) {
    const word = getWord(entry.id)
    const base = getWord(entry.homographOf)
    assert.ok(ids.has(entry.id), entry.id)
    assert.equal(word.word, base.word.toLowerCase(), entry.id)
    // 級・発音・学習の記録は元の語と別に持つ（つづりで引く級の補正は当てない）。
    assert.equal(word.level, entry.level, entry.id)
    assert.ok(wordsByLevel(entry.level).includes(word), `${entry.id}: 級の一覧`)
    assert.ok(word.phonetic, `${entry.id}: 発音記号`)
    assert.ok(word.compression.packId.startsWith('homograph:'), entry.id)
    // 元の語とも、同じつづりのほかの別の語（row の row_2 と row_3 など）とも互いにリンクする。
    const siblings = HOMOGRAPH_WORDS.filter((other) => other.homographOf === entry.homographOf && other.id !== entry.id).map((other) => other.id)
    assert.deepEqual(homographsFor(word).map((other) => other.id), [base.id, ...siblings], entry.id)
    assert.ok(homographsFor(base).some((other) => other.id === entry.id), entry.id)
    // 語の成り立ちは自分の本文を持ち、元の語とは別の語だと書く。
    const story = etymologyStoryForWord(word)
    assert.ok(story, `${entry.id}: 語の成り立ち`)
    assert.notEqual(story.note, etymologyStoryForWord(base)?.note, entry.id)
    assert.match(story.note, /別の語/, entry.id)
  }
})

test('辞書で意味から引け、同じつづりの語は元の語の次に並ぶ', () => {
  const hits = (query) => searchDictionary(query, { type: 'word' }).map((entry) => entry.word.id)
  assert.ok(hits('樹皮').includes('bark_2'))
  assert.ok(hits('蛇口').includes('tap_2'))
  assert.ok(hits('歯茎').includes('gum_2'))
  assert.ok(hits('口論').includes('row_2'))
  assert.deepEqual(hits('bark').slice(0, 2), ['bark', 'bark_2'])
})

test('発音がちがう別の語は、自分の発音記号を持つ', () => {
  assert.equal(getWord('row').phonetic, '/ˈɹoʊ/')
  assert.equal(getWord('row_2').phonetic, '/ˈɹaʊ/')
})

test('テストの誤答に、同じつづりの語やその語の意味を出さない', () => {
  const core = (text) => String(text).replace(/[（(][^）)]*[）)]/gu, '').trim()
  for (const entry of HOMOGRAPH_WORDS) {
    for (const word of [getWord(entry.id), getWord(entry.homographOf)]) {
      const spelling = word.word.toLowerCase()
      // 画面の英単語（つづり）から見て正解になる意味。同じつづりの別の語の意味も入る。
      const spellingSenses = new Set(
        [word, ...homographsFor(word)]
          .flatMap((item) => [item.meaning, ...item.otherSenses.map((sense) => sense.meaning)])
          .flatMap((meaning) => meaning.split('・'))
          .map(core),
      )
      for (let seed = 1; seed <= 12; seed += 1) {
        for (const candidate of pickDistractors(word, 2, seeded(seed))) {
          assert.notEqual(candidate.word.toLowerCase(), spelling, `${word.id}: ${candidate.id}`)
          assert.equal(spellingSenses.has(core(quizMeaning(candidate))), false, `${word.id}: ${candidate.id}`)
        }
      }
    }
  }
  // 「樹皮」は bark のつづりから見て正解なので、「ほえる」の bark の誤答にも出さない。
  const barkChoices = new Set()
  for (let seed = 1; seed <= 200; seed += 1) {
    for (const candidate of pickDistractors(getWord('bark'), 2, seeded(seed))) barkChoices.add(candidate.meanings[0])
  }
  assert.equal(barkChoices.has('樹皮'), false)
})

test('熟語は、その意味で使う方の語のカードに出す', () => {
  const phrases = (id) => phrasesForWord(getWord(id)).map((phrase) => phrase.phrase)
  assert.ok(phrases('may_2').includes('come what may'))
  assert.equal(phrases('may').includes('come what may'), false)
  assert.deepEqual(phrases('shed_2'), ['shed light on'])
  assert.equal(phrases('shed').includes('shed light on'), false)
  assert.ok(phrases('light').includes('shed light on'))
  assert.ok(phrases('lie_2').includes('lie in'))
  // 書いた熟語は、どれもその語のつづりを含み、その語のカードに出る。
  for (const entry of HOMOGRAPH_WORDS) {
    assert.deepEqual(
      new Set(phrasesForWord(getWord(entry.id)).map((phrase) => phrase.id)),
      new Set(entry.phraseIds ?? []),
      entry.id,
    )
  }
})

test('長文の語注は、同じつづりの別の語の意味も続けて並べる', () => {
  assert.match(resolvePassageWord('bark').ja, /ほえる.*樹皮/)
  assert.match(resolvePassageWord('well').ja, /上手に.*井戸/)
})

test('単語カードと辞書ページは、同じつづりの別の語へのリンクを出す', () => {
  assert.match(read('src/components/WordBits.jsx'), /data-homograph-words/)
  assert.match(read('src/screens/WordDetail.jsx'), /<HomographWords word=\{word\} onWord=\{openWord\} \/>/)
  const study = read('src/screens/VocabStudy.jsx')
  assert.match(study, /<HomographWords word=\{word\} onWord=\{openRelatedWord\} \/>/)
  assert.match(study, /data-vocab-homograph-note/)
})
