#!/usr/bin/env node
// 品詞のある全見出し語を、ほかの品詞の形の見直しで1語ずつ読んだかを確かめる。
// 見直した語は docs/audits/word-forms-review.json の reviewed に id を入れる（載せる形がない語も「読んだ」として入れる）。
// 見出し語を足すと、その語を読むまでこの確認は通らない。
// --usage をつけると、関連語欄の使い分けを読んだ語（usageReviewed）を確かめる。
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../../src/data/vocab.js'

const POS = new Set(['名', '動', '形', '副'])
export const WORD_FORMS_REVIEW_PATH = new URL('../../docs/audits/word-forms-review.json', import.meta.url)

export function wordFormsReviewGap({ usage = false } = {}) {
  const ledger = JSON.parse(readFileSync(WORD_FORMS_REVIEW_PATH, 'utf8'))
  const reviewed = new Set(usage ? ledger.usageReviewed ?? [] : ledger.reviewed)
  const population = ALL_WORDS.filter((word) => POS.has(word.pos))
  const missing = population.filter((word) => !reviewed.has(word.id)).map((word) => word.id)
  const known = new Set(ALL_WORDS.map((word) => word.id))
  const stale = [...reviewed].filter((id) => !known.has(id))
  return { population: population.length, reviewed: population.length - missing.length, missing, stale }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const usage = process.argv.includes('--usage')
  const gap = wordFormsReviewGap({ usage })
  console.log(`${usage ? '関連語の使い分けの見直し' : 'ほかの品詞の形の見直し'}: ${gap.reviewed}/${gap.population} 語`)
  if (gap.stale.length) console.log(`辞書にない id: ${gap.stale.slice(0, 20).join(', ')}`)
  if (gap.missing.length) console.log(`まだ読んでいない語（先頭20）: ${gap.missing.slice(0, 20).join(', ')}`)
  process.exit(gap.missing.length || gap.stale.length ? 1 : 0)
}
