import { useStore } from '../store/useStore.js'
import { ROOTS, wordsByRoot } from '../data/vocab.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, ProgressRing } from '../components/ui.jsx'
import { hasRootBreakdown } from '../components/WordBits.jsx'
import { ArrowRight } from '../components/Icons.jsx'

// box>=4 を「習得」、box1〜3 を「学習中」。リングは box 加重で進み具合を表す。
const MASTER_BOX = 4
function rootProgress(words, srs) {
  let mastered = 0, learning = 0, pts = 0
  for (const w of words) {
    const box = srs[w.id]?.box ?? 0
    if (box >= MASTER_BOX) mastered++
    else if (box >= 1) learning++
    pts += Math.min(box, MASTER_BOX)
  }
  const total = words.length
  return { mastered, learning, total, ratio: total ? pts / (total * MASTER_BOX) : 0 }
}

// 語源（語根）の一覧。1つの語根＝意味の共通する「派生語の家族」。
// タップで語根の詳細（意味・由来・派生語まとめ学習）へ。
export function RootsScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)

  const items = ROOTS
    .map((r) => {
      const words = wordsByRoot(r.id)
      const examples = [...words]
        .sort((a, b) => Number(hasRootBreakdown(b, r.id)) - Number(hasRootBreakdown(a, r.id)))
        .slice(0, 3)
      return { r, words, examples, ...rootProgress(words, srs) }
    })
    // 派生語が0の語根（データに該当語が無い）はマップに出さない。
    .filter((it) => it.total > 0)
  const totalMastered = items.reduce((a, b) => a + b.mastered, 0)
  const totalWords = items.reduce((a, b) => a + b.total, 0)

  return (
    <div className="pb-6">
      <ScreenHeader
        title="語源で覚える"
        subtitle={`${items.length}の語根 ・ 習得 ${totalMastered}/${totalWords}語`}
      />

      <div className="px-4">
        <Card className="mb-4 overflow-hidden">
          <div className="bg-gradient-to-br from-brand-500 to-violet-600 p-4 text-white">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-white/70">
              1つの意味の核から、何語も増やす
            </p>
            <p className="mt-1 font-display text-lg font-extrabold leading-snug">
              語根を覚え、前後のパーツを足して<br />知らない単語の意味まで予想しよう。
            </p>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-extrabold">
              <span className="rounded-lg bg-brand-100 px-2 py-1 text-brand-700">port＝運ぶ</span>
              <span className="text-brand-300">→</span>
              <span className="rounded-lg bg-amber-100 px-2 py-1 text-amber-700">import</span>
              <span className="rounded-lg bg-amber-100 px-2 py-1 text-amber-700">export</span>
              <span className="rounded-lg bg-amber-100 px-2 py-1 text-amber-700">transport</span>
            </div>
            <p className="mt-2 text-xs font-bold leading-relaxed text-ink/50">
              各ページで「パーツの足し算」と「由来の説明から広げる仲間」を分けて学べます。
            </p>
          </div>
        </Card>
        <div className="space-y-2.5">
          {items.map(({ r, examples, total, mastered, learning, ratio }) => (
            <button
              key={r.id}
              onClick={() => navigate('rootDetail', { rootId: r.id })}
              className="w-full text-left active:scale-[0.99] transition-transform"
            >
              <Card className="flex items-center gap-3 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                  {r.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display text-lg font-extrabold text-ink">{r.form}</h3>
                    <span className="truncate text-sm font-bold text-ink/55">＝{r.meaning}</span>
                  </div>
                  <p className="text-xs font-bold text-ink/45">
                    同語源 {total}語 ・ 習得 {mastered}・学習中 {learning}
                  </p>
                  <p className="mt-1 truncate text-[11px] font-extrabold text-brand-500/80">
                    {examples.map((w) => w.word).join(' ・ ')}
                  </p>
                </div>
                <ProgressRing value={ratio} size={44} stroke={6} color="#6366f1">
                  <span className="text-[10px] font-extrabold text-ink/70">{Math.round(ratio * 100)}%</span>
                </ProgressRing>
                <span className="text-brand-300"><ArrowRight size={18} /></span>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
