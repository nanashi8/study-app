// 文法の問題のうち、参考書に結び付かない2,907問の英文と和訳の食いちがいを止めるテスト
// （requests/2026-10-02-grammar-quiz-translations.json・scripts/checks/grammar-quiz-translations.mjs）。
//
// 2026-10-02、2,907問の英文と和訳を1件ずつ読み、自動で作る問題の部品（src/data/grammar-generated.js）の和訳の抜けで
// 食いちがっていた32問を、部品を直して直した。読んだ記録は級・単元ごとの指紋で台帳に残し、
// 英文か和訳を変えたら読み直して --stamp するまで止まる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { GRAMMAR_PRACTICE } from '../src/data/grammar.js'
import { grammarQuizSentences } from '../scripts/checks/grammar-reference-translations.mjs'
import { GRAMMAR_QUIZ_TRANSLATION_REVIEW_PATH, grammarQuizRestSentences, grammarQuizTranslationReview } from '../scripts/checks/grammar-quiz-translations.mjs'

const ledger = JSON.parse(readFileSync(GRAMMAR_QUIZ_TRANSLATION_REVIEW_PATH, 'utf8'))
const review = grammarQuizTranslationReview(ledger)
const byId = new Map(GRAMMAR_PRACTICE.map((item) => [item.id, item]))

test('読む問題：文法の問題4,430問のうち、参考書の台帳が読む1,523問を除く2,907問（自動で作った問題2,422・試験の型の問題421・そのほか64、124単元）', () => {
  assert.equal(GRAMMAR_PRACTICE.length, 4_430)
  const tied = new Set(grammarQuizSentences().map((item) => item.id))
  const rest = grammarQuizRestSentences()
  assert.equal(tied.size, 1_523)
  assert.equal(rest.length + tied.size, GRAMMAR_PRACTICE.length, '2つの台帳で文法の問題すべてを覆う')
  assert.ok(rest.every((item) => !tied.has(item.id)), '参考書の台帳と重ならない')
  assert.deepEqual(review.counts, { items: 2_907, auto: 2_422, exam: 421, other: 64, groups: 124 })
  assert.deepEqual(ledger.counts, review.counts, '台帳の数')
})

test('読んだ記録：全124単元の英文と和訳の指紋が台帳と一致する（変えたら、その単元の問題を読み直して --stamp）', () => {
  assert.deepEqual(review.changedGroups, [], '読み直しが要る単元')
  assert.deepEqual(review.removedGroups, [], 'なくなった単元')
  assert.equal(Object.keys(ledger.groups).length, 124)
})

test('直したもの：32問（in practice・under pressure の抜け12・in practice・under current conditions の抜け18・the company’s の抜け2）の和訳が直したとおりで、直す前の和訳がない', () => {
  assert.equal(ledger.fixes.length, 32)
  const counts = { partialNegation: 0, comparison: 0, agreementNeither: 0 }
  for (const fix of ledger.fixes) {
    const item = byId.get(fix.id)
    assert.ok(item, `${fix.id} がある`)
    assert.equal(item.sentence.en, fix.en, `${fix.id} の英文`)
    assert.equal(item.sentence.ja, fix.after, `${fix.id} の和訳`)
    assert.notEqual(fix.before, fix.after)
    assert.ok(fix.why, `${fix.id} の直し方`)
    if (fix.id.startsWith('gr_auto_2_partial_negation_')) counts.partialNegation += 1
    else if (fix.id.startsWith('gr_auto_pre1_comparison_')) counts.comparison += 1
    else if (fix.id.startsWith('gr_auto_1_agreement_neither_')) counts.agreementNeither += 1
  }
  assert.deepEqual(counts, { partialNegation: 12, comparison: 18, agreementNeither: 2 })
  const befores = new Set(ledger.fixes.map((fix) => fix.before))
  assert.deepEqual(GRAMMAR_PRACTICE.filter((item) => befores.has(item.sentence.ja)).map((item) => item.id), [], '直す前の和訳がどこにも残っていない')
})

test('手がかり：2,907問から拾った候補6問すべてに、食いちがいではない理由が台帳にある（使われなくなった理由もない）', () => {
  assert.equal(review.candidates.length, 6)
  assert.deepEqual(review.unexplained.map((item) => `${item.id}: ${item.clues.join(' / ')}`), [])
  assert.deepEqual(review.stale, [])
})

test('自動で作る問題の部品：文末・目的語の語句が、文法の問題4,430問すべてで和訳に入っている', () => {
  const phrases = [
    [/\bin practice\b/iu, /実際(?:に|の|は)/u, 'in practice', 15],
    [/\bunder pressure\b/iu, /圧力|重圧/u, 'under pressure', 7],
    [/\bunder current conditions\b/iu, /現状/u, 'under current conditions', 9],
    [/\bat this stage\b/iu, /この段階|現段階/u, 'at this stage', 17],
    [/\bthe company’s\b/iu, /会社の/u, 'the company’s', 7],
  ]
  for (const [en, ja, label, count] of phrases) {
    const hits = GRAMMAR_PRACTICE.filter((item) => en.test(item.sentence.en))
    assert.equal(hits.length, count, `${label} を使う問題の数`)
    assert.deepEqual(hits.filter((item) => !ja.test(item.sentence.ja)).map((item) => `${item.id}: ${item.sentence.ja}`), [], `${label} の訳`)
  }
})
