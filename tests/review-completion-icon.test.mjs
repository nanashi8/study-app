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

test('単語一覧は復習日前も次の復習日を示し、早めの練習を開ける', async () => {
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
  assert.match(source, /'復習日より前に練習'/)
  assert.match(source, /`次の復習日まであと\$\{nextReviewInDays\}日`/)
})
