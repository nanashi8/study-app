import { useStore, isDue } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getWritingGrammar } from '../data/writing.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Button, Card, Chip, EmptyState } from '../components/ui.jsx'
import {
  ArrowRight,
  BookmarkFilled,
  Cards,
  Sparkles,
} from '../components/Icons.jsx'

export function MyGrammarScreen() {
  const navigate = useStore((s) => s.navigate)
  const myGrammarList = useStore((s) => s.myGrammarList)
  const toggleMyGrammar = useStore((s) => s.toggleMyGrammar)
  const srs = useStore((s) => s.srs)
  const items = myGrammarList.map(getWritingGrammar).filter(Boolean)
  const due = items.filter((item) => isDue(srs[item.id])).length

  return (
    <div className="pb-8">
      <ScreenHeader
        title="マイ文法"
        subtitle={`${items.length}項目を保存中`}
        right={
          items.length > 0 ? (
            <Chip color="#8b5cf6">{due} 復習どき</Chip>
          ) : null
        }
      />

      <div className="px-4">
        {items.length === 0 ? (
          <>
            <EmptyState icon="🧩" title="まだ保存した文法はありません">
              英作文で語順を完成させると、使った文法と語法が表示されます。🔖を押すと、ここへ保存してカードで復習できます。
            </EmptyState>
            <Button
              className="mt-4"
              full
              onClick={() => navigate('writing')}
            >
              <Sparkles size={17} /> 英作文をはじめる
            </Button>
          </>
        ) : (
          <>
            <Card className="overflow-hidden bg-gradient-to-br from-violet-600 to-brand-700 text-white">
              <div className="p-4">
                <p className="text-[11px] font-extrabold tracking-[0.16em] text-violet-200">
                  SPACED REVIEW
                </p>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-extrabold">
                      使った文法を、自分の型へ
                    </h2>
                    <p className="mt-1 text-xs font-bold leading-relaxed text-white/70">
                      説明を思い出してから例文を開き、覚え具合に合わせて次の復習日を調整します。
                    </p>
                  </div>
                  <span className="font-display text-3xl font-extrabold text-white/90">
                    {due}
                  </span>
                </div>
                <Button
                  className="mt-4 bg-white text-violet-700 shadow-none active:bg-violet-50"
                  full
                  onClick={() => navigate('writingGrammarReview')}
                >
                  <Cards size={17} />
                  {due > 0 ? `${due}項目を復習` : 'すべて復習'}
                  <ArrowRight size={17} />
                </Button>
              </div>
            </Card>

            <div className="mt-4 space-y-3">
              {items.map((item) => {
                const level = getLevel(item.level)
                const entry = srs[item.id]
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <div
                      className="h-1"
                      style={{ background: level.color }}
                    />
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Chip color={level.color}>
                              {level.emoji} {level.label}
                            </Chip>
                            {entry && (
                              <span className="text-[10px] font-extrabold text-ink/38">
                                復習BOX {entry.box}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 font-display text-lg font-extrabold text-ink">
                            {item.title}
                          </h3>
                          <p className="mt-1 rounded-xl bg-brand-50 px-3 py-2 font-mono text-xs font-extrabold text-brand-700">
                            {item.pattern}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleMyGrammar(item.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 active:scale-90"
                          aria-label={`${item.title}をマイ文法から外す`}
                        >
                          <BookmarkFilled size={19} />
                        </button>
                      </div>
                      <p className="mt-3 text-sm font-bold leading-relaxed text-ink/65">
                        {item.explanation}
                      </p>
                      <div className="mt-3 flex items-start gap-2 rounded-2xl bg-slate-50 p-3">
                        <SpeakButton text={item.example.en} size="sm" />
                        <div>
                          <p className="text-sm font-extrabold leading-relaxed text-ink">
                            {item.example.en}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-ink/45">
                            {item.example.ja}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
