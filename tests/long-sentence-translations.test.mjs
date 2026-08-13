import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PHRASES } from '../src/data/phrases.js'
import {
  LONG_SENTENCE_TRANSLATIONS,
  applyLongManualReviewState,
  LONG_SENTENCE_CORE_WORD_LIMIT,
  LONG_SENTENCE_MODIFIER_WORD_LIMIT,
  LONG_SENTENCE_WORD_THRESHOLD,
  englishWordCount,
  isLongSyntaxSentence,
  longSentenceTranslationFor,
} from '../src/data/long-sentence-translations.js'
import { LONG_MANUAL_REVIEW_LEDGER } from '../src/data/reading-phrase-review-ledger.js'
import { LONG_SENTENCE_ROLE_EXPECTATIONS } from '../src/data/long-sentence-role-expectations.js'
import { longSentenceExplanationTexts } from '../src/lib/explanationDedup.js'

const normalizeEnglish = (value = '') => value.replace(/\s+/g, ' ').trim()

test('独立した長い構文33文すべてに、意味・発音フレーズと内部SVOCMが対応する', () => {
  assert.equal(LONG_SENTENCE_WORD_THRESHOLD, 12)

  const targets = PHRASES.filter(isLongSyntaxSentence)
  assert.equal(targets.length, 33)
  assert.equal(Object.keys(LONG_SENTENCE_ROLE_EXPECTATIONS).length, 33)
  assert.ok(
    Object.values(LONG_SENTENCE_TRANSLATIONS)
      .reduce((sum, item) => sum + item.steps.length, 0) >= targets.length * 2,
    '全33文をそれぞれ複数の内部SVOCM単位へ分ける',
  )
  assert.equal(
    Object.values(LONG_SENTENCE_TRANSLATIONS)
      .reduce((sum, item) => sum + item.meaningSteps.length, 0),
    103,
    '全33文の学習者向け意味フレーズを全件固定する',
  )
  assert.deepEqual(
    Object.keys(LONG_SENTENCE_TRANSLATIONS).sort(),
    targets.map((item) => item.id).sort(),
    '12語以上の構文を追加・削除したときは直訳ガイドも同時に更新する',
  )

  for (const item of targets) {
    const translation = longSentenceTranslationFor(item)
    assert.ok(translation, item.id)
    assert.ok(englishWordCount(item.example.en) >= LONG_SENTENCE_WORD_THRESHOLD, item.id)
    assert.ok(translation.steps.length >= 2, `${item.id}: 一文を複数の内部SVOCM単位へ分ける`)
    assert.ok(translation.meaningSteps.length >= 2, `${item.id}: 一文を複数の意味フレーズへ分ける`)
    assert.equal(
      normalizeEnglish(translation.steps.map((part) => part.en).join(' ')),
      normalizeEnglish(item.example.en),
      `${item.id}: フレーズを連結しても元の英文を復元できない`,
    )
    assert.equal(
      normalizeEnglish(translation.meaningSteps.map((part) => part.spokenEn).join(' ')),
      normalizeEnglish(item.example.en),
      `${item.id}: 意味フレーズを連結しても元の英文を復元できない`,
    )
    assert.deepEqual(
      translation.steps.map((part) => [part.en, part.role]),
      LONG_SENTENCE_ROLE_EXPECTATIONS[item.id],
      `${item.id}: 33文独立台帳のフレーズ・role列と一致しない`,
    )
    assert.ok(translation.tip.length >= 30, `${item.id}: 文全体の読み方が短い`)

    for (const [index, part] of translation.steps.entries()) {
      const at = `${item.id}: フレーズ${index + 1}`
      assert.ok(part.en.trim(), `${at}: 英語が空`)
      const wordLimit = part.role === 'M'
        ? LONG_SENTENCE_MODIFIER_WORD_LIMIT
        : LONG_SENTENCE_CORE_WORD_LIMIT
      assert.ok(
        englishWordCount(part.en) <= wordLimit,
        `${at}: ${part.role}の上限${wordLimit}語を超えている`,
      )
      assert.ok(['LINK', 'S', 'V', 'O', 'O1', 'O2', 'C', 'M'].includes(part.role), `${at}: 役割が不明`)
      assert.ok(part.roles.length >= 1, `${at}: 文法上の働きがない`)
      assert.ok(part.roleParts.length >= 1, `${at}: フレーズ内の文法要素がない`)
      assert.deepEqual(
        [...new Set(part.roleParts.map((rolePart) => rolePart.role))],
        part.roles,
        `${at}: フレーズ内の役割と役割一覧が一致しない`,
      )
      assert.equal(part.spokenEn, part.en, `${at}: 説明用の補いを原文音声へ混ぜない`)
      assert.ok(
        ['confirmed', 'reviewed', 'review-needed'].includes(part.status),
        `${at}: 確認状態が不明`,
      )
      assert.ok(part.reviewState, `${at}: 本文見直し状態がない`)
      assert.ok(part.roleHeading.trim(), `${at}: SVOCM表示がない`)
      assert.ok(part.roleNote.length >= 30, `${at}: 役割別の直訳説明が短い`)
      assert.match(part.ja, /[ぁ-んァ-ヶ一-龠]/, `${at}: 日本語の直訳がない`)
      assert.ok(part.note.length >= 7, `${at}: 項目固有の解説が短い`)
    }
    for (const [index, part] of translation.meaningSteps.entries()) {
      const at = `${item.id}: 意味フレーズ${index + 1}`
      assert.ok(part.en.trim(), `${at}: 英語が空`)
      assert.ok(englishWordCount(part.en) <= 8, `${at}: 一息の上限8語を超えている`)
      assert.ok(part.roles.length >= 1, `${at}: 内部SVOCMがない`)
      assert.ok(part.roleParts.length >= 1, `${at}: 内部の役割別英語がない`)
      assert.deepEqual(
        [...new Set(part.roleParts.map((rolePart) => rolePart.role))],
        part.roles,
        `${at}: 内部SVOCMと役割一覧が一致しない`,
      )
      assert.equal(part.spokenEn, part.en, `${at}: 表示用の補いを原文音声へ混ぜない`)
      assert.match(part.ja, /[ぁ-んァ-ヶ一-龠]/, `${at}: 対応する日本語がない`)
      assert.equal(part.status, 'confirmed', `${at}: 最終監査未確認`)
      assert.equal(part.reviewState, 'audit-confirmed', `${at}: 本文見直し未確認`)
    }
    if (item.sourceGrammarId) {
      assert.equal(
        longSentenceTranslationFor({ id: item.sourceGrammarId }),
        translation,
        `${item.id}: 元の文法問題へ同じ直訳ガイドが接続されていない`,
      )
    }
  }
})

test('長い一文の自然訳と英語順の対応訳は、一覧詳細・学習・クイズで共通表示する', () => {
  const component = readFileSync(
    new URL('../src/components/LongSentenceTranslation.jsx', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(component, /フレーズで前から直訳/)
  assert.match(component, /英語を発音できて意味が通るまとまり/)
  assert.match(component, /SVOCMは各フレーズ内部の構造を示します/)
  assert.match(component, /guide\?\.meaningSteps/)
  assert.match(component, /data-long-sentence-step/)
  assert.match(component, /item\.roleParts\.map/)
  assert.match(component, /item\.roleQuestion/)
  assert.doesNotMatch(component, /確認待ち/)
  assert.doesNotMatch(component, /本文見直し済み/)
  assert.doesNotMatch(component, /監査確認済み/)
  assert.match(component, /item\.spokenEn \?\? item\.en/)
  assert.match(component, /japanesePhraseSpeechText\(item\.ja\)/)
  assert.match(component, /前からは、/)
  assert.match(component, /英語、対応する日本語、文法解説の順で再生/)
  assert.match(component, /roleParts/)
  assert.match(component, /longSentenceExplanationTexts/)
  assert.match(component, /読み方：/)

  for (const path of [
    '../src/screens/Phrases.jsx',
    '../src/screens/PhraseStudy.jsx',
    '../src/screens/PhraseQuiz.jsx',
    '../src/screens/GrammarQuiz.jsx',
  ]) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    assert.match(source, /longSentenceTranslationFor/)
    assert.match(source, /<LongSentenceTranslation/)
    assert.match(source, /自然な和訳/)
  }
})

test('長い一文33件は同一の文法説明を画面と音声で繰り返さない', () => {
  let stepCount = 0
  for (const [id, guide] of Object.entries(LONG_SENTENCE_TRANSLATIONS)) {
    const steps = guide.meaningSteps?.length ? guide.meaningSteps : guide.steps
    const sourceTexts = steps
      .flatMap((step) => [step.note, step.roleNote])
      .map((text) => String(text ?? '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
    const visibleTexts = longSentenceExplanationTexts(steps)
      .map((text) => String(text ?? '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
    stepCount += steps.length
    assert.equal(new Set(visibleTexts).size, visibleTexts.length, id)
    assert.deepEqual(new Set(visibleTexts), new Set(sourceTexts), id)
  }
  assert.equal(Object.keys(LONG_SENTENCE_TRANSLATIONS).length, 33)
  assert.equal(stepCount, 103)
})

test('33文は明示台帳一致時だけ最終監査確認済みになる', () => {
  const guides = Object.values(LONG_SENTENCE_TRANSLATIONS)
  assert.equal(Object.keys(LONG_MANUAL_REVIEW_LEDGER).length, 33)
  assert.ok(guides.every((item) => item.status === 'confirmed'))
  assert.ok(guides.every((item) => item.reviewState === 'audit-confirmed'))
  assert.ok(guides.every((item) => item.steps.every((part) =>
    part.status === 'confirmed' && part.reviewState === 'audit-confirmed')))
  assert.ok(guides.every((item) => item.meaningSteps.every((part) =>
    part.status === 'confirmed' && part.reviewState === 'audit-confirmed')))

  const source = LONG_SENTENCE_TRANSLATIONS.exam_syn_as_long_as
  const changedJa = {
    ...source,
    steps: source.steps.map((part, index) => ({
      ...part,
      ja: index === 0 ? `${part.ja}（変更）` : part.ja,
    })),
  }
  const recheckedJa = applyLongManualReviewState('exam_syn_as_long_as', changedJa)
  assert.equal(recheckedJa.status, 'review-needed')
  assert.ok(recheckedJa.steps.every((part) => part.reviewState === 'unregistered'))

  const changedRole = {
    ...source,
    steps: source.steps.map((part, index) => ({
      ...part,
      role: index === 0 ? 'M' : part.role,
    })),
  }
  assert.equal(
    applyLongManualReviewState('exam_syn_as_long_as', changedRole).status,
    'review-needed',
  )

  const added = applyLongManualReviewState('new_long_sentence', source)
  assert.equal(added.status, 'review-needed')
  assert.ok(added.steps.every((part) => part.reviewState === 'unregistered'))
})

test('長い一文の融合関係詞・前置詞関係詞・一致・句読点境界を固定する', () => {
  const what = LONG_SENTENCE_TRANSLATIONS.curr_syn_gr_more_1_emph_01
    .steps.find((item) => item.en.toLowerCase() === 'what')
  assert.equal(what.role, 'O')
  assert.deepEqual(what.clauseBinding, {
    type: 'fused-relative-subject-clause', internalRole: 'O', outerRole: 'S', governor: 'objects to',
  })

  const extent = LONG_SENTENCE_TRANSLATIONS.curr_syn_gr_auto_1_extent_to_which_002
    .steps.find((item) => item.en.toLowerCase() === 'to which')
  assert.equal(extent.role, 'M')
  assert.equal(extent.clauseBinding.antecedent, 'extent')

  for (const id of [
    'curr_syn_gr_auto_1_agreement_neither_001',
    'curr_syn_gr_auto_1_agreement_neither_002',
  ]) {
    const were = LONG_SENTENCE_TRANSLATIONS[id].steps.find((item) => item.en.toLowerCase() === 'were')
    assert.deepEqual(were.agreementBinding, {
      type: 'proximity-agreement', controller: 'the members', number: 'plural',
    })
  }

  const cats = LONG_SENTENCE_TRANSLATIONS.curr_syn_gr_pre2_pron_3
    .steps.find((item) => item.en.toLowerCase() === 'one')
  assert.equal(cats.punctuationBoundary.mark, ';')
  assert.match(cats.note, /独立節/)

  const there = LONG_SENTENCE_TRANSLATIONS.curr_syn_gr_auto_2_gerund_idiom_001
  assert.equal(there.steps.find((item) => item.en.toLowerCase() === 'there is')
    .clauseBinding.type, 'existential-there')
  assert.equal(there.steps.find((item) => item.en.toLowerCase() === 'no denying')
    .clauseBinding.type, 'there-is-no-gerund')
})
