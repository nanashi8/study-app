// 途中までの回答・学習結果がある可能性の高い画面。
// 答えた分は1問ごとに保存されるので、ここから離れるときも確認は挟まない。
// 完了画面から戻る先・戻る履歴がこれらの画面を指さないことを、テストがこの一覧で確かめる。
export const IN_PROGRESS_SCREENS = Object.freeze(new Set([
  'vocabStudy',
  'vocabQuiz',
  'reader',
  'literatureReader',
  'phraseStudy',
  'phraseQuiz',
  'etymologyStudy',
  'etymologyQuiz',
  'listeningQuiz',
  'dictationPlay',
  'mathSolve',
  'grammarQuiz',
  'writingPlay',
  'writingExam',
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
 * 履歴の直前にある終了済み学習・テストへ戻すと、そこから完了画面へ
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
    // 文法の入口は1つ。系統のテストからは「単元別」の区分へ戻す。
    return {
      screen: 'grammar',
      params: source.type === 'grammarStrand'
        ? { view: 'strand', strand: source.strandId }
        : {},
    }
  }

  if (source.type === 'field') return { screen: 'vocabGroups', params: {} }
  if (source.type === 'levelField') {
    return { screen: 'vocabDecks', params: { levelId: source.levelId } }
  }
  return { screen: 'vocabLevels', params: {} }
}
