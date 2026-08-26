import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { ChevronLeft, ChevronRight } from './Icons.jsx'
import { cx } from './ui.jsx'

export const CORRECT_AUTO_ADVANCE_DELAY_MS = 1400

export function nextUnansweredSessionIndex(index, total, answeredValues) {
  for (let offset = 1; offset <= total; offset += 1) {
    const candidate = (index + offset) % total
    if (!Object.hasOwn(answeredValues, candidate)) return candidate
  }
  return index
}

/**
 * 問題を戻っても、その問題で確定した回答を表示できるようにする。
 * 値は問題番号ごとに保持し、clear() は問題数変更・やり直しで全て破棄する。
 */
export function useIndexedSessionState(index, fallback = null, initialValues = {}) {
  const [values, setValues] = useState(() => ({ ...initialValues }))
  const hasCurrent = Object.hasOwn(values, index)
  const value = hasCurrent ? values[index] : fallback

  const setValue = useCallback((next) => {
    setValues((current) => {
      const previous = Object.hasOwn(current, index) ? current[index] : fallback
      const resolved = typeof next === 'function' ? next(previous) : next
      return { ...current, [index]: resolved }
    })
  }, [fallback, index])

  const clear = useCallback(() => setValues({}), [])

  return { value, setValue, clear, values, hasCurrent }
}

/**
 * 画面上部に固定される、問題の前後移動と「正解したら自動で次へ」の切替。
 * 自動送りは新しく正解したときの signal だけを一度処理し、戻って見直した
 * 正解済み問題では再発火しない。
 */
export function QuestionSessionControls({
  index,
  total,
  onPrevious,
  onNext,
  previousDisabled = index <= 0,
  nextDisabled = false,
  showAutoAdvance = false,
  autoAdvanceSignal = null,
  className = '',
  itemLabel = '問題',
}) {
  const autoAdvanceCorrect = useStore(
    (state) => state.settings.autoAdvanceCorrect !== false,
  )
  const setSetting = useStore((state) => state.setSetting)
  const advanceRef = useRef(onNext)
  const handledSignalsRef = useRef(new Set())
  const [pending, setPending] = useState(false)

  useEffect(() => {
    advanceRef.current = onNext
  }, [onNext])

  useEffect(() => {
    if (
      !showAutoAdvance
      || !autoAdvanceCorrect
      || autoAdvanceSignal == null
      || handledSignalsRef.current.has(autoAdvanceSignal)
    ) {
      setPending(false)
      return undefined
    }

    handledSignalsRef.current.add(autoAdvanceSignal)
    setPending(true)
    const timer = setTimeout(() => {
      setPending(false)
      advanceRef.current?.()
    }, CORRECT_AUTO_ADVANCE_DELAY_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [autoAdvanceCorrect, autoAdvanceSignal, showAutoAdvance])

  const isLast = index + 1 >= total
  const toggleAutoAdvance = () => {
    setSetting('autoAdvanceCorrect', !autoAdvanceCorrect)
  }

  return (
    <nav
      aria-label={`${itemLabel}の移動`}
      data-question-session-controls
      className={cx(
        'flex min-h-12 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/95 px-3 py-1.5 backdrop-blur',
        className,
      )}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label={`前の${itemLabel}へ`}
        data-question-previous
        className="inline-flex min-h-11 min-w-[4.5rem] items-center justify-center gap-0.5 rounded-xl px-2 text-xs font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/20 disabled:active:bg-transparent"
      >
        <ChevronLeft size={18} /> 前へ
      </button>

      {showAutoAdvance ? (
        <button
          type="button"
          onClick={toggleAutoAdvance}
          aria-pressed={autoAdvanceCorrect}
          aria-label={autoAdvanceCorrect
            ? '正解したら自動で次へ進む設定はオン。タップしてオフにする'
            : '正解したら自動で次へ進む設定はオフ。タップしてオンにする'}
          data-correct-auto-advance-toggle
          data-auto-advance-pending={pending ? 'true' : 'false'}
          className={cx(
            'flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 text-[11px] font-extrabold transition-colors',
            autoAdvanceCorrect
              ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
              : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
          )}
        >
          <span className="whitespace-nowrap">正解後</span>
          <span
            aria-hidden="true"
            className={cx(
              'rounded-full px-2 py-1 text-[10px] text-white',
              autoAdvanceCorrect ? 'bg-emerald-600' : 'bg-slate-500',
            )}
          >
            {pending ? '次へ' : autoAdvanceCorrect ? '自動' : '手動'}
          </span>
        </button>
      ) : (
        <span className="min-w-0 flex-1" aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label={isLast && showAutoAdvance ? '結果を見る' : `次の${itemLabel}へ`}
        data-question-next
        className="inline-flex min-h-11 min-w-[4.5rem] items-center justify-center gap-0.5 rounded-xl px-2 text-xs font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/20 disabled:active:bg-transparent"
      >
        {isLast && showAutoAdvance ? '結果' : '次へ'} <ChevronRight size={18} />
      </button>

      <span className="sr-only" aria-live="polite">
        {pending ? '正解しました。まもなく次へ進みます。' : ''}
      </span>
    </nav>
  )
}
