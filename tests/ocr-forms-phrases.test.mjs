// 写真の読み取りで、単語の変化形（過去形・過去分詞など）から元の見出し語を、文の中の熟語・構文をその熟語として候補に出す依頼
// （requests/2026-11-03-ocr-forms-and-phrases.json）の受け入れ条件。
//   forms-all-headwords  全見出し語の変化形が、元の見出し語の候補になる
//   phrases-all          文法の例文カードを除く全部の熟語・構文が、例文と過去形にした文の中で見つかる
//   screens              写真から作る（英単語のテンプレート）が熟語・変化形の候補を作る（教科書から単語追加の画面は
//                        tests/vocab-camera-dev-ocr.test.mjs が動かす）
// 外したものと理由は tests/fixtures/vocab-ocr/forms-phrases-exclusions.json に1件ずつ書く。台帳と結果がずれたら止める。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import nlp from 'compromise'

import { ALL_WORDS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { IRREGULAR_WORD_FORMS } from '../src/data/phrase-irregular-links.js'
import { IRREGULAR_PLURALS } from '../src/data/duplicate-forms.js'
import { matchOcrTextToWords } from '../src/lib/vocabOcr.js'
import { OCR_IRREGULAR_FORMS, wordFormIndex } from '../src/lib/ocrWordForms.js'
import { matchOcrTextToPhrases, phrasePatterns } from '../src/lib/ocrPhrases.js'
import { buildPhotoCardCandidates } from '../src/lib/customCardsPhoto.js'
import { ENGLISH_TEMPLATE_ID } from '../src/lib/customCards.js'
import { englishWordSetForTests } from './english-word-set.mjs'

const LEDGER = JSON.parse(readFileSync(new URL('./fixtures/vocab-ocr/forms-phrases-exclusions.json', import.meta.url), 'utf8'))
const forms = wordFormIndex(ALL_WORDS)
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
const headwords = ALL_WORDS.filter((word) => /^[a-z]+$/.test(word.word))

// 確かめる変化形の組（見出し語 id > 形）。(1) この仕組みが作る形（品詞ごとのつづりの決まりと不規則な形の台帳）全部と、
// (2) 別の道具 compromise が作る変化形のうち、英語の単語表（SCOWL）にある実在の形。
function formPairs(english) {
  const pairs = new Map()
  const add = (word, form, source) => {
    form = String(form ?? '').toLowerCase()
    if (!/^[a-z]+$/.test(form) || form === word.word) return
    const key = `${word.id}>${form}`
    if (!pairs.has(key)) pairs.set(key, { word, form, source })
  }
  for (const word of headwords) {
    for (const form of forms.formsOfWord(word.id)) add(word, form, 'own')
    let made = []
    if (word.pos === '動') {
      const c = nlp(word.word).verbs().conjugate()[0] ?? {}
      made = [c.PastTense, c.PresentTense, c.Gerund, c.Participle]
    } else if (word.pos === '名') {
      made = [nlp(word.word).nouns().toPlural().text()]
    } else if (word.pos === '形' || word.pos === '副') {
      const c = nlp(word.word).adjectives().conjugate()[0] ?? {}
      made = [c.Comparative, c.Superlative]
    }
    for (const form of made) if (english.has(String(form ?? '').toLowerCase())) add(word, form, 'compromise')
  }
  return pairs
}

test('forms-all-headwords：全見出し語の変化形を読むと、元の見出し語が候補に出る（外したものは台帳の理由つき）', () => {
  const english = englishWordSetForTests()
  const pairs = formPairs(english)
  const missed = []
  for (const [key, { word, form }] of pairs) {
    const result = matchOcrTextToWords(form, ALL_WORDS)
    if (!result.candidates.some((item) => item.id === word.id)) missed.push(key)
  }
  const own = [...pairs.values()].filter((pair) => pair.source === 'own').length
  console.log(`見出し語 ${headwords.length}語・変化形 ${pairs.size}組（この仕組みの形 ${own}組・compromise の実在の形 ${pairs.size - own}組）・外した ${missed.length}組`)
  assert.ok(headwords.length >= 8800, `見出し語 ${headwords.length}`)
  assert.ok(pairs.size >= 16000, `変化形 ${pairs.size}`)
  assert.deepEqual(missed.sort(), Object.keys(LEDGER.formExclusions).sort(), '台帳にない取りこぼし、または取りこぼさなくなった台帳の行')
  // この仕組みが作る形は1つも外さない。
  assert.deepEqual(missed.filter((key) => pairs.get(key).source === 'own'), [])
})

test('forms-all-headwords：不規則な形の台帳は全件、元の見出し語へ戻る。読み取りだけの不規則形の id は辞書にある', () => {
  for (const id of Object.keys(OCR_IRREGULAR_FORMS)) assert.ok(byId.has(id), id)
  const entries = [
    ...Object.entries(IRREGULAR_WORD_FORMS).flatMap(([id, list]) => list.map((form) => [id, form])),
    ...Object.entries(OCR_IRREGULAR_FORMS).flatMap(([id, list]) => list.map((form) => [id, form])),
  ]
  const missed = []
  for (const [id, form] of entries) {
    if (!matchOcrTextToWords(form, ALL_WORDS).candidates.some((item) => item.id === id)) missed.push(`${id}>${form}`)
  }
  for (const [plural, singular] of Object.entries(IRREGULAR_PLURALS)) {
    const word = ALL_WORDS.find((item) => item.word === singular)
    if (word && !matchOcrTextToWords(plural, ALL_WORDS).candidates.some((item) => item.word === undefined || item.headword === singular)) missed.push(`${singular}>${plural}`)
  }
  console.log(`不規則な形 ${entries.length + Object.keys(IRREGULAR_PLURALS).length}件`)
  assert.deepEqual(missed, [])
})

test('forms-all-headwords：変化形が別の見出し語と同じつづりなら、その語に加えて元の語も最初は選ばない候補に出す', () => {
  const result = matchOcrTextToWords('found left rose', ALL_WORDS)
  const item = (id) => result.candidates.find((candidate) => candidate.id === id)
  assert.equal(item('found')?.alternative, false)
  assert.equal(item('find')?.alternative, true)
  assert.deepEqual(item('find')?.observed, ['found'])
  assert.equal(item('leave')?.alternative, true)
  assert.equal(item('rise')?.alternative, true)
  // 変化形だけの語（took・children・bigger）は、元の語をそのまま選ぶ候補にする。
  const plain = matchOcrTextToWords('took children bigger studied', ALL_WORDS).candidates
  for (const head of ['take', 'child', 'big', 'study']) {
    const candidate = plain.find((entry) => entry.headword === head)
    assert.ok(candidate && !candidate.alternative, head)
  }
  // 品詞の変化形でない並び（evening を even の ing 形にしない）。
  assert.equal(matchOcrTextToWords('evening', ALL_WORDS).candidates.some((entry) => entry.headword === 'even'), false)
})

// 照らす型から、空きを埋めて先頭の動詞を過去形にした文を作る。
const PAST = { "'re": 'were', "'m": 'was', "'s": 'was', be: 'was', is: 'was', are: 'were', am: 'was', have: 'had', has: 'had', do: 'did', can: 'could', will: 'would', may: 'might', shall: 'should' }
function pastOf(head) {
  if (PAST[head]) return PAST[head]
  const verb = ALL_WORDS.find((word) => word.word === head && word.pos === '動')
  if (!verb) return null
  const irregular = IRREGULAR_WORD_FORMS[verb.id] ?? OCR_IRREGULAR_FORMS[verb.id]
  if (irregular) return irregular[0] ?? head
  return [...forms.formsOfWord(verb.id)].find((form) => form.endsWith('ed')) ?? null
}
const FILL = { det: 'the', poss: 'my', refl: 'myself', pron: 'he', ing: 'reading', any: 'go', comp: 'more', gap: 'the man' }
function pastSentence(pattern) {
  let seenVerb = false
  let past = false
  const words = pattern.elements.map((element) => {
    if (element.type !== 'word' && element.type !== 'opt') return FILL[element.type]
    const head = element.head.split('/')[0]
    const form = !seenVerb && element.verb ? pastOf(head) : null
    if (element.verb) seenVerb = true
    if (form && element.set.has(form)) {
      past = true
      return form
    }
    return head
  })
  return { text: `${words.join(' ').replace(/ '/g, "'")}.`, past }
}

test('phrases-all：文法の例文カードを除く全部の熟語・構文を、その例文の中で見つける（外したものは台帳の理由つき）', () => {
  const population = PHRASES.filter((phrase) => phrase.category !== 'grammar-example')
  const { patterns, skipped } = phrasePatterns(PHRASES, ALL_WORDS)
  const compiled = new Set(patterns.map((pattern) => pattern.phrase.id))
  assert.deepEqual(population.filter((phrase) => !compiled.has(phrase.id)).map((phrase) => phrase.id).sort(), skipped.map((item) => item.phrase.id).sort())
  assert.deepEqual(skipped.map((item) => item.phrase.id).sort(), Object.keys(LEDGER.phraseSkipped).sort())
  const missed = []
  for (const phrase of population.filter((item) => compiled.has(item.id))) {
    const found = matchOcrTextToPhrases(phrase.example.en, PHRASES, ALL_WORDS)
    if (!found.some((item) => item.id === phrase.id)) missed.push(phrase.id)
  }
  console.log(`熟語・構文 ${population.length}件・照らす ${compiled.size}件・例文で見つけた ${compiled.size - missed.length}件`)
  assert.ok(population.length >= 1950, `熟語・構文 ${population.length}`)
  assert.deepEqual(missed.sort(), Object.keys(LEDGER.phraseExampleExclusions).sort())
})

test('phrases-all：空きを埋めて先頭の動詞を過去形にした文でも、照らす熟語・構文を全部見つける', () => {
  const { patterns } = phrasePatterns(PHRASES, ALL_WORDS)
  const missed = []
  let past = 0
  for (const pattern of patterns) {
    const sentence = pastSentence(pattern)
    if (sentence.past) past += 1
    const found = matchOcrTextToPhrases(sentence.text, PHRASES, ALL_WORDS)
    if (!found.some((item) => item.id === pattern.phrase.id)) missed.push(`${pattern.phrase.phrase} || ${sentence.text}`)
  }
  console.log(`照らす型 ${patterns.length}・過去形にした文 ${past}`)
  assert.ok(past >= 1000, `過去形にした文 ${past}`)
  assert.deepEqual(missed, [])
})

test('phrases-all：変化形・one\'s・oneself・間に入る目的語を読み分け、語を間に入れて当てたものは最初は選ばない', () => {
  const found = matchOcrTextToPhrases(
    'She took part in the race. I made up my mind. Please turn it off. We are looking forward to it. He enjoyed himself. She made a difficult decision.',
    PHRASES,
    ALL_WORDS,
  )
  const item = (phrase) => found.find((entry) => entry.phrase === phrase)
  assert.equal(item('take part in')?.suggested, true)
  assert.deepEqual(item('take part in')?.observed, ['took part in'])
  assert.equal(item("make up one's mind")?.suggested, true)
  assert.equal(item('turn off')?.suggested, false)
  assert.equal(item('look forward to')?.suggested, true)
  assert.equal(item('enjoy oneself')?.suggested, true)
  assert.equal(item('make a decision')?.suggested, false)
  // 日本語・文の区切りをまたいで当てない。
  assert.equal(matchOcrTextToPhrases('take 取る\npart 部分', PHRASES, ALL_WORDS).some((entry) => entry.phrase === 'take part'), false)
  assert.equal(matchOcrTextToPhrases('I will take. Part of it.', PHRASES, ALL_WORDS).some((entry) => entry.phrase === 'take part'), false)
})

test('screens：写真から作る（英単語のテンプレート）は、英文の中の熟語を意味つきの候補に、変化形を元の語にする', () => {
  const { candidates } = buildPhotoCardCandidates('She took part in the race and found a cat.', { template: ENGLISH_TEMPLATE_ID, words: ALL_WORDS })
  const phrase = candidates.find((candidate) => candidate.front === 'take part in')
  assert.ok(phrase, 'take part in')
  assert.equal(phrase.phrase, true)
  assert.equal(phrase.back, PHRASES.find((item) => item.id === 'idm_take_part_in').meaning)
  assert.deepEqual(phrase.observed, ['took part in'])
  const take = candidates.find((candidate) => candidate.front === 'take')
  assert.deepEqual(take?.observed, ['took'])
  const find = candidates.find((candidate) => candidate.front === 'find')
  assert.equal(find?.alternative, true)
  assert.equal(find?.suggested, false)
})
