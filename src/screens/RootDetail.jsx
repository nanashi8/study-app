import { useStore } from '../store/useStore.js'
import { getEtymologyPack, getRoot, getWord } from '../data/vocab.js'
import { summarizeVocabularySrsItems, vocabularyLearningStatus } from '../lib/vocabScheduler.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { StatusDistributionBar } from '../components/LearningStatusBars.jsx'
import { Button, Card } from '../components/ui.jsx'
import { ArrowRight, Book, Check } from '../components/Icons.jsx'

const LEARN_BATCH = 10

export function RootDetailScreen() {
  const rootId = useStore((state) => state.params.rootId)
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  const root = getRoot(rootId)
  const card = getEtymologyPack(`root:${rootId}`)

  if (!root || !card) {
    return (
      <div className="pb-6">
        <ScreenHeader title="語源カード" />
        <div className="space-y-4 px-4 py-8 text-center">
          <p className="font-display text-lg font-extrabold text-ink">
            語源カードが見つかりません
          </p>
          <p className="text-sm font-bold leading-relaxed text-ink/50">
            語源カード一覧へ戻って、別の語根を選んでください。
          </p>
          <Button onClick={() => navigate('roots')}>語源カード一覧へ</Button>
        </div>
      </div>
    )
  }

  const words = card.studyIds.map(getWord).filter(Boolean)
  const examples = card.exampleIds.map(getWord).filter(Boolean)
  const wordProgress = summarizeVocabularySrsItems(words, srs)
  const nextWords = [
    ...words.filter((word) => vocabularyLearningStatus(srs[word.id]) === 'reviewing'),
    ...words.filter((word) => vocabularyLearningStatus(srs[word.id]) === 'unlearned'),
    ...words.filter((word) => vocabularyLearningStatus(srs[word.id]) === 'learned'),
  ].slice(0, LEARN_BATCH)

  const studyWords = () => navigate('vocabStudy', {
    source: { type: 'deck', ids: nextWords.map((word) => word.id), preserveOrder: true },
    title: `${card.rootForm}（${card.rootMeaning}）から暗記`,
    mode: 'study',
    size: nextWords.length,
    returnTo: { screen: 'rootDetail', params: { rootId } },
  })

  return (
    <div className="pb-6">
      <ScreenHeader title="同じ語根の単語" />

      <div className="space-y-4 px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-violet-700 to-indigo-700 p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="text-5xl" aria-hidden="true">{card.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-white/75">出典つき語源カード</p>
                <h1 className="font-display text-3xl font-extrabold">{card.rootForm}</h1>
                <p className="text-base font-extrabold text-white/90">＝ {card.rootMeaning}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm font-bold leading-relaxed text-ink/60">{card.rootOrigin}</p>
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-amber-800 ring-1 ring-amber-100">
              {card.caution}
            </p>
            <StatusDistributionBar kind="learning" counts={wordProgress.learning} compact unit="語" />
            <Button full onClick={studyWords} disabled={!nextWords.length} data-etymology-word-study-action>
              <Book size={18} /> 次の{nextWords.length}語を暗記
            </Button>
          </div>
        </Card>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200" aria-labelledby="root-examples-heading">
          <h2 id="root-examples-heading" className="font-display text-base font-extrabold text-ink">意味を思い出す例</h2>
          <p className="mt-1 text-xs font-bold text-ink/50">この語根の意味をつかみやすい代表例です。</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {examples.map((word) => (
              <button
                key={word.id}
                type="button"
                onClick={() => navigate('wordDetail', { id: word.id })}
                className="flex min-h-12 items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-left ring-1 ring-violet-100 active:bg-violet-100"
              >
                <PosBadge pos={word.pos} />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-extrabold text-ink">{word.word}</span>
                  <span className="block truncate text-xs font-bold text-ink/55">{word.meanings?.[0] ?? word.meaning}</span>
                </span>
                <ArrowRight size={15} className="shrink-0 text-violet-400" />
              </button>
            ))}
          </div>
        </section>

        <details className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-extrabold text-slate-700">
            <span>紐づく全単語</span>
            <span className="text-xs text-slate-500">{words.length}語</span>
          </summary>
          <ul className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-2">
            {words.map((word) => (
              <li key={word.id}>
                <button
                  type="button"
                  onClick={() => navigate('wordDetail', { id: word.id })}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-left active:bg-violet-50"
                >
                  <span className="font-display text-sm font-extrabold text-ink">{word.word}</span>
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink/50">{word.meanings?.[0] ?? word.meaning}</span>
                  <ArrowRight size={14} className="shrink-0 text-slate-400" />
                </button>
              </li>
            ))}
          </ul>
        </details>

        <details className="overflow-hidden rounded-2xl border border-slate-200 bg-white" data-etymology-evidence>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-extrabold text-slate-700">
            <span className="flex items-center gap-2"><Check size={17} /> 確認記録と出典</span>
            <span className="text-xs text-slate-500">{card.evidence.reviewedAt}</span>
          </summary>
          <ul className="space-y-1.5 border-t border-slate-100 p-4">
            {card.evidence.sources.map((item) => (
              <li key={`${item.source}:${item.head}`}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center gap-1.5 text-xs font-extrabold text-violet-700 underline decoration-violet-200 underline-offset-2"
                >
                  {item.source}「{item.head}」 <ArrowRight size={13} />
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  )
}
