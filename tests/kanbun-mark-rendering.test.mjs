import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'

import { KANBUN_KUNDOKU_EXERCISES } from '../src/data/kanbun-kundoku.js'
import { KanbunMarkedText } from '../src/components/KanbunMarkedText.js'
import { parseKanbunMarkedText } from '../src/lib/kanbun-marks.js'

test('返り点40題を親字単位へ分解しても原文を一字も変えない', () => {
  assert.equal(KANBUN_KUNDOKU_EXERCISES.length, 40)
  let markedExerciseCount = 0
  let returnMarkCount = 0
  for (const exercise of KANBUN_KUNDOKU_EXERCISES) {
    const parsed = parseKanbunMarkedText(exercise.marked)
    assert.deepEqual(parsed.errors, [], `${exercise.id}: ${JSON.stringify(parsed.errors)}`)
    assert.equal(
      parsed.units.map((unit) => unit.sourceText).join(''),
      exercise.marked,
      exercise.id,
    )
    assert.ok(parsed.characterCount > 0, exercise.id)
    if (parsed.returnMarkCount > 0) markedExerciseCount += 1
    returnMarkCount += parsed.returnMarkCount
  }
  assert.equal(markedExerciseCount, 39)
  assert.equal(returnMarkCount, 113)
})

test('本文の「人」と「一見」は返り点に誤認せず、複合返り点は同じ親字へ付ける', () => {
  const people = parseKanbunMarkedText('愛レ人')
  assert.deepEqual(
    people.units.map(({ character, marks }) => [character, [...marks]]),
    [['愛', ['レ']], ['人', []]],
  )

  const oneLook = parseKanbunMarkedText('百聞不レ如二一見一')
  assert.deepEqual(
    oneLook.units.map(({ character, marks }) => [character, [...marks]]),
    [
      ['百', []], ['聞', []], ['不', ['レ']], ['如', ['二']],
      ['一', []], ['見', ['一']],
    ],
  )

  const combined = parseKanbunMarkedText('使二人読一レ書')
  assert.deepEqual(
    combined.units.find((unit) => unit.character === '読').marks,
    ['一', 'レ'],
  )
})

test('返り点表示は親字と点を同じDOM単位に入れ、支援技術にも点名を渡す', () => {
  const html = renderToStaticMarkup(KanbunMarkedText({
    marked: '使二人読一レ書',
    inverse: true,
  }))
  assert.match(html, /data-kanbun-mark-status="complete"/)
  assert.match(html, /data-kanbun-character-unit="読"/)
  assert.match(html, /data-kanbun-return-marks="一レ"/)
  assert.match(html, /aria-label="読に一点・レ点"/)
  assert.match(html, /折り返しても離れません/)
})
