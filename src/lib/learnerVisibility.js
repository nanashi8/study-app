// 龍脈調査ゲームは公開終了済み。保存データの互換性は維持しつつ、
// 学習者向けの画面・旧セッションへは遷移させない。
export const RETIRED_GAME_SCREENS = Object.freeze([
  'englishMap',
  'afterSchoolChronicle',
  'afterSchoolInterlude',
  'characterTalk',
  'storyAlbum',
])

const RETIRED_GAME_SCREEN_SET = new Set(RETIRED_GAME_SCREENS)
const SESSION_SCREENS = new Set(['vocabQuiz', 'phraseQuiz', 'sessionResult'])
const RETIRED_GAME_SOURCE_TYPES = new Set(['battle', 'dragonVein', 'dragonVeinPhrase'])

export function isRetiredGameSource(source) {
  return Boolean(
    source
    && typeof source === 'object'
    && (
      RETIRED_GAME_SOURCE_TYPES.has(source.type)
      || source.gameMode === 'dragonVein'
    )
  )
}

export function learnerDestination(screen, params = {}) {
  const nextScreen = typeof screen === 'string' && screen ? screen : 'home'
  const nextParams = params && typeof params === 'object' && !Array.isArray(params)
    ? params
    : {}
  const retiredSession = SESSION_SCREENS.has(nextScreen)
    && isRetiredGameSource(nextParams.source)

  if (RETIRED_GAME_SCREEN_SET.has(nextScreen) || retiredSession) {
    return { screen: 'home', params: {} }
  }
  return { screen: nextScreen, params: nextParams }
}
