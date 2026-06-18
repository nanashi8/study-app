import { useStore } from '../store/useStore.js'
import { PASSAGES } from '../data/passages.js'
import { LEVELS, getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Chip } from '../components/ui.jsx'
import { Check, ArrowRight, Book } from '../components/Icons.jsx'

const levelOrder = Object.fromEntries(LEVELS.map((l, i) => [l.id, i]))
const sorted = [...PASSAGES].sort((a, b) => levelOrder[a.level] - levelOrder[b.level])

export function ReadingListScreen() {
  const navigate = useStore((s) => s.navigate)
  const readingsDone = useStore((s) => s.readingsDone)

  return (
    <div className="pb-6">
      <ScreenHeader title="長文を読む" subtitle="一文ごとに発音・直訳・和訳が見られます" />
      <div className="space-y-3 px-4">
        {sorted.map((p) => {
          const level = getLevel(p.level)
          const done = readingsDone.includes(p.id)
          return (
            <Card key={p.id} className="overflow-hidden">
              <button
                onClick={() => navigate('reader', { passageId: p.id })}
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
                    <Chip color={level.color}>{level.label}</Chip>
                  </div>
                  <p className="truncate text-sm font-bold text-ink/55">{p.titleJa}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-ink/40">
                    <span className="inline-flex items-center gap-0.5">
                      <Book size={12} /> {p.sentences.length}文
                    </span>
                    <span>・ 重要語 {p.vocab.length}</span>
                    {done && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600">
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
