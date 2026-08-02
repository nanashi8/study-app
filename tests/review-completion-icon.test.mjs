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

test('単語一覧は復習完了後に更新アイコンをチェックへ替える', async () => {
  const source = await readFile(
    new URL('../src/screens/VocabLevels.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /const reviewState = reviewActionState\(prog\)/)
  assert.match(source, /data-review-state=\{reviewState\}/)
  assert.match(source, /reviewComplete \? <Check size=\{20\} \/> : <Refresh size=\{20\} \/>/)
  assert.match(source, /reviewComplete \? '復習完了' : '復習'/)
  assert.match(source, /reviewComplete \? '次の復習待ち' : `\$\{prog\.due\}語`/)
})
