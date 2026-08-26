import test from 'node:test'
import assert from 'node:assert/strict'

import { literatureByKind } from '../src/data/public-domain-literature.js'
import {
  getLiteratureReadingGuide,
  getLiteratureReadingQuestions,
} from '../src/data/literature-reading.js'
import { buildReadingRoleAnnotation } from '../src/lib/reading-role-annotations.js'

test('英語名作6作品122場面は原文を変えないSVOCM解説を全場面に持つ', () => {
  const works = literatureByKind('english')
  assert.equal(works.length, 6)
  assert.equal(works.reduce((count, work) => count + work.scenes.length, 0), 122)

  for (const work of works) {
    for (const [sceneIndex, scene] of work.scenes.entries()) {
      const guide = getLiteratureReadingGuide(work.id, sceneIndex, scene)
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
      assert.ok(guide.parts.some((part) => part.role === 'V'), `${work.id} scene ${sceneIndex + 1}: V`)
    }
  }
})

test('英語名作は各作品3問・4択・根拠場面付きの読解チェックを持つ', () => {
  for (const work of literatureByKind('english')) {
    const questions = getLiteratureReadingQuestions(work.id, work)
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

test('複数文を含む場面も一息の区切りから役割を組み直して原文を復元する', () => {
  const moby = literatureByKind('english').find(
    (work) => work.id === 'lit_en_moby_dick_water_gazers',
  )
  const scene = moby.scenes.at(-1)
  const guide = getLiteratureReadingGuide(moby.id, moby.scenes.length - 1, scene)
  const annotation = buildReadingRoleAnnotation(scene.original, guide.parts, {
    allowVerbOmission: guide.allowVerbOmission,
  })
  assert.deepEqual(annotation.errors, [])
  assert.equal(annotation.segments.map((segment) => segment.sourceText).join(''), scene.original)
  assert.ok(guide.parts.some((part) => part.role === 'V'))
})
