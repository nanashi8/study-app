import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')

const QUIZ_SCREENS = [
  'src/screens/DictationPlay.jsx',
  'src/screens/GrammarQuiz.jsx',
  'src/screens/KanbunKundokuQuiz.jsx',
  'src/screens/KanbunQuiz.jsx',
  'src/screens/KotenCultureQuiz.jsx',
  'src/screens/KotenGrammarQuiz.jsx',
  'src/screens/KotenInterpretationQuiz.jsx',
  'src/screens/KotenQuiz.jsx',
  'src/screens/ListeningQuiz.jsx',
  'src/screens/PhraseQuiz.jsx',
  'src/screens/VocabQuiz.jsx',
]

const STUDY_SCREENS = [
  'src/screens/KanbunStudy.jsx',
  'src/screens/KotenCultureStudy.jsx',
  'src/screens/KotenGrammarStudy.jsx',
  'src/screens/KotenStudy.jsx',
  'src/screens/PhraseStudy.jsx',
  'src/screens/VocabStudy.jsx',
  'src/screens/WritingGrammarReview.jsx',
]

test('問題数を選べる全18画面で、前へ・進捗・次へを一つの共通表示にする', () => {
  const allScreens = [...QUIZ_SCREENS, ...STUDY_SCREENS]
  assert.equal(allScreens.length, 18)
  for (const path of allScreens) {
    const source = read(path)
    assert.match(source, /QuestionSessionControls/, `${path}: 前後移動がない`)
    assert.match(source, /onPrevious=/, `${path}: 前の問題へ戻れない`)
    assert.match(source, /onNext=/, `${path}: 次の問題へ進めない`)
    assert.match(source, /progressColor=/, `${path}: 共通表示へ進捗色を渡していない`)
    assert.doesNotMatch(source, /<ProgressBar/, `${path}: 進捗バーが前後移動と分離している`)
  }
})

test('正誤をすぐ示す全11テストで、正解後の自動送りを切り替えられる', () => {
  assert.equal(QUIZ_SCREENS.length, 11)
  for (const path of QUIZ_SCREENS) {
    const source = read(path)
    assert.match(source, /showAutoAdvance/, `${path}: 自動送り切替がない`)
    assert.match(source, /autoAdvanceSignal=/, `${path}: 正解と自動送りが接続されていない`)
  }
  for (const path of STUDY_SCREENS) {
    assert.doesNotMatch(read(path), /showAutoAdvance/, `${path}: 自己評価カードに正解時設定を出している`)
  }
})

test('共通操作は44px以上で、状態名と読み上げ名を持つ', () => {
  const source = read('src/components/QuestionSessionControls.jsx')
  assert.match(source, /data-question-session-controls/)
  assert.match(source, /data-question-previous/)
  assert.match(source, /data-question-next/)
  assert.match(source, /data-question-session-progress/)
  assert.match(source, /<ProgressBar/)
  assert.match(source, /data-correct-auto-advance-toggle/)
  assert.match(source, /min-h-11/g)
  assert.match(source, /前の\$\{itemLabel\}へ/)
  assert.match(source, /次の\$\{itemLabel\}へ/)
  assert.match(source, /正解したら自動で次へ進む設定はオン/)
  assert.match(source, /CORRECT_AUTO_ADVANCE_DELAY_MS = 1400/)
})

test('戻って見直した回答を二重計上せず、やり直し時だけ回答履歴を消す', () => {
  for (const path of QUIZ_SCREENS.filter((path) => !path.includes('DictationPlay') && !path.includes('Kundoku'))) {
    const source = read(path)
    assert.match(source, /useIndexedSessionState/, `${path}: 問題別の回答を保持していない`)
    assert.match(source, /clearSelections/, `${path}: やり直し時に回答を消せない`)
  }
  for (const path of STUDY_SCREENS) {
    const source = read(path)
    assert.match(source, /recordedAnswer/, `${path}: 回答済みカードを判定していない`)
    assert.match(source, /clearRecordedAnswers/, `${path}: やり直し時に回答を消せない`)
  }
})

test('英文法の並び替えは途中の語順も問題別に復元する', () => {
  const source = read('src/screens/GrammarQuiz.jsx')
  assert.match(source, /useIndexedSessionState\(i, EMPTY_ORDER_DRAFT\)/)
  assert.match(source, /initialText=\{orderDraft\.text\}/)
  assert.match(source, /clearOrderDrafts\(\)/)
})

test('古典3画面の正解操作は未定義の集計変数を参照しない', () => {
  for (const path of [
    'src/screens/KotenQuiz.jsx',
    'src/screens/KotenGrammarQuiz.jsx',
    'src/screens/KotenCultureQuiz.jsx',
  ]) {
    assert.doesNotMatch(read(path), /prevBox|previousBox|setBoxUp|setNewlyMastered/)
  }
})

test('自動送り設定は既存の設定保存に追加され、初期状態はオン', () => {
  const store = read('src/store/useStore.js')
  assert.match(store, /autoAdvanceCorrect: true/)
})
