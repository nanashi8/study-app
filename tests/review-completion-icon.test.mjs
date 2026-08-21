import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { reviewActionState } from '../src/lib/session.js'

test('復習表示は未着手・復習あり・完了を区別する', () => {
  assert.equal(reviewActionState(), 'empty')
  assert.equal(reviewActionState({ seen: 0, due: 0 }), 'empty')
  assert.equal(reviewActionState({ seen: 18, due: 4 }), 'due')
  assert.equal(reviewActionState({ seen: 18, due: 0 }), 'complete')
})

test('単語一覧は期限到来前も次回日を示し、先取り復習を開ける', async () => {
  const source = await readFile(
    new URL('../src/screens/VocabLevels.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /const reviewState = reviewActionState\(prog\)/)
  assert.match(source, /const canReview = prog\.seen > 0/)
  assert.match(source, /nextVocabularyReviewInDays\(srs\)/)
  assert.match(source, /data-review-state=\{reviewState\}/)
  assert.match(source, /reviewComplete \? <Check size=\{20\} \/> : <Refresh size=\{20\} \/>/)
  assert.match(source, /disabled=\{!canReview\}/)
  assert.match(source, /source: \{ type: reviewState === 'due' \? 'due' : 'review' \}/)
  assert.match(source, /'先取り復習'/)
  assert.match(source, /`次の期限まであと\$\{nextReviewInDays\}日`/)
})
