import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { LEVELS } from '../src/data/levels.js'
import { VOCAB_FIELD_GROUPS, wordsByField, wordsByLevel } from '../src/data/vocab.js'
import { vocabularyCatalogRows } from '../src/lib/vocabCatalog.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import { learningContentCatalogRows } from '../src/lib/learningContentCatalog.js'
import { localDayIndex } from '../src/lib/vocabScheduler.js'

// 英単語の一覧を確認の「確認のおすすめ順」は、重みが同じ語どうしを ABC 順にせず、
// 教材の並び（級・分野・単語帳の語の並び＝基本語から）のままにする（2026-11-03）。
const DAY_MS = 86_400_000
const now = Date.UTC(2026, 10, 3, 3)
const day = localDayIndex(now)
const ids = (rows) => rows.map((row) => row.word?.id ?? row.id)

const learnedEntry = () => ({
  box: 4,
  correct: 5,
  wrong: 0,
  due: day + 10,
  last: day - 1,
  lastAt: now - DAY_MS,
  firstAt: now - 20 * DAY_MS,
  memory: { passes: 2, remembered: 2, forgot: 0, lastAt: now - DAY_MS, lastJudgment: 'remembered', marks: [1, 1] },
  test: { attempts: 2, correct: 2, wrong: 0, lastAt: now - DAY_MS, lastResult: 'correct', marks: [1, 1] },
})

const isAbc = (words) => words.every((word, index) => (
  index === 0 || words[index - 1].word.localeCompare(word.word, 'en', { sensitivity: 'base' }) <= 0
))

// 母集団：級別・分野別・単語帳の一覧の全入口。記録のない語ばかりなら、おすすめ順は教材の並びのまま。
const entrances = [
  ...LEVELS.map((level) => [`級 ${level.label}`, wordsByLevel(level.id)]),
  ...VOCAB_FIELD_GROUPS.map((group) => [`分野 ${group.label}`, wordsByField(group.id)]),
  ...LEVELS.flatMap((level) => VOCAB_FIELD_GROUPS.map((group) => [
    `級 ${level.label}×分野 ${group.label}`,
    wordsByLevel(level.id).filter((word) => wordsByField(group.id).includes(word)),
  ])).filter(([, words]) => words.length),
  ['単語帳（並びを入れかえた本）', [...wordsByLevel('2').slice(0, 40)].reverse()],
]

test('英単語の一覧の全入口で、記録のない語のおすすめ順は教材の並びのまま（ABC順にしない）', () => {
  assert.equal(LEVELS.length, 7)
  assert.ok(entrances.length > 7 + VOCAB_FIELD_GROUPS.length)
  for (const [label, words] of entrances) {
    assert.ok(words.length > 0, label)
    for (const direction of ['desc', 'asc']) {
      const rows = vocabularyCatalogRows(words, {}, { sort: 'weight', direction, now, day })
      assert.deepEqual(ids(rows), words.map((word) => word.id), `${label}（${direction}）`)
    }
  }
  // 基本語から並ぶ級の一覧は ABC 順ではない（直す前は ABC 順に並んでいた）。
  for (const level of LEVELS) {
    const rows = vocabularyCatalogRows(wordsByLevel(level.id), {}, { now, day })
    assert.equal(isAbc(rows.map((row) => row.word)), false, level.label)
  }
})

test('記録のある語と記録のない語がまざっても、同じ重みの語どうしは教材の並び', () => {
  for (const level of LEVELS) {
    const words = wordsByLevel(level.id)
    // 1語おきに同じ記録を付ける。記録のある語は上、ない語は下に分かれ、それぞれ教材の並びのまま。
    const srs = Object.fromEntries(words.filter((_, index) => index % 2 === 0).map((word) => [word.id, learnedEntry()]))
    const rows = vocabularyCatalogRows(words, srs, { now, day })
    const recorded = words.filter((word) => srs[word.id]).map((word) => word.id)
    const fresh = words.filter((word) => !srs[word.id]).map((word) => word.id)
    assert.deepEqual(ids(rows), [...recorded, ...fresh], level.label)
  }
})

test('マイ学習の英単語の一覧も、同じ重みの語どうしは教材の並び（ABC順にしない）', () => {
  const content = LEARNING_CONTENTS.find((item) => item.id === 'vocab')
  assert.ok(content.items.length > 8000)
  for (const direction of ['desc', 'asc']) {
    const rows = learningContentCatalogRows(content, {}, { sort: 'weight', direction, now, day })
    assert.deepEqual(rows.map((row) => row.id), content.items.map((item) => item.id), direction)
  }
})

test('英単語の一覧を確認の行（全入口）に発音ボタンを出す', () => {
  const rowSource = readFileSync(new URL('../src/components/VocabularyHistoryRow.jsx', import.meta.url), 'utf8')
  const vocabRow = rowSource.slice(rowSource.indexOf('export function VocabularyHistoryRow'))
  assert.match(vocabRow, /actions=\{text \? <SpeakButton text=\{text\} size="sm" \/> : null\}/)
  // 級別・分野別・単語帳の一覧（VocabDecks）と、マイ学習の英単語の一覧（LearningContentCatalog）の行は、どれもこの行を使う。
  const decks = readFileSync(new URL('../src/screens/VocabDecks.jsx', import.meta.url), 'utf8')
  const catalog = readFileSync(new URL('../src/components/LearningContentCatalog.jsx', import.meta.url), 'utf8')
  assert.equal((decks.match(/<VocabularyCatalog\b/g) ?? []).length, 3)
  assert.equal((decks.match(/<VocabularyHistoryRow\b/g) ?? []).length, 1)
  assert.doesNotMatch(decks, /<LearningRecordRow\b/)
  assert.match(catalog, /isVocabulary \? <VocabularyHistoryRow\b/)
  // 行の発音ボタンは行のボタンの外（入れ子にしない）で、押しても詳細を開かない。
  assert.match(rowSource, /\{actions && \(\s*<div[\s\S]*?data-learning-record-actions/)
  const speak = readFileSync(new URL('../src/components/SpeakButton.jsx', import.meta.url), 'utf8')
  assert.match(speak, /e\.stopPropagation\(\)/)
})
