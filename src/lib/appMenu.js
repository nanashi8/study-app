const screenItem = (screen, label, description) => Object.freeze({
  kind: 'screen',
  screen,
  label,
  description,
})

const actionItem = (action, label, description, tone = 'default') => Object.freeze({
  kind: 'action',
  action,
  label,
  description,
  tone,
})

const section = (id, label, items) => Object.freeze({
  id,
  label,
  items: Object.freeze(items),
})

// 教材の設定に並べる見出しと順番。値は教材ごとに持つ（src/lib/contentSettings.js）。
export const CONTENT_SETTING_GROUPS = Object.freeze([
  Object.freeze({
    id: 'study',
    label: '暗記・テスト',
    settings: Object.freeze([
      'revealAnswers',
      'hideSpelling',
      'sessionSize',
      'autoAdvanceCorrect',
      'vocabMix',
      'dailyGoal',
    ]),
  }),
  Object.freeze({
    id: 'speech',
    label: '音声・発音',
    settings: Object.freeze([
      'ttsRate',
      'ttsVoiceURI',
      'ttsJapaneseVoiceURI',
      'autoSpeak',
      'speechRange',
      'showPhonetic',
    ]),
  }),
])

const SETTING_ORDER = CONTENT_SETTING_GROUPS.flatMap((group) => group.settings)

// 教材から開く暗記・テスト・読み上げの画面が、それぞれ読んでいる設定。
// 出題バランスは級・分野から始める英単語だけに効くので、英単語の暗記・テストには含めない。
const ENGLISH_SPEECH = ['ttsRate', 'ttsVoiceURI']
// 英単語・熟語・構文の暗記カードは、読み上げる範囲に合わせて意味と例文の意味を日本語の声で読む。
const CARD_SPEECH = ['autoSpeak', 'speechRange', 'ttsJapaneseVoiceURI', ...ENGLISH_SPEECH]
const WORD_STUDY = ['revealAnswers', 'hideSpelling', 'sessionSize', 'dailyGoal', 'showPhonetic', ...CARD_SPEECH]
const WORD_TEST = ['sessionSize', 'autoAdvanceCorrect', ...ENGLISH_SPEECH]
const PHRASE_STUDY = ['revealAnswers', 'hideSpelling', 'sessionSize', 'dailyGoal', ...CARD_SPEECH]
const PHRASE_TEST = ['sessionSize', 'autoAdvanceCorrect', ...ENGLISH_SPEECH]
// 語源・古典・漢文のカードの暗記と、正誤をすぐ示すテスト。
const CARD_STUDY = ['revealAnswers', 'sessionSize', 'dailyGoal']
const QUESTION_TEST = ['sessionSize', 'autoAdvanceCorrect']
const READ_ALOUD = [...ENGLISH_SPEECH, 'ttsJapaneseVoiceURI']

const settingsOf = (...lists) => Object.freeze(
  SETTING_ORDER.filter((id) => lists.some((list) => list.includes(id))),
)

const ENGLISH_CONTENT_SETTINGS = Object.freeze({
  vocabLevels: settingsOf(WORD_STUDY, WORD_TEST, ['vocabMix']),
  // 辞書から開く熟語・構文の暗記は1件だけなので、問題数は効かない。
  vocabSearch: settingsOf(['revealAnswers', 'hideSpelling'], CARD_SPEECH),
  writing: settingsOf(['sessionSize'], ENGLISH_SPEECH),
  roots: settingsOf(CARD_STUDY, QUESTION_TEST, WORD_STUDY, WORD_TEST),
  readingList: settingsOf(READ_ALOUD, WORD_STUDY, WORD_TEST, PHRASE_STUDY, PHRASE_TEST),
  phrases: settingsOf(PHRASE_STUDY, PHRASE_TEST),
  grammar: settingsOf(QUESTION_TEST, ENGLISH_SPEECH),
  listening: settingsOf(QUESTION_TEST, ENGLISH_SPEECH),
  diagnostic: settingsOf(ENGLISH_SPEECH),
  dictation: settingsOf(QUESTION_TEST, ['autoSpeak'], ENGLISH_SPEECH),
})

// 英語アプリの行がまとめて設定を変える、英語の教材の行。
export const ENGLISH_CONTENT_SCREENS = Object.freeze(Object.keys(ENGLISH_CONTENT_SETTINGS))

// 教材の行。押すとその教材の設定を開き、設定のいちばん上から教材そのものへ進む。
const contentItem = (screen, label, description, settings) => Object.freeze({
  ...screenItem(screen, label, description),
  settings,
})

const englishItem = (screen, label, description) =>
  contentItem(screen, label, description, ENGLISH_CONTENT_SETTINGS[screen])

// メニューの情報設計を一か所に集約する。
// 見出しは整理のためだけに使い、全項目を同じ画面から直接選べるようにする。
// 画面IDは保存済み履歴・戻る履歴との互換性のため変更しない。
export const APP_MENU_SECTIONS = Object.freeze([
  section('apps', 'スタディアプリ', [
    screenItem('portal', 'スタディアプリ ホーム', '英語・数学・古典・漢文・名作から選ぶ'),
    contentItem('home', '英語アプリ', '英検5級〜1級の主要学習', settingsOf(...Object.values(ENGLISH_CONTENT_SETTINGS))),
    contentItem('mathMap', '数学アプリ', '単元マップと理解度', settingsOf()),
    contentItem('kotenList', '古典アプリ', '古典単語・文法・常識・短文', settingsOf(CARD_STUDY, QUESTION_TEST)),
    contentItem('kanbunHome', '漢文アプリ', '漢語・漢文法・漢文常識・返り点', settingsOf(CARD_STUDY, QUESTION_TEST)),
    // 本文の語は、英語の作品なら英単語、古典・漢文の作品なら古典単語・漢語の暗記で学ぶ。
    contentItem('literatureLibrary', '名作に親しむ', '英語・古典・漢文の朗読', settingsOf(READ_ALOUD, WORD_STUDY, CARD_STUDY)),
  ]),
  section('english', '英語の学習', [
    englishItem('vocabLevels', '英単語', '級別・分野別・品詞別に学習'),
    englishItem('vocabSearch', '英和辞書', '単語・熟語・構文を検索'),
    englishItem('writing', '英作文', '書いて使える知識にする'),
    englishItem('roots', '語源学習', '語源から関連英単語を一緒に暗記'),
    englishItem('readingList', '長文読解', '前から読む訳・文法・設問'),
    englishItem('phrases', '熟語・構文', '全2,104項目を検索・復習'),
    englishItem('grammar', '英文法', '級・単元ごとの参考書とテスト'),
    englishItem('listening', 'リスニング', '級別形式・本文確認・復習'),
  ]),
  section('support', '学習サポート', [
    actionItem('advisor', '学習アドバイザー', '今日のおすすめと優先して伸ばす分野'),
    actionItem('analytics', '学習記録とおすすめ', '正答・復習日・学習時間を確認'),
    englishItem('diagnostic', '学習診断', '28問で得意・弱点と現在地を確認'),
    englishItem('dictation', 'ディクテーション', '聞き取りとつづりを結びつける'),
    screenItem('vocabCamera', '教科書から単語追加', '写真の文字を辞書と比べて保存'),
    screenItem('customWords', '自作単語', '辞書に無い語を登録し、ファイルで持ち出す'),
    screenItem('wordRequests', '辞書リクエスト一覧', '辞書への追加希望を確認'),
  ]),
  section('records', '保存・記録', [
    screenItem('myList', 'マイ学習ノート', 'コンテンツのメモ・単語帳・履歴'),
    screenItem('myLearning', '暗記・テストの記録', '全18教材の一覧を確認し、「覚えた／まだ」と正解・不正解を見直す'),
    screenItem('myGrammar', 'マイ文法', '保存した文法を復習'),
    screenItem('progress', '学習記録・バックアップ', '教材別の記録、学習の傾向、QR・コード'),
  ]),
  section('settings', '設定・アカウント', [
    actionItem('settings', '設定', 'すべての教材の設定をまとめて変える・ホームの表示'),
    actionItem('account', 'ログイン・アカウント', 'クラウド保存とログアウト'),
    actionItem('reset', '学習履歴を選んでリセット', 'すべて、または項目を選択', 'danger'),
  ]),
])

export const APP_MENU_ITEMS = Object.freeze(
  APP_MENU_SECTIONS.flatMap((menuSection) => menuSection.items),
)

export const APP_MENU_SCREEN_DESTINATIONS = Object.freeze(
  APP_MENU_ITEMS
    .filter((item) => item.kind === 'screen')
    .map((item) => item.screen),
)

export const APP_MENU_ACTIONS = Object.freeze(
  APP_MENU_ITEMS
    .filter((item) => item.kind === 'action')
    .map((item) => item.action),
)

// 押すと設定を開く教材の行。
export const APP_MENU_CONTENT_ITEMS = Object.freeze(
  APP_MENU_ITEMS.filter((item) => Array.isArray(item.settings)),
)

// メニューの行で設定の中身を短く示す名前。声と速さは「読み上げ」にまとめる。
const SETTING_SHORT_LABELS = Object.freeze({
  revealAnswers: '答えの表示',
  hideSpelling: 'スペルを隠す',
  sessionSize: '問題数',
  autoAdvanceCorrect: '自動で次へ',
  vocabMix: '出題バランス',
  dailyGoal: '1日の目標',
  ttsRate: '読み上げ',
  ttsVoiceURI: '読み上げ',
  ttsJapaneseVoiceURI: '読み上げ',
  autoSpeak: '自動で発音',
  speechRange: '読み上げ',
  showPhonetic: '発音記号',
})

/** メニューの教材の行に出す、その教材で変えられる設定の名前（1行に収まる3つまで）。 */
// 1日の目標の数え方。教材の呼び方に合わせ、まとめて変える行は「語」で示す。
const DAILY_GOAL_UNITS = Object.freeze({
  phrases: '項目',
  kotenList: '項目',
  kanbunHome: '項目',
})

export function dailyGoalUnit(scopes) {
  const units = new Set((scopes ?? []).map((scope) => DAILY_GOAL_UNITS[scope] ?? '語'))
  return units.size === 1 ? [...units][0] : '語'
}

export function contentSettingsSummary(item) {
  const labels = [...new Set((item.settings ?? []).map((id) => SETTING_SHORT_LABELS[id]))]
  if (!labels.length) return '変えられる設定はありません'
  return labels.length > 3 ? `${labels.slice(0, 3).join('・')} など` : labels.join('・')
}
