import { useEffect, useMemo, useRef, useState } from 'react'
import { ringIndexAfter, ringPosition, ringRemaining } from '../lib/studyRing.js'
import { studyAnswerGroups } from '../lib/studyAnswerList.js'
import { Bookmark, BookmarkFilled, Cards } from './Icons.jsx'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { useHorizontalSwipe } from './useHorizontalSwipe.js'

// 残り1枚になったカードで引いたときの重さ。それより先へはめくれないことを指に伝える。
const EDGE_DRAG_RESISTANCE = 0.3
const SETTLE_TRANSITION = 'transform 180ms ease-out'

/**
 * 暗記カードをめくる場所。回るのは「まだ」「覚えた」を押していないカードだけで、
 * 末尾まで行ったら先頭へ戻る（studyRing.js）。押したカードはこの輪から抜ける。
 * answered は「カード番号 → 答え」の記録。渡さなければ全カードを輪にして回す。
 */
export function CardSwipeRegion({
  index,
  total,
  answered = {},
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

  const turnTo = (direction) => ringIndexAfter(index, total, answered, direction)

  useHorizontalSwipe(regionRef, {
    onDrag: (offset) => {
      const direction = offset > 0 ? 'previous' : 'next'
      const atEdge = offset !== 0 && turnTo(direction) === index
      placeTrack(atEdge ? offset * EDGE_DRAG_RESISTANCE : offset)
    },
    onEnd: (direction) => {
      const nextIndex = turnTo(direction)
      if (nextIndex === index) {
        // めくらなかったときは、元の位置へすべらせて戻す。
        placeTrack(0, SETTLE_TRANSITION)
        return
      }
      placeTrack(0)
      onIndexChange(nextIndex)
    },
  })

  const remaining = ringRemaining(total, answered)
  const place = ringPosition(index, total, answered)

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={`学習カード。残り${remaining}枚の${place}枚目。右にスワイプで前、左にスワイプで次へ移動`}
      data-card-swipe-region
      data-card-swipe-index={index + 1}
      data-card-swipe-total={total}
      data-card-swipe-remaining={remaining}
      className={cx('touch-pan-y overflow-x-hidden', className)}
    >
      <div ref={trackRef} data-card-swipe-track>
        {children}
      </div>
    </div>
  )
}

/**
 * 直前に「まだ」「覚えた」を押したカードへ戻る一行。押したカードは輪から抜けるので、
 * 押し間違えたときはここから戻って選び直す（戻った先の判定は StudyAnswerReselect）。
 */
export function LastAnsweredReturn({ onOpen, className = '' }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-last-answered-return
      className={cx(
        'mx-auto mb-1.5 flex min-h-8 items-center justify-center rounded-lg px-2 text-[11px] font-bold text-ink/45 underline decoration-ink/25 decoration-dotted underline-offset-4 active:bg-ink/5',
        className,
      )}
    >
      {'直前の1枚を選び直す'}
    </button>
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
 * 暗記カードで答えた「覚えた／まだ」を、全部終えたあと「一覧で確認」で見せるために残す。
 * 選び直した項目は最後の答えで分け（studyAnswerGroups）、数え直しでは消さず、やり直すときだけ reset する。
 */
export function useStudyAnswerLog() {
  const log = useRef([])
  return useMemo(() => ({
    record: (item, remembered) => {
      if (item?.id == null) return
      log.current = [...log.current, { item, remembered: Boolean(remembered) }]
    },
    entries: () => [...log.current],
    groups: () => studyAnswerGroups(log.current),
    reset: () => {
      log.current = []
    },
  }), [])
}

const ANSWER_GROUP_TONES = {
  forgot: {
    heading: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    row: 'ring-rose-100',
  },
  remembered: {
    heading: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    row: 'ring-emerald-100',
  },
}

function StudyAnswerGroup({ id, label, items, unit, renderTitle, renderMeaning, titleLang }) {
  const tone = ANSWER_GROUP_TONES[id]
  return (
    <section aria-label={`「${label}」と答えた${items.length}${unit}`} data-study-answer-group={id}>
      <h4 className={cx('flex items-center justify-between gap-2 text-sm font-extrabold', tone.heading)}>
        <span>「{label}」と答えた</span>
        <span className={cx('rounded-full px-2 py-0.5 text-[11px] tabular-nums', tone.badge)}>
          {items.length}{unit}
        </span>
      </h4>
      {items.length ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className={cx('rounded-xl bg-white px-3 py-2 ring-1', tone.row)}
              data-study-answer-item={item.id}
            >
              <p lang={titleLang} className="font-display text-base font-extrabold leading-snug text-ink">
                {renderTitle(item)}
              </p>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">{renderMeaning(item)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-3 text-xs font-bold text-ink/50">ありません。</p>
      )}
    </section>
  )
}

/**
 * 全カードを終えたあとに置く「一覧で確認」。押すと、今回「まだ」「覚えた」と答えた項目を分けて並べる。
 * 見出しと意味の描き方（振り仮名や読みを添えるなど）は、画面ごとに renderTitle / renderMeaning で渡す。
 */
export function StudyAnswerListButton({
  groups,
  unit = '語',
  renderTitle = (item) => item.title,
  renderMeaning = (item) => item.meaning,
  titleLang,
  variant = 'soft',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const forgot = groups?.forgot ?? []
  const remembered = groups?.remembered ?? []
  const total = forgot.length + remembered.length
  if (!total) return null
  const shared = { unit, renderTitle, renderMeaning, titleLang }

  return (
    <>
      <Button
        full
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        data-study-answer-list-open
      >
        <Cards size={18} /> 一覧で確認
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="覚えた・まだの一覧">
        <div className="space-y-5 pb-2 text-left" data-study-answer-list>
          <p className="text-xs font-bold leading-relaxed text-ink/55">
            今回の{total}{unit}を、最後に選んだ答えで分けています。
          </p>
          <StudyAnswerGroup id="forgot" label="まだ" items={forgot} {...shared} />
          <StudyAnswerGroup id="remembered" label="覚えた" items={remembered} {...shared} />
        </div>
      </Sheet>
    </>
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
