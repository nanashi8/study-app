import { useScreenParam, useStore } from '../store/useStore.js'
import {
  MATH_EXAM_KINDS,
  MATH_EXAM_LEVEL_FILTERS,
  MATH_EXAM_QUIZ_DOMAIN,
  mathExamKind,
  mathExamPatternsForUnit,
  mathExamProblemsForKind,
  mathExamProblemsForScope,
  mathExamProblemsForUnit,
  mathExamUnitsByGrade,
  scopesForKind,
} from '../data/math-exam.js'
import { summarizeQuizItems } from '../lib/contentProgress.js'
import { STUDY_ORDER_STAGE, rankQuestionsForStudy } from '../lib/studyOrder.js'
import { retryMathExamIds } from '../lib/mathExamLog.js'
import { readableMathAccent } from '../lib/mathVisualColors.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { TodayCard, TodayRow } from '../components/ContentTop.jsx'
import { Button, Card, Chip, cx } from '../components/ui.jsx'
import { BookOpen, Cards, Refresh, Target } from '../components/Icons.jsx'

// 数学の入試演習の目次。入試の種類（高校入試・大学入試）を選び、単元ごとに「基本の型」と「入試演習」の2つの入口を置く。
// 範囲ごとの総合演習（単元を混ぜて解く）と、今日の演習・解き直しもここから始める。
const QUESTION_UNITS = { learning: '問', quiz: '問' }
const readKind = (value) => (MATH_EXAM_KINDS.some((kind) => kind.id === value) ? value : 'high')
const readLevel = (value) => (MATH_EXAM_LEVEL_FILTERS.some((level) => level.id === value) ? value : 'all')

function SegmentSwitch({ label, items, value, onChange, name }) {
  return (
    <div
      className={cx('grid gap-1 rounded-2xl bg-brand-50 p-1', items.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}
      role="group"
      aria-label={label}
      data-math-exam-switch={name}
    >
      {items.map((item) => {
        const on = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={on}
            className={cx(
              'min-h-11 rounded-xl px-2 py-1.5 font-display text-sm font-extrabold transition-colors',
              on ? 'bg-white text-brand-700 shadow-sm' : 'text-ink/55 active:bg-white/70',
            )}
            data-math-exam-option={item.id}
          >
            {item.emoji ? `${item.emoji} ${item.title ?? item.label}` : item.title ?? item.label}
          </button>
        )
      })}
    </div>
  )
}

export function MathExamScreen() {
  const navigate = useStore((state) => state.navigate)
  const mathExamLog = useStore((state) => state.mathExamLog)
  const contentQuizResults = useStore((state) => state.contentQuizResults)
  const [kindId, setKindId] = useScreenParam('kind', readKind)
  const [level, setLevel] = useScreenParam('level', readLevel)
  const kind = mathExamKind(kindId)
  const returnTo = { screen: 'mathExam', params: { kind: kindId, level } }
  const levelLabel = MATH_EXAM_LEVEL_FILTERS.find((item) => item.id === level).label

  const kindProblems = mathExamProblemsForKind(kindId)
  const practice = mathExamProblemsForKind(kindId, level)
  const ranked = rankQuestionsForStudy(practice, { quizResults: contentQuizResults, quizDomain: MATH_EXAM_QUIZ_DOMAIN, rng: null })
  const dueCount = ranked.filter((entry) => entry.stage <= STUDY_ORDER_STAGE.review).length
  const freshCount = ranked.filter((entry) => entry.stage === STUDY_ORDER_STAGE.fresh).length
  const retryIds = retryMathExamIds(mathExamLog, kindProblems.map((problem) => problem.id))

  const solve = (extra) => navigate('mathExamSolve', { ...extra, returnTo })

  return (
    <div className="pb-6">
      <ScreenHeader title="入試演習" subtitle="高校入試・大学入試の基礎〜標準問題を、単元ごとに解く" />

      <div className="space-y-3 px-4 pt-3">
        {/* 今日の演習：復習の問題とまだ解いていない問題を、全教材共通の順で。解き直し：自力で解けなかった問題。 */}
        <TodayCard data-math-exam-today>
          <TodayRow
            onClick={() => solve({ kind: kindId, level, title: `今日の演習（${kind.title}・${levelLabel}）` })}
            disabled={!practice.length}
            aria-label={`今日の演習。復習${dueCount}問、まだ解いていない問題${freshCount}問`}
            data-math-exam-today-practice
            icon={<Target size={20} />}
            iconClassName="bg-brand-100 text-brand-600"
            title="今日の演習"
            detail={`${kind.title}・${levelLabel}：復習${dueCount}問・まだ解いていない問題${freshCount}問`}
          />
          <TodayRow
            onClick={() => solve({ ids: retryIds, title: '解き直し' })}
            disabled={!retryIds.length}
            aria-label={retryIds.length ? `解き直し。${retryIds.length}問` : '解き直し。まだありません'}
            data-math-exam-retry
            icon={<Refresh size={20} />}
            iconClassName="bg-hint/20 text-amber-600"
            title="解き直し"
            detail={retryIds.length
              ? `ヒントで正解・不正解・わからなかった問題 ${retryIds.length}問`
              : '自力で解けなかった問題がここに出ます。'}
          />
        </TodayCard>

        <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">入試の種類</h2>
        <SegmentSwitch label="入試の種類" name="kind" items={MATH_EXAM_KINDS} value={kindId} onChange={setKindId} />
        <p className="px-1 text-[11px] font-bold text-ink/50">{`${kind.note}・全${kindProblems.length}問`}</p>

        <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">問題の難しさ</h2>
        <SegmentSwitch label="問題の難しさ" name="level" items={MATH_EXAM_LEVEL_FILTERS} value={level} onChange={setLevel} />
        <p className="px-1 text-[11px] font-bold text-ink/50">
          {level === 'basic'
            ? '基礎：入試の小問。公式や基本の考え方を1〜2段で使う'
            : level === 'standard'
              ? '標準：入試の大問でよく出る型。いくつかの考えを組み合わせる'
              : '基礎と標準の両方を、単元ごとに基礎から順に出す'}
        </p>

        <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">総合演習（単元を混ぜて解く）</h2>
        <div className="space-y-3" data-math-exam-scopes>
          {scopesForKind(kindId).map((scope) => {
            const problems = mathExamProblemsForScope(scope.id, level)
            const quiz = summarizeQuizItems({ items: problems, quizResults: contentQuizResults, quizDomain: MATH_EXAM_QUIZ_DOMAIN })
            return (
              <Card key={scope.id} className="p-4" data-math-exam-scope={scope.id}>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-2xl" aria-hidden="true">🔀</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-extrabold text-ink">{scope.title}</span>
                    <span className="block text-xs font-bold text-ink/50">{`単元名と型をふせて出す・${levelLabel} ${problems.length}問`}</span>
                  </span>
                </div>
                <LearningStatusBars progress={{ quiz: quiz.counts }} className="mt-3" compact units={QUESTION_UNITS} showLearning={false} />
                <Button
                  full
                  className="mt-3"
                  disabled={!problems.length}
                  onClick={() => solve({ scope: scope.id, level, mixed: true, title: `総合演習（${scope.title}・${levelLabel}）` })}
                  aria-label={`${scope.title}の単元を混ぜて解く（${levelLabel}${problems.length}問）`}
                >
                  <Cards size={17} /> 単元を混ぜて解く
                </Button>
              </Card>
            )
          })}
        </div>

        <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">単元ごとに解く</h2>
        <div className="space-y-6" data-math-exam-units>
          {mathExamUnitsByGrade(kindId).map(({ grade, units }) => (
            <section key={grade}>
              <h3 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/70">{grade}</h3>
              <ol className="space-y-3">
                {units.map((unit) => {
                  const all = mathExamProblemsForUnit(unit.id)
                  const problems = mathExamProblemsForUnit(unit.id, level)
                  const quiz = summarizeQuizItems({ items: problems, quizResults: contentQuizResults, quizDomain: MATH_EXAM_QUIZ_DOMAIN })
                  const basic = all.filter((problem) => problem.level === 'basic').length
                  const accent = readableMathAccent(unit.color)
                  return (
                    <li key={unit.id} data-return-row={unit.id}>
                      <LearningEntryCard
                        data-math-exam-unit={unit.id}
                        emoji={unit.emoji}
                        accentColor={accent}
                        title={unit.title}
                        chip={<Chip color={accent}>{unit.grade}</Chip>}
                        subtitle={`基礎${basic}問・標準${all.length - basic}問・出題の型${mathExamPatternsForUnit(unit.id).length}つ`}
                        onOpen={() => navigate('mathExamUnit', { unitId: unit.id, returnTo })}
                        openAriaLabel={`${unit.title}の問題と出題の型を見る`}
                        status={{ quiz: quiz.counts }}
                        showLearningStatus={false}
                        units={QUESTION_UNITS}
                        studyLabel="基本の型"
                        studyIcon={<BookOpen size={16} />}
                        studyAriaLabel={`${unit.title}の基本の型（動かして理解・誘導つきの問題）`}
                        onStudy={() => navigate('mathIntro', { unitId: unit.id })}
                        quizLabel="入試演習"
                        quizAriaLabel={`${unit.title}の入試演習（${levelLabel}${problems.length}問）`}
                        quizDisabled={!problems.length}
                        onQuiz={() => solve({ unitId: unit.id, level, title: `${unit.title}の入試演習（${levelLabel}）` })}
                      />
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
