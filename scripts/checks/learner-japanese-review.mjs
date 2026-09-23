#!/usr/bin/env node
// 英語教材で学習者に見せる日本語を、漢字のかたまり（run）ごとに「中高生がそのまま読めるか」で見直した台帳の確認。
//
// 母集団: 見出し語の意味・ほかの意味とその注と例文・関連語の意味・例文の和訳・使い分け・語の成り立ち（画面に出す本文）・
//         ほかの品詞の形の注と意味・カタカナ語の注・熟語構文の意味と例文と注と成り立ち。
// 見直しは2つの粒度でする。
//  glosses … 意味の欄（見出し語の訳語・ほかの意味・関連語の意味・熟語構文の意味）は、訳語1つずつ全文を読む。
//            「(水深の)尋(名)」のように、字は見慣れていても読み方・言い方が学習者に通じない訳語は、ここでしか捕まえられない。
//  runs    … それ以外の欄（例文の和訳・使い分け・語の成り立ち・注）は、漢字のかたまりごとに読む。
// 決め方: 1件ずつ人が読み、docs/audits/learner-japanese-review.json に次のどれかで記録する。
//   ok      … 中高生がそのまま読める
//   reading … 読みの台帳 src/data/meaning-readings.js で（よみ）を添えた（意味の欄だけに効く）
//   inline  … 本文の中に「琥珀（こはく）」のように読みを書いた
// 読めない・訳語として通じない語は、書き直して母集団から消す（台帳にも残さない）。
// 教材の日本語を足すと新しい run が現れ、人が読んで決めるまでこの確認は通らない。
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_WORDS, etymologyStoryForWord } from '../../src/data/vocab.js'
import { PHRASES } from '../../src/data/phrases.js'
import { WORD_FORM_NOTES, WORD_FORM_EXTRAS, WORD_FORM_SENSES } from '../../src/data/word-forms.js'
import { WORD_USAGE_NOTES } from '../../src/data/word-usage-notes.js'
import { LOANWORD_HINTS } from '../../src/data/loanword-hints.js'
import { meaningSegments } from '../../src/lib/meaningReadings.js'

export const LEARNER_JAPANESE_REVIEW_PATH = new URL('../../docs/audits/learner-japanese-review.json', import.meta.url)

const KANJI_RUN = /[\p{Script=Han}々〆ヶ]+/gu
// 「琥珀（こはく）」のように、本文の中に読みが書いてあるか。
const inlineReadingAfter = (text, end) => /^[(（][ぁ-ゖー・=＝]/u.test(text.slice(end, end + 3))

/** 学習者に見せる日本語の文（[本文, 欄, どこ]）。欄が meaning のものだけ、読みの台帳が画面に効く。 */
export function learnerJapaneseTexts() {
  const rows = []
  const push = (text, field, at) => { if (text != null && String(text).trim()) rows.push([String(text), field, at]) }
  for (const word of ALL_WORDS) {
    for (const t of word.meanings ?? []) push(t, 'meaning', word.id)
    for (const sense of word.otherSenses ?? []) {
      push(sense.meaning, 'meaning', word.id)
      push(sense.note, 'note', word.id)
      push(sense.example?.ja, 'example', word.id)
    }
    for (const key of ['synonyms', 'antonyms', 'derivatives']) {
      for (const item of word[key] ?? []) push(item.m, 'meaning', `${word.id}>${item.w}`)
    }
    push(word.example?.ja, 'example', word.id)
    push(word.usage, 'note', word.id)
    for (const guide of word.usageGuides ?? []) {
      push(typeof guide === 'string' ? guide : (guide?.text ?? guide?.note ?? guide?.usage), 'note', word.id)
    }
    push(etymologyStoryForWord(word)?.note, 'note', word.id)
  }
  for (const [id, note] of Object.entries(WORD_FORM_NOTES)) push(note, 'note', `form:${id}`)
  for (const extra of WORD_FORM_EXTRAS) {
    push(extra.m ?? extra.meaning, 'meaning', `extra:${extra.w ?? extra.id}`)
    push(extra.note, 'note', `extra:${extra.w ?? extra.id}`)
  }
  for (const [id, sense] of Object.entries(WORD_FORM_SENSES)) {
    push(typeof sense === 'string' ? sense : sense?.meaning, 'meaning', `formSense:${id}`)
  }
  for (const [id, note] of Object.entries(WORD_USAGE_NOTES)) {
    push(typeof note === 'string' ? note : note?.note ?? note?.text, 'note', `usage:${id}`)
  }
  for (const [id, hint] of Object.entries(LOANWORD_HINTS)) push(hint?.note, 'note', `loan:${id}`)
  for (const phrase of PHRASES) {
    for (const t of phrase.meanings ?? [phrase.meaning]) push(t, 'phraseMeaning', phrase.id)
    push(phrase.example?.ja, 'example', phrase.id)
    push(phrase.note, 'note', phrase.id)
    push(phrase.origin, 'note', phrase.id)
  }
  return rows
}

/** 意味の欄に出る訳語の全種類（重複を除く）。 */
export function learnerMeaningGlosses() {
  const glosses = new Set()
  for (const [text, field] of learnerJapaneseTexts()) {
    if (field === 'meaning' || field === 'phraseMeaning') glosses.add(text)
  }
  return glosses
}

/**
 * 母集団の漢字のかたまりを、いま画面でどう見えるかで分ける。
 * reading: 読みの台帳が当たる語／inline: 本文に読みが書いてある語／plain: 読みの手当てがない語。
 */
export function learnerJapaneseRuns() {
  const runs = new Map()
  const mark = (run, kind, field, at) => {
    const current = runs.get(run) ?? { kinds: new Set(), fields: new Set(), at: [], count: 0 }
    current.kinds.add(kind)
    current.fields.add(field)
    current.count += 1
    if (current.at.length < 3) current.at.push(at)
    runs.set(run, current)
  }
  for (const [text, field, at] of learnerJapaneseTexts()) {
    for (const segment of meaningSegments(text)) {
      if (segment.entry) { mark(segment.entry, field === 'meaning' ? 'reading' : 'plain', field, at); continue }
      for (const match of segment.text.matchAll(KANJI_RUN)) {
        const end = match.index + match[0].length
        mark(match[0], inlineReadingAfter(segment.text, end) ? 'inline' : 'plain', field, at)
      }
    }
  }
  return runs
}

// ここから下は、このファイルを直に実行したときだけ動く（テストからは関数だけ使う）。
const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
const ledger = JSON.parse(readFileSync(LEARNER_JAPANESE_REVIEW_PATH, 'utf8'))
const runs = learnerJapaneseRuns()
const decisions = new Map()
for (const [decision, list] of Object.entries(ledger.decisions)) {
  for (const run of list) {
    if (decisions.has(run)) console.log(`⚠ 「${run}」が台帳に2回ある`)
    decisions.set(run, decision)
  }
}

if (process.argv.includes('--write')) {
  // 人が読んで決めたあとに、台帳を書き直す。読んでいない run をそのまま ok にしないこと。
  // inline（本文に読みを書いた語）は人が選んだものを残す。reading は読みの台帳が意味の欄に当たる語。
  const next = { ok: [], reading: [], inline: [] }
  for (const [run, info] of runs) {
    if (info.kinds.has('reading')) next.reading.push(run)
    else if (decisions.get(run) === 'inline') next.inline.push(run)
    else next.ok.push(run)
  }
  for (const key of Object.keys(next)) next[key].sort((a, b) => a.localeCompare(b, 'ja'))
  ledger.decisions = next
  ledger.glosses = [...learnerMeaningGlosses()].sort((a, b) => a.localeCompare(b, 'ja'))
  ledger.counts = {
    文: learnerJapaneseTexts().length,
    訳語: ledger.glosses.length,
    run: runs.size,
    ...Object.fromEntries(Object.entries(next).map(([k, v]) => [k, v.length])),
  }
  writeFileSync(LEARNER_JAPANESE_REVIEW_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  console.log('台帳を書き直した', ledger.counts)
  process.exit(0)
}

const problems = []
const unreviewed = []
for (const [run, info] of runs) {
  const decision = decisions.get(run)
  if (!decision) { unreviewed.push(`${run}（${[...info.fields].join('/')}：${info.at.join(',')}）`); continue }
  if (info.kinds.has('reading') && decision !== 'reading') {
    problems.push(`「${run}」は読みの台帳が当たる語なので reading に置く（いまは ${decision}）`)
  }
  if (decision === 'reading' && !info.kinds.has('reading')) {
    problems.push(`「${run}」は reading だが、意味の欄で読みが当たっていない（${[...info.fields].join('/')}）`)
  }
  if (decision === 'inline' && !info.kinds.has('inline')) {
    problems.push(`「${run}」は inline だが、本文のどこにも読みを書いていない（${info.at.join(',')}）`)
  }
}
for (const run of decisions.keys()) {
  if (!runs.has(run)) problems.push(`「${run}」は台帳にあるが、もう教材のどこにも出てこない`)
}
// 意味の欄は訳語1つずつ読む。新しい訳語・書き換えた訳語は、読むまでここで止まる。
const reviewedGlosses = new Set(ledger.glosses ?? [])
const glosses = learnerMeaningGlosses()
const unreviewedGlosses = [...glosses].filter((text) => !reviewedGlosses.has(text))
for (const text of reviewedGlosses) {
  if (!glosses.has(text)) problems.push(`訳語「${text}」は台帳にあるが、もう意味の欄に出てこない`)
}

const total = runs.size
if (unreviewed.length || unreviewedGlosses.length || problems.length) {
  console.log(`❌ 学習者向け日本語の見直し: ${unreviewed.length + unreviewedGlosses.length + problems.length}件`)
  for (const row of unreviewedGlosses.slice(0, 40)) console.log(`  - まだ読んでいない訳語: ${row}`)
  if (unreviewedGlosses.length > 40) console.log(`  - ほか ${unreviewedGlosses.length - 40}件の訳語`)
  for (const row of unreviewed.slice(0, 40)) console.log(`  - まだ読んでいない漢字語: ${row}`)
  if (unreviewed.length > 40) console.log(`  - ほか ${unreviewed.length - 40}件`)
  for (const row of problems.slice(0, 40)) console.log(`  - ${row}`)
  if (problems.length > 40) console.log(`  - ほか ${problems.length - 40}件`)
  console.log('  直し方: 1件ずつ読み、中高生がそのまま読めて意味が分かるなら docs/audits/learner-japanese-review.json に足す。')
  console.log('          読めないなら訳語・本文を書き直すか、意味の欄なら src/data/meaning-readings.js に読みを載せる。')
  process.exit(1)
}
console.log(`✅ 学習者向け日本語: ${learnerJapaneseTexts().length}文・訳語${glosses.size}件・漢字語${total}件すべて見直し済み（読みを添えた語 ${ledger.decisions.reading.length}件・本文に読みを書いた語 ${ledger.decisions.inline.length}件）`)
}
