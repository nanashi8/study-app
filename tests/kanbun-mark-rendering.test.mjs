import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'

import { KANBUN_KUNDOKU_EXERCISES } from '../src/data/kanbun-kundoku.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { KanbunMarkedText } from '../src/components/KanbunMarkedText.js'
import {
  kanbunPlainText,
  kanbunReadingMatchesKakikudashi,
  kanbunReadingOrder,
  parseKanbunMarkedText,
} from '../src/lib/kanbun-marks.js'

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

test('返り点は本文の漢字と別の記号なので、「天下」「其一」を点に読み違えない', () => {
  const people = parseKanbunMarkedText('愛㆑人')
  assert.deepEqual(
    people.units.map(({ character, marks }) => [character, [...marks]]),
    [['愛', ['㆑']], ['人', []]],
  )

  const sorrow = parseKanbunMarkedText('先㆓天下之憂㆒而憂。')
  assert.equal(kanbunPlainText(sorrow), '先天下之憂而憂。')
  assert.equal(sorrow.returnMarkCount, 2)

  const halfKnown = parseKanbunMarkedText('但知㆓其一㆒、不㆑知㆓其二㆒。')
  assert.equal(kanbunPlainText(halfKnown), '但知其一、不知其二。')
  // 本文の「一」「二」はそのまま残り、閉じの一点はその本文字へ付く。
  assert.deepEqual(
    halfKnown.units.filter((unit) => unit.marks.length).map((unit) => [unit.character, unit.marks.join('')]),
    [['知', '㆓'], ['一', '㆒'], ['不', '㆑'], ['知', '㆓'], ['二', '㆒']],
  )
  assert.equal(kanbunReadingOrder(halfKnown).text, '但其一知其二知不')

  const combined = parseKanbunMarkedText('使㆓人読㆒㆑書')
  assert.deepEqual(
    combined.units.find((unit) => unit.character === '読').marks,
    ['㆒', '㆑'],
  )
})

test('返り点の階層どおりに読む順を組み立てる', () => {
  const cases = [
    ['読㆑書', '書読'],
    ['不㆑可㆑忘㆑恩。', '恩忘可不'],
    ['使㆓人読㆒㆑書', '人書読使'],
    ['毋㆘以㆓小利㆒害㆗大義㆖。', '小利以大義害毋'],
    ['欲㆚令㆘民読㆓此書㆒而知㆖㆑義而安㆙㆑国。', '民此書読而義知令而国安欲'],
    ['吾願㆞欲㆚令㆘臣使㆓民学㆒㆑礼㆖而安㆙㆑国以成㆝㆑業', '吾臣民礼学使令而国安欲以業成願'],
  ]
  for (const [marked, expected] of cases) {
    const reading = kanbunReadingOrder(marked)
    assert.deepEqual(reading.errors, [], `${marked}: ${JSON.stringify(reading.errors)}`)
    assert.equal(reading.text, expected, marked)
  }
})

test('規則から外れた返り点は読む順を作らずに落とす', () => {
  // レ点と二点は同じ字に同居できない（複合できるのは一・上・甲・天のレ点付き）。
  assert.ok(kanbunReadingOrder('使㆓㆑人読書').errors.some((error) => error.type === 'return-mark-conflict'))
  // 二点だけあって一点が無ければ、どこへ返るか決まらない。
  assert.ok(kanbunReadingOrder('学㆓於師').errors.some((error) => error.type === 'unresolved-return-mark'))
})

test('用例の読む順は、全件が書き下し文の並びと一致する', () => {
  let checked = 0
  for (const item of [...KANBUN_VOCAB, ...KANBUN_GRAMMAR]) {
    const match = kanbunReadingMatchesKakikudashi(item.marked, item.kakikudashi)
    assert.ok(match.ok, `${item.id}: ${item.marked} / ${item.kakikudashi}（${match.mismatch ?? ''}）`)
    checked += 1
  }
  assert.equal(checked, 207)
})

test('返り点表示は親字と点を同じDOM単位に入れ、支援技術にも点名を渡す', () => {
  const html = renderToStaticMarkup(KanbunMarkedText({
    marked: '使㆓人読㆒㆑書',
    inverse: true,
  }))
  assert.match(html, /data-kanbun-mark-status="complete"/)
  assert.match(html, /data-kanbun-character-unit="読"/)
  assert.match(html, /data-kanbun-return-marks="一レ"/)
  assert.match(html, /aria-label="読に一点・レ点"/)
  assert.match(html, /小さな返り点は、すぐ上の大きな字に付いています。/)
  assert.doesNotMatch(html, /折り返しても離れません/)
})
