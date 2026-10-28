// 依頼 2026-10-28-basic-reading-sentence-detail の条件 structure-ledger-every-sentence。
// 基礎長文の全文に、長文・名作と同じ記法の構造台帳を1文ずつ手で書き、同じ検査（文型・節と句の働き・前置詞句・並列・
// つなぐ語・語順訳・記号の働き）を通す。一文の構文解説は台帳だけから作り、自動の解析は使わない。
import test from 'node:test'
import assert from 'node:assert/strict'

import { BASIC_READING_LEVEL_IDS, BASIC_READING_PASSAGES, basicReadingPassagesForLevel } from '../src/data/basic-reading/index.js'
import { BASIC_READING_STRUCTURES } from '../src/data/basic-reading/structures/index.js'
import { analyzeBasicReadingSentence } from '../src/lib/basicReadingSentence.js'
import { structureWords } from '../src/lib/reading-sentence-structure.js'
import { basicReadingStructureProblems } from '../scripts/checks/basic-reading-structures.mjs'

test('基礎長文50本の全611文に手書きの構造台帳があり、長文・名作と同じ検査の誤りが0件', () => {
  const { problems, sentences, chunks } = basicReadingStructureProblems()
  assert.deepEqual(problems, [])
  assert.equal(sentences, 611)
  assert.equal(chunks, 1927)
  assert.deepEqual(
    BASIC_READING_LEVEL_IDS.map((level) => basicReadingPassagesForLevel(level).reduce((sum, passage) => sum + passage.sentences.length, 0)),
    [93, 94, 133, 147, 144],
  )
  assert.deepEqual(Object.keys(BASIC_READING_STRUCTURES).sort(), BASIC_READING_PASSAGES.map((passage) => passage.id).sort())
})

test('一文の構文解説は台帳から作る：語順訳・構造図・語順訳ごとの役割の説明が台帳どおりで、自動の解析を使わない', () => {
  for (const passage of BASIC_READING_PASSAGES) {
    passage.sentences.forEach((sentence, index) => {
      const where = `${passage.id}#${index + 1}`
      const entry = BASIC_READING_STRUCTURES[passage.id][index]
      const analysis = analyzeBasicReadingSentence(passage, index)
      assert.equal(analysis.phraseMethod, 'basic-reading-structure-ledger', where)
      assert.equal(analysis.marked, analysis.structure.marked, `${where}: 構造図が台帳と違う`)
      assert.deepEqual(
        analysis.meaningPhraseSequence.map((phrase) => [phrase.en, phrase.ja]),
        entry.chunks.map((chunk) => [chunk.en, chunk.ja]),
        `${where}: 台帳の語順訳が画面に出ない`,
      )
      assert.deepEqual(
        structureWords(analysis.meaningPhraseSequence.map((phrase) => phrase.en).join(' ')),
        structureWords(sentence.en),
        `${where}: 語順訳のまとまりから原文に戻せない`,
      )
      assert.equal(analysis.structurePhrases.length, entry.chunks.length, `${where}: 語順訳の役割が足りない`)
      for (const phrase of analysis.structurePhrases) assert.ok(phrase.parts.length > 0 && phrase.explanation, `${where}: 役割の説明が空`)
    })
  }
})

test('文の読解ルールは、台帳に書いたルールか、その文を使う基礎長文のルールの学習から選ぶ', () => {
  for (const passage of BASIC_READING_PASSAGES) {
    for (const lesson of passage.lessons) {
      for (const index of lesson.sentences) {
        const analysis = analyzeBasicReadingSentence(passage, index)
        const entry = BASIC_READING_STRUCTURES[passage.id][index]
        if (!entry.rules?.length) assert.ok(analysis.structure.rules.includes(lesson.rule), `${passage.id}#${index + 1}: ${lesson.rule}`)
      }
    }
  }
})
