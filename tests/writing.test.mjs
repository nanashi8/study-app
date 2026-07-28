import test from 'node:test'
import assert from 'node:assert/strict'

import {
  WRITING_EXERCISES,
  WRITING_GRAMMAR,
  WRITING_GRAMMAR_BY_ID,
  WRITING_LEVEL_ORDER,
  WRITING_LEVEL_PROFILES,
  writingExercisesByLevel,
} from '../src/data/writing.js'
import { getWord } from '../src/data/vocab.js'
import {
  buildWritingTokenText,
  buildWritingText,
  isWritingTokenOrderCorrect,
  recommendedWritingTrail,
  selectedWritingGrammarIds,
  selectedWritingWordIds,
  shuffledWritingTokens,
  writingTokenPositionResults,
  writingCompletion,
  writingWordTokens,
  writingWordCount,
} from '../src/lib/writing.js'
import {
  decodeProgress,
  encodeProgress,
  summarizePayload,
} from '../src/lib/progressCode.js'

test('英作文は全7級に2ジャンルずつあり、級別の作文能力を段階化する', () => {
  assert.equal(WRITING_EXERCISES.length, 14)
  for (const level of WRITING_LEVEL_ORDER) {
    const profile = WRITING_LEVEL_PROFILES[level]
    const exercises = writingExercisesByLevel(level)
    assert.ok(profile?.goal && profile?.target, level)
    assert.equal(exercises.length, 2, level)
    assert.ok(
      exercises.every(
        (exercise) =>
          exercise.genre &&
          exercise.scene &&
          exercise.task &&
          exercise.rubric.length >= 3,
      ),
      level,
    )
  }
})

test('全英作文ルートの選択肢は文法解説と解決可能なマイ単語候補を持つ', () => {
  const exerciseIds = new Set()
  for (const exercise of WRITING_EXERCISES) {
    assert.ok(!exerciseIds.has(exercise.id), exercise.id)
    exerciseIds.add(exercise.id)
    assert.ok(exercise.steps.length >= 5, exercise.id)

    const stepIds = new Set()
    for (const step of exercise.steps) {
      assert.ok(!stepIds.has(step.id), `${exercise.id}/${step.id}`)
      stepIds.add(step.id)
      assert.ok(step.prompt && step.constraint && step.guide, `${exercise.id}/${step.id}`)
      assert.ok(step.options.length >= 3, `${exercise.id}/${step.id}`)
      assert.equal(
        step.options.filter((option) => option.recommended).length,
        1,
        `${exercise.id}/${step.id}: recommended`,
      )

      const optionIds = new Set()
      for (const option of step.options) {
        assert.ok(!optionIds.has(option.id), `${exercise.id}/${step.id}/${option.id}`)
        optionIds.add(option.id)
        assert.ok(option.text && option.ja && option.tip, `${exercise.id}/${step.id}/${option.id}`)
        assert.ok(
          WRITING_GRAMMAR_BY_ID[option.grammarId],
          `${exercise.id}/${step.id}/${option.id}: ${option.grammarId}`,
        )
        for (const wordId of option.wordIds) {
          assert.ok(getWord(wordId), `${exercise.id}/${step.id}/${option.id}: ${wordId}`)
        }
      }
    }
  }
})

test('おすすめルートは全文を完成し、各級の練習語数に収まる', () => {
  for (const exercise of WRITING_EXERCISES) {
    const trail = recommendedWritingTrail(exercise)
    const result = writingCompletion(exercise, trail)
    const [minimum, maximum] = WRITING_LEVEL_PROFILES[exercise.level].wordRange
    assert.equal(result.complete, true, exercise.id)
    assert.equal(result.completedSteps, exercise.steps.length, exercise.id)
    assert.ok(
      result.wordCount >= minimum && result.wordCount <= maximum,
      `${exercise.id}: ${result.wordCount} words`,
    )
    assert.ok(result.grammarIds.length >= 3, exercise.id)
    assert.ok(result.wordIds.length >= 2, exercise.id)
    assert.ok(result.checks.every((item) => item.met), exercise.id)
  }
})

test('英文の連結は句読点前の空白を除き、選択語・文法を重複なく集計する', () => {
  const exercise = WRITING_EXERCISES[0]
  const trail = recommendedWritingTrail(exercise)
  const text = buildWritingText(exercise, trail)
  assert.ok(!/\s+[,.;:!?]/.test(text))
  assert.equal(writingWordCount(text), writingCompletion(exercise, trail).wordCount)

  const wordIds = selectedWritingWordIds(exercise, trail)
  const grammarIds = selectedWritingGrammarIds(exercise, trail)
  assert.equal(new Set(wordIds).size, wordIds.length)
  assert.equal(new Set(grammarIds).size, grammarIds.length)
})

test('英作文の一文を単語カードへ分け、並び替えた語順を判定できる', () => {
  const text = 'Last Sunday, I went to the park with my family.'
  const ordered = writingWordTokens(text)
  const shuffled = shuffledWritingTokens(text, 'writing-test')

  assert.equal(buildWritingTokenText(ordered), text)
  assert.deepEqual(
    shuffled.map((token) => token.word).sort(),
    ordered.map((token) => token.word).sort(),
  )
  assert.equal(
    shuffled.every((token, index) => token.originalIndex === index),
    false,
  )
  assert.equal(isWritingTokenOrderCorrect(shuffled, text), false)
  assert.equal(isWritingTokenOrderCorrect(ordered, text), true)
})

test('英作文の語カードは置いた位置ごとに正誤を即時判定する', () => {
  const text = 'Last Sunday, I went to the park with my family.'
  const ordered = writingWordTokens(text)

  assert.deepEqual(
    writingTokenPositionResults([ordered[0], ordered[2]], text),
    [true, false],
  )
  assert.deepEqual(
    writingTokenPositionResults(ordered.slice(0, 4), text),
    [true, true, true, true],
  )
})

test('全英作文選択肢の語カードを位置ごとに判定できる', () => {
  let optionCount = 0
  let tokenCount = 0

  for (const exercise of WRITING_EXERCISES) {
    for (const step of exercise.steps) {
      for (const option of step.options) {
        const tokens = writingWordTokens(option.text)
        const results = writingTokenPositionResults(tokens, option.text)
        optionCount += 1
        tokenCount += tokens.length

        assert.ok(tokens.length > 0, `${exercise.id}/${step.id}/${option.id}`)
        assert.ok(
          results.every(Boolean),
          `${exercise.id}/${step.id}/${option.id}`,
        )
      }
    }
  }

  assert.ok(optionCount > 0)
  assert.ok(tokenCount > optionCount)
})

test('同じseedの語カードは同じ順序になり、重複語も失わない', () => {
  const text = 'I think I can do it.'
  const first = shuffledWritingTokens(text, 'same-seed')
  const second = shuffledWritingTokens(text, 'same-seed')
  const ordered = writingWordTokens(text)

  assert.deepEqual(first, second)
  assert.equal(first.filter((token) => token.word === 'I').length, 2)
  assert.equal(new Set(first.map((token) => token.id)).size, first.length)
  assert.deepEqual(
    writingTokenPositionResults(
      [ordered[2], ordered[1], ordered[0], ...ordered.slice(3)],
      text,
    ),
    [true, true, true, true, true, true],
  )
})

test('全マイ文法カードは一意で、解説・型・例文を備える', () => {
  assert.equal(
    new Set(WRITING_GRAMMAR.map((item) => item.id)).size,
    WRITING_GRAMMAR.length,
  )
  for (const item of WRITING_GRAMMAR) {
    assert.ok(item.title && item.pattern && item.explanation, item.id)
    assert.ok(item.example?.en && item.example?.ja, item.id)
  }

  const used = new Set(
    WRITING_EXERCISES.flatMap((exercise) =>
      exercise.steps.flatMap((step) =>
        step.options.map((option) => option.grammarId),
      ),
    ),
  )
  for (const item of WRITING_GRAMMAR) {
    assert.ok(used.has(item.id), `${item.id}: unused`)
  }
})

test('進捗コードはマイ文法と級別英作文履歴を保持する', () => {
  const state = {
    srs: {},
    kotenSrs: {},
    kotenInterpretationSrs: {},
    myList: ['student'],
    myGrammarList: ['wg_be_intro'],
    writingProgress: {
      wr_5_self_intro: {
        completed: 2,
        lastText: 'I am a student.',
        lastMode: 'guide',
        lastDay: 1,
        bestWords: 5,
        grammarIds: ['wg_be_intro'],
      },
    },
    kotenWordList: [],
    kotenGrammarList: [],
    readingsDone: [],
    mathDone: [],
    mathMastery: {},
    skillStats: {},
    diagnosticHistory: [],
    engPos: null,
    portalOrder: [],
    portalHidden: [],
    stats: {},
    settings: {},
  }
  const restored = decodeProgress(encodeProgress(state))
  assert.deepEqual(restored.myGrammarList, ['wg_be_intro'])
  assert.equal(restored.writingProgress.wr_5_self_intro.completed, 2)
  assert.equal(summarizePayload(restored).myGrammar, 1)
  assert.equal(summarizePayload(restored).writing, 1)
  assert.throws(
    () => decodeProgress(encodeProgress({ ...state, writingProgress: [] })),
    /writingProgress/,
  )
  assert.throws(
    () => decodeProgress(encodeProgress({ ...state, myGrammarList: {} })),
    /myGrammarList/,
  )
})
