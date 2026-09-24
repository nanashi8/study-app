#!/usr/bin/env node
// 類義語・反対語・同じ意味の熟語の欄の全行に、使い分けの解説があるかを確かめる。
//   node scripts/checks/relation-usage.mjs synonyms   … 「意味が同じ・近い語」の全行
//   node scripts/checks/relation-usage.mjs antonyms   … 「意味が反対・対照の語」の全行
//   node scripts/checks/relation-usage.mjs idioms     … 「同じ意味の熟語」の全行
//   引数なし … 3つとも
// どれでも、解説の台帳に画面のどこにも出ない組が残っていないか、直しの台帳が古くなっていないかも見る。
import { ALL_WORDS } from '../../src/data/vocab.js'
import { WORD_IDIOM_NOTES, WORD_RELATION_NOTES } from '../../src/data/word-relation-notes.js'
import {
  RELATION_ADDITIONS,
  RELATION_MEANING_FIXES,
  RELATION_REMOVALS,
  UNMATCHED_RELATION_EDITS,
} from '../../src/data/word-relation-edits.js'
import { wordRelationsFor } from '../../src/lib/wordRelations.js'

export const RELATION_USAGE_KINDS = ['synonyms', 'antonyms', 'idioms']
const pairKey = (a, b) => [String(a).toLowerCase(), String(b).toLowerCase()].sort().join('|')

/** 欄ごとの全行と、解説のない行・台帳の古い行。 */
export function relationUsageGaps() {
  const rows = { synonyms: [], antonyms: [], idioms: [] }
  const shownPairs = new Set()
  const shownIdioms = new Set()
  for (const word of ALL_WORDS) {
    const relations = wordRelationsFor(word)
    for (const kind of ['synonyms', 'antonyms']) {
      for (const item of relations[kind]) {
        shownPairs.add(pairKey(word.word, item.w))
        rows[kind].push({ at: `${word.id}>${item.w}`, key: pairKey(word.word, item.w), explained: Boolean(item.usageNote) })
      }
    }
    for (const phrase of relations.idioms) {
      const key = `${word.id}|${phrase.id}`
      shownIdioms.add(key)
      rows.idioms.push({ at: `${word.id}>${phrase.phrase}`, key, explained: Boolean(phrase.usageNote) })
    }
  }
  const stale = [
    ...Object.keys(WORD_RELATION_NOTES).filter((key) => !shownPairs.has(key)).map((key) => `類義語・反対語の解説 ${key} は、どの語の欄にも出ない`),
    ...Object.keys(WORD_IDIOM_NOTES).filter((key) => !shownIdioms.has(key)).map((key) => `同じ意味の熟語の解説 ${key} は、その語の欄に出ない`),
    ...UNMATCHED_RELATION_EDITS,
  ]
  const ledgerProblems = []
  for (const [id, kind, w, m, reason] of RELATION_ADDITIONS) {
    if (!['syn', 'ant'].includes(kind) || !w || !m || !reason) ledgerProblems.push(`足す項目 ${id} ${kind} ${w}: 欄・語・意味・理由が要る`)
    if (!ALL_WORDS.some((word) => word.id === id)) ledgerProblems.push(`足す項目の見出し語 ${id} が辞書にない`)
  }
  for (const [id, kind, w, reason] of RELATION_REMOVALS) {
    if (!['syn', 'ant'].includes(kind) || !w || !reason) ledgerProblems.push(`外す項目 ${id} ${kind} ${w}: 欄・語・理由が要る`)
  }
  for (const [id, kind, w, m] of RELATION_MEANING_FIXES) {
    if (!['syn', 'ant'].includes(kind) || !w || !m) ledgerProblems.push(`意味を直す項目 ${id} ${kind} ${w}: 欄・語・意味が要る`)
  }
  const result = {}
  for (const kind of RELATION_USAGE_KINDS) {
    const list = rows[kind]
    result[kind] = {
      rows: list.length,
      pairs: new Set(list.map((row) => row.key)).size,
      missing: list.filter((row) => !row.explained).map((row) => row.at),
    }
  }
  return { ...result, stale, ledgerProblems }
}

const LABELS = { synonyms: '意味が同じ・近い語', antonyms: '意味が反対・対照の語', idioms: '同じ意味の熟語' }

if (import.meta.url === `file://${process.argv[1]}`) {
  const kinds = process.argv.slice(2).filter((arg) => RELATION_USAGE_KINDS.includes(arg))
  const gaps = relationUsageGaps()
  let failed = false
  for (const kind of kinds.length ? kinds : RELATION_USAGE_KINDS) {
    const { rows, pairs, missing } = gaps[kind]
    console.log(`${LABELS[kind]}: ${rows - missing.length}/${rows} 行（${pairs}組）に解説`)
    if (missing.length) {
      failed = true
      console.log(`  解説のない行（先頭30）: ${missing.slice(0, 30).join(' ')}`)
    }
  }
  for (const line of [...gaps.stale, ...gaps.ledgerProblems]) console.log(`  ${line}`)
  if (gaps.stale.length || gaps.ledgerProblems.length) failed = true
  process.exit(failed ? 1 : 0)
}
