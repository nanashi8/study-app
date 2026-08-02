import { useEffect, useRef, useState } from 'react'
import { ScreenHeader } from './AppShell.jsx'
import { ArrowRight, ChevronLeft, Sparkles } from './Icons.jsx'
import { cx } from './ui.jsx'

export function LightNovelScene({
  story,
  image,
  imageAlt = '',
  portraits = {},
  onBack,
  onComplete,
  completeLabel = '物語を進める',
  skipLabel = 'スキップ',
}) {
  const [pageIndex, setPageIndex] = useState(0)
  const textRef = useRef(null)
  const pages = story?.pages ?? []
  const lastIndex = Math.max(0, pages.length - 1)
  const page = pages[Math.min(pageIndex, lastIndex)] ?? { kind: 'narration', text: '' }
  const portrait = page.portraitId ? portraits[page.portraitId] : null
  const isLast = pageIndex >= lastIndex

  useEffect(() => {
    setPageIndex(0)
  }, [story?.id])

  useEffect(() => {
    textRef.current?.focus({ preventScroll: true })
  }, [pageIndex])

  const advance = () => {
    if (isLast) {
      onComplete?.()
      return
    }
    setPageIndex((current) => Math.min(lastIndex, current + 1))
  }

  return (
    <div
      className="min-h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950 pb-6 text-white"
      data-light-novel-scene
      data-story-id={story?.id}
    >
      <ScreenHeader
        title={story?.chapterLabel ?? 'STORY'}
        subtitle="ライトノベルパート"
        onBack={onBack}
        color="#0f172a"
        inverse
      />

      <div className="space-y-3 px-4 pt-3">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-900 shadow-2xl">
          <img
            src={image}
            alt={imageAlt}
            className="aspect-[16/9] w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-100/25 bg-slate-950/65 px-2.5 py-1 text-[8px] font-extrabold tracking-[0.16em] text-cyan-100 backdrop-blur-sm">
              <Sparkles size={11} /> NOVEL STORY
            </span>
            <h1 className="mt-2 font-display text-xl font-extrabold leading-tight text-white">
              {story?.title}
            </h1>
          </div>
        </section>

        <section
          ref={textRef}
          tabIndex={-1}
          aria-live="polite"
          aria-label={`${pageIndex + 1}ページ目、全${pages.length}ページ`}
          className={cx(
            'relative min-h-36 overflow-hidden rounded-[1.5rem] border p-4 shadow-xl outline-none',
            page.kind === 'dialogue'
              ? 'border-cyan-200/20 bg-white/[0.09]'
              : 'border-white/10 bg-slate-950/55',
          )}
        >
          <div className={cx('min-w-0', portrait ? 'pr-20' : '')}>
            <p className={cx(
              'text-[9px] font-extrabold tracking-[0.16em]',
              page.kind === 'dialogue' ? 'text-cyan-200' : 'text-violet-200',
            )}
            >
              {page.kind === 'dialogue' ? page.speaker : 'NARRATION'}
            </p>
            <p className="mt-2 text-sm font-bold leading-[1.9] text-white/90">
              {page.text}
            </p>
          </div>
          {portrait && (
            <img
              src={portrait}
              alt={`${page.speaker}の物語中の表情`}
              className="absolute bottom-3 right-3 h-16 w-16 rounded-2xl border-2 border-white/35 bg-slate-900 object-cover object-top shadow-xl [image-rendering:pixelated]"
            />
          )}
        </section>

        <div className="flex items-center justify-between gap-2 px-1" aria-label="物語の進行状況">
          <span className="text-[9px] font-extrabold text-white/45">
            {String(pageIndex + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
          </span>
          <span className="flex flex-1 justify-center gap-1" aria-hidden="true">
            {pages.map((storyPage, index) => (
              <span
                key={`${story?.id}-${storyPage.kind}-${index}`}
                className={cx(
                  'h-1.5 rounded-full transition-all',
                  index === pageIndex ? 'w-6 bg-cyan-300' : 'w-1.5 bg-white/20',
                )}
              />
            ))}
          </span>
          <button
            type="button"
            onClick={onComplete}
            className="min-h-11 rounded-xl px-2 text-[10px] font-extrabold text-white/55 active:bg-white/10"
          >
            {skipLabel}
          </button>
        </div>

        <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-2">
          <button
            type="button"
            onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
            disabled={pageIndex === 0}
            aria-label="前のページ"
            className="grid min-h-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-white disabled:opacity-25"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={advance}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 font-display text-base font-extrabold text-white shadow-lg shadow-violet-950/40 active:scale-[0.99]"
          >
            {isLast ? completeLabel : '次のページ'}
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </div>
  )
}
