// 探索マップ：抜け・重複をそもそも発生させないための「カバレッジ＋フロンティア」レポート。
//   ① カバレッジ密度 … どの分野/級/品詞/頭文字が手薄かを可視化（＝抜けの所在）。
//   ② フロンティア   … 既存語の syn/ant/der/fam が参照しているのに、まだ見出し語に
//                       なっていない語。意味つき・重複なしの「次に入れるべき確実な候補」。
// 使い方: npm run map        … レポート表示＋ vocab-frontier.json 書き出し
//         npm run map 200    … フロンティア上位200件まで表示
import { writeFileSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'

const slug = (w) => String(w).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const ids = new Set(ALL_WORDS.map((w) => w.id))
const topN = Number(process.argv[2]) || 80

// ── ① カバレッジ密度 ──────────────────────────────────
const tally = (key) => {
  const m = new Map()
  for (const w of ALL_WORDS) {
    const k = typeof key === 'function' ? key(w) : (w[key] || '—')
    m.set(k, (m.get(k) || 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}
const fmtRow = (rows) => rows.map(([k, n]) => `${k}:${n}`).join('  ')

console.log(`\n=== 探索マップ（全${ALL_WORDS.length}語）===\n`)
console.log('■ 級:    ', fmtRow(tally('level')))
console.log('■ 品詞:  ', fmtRow(tally('pos')))
console.log('■ 分野:  ', fmtRow(tally('field')))
console.log('■ 頭文字:', fmtRow(tally((w) => w.word[0]?.toUpperCase())))

// ── ② フロンティア（参照されているのに未収録の語）──────
// 各候補について：表示語・意味（参照元のm）・参照回数・参照種別を集計。
const cand = new Map() // slug -> {word, glosses:Set, count, kinds:Set}
const collect = (items, kind) => {
  for (const it of items || []) {
    if (!it?.w) continue
    if (/[^a-zA-Z'-]/.test(it.w.trim())) continue // 句動詞・複数語は除外（単語のみ）
    const s = slug(it.w)
    if (!s || ids.has(s)) continue // 既に見出し語なら候補にしない＝重複防止
    const e = cand.get(s) || { word: it.w.trim(), glosses: new Set(), count: 0, kinds: new Set() }
    e.count++
    if (it.m) e.glosses.add(it.m)
    e.kinds.add(kind)
    cand.set(s, e)
  }
}
for (const w of ALL_WORDS) {
  collect(w.synonyms, 'syn')
  collect(w.antonyms, 'ant')
  collect(w.derivatives, 'der')
  collect(w.family, 'fam')
}

const frontier = [...cand.values()]
  .map((e) => ({ word: e.word, meaning: [...e.glosses].join('・'), refs: e.count, kinds: [...e.kinds].sort().join('/') }))
  .sort((a, b) => b.refs - a.refs || a.word.localeCompare(b.word))

console.log(`\n■ フロンティア（参照あり・未収録の確実な候補）: ${frontier.length}語`)
console.log('  ※ 重複なし・意味つき。参照回数の多い順＝より中心的な語。\n')
for (const f of frontier.slice(0, topN)) {
  console.log(`  ${String(f.refs).padStart(2)}回  ${f.word.padEnd(16)} ${f.meaning}  [${f.kinds}]`)
}
if (frontier.length > topN) console.log(`  …他 ${frontier.length - topN}語（全件は vocab-frontier.json）`)

writeFileSync(new URL('../vocab-frontier.json', import.meta.url), JSON.stringify(frontier, null, 0))
console.log(`\n→ 全${frontier.length}件を vocab-frontier.json に書き出しました。`)
console.log('  これを順に見出し語化すれば、抜け（参照だけで未収録）も重複も出ません。\n')
