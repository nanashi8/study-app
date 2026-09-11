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
import { Chip, IconButton, cx } from '../components/ui.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { WordBookStudySheet } from '../components/WordListSheet.jsx'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'
import { Refresh, Search, ChevronRight, Sparkles, Check, Link, Cards } from '../components/Icons.jsx'

// 「今日の学習」の1行。復習も、下の級を先に固める案内も同じ形で並べる。
function TodayRow({ icon, iconClassName = '', iconStyle, title, detail, detailClassName = 'text-ink/55', ...props }) {
  // 2文の案内は文の切れ目（。）で折り返し、「あ／と352語」のように語の途中で行を割らない。
  // 1文が1行に収まらない狭い画面では、対応するブラウザで文節の切れ目を選ぶ（auto-phrase）。
  const sentences = detail.split(/(?<=。)/)
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors active:bg-slate-50 disabled:cursor-default disabled:opacity-50"
      {...props}
    >
      <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', iconClassName)} style={iconStyle}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-extrabold text-ink">{title}</strong>
        <span className={cx('mt-0.5 block text-[11px] font-bold leading-snug [word-break:auto-phrase]', detailClassName)}>
          {sentences.map((sentence, index) => <span key={index} className="inline-block">{sentence}</span>)}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-ink/25" />
    </button>
  )
}

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

// 英検級のほかの選び方。3つを同じ大きさ・同じ形でそろえ、下の数だけが中身を表す。
function ChooserTile({ icon, iconClassName, label, children, ...props }) {
  return (
    <button
      type="button"
      className="flex min-w-0 flex-col items-center rounded-2xl border border-slate-200/70 bg-white px-1 pb-2.5 pt-3 text-center shadow-card transition-colors active:bg-brand-50"
      {...props}
    >
      <span className={cx('grid h-9 w-9 place-items-center rounded-xl', iconClassName)}>{icon}</span>
      <span className="mt-1.5 text-sm font-extrabold text-ink">{label}</span>
      <span className="text-[11px] font-bold text-ink/50">{children}</span>
    </button>
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
  const reviewState = reviewActionState(prog)
  const reviewComplete = reviewState === 'complete'
  const canReview = prog.seen > 0
  const nextReviewInDays = nextVocabularyReviewInDays(srs)
  const reviewLabel = reviewState === 'due'
    ? '今日の復習'
    : reviewComplete
      ? '復習日より前に練習'
      : '復習'
  const reviewTiming = reviewState === 'due'
    ? `${prog.due}語を今日復習`
    : reviewComplete
      ? nextReviewInDays === 1
        ? '次の復習日は明日'
        : Number.isFinite(nextReviewInDays)
          ? `次の復習日まであと${nextReviewInDays}日`
          : '学習済み語を確認'
      : '学習後に表示'

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
        <section
          aria-label="今日の学習"
          className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card"
          data-vocab-today
        >
          <TodayRow
            disabled={!canReview}
            onClick={() => navigate('vocabStudy', {
              source: { type: reviewState === 'due' ? 'due' : 'review' },
              title: reviewState === 'due' ? '今日の復習' : '復習日より前に練習',
              mode: 'study',
              returnTo: { screen: 'vocabLevels' },
            })}
            aria-label={`${reviewLabel}。${reviewTiming}`}
            data-review-state={reviewState}
            icon={reviewComplete ? <Check size={20} /> : <Refresh size={20} />}
            iconClassName={reviewComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-hint/20 text-amber-600'}
            title={reviewLabel}
            detail={reviewTiming}
            detailClassName={reviewState === 'due' ? 'text-amber-700' : reviewComplete ? 'text-emerald-700' : 'text-ink/50'}
          />
          {weak && <WeakFoundationRow weak={weak} onStudy={(level) => study(level.id, level.label)} />}
        </section>

        {/* 英検級のほかの選び方：10分野・語源・単語帳 */}
        <div className="grid grid-cols-3 gap-2" data-vocab-choosers>
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
        </div>
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
