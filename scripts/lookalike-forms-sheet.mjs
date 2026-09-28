#!/usr/bin/env node
// 形の似た組（scripts/checks/lookalike-forms.mjs の母集団）のうち、まだ決めていない組を、読むための表にする。
// つながった組ごと（まとまり）に、語・品詞・意味・語の成り立ち・拾った決まり・ほかの台帳の判定を並べる。
//   node scripts/lookalike-forms-sheet.mjs [まとまりの数（既定 40）] [--from つづり] [--word 語の id]
// 決めた中身は docs/audits/lookalike-forms/dec-NNNN.tsv に書き、scripts/lookalike-forms-apply.mjs で台帳へ移す。
import { ALL_WORDS, etymologyStoryForWord, getWord } from '../src/data/vocab.js'
import { lookalikeForms } from '../src/lib/lookalikeForms.js'
import { lookalikeFormGaps, lookalikeFormPairs } from './checks/lookalike-forms.mjs'
import { lookalikeVerdicts } from './checks/lookalike-origins.mjs'

const args = process.argv.slice(2)
const limit = Number(args.find((arg) => /^\d+$/.test(arg)) ?? 40)
const fromIndex = args.indexOf('--from')
const from = fromIndex >= 0 ? args[fromIndex + 1] : ''
const wordIndex = args.indexOf('--word')
const only = wordIndex >= 0 ? args[wordIndex + 1] : ''

const pairs = lookalikeFormPairs(ALL_WORDS)
const gaps = lookalikeFormGaps({ pairs })
const undecided = gaps.undecided

// まだ決めていない組を、つながったまとまりに分ける。
const parent = new Map()
const find = (x) => {
  while (parent.get(x) !== x) {
    parent.set(x, parent.get(parent.get(x)))
    x = parent.get(x)
  }
  return x
}
for (const key of undecided) {
  const [a, b] = key.split('|')
  for (const x of [a, b]) if (!parent.has(x)) parent.set(x, x)
  parent.set(find(a), find(b))
}
const components = new Map()
for (const x of parent.keys()) {
  const root = find(x)
  if (!components.has(root)) components.set(root, [])
  components.get(root).push(x)
}
const spelling = (id) => String(getWord(id)?.word ?? id).toLowerCase()
const list = [...components.values()]
  .map((ids) => ids.sort((a, b) => spelling(a).localeCompare(spelling(b))))
  .sort((a, b) => spelling(a[0]).localeCompare(spelling(b[0])))
  .filter((ids) => !from || spelling(ids[0]) >= from)
  .filter((ids) => !only || ids.includes(only))

console.log(`# 決めていない組 ${undecided.length}（まとまり ${list.length}）。この表は ${Math.min(limit, list.length)} まとまり。`)
console.log('# 行の書き方: C 形 由来 / 由来…（~は似た部分だけ同じ由来）［⇥見分け方］／K 語 語 kind 説明／N 語 説明／S 語 語 略号／Z 略号 語 語…／A 語 略号')
for (const ids of list.slice(0, limit)) {
  const inside = new Set(ids)
  const keys = undecided.filter((key) => key.split('|').every((id) => inside.has(id)))
  console.log(`\n## ${spelling(ids[0])}（${ids.length}語・${keys.length}組）`)
  for (const id of ids) {
    const word = getWord(id)
    const forms = lookalikeForms.filter((entry) => entry.ids.includes(id)).map((entry) => entry.form)
    const formMark = forms.length ? ` ［形 ${forms.join('・')}］` : ''
    console.log(`- ${id}\t${word?.pos ?? ''}\t${word?.meaning ?? ''}${formMark}`)
    console.log(`    ${etymologyStoryForWord(id)?.note ?? '（語の成り立ちなし）'}`)
  }
  console.log(`  組: ${keys.map((key) => `${key}(${pairs.get(key).join('・')})`).join(' ')}`)
  const known = keys
    .map((key) => [key, lookalikeVerdicts(...key.split('|'), { forms: false })])
    .filter(([, verdicts]) => verdicts.length)
  if (known.length) {
    console.log(`  ほかの台帳: ${known.map(([key, verdicts]) => `${key}=${verdicts.map(([where, kind]) => `${kind}(${where})`).join('/')}`).join(' ')}`)
  }
}
