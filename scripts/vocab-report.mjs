#!/usr/bin/env node
// 語彙カバレッジ・レポート。`npm run vocab` で実行。
// 級・品詞・語根のカバー状況、重複ID、欠落、語根の手薄さを可視化し、
// 次にどこを増やすべきかを効率よく探索するためのツール。
import { ALL_WORDS, wordsByLevel, wordsByRoot } from '../src/data/vocab.js'
import { ROOTS } from '../src/data/roots.js'
import { LEVELS } from '../src/data/levels.js'
import { PHRASES } from '../src/data/phrases.js'
import { PASSAGES } from '../src/data/passages.js'

const bar = (n, max, width = 24) => {
  const len = max ? Math.round((n / max) * width) : 0
  return '█'.repeat(len) + '·'.repeat(width - len)
}
const pad = (s, n) => String(s).padEnd(n)

console.log(`\n📚 えいごクエスト 語彙レポート`)
console.log(`================================`)
console.log(`総単語数: ${ALL_WORDS.length}　/　熟語・構文: ${PHRASES.length}　/　長文: ${PASSAGES.length}\n`)

// ── 級別 ──
console.log('■ 級別カバー')
const levelCounts = LEVELS.map((l) => ({ l, n: wordsByLevel(l.id).length }))
const maxLevel = Math.max(...levelCounts.map((x) => x.n))
for (const { l, n } of levelCounts) {
  console.log(`  ${pad('英検' + l.label, 7)} ${pad(n, 4)} ${bar(n, maxLevel)}`)
}

// ── 品詞別 ──
console.log('\n■ 品詞別')
const pos = {}
for (const w of ALL_WORDS) pos[w.pos] = (pos[w.pos] ?? 0) + 1
for (const [p, n] of Object.entries(pos).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${pad(p, 4)} ${pad(n, 4)} ${bar(n, ALL_WORDS.length)}`)
}

// ── 語根別 ──
console.log('\n■ 語根別（語源つながり）')
const rootCounts = ROOTS.map((r) => ({ r, n: wordsByRoot(r.id).length })).sort((a, b) => b.n - a.n)
const maxRoot = Math.max(...rootCounts.map((x) => x.n))
for (const { r, n } of rootCounts) {
  console.log(`  ${r.emoji} ${pad(r.form, 14)} ${pad(n, 3)} ${bar(n, maxRoot, 16)} ${r.meaning}`)
}
const weakRoots = rootCounts.filter((x) => x.n < 3)
if (weakRoots.length) {
  console.log(`  ⚠ 手薄な語根(<3語): ${weakRoots.map((x) => x.r.id).join(', ')}`)
}

// ── 健全性チェック ──
console.log('\n■ 健全性チェック')
const ids = ALL_WORDS.map((w) => w.id)
const dups = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))]
const noExample = ALL_WORDS.filter((w) => !w.example?.en)
const noMeaning = ALL_WORDS.filter((w) => !w.meaning)
const noEty = ALL_WORDS.filter((w) => !w.etymology)
const ok = (label, arr) =>
  console.log(`  ${arr.length === 0 ? '✓' : '✗'} ${label}: ${arr.length}${arr.length ? ' → ' + arr.slice(0, 8).map((x) => x.id ?? x).join(', ') : ''}`)
ok('重複ID', dups)
ok('例文なし', noExample)
ok('意味なし', noMeaning)
console.log(`  ・ 語源なし: ${noEty.length}（任意。語根語以外は省略可）`)

// ── 次に増やすべき所のヒント ──
console.log('\n■ 増量ヒント（目安: 各級バランス／語根は4語以上で映える）')
const avg = Math.round(ALL_WORDS.length / LEVELS.length)
const thin = levelCounts.filter((x) => x.n < avg * 0.7).map((x) => '英検' + x.l.label + `(${x.n})`)
console.log(`  ・ 平均より手薄な級: ${thin.length ? thin.join(', ') : 'なし（バランス良好）'}`)
console.log(`  ・ 伸ばせる語根: ${weakRoots.length ? weakRoots.map((x) => x.r.form).join(', ') : 'なし'}`)
console.log('')
