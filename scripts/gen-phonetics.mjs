#!/usr/bin/env node
// 全単語の発音記号(IPA)を CMU Pronouncing Dictionary から生成 → src/data/phonetics.js
// 使い方: npm run phonetics
// ARPABET → IPA 変換は arpa-ipa.mjs。
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { dictionary } from 'cmu-pronouncing-dictionary'
import { ALL_WORDS } from '../src/data/vocab.js'
import { arpaToIPA } from './arpa-ipa.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const map = {}
const missing = []
const seen = new Set()
for (const w of ALL_WORDS) {
  const key = w.word.toLowerCase()
  if (seen.has(key)) continue
  seen.add(key)
  const arpa = dictionary[key]
  if (arpa) map[key] = arpaToIPA(typeof arpa === 'string' ? arpa : arpa[0])
  else missing.push(w.word)
}

const banner =
  '// 発音記号(IPA)マップ（自動生成 / npm run phonetics）。\n' +
  '// CMU Pronouncing Dictionary（パブリックドメイン）から ARPABET→IPA 変換で生成。\n' +
  '// vocab.js の normalize が、語自身に phonetic が無いときここから補完する。手で編集しない。\n'
writeFileSync(
  resolve(root, 'src/data/phonetics.js'),
  banner + 'export const PHONETICS = ' + JSON.stringify(map, null, 0) + '\n',
)

console.log(`\n🔤 発音記号(IPA)生成`)
console.log(`  生成: ${Object.keys(map).length} 語 → src/data/phonetics.js`)
console.log(`  CMU未収録（手動付与が必要）: ${missing.length}${missing.length ? ' → ' + missing.join(', ') : ''}`)
