import { useStore } from '../store/useStore.js'
import { getEtymologyPack, getRoot, getWord } from '../data/vocab.js'
import { etymologyGlanceNote } from '../lib/etymologyGlance.js'
import { summarizeVocabularySrsItems, vocabularyLearningStatus } from '../lib/vocabScheduler.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { StatusDistributionBar } from '../components/LearningStatusBars.jsx'
import { Button, Card } from '../components/ui.jsx'
import { Book, Cards } from '../components/Icons.jsx'

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
  const wordProgress = summarizeVocabularySrsItems(words, srs)
  const nextWords = [
    ...words.filter((word) => vocabularyLearningStatus(srs[word.id]) === 'reviewing'),
    ...words.filter((word) => vocabularyLearningStatus(srs[word.id]) === 'unlearned'),
    ...words.filter((word) => vocabularyLearningStatus(srs[word.id]) === 'learned'),
  ].slice(0, LEARN_BATCH)

  // 語根1つだけを覚え直しても身につかないため、この画面からは紐づく単語を、
  // いつもの単語の暗記・テストで学ぶ。
  const returnTarget = { screen: 'rootDetail', params: { rootId } }
  const studyWords = () => navigate('vocabStudy', {
    source: { type: 'deck', ids: nextWords.map((word) => word.id), preserveOrder: true },
    title: `${card.rootForm}（${card.rootMeaning}）から暗記`,
    mode: 'study',
    size: nextWords.length,
    returnTo: returnTarget,
  })
  const quizWords = () => navigate('vocabQuiz', {
    source: { type: 'deck', ids: words.map((word) => word.id) },
    title: `${card.rootForm}（${card.rootMeaning}）のテスト`,
    size: Math.min(LEARN_BATCH, words.length),
    returnTo: returnTarget,
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
                <p className="text-xs font-extrabold text-white/75">語源カード</p>
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
            <div className="space-y-2">
              <Button
                full
                onClick={studyWords}
                disabled={!nextWords.length}
                aria-label={`${card.rootForm}に紐づく単語を暗記`}
                data-etymology-word-study-action
              >
                <Book size={18} /> 紐づく単語を暗記
              </Button>
              <Button
                full
                variant="secondary"
                onClick={quizWords}
                disabled={!words.length}
                aria-label={`${card.rootForm}に紐づく単語をテスト`}
                data-etymology-word-quiz-action
              >
                <Cards size={18} /> 紐づく単語をテスト
              </Button>
            </div>
            <p className="text-center text-xs font-bold text-ink/50">
              暗記は、まだ覚えていない{nextWords.length}語から始めます。
            </p>
          </div>
        </Card>

        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200" aria-labelledby="root-words-heading">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id="root-words-heading" className="font-display text-base font-extrabold text-ink">同じ語根の単語</h2>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
                単語・意味・語源を一目で確認できます。左右のスワイプで、その場の答えを記録できます。
              </p>
            </div>
            <span className="shrink-0 text-xs font-extrabold text-violet-700">{words.length}語</span>
          </div>
          <NormalLearningRecordList
            className="mt-3"
            entryId={`root:${rootId}`}
            contentId="vocab"
            items={words}
            unit="語"
            titleLanguage="en"
            onOpen={(item) => navigate('wordDetail', { id: item.id })}
            openLabel="この単語の詳細を見る"
            openHint="詳細"
            noteFor={(item) => etymologyGlanceNote(item, card)}
            emptyMessage="この語根に紐づく単語はまだありません。"
          />
        </section>
      </div>
    </div>
  )
}
