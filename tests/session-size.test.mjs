// 「1回の問題数」の選択肢の回帰テスト。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

import {
  answeredQuizIndexes,
  answeredSessionIndexes,
  restartSessionCount,
} from '../src/lib/session.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('選べる問題数は 5・10・20・30・50・100・200 と「全部」', () => {
  const source = read('src/components/SessionSize.jsx')
  const options = /SESSION_SIZE_OPTIONS = \[([^\]]+)\]/.exec(source)?.[1]
  assert.ok(options, '選択肢の一覧が見つからない')
  assert.deepEqual(
    options.split(',').map((value) => Number(value.trim())),
    [5, 10, 20, 30, 50, 100, 200],
  )
  // 並びの最後は必ず「全部」。
  assert.match(source, /size === SESSION_SIZE_ALL \? '全部'/)
  assert.match(source, /SESSION_SIZE_OPTIONS\.filter\(\(size\) => !pool \|\| size < pool\),\s*\n\s*SESSION_SIZE_ALL,/)
})

test('設定メニューの「1回の問題数」も同じ並びを使う', () => {
  const panel = read('src/components/SpeechSettings.jsx')
  assert.match(panel, /import \{ SESSION_SIZE_ALL, SESSION_SIZE_OPTIONS \}/)
  assert.match(panel, /const SESSION_SIZES = \[\.\.\.SESSION_SIZE_OPTIONS, SESSION_SIZE_ALL\]/)
  assert.doesNotMatch(panel, /\[5, 10, 15, 20\]/)
  assert.match(panel, /SESSION_SIZE_ALL \? '全部'/)
})

test('「全部」を選ぶと、その教材の在庫すべてで組み直す', () => {
  const sizes = read('src/components/SessionSize.jsx')
  // 保存は0（全部）。画面ごとの在庫数へ読み替えてから使う。
  assert.match(sizes, /if \(size === SESSION_SIZE_ALL\) return max/)
  assert.match(sizes, /const resolvedSize = size === SESSION_SIZE_ALL \? \(pool \?\? SESSION_SIZE_ALL\) : size/)
  // 在庫数を数えてから設定を読む（あとに読むと「全部」が10に潰れる）
  for (const name of ['VocabStudy', 'VocabQuiz', 'PhraseStudy', 'PhraseQuiz', 'DictationPlay', 'GrammarQuiz', 'ListeningQuiz']) {
    const source = read(`src/screens/${name}.jsx`)
    assert.doesNotMatch(source, /useSessionSize\(\)/, `${name} が在庫数を渡していない`)
    assert.ok(
      source.indexOf('const [poolSize]') < source.indexOf('useSessionSize('),
      `${name} は在庫数を数えてから設定を読む`,
    )
  }
})

test('学習マップの「一度に解く問題数」も同じ並びを使う', () => {
  const map = read('src/screens/EnglishMap.jsx')
  assert.match(map, /import \{ SESSION_SIZE_ALL, SESSION_SIZE_OPTIONS \}/)
  assert.match(map, /\[\.\.\.SESSION_SIZE_OPTIONS, SESSION_SIZE_ALL\]/)
  assert.match(map, /一度に解く問題数/)
  assert.match(map, /'全部を解読'/)
  assert.doesNotMatch(map, /\[10, 20, 100\]/)
  // 「全部」は0で渡し、デッキ作成側が在庫すべてを出す。
  const sizes = read('src/components/SessionSize.jsx')
  assert.match(sizes, /export const SESSION_SIZE_ALL = 0/)
  const session = read('src/lib/session.js')
  assert.ok(session.includes('return size ? pool.slice(0, size) : pool'))
})

test('問題数を選ぶ画面は、教材の在庫数を渡している（渡さないと「全部」が出ない）', () => {
  const screens = readdirSync(new URL('../src/screens', import.meta.url))
    .filter((name) => name.endsWith('.jsx'))
    .map((name) => `src/screens/${name}`)
    .filter((path) => read(path).includes('<SessionCounter'))

  assert.ok(screens.length >= 18, `対象画面が少なすぎる（${screens.length}）`)
  for (const path of screens) {
    const counter = /<SessionCounter[\s\S]*?\/>/.exec(read(path))?.[0] ?? ''
    assert.match(counter, /max=\{/, `${path} が在庫数を渡していない`)
  }
})

test('問題数を増やす／進捗以上を選ぶと、進捗を保ったまま出題を追加する', () => {
  const sizes = read('src/components/SessionSize.jsx')
  // いちばん先まで進んだ位置（答えた問題）以下に減らすときだけ、数え直しにする。
  assert.match(sizes, /restart: resolvedSize <= Math\.max\(index, reached\)/)
  // 減らしても答えた分は消さないので、「破棄」の確認は出さずにそのまま変える。
  assert.doesNotMatch(sizes, /破棄|pendingDiscard|discard/)
  assert.match(sizes, /答えた分の記録と結果はそのまま残り、番号だけを1から数え直します/)

  const session = read('src/lib/session.js')
  assert.match(session, /export function growDeck\(existingDeck, keepCount, freshDeck, targetSize\)/)
})

test('いまの番号より少なくすると、答えた問題を結果に残したまま、まだ答えていない問題から数え直す', () => {
  const deck = Array.from({ length: 10 }, (_, index) => ({ id: `q${index + 1}` }))
  const fresh = [{ id: 'q2' }, { id: 'n1' }, { id: 'n2' }, { id: 'q9' }, { id: 'n3' }]

  // テスト：7問答えて、7問目を表示中。5問にすると、残りの3問に新しい2問を足して1問目から。
  const answered = answeredQuizIndexes(6, { 6: 'correct' })
  assert.deepEqual(answered, [0, 1, 2, 3, 4, 5, 6])
  const quiz = restartSessionCount(deck, answered, 6, fresh, 5)
  assert.deepEqual(quiz.deck.map((item) => item.id), ['q8', 'q9', 'q10', 'n1', 'n2'])
  assert.equal(quiz.answeredItems.length, 7)

  // 7問目をまだ答えていなければ、その問題を1問目にする。
  const unansweredCurrent = restartSessionCount(deck, answeredQuizIndexes(6, {}), 6, fresh, 5)
  assert.deepEqual(unansweredCurrent.deck.map((item) => item.id), ['q7', 'q8', 'q9', 'q10', 'n1'])
  assert.equal(unansweredCurrent.answeredItems.length, 6)

  // 前へ戻って見直している途中でも、いちばん先の問題までは答えた問題として数える。
  assert.deepEqual(answeredQuizIndexes(2, { 2: 'correct', 5: 'wrong' }), [0, 1, 2, 3, 4, 5])

  // 暗記：飛ばしたカード（2枚目）も残し、表示中のカードから先 → 飛ばしたカードの順に並べる。
  const cards = answeredSessionIndexes({ 0: true, 2: false, 3: true, 4: true, 5: null })
  assert.deepEqual(cards, [0, 2, 3, 4])
  const study = restartSessionCount(deck, cards, 5, fresh, 7)
  assert.deepEqual(study.deck.map((item) => item.id), ['q6', 'q7', 'q8', 'q9', 'q10', 'q2', 'n1'])
  assert.deepEqual(study.answeredItems.map((item) => item.id), ['q1', 'q3', 'q4', 'q5'])
})

test('問題数を変える画面はすべて、減らしても答えた分の集計を消さずに数え直す', () => {
  const screens = readdirSync(new URL('../src/screens', import.meta.url))
    .filter((name) => name.endsWith('.jsx'))
    .map((name) => `src/screens/${name}`)
    .filter((path) => read(path).includes('<SessionCounter'))

  assert.equal(screens.length, 20)
  for (const path of screens) {
    const source = read(path)
    const handler = /onResize=\{\(size, \{ restart \}\) => \{[\s\S]*?\n {8,12}\}\}/.exec(source)?.[0]
    assert.ok(handler, `${path} の onResize が (size, { restart }) を受け取っていない`)
    assert.match(handler, /if \(restart\)/, `${path} が restart で分岐していない`)
    assert.match(handler, /restartSessionCount\(deck, answeredIndexes, /, `${path} が答えた問題を残して数え直していない`)
    assert.match(handler, /growDeck\(/, `${path} が進捗を保つ growDeck を呼んでいない`)
    // 数え直しでは、正解数・「覚えた」数などの集計を0に戻さない。
    const restartBranch = handler.slice(handler.indexOf('if (restart)'), handler.indexOf('} else {'))
    assert.doesNotMatch(
      restartBranch,
      /results\.current = |setCorrectCount\(0\)|setCorrect\(0\)|setRemembered\(0\)|setResults\(|setUnknownCount\(0\)|setWeakIds\(\[\]\)|setForgottenIds\(\[\]\)/,
      `${path} が数え直しで結果の集計を消している`,
    )
    assert.match(source, /reached=\{Math\.max\(/, `${path} がいちばん先まで進んだ位置を渡していない`)
    // 結果の全問数（全枚数）には、数え直す前に答えた分を含める。数を出さない画面は持ち越さない。
    if (!path.endsWith('WritingGrammarReview.jsx')) {
      assert.match(handler, /carried\.carry\(next\.answeredItems\)/, `${path} が答えた問題を持ち越していない`)
      assert.match(source, /carried\.count \+ deck\.length|carried\.ids/, `${path} の結果が持ち越した分を数えていない`)
    }
  }
})
