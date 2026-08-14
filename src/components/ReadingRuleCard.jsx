import { getReadingRulePhase, READING_RULE_LEVELS } from '../data/reading-rules.js'
import { Chip, cx } from './ui.jsx'

const DIAGRAM_LABELS = Object.freeze({
  flow: '流れ',
  speed: '読む速さ',
  branch: '見分け方',
  layers: '骨組みと補足',
  roles: '文の中心',
  bracket: 'かたまり',
  balance: '対応',
  backlink: '戻り先',
  scope: 'かかる範囲',
  turn: '逆転',
  scale: '強さ',
  loop: '読み直し',
})

function DiagramArrow() {
  return (
    <span aria-hidden="true" className="shrink-0 px-0.5 text-base font-black text-brand-300">
      →
    </span>
  )
}

export function ReadingRuleDiagram({ diagram, className }) {
  if (!diagram?.nodes?.length) return null

  const branching = diagram.type === 'branch' || diagram.type === 'layers'
  const looping = diagram.type === 'loop'

  return (
    <figure
      className={cx('rounded-xl border border-brand-100 bg-brand-50/55 p-3', className)}
      data-reading-rule-diagram={diagram.type}
    >
      <figcaption className="mb-2 text-[10px] font-black tracking-wide text-brand-500">
        図で確認：{DIAGRAM_LABELS[diagram.type] || '読み方'}
      </figcaption>
      <div
        className={cx(
          branching
            ? 'grid gap-1.5 sm:grid-cols-2'
            : 'flex flex-wrap items-center gap-y-1.5',
        )}
      >
        {diagram.nodes.map((node, index) => (
          <span key={node + '-' + index} className={cx(!branching && 'contents')}>
            <span
              className={cx(
                'rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-center text-xs font-extrabold leading-relaxed text-ink/75',
                branching && 'min-w-0',
              )}
            >
              {node}
            </span>
            {!branching && index < diagram.nodes.length - 1 && <DiagramArrow />}
            {looping && index === diagram.nodes.length - 1 && (
              <span className="ml-1 text-xs font-black text-brand-500" aria-label="最初へ戻る">
                ↩ 最初へ
              </span>
            )}
          </span>
        ))}
      </div>
    </figure>
  )
}

export function ReadingRuleCard({ rule, compact = false, className }) {
  if (!rule) return null

  const phase = getReadingRulePhase(rule.phase)
  const level = READING_RULE_LEVELS[rule.level]

  if (compact) {
    return (
      <details
        className={cx('group rounded-xl border border-brand-100 bg-white', className)}
        data-reading-rule-id={rule.id}
      >
        <summary className="flex cursor-pointer list-none items-start gap-2 px-3 py-2.5">
          <span aria-hidden="true" className="mt-0.5 text-base">{phase.icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-ink">{rule.title}</span>
            <span className="mt-0.5 block text-xs font-bold leading-relaxed text-ink/55">{rule.short}</span>
          </span>
          <span className="mt-1 text-xs font-black text-brand-400 transition-transform group-open:rotate-90" aria-hidden="true">
            ›
          </span>
        </summary>
        <div className="border-t border-brand-100 px-3 pb-3 pt-2.5">
          <p className="text-xs font-bold leading-relaxed text-ink/60">
            <span className="text-brand-600">合図：</span>{rule.signal}
          </p>
          <ol className="mt-2 space-y-1">
            {rule.steps.map((step, index) => (
              <li key={step} className="flex gap-2 text-xs font-bold leading-relaxed text-ink/70">
                <span className="font-black text-brand-500">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {rule.diagram && <ReadingRuleDiagram diagram={rule.diagram} className="mt-2" />}
          <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] font-bold leading-relaxed text-amber-900">
            誤読防止：{rule.caution}
          </p>
        </div>
      </details>
    )
  }

  return (
    <article
      className={cx('rounded-2xl border border-brand-100 bg-white p-4 shadow-sm', className)}
      data-reading-rule-id={rule.id}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Chip color={phase.color}>{phase.step}. {phase.label}</Chip>
        <Chip color={level.color}>{level.label}</Chip>
        {rule.origin === 'added' && <Chip color="#be123c">実戦補強</Chip>}
      </div>
      <h3 className="mt-2 font-display text-lg font-extrabold text-ink">{rule.title}</h3>
      <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65">{rule.short}</p>

      <div className="mt-3 rounded-xl bg-brand-50 px-3 py-2.5">
        <p className="text-xs font-extrabold text-brand-700">見つける合図</p>
        <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/65">{rule.signal}</p>
      </div>

      <ol className="mt-3 space-y-2">
        {rule.steps.map((step, index) => (
          <li key={step} className="flex gap-2.5 text-sm font-bold leading-relaxed text-ink/75">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-black text-brand-700">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {rule.diagram && <ReadingRuleDiagram diagram={rule.diagram} className="mt-3" />}

      <div className="mt-3 rounded-xl border-l-4 border-emerald-300 bg-emerald-50 px-3 py-2.5">
        <p lang="en" className="text-sm font-extrabold leading-relaxed text-ink">{rule.example.en}</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-emerald-800">{rule.example.ja}</p>
      </div>

      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-amber-950">
        <span className="font-black">誤読防止：</span>{rule.caution}
      </p>
    </article>
  )
}
