import { useStore } from '../store/useStore.js'
import { unitsByGrade, unitCount } from '../data/math.js'
import { Chip } from '../components/ui.jsx'
import { ArrowRight, Check, ChevronLeft } from '../components/Icons.jsx'

// 単元一覧（中学＋高校を学年ごとにグループ表示）。
// problems がある単元だけ挑戦でき、無い単元は「準備中」。
export function MathUnitsScreen() {
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const mathDone = useStore((s) => s.mathDone)
  const groups = unitsByGrade()

  return (
    <div className="pb-6">
      {/* ヒーロー */}
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <button
          onClick={back}
          className="mb-3 flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 active:scale-95 transition-transform"
        >
          <ChevronLeft size={14} /> マップへ
        </button>
        <p className="text-xs font-bold text-white/70">中学・高校</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">数学クエスト</h1>
        <p className="mt-1 text-sm font-bold text-white/75">
          解き方の「型」を、ステップで身につけよう
        </p>
      </div>

      <div className="space-y-6 px-4 pt-5">
        {groups.map(({ grade, units }) => (
          <div key={grade}>
            <h2 className="mb-2.5 px-1 font-display text-base font-extrabold text-ink/80">{grade}</h2>
            <div className="space-y-2.5">
              {units.map((u) => {
                const n = unitCount(u.id)
                const ready = n > 0
                const done = problemsDone(mathDone, u.id)
                return (
                  <button
                    key={u.id}
                    disabled={!ready}
                    onClick={() => navigate('mathSolve', { unitId: u.id })}
                    className="relative flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-card transition-transform active:scale-[0.98] disabled:opacity-55 disabled:active:scale-100"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                      style={{ background: `${u.color}1a` }}
                    >
                      {u.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-ink">{u.title}</span>
                        <Chip color={u.color}>{u.strand}</Chip>
                      </div>
                      <div className="mt-0.5 text-xs font-bold text-ink/45">
                        {ready ? (
                          done >= n ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <Check size={13} /> 全{n}問クリア
                            </span>
                          ) : (
                            `全${n}問${done > 0 ? `・${done}問クリア` : ''}`
                          )
                        ) : (
                          u.desc || '準備中'
                        )}
                      </div>
                    </div>
                    {ready ? (
                      <span style={{ color: u.color }}><ArrowRight size={22} /></span>
                    ) : (
                      <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-extrabold text-ink/50">
                        準備中
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// その単元のうち、クリア済み問題数。
function problemsDone(mathDone, unitId) {
  return (mathDone ?? []).filter((id) => id.startsWith(`${unitId}-`)).length
}
