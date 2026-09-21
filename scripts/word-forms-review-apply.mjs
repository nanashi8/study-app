#!/usr/bin/env node
// ほかの品詞の形の全語見直しの結果を台帳へ書き込む。
//   node scripts/word-forms-review-apply.mjs <見直した語の id 一覧ファイル> [<足す形のファイル>]
// 足す形のファイルは1行1件、タブ区切り: 見出し語id  つづり  品詞(名/動/形/副)  意味  [意味のずれ方の説明]  [発音記号]
//   発音記号は、発音辞書 CMU にない語だけ手で書く（/ˈlaʊdnəs/ のように見出し語と同じ書き方で）。
//   - つづりが見出し語なら、その語をもとの語と同じまとまりに入れる（品詞と意味は見出し語のものを使う）。
//   - 見出し語でなければ、辞書にない形として WORD_FORM_EXTRAS に足す（発音記号は発音辞書 CMU から作る）。
//   - 1列目が C の行は、つづりが似た別の語: C  見出し語id  つづり  意味
//   - 1列目が U の行は、関連語どうしの使い分け: U  つづり1  つづり2  使い分けの説明（src/data/word-usage-notes.js）
//   - もとの語と同じ品詞の形は、ほかの品詞の形としては出ないのでつながない（使い分けを U 行で書いた組だけは載せる）。
//   - 1列目が S の行は、拾われた候補を載せない理由: S  見出し語id  つづり  理由（WORD_FORM_EXTRA_SKIPPED）
//   - 1列目が X の行は、まとまりから語を外す: X  見出し語id  理由（同じつづりの別の語の側だった組は WORD_FORM_HOMOGRAPH_SIDE へ）
//   - 同じつづりの見出し語が2つ以上あるとき、つづりの代わりに見出し語 id（flight_2 のように _ つき）を書けば、その語を指す。
// 見直した語の id は docs/audits/word-forms-review.json に足す（scripts/checks/word-forms-review.mjs が全件を確かめる）。
import { readFileSync, writeFileSync } from 'node:fs'
import { dictionary } from 'cmu-pronouncing-dictionary'
import { arpaToIPA } from './arpa-ipa.mjs'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import * as F from '../src/data/word-forms.js'
import { SPELLING_CONFUSABLE_EXTRAS, SPELLING_CONFUSABLE_PAIRS } from '../src/data/spelling-confusables.js'
import { WORD_USAGE_NOTES } from '../src/data/word-usage-notes.js'

const ROOT = new URL('../', import.meta.url)
const POS = ['名', '動', '形', '副']
const [reviewedFile, additionsFile] = process.argv.slice(2)
if (!reviewedFile) {
  console.error('使い方: node scripts/word-forms-review-apply.mjs <見直した語の id 一覧> [<足す形>]')
  process.exit(1)
}

const q = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const bySpelling = new Map()
for (const word of ALL_WORDS) {
  const key = word.word.toLowerCase()
  if (!bySpelling.has(key)) bySpelling.set(key, [])
  bySpelling.get(key).push(word)
}
const headwordsFor = (spelling) => (spelling.includes('_') && getWord(spelling) ? [getWord(spelling)] : bySpelling.get(spelling.toLowerCase()) ?? [])

const edges = []
const notes = { ...F.WORD_FORM_NOTES }
const extras = F.WORD_FORM_EXTRAS.map((entry) => [...entry])
const usageNotes = { ...WORD_USAGE_NOTES }
const usageKey = (a, b) => [a.toLowerCase(), b.toLowerCase()].sort().join('|')
const groupPos = new Map()
for (const group of F.WORD_FORM_GROUPS) {
  const posSet = new Set(group.map((id) => getWord(id)?.pos))
  for (const id of group) groupPos.set(id, new Set([...(groupPos.get(id) ?? []), ...posSet]))
}
const confusablePairs = []
const confusableExtras = []
const errors = []

const lines = additionsFile ? readFileSync(additionsFile, 'utf8').split('\n').filter((line) => line.trim()) : []
// 使い分けの行を先に読み、同じ品詞の形を載せてよいかの判断に使う。
for (const line of lines) {
  const [kind, a, b, note] = line.split('\t')
  if (kind === 'U' && a && b && note) usageNotes[usageKey(a, b)] = note
}
const skipped = { ...F.WORD_FORM_EXTRA_SKIPPED }
for (const line of lines) {
  const [kind, of, spelling, reason] = line.split('\t')
  if (kind !== 'S') continue
  if (!getWord(of) || !spelling || !reason) { errors.push(`S 行が足りない: ${line}`); continue }
  skipped[`${of}|${spelling.toLowerCase()}`] = reason
}
const removals = []
for (const line of lines) {
  const [kind, id] = line.split('\t')
  if (kind !== 'X') continue
  if (!getWord(id)) { errors.push(`外す語が辞書にない: ${id}`); continue }
  removals.push(id)
}
for (const line of lines) {
  if (line.startsWith('X\t') || line.startsWith('S\t')) continue
  const cols = line.split('\t')
  if (cols[0] === 'U') {
    const [, a, b, note] = cols
    if (!a || !b || !note) { errors.push(`使い分けの行が足りない: ${line}`); continue }
    usageNotes[usageKey(a, b)] = note
    continue
  }
  if (cols[0] === 'C') {
    const [, of, spelling, meaning] = cols
    if (!getWord(of)) { errors.push(`見出し語がない: ${of}`); continue }
    const target = headwordsFor(spelling)[0]
    if (target) confusablePairs.push([of, target.id])
    else {
      const arpa = dictionary[spelling.toLowerCase()]
      if (!arpa) { errors.push(`発音辞書にない: ${spelling}`); continue }
      confusableExtras.push([of, spelling, meaning, arpaToIPA(arpa)])
    }
    continue
  }
  const [of, spelling, pos, meaning, note, manualPhonetic] = cols
  const base = getWord(of)
  if (!base) { errors.push(`見出し語がない: ${of}`); continue }
  const candidates = headwordsFor(spelling)
  const target = candidates.find((word) => word.pos === pos) ?? candidates.find((word) => word.pos !== base.pos && POS.includes(word.pos))
  // 同じ品詞の形は、まとまりにほかの品詞の語がないと画面に出ないのでつながない。
  // つなぐとできるまとまり（もとの語のまとまり＋相手のまとまり）に、ほかの品詞の語があるか。
  const otherPosInGroup = [...(groupPos.get(base.id) ?? []), ...(target ? groupPos.get(target.id) ?? [] : [])]
    .some((p) => p && p !== base.pos)
  const hasUsage = Boolean(usageNotes[usageKey(base.word, spelling)])
  if (pos === base.pos && !(target && otherPosInGroup)) {
    // 同じ品詞の見出し語は、使い分けを書けば「使い分けに注意する語」の欄に出るので、まとまりにはつながない。
    if (hasUsage && target) continue
    if (!hasUsage) {
      errors.push(`もとの語と同じ品詞なので、ほかの品詞の形としては出ない（使い分けがあれば U 行で書く）: ${of} → ${spelling}`)
      continue
    }
  }
  if (target) {
    if (target.id === base.id) { errors.push(`同じ語: ${of}`); continue }
    edges.push([base.id, target.id])
    if (note) notes[target.id] = note
    continue
  }
  if (!POS.includes(pos)) { errors.push(`品詞がない: ${line}`); continue }
  if (!meaning) { errors.push(`意味がない: ${line}`); continue }
  const arpa = dictionary[spelling.toLowerCase()]
  const phonetic = arpa ? arpaToIPA(arpa) : manualPhonetic
  if (!phonetic || !/^\/.+\/$/.test(phonetic)) { errors.push(`発音辞書にないので発音記号を6列目に書く: ${spelling}`); continue }
  if (extras.some(([o, w]) => o === of && w.toLowerCase() === spelling.toLowerCase())) continue
  extras.push([of, spelling, pos, meaning, phonetic, ...(note ? [note] : [])])
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

// まとまりを作り直す。succeed のように意味の筋ごとに分けたまとまりは、そのまま残す。
const splitGroups = F.WORD_FORM_GROUPS.filter((group) => group.includes('succeed'))
const splitIds = new Set(splitGroups.flat())
const parent = new Map()
const find = (x) => { while (parent.get(x) !== x) x = parent.get(x); return x }
const unite = (a, b) => {
  for (const x of [a, b]) if (!parent.has(x)) parent.set(x, x)
  parent.set(find(a), find(b))
}
// X 行で外す語は、元のまとまりから抜いてから組み直す。外した語と残りの語の組のうち規則の候補は、別の語の側として残す。
const removed = new Set(removals)
const homographSide = new Set(F.WORD_FORM_HOMOGRAPH_SIDE)
for (const group of F.WORD_FORM_GROUPS.filter((group) => !group.includes('succeed'))) {
  const kept = group.filter((id) => !removed.has(id))
  for (const id of group.filter((id) => removed.has(id))) {
    for (const other of kept) homographSide.add([id, other].sort().join('|'))
    delete notes[id]
  }
  for (const id of kept) unite(kept[0], id)
}
const splitEdges = []
for (const [a, b] of edges) {
  if (splitIds.has(a) || splitIds.has(b)) splitEdges.push([a, b])
  else unite(a, b)
}
const components = new Map()
for (const id of parent.keys()) {
  const root = find(id)
  if (!components.has(root)) components.set(root, [])
  components.get(root).push(id)
}
const groups = [...components.values()].map((group) => group.sort())
// succeed のまとまりにつなぐ組は、つなぐ先の筋のまとまりに足す。
for (const [a, b] of splitEdges) {
  const inSplit = splitIds.has(a) ? a : b
  const other = inSplit === a ? b : a
  const target = splitGroups.find((group) => group.includes(inSplit) && group.length && group.indexOf(inSplit) >= 0)
  if (!target.includes(other)) target.push(other)
}
// 語を外して1語だけ・1つの品詞だけになったまとまりは、ほかの品詞の形を示さないので消す。
const allGroups = [...groups, ...splitGroups.map((group) => [...new Set(group)])]
  .filter((group) => group.length >= 2 && new Set(group.map((id) => getWord(id)?.pos)).size >= 2)
  .sort((a, b) => a[0].localeCompare(b[0]))

extras.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]))

let source = readFileSync(new URL('src/data/word-forms.js', ROOT), 'utf8')
const replaceBlock = (start, end, body) => {
  const i = source.indexOf(start)
  const j = source.indexOf(end, i + start.length)
  source = source.slice(0, i) + start + body + source.slice(j)
}
replaceBlock('export const WORD_FORM_GROUPS = [\n', ']\n', allGroups.map((group) => `  [${group.map(q).join(', ')}],\n`).join(''))
replaceBlock('export const WORD_FORM_NOTES = {\n', '}\n', Object.keys(notes).sort().map((key) =>
  `  ${/^[a-z_]+$/.test(key) ? key : q(key)}: ${q(notes[key])},\n`).join(''))
// 候補に出ない組は別の語の側の一覧に残さない（テストが候補との一致を確かめる）。
const { wordFormCandidatePairs } = await import('./word-form-candidates.mjs')
const candidatePairs = new Set(wordFormCandidatePairs(ALL_WORDS).map(([a, b]) => `${a}|${b}`))
const sideList = [...homographSide].filter((pair) => candidatePairs.has(pair)).sort()
replaceBlock('export const WORD_FORM_HOMOGRAPH_SIDE = [\n', ']\n', Array.from({ length: Math.ceil(sideList.length / 6) }, (_, i) =>
  `  ${sideList.slice(i * 6, i * 6 + 6).map(q).join(', ')},\n`).join(''))
replaceBlock('export const WORD_FORM_EXTRA_SKIPPED = {\n', '}\n', Object.keys(skipped).sort().map((key) =>
  `  ${q(key)}: ${q(skipped[key])},\n`).join(''))
replaceBlock('export const WORD_FORM_EXTRAS = [\n', ']\n', extras.map((entry) =>
  `  [${entry.slice(0, 5).map(q).join(', ')}${entry[5] ? `, ${q(entry[5])}` : ''}],\n`).join(''))
writeFileSync(new URL('src/data/word-forms.js', ROOT), source)

if (confusablePairs.length || confusableExtras.length) {
  let confusables = readFileSync(new URL('src/data/spelling-confusables.js', ROOT), 'utf8')
  const have = new Set(SPELLING_CONFUSABLE_PAIRS.map(([a, b]) => [a, b].sort().join('|')))
  const newPairs = confusablePairs.filter(([a, b]) => !have.has([a, b].sort().join('|')))
  const marker = '  // ほかの品詞の形の候補に出た、つづりが似ているだけの別の語（word-forms.js の見直しで移した）。\n'
  confusables = confusables.replace(marker, marker + newPairs.map(([a, b]) => `  ['${a}', '${b}'],\n`).join(''))
  const haveExtras = new Set(SPELLING_CONFUSABLE_EXTRAS.map(([of, word]) => `${of}|${word}`))
  const extraMarker = 'export const SPELLING_CONFUSABLE_EXTRAS = Object.freeze([\n'
  confusables = confusables.replace(extraMarker, extraMarker + confusableExtras
    .filter(([of, word]) => !haveExtras.has(`${of}|${word}`))
    .map((entry) => `  [${entry.map(q).join(', ')}],\n`).join(''))
  writeFileSync(new URL('src/data/spelling-confusables.js', ROOT), confusables)
}

const usageSource = readFileSync(new URL('src/data/word-usage-notes.js', ROOT), 'utf8')
const usageStart = 'export const WORD_USAGE_NOTES = {\n'
const usageBody = Object.keys(usageNotes).sort().map((key) => `  ${q(key)}: ${q(usageNotes[key])},\n`).join('')
writeFileSync(new URL('src/data/word-usage-notes.js', ROOT),
  usageSource.slice(0, usageSource.indexOf(usageStart) + usageStart.length) + usageBody + usageSource.slice(usageSource.indexOf('}\n', usageSource.indexOf(usageStart))))

const reviewPath = new URL('docs/audits/word-forms-review.json', ROOT)
const review = JSON.parse(readFileSync(reviewPath, 'utf8'))
const reviewed = new Set(review.reviewed)
const usageReviewed = new Set(review.usageReviewed ?? [])
// 見直しの表（関連語欄つき）で読んだ語は、ほかの品詞の形と使い分けの両方を読んだことになる。
for (const id of readFileSync(reviewedFile, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean)) {
  if (!getWord(id)) { console.error(`見直した語の id が辞書にない: ${id}`); process.exit(1) }
  reviewed.add(id)
  usageReviewed.add(id)
}
review.reviewed = [...reviewed].sort()
review.usageReviewed = [...usageReviewed].sort()
writeFileSync(reviewPath, `${JSON.stringify(review, null, 1)}\n`)
console.log(`まとまり ${allGroups.length}・説明 ${Object.keys(notes).length}・辞書にない形 ${extras.length}・使い分け ${Object.keys(usageNotes).length}・見直した語 ${review.reviewed.length}（使い分けも読んだ語 ${review.usageReviewed.length}）`)
