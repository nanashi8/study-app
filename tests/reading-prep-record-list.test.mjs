import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_PASSAGES } from '../src/data/passages.js'
import { getReadingStudy } from '../src/data/reading-study.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import { learningContentCatalogRows } from '../src/lib/learningContentCatalog.js'
import { learningContentCatalogReviewCommand } from '../src/lib/learningContentCatalogReview.js'

const REVIEW_RESULTS = ['remembered', 'forgot', 'correct', 'wrong']
const contentById = new Map(LEARNING_CONTENTS.map((content) => [content.id, content]))
const prepSource = readFileSync(new URL('../src/screens/ReadingPrep.jsx', import.meta.url), 'utf8')

test('長文36本の準備は、必須語彙も熟語・表現も既存SRSへ記録できる', () => {
  assert.equal(ALL_PASSAGES.length, 36)

  let words = 0
  let phrases = 0
  for (const passage of ALL_PASSAGES) {
    const study = getReadingStudy(passage)
    assert.ok(study.words.length > 0, `${passage.id}: 必須語彙`)
    assert.ok(study.phrases.length > 0, `${passage.id}: 熟語・表現`)
    words += study.words.length
    phrases += study.phrases.length

    for (const [contentId, items] of [['vocab', study.words], ['usage', study.phrases]]) {
      const ids = items.map((item) => item.id)
      assert.equal(new Set(ids).size, ids.length, `${passage.id}:${contentId}: ID重複`)
      for (const id of ids) {
        for (const result of REVIEW_RESULTS) {
          assert.ok(
            learningContentCatalogReviewCommand(contentId, id, result),
            `${passage.id}:${id}:${result}: SRS書き込み先がありません`,
          )
        }
      }
    }
  }
  assert.equal(words, 2_805)
  assert.equal(phrases, 180)
})

test('長文ごとの固有表現も、教材母集団になくても一覧の行になる', () => {
  const usage = contentById.get('usage')
  const usageIds = new Set(usage.items.map((item) => item.id))
  const { phrases } = getReadingStudy(ALL_PASSAGES.find((passage) => passage.id === 'p_5_lost_notebook'))
  const expressions = phrases.filter((item) => !usageIds.has(item.id))
  assert.ok(expressions.length > 0, '長文固有表現が母集団の外にあること')

  const rows = learningContentCatalogRows({ ...usage, items: phrases }, { srs: {} })
  assert.equal(rows.length, phrases.length)
  for (const item of expressions) {
    const row = rows.find((candidate) => candidate.id === item.id)
    assert.ok(row, item.id)
    assert.equal(row.title, item.phrase)
    assert.equal(row.subtitle, item.meaning)
    assert.equal(row.field, '表現')
    assert.equal(row.memoryStatus, 'unlearned')
    assert.equal(row.testStatus, 'unanswered')
  }

  // 共通一覧は、渡された項目を教材母集団で絞り込まない。
  const list = readFileSync(new URL('../src/components/NormalLearningRecordList.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(list, /itemById\.has\(item\.id\)/)
  assert.match(list, /\.filter\(\(item\) => item\?\.id\)/)
})

test('読解の準備は、暗記・テスト・一覧を確認の3つを両教材に出す', () => {
  for (const entry of ['words', 'phrases']) {
    assert.match(prepSource, new RegExp(`data-reading-prep-entry="${entry}"`), entry)
  }
  for (const token of [
    '<LearningEntryCard',
    'onStudy={() => studyWords(false)}',
    'onQuiz={() => studyWords(true)}',
    "onCatalog={() => openList('words')}",
    'onStudy={() => studyPhrases(false)}',
    'onQuiz={() => studyPhrases(true)}',
    "onCatalog={() => openList('phrases')}",
    "navigate(asQuiz ? 'vocabQuiz' : 'vocabStudy'",
    "navigate(asQuiz ? 'phraseQuiz' : 'phraseStudy'",
  ]) {
    assert.ok(prepSource.includes(token), token)
  }
})

test('読解の準備の一覧は、共通のスワイプ記録部品で左右に処理できる', () => {
  for (const token of [
    '<NormalLearningRecordList',
    "entryId=\"reading-prep-words\"",
    "entryId=\"reading-prep-phrases\"",
    'contentId="vocab"',
    'contentId="usage"',
    'items={words}',
    'items={phrases}',
    '<LearningViewTabs',
    'data-reading-prep-catalog={tab}',
    '左右にスワイプして、学習とテストの結果を直接記録できます。',
  ]) {
    assert.ok(prepSource.includes(token), token)
  }
  // 記録できない読み物だけの一覧に戻さない。
  assert.doesNotMatch(prepSource, /words\.map\(\(word\) => \{/)
  assert.doesNotMatch(prepSource, /phrases\.map\(\(item\) => \{/)
})
