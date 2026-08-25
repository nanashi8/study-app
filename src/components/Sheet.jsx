import { useEffect } from 'react'
import { IconButton } from './ui.jsx'
import { Close } from './Icons.jsx'

/** 下から出るボトムシート。アプリ幅(max-w-md)に揃えて中央寄せ表示。 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer = null,
  scrollAreaRef = null,
  maxH = 'min(85svh, calc(var(--app-visual-viewport-height) - 0.5rem))',
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="app-viewport-overlay fixed inset-x-0 z-[70] flex items-end justify-center" data-sheet-layer>
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-t-[2rem] bg-paper shadow-[0_-10px_40px_-10px_rgba(30,27,75,0.4)] animate-slide-up"
        style={{ maxHeight: maxH }}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-3 pb-1">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-ink/15" />
        </div>
        {title && (
          <div className="flex shrink-0 items-center justify-between gap-3 px-5 pb-2">
            <h3 className="min-w-0 font-display text-xl font-extrabold leading-tight text-ink">
              {title}
            </h3>
            <div className="shrink-0">
              <IconButton onClick={onClose} aria-label="閉じる">
                <Close size={20} />
              </IconButton>
            </div>
          </div>
        )}
        <div
          ref={scrollAreaRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-[calc(1.5rem+var(--app-bottom-clearance))]"
          data-sheet-scroll-area
        >
          {children}
        </div>
        {footer && (
          <div
            className="shrink-0 border-t border-brand-100 bg-paper px-5 pt-3 pb-[calc(0.75rem+var(--app-bottom-clearance))]"
            data-sheet-footer
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
