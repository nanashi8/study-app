// 途中までの回答・学習結果がある可能性の高い画面。
// 共通ナビゲーションで別画面へ離れるときは、現在の永続進捗を
// QR／コードで持ち出すか本人に確認する。
export const IN_PROGRESS_SCREENS = Object.freeze(new Set([
  'vocabStudy',
  'vocabQuiz',
  'reader',
  'literatureReader',
  'phraseStudy',
  'phraseQuiz',
  'listeningQuiz',
  'dictationPlay',
  'mathSolve',
  'grammarQuiz',
  'writingPlay',
  'writingGrammarReview',
  'diagnostic',
  'kotenStudy',
  'kotenQuiz',
  'kotenInterpretationQuiz',
  'kotenGrammarStudy',
  'kotenGrammarQuiz',
  'kotenCultureStudy',
  'kotenCultureQuiz',
  'kanbunStudy',
  'kanbunQuiz',
  'kanbunKundokuQuiz',
]))

export function requiresProgressSaveConfirmation(currentScreen, targetScreen) {
  return targetScreen !== currentScreen && IN_PROGRESS_SCREENS.has(currentScreen)
}

const SESSION_REENTRY_SCREENS = new Set([
  'sessionResult',
  'vocabStudy',
  'vocabQuiz',
  'phraseStudy',
  'phraseQuiz',
  'listeningQuiz',
  'dictationPlay',
  'grammarQuiz',
])

const normalizedSafeDestination = (value) => (
  value?.screen && !SESSION_REENTRY_SCREENS.has(value.screen)
    ? { screen: value.screen, params: value.params ?? {} }
    : null
)

/**
 * 共通完了画面を閉じたときの行き先。
 *
 * 履歴の直前にある終了済み学習・クイズへ戻すと、そこから完了画面へ
 * 再び戻れて循環する。明示された安全な親画面を優先し、無い場合も
 * 教材の選択画面へ返す。「次へ」は戻る動線には使わない。
 */
export function completedSessionDestination(params = {}) {
  const explicit = normalizedSafeDestination(params.returnTo)
  if (explicit) return explicit

  const source = params.source ?? {}
  const engine = params.engine
  const replayScreen = params.replayScreen

  if (engine === 'phrase' || ['phraseStudy', 'phraseQuiz'].includes(replayScreen)) {
    return { screen: 'phrases', params: {} }
  }
  if (engine === 'listening' || replayScreen === 'listeningQuiz') {
    return { screen: 'listening', params: {} }
  }
  if (engine === 'dictation' || replayScreen === 'dictationPlay') {
    return { screen: 'dictation', params: {} }
  }
  if (engine === 'grammar' || replayScreen === 'grammarQuiz') {
    return {
      screen: source.type === 'grammarStrand' ? 'grammarStrands' : 'grammar',
      params: {},
    }
  }

  if (source.type === 'field') return { screen: 'vocabGroups', params: {} }
  if (source.type === 'levelField') {
    return { screen: 'vocabDecks', params: { levelId: source.levelId } }
  }
  return { screen: 'vocabLevels', params: {} }
}
