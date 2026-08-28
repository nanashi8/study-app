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

// 英単語・英熟語・古文単語・古典文法・古典常識・漢文の暗記カードは、
// 終了・前へ・数字進捗・次へ・意味の表示切替・保存を1本のバーへまとめる。
const CARD_STUDY_SCREENS = [
  'src/screens/VocabStudy.jsx',
  'src/screens/PhraseStudy.jsx',
  'src/screens/KotenStudy.jsx',
  'src/screens/KotenGrammarStudy.jsx',
  'src/screens/KotenCultureStudy.jsx',
  'src/screens/KanbunStudy.jsx',
]

test('全6暗記カードが終了・前後移動・数字進捗・意味・保存を1本のバーにまとめる', () => {
  const controls = read('src/components/QuestionSessionControls.jsx')

  assert.match(controls, /leadingAction/)
  assert.match(controls, /progressControl/)
  assert.match(controls, /trailingActions/)

  assert.equal(CARD_STUDY_SCREENS.length, 6)
  for (const path of CARD_STUDY_SCREENS) {
    const study = read(path)
    // バーは画面の先頭。上に別のヘッダー行を戻さない。
    assert.match(
      study,
      /<div className="flex h-full flex-col">\s*<QuestionSessionControls/,
      `${path}: 共通バーの上に別のヘッダー行がある`,
    )
    assert.match(study, /leadingAction=\{\(\s*<IconButton/, `${path}: 終了がバーの中にない`)
    assert.match(study, /progressControl=\{\(\s*<SessionCounter/, `${path}: 数字進捗がバーの中にない`)
    assert.match(study, /trailingActions=\{\(\s*<>/, `${path}: 表示切替と保存がバーの中にない`)
    assert.match(study, /<RevealAnswersToggle[\s\S]*?toolbar/, `${path}: 表示切替がバー用の形でない`)
    assert.match(study, /<CardSaveToggle/, `${path}: 保存切替がない`)
    assert.equal((study.match(/<QuestionSessionControls/g) ?? []).length, 1, `${path}: バーが1本でない`)
    assert.equal((study.match(/<SessionCounter/g) ?? []).length, 1, `${path}: 数字進捗が1つでない`)
    assert.equal((study.match(/<RevealAnswersToggle/g) ?? []).length, 1, `${path}: 表示切替が1つでない`)
    assert.equal((study.match(/<CardSaveToggle/g) ?? []).length, 1, `${path}: 保存切替が1つでない`)
    // カード上の保存ボタンとの二重表示・画面ごとの音声設定ボタンは残さない。
    assert.doesNotMatch(study, /<BookmarkFilled|<Bookmark\b/, `${path}: カード側に保存ボタンが残っている`)
    assert.doesNotMatch(study, /SpeechSettingsButton/, `${path}: バーの外に音声設定が残っている`)
  }

  const vocab = read('src/screens/VocabStudy.jsx')
  assert.match(vocab, /data-vocab-my-list-toggle/)
  assert.equal((vocab.match(/data-vocab-my-list-toggle/g) ?? []).length, 1)
})

test('保存切替は共通部品で、44px以上・状態名・読み上げ名を持つ', () => {
  const source = read('src/components/CardStudyControls.jsx')

  assert.match(source, /export function CardSaveToggle/)
  assert.match(source, /data-card-save-toggle/)
  assert.match(source, /aria-pressed=\{saved\}/)
  assert.match(source, /aria-label=\{saved \? savedLabel : unsavedLabel\}/)
  assert.match(source, /min-h-11/)
  assert.match(source, /saved \? <BookmarkFilled size=\{17\} \/> : <Bookmark size=\{17\} \/>/)

  // 保存先の名前は画面ごとに違うので、読み上げ名も画面ごとに渡す。
  const labels = {
    'src/screens/VocabStudy.jsx': ['マイ単語', 'マイ単語から外す'],
    'src/screens/PhraseStudy.jsx': ['ノート', 'マイ学習ノートへ保存'],
    'src/screens/KotenStudy.jsx': ['登録', '登録単語へ追加'],
    'src/screens/KotenGrammarStudy.jsx': ['登録', '登録文法へ追加'],
    'src/screens/KotenCultureStudy.jsx': ['登録', '登録する'],
    'src/screens/KanbunStudy.jsx': ['登録', '登録する'],
  }
  for (const [path, [label, spoken]] of Object.entries(labels)) {
    const study = read(path)
    assert.match(study, new RegExp(`label="${label}"`), `${path}: 保存切替の名前がない`)
    assert.match(study, new RegExp(spoken), `${path}: 保存先を読み上げていない`)
  }
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
