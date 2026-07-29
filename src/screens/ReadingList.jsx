import { useStore } from '../store/useStore.js'
import { PASSAGES } from '../data/passages.js'
import { READING_LEVELS, getLevel } from '../data/levels.js'
import { getReadingStudy, passageWordCount } from '../data/reading-study.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Chip } from '../components/ui.jsx'
import { Check, ArrowRight, Book } from '../components/Icons.jsx'

const levelOrder = Object.fromEntries(READING_LEVELS.map((l, i) => [l.id, i]))
const sorted = [...PASSAGES].sort((a, b) => levelOrder[a.level] - levelOrder[b.level])

export function ReadingListScreen() {
  const navigate = useStore((s) => s.navigate)
  const readingsDone = useStore((s) => s.readingsDone)

  return (
    <div className="pb-6">
      <ScreenHeader
        title="長文を読む"
        subtitle={`全${PASSAGES.length}題・テーマ必須語彙を確認してから本文へ`}
      />
      <div className="space-y-3 px-4">
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
