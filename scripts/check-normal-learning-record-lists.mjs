#!/usr/bin/env node

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ALL_PASSAGES } from '../src/data/passages.js'
import { getReadingStudy } from '../src/data/reading-study.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import {
  NORMAL_LEARNING_RECORD_ENTRIES,
  NORMAL_LEARNING_RECORD_TOTAL,
} from '../src/lib/normalLearningRecordEntries.js'
import {
  learningContentCatalogReviewCommand,
  learningContentCatalogSupportsReview,
} from '../src/lib/learningContentCatalogReview.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const EXPECTED_COUNTS = Object.freeze({
  'usage-idiom': 1_754,
  'usage-syntax': 350,
  etymology: 267,
  'koten-vocab': 300,
  'koten-grammar': 74,
  'koten-culture': 56,
  'kanbun-vocab': 120,
  'kanbun-grammar': 87,
  'kanbun-culture': 95,
})
const EXPECTED_RESULTS = Object.freeze(['remembered', 'forgot', 'correct', 'wrong'])
const contentById = new Map(LEARNING_CONTENTS.map((content) => [content.id, content]))

assert.deepEqual(
  NORMAL_LEARNING_RECORD_ENTRIES.map((entry) => entry.id),
  Object.keys(EXPECTED_COUNTS),
  '通常入口の9一覧が監査台帳と一致しません',
)
assert.equal(NORMAL_LEARNING_RECORD_TOTAL, 3_103, '通常入口の監査母数が変わりました')

for (const entry of NORMAL_LEARNING_RECORD_ENTRIES) {
  assert.equal(entry.items.length, EXPECTED_COUNTS[entry.id], `${entry.label}: 項目数`)
  assert.equal(new Set(entry.items.map((item) => item.id)).size, entry.items.length, `${entry.label}: ID重複`)
  const content = contentById.get(entry.contentId)
  assert.ok(content, `${entry.label}: 教材ID ${entry.contentId}`)
  assert.equal(learningContentCatalogSupportsReview(entry.contentId), true, `${entry.label}: スワイプ保存対象`)
  const contentIds = new Set(content.items.map((item) => item.id))
  for (const item of entry.items) {
    assert.ok(contentIds.has(item.id), `${entry.label}:${item.id}: 教材母集団にありません`)
    for (const result of EXPECTED_RESULTS) {
      assert.ok(
        learningContentCatalogReviewCommand(entry.contentId, item.id, result),
        `${entry.label}:${item.id}:${result}: SRS書き込み先がありません`,
      )
    }
  }
}

const phraseEntries = NORMAL_LEARNING_RECORD_ENTRIES.filter((entry) => entry.contentId === 'usage')
assert.deepEqual(
  new Set(phraseEntries.flatMap((entry) => entry.items.map((item) => item.id))),
  new Set(contentById.get('usage').items.map((item) => item.id)),
  '熟語・構文の通常一覧に欠落があります',
)

const sourceFiles = [...new Set(NORMAL_LEARNING_RECORD_ENTRIES.map((entry) => entry.sourceFile))]
const sources = new Map(await Promise.all(sourceFiles.map(async (sourceFile) => [
  sourceFile,
  await readFile(path.join(ROOT, sourceFile), 'utf8'),
])))
for (const sourceFile of sourceFiles) {
  const source = sources.get(sourceFile)
  assert.match(source, /NormalLearningRecordList/, `${sourceFile}: 通常一覧の共通スワイプ部品`)
  assert.match(source, /<NormalLearningRecordList/, `${sourceFile}: 通常画面への配置`)
}
for (const entry of NORMAL_LEARNING_RECORD_ENTRIES) {
  assert.ok(
    sources.get(entry.sourceFile).includes(`'${entry.id}'`) || sources.get(entry.sourceFile).includes(`"${entry.id}"`),
    `${entry.label}: 通常画面に一覧ID ${entry.id} がありません`,
  )
}

const component = await readFile(path.join(ROOT, 'src/components/NormalLearningRecordList.jsx'), 'utf8')
const row = await readFile(path.join(ROOT, 'src/components/VocabularyHistoryRow.jsx'), 'utf8')
for (const required of [
  'data-normal-learning-record-list',
  'data-normal-learning-record-activity-tab',
  'data-normal-learning-record-swipe-guide',
  'data-normal-learning-record-restore',
  'LearningRecordRow',
  'vocabularyCatalogResultForDirection',
  'reviewLearningContent(contentId, row.id, result)',
  'next.add(row.id)',
]) {
  assert.ok(component.includes(required), `通常一覧の共通処理に ${required} がありません`)
}
for (const required of [
  'onPointerDown={startSwipe}',
  'onPointerMove={previewSwipe}',
  'onPointerUp={finishSwipe}',
  'touch-pan-y',
  'data-learning-record-status',
]) {
  assert.ok(row.includes(required), `スワイプ行に ${required} がありません`)
}

const app = await readFile(path.join(ROOT, 'src/App.jsx'), 'utf8')
for (const screen of new Set(NORMAL_LEARNING_RECORD_ENTRIES.map((entry) => entry.screen))) {
  assert.match(app, new RegExp(`\\b${screen}:`), `${screen}: 公開ルートがありません`)
}

const home = await readFile(path.join(ROOT, 'src/screens/Home.jsx'), 'utf8')
const kotenHome = sources.get('src/screens/KotenList.jsx')
const kanbunHome = await readFile(path.join(ROOT, 'src/screens/KanbunHome.jsx'), 'utf8')
assert.match(home, /screen: 'phrases'/, '英語アプリから熟語・構文へ進めません')
assert.match(kotenHome, /navigate\('kotenGrammar'\)/, '古典アプリから古文文法へ進めません')
assert.match(kotenHome, /navigate\('kotenCulture'\)/, '古典アプリから古文常識へ進めません')
for (const domain of ['vocab', 'grammar', 'culture']) {
  assert.ok(
    kanbunHome.includes(`navigate('kanbunCatalog', { domain: '${domain}' })`),
    `漢文アプリから ${domain} の通常一覧へ進めません`,
  )
}

// 長文ごとの読解の準備も、通常入口と同じ暗記・テスト・一覧スワイプでそろえる。
const prep = await readFile(path.join(ROOT, 'src/screens/ReadingPrep.jsx'), 'utf8')
for (const required of [
  '<NormalLearningRecordList',
  'entryId="reading-prep-words"',
  'entryId="reading-prep-phrases"',
  'contentId="vocab"',
  'contentId="usage"',
  '<LearningEntryCard',
  '<LearningViewTabs',
]) {
  assert.ok(prep.includes(required), `読解の準備に ${required} がありません`)
}
let prepWordCount = 0
let prepPhraseCount = 0
for (const passage of ALL_PASSAGES) {
  const study = getReadingStudy(passage)
  prepWordCount += study.words.length
  prepPhraseCount += study.phrases.length
  for (const [contentId, items] of [['vocab', study.words], ['usage', study.phrases]]) {
    assert.ok(items.length > 0, `${passage.id}: ${contentId} の準備項目がありません`)
    for (const item of items) {
      for (const result of EXPECTED_RESULTS) {
        assert.ok(
          learningContentCatalogReviewCommand(contentId, item.id, result),
          `${passage.id}:${item.id}:${result}: SRS書き込み先がありません`,
        )
      }
    }
  }
}

console.log('✅ 通常入口の学習・テスト一覧監査に合格しました')
console.log(`- 入口: ${NORMAL_LEARNING_RECORD_ENTRIES.length}/8`)
console.log(`- 項目: ${NORMAL_LEARNING_RECORD_TOTAL.toLocaleString('ja-JP')}/2,836`)
console.log(`- 読解の準備: 長文${ALL_PASSAGES.length}本・必須語彙${prepWordCount.toLocaleString('ja-JP')}語・熟語表現${prepPhraseCount.toLocaleString('ja-JP')}項目`)
for (const entry of NORMAL_LEARNING_RECORD_ENTRIES) {
  console.log(`- ${entry.label}: ${entry.items.length.toLocaleString('ja-JP')}項目 (${entry.screen})`)
}
