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

  assert.equal(result.learnerFiles, 290)
  assert.equal(result.learnerJapaneseEntries, 14110)
  assert.equal(result.learnerUniqueJapaneseEntries, 10847)
  assert.equal(result.sourceFiles, 729)
  assert.equal(result.sourceJapaneseEntries, 196463)
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
