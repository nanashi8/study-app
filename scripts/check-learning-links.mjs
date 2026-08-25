#!/usr/bin/env node
// 学習のつながり監査。
//   1. 語源カードが、手動確認した明示リンクだけで単語とつながるか
//   2. 単語カードの「その語を含む熟語・構文」が、例文カード混入なしで並ぶか
//   3. どの画面からも、自分のアプリのホームへ帰れるか
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  ALL_WORDS,
  ETYMOLOGY_PACKS,
  etymologyCardsForWord,
  getWord,
} from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { phrasesForWord } from '../src/lib/wordPhrases.js'
import { APP_HOMES, appHomeForScreen, fallbackDestination } from '../src/lib/appHome.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (relative) => readFileSync(path.join(projectRoot, relative), 'utf8')
const errors = []
const line = (label, value) => console.log(`${label.padEnd(28)} ${String(value).padStart(8)}`)

// ── 1. 語源カードと単語の明示リンク ─────────────────────────────────
let etymologyLinkTotal = 0
const etymologyWordIds = new Set()
for (const pack of ETYMOLOGY_PACKS) {
  if (!pack.coverageIds.length) {
    errors.push(`語源カード「${pack.title}」に確認済み単語がない`)
  }
  const seen = new Set()
  for (const wordId of pack.coverageIds) {
    etymologyLinkTotal += 1
    etymologyWordIds.add(wordId)
    if (seen.has(wordId)) errors.push(`語源カード「${pack.title}」に同じ単語が二重にある`)
    seen.add(wordId)
    const word = getWord(wordId)
    if (!word) {
      errors.push(`語源カード「${pack.title}」に不明な単語ID ${wordId}`)
      continue
    }
    const explicitlyLinked = (word.etymology?.parts ?? []).some((part) => part.root === pack.rootId)
      || (word.referenceRoots ?? []).includes(pack.rootId)
    if (!explicitlyLinked) {
      errors.push(`語源カード「${pack.title}」と ${word.word} の明示リンクがない`)
    }
    if (!etymologyCardsForWord(word).some((card) => card.id === pack.id)) {
      errors.push(`${word.word} から語源カード「${pack.title}」へ逆引きできない`)
    }
  }
  if (pack.studyIds.join(',') !== pack.coverageIds.join(',')) {
    errors.push(`語源カード「${pack.title}」のカード対象と単語一覧が不一致`)
  }
}
if (etymologyCardsForWord('he').length) errors.push('he が確認済み語源カードへ混入している')

// ── 2. 単語カードの熟語・構文 ───────────────────────────────────────
const sentenceCards = new Set(
  PHRASES.filter((phrase) => phrase.category === 'grammar-example').map((phrase) => phrase.id),
)
let wordsWithPhrases = 0
let phraseLinkTotal = 0
let widest = { word: '', count: 0 }
for (const word of ALL_WORDS) {
  const phrases = phrasesForWord(word)
  if (!phrases.length) continue
  wordsWithPhrases += 1
  phraseLinkTotal += phrases.length
  if (phrases.length > widest.count) widest = { word: word.word, count: phrases.length }
  for (const phrase of phrases) {
    if (sentenceCards.has(phrase.id)) {
      errors.push(`${word.word} の熟語一覧に文法例文カードが混ざっている`)
    }
  }
}
if (wordsWithPhrases < 700) {
  errors.push(`熟語が付く単語が${wordsWithPhrases}語しかない`)
}
const studySource = read('src/screens/VocabStudy.jsx')
if (!studySource.includes('data-word-phrases') || !studySource.includes('relatedPhrases.all.map')) {
  errors.push('単語カードが、その語を含む熟語を全部並べていない')
}

// ── 3. 画面の行き来 ────────────────────────────────────────────────
const appSource = read('src/App.jsx')
const screenBlock = /const SCREENS = \{([\s\S]*?)\n\}/.exec(appSource)?.[1] ?? ''
const routedScreens = [...screenBlock.matchAll(/^\s{2}([A-Za-z]+):/gm)].map((match) => match[1])
const SHARED_SCREENS = new Set(['portal', 'login', 'settings', 'progress', 'myLearning'])
const mappedScreens = new Set(APP_HOMES.flatMap((home) => home.screens))
if (routedScreens.length < 60) errors.push('画面一覧を読み取れていない')
for (const screen of routedScreens) {
  if (!mappedScreens.has(screen) && !SHARED_SCREENS.has(screen)) {
    errors.push(`${screen} の所属アプリが決まっていない`)
  }
  const destination = fallbackDestination(screen)
  if (screen !== 'portal' && !destination) errors.push(`${screen} に戻り先がない`)
  if (destination === screen) errors.push(`${screen} が自分自身へ戻ろうとしている`)
}
const shellSource = read('src/components/AppShell.jsx')
if (!shellSource.includes('data-global-home-button')) {
  errors.push('共通バーに、いまのアプリのホームへ行くボタンがない')
}
for (const file of ['src/App.jsx', 'src/screens/MathMap.jsx', 'src/screens/KotenList.jsx', 'src/screens/KanbunHome.jsx']) {
  if (/navigate\('portal'\)/.test(read(file))) errors.push(`${file} が入口を履歴に積んでいる`)
}

// ── 報告 ──────────────────────────────────────────────────────────
console.log('学習のつながり監査')
console.log('='.repeat(46))
line('語源カード', ETYMOLOGY_PACKS.length)
line('確認済みカード→単語(延べ)', etymologyLinkTotal)
line('確認済みの紐づく単語(一意)', etymologyWordIds.size)
line('1枚あたり平均', (etymologyLinkTotal / ETYMOLOGY_PACKS.length).toFixed(1))
line('熟語が付く単語', wordsWithPhrases)
line('単語→熟語の結び付き(延べ)', phraseLinkTotal)
line(`最多の語（${widest.word}）`, widest.count)
line('画面数', routedScreens.length)
line('アプリのホーム', APP_HOMES.length)
console.log(`語源カードの帰り先: ${appHomeForScreen('etymologyPack').label}`)

if (errors.length) {
  console.error(`\n学習のつながり監査: ${errors.length}件の違反`)
  for (const error of errors.slice(0, 20)) console.error(`- ${error}`)
  process.exit(1)
}
console.log('\n✅ 確認済み語源リンク・熟語・画面の行き来はすべて条件を満たしています。')
