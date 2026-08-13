import test from 'node:test'
import assert from 'node:assert/strict'

import { KOTEN_WORDS, KOTEN_CATEGORIES } from '../src/data/koten.js'
import {
  KOTEN_GRAMMAR,
  KOTEN_GRAMMAR_CATEGORIES,
} from '../src/data/koten-grammar.js'
import {
  KOTEN_CULTURE,
  KOTEN_CULTURE_CATEGORIES,
} from '../src/data/koten-culture.js'
import {
  KOTEN_CURRICULUM_LEVELS,
  KOTEN_CURRICULUM_PATHS,
} from '../src/data/koten-curriculum.js'

const COLLECTIONS = {
  vocab: { items: KOTEN_WORDS, categories: KOTEN_CATEGORIES, field: 'vocabIds' },
  grammar: { items: KOTEN_GRAMMAR, categories: KOTEN_GRAMMAR_CATEGORIES, field: 'grammarIds' },
  culture: { items: KOTEN_CULTURE, categories: KOTEN_CULTURE_CATEGORIES, field: 'cultureIds' },
}

test('古典の5段階コースは中学から最難関大まで三主分野を累積して全件へ到達する', () => {
  assert.deepEqual(
    KOTEN_CURRICULUM_LEVELS.map((level) => level.id),
    ['middle', 'basic', 'standard', 'advanced', 'elite'],
  )
  assert.equal(KOTEN_CURRICULUM_PATHS.length, 5)

  for (const [domain, { items, categories, field }] of Object.entries(COLLECTIONS)) {
    const allIds = new Set(items.map((item) => item.id))
    let previous = new Set()

    for (const level of KOTEN_CURRICULUM_PATHS) {
      const ids = level[field]
      const selected = ids.map((id) => items.find((item) => item.id === id))
      assert.equal(ids.length, level.targets[domain], `${level.id}:${domain}`)
      assert.equal(new Set(ids).size, ids.length, `${level.id}:${domain}:重複`)
      assert.ok(ids.every((id) => allIds.has(id)), `${level.id}:${domain}:未知ID`)
      assert.ok([...previous].every((id) => ids.includes(id)), `${level.id}:${domain}:非累積`)
      assert.deepEqual(
        new Set(selected.map((item) => item.category)),
        new Set(categories.map((category) => category.id)),
        `${level.id}:${domain}:カテゴリ不足`,
      )
      previous = new Set(ids)
    }

    assert.deepEqual(previous, allIds, `${domain}:最難関コースが全件ではない`)
  }
})
