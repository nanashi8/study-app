import { useMemo } from 'react'
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
  grammarReferenceFor,
  nextGrammarReferenceUnit,
} from '../data/grammar-reference/index.js'
import { GRAMMAR_STRANDS, getGrammarStrand, grammarStrandQuestions } from '../data/grammar-strands.js'
import { strandOverview } from '../lib/grammarStrand.js'
import { todayIndex } from '../store/useStore.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Chip, cx } from '../components/ui.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { StudyHistory } from '../components/GrammarStudyRecord.jsx'
import {
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
  strandReferencePageId,
} from '../lib/grammarReferenceLog.js'
import { BookOpen, Check } from '../components/Icons.jsx'

// 出題のある級だけタブに出す。
const ACTIVE_LEVELS = LEVELS.filter((l) => grammarPracticeByLevel(l.id).length > 0)
// 区分・タブ・テストの問題の種類は params に置き、参考書やテストから戻ったときも同じ所から続ける。
const DIVISIONS = Object.freeze([
  { id: 'level', label: '級別', note: '級ごとに、学ぶ順で単元を並べる' },
  { id: 'strand', label: '単元別', note: '同じ単元を、級をまたいで下から順に並べる' },
])
const readDivision = (value) => (DIVISIONS.some((d) => d.id === value) ? value : 'level')
const readLevel = (value) => (
  ACTIVE_LEVELS.some((l) => l.id === value) ? value : ACTIVE_LEVELS[0]?.id ?? '5'
)
const readStrand = (value) => (getGrammarStrand(value) ? value : GRAMMAR_STRANDS[0].id)
const readQuestionType = (value) => (value && GRAMMAR_QUESTION_TYPE_META[value] ? value : 'mixed')
const QUESTION_UNITS = { learning: '問', quiz: '問' }
const GROUP_UNITS = { learning: '単元', quiz: '問' }
// 目次の各単元に並べる学習日の数（それより前は「ほかN回」）。
const HISTORY_SHOWN = 4
const percent = (value) => `${Math.round(value * 100)}%`

/** 区分の切り替え。級別と単元別は、同じ並び・同じ部品で出す。 */
function DivisionSwitch({ value, onChange }) {
  return (
    <section className="mt-1" data-grammar-division-switch>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-brand-50 p-1" role="group" aria-label="文法の区分">
        {DIVISIONS.map((division) => {
          const on = value === division.id
          return (
            <button
              key={division.id}
              type="button"
              onClick={() => onChange(division.id)}
              aria-pressed={on}
              aria-label={`${division.label}で選ぶ`}
              className={cx(
                'min-h-11 rounded-xl px-2 py-1.5 font-display text-sm font-extrabold transition-colors',
                on ? 'bg-white text-brand-700 shadow-sm' : 'text-ink/55 active:bg-white/70',
              )}
              data-grammar-division={division.id}
            >
              {division.label}
            </button>
          )
        })}
      </div>
      <p className="mt-1 px-1 text-[11px] font-bold text-ink/45">
        {DIVISIONS.find((division) => division.id === value).note}
      </p>
    </section>
  )
}

/** 区分の中のタブ。級別は級、単元別は系統を横に並べる。 */
function DivisionTabs({ tabs, value, onChange, label }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={label} data-grammar-tabs>
      {tabs.map((tab) => {
        const on = value === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-pressed={on}
            aria-label={tab.ariaLabel ?? tab.label}
            className={cx(
              'flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold transition-all',
              on ? 'text-white shadow-pop' : 'bg-white text-ink/55',
            )}
            style={on ? { background: tab.color } : undefined}
            data-grammar-tab={tab.id}
          >
            <span>{tab.emoji}</span> {tab.label}
            {tab.alert && (
              <span
                className={cx('h-1.5 w-1.5 rounded-full', on ? 'bg-white' : 'bg-rose-500')}
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/** テストの問題の種類。どちらの区分でも同じ位置に置く。 */
function QuestionTypePicker({ counts, value, onChange }) {
  return (
    <section className="mt-3" data-grammar-question-type-selector>
      <h3 className="mb-1.5 px-1 text-xs font-extrabold text-ink/60">テストの問題の種類</h3>
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-brand-50 p-1" role="group" aria-label="テストの問題の種類">
        {['mixed', ...GRAMMAR_QUESTION_TYPES].map((type) => {
          const typeMeta = GRAMMAR_QUESTION_TYPE_META[type]
          const count = counts[type] ?? 0
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
 * 目次の1行。級別でも単元別でも、同じ部品で「学習」と「テスト」の2つの入口を置く。
 * 級別は単元名、単元別は「◯級の単元名」を見出しにする。
 */
function UnitRow({ unit, index, badge, accentColor, items, typeMeta, srs, log, onRead, onTest }) {
  const history = grammarReferenceHistory(log, unit.id)
  const latest = history[0] ? GRAMMAR_REFERENCE_RESULTS[history[0].result] : null
  return (
    <LearningEntryCard
      data-grammar-unit={unit.id}
      icon={history[0]?.result === 'understood'
        ? <Check size={20} />
        : <span className="font-display text-base font-black">{badge ?? index + 1}</span>}
      accentColor={accentColor}
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
      onQuiz={onTest}
    />
  )
}

/** 級別：級のまとめカードと、その級の目次。 */
function LevelDivision({ level, questionType, srs, log, onRead, onTestLevel, onTestUnit }) {
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
        units={GROUP_UNITS}
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
        {units.map((unit, index) => (
          <li key={unit.id} data-return-row={unit.id}>
            <UnitRow
              unit={unit}
              index={index}
              accentColor={meta.color}
              items={grammarPracticeByTopic(level, unit.topic, questionType)}
              typeMeta={typeMeta}
              srs={srs}
              log={log}
              onRead={onRead}
              onTest={() => onTestUnit(unit.topic)}
            />
          </li>
        ))}
      </ol>
    </>
  )
}

/** 単元別：系統のまとめカード（現在地つき）と、級ごとの目次。 */
function StrandDivision({ overview, questionType, srs, log, onRead, onLearnStrand, onTestStrand, onTestUnit }) {
  const { strand, stats, currentLevel, weakest, untouched, accuracy } = overview
  const typeMeta = GRAMMAR_QUESTION_TYPE_META[questionType]
  const currentMeta = getLevel(currentLevel)
  const units = strand.topics.map(([level, topic]) => grammarReferenceFor(level, topic)).filter(Boolean)
  const referenceCounts = grammarReferenceStatusCounts(log, units.map((unit) => unit.id))
  const pageId = strandReferencePageId(strand.id)
  const history = grammarReferenceHistory(log, pageId)
  const latest = history[0] ? GRAMMAR_REFERENCE_RESULTS[history[0].result] : null
  const strandItems = grammarStrandQuestions(strand, null, questionType)
  return (
    <>
      <LearningEntryCard
        className="mt-4"
        data-grammar-strand={strand.id}
        emoji={strand.emoji}
        accentColor={currentMeta.color}
        title={strand.name}
        chip={latest ? <Chip color={latest.color}>{latest.label}</Chip> : null}
        subtitle={(
          <>
            <span className="line-clamp-2">{strand.summary}</span>
            <StudyHistory history={history} limit={HISTORY_SHOWN} className="mt-1.5" data-grammar-study-history={strand.id} />
          </>
        )}
        status={{ learning: referenceCounts, quiz: summarizeSrsItems(strandItems, srs).quiz }}
        learningStatusKind="reference"
        units={GROUP_UNITS}
        studyLabel="学習"
        studyIcon={<BookOpen size={16} />}
        studyAriaLabel={`${strand.name}を下の級から学習`}
        onStudy={onLearnStrand}
        quizAriaLabel={`${strand.name}を${currentMeta.label}・${typeMeta.label}でテスト`}
        quizDisabled={!strandItems.length}
        onQuiz={onTestStrand}
      >
        {/* 級ごとの正答率と、次にどの級を出すか。成績で現在地が動く。 */}
        <div className="mt-3 rounded-xl bg-brand-50/70 p-2.5" data-grammar-strand-position={strand.id}>
          <div className="flex gap-1">
            {stats.map((stat) => {
              const meta = getLevel(stat.level)
              const isCurrent = stat.level === currentLevel
              const color = stat.answered === 0
                ? '#cbd5e1'
                : stat.mastered ? '#059669' : stat.weak ? '#e11d48' : '#f59e0b'
              return (
                <div key={stat.level} className="flex-1">
                  <div className={cx('h-4 text-center text-[9px] font-extrabold leading-4', isCurrent ? 'text-ink' : 'text-ink/45')}>
                    {meta.label}
                  </div>
                  <div className={cx('relative h-9 overflow-hidden rounded-md bg-slate-100', isCurrent && 'ring-2 ring-brand-400')}>
                    {stat.answered > 0 && (
                      <div className="absolute inset-x-0 bottom-0" style={{ height: percent(stat.accuracy), background: color }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cx(
                        'rounded px-1 text-[10px] font-extrabold leading-tight',
                        stat.answered === 0 ? 'text-ink/30' : 'bg-white/85 text-ink',
                      )}
                      >
                        {stat.answered ? percent(stat.accuracy) : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-4 text-center text-[9px] font-extrabold leading-4 text-brand-500">
                    {isCurrent ? '現在地' : ''}
                  </div>
                </div>
              )
            })}
          </div>
          {/* 苦手な級と、これから出す級が食い違うことがある（直近で正解が続いて先へ進んだ場合）。
              「◯級が苦手。△級から出題」と並べると矛盾して読めるため、理由まで書き分ける。 */}
          <div className="mt-2 text-[11px] font-bold text-ink/65">
            {untouched ? (
              <>まだ解いていません。<b className="text-ink">{currentMeta.label}</b>から始めます。</>
            ) : weakest && weakest.level === currentLevel ? (
              <>正答率が低い<b className="text-rose-700">{currentMeta.label}（{percent(weakest.accuracy)}）</b>を練習します。</>
            ) : weakest ? (
              <>
                <b className="text-rose-700">{getLevel(weakest.level).label}（{percent(weakest.accuracy)}）</b>
                に苦手が残っていますが、最近の成績にあわせて
                <b className="text-ink">{currentMeta.label}</b>を練習します。
              </>
            ) : (
              <>これまでの正答率は<b className="text-ink">{accuracy == null ? '—' : percent(accuracy)}</b>。<b className="text-ink">{currentMeta.label}</b>を練習します。</>
            )}
          </div>
        </div>
      </LearningEntryCard>

      <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">目次</h2>
      <ol className="space-y-3" data-grammar-contents={strand.id}>
        {units.map((unit, index) => {
          const meta = getLevel(unit.level)
          return (
            <li key={unit.id} data-return-row={unit.id}>
              <UnitRow
                unit={unit}
                index={index}
                badge={meta.label}
                accentColor={meta.color}
                items={grammarPracticeByTopic(unit.level, unit.topic, questionType)}
                typeMeta={typeMeta}
                srs={srs}
                log={log}
                onRead={onRead}
                onTest={() => onTestUnit(unit)}
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
  const grammarStrandPos = useStore((s) => s.grammarStrandPos)
  const setGrammarStrandPos = useStore((s) => s.setGrammarStrandPos)
  const [division, setDivision] = useScreenParam('view', readDivision)
  const [level, setLevel] = useScreenParam('level', readLevel)
  const [strandId, setStrandId] = useScreenParam('strand', readStrand)
  const [questionType, setQuestionType] = useScreenParam('questionType', readQuestionType)

  const meta = getLevel(level)
  const review = contentReviewSummary(GRAMMAR_PRACTICE, srs, todayIndex())
  const questionTypeMeta = GRAMMAR_QUESTION_TYPE_META[questionType]
  const returnTo = { screen: 'grammar', params: { view: division, level, strand: strandId, questionType } }
  const nextUnit = nextGrammarReferenceUnit(grammarReferenceLog)

  const overviews = useMemo(
    () => GRAMMAR_STRANDS.map((strand) => strandOverview(strand, srs, grammarStrandPos?.[strand.id])),
    [srs, grammarStrandPos],
  )
  const overview = overviews.find((item) => item.strand.id === strandId) ?? overviews[0]

  const levelTabs = ACTIVE_LEVELS.map((l) => ({
    id: l.id,
    label: l.label,
    emoji: l.emoji,
    color: l.color,
    ariaLabel: `英検${l.label}の文法`,
  }))
  const strandTabs = overviews.map((item) => ({
    id: item.strand.id,
    label: item.strand.name,
    emoji: item.strand.emoji,
    color: getLevel(item.currentLevel).color,
    alert: Boolean(item.weakest),
    ariaLabel: `${item.strand.name}${item.weakest ? '（苦手が残っています）' : ''}`,
  }))

  const typeCounts = Object.fromEntries(['mixed', ...GRAMMAR_QUESTION_TYPES].map((type) => [
    type,
    division === 'level'
      ? grammarPracticeByLevel(level, type).length
      : grammarStrandQuestions(overview.strand, null, type).length,
  ]))

  const openUnit = (unitId) => navigate('grammarReference', { unitId })
  const quizLevel = () =>
    navigate('grammarQuiz', { source: { type: 'grammar', level, questionType }, title: `${meta.label} ${questionTypeMeta.label}`, levelColor: meta.color, returnTo })
  const quizTopic = (topic, topicLevel = level) => {
    const topicMeta = getLevel(topicLevel)
    navigate('grammarQuiz', {
      source: { type: 'grammar', level: topicLevel, topic, questionType },
      title: `${topic}・${questionTypeMeta.short}`,
      levelColor: topicMeta.color,
      returnTo,
    })
  }
  // 単元別の行は、押した級をその系統の現在地として残す（次のテストもそこから出す）。
  const quizStrandUnit = (unit) => {
    const index = overview.levels.indexOf(unit.level)
    if (index >= 0) setGrammarStrandPos(overview.strand.id, index)
    quizTopic(unit.topic, unit.level)
  }
  const quizStrand = () => {
    const target = overview.currentLevel
    const targetMeta = getLevel(target)
    navigate('grammarQuiz', {
      source: { type: 'grammarStrand', strandId: overview.strand.id, level: target, questionType },
      title: `${overview.strand.name}・${targetMeta.label}`,
      levelColor: targetMeta.color,
      returnTo,
    })
  }
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
      <ScreenHeader title="文法" subtitle="級別・単元別を切り替えて、参考書で学習するか、すぐテストするかを選ぶ" />

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

          {/* 単語帳：級・系統をまたいで自分で集めた問題 */}
          <ChooserTiles data-grammar-choosers>
            <WordBookTile domain="grammar" returnTo={returnTo} />
          </ChooserTiles>
        </div>

        <h2 className="mb-2 px-1 font-display text-base font-extrabold text-ink/80">選び方</h2>
        <DivisionSwitch value={division} onChange={setDivision} />

        <div className="mt-3">
          {division === 'level' ? (
            <DivisionTabs tabs={levelTabs} value={level} onChange={setLevel} label="級" />
          ) : (
            <DivisionTabs tabs={strandTabs} value={strandId} onChange={setStrandId} label="単元（系統）" />
          )}
        </div>

        <QuestionTypePicker counts={typeCounts} value={questionType} onChange={setQuestionType} />

        {division === 'level' ? (
          <LevelDivision
            level={level}
            questionType={questionType}
            srs={srs}
            log={grammarReferenceLog}
            onRead={openUnit}
            onTestLevel={quizLevel}
            onTestUnit={quizTopic}
          />
        ) : (
          <StrandDivision
            overview={overview}
            questionType={questionType}
            srs={srs}
            log={grammarReferenceLog}
            onRead={openUnit}
            onLearnStrand={() => navigate('grammarStrandReference', { strandId: overview.strand.id })}
            onTestStrand={quizStrand}
            onTestUnit={quizStrandUnit}
          />
        )}
      </div>
    </div>
  )
}
