import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ETYMOLOGY_PACKS,
  getRoot,
  getWord,
} from '../src/data/vocab.js'
import {
  buildAllEtymologyQuizQuestions,
  buildEtymologyQuizQuestion,
} from '../src/lib/etymologyQuiz.js'
import { etymologyMeaningGuideFor } from '../src/lib/etymologyMeaning.js'

const byPack = new Map(ETYMOLOGY_PACKS.map((pack) => [pack.id, pack]))

test('全2,772語源カードを意味の正誤を問う2択にできる', () => {
  const questions = buildAllEtymologyQuizQuestions()
  assert.equal(questions.length, ETYMOLOGY_PACKS.length)
  assert.equal(questions.length, 2772)
  assert.equal(new Set(questions.map((question) => question.packId)).size, questions.length)

  for (const question of questions) {
    const pack = byPack.get(question.packId)
    assert.ok(pack, question.packId)
    assert.equal(question.mode, pack.mode)
    assert.ok(pack.studyIds.includes(question.targetWordId), `${pack.id}: 対象英単語`)
    assert.equal(question.knowledge.prompt, 'この「語の形と意味のつながり」は正しい？')
    assert.ok(question.knowledge.statement, `${pack.id}: 判定する文`)
    assert.ok(question.knowledge.correctLabel, `${pack.id}: 正しい形と意味`)
    assert.deepEqual(
      question.knowledge.options,
      [
        { id: 'correct', label: '正しい' },
        { id: 'incorrect', label: '正しくない' },
      ],
      `${pack.id}: 2択`,
    )
    assert.equal(
      question.knowledge.answerId,
      question.knowledge.statementIsCorrect ? 'correct' : 'incorrect',
      `${pack.id}: 正誤の答え`,
    )
    if (question.knowledge.statementIsCorrect) {
      assert.equal(question.knowledge.statement, question.knowledge.correctLabel, pack.id)
    } else {
      assert.notEqual(question.knowledge.statement, question.knowledge.correctLabel, pack.id)
    }
    assert.equal('word' in question, false, `${pack.id}: 英単語3択を重ねない`)
  }

  const correctClaims = questions.filter((question) => question.knowledge.statementIsCorrect).length
  assert.ok(correctClaims >= 1300 && correctClaims <= 1450, `正しい文と誤った文をほぼ半数ずつ出す: ${correctClaims}`)
})

test('4つの学び方はすべて形と意味のつながりを正解にする', () => {
  for (const pack of ETYMOLOGY_PACKS) {
    const guide = etymologyMeaningGuideFor(pack)
    assert.ok(guide.headword, pack.id)
    assert.ok(guide.meaning, pack.id)
    assert.match(guide.statement, /→/, pack.id)

    if (pack.mode === 'formula') {
      const word = getWord(guide.targetWordId)
      for (const part of word.etymology.parts) {
        assert.match(guide.statement, new RegExp(`${part.t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}（`), pack.id)
      }
    } else if (pack.mode === 'root') {
      const root = getRoot(pack.rootId)
      assert.ok(guide.statement.includes(`${root.form}（${root.meaning}）`), pack.id)
    } else if (pack.mode === 'family') {
      const anchor = getWord(pack.anchorId) ?? getWord(pack.studyIds[0])
      assert.ok(guide.statement.includes(`${anchor.word}（`), pack.id)
      assert.ok(guide.statement.includes(`${guide.headword}（${guide.meaning}）`), pack.id)
    }
  }
})

test('bicycle は由来言語ではなく bi と kyklos の意味を確認する', () => {
  const pack = ETYMOLOGY_PACKS.find((item) => item.studyIds.includes('bicycle'))
  const guide = etymologyMeaningGuideFor(pack)
  const question = buildEtymologyQuizQuestion(pack)

  assert.equal(
    guide.statement,
    'bi（2つ） ＋ kyklos（輪） → 2つの輪 → 自転車',
  )
  assert.equal(question.knowledge.correctLabel, guide.statement)
  assert.doesNotMatch(`${question.knowledge.prompt}\n${question.knowledge.correctLabel}`, /ギリシャ|何語|どの言語|もとの言語/)
})

test('同じ語源カードは再現可能な問題を返す', () => {
  for (const pack of ETYMOLOGY_PACKS.slice(0, 100)) {
    assert.deepEqual(
      buildEtymologyQuizQuestion(pack),
      buildEtymologyQuizQuestion(pack),
      pack.id,
    )
  }
})

test('語源確認画面は語源SRSだけを採点し、理解してから2択で確認する', () => {
  const source = readFileSync(new URL('../src/screens/EtymologyQuiz.jsx', import.meta.url), 'utf8')
  assert.match(source, /reviewEtymology\(/)
  assert.doesNotMatch(source, /reviewWord\(|UNKNOWN_CHOICE_ID|UnknownChoiceButton/)
  assert.match(source, /data-etymology-quiz/)
  assert.match(source, /data-etymology-learning-preview/)
  assert.match(source, /<EtymologyKnowledgeAnswer pack=\{pack\} words=\{words\} \/>/)
  assert.match(source, /2択で確認する/)
  assert.match(source, /正しい形と意味/)
  assert.match(source, /意味の違いを見抜けました/)
  assert.match(source, /英単語の暗記記録とは分けて/)
  assert.doesNotMatch(source, /1\/2|2\/2|語源と英単語|もとの言語|どの言語/)
})
