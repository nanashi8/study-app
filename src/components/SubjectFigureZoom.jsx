// 社会・理科の図（svg で描く図）を、押すと画面いっぱいに大きくして見られるようにする。スマホでは画面を指で拡大できないため。
// 図そのものを押しても、図の上の「大きく見る」を押しても開く。大きくした図は縦横に動かして、細かい文字や読みがなまで読める。
// 大きさは、元の図のいちばん小さい文字が16px以上・読みがなが8px以上になるように、元の図の文字を測って決める。
// 大きくした図は重ねて出すだけで、下の画面は動かさないので、閉じると元の画面の同じ位置に戻る。
// 確かめるテストは tests/junior-social-science-figure-zoom.test.mjs。
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Close } from './Icons.jsx'
import { SubjectText } from './SubjectText.jsx'

/** 大きくした図での、文字と読みがなの大きさの下限（px）。 */
export const ZOOM_MIN_TEXT_PX = 16
export const ZOOM_MIN_RUBY_PX = 8

/** root の中の svg の文字の、画面での大きさ（px）のいちばん小さいもの。読みがな（data-subject-ruby の中）は別に数える。 */
export function smallestFigureText(root) {
  let text = Infinity
  let ruby = Infinity
  for (const node of root.querySelectorAll('svg text')) {
    if (!node.textContent.trim()) continue
    const style = getComputedStyle(node)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    const ctm = node.getScreenCTM()
    const px = parseFloat(style.fontSize) * (ctm ? Math.hypot(ctm.a, ctm.b) : 1)
    if (!(px > 0)) continue
    if (node.closest('[data-subject-ruby]')) ruby = Math.min(ruby, px)
    else text = Math.min(text, px)
  }
  return { text, ruby }
}

/** 元の図の幅と文字の大きさから、大きくした図の幅を決める（少なくとも元の1.6倍）。 */
function zoomWidth(root) {
  const width = root.getBoundingClientRect().width || 300
  const { text, ruby } = smallestFigureText(root)
  const scale = Math.max(1.6, Number.isFinite(text) ? ZOOM_MIN_TEXT_PX / text : 1, Number.isFinite(ruby) ? ZOOM_MIN_RUBY_PX / ruby : 1)
  return Math.ceil(width * scale * 1.02)
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.4 10.4 14 14M7 5v4M5 7h4" />
    </svg>
  )
}

function ZoomLayer({ caption, width, onClose, children }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const layer = (
    <div className="app-viewport-overlay fixed inset-x-0 z-[80] flex justify-center bg-ink/60" role="dialog" aria-modal="true" aria-label={caption ? `${caption}（大きくした図）` : '大きくした図'} data-subject-figure-zoom-layer>
      <div className="flex h-full w-full max-w-md flex-col bg-white">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2">
          <p className="min-w-0 flex-1 text-sm font-extrabold leading-snug text-ink"><SubjectText>{caption || '図'}</SubjectText></p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 text-sm font-extrabold text-ink active:bg-slate-200"
            data-subject-figure-zoom-close
          >
            <Close size={18} />
            {'閉じる'}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain pb-[var(--app-bottom-clearance)]" data-subject-figure-zoom-scroll>
          <div className="p-3" style={{ width: `${width + 24}px` }}>{children}</div>
        </div>
      </div>
    </div>
  )
  return typeof document === 'undefined' ? layer : createPortal(layer, document.body)
}

/** 図の上の行（図の題と「大きく見る」）と、押すと大きくなる図。 */
export function ZoomableFigure({ caption, children, renderCaption }) {
  const figureRef = useRef(null)
  const buttonRef = useRef(null)
  const [width, setWidth] = useState(null)
  const open = useCallback(() => {
    if (figureRef.current) setWidth(zoomWidth(figureRef.current))
  }, [])
  const close = useCallback(() => {
    setWidth(null)
    buttonRef.current?.focus({ preventScroll: true })
  }, [])
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">{renderCaption}</div>
        <button
          ref={buttonRef}
          type="button"
          onClick={open}
          className="mb-1.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-extrabold text-ink/70 ring-1 ring-slate-300 active:bg-slate-100"
          data-subject-figure-zoom-button
        >
          <ZoomIcon />
          {'大きく見る'}
        </button>
      </div>
      <div
        ref={figureRef}
        role="button"
        tabIndex={-1}
        aria-label={caption ? `${caption}を大きく見る` : '図を大きく見る'}
        onClick={open}
        className="cursor-zoom-in"
        data-subject-figure-zoom-target
      >
        {children}
      </div>
      {width !== null && <ZoomLayer caption={caption} width={width} onClose={close}>{children}</ZoomLayer>}
    </>
  )
}
