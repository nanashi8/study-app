#!/usr/bin/env node
// データ整合性ゲート（npm run check / build前に自動実行）。
// 全単語・熟語・長文が「既存機能を満たす必須項目」を備えるか検証し、
// 1件でも不備があれば exit 1 でビルドを止める。データ生成ミスを二度と通さない。
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { PASSAGES } from '../src/data/passages.js'

const LEVELS = new Set(['5', '4', '3', 'pre2', '2', 'pre1', '1'])
const POS = new Set(['動', '名', '形', '副', '前', '接', '代'])
const errors = []
const ids = new Set()

// ── 単語：id, word, pos, level, meaning, meanings, example(en/ja), etymology, phonetic(IPA) ──
for (const w of ALL_WORDS) {
  const at = w.id || w.word || '?'
  if (!w.id) errors.push(`単語「${w.word}」: id 無し`)
  else if (ids.has(w.id)) errors.push(`重複 id: ${w.id}`)
  ids.add(w.id)
  if (!w.word) errors.push(`${at}: word 無し`)
  if (!POS.has(w.pos)) errors.push(`${at}: pos が不正 (${w.pos})`)
  if (!LEVELS.has(w.level)) errors.push(`${at}: level が不正 (${w.level})`)
  if (!w.meaning) errors.push(`${at}: meaning 無し`)
  if (!w.meanings?.length) errors.push(`${at}: meanings 無し`)
  if (!w.example?.en || !w.example?.ja) errors.push(`${at}: 例文(en/ja) 無し`)
  if (!w.etymology) errors.push(`${at}: 語源 無し`)
  if (!w.phonetic) errors.push(`${at}: 発音記号(IPA) 無し → npm run phonetics`)
}

// ── 補助項目（類義語/反対語/派生語）と「語族=1エントリ」ルールの強制 ──
const wordIds = new Set(ALL_WORDS.map((w) => w.id))
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
for (const w of ALL_WORDS) {
  for (const key of ['synonyms', 'antonyms', 'derivatives']) {
    for (const it of w[key] ?? []) {
      if (!it || !it.w || !it.m) errors.push(`${w.id}: ${key} の項目は {w:英単語, m:意味} が必須 (${JSON.stringify(it)})`)
    }
  }
  // 推奨ルール: 透明な派生語はメタデータに留め、独立エントリと二重計上しない
  for (const d of w.derivatives ?? []) {
    if (d?.w && wordIds.has(slug(d.w)) && slug(d.w) !== w.id) {
      errors.push(`${w.id}: 派生語「${d.w}」は独立エントリです。派生語(メタ)と独立エントリは二重計上不可（語族=1エントリで数える）。別語なら synonyms/usage で参照を。`)
    }
  }
}

// ── 熟語・構文 ──
for (const p of PHRASES) {
  const at = p.id || p.phrase
  if (!p.phrase || !p.meaning || !p.meanings?.length || !p.example?.en || !p.example?.ja) {
    errors.push(`熟語/構文 ${at}: 必須項目(phrase/meaning/meanings/example) 不足`)
  }
}

// ── 長文：まとめ語彙・gloss の id が辞書解決できるか ──
for (const ps of PASSAGES) {
  for (const id of ps.vocab) if (!getWord(id)) errors.push(`長文 ${ps.id}: vocab ${id} が辞書に無い`)
  for (const s of ps.sentences) {
    if (!s.en || !s.ja || !s.chunks?.length) errors.push(`長文 ${ps.id}: 文に en/ja/chunks 不足`)
    for (const [k, g] of Object.entries(s.gloss ?? {})) {
      if (g.id && !getWord(g.id)) errors.push(`長文 ${ps.id}: gloss "${k}"→${g.id} が辞書に無い`)
    }
  }
}

if (errors.length) {
  console.error(`\n❌ データ検証 失敗（${errors.length}件）`)
  errors.slice(0, 40).forEach((e) => console.error('  - ' + e))
  if (errors.length > 40) console.error(`  … 他 ${errors.length - 40} 件`)
  console.error('\n【単語の必須項目】id, word, pos, level, meaning, meanings, example(en/ja), etymology, phonetic(IPA)')
  console.error('単語を足したら: npm run phonetics（IPA生成）→ npm run check。これらを満たすまでビルドできません。\n')
  process.exit(1)
}

console.log(`✅ データ検証OK: ${ALL_WORDS.length}語 / ${PHRASES.length}熟語・構文 / ${PASSAGES.length}長文 — 全て必須項目を満たす`)
