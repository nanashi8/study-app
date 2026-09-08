import { useState } from 'react'
import {
  buildWritingTokenText,
  isWritingTokenOrderCorrect,
  shuffledWritingTokens,
  writingWordTokens,
  writingTokenPositionResults,
} from '../lib/writing.js'
import { Check, Close } from './Icons.jsx'
import { cx } from './ui.jsx'

const initialWordOrderState = (targetText, seed, initialText) => {
  const targetTokens = writingWordTokens(targetText)
  if (!initialText) {
    return {
      wordBank: shuffledWritingTokens(targetText, seed),
      answerTokens: [],
    }
  }

  const remaining = [...targetTokens]
  const answerTokens = writingWordTokens(initialText).flatMap(({ word }) => {
    const matchIndex = remaining.findIndex((token) => token.word === word)
    if (matchIndex < 0) return []
    return remaining.splice(matchIndex, 1)
  })
  const remainingIds = new Set(remaining.map((token) => token.id))
  return {
    wordBank: shuffledWritingTokens(targetText, seed)
      .filter((token) => remainingIds.has(token.id)),
    answerTokens,
  }
}

// 英作文と長文・文法の並び替えで共用する、単語カード式の語順入力。
// 置いた語をもう一度押すと戻せるため、ドラッグ操作が難しい端末でも完結する。
// liveFeedback を立てると、テーマ別英作文と同じく置いた瞬間に正誤が出る。
// 最後まで並べてから全部やり直すのではなく、間違えた1語をその場で直せる。
export function WordOrderExercise({
  targetText,
  seed = targetText,
  initialText = '',
  checked = false,
  disabled = false,
  liveFeedback = false,
  onChange,
  className = '',
}) {
  const [initialState] = useState(() => initialWordOrderState(targetText, seed, initialText))
  const [wordBank, setWordBank] = useState(initialState.wordBank)
  const [answerTokens, setAnswerTokens] = useState(initialState.answerTokens)
  const showResults = checked || liveFeedback
  const positionResults = showResults
    ? writingTokenPositionResults(answerTokens, targetText)
    : []
  const hasIncorrectPosition = positionResults.some((correct) => !correct)
  // 答え合わせのあとは正誤カードと模範解答が出るため、途中の知らせは重ねない。
  const liveTone = liveFeedback && !checked && answerTokens.length > 0
    ? (hasIncorrectPosition ? 'wrong' : 'right')
    : null
  const liveComplete = liveTone === 'right' && wordBank.length === 0

  const report = (tokens, bank) => {
    const text = buildWritingTokenText(tokens)
    onChange?.(text, {
      complete: bank.length === 0,
      correct: bank.length === 0 && isWritingTokenOrderCorrect(tokens, targetText),
      wrongPosition: writingTokenPositionResults(tokens, targetText).some(
        (correct) => !correct,
      ),
      tokenCount: tokens.length,
    })
  }

  const placeWord = (token) => {
    if (checked || disabled) return
    const nextBank = wordBank.filter((item) => item.id !== token.id)
    const nextAnswer = [...answerTokens, token]
    setWordBank(nextBank)
    setAnswerTokens(nextAnswer)
    report(nextAnswer, nextBank)
  }

  const returnWord = (token) => {
    if (checked || disabled) return
    const nextAnswer = answerTokens.filter((item) => item.id !== token.id)
    const nextBank = [...wordBank, token]
    setAnswerTokens(nextAnswer)
    setWordBank(nextBank)
    report(nextAnswer, nextBank)
  }

  return (
    <div className={className} data-word-order-exercise>
      <div
        className={cx(
          'min-h-16 rounded-2xl border-2 p-2.5 transition-colors',
          liveTone === 'wrong' && 'border-rose-300 bg-rose-50',
          liveTone === 'right' && 'border-emerald-300 bg-emerald-50/60',
          !liveTone && 'border-dashed border-brand-200 bg-brand-50/55',
        )}
        data-word-order-answer
        aria-label="並べた語句"
      >
        {answerTokens.length === 0 ? (
          <p className="px-2 py-3 text-center text-xs font-extrabold text-ink/35">
            下の単語を、英文の先頭から順に押してください
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {answerTokens.map((token, index) => (
              <button
                key={token.id}
                type="button"
                disabled={checked || disabled}
                onClick={() => returnWord(token)}
                className={cx(
                  'inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 px-3 py-2 font-display text-sm font-extrabold shadow-sm transition-transform active:scale-95',
                  !showResults && 'border-brand-300 bg-white text-brand-800',
                  showResults && positionResults[index]
                    && 'border-emerald-400 bg-emerald-50 text-emerald-800',
                  showResults && !positionResults[index]
                    && 'border-rose-400 bg-rose-50 text-rose-800',
                )}
                aria-label={`${index + 1}番目の語 ${token.word}${
                  showResults
                    ? positionResults[index]
                      ? '。正しい位置です'
                      : '。この位置ではありません'
                    : ''
                }${checked || disabled ? '' : '。押すと戻せます'}`}
              >
                {token.word}
                {liveFeedback && (positionResults[index] ? (
                  <Check size={14} className="text-emerald-600" aria-hidden="true" />
                ) : (
                  <Close size={14} className="text-rose-500" aria-hidden="true" />
                ))}
              </button>
            ))}
          </div>
        )}
      </div>

      {liveFeedback && !checked && (
        <>
          <p className="sr-only" aria-live="polite">
            {answerTokens.length > 0 &&
              `${answerTokens.length}番目の${answerTokens.at(-1).word}は、${
                positionResults.at(-1)
                  ? '正しい位置です'
                  : 'この位置ではありません'
              }`}
          </p>
          {hasIncorrectPosition && (
            <div
              role="alert"
              className="mt-2 flex items-center gap-2 rounded-2xl bg-rose-100 px-3 py-2.5 text-xs font-extrabold text-rose-700"
            >
              <Close size={16} />
              赤いカードはその位置ではありません。押して戻そう。
            </div>
          )}
          {liveComplete && (
            <div
              role="status"
              className="mt-2 flex items-center gap-2 rounded-2xl bg-emerald-100 px-3 py-2.5 text-xs font-extrabold text-emerald-700"
            >
              <Check size={16} />
              正しい語順です！ 答え合わせへ進もう。
            </div>
          )}
        </>
      )}

      <div
        className="mt-2 flex min-h-14 flex-wrap gap-2 rounded-2xl bg-white p-2.5 ring-1 ring-brand-100"
        data-word-order-bank
        aria-label="並べる単語"
      >
        {wordBank.length ? wordBank.map((token) => (
          <button
            key={token.id}
            type="button"
            disabled={checked || disabled}
            onClick={() => placeWord(token)}
            className="min-h-11 rounded-xl border border-brand-200 bg-white px-3 py-2 font-display text-sm font-extrabold text-ink shadow-sm transition-transform active:scale-95 disabled:opacity-45"
            aria-label={`${token.word} を次に置く`}
          >
            {token.word}
          </button>
        )) : (
          <p className="w-full py-2 text-center text-xs font-extrabold text-ink/35">
            すべての語を置きました
          </p>
        )}
      </div>

      {checked && (
        <div className="mt-2 rounded-xl bg-emerald-50 px-3 py-2.5" data-word-order-correct-answer>
          <p className="text-[10px] font-extrabold text-emerald-700">正しい語順</p>
          <p lang="en" className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-950">
            {targetText}
          </p>
        </div>
      )}
    </div>
  )
}
