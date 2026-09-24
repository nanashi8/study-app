import { useScreenParam, useStore } from '../store/useStore.js'
import {
  MATH_HISTORY_CHAPTERS,
  MATH_HISTORY_PARTS,
  MATH_HISTORY_QUIZ_DOMAIN,
  chapterNumber,
  chaptersByEra,
  chaptersForPart,
  mathHistoryThemeColor,
  questionsForChapters,
} from '../data/math-history.js'
import { readableMathAccent } from '../lib/mathVisualColors.js'
import { contentQuizKey, normalizeContentQuizResults, summarizeQuizItems } from '../lib/contentProgress.js'
import { STUDY_LOG_RESULTS, studyLogHistory, studyLogStatusCounts } from '../lib/studyLog.js'
import { nextMathStory } from '../lib/mathStoryLog.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Chip, cx } from '../components/ui.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { StudyHistory } from '../components/GrammarStudyRecord.jsx'
import { TodayCard, TodayRow } from '../components/ContentTop.jsx'
import { BookOpen, Check, Refresh } from '../components/Icons.jsx'

// 数学の歴史をたどるコースの目次。話ごとに「学習」（話を読んで図を動かす）と「テスト」の2つの入口を置く。
// 並びは「学ぶ順」（算数の基本 → 中学 → 高校）と「年代順」（紀元前 → 今）を切り替えられる。
const VIEWS = Object.freeze([
  { id: 'order', label: '学ぶ順', note: '数えることから、算数の基本 → 中学 → 高校の順に学び直す' },
  { id: 'era', label: '年代順', note: '発見・発明が生まれた順に、歴史をたどる' },
])
const readView = (value) => (VIEWS.some((view) => view.id === value) ? value : 'order')
const readPart = (value) => (MATH_HISTORY_PARTS.some((part) => part.id === value) ? value : MATH_HISTORY_PARTS[0].id)
const QUESTION_UNITS = { learning: '問', quiz: '問' }
const GROUP_UNITS = { learning: '話', quiz: '問' }
// 目次の各話に並べる学習日の数（それより前は「ほかN回」）。
const HISTORY_SHOWN = 4

function ViewSwitch({ value, onChange }) {
  return (
    <section className="mt-1" data-math-history-view-switch>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-brand-50 p-1" role="group" aria-label="目次の並べ方">
        {VIEWS.map((view) => {
          const on = value === view.id
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onChange(view.id)}
              aria-pressed={on}
              aria-label={`${view.label}に並べる`}
              className={cx(
                'min-h-11 rounded-xl px-2 py-1.5 font-display text-sm font-extrabold transition-colors',
                on ? 'bg-white text-brand-700 shadow-sm' : 'text-ink/55 active:bg-white/70',
              )}
              data-math-history-view={view.id}
            >
              {view.label}
            </button>
          )
        })}
      </div>
      <p className="mt-1 px-1 text-[11px] font-bold text-ink/45">
        {VIEWS.find((view) => view.id === value).note}
      </p>
    </section>
  )
}

function PartTabs({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="部" data-math-history-parts>
      {MATH_HISTORY_PARTS.map((part) => {
        const on = value === part.id
        return (
          <button
            key={part.id}
            type="button"
            onClick={() => onChange(part.id)}
            aria-pressed={on}
            className={cx(
              'flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold transition-all',
              on ? 'text-white shadow-pop' : 'bg-white text-ink/55',
            )}
            style={on ? { background: readableMathAccent(part.color) } : undefined}
            data-math-history-part={part.id}
          >
            <span>{part.emoji}</span> {part.title}
          </button>
        )
      })}
    </div>
  )
}

/** 目次の1行。学ぶ順でも年代順でも、同じ部品で「学習」と「テスト」の2つの入口を置く。 */
function ChapterRow({ chapter, log, quizResults, showYear, onRead, onTest }) {
  const history = studyLogHistory(log, chapter.id)
  const latest = history[0] ? STUDY_LOG_RESULTS[history[0].result] : null
  const accent = readableMathAccent(mathHistoryThemeColor(chapter.theme))
  const quiz = summarizeQuizItems({
    items: chapter.quiz,
    quizResults,
    quizDomain: MATH_HISTORY_QUIZ_DOMAIN,
  })
  return (
    <LearningEntryCard
      data-math-history-chapter={chapter.id}
      icon={history[0]?.result === 'understood'
        ? <Check size={20} />
        : <span className="font-display text-base font-black">{chapterNumber(chapter.id)}</span>}
      accentColor={accent}
      title={chapter.title}
      chip={latest ? <Chip color={latest.color}>{latest.label}</Chip> : null}
      subtitle={(
        <>
          <span className="block text-[11px] font-extrabold text-ink/55">
            {showYear ? `${chapter.era}・${chapter.place}` : `${chapter.emoji} ${chapter.era}・${chapter.place}`}
          </span>
          <span className="line-clamp-2">{chapter.headline}</span>
          <StudyHistory history={history} limit={HISTORY_SHOWN} className="mt-1.5" data-math-history-study-history={chapter.id} />
        </>
      )}
      status={{ quiz: quiz.counts }}
      showLearningStatus={false}
      units={QUESTION_UNITS}
      studyLabel="学習"
      studyIcon={<BookOpen size={16} />}
      studyAriaLabel={`「${chapter.title}」を学習`}
      onStudy={() => onRead(chapter.id)}
      quizAriaLabel={`「${chapter.title}」をテスト（${chapter.quiz.length}問）`}
      onQuiz={() => onTest([chapter.id], chapter.title)}
    />
  )
}

export function MathHistoryScreen() {
  const navigate = useStore((state) => state.navigate)
  const mathStoryLog = useStore((state) => state.mathStoryLog)
  const contentQuizResults = useStore((state) => state.contentQuizResults)
  const [view, setView] = useScreenParam('view', readView)
  const [partId, setPartId] = useScreenParam('part', readPart)
  const returnTo = { screen: 'mathHistory', params: { view, part: partId } }

  const openChapter = (chapterId) => navigate('mathStory', { chapterId })
  const startTest = (chapterIds, title) => navigate('mathStoryQuiz', { chapterIds, title, returnTo })

  const nextChapter = nextMathStory(MATH_HISTORY_CHAPTERS, mathStoryLog)
  const allQuestions = questionsForChapters(MATH_HISTORY_CHAPTERS.map((chapter) => chapter.id))
  const allQuiz = summarizeQuizItems({ items: allQuestions, quizResults: contentQuizResults, quizDomain: MATH_HISTORY_QUIZ_DOMAIN })
  const quizResults = normalizeContentQuizResults(contentQuizResults)
  const missedIds = allQuestions
    .filter((question) => quizResults[contentQuizKey(MATH_HISTORY_QUIZ_DOMAIN, question.id)]?.lastResult === 'wrong')
    .map((question) => question.chapterId)
  const missedChapterIds = [...new Set(missedIds)]

  const part = MATH_HISTORY_PARTS.find((item) => item.id === partId)
  const partChapters = chaptersForPart(partId)
  const partCounts = studyLogStatusCounts(mathStoryLog, partChapters.map((chapter) => chapter.id))
  const partQuestions = questionsForChapters(partChapters.map((chapter) => chapter.id))
  const partQuiz = summarizeQuizItems({ items: partQuestions, quizResults: contentQuizResults, quizDomain: MATH_HISTORY_QUIZ_DOMAIN })
  // 部の「学習」は、まだ学習していない最初の話、なければ「まだまだ」の最初の話から。
  const partNext = partChapters.find((chapter) => !mathStoryLog?.[chapter.id]?.length)
    ?? partChapters.find((chapter) => mathStoryLog?.[chapter.id]?.at(-1)?.result === 'notYet')
    ?? partChapters[0]

  return (
    <div className="pb-6">
      <ScreenHeader title="数学の歴史をたどる" subtitle="発見の話を読み、図を動かして、数えることから学び直す" />

      <div className="px-4">
        <div className="mb-5 space-y-3 pt-3">
          {/* 今日の学習：続きの話と、間違えた問題のやり直しを1枚にまとめる。 */}
          <TodayCard data-math-history-today>
            {nextChapter && (
              <TodayRow
                onClick={() => openChapter(nextChapter.id)}
                aria-label={`続きを読む。${chapterNumber(nextChapter.id)}話「${nextChapter.title}」`}
                data-math-history-continue={nextChapter.id}
                icon={<BookOpen size={20} />}
                iconClassName="bg-brand-100 text-brand-600"
                title="続きを読む"
                detail={`${chapterNumber(nextChapter.id)}話「${nextChapter.title}」`}
              />
            )}
            <TodayRow
              disabled={!missedChapterIds.length}
              onClick={() => startTest(missedChapterIds, '間違えた問題の話')}
              aria-label={missedChapterIds.length
                ? `間違えた問題をやり直す。${missedIds.length}問`
                : '間違えた問題をやり直す。まだありません'}
              data-math-history-retry
              icon={<Refresh size={20} />}
              iconClassName="bg-hint/20 text-amber-600"
              title="間違えた問題をやり直す"
              detail={missedChapterIds.length
                ? `${missedIds.length}問（${missedChapterIds.length}話）`
                : `テストで間違えた問題がここに出ます。全${allQuiz.total}問`}
            />
          </TodayCard>
        </div>

        <h2 className="mb-2 px-1 font-display text-base font-extrabold text-ink/80">並べ方</h2>
        <ViewSwitch value={view} onChange={setView} />

        {view === 'order' ? (
          <>
            <div className="mt-3">
              <PartTabs value={partId} onChange={setPartId} />
            </div>
            <LearningEntryCard
              className="mt-4"
              data-math-history-part-card={partId}
              emoji={part.emoji}
              accentColor={readableMathAccent(part.color)}
              title={part.title}
              subtitle={`${part.summary}・全${partChapters.length}話`}
              status={{ learning: partCounts, quiz: partQuiz.counts }}
              learningStatusKind="reference"
              units={GROUP_UNITS}
              studyLabel="学習"
              studyIcon={<BookOpen size={16} />}
              studyAriaLabel={`${part.title}を${partCounts.unstudied === partChapters.length ? 'はじめから' : '続きから'}学習`}
              studyDisabled={!partNext}
              onStudy={() => partNext && openChapter(partNext.id)}
              quizAriaLabel={`${part.title}をテスト（${partQuestions.length}問）`}
              quizDisabled={!partQuestions.length}
              onQuiz={() => startTest(partChapters.map((chapter) => chapter.id), part.title)}
            />

            <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">目次</h2>
            <ol className="space-y-3" data-math-history-contents={partId}>
              {partChapters.map((chapter) => (
                <li key={chapter.id} data-return-row={chapter.id}>
                  <ChapterRow
                    chapter={chapter}
                    log={mathStoryLog}
                    quizResults={contentQuizResults}
                    onRead={openChapter}
                    onTest={startTest}
                  />
                </li>
              ))}
            </ol>
          </>
        ) : (
          <div className="mt-4 space-y-6" data-math-history-timeline>
            {chaptersByEra().map(({ era, chapters }) => (
              <section key={era.id} data-math-history-era={era.id}>
                <div className="mb-2 px-1">
                  <h2 className="font-display text-base font-extrabold text-ink/80">{era.title}</h2>
                  <p className="text-[11px] font-bold text-ink/45">{era.note}</p>
                </div>
                <ol className="space-y-3">
                  {chapters.map((chapter) => (
                    <li key={chapter.id} data-return-row={chapter.id}>
                      <ChapterRow
                        chapter={chapter}
                        log={mathStoryLog}
                        quizResults={contentQuizResults}
                        showYear
                        onRead={openChapter}
                        onTest={startTest}
                      />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
