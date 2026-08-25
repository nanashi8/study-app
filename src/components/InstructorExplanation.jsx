import { Lightbulb, Target } from './Icons.jsx'
import { cx } from './ui.jsx'

const SECTION_META = [
  { key: 'evidence', label: '根拠', tone: 'bg-sky-50 text-sky-950', dot: 'bg-sky-500' },
  { key: 'trap', label: '消去法', tone: 'bg-rose-50 text-rose-950', dot: 'bg-rose-400' },
  { key: 'strategy', label: '考え方', tone: 'bg-violet-50 text-violet-950', dot: 'bg-violet-500' },
]

export function InstructorExplanation({
  explanation,
  className = '',
  compact = false,
  renderText = (text) => text,
}) {
  if (!explanation) return null

  return (
    <section
      className={cx(
        'overflow-hidden rounded-2xl border border-amber-200 bg-white',
        className,
      )}
      data-instructor-explanation
      aria-label="徹底解説"
    >
      <div className={cx(
        'flex items-center gap-2 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50',
        compact ? 'px-3 py-2.5' : 'px-4 py-3',
      )}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-amber-950">
          <Lightbulb size={17} />
        </span>
        <div>
          <p className="text-[10px] font-extrabold text-amber-700">答えを理解する</p>
          <h3 className="font-display text-sm font-extrabold text-ink">
            徹底解説
          </h3>
        </div>
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-start gap-2" data-explanation-section="answer">
          <Target size={17} className="mt-0.5 shrink-0 text-emerald-500" />
          <div>
            <p className="text-[10px] font-extrabold tracking-wide text-emerald-700">
              正解の決め手
            </p>
            <div className="mt-0.5 text-sm font-extrabold leading-relaxed text-ink/80">
              {renderText(explanation.answer)}
            </div>
          </div>
        </div>

        <div className={cx('mt-3 grid gap-2', !compact && 'sm:grid-cols-1')}>
          {SECTION_META.map((section) => (
            <div
              key={section.key}
              className={cx('rounded-xl px-3 py-2.5', section.tone)}
              data-explanation-section={section.key}
            >
              <div className="flex items-center gap-1.5">
                <span className={cx('h-2 w-2 rounded-full', section.dot)} />
                <p className="text-[10px] font-extrabold tracking-wide opacity-65">
                  {section.label}
                </p>
              </div>
              <div className="mt-1 text-xs font-bold leading-relaxed opacity-80">
                {renderText(explanation[section.key])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
