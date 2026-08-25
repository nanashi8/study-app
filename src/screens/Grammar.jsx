import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { LEVELS, getLevel } from '../data/levels.js'
import {
  GRAMMAR_PRACTICE,
  grammarPracticeByLevel,
  grammarPracticeByTopic,
  grammarPracticeTopicsForLevel,
} from '../data/grammar.js'
import {
  GRAMMAR_QUESTION_TYPE_META,
  GRAMMAR_QUESTION_TYPES,
} from '../data/grammar-format-expansion.js'
import { GRAMMAR_STRANDS } from '../data/grammar-strands.js'
import { todayIndex } from '../store/useStore.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Button, Chip, cx } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { Cards, ArrowRight, Refresh } from '../components/Icons.jsx'

const lessonStageForLevel = (level) => {
  if (level === '5') return '中1'
  if (level === '4') return '中2'
  if (level === '3') return '中3'
  if (level === 'pre2' || level === '2') return '高校基礎'
  return '高校発展'
}

// 次の復習日は3区分の学習状態とは別の予定として数える。
function dueProgressOf(items, srs) {
  let due = 0
  const day = todayIndex()
  for (const g of items) {
    if (srs[g.id]?.due <= day) due++
  }
  return { total: items.length, due }
}

export function GrammarScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const initial = useStore((s) => s.params.level)
  const initialQuestionType = useStore((s) => s.params.questionType)
  // 出題のある級だけタブに出す。
  const activeLevels = LEVELS.filter((l) => grammarPracticeByLevel(l.id).length > 0)
  const [level, setLevel] = useState(
    activeLevels.some((l) => l.id === initial) ? initial : activeLevels[0]?.id ?? '5',
  )
  const [questionType, setQuestionType] = useState(
    initialQuestionType && GRAMMAR_QUESTION_TYPE_META[initialQuestionType]
      ? initialQuestionType
      : 'mixed',
  )

  const meta = getLevel(level)
  const topics = grammarPracticeTopicsForLevel(level, questionType)
  const levelItems = grammarPracticeByLevel(level, questionType)
  const lp = dueProgressOf(levelItems, srs)
  const levelStatus = summarizeSrsItems(levelItems, srs)
  const allProgress = dueProgressOf(GRAMMAR_PRACTICE, srs)
  const questionTypeMeta = GRAMMAR_QUESTION_TYPE_META[questionType]
  const returnTo = { screen: 'grammar', params: { level, questionType } }

  const quizLevel = () =>
    navigate('grammarQuiz', { source: { type: 'grammar', level, questionType }, title: `${meta.label} ${questionTypeMeta.label}`, levelColor: meta.color, returnTo })
  const quizTopic = (topic) =>
    navigate('grammarQuiz', { source: { type: 'grammar', level, topic, questionType }, title: `${topic}・${questionTypeMeta.short}`, levelColor: meta.color, returnTo })

  return (
    <div className="pb-6">
      <ScreenHeader title="文法" subtitle="級と問題の種類を選んで、文の形と使い方を身につける" />

      <div className="px-4">
        {allProgress.due > 0 && (
          <button
            onClick={() =>
              navigate('grammarQuiz', {
                source: { type: 'grammarDue', questionType: 'mixed' },
                title: '文法の復習',
                levelColor: '#f59e0b',
                returnTo,
              })
            }
            className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-hint-soft p-3.5 text-left text-amber-900 transition-transform active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200/70 text-amber-700">
              <Refresh size={20} />
            </span>
            <div className="flex-1">
              <div className="font-display font-extrabold">文法を復習しよう</div>
              <div className="text-xs font-bold text-amber-800/75">{allProgress.due}問が復習どきです</div>
            </div>
            <ArrowRight size={20} />
          </button>
        )}

        {/* 文法解説（中学・高校カリキュラム順に読む） */}
        <button
          onClick={() => navigate('grammarLessons', { stage: lessonStageForLevel(level) })}
          className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-400 p-4 text-left text-white shadow-pop transition-transform active:scale-[0.99]"
        >
          <span className="text-2xl">📖</span>
          <div className="min-w-0 flex-1">
            <div className="font-display font-extrabold">文法解説で学ぶ</div>
            <div className="text-xs font-bold text-white/80">中学・高校のカリキュラム順に、形・ポイント・例文で理解する</div>
          </div>
          <ArrowRight size={20} />
        </button>

        {/* 単元から学ぶ（級をまたいで1つの文法を、成績に合う級で練習する） */}
        <button
          onClick={() => navigate('grammarStrands')}
          className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-brand-100 transition-transform active:scale-[0.99]"
        >
          <span className="text-2xl">🎯</span>
          <div className="min-w-0 flex-1">
            <div className="font-display font-extrabold text-ink">単元から学ぶ</div>
            <div className="text-xs font-bold text-ink/55">
              比較・仮定法など{GRAMMAR_STRANDS.length}系統を、級をまたいで練習します。正答率に応じて級が上下します
            </div>
          </div>
          <span className="text-brand-400"><ArrowRight size={20} /></span>
        </button>

        <h2 className="mb-2 px-1 font-display text-base font-extrabold text-ink/80">級から選ぶ</h2>

        {/* 級タブ */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {activeLevels.map((l) => {
            const on = level === l.id
            return (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={cx(
                  'flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold transition-all',
                  on ? 'text-white shadow-pop' : 'bg-white text-ink/55',
                )}
                style={on ? { background: l.color } : undefined}
              >
                <span>{l.emoji}</span> {l.label}
              </button>
            )
          })}
        </div>

        <section className="mt-4" data-grammar-question-type-selector>
          <div className="mb-2 px-1">
            <h2 className="font-display text-base font-extrabold text-ink/80">問題の種類を選ぶ</h2>
            <p className="text-[11px] font-bold text-ink/45">3種類を選ぶと、問題数に関係なく同じくらいずつ出ます</p>
          </div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="文法問題の種類">
            {['mixed', ...GRAMMAR_QUESTION_TYPES].map((type) => {
              const typeMeta = GRAMMAR_QUESTION_TYPE_META[type]
              const count = grammarPracticeByLevel(level, type).length
              const on = questionType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQuestionType(type)}
                  aria-pressed={on}
                  className={cx(
                    'min-h-16 rounded-2xl border-2 px-3 py-2.5 text-left transition-transform active:scale-[0.99]',
                    on
                      ? 'border-brand-400 bg-brand-50 text-brand-800'
                      : 'border-transparent bg-white text-ink',
                  )}
                  data-grammar-question-type={type}
                >
                  <span className="block font-display text-sm font-extrabold">{typeMeta.label}</span>
                  <span className="mt-0.5 block text-[10px] font-bold opacity-55">{count}問・{typeMeta.description}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* 級まとめ */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-extrabold text-ink">{meta.emoji} {meta.label} 文法</div>
              <div className="text-xs font-bold text-ink/50">{meta.sub}・{questionTypeMeta.label} 全{lp.total}問・{topics.length}単元</div>
            </div>
            <div className="text-right text-xs font-bold text-ink/45">全{lp.total}問</div>
          </div>
          <LearningStatusBars progress={levelStatus} className="mt-3" compact units={{ learning: '問', quiz: '問' }} />
          <Button className="mt-3" full onClick={quizLevel}><Cards size={16} /> {questionTypeMeta.label}を始める</Button>
        </Card>

        {/* 単元一覧 */}
        <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">単元から選ぶ</h2>
        <div className="space-y-2">
          {topics.map((topic) => {
            const items = grammarPracticeByTopic(level, topic, questionType)
            const tp = dueProgressOf(items, srs)
            const topicStatus = summarizeSrsItems(items, srs)
            return (
              <button
                key={topic}
                onClick={() => quizTopic(topic)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:bg-brand-50 active:scale-[0.99] transition-transform"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-ink">{topic}</span>
                    <Chip color={meta.color}>{tp.total}問</Chip>
                  </div>
                  <LearningStatusBars progress={topicStatus} className="mt-2" compact units={{ learning: '問', quiz: '問' }} />
                </div>
                <span className="text-brand-400"><ArrowRight size={20} /></span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
