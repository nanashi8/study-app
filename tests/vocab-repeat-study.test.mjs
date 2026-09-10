import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { LEARNING_FIELD_TOC } from '../src/data/decks.js'
import {
  buildDeck,
  vocabularyStockCount,
  wordProgress,
  wordsForSource,
} from '../src/lib/session.js'
import { vocabularySessionContinuation } from '../src/lib/vocabSessionProgress.js'
import { todayIndex, useStore } from '../src/store/useStore.js'

const idsOf = (items) => items.map((item) => item.id)

// 1回10枚で数回まわすと、同じ日のうちに今日の候補を学び終える小さめの級別分野。
function smallChapter() {
  for (const level of LEARNING_FIELD_TOC) {
    for (const chapter of level.chapters) {
      const source = { type: 'levelField', levelId: level.level.id, field: chapter.fieldId }
      const count = wordsForSource(source).length
      if (count >= 14 && count <= 30) {
        return { source, count, label: `英検${level.level.label}・${chapter.field}` }
      }
    }
  }
  throw new Error('監査に使う14〜30語の級別分野が見つからない')
}

test('今日の候補を学び終えても、暗記は「次回待ち」で止まらず同じ教材をくり返せる', () => {
  const original = useStore.getState()
  const originalNow = Date.now
  const now = new Date(2026, 8, 10, 9, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const { source, count, label } = smallChapter()
  const words = wordsForSource(source)

  try {
    Date.now = () => now
    useStore.setState({ srs: {} })

    // 級・分野カードの「暗記」から、同じ日に10枚ずつ何度も学ぶ。1枚おきに
    // 「まだ」と答えるので、覚えた語と今日「まだ」と答えた語が混ざっていく。
    const rounds = Math.ceil(count / 10) + 3
    let roundWithoutCandidates = null
    for (let round = 1; round <= rounds; round++) {
      const srs = useStore.getState().srs
      if (roundWithoutCandidates === null && wordProgress(words, srs).ready === 0) {
        roundWithoutCandidates = round
      }
      const deck = buildDeck(source, { srs, size: 10, purpose: 'study', now, day })
      assert.equal(deck.length, 10, `${label}・${round}回目も10枚そろう`)
      assert.equal(new Set(idsOf(deck)).size, 10, `${label}・${round}回目に同じ語を重ねない`)
      deck.forEach((word, index) => {
        useStore.getState().review(word.id, index % 2 ? 'forgot' : 'remembered', 'vocab')
      })
    }
    // 途中で今日の候補（未学習・復習どき）が尽きる。以前はここで「次回待ち」になっていた。
    assert.ok(roundWithoutCandidates !== null, `${label}は同じ日に今日の候補を学び終える`)

    const srs = useStore.getState().srs
    assert.equal(wordProgress(words, srs).ready, 0)
    // 「1回のカード数」で選べる在庫は、今日「まだ」と答えた語も含めた教材の全語。
    assert.equal(vocabularyStockCount(source, { srs, purpose: 'study', now, day }), count)

    // 続きは、今日「まだ」と答えた語から出す。
    const forgotToday = new Set(words
      .filter((word) => srs[word.id]?.memory?.lastJudgment === 'forgot')
      .map((word) => word.id))
    assert.ok(forgotToday.size > 0)
    const next = buildDeck(source, { srs, size: 10, purpose: 'study', now, day })
    assert.equal(
      next.slice(0, Math.min(10, forgotToday.size)).every((word) => forgotToday.has(word.id)),
      true,
      '「まだ」と答えた語から続けて出す',
    )
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
})

test('今日の候補がない日も、結果画面の「次へ進む」は同じ教材を一巡するまで続く', () => {
  const now = new Date(2026, 8, 10, 9, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const { source, count, label } = smallChapter()
  const words = wordsForSource(source)
  // 全語を今日学んだ状態。半分は「覚えた」（次の復習は明日）、半分は「まだ」。
  const srs = Object.fromEntries(words.map((word, index) => [word.id, index % 2
    ? {
        box: 0, correct: 0, wrong: 1, due: day, last: day, lastAt: now,
        memory: { passes: 1, remembered: 0, forgot: 1, lastAt: now, lastJudgment: 'forgot', marks: [0] },
      }
    : {
        box: 1, correct: 1, wrong: 0, due: day + 1, last: day, lastAt: now,
        memory: { passes: 1, remembered: 1, forgot: 0, lastAt: now, lastJudgment: 'remembered', marks: [1] },
      },
  ]))
  assert.equal(wordProgress(words, srs).ready, 0)

  let cycleIds = []
  let covered = 0
  for (let set = 1; covered < count; set++) {
    assert.ok(set <= count, `${label}が一巡で終わらない`)
    const deck = buildDeck(source, { srs, size: 5, purpose: 'study', cycleIds, now, day })
    assert.equal(deck.length, Math.min(5, count - covered), `${label}・${set}組目が空にならない`)
    const continuation = vocabularySessionContinuation({
      source,
      title: label,
      mode: 'study',
      size: 5,
      returnTo: { screen: 'vocabDecks' },
      vocabSession: { cycleIds, wordIds: idsOf(deck) },
    }, { srs, storedSize: 5, now })
    covered += deck.length
    if (covered < count) {
      const nextCount = Math.min(5, count - covered)
      assert.equal(continuation.exhausted, false, `${label}・残り${count - covered}語へ続く`)
      assert.equal(continuation.nextCount, nextCount)
      assert.equal(continuation.label, `次の${nextCount}語へ`)
    } else {
      assert.equal(continuation.exhausted, true, `${label}を一巡したら終える`)
    }
    cycleIds = continuation.cycleIds
  }
  assert.equal(new Set(cycleIds).size, count, '一巡のあいだ同じ語を重ねない')
})

test('級・10分野・級別分野のカードは、今日の候補がなくても「暗記」を押せる', () => {
  for (const path of [
    'src/screens/VocabLevels.jsx',
    'src/screens/VocabGroups.jsx',
    'src/screens/VocabDecks.jsx',
  ]) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
    assert.doesNotMatch(source, /次回待ち|次の復習日まで待つ/, `${path}: 待たせる表示が残っている`)
    assert.doesNotMatch(source, /studyDisabled=\{!(?:p|progress)\.ready\}/, `${path}: 今日の候補がないと暗記を押せない`)
    assert.match(source, /studyDisabled=\{!(?:p|progress)\.total\}/, `${path}: 語がある限り暗記を押せない`)
    assert.match(source, /今日の分は完了・くり返し練習できます/, `${path}: 今日の分を終えた案内がない`)
    // 読み上げ名は見えている注記と同じ文から作る。「まだ」が残る日に、画面は「復習が必要」、
    // 読み上げは「今日の分は完了」と食い違わせない。
    assert.match(source, /note=\{note\}/, `${path}: 注記を1か所で決めていない`)
    assert.match(source, /studyAriaLabel=\{`[^`]*\$\{note\}`\}/, `${path}: 読み上げ名が注記と食い違いうる`)
  }
})
