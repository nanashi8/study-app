import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { createInitialLearningState, todayIndex } from '../src/store/useStore.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import {
  LEARNING_CONTENT_CATALOG_ACTIONS,
  LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS,
  LEARNING_CONTENT_CATALOG_SORT_OPTIONS,
  learningContentCatalogLaunch,
  learningContentCatalogRows,
  learningContentCatalogTotal,
} from '../src/lib/learningContentCatalog.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import { recordContentQuizResult } from '../src/lib/contentProgress.js'
import { buildDeck, buildPhraseDeck } from '../src/lib/session.js'
import { buildGrammarDeck } from '../src/lib/grammarDeck.js'
import { buildListeningDeck } from '../src/data/listening.js'
import { buildDictationDeck } from '../src/data/dictation.js'
import { pickKanbunKundokuExercises } from '../src/data/kanbun-kundoku.js'
import { learningContentCatalogSwipeAction } from '../src/lib/learningContentCatalogSwipe.js'
import { createLearningNotebook } from '../src/lib/learningNotebook.js'
import {
  learningContentPlanEntry,
  updateLearningContentPlan,
} from '../src/lib/learningContentPlan.js'

const DAY_MS = 86_400_000
const EXPECTED_COUNTS = Object.freeze({
  vocab: 8869,
  usage: 2104,
  grammar: 3555,
  listening: 160,
  dictation: 140,
  etymology: 109,
  reading: 36,
  writing: 14,
  'koten-vocab': 300,
  'koten-grammar': 74,
  'koten-culture': 56,
  'koten-reading': 36,
  'kanbun-vocab': 120,
  'kanbun-grammar': 87,
  'kanbun-culture': 95,
  'kanbun-kundoku': 40,
  literature: 12,
  math: 274,
})

const contentById = (id) => LEARNING_CONTENTS.find((content) => content.id === id)

function reviewEntry({ memoryAt, testAt, failed = false, day }) {
  return {
    box: failed ? 0 : 4,
    correct: failed ? 0 : 4,
    wrong: failed ? 2 : 0,
    due: failed ? day : day + 8,
    last: day - 1,
    lastAt: Math.max(memoryAt ?? 0, testAt ?? 0),
    memory: {
      passes: 2,
      remembered: failed ? 1 : 2,
      forgot: failed ? 1 : 0,
      lastAt: memoryAt,
      lastJudgment: failed ? 'forgot' : 'remembered',
      marks: failed ? [1, 0] : [1, 1],
    },
    test: {
      attempts: 2,
      correct: failed ? 1 : 2,
      wrong: failed ? 1 : 0,
      unknown: 0,
      lastAt: testAt,
      lastResult: failed ? 'wrong' : 'correct',
      marks: failed ? [1, 0] : [1, 1],
    },
  }
}

test('全18教材・16,081項目を一覧行へ重複も欠落もなく変換する', () => {
  assert.equal(LEARNING_CONTENTS.length, 18)
  assert.equal(learningContentCatalogTotal(LEARNING_CONTENTS), 16_081)
  assert.deepEqual(
    Object.fromEntries(LEARNING_CONTENTS.map((content) => [content.id, content.items.length])),
    EXPECTED_COUNTS,
  )

  const state = createInitialLearningState()
  for (const content of LEARNING_CONTENTS) {
    const rows = learningContentCatalogRows(content, state)
    const expectedIds = content.items.map((item) => item.id)
    const rowIds = rows.map((row) => row.id)
    assert.equal(rows.length, content.items.length, content.id)
    assert.equal(new Set(rowIds).size, rows.length, `${content.id}: 一覧IDの重複`)
    assert.deepEqual(new Set(rowIds), new Set(expectedIds), `${content.id}: 一覧の欠落`)
    for (const row of rows) {
      assert.ok(row.title?.trim(), `${content.id}:${row.id}: 見出し`)
      assert.ok(row.field?.trim(), `${content.id}:${row.id}: 分野`)
      assert.ok(row.searchText.includes(String(row.id).toLocaleLowerCase('ja')), `${content.id}:${row.id}: 検索`)
    }
  }
})

test('全教材で学習日・テスト日・分野・復習優先度の4種類を同じ規則で並び替える', () => {
  assert.deepEqual(
    LEARNING_CONTENT_CATALOG_SORT_OPTIONS.map((option) => option.id),
    ['weight', 'memoryAt', 'testAt', 'field'],
  )
  assert.deepEqual(LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS, {
    weight: 'desc',
    memoryAt: 'desc',
    testAt: 'desc',
    field: 'asc',
  })

  const now = new Date(2026, 7, 25, 12, 0, 0).getTime()
  const day = todayIndex(now)
  const source = contentById('vocab')
  const items = source.items.slice(0, 3)
  const content = { ...source, items }
  const state = {
    ...createInitialLearningState(),
    srs: {
      [items[0].id]: reviewEntry({
        memoryAt: now - 3 * DAY_MS,
        testAt: now - DAY_MS,
        failed: true,
        day,
      }),
      [items[1].id]: reviewEntry({
        memoryAt: now - DAY_MS,
        testAt: now - 3 * DAY_MS,
        day,
      }),
    },
  }
  const ids = (sort, direction) => learningContentCatalogRows(content, state, {
    sort,
    direction,
    now,
    day,
  }).map((row) => row.id)

  const statusRows = learningContentCatalogRows(content, state, { now, day })
  assert.equal(statusRows.find((row) => row.id === items[0].id).memoryStatus, 'reviewing')
  assert.equal(statusRows.find((row) => row.id === items[0].id).testStatus, 'incorrect')
  assert.equal(statusRows.find((row) => row.id === items[1].id).memoryStatus, 'learned')
  assert.equal(statusRows.find((row) => row.id === items[1].id).testStatus, 'correct')

  assert.deepEqual(ids('memoryAt', 'desc'), [items[1].id, items[0].id, items[2].id])
  assert.deepEqual(ids('memoryAt', 'asc'), [items[0].id, items[1].id, items[2].id])
  assert.deepEqual(ids('testAt', 'desc'), [items[0].id, items[1].id, items[2].id])
  assert.deepEqual(ids('testAt', 'asc'), [items[1].id, items[0].id, items[2].id])
  assert.equal(ids('weight', 'desc')[0], items[0].id)

  const fields = learningContentCatalogRows(content, state, { sort: 'field', direction: 'asc' })
    .map((row) => row.field)
  const expectedFields = [...fields].sort(new Intl.Collator('ja', { sensitivity: 'base', numeric: true }).compare)
  assert.deepEqual(fields, expectedFields)
})

test('日付を持たない読了記録と、日付を持つ作文・独立テスト記録を区別する', () => {
  const reading = contentById('reading')
  const writing = contentById('writing')
  const readingItem = reading.items[0]
  const writingItem = writing.items[0]
  const state = {
    ...createInitialLearningState(),
    readingsDone: [readingItem.id],
    writingProgress: {
      [writingItem.id]: { completed: 1, lastDay: 20_000 },
    },
    contentQuizResults: recordContentQuizResult({}, {
      domain: 'reading',
      itemId: readingItem.id,
      correct: 0,
      total: 1,
      timestamp: 123_456,
    }),
  }
  const readingRow = learningContentCatalogRows({ ...reading, items: [readingItem] }, state)[0]
  const writingRow = learningContentCatalogRows({ ...writing, items: [writingItem] }, state)[0]

  assert.equal(readingRow.learningRecorded, true)
  assert.equal(readingRow.memoryAt, null)
  assert.equal(readingRow.testAt, 123_456)
  assert.equal(readingRow.priority, 'retry')
  assert.equal(writingRow.learningRecorded, true)
  assert.equal(writingRow.memoryAt, 20_000 * DAY_MS)
})

test('18教材すべてに既存の学習画面への開始契約と一覧への帰り先がある', () => {
  const expectedScreens = {
    vocab: 'vocabStudy',
    usage: 'phraseStudy',
    grammar: 'grammarQuiz',
    listening: 'listeningQuiz',
    dictation: 'dictationPlay',
    etymology: 'vocabStudy',
    reading: 'readingPrep',
    writing: 'writingPlay',
    'koten-vocab': 'kotenStudy',
    'koten-grammar': 'kotenGrammarStudy',
    'koten-culture': 'kotenCultureStudy',
    'koten-reading': 'kotenInterpretationPrep',
    'kanbun-vocab': 'kanbunStudy',
    'kanbun-grammar': 'kanbunStudy',
    'kanbun-culture': 'kanbunStudy',
    'kanbun-kundoku': 'kanbunKundokuQuiz',
    literature: 'literatureReader',
    math: 'mathSolve',
  }
  assert.deepEqual(Object.keys(LEARNING_CONTENT_CATALOG_ACTIONS), Object.keys(EXPECTED_COUNTS))

  for (const content of LEARNING_CONTENTS) {
    const rows = learningContentCatalogRows(content, createInitialLearningState()).slice(0, 3)
    const launch = learningContentCatalogLaunch(content, rows)
    assert.equal(launch?.screen, expectedScreens[content.id], content.id)
    assert.deepEqual(launch.params.returnTo, {
      screen: 'myLearning',
      params: { view: 'catalog', contentId: content.id, catalogView: 'all' },
    }, `${content.id}: 帰り先`)

    const action = LEARNING_CONTENT_CATALOG_ACTIONS[content.id]
    const launchedIds = launch.params.source?.ids
      ?? launch.params.packIds
      ?? launch.params.ids
      ?? launch.params.problemIds
      ?? [launch.params.passageId ?? launch.params.exerciseId ?? launch.params.workId]
    const selectedRows = rows
      .slice(0, action.selection === 'one' ? 1 : rows.length)
    const expectedIds = content.id === 'etymology'
      ? [...new Set(selectedRows.flatMap((row) => row.item.studyIds))]
      : selectedRows.map((row) => row.id)
    assert.deepEqual(launchedIds, expectedIds, `${content.id}: 選択順`)
  }
})

test('並び替え後の選択順を、英語・語源・漢文の既存デッキ作成でも保つ', () => {
  const state = createInitialLearningState()
  const reversed = (contentId) => [...contentById(contentId).items.slice(0, 3)].reverse()

  const phrases = reversed('usage')
  assert.deepEqual(
    buildPhraseDeck({ type: 'phraseList', ids: phrases.map((item) => item.id), preserveOrder: true }, { size: 0 }).map((item) => item.id),
    phrases.map((item) => item.id),
  )

  const grammar = reversed('grammar')
  assert.deepEqual(
    buildGrammarDeck({ type: 'grammarList', ids: grammar.map((item) => item.id), preserveOrder: true }, { size: 0 }).map((item) => item.id),
    grammar.map((item) => item.id),
  )

  const listening = reversed('listening')
  assert.deepEqual(
    buildListeningDeck({ type: 'listeningList', ids: listening.map((item) => item.id), preserveOrder: true }, { size: 0 }).map((item) => item.id),
    listening.map((item) => item.id),
  )

  const dictation = reversed('dictation')
  assert.deepEqual(
    buildDictationDeck({ type: 'dictationList', ids: dictation.map((item) => item.id), preserveOrder: true }, { size: 0 }).map((item) => item.id),
    dictation.map((item) => item.id),
  )

  const etymology = reversed('etymology')
  const etymologyRows = etymology.map((item) => ({ id: item.id, item }))
  const etymologyLaunch = learningContentCatalogLaunch(contentById('etymology'), etymologyRows)
  const etymologyWordIds = [...new Set(etymology.flatMap((item) => item.studyIds))]
  assert.deepEqual(
    buildDeck(etymologyLaunch.params.source, {
      srs: state.srs,
      size: etymologyWordIds.length,
      purpose: 'study',
    }).map((item) => item.id),
    etymologyWordIds,
  )

  const kundoku = reversed('kanbun-kundoku')
  assert.deepEqual(
    pickKanbunKundokuExercises(kundoku.map((item) => item.id), {
      preserveOrder: true,
      size: kundoku.length,
    }).map((item) => item.id),
    kundoku.map((item) => item.id),
  )
})

test('マイ学習の入口を一覧確認へ統一し、英単語だけは連続スワイプで記録する', () => {
  const myLearning = readFileSync(new URL('../src/screens/MyLearning.jsx', import.meta.url), 'utf8')
  const catalog = readFileSync(new URL('../src/components/LearningContentCatalog.jsx', import.meta.url), 'utf8')
  const vocabularyHistoryRow = readFileSync(new URL('../src/components/VocabularyHistoryRow.jsx', import.meta.url), 'utf8')
  const appMenu = readFileSync(new URL('../src/lib/appMenu.js', import.meta.url), 'utf8')
  const catalogLib = readFileSync(new URL('../src/lib/learningContentCatalog.js', import.meta.url), 'utf8')
  const store = readFileSync(new URL('../src/store/useStore.js', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')

  assert.match(myLearning, /data-learning-content-catalog-entry=\{content\.id\}/)
  assert.match(myLearning, /一覧を確認/)
  assert.doesNotMatch(myLearning, /一覧から学ぶ|一覧から確認/)
  assert.match(appMenu, /全18教材の一覧を確認し/)
  assert.doesNotMatch(appMenu, /一覧から学び|一覧から学ぶ|一覧から確認|一覧から復習/)
  assert.match(myLearning, /view: 'catalog', contentId: content\.id/)
  assert.match(catalog, /data-learning-content-catalog=\{content\.id\}/)
  assert.match(catalog, /data-learning-catalog-content-select/)
  assert.match(catalog, /data-learning-catalog-search/)
  assert.match(catalog, /data-learning-catalog-sort/)
  assert.match(catalog, /data-learning-catalog-start/)
  assert.match(catalog, /!isVocabulary && \(/)
  assert.match(catalog, /data-learning-catalog-swipe-guide/)
  assert.match(catalog, /data-learning-catalog-vocab-activity-tab/)
  assert.match(catalog, /data-learning-catalog-restore/)
  assert.match(catalog, /VocabularyHistoryRow/)
  assert.match(catalog, /review\(row\.id, result, 'vocab'\)/)
  assert.match(catalog, /next\.add\(row\.id\)/)
  assert.match(catalog, /スワイプ後は一時的に非表示/)
  assert.match(vocabularyHistoryRow, /role="group"/)
  assert.doesNotMatch(vocabularyHistoryRow, /aria-pressed|type="checkbox"/)
  assert.match(catalog, /data-learning-catalog-tools-toggle/)
  assert.match(catalog, /aria-expanded=\{toolsOpen\}/)
  assert.match(catalog, /learning-catalog-tools-collapsible/)
  assert.match(catalog, /data-learning-catalog-view=\{viewId\}/)
  assert.match(catalog, /all: \{/)
  assert.match(catalog, /registered: \{/)
  assert.match(catalog, /hidden: \{/)
  assert.match(catalog, /touch-pan-y/)
  assert.match(catalog, /onPointerDown=\{startSwipe\}/)
  assert.match(catalog, /onPointerMove=\{previewSwipe\}/)
  assert.match(catalog, /onPointerUp=\{finishSwipe\}/)
  assert.match(catalog, /rightLabel: '学習項目に追加'/)
  assert.match(catalog, /leftLabel: '再表示しない'/)
  assert.match(catalog, /rightLabel: 'もっと先にする'/)
  assert.match(catalog, /leftLabel: '一覧から外す'/)
  assert.match(catalog, /overflow-x-hidden/)
  assert.match(catalog, /記録あり（日付なし）/)
  assert.match(catalog, /replaceParams\(\{ view: 'catalog', contentId: nextContentId, catalogView \}\)/)
  assert.match(store, /replaceParams: \(params = \{\}\) => set\(\{ params \}\)/)
  assert.match(store, /updateLearningContentPlanItem:/)
  assert.match(store, /st\.params\?\.returnTo\?\.screen/)
  assert.match(catalogLib, /復習のおすすめ順/)
  assert.match(catalogLib, /最終学習日/)
  assert.match(catalogLib, /最終テスト日/)
  assert.match(css, /@media \(max-height: 640px\)[\s\S]*\.learning-catalog-tools-collapsible\s*\{\s*display:\s*none/s)
  assert.equal(PERSISTED_PROGRESS_FIELDS.some((field) => /catalog|selected/i.test(field)), false)
})

test('一覧行の右・左スワイプを文脈別操作へ渡す', () => {
  assert.equal(
    learningContentCatalogSwipeAction({ x: 100, y: 100 }, { x: 170, y: 104 }),
    'right',
  )
  assert.equal(
    learningContentCatalogSwipeAction({ x: 170, y: 100 }, { x: 100, y: 104 }),
    'left',
  )
  assert.equal(
    learningContentCatalogSwipeAction({ x: 100, y: 100 }, { x: 120, y: 190 }),
    null,
  )
})

test('登録・非表示・手動優先度を全教材共通で持ち、優先項目を先に並べる', () => {
  const content = contentById('usage')
  const [first, second] = content.items.slice(0, 2)
  let plan = updateLearningContentPlan(undefined, content.id, first.id, 'register', 100)
  plan = updateLearningContentPlan(plan, content.id, first.id, 'raise-priority', 200)
  plan = updateLearningContentPlan(plan, content.id, first.id, 'raise-priority', 300)
  plan = updateLearningContentPlan(plan, content.id, second.id, 'hide', 400)
  const state = {
    ...createInitialLearningState(),
    learningNotebook: { ...createLearningNotebook(), contentPlan: plan },
  }
  const rows = learningContentCatalogRows({ ...content, items: [second, first] }, state)

  assert.equal(rows[0].id, first.id)
  assert.equal(rows[0].registered, true)
  assert.equal(rows[0].manualPriority, 2)
  assert.equal(rows[1].hidden, true)
  assert.deepEqual(learningContentPlanEntry(plan, content.id, first.id), {
    registered: true,
    hidden: false,
    priority: 2,
    registeredAt: 100,
    hiddenAt: null,
    updatedAt: 300,
  })
})

test('一覧から始めた各教材は選択順と一覧への帰り先を受け取る', () => {
  const files = [
    'VocabStudy.jsx',
    'KotenStudy.jsx',
    'KotenGrammarStudy.jsx',
    'KotenCultureStudy.jsx',
    'KotenInterpretationPrep.jsx',
    'KotenInterpretationQuiz.jsx',
    'KanbunStudy.jsx',
    'KanbunKundokuQuiz.jsx',
    'ListeningQuiz.jsx',
  ]
  const sources = Object.fromEntries(files.map((file) => [
    file,
    readFileSync(new URL(`../src/screens/${file}`, import.meta.url), 'utf8'),
  ]))
  for (const file of files) {
    assert.match(sources[file], /params\.preserveOrder|params\.returnTo/, file)
  }
  for (const file of [
    'VocabStudy.jsx',
    'KotenGrammarStudy.jsx',
    'KotenCultureStudy.jsx',
    'KotenInterpretationQuiz.jsx',
    'KanbunStudy.jsx',
    'KanbunKundokuQuiz.jsx',
    'ListeningQuiz.jsx',
  ]) {
    assert.match(sources[file], /params\.returnTo\?\.screen/, `${file}: 一覧への帰り先`)
  }

  const math = readFileSync(new URL('../src/screens/MathSolve.jsx', import.meta.url), 'utf8')
  const writing = readFileSync(new URL('../src/screens/WritingPlay.jsx', import.meta.url), 'utf8')
  const readingPrep = readFileSync(new URL('../src/screens/ReadingPrep.jsx', import.meta.url), 'utf8')
  const reader = readFileSync(new URL('../src/screens/Reader.jsx', import.meta.url), 'utf8')
  const summary = readFileSync(new URL('../src/screens/ReadingSummary.jsx', import.meta.url), 'utf8')
  assert.match(math, /params\.problemIds/)
  assert.match(math, /params\.returnTo\?\.screen/)
  assert.match(writing, /params\.returnTo\?\.screen/)
  assert.match(readingPrep, /returnTo: params\.returnTo/)
  assert.match(reader, /readingSummary', \{ passageId, returnTo: params\.returnTo \}/)
  assert.match(summary, /教材一覧へ戻る/)
})
