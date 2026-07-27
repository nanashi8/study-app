import test from 'node:test'
import assert from 'node:assert/strict'

import { PASSAGES } from '../src/data/passages.js'
import { READING_LEVELS } from '../src/data/levels.js'
import {
  READING_WORD_COUNT_TARGETS,
  getReadingStudy,
  passageWordCount,
} from '../src/data/reading-study.js'
import {
  READING_QUESTION_COUNTS,
  getReadingQuestions,
} from '../src/data/reading-questions.js'
import { getWord } from '../src/data/vocab.js'
import {
  analyzePassageParagraphs,
  analyzeReadingSentence,
} from '../src/lib/reading-grammar.js'

const EXPECTED_LEVELS = ['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1']

test('長文は全8区分を順番どおりに収録する', () => {
  assert.deepEqual(READING_LEVELS.map((level) => level.id), EXPECTED_LEVELS)
  assert.deepEqual(PASSAGES.map((passage) => passage.level), EXPECTED_LEVELS)
})

test('各長文は級別の上限対策語数と段落構成を満たす', () => {
  for (const passage of PASSAGES) {
    const target = READING_WORD_COUNT_TARGETS[passage.level]
    const count = passageWordCount(passage)
    assert.ok(target, `${passage.level}: 語数目標が必要`)
    assert.ok(
      count >= target.min && count <= target.max,
      `${passage.id}: ${count}語は${target.min}-${target.max}語の範囲外`,
    )
    assert.ok(
      passage.sentences.filter((sentence) => sentence.paragraphStart).length >= 2,
      `${passage.id}: 段落が不足`,
    )
  }
})

test('事前学習語彙は共通辞書で解決し、表現カードを備える', () => {
  for (const passage of PASSAGES) {
    for (const id of passage.vocab) {
      assert.ok(getWord(id), `${passage.id}: ${id} が共通辞書にない`)
    }
    const study = getReadingStudy(passage)
    assert.ok(study.words.length >= 10, `${passage.id}: 重要語が不足`)
    assert.ok(study.phrases.length >= 4, `${passage.id}: 熟語・表現が不足`)
    assert.equal(
      new Set([...study.words, ...study.phrases].map((item) => item.id)).size,
      study.words.length + study.phrases.length,
      `${passage.id}: 事前学習IDが重複`,
    )
  }
})

test('級別の読解設問数と正解データが本文ごとに揃う', () => {
  for (const passage of PASSAGES) {
    const questions = getReadingQuestions(passage.id)
    assert.equal(
      questions.length,
      READING_QUESTION_COUNTS[passage.level],
      `${passage.id}: 設問数が不正`,
    )
    for (const question of questions) {
      assert.equal(question.choices.length, 4, `${passage.id}: 選択肢は4件必要`)
      assert.ok(question.choices.includes(question.answer), `${passage.id}: 正解が選択肢にない`)
      assert.ok(question.explain, `${passage.id}: 解説がない`)
    }
  }
})

test('全長文の各文に節・句・SVOCM解説と英日ブロックを生成できる', () => {
  const englishWords = (text) => text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []

  for (const passage of PASSAGES) {
    let wrappedBlocks = 0
    for (const sentence of passage.sentences) {
      const analysis = analyzeReadingSentence(sentence)
      assert.ok(analysis.blocks.length > 0, `${passage.id}: 構文ブロックなし`)
      assert.ok(analysis.pattern, `${passage.id}: 文型記号なし`)
      assert.ok(
        ['SV', 'SVC', 'SVO', 'SVOO', 'SVOC'].includes(analysis.mainPattern),
        `${passage.id}: 主節の5文型が不正 (${analysis.mainPattern})`,
      )
      assert.deepEqual(
        englishWords(analysis.blocks.map((block) => block.en).join(' ')),
        englishWords(sentence.en),
        `${passage.id}: 構文分割で英文が欠落`,
      )
      for (const block of analysis.blocks) {
        assert.ok(block.en && block.ja && block.note, `${passage.id}: ブロック解説不足`)
        assert.ok(block.svoc.parts.length > 0, `${passage.id}: SVOCM要素なし`)
        if (block.kind === 'clause') {
          assert.ok(block.displayEn.startsWith('('), `${passage.id}: 節の括弧なし`)
          wrappedBlocks++
        }
        if (block.kind === 'phrase') {
          assert.ok(block.displayEn.startsWith('<'), `${passage.id}: 句の山括弧なし`)
          wrappedBlocks++
        }
      }
    }
    assert.ok(wrappedBlocks > 0, `${passage.id}: 節・句が一つも抽出されない`)
  }
})

test('名詞節・補語節・副詞節を文中の働きに応じて区別する', () => {
  const findSentence = (fragment) =>
    PASSAGES.flatMap((passage) => passage.sentences)
      .find((sentence) => sentence.en.includes(fragment))

  const reason = analyzeReadingSentence(findSentence('One reason is that'))
  assert.ok(reason.blocks.some((block) => block.kind === 'clause' && block.role === 'C'))

  const assumption = analyzeReadingSentence(findSentence('Societies often assume that'))
  assert.ok(assumption.blocks.some((block) => block.kind === 'clause' && block.role === 'O'))

  const because = analyzeReadingSentence(findSentence('Because buying a new item'))
  assert.equal(because.blocks[0].kind, 'clause')
  assert.equal(because.blocks[0].role, 'M')
})

test('パラグラフ解説は段落数と一致し、役割・要旨・接続・読み方を備える', () => {
  for (const passage of PASSAGES) {
    const guides = analyzePassageParagraphs(passage)
    assert.equal(
      guides.length,
      passage.sentences.filter((sentence) => sentence.paragraphStart).length,
      passage.id,
    )
    for (const guide of guides) {
      assert.ok(guide.role && guide.summary && guide.connection && guide.strategy, passage.id)
    }
  }
})
