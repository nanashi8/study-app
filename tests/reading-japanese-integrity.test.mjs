import test from 'node:test'
import assert from 'node:assert/strict'

import { ANNOTATED_PASSAGES } from '../src/data/passages.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'

// 学習者に見えるのは、講師が書いた日本語だけであるべき。解析器が語義を機械的に
// つないだ出力が表に出ると、「彼らを5月・申し込む」のような誤訳になる。
// ここでは、その機械出力に固有の形だけを落とす。日本語として正しい列挙の中点
// （「英語・音楽・理科」）や、原文の語を名指しする講師注記は不具合ではない。

// 原文の語をそのまま示す、意図的な講師注記。
const SANCTIONED_ENGLISH_NOTES = Object.freeze([
  'that以下', 'whether以下', 'if以下', 'to不定詞', 'ing形', 'ed形', 'be動詞',
  '動作はawayで完成', '次の explore の動作主として', 'always や every のような語は',
])
const withoutSanctionedEnglish = (ja) =>
  SANCTIONED_ENGLISH_NOTES.reduce((text, note) => text.split(note).join(''), ja)
    .replace(/[A-Z]{2,}/g, '')

const DEFECTS = Object.freeze([
  ['未訳フォールバック', (ja) => ja.includes('このまとまりの意味を自然な和訳で確認')],
  ['語形メタの露出', (ja) => /の三人称単数|の過去形|の過去分詞|の複数形|の現在分詞|の原形/.test(ja)],
  ['格助詞の積み重ね', (ja) => /(に|で|へ|から|まで|より)(が|を)([、。）]|$)/.test(ja)],
  ['同一句の重複', (ja) => /(.{6,})\1/.test(ja.split('／').join(''))],
  ['連体形の宙づり', (ja) => /(する|した|ない)・/.test(ja)],
  ['ノの宙づり', (ja) => /(する|した|しない)の(・|、|$)/.test(ja)],
  ['中点の位置ずれ', (ja) => /、・|・、|^・|・$/.test(ja)],
  ['助詞の重複', (ja) => /をを|がが|はは|にに|へへ|とと(?!もに)|でで(?!き)/.test(ja)],
  ['空の日本語', (ja) => !ja.trim()],
])

// 助動詞や前置詞を、同じつづりの名詞の語義で訳してしまう取り違え。
// 「may apply them → 彼らを5月・申し込む」のように、原文の語と訳語が同時に出たときだけ落とす。
const WRONG_SENSE = Object.freeze([
  [/\bmay\b/, '5月'],  // 小文字の may は助動詞。大文字の May は月名なので対象外。
  [/\bmarch\b/, '3月'],
  [/\baugust\b/, '8月'],
  [/\bcan\b/i, '缶'],
  [/\bwill\b/i, '遺言'],
  [/\bmight\b/i, '腕力'],
  [/\bsaw\b/i, 'のこぎり'],
  [/\bbear\b/i, 'くま'],
])

const findDefect = (en, ja) => {
  for (const [name, test_] of DEFECTS) if (test_(ja)) return name
  if (/[a-z]{3,}/.test(withoutSanctionedEnglish(ja))) return '英単語の露出'
  for (const [word, gloss] of WRONG_SENSE) {
    if (word.test(en) && ja.includes(gloss)) return '機能語を別品詞の語義で訳している'
  }
  return null
}

test('全長文の学習者向け日本語に、解析器の機械出力が混じっていない', () => {
  const found = []
  for (const passage of ANNOTATED_PASSAGES) {
    for (const [index, sentence] of passage.sentences.entries()) {
      const analysis = analyzeReadingSentence(sentence)
      const layers = [
        ['意味フレーズ', analysis.meaningPhraseSequence],
        ['内部SVOCM単位', analysis.phraseSequence],
        ['語順訳ブロック', analysis.blocks],
      ]
      for (const [layer, parts] of layers) {
        for (const part of parts) {
          const en = `${part.displayEn ?? part.en ?? ''}`
          const ja = `${part.ja ?? ''}`
          const defect = findDefect(en, ja)
          if (defect) {
            found.push(`${passage.id} 第${index + 1}文 ${layer}［${defect}］${en} → ${ja}`)
          }
        }
      }
    }
  }
  assert.deepEqual(found, [])
})

test('語順訳の日本語の区切り数は、指定した英語単位の数と一致する', () => {
  const mismatches = []
  for (const passage of ANNOTATED_PASSAGES) {
    for (const [index, sentence] of passage.sentences.entries()) {
      if (!Array.isArray(sentence.translationScenario)) continue
      for (const block of sentence.translationScenario) {
        if (!Array.isArray(block.enSegments) || !Array.isArray(block.jaSegments)) continue
        if (block.enSegments.length === block.jaSegments.length) continue
        mismatches.push(
          `${passage.id} 第${index + 1}文「${block.en}」英語${block.enSegments.length}単位 / 日本語${block.jaSegments.length}区切り`,
        )
      }
    }
  }
  assert.deepEqual(mismatches, [])
})
