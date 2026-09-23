#!/usr/bin/env node
// つづりが似た組・同じ発音の組の見直し表（scripts/checks/confusables-survey.mjs の母集団）。
//   node scripts/confusables-survey-sheet.mjs [--from 0] [--count 200] [--signals]
// --signals をつけると、取り違えやすさの手がかりがある組だけを出す。
// 出力は1行1組: 組  手がかり  語A【品詞級:意味】  語B【品詞級:意味】
import { readFileSync } from 'node:fs'
import { dictionary } from 'cmu-pronouncing-dictionary'
import { ALL_WORDS } from '../src/data/vocab.js'
import { splitMeanings } from '../src/data/compact.js'
import { SPELLING_CONFUSABLE_PAIRS } from '../src/data/spelling-confusables.js'
import { confusableSurveyPairs, CONFUSABLES_SURVEY_PATH } from './checks/confusables-survey.mjs'

const wordsBySpelling = new Map()
for (const word of ALL_WORDS) {
  const key = word.word.toLowerCase()
  if (!wordsBySpelling.has(key)) wordsBySpelling.set(key, [])
  wordsBySpelling.get(key).push(word)
}
const listed = new Set(SPELLING_CONFUSABLE_PAIRS.map(([a, b]) => [a, b].sort().join('|')))
const reviewed = JSON.parse(readFileSync(CONFUSABLES_SURVEY_PATH, 'utf8')).reviewed ?? {}

// 日本語話者が聞き分けにくい音の組（発音辞書の記号）。
const NEAR_SOUNDS = [['AE', 'AH', 'AA', 'AO'], ['IH', 'IY'], ['UH', 'UW'], ['EH', 'AE'], ['OW', 'AO'], ['L', 'R'], ['B', 'V'], ['S', 'TH'], ['Z', 'DH'], ['F', 'HH'], ['ER', 'AA'], ['ER', 'AO']]
const soundsOf = (spelling) => [0, 1, 2, 3]
  .map((variant) => dictionary[variant ? `${spelling}(${variant})` : spelling])
  .filter(Boolean)
  .map((arpa) => arpa.replace(/[0-9]/g, '').split(' '))
const nearSound = (x, y) => NEAR_SOUNDS.some((group) => group.includes(x) && group.includes(y))
function soundSignal(a, b) {
  let best = ''
  for (const left of soundsOf(a)) {
    for (const right of soundsOf(b)) {
      if (left.join(' ') === right.join(' ')) return '同音'
      if (left.length !== right.length) continue
      const diffs = left.map((sound, i) => [sound, right[i]]).filter(([x, y]) => x !== y)
      if (diffs.length === 1 && nearSound(...diffs[0])) best = '近い音'
    }
  }
  return best
}
// つづりの細かいちがい（文字の入れ替え・重ね字・黙字・語末の e）
function letterSignal(a, b, whys) {
  if (whys.includes('入れ替え')) return '入れ替え'
  const [short, long] = a.length < b.length ? [a, b] : [b, a]
  if (long.length !== short.length + 1) return ''
  let at = 0
  while (at < short.length && short[at] === long[at]) at += 1
  if (long.slice(0, at) + long.slice(at + 1) !== short) return ''
  const inserted = long[at]
  if (inserted === long[at - 1] || inserted === long[at + 1]) return '重ね字'
  if (/[hwkg]/.test(inserted) || (inserted === 'e' && at === long.length - 1)) return '黙字'
  return ''
}
const meaningKanji = (spelling) => new Set((wordsBySpelling.get(spelling) ?? [])
  .flatMap((word) => splitMeanings(word.meaning))
  .flatMap((gloss) => gloss.replace(/[（(][^）)]*[）)]/gu, '').match(/[一-鿿]{2,}/gu) ?? []))
function meaningSignal(a, b) {
  const right = meaningKanji(b)
  const shared = [...meaningKanji(a)].filter((text) => right.has(text))
  return shared.length ? `意味(${shared.slice(0, 3).join('・')})` : ''
}
function lookSignal(a, b, whys) {
  if (a.length === b.length && a.length >= 6) {
    const diffs = [...a].map((c, i) => (c !== b[i] ? [c, b[i]] : null)).filter(Boolean)
    if (diffs.length === 1 && diffs.every(([x, y]) => /[aeiouy]/.test(x) && /[aeiouy]/.test(y))) return '母音字'
  }
  if (whys.includes('2字違い')) {
    let common = 0
    while (common < a.length && a[common] === b[common]) common += 1
    if (common >= 5 && common >= Math.min(a.length, b.length) - 3) return '語尾'
  }
  return ''
}
const info = (spelling) => (wordsBySpelling.get(spelling) ?? []).map((word) => `${word.pos}${word.level}:${word.meaning}`).join(' / ')

const args = process.argv.slice(2)
const value = (name, fallback) => {
  const at = args.indexOf(name)
  return at >= 0 ? Number(args[at + 1]) : fallback
}
const onlySignals = args.includes('--signals')
const compact = args.includes('--compact')
const shortInfo = (spelling) => {
  const word = (wordsBySpelling.get(spelling) ?? [])[0]
  return word ? `${word.pos}${word.level}:${splitMeanings(word.meaning)[0]}` : ''
}
const rows = []
for (const [key, whys] of confusableSurveyPairs()) {
  if (listed.has(key) || reviewed[key]) continue
  const [a, b] = key.split('|')
  const signals = [soundSignal(a, b), letterSignal(a, b, whys), lookSignal(a, b, whys), meaningSignal(a, b)].filter(Boolean)
  if (onlySignals && !signals.length) continue
  rows.push(compact
    ? `${a}【${shortInfo(a)}】/${b}【${shortInfo(b)}】`
    : `${key}\t${signals.join(',') || whys.join('・')}\t${a}【${info(a)}】\t${b}【${info(b)}】`)
}
rows.sort()
const from = value('--from', 0)
const count = value('--count', rows.length)
console.log(`残り ${rows.length} 組（${from} から ${Math.min(count, rows.length - from)} 組)`)
console.log(rows.slice(from, from + count).join('\n'))
