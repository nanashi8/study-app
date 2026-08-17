import { useStore } from '../store/useStore.js'
import { PASSAGES } from '../data/passages.js'
import { READING_LEVELS, getLevel } from '../data/levels.js'
import { getReadingStudy, passageWordCount } from '../data/reading-study.js'
import { READING_RULE_PHASES } from '../data/reading-rules.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Chip } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeCompletionItems } from '../lib/contentProgress.js'
import { Check, ArrowRight, Book } from '../components/Icons.jsx'

const levelOrder = Object.fromEntries(READING_LEVELS.map((l, i) => [l.id, i]))
const sorted = [...PASSAGES].sort((a, b) => levelOrder[a.level] - levelOrder[b.level])

export function ReadingListScreen() {
  const navigate = useStore((s) => s.navigate)
  const readingsDone = useStore((s) => s.readingsDone)
  const contentQuizResults = useStore((s) => s.contentQuizResults)
  const status = summarizeCompletionItems({
    items: PASSAGES,
    completedIds: readingsDone,
    quizResults: contentQuizResults,
    quizDomain: 'reading',
  })

  return (
    <div className="pb-6">
      <ScreenHeader
        title="長文を読む"
        subtitle={`全${PASSAGES.length}題・テーマ必須語彙を確認してから本文へ`}
      />
      <div className="space-y-3 px-4">
        <Card className="overflow-hidden border border-brand-200">
          <button
            type="button"
            onClick={() => navigate('readingRules')}
            className="w-full bg-gradient-to-br from-brand-600 to-sky-500 p-4 text-left text-white active:opacity-95"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-white/75">全{PASSAGES.length}題の本文で使える</p>
                <h2 className="mt-0.5 font-display text-lg font-extrabold">長文読解の30ルール</h2>
                <p className="mt-1 text-xs font-bold leading-relaxed text-white/85">
                  丸暗記せず、合図 → 三手 → 誤読点検の順に練習
                </p>
              </div>
              <span className="mt-1 shrink-0 rounded-full bg-white/15 p-2"><ArrowRight size={19} /></span>
            </div>
            <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="読解ルールの五段階">
              {READING_RULE_PHASES.map((phase) => (
                <li key={phase.id} className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-extrabold">
                  {phase.step}. {phase.label}
                </li>
              ))}
            </ol>
          </button>
        </Card>

        <Card className="p-4" data-reading-status>
          <LearningStatusBars progress={status} compact />
          <p className="mt-2 text-[10px] font-bold text-ink/45">読了と読解チェックの直近結果を、全{PASSAGES.length}題で集計</p>
        </Card>

        {sorted.map((p) => {
          const level = getLevel(p.level)
          const done = readingsDone.includes(p.id)
          const { words, phrases } = getReadingStudy(p)
          return (
            <Card key={p.id} className="overflow-hidden">
              <button
                onClick={() => navigate('readingPrep', { passageId: p.id })}
                className="flex w-full items-center gap-3 p-4 text-left active:bg-brand-50"
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{ backgroundColor: `${level.color}22` }}
                >
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-base font-extrabold text-ink">{p.title}</h3>
                    <Chip className="shrink-0 whitespace-nowrap" color={level.color}>
                      {level.label}
                    </Chip>
                  </div>
                  <p className="truncate text-sm font-bold text-ink/55">{p.titleJa}</p>
                  <p className="mt-0.5 truncate text-[11px] font-extrabold text-brand-600">
                    {p.theme}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.examTypes.map((examType) => (
                      <span key={examType} className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[9px] font-black text-brand-600">
                        {examType}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-bold text-ink/40">
                    <span className="inline-flex whitespace-nowrap items-center gap-0.5">
                      <Book size={12} /> 本文 {passageWordCount(p)}語
                    </span>
                    <span className="whitespace-nowrap">・ 必須語彙等 {words.length + phrases.length}項目</span>
                    {done && (
                      <span className="inline-flex whitespace-nowrap items-center gap-0.5 text-emerald-600">
                        <Check size={12} /> 読了
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-brand-400"><ArrowRight size={20} /></span>
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
