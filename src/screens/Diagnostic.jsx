import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  DIAGNOSTIC_LEVELS,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_QUESTION_COUNT,
  DIAGNOSTIC_SKILLS,
} from '../data/diagnostic.js'
import {
  buildDiagnosticAnswerReview,
  buildDiagnosticGuidance,
  scoreDiagnostic,
  UNKNOWN_DIAGNOSTIC_ANSWER,
} from '../lib/diagnostic.js'
import { buildDiagnosticQuestions } from '../lib/diagnosticQuestions.js'
import { analyzeLearning } from '../lib/learningAnalytics.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, Card, Chip, IconButton, ProgressBar, ProgressRing, cx } from '../components/ui.jsx'
import { ArrowRight, Check, Close, Sparkles, Target, Trophy } from '../components/Icons.jsx'

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

function formatStudyDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '日付を計算中'
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}

function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`
}

function formatTimeWindow({ startHour, windowStartHour = startHour, endHour }) {
  const crossesMidnight = endHour <= windowStartHour
  return `${formatHour(windowStartHour)}〜${crossesMidnight ? '翌' : ''}${formatHour(endHour)}`
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

const REPORT_MARK = {
  correct: {
    label: '正解',
    symbol: '✓',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  incorrect: {
    label: '不正解',
    symbol: '×',
    className: 'border-rose-200 bg-rose-50 text-rose-600',
  },
  unknown: {
    label: 'わからない',
    symbol: '？',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  empty: {
    label: '出題なし',
    symbol: '—',
    className: 'border-slate-200 bg-slate-50 text-slate-400',
  },
}

function PerformanceReport({ result, guidance }) {
  const { report, recommendation } = guidance
  const strengthResult = result.skillResults.find(
    (skill) => skill.id === result.strengthSkillId,
  )
  const strength = strengthResult
    ? { ...SKILL_BY_ID[strengthResult.id], ...strengthResult }
    : null
  const weakest = result.skillResults.find(
    (skill) => skill.id === recommendation.skillId,
  ) ?? [...result.skillResults].sort(
    (a, b) => a.accuracy - b.accuracy || a.deviation - b.deviation,
  )[0]
  const weakestMeta = weakest ? SKILL_BY_ID[weakest.id] : null
  const strengthLabel = strength?.status === 'strength'
    ? '今回の得意'
    : strength?.correct > 0
      ? '比較的できた分野'
      : '今回の得意'
  const strengthName = strength?.correct > 0
    ? `${strength.emoji} ${strength.label}`
    : '— まだ判定できません'
  const strengthScore = strength?.correct > 0
    ? `${strength.correct}/${strength.total}問`
    : '正解データなし'

  return (
    <Card className="overflow-hidden" data-diagnostic-performance-report>
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-4 text-white">
        <p className="text-[10px] font-extrabold tracking-[0.16em] text-white/45">
          YOUR SCORE REPORT
        </p>
        <h2 className="mt-1 font-display text-xl font-extrabold">あなたの成績表</h2>
        <p className="mt-1 text-[11px] font-bold leading-relaxed text-white/60">
          4分野と7級を交差させて、できた所と次に直す所を見える化しました。
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-emerald-400/15 p-3 ring-1 ring-inset ring-emerald-300/20">
            <p className="text-[9px] font-extrabold text-emerald-200">{strengthLabel}</p>
            <p className="mt-1 text-sm font-extrabold">
              {strengthName}
            </p>
            <p className="mt-0.5 font-display text-lg font-extrabold text-emerald-300">
              {strengthScore}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-400/15 p-3 ring-1 ring-inset ring-amber-300/20">
            <p className="text-[9px] font-extrabold text-amber-200">
              {recommendation.kind === 'foundation' ? '最優先の伸びしろ' : '次の挑戦'}
            </p>
            <p className="mt-1 text-sm font-extrabold">
              {recommendation.kind === 'foundation'
                ? `${weakestMeta?.emoji} ${weakestMeta?.label}`
                : '🚀 4分野ミックス'}
            </p>
            <p className="mt-0.5 font-display text-lg font-extrabold text-amber-200">
              {recommendation.kind === 'foundation' && weakest
                ? `${weakest.correct}/${weakest.total}問`
                : 'さらに上へ'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-extrabold text-ink">級 × 分野</h3>
            <p className="mt-0.5 text-[10px] font-bold text-ink/40">
              横に分野、縦に英検級を並べています
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-paper px-2 py-1 text-[9px] font-extrabold text-ink/45">
            全{result.total}問
          </span>
        </div>

        <div
          className="mt-3 grid grid-cols-[4.4rem_repeat(4,minmax(0,1fr))] gap-1.5"
          role="table"
          aria-label="英検級と英語分野を交差した成績表"
          data-diagnostic-matrix
        >
          <div role="columnheader" className="px-1 text-[9px] font-extrabold text-ink/35">
            英検級
          </div>
          {DIAGNOSTIC_SKILLS.map((skill) => (
            <div
              key={skill.id}
              role="columnheader"
              className="text-center text-[9px] font-extrabold leading-tight text-ink/45"
            >
              <span className="block text-sm">{skill.emoji}</span>
              {skill.shortLabel}
            </div>
          ))}

          {report.matrix.map((row) => (
            <div key={row.id} role="row" className="contents">
              <div
                role="rowheader"
                className="flex min-h-11 flex-col justify-center rounded-xl bg-paper px-2"
              >
                <span className="text-[11px] font-extrabold text-ink">{row.label}</span>
                <span className="text-[9px] font-bold text-ink/40">{row.correct}/{row.total}問</span>
              </div>
              {row.cells.map((cell) => {
                const mark = REPORT_MARK[cell.mark]
                const skill = SKILL_BY_ID[cell.skillId]
                return (
                  <div
                    key={cell.skillId}
                    role="cell"
                    aria-label={`英検${row.label} ${skill?.label}: ${mark.label}`}
                    className={cx(
                      'flex min-h-11 items-center justify-center rounded-xl border-2 font-display text-lg font-extrabold',
                      mark.className,
                    )}
                    data-diagnostic-matrix-cell={`${row.id}:${cell.skillId}:${cell.mark}`}
                  >
                    {mark.symbol}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-ink/45">
          <span className="text-emerald-700">✓ 正解</span>
          <span className="text-rose-600">× 不正解</span>
          <span className="text-amber-700">？ わからない</span>
        </div>
        <p className="mt-2 rounded-xl bg-sky-50 px-3 py-2 text-[9px] font-bold leading-relaxed text-sky-800/65">
          各マスは今回の1問、分野別は各7問、級別は各4問のスナップショットです。
          1マスだけで実力を断定せず、下の答え合わせと一緒に確認してください。
        </p>

        <h3 className="mt-5 font-display text-base font-extrabold text-ink">分野別の得意・不得意</h3>
        <div className="mt-3 space-y-3.5">
          {report.skills.map((skill) => {
            const status = STATUS[skill.status]
            const meta = SKILL_BY_ID[skill.id]
            return (
              <div key={skill.id}>
                <div className="mb-1.5 flex items-center gap-2">
                  <span>{meta?.emoji ?? '📝'}</span>
                  <span className="text-sm font-extrabold text-ink">{meta?.label ?? skill.id}</span>
                  <span className={cx(
                    'rounded-full px-2 py-0.5 text-[10px] font-extrabold',
                    status.className,
                  )}>
                    {status.label}
                  </span>
                  <span className="ml-auto text-xs font-extrabold text-ink/45">
                    {skill.correct}/{skill.total}問
                  </span>
                </div>
                <ProgressBar value={skill.accuracy} color={meta?.color ?? '#6366f1'} />
                {(skill.unknown > 0 || skill.incorrect > 0) && (
                  <p className="mt-1 text-right text-[9px] font-bold text-ink/35">
                    不正解 {skill.incorrect}・わからない {skill.unknown}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function RecommendationCard({ guidance, onOpen }) {
  const { recommendation } = guidance

  return (
    <div
      className="overflow-hidden rounded-3xl border-2 border-amber-300 bg-amber-50"
      data-diagnostic-recommendation
    >
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-3 text-amber-950">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <p className="text-[10px] font-extrabold tracking-[0.12em]">あなたへのおすすめ</p>
        </div>
        <h2 className="mt-1 font-display text-xl font-extrabold">{recommendation.title}</h2>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-extrabold text-amber-700">なぜ、これがおすすめ？</p>
        <ul className="mt-2 space-y-2">
          {recommendation.evidence.map((evidence) => (
            <li
              key={evidence}
              className="flex gap-2 text-xs font-bold leading-relaxed text-amber-950/75"
            >
              <Check size={15} className="mt-0.5 shrink-0 text-amber-600" />
              {evidence}
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs font-bold leading-relaxed text-amber-950/70">
          {recommendation.reason}
        </p>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-extrabold text-amber-700">
              まず{recommendation.duration}分でやること
            </p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-700">
              {recommendation.routeLabel}
            </span>
          </div>
          <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/65">
            {recommendation.firstAction}
          </p>
        </div>

        <Button
          full
          className="mt-3"
          variant="hint"
          onClick={() => onOpen(recommendation.screen)}
        >
          {recommendation.routeLabel}を開く <ArrowRight size={17} />
        </Button>
      </div>
    </div>
  )
}

function StudyPlan({ guidance, onOpen }) {
  const { schedule, time, memory, recommendation } = guidance
  const next = schedule[0]
  const nextDate = new Date(next.at)

  return (
    <Card className="overflow-hidden" data-diagnostic-study-plan>
      <div className="bg-gradient-to-br from-sky-600 to-indigo-600 p-4 text-white">
        <p className="text-[10px] font-extrabold tracking-[0.14em] text-white/55">
          NEXT STUDY PLAN
        </p>
        <h2 className="mt-1 font-display text-xl font-extrabold">次回は、ここから</h2>
        <div className="mt-3 rounded-2xl bg-white/12 p-3 ring-1 ring-inset ring-white/15">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-display text-2xl font-extrabold">
              {formatStudyDate(next.at)} {formatHour(nextDate.getHours())}
            </p>
            <span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-extrabold">
              {next.duration}分
            </span>
          </div>
          <p className="mt-1 text-sm font-extrabold text-white/90">{next.title}</p>
          <p className="mt-1 text-[10px] font-bold text-white/60">
            学ぶ場所：{recommendation.routeLabel}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="rounded-2xl bg-sky-50 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-extrabold text-sky-700">この時刻にした根拠</p>
            <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-extrabold text-sky-700">
              {time.personalized ? '学習履歴から推定' : '仮の時間'}
              {time.provisional ? '・暫定' : ''}
            </span>
          </div>
          <p className="mt-1.5 text-xs font-bold leading-relaxed text-sky-950/65">
            {time.evidence}
          </p>
          <p className="mt-1 text-[10px] font-extrabold text-sky-700">
            おすすめ時間帯：{formatTimeWindow(time)}
          </p>
        </div>

        <div className="mt-3 rounded-2xl bg-violet-50 p-3">
          <p className="text-[10px] font-extrabold text-violet-700">記憶の定着データ</p>
          <p className="mt-1.5 text-xs font-bold leading-relaxed text-violet-950/65">
            {memory.text}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {schedule.map((step, index) => (
            <div key={step.id} className="grid grid-cols-[2.2rem_1fr] gap-3">
              <div className="flex flex-col items-center">
                <span className={cx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold',
                  index === 0 ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700',
                )}>
                  {index + 1}
                </span>
                {index + 1 < schedule.length && (
                  <span className="mt-1 h-full min-h-10 w-0.5 rounded-full bg-brand-100" />
                )}
              </div>
              <div className="pb-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[10px] font-extrabold text-brand-600">{step.label}</span>
                  <span className="text-[10px] font-bold text-ink/40">
                    {formatStudyDate(step.at)}・{formatHour(new Date(step.at).getHours())}
                  </span>
                  <span className="ml-auto text-[9px] font-extrabold text-ink/35">
                    {step.duration}分
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-extrabold text-ink">{step.title}</p>
                <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/50">{step.task}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-bold leading-relaxed text-slate-500">
          答えを読み直すだけでなく、いったん隠して思い出す練習をします。
          翌日→3日後→7日後と少しずつ間隔を空け、今後の学習履歴に合わせて予定を更新します。
          これは回答履歴からの推定で、脳波や医療検査による「脳力」の測定ではありません。
        </p>

        <Button full className="mt-3" onClick={() => onOpen(next.screen)}>
          次回やる学習を開く <ArrowRight size={17} />
        </Button>
      </div>
    </Card>
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
                  {question.passageJa && (
                    <p className="mt-2 border-t border-brand-100 pt-2 text-xs font-bold leading-6 text-ink/50">
                      {question.passageJa}
                    </p>
                  )}
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

              {question.review?.en && question.review?.ja && (
                <div className="mt-2 flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2.5">
                  <SpeakButton text={question.review.en} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold leading-relaxed text-sky-950">
                      {question.review.en}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-sky-800/70">
                      {question.review.ja}
                    </p>
                  </div>
                </div>
              )}

              {question.explain && (
                <p
                  className="mt-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-amber-900/85"
                  data-diagnostic-explanation
                >
                  💡 {question.explain}
                </p>
              )}
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
  guidance,
  onRetry,
  onHome,
  onOpenRecommendation,
}) {
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

        <PerformanceReport result={result} guidance={guidance} />
        <RecommendationCard guidance={guidance} onOpen={onOpenRecommendation} />
        <StudyPlan guidance={guidance} onOpen={onOpenRecommendation} />
        <AnswerReview questions={questions} answers={answers} />

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
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const srs = useStore((state) => state.srs)
  const skillStats = useStore((state) => state.skillStats)
  const safeHistory = Array.isArray(history) ? history : []

  const [phase, setPhase] = useState('intro')
  const [questions, setQuestions] = useState(DIAGNOSTIC_QUESTIONS)
  const [formNumber, setFormNumber] = useState(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const rootRef = useRef(null)
  const learningAnalysis = useMemo(
    () => analyzeLearning({
      learningAnalytics,
      srsStores: [srs],
      skillStats,
    }),
    [learningAnalytics, skillStats, srs],
  )
  const guidance = useMemo(
    () => result
      ? buildDiagnosticGuidance({
          result,
          questions,
          answers,
          learningAnalysis,
        })
      : null,
    [answers, learningAnalysis, questions, result],
  )

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

  if (phase === 'result' && result && guidance) {
    return (
      <div ref={rootRef} className="min-h-full">
        <Result
          result={result}
          history={safeHistory}
          questions={questions}
          answers={answers}
          guidance={guidance}
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
