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

test('語源画面は形と意味の3段階学習・4分類・2択確認へ整理する', () => {
  const roots = read('../src/screens/Roots.jsx')
  const modeData = read('../src/data/etymology-compression.js')
  const history = read('../src/data/etymology-history.js')
  const study = read('../src/screens/EtymologyStudy.jsx')
  const quiz = read('../src/screens/EtymologyQuiz.jsx')
  const pack = read('../src/screens/EtymologyPack.jsx')
  const wordBits = read('../src/components/WordBits.jsx')
  const knowledge = read('../src/components/EtymologyKnowledge.jsx')

  assert.match(roots, /data-etymology-intro/)
  assert.match(roots, /形を見る/)
  assert.match(roots, /意味をつなぐ/)
  assert.match(roots, /2択で確認/)
  assert.match(roots, /data-etymology-dashboard/)
  assert.match(roots, /role="tablist" aria-label="語源の学び方"/)
  assert.match(roots, /grid grid-cols-2 gap-2/)
  assert.match(roots, /aria-label="語源カードの進み具合で絞り込む"/)
  assert.match(roots, /data-etymology-card-browser/)
  assert.doesNotMatch(roots, /data-etymology-filters|originSource|もとの言語/)
  for (const label of ['部品で分ける', '同じ語根', '語の家族', 'ことばの歴史']) {
    assert.match(modeData, new RegExp(label))
  }
  assert.match(history, /etymologyLearningGuideFor/)
  assert.match(wordBits, /作られ方/)
  assert.match(wordBits, /形と意味のつながり/)
  assert.match(wordBits, /今の意味/)
  assert.match(wordBits, /data-reference-root-summary/)
  assert.match(wordBits, /同じ由来をたどれる語根/)
  assert.match(roots, /navigate\('etymologyQuiz'/)
  assert.match(roots, /data-etymology-actions/)
  assert.match(pack, /data-etymology-pack-actions/)
  assert.match(quiz, /data-etymology-quiz/)
  assert.match(quiz, /正しい形と意味/)
  assert.match(quiz, /2択で確認する/)
  assert.match(knowledge, /data-etymology-learning-flow/)
  assert.match(knowledge, /語の形を見る/)
  assert.match(knowledge, /関連語で確かめる/)
  assert.doesNotMatch(`${roots}\n${study}\n${quiz}\n${pack}\n${wordBits}\n${knowledge}`, /もとの形・言語|もとの言語|どの言語から/)
  assert.doesNotMatch(`${roots}\n${study}\n${pack}\n${wordBits}`, /現在義|共通軸|記載上の出発言語|濃縮パック/)
  // 語源カードも他の暗記カードと同じで、答えを開いてから「まだ／覚えた」で答える。
  assert.equal((study.match(/答えと説明を見る/g) ?? []).length, 1)
})

test('単語クイズは解答直後に語源を表示し、詳細遷移を必須にしない', () => {
  const quiz = read('../src/screens/VocabQuiz.jsx')
  const study = read('../src/screens/VocabStudy.jsx')
  const detail = read('../src/screens/WordDetail.jsx')

  assert.match(quiz, /answered && \([\s\S]*<EtymologyBlock word=\{word\} \/>/)
  assert.match(quiz, /辞書ページで関連語も見る/)
  assert.match(study, /<EtymologyBlock/)
  assert.match(study, /辞書ページで関連語も見る/)
  assert.match(detail, /closest\('\.study-app-content'\)\?\.scrollTo\(\{ top: 0 \}\)/)
  assert.match(detail, /\[word\?\.id\]/)
  assert.doesNotMatch(`${quiz}\n${study}`, /語源をくわしく見る|くわしく見る/)
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
    'data-activity-progress-split',
    'data-learning-gradebook',
    'data-forgetting-curve-analysis',
    'data-24-hour-effect-clock',
    'data-memory-pass-effect',
    'data-personalized-prescriptions',
    'data-random-study-wisdom',
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

test('上部メニューとマイ学習は全教材種類・既存の出題ソースを接続する', () => {
  const app = read('../src/App.jsx')
  const header = read('../src/components/AppShell.jsx')
  const learning = read('../src/screens/MyLearning.jsx')
  const learningCatalog = read('../src/lib/learningContentProgress.js')

  assert.match(app, /myLearning: MyLearningScreen/)
  assert.match(app, /<AppShell>/)
  assert.doesNotMatch(app, /BottomNav|nav=\{/)
  assert.match(header, /data-global-menu-button/)
  assert.match(header, /aria-label="メニューを開く"/)
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes('myLearning'))
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes('progress'))
  assert.match(learning, /data-my-learning-screen/)
  assert.match(learning, /data-learning-content-group={group\.id}/)
  assert.match(learning, /data-learning-content={content\.id}/)
  for (const label of ['英単語', '熟語・構文', '英文法', 'リスニング', 'ディクテーション', '語源知識', '古典単語', '漢語']) {
    assert.match(`${learning}\n${learningCatalog}`, new RegExp(label))
  }
  for (const screen of ['vocabLevels', 'phrases', 'grammar', 'listening', 'dictation', 'roots']) {
    assert.match(learningCatalog, new RegExp(`'${screen}'`))
  }
})

test('メニューの全教材・個人機能は公開ルートに存在し、履歴消去は一つの選択画面へ集約する', () => {
  const app = read('../src/App.jsx')
  const menu = read('../src/components/SpeechSettings.jsx')
  const screenMap = blockBetween(app, 'const SCREENS = {', '// 全公開画面')
  const publicScreens = new Set(
    [...screenMap.matchAll(/^  ([A-Za-z][A-Za-z0-9]*):/gm)].map((match) => match[1]),
  )

  assert.equal(publicScreens.size, 68)
  assert.equal(APP_MENU_ITEMS.length, 29)
  assert.equal(APP_MENU_SCREEN_DESTINATIONS.length, 24)
  assert.deepEqual(
    APP_MENU_SCREEN_DESTINATIONS.filter((screen) => !publicScreens.has(screen)),
    [],
  )
  assert.equal(new Set(APP_MENU_SCREEN_DESTINATIONS).size, APP_MENU_SCREEN_DESTINATIONS.length)
  assert.deepEqual(APP_MENU_ACTIONS, ['advisor', 'analytics', 'settings', 'account', 'reset'])
  assert.match(menu, /data-reset-select-all/)
  assert.match(menu, /data-reset-group=\{group\.id\}/)
  assert.doesNotMatch(menu, /DataManagementPanel|data-data-management-panel|clearLearningData/)
})
