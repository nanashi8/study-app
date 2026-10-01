import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { auditLearnerJapanese, jsxTextLineJoins } from '../scripts/audit-learner-japanese.mjs'

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')

const SHARED_RESULT_ENTRIES = [
  '../src/screens/VocabStudy.jsx',
  '../src/screens/VocabQuiz.jsx',
  '../src/screens/PhraseStudy.jsx',
  '../src/screens/PhraseQuiz.jsx',
  '../src/screens/ListeningQuiz.jsx',
  '../src/screens/DictationPlay.jsx',
  '../src/screens/GrammarQuiz.jsx',
]

const DEDICATED_RESULT_SURFACES = [
  ['../src/screens/MathSolve.jsx', /if \(finished\)/],
  ['../src/screens/WritingPlay.jsx', /if \(finished && completedResult\)/],
  ['../src/screens/WritingGrammarReview.jsx', /if \(finished\)/],
  ['../src/screens/Diagnostic.jsx', /phase === 'result'/],
  ['../src/screens/KotenStudy.jsx', /if \(done\)/],
  ['../src/screens/KotenQuiz.jsx', /if \(done\)/],
  ['../src/screens/KotenInterpretationQuiz.jsx', /if \(done\)/],
  ['../src/screens/KotenGrammarStudy.jsx', /if \(done\)/],
  ['../src/screens/KotenGrammarQuiz.jsx', /if \(done\)/],
  ['../src/screens/KotenCultureStudy.jsx', /if \(done\)/],
  ['../src/screens/KotenCultureQuiz.jsx', /if \(done\)/],
  ['../src/screens/KanbunStudy.jsx', /if \(done\)/],
  ['../src/screens/KanbunQuiz.jsx', /if \(done\)/],
  ['../src/screens/KanbunKundokuQuiz.jsx', /if \(done\)/],
]

const RESULT_COPY_FORBIDDEN = /最新が[「『]|今回の間隔アップ|長期定着(?:へ|への)到達|復習の段階|復習段階|定着段階|記憶段階|よく覚えた段階|覚えている見込み|忘れやすさの予測|復習しない場合の予測|覚え具合|復習期限|期限前の語|今日が期限|次の期限|語が期限|優先度/u

test('学習者向け日本語は画面・部品・自動生成文を全件監査する', async () => {
  const result = await auditLearnerJapanese()

  // 2026-09-26、つづりが似た語の語源（src/data/lookalike-*.js・src/lib/lookalikeOrigins.js・
  // src/components/LookalikeOrigins.jsx）を足して 5ファイル増えた。
  // 2026-09-27、ログイン画面（src/screens/Login.jsx）とログイン・保存の表示を外して 1ファイル減った。
  // 2026-09-28、画面下部の枠（読み上げ・出題・単語帳の登録先）で6ファイル増えた（src/components/StudyMix.jsx・
  // src/components/WordBookSlot.jsx・src/lib/cardSpeechPanel.js・src/lib/studyDock.js・src/lib/studyMix.js・src/lib/wordBookSlot.js）。
  // 2026-09-28、形は似ているが元の語がちがう語のまとまり（src/data/lookalike-forms.js・src/lib/lookalikeForms.js）で
  // 2ファイル増えた（画面の文言を持つのは src/lib/lookalikeForms.js）。
  // 2026-09-29、数学の入試演習で画面・部品・lib が7ファイル（src/screens/MathExam.jsx・MathExamUnit.jsx・
  // MathExamSolve.jsx・src/components/MathAnswerPad.jsx・MathExamFigure.jsx・src/lib/mathExam.js・mathExamLog.js）、
  // 問題データが11ファイル（src/data/math-exam.js と src/data/math-exam/ の10ファイル）増えた。
  // 2026-09-29、名作に親しむを全文表示にして、画面・部品・lib が3ファイル増えた（src/components/LiteratureFullText.jsx・
  // LiteratureSentenceSheet.jsx・src/lib/literature-sentence-analysis.js・punctuation-notes.js の4つを足し、
  // src/components/LiteratureSceneNavigator.jsx を外した）。ソース全体は、文ごとの台帳（literature-sentences.js・
  // literature-classics-notes.js・literature-structures/ の8ファイル）を足し、英語名作の古い全文の場面ファイル・
  // 訳の修正台帳（src/data/literature-full-text/ の12ファイル）を外して、差し引き1ファイル増えた。
  // 2026-09-30、中学の社会・理科で画面・部品・lib が10ファイル（src/screens/SubjectHome.jsx・SubjectUnit.jsx・
  // SubjectStudy.jsx・SubjectQuiz.jsx・SubjectPractice.jsx・Credits.jsx・src/components/SubjectFigure.jsx・
  // SubjectText.jsx・src/lib/subjectPractice.js・subjectText.js）、単元と出典のデータが12ファイル
  // （src/data/subjects/ の11ファイルと src/data/credits.js）増えた。
  // 2026-09-30、自作カード（テンプレート・教科・カテゴリー・CSV）で画面・部品・lib が9ファイル増えた（src/lib/customCards.js・
  // customLibrary.js・customEntryForm.js・customCardsCsv.js・src/components/CustomCardForm.jsx・CustomCardItems.jsx・
  // CustomCardsEntry.jsx・src/screens/CustomCardStudy.jsx・CustomCardQuiz.jsx）。
  // 2026-09-30、自作カードの編集（選んだカードの移動・統合・削除）で2ファイル増えた（src/lib/customCardsEdit.js・
  // src/components/CustomCardEdit.jsx）。
  // 2026-09-30、社会・理科の要点と演習の図で、図を描く部品が8ファイル（src/components/SubjectDiagrams.jsx・
  // SubjectScienceDiagrams.jsx・SubjectGeographyDiagrams.jsx・SubjectHistoryDiagrams.jsx・SubjectCivicsDiagrams.jsx・
  // SubjectMapReadingDiagrams.jsx・SubjectMapFigures.jsx・SubjectClimateFigure.jsx）、図のデータと計算が3ファイル
  // （src/data/subjects/figureKinds.js・figureMath.js・projection.js）増えた。語句の解説の書き直しで、読みの辞書
  // （src/data/subjects/readings.js）に印旛沼・滝沢馬琴・原敬の3語（語と読みで6表記）を足した。
  // 同じ日、全102単元を読み直して、読み方が特別な地名・人名・用語の77語を読みの辞書に足し（語と読みで154表記）、
  // カタカナで読む6語の読みをカタカナにし、出典の1件（国勢調査）と直した文で、教材の日本語が 232966 から 233134 になった。
  // 2026-10-01、疑問詞・関係詞の語の「文の中での働き」で、働きのデータ（src/data/word-grammar-roles.js）と
  // 働きの欄の部品（src/components/GrammarRoles.jsx）の2ファイルが増え、画面の文言が7表記（重複なし5）、
  // 教材の日本語が 233134 から 233340 になった（requests/2026-10-01-wh-word-grammar-roles.json）。
  assert.equal(result.learnerFiles, 341)
  assert.equal(result.learnerJapaneseEntries, 17565)
  assert.equal(result.learnerUniqueJapaneseEntries, 13052)
  assert.equal(result.sourceFiles, 816)
  assert.equal(result.sourceJapaneseEntries, 233340)
  assert.equal(result.issues.length, 0)
})

test('JSXの地の文を改行でつなぐ所は、つなぎ目の前後が日本語のときだけ止める', () => {
  const source = [
    'export const Joined = () => (',
    '  <p>',
    '    この問題数は、すべての暗記・テストに使われます。',
    '    今の番号より少なくしても、記録は残ります。',
    '  </p>',
    ')',
    'export const Split = ({ count }) => (',
    '  <p>',
    "    {'この問題数は、すべての暗記・テストに使われます。'}",
    "    {`今の${count}問より少なくしても、記録は残ります。`}",
    '    全{count}語',
    '    <strong>強調</strong>',
    '    あとの文です。',
    '  </p>',
    ')',
    'export const English = () => (',
    '  <p>',
    '    English sentences',
    '    may wrap freely.',
    '  </p>',
    ')',
    'export const Mixed = () => (',
    '  <p>',
    '    級別は各4問の結果です。',
    '    1マスだけで決めない。',
    '  </p>',
    ')',
  ].join('\n')

  assert.deepEqual(jsxTextLineJoins(source), [
    { line: 3, before: 'この問題数は、すべての暗記・テストに使われます。', after: '今の番号より少なくしても、記録は残ります。' },
    { line: 24, before: '級別は各4問の結果です。', after: '1マスだけで決めない。' },
  ])
})

test('結果画面へ至る全21経路は、回答と次の行動を直接示す日本語だけを使う', () => {
  assert.equal(SHARED_RESULT_ENTRIES.length, 7)
  assert.equal(DEDICATED_RESULT_SURFACES.length, 14)
  assert.equal(SHARED_RESULT_ENTRIES.length + DEDICATED_RESULT_SURFACES.length, 21)

  const sharedSources = SHARED_RESULT_ENTRIES.map((relative) => {
    const source = read(relative)
    assert.match(source, /navigate\('sessionResult'/, `${relative} must reach the shared result`)
    return source
  })
  const dedicatedSources = DEDICATED_RESULT_SURFACES.map(([relative, marker]) => {
    const source = read(relative)
    assert.match(source, marker, `${relative} must retain its result branch`)
    return source
  })
  const resultImplementations = [
    read('../src/screens/SessionResult.jsx'),
    read('../src/components/StudyCompletionReport.jsx'),
    ...dedicatedSources,
  ]

  assert.doesNotMatch(
    [...sharedSources, ...resultImplementations].join('\n'),
    RESULT_COPY_FORBIDDEN,
  )
})
