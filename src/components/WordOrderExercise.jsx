import { useState } from 'react'
import {
  buildWritingTokenText,
  isWritingTokenOrderCorrect,
  shuffledWritingTokens,
  writingWordTokens,
  writingTokenPositionResults,
} from '../lib/writing.js'
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
export function WordOrderExercise({
  targetText,
  seed = targetText,
  initialText = '',
  checked = false,
  disabled = false,
  onChange,
  className = '',
}) {
  const [initialState] = useState(() => initialWordOrderState(targetText, seed, initialText))
  const [wordBank, setWordBank] = useState(initialState.wordBank)
  const [answerTokens, setAnswerTokens] = useState(initialState.answerTokens)
  const totalTokenCount = wordBank.length + answerTokens.length
  const positionResults = checked
    ? writingTokenPositionResults(answerTokens, targetText)
    : []

  const report = (tokens) => {
    const text = buildWritingTokenText(tokens)
    onChange?.(text, {
      complete: tokens.length === totalTokenCount,
      correct: isWritingTokenOrderCorrect(tokens, targetText),
      tokenCount: tokens.length,
    })
  }

  const placeWord = (token) => {
    if (checked || disabled) return
    const nextBank = wordBank.filter((item) => item.id !== token.id)
    const nextAnswer = [...answerTokens, token]
    setWordBank(nextBank)
    setAnswerTokens(nextAnswer)
    const text = buildWritingTokenText(nextAnswer)
    onChange?.(text, {
      complete: nextBank.length === 0,
      correct: nextBank.length === 0 && isWritingTokenOrderCorrect(nextAnswer, targetText),
      tokenCount: nextAnswer.length,
    })
  }

  const returnWord = (token) => {
    if (checked || disabled) return
    const nextAnswer = answerTokens.filter((item) => item.id !== token.id)
    setAnswerTokens(nextAnswer)
    setWordBank((items) => [...items, token])
    report(nextAnswer)
  }

  return (
    <div className={className} data-word-order-exercise>
      <div
        className="min-h-16 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/55 p-2.5"
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
                  'min-h-11 rounded-xl border-2 px-3 py-2 font-display text-sm font-extrabold shadow-sm transition-transform active:scale-95',
                  !checked && 'border-brand-300 bg-white text-brand-800',
                  checked && positionResults[index]
                    && 'border-emerald-400 bg-emerald-50 text-emerald-800',
                  checked && !positionResults[index]
                    && 'border-rose-400 bg-rose-50 text-rose-800',
                )}
                aria-label={`${index + 1}番目の語 ${token.word}${checked ? '' : ' を戻す'}`}
              >
                {token.word}
              </button>
            ))}
          </div>
        )}
      </div>

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
