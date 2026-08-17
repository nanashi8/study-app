import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ETYMOLOGY_PACKS,
  etymologyLearningGuideFor,
  getRoot,
  getWord,
} from '../src/data/vocab.js'
import {
  buildAllEtymologyQuizQuestions,
  buildEtymologyQuizQuestion,
} from '../src/lib/etymologyQuiz.js'

const byPack = new Map(ETYMOLOGY_PACKS.map((pack) => [pack.id, pack]))

test('全2,772語源カードに語源問題と関連英単語問題を一組ずつ作れる', () => {
  const questions = buildAllEtymologyQuizQuestions()
  assert.equal(questions.length, ETYMOLOGY_PACKS.length)
  assert.equal(questions.length, 2772)
  assert.equal(new Set(questions.map((question) => question.packId)).size, questions.length)

  for (const question of questions) {
    const pack = byPack.get(question.packId)
    assert.ok(pack, question.packId)
    assert.equal(question.mode, pack.mode)
    assert.ok(question.knowledge.cue, `${pack.id}: 語源の手掛かり`)
    assert.ok(question.knowledge.prompt, `${pack.id}: 語源問題`)
    assert.equal(question.knowledge.options.length, 3, `${pack.id}: 語源3択`)
    assert.equal(
      new Set(question.knowledge.options.map((option) => option.label)).size,
      3,
      `${pack.id}: 語源選択肢の表示重複`,
    )
    assert.ok(
      question.knowledge.options.some((option) => option.id === question.knowledge.answerId),
      `${pack.id}: 語源の正解`,
    )
    const correct = question.knowledge.options.find(
      (option) => option.id === question.knowledge.answerId,
    )
    assert.equal(question.knowledge.correctLabel, correct.label, `${pack.id}: 学習する正解`)

    assert.ok(pack.studyIds.includes(question.word.wordId), `${pack.id}: 関連英単語`)
    assert.equal(question.word.options.length, 3, `${pack.id}: 英単語3択`)
    assert.equal(
      new Set(question.word.options.map((option) => option.label)).size,
      3,
      `${pack.id}: 英単語選択肢の表示重複`,
    )
    assert.ok(
      question.word.options.some((option) => option.id === question.word.answerId),
      `${pack.id}: 英単語の正解`,
    )
  }
})

test('4つの語源分類は、全選択肢を同じ対象の組み合わせにする', () => {
  for (const pack of ETYMOLOGY_PACKS) {
    const question = buildEtymologyQuizQuestion(pack)
    const correct = question.knowledge.options.find(
      (option) => option.id === question.knowledge.answerId,
    )
    assert.ok(correct, pack.id)

    if (pack.mode === 'formula') {
      assert.match(correct.label, /＝.+＋.+＝/, pack.id)
      const word = pack.studyIds
        .map(getWord)
        .find((candidate) => (candidate?.etymology?.parts?.length ?? 0) >= 2)
        ?? getWord(pack.studyIds[0])
      const expectedForms = word.etymology.parts.map((part) => part.t)
      for (const option of question.knowledge.options) {
        const optionForms = option.label
          .split(' ＋ ')
          .map((component) => component.split('＝')[0])
        assert.deepEqual(optionForms, expectedForms, `${pack.id}: 同じ部品の意味を選ぶ`)
      }
    } else if (pack.mode === 'root') {
      const root = getRoot(pack.rootId)
      assert.equal(correct.label, `${root.form} ＝ ${root.meaning}`, pack.id)
      for (const option of question.knowledge.options) {
        assert.ok(option.label.startsWith(`${root.form} ＝ `), `${pack.id}: 同じ語根の意味を選ぶ`)
      }
    } else if (pack.mode === 'family') {
      const anchor = getWord(pack.anchorId) ?? getWord(pack.studyIds[0])
      const member = getWord(pack.studyIds.find((id) => id !== pack.anchorId) ?? pack.studyIds[0])
      assert.ok(pack.studyIds.includes(correct.wordId), pack.id)
      assert.notEqual(correct.wordId, pack.anchorId, pack.id)
      assert.equal(correct.label, `${anchor.word} → ${member.word}`, pack.id)
      for (const option of question.knowledge.options) {
        assert.ok(option.label.startsWith(`${anchor.word} → `), `${pack.id}: 同じ基語の仲間を選ぶ`)
      }
    } else {
      const target = getWord(pack.studyIds[0])
      assert.equal(
        correct.label,
        `${etymologyLearningGuideFor(target).sourceText} → ${target.word}`,
        pack.id,
      )
      for (const option of question.knowledge.options) {
        assert.ok(option.label.endsWith(` → ${target.word}`), `${pack.id}: 同じ単語の由来を選ぶ`)
      }
    }
  }
})

test('同じ語源カードは再現可能な選択肢を返す', () => {
  for (const pack of ETYMOLOGY_PACKS.slice(0, 50)) {
    assert.deepEqual(
      buildEtymologyQuizQuestion(pack),
      buildEtymologyQuizQuestion(pack),
      pack.id,
    )
  }
})

test('語源確認画面は語源SRSと英単語SRSを別々に採点し、答え合わせで関連語を抱き合わせる', () => {
  const source = readFileSync(new URL('../src/screens/EtymologyQuiz.jsx', import.meta.url), 'utf8')
  assert.match(source, /reviewEtymology\(/)
  assert.match(source, /reviewWord\(/)
  assert.match(source, /'vocab'/)
  assert.match(source, /data-etymology-quiz/)
  assert.match(source, /語源と関連英単語をまとめて確認/)
  assert.match(source, /<EtymologyKnowledgeAnswer pack=\{pack\} words=\{words\} \/>/)
  assert.match(source, /語源の結果は語源カードへ、英単語の結果は単語カードへ/)
})

test('語源確認は正しい組み合わせを学び、その後に3択を出す', () => {
  const source = readFileSync(new URL('../src/screens/EtymologyQuiz.jsx', import.meta.url), 'utf8')
  assert.match(source, /const \[studied, setStudied\] = useState\(false\)/)
  assert.match(source, /data-etymology-learning-preview/)
  assert.match(source, /data-etymology-correct-combination/)
  assert.match(source, /question\.knowledge\.correctLabel/)
  assert.match(source, /この正しい組み合わせを覚えてから、3択で確認します/)
  assert.match(source, /この語源を確認する/)
  assert.match(source, /!studied \? \(/)
})
