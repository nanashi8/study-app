import { useStore } from '../store/useStore.js'
import {
  ALL_WORDS,
  VOCAB_FIELD_GROUPS,
  wordsByField,
} from '../data/vocab.js'
import { wordProgress } from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Book, Cards, Refresh } from '../components/Icons.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'

function FieldCard({ field, words, srs, onStudy, onQuiz }) {
  const progress = wordProgress(words, srs)
  const status = summarizeSrsItems(words, srs)
  return (
    <Card className="p-4" data-vocab-field={field.id}>
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
            <h2 className="font-display font-extrabold text-ink">{field.label}</h2>
            <Chip color={field.color}>{progress.total.toLocaleString('ja-JP')}語</Chip>
          </div>
          <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">{field.description}</p>
        </div>
      </div>

      <LearningStatusBars progress={status} className="mt-3" compact units={{ learning: '語', quiz: '問' }} />
      <p className="mt-1.5 text-right text-[10px] font-bold text-ink/45">
        {progress.due > 0 ? `今日の復習 ${progress.due}語` : '1回10語'}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button onClick={onStudy} aria-label={`${field.label}の単語を学習する`}>
          <Book size={16} /> 学習する
        </Button>
        <Button
          variant="secondary"
          onClick={onQuiz}
          aria-label={`${field.label}の単語をテストする`}
        >
          <Cards size={16} /> テストする
        </Button>
      </div>
    </Card>
  )
}

export function VocabGroupsScreen() {
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  const fields = VOCAB_FIELD_GROUPS.map((field) => ({
    field,
    words: wordsByField(field.id),
  }))

  const start = ({ field, quiz = false }) => navigate(quiz ? 'vocabQuiz' : 'vocabStudy', {
    source: { type: 'field', field: field.id },
    title: `分野：${field.label}`,
    ...(quiz ? {} : { mode: 'study' }),
    returnTo: { screen: 'vocabGroups' },
  })

  return (
    <div className="pb-6" data-vocab-field-catalog>
      <ScreenHeader
        title="単語・10分野"
        subtitle={`${ALL_WORDS.length.toLocaleString('ja-JP')}語を10分野に整理`}
      />

      <div className="space-y-3 px-4">
        <div className="rounded-2xl bg-brand-100/70 px-4 py-3">
          <h1 className="font-display font-extrabold text-brand-800">10分野から選ぶ</h1>
          <p className="mt-1 text-xs font-bold leading-relaxed text-brand-800/65">
            細かな分類を学びやすい10分野にまとめました。各分野から、復習どきと未学習を優先して10語ずつ出します。
          </p>
        </div>

        {fields.map(({ field, words }) => (
          <FieldCard
            key={field.id}
            field={field}
            words={words}
            srs={srs}
            onStudy={() => start({ field })}
            onQuiz={() => start({ field, quiz: true })}
          />
        ))}

        <div className="flex items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 text-xs font-bold leading-relaxed text-ink/50">
          <span className="mt-0.5 text-brand-500"><Refresh size={16} /></span>
          <p>
            10分野の合計で全{ALL_WORDS.length.toLocaleString('ja-JP')}語を重複なく扱います。繰り返すと未学習語を優先し、分野の全語へ進みます。
          </p>
        </div>
      </div>
    </div>
  )
}
