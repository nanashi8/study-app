import { useStore } from '../store/useStore.js'
import { getRoot, wordsByRoot } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Card, Button, Chip } from '../components/ui.jsx'
import { ArrowRight, Book } from '../components/Icons.jsx'

export function RootDetailScreen() {
  const rootId = useStore((s) => s.params.rootId)
  const navigate = useStore((s) => s.navigate)
  const root = getRoot(rootId)
  const words = wordsByRoot(rootId)

  if (!root) {
    return (
      <div>
        <ScreenHeader title="語源" />
        <div className="p-8 text-center font-bold text-ink/50">語源が見つかりませんでした。</div>
      </div>
    )
  }

  return (
    <div className="pb-6">
      <ScreenHeader title="語源でひろげる" />

      <div className="px-4">
        {/* 語根ヒーロー */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{root.emoji}</span>
              <div>
                <h1 className="font-display text-3xl font-extrabold">{root.form}</h1>
                <p className="text-sm font-bold text-white/80">＝{root.meaning}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-bold text-ink/60">語源：{root.origin}</p>
            <Button
              full
              className="mt-3"
              onClick={() => navigate('vocabStudy', { source: { type: 'root', rootId }, title: `語源 ${root.form}`, mode: 'study' })}
            >
              <Book size={18} /> この語根の単語をまとめて学習（{words.length}語）
            </Button>
          </div>
        </Card>

        {/* 単語一覧 */}
        <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">
          {root.form} を含む単語
        </h2>
        <div className="space-y-2">
          {words.map((w) => {
            const level = getLevel(w.level)
            return (
              <button
                key={w.id}
                onClick={() => navigate('wordDetail', { id: w.id })}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm active:bg-brand-50"
              >
                <PosBadge pos={w.pos} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-extrabold text-ink">{w.word}</span>
                    <Chip color={level.color}>{level.label}</Chip>
                  </div>
                  <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>
                </div>
                <span className="text-brand-400"><ArrowRight size={18} /></span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
