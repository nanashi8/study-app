import { useEffect, useRef } from 'react'
import { cardIndexAfterSwipe, cardSwipeDirection } from '../lib/cardSwipe.js'
import { Bookmark, BookmarkFilled } from './Icons.jsx'
import { cx } from './ui.jsx'

const INTERACTIVE_TARGETS = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'summary',
  '[role="button"]',
  '[contenteditable="true"]',
].join(',')

export function CardSwipeRegion({
  index,
  total,
  onIndexChange,
  className = '',
  children,
}) {
  const regionRef = useRef(null)
  const swipeStartRef = useRef(null)
  const suppressClickUntilRef = useRef(0)

  useEffect(() => {
    regionRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [index])

  const startSwipe = (event) => {
    if (
      event.isPrimary === false
      || event.button !== 0
      || event.target?.closest?.(INTERACTIVE_TARGETS)
    ) {
      swipeStartRef.current = null
      return
    }
    swipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
  }

  const endSwipe = (event) => {
    const start = swipeStartRef.current
    swipeStartRef.current = null
    if (!start || start.pointerId !== event.pointerId) return

    const direction = cardSwipeDirection(start, {
      x: event.clientX,
      y: event.clientY,
    })
    if (!direction) return

    // 横スワイプ直後に生成される click で、カードの答えが開閉しないようにする。
    suppressClickUntilRef.current = Date.now() + 450
    event.preventDefault()

    const nextIndex = cardIndexAfterSwipe(index, total, direction)
    if (nextIndex !== index) onIndexChange(nextIndex)
  }

  const suppressSwipeClick = (event) => {
    if (Date.now() >= suppressClickUntilRef.current) return
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={`学習カード ${index + 1}/${total}。右にスワイプで前、左にスワイプで次へ移動`}
      data-card-swipe-region
      data-card-swipe-index={index + 1}
      data-card-swipe-total={total}
      className={cx('touch-pan-y', className)}
      onPointerDown={startSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={() => { swipeStartRef.current = null }}
      onClickCapture={suppressSwipeClick}
    >
      {children}
    </div>
  )
}

export function CardStudyFooter({ className = '', children, ...props }) {
  return (
    <div
      data-card-study-footer
      {...props}
      className={cx(
        'shrink-0 border-t bg-white/90 px-4 py-2 backdrop-blur',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * カード上部の共通バーへ置く「保存」切替。単語・熟語・古文・古典文法・古典常識・漢文で
 * 見た目も押す場所も同じにするため、保存先ごとに違うのは名前と読み上げ文だけにする。
 */
export function CardSaveToggle({
  saved,
  onToggle,
  label,
  savedLabel,
  unsavedLabel,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? savedLabel : unsavedLabel}
      data-card-save-toggle
      {...props}
      className={cx(
        'inline-flex min-h-11 min-w-[3.75rem] shrink-0 flex-col items-center justify-center gap-0 rounded-xl px-1 text-[10px] font-extrabold transition-colors',
        saved
          ? 'bg-hint/15 text-hint ring-1 ring-hint/25'
          : 'bg-slate-100 text-ink/45 ring-1 ring-slate-200',
        className,
      )}
    >
      {saved ? <BookmarkFilled size={17} /> : <Bookmark size={17} />}
      <span>{label}</span>
    </button>
  )
}
