import { buildReadingChoiceExplanations } from '../lib/instructorExplanations.js'
import { BookOpen, Check, Close } from './Icons.jsx'
import { cx } from './ui.jsx'

export function ReadingChoiceExplanations({ question, selectedChoice }) {
  const detail = buildReadingChoiceExplanations(question)

  return (
    <section
      className="mt-2 overflow-hidden rounded-2xl border border-sky-200 bg-white"
      data-reading-choice-explanations
      aria-label="設問と全選択肢の和訳解説"
    >
      <div className="flex items-center gap-2 border-b border-sky-200 bg-sky-50 px-3 py-2.5">
        <BookOpen size={17} className="shrink-0 text-sky-700" />
        <div>
          <p className="text-[10px] font-extrabold text-sky-700">英語と日本語を一つずつ対応</p>
          <h3 className="text-sm font-extrabold text-ink">設問・全選択肢の和訳解説</h3>
        </div>
      </div>

      <div className="p-3">
        <div
          className="rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2.5"
          data-reading-question-translation
        >
          <p className="text-[10px] font-extrabold text-sky-700">設問の和訳</p>
          <p lang="en" className="mt-1 text-xs font-bold leading-relaxed text-ink/65">
            {detail.question.en}
          </p>
          <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink">
            {detail.question.ja}
          </p>
        </div>

        <ol className="mt-3 space-y-2" aria-label="全選択肢の和訳と正誤理由">
          {detail.choices.map((choice, index) => {
            const selected = selectedChoice === choice.en
            return (
              <li
                key={choice.en}
                className={cx(
                  'rounded-xl border px-3 py-2.5',
                  choice.correct
                    ? 'border-emerald-200 bg-emerald-50'
                    : selected
                      ? 'border-rose-200 bg-rose-50'
                      : 'border-slate-200 bg-slate-50/70',
                )}
                data-reading-choice-translation
                data-reading-choice-correct={choice.correct ? 'true' : 'false'}
              >
                <div className="flex items-start gap-2">
                  <span className={cx(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold',
                    choice.correct
                      ? 'bg-emerald-500 text-white'
                      : selected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 text-slate-600',
                  )}>
                    {choice.correct
                      ? <Check size={12} />
                      : selected
                        ? <Close size={11} />
                        : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p lang="en" className="text-xs font-bold leading-relaxed text-ink/70">
                      {choice.en}
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold leading-relaxed text-ink">
                      和訳：{choice.ja}
                    </p>
                    <p className={cx(
                      'mt-1 text-[11px] font-bold leading-relaxed',
                      choice.correct ? 'text-emerald-800' : 'text-ink/55',
                    )}>
                      {choice.correct ? '本文と一致：' : 'この設問では不正解：'}
                      {choice.explanation}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
