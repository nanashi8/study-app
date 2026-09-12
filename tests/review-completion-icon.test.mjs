import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { reviewActionState } from '../src/lib/session.js'
import { contentReviewSummary, reviewTargetItems } from '../src/lib/contentReview.js'

test('復習表示は未着手・復習あり・完了を区別する', () => {
  assert.equal(reviewActionState(), 'empty')
  assert.equal(reviewActionState({ seen: 0, due: 0 }), 'empty')
  assert.equal(reviewActionState({ seen: 18, due: 4 }), 'due')
  assert.equal(reviewActionState({ seen: 18, due: 0 }), 'complete')
})

test('各コンテンツの復習も、未着手・今日の復習・復習日より前の3つに分け、次の復習日までの日数を示す', () => {
  const items = ['a', 'b', 'c', 'd'].map((id) => ({ id }))
  const day = 100
  assert.equal(contentReviewSummary(items, {}, day).state, 'empty')

  const due = contentReviewSummary(items, { a: { due: 99 }, b: { due: 103 }, c: { due: 100 } }, day)
  assert.equal(due.state, 'due')
  assert.deepEqual(reviewTargetItems(due).map((item) => item.id), ['a', 'c'])

  // 今日の分がなければ、学んだ項目を復習日が近い順に出し、次の復習日までの日数を示す。
  const complete = contentReviewSummary(items, { a: { due: 104 }, b: { due: 101 }, d: {} }, day)
  assert.equal(complete.state, 'complete')
  assert.equal(complete.nextInDays, 1)
  assert.deepEqual(reviewTargetItems(complete).map((item) => item.id), ['b', 'a', 'd'])
})

test('単語一覧と各コンテンツは同じ復習の行を使い、復習日前も次の復習日を示して早めの練習を開ける', async () => {
  const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
  const source = await read('../src/screens/VocabLevels.jsx')
  const top = await read('../src/components/ContentTop.jsx')

  assert.match(source, /const reviewState = reviewActionState\(prog\)/)
  assert.match(source, /nextVocabularyReviewInDays\(srs\)/)
  assert.match(source, /<ReviewTodayRow\s+state=\{reviewState\}\s+due=\{prog\.due\}\s+nextInDays=\{nextReviewInDays\}/)
  assert.match(source, /source: \{ type: reviewState === 'due' \? 'due' : 'review' \}/)
  assert.match(source, /'復習日より前に練習'/)

  assert.match(top, /export function ReviewTodayRow/)
  assert.match(top, /data-review-state=\{state\}/)
  assert.match(top, /complete \? <Check size=\{20\} \/> : <Refresh size=\{20\} \/>/)
  assert.match(top, /disabled=\{state === 'empty'\}/)
  assert.match(top, /'復習日より前に練習'/)
  assert.match(top, /`次の復習日まであと\$\{nextInDays\}日`/)
})
