import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
 * 答えた問題ごとの記録の控え（ストアの review 系が返す receipt）。
 * 前へ戻って選び直したとき、reviseReview に渡して最初の回答を置き換える。
 * 辞書などを開いて戻る画面は、退避した控えを initial で戻す。問題の並びを組み直したら clear する。
 */
export function useAnswerReceipts(initial = null) {
  const receipts = useRef({ ...(initial ?? {}) })
  return useMemo(() => ({
    get: (index) => receipts.current[index] ?? null,
    set: (index, receipt) => {
      if (receipt) receipts.current[index] = receipt
    },
    clear: () => {
      receipts.current = {}
    },
    snapshot: () => ({ ...receipts.current }),
  }), [])
}

/**
 * 表示中の問題が「前に答えてから、いったん離れて戻ってきた問題」か。
 * そのときだけ答えを選び直せるようにする（答えた直後のその場では、これまでどおり確定のまま）。
 */
export function useRevisitedAnswer(index, answered) {
  const [arrival, setArrival] = useState({ index, answered })
  if (arrival.index !== index) {
    setArrival({ index, answered })
    return answered
  }
  return arrival.answered && answered
}

/** 答えたあと戻ってきた問題で、答えを選び直せることを示す一行。 */
export function ReselectNote({ className = '' }) {
  return (
    <p
      className={cx('text-center text-[11px] font-bold leading-relaxed text-ink/45', className)}
      data-answer-reselect-note
    >
      答えた問題です。別の答えを押すと、答えと記録を入れ替えます。
    </p>
  )
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
 * 画面上部に固定される、問題の前後移動・数字進捗と「正解したら自動で次へ」の切替。
 * 自動送りは新しく正解したときの signal だけを一度処理し、戻って見直した
 * 正解済み問題では再発火しない。
 * 途中でやめる操作は上部バーの共通「戻る」が受け持つので、このバーには置かない。
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
  const compact = Boolean(progressControl || trailingActions)
  const nextLabel = isLast && showAutoAdvance ? '結果' : '次へ'
  const stepClassName = cx(
    'inline-flex min-h-11 items-center justify-center rounded-xl font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/20 disabled:active:bg-transparent',
    compact
      ? cx(
          'flex-col gap-0 px-0.5 text-[10px]',
          // テストは中央に数字進捗と自動送りの切替が並ぶので、前へ・次へは細くして中央に幅を回す。
          showAutoAdvance ? 'min-w-12 shrink-0' : 'min-w-11 flex-1',
        )
      : 'min-w-[4.5rem] gap-0.5 px-2 text-xs',
  )
  const toggleAutoAdvance = () => {
    setSetting('autoAdvanceCorrect', !autoAdvanceCorrect)
  }

  return (
    <nav
      aria-label={`${itemLabel}の${compact ? '操作' : '移動'}`}
      data-question-session-controls
      className={cx(
        'relative flex min-h-12 shrink-0 items-center border-b border-slate-200/80 bg-white/95 py-1.5 backdrop-blur',
        compact ? 'gap-0.5 px-1.5' : 'gap-2 px-3',
        className,
      )}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label={`前の${itemLabel}へ`}
        data-question-previous
        className={stepClassName}
      >
        <ChevronLeft size={compact ? 16 : 18} /> <span>前へ</span>
      </button>

      <div
        className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1"
        data-question-session-progress
        data-question-session-progress-value={progressValue}
      >
        {progressControl}
        {showAutoAdvance && (
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
            <span className="min-w-0 truncate">正解後</span>
            <span
              aria-hidden="true"
              className={cx(
                'shrink-0 rounded-full px-2 py-1 text-[10px] text-white',
                autoAdvanceCorrect ? 'bg-emerald-600' : 'bg-slate-500',
              )}
            >
              {pending ? '次へ' : autoAdvanceCorrect ? '自動' : '手動'}
            </span>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label={isLast && showAutoAdvance ? '結果を見る' : `次の${itemLabel}へ`}
        data-question-next
        className={stepClassName}
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

      {/* 進み具合はバーの下端に細く通す。中央の数字や切替の枠とは重ねない。 */}
      <ProgressBar
        value={progressValue}
        color={progressColor}
        heightClassName="h-1"
        className="pointer-events-none absolute inset-x-0 bottom-0"
      />

      <span className="sr-only" aria-live="polite">
        {pending ? '正解しました。まもなく次へ進みます。' : ''}
      </span>
      <span className="sr-only">
        {itemLabel} {index + 1}/{total}
      </span>
    </nav>
  )
}
