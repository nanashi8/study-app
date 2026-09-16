import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { phrasesByLevel } from '../src/data/phrases.js'
import { buildPhraseDeck } from '../src/lib/session.js'
import { phraseSessionContinuation } from '../src/lib/vocabSessionProgress.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const idsOf = (items) => items.map((item) => item.id)

test('熟語・構文のテストは、同じ周回で出し終えた項目を次の回に出し直さない', () => {
  const source = { type: 'phrase', kind: 'idiom', levelId: '5' }
  const first = buildPhraseDeck(source, { size: 5, purpose: 'quiz' })
  assert.equal(first.length, 5)

  const firstIds = new Set(idsOf(first))
  const second = buildPhraseDeck(source, {
    size: 5,
    purpose: 'quiz',
    cycleIds: [...firstIds],
  })
  assert.equal(second.length, 5)
  assert.equal(second.some((item) => firstIds.has(item.id)), false)

  // 在庫（問題数の選べる上限）も、残りの項目だけを数える。
  const stock = buildPhraseDeck(source, { size: 0, purpose: 'quiz', cycleIds: [...firstIds] })
  assert.equal(stock.length, phrasesByLevel('idiom', '5').length - firstIds.size)
})

test('熟語・構文のテスト結果は「次の◯項目へ」で続け、一巡したら終える', () => {
  const source = { type: 'phrase', kind: 'idiom', levelId: '5' }
  const count = phrasesByLevel('idiom', '5').length
  let cycleIds = []
  let covered = 0

  for (let set = 1; covered < count; set++) {
    assert.ok(set <= count, '熟語・構文のテストが一巡で終わらない')
    const deck = buildPhraseDeck(source, { size: 5, purpose: 'quiz', cycleIds })
    assert.equal(deck.length, Math.min(5, count - covered), `${set}組目が空にならない`)

    const continuation = phraseSessionContinuation({
      source,
      title: '熟語',
      mode: 'quiz',
      size: 5,
      returnTo: { screen: 'phrases' },
      phraseSession: { cycleIds, itemIds: idsOf(deck) },
    }, { storedSize: 5 })
    covered += deck.length
    cycleIds = continuation.cycleIds

    if (covered < count) {
      const nextCount = Math.min(5, count - covered)
      assert.equal(continuation.exhausted, false)
      assert.equal(continuation.nextCount, nextCount)
      assert.equal(continuation.label, `次の${nextCount}項目へ`)
      assert.equal(continuation.destination.screen, 'phraseQuiz')
      assert.equal(continuation.destination.params.engine, 'phrase')
      assert.deepEqual(continuation.destination.params.phraseCycleIds, cycleIds)
    } else {
      assert.equal(continuation.exhausted, true)
      assert.equal(continuation.label, 'テストを終える')
      assert.deepEqual(continuation.destination, { screen: 'phrases', params: {} })
    }
  }
  assert.equal(new Set(cycleIds).size, count, '一巡のあいだ同じ項目を重ねない')
})

test('長文の準備など、明示された次画面は熟語・構文でも優先する', () => {
  const continuation = phraseSessionContinuation({
    source: { type: 'phrase', kind: 'idiom', levelId: '5' },
    mode: 'quiz',
    phraseSession: { itemIds: idsOf(phrasesByLevel('idiom', '5').slice(0, 5)) },
    continueTo: {
      screen: 'readingPrep',
      params: { passageId: 'p1' },
      label: '読解の準備に戻る',
    },
  })
  assert.deepEqual(continuation.destination, {
    screen: 'readingPrep',
    params: { passageId: 'p1' },
    label: '読解の準備に戻る',
  })
  assert.equal(continuation.label, '読解の準備に戻る')
})

test('熟語・構文のテスト結果は、英単語と同じ「復習する／次の◯へ／戻る」で終える', () => {
  const quiz = read('../src/screens/PhraseQuiz.jsx')
  const result = read('../src/screens/SessionResult.jsx')

  // 次の回へ周回を引き継ぐ。
  assert.match(quiz, /cycleIds: params\.phraseCycleIds/)
  assert.match(quiz, /itemIds: \[\.\.\.carried\.ids, \.\.\.deck\.map\(\(entry\) => entry\.id\)\]/)
  assert.match(quiz, /completedAt: Date\.now\(\)/)

  assert.match(result, /isPhraseQuiz = isPhrase && mode === 'quiz'/)
  assert.match(result, /continuesSession = isVocabResult \|\| isPhraseQuiz/)
  // 3つのボタンは英単語と共通の1か所だけに置く。
  assert.match(result, /\{continuesSession \? \(/)
  assert.equal((result.match(/onClick=\{continueSession\}/g) ?? []).length, 1)
  assert.equal((result.match(/onClick=\{returnFromSession\}/g) ?? []).length, 1)
})
