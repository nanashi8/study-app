import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { introForUnit } from '../data/math-intros.js'
import { problemsForUnit, unitById } from '../data/math.js'
import { MathVisual } from '../components/MathVisual.jsx'
import { MathBlock, MathText } from '../components/MathText.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, Chip, IconButton, cx } from '../components/ui.jsx'
import { rangeProgress, stepRangeValue } from '../lib/mathVisualControls.js'
import { readableMathAccent } from '../lib/mathVisualColors.js'
import {
  ArrowRight, ChevronLeft, ChevronRight, Eye, Lightbulb, Sparkles,
} from '../components/Icons.jsx'
import './MathIntro.css'

const defaultsFor = (intro) =>
  Object.fromEntries((intro?.controls ?? []).map((control) => [control.id, control.initial]))

export function MathIntroScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const unit = unitById(params.unitId)
  const intro = introForUnit(params.unitId)
  const problemCount = problemsForUnit(params.unitId).length
  const defaults = useMemo(() => defaultsFor(intro), [intro])
  const [session, setSession] = useState(() => ({ unitId: params.unitId, values: defaults }))
  const values = session.unitId === params.unitId ? session.values : defaults

  // コンテンツ画面の「戻る」は履歴でなく、単元の選択画面へ。
  const backToMathUnits = () => returnTo('mathUnits')

  if (!unit || !intro) {
    return (
      <div className="relative flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="absolute right-3 top-3">
          <SpeechSettingsButton compact />
        </div>
        <div className="text-5xl">🧭</div>
        <p className="font-display text-lg font-extrabold text-ink">この単元の導入は準備中です</p>
        <Button onClick={backToMathUnits}>もどる</Button>
      </div>
    )
  }

  const accent = readableMathAccent(unit.color)

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
        className="relative overflow-hidden px-4 pb-5 pt-2 text-white"
        style={{ background: `linear-gradient(145deg, ${accent}, #312e81)` }}
      >
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-2">
          <IconButton
            onClick={backToMathUnits}
            aria-label="単元一覧へ戻る"
            className="-ml-2 text-white active:bg-white/15"
          >
            <ChevronLeft size={24} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-white">
              <span>{unit.grade}</span>
              <span>•</span>
              <span>{unit.strand}</span>
            </div>
            <h1 className="truncate font-display text-xl font-extrabold">{unit.emoji} {unit.title}</h1>
          </div>
          <SpeechSettingsButton compact inverse />
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-extrabold">
            導入
          </span>
        </div>

        <div className="relative mt-4">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-extrabold text-white">
            <Sparkles size={13} /> 動かして発見
          </div>
          <h2 className="max-w-sm font-display text-xl font-extrabold leading-snug">
            {intro.question}
          </h2>
          <p className="mt-1.5 text-sm font-bold leading-relaxed text-white">
            {intro.instruction}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-28 pt-4">
        <section
          className="overflow-hidden rounded-[1.75rem] bg-white shadow-card"
          style={{ '--intro-color': accent }}
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

          <div
            className="border-t-2 border-violet-100 bg-gradient-to-b from-violet-50/80 to-white px-3 pb-4 pt-3"
            aria-label="図を動かす操作"
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-base font-black shadow-sm"
                style={{ color: accent }}
                aria-hidden="true"
              >
                ↔
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-ink">図を動かす</h3>
                <p className="text-[11px] font-bold text-ink/75">値を変えると、上の図へすぐ反映されます</p>
              </div>
            </div>

            <div className="space-y-3">
              {intro.controls.map((control) => (
                <VisualControl
                  key={control.id}
                  control={control}
                  value={values[control.id]}
                  color={accent}
                  onChange={(value) => setValue(control.id, value)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border-2 border-violet-100 bg-white px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Eye size={17} className="shrink-0 text-violet-700" />
            <p className="text-xs font-extrabold tracking-wide text-violet-700">いま図に出ている関係</p>
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

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-ink/70">
          <Chip color={accent}>{unit.desc}</Chip>
          <span>•</span>
          <span>練習 {problemCount}問</span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-violet-100 bg-white/95 p-4 pb-[calc(1rem+var(--app-safe-bottom))] backdrop-blur">
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

export function VisualControl({ control, value, color, onChange }) {
  const shown = control.valueLabel ? control.valueLabel(value) : String(value)

  if (control.type === 'options') {
    return (
      <fieldset
        className="rounded-2xl border-2 bg-white p-3 shadow-sm"
        style={{ borderColor: `${color}70` }}
      >
        <legend className="px-1 text-sm font-extrabold text-ink">{control.label}</legend>
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
                  'flex min-h-12 items-center justify-center gap-1 rounded-xl border-2 px-2 py-2.5 text-sm font-extrabold transition-all focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-[0.98]',
                  selected
                    ? 'text-white shadow-md'
                    : 'border-slate-500 bg-white text-ink/80 shadow-sm active:bg-violet-50',
                )}
                style={selected
                  ? { backgroundColor: color, borderColor: color, outlineColor: color }
                  : { outlineColor: color }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </fieldset>
    )
  }

  const progress = rangeProgress(control, value)
  const atMin = Number(value) <= Number(control.min)
  const atMax = Number(value) >= Number(control.max)
  const inputId = `math-control-${control.id}`

  return (
    <fieldset
      className="rounded-2xl border-2 bg-white p-3 shadow-sm"
      style={{ borderColor: `${color}70` }}
    >
      <legend className="sr-only">{control.label}</legend>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-extrabold text-ink">
          {control.label}
        </label>
        <output
          htmlFor={inputId}
          className="min-w-14 rounded-full px-3 py-1.5 text-center text-sm font-extrabold text-white shadow-sm"
          style={{ backgroundColor: color }}
          aria-live="polite"
        >
          {shown}
        </output>
      </div>

      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onChange(stepRangeValue(control, value, -1))}
          disabled={atMin}
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 bg-white transition-transform focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-300"
          style={atMin ? undefined : { color, borderColor: color, outlineColor: color }}
          aria-label={`${control.label}：前の値`}
          aria-controls={inputId}
        >
          <ChevronLeft size={21} />
        </button>

        <div className="min-w-0 flex-1">
          <input
            id={inputId}
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="math-visual-range"
            style={{
              '--range-color': color,
              '--range-progress': `${progress}%`,
            }}
            aria-label={control.label}
            aria-valuetext={shown}
          />
          <span className="-mt-0.5 flex justify-between gap-3 text-xs font-extrabold text-ink/75" aria-hidden="true">
            <span>{control.valueLabel ? control.valueLabel(control.min) : control.min}</span>
            <span className="text-right">{control.valueLabel ? control.valueLabel(control.max) : control.max}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onChange(stepRangeValue(control, value, 1))}
          disabled={atMax}
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 bg-white transition-transform focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-300"
          style={atMax ? undefined : { color, borderColor: color, outlineColor: color }}
          aria-label={`${control.label}：次の値`}
          aria-controls={inputId}
        >
          <ChevronRight size={21} />
        </button>
      </div>
    </fieldset>
  )
}
