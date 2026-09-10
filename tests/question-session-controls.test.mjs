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

// 語源カードの暗記・テストも同じバーを使う（問題数を選べる18画面の母数とは別に数える）。
const ETYMOLOGY_SCREENS = [
  'src/screens/EtymologyQuiz.jsx',
  'src/screens/EtymologyStudy.jsx',
]

test('暗記・テストの全20画面は上部を1本のバーにまとめ、数字進捗も中に入れ、「×」を置かない', () => {
  const controls = read('src/components/QuestionSessionControls.jsx')
  // 途中でやめる操作は上部バーの共通「戻る」が受け持つ。バー側に終了の差し込み口を残さない。
  assert.doesNotMatch(controls, /leadingAction/)

  const screens = [...QUIZ_SCREENS, ...STUDY_SCREENS, ...ETYMOLOGY_SCREENS]
  assert.equal(screens.length, 20)
  for (const path of screens) {
    const source = read(path)
    // バーは画面の先頭。上に「×」や「2/10」だけの行を戻さない。
    assert.match(source, /flex-col[^\n]*>\s*<QuestionSessionControls/, `${path}: 共通バーの上に別の行がある`)
    assert.equal((source.match(/<QuestionSessionControls/g) ?? []).length, 1, `${path}: バーが1本でない`)
    assert.equal((source.match(/<SessionCounter/g) ?? []).length, 1, `${path}: 数字進捗が1つでない`)
    assert.match(source, /progressControl=\{\(\s*<SessionCounter/, `${path}: 数字進捗がバーの中にない`)
    assert.doesNotMatch(source, /leadingAction=/, `${path}: バーに終了ボタンを差し込んでいる`)
    assert.doesNotMatch(
      source,
      /aria-label=[^\n]*(?:やめる|解読を中断|復習を終わる)/,
      `${path}: 上部の戻ると同じ働きの「×」が残っている`,
    )
  }
})

test('進み具合はバーの下端に細く示し、自動送りの切替や数字の枠と重ねない', () => {
  const controls = read('src/components/QuestionSessionControls.jsx')
  const ui = read('src/components/ui.jsx')
  // className に高さを重ねても既定の h-2.5 が勝つので、高さは専用の口で差し替える。
  assert.match(ui, /heightClassName = 'h-2\.5'/)
  assert.match(ui, /cx\(heightClassName, 'w-full overflow-hidden rounded-full bg-brand-100', className\)/)
  assert.match(controls, /'relative flex min-h-12 shrink-0 items-center/)
  assert.match(
    controls,
    /<ProgressBar\s+value=\{progressValue\}\s+color=\{progressColor\}\s+heightClassName="h-1"\s+className="pointer-events-none absolute inset-x-0 bottom-0"/,
  )
  // 中央は数字進捗と切替を横に並べるだけ。進捗バーを重ねず、枠の中に下余白も作らない。
  const center = controls.slice(
    controls.indexOf('data-question-session-progress\n'),
    controls.indexOf('data-question-next'),
  )
  assert.match(center, /\{progressControl\}\s*\{showAutoAdvance && \(/)
  assert.doesNotMatch(center, /<ProgressBar|absolute|pb-2/)
  // テストでは前へ・次へを細くして、中央の数字と切替に幅を回す。
  assert.match(controls, /showAutoAdvance \? 'min-w-12 shrink-0' : 'min-w-11 flex-1'/)
})

test('テストの次へ進むボタンは「次の問題へ」と書き、龍脈の解読だけ物語の「断片」を使う', () => {
  for (const path of ['src/screens/VocabQuiz.jsx', 'src/screens/PhraseQuiz.jsx']) {
    const source = read(path)
    assert.match(source, /: isDragonVein \? '次の断片へ' : '次の問題へ'\}/, `${path}: 通常のテストに「次の断片へ」が出る`)
  }
})

// 英単語・英熟語・古文単語・古典文法・古典常識・漢文の暗記カードは、
// 前へ・数字進捗・次へ・意味の表示切替・保存を1本のバーへまとめる。
// 途中でやめる操作は上部の共通「戻る」に任せ、このバーには「×」を置かない。
const CARD_STUDY_SCREENS = [
  'src/screens/VocabStudy.jsx',
  'src/screens/PhraseStudy.jsx',
  'src/screens/KotenStudy.jsx',
  'src/screens/KotenGrammarStudy.jsx',
  'src/screens/KotenCultureStudy.jsx',
  'src/screens/KanbunStudy.jsx',
]

test('全6暗記カードが前後移動・数字進捗・意味・保存を1本のバーにまとめる', () => {
  const controls = read('src/components/QuestionSessionControls.jsx')

  assert.doesNotMatch(controls, /leadingAction/)
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
    assert.doesNotMatch(study, /leadingAction=/, `${path}: 上部の戻ると重なる「×」がバーに残っている`)
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
  // 単語の保存先はマイ単語を含む「単語帳」1つにまとめ、カード上に保存ボタンを2つ並べない。
  assert.match(vocab, /data-vocab-word-book-toggle/)
  assert.equal((vocab.match(/data-vocab-word-book-toggle/g) ?? []).length, 1)
  assert.doesNotMatch(vocab, /data-vocab-my-list-toggle|data-vocab-word-list-button/)
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
    'src/screens/VocabStudy.jsx': ['単語帳', '入れる単語帳を選ぶ'],
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
