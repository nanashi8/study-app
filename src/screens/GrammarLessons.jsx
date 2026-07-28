import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { GRAMMAR_STAGES, lessonsByStage } from '../data/grammar-lessons.js'
import { grammarByTopic } from '../data/grammar.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Card, Button, Chip, cx } from '../components/ui.jsx'
import { Cards, ArrowRight, Lightbulb, Check } from '../components/Icons.jsx'

// 各段階の色（学年の目印）。
const STAGE_META = {
  中1: { emoji: '🌱', hint: '英検5級レベル' },
  中2: { emoji: '🌿', hint: '英検4級レベル' },
  中3: { emoji: '🌳', hint: '英検3級レベル' },
  高校基礎: { emoji: '📘', hint: '英検準2〜2級レベル' },
  高校発展: { emoji: '🎓', hint: '英検2〜1級レベル' },
}

export function GrammarLessonsScreen() {
  const navigate = useStore((s) => s.navigate)
  const initialStage = useStore((s) => s.params.stage)
  const [stage, setStage] = useState(
    GRAMMAR_STAGES.includes(initialStage) ? initialStage : GRAMMAR_STAGES[0],
  )
  const [openId, setOpenId] = useState(null)

  const lessons = lessonsByStage(stage)
  const lesson = lessons.find((l) => l.id === openId) || null
  const lessonLevel = lesson ? getLevel(lesson.level) : null
  // この単元に対応するクイズがあるか
  const quizCount = lesson ? grammarByTopic(lesson.level, lesson.topic).length : 0

  const startQuiz = () => {
    if (!lesson || !quizCount) return
    const meta = getLevel(lesson.level)
    setOpenId(null)
    navigate('grammarQuiz', {
      source: { type: 'grammar', level: lesson.level, topic: lesson.topic },
      title: lesson.topic,
      levelColor: meta.color,
    })
  }

  return (
    <div className="pb-6">
      <ScreenHeader title="文法解説" subtitle="中学・高校のカリキュラム順に読んで理解する" />

      <div className="px-4">
        {/* 学年タブ */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {GRAMMAR_STAGES.map((s) => {
            const on = stage === s
            const m = STAGE_META[s]
            return (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={cx(
                  'flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold transition-all',
                  on ? 'bg-brand-500 text-white shadow-pop' : 'bg-white text-ink/55',
                )}
              >
                <span>{m.emoji}</span> {s}
              </button>
            )
          })}
        </div>

        <p className="mt-3 px-1 text-xs font-bold text-ink/45">
          {STAGE_META[stage].emoji} {stage}（{STAGE_META[stage].hint}）・全{lessons.length}単元
        </p>

        {/* 単元一覧 */}
        <div className="mt-2 space-y-2">
          {lessons.map((l) => {
            const lv = getLevel(l.level)
            return (
              <button
                key={l.id}
                onClick={() => setOpenId(l.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm transition-transform active:scale-[0.99] active:bg-brand-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-ink">{l.title}</span>
                    <Chip color={lv.color}>{lv.label}</Chip>
                  </div>
                  <div className="mt-0.5 truncate text-xs font-bold text-ink/50">{l.summary}</div>
                </div>
                <span className="text-brand-400">
                  <ArrowRight size={20} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 解説ウィンドウ */}
      <Sheet open={lesson != null} onClose={() => setOpenId(null)} title={lesson?.title} maxH="90vh">
        {lesson && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Chip color={lessonLevel.color}>英検{lessonLevel.label}</Chip>
              <span className="text-xs font-bold text-ink/45">{lesson.stage}</span>
            </div>

            {/* まとめ */}
            <p className="rounded-2xl bg-brand-50 p-3.5 font-bold leading-relaxed text-ink/80">
              {lesson.summary}
            </p>

            {/* 形（公式） */}
            {lesson.form && (
              <div className="rounded-2xl bg-ink/[0.04] p-3.5">
                <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-ink/40">形</div>
                <div className="font-display text-sm font-extrabold text-brand-700">{lesson.form}</div>
              </div>
            )}

            {/* ポイント */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <Lightbulb size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">ポイント</span>
              </div>
              <ul className="space-y-1.5">
                {lesson.points.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm font-bold leading-relaxed text-ink/75">
                    <span className="mt-0.5 shrink-0 text-brand-400">
                      <Check size={15} />
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 例文（タップで発音） */}
            <div>
              <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink/40">例文</div>
              <div className="space-y-1.5">
                {lesson.examples.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-2xl bg-white p-2.5 ring-1 ring-brand-100">
                    <SpeakButton text={ex.en} size="sm" />
                    <div className="flex-1">
                      <div className="font-bold text-ink">{ex.en}</div>
                      <div className="text-sm font-bold text-brand-600">{ex.ja}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* つまずきポイント */}
            {lesson.pitfalls?.length > 0 && (
              <div className="rounded-2xl bg-rose-50 p-3.5">
                <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-rose-500">
                  ⚠️ 間違えやすい
                </div>
                <ul className="space-y-1">
                  {lesson.pitfalls.map((p, i) => (
                    <li key={i} className="text-sm font-bold leading-relaxed text-rose-700">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 意味が通るだけでなく、自然で明確な英文へ直す指針 */}
            {lesson.preferred?.length > 0 && (
              <div className="rounded-2xl bg-emerald-50 p-3.5 ring-1 ring-emerald-100">
                <div className="mb-2 flex items-center gap-1.5 text-emerald-700">
                  <Check size={16} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">
                    自然・推奨表現
                  </span>
                </div>
                <div className="space-y-3">
                  {lesson.preferred.map((item, index) => (
                    <div key={index} className="rounded-xl bg-white/75 p-3">
                      <p className="text-sm font-bold text-rose-600">
                        <span className="mr-1.5 rounded bg-rose-100 px-1.5 py-0.5 text-[10px]">避ける</span>
                        {item.avoid}
                      </p>
                      <p className="mt-1.5 text-sm font-bold text-emerald-800">
                        <span className="mr-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px]">使う</span>
                        {item.use}
                      </p>
                      <p className="mt-2 text-xs font-bold leading-relaxed text-emerald-900/65">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* クイズへ */}
            {quizCount > 0 && (
              <Button full size="lg" onClick={startQuiz}>
                <Cards size={18} /> この単元を4択クイズで練習（{quizCount}問）
              </Button>
            )}
          </div>
        )}
      </Sheet>
    </div>
  )
}
