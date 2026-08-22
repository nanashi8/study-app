import test from 'node:test'
import assert from 'node:assert/strict'

import { literatureByKind } from '../src/data/public-domain-literature.js'
import {
  getLiteratureReadingGuide,
  getLiteratureReadingQuestions,
  LITERATURE_READING_GUIDES,
} from '../src/data/literature-reading.js'
import { buildReadingRoleAnnotation } from '../src/lib/reading-role-annotations.js'

test('英語名作6作品44場面は原文を変えない手作業SVOCM解説を全場面に持つ', () => {
  const works = literatureByKind('english')
  assert.equal(works.length, 6)
  assert.equal(works.reduce((count, work) => count + work.scenes.length, 0), 44)
  assert.deepEqual(
    Object.keys(LITERATURE_READING_GUIDES).sort(),
    works.map((work) => work.id).sort(),
  )

  for (const work of works) {
    assert.equal(LITERATURE_READING_GUIDES[work.id].length, work.scenes.length, work.id)
    for (const [sceneIndex, scene] of work.scenes.entries()) {
      const guide = getLiteratureReadingGuide(work.id, sceneIndex)
      const annotation = buildReadingRoleAnnotation(scene.original, guide.parts, {
        allowVerbOmission: guide.allowVerbOmission,
      })
      assert.deepEqual(
        annotation.errors,
        [],
        `${work.id} scene ${sceneIndex + 1}: ${JSON.stringify(annotation.errors)}`,
      )
      assert.equal(
        annotation.segments.map((segment) => segment.sourceText).join(''),
        scene.original,
      )
      assert.ok(guide.note.length >= 20, `${work.id} scene ${sceneIndex + 1}`)
    }
  }
})

test('英語名作は各作品3問・4択・根拠場面付きの読解チェックを持つ', () => {
  for (const work of literatureByKind('english')) {
    const questions = getLiteratureReadingQuestions(work.id)
    assert.equal(questions.length, 3, work.id)
    assert.equal(new Set(questions.map((item) => item.id)).size, questions.length)
    for (const item of questions) {
      assert.equal(item.choices.length, 4, item.id)
      assert.equal(new Set(item.choices).size, 4, item.id)
      assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 4, item.id)
      assert.ok(item.explanation.length >= 20, item.id)
      assert.ok(work.scenes[item.evidenceScene]?.original, item.id)
    }
  }
})

test('動詞のない文学的断片だけはV省略を明示し、通常文ではVを必須にする', () => {
  const magi = literatureByKind('english').find((work) => work.id === 'lit_en_gift_of_magi_opening')
  const fragment = magi.scenes.at(-1)
  const guide = getLiteratureReadingGuide(magi.id, magi.scenes.length - 1)
  const accepted = buildReadingRoleAnnotation(fragment.original, guide.parts, {
    allowVerbOmission: true,
  })
  const rejected = buildReadingRoleAnnotation(fragment.original, guide.parts)
  assert.equal(accepted.verbOmitted, true)
  assert.deepEqual(accepted.errors, [])
  assert.ok(rejected.errors.some((error) => error.type === 'missing-verb-role'))
})
