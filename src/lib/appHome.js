// ── 画面がどのアプリに属するか ────────────────────────────────────────
// 上部バーの「◯◯アプリへ」と、履歴が無いときの戻り先に使う。
// 履歴を持たずに開いた画面（メニューから直接など）でも、必ず自分のアプリの
// ホームへ帰れるようにするための対応表。
export const APP_HOMES = [
  {
    id: 'koten',
    screen: 'kotenList',
    label: '古典アプリ',
    screens: [
      'kotenList', 'kotenStudy', 'kotenQuiz',
      'kotenInterpretationList', 'kotenInterpretationPrep', 'kotenInterpretationQuiz',
      'kotenGrammar', 'kotenGrammarStudy', 'kotenGrammarQuiz',
      'kotenCulture', 'kotenCultureStudy', 'kotenCultureQuiz',
      'kotenSaved',
    ],
  },
  {
    id: 'kanbun',
    screen: 'kanbunHome',
    label: '漢文アプリ',
    screens: [
      'kanbunHome', 'kanbunCatalog', 'kanbunStudy', 'kanbunQuiz',
      'kanbunKundoku', 'kanbunKundokuQuiz', 'kanbunSaved',
    ],
  },
  {
    id: 'math',
    screen: 'mathMap',
    label: '数学アプリ',
    screens: ['mathMap', 'mathUnits', 'mathIntro', 'mathSolve'],
  },
  {
    id: 'literature',
    screen: 'literatureLibrary',
    label: '名作に親しむ',
    screens: ['literatureLibrary', 'literatureReader'],
  },
  {
    id: 'english',
    screen: 'home',
    label: '英語アプリ',
    screens: [
      'home', 'vocabLevels', 'vocabGroups', 'vocabDecks', 'vocabStudy', 'vocabQuiz',
      'sessionResult', 'wordDetail', 'rootDetail', 'etymologyPack', 'etymologyStudy',
      'etymologyQuiz', 'roots', 'myList', 'vocabCamera', 'readingList', 'readingRules',
      'readingPrep', 'reader', 'readingSummary', 'phrases', 'phraseStudy', 'phraseQuiz',
      'listening', 'listeningQuiz', 'dictation', 'dictationPlay', 'vocabSearch',
      'wordRequests', 'grammar', 'grammarQuiz', 'grammarLessons', 'grammarStrands', 'writing', 'writingPlay',
      'myGrammar', 'writingGrammarReview', 'diagnostic',
    ],
  },
]

export const PORTAL_HOME = Object.freeze({ id: 'portal', screen: 'portal', label: 'スタディアプリ' })

const HOME_BY_SCREEN = new Map()
for (const home of APP_HOMES) {
  for (const screen of home.screens) HOME_BY_SCREEN.set(screen, home)
}

/**
 * その画面が属するアプリのホーム。どのアプリにも属さない共通画面
 * （設定・記録・マイ学習・ログイン）は、入口のスタディアプリを返す。
 */
export function appHomeForScreen(screen) {
  const home = HOME_BY_SCREEN.get(screen)
  if (!home) return PORTAL_HOME
  return { id: home.id, screen: home.screen, label: home.label }
}

/** その画面自身が、アプリのホームかどうか。 */
export function isAppHomeScreen(screen) {
  return screen === 'portal' || APP_HOMES.some((home) => home.screen === screen)
}

/**
 * 履歴が無いときの戻り先。
 * アプリの中にいるならそのアプリのホームへ、ホームにいるなら入口へ戻す。
 */
export function fallbackDestination(screen) {
  if (screen === 'portal') return null
  const home = appHomeForScreen(screen)
  return home.screen === screen ? PORTAL_HOME.screen : home.screen
}
