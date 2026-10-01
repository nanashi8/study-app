#!/usr/bin/env node
// 文法の問題のうち、参考書に結び付かない問題の英文と和訳の食いちがいを止める
// （requests/2026-10-02-grammar-quiz-translations.json）。
//
// 2026-10-02、参考書に結び付く1,523問（scripts/checks/grammar-reference-translations.mjs の grammarQuizSentences）を除く
// 2,907問（自動で作った問題2,422・試験の型の問題421・そのほか64）の英文と和訳を1件ずつ読んだ。
// 見つかった食いちがいは、自動で作る問題の部品（src/data/grammar-generated.js）の和訳の抜けで、
// 文末の in practice・under pressure・under current conditions と、目的語の the company’s が訳になかった。
// 部品を直して32問の和訳を直した。2つの読んだ記録（参考書の台帳とこの台帳）で、文法の問題4,430問すべてを覆う。
// ここは次の2つで、読んだあとに変わったものと、手がかりでわかる食いちがいを止める。
//   1. 読んだ記録     … 級・単元ごとに、英文と和訳の指紋を台帳に残す。変えたらその単元の問題を読み直して --stamp
//   2. 和訳の手がかり … 参考書と同じ手がかり（translationClues）。拾っても食いちがいではないものは exceptions に理由を書く
//   node scripts/checks/grammar-quiz-translations.mjs          … 理由のない候補と、読み直しが要る単元を出す
//   node scripts/checks/grammar-quiz-translations.mjs --stamp  … 読み直した単元の指紋と数を台帳に書く
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { GRAMMAR_PRACTICE } from '../../src/data/grammar.js'
import { grammarQuizSentences, pairKey, translationClues } from './grammar-reference-translations.mjs'

export const GRAMMAR_QUIZ_TRANSLATION_REVIEW_PATH = new URL('../../docs/audits/grammar-quiz-translations.json', import.meta.url)

const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16)
const source = (id) => (id.startsWith('gr_auto_') ? 'auto' : id.startsWith('gr_exam_') ? 'exam' : 'other')

/** 参考書に結び付かない文法の問題（参考書の台帳が読む1,523問を除くすべて）。 */
export function grammarQuizRestSentences() {
  const tied = new Set(grammarQuizSentences().map((item) => item.id))
  return GRAMMAR_PRACTICE.filter((item) => !tied.has(item.id)).map((item) => ({
    id: item.id,
    group: `${item.level}/${item.topic}`,
    source: source(item.id),
    en: item.sentence.en,
    ja: item.sentence.ja,
    key: pairKey(item.sentence.en, item.sentence.ja),
  }))
}

/** 級・単元ごとの指紋。その単元の問題の英文か和訳を変える・足す・消すと変わる。 */
export function grammarQuizRestFingerprints(items = grammarQuizRestSentences()) {
  const groups = new Map()
  for (const item of items) {
    if (!groups.has(item.group)) groups.set(item.group, [])
    groups.get(item.group).push([item.id, item.en, item.ja])
  }
  return Object.fromEntries([...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, rows]) => [group, hash(JSON.stringify(rows.sort(([a], [b]) => a.localeCompare(b))))]))
}

function readLedger() {
  try {
    return JSON.parse(readFileSync(GRAMMAR_QUIZ_TRANSLATION_REVIEW_PATH, 'utf8'))
  } catch {
    return { exceptions: {}, groups: {} }
  }
}

export function grammarQuizCounts(items = grammarQuizRestSentences()) {
  return {
    items: items.length,
    auto: items.filter((item) => item.source === 'auto').length,
    exam: items.filter((item) => item.source === 'exam').length,
    other: items.filter((item) => item.source === 'other').length,
    groups: new Set(items.map((item) => item.group)).size,
  }
}

/** 台帳と今のデータを照らし合わせる。 */
export function grammarQuizTranslationReview(ledger = readLedger()) {
  const items = grammarQuizRestSentences()
  const exceptions = ledger.exceptions ?? {}
  const candidates = items.map((item) => ({ ...item, clues: translationClues(item) })).filter((item) => item.clues.length)
  const candidateKeys = new Set(candidates.map((item) => item.key))
  const fingerprints = grammarQuizRestFingerprints(items)
  const stamped = ledger.groups ?? {}
  return {
    items,
    counts: grammarQuizCounts(items),
    candidates,
    unexplained: candidates.filter((item) => !exceptions[item.key]),
    stale: Object.keys(exceptions).filter((key) => !candidateKeys.has(key)),
    fingerprints,
    changedGroups: Object.keys(fingerprints).filter((group) => stamped[group] !== fingerprints[group]),
    removedGroups: Object.keys(stamped).filter((group) => !(group in fingerprints)),
  }
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === `file://${process.argv[1]}`
if (runDirectly) {
  const ledger = readLedger()
  const review = grammarQuizTranslationReview(ledger)
  if (process.argv.includes('--stamp')) {
    ledger.counts = review.counts
    ledger.groups = review.fingerprints
    writeFileSync(GRAMMAR_QUIZ_TRANSLATION_REVIEW_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
    console.error(`指紋を書き直した: ${review.changedGroups.length}単元（全${review.counts.groups}単元・${review.counts.items}問）`)
    process.exit(0)
  }
  for (const item of review.unexplained) console.log(['和訳', item.key, item.id, item.en, item.ja, item.clues.join(' / ')].join('\t'))
  for (const group of review.changedGroups) console.log(['読み直し', group].join('\t'))
  for (const group of review.removedGroups) console.log(['なくなった単元', group].join('\t'))
  console.error([
    `英文と和訳: ${review.counts.items}問のうち手がかりの候補${review.candidates.length}問（理由のないもの${review.unexplained.length}・使われなくなった理由${review.stale.length}）`,
    `読んだ記録: 全${review.counts.groups}単元のうち読み直しが要るもの${review.changedGroups.length}・なくなったもの${review.removedGroups.length}`,
  ].join('\n'))
  const failed = review.unexplained.length || review.stale.length || review.changedGroups.length || review.removedGroups.length
  process.exit(failed ? 1 : 0)
}
