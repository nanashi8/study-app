import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PHRASES } from '../src/data/phrases.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import {
  APP_MENU_ACTIONS,
  APP_MENU_ITEMS,
  APP_MENU_SCREEN_DESTINATIONS,
} from '../src/lib/appMenu.js'

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

test('統一上部メニューとマイ学習は全教材種類・既存の出題ソースを接続する', () => {
  const app = read('../src/App.jsx')
  const header = read('../src/components/AppShell.jsx')
  const learning = read('../src/screens/MyLearning.jsx')

  assert.match(app, /myLearning: MyLearningScreen/)
  assert.match(app, /<AppShell>/)
  assert.doesNotMatch(app, /BottomNav|nav=\{/)
  assert.match(header, /data-global-menu-button/)
  assert.match(header, /aria-label="統一メニューを開く"/)
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes('myLearning'))
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes('progress'))
  assert.match(learning, /data-my-learning-screen/)
  assert.match(learning, /data-my-learning-english-categories/)
  for (const label of ['英単語', '熟語・構文', '英文法', 'リスニング', 'ディクテーション', '語源知識', '古典学習']) {
    assert.match(learning, new RegExp(label))
  }
  for (const type of ['phraseList', 'grammarList', 'listeningList', 'dictationList']) {
    assert.match(learning, new RegExp(`type: '${type}'`))
  }
})

test('統一メニューの全教材・個人機能は公開ルートに存在し、履歴消去は一つの選択画面へ集約する', () => {
  const app = read('../src/App.jsx')
  const menu = read('../src/components/SpeechSettings.jsx')
  const screenMap = blockBetween(app, 'const SCREENS = {', '// 全公開画面')
  const publicScreens = new Set(
    [...screenMap.matchAll(/^  ([A-Za-z][A-Za-z0-9]*):/gm)].map((match) => match[1]),
  )

  assert.equal(publicScreens.size, 59)
  assert.equal(APP_MENU_ITEMS.length, 25)
  assert.equal(APP_MENU_SCREEN_DESTINATIONS.length, 22)
  assert.deepEqual(
    APP_MENU_SCREEN_DESTINATIONS.filter((screen) => !publicScreens.has(screen)),
    [],
  )
  assert.equal(new Set(APP_MENU_SCREEN_DESTINATIONS).size, APP_MENU_SCREEN_DESTINATIONS.length)
  assert.deepEqual(APP_MENU_ACTIONS, ['settings', 'account', 'reset'])
  assert.match(menu, /data-reset-select-all/)
  assert.match(menu, /data-reset-group=\{group\.id\}/)
  assert.doesNotMatch(menu, /DataManagementPanel|data-data-management-panel|clearLearningData/)
})
