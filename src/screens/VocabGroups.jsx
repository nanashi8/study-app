import { useStore } from '../store/useStore.js'
import {
  ALL_WORDS,
  VOCAB_FIELD_GROUPS,
  wordsByField,
} from '../data/vocab.js'
import { wordProgress } from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Refresh } from '../components/Icons.jsx'
import { Chip } from '../components/ui.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'

function FieldCard({ field, words, srs, onStudy, onQuiz, onCatalog }) {
  const progress = wordProgress(words, srs)
  const status = summarizeVocabularySrsItems(words, srs)
  return (
    <LearningEntryCard
      data-vocab-field={field.id}
      emoji={field.emoji}
      accentColor={field.color}
      title={field.label}
      chip={<Chip color={field.color}>{progress.total.toLocaleString('ja-JP')}語</Chip>}
      subtitle={field.description}
      status={status}
      units={{ learning: '語', quiz: '問' }}
      note={progress.due > 0
        ? `復習が必要 ${progress.due}語`
        : progress.ready > 0
          ? `次に学ぶ ${progress.ready}語・1回10語`
          : '次の復習日まで待つ'}
      noteTone={progress.due > 0 ? 'alert' : 'muted'}
      studyLabel={progress.ready ? '暗記' : '次回待ち'}
      studyDisabled={!progress.ready}
      studyAriaLabel={progress.ready
        ? `${field.label}の復習または未学習 ${progress.ready}語を暗記`
        : `${field.label}は次の復習日まで待つ`}
      onStudy={onStudy}
      quizAriaLabel={`${field.label}の単語をテスト`}
      onQuiz={onQuiz}
      catalogLabel="一覧を確認"
      catalogAriaLabel={`${field.label}の単語を一覧で確認する`}
      onCatalog={onCatalog}
    />
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
        {fields.map(({ field, words }) => (
          <FieldCard
            key={field.id}
            field={field}
            words={words}
            srs={srs}
            onStudy={() => start({ field })}
            onQuiz={() => start({ field, quiz: true })}
            onCatalog={() => navigate('vocabDecks', { field: field.id })}
          />
        ))}

        <div className="flex items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 text-xs font-bold leading-relaxed text-ink/50">
          <span className="mt-0.5 text-brand-500"><Refresh size={16} /></span>
          <p>
            分野ごとの「一覧を確認」から、学習とテストの記録をまとめて見直せます。
          </p>
        </div>
      </div>
    </div>
  )
}
