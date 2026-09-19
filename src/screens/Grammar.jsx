import { useScreenParam, useStore } from '../store/useStore.js'
import { LEVELS, getLevel } from '../data/levels.js'
import {
  GRAMMAR_PRACTICE,
  grammarPracticeByLevel,
  grammarPracticeByTopic,
  grammarPracticeTopicsForLevel,
} from '../data/grammar.js'
import {
  GRAMMAR_QUESTION_TYPE_META,
  GRAMMAR_QUESTION_TYPES,
} from '../data/grammar-format-expansion.js'
import {
  grammarReferenceByLevel,
  nextGrammarReferenceUnit,
  readGrammarReferenceIds,
} from '../data/grammar-reference/index.js'
import { GRAMMAR_STRANDS } from '../data/grammar-strands.js'
import { todayIndex } from '../store/useStore.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Button, Chip, ProgressBar, cx } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
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
import { readChoice } from '../lib/screenParams.js'
import { Cards, ArrowRight, BookOpen, Check, Target } from '../components/Icons.jsx'

// 次の復習日は3区分の学習状態とは別の予定として数える。
function dueProgressOf(items, srs) {
  let due = 0
  const day = todayIndex()
  for (const g of items) {
    if (srs[g.id]?.due <= day) due++
  }
  return { total: items.length, due }
}

// 出題のある級だけタブに出す。
const ACTIVE_LEVELS = LEVELS.filter((l) => grammarPracticeByLevel(l.id).length > 0)
// 入口（学習・テスト）・級・出題の種類は params に置き、参考書や単元から戻ったときも同じ所から続ける。
const readMode = readChoice(['learn', 'test'], 'learn')
const readLevel = (value) => (
  ACTIVE_LEVELS.some((l) => l.id === value) ? value : ACTIVE_LEVELS[0]?.id ?? '5'
)
const readQuestionType = (value) => (value && GRAMMAR_QUESTION_TYPE_META[value] ? value : 'mixed')

const ENTRANCES = [
  { id: 'learn', label: '学習', detail: '参考書で読む', Icon: BookOpen },
  { id: 'test', label: 'テスト', detail: '問題で確かめる', Icon: Cards },
]

/** 文法の2つの入口。学習（参考書）とテスト（問題）。 */
function EntranceTabs({ mode, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="文法の入口" data-grammar-entrances>
      {ENTRANCES.map(({ id, label, detail, Icon }) => {
        const on = mode === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(id)}
            className={cx(
              'flex min-h-16 items-center gap-2.5 rounded-2xl border-2 px-3 py-2.5 text-left transition-colors',
              on
                ? 'border-brand-500 bg-brand-500 text-white shadow-pop'
                : 'border-slate-200/70 bg-white text-ink active:bg-brand-50',
            )}
            data-grammar-entrance={id}
          >
            <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-xl', on ? 'bg-white/20' : 'bg-brand-100 text-brand-600')}>
              <Icon size={19} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-base font-extrabold">{label}</span>
              <span className={cx('block text-[11px] font-bold', on ? 'text-white/80' : 'text-ink/50')}>{detail}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** 学習の入口：級の目次。単元を押すと参考書のページを開く。 */
function LearnLevel({ level, readingsDone, onOpen, onTest }) {
  const meta = getLevel(level)
  const units = grammarReferenceByLevel(level)
  const read = readGrammarReferenceIds(readingsDone)
  const readCount = units.filter((unit) => read.has(unit.id)).length
  const firstUnread = units.find((unit) => !read.has(unit.id)) ?? units[0]
  const questionCount = grammarPracticeByLevel(level, 'mixed').length
  return (
    <>
      <Card className="mt-4 p-4" data-grammar-learn-level={level}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-display text-lg font-extrabold text-ink">{meta.emoji} 英検{meta.label}の文法</div>
            <div className="text-xs font-bold text-ink/50">{meta.sub}・全{units.length}単元</div>
          </div>
          <div className="shrink-0 text-right text-xs font-extrabold text-ink/55">
            {'読んだ '}
            <span className="text-base text-ink">{readCount}</span>
            {`/${units.length}`}
          </div>
        </div>
        <ProgressBar value={units.length ? readCount / units.length : 0} className="mt-3" color={meta.color} />
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => firstUnread && onOpen(firstUnread.id)} disabled={!firstUnread}>
            <BookOpen size={16} /> {readCount === 0 ? 'はじめから読む' : readCount === units.length ? 'もう一度読む' : '続きから読む'}
          </Button>
          <Button size="sm" variant="secondary" className="shrink-0" onClick={onTest} disabled={!questionCount} aria-label={`英検${meta.label}の文法をテスト`}>
            <Cards size={16} /> テスト
          </Button>
        </div>
      </Card>

      <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">目次</h2>
      <ol className="space-y-2">
        {units.map((unit, index) => {
          const done = read.has(unit.id)
          return (
            <li key={unit.id} data-return-row={unit.id}>
              <button
                type="button"
                onClick={() => onOpen(unit.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm transition-transform active:scale-[0.99] active:bg-brand-50"
                data-grammar-learn-unit={unit.id}
              >
                <span
                  className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black', done ? 'text-white' : 'bg-slate-100 text-ink/50')}
                  style={done ? { background: meta.color } : undefined}
                >
                  {done ? <Check size={15} /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-extrabold text-ink">{unit.topic}</span>
                  <span className="mt-0.5 line-clamp-2 text-xs font-bold leading-relaxed text-ink/50">{unit.lead}</span>
                </span>
                <span className="text-brand-400"><ArrowRight size={20} /></span>
              </button>
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
  const readingsDone = useStore((s) => s.readingsDone)
  const [mode, setMode] = useScreenParam('mode', readMode)
  const [level, setLevel] = useScreenParam('level', readLevel)
  const [questionType, setQuestionType] = useScreenParam('questionType', readQuestionType)

  const meta = getLevel(level)
  const topics = grammarPracticeTopicsForLevel(level, questionType)
  const levelItems = grammarPracticeByLevel(level, questionType)
  const lp = dueProgressOf(levelItems, srs)
  const levelStatus = summarizeSrsItems(levelItems, srs)
  const review = contentReviewSummary(GRAMMAR_PRACTICE, srs, todayIndex())
  const questionTypeMeta = GRAMMAR_QUESTION_TYPE_META[questionType]
  const returnTo = { screen: 'grammar', params: { mode, level, questionType } }
  const nextUnit = nextGrammarReferenceUnit(readingsDone)

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
      <ScreenHeader
        title="文法"
        subtitle={mode === 'learn' ? '参考書で読んでから、テストで確かめる' : '級と問題の種類を選んで、テストで確かめる'}
      />

      <div className="px-4">
        <div className="mb-5 space-y-3 pt-3">
          {/* 2つの入口：学習（参考書）とテスト（問題） */}
          <EntranceTabs mode={mode} onChange={setMode} />

          {/* 今日の学習：続きの単元と、テストの復習を1枚にまとめる。 */}
          <TodayCard data-grammar-today>
            {mode === 'learn' && nextUnit && (
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
              onClick={() => navigate('grammarStrands', { mode })}
              data-grammar-strands-entry
              aria-label={mode === 'learn'
                ? `級をまたいで読む。比較・仮定法など${GRAMMAR_STRANDS.length}系統を、下の級から順に読む`
                : `級をまたいでテスト。比較・仮定法など${GRAMMAR_STRANDS.length}系統を、成績に合わせた級で練習`}
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

        {mode === 'learn' ? (
          <LearnLevel
            level={level}
            readingsDone={readingsDone}
            onOpen={openUnit}
            onTest={() => navigate('grammarQuiz', {
              source: { type: 'grammar', level, questionType: 'mixed' },
              title: `${meta.label} ${GRAMMAR_QUESTION_TYPE_META.mixed.label}`,
              levelColor: meta.color,
              returnTo,
            })}
          />
        ) : (
          <>
            <section className="mt-4" data-grammar-question-type-selector>
              <div className="mb-2 px-1">
                <h2 className="font-display text-base font-extrabold text-ink/80">問題の種類を選ぶ</h2>
                <p className="text-[11px] font-bold text-ink/45">3種類を選ぶと、問題数に関係なく同じくらいずつ出ます</p>
              </div>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="文法問題の種類">
                {['mixed', ...GRAMMAR_QUESTION_TYPES].map((type) => {
                  const typeMeta = GRAMMAR_QUESTION_TYPE_META[type]
                  const count = grammarPracticeByLevel(level, type).length
                  const on = questionType === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuestionType(type)}
                      aria-pressed={on}
                      className={cx(
                        'min-h-16 rounded-2xl border-2 px-3 py-2.5 text-left transition-transform active:scale-[0.99]',
                        on
                          ? 'border-brand-400 bg-brand-50 text-brand-800'
                          : 'border-transparent bg-white text-ink',
                      )}
                      data-grammar-question-type={type}
                    >
                      <span className="block font-display text-sm font-extrabold">{typeMeta.label}</span>
                      <span className="mt-0.5 block text-[10px] font-bold opacity-55">{count}問・{typeMeta.description}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* 級まとめ */}
            <Card className="mt-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg font-extrabold text-ink">{meta.emoji} {meta.label} 文法</div>
                  <div className="text-xs font-bold text-ink/50">{meta.sub}・{questionTypeMeta.label} 全{lp.total}問・{topics.length}単元</div>
                </div>
                <div className="text-right text-xs font-bold text-ink/45">全{lp.total}問</div>
              </div>
              <LearningStatusBars progress={levelStatus} className="mt-3" compact units={{ learning: '問', quiz: '問' }} />
              <Button className="mt-3" full onClick={quizLevel}><Cards size={16} /> {questionTypeMeta.label}を始める</Button>
            </Card>

            {/* 単元一覧 */}
            <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">単元から選ぶ</h2>
            <div className="space-y-2">
              {topics.map((topic) => {
                const items = grammarPracticeByTopic(level, topic, questionType)
                const tp = dueProgressOf(items, srs)
                const topicStatus = summarizeSrsItems(items, srs)
                return (
                  <button
                    key={topic}
                    onClick={() => quizTopic(topic)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:bg-brand-50 active:scale-[0.99] transition-transform"
                    data-return-row={`test:${topic}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-ink">{topic}</span>
                        <Chip color={meta.color}>{tp.total}問</Chip>
                      </div>
                      <LearningStatusBars progress={topicStatus} className="mt-2" compact units={{ learning: '問', quiz: '問' }} />
                    </div>
                    <span className="text-brand-400"><ArrowRight size={20} /></span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
