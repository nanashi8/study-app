import {
  APP_MENU_CONTENT_ITEMS,
  CONTENT_SETTING_GROUPS,
  ENGLISH_CONTENT_SCREENS,
} from './appMenu.js'
import { appHomeForScreen } from './appHome.js'
import { normalizeVocabMix } from './vocabMix.js'
import { normalizeSpeechRange } from './speechRange.js'

// 設定の値は教材ごとに持つ。保存は「全体の値（settings の各キー）＋教材ごとの値（settings.byContent）」で、
// 教材ごとの値が無いキーは全体の値を使う。教材の ID はメニューの教材の行の画面 ID。

export const SETTING_KEYS = Object.freeze(CONTENT_SETTING_GROUPS.flatMap((group) => group.settings))

const SETTINGS_BY_CONTENT = new Map(APP_MENU_CONTENT_ITEMS.map((item) => [item.screen, item.settings]))

// 値を持つ教材。英語アプリの行は英語の教材へまとめて書き込むだけで、自分の値は持たない。
export const SETTING_SCOPES = Object.freeze(
  APP_MENU_CONTENT_ITEMS
    .filter((item) => item.screen !== 'home' && item.settings.length)
    .map((item) => item.screen),
)

export const ENGLISH_SETTING_SCOPES = Object.freeze(
  ENGLISH_CONTENT_SCREENS.filter((screen) => SETTING_SCOPES.includes(screen)),
)

export function scopeUsesSetting(scope, key) {
  return Boolean(SETTINGS_BY_CONTENT.get(scope)?.includes(key))
}

export function settingScopesUsing(key, scopes = SETTING_SCOPES) {
  return scopes.filter((scope) => scopeUsesSetting(scope, key))
}

// その教材だけが開く画面。
export const SCOPE_SCREENS = Object.freeze({
  vocabLevels: ['vocabLevels', 'vocabGroups', 'vocabDecks'],
  vocabSearch: ['vocabSearch'],
  writing: ['writing', 'writingPlay', 'writingExam', 'writingGrammarReview', 'myGrammar'],
  roots: ['roots', 'rootDetail', 'etymologyPack', 'etymologyStudy', 'etymologyQuiz'],
  readingList: ['readingList', 'readingRules', 'readingPrep', 'sceneBundles', 'reader', 'readingSummary'],
  phrases: ['phrases'],
  grammar: ['grammar', 'grammarQuiz', 'grammarReference', 'grammarStrandReference'],
  listening: ['listening', 'listeningQuiz'],
  diagnostic: ['diagnostic'],
  dictation: ['dictation', 'dictationPlay'],
  kotenList: [
    'kotenList', 'kotenQuiz',
    'kotenInterpretationList', 'kotenInterpretationPrep', 'kotenInterpretationQuiz',
    'kotenGrammar', 'kotenGrammarStudy', 'kotenGrammarQuiz',
    'kotenCulture', 'kotenCultureStudy', 'kotenCultureQuiz',
  ],
  kanbunHome: ['kanbunHome', 'kanbunCatalog', 'kanbunQuiz', 'kanbunKundoku', 'kanbunKundokuQuiz'],
  literatureLibrary: ['literatureLibrary', 'literatureReader'],
})

// いくつかの教材から開く暗記・テスト・結果・辞書の画面。開いた教材（scopes のどれか）の値を使い、
// 単語帳や記録など教材の画面を通らずに開いたときは primary の教材の値を使う。
// 結果画面は、その前の暗記・テストと同じ教材の値を使う。
export const SHARED_SCREENS = Object.freeze({
  vocabStudy: { primary: 'vocabLevels', scopes: ['vocabLevels', 'roots', 'readingList', 'literatureLibrary'] },
  vocabQuiz: { primary: 'vocabLevels', scopes: ['vocabLevels', 'roots', 'readingList'] },
  phraseStudy: { primary: 'phrases', scopes: ['phrases', 'readingList', 'vocabSearch'] },
  phraseQuiz: { primary: 'phrases', scopes: ['phrases', 'readingList'] },
  kotenStudy: { primary: 'kotenList', scopes: ['kotenList', 'literatureLibrary'] },
  kanbunStudy: { primary: 'kanbunHome', scopes: ['kanbunHome', 'literatureLibrary'] },
  wordDetail: { primary: 'vocabSearch', scopes: [...ENGLISH_CONTENT_SCREENS, 'literatureLibrary'] },
  sessionResult: { primary: null, scopes: null },
})

// どの教材の画面も通らずに開いた画面（アプリのホーム・単語帳・自作単語など）が使う教材。
const APP_FALLBACK_SCOPES = Object.freeze({
  english: 'vocabLevels',
  koten: 'kotenList',
  kanbun: 'kanbunHome',
  literature: 'literatureLibrary',
})

const OWNER_BY_SCREEN = new Map(
  Object.entries(SCOPE_SCREENS).flatMap(([scope, screens]) => screens.map((screen) => [screen, scope])),
)

/**
 * いまの画面が使う教材。共通の画面は、履歴をさかのぼって開いた教材を探す。
 * 途中で教材でも共通でもない画面（単語帳など）に当たったら、そこで探すのをやめる。
 */
export function settingsScopeFor({ screen, stack = [] } = {}) {
  const chain = [screen, ...[...(Array.isArray(stack) ? stack : [])].reverse().map((entry) => entry?.screen)]
  let primary = null
  let allowed = null
  for (const current of chain) {
    const owner = OWNER_BY_SCREEN.get(current)
    if (owner) return !allowed || allowed.includes(owner) ? owner : primary
    const shared = SHARED_SCREENS[current]
    if (!shared) break
    primary = shared.primary ?? primary
    if (shared.scopes) {
      allowed = allowed ? allowed.filter((scope) => shared.scopes.includes(scope)) : shared.scopes
    }
  }
  return primary ?? APP_FALLBACK_SCOPES[appHomeForScreen(screen).id] ?? null
}

// 「自動」の声は null。クラウド（Realtime Database）は null を保存しないので、教材ごとの値では空文字で持つ。
const VOICE_KEYS = new Set(['ttsVoiceURI', 'ttsJapaneseVoiceURI'])
// 決まった値から選ぶ設定は、知らない値を既定の値へ直して読む。
const CHOICE_NORMALIZERS = Object.freeze({ vocabMix: normalizeVocabMix, speechRange: normalizeSpeechRange })
// 片方をONにすると、もう片方を外す組。
const EXCLUSIVE_KEYS = Object.freeze({ revealAnswers: 'hideSpelling', hideSpelling: 'revealAnswers' })

/** その教材で使う値（教材ごとの値があればそれ、無ければ全体の値）。 */
export function effectiveSettings(settings, scope = null) {
  const { byContent, ...values } = settings && typeof settings === 'object' ? settings : {}
  const overrides = scope ? byContent?.[scope] : null
  if (!overrides) return values
  for (const [key, value] of Object.entries(overrides)) {
    values[key] = VOICE_KEYS.has(key) && value === '' ? null : value
  }
  // 両方ONになる組み合わせは、前からある「開いたまま」を残す。
  if (values.revealAnswers === true && values.hideSpelling === true) values.hideSpelling = false
  return values
}

/**
 * 設定を1つ変えた後の settings。
 * scopes を渡すとその教材の値だけを変える。null なら全体の値を変え、
 * clearOverrides のときは各教材の同じ設定も外して、すべての教材をその値にそろえる。
 */
export function applySettingChange(settings, key, value, { scopes = null, clearOverrides = false } = {}) {
  const current = settings && typeof settings === 'object' ? settings : {}
  const exclusive = EXCLUSIVE_KEYS[key]
  const updates = { [key]: value, ...(exclusive && value === true ? { [exclusive]: false } : {}) }
  const byContent = { ...(current.byContent ?? {}) }

  if (!scopes) {
    if (clearOverrides) {
      for (const [scope, overrides] of Object.entries(byContent)) {
        const rest = Object.fromEntries(Object.entries(overrides).filter(([name]) => !Object.hasOwn(updates, name)))
        if (Object.keys(rest).length) byContent[scope] = rest
        else delete byContent[scope]
      }
    }
    return { ...current, ...updates, byContent }
  }

  const stored = Object.fromEntries(
    Object.entries(updates).map(([name, next]) => [name, VOICE_KEYS.has(name) && next == null ? '' : next]),
  )
  for (const scope of scopes) {
    byContent[scope] = { ...(byContent[scope] ?? {}), ...stored }
  }
  return { ...current, byContent }
}

/** 端末・進捗コード・クラウドから読んだ教材ごとの値を、知っている教材と設定だけに整える。 */
export function normalizeContentOverrides(value) {
  if (!value || typeof value !== 'object') return {}
  const result = {}
  for (const scope of SETTING_SCOPES) {
    const source = value[scope]
    if (!source || typeof source !== 'object') continue
    const overrides = {}
    for (const key of SETTING_KEYS) {
      if (!Object.hasOwn(source, key)) continue
      overrides[key] = CHOICE_NORMALIZERS[key] ? CHOICE_NORMALIZERS[key](source[key]) : source[key]
    }
    if (overrides.revealAnswers === true && overrides.hideSpelling === true) overrides.hideSpelling = false
    if (Object.keys(overrides).length) result[scope] = overrides
  }
  return result
}
