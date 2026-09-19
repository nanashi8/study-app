import { useScreenParam, useStore } from '../store/useStore.js'
import { LEVELS, getLevel } from '../data/levels.js'
import {
  GRAMMAR_PRACTICE,
  grammarPracticeByLevel,
  grammarPracticeByTopic,
} from '../data/grammar.js'
import {
  GRAMMAR_QUESTION_TYPE_META,
  GRAMMAR_QUESTION_TYPES,
} from '../data/grammar-format-expansion.js'
import {
  grammarReferenceByLevel,
  nextGrammarReferenceUnit,
} from '../data/grammar-reference/index.js'
import { GRAMMAR_STRANDS } from '../data/grammar-strands.js'
import { todayIndex } from '../store/useStore.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Chip, cx } from '../components/ui.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { StudyHistory } from '../components/GrammarStudyRecord.jsx'
import {
  ChooserTile,
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  TodayRow,
  WordBookTile,
} from '../components/ContentTop.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { contentReviewSummary } from '../lib/contentReview.js'
import {
  GRAMMAR_REFERENCE_RESULTS,
  grammarReferenceHistory,
  grammarReferenceStatusCounts,
} from '../lib/grammarReferenceLog.js'
import { BookOpen, Check, Target } from '../components/Icons.jsx'

// 出題のある級だけタブに出す。
const ACTIVE_LEVELS = LEVELS.filter((l) => grammarPracticeByLevel(l.id).length > 0)
// 級・テストの問題の種類は params に置き、参考書やテストから戻ったときも同じ所から続ける。
const readLevel = (value) => (
  ACTIVE_LEVELS.some((l) => l.id === value) ? value : ACTIVE_LEVELS[0]?.id ?? '5'
)
const readQuestionType = (value) => (value && GRAMMAR_QUESTION_TYPE_META[value] ? value : 'mixed')
const QUESTION_UNITS = { learning: '問', quiz: '問' }
const LEVEL_UNITS = { learning: '単元', quiz: '問' }
// 目次の各単元に並べる学習日の数（それより前は「ほかN回」）。
const HISTORY_SHOWN = 4

/** テストの問題の種類。級のテストと、目次の各単元のテストの両方に使う。 */
function QuestionTypePicker({ level, value, onChange }) {
  return (
    <section className="mt-3" data-grammar-question-type-selector>
      <h3 className="mb-1.5 px-1 text-xs font-extrabold text-ink/60">テストの問題の種類</h3>
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-brand-50 p-1" role="group" aria-label="テストの問題の種類">
        {['mixed', ...GRAMMAR_QUESTION_TYPES].map((type) => {
          const typeMeta = GRAMMAR_QUESTION_TYPE_META[type]
          const count = grammarPracticeByLevel(level, type).length
          const on = value === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              aria-pressed={on}
              aria-label={`${typeMeta.label}・${count}問`}
              className={cx(
                'min-h-11 rounded-lg px-1 py-1.5 text-center transition-colors',
                on ? 'bg-white text-brand-700 shadow-sm' : 'text-ink/55 active:bg-white/70',
              )}
              data-grammar-question-type={type}
            >
              <span className="block text-xs font-extrabold">{typeMeta.short}</span>
              <span className="block text-[10px] font-bold opacity-60">{count}問</span>
            </button>
          )
        })}
      </div>
      <p className="mt-1 px-1 text-[11px] font-bold text-ink/45">{GRAMMAR_QUESTION_TYPE_META[value].description}</p>
    </section>
  )
}

/**
 * 級の目次。級全体と単元ごとに、「学習」（参考書を読む）と「テスト」（問題を解く）の入口を別々に置く。
 * テストは参考書を読まずに始めてもよい。学習は、読み終えて押した「理解した／まだまだ」と学習日を履歴に出す。
 */
function LevelContents({ level, questionType, srs, log, onRead, onTestLevel, onTestUnit }) {
  const meta = getLevel(level)
  const typeMeta = GRAMMAR_QUESTION_TYPE_META[questionType]
  const units = grammarReferenceByLevel(level)
  const referenceCounts = grammarReferenceStatusCounts(log, units.map((unit) => unit.id))
  const studiedCount = units.length - referenceCounts.unstudied
  // 級の「学習」は、まだ学習していない最初の単元、なければ「まだまだ」の最初の単元から。
  const nextToRead = units.find((unit) => !log?.[unit.id]?.length)
    ?? units.find((unit) => log?.[unit.id]?.at(-1)?.result === 'notYet')
    ?? units[0]
  const levelItems = grammarPracticeByLevel(level, questionType)
  return (
    <>
      <LearningEntryCard
        className="mt-4"
        data-grammar-level={level}
        emoji={meta.emoji}
        accentColor={meta.color}
        title={`英検${meta.label}の文法`}
        subtitle={`${meta.sub}・全${units.length}単元`}
        status={{ learning: referenceCounts, quiz: summarizeSrsItems(levelItems, srs).quiz }}
        learningStatusKind="reference"
        units={LEVEL_UNITS}
        studyLabel="学習"
        studyIcon={<BookOpen size={16} />}
        studyAriaLabel={`英検${meta.label}の文法を${studiedCount === 0 ? 'はじめから' : '続きから'}学習`}
        studyDisabled={!nextToRead}
        onStudy={() => nextToRead && onRead(nextToRead.id)}
        quizAriaLabel={`英検${meta.label}の文法を${typeMeta.label}でテスト（${levelItems.length}問）`}
        quizDisabled={!levelItems.length}
        onQuiz={onTestLevel}
      />

      <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">目次</h2>
      <ol className="space-y-3" data-grammar-contents={level}>
        {units.map((unit, index) => {
          const history = grammarReferenceHistory(log, unit.id)
          const latest = history[0] ? GRAMMAR_REFERENCE_RESULTS[history[0].result] : null
          const items = grammarPracticeByTopic(level, unit.topic, questionType)
          return (
            <li key={unit.id} data-return-row={unit.id}>
              <LearningEntryCard
                data-grammar-unit={unit.id}
                icon={history[0]?.result === 'understood'
                  ? <Check size={20} />
                  : <span className="font-display text-base font-black">{index + 1}</span>}
                accentColor={meta.color}
                title={unit.topic}
                chip={latest ? <Chip color={latest.color}>{latest.label}</Chip> : null}
                subtitle={(
                  <>
                    <span className="line-clamp-2">{unit.lead}</span>
                    <StudyHistory history={history} limit={HISTORY_SHOWN} className="mt-1.5" data-grammar-study-history={unit.id} />
                  </>
                )}
                status={items.length ? summarizeSrsItems(items, srs) : null}
                showLearningStatus={false}
                units={QUESTION_UNITS}
                note={items.length ? undefined : `${typeMeta.short}の問題はありません`}
                studyLabel="学習"
                studyIcon={<BookOpen size={16} />}
                studyAriaLabel={`「${unit.topic}」を学習`}
                onStudy={() => onRead(unit.id)}
                quizAriaLabel={`「${unit.topic}」を${typeMeta.label}でテスト（${items.length}問）`}
                quizDisabled={!items.length}
                onQuiz={() => onTestUnit(unit.topic)}
              />
            </li>
          )
        })}
      </ol>
    </>
  )
}

export function GrammarScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const grammarReferenceLog = useStore((s) => s.grammarReferenceLog)
  const [level, setLevel] = useScreenParam('level', readLevel)
  const [questionType, setQuestionType] = useScreenParam('questionType', readQuestionType)

  const meta = getLevel(level)
  const review = contentReviewSummary(GRAMMAR_PRACTICE, srs, todayIndex())
  const questionTypeMeta = GRAMMAR_QUESTION_TYPE_META[questionType]
  const returnTo = { screen: 'grammar', params: { level, questionType } }
  const nextUnit = nextGrammarReferenceUnit(grammarReferenceLog)

  const openUnit = (unitId) => navigate('grammarReference', { unitId })
  const quizLevel = () =>
    navigate('grammarQuiz', { source: { type: 'grammar', level, questionType }, title: `${meta.label} ${questionTypeMeta.label}`, levelColor: meta.color, returnTo })
  const quizTopic = (topic) =>
    navigate('grammarQuiz', { source: { type: 'grammar', level, topic, questionType }, title: `${topic}・${questionTypeMeta.short}`, levelColor: meta.color, returnTo })
  // 今日の復習があれば復習どきの問題を、なければ解いた問題を復習日が近い順に出す。
  const startReview = () => (review.state === 'due'
    ? navigate('grammarQuiz', {
        source: { type: 'grammarDue', questionType: 'mixed' },
        title: '文法の復習',
        levelColor: '#f59e0b',
        returnTo,
      })
    : navigate('grammarQuiz', {
        source: { type: 'grammarList', ids: review.studiedItems.map((item) => item.id) },
        title: '文法・復習日より前に練習',
        levelColor: '#f59e0b',
        returnTo,
      }))

  return (
    <div className="pb-6">
      <ScreenHeader title="文法" subtitle="単元ごとに、参考書で学習するか、すぐテストするかを選ぶ" />

      <div className="px-4">
        <div className="mb-5 space-y-3 pt-3">
          {/* 今日の学習：続きの単元と、テストの復習を1枚にまとめる。 */}
          <TodayCard data-grammar-today>
            {nextUnit && (
              <TodayRow
                onClick={() => openUnit(nextUnit.id)}
                aria-label={`続きを読む。英検${getLevel(nextUnit.level).label}「${nextUnit.topic}」`}
                data-grammar-continue={nextUnit.id}
                icon={<BookOpen size={20} />}
                iconClassName="bg-brand-100 text-brand-600"
                title="続きを読む"
                detail={`英検${getLevel(nextUnit.level).label}「${nextUnit.topic}」`}
              />
            )}
            <ReviewTodayRow
              state={review.state}
              due={review.dueItems.length}
              nextInDays={review.nextInDays}
              unit="問"
              onStart={startReview}
            />
          </TodayCard>

          {/* 級のほかの選び方：級をまたいだ単元・単語帳 */}
          <ChooserTiles data-grammar-choosers>
            <ChooserTile
              onClick={() => navigate('grammarStrands')}
              data-grammar-strands-entry
              aria-label={`級をまたいで学ぶ。比較・仮定法など${GRAMMAR_STRANDS.length}系統を、学習とテストで`}
              icon={<Target size={19} />}
              iconClassName="bg-violet-100 text-violet-600"
              label="級をまたいで"
            >
              {GRAMMAR_STRANDS.length}系統
            </ChooserTile>
            <WordBookTile domain="grammar" returnTo={returnTo} />
          </ChooserTiles>
        </div>

        <h2 className="mb-2 px-1 font-display text-base font-extrabold text-ink/80">級から選ぶ</h2>

        {/* 級タブ */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ACTIVE_LEVELS.map((l) => {
            const on = level === l.id
            return (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={cx(
                  'flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold transition-all',
                  on ? 'text-white shadow-pop' : 'bg-white text-ink/55',
                )}
                style={on ? { background: l.color } : undefined}
              >
                <span>{l.emoji}</span> {l.label}
              </button>
            )
          })}
        </div>

        <QuestionTypePicker level={level} value={questionType} onChange={setQuestionType} />

        <LevelContents
          level={level}
          questionType={questionType}
          srs={srs}
          log={grammarReferenceLog}
          onRead={openUnit}
          onTestLevel={quizLevel}
          onTestUnit={quizTopic}
        />
      </div>
    </div>
  )
}
