import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { introForUnit } from '../data/math-intros.js'
import { problemsForUnit, unitById } from '../data/math.js'
import { MathVisual } from '../components/MathVisual.jsx'
import { MathBlock, MathText } from '../components/MathText.jsx'
import { Button, Chip, IconButton, cx } from '../components/ui.jsx'
import { ArrowRight, ChevronLeft, Eye, Lightbulb, Sparkles } from '../components/Icons.jsx'

const defaultsFor = (intro) =>
  Object.fromEntries((intro?.controls ?? []).map((control) => [control.id, control.initial]))

export function MathIntroScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const navigate = useStore((state) => state.navigate)
  const unit = unitById(params.unitId)
  const intro = introForUnit(params.unitId)
  const problemCount = problemsForUnit(params.unitId).length
  const defaults = useMemo(() => defaultsFor(intro), [intro])
  const [session, setSession] = useState(() => ({ unitId: params.unitId, values: defaults }))
  const values = session.unitId === params.unitId ? session.values : defaults

  if (!unit || !intro) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧭</div>
        <p className="font-display text-lg font-extrabold text-ink">この単元の導入は準備中です</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const setValue = (id, value) => {
    setSession((current) => ({
      unitId: params.unitId,
      values: {
        ...(current.unitId === params.unitId ? current.values : defaults),
        [id]: value,
      },
    }))
  }

  const formula = intro.formula(values)
  const insight = intro.insight(values)

  return (
    <div className="flex min-h-full flex-col">
      <div
        className="relative overflow-hidden px-4 pb-5 pt-[calc(env(safe-area-inset-top)+0.5rem)] text-white"
        style={{ background: `linear-gradient(145deg, ${unit.color}, #4338ca)` }}
      >
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-2">
          <IconButton
            onClick={back}
            aria-label="単元一覧へ戻る"
            className="-ml-2 text-white active:bg-white/15"
          >
            <ChevronLeft size={24} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-white/75">
              <span>{unit.grade}</span>
              <span>•</span>
              <span>{unit.strand}</span>
            </div>
            <h1 className="truncate font-display text-xl font-extrabold">{unit.emoji} {unit.title}</h1>
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold">
            導入
          </span>
        </div>

        <div className="relative mt-4">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-extrabold text-white/90">
            <Sparkles size={13} /> 動かして発見
          </div>
          <h2 className="max-w-sm font-display text-xl font-extrabold leading-snug">
            {intro.question}
          </h2>
          <p className="mt-1.5 text-sm font-bold leading-relaxed text-white/75">
            {intro.instruction}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-28 pt-4">
        <section
          className="overflow-hidden rounded-[1.75rem] bg-white shadow-card"
          style={{ '--intro-color': unit.color }}
          aria-label={`${unit.title}の動く図`}
        >
          <div className="bg-gradient-to-b from-white to-paper px-2 pb-1 pt-3">
            <MathVisual
              intro={intro}
              values={values}
              unit={unit}
              label={`${intro.question}。${intro.instruction}`}
            />
          </div>

          <div className="space-y-4 border-t border-violet-100 px-4 py-4">
            {intro.controls.map((control) => (
              <VisualControl
                key={control.id}
                control={control}
                value={values[control.id]}
                color={unit.color}
                onChange={(value) => setValue(control.id, value)}
              />
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border-2 border-violet-100 bg-white px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Eye size={17} className="shrink-0 text-violet-500" />
            <p className="text-xs font-extrabold tracking-wide text-violet-500">いま図に出ている関係</p>
          </div>
          <MathBlock tex={formula} className="mt-2 text-ink [&_.katex]:text-[1.2rem]" />
        </section>

        <section className="mt-3 rounded-2xl bg-hint-soft px-4 py-3.5">
          <div className="flex items-start gap-2">
            <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="text-xs font-extrabold tracking-wide text-amber-700">変えても残るポイント</p>
              <p className="mt-1 text-sm font-bold leading-relaxed text-amber-900">
                <MathText>{insight}</MathText>
              </p>
            </div>
          </div>
        </section>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-ink/45">
          <Chip color={unit.color}>{unit.desc}</Chip>
          <span>•</span>
          <span>練習 {problemCount}問</span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-violet-100 bg-white/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button
          full
          size="lg"
          onClick={() => navigate('mathSolve', { unitId: unit.id })}
          className="shadow-pop"
        >
          問題で試してみる <ArrowRight size={19} />
        </Button>
      </div>
    </div>
  )
}

function VisualControl({ control, value, color, onChange }) {
  const shown = control.valueLabel ? control.valueLabel(value) : String(value)

  if (control.type === 'options') {
    return (
      <fieldset>
        <legend className="mb-2 text-xs font-extrabold text-ink/55">{control.label}</legend>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${control.options.length}, minmax(0, 1fr))` }}>
          {control.options.map((option) => {
            const selected = String(value) === String(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(option.value)}
                className={cx(
                  'min-h-10 rounded-xl border-2 px-2 py-2 text-xs font-extrabold transition-all active:scale-[0.98]',
                  selected
                    ? 'text-white shadow-sm'
                    : 'border-violet-100 bg-paper text-ink/60 active:bg-violet-50',
                )}
                style={selected ? { backgroundColor: color, borderColor: color } : undefined}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </fieldset>
    )
  }

  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-ink/55">{control.label}</span>
        <output className="rounded-full px-2.5 py-1 text-xs font-extrabold" style={{ color, backgroundColor: `${color}16` }}>
          {shown}
        </output>
      </span>
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-violet-100 accent-violet-600"
        style={{ accentColor: color }}
        aria-label={control.label}
        aria-valuetext={shown}
      />
      <span className="mt-1 flex justify-between text-[10px] font-bold text-ink/35" aria-hidden="true">
        <span>{control.valueLabel ? control.valueLabel(control.min) : control.min}</span>
        <span>{control.valueLabel ? control.valueLabel(control.max) : control.max}</span>
      </span>
    </label>
  )
}
