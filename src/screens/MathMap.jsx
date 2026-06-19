import { useStore } from '../store/useStore.js'
import {
  MATH_UNITS, strandsWithUnits, unitCount, unitDoneCount, prereqOf, unitById,
  weakPrereqs, reviewSuggestions,
} from '../data/math.js'
import { ProgressRing, Chip, cx } from '../components/ui.jsx'
import { Check, ArrowRight, Link as LinkIcon, Lightbulb, ChevronLeft } from '../components/Icons.jsx'

// 単元1つの理解度をまとめる。
//  status: 'done'(全クリア) | 'progress'(一部) | 'new'(未着手) | 'soon'(準備中)
function unitState(u, mathDone, mathMastery) {
  const total = unitCount(u.id)
  const done = unitDoneCount(u.id, mathDone)
  const mastery = mathMastery[u.id] ?? 0 // 最高正答率
  const coverage = total ? done / total : 0
  let status = 'new'
  if (!total) status = 'soon'
  else if (done >= total) status = 'done'
  else if (done > 0) status = 'progress'
  return { total, done, mastery, coverage, status }
}

export function MathMapScreen() {
  const navigate = useStore((s) => s.navigate)
  const mathDone = useStore((s) => s.mathDone)
  const mathMastery = useStore((s) => s.mathMastery)
  const strands = strandsWithUnits()

  // 全体サマリー
  let totalDone = 0, totalProblems = 0, mastered = 0, masterySum = 0, masteryN = 0
  for (const u of MATH_UNITS) {
    const s = unitState(u, mathDone, mathMastery)
    totalProblems += s.total
    totalDone += s.done
    if (s.status === 'done') mastered++
    if (s.mastery > 0) { masterySum += s.mastery; masteryN++ }
  }
  const avgMastery = masteryN ? Math.round(masterySum / masteryN) : 0

  // 弱点ナビ：着手済みの単元が前提にしている弱点単元（土台の復習おすすめ）。
  const suggestions = reviewSuggestions(mathDone, mathMastery).slice(0, 3)

  return (
    <div className="pb-6">
      {/* ヒーロー＋サマリー */}
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <button
          onClick={() => navigate('portal')}
          className="mb-3 flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 active:scale-95 transition-transform"
        >
          <ChevronLeft size={14} /> スタディアプリ
        </button>
        <p className="text-xs font-bold text-white/70">中学〜高校 数III</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">学習マップ</h1>
        <p className="mt-1 text-sm font-bold text-white/75">分野の道すじと、自分の理解度を確かめよう</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="マスター単元" value={`${mastered}`} sub={`/ ${MATH_UNITS.length}`} />
          <Stat label="クリア問題" value={`${totalDone}`} sub={`/ ${totalProblems}`} />
          <Stat label="平均正答率" value={`${avgMastery}`} sub="%" />
        </div>
      </div>

      {/* 弱点ナビ：土台の単元が弱いと上でつまずく */}
      {suggestions.length > 0 && (
        <div className="px-4 pt-4">
          <div className="rounded-2xl border-2 border-amber-300 bg-hint-soft p-3.5">
            <div className="flex items-center gap-1.5">
              <Lightbulb size={16} className="text-amber-600" />
              <span className="font-display text-sm font-extrabold text-amber-900">
                つまずきの原因かも — 土台を復習しよう
              </span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-amber-800/75">
              次の単元が弱いまま先へ進んでいます。固め直すと後の単元が伸びます。
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map(({ unit, dependents }) => (
                <button
                  key={unit.id}
                  onClick={() => navigate('mathSolve', { unitId: unit.id })}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-amber-800 shadow-sm active:scale-95"
                >
                  {unit.emoji} {unit.title}
                  <span className="text-amber-500">（{dependents}単元の土台）</span>
                  <ArrowRight size={13} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 分野ごとの学習パス */}
      <div className="space-y-6 px-4 pt-5">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-ink/45">分野ごとに、左から学ぶ順につながっています</p>
          <button
            onClick={() => navigate('mathUnits')}
            className="shrink-0 rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-700 active:bg-brand-200"
          >
            学年別で見る
          </button>
        </div>

        {strands.map(({ strand, color, units }) => {
          const sDone = units.filter((u) => unitState(u, mathDone, mathMastery).status === 'done').length
          return (
            <section key={strand}>
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="h-3 w-3 rounded-full" style={{ background: color }} />
                <h2 className="font-display text-base font-extrabold text-ink/85">{strand}</h2>
                <span className="text-xs font-bold text-ink/40">{sDone}/{units.length} マスター</span>
              </div>

              <div>
                {units.map((u, i) => (
                  <UnitNode
                    key={u.id}
                    unit={u}
                    color={color}
                    last={i === units.length - 1}
                    state={unitState(u, mathDone, mathMastery)}
                    mathDone={mathDone}
                    mathMastery={mathMastery}
                    onOpen={() => unitCount(u.id) && navigate('mathSolve', { unitId: u.id })}
                    onOpenUnit={(id) => navigate('mathSolve', { unitId: id })}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur">
      <div className="flex items-end gap-0.5">
        <span className="font-display text-2xl font-extrabold leading-none">{value}</span>
        <span className="text-[11px] font-bold text-white/70">{sub}</span>
      </div>
      <div className="mt-0.5 text-[10px] font-bold text-white/65">{label}</div>
    </div>
  )
}

// タイムライン1ノード＝1単元。左にレール（つながりの線）、右に単元カード。
function UnitNode({ unit, color, last, state, mathDone, mathMastery, onOpen, onOpenUnit }) {
  const { total, done, mastery, coverage, status } = state
  const ringColor = status === 'done' ? '#10b981' : color
  const prereqs = prereqOf(unit.id).map(unitById).filter(Boolean)
  // この単元を始めていて、前提が弱いものを「弱点」として案内する。
  const weak = weakPrereqs(unit.id, mathDone, mathMastery)
  const weakIds = new Set(weak.map((p) => p.id))
  const showWeakHint = (status === 'progress' || status === 'done') && weak.length > 0

  return (
    <div className="flex items-stretch gap-3">
      {/* レール */}
      <div className="flex w-12 flex-col items-center">
        <ProgressRing value={status === 'soon' ? 0 : coverage} size={48} stroke={5} color={ringColor} track="#e9e7ff">
          {status === 'done' ? (
            <Check size={20} className="text-emerald-500" />
          ) : (
            <span className="text-lg leading-none">{unit.emoji}</span>
          )}
        </ProgressRing>
        {!last && <div className="my-1 w-0.5 flex-1 rounded bg-violet-100" />}
      </div>

      {/* カード（クリックでこの単元へ） */}
      <div
        role="button"
        onClick={() => status !== 'soon' && onOpen()}
        className={cx(
          'mb-3 flex flex-1 flex-col gap-2 rounded-2xl bg-white p-3.5 shadow-card transition-transform',
          status !== 'soon' && 'cursor-pointer active:scale-[0.98]',
          status === 'soon' && 'opacity-55',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-display font-extrabold text-ink">{unit.title}</span>
              <span className="rounded-full bg-paper px-1.5 py-0.5 text-[10px] font-extrabold text-ink/45">{unit.grade}</span>
              {status === 'done' && <Chip className="bg-emerald-100 text-emerald-700">マスター</Chip>}
            </div>

            {/* 理解度 */}
            <div className="mt-1 text-xs font-bold text-ink/45">
              {status === 'soon' ? (
                '準備中'
              ) : status === 'new' ? (
                `全${total}問・未着手`
              ) : (
                <span>
                  {done}/{total}問クリア
                  {mastery > 0 && <span className="text-violet-500"> ・ 正答率{mastery}%</span>}
                </span>
              )}
            </div>

            {/* つながり（前提単元）。弱点の前提は琥珀色で強調 */}
            {prereqs.length > 0 && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                <LinkIcon size={12} className="text-ink/30" />
                {prereqs.map((p) => {
                  const w = weakIds.has(p.id)
                  return (
                    <span
                      key={p.id}
                      className={cx(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        w ? 'bg-amber-100 text-amber-700' : 'bg-paper text-ink/50',
                      )}
                    >
                      {w && '⚠ '}{p.title}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {status !== 'soon' && (
            <span style={{ color: status === 'done' ? '#10b981' : color }}>
              <ArrowRight size={20} />
            </span>
          )}
        </div>

        {/* 弱点ナビ：始めた単元の前提が弱いとき、先に固める案内 */}
        {showWeakHint && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenUnit(weak[0].id) }}
            className="flex items-center gap-1.5 rounded-xl bg-hint-soft px-2.5 py-1.5 text-left text-[11px] font-bold text-amber-800 active:scale-[0.98] transition-transform"
          >
            <Lightbulb size={13} className="shrink-0 text-amber-600" />
            <span className="flex-1">前提の「{weak[0].title}」が弱いかも。先に固めよう</span>
            <ArrowRight size={12} className="shrink-0" />
          </button>
        )}
      </div>
    </div>
  )
}
