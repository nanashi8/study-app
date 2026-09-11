// 前へ戻った答え済みの問題を選び直したとき、最初の答えを置き換えて二重に数えないことの回帰テスト。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS } from '../src/data/vocab.js'
import { KOTEN_WORDS } from '../src/data/koten.js'
import {
  createLearningAnalytics,
  recordLearningEvent,
  reviseLearningEventCorrect,
} from '../src/lib/learningAnalytics.js'
import { reviseQuizTally, reviseStudyAnswer } from '../src/lib/session.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const QUIZ_SCREENS = [
  'src/screens/VocabQuiz.jsx',
  'src/screens/PhraseQuiz.jsx',
  'src/screens/GrammarQuiz.jsx',
  'src/screens/ListeningQuiz.jsx',
  'src/screens/EtymologyQuiz.jsx',
  'src/screens/KotenQuiz.jsx',
  'src/screens/KotenGrammarQuiz.jsx',
  'src/screens/KotenCultureQuiz.jsx',
  'src/screens/KotenInterpretationQuiz.jsx',
  'src/screens/KanbunQuiz.jsx',
]
const REDO_SCREENS = ['src/screens/DictationPlay.jsx', 'src/screens/KanbunKundokuQuiz.jsx']
const STUDY_SCREENS = [
  'src/screens/VocabStudy.jsx',
  'src/screens/PhraseStudy.jsx',
  'src/screens/EtymologyStudy.jsx',
  'src/screens/KotenStudy.jsx',
  'src/screens/KotenGrammarStudy.jsx',
  'src/screens/KotenCultureStudy.jsx',
  'src/screens/KanbunStudy.jsx',
  'src/screens/WritingGrammarReview.jsx',
]

function withStore(run) {
  const original = useStore.getState()
  const originalNow = Date.now
  try {
    let now = new Date(2026, 8, 12, 10, 0, 0, 0).getTime()
    Date.now = () => now
    useStore.setState({
      srs: {},
      kotenSrs: {},
      kanbunVocabSrs: {},
      stats: { ...original.stats, answered: 0, correct: 0, todayCount: 0 },
      learningAnalytics: createLearningAnalytics(),
    })
    run(() => {
      now += 60_000
    })
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
}

test('テストの答えを選び直すと、記録・正解数・学習分析の正解数を最初の答えから入れ替え、回答数は増やさない', () => {
  withStore((later) => {
    const word = ALL_WORDS[0]
    const store = () => useStore.getState()
    let receipt = store().review(word.id, 'wrong', 'vocab')
    assert.equal(receipt.result, 'wrong')
    assert.equal(receipt.before, undefined)
    const afterFirst = store()
    assert.equal(afterFirst.stats.answered, 1)
    assert.equal(afterFirst.stats.correct, 0)

    later()
    receipt = store().reviseReview(receipt, 'correct')
    const revised = store()
    const entry = revised.srs[word.id]
    assert.equal(entry.test.attempts, 1, 'テストの回数を二重に数えない')
    assert.equal(entry.test.correct, 1)
    assert.equal(entry.test.wrong, 0)
    assert.equal(entry.correct, 1)
    assert.equal(entry.wrong, 0)
    assert.equal(entry.test.lastResult, 'correct')
    assert.equal(revised.stats.answered, 1)
    assert.equal(revised.stats.correct, 1)
    assert.equal(revised.learningAnalytics.inputs, 1)
    assert.equal(revised.learningAnalytics.scored, 1)
    assert.equal(revised.learningAnalytics.correct, 1)
    assert.equal(revised.learningAnalytics.skills.vocab.correct, 1)
    assert.equal(revised.learningAnalytics.modes.test.correct, 1)

    // 同じ答えを押し直しても何も変えない。
    assert.equal(store().reviseReview(receipt, 'correct'), receipt)
    // もう一度「わからない」へ選び直すと、正解の分をまた外す。
    receipt = store().reviseReview(receipt, 'unknown')
    assert.equal(store().srs[word.id].test.unknown, 1)
    assert.equal(store().srs[word.id].test.attempts, 1)
    assert.equal(store().stats.correct, 0)
    assert.equal(store().learningAnalytics.correct, 0)
    assert.equal(store().learningAnalytics.inputs, 1)
  })
})

test('暗記の「まだ」を「覚えた」に選び直すと、暗記の回数を増やさずに入れ替える（別の記録領域でも同じ）', () => {
  withStore((later) => {
    const store = () => useStore.getState()
    const before = { box: 2, correct: 3, wrong: 1, due: 1, last: 1, lastAt: 1, memory: { passes: 2, remembered: 2, forgot: 0, lastJudgment: 'remembered', lastAt: 1, marks: [1, 1] } }
    const koten = KOTEN_WORDS[0]
    useStore.setState({ kotenSrs: { [koten.id]: before } })
    let receipt = store().reviewKoten(koten.id, 'forgot')
    assert.equal(receipt.field, 'kotenSrs')
    assert.deepEqual(receipt.before, before)
    later()
    receipt = store().reviseReview(receipt, 'remembered')
    const entry = store().kotenSrs[koten.id]
    assert.equal(entry.memory.passes, 3)
    assert.equal(entry.memory.remembered, 3)
    assert.equal(entry.memory.forgot, 0)
    assert.equal(entry.correct, 4)
    assert.equal(entry.wrong, 1)
    assert.equal(store().stats.answered, 1)
    assert.equal(store().stats.correct, 1)
    assert.equal(store().learningAnalytics.skills.koten.correct, 1)

    const kanbun = store().reviewKanbun('vocab', 'kv001', 'wrong')
    assert.equal(kanbun.field, 'kanbunVocabSrs')
    store().reviseReview(kanbun, 'correct')
    assert.equal(store().kanbunVocabSrs.kv001.test.attempts, 1)
    assert.equal(store().kanbunVocabSrs.kv001.test.correct, 1)
  })
})

test('選び直しは、最初に答えた時間帯・学習日・間隔の集計の正解数だけを動かす', () => {
  const at = new Date(2026, 8, 12, 7, 30).getTime()
  const event = { skill: 'grammar', activity: 'test', inputs: 1, scored: 1, correct: 0, gapHours: 30, memoryHour: 21, memoryPasses: 2 }
  const recorded = recordLearningEvent(createLearningAnalytics(), event, at)
  const revised = reviseLearningEventCorrect(recorded, event, 1, at)
  assert.equal(revised.correct, 1)
  assert.equal(revised.inputs, 1)
  assert.equal(revised.hours[7].correct, 1)
  assert.equal(revised.hours[7].inputs, 1)
  assert.equal(revised.days['2026-09-12'].correct, 1)
  assert.equal(revised.skills.grammar.correct, 1)
  assert.equal(revised.modes.test.hours[7].correct, 1)
  assert.equal(revised.intervals.under3d.correct, 1)
  assert.equal(revised.memoryCohorts.hours[21].correct, 1)
  assert.equal(revised.memoryCohorts.passes['2'].correct, 1)
  // 正解数は回答数を超えず、0 を下回らない。
  assert.equal(reviseLearningEventCorrect(revised, event, 1, at).correct, 1)
  assert.equal(reviseLearningEventCorrect(recorded, event, -1, at).correct, 0)
})

test('画面の集計も、その1問・1枚の分だけを入れ替える', () => {
  const study = reviseStudyAnswer({ remembered: 2, forgot: 1, forgotIds: ['a', 'b'] }, 'b', false, true)
  assert.deepEqual(study, { remembered: 3, forgot: 0, forgotIds: ['a'] })
  assert.deepEqual(reviseStudyAnswer(study, 'c', true, false), { remembered: 2, forgot: 1, forgotIds: ['a', 'c'] })

  const quiz = { correct: 1, wrong: 1, unknown: 1, wrongIds: ['x', 'y'], answerLog: ['wrong', 'correct', 'unknown'] }
  reviseQuizTally(quiz, 'x', 'wrong', 'correct', 0)
  assert.deepEqual(quiz, { correct: 2, wrong: 0, unknown: 1, wrongIds: ['y'], answerLog: ['correct', 'correct', 'unknown'] })
  reviseQuizTally(quiz, 'y', 'unknown', 'wrong', 2)
  assert.deepEqual(quiz, { correct: 2, wrong: 1, unknown: 0, wrongIds: ['y'], answerLog: ['correct', 'correct', 'wrong'] })
})

test('答え済みの問題へ前へ戻ったときだけ、どの画面でも答えを選び直せる（その場で答えた直後は確定のまま）', () => {
  const controls = read('src/components/QuestionSessionControls.jsx')
  assert.match(controls, /export function useRevisitedAnswer\(index, answered\)/)
  assert.match(controls, /export function useAnswerReceipts\(initial = null\)/)
  assert.match(controls, /答えた問題です。別の答えを押すと、答えと記録を入れ替えます。/)

  for (const path of [...QUIZ_SCREENS, ...REDO_SCREENS, ...STUDY_SCREENS]) {
    const source = read(path)
    assert.match(source, /useRevisitedAnswer\((?:i|index), /, `${path}: 戻ってきた問題を見分けていない`)
    assert.match(source, /reviseReview\(receipts\.get\((?:i|index)\), /, `${path}: 最初の答えを置き換えていない`)
    assert.match(source, /receipts\.clear\(\)/, `${path}: 並びを組み直したときに控えを捨てていない`)
  }
  // 答えを受け付ける関数の先頭で、答えた問題を一律に固定する書き方を残さない。
  // （並べ直す画面は、並べ直しを始めた時点で答えを空に戻すので対象外）
  for (const path of [...QUIZ_SCREENS, ...STUDY_SCREENS]) {
    const handler = /const (?:choose|answer) = \([^)]*\) => \{\n\s*([^\n]+)\n/.exec(read(path))
    assert.ok(handler, `${path}: 答えを受け付ける関数が見つからない`)
    assert.doesNotMatch(
      handler[1],
      /^if \((?:answered|recordedAnswer !== null|selected !== null(?: \|\| !primary)?)\) return$/,
      `${path}: 答えた問題を選び直せない`,
    )
  }
  for (const path of QUIZ_SCREENS) {
    const source = read(path)
    assert.match(source, /disabled=\{answered && !reselectable\}/, `${path}: 戻ってきた問題の選択肢を押せない`)
    assert.match(source, /<ReselectNote/, `${path}: 選び直せることを示していない`)
    assert.doesNotMatch(source, /disabled=\{answered\}\n\s*onClick=\{\(\) => choose/, `${path}: 選択肢を固定したまま`)
  }
  for (const path of STUDY_SCREENS) {
    assert.match(read(path), /<StudyAnswerReselect/, `${path}: 戻ってきたカードで選び直せない`)
  }
  assert.match(read('src/screens/GrammarQuiz.jsx'), /data-word-order-rearrange/)
  assert.match(read('src/screens/DictationPlay.jsx'), /data-dictation-redo/)
  assert.match(read('src/screens/KanbunKundokuQuiz.jsx'), /data-kundoku-redo/)
})
