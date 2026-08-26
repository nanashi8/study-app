import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getWord, wordsByLevel } from '../data/vocab.js'
import { LEARNING_FIELD_TOC } from '../data/decks.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { Card, Button, Chip, cx } from '../components/ui.jsx'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'
import { wordProgress } from '../lib/session.js'
import {
  VOCAB_CATALOG_ACTIVITY_OPTIONS,
  VOCAB_CATALOG_DEFAULT_DIRECTIONS,
  VOCAB_CATALOG_SORT_OPTIONS,
  vocabularyCatalogActivityRows,
  vocabularyCatalogResultForDirection,
  vocabularyCatalogResultMatches,
} from '../lib/vocabCatalog.js'
import { learningContentCatalogSwipeAction } from '../lib/learningContentCatalogSwipe.js'
import { Book, Cards } from '../components/Icons.jsx'

const CATALOG_PAGE_SIZE = 80

const SWIPE_PREVIEW_MAX_DISTANCE = 88
const SWIPE_PREVIEW_START_DISTANCE = 8

const ACTIVITY_META = Object.freeze({
  memory: {
    leftLabel: '覚えた',
    rightLabel: 'まだ',
    leftClassName: 'bg-emerald-600',
    rightClassName: 'bg-rose-500',
    empty: '学習した語彙はまだありません。この級の「暗記」で判定すると表示されます。',
  },
  test: {
    leftLabel: '正解',
    rightLabel: '不正解',
    leftClassName: 'bg-emerald-600',
    rightClassName: 'bg-rose-500',
    empty: 'テストした語彙はまだありません。この級の「テスト」に答えると表示されます。',
  },
})

const RESULT_META = Object.freeze({
  learned: { label: '覚えた', symbol: '✓', className: 'bg-emerald-50 text-emerald-700' },
  reviewing: { label: 'まだ', symbol: '↺', className: 'bg-rose-50 text-rose-700' },
  correct: { label: '正解', symbol: '✓', className: 'bg-emerald-50 text-emerald-700' },
  incorrect: { label: '不正解', symbol: '×', className: 'bg-rose-50 text-rose-700' },
})

const ACTIVITY_DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

const activityDate = (timestamp, recorded) => (
  Number.isFinite(timestamp)
    ? ACTIVITY_DATE_FORMATTER.format(new Date(timestamp))
    : recorded ? '記録あり' : 'なし'
)

function catalogDirectionLabel(sort, direction) {
  if (sort === 'field') return direction === 'asc' ? 'あ→わ' : 'わ→あ'
  if (sort === 'memoryAt' || sort === 'testAt') {
    return direction === 'asc' ? '古い順' : '新しい順'
  }
  return direction === 'asc' ? '低い順' : '高い順'
}

function LevelViewTabs({ view, onChange }) {
  return (
    <div
      className="grid grid-cols-2 rounded-xl bg-brand-50 p-1"
      role="tablist"
      aria-label="この級の単語の見方"
      data-vocab-level-view-tabs
    >
      {[
        ['fields', '10分野から学ぶ'],
        ['list', '一覧を確認'],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={view === id}
          onClick={() => onChange(id)}
          className={cx(
            'min-h-11 rounded-lg px-2 text-xs font-extrabold transition-colors',
            view === id
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-ink/50 active:bg-white/70',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function catalogRowResult(row, activity) {
  return activity === 'test'
    ? RESULT_META[row.testStatus] ?? RESULT_META.incorrect
    : RESULT_META[row.memoryStatus] ?? RESULT_META.reviewing
}

function CatalogWordRow({ row, activity, onSwipe }) {
  const activityMeta = ACTIVITY_META[activity] ?? ACTIVITY_META.memory
  const resultMeta = catalogRowResult(row, activity)
  const swipeStartRef = useRef(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const resetSwipe = () => {
    swipeStartRef.current = null
    setSwipeOffset(0)
  }

  const startSwipe = (event) => {
    if (event.isPrimary === false || event.button !== 0) return
    swipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // スクロール開始直後など、取得できないポインターはそのまま無視する。
    }
  }

  const previewSwipe = (event) => {
    const start = swipeStartRef.current
    if (!start || start.pointerId !== event.pointerId) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (
      Math.abs(deltaX) < SWIPE_PREVIEW_START_DISTANCE
      || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2
    ) {
      setSwipeOffset(0)
      return
    }
    setSwipeOffset(Math.max(
      -SWIPE_PREVIEW_MAX_DISTANCE,
      Math.min(SWIPE_PREVIEW_MAX_DISTANCE, deltaX),
    ))
  }

  const finishSwipe = (event) => {
    const start = swipeStartRef.current
    resetSwipe()
    if (!start || start.pointerId !== event.pointerId) return
    const direction = learningContentCatalogSwipeAction(start, {
      x: event.clientX,
      y: event.clientY,
    })
    if (!direction) return
    event.preventDefault()
    onSwipe(direction)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    onSwipe(event.key === 'ArrowLeft' ? 'left' : 'right')
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      data-vocab-catalog-swipe-row={row.word.id}
    >
      <div className="pointer-events-none absolute inset-0 flex" aria-hidden="true">
        <span className={cx('flex flex-1 items-center px-4 text-xs font-extrabold text-white', activityMeta.rightClassName)}>
          {activityMeta.rightLabel} →
        </span>
        <span className={cx('flex flex-1 items-center justify-end px-4 text-xs font-extrabold text-white', activityMeta.leftClassName)}>
          ← {activityMeta.leftLabel}
        </span>
      </div>
      <div
        role="group"
        tabIndex={0}
        onPointerDown={startSwipe}
        onPointerMove={previewSwipe}
        onPointerUp={finishSwipe}
        onPointerCancel={resetSwipe}
        onKeyDown={handleKeyDown}
        aria-label={`${row.word.word}、${row.word.meaning}、現在は${resultMeta.label}。左にスワイプで${activityMeta.leftLabel}、右にスワイプで${activityMeta.rightLabel}`}
        className={cx(
          'relative flex min-h-20 w-full touch-pan-y items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left outline-none transition-[background-color,border-color,box-shadow,transform] focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-200',
          swipeOffset ? 'duration-0' : 'duration-200',
        )}
        style={{ transform: `translate3d(${swipeOffset}px, 0, 0)` }}
        data-vocab-catalog-word={row.word.id}
        data-vocab-catalog-activity={activity}
        data-vocab-catalog-status={resultMeta.label}
        data-vocab-catalog-swipe-offset={swipeOffset}
      >
        <span className={cx('mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl font-extrabold', resultMeta.className)} aria-hidden="true">
          {resultMeta.symbol}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <strong lang="en" className="break-words font-display text-lg font-extrabold leading-tight text-ink">
              {row.word.word}
            </strong>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">
              {row.word.pos}
            </span>
            <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-extrabold', resultMeta.className)}>
              {resultMeta.label}
            </span>
          </span>
          <span className="mt-1 block break-words text-sm font-bold leading-snug text-ink/75">
            {row.word.meaning}
          </span>
          <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-ink/45">
            <span>分野 {row.field}</span>
            <span>学習 {activityDate(row.memoryAt, row.memoryStatus !== 'unlearned')}</span>
            <span>テスト {activityDate(row.testAt, row.testStatus !== 'unanswered')}</span>
          </span>
        </span>
      </div>
    </div>
  )
}

function VocabularyCatalog({ level, srs, review, onShowFields }) {
  const words = useMemo(() => wordsByLevel(level.id), [level.id])
  const [activity, setActivity] = useState('memory')
  const [sort, setSort] = useState('field')
  const [direction, setDirection] = useState(VOCAB_CATALOG_DEFAULT_DIRECTIONS.field)
  const [visible, setVisible] = useState(CATALOG_PAGE_SIZE)
  const [swipeMessage, setSwipeMessage] = useState('')
  const [now] = useState(() => Date.now())
  const memoryRows = useMemo(
    () => vocabularyCatalogActivityRows(words, srs, {
      activity: 'memory', sort, direction, now,
    }),
    [direction, now, sort, srs, words],
  )
  const testRows = useMemo(
    () => vocabularyCatalogActivityRows(words, srs, {
      activity: 'test', sort, direction, now,
    }),
    [direction, now, sort, srs, words],
  )
  const rows = activity === 'test' ? testRows : memoryRows
  const visibleRows = rows.slice(0, visible)
  const activityMeta = ACTIVITY_META[activity] ?? ACTIVITY_META.memory

  useEffect(() => setVisible(CATALOG_PAGE_SIZE), [activity, direction, sort])

  const chooseSort = (nextSort) => {
    setSort(nextSort)
    setDirection(VOCAB_CATALOG_DEFAULT_DIRECTIONS[nextSort] ?? 'desc')
  }

  const handleSwipe = (row, swipeDirection) => {
    const result = vocabularyCatalogResultForDirection(activity, swipeDirection)
    if (!result) return
    const label = swipeDirection === 'left' ? activityMeta.leftLabel : activityMeta.rightLabel
    if (vocabularyCatalogResultMatches(row.entry, activity, result)) {
      setSwipeMessage(`${row.word.word}はすでに「${label}」扱いです。`)
      return
    }
    review(row.word.id, result, 'vocab')
    setSwipeMessage(`${row.word.word}を「${label}」扱いに変更しました。`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-vocab-catalog={level.id}>
      <ScreenHeader
        title={`英検${level.label}の一覧を確認`}
        subtitle={`学習 ${memoryRows.length.toLocaleString('ja-JP')}語・テスト ${testRows.length.toLocaleString('ja-JP')}語`}
      />

      <div className="shrink-0 space-y-2.5 border-b border-slate-200 bg-white px-3 pb-3 pt-2.5">
        <LevelViewTabs
          view="list"
          onChange={(nextView) => {
            if (nextView === 'fields') onShowFields()
          }}
        />
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="確認する記録">
          {VOCAB_CATALOG_ACTIVITY_OPTIONS.map((option) => {
            const count = option.id === 'test' ? testRows.length : memoryRows.length
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={activity === option.id}
                onClick={() => {
                  setActivity(option.id)
                  setSwipeMessage('')
                }}
                className={cx(
                  'min-h-11 rounded-lg px-1 text-[11px] font-extrabold',
                  activity === option.id
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-ink/55 active:bg-white/70',
                )}
                data-vocab-catalog-activity-tab={option.id}
              >
                <span className="block">{option.label}</span>
                <span className="tabular-nums">{count.toLocaleString('ja-JP')}語</span>
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <label className="min-w-0">
            <span className="sr-only">一覧の並び替え</span>
            <select
              value={sort}
              onChange={(event) => chooseSort(event.target.value)}
              aria-label="一覧の並び替え"
              className="h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm font-extrabold text-ink"
              data-vocab-catalog-sort
            >
              {VOCAB_CATALOG_SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-extrabold text-brand-700 active:bg-brand-50"
            aria-label={`並び順を変更。現在は${catalogDirectionLabel(sort, direction)}`}
            data-vocab-catalog-direction={direction}
          >
            {catalogDirectionLabel(sort, direction)}
          </button>
        </div>
        <p className="rounded-xl bg-brand-50 px-3 py-2 text-[11px] font-extrabold leading-relaxed text-brand-800" data-vocab-catalog-swipe-guide>
          左にスワイプ：{activityMeta.leftLabel}　右にスワイプ：{activityMeta.rightLabel}
        </p>
        <p className="min-h-4 px-1 text-[11px] font-bold text-ink/55" aria-live="polite" data-vocab-catalog-swipe-message>
          {swipeMessage}
        </p>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3" data-vocab-catalog-list>
        <p className="mb-2 px-1 text-xs font-extrabold text-ink/50" aria-live="polite">
          {activity === 'test' ? 'テストした' : '学習した'}全{rows.length.toLocaleString('ja-JP')}語のうち{visibleRows.length.toLocaleString('ja-JP')}語を表示
        </p>
        <div className="space-y-2">
          {visibleRows.map((row) => (
            <CatalogWordRow
              key={row.word.id}
              row={row}
              activity={activity}
              onSwipe={(swipeDirection) => handleSwipe(row, swipeDirection)}
            />
          ))}
        </div>
        {!visibleRows.length && (
          <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm font-bold leading-relaxed text-ink/50">
            {activityMeta.empty}
          </p>
        )}
        {visible < rows.length && (
          <Button
            full
            variant="secondary"
            className="mt-3"
            onClick={() => setVisible((count) => Math.min(rows.length, count + CATALOG_PAGE_SIZE))}
          >
            さらに{Math.min(CATALOG_PAGE_SIZE, rows.length - visible).toLocaleString('ja-JP')}語を表示
          </Button>
        )}
      </div>
    </div>
  )
}

// 旧「デッキ」URLから来た保存済み履歴も壊さず、学習者には級内の10分野を見せる。
function FieldCard({ field, level, srs, onStudy, onQuiz }) {
  const status = summarizeVocabularySrsItems(field.wordIds, srs)
  const progress = wordProgress(field.wordIds.map(getWord).filter(Boolean), srs)
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
      <LearningStatusBars progress={status} className="mt-3" compact units={{ learning: '語', quiz: '問' }} />
      <p className="mt-1.5 text-right text-[10px] font-bold text-ink/45">
        {progress.due > 0
          ? `復習が必要 ${progress.due}語`
          : progress.ready > 0
            ? `次に学ぶ ${progress.ready}語・1回10語`
            : '次の復習日まで待つ'}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="primary" onClick={onStudy} disabled={!progress.ready}>
          <Book size={15} /> {progress.ready ? '学習する' : '次回待ち'}
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
  const review = useStore((state) => state.review)
  const params = useStore((state) => state.params)

  const levelId = params.levelId ?? '5'
  const level = getLevel(levelId)
  const toc = LEARNING_FIELD_TOC.find((item) => item.level.id === levelId)
  const [view, setView] = useState(params.view === 'list' ? 'list' : 'fields')

  const open = (field, quiz = false) => navigate(quiz ? 'vocabQuiz' : 'vocabStudy', {
    source: { type: 'levelField', levelId, field: field.fieldId },
    title: `英検${level.label}・${field.field}`,
    ...(quiz ? {} : { mode: 'study' }),
    returnTo: { screen: 'vocabDecks', params: { levelId } },
  })

  if (view === 'list') {
    return (
      <VocabularyCatalog
        level={level}
        srs={srs}
        review={review}
        onShowFields={() => setView('fields')}
      />
    )
  }

  return (
    <div className="pb-6" data-vocab-level-fields>
      <ScreenHeader
        title={`英検${level.label}の単語`}
        subtitle={toc ? `全${toc.size.toLocaleString('ja-JP')}語を10分野から学習` : undefined}
      />
      <div className="space-y-3 px-4">
        <LevelViewTabs view="fields" onChange={setView} />
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
