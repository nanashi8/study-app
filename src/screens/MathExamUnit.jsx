import { useStore } from '../store/useStore.js'
import {
  MATH_EXAM_LEVELS,
  mathExamKind,
  mathExamKindOf,
  mathExamPatternsForUnit,
  mathExamProblemsForUnit,
} from '../data/math-exam.js'
import { unitById } from '../data/math.js'
import { MATH_EXAM_RESULTS, formatSeconds } from '../lib/mathExam.js'
import { bestSolvedSeconds, latestMathExamAttempt, mathExamStatusCounts } from '../lib/mathExamLog.js'
import { readableMathAccent } from '../lib/mathVisualColors.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { MathText } from '../components/MathText.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Cards } from '../components/Icons.jsx'

// 単元の入試演習ページ。入試でよく出る問題の型（出題パターン）ごとに、問題と自分の結果（前回の結果・自力で解けた最短の時間）を並べる。
// 基礎だけ・標準だけ・すべてをまとめて解くか、1問を選んで解く。
export function MathExamUnitScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const mathExamLog = useStore((state) => state.mathExamLog)
  const unit = unitById(params.unitId)
  const problems = unit ? mathExamProblemsForUnit(unit.id) : []

  if (!unit || !problems.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📝</div>
        <p className="font-display text-lg font-extrabold text-ink">この単元の入試演習はありません</p>
      </div>
    )
  }

  const accent = readableMathAccent(unit.color)
  const kind = mathExamKind(mathExamKindOf(unit.id))
  const counts = mathExamStatusCounts(mathExamLog, problems.map((problem) => problem.id))
  const returnTo = { screen: 'mathExamUnit', params: { unitId: unit.id } }
  const solve = (extra) => navigate('mathExamSolve', { unitId: unit.id, ...extra, returnTo })
  const levelCount = (level) => problems.filter((problem) => problem.level === level).length

  return (
    <div className="pb-6">
      <ScreenHeader title={`${unit.title}の入試演習`} subtitle={`${unit.grade}・${kind.title}の基礎〜標準問題`} />

      <div className="space-y-4 px-4 pt-3">
        <Card className="p-4" data-math-exam-unit-summary={unit.id}>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: `${accent}22` }} aria-hidden="true">
              {unit.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-extrabold text-ink">{`全${problems.length}問`}</span>
              <span className="block text-xs font-bold text-ink/50">{`基礎${levelCount('basic')}問・標準${levelCount('standard')}問・出題の型${mathExamPatternsForUnit(unit.id).length}つ`}</span>
            </span>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1 text-center" data-math-exam-unit-counts>
            {[...Object.entries(MATH_EXAM_RESULTS), ['unanswered', { label: 'まだ', color: '#5f5b78' }]].map(([id, meta]) => (
              <div key={id} className="rounded-xl bg-paper px-1 py-1.5">
                <p className="text-[10px] font-extrabold leading-tight" style={{ color: meta.color }}>{meta.short ?? meta.label}</p>
                <p className="font-display text-base font-extrabold text-ink">{counts[id]}</p>
              </div>
            ))}
          </div>
          <Button full className="mt-3" onClick={() => solve({ level: 'all', title: `${unit.title}の入試演習` })} data-math-exam-unit-start="all">
            <Cards size={17} /> {`すべて解く（${problems.length}問）`}
          </Button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button size="sm" variant="secondary" onClick={() => solve({ level: 'basic', title: `${unit.title}の入試演習（基礎）` })} data-math-exam-unit-start="basic">
              基礎だけ解く
            </Button>
            <Button size="sm" variant="secondary" onClick={() => solve({ level: 'standard', title: `${unit.title}の入試演習（標準）` })} data-math-exam-unit-start="standard">
              標準だけ解く
            </Button>
          </div>
          <button
            type="button"
            onClick={() => navigate('mathIntro', { unitId: unit.id })}
            className="mt-2 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-50 px-2 text-xs font-extrabold text-brand-700 transition-transform active:scale-[0.98]"
            data-math-exam-unit-basics
          >
            <BookOpen size={15} /> 基本の型を確かめる（動かして理解・誘導つきの問題）
          </button>
        </Card>

        <h2 className="px-1 font-display text-base font-extrabold text-ink/80">出題の型ごとの問題</h2>
        {mathExamPatternsForUnit(unit.id).map((pattern) => {
          const inPattern = problems.filter((problem) => problem.pattern === pattern.id)
          return (
            <section key={pattern.id} className="space-y-2" data-math-exam-pattern-section={pattern.id}>
              <h3 className="px-1 text-sm font-extrabold text-ink/70">{pattern.title}</h3>
              <ol className="space-y-2">
                {inPattern.map((problem) => {
                  const latest = latestMathExamAttempt(mathExamLog, problem.id)
                  const best = bestSolvedSeconds(mathExamLog, problem.id)
                  const level = MATH_EXAM_LEVELS[problem.level]
                  return (
                    <li key={problem.id} data-return-row={problem.id}>
                      <button
                        type="button"
                        onClick={() => solve({ ids: [problem.id], preserveOrder: true, title: `${unit.title}：${pattern.title}` })}
                        className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-card transition-transform active:scale-[0.99]"
                        data-math-exam-problem-row={problem.id}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-1.5">
                            <Chip color={level.color}>{level.label}</Chip>
                            <span className="text-[11px] font-extrabold text-ink/45">{`目安${problem.minutes}分`}</span>
                            {latest && (
                              <span className="text-[11px] font-extrabold" style={{ color: MATH_EXAM_RESULTS[latest.result].color }}>
                                {`前回：${MATH_EXAM_RESULTS[latest.result].short}`}
                              </span>
                            )}
                            {best !== null && (
                              <span className="text-[11px] font-extrabold text-emerald-700">{`最短 ${formatSeconds(best)}`}</span>
                            )}
                          </span>
                          <span className="mt-1 line-clamp-2 block text-sm font-bold leading-relaxed text-ink/80">
                            <MathText>{problem.text}</MathText>
                          </span>
                        </span>
                        <span className="shrink-0" style={{ color: accent }}><ArrowRight size={18} /></span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>
    </div>
  )
}
