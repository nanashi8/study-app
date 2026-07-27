import { useStore } from '../store/useStore.js'
import { VN_EPISODES, episodeSceneCount } from '../data/vn.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { cx } from '../components/ui.jsx'
import { ArrowRight, Check } from '../components/Icons.jsx'

export function VnListScreen() {
  const navigate = useStore((s) => s.navigate)
  const vnCleared = useStore((s) => s.vnCleared)

  return (
    <div className="min-h-full bg-paper pb-8">
      <ScreenHeader title="英会話ノベル" subtitle="英語しか通じない世界で、学校生活を生きる物語" />

      <div className="px-4">
        <div className="rounded-2xl bg-white p-3.5 text-xs font-bold leading-relaxed text-ink/55 shadow-sm">
          🗨️ 会話はすべて英語。3つの返事はどれを選んでも物語が続きます。受験で出る
          「あいさつ・依頼・提案・許可・申し出・謝罪」などの表現を場面で体験しよう。
        </div>

        <div className="mt-4 space-y-3">
          {VN_EPISODES.map((ep, i) => {
            const cleared = vnCleared.includes(ep.id)
            return (
              <button
                key={ep.id}
                onClick={() => navigate('vnPlay', { episodeId: ep.id })}
                className="relative flex w-full items-start gap-3.5 rounded-3xl bg-white p-4 text-left shadow-card transition-transform active:scale-[0.99]"
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{ backgroundColor: `${ep.color}22` }}
                >
                  {ep.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-ink/35">EPISODE {i + 1}</span>
                    {cleared && (
                      <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600">
                        <Check size={11} /> クリア
                      </span>
                    )}
                  </div>
                  <div className="font-display text-lg font-extrabold text-ink">{ep.title}</div>
                  <div className="text-xs font-bold text-ink/50">{ep.titleJa}</div>
                  <div className="mt-1.5 text-xs font-bold text-ink/55">{ep.blurb}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ep.focus.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="mt-1 shrink-0" style={{ color: ep.color }}>
                  <ArrowRight size={22} />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
