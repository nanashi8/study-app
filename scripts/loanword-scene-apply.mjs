// カタカナ語の台帳に使う場面（scene）か注意書き（note）を書き込む。
// 入力は1行1語で「id|場面の文」、注意書きにするときは「id|note|注意書きの文」（kana も変えるときは「id|kana=カナ|…」を前に）。
// 既にある場面・注意書きは上書きしない（先頭に ! で強制）。
// 使い方: node scripts/loanword-scene-apply.mjs <入力ファイル>
import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../src/data/loanword-hints.js', import.meta.url)
let source = readFileSync(file, 'utf8')
const quote = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
let applied = 0
const problems = []
for (const raw of readFileSync(process.argv[2], 'utf8').split('\n')) {
  if (!raw.trim()) continue
  const force = raw.startsWith('!')
  const parts = (force ? raw.slice(1) : raw).split('|').map((part) => part.trim())
  const id = parts.shift()
  let kana = null
  if (parts[0]?.startsWith('kana=')) kana = parts.shift().slice(5)
  const isNote = parts[0] === 'note'
  if (isNote) parts.shift()
  const text = parts.join('|')
  const pattern = new RegExp(`^  (${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}): \\{ kana: '([^']*)'(.*) \\},$`, 'm')
  const match = source.match(pattern)
  if (!match || !text) { problems.push(`${id}: 台帳の行が見つからないか文が空`); continue }
  const rest = match[3]
  const key = isNote ? 'note' : 'scene'
  if (!force && new RegExp(`${key}: `).test(rest)) { problems.push(`${id}: ${key} が既にある`); continue }
  const cleaned = rest.replace(new RegExp(`, ${key}: '(?:[^'\\\\]|\\\\.)*'`), '')
  const line = `  ${match[1]}: { kana: '${kana ?? match[2]}'${isNote ? cleaned : ''}, ${key}: ${quote(text)}${isNote ? '' : cleaned} },`
  source = source.replace(pattern, () => line)
  applied += 1
}
writeFileSync(file, source)
console.log(`書いた ${applied} 語`)
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1 }
