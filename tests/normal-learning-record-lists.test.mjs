import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import {
  NORMAL_LEARNING_RECORD_ENTRIES,
  NORMAL_LEARNING_RECORD_TOTAL,
} from '../src/lib/normalLearningRecordEntries.js'
import {
  learningContentCatalogReviewCommand,
  learningContentCatalogSupportsReview,
} from '../src/lib/learningContentCatalogReview.js'

const EXPECTED_COUNTS = Object.freeze({
  'usage-idiom': 1_754,
  'usage-syntax': 350,
  etymology: 339,
  'koten-vocab': 300,
  'koten-grammar': 74,
  'koten-culture': 56,
  'kanbun-vocab': 120,
  'kanbun-grammar': 87,
  'kanbun-culture': 95,
})

test('指定9カテゴリの通常入口3,175項目を欠落なくスワイプ記録へ接続する', () => {
  assert.equal(NORMAL_LEARNING_RECORD_ENTRIES.length, 9)
  assert.equal(NORMAL_LEARNING_RECORD_TOTAL, 3_175)
  assert.deepEqual(
    Object.fromEntries(NORMAL_LEARNING_RECORD_ENTRIES.map((entry) => [entry.id, entry.items.length])),
    EXPECTED_COUNTS,
  )

  const contentById = new Map(LEARNING_CONTENTS.map((content) => [content.id, content]))
  for (const entry of NORMAL_LEARNING_RECORD_ENTRIES) {
    const content = contentById.get(entry.contentId)
    assert.ok(content, entry.id)
    assert.equal(learningContentCatalogSupportsReview(entry.contentId), true, entry.id)
    const contentIds = new Set(content.items.map((item) => item.id))
    assert.equal(new Set(entry.items.map((item) => item.id)).size, entry.items.length, `${entry.id}: 重複`)
    for (const item of entry.items) {
      assert.ok(contentIds.has(item.id), `${entry.id}:${item.id}: 母集団`)
      for (const result of ['remembered', 'forgot', 'correct', 'wrong']) {
        assert.ok(
          learningContentCatalogReviewCommand(entry.contentId, item.id, result),
          `${entry.id}:${item.id}:${result}`,
        )
      }
    }
  }
})

test('9カテゴリすべての通常画面そのものが共通スワイプ一覧を描画する', () => {
  const sourceFiles = [...new Set(NORMAL_LEARNING_RECORD_ENTRIES.map((entry) => entry.sourceFile))]
  const sourceByFile = new Map(sourceFiles.map((sourceFile) => [
    sourceFile,
    readFileSync(new URL(`../${sourceFile}`, import.meta.url), 'utf8'),
  ]))

  assert.deepEqual(sourceFiles.sort(), [
    'src/screens/KanbunCatalog.jsx',
    'src/screens/KotenCulture.jsx',
    'src/screens/KotenGrammar.jsx',
    'src/screens/KotenList.jsx',
    'src/screens/Phrases.jsx',
    'src/screens/Roots.jsx',
  ])
  for (const sourceFile of sourceFiles) {
    assert.match(sourceByFile.get(sourceFile), /<NormalLearningRecordList/, sourceFile)
  }
  for (const entry of NORMAL_LEARNING_RECORD_ENTRIES) {
    const source = sourceByFile.get(entry.sourceFile)
    assert.ok(
      source.includes(`'${entry.id}'`) || source.includes(`"${entry.id}"`),
      `${entry.label}: ${entry.id}`,
    )
  }
})

test('通常一覧は学習・テストの切替、左右スワイプ、再表示、既存SRS保存を共通化する', () => {
  const component = readFileSync(new URL('../src/components/NormalLearningRecordList.jsx', import.meta.url), 'utf8')
  const row = readFileSync(new URL('../src/components/VocabularyHistoryRow.jsx', import.meta.url), 'utf8')

  for (const token of [
    'data-normal-learning-record-list',
    'data-normal-learning-record-activity-tab',
    'data-normal-learning-record-swipe-guide',
    'data-normal-learning-record-restore',
    'reviewLearningContent(contentId, row.id, result)',
    'next.add(row.id)',
    'LearningRecordRow',
  ]) {
    assert.ok(component.includes(token), token)
  }
  for (const token of [
    'onPointerDown={startSwipe}',
    'onPointerMove={previewSwipe}',
    'onPointerUp={finishSwipe}',
    'data-learning-record-status',
  ]) {
    assert.ok(row.includes(token), token)
  }
})
