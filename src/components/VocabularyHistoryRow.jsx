import { useRef, useState } from 'react'
import { cx } from './ui.jsx'
import { learningContentCatalogSwipeAction } from '../lib/learningContentCatalogSwipe.js'

const SWIPE_PREVIEW_MAX_DISTANCE = 88
const SWIPE_PREVIEW_START_DISTANCE = 8

export const VOCABULARY_HISTORY_ACTIVITY_META = Object.freeze({
  memory: {
    leftLabel: '覚えた',
    rightLabel: 'まだ',
    leftClassName: 'bg-emerald-600',
    rightClassName: 'bg-rose-500',
    empty: '表示できる語彙はありません。',
  },
  test: {
    leftLabel: '正解',
    rightLabel: '不正解',
    leftClassName: 'bg-emerald-600',
    rightClassName: 'bg-rose-500',
    empty: '表示できる語彙はありません。',
  },
})

const RESULT_META = Object.freeze({
  unlearned: { label: '学習前', symbol: '−', className: 'bg-slate-100 text-slate-500' },
  learned: { label: '覚えた', symbol: '✓', className: 'bg-emerald-50 text-emerald-700' },
  reviewing: { label: 'まだ', symbol: '↺', className: 'bg-rose-50 text-rose-700' },
  unanswered: { label: 'テスト前', symbol: '−', className: 'bg-slate-100 text-slate-500' },
  correct: { label: '正解', symbol: '✓', className: 'bg-emerald-50 text-emerald-700' },
  incorrect: { label: '不正解', symbol: '×', className: 'bg-rose-50 text-rose-700' },
})

const ACTIVITY_DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

const activityDate = (timestamp, recorded) => (
  Number.isFinite(timestamp)
    ? ACTIVITY_DATE_FORMATTER.format(new Date(timestamp))
    : recorded ? '記録あり' : 'なし'
)

const rowWord = (row) => row.word ?? row.item ?? {}

const rowResult = (row, activity) => (
  activity === 'test'
    ? RESULT_META[row.testStatus] ?? RESULT_META.unanswered
    : RESULT_META[row.memoryStatus] ?? RESULT_META.unlearned
)

export function LearningRecordRow({
  row,
  activity,
  onSwipe,
  onOpen,
  openLabel = '単語の詳細',
  openHint = '詳細',
  titleLanguage = 'en',
}) {
  const word = rowWord(row)
  const id = word.id ?? row.id
  const title = word.word ?? row.title
  const meaning = word.meaning ?? row.subtitle
  const pos = word.pos ?? row.level
  const activityMeta = VOCABULARY_HISTORY_ACTIVITY_META[activity]
    ?? VOCABULARY_HISTORY_ACTIVITY_META.memory
  const resultMeta = rowResult(row, activity)
  const canOpen = typeof onOpen === 'function'
  const swipeStartRef = useRef(null)
  const suppressOpenUntilRef = useRef(0)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const resetSwipe = () => {
    swipeStartRef.current = null
    setSwipeOffset(0)
  }

  const startSwipe = (event) => {
    if (event.isPrimary === false || event.button !== 0) return
    swipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // スクロール開始直後など、取得できないポインターはそのまま無視する。
    }
  }

  const previewSwipe = (event) => {
    const start = swipeStartRef.current
    if (!start || start.pointerId !== event.pointerId) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (
      Math.abs(deltaX) < SWIPE_PREVIEW_START_DISTANCE
      || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2
    ) {
      setSwipeOffset(0)
      return
    }
    setSwipeOffset(Math.max(
      -SWIPE_PREVIEW_MAX_DISTANCE,
      Math.min(SWIPE_PREVIEW_MAX_DISTANCE, deltaX),
    ))
  }

  const finishSwipe = (event) => {
    const start = swipeStartRef.current
    resetSwipe()
    if (!start || start.pointerId !== event.pointerId) return
    const direction = learningContentCatalogSwipeAction(start, {
      x: event.clientX,
      y: event.clientY,
    })
    if (!direction) return
    event.preventDefault()
    suppressOpenUntilRef.current = Date.now() + 450
    onSwipe(direction)
  }

  const openDetails = (event) => {
    if (Date.now() < suppressOpenUntilRef.current) {
      event.preventDefault()
      return
    }
    if (canOpen) onOpen(id)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    onSwipe(event.key === 'ArrowLeft' ? 'left' : 'right')
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      data-vocabulary-history-swipe-row={id}
      data-vocab-catalog-swipe-row={id}
      data-learning-record-swipe-row={id}
    >
      <div className="pointer-events-none absolute inset-0 flex" aria-hidden="true">
        <span className={cx('flex flex-1 items-center px-4 text-xs font-extrabold text-white', activityMeta.rightClassName)}>
          {activityMeta.rightLabel} →
        </span>
        <span className={cx('flex flex-1 items-center justify-end px-4 text-xs font-extrabold text-white', activityMeta.leftClassName)}>
          ← {activityMeta.leftLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={openDetails}
        onPointerDown={startSwipe}
        onPointerMove={previewSwipe}
        onPointerUp={finishSwipe}
        onPointerCancel={resetSwipe}
        onKeyDown={handleKeyDown}
        aria-label={`${title}、${meaning}、現在は${resultMeta.label}。${canOpen ? `タップで${openLabel}。` : ''}左にスワイプで${activityMeta.leftLabel}、右にスワイプで${activityMeta.rightLabel}`}
        className={cx(
          'relative flex min-h-20 w-full touch-pan-y items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left outline-none transition-[background-color,border-color,box-shadow,transform] focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-200',
          swipeOffset ? 'duration-0' : 'duration-200',
        )}
        style={{ transform: `translate3d(${swipeOffset}px, 0, 0)` }}
        data-vocabulary-history-word={id}
        data-vocab-catalog-word={id}
        data-vocab-catalog-activity={activity}
        data-vocab-catalog-status={resultMeta.label}
        data-vocab-catalog-swipe-offset={swipeOffset}
        data-vocab-catalog-open-word={canOpen ? id : undefined}
        data-learning-record-item={id}
        data-learning-record-activity={activity}
        data-learning-record-status={resultMeta.label}
      >
        <span className={cx('mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl font-extrabold', resultMeta.className)} aria-hidden="true">
          {resultMeta.symbol}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <strong lang={titleLanguage || undefined} className="break-words font-display text-lg font-extrabold leading-tight text-ink">
              {title}
            </strong>
            {pos && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">
                {pos}
              </span>
            )}
            <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-extrabold', resultMeta.className)}>
              {resultMeta.label}
            </span>
            {canOpen && (
              <span className="ml-auto shrink-0 text-[10px] font-extrabold text-brand-600">
                {openHint} ›
              </span>
            )}
          </span>
          <span className="mt-1 block break-words text-sm font-bold leading-snug text-ink/75">
            {meaning}
          </span>
          <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-ink/45">
            <span>分野 {row.field}</span>
            <span>学習 {activityDate(row.memoryAt, row.memoryStatus !== 'unlearned')}</span>
            <span>テスト {activityDate(row.testAt, row.testStatus !== 'unanswered')}</span>
          </span>
        </span>
      </button>
    </div>
  )
}

export function VocabularyHistoryRow(props) {
  return <LearningRecordRow {...props} />
}
