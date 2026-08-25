import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

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

test('熟語・構文は全2,104項目を級別内訳まで表示する', () => {
  const phrases = read('../src/screens/Phrases.jsx')
  const idioms = PHRASES.filter((item) => item.kind === 'idiom')
  const syntax = PHRASES.filter((item) => item.kind === 'syntax')

  assert.equal(PHRASES.length, 2104)
  assert.equal(idioms.length, 1754)
  assert.equal(syntax.length, 350)
  assert.match(phrases, /data-phrase-corpus-summary/)
  assert.match(phrases, /data-phrase-level-table/)
  assert.match(phrases, /PHRASE_COUNTS\.idiom/)
  assert.match(phrases, /PHRASE_COUNTS\.syntax/)
})

test('語源の全公開入口は通常の単語暗記だけを使い、専用暗記・2択実装を持たない', () => {
  const roots = read('../src/screens/Roots.jsx')
  const modeData = read('../src/data/etymology-compression.js')
  const history = read('../src/data/etymology-history.js')
  const pack = read('../src/screens/EtymologyPack.jsx')
  const rootDetail = read('../src/screens/RootDetail.jsx')
  const vocabLevels = read('../src/screens/VocabLevels.jsx')
  const notebook = read('../src/screens/MyList.jsx')
  const appMenu = read('../src/lib/appMenu.js')
  const analytics = read('../src/lib/learningAnalyticsReport.js')
  const learningContent = read('../src/lib/learningContentProgress.js')
  const app = read('../src/App.jsx')
  const wordBits = read('../src/components/WordBits.jsx')

  assert.match(roots, /data-etymology-intro/)
  assert.match(roots, /形を見る/)
  assert.match(roots, /意味をつなぐ/)
  assert.match(roots, /単語を暗記/)
  assert.match(roots, /data-etymology-dashboard/)
  assert.match(roots, /grid grid-cols-2 gap-2/)
  assert.match(roots, /aria-label="語源カードの進み具合で絞り込む"/)
  assert.match(roots, /data-etymology-card-browser/)
  assert.doesNotMatch(roots, /data-etymology-filters|originSource|もとの言語/)
  assert.match(wordBits, /etymologyCardsForWord/)
  assert.match(wordBits, /確認済み・紐づく/)
  assert.match(wordBits, /data-reference-root-summary/)
  assert.match(wordBits, /同じ由来をたどれる語根/)
  assert.match(roots, /data-etymology-actions/)
  assert.match(pack, /data-etymology-pack-actions/)
  const activeEtymology = `${roots}\n${pack}\n${rootDetail}`
  assert.equal((activeEtymology.match(/data-etymology-word-study-action/g) ?? []).length, 3)
  assert.equal((activeEtymology.match(/navigate\('vocabStudy'/g) ?? []).length, 3)
  assert.doesNotMatch(activeEtymology, /navigate\('(?:etymologyStudy|etymologyQuiz|vocabQuiz)'/)
  assert.doesNotMatch(activeEtymology, /2択|単語クイズ|意味を見て学ぶ/)
  assert.match(vocabLevels, /語源から関連英単語を暗記/)
  assert.match(appMenu, /語源から関連英単語を一緒に暗記/)
  assert.doesNotMatch(`${vocabLevels}\n${appMenu}`, /語源の確認問題|2択/)
  assert.match(notebook, /domain\.id === 'etymology' \? \([\s\S]*単語を暗記/)
  assert.match(notebook, /getEtymologyPack\(id\)\?\.studyIds/)
  const notebookEtymology = blockBetween(notebook, "} else if (domainId === 'etymology') {", "} else if (domainId === 'kotenVocab') {")
  assert.match(notebookEtymology, /navigate\('vocabStudy'/)
  assert.doesNotMatch(notebookEtymology, /navigate\('(?:etymologyStudy|etymologyQuiz|vocabQuiz)'/)
  assert.doesNotMatch(app, /etymologyStudy:\s|etymologyQuiz:\s|EtymologyStudyScreen|EtymologyQuizScreen/)
  assert.match(analytics, /domain === 'etymology'[\s\S]*screen: 'vocabStudy'/)
  assert.doesNotMatch(analytics, /screen: ['"]etymology(?:Study|Quiz)['"]/)
  assert.match(learningContent, /'語源から暗記'[\s\S]*enabled: false/)
  assert.doesNotMatch(`${activeEtymology}\n${wordBits}`, /もとの形・言語|もとの言語|どの言語から/)
  assert.doesNotMatch(`${activeEtymology}\n${wordBits}`, /現在義|共通軸|記載上の出発言語|濃縮パック/)
  for (const retired of [
    '../src/screens/EtymologyStudy.jsx',
    '../src/screens/EtymologyQuiz.jsx',
    '../src/components/EtymologyKnowledge.jsx',
    '../src/lib/etymologyQuiz.js',
  ]) {
    assert.equal(existsSync(new URL(retired, import.meta.url)), false, retired)
  }
})

test('単語テストは解答直後に語源を表示し、詳細遷移を必須にしない', () => {
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

test('学習分析は計算方法・記録数・図表・個別助言・値の限界を一画面で説明する', () => {
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
    'data-24-hour-effect-clock',
    'data-memory-pass-effect',
    'data-personalized-prescriptions',
    'data-random-study-wisdom',
  ]) {
    assert.match(analytics, new RegExp(marker))
  }
  assert.doesNotMatch(analytics, /data-forgetting-curve-analysis|忘却曲線|記憶段階|復習の段階|覚えている見込み/)
  assert.doesNotMatch(analytics, /profile\.score|dimension\.score|gradeClass\(|group\.grade/)
  assert.match(analytics, /才能やIQを示すものではありません/)
  assert.match(analytics, /10\.1111\/j\.1467-9280\.2006\.01693\.x/)
  assert.match(analytics, /10\.1037\/0033-2909\.132\.3\.354/)
  assert.match(analytics, /10\.1037\/0003-066X\.54\.7\.493/)
  assert.match(progress, /data-progress-record-summary/)
  assert.match(progress, /data-level-progress-table/)
  assert.doesNotMatch(progress, /data-etymology-progress-table/)
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
  for (const label of ['英単語', '熟語・構文', '英文法', 'リスニング', 'ディクテーション', '語源から暗記', '古典単語', '漢語']) {
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

  assert.equal(publicScreens.size, 67)
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
