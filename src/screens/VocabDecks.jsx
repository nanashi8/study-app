import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { LEARNING_DECK_TOC } from '../data/decks.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { Card, Button, Chip } from '../components/ui.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { Book, Cards } from '../components/Icons.jsx'

// 1デッキのカード。自己判定と直近クイズを混ぜずに表示する。
function DeckCard({ deck, srs, onStudy, onQuiz }) {
  const progress = summarizeSrsItems(deck.wordIds, srs)
  return (
    <Card className="p-3.5">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-extrabold text-ink">{deck.title}</div>
          <div className="text-[11px] font-bold text-ink/45">全{progress.total}語</div>
        </div>
      </div>
      <LearningStatusBars progress={progress} className="mt-3" compact />
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <Button variant="primary" size="sm" onClick={onStudy}>
          <Book size={15} /> 覚える
        </Button>
        <Button variant="secondary" size="sm" onClick={onQuiz}>
          <Cards size={15} /> クイズ
        </Button>
      </div>
    </Card>
  )
}

export function VocabDecksScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const params = useStore((s) => s.params)

  const levelId = params.levelId ?? '5'
  const level = getLevel(levelId)
  const toc = LEARNING_DECK_TOC.find((t) => t.level.id === levelId)

  const study = (deck) =>
    navigate('vocabStudy', {
      source: { type: 'deck', ids: deck.wordIds },
      size: deck.wordIds.length,
      title: `${level.label}・${deck.title}`,
      mode: 'study',
    })
  const quiz = (deck) =>
    navigate('vocabQuiz', {
      source: { type: 'deck', ids: deck.wordIds },
      size: deck.wordIds.length,
      title: `${level.label}・${deck.title}`,
    })

  return (
    <div className="pb-6">
      <ScreenHeader
        title={`英検${level.label} の目次`}
        subtitle={toc ? `${toc.size}語 ・ ${toc.deckCount}デッキ` : undefined}
      />
      <div className="space-y-5 px-4">
        {!toc && <p className="text-sm font-bold text-ink/50">この級のデッキはまだありません。</p>}
        {toc?.chapters.map((ch) => (
          <div key={ch.fieldId}>
            <div className="mb-2 flex items-start gap-2 px-1">
              <span className="mt-0.5 text-lg" aria-hidden="true">{ch.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-base font-extrabold text-ink/80">{ch.field}</h2>
                  <Chip color={level.color}>{ch.size}語</Chip>
                </div>
                <p className="text-[11px] font-bold text-ink/45">{ch.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {ch.decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  srs={srs}
                  onStudy={() => study(deck)}
                  onQuiz={() => quiz(deck)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
