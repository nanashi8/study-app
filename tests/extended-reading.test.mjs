import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { ALL_PASSAGES, PASSAGES, getPassage } from '../src/data/passages.js'
import { EXTENDED_PASSAGES } from '../src/data/reading-extended-passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import { getReadingPracticeQuestions } from '../src/data/reading-current-affairs-practice-questions.js'
import { getReadingStudy, passageWordCount } from '../src/data/reading-study.js'
import { readingApproachForPassage } from '../src/data/reading-rules.js'
import { auditExtendedReadings } from '../src/lib/extendedReadingAudit.js'

const EXPECTED_WORD_COUNTS = [985, 1973, 2959, 3943]

test('語彙強化長文4本を、従来の一文構文監査32本と分けてカタログに追加する', () => {
  assert.equal(PASSAGES.length, 32)
  assert.equal(EXTENDED_PASSAGES.length, 4)
  assert.equal(ALL_PASSAGES.length, 36)
  assert.deepEqual(EXTENDED_PASSAGES.map((passage) => passage.actualWords), EXPECTED_WORD_COUNTS)
  assert.deepEqual(EXTENDED_PASSAGES.map((passage) => passageWordCount(passage)), EXPECTED_WORD_COUNTS)
  for (const passage of EXTENDED_PASSAGES) {
    assert.equal(getPassage(passage.id), passage)
    assert.equal(passage.extended, true)
    assert.ok(passage.sections.length >= 5)
  }
})

test('本文全文・全和訳・全重点語・全問題と語彙カバー率が品質基準を通過する', () => {
  const audit = auditExtendedReadings()
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.ok, true)
  assert.equal(audit.metrics.totalWords, 9860)
  assert.equal(audit.metrics.unresolvedExtendedTokenCount, 0)
  assert.ok(audit.metrics.combinedCoveragePercent >= 40)
  assert.ok(audit.metrics.coverageGain >= 1800)
  assert.deepEqual(audit.metrics.practiceTypeCounts, {
    'word-order': 4,
    grammar: 4,
    usage: 4,
  })
  for (const coverage of Object.values(audit.metrics.coverageByLevel)) {
    assert.ok(coverage.gain > 0)
    assert.ok(coverage.afterPercent > coverage.beforePercent)
  }
})

test('各長文が読み方、辞書・SRSの準備語彙、内容・並び替え・文法・語法問題を持つ', () => {
  for (const passage of EXTENDED_PASSAGES) {
    const study = getReadingStudy(passage)
    const questions = getReadingQuestions(passage.id)
    const practice = getReadingPracticeQuestions(passage.id)
    const approach = readingApproachForPassage(passage)
    assert.ok(study.words.length >= passage.vocab.length)
    assert.ok(passage.vocab.every((id) => study.words.some((word) => word.id === id)))
    assert.equal(study.phrases.length, 4)
    assert.equal(questions.length, 4)
    assert.deepEqual(practice.map((item) => item.questionType).sort(), ['grammar', 'usage', 'word-order'])
    assert.equal(approach.steps.length, 3)
  }
})

test('節送り画面はモバイル操作、進捗保存、単語連動、読解チェックを持つ', async () => {
  const source = await readFile(new URL('../src/components/ExtendedReader.jsx', import.meta.url), 'utf8')
  const readerSource = await readFile(new URL('../src/screens/Reader.jsx', import.meta.url), 'utf8')
  assert.match(source, /data-extended-reading=/)
  assert.match(source, /extended-reading-section:v1/)
  assert.match(source, /data-reading-section-navigation/)
  assert.match(source, /min-h-12/)
  assert.match(source, /resolvePassageWord/)
  assert.match(source, /if \(!target\) return <span/)
  assert.match(source, /recordVocabHistory/)
  assert.match(source, /toggleMyList/)
  assert.match(source, /ReadingComprehensionCheck/)
  assert.match(source, /readingSummary/)
  assert.match(readerSource, /passage\.extended/)
  assert.match(readerSource, /<ExtendedReader passage=\{passage\}/)
})
