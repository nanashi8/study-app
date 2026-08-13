import { useEffect } from 'react'
import { IconButton } from './ui.jsx'
import { Close } from './Icons.jsx'

/** 下から出るボトムシート。アプリ幅(max-w-md)に揃えて中央寄せ表示。 */
export function Sheet({ open, onClose, title, children, maxH = '85vh' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md animate-slide-up rounded-t-[2rem] bg-paper shadow-[0_-10px_40px_-10px_rgba(30,27,75,0.4)]"
        style={{ maxHeight: maxH }}
      >
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-ink/15" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-2">
            <h3 className="font-display text-xl font-extrabold text-ink">{title}</h3>
            <IconButton onClick={onClose} aria-label="閉じる">
              <Close size={20} />
            </IconButton>
          </div>
        )}
        <div
          className="overflow-y-auto overflow-x-hidden px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          style={{ maxHeight: `calc(${maxH} - 4rem)` }}
          data-sheet-scroll-area
        >
          {children}
        </div>
      </div>
    </div>
  )
}
