import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from './Icons.jsx'

export function LiteratureSceneNavigator({
  current,
  total,
  onChange,
  color = '#0f766e',
  completed = false,
}) {
  const stripRef = useRef(null)
  const activeRef = useRef(null)
  const safeCurrent = Math.max(0, Math.min(current, Math.max(0, total - 1)))

  useEffect(() => {
    const strip = stripRef.current
    const active = activeRef.current
    if (!strip || !active || typeof strip.scrollTo !== 'function') return
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const centerActive = (behavior = reduceMotion ? 'auto' : 'smooth') => {
      strip.scrollTo({
        left: Math.max(0, active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2),
        behavior,
      })
    }
    const handleResize = () => centerActive('auto')

    centerActive()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [safeCurrent, total])

  if (total <= 0) return null

  return (
    <nav
      aria-label="場面の切り替え"
      className="sticky top-[4.25rem] z-10 rounded-2xl border border-slate-200/90 bg-white/95 p-2.5 shadow-card backdrop-blur"
      data-literature-scene-navigation
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(safeCurrent - 1)}
          disabled={safeCurrent === 0}
          aria-label="前の場面へ"
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-slate-100 px-2 text-xs font-extrabold text-ink transition-colors active:bg-slate-200 disabled:text-ink/25 disabled:active:bg-slate-100"
          data-literature-scene-previous
        >
          <ChevronLeft size={17} /> 前へ
        </button>

        <div className="min-w-[5.5rem] text-center" aria-live="polite" aria-atomic="true">
          <span className="block text-[10px] font-extrabold tracking-[0.12em] text-ink/40">
            現在の場面
          </span>
          <span className="block font-display text-base font-extrabold text-ink">
            {safeCurrent + 1}
            <span className="mx-1 text-xs text-ink/35">/</span>
            {total}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onChange(safeCurrent + 1)}
          disabled={safeCurrent === total - 1}
          aria-label="次の場面へ"
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl px-2 text-xs font-extrabold text-white transition-opacity active:opacity-80 disabled:bg-slate-100 disabled:text-ink/25 disabled:active:opacity-100"
          style={safeCurrent === total - 1 ? undefined : { backgroundColor: color }}
          data-literature-scene-next
        >
          次へ <ChevronRight size={17} />
        </button>
      </div>

      <div
        ref={stripRef}
        role="group"
        aria-label="場面を直接選ぶ"
        className="no-scrollbar mt-2 flex snap-x gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5"
        data-literature-scene-strip
      >
        {Array.from({ length: total }, (_, index) => {
          const active = safeCurrent === index
          return (
            <button
              key={index}
              ref={active ? activeRef : null}
              type="button"
              onClick={() => onChange(index)}
              aria-label={`${index + 1}場面へ移動`}
              aria-current={active ? 'step' : undefined}
              className={`min-h-11 min-w-11 snap-center rounded-xl border px-3 text-xs font-extrabold transition-colors ${
                active
                  ? 'border-transparent text-white'
                  : completed
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-50 text-ink/55 active:bg-slate-100'
              }`}
              style={active ? { backgroundColor: color } : undefined}
              data-literature-scene-option={index + 1}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
