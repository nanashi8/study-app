import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PHRASES } from '../src/data/phrases.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { createLearningAnalytics } from '../src/lib/learningAnalytics.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const blockBetween = (source, start, end) =>
  source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)))

test('リスニングは160問を保持し、音声選択肢を番号で区別して重複案内を出さない', () => {
  const landing = read('../src/screens/Listening.jsx')
  const quiz = read('../src/screens/ListeningQuiz.jsx')

  assert.equal(LISTENING_ITEMS.length, 160)
  assert.doesNotMatch(`${landing}\n${quiz}`, /準備ができたら再生|音声で聞く/)
  assert.match(quiz, /第\{displayIndex \+ 1\}番を選ぶ/)
  assert.match(quiz, /aria-label=\{hideText \? `第\$\{displayIndex \+ 1\}番を選ぶ` : choice\.text\}/)
  assert.match(quiz, /playsUsed === 0[\s\S]*'問題を再生する'/)
})

test('熟語・構文は全1,500項目を級別内訳まで表示する', () => {
  const phrases = read('../src/screens/Phrases.jsx')
  const idioms = PHRASES.filter((item) => item.kind === 'idiom')
  const syntax = PHRASES.filter((item) => item.kind === 'syntax')

  assert.equal(PHRASES.length, 1500)
  assert.equal(idioms.length, 1150)
  assert.equal(syntax.length, 350)
  assert.match(phrases, /data-phrase-corpus-summary/)
  assert.match(phrases, /data-phrase-level-table/)
  assert.match(phrases, /PHRASE_COUNTS\.idiom/)
  assert.match(phrases, /PHRASE_COUNTS\.syntax/)
})

test('語源画面は概要・学び方・状態を先に示し、詳細軸は折りたたむ', () => {
  const roots = read('../src/screens/Roots.jsx')

  assert.match(roots, /data-etymology-dashboard/)
  assert.match(roots, /role="tablist" aria-label="語源の学び方"/)
  assert.match(roots, /aria-label="語源知識の進捗で絞り込む"/)
  assert.match(roots, /<details[\s\S]*data-etymology-filters/)
  assert.match(roots, /4つの整理法を一度に混ぜず、1種類ずつ確認します/)
})

test('記録は定義・標本数・評定・図表・個別助言・科学的限界を一つの分析票にする', () => {
  const analytics = read('../src/components/LearningAnalytics.jsx')
  const progress = read('../src/screens/Progress.jsx')

  for (const marker of [
    'data-learning-analysis-report',
    'data-analysis-summary-table',
    'data-dimension-grade-table',
    'data-skill-analysis-table',
    'data-interval-recall-chart',
    'data-hourly-analysis-matrix',
    'data-action-plan-table',
    'data-scientific-basis',
  ]) {
    assert.match(analytics, new RegExp(marker))
  }
  assert.match(analytics, /固定された才能やIQではなく/)
  assert.match(analytics, /10\.1111\/j\.1467-9280\.2006\.01693\.x/)
  assert.match(analytics, /10\.1037\/0033-2909\.132\.3\.354/)
  assert.match(analytics, /10\.1037\/0003-066X\.54\.7\.493/)
  assert.match(progress, /data-progress-record-summary/)
  assert.match(progress, /data-level-progress-table/)
  assert.match(progress, /data-etymology-progress-table/)
  assert.match(progress, /onNavigate=\{\(screen, params\) => navigate\(screen, params\)\}/)
})

test('統一下部ナビとマイ学習は4入口・全教材種類・既存の出題ソースを接続する', () => {
  const app = read('../src/App.jsx')
  const bottom = read('../src/components/BottomNav.jsx')
  const learning = read('../src/screens/MyLearning.jsx')

  assert.deepEqual(
    [...bottom.matchAll(/key: '([^']+)', label: '([^']+)'/g)].map(([, key, label]) => [key, label]),
    [
      ['home', 'ホーム'],
      ['learning', 'マイ学習'],
      ['records', '記録'],
      ['menu', 'メニュー'],
    ],
  )
  assert.match(app, /myLearning: MyLearningScreen/)
  assert.match(app, /<AppShell nav=\{<BottomNav \/>\}>/)
  assert.match(learning, /data-my-learning-screen/)
  assert.match(learning, /data-my-learning-english-categories/)
  for (const label of ['英単語', '熟語・構文', '英文法', 'リスニング', 'ディクテーション', '語源知識', '古典学習']) {
    assert.match(learning, new RegExp(label))
  }
  for (const type of ['phraseList', 'grammarList', 'listeningList', 'dictationList']) {
    assert.match(learning, new RegExp(`type: '${type}'`))
  }
  assert.match(bottom, /requiresProgressSaveConfirmation\(screen, target\)/)
})

test('統一メニューの全教材・個人機能は公開ルートに存在し、設定から個別消去できる', () => {
  const app = read('../src/App.jsx')
  const menu = read('../src/components/SpeechSettings.jsx')
  const screenMap = blockBetween(app, 'const SCREENS = {', '// 下部ナビ')
  const publicScreens = new Set(
    [...screenMap.matchAll(/^  ([A-Za-z][A-Za-z0-9]*):/gm)].map((match) => match[1]),
  )
  const destinations = [
    ['const APP_MENU_DESTINATIONS', 'const ENGLISH_MENU_DESTINATIONS'],
    ['const ENGLISH_MENU_DESTINATIONS', 'const LEARNING_TOOL_DESTINATIONS'],
    ['const LEARNING_TOOL_DESTINATIONS', 'const PERSONAL_TOOL_DESTINATIONS'],
    ['const PERSONAL_TOOL_DESTINATIONS', 'function MenuDestinationList'],
  ].flatMap(([start, end]) =>
    [...blockBetween(menu, start, end).matchAll(/screen: '([^']+)'/g)].map((match) => match[1]),
  )

  assert.equal(publicScreens.size, 59)
  assert.equal(destinations.length, 22)
  assert.deepEqual(destinations.filter((screen) => !publicScreens.has(screen)), [])
  assert.equal(new Set(destinations).size, destinations.length)
  assert.match(menu, /data-data-management-panel/)
  for (const scope of ['analytics', 'diagnostic', 'saved', 'vocabHistory']) {
    assert.match(menu, new RegExp(`data-clear-learning-scope=\\{action\.id\\}|id: '${scope}'`))
  }
})

test('個別消去は指定データだけを消し、SRS・設定・全体進捗を保持する', () => {
  const before = useStore.getState()
  const restore = {
    learningAnalytics: before.learningAnalytics,
    skillStats: before.skillStats,
    diagnosticHistory: before.diagnosticHistory,
    diagnosticAttempt: before.diagnosticAttempt,
    myList: before.myList,
    myGrammarList: before.myGrammarList,
    kotenWordList: before.kotenWordList,
    kotenGrammarList: before.kotenGrammarList,
    kotenCultureList: before.kotenCultureList,
    vocabHistory: before.vocabHistory,
    srs: before.srs,
    stats: before.stats,
    settings: before.settings,
    portalOrder: before.portalOrder,
  }

  try {
    const analytics = { ...createLearningAnalytics(), inputs: 7, scored: 5 }
    const sentinel = {
      srs: { keep: { box: 2, correct: 2, wrong: 0, due: 999, last: 1 } },
      stats: { xp: 321, streak: 2, day: 1, todayCount: 3, answered: 4, correct: 3 },
      settings: { ...before.settings, dailyGoal: 50 },
      portalOrder: [...before.portalOrder].reverse(),
    }
    useStore.setState({
      learningAnalytics: analytics,
      skillStats: { vocab: { answered: 5, correct: 4 } },
      diagnosticHistory: [{ id: 'diagnostic-result' }],
      diagnosticAttempt: 4,
      myList: ['word'],
      myGrammarList: ['grammar'],
      kotenWordList: ['koten-word'],
      kotenGrammarList: ['koten-grammar'],
      kotenCultureList: ['koten-culture'],
      vocabHistory: ['history'],
      ...sentinel,
    })

    useStore.getState().clearLearningData('analytics')
    assert.equal(useStore.getState().learningAnalytics.scored, 0)
    assert.deepEqual(useStore.getState().skillStats, {})

    useStore.getState().clearLearningData('diagnostic')
    assert.deepEqual(useStore.getState().diagnosticHistory, [])
    assert.equal(useStore.getState().diagnosticAttempt, 0)

    useStore.getState().clearLearningData('saved')
    for (const key of ['myList', 'myGrammarList', 'kotenWordList', 'kotenGrammarList', 'kotenCultureList']) {
      assert.deepEqual(useStore.getState()[key], [])
    }

    useStore.getState().clearLearningData('vocabHistory')
    assert.deepEqual(useStore.getState().vocabHistory, [])
    for (const key of Object.keys(sentinel)) assert.deepEqual(useStore.getState()[key], sentinel[key])
  } finally {
    useStore.setState(restore)
  }
})
