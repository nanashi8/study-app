#!/usr/bin/env node
// 社会・理科の文に出る漢字のかたまりを全件見て、漢字で書いてカタカナで読む外国の人名・地名（北京＝ペキン、
// 安重根＝アンジュングン など）を決めた記録（docs/audits/junior-social-science-katakana-names.json）の道具。
// 依頼台帳 requests/2026-09-30-subject-katakana-quality.json の katakana-names。テストは tests/junior-social-science-katakana-names.test.mjs。
//
//   母集団：src/data/subjects の全モジュールの文字列（読みの辞書 readings.js は除く）と、図の部品
//   （src/components/Subject*.jsx）の文字に出る漢字のかたまり。runs に見た全件を並べ、katakana に
//   カタカナの読みを付ける語と読みを書く（読みは src/data/subjects/readings.js にも同じものを載せる）。
//   孫文・周恩来・重慶・奉天のように、教科書が日本語の読みで示す語はカタカナにしない。
//
//   node scripts/checks/junior-social-science-katakana-names.mjs          … 記録と今の中身の食いちがいを並べる
//   node scripts/checks/junior-social-science-katakana-names.mjs --new    … まだ見ていないかたまりを並べる
//   node scripts/checks/junior-social-science-katakana-names.mjs --write  … 1件ずつ見たあとに runs を書き直す
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SUBJECT_READINGS } from '../../src/data/subjects/readings.js'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const KATAKANA_NAMES_LEDGER_PATH = path.join(ROOT, 'docs/audits/junior-social-science-katakana-names.json')
const KANJI_RUN = /[\p{Script=Han}々〆ヶ]+/gu
const HAN = /[\p{Script=Han}]/u
export const KATAKANA_READING = /^[ァ-ヺー]+$/u

/** 社会・理科の文（[文, 置き場所]）。データの文字列と、図の部品の文字。 */
export async function subjectTexts() {
  const texts = []
  const dataDir = path.join(ROOT, 'src/data/subjects')
  for (const file of readdirSync(dataDir).filter((name) => name.endsWith('.js') && name !== 'readings.js').sort()) {
    const mod = await import(pathToFileURL(path.join(dataDir, file)).href)
    const seen = new Set()
    const visit = (value, depth) => {
      if (value == null || depth > 16) return
      if (typeof value === 'string') {
        if (HAN.test(value)) texts.push([value, `src/data/subjects/${file}`])
        return
      }
      if (typeof value !== 'object' || seen.has(value)) return
      seen.add(value)
      for (const item of Array.isArray(value) ? value : Object.values(value)) visit(item, depth + 1)
    }
    for (const value of Object.values(mod)) visit(value, 0)
  }
  const componentDir = path.join(ROOT, 'src/components')
  for (const file of readdirSync(componentDir).filter((name) => /^Subject.*\.jsx$/.test(name)).sort()) {
    // 注釈の行は画面に出ないので除く。
    const source = readFileSync(path.join(componentDir, file), 'utf8')
      .split('\n').filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line)).join('\n')
    for (const match of source.matchAll(/(['"`])((?:[^\\\n]|\\.)*?)\1/g)) if (HAN.test(match[2])) texts.push([match[2], `src/components/${file}`])
    for (const match of source.matchAll(/>([^<>{}]*[\p{Script=Han}][^<>{}]*)</gu)) texts.push([match[1], `src/components/${file}`])
  }
  return texts
}

/** 漢字のかたまり全件（五十音順）。 */
export async function subjectKanjiRuns() {
  const runs = new Set()
  for (const [text] of await subjectTexts()) for (const match of text.matchAll(KANJI_RUN)) runs.add(match[0])
  return [...runs].sort((a, b) => a.localeCompare(b, 'ja'))
}

export const readKatakanaNamesLedger = () => (existsSync(KATAKANA_NAMES_LEDGER_PATH)
  ? JSON.parse(readFileSync(KATAKANA_NAMES_LEDGER_PATH, 'utf8'))
  : { katakana: {}, runs: [] })

/** 記録と今の中身の食いちがい。 */
export async function katakanaNamesProblems(ledger = readKatakanaNamesLedger()) {
  const problems = []
  const runs = await subjectKanjiRuns()
  const reviewed = new Set(ledger.runs ?? [])
  const current = new Set(runs)
  for (const run of runs) if (!reviewed.has(run)) problems.push(`まだ見ていない漢字のかたまり: ${run}`)
  for (const run of reviewed) if (!current.has(run)) problems.push(`記録にあるが、もう教材に出ない: ${run}`)
  const readings = new Map(SUBJECT_READINGS)
  for (const [word, reading] of Object.entries(ledger.katakana ?? {})) {
    if (!KATAKANA_READING.test(reading)) problems.push(`${word}: カタカナの読みではない（${reading}）`)
    if (readings.get(word) !== reading) problems.push(`${word}: 読みの辞書に同じ読み（${reading}）がない`)
    if (!runs.some((run) => run.includes(word))) problems.push(`${word}: もう教材に出ない`)
  }
  for (const [word, reading] of SUBJECT_READINGS) {
    if (KATAKANA_READING.test(reading) && ledger.katakana?.[word] !== reading) problems.push(`${word}: カタカナの読みが記録にない`)
  }
  return problems
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const ledger = readKatakanaNamesLedger()
  if (process.argv.includes('--new')) {
    const reviewed = new Set(ledger.runs ?? [])
    const fresh = (await subjectKanjiRuns()).filter((run) => !reviewed.has(run))
    console.log(fresh.join(' '))
    console.log(`まだ見ていない: ${fresh.length}件`)
  } else if (process.argv.includes('--write')) {
    // 人が1件ずつ見て、カタカナの読みを付ける語を katakana に書いたあとに流す。見ていないかたまりを載せないこと。
    const runs = await subjectKanjiRuns()
    const next = {
      readMe: '社会・理科の文（src/data/subjects の文字列と図の部品の文字）に出る漢字のかたまりを全件見て、漢字で書いてカタカナで読む外国の人名・地名を決めた記録。runs は見た全件、katakana はカタカナの読みを付ける語と読み（src/data/subjects/readings.js と同じ）。教科書が日本語の読みで示す語（孫文・周恩来・重慶・奉天・旅順など）はカタカナにしない。確認は node scripts/checks/junior-social-science-katakana-names.mjs、新しいかたまりは --new で見てから --write。',
      katakana: ledger.katakana ?? {},
      counts: { runs: runs.length, katakana: Object.keys(ledger.katakana ?? {}).length },
      runs,
    }
    writeFileSync(KATAKANA_NAMES_LEDGER_PATH, `${JSON.stringify(next, null, 2)}\n`)
    console.log('書き直した', next.counts)
  } else {
    const problems = await katakanaNamesProblems(ledger)
    for (const problem of problems.slice(0, 40)) console.log(`  - ${problem}`)
    if (problems.length > 40) console.log(`  - ほか ${problems.length - 40}件`)
    console.log(problems.length ? `❌ ${problems.length}件` : `✅ 漢字のかたまり ${ledger.runs.length}件を見た記録と一致（カタカナの読み ${Object.keys(ledger.katakana).length}語）`)
    process.exit(problems.length ? 1 : 0)
  }
}
