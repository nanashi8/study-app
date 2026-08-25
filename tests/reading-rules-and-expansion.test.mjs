import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PASSAGES } from '../src/data/passages.js'
import { EXPANDED_PASSAGES } from '../src/data/reading-expansion-passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import {
  PASSAGE_READING_APPROACHES,
  READING_RULE_PHASES,
  READING_RULES,
  readingApproachForPassage,
  readingRuleForQuestion,
  readingRulesByPhase,
  readingRulesForPassage,
  readingRulesForSentence,
} from '../src/data/reading-rules.js'

const wordCount = (passage) => passage.sentences.reduce(
  (total, sentence) => total + (sentence.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).length,
  0,
)

const minimumWordsByLevel = Object.freeze({
  5: 80,
  4: 150,
  3: 250,
  pre2: 300,
  pre2plus: 320,
  2: 350,
  pre1: 500,
  1: 780,
})

test('読解30ルールは五段階・三手・誤読防止・図解を備える', () => {
  assert.equal(READING_RULES.length, 30)
  assert.equal(new Set(READING_RULES.map((rule) => rule.id)).size, 30)
  assert.equal(READING_RULE_PHASES.length, 5)
  assert.deepEqual(
    READING_RULE_PHASES.map((phase) => readingRulesByPhase(phase.id).length),
    [4, 7, 7, 6, 6],
  )
  assert.equal(READING_RULES.filter((rule) => rule.origin === 'added').length, 10)
  assert.equal(READING_RULES.filter((rule) => rule.origin === 'reference-reframed').length, 20)
  assert.ok(!JSON.stringify(READING_RULES).includes('読む目的を一つ決める'))
  assert.equal(
    READING_RULES.find((rule) => rule.id === 'purpose-first')?.title,
    '文章の型に合わせて注目点を変える',
  )

  const phaseIds = new Set(READING_RULE_PHASES.map((phase) => phase.id))
  for (const rule of READING_RULES) {
    assert.ok(phaseIds.has(rule.phase), `${rule.id}: 段階が不明`)
    assert.ok(['basic', 'standard', 'advanced'].includes(rule.level), `${rule.id}: 難度が不明`)
    assert.ok(rule.title && rule.short && rule.signal && rule.caution, `${rule.id}: 学習欄が不足`)
    assert.equal(rule.steps.length, 3, `${rule.id}: 判断手順は三手にする`)
    assert.ok(rule.steps.every((step) => step.length >= 8), `${rule.id}: 手順が短すぎる`)
    assert.ok(rule.example.en && rule.example.ja, `${rule.id}: 英日例が不足`)
    assert.ok(rule.diagram?.nodes?.length >= 2, `${rule.id}: 図解が不足`)
  }
})

test('全32長文は級別四本・試験テーマ・十分な語数・根拠付き設問を保つ', () => {
  assert.equal(PASSAGES.length, 32)
  assert.equal(EXPANDED_PASSAGES.length, 8)
  assert.equal(PASSAGES.reduce((total, passage) => total + passage.sentences.length, 0), 794)

  for (const level of Object.keys(minimumWordsByLevel)) {
    assert.equal(PASSAGES.filter((passage) => passage.level === level).length, 4, `${level}: 四本未満`)
  }
  assert.equal(PASSAGES.filter((passage) => passage.examTypes.includes('高校受験')).length, 12)
  assert.equal(PASSAGES.filter((passage) => passage.examTypes.includes('大学受験')).length, 16)
  assert.equal(PASSAGES.filter((passage) => passage.examTypes.includes('英検')).length, 32)

  for (const passage of PASSAGES) {
    assert.ok(
      wordCount(passage) >= minimumWordsByLevel[passage.level],
      `${passage.id}: ${wordCount(passage)}語は長文慣れの基準未満`,
    )
    assert.ok(passage.theme && passage.examLabel, `${passage.id}: 試験メタデータ不足`)
    assert.equal(passage.examFocus.length, 3, `${passage.id}: 読解ポイント不足`)
    assert.ok(passage.sentences.filter((sentence) => sentence.paragraphStart).length >= 2)

    const questions = getReadingQuestions(passage.id)
    assert.ok(questions.length >= 3, `${passage.id}: 設問不足`)
    for (const question of questions) {
      assert.ok(question.choices.includes(question.answer), `${passage.id}: 正答不在`)
      assert.ok(question.explain.length >= 20, `${passage.id}: 根拠解説が短い`)
    }
  }
})

test('既存16本を含む全文・全設問へ文脈に合う読解ルールを注入する', () => {
  const knownRuleIds = new Set(READING_RULES.map((rule) => rule.id))
  const allPhaseIds = new Set(READING_RULE_PHASES.map((phase) => phase.id))
  const usedRuleIds = new Set()
  const approachTitles = new Set()
  const approachRuleSequences = new Set()
  const recommendedRuleSets = []

  assert.equal(Object.keys(PASSAGE_READING_APPROACHES).length, PASSAGES.length)

  for (const passage of PASSAGES) {
    const approach = readingApproachForPassage(passage)
    assert.ok(approach, `${passage.id}: テーマ別の読み方がない`)
    assert.ok(approach.title.length >= 12, `${passage.id}: 読み方の見出しが短い`)
    assert.ok(approach.summary.length >= 35, `${passage.id}: テーマ別解説が短い`)
    assert.equal(approach.steps.length, 3, `${passage.id}: テーマ別の三手がない`)
    assert.ok(approach.steps.every((step) => step.length >= 12), `${passage.id}: テーマ別手順が短い`)
    assert.equal(approach.ruleIds.length, 6, `${passage.id}: 中核ルール数`)
    assert.equal(new Set(approach.ruleIds).size, approach.ruleIds.length)
    assert.ok(approach.ruleIds.every((id) => knownRuleIds.has(id)), `${passage.id}: 不明な中核ルール`)
    assert.deepEqual(
      new Set(approach.ruleIds.map((id) => READING_RULES.find((rule) => rule.id === id)?.phase)),
      allPhaseIds,
      `${passage.id}: テーマ別ルールに五段階がそろわない`,
    )
    approachTitles.add(approach.title)
    approachRuleSequences.add(approach.ruleIds.join(','))

    const passageRules = readingRulesForPassage(passage)
    assert.ok(passageRules.length >= 6 && passageRules.length <= 8, `${passage.id}: 準備ルール数`)
    assert.equal(new Set(passageRules.map((rule) => rule.id)).size, passageRules.length)
    assert.deepEqual(new Set(passageRules.map((rule) => rule.phase)), allPhaseIds)
    assert.deepEqual(
      passageRules.slice(0, approach.ruleIds.length).map((rule) => rule.id),
      approach.ruleIds,
      `${passage.id}: テーマ別の中核ルールが先に出ない`,
    )
    recommendedRuleSets.push(new Set(passageRules.map((rule) => rule.id)))
    passageRules.forEach((rule) => usedRuleIds.add(rule.id))

    for (const sentence of passage.sentences) {
      const sentenceRules = readingRulesForSentence(sentence)
      assert.ok(sentenceRules.length >= 1 && sentenceRules.length <= 3, `${sentence.reviewId}: 本文ルール数`)
      assert.equal(new Set(sentenceRules.map((rule) => rule.id)).size, sentenceRules.length)
      assert.ok(sentenceRules.every((rule) => knownRuleIds.has(rule.id)))
      sentenceRules.forEach((rule) => usedRuleIds.add(rule.id))
    }

    for (const question of getReadingQuestions(passage.id)) {
      const questionRule = readingRuleForQuestion(question.q)
      assert.ok(knownRuleIds.has(questionRule.id), `${passage.id}: 設問ルール不在`)
      usedRuleIds.add(questionRule.id)
    }
  }

  assert.equal(approachTitles.size, PASSAGES.length, '全32長文で読み方の見出しを使い回さない')
  assert.equal(approachRuleSequences.size, PASSAGES.length, '全32長文で中核ルールの組合せを使い回さない')
  const rulesSharedByEveryPassage = [...knownRuleIds].filter((id) =>
    recommendedRuleSets.every((ruleSet) => ruleSet.has(id)))
  assert.deepEqual(rulesSharedByEveryPassage, [], '全テーマへ同じルールを固定配布しない')
  assert.deepEqual(usedRuleIds, knownRuleIds, '30ルールに実本文・実設問で使える入口を持たせる')
})

test('条件と代替を対比・譲歩として誤分類しない', () => {
  const passage = PASSAGES.find((item) => item.id === 'p_5_weather_field_trip')
  const sentence = passage.sentences.find((item) => item.en.startsWith('If it rains'))
  const ruleIds = readingRulesForSentence(sentence).map((rule) => rule.id)

  assert.ok(ruleIds.includes('logic-connectors'))
  assert.ok(!ruleIds.includes('contrast-concession'))
})

test('morning・eveningをing形と誤判定せず、本物のing形は拾う', () => {
  assert.ok(!readingRulesForSentence({ en: 'We meet on Thursday evening.' })
    .some((rule) => rule.id === 'ing-ed-role'))
  assert.ok(readingRulesForSentence({ en: 'Running helps.' })
    .some((rule) => rule.id === 'ing-ed-role'))
})

test('読解ルール画面と準備・本文・設問の三地点が接続される', () => {
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const list = readFileSync(new URL('../src/screens/ReadingList.jsx', import.meta.url), 'utf8')
  const prep = readFileSync(new URL('../src/screens/ReadingPrep.jsx', import.meta.url), 'utf8')
  const reader = readFileSync(new URL('../src/screens/Reader.jsx', import.meta.url), 'utf8')
  const readingCheck = readFileSync(new URL('../src/components/ReadingComprehensionCheck.jsx', import.meta.url), 'utf8')
  const rules = readFileSync(new URL('../src/screens/ReadingRules.jsx', import.meta.url), 'utf8')

  assert.match(app, /readingRules:\s*ReadingRulesScreen/)
  assert.match(list, /navigate\('readingRules'\)/)
  assert.match(prep, /data-reading-rules-for-passage=\{passage\.id\}/)
  assert.match(prep, /data-reading-approach-for-passage=\{passage\.id\}/)
  assert.match(prep, /このテーマの読み方/)
  assert.match(reader, /data-reading-rules-for-sentence=\{sentence\.reviewId\}/)
  assert.match(readingCheck, /readingRuleForQuestion\(question\.q\)/)
  assert.match(rules, /長文読解の30ルール/)
  assert.match(rules, /aria-label="長文読解の五段階"/)
})
