#!/usr/bin/env node
// 全収録語の語源学習監査。
// 「語源が存在するか」だけでなく、語彙を横に増やす手掛かりがどの経路であるかを全件分類する。
import {
  ALL_WORDS,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SUMMARY,
  ROOTS,
} from '../src/data/vocab.js'

const ROOT_IDS = new Set(ROOTS.map((r) => r.id))
const PACK_IDS = new Set(ETYMOLOGY_PACKS.map((pack) => pack.id))
const KINDS = new Set(['prefix', 'root', 'suffix', 'stem'])
const hardProblems = []
const shortStoryOnly = []
const placeholderWords = []
const noteCounts = new Map()

const counts = {
  total: ALL_WORDS.length,
  explained: 0,
  structured: 0,
  directFormula: 0,
  sameRoot: 0,
  wordFamily: 0,
  storyOnly: 0,
}

for (const word of ALL_WORDS) {
  const etymology = word.etymology
  const note = etymology?.note?.trim() ?? ''
  const parts = etymology?.parts ?? []
  const hasFormula = parts.some((p) => p.kind === 'root' && p.root)
  const hasRoot = word.roots?.length > 0
  const hasFamily = word.family?.length > 0 || word.derivatives?.length > 0

  if (note) counts.explained++
  if (parts.length) counts.structured++

  // 1語を必ず1つの「最も強い語彙拡張経路」に分類する。
  if (hasFormula) counts.directFormula++
  else if (hasRoot) counts.sameRoot++
  else if (hasFamily) counts.wordFamily++
  else {
    counts.storyOnly++
    if (note.length < 20) shortStoryOnly.push({ word: word.word, note })
  }

  if (!etymology) hardProblems.push(`${word.word}: etymology が無い`)
  if (!note) hardProblems.push(`${word.word}: 意味変化説明(note)が無い`)
  if (!word.compression) hardProblems.push(`${word.word}: 濃縮ルートが無い`)
  else if (!PACK_IDS.has(word.compression.packId)) {
    hardProblems.push(`${word.word}: 濃縮パック参照先が不明 (${word.compression.packId})`)
  }
  for (const [i, part] of parts.entries()) {
    if (!part?.t?.trim()) hardProblems.push(`${word.word}: parts[${i}] の綴り(t)が空`)
    if (!KINDS.has(part?.kind)) hardProblems.push(`${word.word}: parts[${i}] のkindが不正`)
    if (part?.root && !ROOT_IDS.has(part.root)) {
      hardProblems.push(`${word.word}: parts[${i}] のroot=${part.root}が未定義`)
    }
  }
  if (/TODO|TBD|要確認|unknown/i.test(note)) placeholderWords.push(word.word)
  if (note) noteCounts.set(note, (noteCounts.get(note) ?? 0) + 1)
}

const rootUse = ROOTS.map((root) => ({
  root,
  words: ALL_WORDS.filter((word) => word.roots.includes(root.id)),
}))
const unusedRoots = rootUse.filter(({ words }) => words.length === 0).map(({ root }) => root.id)
const duplicateNotes = [...noteCounts.entries()]
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1])

const pct = (value) => `${(value / counts.total * 100).toFixed(1)}%`

console.log(`\n語源学習・全件監査: ${counts.total}語`)
console.log('─'.repeat(56))
console.log(`説明あり                    ${String(counts.explained).padStart(5)}語  ${pct(counts.explained)}`)
console.log(`構造化パーツあり            ${String(counts.structured).padStart(5)}語  ${pct(counts.structured)}`)
console.log('\n語彙を増やす主経路（重複なし）')
console.log(`  意味の式で組み立てる      ${String(counts.directFormula).padStart(5)}語  ${pct(counts.directFormula)}`)
console.log(`  同じ語根へ広げる          ${String(counts.sameRoot).padStart(5)}語  ${pct(counts.sameRoot)}`)
console.log(`  語族・派生語へ広げる      ${String(counts.wordFamily).padStart(5)}語  ${pct(counts.wordFamily)}`)
console.log(`  由来ストーリー単独        ${String(counts.storyOnly).padStart(5)}語  ${pct(counts.storyOnly)}`)
console.log('\n全語の濃縮ルート（重複なし）')
console.log(`  部品の式                  ${String(ETYMOLOGY_SUMMARY.counts.formula).padStart(5)}語  ${pct(ETYMOLOGY_SUMMARY.counts.formula)}`)
console.log(`  共有語根                  ${String(ETYMOLOGY_SUMMARY.counts.root).padStart(5)}語  ${pct(ETYMOLOGY_SUMMARY.counts.root)}`)
console.log(`  語族                      ${String(ETYMOLOGY_SUMMARY.counts.family).padStart(5)}語  ${pct(ETYMOLOGY_SUMMARY.counts.family)}`)
console.log(`  由来の型                  ${String(ETYMOLOGY_SUMMARY.counts.origin).padStart(5)}語  ${pct(ETYMOLOGY_SUMMARY.counts.origin)}`)
console.log(`  経路あり                  ${String(ETYMOLOGY_SUMMARY.covered).padStart(5)}語  ${pct(ETYMOLOGY_SUMMARY.covered)}`)
console.log(`  学習パック                ${String(ETYMOLOGY_SUMMARY.packs).padStart(5)}束`)
console.log('\n改善候補')
console.log(`  短いストーリー単独(<20字) ${shortStoryOnly.length}語`)
console.log(`  仮置き文言                 ${placeholderWords.length}語`)
console.log(`  重複する説明文             ${duplicateNotes.length}種類`)
console.log(`  収録語に未接続の語根       ${unusedRoots.length}個${unusedRoots.length ? ` (${unusedRoots.join(', ')})` : ''}`)

if (shortStoryOnly.length) {
  console.log('\n短いストーリー単独の先頭20件')
  for (const item of shortStoryOnly.slice(0, 20)) console.log(`  - ${item.word}: ${item.note}`)
}

if (hardProblems.length) {
  console.error(`\n❌ 構造上の問題 ${hardProblems.length}件`)
  for (const problem of hardProblems.slice(0, 40)) console.error(`  - ${problem}`)
  if (hardProblems.length > 40) console.error(`  … 他 ${hardProblems.length - 40}件`)
  process.exit(1)
}

console.log('\n✅ 全語を走査し、語源データの構造上の問題はありません。\n')
