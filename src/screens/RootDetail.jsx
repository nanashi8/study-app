import { useStore } from '../store/useStore.js'
import { getRoot, wordsByRoot } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { EtymologyFormula, hasRootBreakdown, PosBadge } from '../components/WordBits.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { Card, Button, Chip } from '../components/ui.jsx'
import { learningStatusForSrsEntry, summarizeSrsItems } from '../lib/contentProgress.js'
import { ArrowRight, Book, Cards, Sparkles, Check } from '../components/Icons.jsx'

const LEARN_BATCH = 8
const LEVEL_RANK = { '5': 0, '4': 1, '3': 2, pre2: 3, '2': 4, pre1: 5, '1': 6 }

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

  // 直近の自己判定で、学習済みと復習中・未学習を分ける。
  const statusOf = (word) => learningStatusForSrsEntry(srs[word.id])
  const known = words.filter((word) => statusOf(word) === 'learned')
  const toGain = words.filter((word) => statusOf(word) !== 'learned')
  const total = words.length
  const rootProgress = summarizeSrsItems(words, srs)

  // 同じ語源でも、意味をパーツから直接組み立てられる語と、
  // 歴史的には同源だが意味が広がった語を分けて見せる。
  const orderForReading = (list) =>
    [...list].sort((a, b) => {
      const knownDiff = Number(statusOf(b) === 'learned') - Number(statusOf(a) === 'learned')
      if (knownDiff) return knownDiff
      const levelDiff = (LEVEL_RANK[a.level] ?? 99) - (LEVEL_RANK[b.level] ?? 99)
      return levelDiff || a.word.localeCompare(b.word, 'en')
    })
  const buildable = orderForReading(words.filter((w) => hasRootBreakdown(w, rootId)))
  const historical = orderForReading(words.filter((w) => !hasRootBreakdown(w, rootId)))

  // 一度に多すぎない8語。復習中の語を先にし、その後は「意味の式」がある易しい語から。
  const nextBatch = [...toGain].sort((a, b) => {
    const learningDiff = Number(statusOf(b) === 'reviewing') - Number(statusOf(a) === 'reviewing')
    if (learningDiff) return learningDiff
    const buildableDiff = Number(hasRootBreakdown(b, rootId)) - Number(hasRootBreakdown(a, rootId))
    if (buildableDiff) return buildableDiff
    return (LEVEL_RANK[a.level] ?? 99) - (LEVEL_RANK[b.level] ?? 99)
  }).slice(0, LEARN_BATCH)

  // 次の小さなまとまりだけを学習。deck ソースで対象語だけ出題する。
  const grow = () =>
    navigate('vocabStudy', {
      source: { type: 'deck', ids: nextBatch.map((w) => w.id) },
      title: `${root.form} から広げる`,
      mode: 'study',
      size: nextBatch.length,
    })
  const quiz = () =>
    navigate('vocabQuiz', { source: { type: 'root', rootId }, title: `語源 ${root.form}` })

  const WordRow = ({ w, build }) => {
    const level = getLevel(w.level)
    const learningStatus = statusOf(w)
    return (
      <button
        onClick={() => navigate('wordDetail', { id: w.id })}
        className="w-full rounded-2xl bg-white p-3 text-left shadow-sm active:bg-brand-50"
      >
        <div className="flex items-center gap-3">
          <PosBadge pos={w.pos} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg font-extrabold text-ink">{w.word}</span>
              <Chip color={level.color}>{level.label}</Chip>
              {learningStatus === 'learned' && (
                <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-emerald-600">
                  <Check size={13} /> 学習済
                </span>
              )}
              {learningStatus === 'reviewing' && (
                <span className="text-xs font-extrabold text-amber-600">復習中</span>
              )}
            </div>
            {!build && <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>}
          </div>
          <span className="text-brand-400"><ArrowRight size={18} /></span>
        </div>
        {build ? (
          <div className="mt-2.5 pl-9">
            <EtymologyFormula word={w} rootId={rootId} />
            {w.etymology?.note && (
              <p className="mt-2 text-xs font-bold leading-relaxed text-ink/55">
                {w.etymology.note}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 pl-9 text-xs font-bold leading-relaxed text-ink/50">
            {w.etymology?.note || w.etymology?.origin}
          </p>
        )}
      </button>
    )
  }

  return (
    <div className="pb-6">
      <ScreenHeader title="同じ語根の単語" />

      <div className="px-4">
        {/* 語根ヒーロー */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{root.emoji}</span>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-3xl font-extrabold">{root.form}</h1>
                <p className="text-xs font-bold text-white/75">語根（意味の中心）</p>
                <p className="text-base font-extrabold text-white">＝{root.meaning}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-bold text-ink/60">もとのことば：{root.origin}</p>
            <p className="mt-2 rounded-xl bg-brand-50 px-3 py-2 text-xs font-bold leading-relaxed text-brand-700">
              まず「{root.form}＝{root.meaning}」を覚え、前後につく部品の意味を足して単語を予想します。
            </p>
            <p className="mt-1 text-xs font-extrabold text-brand-600">
              同じ語根 {total}語 ・ 学習済 {known.length}語・あと {toGain.length}語
            </p>
            <LearningStatusBars progress={rootProgress} className="mt-3" compact units={{ learning: '語', quiz: '問' }} />
            {toGain.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button onClick={grow}>
                  <Sparkles size={18} /> 次の{nextBatch.length}語
                </Button>
                <Button variant="secondary" disabled={total < 3} onClick={quiz}>
                  <Cards size={18} /> クイズ
                </Button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center rounded-2xl bg-emerald-50 py-2.5 text-sm font-extrabold text-emerald-700">
                  🎉 全部学習済！
                </div>
                <Button variant="secondary" disabled={total < 3} onClick={quiz}>
                  <Cards size={18} /> クイズ
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* 既知語、または最初の易しい語を連想の足がかりにする。 */}
        <Card className="mt-4 p-4">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <Book size={16} />
            <h2 className="font-display text-sm font-extrabold">
              {known.length > 0 ? '知っている語を足がかりにする' : 'まず1語を足がかりにする'}
            </h2>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(known.length > 0
              ? orderForReading(known).slice(0, 5)
              : (buildable.length ? buildable : historical).slice(0, 1)
            ).map((w) => (
              <button
                key={w.id}
                onClick={() => navigate('wordDetail', { id: w.id })}
                className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100 active:bg-emerald-100"
              >
                {w.word} <span className="opacity-65">＝{w.meanings.slice(0, 1).join('')}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs font-bold leading-relaxed text-ink/45">
            {known.length > 0
              ? `この語と同じ「${root.meaning}」を探すと、初見語にも意味の手掛かりができます。`
              : `この1語で「${root.form}＝${root.meaning}」をつかんでから、前後のパーツを入れ替えます。`}
          </p>
        </Card>

        {/* 現代の意味をパーツから組み立てやすい語。 */}
        {buildable.length > 0 && (
          <section>
            <div className="mb-2 mt-5 px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-brand-500" />
                <h2 className="font-display text-base font-extrabold text-ink/80">
                  部品の意味を足して考える
                </h2>
              </div>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">
                前・中心・後ろの部品を順に見て、今の意味につなげます（{buildable.length}語）。
              </p>
            </div>
            <div className="space-y-2">
              {buildable.map((w) => <WordRow key={w.id} w={w} build />)}
            </div>
          </section>
        )}

        {/* 分解パーツ未整備の語は、既存の由来説明を手掛かりに同語源へ広げる。 */}
        {historical.length > 0 && (
          <section>
            <div className="mb-2 mt-5 px-1">
              <div className="flex items-center gap-1.5">
                <Book size={16} className="text-violet-500" />
                <h2 className="font-display text-base font-extrabold text-ink/80">
                  歴史をたどって覚える仲間
                </h2>
              </div>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">
                もとの形と意味の変化を、1語ずつ確かめます（{historical.length}語）。
              </p>
            </div>
            <div className="space-y-2">
              {historical.map((w) => <WordRow key={w.id} w={w} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
