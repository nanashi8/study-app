import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { readFileSync } from 'node:fs'

import { ALL_WORDS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { CURRICULUM_1900_WORDS } from '../src/data/words-curriculum-1900.js'
import { CURRICULUM_1900_IDIOMS } from '../src/data/phrases-curriculum-1900.js'
import {
  CURRICULUM_1900_PHRASE_RESOLUTIONS,
  CURRICULUM_1900_WORD_RESOLUTIONS,
  curriculum1900CanonicalPhrase,
  curriculum1900CanonicalWord,
} from '../src/data/curriculum-1900-resolutions.js'
import {
  CURRICULUM_1900_AUDIT_META,
  CURRICULUM_1900_PHRASE_TARGET_HASHES,
  CURRICULUM_1900_WORD_TARGET_HASHES,
} from '../scripts/data/curriculum-1900-audit-hashes.js'
import {
  IDIOM_FORM_FAMILIES,
  idiomFormFamilyFor,
  relatedIdiomForms,
} from '../src/data/idiom-form-families.js'
import { buildPhraseDeck, pickPhraseDistractors } from '../src/lib/session.js'
import { phraseMatchRank } from '../src/lib/vocabSearch.js'

const key = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[‘’]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase()
const hash = (value) => crypto.createHash('sha256').update(key(value)).digest('hex').slice(0, 16)
const alphaKey = (value) => key(value).replace(/^[^a-z]+/, '')
const sorted = (values) => [...values].sort((a, b) =>
  alphaKey(a).localeCompare(alphaKey(b), 'en', { sensitivity: 'base' }))

test('添付3シート4,684行・4,428ユニーク項目をハッシュ監査で全件収録する', () => {
  assert.deepEqual(CURRICULUM_1900_AUDIT_META.sourceRows, {
    highWords: 1900,
    highPhrases: 1000,
    juniorWords: 1584,
    juniorPhrases: 200,
    total: 4684,
  })
  assert.deepEqual(CURRICULUM_1900_AUDIT_META.sourceUnique, {
    words: 3283,
    phrases: 1145,
    total: 4428,
  })
  assert.equal(CURRICULUM_1900_AUDIT_META.sourceOrderRetained, false)

  const wordHashes = new Set(ALL_WORDS.map((item) => hash(item.word)))
  const phraseHashes = new Set(PHRASES.map((item) => hash(item.phrase)))
  assert.equal(CURRICULUM_1900_WORD_TARGET_HASHES.length, 3283)
  assert.equal(CURRICULUM_1900_PHRASE_TARGET_HASHES.length, 1138)
  assert.deepEqual(CURRICULUM_1900_WORD_TARGET_HASHES.filter((item) => !wordHashes.has(item)), [])
  assert.deepEqual(CURRICULUM_1900_PHRASE_TARGET_HASHES.filter((item) => !phraseHashes.has(item)), [])
})

test('不足単語420件・熟語604件は級、独自用例、語源・成り立ちを持つ', () => {
  assert.equal(ALL_WORDS.length, 8869)
  assert.equal(PHRASES.length, 2104)
  assert.equal(CURRICULUM_1900_WORDS.length, 420)
  assert.equal(CURRICULUM_1900_IDIOMS.length, 604)
  assert.equal(new Set(CURRICULUM_1900_WORDS.map((item) => item.id)).size, 420)
  assert.equal(new Set(CURRICULUM_1900_IDIOMS.map((item) => item.id)).size, 604)

  const liveWords = new Map(ALL_WORDS.map((item) => [item.id, item]))
  const wordExamples = new Set()
  for (const source of CURRICULUM_1900_WORDS) {
    const item = liveWords.get(source.id)
    assert.ok(item, source.id)
    assert.ok(item.meanings.length && item.level && item.pos && item.field, source.id)
    assert.ok(item.example.en && item.example.ja && item.phonetic, source.id)
    assert.ok(item.etymology?.note?.length >= 10, source.id)
    assert.ok(!wordExamples.has(item.example.en), `${source.id}: 用例重複`)
    wordExamples.add(item.example.en)
  }

  const phraseExamples = new Set()
  for (const item of CURRICULUM_1900_IDIOMS) {
    assert.ok(item.meanings.length && item.level && item.category, item.id)
    assert.ok(item.example.en && item.example.ja && item.origin && item.note, item.id)
    assert.ok(!phraseExamples.has(item.example.en), `${item.id}: 用例重複`)
    phraseExamples.add(item.example.en)
  }
})

test('補完データは出版物の順番を保持せず、正規形の英字順に再構成する', () => {
  assert.deepEqual(CURRICULUM_1900_WORDS.map((item) => item.word), sorted(CURRICULUM_1900_WORDS.map((item) => item.word)))
  assert.deepEqual(CURRICULUM_1900_IDIOMS.map((item) => item.phrase), sorted(CURRICULUM_1900_IDIOMS.map((item) => item.phrase)))
  const forbidden = new Set(['sourceOrder', 'sourceNumber', 'bookOrder', 'sourcePage', 'sourceQuote'])
  for (const item of [...CURRICULUM_1900_WORDS, ...CURRICULUM_1900_IDIOMS]) {
    assert.deepEqual(Object.keys(item).filter((field) => forbidden.has(field)), [], item.id)
  }
})

test('誤記・省略・表記揺れは正規形へ解決し、元表記でも辞書検索できる', () => {
  const wordHeads = new Set(ALL_WORDS.map((item) => key(item.word)))
  const phraseByHead = new Map(PHRASES.map((item) => [key(item.phrase), item]))
  for (const [source, target] of Object.entries(CURRICULUM_1900_WORD_RESOLUTIONS)) {
    assert.equal(curriculum1900CanonicalWord(source), target)
    assert.ok(wordHeads.has(key(target)), `${source} -> ${target}`)
  }
  for (const [source, target] of Object.entries(CURRICULUM_1900_PHRASE_RESOLUTIONS)) {
    assert.equal(curriculum1900CanonicalPhrase(source), target)
    assert.ok(phraseByHead.has(key(target)), `${source} -> ${target}`)
  }

  for (const [query, canonical] of [
    ['on charge of', 'on a charge of'],
    ['roundup', 'round up'],
    ["lose one's face", 'lose face'],
    ['What ~ like?', 'What is ... like?'],
  ]) {
    assert.equal(phraseMatchRank(phraseByHead.get(key(canonical)), query), 0, query)
  }
})

test('全熟語を同形ファミリーへ結び、同じ形だけの暗記・テストを組める', () => {
  const idioms = PHRASES.filter((item) => item.kind === 'idiom')
  assert.equal(idioms.length, 1754)
  assert.ok(IDIOM_FORM_FAMILIES.length >= 60)
  assert.ok(idioms.every((item) => idiomFormFamilyFor(item)), '未分類の熟語がある')
  assert.ok(idioms.every((item) => relatedIdiomForms(item).length > 0), '比較相手のない熟語がある')

  const item = idioms.find((candidate) => candidate.phrase === 'be curious about')
  const family = idiomFormFamilyFor(item)
  assert.equal(family.id, 'be-prep-about')
  assert.ok(relatedIdiomForms(item).some((candidate) => candidate.phrase === 'be anxious about'))
  assert.deepEqual(
    new Set(buildPhraseDeck({ type: 'phraseList', ids: family.memberIds }, { size: 0 }).map((candidate) => candidate.id)),
    new Set(family.memberIds),
  )
  const distractors = pickPhraseDistractors(item, 2, () => 0.5)
  assert.ok(distractors.every((candidate) => family.memberIds.includes(candidate.id)))
})

test('一覧・暗記・テストの実画面に同形比較と専用開始ボタンを接続する', () => {
  const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
  const list = read('../src/screens/Phrases.jsx')
  const study = read('../src/screens/PhraseStudy.jsx')
  const quiz = read('../src/screens/PhraseQuiz.jsx')
  const guide = read('../src/components/IdiomFormGuide.jsx')

  assert.match(list, /data-idiom-form-filter/)
  assert.match(list, /<IdiomFormGuide item=\{detail\}/)
  assert.match(study, /<IdiomFormGuide item=\{item\}/)
  assert.match(quiz, /<IdiomFormGuide item=\{item\}/)
  assert.match(guide, /同じ形で比べる/)
  assert.match(guide, /この形を暗記/)
  assert.match(guide, /この形をテスト/)
  assert.match(guide, /type: 'phraseList'/)
})
