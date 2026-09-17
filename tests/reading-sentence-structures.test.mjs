import test from 'node:test'
import assert from 'node:assert/strict'

import { ANNOTATED_PASSAGES } from '../src/data/passages.js'
import { READING_SENTENCE_STRUCTURES } from '../src/data/reading-structures/index.js'
import { READING_PARAGRAPH_GUIDES } from '../src/data/reading-paragraph-guides.js'
import { READING_RULES_BY_ID } from '../src/data/reading-rules.js'
import { READING_GRAMMAR_EXPECTATIONS } from '../src/data/reading-grammar-expectations.js'
import { analyzeReadingSentence, analyzePassageParagraphs } from '../src/lib/reading-grammar.js'
import {
  buildSentenceStructure,
  structurePatternName,
  structureWords,
  structureRolesForWordSpan,
} from '../src/lib/reading-sentence-structure.js'

const passageById = new Map(ANNOTATED_PASSAGES.map((passage) => [passage.id, passage]))

test('構造台帳は本文と同じ順番・同じ英文で、書き方の誤りがない', () => {
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    assert.ok(passage, `${passageId}: 本文がない`)
    assert.equal(entries.length, passage.sentences.length, `${passageId}: 文の数が本文と違う`)
    passage.sentences.forEach((sentence, index) => {
      const entry = entries[index]
      const structure = buildSentenceStructure(sentence.en, entry.markup, entry)
      assert.deepEqual(structure.errors, [], `${sentence.reviewId}: ${sentence.en}`)
      assert.ok(structure.patterns.length > 0, `${sentence.reviewId}: 文型を決められない`)
      for (const unit of structure.units) {
        assert.ok(unit.functionText, `${sentence.reviewId}: 「${unit.text}」の働きが空`)
      }
      for (const id of entry.rules ?? []) {
        assert.ok(READING_RULES_BY_ID[id], `${sentence.reviewId}: 読解ルール ${id} がない`)
      }
    })
  }
})

test('構造台帳のある文は、画面の要素・構造図・語順訳の役割を台帳から作る', () => {
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    passage.sentences.forEach((sentence, index) => {
      const analysis = analyzeReadingSentence(sentence)
      assert.ok(analysis.structure, `${sentence.reviewId}: 台帳が解析へ届かない`)
      assert.equal(analysis.marked, analysis.structure.marked, `${sentence.reviewId}: 構造図が台帳と違う`)
      assert.deepEqual(
        structureWords(analysis.meaningPhraseSequence.map((phrase) => phrase.spokenEn ?? phrase.en).join(' ')),
        structureWords(sentence.en),
        `${sentence.reviewId}: 語順訳のまとまりから原文に戻せない`,
      )
      assert.equal(
        analysis.structurePhrases.length,
        analysis.meaningPhraseSequence.length,
        `${sentence.reviewId}: 語順訳の役割が足りない`,
      )
      for (const phrase of analysis.structurePhrases) {
        assert.ok(phrase.parts.length > 0 && phrase.explanation, `${sentence.reviewId}: 役割の説明が空`)
      }
      const chunks = entries[index].chunks
      if (chunks) {
        assert.deepEqual(
          analysis.meaningPhraseSequence.map((phrase) => [phrase.spokenEn ?? phrase.en, phrase.ja]),
          chunks.map((chunk) => [chunk.en, chunk.ja]),
          `${sentence.reviewId}: 台帳で指定した語順訳が画面に出ない`,
        )
      }
    })
  }
})

test('構造台帳の主節の文型は、5文型の正解表と一致する', () => {
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    const expected = READING_GRAMMAR_EXPECTATIONS[passageId]
    assert.ok(expected, `${passageId}: 5文型の正解表がない`)
    passage.sentences.forEach((sentence, index) => {
      const structure = buildSentenceStructure(sentence.en, entries[index].markup, entries[index])
      // 命令文は主語 you を省いた形として、正解表の5文型と照らす。
      const mainPattern = structure.patterns[0].replace(/^\(you\)/, 'S')
      assert.equal(mainPattern, expected[index], `${sentence.reviewId}: ${structure.patterns.join('／')}`)
    })
  }
})

test('段落解説の台帳は段落の数と一致し、4項目すべてを書いている', () => {
  for (const [passageId, guides] of Object.entries(READING_PARAGRAPH_GUIDES)) {
    const passage = passageById.get(passageId)
    assert.ok(passage, `${passageId}: 本文がない`)
    const paragraphs = analyzePassageParagraphs(passage)
    assert.equal(guides.length, paragraphs.length, `${passageId}: 段落の数が違う`)
    for (const [index, item] of paragraphs.entries()) {
      for (const field of ['role', 'summary', 'connection', 'strategy']) {
        assert.ok(`${item[field]}`.trim(), `${passageId} P${index + 1}: ${field} が空`)
      }
    }
  }
})

test('関係代名詞の節は先行詞を含む名詞のまとまりの中に置き、その要素の一部として説明する', () => {
  const structure = buildSentenceStructure(
    'A screen near the office reports the power that the school makes each day.',
    '[S A screen near the office] [V reports] [O the power {関係>the power| [O that] [S the school] [V makes] [M each day]}].',
  )
  assert.deepEqual(structure.errors, [])
  assert.deepEqual(
    structure.elements.map((element) => [element.role, element.trimmed]),
    [
      ['S', 'A screen near the office'],
      ['V', 'reports'],
      ['O', 'the power that the school makes each day'],
    ],
  )
  assert.deepEqual(structure.patterns.map(structurePatternName), ['第3文型（SVO）'])
  const [relative] = structure.units
  assert.equal(relative.label, '関係代名詞の節（形容詞節）')
  assert.deepEqual(
    relative.parts.map((part) => [part.role, part.text]),
    [['O', 'that'], ['S', 'the school'], ['V', 'makes'], ['M', 'each day']],
  )
  assert.match(relative.functionText, /the power を後ろから説明します/)
  const makesEachDay = structureRolesForWordSpan(structure, 11, 14)
  assert.equal(makesEachDay.pattern, 'V＋M')
  assert.equal(makesEachDay.scope, '関係代名詞の節（形容詞節）')
  const reportsThePower = structureRolesForWordSpan(structure, 5, 8)
  assert.equal(reportsThePower.pattern, 'V＋O')
  assert.match(reportsThePower.explanation, /目的語Oは「the power that the school makes each day」全体/)
})

test('台帳の英文が本文と違う・役割のない語がある・説明する名詞が前にない場合は落とす', () => {
  assert.notDeepEqual(
    buildSentenceStructure('We learned that.', '[S We] [V learned] [O this].').errors,
    [],
  )
  assert.notDeepEqual(
    buildSentenceStructure('We learned that.', '[S We] learned [O that].').errors,
    [],
  )
  assert.notDeepEqual(
    buildSentenceStructure(
      'They saw a dog that ran.',
      '[S They] [V saw] [O a dog {関係>a cat| [S that] [V ran]}].',
    ).errors,
    [],
  )
})
