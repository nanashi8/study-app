// 公開語源は、手動監査済みカードと明示リンクだけを合格条件にする。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ALL_WORDS,
  ETYMOLOGY_LEGACY_PACKS,
  ETYMOLOGY_PACKS,
  etymologyCardsForWord,
  getWord,
} from '../src/data/vocab.js'
import {
  ETYMOLOGY_QUALITY_TARGETS,
  auditEtymologyLearningQuality,
} from '../scripts/check-etymology-learning-quality.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('全8,869語を走査し、109カード・781語だけを確認済み教材として公開する', () => {
  const report = auditEtymologyLearningQuality()
  assert.deepEqual(report.errors, [])
  assert.equal(ALL_WORDS.length, ETYMOLOGY_QUALITY_TARGETS.rawWords)
  assert.equal(ETYMOLOGY_PACKS.length, ETYMOLOGY_QUALITY_TARGETS.publicCards)
  assert.equal(report.publicWords, ETYMOLOGY_QUALITY_TARGETS.publicWords)
  assert.equal(report.publicLinks, ETYMOLOGY_QUALITY_TARGETS.publicLinks)
  assert.equal(report.quarantinedWords, ETYMOLOGY_QUALITY_TARGETS.quarantinedWords)
  assert.equal(ETYMOLOGY_LEGACY_PACKS.length, ETYMOLOGY_QUALITY_TARGETS.retiredLegacyPacks)
})

test('公開カードの全リンクは明示され、出典・確認日・内容固定hashを持つ', () => {
  for (const card of ETYMOLOGY_PACKS) {
    assert.equal(card.mode, 'root', card.id)
    assert.equal(card.groupClaim, 'manual-reviewed-root', card.id)
    assert.ok(card.evidence.reviewedAt, card.id)
    assert.equal(card.evidence.reviewedBy, 'manual-etymology-audit', card.id)
    assert.match(card.evidence.fingerprint, /^[a-f0-9]{64}$/, card.id)
    assert.equal(card.evidence.sources.length, card.evidence.sourceHeads.length * 2, card.id)
    assert.deepEqual(card.studyIds, card.coverageIds, card.id)
    assert.equal(new Set(card.coverageIds).size, card.coverageIds.length, card.id)

    for (const wordId of card.coverageIds) {
      const word = getWord(wordId)
      assert.ok(word, `${card.id}: ${wordId}`)
      const explicit = (word.etymology?.parts ?? []).some((part) => part.root === card.rootId)
        || (word.referenceRoots ?? []).includes(card.rootId)
      assert.ok(explicit, `${card.id}: ${word.word}`)
      assert.ok(etymologyCardsForWord(word).some((item) => item.id === card.id), word.id)
    }
  }
})

test('he と既知の誤接続を公開カードへ戻さない', () => {
  assert.deepEqual(etymologyCardsForWord('he'), [])
  assert.ok(!etymologyCardsForWord('compose').some((card) => card.rootId === 'pos'))
  assert.ok(!etymologyCardsForWord('adjust').some((card) => card.rootId === 'jud'))
  assert.ok(etymologyCardsForWord('print').some((card) => card.rootId === 'press'))
  assert.ok(!etymologyCardsForWord('print').some((card) => card.rootId === 'prim'))
})

test('公開画面は通常の単語暗記へ進み、廃止した語源専用画面を持たない', () => {
  const roots = read('src/screens/Roots.jsx')
  const pack = read('src/screens/EtymologyPack.jsx')
  const rootDetail = read('src/screens/RootDetail.jsx')
  const wordBits = read('src/components/WordBits.jsx')
  const app = read('src/App.jsx')
  const visibility = read('src/lib/learnerVisibility.js')
  const learnerSource = `${roots}\n${pack}\n${rootDetail}\n${wordBits}`

  assert.equal((learnerSource.match(/data-etymology-word-study-action/g) ?? []).length, 3)
  assert.equal((learnerSource.match(/navigate\('vocabStudy'/g) ?? []).length, 3)
  assert.doesNotMatch(learnerSource, /navigate\('(?:etymologyStudy|etymologyQuiz|vocabQuiz)'/)
  assert.doesNotMatch(app, /etymologyStudy:\s|etymologyQuiz:\s|EtymologyStudyScreen|EtymologyQuizScreen/)
  assert.match(visibility, /'etymologyStudy'/)
  assert.match(visibility, /'etymologyQuiz'/)

  const block = wordBits.slice(
    wordBits.indexOf('export function EtymologyBlock'),
    wordBits.indexOf('/** 語源でつながる単語'),
  )
  assert.match(block, /etymologyCardsForWord/)
})
