import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { ChevronLeft, ChevronRight } from './Icons.jsx'
import { ProgressBar, cx } from './ui.jsx'

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
 * 途中でテストをやめても、そこまでに答えた分を学習記録へ残す。
 * 答えた問題数と正解数を持ち回り、画面が変わったところで一度だけ記録する。
 *
 * 返り値を呼ぶと、この画面ではもう数えない。最後まで進んだときは結果画面が
 * 同じ記録を書き、辞書などを開くために続きを退避したときは戻ってから記録する
 * ので、どちらも二重に数えない。
 */
export function useUnfinishedSessionRecord({ skill, answered = 0, correct = 0 }) {
  const screen = useStore((state) => state.screen)
  const keepInterruptedSession = useStore((state) => state.keepInterruptedSession)
  useEffect(() => {
    keepInterruptedSession(
      skill && answered > 0 ? { screen, skill, answered, correct } : null,
    )
  }, [keepInterruptedSession, screen, skill, answered, correct])
  return useCallback(() => keepInterruptedSession(null), [keepInterruptedSession])
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
  progressColor = 'var(--color-brand-500)',
  leadingAction = null,
  progressControl = null,
  trailingActions = null,
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
  const progressValue = total > 0 ? index / total : 0
  const compact = Boolean(leadingAction || progressControl || trailingActions)
  const nextLabel = isLast && showAutoAdvance ? '結果' : '次へ'
  const toggleAutoAdvance = () => {
    setSetting('autoAdvanceCorrect', !autoAdvanceCorrect)
  }

  return (
    <nav
      aria-label={`${itemLabel}の${compact ? '操作' : '移動'}`}
      data-question-session-controls
      className={cx(
        'flex min-h-12 shrink-0 items-center border-b border-slate-200/80 bg-white/95 py-1.5 backdrop-blur',
        compact ? 'gap-0.5 px-1.5' : 'gap-2 px-3',
        className,
      )}
    >
      {leadingAction}

      <button
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label={`前の${itemLabel}へ`}
        data-question-previous
        className={cx(
          'inline-flex min-h-11 items-center justify-center rounded-xl font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/20 disabled:active:bg-transparent',
          compact
            ? 'min-w-11 flex-1 flex-col gap-0 px-0.5 text-[10px]'
            : 'min-w-[4.5rem] gap-0.5 px-2 text-xs',
        )}
      >
        <ChevronLeft size={compact ? 16 : 18} /> <span>前へ</span>
      </button>

      <div
        className="relative flex min-h-11 min-w-0 flex-1 items-center"
        data-question-session-progress
        data-question-session-progress-value={progressValue}
      >
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
              'flex min-h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 pb-2 text-[11px] font-extrabold transition-colors',
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
        ) : progressControl}
        <ProgressBar
          value={progressValue}
          color={progressColor}
          className={cx(
            showAutoAdvance || progressControl
              ? 'pointer-events-none absolute inset-x-2 bottom-1 h-1.5 w-auto'
              : 'h-2.5',
          )}
        />
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label={isLast && showAutoAdvance ? '結果を見る' : `次の${itemLabel}へ`}
        data-question-next
        className={cx(
          'inline-flex min-h-11 items-center justify-center rounded-xl font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/20 disabled:active:bg-transparent',
          compact
            ? 'min-w-11 flex-1 flex-col gap-0 px-0.5 text-[10px]'
            : 'min-w-[4.5rem] gap-0.5 px-2 text-xs',
        )}
      >
        {compact ? (
          <>
            <ChevronRight size={16} />
            <span>{nextLabel}</span>
          </>
        ) : (
          <>
            <span>{nextLabel}</span>
            <ChevronRight size={18} />
          </>
        )}
      </button>

      {trailingActions}

      <span className="sr-only" aria-live="polite">
        {pending ? '正解しました。まもなく次へ進みます。' : ''}
      </span>
      <span className="sr-only">
        {itemLabel} {index + 1}/{total}
      </span>
    </nav>
  )
}
