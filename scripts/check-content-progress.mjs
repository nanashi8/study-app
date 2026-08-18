import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  LEARNING_STATUS_KEYS,
  QUIZ_STATUS_KEYS,
  statusTotal,
} from '../src/lib/contentProgress.js'
import {
  LEARNING_CONTENTS,
  LEARNING_CONTENT_GROUPS,
  buildLearningContentProgress,
} from '../src/lib/learningContentProgress.js'
import { createInitialLearningState } from '../src/store/useStore.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import {
  RESET_PRESERVED_PROGRESS_FIELDS,
  RESETTABLE_PROGRESS_FIELDS,
} from '../src/lib/progressReset.js'

const expected = [
  ['vocab', 'src/screens/VocabLevels.jsx'],
  ['usage', 'src/screens/Phrases.jsx'],
  ['grammar', 'src/screens/Grammar.jsx'],
  ['listening', 'src/screens/Listening.jsx'],
  ['dictation', 'src/screens/Dictation.jsx'],
  ['etymology', 'src/screens/Roots.jsx'],
  ['reading', 'src/screens/ReadingList.jsx'],
  ['writing', 'src/screens/Writing.jsx'],
  ['koten-vocab', 'src/screens/KotenList.jsx'],
  ['koten-grammar', 'src/screens/KotenGrammar.jsx'],
  ['koten-culture', 'src/screens/KotenCulture.jsx'],
  ['koten-reading', 'src/screens/KotenInterpretationList.jsx'],
  ['kanbun-vocab', 'src/screens/KanbunCatalog.jsx'],
  ['kanbun-grammar', 'src/screens/KanbunCatalog.jsx'],
  ['kanbun-culture', 'src/screens/KanbunCatalog.jsx'],
  ['kanbun-kundoku', 'src/screens/KanbunKundoku.jsx'],
  ['literature', 'src/screens/LiteratureLibrary.jsx'],
  ['math', 'src/screens/MathMap.jsx'],
]

const detailDisplays = [
  'src/components/LevelPicker.jsx',
  'src/components/VocabCompletionReport.jsx',
  'src/screens/Diagnostic.jsx',
  'src/screens/EtymologyPack.jsx',
  'src/screens/KanbunHome.jsx',
  'src/screens/KotenList.jsx',
  'src/screens/ReadingPrep.jsx',
  'src/screens/RootDetail.jsx',
  'src/screens/VocabDecks.jsx',
  'src/screens/VocabGroups.jsx',
  'src/screens/WordDetail.jsx',
]

assert.deepEqual(LEARNING_CONTENTS.map((content) => content.id), expected.map(([id]) => id))
assert.deepEqual(LEARNING_CONTENT_GROUPS.map((group) => group.id), [
  'english',
  'classics',
  'kanbun',
  'other',
])

const rows = buildLearningContentProgress(createInitialLearningState())
for (const row of rows) {
  const ids = row.items.map((item) => item?.id).filter(Boolean)
  assert.ok(ids.length > 0, `${row.id}: 教材母集団が空です`)
  assert.equal(new Set(ids).size, ids.length, `${row.id}: 教材IDが重複しています`)
  assert.equal(statusTotal(row.progress.learning, LEARNING_STATUS_KEYS), row.progress.total)
  assert.equal(statusTotal(row.progress.quiz, QUIZ_STATUS_KEYS), row.progress.quizTotal)
  assert.equal(row.progress.learning.unlearned, row.progress.total)
  assert.equal(row.progress.quiz.unanswered, row.progress.quizTotal)
  assert.ok(row.quizUnit, `${row.id}: クイズ側の単位がありません`)
  if (row.quizItems) {
    const quizIds = row.quizItems.map((item) => item?.id).filter(Boolean)
    assert.equal(new Set(quizIds).size, quizIds.length, `${row.id}: 出題IDが重複しています`)
    assert.equal(row.progress.quizTotal, quizIds.length, `${row.id}: クイズ母数が出題数と違います`)
    assert.ok(row.quizDomain, `${row.id}: 出題単位の集計に domain がありません`)
  } else {
    assert.equal(row.progress.quizTotal, row.progress.total, `${row.id}: クイズ母数が教材数と違います`)
  }
}

// 出題単位で数える教材は、その画面のクイズ結果保存とセットで成立する。
for (const [file, marker] of [
  ['src/screens/KotenGrammarQuiz.jsx', "recordQuizResult('koten-grammar', question.id"],
  ['src/screens/KotenCultureQuiz.jsx', "recordQuizResult('koten-culture', question.id"],
]) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  assert.ok(source.includes(marker), `${file}: 出題単位のクイズ結果保存がありません`)
}

for (const [id, file] of expected) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  assert.ok(
    source.includes('LearningStatusBars') || source.includes('statusFor='),
    `${id}: 主画面 ${file} に共通3色バーがありません`,
  )
}

for (const file of detailDisplays) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  assert.ok(
    source.includes('LearningStatusBars') || source.includes('StatusDistributionBar'),
    `${file}: 詳細表示に共通3色バーがありません`,
  )
}

for (const [file, marker] of [
  ['src/components/ReadingComprehensionCheck.jsx', "recordContentQuizResult('reading', passageId"],
  ['src/screens/LiteratureReader.jsx', "'literature',"],
  ['src/screens/MathSolve.jsx', "recordContentQuizResult('math', p.id"],
]) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  assert.ok(source.includes(marker), `${file}: 教材別クイズ結果の保存がありません`)
}

for (const file of ['src/screens/MyLearning.jsx', 'src/screens/Progress.jsx']) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  assert.ok(source.includes('buildLearningContentProgress'), `${file}: 全教材集計を使っていません`)
  assert.ok(source.includes('LearningStatusBars'), `${file}: 共通3色バーを使っていません`)
}

// どの画面でも「全300語」「全136問」のように数え方を示す。単位なしの棒は作らない。
const barCallSites = /<(LearningStatusBars|StatusDistributionBar)\b((?:[^<>]|\n)*?)\/>/g
const unitlessBars = []
for (const relative of [
  ...expected.map(([, file]) => file),
  ...detailDisplays,
  'src/screens/MyLearning.jsx',
  'src/screens/Progress.jsx',
  'src/screens/EtymologyPack.jsx',
  'src/screens/Grammar.jsx',
  'src/screens/KanbunHome.jsx',
  'src/screens/KotenGrammar.jsx',
  'src/screens/KotenCulture.jsx',
  'src/screens/KotenInterpretationList.jsx',
  'src/screens/LiteratureLibrary.jsx',
  'src/screens/MathMap.jsx',
  'src/screens/ReadingPrep.jsx',
  'src/screens/Roots.jsx',
  'src/screens/Writing.jsx',
]) {
  const source = readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')
  for (const match of source.matchAll(barCallSites)) {
    if (!/units=|unit=/.test(match[2])) unitlessBars.push(`${relative}: ${match[0].slice(0, 60)}`)
  }
}
assert.deepEqual(unitlessBars, [], `単位のない進捗バー: ${unitlessBars.join(' / ')}`)

const barSource = readFileSync(
  new URL('../src/components/LearningStatusBars.jsx', import.meta.url),
  'utf8',
)
for (const label of ['学習済', '復習中', '未学習', '正解', '不正解', '未回答']) {
  assert.ok(barSource.includes(`label: '${label}'`), `共通バーに「${label}」がありません`)
}

const covered = [...RESETTABLE_PROGRESS_FIELDS, ...RESET_PRESERVED_PROGRESS_FIELDS]
assert.equal(new Set(covered).size, covered.length, '保存項目のリセット分類が重複しています')
assert.deepEqual([...covered].sort(), [...PERSISTED_PROGRESS_FIELDS].sort())
assert.ok(PERSISTED_PROGRESS_FIELDS.includes('contentQuizResults'))

const total = rows.reduce((sum, row) => sum + row.progress.total, 0)
const quizTotal = rows.reduce((sum, row) => sum + row.progress.quizTotal, 0)
console.log('学習コンテンツ3区分監査: OK')
console.log(`  教材: ${rows.length}カテゴリ・${total.toLocaleString('ja-JP')}項目`)
console.log(`  主画面: ${new Set(expected.map(([, file]) => file)).size}画面 / 表示漏れ0`)
console.log(`  詳細表示: ${detailDisplays.length}画面・共通部品 / 共通3色表示あり`)
console.log('  学習: 学習済・復習中・未学習 / 各カテゴリで母数一致')
console.log('  単位: 全画面の進捗バーに数え方を表示（単位なし0件）')
console.log(`  クイズ: 正解・不正解・未回答 / 出題 ${quizTotal.toLocaleString('ja-JP')}問・各カテゴリで母数一致`)
console.log(`  保存: ${PERSISTED_PROGRESS_FIELDS.length}項目 / 新規クイズ結果の往復・リセット対象を確認`)
