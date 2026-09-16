import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_PASSAGES } from '../src/data/passages.js'
import { READING_CHOICE_NOTES } from '../src/data/reading-choice-notes.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import { readingChoiceNoteFor, readingQuestionKey } from '../src/lib/readingChoiceNotes.js'
import { auditReadingTranslations } from '../src/lib/reading-translation-audit.js'

test('全38長文・990文・167問・668選択肢の和訳解説に欠落と対応ずれがない', () => {
  const audit = auditReadingTranslations()

  assert.equal(audit.passageCount, 38)
  assert.equal(audit.sentenceCount, 990)
  assert.equal(audit.sentenceTranslationCount, 990)
  assert.equal(audit.questionCount, 167)
  assert.equal(audit.questionTranslationCount, 167)
  assert.equal(audit.evidenceExplanationCount, 167)
  assert.equal(audit.choiceCount, 668)
  assert.equal(audit.choiceTranslationCount, 668)
  assert.equal(audit.choiceExplanationCount, 668)
  assert.deepEqual(audit.issues, [])
  assert.equal(audit.complete, true)
})

// 答え合わせでは、正解・誤答・わからないのどれを選んでも、根拠の解説と出題した選択肢すべての説明を出す。
// 説明はその設問のために書いたもので、本文の何文目と合う（合わない）かを示す。
test('長文42本・183問の732選択肢すべてに、選択肢ごとにちがう、本文の箇所を示した説明がある', () => {
  let questions = 0
  let choices = 0
  const keys = new Set()

  for (const passage of ALL_PASSAGES) {
    getReadingQuestions(passage.id).forEach((question, questionIndex) => {
      const key = readingQuestionKey(passage.id, questionIndex)
      keys.add(key)
      assert.ok(question.explain?.trim(), `${key}: 根拠の解説`)
      assert.ok(question.questionJa?.trim(), `${key}: 設問の和訳`)
      const notes = question.choices.map((choice) => readingChoiceNoteFor(passage.id, questionIndex, choice))
      assert.equal(new Set(notes).size, notes.length, `${key}: 選択肢の説明が重複しています`)
      question.choices.forEach((choice, index) => {
        const label = `${key}: ${choice}`
        assert.ok(question.choiceTranslations?.[choice]?.trim(), `${label} の和訳がありません`)
        assert.ok(notes[index].length >= 15, `${label} の説明がありません`)
        assert.match(notes[index], /[ぁ-んァ-ヶ一-龠]/u, label)
        assert.doesNotMatch(notes[index], /\bundefined\b|\bNaN\b/, label)
        // どの文と合う（合わない）かを示す（第3文・第12・13文・第8〜11文、長い長文は節の名前つき）。
        assert.match(notes[index], /第\d+(?:[・〜]\d+)*文/u, `${label} の説明が本文の箇所を示していません`)
        choices += 1
      })
      questions += 1
    })
  }

  // 問題や選択肢を直したのに、説明だけが古いまま残らないようにする。
  for (const [key, notesByChoice] of Object.entries(READING_CHOICE_NOTES)) {
    assert.ok(keys.has(key), `${key} は存在しない設問の説明です`)
    const [passageId, number] = [key.slice(0, key.lastIndexOf('#')), Number(key.slice(key.lastIndexOf('#') + 1))]
    const question = getReadingQuestions(passageId)[number - 1]
    for (const choice of Object.keys(notesByChoice)) {
      assert.ok(question.choices.includes(choice), `${key}「${choice}」は選択肢にありません`)
    }
  }

  assert.equal(questions, 183)
  assert.equal(choices, 732)
})

test('正解の説明は本文と合う理由を、誤答の説明は合わない理由を書き、取り違えやすい設問は決め手を示す', () => {
  const cases = [
    ['p_5_lost_notebook', 0, 'By bus.', /第2文 She goes to school by bus every morning\./u],
    ['p_5_lost_notebook', 0, 'On foot.', /歩いて通うとは書かれていない/u],
    ['p_2_online_health_claims', 2, 'Tea drinkers may answer every survey incorrectly.', /第14文/u],
    ['p_pre2plus_rural_bus_future', 0, 'New railway lines and cheaper private cars.', /第2文[\s\S]*第4文/u],
    ['p_ext_4000_generational_city', 1, 'A system that makes the desired action easiest survives changes in enthusiasm.', /「恐れ・希望・注意」の第15文/u],
  ]
  for (const [passageId, questionIndex, choice, expected] of cases) {
    assert.ok(getReadingQuestions(passageId)[questionIndex].choices.includes(choice), `${passageId}: ${choice}`)
    assert.match(readingChoiceNoteFor(passageId, questionIndex, choice), expected, `${passageId}#${questionIndex + 1}: ${choice}`)
  }
})

test('読解チェック画面は答え合わせ後に、根拠の解説と設問・全選択肢の和訳と説明を接続する', () => {
  const checkSource = readFileSync(
    new URL('../src/components/ReadingComprehensionCheck.jsx', import.meta.url),
    'utf8',
  )
  const choiceSource = readFileSync(
    new URL('../src/components/ReadingChoiceExplanations.jsx', import.meta.url),
    'utf8',
  )

  assert.match(checkSource, /data-reading-explanation/)
  assert.match(checkSource, /<ReadingChoiceExplanations/)
  assert.match(checkSource, /passageId=\{passageId\}/)
  assert.match(checkSource, /questionIndex=\{questionIndex\}/)
  assert.match(checkSource, /selectedChoice=\{answers\[questionIndex\]\}/)
  assert.match(choiceSource, /data-reading-question-translation/)
  assert.match(choiceSource, /data-reading-choice-translation/)
  assert.match(choiceSource, /<ChoiceExplanations/)
  assert.match(choiceSource, /選択肢解説（\$\{question\.choices\.length\}択すべて）/)
  assert.match(choiceSource, /readingChoiceNoteFor\(passageId, questionIndex, choice\)/)
})
