import { useEffect, useMemo, useState } from 'react'
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
  vocabularyCatalogRemainingRows,
  vocabularyCatalogResultForDirection,
} from '../lib/vocabCatalog.js'
import { Book, Cards } from '../components/Icons.jsx'
import {
  VOCABULARY_HISTORY_ACTIVITY_META,
  VocabularyHistoryRow,
} from '../components/VocabularyHistoryRow.jsx'

const CATALOG_PAGE_SIZE = 80

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

function VocabularyCatalog({ level, srs, review, onShowFields }) {
  const words = useMemo(() => wordsByLevel(level.id), [level.id])
  const [activity, setActivity] = useState('memory')
  const [sort, setSort] = useState('field')
  const [direction, setDirection] = useState(VOCAB_CATALOG_DEFAULT_DIRECTIONS.field)
  const [visible, setVisible] = useState(CATALOG_PAGE_SIZE)
  const [swipeMessage, setSwipeMessage] = useState('')
  const [sortOpen, setSortOpen] = useState(false)
  const [dismissedByActivity, setDismissedByActivity] = useState(() => ({
    memory: new Set(),
    test: new Set(),
  }))
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
  const dismissedIds = dismissedByActivity[activity] ?? new Set()
  const remainingRows = vocabularyCatalogRemainingRows(rows, dismissedIds)
  const visibleRows = remainingRows.slice(0, visible)
  const activityMeta = VOCABULARY_HISTORY_ACTIVITY_META[activity]
    ?? VOCABULARY_HISTORY_ACTIVITY_META.memory

  useEffect(() => setVisible(CATALOG_PAGE_SIZE), [activity, direction, sort])
  useEffect(() => {
    setDismissedByActivity({ memory: new Set(), test: new Set() })
    setSwipeMessage('')
  }, [level.id])

  const chooseSort = (nextSort) => {
    setSort(nextSort)
    setDirection(VOCAB_CATALOG_DEFAULT_DIRECTIONS[nextSort] ?? 'desc')
  }

  const handleSwipe = (row, swipeDirection) => {
    const result = vocabularyCatalogResultForDirection(activity, swipeDirection)
    if (!result) return
    const label = swipeDirection === 'left' ? activityMeta.leftLabel : activityMeta.rightLabel
    review(row.word.id, result, 'vocab')
    setDismissedByActivity((current) => {
      const next = new Set(current[activity])
      next.add(row.word.id)
      return { ...current, [activity]: next }
    })
    setSwipeMessage(`${row.word.word}を「${label}」扱いとして記録し、一覧から一時的に隠しました。`)
  }

  const restoreList = () => {
    setDismissedByActivity((current) => ({ ...current, [activity]: new Set() }))
    setVisible(CATALOG_PAGE_SIZE)
    setSwipeMessage(`${activity === 'test' ? 'テストした' : '学習した'}語彙を一覧に再表示しました。`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-vocab-catalog={level.id}>
      <ScreenHeader
        title={`英検${level.label}の一覧を確認`}
        compact
      />

      <div
        className="shrink-0 space-y-1.5 border-b border-slate-200 bg-white px-3 pb-2 pt-1.5"
        data-vocab-catalog-compact-controls
      >
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
                  'min-h-11 rounded-lg px-1 text-xs font-extrabold',
                  activity === option.id
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-ink/55 active:bg-white/70',
                )}
                aria-label={`${option.label} ${count.toLocaleString('ja-JP')}語`}
                data-vocab-catalog-activity-tab={option.id}
              >
                {option.id === 'test' ? 'テスト' : '学習'}
                <span className="ml-1 tabular-nums">{count.toLocaleString('ja-JP')}語</span>
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-1.5">
          <p
            className="flex min-h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-xl bg-brand-50 px-2 text-[10px] font-extrabold text-brand-800"
            aria-label={`左スワイプで${activityMeta.leftLabel}、右スワイプで${activityMeta.rightLabel}。スワイプ後は一時的に非表示になります。`}
            data-vocab-catalog-swipe-guide
          >
            <span aria-hidden="true">← {activityMeta.leftLabel}｜{activityMeta.rightLabel} →</span>
          </p>
          <button
            type="button"
            onClick={() => setSortOpen((current) => !current)}
            aria-expanded={sortOpen}
            aria-label={`並び替えを${sortOpen ? '閉じる' : '開く'}`}
            className="learning-catalog-tools-toggle min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-2 text-[10px] font-extrabold text-brand-700 active:bg-brand-50"
            data-vocab-catalog-tools-toggle
          >
            <span className="hidden min-[360px]:inline">並び替え</span>
            <span className="min-[360px]:hidden">並び</span>
            <span aria-hidden="true">{sortOpen ? '−' : '＋'}</span>
          </button>
          <button
            type="button"
            onClick={restoreList}
            disabled={!dismissedIds.size}
            className="min-h-11 rounded-xl border border-brand-200 bg-white px-2 text-[10px] font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/35"
            aria-label="一覧を再表示"
            data-vocab-catalog-restore
          >
            一覧を再表示
          </button>
        </div>
        <div
          className={cx(
            'grid grid-cols-[minmax(0,1fr)_auto] gap-1.5',
            !sortOpen && 'learning-catalog-tools-collapsible',
          )}
          data-vocab-catalog-tools
        >
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
        <p className="sr-only" aria-live="polite" data-vocab-catalog-swipe-message>
          {swipeMessage}
        </p>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3" data-vocab-catalog-list>
        <p className="mb-2 px-1 text-xs font-extrabold text-ink/50" aria-live="polite">
          {activity === 'test' ? 'テストした' : '学習した'}全{rows.length.toLocaleString('ja-JP')}語・残り{remainingRows.length.toLocaleString('ja-JP')}語
        </p>
        <div className="space-y-2">
          {visibleRows.map((row) => (
            <VocabularyHistoryRow
              key={row.word.id}
              row={row}
              activity={activity}
              onSwipe={(swipeDirection) => handleSwipe(row, swipeDirection)}
            />
          ))}
        </div>
        {!visibleRows.length && (
          <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm font-bold leading-relaxed text-ink/50">
            {rows.length
              ? 'この一覧をすべて確認しました。「一覧を再表示」で、同じ語彙をもう一度確認できます。'
              : activityMeta.empty}
          </p>
        )}
        {visible < remainingRows.length && (
          <Button
            full
            variant="secondary"
            className="mt-3"
            onClick={() => setVisible((count) => Math.min(remainingRows.length, count + CATALOG_PAGE_SIZE))}
          >
            さらに{Math.min(CATALOG_PAGE_SIZE, remainingRows.length - visible).toLocaleString('ja-JP')}語を表示
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
