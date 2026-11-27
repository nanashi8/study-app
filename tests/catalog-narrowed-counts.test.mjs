import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

import { wordsByLevel } from '../src/data/vocab.js'
import {
  VOCAB_CATALOG_STATUS_COUNT_KEYS,
  VOCAB_CATALOG_STATUS_FILTER_OPTIONS,
  vocabularyCatalogFieldRows,
  vocabularyCatalogRows,
  vocabularyCatalogSnapshotRows,
  vocabularyCatalogStatusCounts,
  vocabularyCatalogStatusRows,
  vocabularyCatalogStatusSnapshot,
} from '../src/lib/vocabCatalog.js'

// 一覧を確認で絞り込んだら、数は絞り込んだ範囲で出し、覚えた・まだ・正解・不正解を記録するたびに動く
// （requests/2026-11-27-catalog-narrowed-counts.json）。

const NOW = Date.UTC(2026, 10, 27, 3)
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const memoryEntry = (judgment) => ({ memory: { lastJudgment: judgment, lastAt: NOW - 1000 } })
const testEntry = (result) => ({ memory: {}, test: { lastResult: result, lastAt: NOW - 1000 } })

function sampleSrs(words) {
  const srs = {}
  words.forEach((word, index) => {
    if (index % 5 === 0) srs[word.id] = memoryEntry('remembered')
    else if (index % 5 === 1) srs[word.id] = memoryEntry('forgot')
    else if (index % 5 === 2) srs[word.id] = testEntry('correct')
    else if (index % 5 === 3) srs[word.id] = testEntry('wrong')
  })
  return srs
}

const levelWords = wordsByLevel('pre2')

test('内訳は渡した（絞り込んだ）行だけを数え、学習とテストの3つの数の和が母数になる', () => {
  const srs = sampleSrs(levelWords)
  const rows = vocabularyCatalogRows(levelWords, srs, { now: NOW })
  const fieldId = rows.find((row) => row.fieldId)?.fieldId
  const fieldRows = vocabularyCatalogFieldRows(rows, fieldId)
  assert.ok(fieldRows.length > 0 && fieldRows.length < rows.length, '分野で絞ると全体より少ない')
  for (const activity of ['memory', 'test']) {
    const summary = vocabularyCatalogStatusCounts(fieldRows, activity)
    assert.equal(summary.total, fieldRows.length)
    const keys = VOCAB_CATALOG_STATUS_COUNT_KEYS[activity]
    assert.equal(keys.reduce((sum, key) => sum + summary.counts[key], 0), fieldRows.length)
    for (const key of keys) {
      const expected = fieldRows.filter((row) => (activity === 'test' ? row.testStatus : row.memoryStatus) === key).length
      assert.equal(summary.counts[key], expected, `${activity}:${key}`)
    }
    assert.equal(summary.recorded, fieldRows.length - summary.counts[keys[2]])
  }
})

test('スワイプで記録すると、作り直した行の内訳がその場で動く', () => {
  const words = levelWords.slice(0, 30)
  const srs = {}
  const before = vocabularyCatalogStatusCounts(vocabularyCatalogRows(words, srs, { now: NOW }), 'memory')
  assert.deepEqual(before.counts, { learned: 0, reviewing: 0, unlearned: 30 })
  const afterRemember = { ...srs, [words[0].id]: memoryEntry('remembered') }
  const afterForgot = { ...afterRemember, [words[1].id]: memoryEntry('forgot') }
  assert.deepEqual(
    vocabularyCatalogStatusCounts(vocabularyCatalogRows(words, afterForgot, { now: NOW }), 'memory').counts,
    { learned: 1, reviewing: 1, unlearned: 28 },
  )
  const afterTest = { ...afterForgot, [words[2].id]: testEntry('correct'), [words[3].id]: testEntry('wrong') }
  assert.deepEqual(
    vocabularyCatalogStatusCounts(vocabularyCatalogRows(words, afterTest, { now: NOW }), 'test').counts,
    { correct: 1, incorrect: 1, unanswered: 28 },
  )
})

test('学習状況の絞り込み6種は、絞り込んだときの語を母数に固定し、記録で状況が変わっても数に残す', () => {
  const srs = sampleSrs(levelWords)
  const rows = vocabularyCatalogRows(levelWords, srs, { now: NOW })
  const statuses = VOCAB_CATALOG_STATUS_FILTER_OPTIONS.map((option) => option.id).filter((id) => id !== 'all')
  assert.equal(statuses.length, 6)
  assert.equal(vocabularyCatalogStatusSnapshot(rows, 'all'), null)
  for (const status of statuses) {
    const snapshot = vocabularyCatalogStatusSnapshot(rows, status)
    const matched = vocabularyCatalogStatusRows(rows, status)
    assert.ok(matched.length > 0, status)
    assert.equal(snapshot.size, matched.length, status)
    const activity = status.startsWith('test') ? 'test' : 'memory'
    // 絞り込んだ語の1つを、絞り込みの状況から外れる記録にする。
    const target = matched[0].word
    const changed = {
      ...srs,
      [target.id]: activity === 'test'
        ? { ...srs[target.id], memory: srs[target.id]?.memory ?? {}, test: { lastResult: status === 'testCorrect' ? 'wrong' : 'correct', lastAt: NOW } }
        : { ...srs[target.id], memory: { lastJudgment: status === 'memoryLearned' ? 'forgot' : 'remembered', lastAt: NOW } },
    }
    const nextRows = vocabularyCatalogRows(levelWords, changed, { now: NOW })
    const kept = vocabularyCatalogSnapshotRows(nextRows, snapshot)
    assert.equal(kept.length, matched.length, `${status}: 記録しても母数は変わらない`)
    assert.ok(kept.some((row) => row.word.id === target.id), `${status}: 記録した語が残る`)
    assert.equal(vocabularyCatalogStatusRows(nextRows, status).length, matched.length - 1, `${status}: いまの状況で絞り直すと減る`)
    const beforeCounts = vocabularyCatalogStatusCounts(vocabularyCatalogSnapshotRows(rows, snapshot), activity).counts
    const afterCounts = vocabularyCatalogStatusCounts(kept, activity).counts
    assert.notDeepEqual(afterCounts, beforeCounts, `${status}: 内訳が動く`)
  }
})

test('3つの一覧の部品は、絞り込んだ行で件数の行と学習・テストのタブを数える', () => {
  const row = read('src/components/VocabularyHistoryRow.jsx')
  assert.match(row, /export function CatalogRecordCounts/)
  assert.match(row, /vocabularyCatalogStatusCounts\(rows, activity\)/)

  const vocab = read('src/screens/VocabDecks.jsx')
  assert.match(vocab, /<CatalogRecordCounts\s+rows=\{filteredRows\}/)
  assert.match(vocab, /vocabularyCatalogRecordedRows\(filteredRows, 'memory'\)/)
  assert.match(vocab, /vocabularyCatalogRecordedRows\(filteredRows, 'test'\)/)
  assert.match(vocab, /vocabularyCatalogSnapshotRows\(fieldRows, statusSnapshot\.ids\)/)
  assert.match(vocab, /onChange=\{\(event\) => chooseStatusFilter\(event\.target\.value\)\}/)
  assert.doesNotMatch(vocab, /fieldRows\.length\.toLocaleString/, 'タブと件数の行に分野だけの母数を出さない')
  assert.equal((vocab.match(/<VocabularyCatalog\b/g) ?? []).length, 3, '級・分野・単語帳の3画面')

  const catalog = read('src/components/LearningContentCatalog.jsx')
  assert.match(catalog, /<CatalogRecordCounts\s+rows=\{filteredRows\}/)
  assert.match(catalog, /vocabularyCatalogRecordedRows\(filteredRows, 'memory'\)/)
  assert.match(catalog, /vocabularyCatalogRecordedRows\(filteredRows, 'test'\)/)
  assert.doesNotMatch(catalog, /vocabularyCatalogRecordedRows\(rows,/)
  assert.doesNotMatch(catalog, /\{rows\.length\.toLocaleString\('ja-JP'\)\}\{content\.unit\}/)

  const normal = read('src/components/NormalLearningRecordList.jsx')
  assert.match(normal, /<CatalogRecordCounts\s+rows=\{rows\}/)

  // 部品を使うファイルは必ず読み込む（読み込み忘れは画面ごと落ちる）。
  for (const [path, source] of [['src/screens/VocabDecks.jsx', vocab], ['src/components/LearningContentCatalog.jsx', catalog], ['src/components/NormalLearningRecordList.jsx', normal]]) {
    assert.match(source, /import \{[^}]*\bCatalogRecordCounts,[^}]*\} from '[^']*VocabularyHistoryRow\.jsx'/, `${path}: CatalogRecordCounts を読み込む`)
  }

  // 3つの部品のほかに、学習済・テスト済を数える件数の行を残さない。
  for (const path of ['src/screens/VocabDecks.jsx', 'src/components/LearningContentCatalog.jsx', 'src/components/NormalLearningRecordList.jsx']) {
    assert.doesNotMatch(read(path), /'テスト済' : '学習済'/, path)
  }
})

test('通常の一覧を使う画面はすべて、絞り込んだ項目をそのまま一覧へ渡す（部品が渡された項目で数える）', () => {
  const screens = readdirSync(new URL('../src/screens/', import.meta.url))
    .filter((name) => name.endsWith('.jsx'))
    .filter((name) => read(`src/screens/${name}`).includes('<NormalLearningRecordList'))
  assert.ok(screens.length >= 10, screens.join(','))
  for (const name of screens) {
    const source = read(`src/screens/${name}`)
    for (const match of source.matchAll(/<NormalLearningRecordList([\s\S]*?)\/?>/g)) {
      assert.match(match[1], /\bitems=\{/, `${name}: items を渡す`)
    }
  }
})

test('詳細から戻っても、学習状況で絞り込んだ語（記録で状況が変わった語をふくむ）と内訳を保つ', async () => {
  const { catalogReturnState, readCatalogReturnState } = await import('../src/lib/catalogReturnState.js')
  const srs = sampleSrs(levelWords)
  const rows = vocabularyCatalogRows(levelWords, srs, { now: NOW })
  const statuses = VOCAB_CATALOG_STATUS_FILTER_OPTIONS.map((option) => option.id).filter((id) => id !== 'all')
  for (const status of statuses) {
    const snapshot = vocabularyCatalogStatusSnapshot(rows, status)
    const target = vocabularyCatalogStatusRows(rows, status)[0].word
    const activity = status.startsWith('test') ? 'test' : 'memory'
    // 一覧でスワイプして状況を変えてから、詳細へ移る。
    const changed = {
      ...srs,
      [target.id]: activity === 'test'
        ? { ...srs[target.id], memory: srs[target.id]?.memory ?? {}, test: { lastResult: status === 'testCorrect' ? 'wrong' : 'correct', lastAt: NOW } }
        : { ...srs[target.id], memory: { lastJudgment: status === 'memoryLearned' ? 'forgot' : 'remembered', lastAt: NOW } },
    }
    const saved = catalogReturnState({
      key: 'level:pre2',
      activity,
      sort: 'weight',
      direction: 'desc',
      filters: { fieldFilter: 'all', statusFilter: status },
      visible: 80,
      dismissedByActivity: { [activity]: new Set([target.id]) },
      pinnedIds: snapshot,
    })
    // 履歴の params は複製されて戻る。
    const restored = readCatalogReturnState(JSON.parse(JSON.stringify(saved)), {
      key: 'level:pre2', sorts: ['weight'], defaultSort: 'weight', pageSize: 80,
    })
    assert.equal(restored.filters.statusFilter, status)
    assert.deepEqual([...restored.pinnedIds].sort(), [...snapshot].sort(), `${status}: 固定した語が戻る`)
    assert.ok(restored.dismissedByActivity[activity].has(target.id), `${status}: 隠した行も戻る`)
    const back = vocabularyCatalogSnapshotRows(vocabularyCatalogRows(levelWords, changed, { now: NOW }), restored.pinnedIds)
    assert.equal(back.length, snapshot.size, `${status}: 戻っても母数は同じ`)
    assert.ok(back.some((row) => row.word.id === target.id), `${status}: 状況を変えた語も残る`)
  }
  // 絞り込んでいない一覧は固定しない。
  assert.equal(readCatalogReturnState(catalogReturnState({ key: 'k' }), { key: 'k', pageSize: 80 }).pinnedIds, null)
})

test('英単語の一覧は固定した語を戻り状態に載せ、戻ったらそれを使う', () => {
  const vocab = read('src/screens/VocabDecks.jsx')
  assert.match(vocab, /pinnedIds: statusSnapshot\.ids/)
  assert.match(vocab, /statusFilter !== 'all' && restored\?\.pinnedIds\s*\?\s*restored\.pinnedIds/)
})
