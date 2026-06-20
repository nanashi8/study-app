import { useStore } from '../store/useStore.js'
import { getRoot, wordsByRoot } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Card, Button, Chip, ProgressRing } from '../components/ui.jsx'
import { ArrowRight, Book, Cards, Sparkles, Check } from '../components/Icons.jsx'

const MASTER_BOX = 4

export function RootDetailScreen() {
  const rootId = useStore((s) => s.params.rootId)
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
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

  // 「足がかり（既に習得した語）」と「これから増やせる語（未習得）」に分ける。
  const boxOf = (w) => srs[w.id]?.box ?? 0
  const known = words.filter((w) => boxOf(w) >= MASTER_BOX)
  const toGain = words.filter((w) => boxOf(w) < MASTER_BOX)
  const total = words.length
  const pts = words.reduce((a, w) => a + Math.min(boxOf(w), MASTER_BOX), 0)
  const ratio = total ? pts / (total * MASTER_BOX) : 0

  // 未習得の語をまとめて学習（芋づる式に増やす）。deck ソースで対象語だけ出題。
  const grow = () =>
    navigate('vocabStudy', {
      source: { type: 'deck', ids: toGain.map((w) => w.id) },
      title: `語源 ${root.form}`,
      mode: 'study',
      size: toGain.length,
    })
  const quiz = () =>
    navigate('vocabQuiz', { source: { type: 'root', rootId }, title: `語源 ${root.form}` })

  const WordRow = ({ w, dim }) => {
    const level = getLevel(w.level)
    return (
      <button
        onClick={() => navigate('wordDetail', { id: w.id })}
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm active:bg-brand-50"
      >
        <PosBadge pos={w.pos} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-extrabold text-ink">{w.word}</span>
            <Chip color={level.color}>{level.label}</Chip>
            {dim && <Check size={14} className="text-emerald-500" />}
          </div>
          <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>
        </div>
        <span className="text-brand-400"><ArrowRight size={18} /></span>
      </button>
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
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-3xl font-extrabold">{root.form}</h1>
                <p className="text-sm font-bold text-white/80">＝{root.meaning}</p>
              </div>
              <ProgressRing value={ratio} size={56} stroke={7} color="#ffffff" track="rgba(255,255,255,0.25)">
                <span className="text-[11px] font-extrabold">{Math.round(ratio * 100)}%</span>
              </ProgressRing>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-bold text-ink/60">語源：{root.origin}</p>
            <p className="mt-1 text-xs font-extrabold text-brand-600">
              1つの語源で {total}語 ・ 習得 {known.length}・あと {toGain.length}語
            </p>
            {toGain.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button onClick={grow}>
                  <Sparkles size={18} /> あと{toGain.length}語ふやす
                </Button>
                <Button variant="secondary" disabled={total < 3} onClick={quiz}>
                  <Cards size={18} /> クイズ
                </Button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center rounded-2xl bg-emerald-50 py-2.5 text-sm font-extrabold text-emerald-700">
                  🎉 全部習得！
                </div>
                <Button variant="secondary" disabled={total < 3} onClick={quiz}>
                  <Cards size={18} /> クイズ
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* 足がかり：すでに知っている同語源の語 */}
        {known.length > 0 && (
          <>
            <div className="mb-2 mt-5 flex items-center gap-1.5 px-1">
              <Book size={16} className="text-emerald-500" />
              <h2 className="font-display text-base font-extrabold text-ink/80">知っている語（足がかり）</h2>
            </div>
            <div className="space-y-2">
              {known.map((w) => <WordRow key={w.id} w={w} dim />)}
            </div>
          </>
        )}

        {/* これから増やせる語 */}
        <div className="mb-2 mt-5 flex items-center gap-1.5 px-1">
          <Sparkles size={16} className="text-brand-500" />
          <h2 className="font-display text-base font-extrabold text-ink/80">
            {known.length > 0 ? 'ここから増やせる語' : `${root.form} を含む単語`}
          </h2>
        </div>
        {toGain.length > 0 ? (
          <div className="space-y-2">
            {toGain.map((w) => <WordRow key={w.id} w={w} />)}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-4 text-center text-sm font-bold text-ink/45 shadow-sm">
            この語源の語はすべて習得済みです🎉
          </p>
        )}
      </div>
    </div>
  )
}
