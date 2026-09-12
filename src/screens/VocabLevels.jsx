import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { LEVELS } from '../data/levels.js'
import { ALL_WORDS, ETYMOLOGY_SUMMARY, wordsByLevel } from '../data/vocab.js'
import {
  levelProgress,
  nextVocabularyReviewInDays,
  overallProgress,
  reviewActionState,
  weakFoundationLevel,
} from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Chip, IconButton } from '../components/ui.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { WordBookStudySheet } from '../components/WordListSheet.jsx'
import {
  ChooserTile,
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  TodayRow,
} from '../components/ContentTop.jsx'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'
import { Search, Sparkles, Link, Cards } from '../components/Icons.jsx'

// 下の級（前提）が弱点なら「先に固めよう」と案内する行。級カードと同じ絵文字・色で、どの級かを示す。
// 出す数は判定に使った数そのもの。学んだ分だけ数が動き、届けば案内が消える。
function WeakFoundationRow({ weak, onStudy }) {
  const { level, progress, remaining, reason } = weak
  return (
    <TodayRow
      onClick={() => onStudy(level)}
      data-vocab-weak-foundation={level.id}
      icon={<span aria-hidden="true" className="text-xl leading-none">{level.emoji}</span>}
      iconStyle={{ backgroundColor: `${level.color}1a` }}
      title={`英検${level.label}を先に固めよう`}
      detail={reason === 'due'
        ? `復習する語が${progress.due}語たまっています。まずこの級を固めましょう`
        : `${progress.total}語のうち${progress.learned}語を学習済みです。あと${remaining}語で上の級の土台になります`}
    />
  )
}

function LevelCard({ level, srs, onStudy, onQuiz, onFields, onCatalog }) {
  const p = levelProgress(level.id, srs)
  const status = summarizeVocabularySrsItems(wordsByLevel(level.id), srs)
  // 読み上げ名も同じ注記から作り、見えている案内と食い違わせない。
  const note = p.due > 0
    ? `復習が必要 ${p.due}語`
    : p.ready > 0
      ? `次に学ぶ ${p.ready}語`
      : '今日の分は完了・くり返し練習できます'
  return (
    <LearningEntryCard
      emoji={level.emoji}
      accentColor={level.color}
      title={`英検${level.label}`}
      chip={<Chip color={level.color}>{level.cefr}</Chip>}
      subtitle={level.sub}
      countLabel={`全${p.total}語`}
      status={status}
      units={{ learning: '語', quiz: '問' }}
      note={note}
      noteTone={p.due > 0 ? 'alert' : 'muted'}
      noteProps={{ 'data-vocab-study-ready': p.ready }}
      // 今日の候補を学び終えても暗記は止めない。次の復習日を待たずにくり返せる。
      studyDisabled={!p.total}
      studyAriaLabel={`英検${level.label}の単語を暗記。${note}`}
      onStudy={onStudy}
      quizDisabled={!p.total}
      quizAriaLabel={`英検${level.label}の単語テスト`}
      onQuiz={onQuiz}
      browseLabel="10分野で選ぶ"
      browseIcon={<Sparkles size={15} />}
      browseAriaLabel={`英検${level.label}の10分野を選ぶ`}
      browseDisabled={!p.total}
      onBrowse={onFields}
      catalogLabel="一覧を確認"
      catalogAriaLabel={`英検${level.label}の全語彙を一覧で確認する`}
      catalogDisabled={!p.total}
      catalogProps={{ 'data-vocab-catalog-entry': level.id }}
      onCatalog={onCatalog}
    />
  )
}

export function VocabLevelsScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const wordBookSets = useStore((s) => s.learningNotebook.sets)
  const [wordBookSheetOpen, setWordBookSheetOpen] = useState(false)
  // 単語帳の冊数（マイ単語もほかの単語帳と同じ1冊として数える）。
  const wordBookCount = wordBookSets.length
  const weak = weakFoundationLevel(srs)
  const prog = overallProgress(srs)
  // 復習の行は各コンテンツと同じ部品（ReviewTodayRow）。単語は覚え具合から数えた復習予定を渡す。
  const reviewState = reviewActionState(prog)
  const nextReviewInDays = nextVocabularyReviewInDays(srs)

  const study = (levelId, label) =>
    navigate('vocabStudy', { source: { type: 'level', levelId }, title: `英検${label}`, mode: 'study', returnTo: { screen: 'vocabLevels' } })
  const quiz = (levelId, label) =>
    navigate('vocabQuiz', { source: { type: 'level', levelId }, title: `英検${label}`, returnTo: { screen: 'vocabLevels' } })

  return (
    <div className="pb-6">
      <ScreenHeader
        title="単語"
        subtitle="英検級・10分野・語源・単語帳から選ぶ"
        right={
          <IconButton onClick={() => navigate('vocabSearch')} aria-label="英和辞書">
            <Search size={22} />
          </IconButton>
        }
      />
      <div className="space-y-3 px-4">
        {/* 今日の学習：復習と、下の級を先に固める案内を1枚にまとめる。 */}
        <TodayCard data-vocab-today>
          <ReviewTodayRow
            state={reviewState}
            due={prog.due}
            nextInDays={nextReviewInDays}
            unit="語"
            onStart={() => navigate('vocabStudy', {
              source: { type: reviewState === 'due' ? 'due' : 'review' },
              title: reviewState === 'due' ? '今日の復習' : '復習日より前に練習',
              mode: 'study',
              returnTo: { screen: 'vocabLevels' },
            })}
          />
          {weak && <WeakFoundationRow weak={weak} onStudy={(level) => study(level.id, level.label)} />}
        </TodayCard>

        {/* 英検級のほかの選び方：10分野・語源・単語帳 */}
        <ChooserTiles data-vocab-choosers>
          <ChooserTile
            onClick={() => navigate('vocabGroups')}
            data-vocab-ten-field-entry
            aria-label={`10分野から学ぶ。全${ALL_WORDS.length.toLocaleString('ja-JP')}語`}
            icon={<Sparkles size={19} />}
            iconClassName="bg-brand-100 text-brand-600"
            label="10分野"
          >
            全{ALL_WORDS.length.toLocaleString('ja-JP')}語
          </ChooserTile>
          <ChooserTile
            onClick={() => navigate('roots')}
            data-vocab-etymology-entry
            aria-label={`語源から関連英単語を暗記。語源カード全${ETYMOLOGY_SUMMARY.cards.toLocaleString('ja-JP')}枚`}
            icon={<Link size={18} />}
            iconClassName="bg-violet-100 text-violet-600"
            label="語源"
          >
            全{ETYMOLOGY_SUMMARY.cards.toLocaleString('ja-JP')}枚
          </ChooserTile>
          {/* 単語帳を選び、その冊で暗記・テストを始める。 */}
          <ChooserTile
            onClick={() => setWordBookSheetOpen(true)}
            aria-haspopup="dialog"
            data-vocab-word-books-shortcut
            aria-label={`単語帳を選んで学ぶ。${wordBookCount}冊`}
            icon={<Cards size={19} />}
            iconClassName="bg-sky-100 text-sky-600"
            label="単語帳"
          >
            {wordBookCount}冊
          </ChooserTile>
        </ChooserTiles>
        <WordBookStudySheet
          open={wordBookSheetOpen}
          onClose={() => setWordBookSheetOpen(false)}
          returnTo={{ screen: 'vocabLevels' }}
        />

        {LEVELS.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            srs={srs}
            onStudy={() => study(level.id, level.label)}
            onQuiz={() => quiz(level.id, level.label)}
            onFields={() => navigate('vocabDecks', { levelId: level.id, view: 'fields' })}
            onCatalog={() => navigate('vocabDecks', { levelId: level.id, view: 'list' })}
          />
        ))}
      </div>
    </div>
  )
}
