#!/usr/bin/env node
// 語源教材の全母数レポート。
// 生データ・保存互換アーカイブ・公開カードを混同せず、それぞれの件数を表示する。
import {
  ALL_WORDS,
  ETYMOLOGY_LEGACY_PACKS,
  ETYMOLOGY_LEGACY_SUMMARY,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SUMMARY,
  etymologyCardsForWord,
  getWord,
} from '../src/data/vocab.js'

const raw = {
  total: ALL_WORDS.length,
  notes: ALL_WORDS.filter((word) => word.etymology?.note?.trim()).length,
  origins: ALL_WORDS.filter((word) => word.etymology?.origin?.trim()).length,
  structured: ALL_WORDS.filter((word) => word.etymology?.parts?.length).length,
  referenceLinked: ALL_WORDS.filter((word) => word.referenceRoots?.length).length,
}

const publicWordIds = new Set(ETYMOLOGY_PACKS.flatMap((card) => card.coverageIds))
const publicLinks = ETYMOLOGY_PACKS.reduce((sum, card) => sum + card.coverageIds.length, 0)
const sourceLinks = ETYMOLOGY_PACKS.reduce((sum, card) => sum + card.evidence.sources.length, 0)
const problems = []

for (const card of ETYMOLOGY_PACKS) {
  if (card.mode !== 'root' || card.groupClaim !== 'manual-reviewed-root') {
    problems.push(`${card.id}: 手動監査済み語根カードではない`)
  }
  if (!card.rootForm || !card.rootMeaning || !card.rootOrigin) {
    problems.push(`${card.id}: 語根の形・意味・出発点が不足`)
  }
  if (!card.coverageIds.length) problems.push(`${card.id}: 紐づく確認済み単語が空`)
  if (new Set(card.coverageIds).size !== card.coverageIds.length) {
    problems.push(`${card.id}: 紐づく単語が重複`)
  }
  for (const wordId of card.coverageIds) {
    if (!getWord(wordId)) problems.push(`${card.id}: 不明な単語ID ${wordId}`)
  }
}

if (ETYMOLOGY_LEGACY_SUMMARY.total !== ALL_WORDS.length) {
  problems.push(`保存互換アーカイブの全語数が不一致: ${ETYMOLOGY_LEGACY_SUMMARY.total}/${ALL_WORDS.length}`)
}
if (
  ETYMOLOGY_SUMMARY.cards !== ETYMOLOGY_PACKS.length ||
  ETYMOLOGY_SUMMARY.total !== publicWordIds.size ||
  ETYMOLOGY_SUMMARY.links !== publicLinks
) {
  problems.push('公開カードのサマリーが実データと一致しない')
}
if (etymologyCardsForWord('he').length) problems.push('he が確認済み語源カードへ混入')

const line = (label, value, unit = '') => {
  console.log(`${label.padEnd(34)} ${String(value).padStart(8)}${unit}`)
}

console.log('\n語源教材・全母数レポート')
console.log('='.repeat(56))
console.log('[生データ走査]')
line('全語源レコード', raw.total, '語')
line('自由記述noteあり', raw.notes, '語')
line('自由記述originあり', raw.origins, '語')
line('構造化partsあり', raw.structured, '語')
line('補助語根リンクあり', raw.referenceLinked, '語')

console.log('\n[学習者へ公開する教材]')
line('手動監査済み語源カード', ETYMOLOGY_PACKS.length, '枚')
line('確認済みの紐づく単語（一意）', publicWordIds.size, '語')
line('カード→単語リンク（延べ）', publicLinks, '件')
line('照合先URL', sourceLinks, '件')
line('未承認のため表示しない自由記述', ETYMOLOGY_SUMMARY.quarantinedWords, '語')
line('he に紐づく公開カード', etymologyCardsForWord('he').length, '枚')

console.log('\n[保存互換アーカイブ・非公開]')
line('旧学習パック', ETYMOLOGY_LEGACY_PACKS.length, '束')
line('旧割当を保持する単語', ETYMOLOGY_LEGACY_SUMMARY.total, '語')

if (problems.length) {
  console.error(`\n❌ 語源教材レポート: ${problems.length}件の構造違反`)
  for (const problem of problems) console.error(`- ${problem}`)
  process.exit(1)
}

console.log('\n✅ 生データ、非公開アーカイブ、公開カードの母数を分離して確認しました。\n')
