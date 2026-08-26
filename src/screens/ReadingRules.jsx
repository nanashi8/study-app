import { useState } from 'react'
import { READING_RULE_PHASES, READING_RULES, readingRulesByPhase } from '../data/reading-rules.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { Card, Chip, cx } from '../components/ui.jsx'

const FILTER_ALL = 'all'

export function ReadingRulesScreen() {
  const [phaseId, setPhaseId] = useState(FILTER_ALL)
  const visibleRules = phaseId === FILTER_ALL ? READING_RULES : readingRulesByPhase(phaseId)

  return (
    <div className="pb-8">
      <ScreenHeader
        title="長文読解の30ルール"
        subtitle="見通す → 骨組み → 関係づける → 論理 → 根拠"
      />

      <div className="space-y-4 px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 to-sky-500 p-4 text-white">
            <div className="flex flex-wrap gap-2">
              <Chip color="#ffffff">全30ルール</Chip>
              <Chip color="#fde68a">実戦補強10</Chip>
            </div>
            <h1 className="mt-3 font-display text-xl font-extrabold">
              テーマと文章の型に合わせて、道筋をつかむ
            </h1>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/85">
              本文の合図を見つけ、三つ以内の手順で判断します。
              物語・案内・説明・論説で注目点を変え、迷ったらこの五段階へ戻りましょう。
            </p>
          </div>

          <ol
            className="grid grid-cols-1 gap-0 border-t border-brand-100 bg-white sm:grid-cols-5"
            aria-label="長文読解の五段階"
          >
            {READING_RULE_PHASES.map((phase, index) => (
              <li
                key={phase.id}
                className="relative flex items-center gap-3 border-b border-brand-100 px-3 py-3 last:border-b-0 sm:block sm:border-b-0 sm:border-r sm:text-center sm:last:border-r-0"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base sm:mx-auto"
                  style={{ backgroundColor: phase.color + '18', color: phase.color }}
                >
                  {phase.icon}
                </span>
                <div className="min-w-0 sm:mt-1.5">
                  <p className="text-[10px] font-black" style={{ color: phase.color }}>STEP {phase.step}</p>
                  <p className="text-sm font-extrabold text-ink">{phase.label}</p>
                </div>
                {index < READING_RULE_PHASES.length - 1 && (
                  <span className="absolute -bottom-2 left-7 z-10 text-sm font-black text-brand-300 sm:-right-2 sm:bottom-auto sm:left-auto sm:top-7">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">効率のよい使い方</h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              ['読む前', '題名・文章の種類・テーマを見て、何に注意して読むかを2〜3点決める。'],
              ['読む途中', '接続語や長い文で止まり、その文章に合う読み方を使う。'],
              ['答えた後', '本文のどこが根拠かを確かめ、間違えた理由を見直す。'],
            ].map(([label, text], index) => (
              <li key={label} className="rounded-xl bg-brand-50 p-3">
                <p className="text-xs font-black text-brand-600">{index + 1}. {label}</p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/65">{text}</p>
              </li>
            ))}
          </ol>
        </Card>

        <div className="-mx-4 overflow-x-auto px-4 pb-1" aria-label="ルールの段階を絞り込む">
          <div className="flex w-max gap-2">
            <button
              type="button"
              onClick={() => setPhaseId(FILTER_ALL)}
              className={cx(
                'min-h-10 rounded-full border px-4 text-sm font-extrabold',
                phaseId === FILTER_ALL
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-brand-100 bg-white text-ink/60',
              )}
            >
              すべて 30
            </button>
            {READING_RULE_PHASES.map((phase) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => setPhaseId(phase.id)}
                className={cx(
                  'min-h-10 rounded-full border px-4 text-sm font-extrabold',
                  phaseId === phase.id
                    ? 'text-white'
                    : 'border-brand-100 bg-white text-ink/60',
                )}
                style={phaseId === phase.id ? { backgroundColor: phase.color, borderColor: phase.color } : undefined}
              >
                {phase.icon} {phase.label} {readingRulesByPhase(phase.id).length}
              </button>
            ))}
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-extrabold text-ink/40">選択中</p>
              <h2 className="font-display text-lg font-extrabold text-ink">
                {phaseId === FILTER_ALL
                  ? '全段階'
                  : READING_RULE_PHASES.find((phase) => phase.id === phaseId)?.label}
              </h2>
            </div>
            <span className="text-sm font-extrabold text-brand-600">{visibleRules.length}ルール</span>
          </div>
          <div className="space-y-3">
            {visibleRules.map((rule) => <ReadingRuleCard key={rule.id} rule={rule} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
