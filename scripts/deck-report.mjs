#!/usr/bin/env node
// デッキ構成レポート。`npm run decks` で実行。
// 目次（級→章→デッキ）の全体像と、デッキ数・サイズ分布・進捗コードの
// 想定サイズ（QRに収まるか）を確認するためのツール。
import { DECKS, DECK_TOC, DECK_VERSION, encodeDeckDigits } from '../src/data/decks.js'
import LZString from 'lz-string'

const pad = (s, n) => String(s).padEnd(n)
const padL = (s, n) => String(s).padStart(n)

console.log(`\n🗂  デッキ構成レポート（v${DECK_VERSION}）`)
console.log(`================================`)
const totalWords = DECKS.reduce((n, d) => n + d.size, 0)
console.log(`総デッキ数: ${DECKS.length}　/　収録語: ${totalWords}　/　1デッキ平均: ${(totalWords / DECKS.length).toFixed(1)}語\n`)

// ── 目次（級→章→デッキ）──
for (const { level, chapters, deckCount, size } of DECK_TOC) {
  console.log(`${level.emoji} ${level.label}（${size}語 / ${deckCount}デッキ）`)
  for (const ch of chapters) {
    const sizes = ch.decks.map((d) => d.size).join(',')
    console.log(`   ├ ${pad(ch.field, 10)} ${padL(ch.size, 4)}語  → ${ch.decks.length}デッキ [${sizes}]`)
  }
  console.log('')
}

// ── サイズ分布の健全性 ──
const sizes = DECKS.map((d) => d.size)
const tiny = DECKS.filter((d) => d.size < 5)
console.log('■ サイズ分布')
console.log(`  最大 ${Math.max(...sizes)}語 / 最小 ${Math.min(...sizes)}語 / 5語未満のデッキ: ${tiny.length}`)
if (tiny.length) console.log(`    ⚠ 小さいデッキ: ${tiny.slice(0, 10).map((d) => d.id + `(${d.size})`).join(', ')}`)

// ── 進捗コードの想定サイズ（デッキ単位・位置インデックス方式）──
// 達成度を 0..5 の桁列にして DECKS 順に並べ、圧縮する。
const measure = (label, digits) => {
  const code = `EQD${DECK_VERSION}-` + LZString.compressToEncodedURIComponent(digits)
  const ok = code.length <= 2300
  console.log(`  ${label}: ${String(code.length).padStart(4)}文字 ${ok ? '✅' : '❌ QR超過'}`)
}
console.log('\n■ 進捗コード（デッキ単位・位置インデックス方式）')
console.log(`  デッキ数=${DECKS.length}（=桁数）。QR 1枚の実用上限 ≈ 2300文字`)
// 代表ケースをいくつか測る（srs を模擬）。
const srsAt = (boxFn) => Object.fromEntries(DECKS.flatMap((d) => d.wordIds.map((id, i) => [id, { box: boxFn(d, i) }])))
measure('新規（全部0）          ', encodeDeckDigits({}))
measure('半分習得（box=4を交互） ', encodeDeckDigits(srsAt((d, i) => (i % 2 ? 4 : 1))))
measure('全デッキ最高（最悪ケース）', encodeDeckDigits(srsAt(() => 5)))
measure('ランダムまだら          ', encodeDeckDigits(srsAt((d, i) => (i * 7 + d.part) % 6)))
console.log('')
