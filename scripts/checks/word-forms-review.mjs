#!/usr/bin/env node
// 品詞のある全見出し語を、ほかの品詞の形の見直しで1語ずつ読んだかを確かめる。
// 見直した語は docs/audits/word-forms-review.json の reviewed に id を入れる（載せる形がない語も「読んだ」として入れる）。
// 見出し語を足すと、その語を読むまでこの確認は通らない。
// --usage をつけると、関連語欄の使い分けを読んだ語（usageReviewed）を確かめる。
// --derivatives は同じ品詞の派生語（derivativesReviewed）、--secondary は別の品詞の意味（secondaryReviewed）の2回目の見直し。
// --derivatives では、読んだ語の派生語の候補（derivative-candidates.mjs）を1件ずつ、載せたか載せない理由を書いたかも確かめる。
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../../src/data/vocab.js'

const POS = new Set(['名', '動', '形', '副'])
export const WORD_FORMS_REVIEW_PATH = new URL('../../docs/audits/word-forms-review.json', import.meta.url)

const LEDGER_KEYS = { forms: 'reviewed', usage: 'usageReviewed', derivatives: 'derivativesReviewed', secondary: 'secondaryReviewed' }
const LABELS = { forms: 'ほかの品詞の形の見直し', usage: '関連語の使い分けの見直し', derivatives: '同じ品詞の派生語の見直し', secondary: '別の品詞の意味の見直し' }

export async function wordFormsReviewGap({ usage = false, kind = usage ? 'usage' : 'forms' } = {}) {
  const ledger = JSON.parse(readFileSync(WORD_FORMS_REVIEW_PATH, 'utf8'))
  const reviewed = new Set(ledger[LEDGER_KEYS[kind]] ?? [])
  const population = ALL_WORDS.filter((word) => POS.has(word.pos))
  const missing = population.filter((word) => !reviewed.has(word.id)).map((word) => word.id)
  const known = new Set(ALL_WORDS.map((word) => word.id))
  const stale = [...reviewed].filter((id) => !known.has(id))
  const result = { population: population.length, reviewed: population.length - missing.length, missing, stale }
  if (kind === 'derivatives') Object.assign(result, await derivativeCandidateGap(ledger, reviewed))
  return result
}

/** 読んだ語の派生語の候補のうち、載せず理由もない候補と、候補でなくなった理由の行。 */
async function derivativeCandidateGap(ledger, reviewed) {
  const { derivativeCandidates, DERIVATIVE_SKIP_REASONS } = await import('../derivative-candidates.mjs')
  const skipped = ledger.derivativeCandidatesSkipped ?? {}
  const current = new Set()
  const undecided = []
  for (const [id, list] of derivativeCandidates()) {
    for (const { spelling } of list) {
      const key = `${id}|${spelling}`
      current.add(key)
      if (reviewed.has(id) && !skipped[key]) undecided.push(key)
    }
  }
  const staleSkips = Object.keys(skipped).filter((key) => !current.has(key))
  const badCodes = Object.entries(skipped).filter(([, code]) => !DERIVATIVE_SKIP_REASONS[code]).map(([key]) => key)
  return { candidates: current.size, undecided, staleSkips, badCodes }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const kind = ['usage', 'derivatives', 'secondary'].find((name) => process.argv.includes(`--${name}`)) ?? 'forms'
  const gap = await wordFormsReviewGap({ kind })
  console.log(`${LABELS[kind]}: ${gap.reviewed}/${gap.population} 語`)
  if (gap.stale.length) console.log(`辞書にない id: ${gap.stale.slice(0, 20).join(', ')}`)
  if (gap.missing.length) console.log(`まだ読んでいない語（先頭20）: ${gap.missing.slice(0, 20).join(', ')}`)
  const candidateProblems = [...(gap.undecided ?? []), ...(gap.staleSkips ?? []), ...(gap.badCodes ?? [])]
  if (gap.undecided) {
    console.log(`派生語の候補: 全 ${gap.candidates} 件のうち、読んだ語の候補で載せず理由もないもの ${gap.undecided.length} 件`)
    if (gap.undecided.length) console.log(`  先頭20: ${gap.undecided.slice(0, 20).join(' ')}`)
    if (gap.staleSkips.length) console.log(`候補でなくなった理由の行: ${gap.staleSkips.join(' ')}`)
    if (gap.badCodes.length) console.log(`略号がちがう行: ${gap.badCodes.join(' ')}`)
  }
  process.exit(gap.missing.length || gap.stale.length || candidateProblems.length ? 1 : 0)
}
