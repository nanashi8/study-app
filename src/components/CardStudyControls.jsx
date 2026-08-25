import { useEffect, useRef } from 'react'
import { cardIndexAfterSwipe, cardSwipeDirection } from '../lib/cardSwipe.js'
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
