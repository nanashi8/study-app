import { useEffect, useRef } from 'react'
import { cardIndexAfterSwipe } from '../lib/cardSwipe.js'
import { Bookmark, BookmarkFilled } from './Icons.jsx'
import { Button, cx } from './ui.jsx'
import { useHorizontalSwipe } from './useHorizontalSwipe.js'

// 最初と最後のカードで引いたときの重さ。それより先へはめくれないことを指に伝える。
const EDGE_DRAG_RESISTANCE = 0.3
const SETTLE_TRANSITION = 'transform 180ms ease-out'

export function CardSwipeRegion({
  index,
  total,
  onIndexChange,
  className = '',
  children,
}) {
  const regionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    regionRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [index])

  // 指に合わせてカードを横へずらす。動かすたびに描画し直さないよう、style を直接書き換える。
  const placeTrack = (offset, transition = '') => {
    const track = trackRef.current
    if (!track) return
    track.style.transition = transition
    track.style.transform = offset ? `translate3d(${offset}px, 0, 0)` : ''
  }

  useHorizontalSwipe(regionRef, {
    onDrag: (offset) => {
      const atEdge = (offset > 0 && index <= 0) || (offset < 0 && index >= total - 1)
      placeTrack(atEdge ? offset * EDGE_DRAG_RESISTANCE : offset)
    },
    onEnd: (direction) => {
      const nextIndex = cardIndexAfterSwipe(index, total, direction)
      if (nextIndex === index) {
        // めくらなかったときは、元の位置へすべらせて戻す。
        placeTrack(0, SETTLE_TRANSITION)
        return
      }
      placeTrack(0)
      onIndexChange(nextIndex)
    },
  })

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={`学習カード ${index + 1}/${total}。右にスワイプで前、左にスワイプで次へ移動`}
      data-card-swipe-region
      data-card-swipe-index={index + 1}
      data-card-swipe-total={total}
      className={cx('touch-pan-y overflow-x-hidden', className)}
    >
      <div ref={trackRef} data-card-swipe-track>
        {children}
      </div>
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
 * 答えたあと戻ってきたカードの「まだ／覚えた」。いまの答えを押した状態で示し、
 * もう一方を押すと選び直せる（記録と集計は画面側で入れ替える）。
 */
export function StudyAnswerReselect({
  remembered,
  onAnswer,
  forgotLabel = 'まだ🤔',
  rememberedLabel = '覚えた👍',
  forgotVariant = 'danger',
}) {
  return (
    <div className="grid grid-cols-2 gap-2" data-card-answer-reselect>
      <Button
        variant={remembered ? 'secondary' : forgotVariant}
        size="lg"
        aria-pressed={!remembered}
        onClick={() => onAnswer(false)}
      >
        {forgotLabel}
      </Button>
      <Button
        variant={remembered ? 'success' : 'secondary'}
        size="lg"
        aria-pressed={Boolean(remembered)}
        onClick={() => onAnswer(true)}
      >
        {rememberedLabel}
      </Button>
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
