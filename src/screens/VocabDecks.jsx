import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { LEARNING_FIELD_TOC } from '../data/decks.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { Card, Button, Chip } from '../components/ui.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { Book, Cards } from '../components/Icons.jsx'

// 旧「デッキ」URLから来た保存済み履歴も壊さず、学習者には級内の10分野を見せる。
function FieldCard({ field, level, srs, onStudy, onQuiz }) {
  const progress = summarizeSrsItems(field.wordIds, srs)
  return (
    <Card className="p-4" data-vocab-level-field={field.fieldId}>
      <div className="flex items-start gap-3">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl"
          style={{ backgroundColor: `${field.color}1f` }}
          aria-hidden="true"
        >
          {field.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display font-extrabold text-ink">{field.field}</h2>
            <Chip color={level.color}>{field.size.toLocaleString('ja-JP')}語</Chip>
          </div>
          <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">{field.description}</p>
        </div>
      </div>
      <LearningStatusBars progress={progress} className="mt-3" compact />
      <p className="mt-1.5 text-right text-[10px] font-bold text-ink/45">1回10語</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="primary" onClick={onStudy}>
          <Book size={15} /> 学習する
        </Button>
        <Button variant="secondary" onClick={onQuiz}>
          <Cards size={15} /> テストする
        </Button>
      </div>
    </Card>
  )
}

export function VocabDecksScreen() {
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  const params = useStore((state) => state.params)

  const levelId = params.levelId ?? '5'
  const level = getLevel(levelId)
  const toc = LEARNING_FIELD_TOC.find((item) => item.level.id === levelId)

  const open = (field, quiz = false) => navigate(quiz ? 'vocabQuiz' : 'vocabStudy', {
    source: { type: 'levelField', levelId, field: field.fieldId },
    title: `英検${level.label}・${field.field}`,
    ...(quiz ? {} : { mode: 'study' }),
    returnTo: { screen: 'vocabDecks', params: { levelId } },
  })

  return (
    <div className="pb-6" data-vocab-level-fields>
      <ScreenHeader
        title={`英検${level.label}・10分野`}
        subtitle={toc ? `${toc.size.toLocaleString('ja-JP')}語を分野別に10語ずつ学習` : undefined}
      />
      <div className="space-y-3 px-4">
        {!toc && <p className="text-sm font-bold text-ink/50">この級の単語はまだありません。</p>}
        {toc?.chapters.map((field) => (
          <FieldCard
            key={field.fieldId}
            field={field}
            level={level}
            srs={srs}
            onStudy={() => open(field)}
            onQuiz={() => open(field, true)}
          />
        ))}
      </div>
    </div>
  )
}
