import { grammarChoiceUsageFor } from '../data/grammar.js'
import { grammarChoiceExplanationFor } from '../lib/grammarQuestionExplanations.js'
import { cx } from './ui.jsx'

export function GrammarChoiceExplanations({
  item,
  choices = item?.choices ?? [],
  selected,
  className,
  compact = false,
}) {
  if (!item) return null

  return (
    <section
      className={cx('border-t border-brand-100 pt-3', className)}
      data-grammar-choice-guidance
      aria-label="3択すべての根拠"
    >
      <p className="font-display text-sm font-extrabold text-ink/70">選択肢解説（3択すべて）</p>
      <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/45">
        正解も誤答も、問題文の手掛かり・意味・規則に当てはめて比べます。
      </p>
      <div className={cx('mt-2 space-y-2', compact && 'space-y-1.5')}>
        {choices.map((choice) => {
          const correct = choice === item.answer
          const chosenWrong = selected === choice && !correct
          const guidance = grammarChoiceUsageFor(item, choice)
          const usable = guidance?.status === 'valid'
          const example = guidance?.example?.en ?? guidance?.pattern
          const reason = grammarChoiceExplanationFor(item, choice, choices)

          return (
            <article
              key={choice}
              data-grammar-choice-guide={choice}
              data-choice-status={guidance?.status}
              data-choice-correct={correct ? 'true' : 'false'}
              className={cx(
                'rounded-xl border',
                compact ? 'p-2.5' : 'p-3',
                correct
                  ? 'border-emerald-200 bg-emerald-50/75'
                  : usable
                    ? 'border-brand-100 bg-brand-50/55'
                    : 'border-rose-100 bg-rose-50/65',
                chosenWrong && 'ring-2 ring-rose-300',
              )}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-display text-sm font-extrabold text-ink">{choice}</span>
                {correct && (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    正解
                  </span>
                )}
                {!correct && !usable && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                    この形は使わない
                  </span>
                )}
                {chosenWrong && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    あなたの回答
                  </span>
                )}
              </div>

              <p
                className={cx(
                  'mt-1.5 text-xs font-bold leading-relaxed',
                  correct ? 'text-emerald-900/80' : 'text-rose-800/80',
                )}
                data-grammar-choice-reason={choice}
              >
                <span className="font-extrabold">
                  {correct ? 'この文で正しい理由：' : 'この文では：'}
                </span>
                {reason}
              </p>

              <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/65">
                <span className="font-extrabold">この形の使い方：</span>
                {guidance?.summary}
              </p>
              {example && (
                <div className="mt-1.5 rounded-lg bg-white/80 px-2.5 py-2">
                  <p className="text-xs font-extrabold leading-relaxed text-ink">例・型：{example}</p>
                  {guidance?.example?.ja && (
                    <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-ink/45">
                      {guidance.example.ja}
                    </p>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
