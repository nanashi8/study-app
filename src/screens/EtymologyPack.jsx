import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { getEtymologyPack, getWord } from '../data/vocab.js'
import { etymologyWordCardReviewState } from '../lib/etymologyProgress.js'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { StatusDistributionBar } from '../components/LearningStatusBars.jsx'
import { Button, Card } from '../components/ui.jsx'
import { ArrowRight, Book, Check } from '../components/Icons.jsx'

const statusLabel = (state) => {
  if (state.due) return '今日復習'
  if (state.status === 'mastered') return '学習済み'
  if (state.status === 'learning') return '学習中'
  return '未学習'
}

export function EtymologyPackScreen() {
  const rootRef = useRef(null)
  const packId = useStore((state) => state.params.packId)
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  const pack = getEtymologyPack(packId)

  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [packId])

  if (!pack) {
    return (
      <div ref={rootRef}>
        <ScreenHeader title="語源カード" />
        <div className="p-8 text-center font-bold text-ink/50">
          公開できる確認済みカードが見つかりませんでした。
        </div>
      </div>
    )
  }

  const words = pack.studyIds.map(getWord).filter(Boolean)
  const examples = pack.exampleIds.map(getWord).filter(Boolean)
  const wordProgress = summarizeVocabularySrsItems(words, srs)
  const cardState = etymologyWordCardReviewState(pack, srs)

  const studyWords = () => navigate('vocabStudy', {
    source: { type: 'deck', ids: pack.studyIds, preserveOrder: true },
    title: `${pack.rootForm}（${pack.rootMeaning}）に紐づく単語`,
    mode: 'study',
    size: Math.min(20, pack.studyIds.length),
    returnTo: { screen: 'etymologyPack', params: { packId: pack.id } },
  })

  return (
    <div ref={rootRef} className="pb-6">
      <ScreenHeader title="語源カード" />

      <div className="space-y-4 px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-violet-700 to-indigo-700 p-5 text-white">
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl" aria-hidden="true">
                {pack.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold text-white/75">確認済み語源カード</p>
                  <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-extrabold">{statusLabel(cardState)}</span>
                </div>
                <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight">{pack.rootForm}</h1>
                <p className="mt-1 font-display text-lg font-extrabold text-white/90">＝ {pack.rootMeaning}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
              <p className="text-xs font-extrabold text-emerald-700">意味の出発点</p>
              <p className="mt-1 font-display text-base font-extrabold leading-relaxed text-ink">{pack.rootOrigin}</p>
            </div>
            <p className="text-sm font-bold leading-relaxed text-ink/60">
              「{pack.rootForm} ＝ {pack.rootMeaning}」を手がかりに、紐づく英単語を覚えます。
            </p>
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-amber-800 ring-1 ring-amber-100">
              {pack.caution}
            </p>
          </div>
        </Card>

        <section className="rounded-2xl bg-white p-3 ring-1 ring-slate-200" data-etymology-pack-actions>
          <p className="mb-2 text-center text-xs font-extrabold text-violet-700">
            このカードに紐づく{words.length}語を通常の単語カードで学習
          </p>
          <Button full onClick={studyWords} data-etymology-word-study-action>
            <Book size={18} /> 紐づく単語を暗記
          </Button>
        </section>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200" aria-labelledby="etymology-examples-heading">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="etymology-examples-heading" className="font-display text-base font-extrabold text-ink">この形を使う例</h2>
              <p className="text-xs font-bold text-ink/50">意味を思い出す手がかりとして確認</p>
            </div>
            <span className="text-xs font-extrabold text-violet-700">{words.length}語</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {examples.map((word) => (
              <div key={word.id} className="rounded-xl bg-violet-50 px-3 py-2 ring-1 ring-violet-100">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-base font-extrabold text-ink">{word.word}</span>
                  <PosBadge pos={word.pos} />
                </div>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">
                  {word.meanings?.[0] ?? word.meaning}
                </p>
              </div>
            ))}
          </div>
        </section>

        <details className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-extrabold text-slate-700">
            <span>紐づく単語と学習状況</span>
            <span className="text-xs text-slate-500">{words.length}語</span>
          </summary>
          <div className="space-y-3 border-t border-slate-100 p-4">
            <StatusDistributionBar kind="learning" counts={wordProgress.learning} compact unit="語" />
            <ul className="grid gap-2 sm:grid-cols-2">
              {words.map((word) => (
                <li key={word.id} className="flex min-w-0 items-baseline gap-2 rounded-xl bg-slate-50 px-3 py-2">
                  <span className="font-display text-sm font-extrabold text-ink">{word.word}</span>
                  <span className="min-w-0 flex-1 text-xs font-bold text-ink/50">
                    {word.meanings?.[0] ?? word.meaning}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className="overflow-hidden rounded-2xl border border-slate-200 bg-white" data-etymology-evidence>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-extrabold text-slate-700">
            <span className="flex items-center gap-2"><Check size={17} /> 確認記録と出典</span>
            <span className="text-xs text-slate-500">{pack.evidence.reviewedAt}</span>
          </summary>
          <div className="space-y-2 border-t border-slate-100 p-4">
            <p className="text-xs font-bold leading-relaxed text-slate-500">
              語根の説明と紐づく全単語を人が確認し、内容が変わったときは監査で検知します。
            </p>
            <ul className="space-y-1.5">
              {pack.evidence.sources.map((item) => (
                <li key={`${item.source}:${item.head}`}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 text-xs font-extrabold text-violet-700 underline decoration-violet-200 underline-offset-2"
                  >
                    {item.source}「{item.head}」
                    <ArrowRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <button
          type="button"
          onClick={() => navigate('rootDetail', { rootId: pack.rootId })}
          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-3 text-xs font-extrabold text-violet-700 ring-1 ring-violet-100 active:bg-violet-100"
        >
          この語根の一覧を見る <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
