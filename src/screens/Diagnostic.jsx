import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  DIAGNOSTIC_LEVELS,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_QUESTION_COUNT,
  DIAGNOSTIC_SKILLS,
} from '../data/diagnostic.js'
import {
  buildDiagnosticAnswerReview,
  scoreDiagnostic,
  UNKNOWN_DIAGNOSTIC_ANSWER,
} from '../lib/diagnostic.js'
import { buildDiagnosticQuestions } from '../lib/diagnosticQuestions.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, Card, Chip, IconButton, ProgressBar, ProgressRing, cx } from '../components/ui.jsx'
import { ArrowRight, Check, Close, Target, Trophy } from '../components/Icons.jsx'

const LEVEL_BY_ID = Object.fromEntries(DIAGNOSTIC_LEVELS.map((level) => [level.id, level]))
const SKILL_BY_ID = Object.fromEntries(DIAGNOSTIC_SKILLS.map((skill) => [skill.id, skill]))

const STATUS = {
  strength: { label: '強み', className: 'bg-emerald-100 text-emerald-700' },
  steady: { label: '標準', className: 'bg-brand-100 text-brand-700' },
  focus: { label: '要復習', className: 'bg-amber-100 text-amber-700' },
}

function formatCompletedAt(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function EstimateNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] font-bold leading-relaxed text-amber-900/75">
      <span className="font-extrabold text-amber-800">偏差値について：</span>
      英検級別に設定した問題難易度と4択の偶然正答率から求める、アプリ内のモデル推定値です。
      全国受験者の実測分布による模試偏差値や、英検の合否を保証する値ではありません。
    </div>
  )
}

function LatestResultCard({ result, history }) {
  if (!result) return null
  const previous = history.find((item) => item.id !== result.id)
  const delta = previous ? result.deviation - previous.deviation : null

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold text-white/65">前回の診断</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-sm font-bold text-white/75">推定偏差値</span>
              <span className="font-display text-4xl font-extrabold leading-none">{result.deviation}</span>
              {delta !== null && delta !== 0 && (
                <span className={cx(
                  'mb-0.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                  delta > 0 ? 'bg-emerald-400/25 text-emerald-100' : delta < 0 ? 'bg-rose-400/25 text-rose-100' : 'bg-white/15 text-white/75',
                )}>
                  {delta > 0 ? '+' : ''}{delta}
                </span>
              )}
            </div>
          </div>
          <span
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold"
          >
            英検{result.estimatedLevel?.label ?? '—'}目安
          </span>
        </div>
        <p className="mt-2 text-[11px] font-bold text-white/60">
          {formatCompletedAt(result.completedAt)}・{result.score}/{result.total}問正解
        </p>
      </div>
      <div className="grid grid-cols-4 gap-1.5 p-3">
        {(result.skillResults ?? []).map((skill) => {
          const meta = SKILL_BY_ID[skill.id]
          return (
            <div key={skill.id} className="rounded-xl bg-paper px-1 py-2 text-center">
              <div className="text-lg">{meta?.emoji ?? '📝'}</div>
              <div className="text-[10px] font-extrabold text-ink/45">{meta?.shortLabel ?? skill.id}</div>
              <div className="font-display text-sm font-extrabold text-ink">{Math.round(skill.accuracy * 100)}%</div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function Intro({ history, onStart }) {
  const latest = history[0]

  return (
    <div className="pb-7">
      <ScreenHeader title="学習診断" subtitle="英語4分野の現在地をチェック" />
      <div className="space-y-4 px-4">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-card">
          <div className="flex items-center gap-2 text-white/80">
            <Target size={20} />
            <span className="text-xs font-extrabold tracking-wide">ENGLISH DIAGNOSTIC</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight">
            いまの実力と、<br />次に伸ばす力がわかる
          </h1>
          <p className="mt-2 text-sm font-bold leading-relaxed text-white/75">
            5級から1級まで少しずつ難しくなる問題で、英語力を横断的に測ります。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip className="bg-white/15 text-white">{DIAGNOSTIC_QUESTION_COUNT}問</Chip>
            <Chip className="bg-white/15 text-white">約10分</Chip>
            <Chip className="bg-white/15 text-white">毎回出題が変化</Chip>
          </div>
        </div>

        <LatestResultCard result={latest} history={history} />

        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">診断する4分野</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {DIAGNOSTIC_SKILLS.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 rounded-2xl bg-paper p-3">
                <span className="text-2xl">{skill.emoji}</span>
                <div>
                  <p className="text-sm font-extrabold text-ink">{skill.label}</p>
                  <p className="text-[10px] font-bold text-ink/40">各7問</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">受けるときのポイント</h2>
          <ul className="mt-2 space-y-2 text-xs font-bold leading-relaxed text-ink/55">
            <li className="flex gap-2"><Check size={16} className="shrink-0 text-emerald-500" />辞書や翻訳を使わず、今の力で答える</li>
            <li className="flex gap-2"><Check size={16} className="shrink-0 text-emerald-500" />迷ったら「わからない」を選んで進む</li>
            <li className="flex gap-2"><Check size={16} className="shrink-0 text-emerald-500" />途中では正解を表示せず、結果画面でまとめて答え合わせ</li>
          </ul>
        </Card>

        <EstimateNotice />

        <Button full size="lg" onClick={onStart}>
          {latest ? 'もう一度診断する' : '診断テストをはじめる'} <ArrowRight size={19} />
        </Button>

        {history.length > 1 && (
          <div>
            <h2 className="mb-2 px-1 text-xs font-extrabold text-ink/45">これまでの結果</h2>
            <div className="space-y-2">
              {history.slice(1, 5).map((item) => (
                <div key={item.id} className="flex items-center rounded-2xl bg-white px-4 py-3 shadow-card">
                  <span className="text-xs font-bold text-ink/45">{formatCompletedAt(item.completedAt)}</span>
                  <span className="ml-auto text-xs font-bold text-ink/45">推定偏差値</span>
                  <span className="ml-2 font-display text-lg font-extrabold text-brand-700">{item.deviation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TestQuestion({ questions, index, answers, onSelect, onNext, onCancel }) {
  const item = questions[index]
  const selected = answers[item.id]
  const level = LEVEL_BY_ID[item.level]
  const skill = SKILL_BY_ID[item.skill]
  const last = index === questions.length - 1

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-20 bg-white/90 px-3 pb-3 pt-2 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={onCancel} aria-label="診断を中断">
            <Close size={22} />
          </IconButton>
          <div className="flex-1">
            <ProgressBar
              value={(index + 1) / questions.length}
              color="linear-gradient(90deg,#6366f1,#a855f7)"
            />
          </div>
          <span className="w-14 text-right text-sm font-extrabold text-ink/45">
            {index + 1}/{questions.length}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-2">
          <Chip color={skill.color}>{skill.emoji} {skill.label}</Chip>
          <Chip color={level.color}>英検{level.label}</Chip>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 pt-4">
        {item.passage && (
          <div className="mb-4 rounded-3xl bg-white p-4 shadow-card">
            <p className="mb-2 text-[10px] font-extrabold tracking-wider text-brand-500">READING</p>
            <p className="text-sm font-bold leading-7 text-ink/75">{item.passage}</p>
          </div>
        )}

        <h1 className="px-1 font-display text-xl font-extrabold leading-relaxed text-ink">
          {item.prompt}
        </h1>

        <div className="mt-5 space-y-2.5">
          {item.choices.map((choice, choiceIndex) => {
            const active = selected === choice
            return (
              <button
                key={choice}
                onClick={() => onSelect(choice)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-[0.99]',
                  active
                    ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-sm'
                    : 'border-white bg-white text-ink shadow-card',
                )}
              >
                <span className={cx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                  active ? 'bg-brand-500 text-white' : 'bg-paper text-ink/40',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="pt-0.5 text-sm font-bold leading-relaxed">{choice}</span>
              </button>
            )
          })}

          <UnknownChoiceButton
            selected={selected === UNKNOWN_DIAGNOSTIC_ANSWER}
            onClick={() => onSelect(UNKNOWN_DIAGNOSTIC_ANSWER)}
            label="わからない"
          />
        </div>
      </div>

      <div className="sticky bottom-0 shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" disabled={selected == null} onClick={onNext}>
          {last ? '診断結果を見る' : '次の問題へ'} <ArrowRight size={18} />
        </Button>
        <p className="mt-2 text-center text-[10px] font-bold text-ink/35">
          選択後も「次の問題へ」を押すまでは変更できます
        </p>
      </div>
    </div>
  )
}

function AnswerReview({ questions, answers }) {
  const reviewItems = buildDiagnosticAnswerReview(questions, answers)
  const needsReview = reviewItems.filter((item) => !item.isCorrect)
  const correctCount = reviewItems.length - needsReview.length

  return (
    <Card className="p-4" data-diagnostic-answer-review>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-xl">
          📝
        </div>
        <div>
          <h2 className="font-display text-base font-extrabold text-ink">答え合わせ</h2>
          <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
            {needsReview.length > 0
              ? `全${reviewItems.length}問を表示しています。正解${correctCount}問、要確認${needsReview.length}問です。`
              : '全問正解です。すべての答えを確認できます。'}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {reviewItems.map((review) => {
          const { question } = review
          const skill = SKILL_BY_ID[question.skill]
          const level = LEVEL_BY_ID[question.level]
          const selectedLabel = review.isUnknown
            ? 'わからない'
            : review.selectedAnswer ?? '未回答'

          return (
            <article
              key={question.id}
              className={cx(
                'rounded-2xl border-2 p-3',
                review.isCorrect
                  ? 'border-emerald-100 bg-emerald-50/60'
                  : 'border-rose-100 bg-rose-50/60',
              )}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-ink/40">
                  Q{review.questionNumber}
                </span>
                <Chip color={skill?.color}>{skill?.emoji} {skill?.shortLabel}</Chip>
                <Chip color={level?.color}>英検{level?.label}</Chip>
                <span
                  className={cx(
                    'ml-auto inline-flex items-center gap-1 text-[11px] font-extrabold',
                    review.isCorrect ? 'text-emerald-700' : 'text-rose-600',
                  )}
                >
                  {review.isCorrect ? <Check size={14} /> : <Close size={14} />}
                  {review.isCorrect ? '正解' : '要確認'}
                </span>
              </div>

              {question.passage && (
                <details className="mt-3 rounded-xl bg-white/80 px-3 py-2">
                  <summary className="cursor-pointer text-xs font-extrabold text-brand-700">
                    読解本文を確認
                  </summary>
                  <p className="mt-2 text-xs font-bold leading-6 text-ink/65">
                    {question.passage}
                  </p>
                </details>
              )}

              <p className="mt-3 text-sm font-extrabold leading-relaxed text-ink">
                {question.prompt}
              </p>

              <p
                className={cx(
                  'mt-2 text-xs font-bold leading-relaxed',
                  review.isCorrect ? 'text-emerald-700/75' : 'text-rose-700/75',
                )}
              >
                あなたの回答：<span className="font-extrabold">{selectedLabel}</span>
              </p>

              <div className="mt-2 rounded-xl bg-emerald-100/80 px-3 py-2.5">
                <p className="text-[10px] font-extrabold text-emerald-700">正しい答え</p>
                <p
                  className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-900"
                  data-diagnostic-correct-answer
                >
                  {question.answer}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </Card>
  )
}

function Result({
  result,
  history,
  questions,
  answers,
  onRetry,
  onHome,
  onOpenRecommendation,
}) {
  const priorityResult = result.skillResults.find((skill) => skill.id === result.prioritySkillId)
  const strengthResult = result.skillResults.find((skill) => skill.id === result.strengthSkillId)
  const priority = priorityResult
    ? { ...SKILL_BY_ID[priorityResult.id], ...priorityResult }
    : null
  const strength = strengthResult
    ? { ...SKILL_BY_ID[strengthResult.id], ...strengthResult }
    : null
  const previous = history.find((item) => item.id !== result.id)
  const delta = previous ? result.deviation - previous.deviation : null

  return (
    <div className="pb-8">
      <ScreenHeader title="診断結果" subtitle={formatCompletedAt(result.completedAt)} onBack={onHome} />
      <div className="space-y-4 px-4">
        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-card">
          <div className="flex items-center justify-center gap-2 text-amber-300">
            <Trophy size={20} />
            <span className="text-xs font-extrabold tracking-wide">DIAGNOSTIC RESULT</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-5">
            <ProgressRing
              value={result.deviation / 75}
              size={118}
              stroke={10}
              color="#ffffff"
              track="rgba(255,255,255,0.18)"
            >
              <span className="text-[10px] font-extrabold text-white/65">推定偏差値</span>
              <span className="font-display text-4xl font-extrabold leading-none">{result.deviation}</span>
            </ProgressRing>
            <div>
              <p className="font-display text-xl font-extrabold">{result.band}</p>
              <p className="mt-1 text-sm font-bold text-white/70">
                {result.score}/{result.total}問正解
              </p>
              <p className="text-sm font-bold text-white/70">
                正答率 {Math.round(result.accuracy * 100)}%
              </p>
              {delta !== null && (
                <p className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-extrabold">
                  前回比 {delta > 0 ? '+' : delta === 0 ? '±' : ''}{delta}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <p className="text-[10px] font-bold text-white/60">モデル上の推定幅</p>
              <p className="font-display text-lg font-extrabold">{result.deviationLow}〜{result.deviationHigh}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <p className="text-[10px] font-bold text-white/60">英検レベル目安</p>
              <p className="font-display text-lg font-extrabold">{result.estimatedLevel.label}</p>
            </div>
          </div>
        </div>

        <AnswerReview questions={questions} answers={answers} />

        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">分野別プロフィール</h2>
          <div className="mt-3 space-y-3.5">
            {result.skillResults.map((skill) => {
              const status = STATUS[skill.status]
              const meta = SKILL_BY_ID[skill.id]
              return (
                <div key={skill.id}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span>{meta?.emoji ?? '📝'}</span>
                    <span className="text-sm font-extrabold text-ink">{meta?.label ?? skill.id}</span>
                    <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-extrabold', status.className)}>
                      {status.label}
                    </span>
                    <span className="ml-auto text-xs font-extrabold text-ink/45">
                      {skill.correct}/{skill.total}問
                    </span>
                  </div>
                  <ProgressBar value={skill.accuracy} color={meta?.color ?? '#6366f1'} />
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">級別の正答状況</h2>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {result.levelResults.map((level) => {
              const meta = LEVEL_BY_ID[level.id]
              return (
                <div key={level.id} className="text-center">
                  <div
                    className="flex aspect-square items-center justify-center rounded-xl text-xs font-extrabold text-white"
                    style={{
                      backgroundColor: meta?.color ?? '#6366f1',
                      opacity: 0.25 + level.accuracy * 0.75,
                    }}
                  >
                    {level.correct}/{level.total}
                  </div>
                  <p className="mt-1 text-[9px] font-extrabold text-ink/45">{meta?.label ?? level.id}</p>
                </div>
              )
            })}
          </div>
        </Card>

        {priority && (
          <div className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-4">
            <p className="text-[11px] font-extrabold text-amber-700">次に伸ばすなら</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl">{priority.emoji}</span>
              <h2 className="font-display text-lg font-extrabold text-amber-950">{priority.label}</h2>
            </div>
            <p className="mt-2 text-xs font-bold leading-relaxed text-amber-900/75">{priority.advice}</p>
            <Button full className="mt-3" variant="hint" onClick={() => onOpenRecommendation(priority.screen)}>
              おすすめ学習を開く <ArrowRight size={17} />
            </Button>
          </div>
        )}

        {!priority && (
          <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center">
            <div className="text-3xl">🎉</div>
            <h2 className="mt-1 font-display text-lg font-extrabold text-emerald-800">
              4分野すべて良好です
            </h2>
            <p className="mt-1 text-xs font-bold leading-relaxed text-emerald-700/75">
              学習マップの適応バトルで、診断した現在地からさらに上を目指しましょう。
            </p>
            <Button full className="mt-3" variant="success" onClick={() => onOpenRecommendation('englishMap')}>
              学習マップを開く <ArrowRight size={17} />
            </Button>
          </div>
        )}

        {strength && priority && strength.id !== priority.id && (
          <p className="rounded-2xl bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-700">
            今回の強みは {strength.emoji} {strength.label}（{strength.correct}/{strength.total}問）です
          </p>
        )}

        <EstimateNotice />

        <div className="grid grid-cols-2 gap-3">
          <Button full variant="secondary" onClick={onRetry}>もう一度</Button>
          <Button full onClick={onHome}>ホームへ</Button>
        </div>
      </div>
    </div>
  )
}

export function DiagnosticScreen() {
  const navigate = useStore((state) => state.navigate)
  const goHome = useStore((state) => state.goHome)
  const history = useStore((state) => state.diagnosticHistory)
  const beginDiagnosticAttempt = useStore((state) => state.beginDiagnosticAttempt)
  const recordDiagnosticResult = useStore((state) => state.recordDiagnosticResult)
  const safeHistory = Array.isArray(history) ? history : []

  const [phase, setPhase] = useState('intro')
  const [questions, setQuestions] = useState(DIAGNOSTIC_QUESTIONS)
  const [formNumber, setFormNumber] = useState(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const rootRef = useRef(null)

  // AppShell の main がスクロール要素。問題送り・結果切替のたびに先頭へ戻す。
  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [phase, index])

  const start = () => {
    const attempt = beginDiagnosticAttempt()
    const nextQuestions = buildDiagnosticQuestions(attempt)
    setQuestions(nextQuestions)
    setFormNumber(attempt.attemptNumber)
    setAnswers({})
    setIndex(0)
    setResult(null)
    setPhase('test')
  }

  const select = (answer) => {
    const item = questions[index]
    setAnswers((current) => ({ ...current, [item.id]: answer }))
  }

  const next = () => {
    const item = questions[index]
    if (!(item.id in answers)) return
    if (index + 1 < questions.length) {
      setIndex((value) => value + 1)
      return
    }
    const scored = scoreDiagnostic(answers, { questions, formNumber })
    recordDiagnosticResult(scored)
    setResult(scored)
    setPhase('result')
  }

  if (phase === 'test') {
    return (
      <div ref={rootRef} className="min-h-full">
        <TestQuestion
          questions={questions}
          index={index}
          answers={answers}
          onSelect={select}
          onNext={next}
          onCancel={() => setPhase('intro')}
        />
      </div>
    )
  }

  if (phase === 'result' && result) {
    return (
      <div ref={rootRef} className="min-h-full">
        <Result
          result={result}
          history={safeHistory}
          questions={questions}
          answers={answers}
          onRetry={start}
          onHome={goHome}
          onOpenRecommendation={(screen) => navigate(screen)}
        />
      </div>
    )
  }

  return (
    <div ref={rootRef} className="min-h-full">
      <Intro history={safeHistory} onStart={start} />
    </div>
  )
}
