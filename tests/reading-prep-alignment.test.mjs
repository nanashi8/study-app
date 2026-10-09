// 読解の準備（準備して読む）の中身が、これから読む長文と合っているか（requests/2026-10-09-reading-prep-alignment.json）。
// 検査の中身は scripts/checks/reading-prep-alignment.mjs。読んだ結果の台帳は docs/audits/reading-prep-*.json。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ALL_PASSAGES } from '../src/data/passages.js'
import { getReadingStudy } from '../src/data/reading-study.js'
import { getWord } from '../src/data/vocab.js'
import {
  neededWordsGap,
  overviewGap,
  phraseCoverageGap,
  prepPhraseGap,
  prepRulesGap,
  prepSenseGap,
  prepWordsAppearGaps,
} from '../scripts/checks/reading-prep-alignment.mjs'

test('prep-words-appear: 準備の語は本文に出て、重点語ケースの語は本文の語と分けて出す', () => {
  const result = prepWordsAppearGaps()
  assert.deepEqual(result.gaps, [])
  assert.ok(result.pairs >= 2400, `長文×語の組 ${result.pairs}`)
  for (const passage of ALL_PASSAGES) {
    const { words, caseWords } = getReadingStudy(passage)
    if (passage.extended) {
      assert.ok(caseWords.length > 0, `${passage.id}: 重点語ケースの語`)
    } else {
      assert.equal(caseWords.length, 0, `${passage.id}: ふつうの長文に重点語ケースは無い`)
    }
    assert.ok(words.length > 0, `${passage.id}: テーマ必須語彙`)
  }
  const prep = readFileSync(new URL('../src/screens/ReadingPrep.jsx', import.meta.url), 'utf8')
  assert.match(prep, /data-reading-prep-entry="cases"/)
  assert.match(prep, /entryId="reading-prep-cases"/)
})

test('prep-words-sense: 準備の語の本文での意味をカードで学べる（読んだ台帳と照らす）', () => {
  const result = prepSenseGap()
  assert.deepEqual(result.problems, [])
  assert.deepEqual(result.stale, [])
  assert.ok(result.occurrences >= 3000)
  // 本文の意味がカードに無かった13語は、カード裏のほかの意味に足した。
  for (const id of ['perform', 'moderation', 'circulation', 'deliberate', 'population', 'heavy', 'grow', 'organize', 'judge', 'track', 'narrow', 'script', 'plant']) {
    assert.ok((getWord(id).otherSenses ?? []).length > 0, `${id} のほかの意味`)
  }
})

test('passage-words-covered: 本文を読むのに要る語（長文の級以上の内容語）はすべて準備で学べる', () => {
  const result = neededWordsGap()
  assert.deepEqual(result.gaps, [])
  assert.ok(result.needed >= 1000, `長文×語の組 ${result.needed}`)
})

test('prep-phrases-match: 準備の熟語・表現はすべて本文の文で使われている（読んだ台帳と照らす）', () => {
  const result = prepPhraseGap()
  assert.deepEqual(result.problems, [])
  assert.deepEqual(result.stale, [])
  assert.equal(result.count, 251)
})

test('passage-phrases-covered: 本文に出る熟語・構文（長文の級以上）は準備で学べる', () => {
  const result = phraseCoverageGap()
  assert.deepEqual(result.problems, [])
  assert.deepEqual(result.stale, [])
})

test('prep-rules-match-reader: 準備の読解ルールは読解画面に出るルールと合う', () => {
  const result = prepRulesGap()
  assert.deepEqual(result.problems, [])
  const prep = readFileSync(new URL('../src/screens/ReadingPrep.jsx', import.meta.url), 'utf8')
  assert.match(prep, /readingPrepRulesForPassage/)
  assert.match(prep, /data-reading-prep-rule-phase/)
})

test('prep-overview-matches-text: あらすじ・テーマ・読解ポイント・読み方を本文と読み比べた', () => {
  const result = overviewGap()
  assert.deepEqual(result.problems, [])
  assert.deepEqual(result.stale, [])
  assert.equal(result.passages, 42)
})
