import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  IN_PROGRESS_SCREENS,
  completedSessionDestination,
} from '../src/lib/navigationPolicy.js'
import { useStore } from '../src/store/useStore.js'

const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const read = (path) => readFileSync(join(repoRoot, path), 'utf8')

function screenSources() {
  const directory = join(repoRoot, 'src/screens')
  return readdirSync(directory)
    .filter((name) => name.endsWith('.jsx'))
    .map((name) => ({ path: `src/screens/${name}`, source: read(`src/screens/${name}`) }))
}

test('共通完了画面7経路は、終了済みの学習・クイズではなく教材選択へ戻る', () => {
  const cases = [
    [{ engine: 'word', source: { type: 'level', levelId: '3' } }, 'vocabLevels'],
    [{ engine: 'word', source: { type: 'field', field: 'daily' } }, 'vocabGroups'],
    [{ engine: 'word', source: { type: 'levelField', levelId: '2', field: 'academic' } }, 'vocabDecks'],
    [{ engine: 'phrase', replayScreen: 'phraseQuiz' }, 'phrases'],
    [{ engine: 'listening', replayScreen: 'listeningQuiz' }, 'listening'],
    [{ engine: 'dictation', replayScreen: 'dictationPlay' }, 'dictation'],
    [{ engine: 'grammar', replayScreen: 'grammarQuiz', source: { type: 'grammarStrand' } }, 'grammarStrands'],
  ]

  for (const [params, expected] of cases) {
    const destination = completedSessionDestination(params)
    assert.equal(destination.screen, expected)
    assert.equal(IN_PROGRESS_SCREENS.has(destination.screen), false)
  }

  assert.deepEqual(completedSessionDestination({
    engine: 'word',
    returnTo: { screen: 'readingPrep', params: { passageId: 'p1' } },
  }), { screen: 'readingPrep', params: { passageId: 'p1' } })

  // 旧パラメータに学習画面や「次へ」が残っても、戻る動線へは使わない。
  assert.deepEqual(completedSessionDestination({
    engine: 'word',
    source: { type: 'level', levelId: '3' },
    returnTo: { screen: 'vocabStudy' },
    continueTo: { screen: 'vocabQuiz' },
  }), { screen: 'vocabLevels', params: {} })
})

test('完了画面の上部・画面内の戻るは履歴から終了済み画面を除き、循環しない', () => {
  const original = useStore.getState()
  const cases = [
    ['vocabStudy', { engine: 'word', source: { type: 'level', levelId: '3' }, returnTo: { screen: 'vocabLevels' } }, 'vocabLevels'],
    ['vocabQuiz', { engine: 'word', source: { type: 'field', field: 'daily' }, returnTo: { screen: 'vocabGroups' } }, 'vocabGroups'],
    ['phraseStudy', { engine: 'phrase', returnTo: { screen: 'phrases' } }, 'phrases'],
    ['phraseQuiz', { engine: 'phrase', returnTo: { screen: 'phrases' } }, 'phrases'],
    ['listeningQuiz', { engine: 'listening', returnTo: { screen: 'listening' } }, 'listening'],
    ['dictationPlay', { engine: 'dictation', returnTo: { screen: 'dictation' } }, 'dictation'],
    ['grammarQuiz', { engine: 'grammar', returnTo: { screen: 'grammar' } }, 'grammar'],
  ]

  try {
    for (const [sessionScreen, params, expected] of cases) {
      const state = {
        screen: 'sessionResult',
        params,
        stack: [
          { screen: 'home', params: {} },
          { screen: expected, params: {} },
          { screen: sessionScreen, params: {} },
        ],
      }

      useStore.setState(state)
      useStore.getState().globalBack()
      assert.equal(useStore.getState().screen, expected, `${sessionScreen}: 上部の戻る`)
      assert.equal(
        useStore.getState().stack.some((item) => IN_PROGRESS_SCREENS.has(item.screen)),
        false,
        `${sessionScreen}: 履歴を掃除`,
      )
      useStore.getState().globalBack()
      assert.notEqual(useStore.getState().screen, sessionScreen, `${sessionScreen}: 循環しない`)

      useStore.setState(state)
      useStore.getState().exitSessionResult()
      assert.equal(useStore.getState().screen, expected, `${sessionScreen}: 画面内の戻る`)
    }
  } finally {
    useStore.setState(original, true)
  }
})

test('親階層へ直接戻す13画面はnavigateで履歴を積み直さない', () => {
  const paths = [
    'src/screens/VocabStudy.jsx',
    'src/screens/VocabQuiz.jsx',
    'src/screens/PhraseQuiz.jsx',
    'src/screens/ListeningQuiz.jsx',
    'src/screens/KanbunKundokuQuiz.jsx',
    'src/screens/KanbunQuiz.jsx',
    'src/screens/KanbunStudy.jsx',
    'src/screens/KotenCultureQuiz.jsx',
    'src/screens/KotenCultureStudy.jsx',
    'src/screens/KotenGrammarQuiz.jsx',
    'src/screens/KotenGrammarStudy.jsx',
    'src/screens/KotenInterpretationQuiz.jsx',
    'src/screens/MathIntro.jsx',
  ]

  assert.equal(paths.length, 13)
  for (const path of paths) {
    const source = read(path)
    assert.match(source, /const returnTo = useStore/, path)
    assert.doesNotMatch(source, /const backTo[A-Za-z0-9_]*\s*=.*navigate\(/, path)
  }

  const remaining = screenSources().filter(({ source }) => (
    /const backTo[A-Za-z0-9_]*\s*=.*navigate\(/.test(source)
  ))
  assert.deepEqual(remaining.map(({ path }) => path), [])
})

test('共通結果画面へ到達する全7実装は明示した戻り先を引き継ぐ', () => {
  const producers = screenSources().filter(({ source }) => source.includes("navigate('sessionResult'"))
  assert.equal(producers.length, 7, '結果画面の生成元が増えたら戻り先監査も更新してください')

  for (const { path, source } of producers) {
    const start = source.indexOf("navigate('sessionResult'")
    const finish = source.slice(start, source.indexOf('\n  }', start))
    assert.match(finish, /returnTo:\s*params\.returnTo/, path)
  }
})

test('主要な全起動元は学習・クイズへ安全な親画面を渡す', () => {
  const expectations = [
    ['src/screens/VocabLevels.jsx', 'vocabLevels', 4],
    ['src/screens/VocabGroups.jsx', 'vocabGroups', 1],
    ['src/screens/VocabDecks.jsx', 'vocabDecks', 1],
    ['src/screens/Phrases.jsx', 'phrases', 3],
    ['src/screens/Grammar.jsx', 'grammar', 3],
    ['src/screens/GrammarLessons.jsx', 'grammarLessons', 1],
    ['src/screens/GrammarStrands.jsx', 'grammarStrands', 1],
    ['src/screens/Listening.jsx', 'listening', 1],
    ['src/screens/Dictation.jsx', 'dictation', 1],
    ['src/screens/ReadingPrep.jsx', 'readingPrep', 2],
    ['src/screens/ReadingSummary.jsx', 'readingSummary', 2],
    ['src/screens/VocabSearch.jsx', 'vocabSearch', 1],
    ['src/screens/MyList.jsx', 'myList', 5],
    ['src/screens/Roots.jsx', 'roots', 3],
    ['src/screens/RootDetail.jsx', 'rootDetail', 3],
    ['src/screens/EtymologyPack.jsx', 'etymologyPack', 1],
    ['src/screens/LiteratureReader.jsx', 'literatureReader', 1],
  ]

  for (const [path, screen, minimum] of expectations) {
    const source = read(path)
    const matches = ['src/screens/Phrases.jsx', 'src/screens/Roots.jsx', 'src/screens/RootDetail.jsx'].includes(path)
      ? source.match(/returnTo:\s*returnTarget/g) ?? []
      : path === 'src/screens/Grammar.jsx'
        ? source.match(/(?:returnTo[,}]|returnTo\s*)/g) ?? []
        : source.match(new RegExp(`returnTo:\\s*\\{\\s*screen:\\s*'${screen}'`, 'g')) ?? []
    if (path === 'src/screens/Phrases.jsx') {
      assert.match(source, /const returnTarget = \{\s*screen: 'phrases'/)
    }
    if (path === 'src/screens/Roots.jsx') {
      assert.match(source, /const returnTarget = \{ screen: 'roots'/)
    }
    if (path === 'src/screens/RootDetail.jsx') {
      assert.match(source, /const returnTarget = \{ screen: 'rootDetail'/)
    }
    if (path === 'src/screens/Grammar.jsx') {
      assert.match(source, /const returnTo = \{ screen: 'grammar'/)
    }
    assert.ok(matches.length >= minimum, `${path}: ${screen}への戻り先 ${matches.length}/${minimum}`)
  }
})
