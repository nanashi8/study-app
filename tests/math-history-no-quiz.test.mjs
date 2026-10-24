// 数学の歴史をたどるコースのテスト（3択の問題）は削除した（requests/2026-10-25-math-history-remove-quiz.json）。
// 話・図・使われ方・つながる学習と「理解した／まだまだ」の記録だけを残し、問題・テストの画面・入口・台帳を戻さない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

import * as mathHistory from '../src/data/math-history.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'

const ROOT = new URL('../', import.meta.url)
const read = (relative) => readFileSync(new URL(relative, ROOT), 'utf8')

test('全71話に問題がなく、問題の一覧・問題を引く関数・テストの教材名もない', () => {
  const chapters = mathHistory.MATH_HISTORY_CHAPTERS
  assert.equal(chapters.length, 71)
  assert.deepEqual(chapters.filter((chapter) => 'quiz' in chapter).map((chapter) => chapter.id), [])
  for (const name of ['MATH_HISTORY_QUESTIONS', 'MATH_HISTORY_QUIZ_DOMAIN', 'mathHistoryQuestion', 'questionsForChapters']) {
    assert.equal(name in mathHistory, false, name)
  }
  const content = LEARNING_CONTENTS.find((item) => item.id === 'math-history')
  assert.equal(content.hasQuiz, false)
  assert.equal(content.quizItems, null)
})

test('テストの画面と入口がない（目次・話の末尾・今日の学習）', () => {
  assert.equal(existsSync(new URL('src/screens/MathStoryQuiz.jsx', ROOT)), false)
  const history = read('src/screens/MathHistory.jsx')
  const story = read('src/screens/MathStory.jsx')
  for (const [file, source] of [['MathHistory.jsx', history], ['MathStory.jsx', story]]) {
    assert.doesNotMatch(source, /onQuiz=|mathStoryQuiz|data-math-story-test|data-math-history-retry|テストにチャレンジ|間違えた問題/, file)
  }
  // 入口のカードはテストのボタンを出さない（onQuiz を渡さなければ入口は「学習」1つ）。
  assert.match(read('src/components/LearningEntryCard.jsx'), /\{onQuiz && \(/)
  assert.match(history, /showQuizStatus=\{false\}/)
})

test('問題を参照していたファイルが src・tests・scripts・docs に残っていない', () => {
  const pattern = 'MATH_HISTORY_QUESTIONS|MATH_HISTORY_QUIZ_DOMAIN|questionsForChapters|mathHistoryQuestion|mathStoryQuiz|MathStoryQuiz|chapter\\.quiz|math-history-no-calc'
  let found = ''
  try {
    found = execFileSync('git', ['grep', '-n', '-E', pattern, '--', 'src', 'tests', 'scripts', 'docs', ':!tests/math-history-no-quiz.test.mjs'], {
      cwd: ROOT,
      encoding: 'utf8',
    })
  } catch (error) {
    if (error.status !== 1) throw error
  }
  assert.equal(found, '')
  for (const file of ['docs/audits/math-history-no-calc.json', 'scripts/checks/math-history-no-calc.mjs', 'tests/math-history-no-calc.test.mjs']) {
    assert.equal(existsSync(new URL(file, ROOT)), false, file)
  }
  const ledger = JSON.parse(read('docs/audits/content-audit-ledger.json'))
  assert.equal(ledger.questionBanks.find((bank) => bank.id === 'math-history'), undefined)
})

test('画面の一覧・数学アプリ・設定・ナビ・出題バランスの対象にテストの画面の名前がない', () => {
  for (const file of ['src/App.jsx', 'src/lib/appHome.js', 'src/lib/contentSettings.js', 'src/lib/navigationPolicy.js', 'src/components/VocabMixConsole.jsx']) {
    assert.doesNotMatch(read(file), /mathStoryQuiz|MathStoryQuiz/, file)
  }
  assert.match(read('src/App.jsx'), /\bmathStory: /)
  assert.match(read('src/App.jsx'), /\bmathHistory: /)
})
