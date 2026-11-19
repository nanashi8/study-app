#!/usr/bin/env node
// 英単語の意味を日本語の声で読むときの読みの台帳（src/data/meaning-speech-kana.js）の確認。
//
// 母集団は英単語の全見出し語（ALL_WORDS）の、意味の読み上げ文（cardJapaneseSpeechTexts に meaningReadings: true）。
// 確かめること:
//  1) 漢字を含む読み上げ文には必ず台帳があり、台帳のかたまりが文のかたまりと順に一致し、読みがひらがなである
//  2) 台帳を当てた読み上げ文に漢字が1字も残らない（端末の声に漢字の読みを決めさせない）
//  3) 漢字のない読み上げ文・英単語にない id には台帳がない（使われない読みを残さない）
//  4) 台帳は人が読んだ版のまま（docs/audits/meaning-speech-kana-review.json の ledgerSha256 と一致）。
//     読みを足したり直したりしたら、文の中で読み直してから --stamp で押し直す
//  5) 読んで直した読み（corrections）が台帳に入っている
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { ALL_WORDS } from '../../src/data/vocab.js'
import { MEANING_SPEECH_KANA } from '../../src/data/meaning-speech-kana.js'
import {
  applyMeaningSpeechKana,
  cardJapaneseSpeechTexts,
  meaningSpeechKanaPairs,
  meaningSpeechTextBeforeKana,
} from '../../src/lib/cardSpeech.js'
import { stop } from '../stop.mjs'

const reviewUrl = new URL('../../docs/audits/meaning-speech-kana-review.json', import.meta.url)
const ledgerUrl = new URL('../../src/data/meaning-speech-kana.js', import.meta.url)
const KANJI_RUN = /[\p{Script=Han}々〆ヶ0-9０-９]*[\p{Script=Han}々〆ヶ]+[\p{Script=Han}々〆ヶ0-9０-９]*/gu
const HAN = /[\p{Script=Han}々〆ヶ]/u
const HIRAGANA = /^[\p{Script=Hiragana}ー]+$/u

export function ledgerSha256() {
  return createHash('sha256').update(readFileSync(ledgerUrl)).digest('hex')
}

export function meaningSpeechKanaProblems() {
  const problems = []
  const words = new Set(ALL_WORDS.map((word) => word.id))
  for (const id of Object.keys(MEANING_SPEECH_KANA)) {
    if (!words.has(id)) problems.push(`${id}: 英単語にない id の台帳`)
  }
  let wordsWithKanji = 0
  let runs = 0
  for (const word of ALL_WORDS) {
    const text = meaningSpeechTextBeforeKana({ id: word.id, meanings: word.meanings })
    const spoken = cardJapaneseSpeechTexts({ id: word.id, meanings: word.meanings, meaningReadings: true }).meaning
    const entry = MEANING_SPEECH_KANA[word.id]
    const textRuns = [...text.matchAll(KANJI_RUN)].map((match) => match[0])
    if (!textRuns.length) {
      if (entry) problems.push(`${word.id}: 漢字のない意味に台帳がある`)
      continue
    }
    wordsWithKanji += 1
    runs += textRuns.length
    if (!entry) {
      problems.push(`${word.id}: 漢字のある意味「${text}」に読みの台帳がない`)
      continue
    }
    const pairs = meaningSpeechKanaPairs(entry)
    if (pairs.length !== textRuns.length || pairs.some(([run], index) => run !== textRuns[index])) {
      problems.push(`${word.id}: 台帳のかたまり（${pairs.map(([run]) => run).join('・')}）が意味「${text}」のかたまり（${textRuns.join('・')}）と合わない`)
      continue
    }
    for (const [run, reading] of pairs) {
      if (!HIRAGANA.test(reading)) problems.push(`${word.id}: 「${run}」の読み「${reading}」がひらがなでない`)
    }
    if (HAN.test(spoken)) problems.push(`${word.id}: 読み上げ文「${spoken}」に漢字が残る`)
    if (applyMeaningSpeechKana(text, entry) !== spoken) problems.push(`${word.id}: 台帳を当てた文が読み上げ文と違う`)
  }
  return { problems, wordsWithKanji, runs }
}

export function reviewProblems(review) {
  const problems = []
  if (review.ledgerSha256 !== ledgerSha256()) {
    problems.push('台帳が読んだ版から変わっている。変えた読みを文の中で読み直してから --stamp で押し直す')
  }
  for (const correction of review.corrections ?? []) {
    for (const id of correction.ids) {
      const pairs = meaningSpeechKanaPairs(MEANING_SPEECH_KANA[id])
      if (!pairs.some(([run, reading]) => run === correction.run && reading === correction.reading)) {
        problems.push(`${id}: 読んで直した「${correction.run}＝${correction.reading}」が台帳にない`)
      }
    }
  }
  return problems
}

function main() {
  const review = JSON.parse(readFileSync(reviewUrl, 'utf8'))
  if (process.argv.includes('--stamp')) {
    review.ledgerSha256 = ledgerSha256()
    writeFileSync(reviewUrl, `${JSON.stringify(review, null, 2)}\n`)
    console.log(`押し直した: ${review.ledgerSha256}`)
    return
  }
  const { problems, wordsWithKanji, runs } = meaningSpeechKanaProblems()
  problems.push(...reviewProblems(review))
  if (problems.length) {
    console.error(`❌ 英単語の意味の読みの台帳: ${problems.length}件\n${problems.slice(0, 40).join('\n')}`)
    stop(1)
  }
  console.log(`✅ 英単語の意味の読み: ${ALL_WORDS.length.toLocaleString('ja-JP')}語中、漢字のある${wordsWithKanji.toLocaleString('ja-JP')}語・${runs.toLocaleString('ja-JP')}か所すべてを台帳のかなで読む（読んで直した読み ${review.corrections.length}組）`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
