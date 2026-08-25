import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { GRAMMAR } from '../src/data/grammar.js'
import { PHRASES } from '../src/data/phrases.js'
import { buildPhraseInstructorExplanation } from '../src/lib/instructorExplanations.js'
import { UNKNOWN_CHOICE_ID } from '../src/lib/quizChoices.js'
import {
  MANUAL_SYNTAX_FAMILY,
  SYNTAX_FAMILY_GUIDES,
  SYNTAX_ITEM_FAMILY_OVERRIDES,
  SYNTAX_TOPIC_FAMILY,
  syntaxFamilyFor,
  syntaxFamilySearchText,
} from '../src/data/syntax-families.js'

const syntax = PHRASES.filter((item) => item.kind === 'syntax')
const generated = syntax.filter((item) => item.category === 'grammar-example')
const manual = syntax.filter((item) => item.category !== 'grammar-example')
const grammarById = new Map(GRAMMAR.map((item) => [item.id, item]))

test('構文350件を33ファミリーへ全件分類し、文法論点と既存IDを保つ', () => {
  assert.equal(syntax.length, 350)
  assert.equal(generated.length, 309)
  assert.equal(manual.length, 41)
  assert.equal(SYNTAX_FAMILY_GUIDES.length, 33)
  assert.equal(Object.keys(MANUAL_SYNTAX_FAMILY).length, manual.length)

  const usedFamilies = new Set()
  for (const item of syntax) {
    const guide = syntaxFamilyFor(item)
    assert.ok(guide, `${item.id}: 構文ファミリーがない`)
    usedFamilies.add(guide.id)
  }
  assert.equal(usedFamilies.size, SYNTAX_FAMILY_GUIDES.length)
  assert.deepEqual(
    [...usedFamilies].sort(),
    SYNTAX_FAMILY_GUIDES.map((guide) => guide.id).sort(),
  )

  for (const item of generated) {
    const source = grammarById.get(item.sourceGrammarId)
    assert.ok(source, item.id)
    assert.equal(item.sourceTopic, source.topic, item.id)
    assert.ok(SYNTAX_TOPIC_FAMILY[item.sourceTopic], `${item.id}: ${item.sourceTopic}`)
  }
  for (const item of manual) {
    assert.ok(MANUAL_SYNTAX_FAMILY[item.id], item.id)
  }
  for (const [id, familyId] of Object.entries(SYNTAX_ITEM_FAMILY_OVERRIDES)) {
    const item = syntax.find((candidate) => candidate.id === id)
    assert.ok(item, id)
    assert.equal(syntaxFamilyFor(item)?.id, familyId, id)
  }
})

test('各ファミリーに比較表・見分け方・例文・入試注意・誤答注意がそろう', () => {
  const hasJapanese = (value) => /[ぁ-んァ-ヶ一-龠]/.test(value ?? '')
  const hasEnglish = (value) => /[A-Za-z]/.test(value ?? '')

  for (const guide of SYNTAX_FAMILY_GUIDES) {
    assert.ok(guide.title.length >= 5, guide.id)
    assert.ok(guide.summary.length >= 35, guide.id)
    assert.ok(guide.decision.length >= 30, guide.id)
    assert.ok(guide.examTip.length >= 30, guide.id)
    assert.ok(hasJapanese(guide.summary), guide.id)
    assert.ok(hasJapanese(guide.decision), guide.id)
    assert.ok(hasJapanese(guide.examTip), guide.id)
    assert.ok(guide.patterns.length >= 2, guide.id)
    assert.ok(guide.pitfalls.length >= 2, guide.id)

    for (const pattern of guide.patterns) {
      assert.ok(pattern.form, `${guide.id}: form`)
      assert.ok(hasJapanese(pattern.meaning), `${guide.id}: ${pattern.form}: meaning`)
      assert.ok(hasEnglish(pattern.example), `${guide.id}: ${pattern.form}: example`)
      assert.ok(hasJapanese(pattern.ja), `${guide.id}: ${pattern.form}: ja`)
    }
    for (const pitfall of guide.pitfalls) {
      assert.ok(pitfall.length >= 12, `${guide.id}: ${pitfall}`)
    }
  }
})

test('haveの使役カードからmake・let・get・help・知覚・受動・被害まで比較できる', () => {
  const item = syntax.find((candidate) => candidate.id === 'curr_syn_gr_auto_pre2_causative_have_001')
  assert.ok(item)
  assert.equal(syntaxFamilyFor(item)?.id, 'causative-perception')

  const guideText = syntaxFamilySearchText(item)
  for (const required of [
    'make + O + do',
    'let + O + do',
    'have + O + do',
    'get + O + to do',
    'have/get + O + done',
    'help + O + (to) do',
    'see/hear/watch/feel/notice + O + do',
    '知覚動詞 + O + doing/done',
    'be made + to do',
    'O is allowed to do',
    '被害',
  ]) {
    assert.ok(guideText.includes(required), required)
  }
  assert.match(guideText, /O がその動作をする側なら do \/ to do、される側なら done/)
  assert.match(guideText, /財布を盗まれた/)

  const instructor = buildPhraseInstructorExplanation(item, UNKNOWN_CHOICE_ID)
  assert.match(instructor.answer, /使役・知覚を「Oがする／される」で整理/)
  assert.match(instructor.evidence, /O がその動作をする側なら do \/ to do、される側なら done/)
  assert.match(instructor.strategy, /使役動詞を一語ずつ暗記せず/)
  assert.doesNotMatch(instructor.trap, /後ろの前置詞・副詞が作る方向や状態/)
})

test('一覧・暗記・テストの全構文導線でファミリー解説を直接表示する', () => {
  const files = [
    ['Phrases.jsx', [/SyntaxFamilyGuide/, /data-syntax-family-filter/, /syntaxFamilySearchText/]],
    ['PhraseStudy.jsx', [/SyntaxFamilyGuide/, /item=\{item\}/]],
    ['PhraseQuiz.jsx', [/SyntaxFamilyGuide/, /item=\{item\}/]],
    ['VocabSearch.jsx', [/SyntaxFamilyGuide/, /item=\{phrase\}/, /この文のポイント/]],
  ]

  for (const [filename, patterns] of files) {
    const source = readFileSync(new URL(`../src/screens/${filename}`, import.meta.url), 'utf8')
    for (const pattern of patterns) assert.match(source, pattern, filename)
  }

  const component = readFileSync(
    new URL('../src/components/SyntaxFamilyGuide.jsx', import.meta.url),
    'utf8',
  )
  assert.match(component, /data-syntax-family-guide/)
  assert.match(component, /同じ仲間の形・意味・例/)
  assert.match(component, /入試での見抜き方/)
  assert.doesNotMatch(component, /<details|<summary/)
})
