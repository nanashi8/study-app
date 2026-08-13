// 途中までの回答・学習結果がある可能性の高い画面。
// 共通ナビゲーションで別画面へ離れるときは、現在の永続進捗を
// QR／コードで持ち出すか本人に確認する。
export const IN_PROGRESS_SCREENS = Object.freeze(new Set([
  'vocabStudy',
  'vocabQuiz',
  'etymologyStudy',
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
