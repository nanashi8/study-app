import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { LEVELS, getLevel } from '../data/levels.js'
import {
  WRITING_LEVEL_PROFILES,
  getWritingGrammar,
  writingExercisesByLevel,
} from '../data/writing.js'
import { writingExamUnitsByLevel } from '../data/writing-exam.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Chip, cx } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { contentQuizKey, summarizeCompletionItems } from '../lib/contentProgress.js'
import {
  ArrowRight,
  Bookmark,
  Cards,
  Check,
  Lightbulb,
  Sparkles,
  Target,
} from '../components/Icons.jsx'

const MODES = [
  { id: 'guide', title: 'ヒントあり', icon: Lightbulb },
  { id: 'free', title: 'チャレンジ', icon: Sparkles },
]

// 同じ2つの進め方でも、テーマ別と文法別では足場の出し方が違う。
const MODE_NOTES = {
  theme: {
    guide: '必須の型と、次の1語の頭文字',
    free: '型は自分で選び、詰まればヒント',
  },
  grammar: {
    guide: '型を見て、単語カードで並べる',
    free: '型を伏せて、自分の手で書く',
  },
}

const TRACKS = [
  {
    id: 'theme',
    title: 'テーマ別',
    sub: '場面から一段落を組み立てる',
    icon: Sparkles,
  },
  {
    id: 'grammar',
    title: '文法別',
    sub: '入試型の和文英訳で型を確かめる',
    icon: Target,
  },
]

export function WritingScreen() {
  const navigate = useStore((s) => s.navigate)
  const params = useStore((s) => s.params)
  const writingProgress = useStore((s) => s.writingProgress)
  const contentQuizResults = useStore((s) => s.contentQuizResults)
  const myGrammarList = useStore((s) => s.myGrammarList)
  const initialLevel = LEVELS.some((item) => item.id === params.level)
    ? params.level
    : '5'
  const [level, setLevel] = useState(initialLevel)
  const [mode, setMode] = useState(params.mode === 'free' ? 'free' : 'guide')
  const [track, setTrack] = useState(params.track === 'grammar' ? 'grammar' : 'theme')

  const meta = getLevel(level)
  const profile = WRITING_LEVEL_PROFILES[level]
  const exercises = useMemo(() => writingExercisesByLevel(level), [level])
  const examUnits = useMemo(() => writingExamUnitsByLevel(level), [level])
  const examQuestionCount = examUnits.reduce(
    (count, item) => count + item.questions.length,
    0,
  )
  const items = track === 'grammar' ? examUnits : exercises
  const completed = items.filter(
    (item) => (writingProgress[item.id]?.completed ?? 0) > 0,
  ).length
  const status = summarizeCompletionItems({
    items,
    completedIds: items.flatMap((item) => (
      (writingProgress[item.id]?.completed ?? 0) > 0 ? [item.id] : []
    )),
    quizResults: contentQuizResults,
    quizDomain: 'writing',
  })

  return (
    <div className="pb-8">
      <ScreenHeader
        title="英作文"
        subtitle="使う場面と型をつないで、迷わず一文へ"
        right={
          <button
            onClick={() => navigate('myGrammar')}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-brand-700 active:bg-brand-100"
            aria-label="マイ文法"
          >
            <Bookmark size={21} />
            {myGrammarList.length > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-hint px-1 text-[10px] font-extrabold text-white">
                {myGrammarList.length > 99 ? '99+' : myGrammarList.length}
              </span>
            )}
          </button>
        }
      />

      <div className="space-y-5 px-4">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-brand-800 p-5 text-white shadow-pop">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold text-cyan-200">英文を組み立てる</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight">
                必要な型が先にわかる。
                <br />
                すぐ作文で使える。
              </h2>
            </div>
            <div className="relative h-20 w-20 shrink-0">
              <div className="absolute left-1 top-4 h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,0.8)]" />
              <div className="absolute left-5 top-9 h-1 w-11 rotate-[-12deg] rounded-full bg-white/35" />
              <div className="absolute right-1 top-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-display text-xl font-extrabold backdrop-blur">
                Aa
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm font-bold leading-relaxed text-white/72">
            {track === 'grammar'
              ? '文法単元ごとに「型 → 日本語の一文 → 英文」と進みます。入試や英検で問われる和文英訳の形で、その文法を本当に使えるかを1問ずつ確かめます。'
              : '単元ごとに「使う場面 → 英文の型 → 最後の確認」を先に整理します。作りたい内容を選び、型を手掛かりに単語を並べて、導入から結論まで組み立てます。'}
          </p>
        </section>

        <section>
          <div className="mb-2.5 px-1">
            <h2 className="font-display text-base font-extrabold text-ink">
              何を練習するか
            </h2>
            <p className="text-xs font-bold text-ink/45">
              場面から書くか、文法から書くか
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {TRACKS.map((item) => {
              const on = track === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setTrack(item.id)}
                  aria-pressed={on}
                  className={cx(
                    'rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98]',
                    on
                      ? 'border-brand-500 bg-brand-50 shadow-card'
                      : 'border-transparent bg-white text-ink/65',
                  )}
                >
                  <span
                    className={cx(
                      'mb-2 flex h-9 w-9 items-center justify-center rounded-xl',
                      on ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-500',
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="block font-display text-sm font-extrabold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold leading-snug text-ink/45">
                    {item.sub}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-2.5 flex items-end justify-between px-1">
            <div>
              <h2 className="font-display text-base font-extrabold text-ink">
                進め方を選ぶ
              </h2>
              <p className="text-xs font-bold text-ink/45">
                {track === 'grammar'
                  ? '同じ単元を、書き方を変えてもう一度'
                  : '同じお題でも何度でも別ルートへ'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map((item) => {
              const on = mode === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  aria-pressed={on}
                  className={cx(
                    'rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98]',
                    on
                      ? 'border-brand-500 bg-brand-50 shadow-card'
                      : 'border-transparent bg-white text-ink/65',
                  )}
                >
                  <span
                    className={cx(
                      'mb-2 flex h-9 w-9 items-center justify-center rounded-xl',
                      on
                        ? 'bg-brand-500 text-white'
                        : 'bg-brand-100 text-brand-500',
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="block font-display text-sm font-extrabold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold leading-snug text-ink/45">
                    {MODE_NOTES[track][item.id]}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {LEVELS.map((item) => {
              const on = level === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setLevel(item.id)}
                  className={cx(
                    'shrink-0 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold transition-all',
                    on ? 'text-white shadow-card' : 'bg-white text-ink/50',
                  )}
                  style={on ? { background: item.color } : undefined}
                >
                  {item.emoji} {item.label}
                </button>
              )
            })}
          </div>

          <Card className="mt-3 overflow-hidden">
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(90deg, ${meta.color}, ${meta.color}55)`,
              }}
            />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-extrabold text-ink">
                    {meta.emoji} {meta.label}の
                    {track === 'grammar' ? '文法別英作文' : '作文ゴール'}
                  </div>
                  <p className="mt-1 text-sm font-bold leading-relaxed text-ink/60">
                    {track === 'grammar'
                      ? `この級で問われる${examUnits.length}単元・${examQuestionCount}問を、日本語の一文から英文にして確かめます。`
                      : profile.goal}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-xl px-2.5 py-1 text-xs font-extrabold"
                  style={{ color: meta.color, background: `${meta.color}16` }}
                >
                  {completed}/{items.length}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(track === 'grammar'
                  ? examUnits.slice(0, 4).map((item) => item.topic)
                  : profile.skills
                ).map((skill) => (
                  <Chip key={skill} color={meta.color}>
                    {skill}
                  </Chip>
                ))}
              </div>
              <LearningStatusBars progress={status} className="mt-3" compact units={{ learning: '題', quiz: '題' }} />
              <p className="mt-2 text-[10px] font-bold text-ink/45">
                {track === 'grammar'
                  ? '1単元3問・答え合わせの結果をそのまま記録します'
                  : `${profile.target}・独立テストは未回答として表示`}
              </p>
            </div>
          </Card>
        </section>

        {track === 'grammar' && (
          <section>
            <h2 className="mb-2.5 px-1 font-display text-base font-extrabold text-ink">
              文法単元
            </h2>
            <div className="space-y-3">
              {examUnits.map((unit) => {
                const progress = writingProgress[unit.id]
                const done = (progress?.completed ?? 0) > 0
                const result = contentQuizResults[contentQuizKey('writing', unit.id)]
                return (
                  <Card key={unit.id} className="overflow-hidden">
                    <button
                      onClick={() =>
                        navigate('writingExam', {
                          unitId: unit.id,
                          mode,
                          // 解き終わって戻ったとき、級と文法別の一覧をそのまま開き直す。
                          returnTo: { screen: 'writing', params: { level, mode, track } },
                        })
                      }
                      className="w-full p-4 text-left transition-colors active:bg-brand-50/70"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                          style={{ background: `${meta.color}14`, color: meta.color }}
                        >
                          <Cards size={20} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Chip color={meta.color}>{unit.topic}</Chip>
                            {done && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                                <Check size={13} /> {progress.completed}回
                              </span>
                            )}
                            {result && (
                              <span className="text-[11px] font-extrabold text-ink/45">
                                前回 {result.correct}/{result.total}問
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1.5 font-display text-base font-extrabold leading-tight text-ink">
                            {unit.title}
                          </h3>
                          <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/52">
                            {unit.focus}
                          </p>
                        </div>
                        <span className="mt-2 text-brand-400">
                          <ArrowRight size={20} />
                        </span>
                      </div>

                      <p className="mt-2.5 rounded-xl bg-slate-950 px-3 py-2 font-mono text-[10px] font-extrabold leading-relaxed text-cyan-100">
                        {unit.form}
                      </p>

                      <div className="mt-2.5 space-y-1.5">
                        {unit.questions.map((question, position) => (
                          <p
                            key={question.id}
                            className="flex items-start gap-2 text-[11px] font-bold leading-relaxed text-ink/55"
                          >
                            <span className="mt-0.5 shrink-0 font-extrabold text-ink/30">
                              {position + 1}.
                            </span>
                            <span className="min-w-0 flex-1">{question.ja}</span>
                          </p>
                        ))}
                      </div>
                    </button>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {track === 'theme' && (
          <section>
            <h2 className="mb-2.5 px-1 font-display text-base font-extrabold text-ink">
              単元・ジャンル
            </h2>
            <div className="space-y-3">
              {exercises.map((exercise) => {
                const progress = writingProgress[exercise.id]
                const done = (progress?.completed ?? 0) > 0
                return (
                  <Card key={exercise.id} className="overflow-hidden">
                    <button
                      onClick={() =>
                        navigate('writingPlay', {
                          exerciseId: exercise.id,
                          mode,
                        })
                      }
                      className="w-full p-4 text-left transition-colors active:bg-brand-50/70"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                          style={{ background: `${meta.color}14` }}
                        >
                          {exercise.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Chip color={meta.color}>{exercise.genre}</Chip>
                            {done && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                                <Check size={13} /> {progress.completed}回完成
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1.5 font-display text-lg font-extrabold leading-tight text-ink">
                            {exercise.title}
                          </h3>
                          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/52">
                            {exercise.scene}
                          </p>
                          <p className="mt-2 rounded-xl bg-paper px-2.5 py-2 text-[11px] font-extrabold leading-relaxed text-ink/60">
                            お題：{exercise.task}
                          </p>
                          <div className="mt-2.5 rounded-xl border border-brand-100 bg-brand-50/55 px-2.5 py-2.5">
                            <p className="text-[10px] font-extrabold tracking-wide text-brand-600">
                              この単元で使う型
                            </p>
                            <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/55">
                              {exercise.unitGuide.goal}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {exercise.unitGuide.knowledge
                                .slice(0, 3)
                                .map((knowledge) => {
                                  const grammar = getWritingGrammar(
                                    knowledge.grammarId,
                                  )
                                  return (
                                    <span
                                      key={`${exercise.id}-${knowledge.stepId}`}
                                      className="rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold text-brand-700 shadow-sm"
                                    >
                                      {grammar?.title}
                                    </span>
                                  )
                                })}
                              {exercise.unitGuide.knowledge.length > 3 && (
                                <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold text-ink/40 shadow-sm">
                                  +{exercise.unitGuide.knowledge.length - 3}個
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="mt-2 text-brand-400">
                          <ArrowRight size={21} />
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1 overflow-hidden">
                        {exercise.steps.slice(0, 5).map((item, index) => (
                          <span key={item.id} className="contents">
                            <span
                              className="shrink-0 rounded-full bg-paper px-2 py-1 text-[10px] font-extrabold text-ink/55"
                            >
                              {item.phase}
                            </span>
                            {index < Math.min(exercise.steps.length, 5) - 1 && (
                              <span className="h-px min-w-2 flex-1 bg-brand-100" />
                            )}
                          </span>
                        ))}
                        {exercise.steps.length > 5 && (
                          <span className="shrink-0 text-[10px] font-extrabold text-ink/35">
                            +{exercise.steps.length - 5}
                          </span>
                        )}
                      </div>

                      {progress?.lastText && (
                        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
                          <p className="truncate font-serif text-xs font-semibold text-slate-600">
                            “{progress.lastText}”
                          </p>
                        </div>
                      )}
                    </button>
                  </Card>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
