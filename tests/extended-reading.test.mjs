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
import { READING_TRANSLATION_SCENARIOS } from '../src/data/reading-translation-scenarios.js'
import { READING_GRAMMAR_EXPECTATIONS } from '../src/data/reading-grammar-expectations.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'

const EXPECTED_WORD_COUNTS = [987, 1977, 2956, 3940]

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
  assert.match(source, /data-extended-reading-vocabulary-cases/)
  assert.match(source, /この節の重点語ケース/)
  assert.match(source, /ReadingComprehensionCheck/)
  assert.match(source, /readingSummary/)
  assert.match(readerSource, /passage\.extended/)
  assert.match(readerSource, /<ExtendedReader passage=\{passage\}/)
})

test('散文へ書き直した語彙強化長文は、初期長文と同じ語順訳・5文型・重点語ケースを持つ', () => {
  const annotated = EXTENDED_PASSAGES.filter((passage) => passage.annotated)
  assert.ok(annotated.length >= 1, '散文化済みの語彙強化長文が無い')
  for (const passage of annotated) {
    assert.equal(passage.extendedFormat, 'themed-long-reading')
    const scenarios = READING_TRANSLATION_SCENARIOS[passage.id]
    const patterns = READING_GRAMMAR_EXPECTATIONS[passage.id]
    assert.equal(scenarios.length, passage.sentences.length, `${passage.id}: 語順訳の文数`)
    assert.equal(patterns.length, passage.sentences.length, `${passage.id}: 5文型の文数`)
    for (const [index, sentence] of passage.sentences.entries()) {
      assert.equal(sentence.reviewId, `${passage.id}#${index + 1}`)
      assert.equal(sentence.translationScenario, scenarios[index], `${passage.id}: 第${index + 1}文へシナリオ未接続`)
      assert.ok(!sentence.targetId, `${passage.id}: 散文本文に辞書例文の重点IDが残っている`)
      const analysis = analyzeReadingSentence(sentence)
      assert.deepEqual(
        analysis.blocks.map((block) => block.en),
        scenarios[index].map((block) => block.en),
        `${passage.id}: 第${index + 1}文のブロック境界`,
      )
      assert.ok(
        ['SV', 'SVC', 'SVO', 'SVOO', 'SVOC'].includes(analysis.mainPattern),
        `${passage.id}: 第${index + 1}文の主節文型 (${analysis.mainPattern})`,
      )
    }
    // 共通辞書の監査済み例文は本文から切り離し、節ごとの重点語ケースとして残す。
    const caseIds = passage.sections.flatMap((section) => section.vocabularyCases.map((item) => item.id))
    assert.equal(caseIds.length, passage.targetVocabularyCount, `${passage.id}: 重点語ケース数`)
    assert.deepEqual([...passage.vocab], caseIds, `${passage.id}: 学習カードと重点語ケースの一致`)
    for (const section of passage.sections) {
      assert.ok(section.summaryJa, `${passage.id}/${section.id}: 節の読みどころ要約`)
      assert.ok(section.vocabularyCases.length >= 10, `${passage.id}/${section.id}: 重点語ケース不足`)
    }
  }
})
