import { BookOpen, Check, Close } from './Icons.jsx'
import { cx } from './ui.jsx'

export function ReadingPracticeExplanation({ question, selectedAnswer }) {
  const correct = selectedAnswer === question.answer
  const choiceItems = question.choices ?? []

  return (
    <section
      className="mt-3 overflow-hidden rounded-2xl border border-violet-200 bg-white"
      data-reading-practice-explanation
      aria-label="読解技能問題の答えと解説"
    >
      <div className="flex items-center gap-2 border-b border-violet-200 bg-violet-50 px-3 py-2.5">
        <BookOpen size={17} className="shrink-0 text-violet-700" />
        <div>
          <p className="text-[10px] font-extrabold text-violet-700">本文の実文で確認</p>
          <h3 className="text-sm font-extrabold text-ink">選択肢解説（3択すべて）</h3>
        </div>
      </div>

      <div className="p-3">
        <div className={cx(
          'rounded-xl border px-3 py-2.5',
          correct ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50',
        )}>
          <p className={cx(
            'text-[10px] font-extrabold',
            correct ? 'text-emerald-700' : 'text-rose-700',
          )}>
            {correct ? '正解' : '正しい答え'}
          </p>
          <p lang="en" className="mt-1 text-sm font-extrabold leading-relaxed text-ink">
            {question.sourceSentence}
          </p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/60">
            {question.sourceJa}
          </p>
          <p className="mt-2 text-xs font-extrabold leading-relaxed text-violet-900">
            {question.explain}
          </p>
        </div>

        {choiceItems.length > 0 && (
          <ol className="mt-3 space-y-2" aria-label="全選択肢の根拠">
            {choiceItems.map((choice, index) => {
              const isCorrect = choice === question.answer
              const selected = choice === selectedAnswer
              return (
                <li
                  key={choice}
                  className={cx(
                    'rounded-xl border px-3 py-2.5',
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50'
                      : selected
                        ? 'border-rose-200 bg-rose-50'
                        : 'border-slate-200 bg-slate-50/70',
                  )}
                  data-reading-practice-choice-note
                >
                  <div className="flex items-start gap-2">
                    <span className={cx(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold',
                      isCorrect
                        ? 'bg-emerald-500 text-white'
                        : selected
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 text-slate-600',
                    )}>
                      {isCorrect ? <Check size={12} /> : selected ? <Close size={11} /> : index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p lang="en" className="text-sm font-extrabold text-ink">{choice}</p>
                      <p className="mt-0.5 text-xs font-bold text-ink/55">
                        {question.choiceTranslations?.[choice]}
                      </p>
                      <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/65">
                        {question.choiceNotes?.[choice]}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
