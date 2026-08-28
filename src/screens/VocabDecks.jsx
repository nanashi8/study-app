import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import {
  VOCAB_FIELD_GROUPS,
  getWord,
  wordsByField,
  wordsByLevel,
} from '../data/vocab.js'
import { LEARNING_FIELD_TOC } from '../data/decks.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'
import { wordProgress } from '../lib/session.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import {
  VOCAB_CATALOG_ACTIVITY_OPTIONS,
  VOCAB_CATALOG_DEFAULT_DIRECTIONS,
  VOCAB_CATALOG_SORT_OPTIONS,
  VOCAB_CATALOG_STATUS_FILTER_OPTIONS,
  VOCAB_CATALOG_FIELD_FILTER_ALL,
  vocabularyCatalogActivityRows,
  vocabularyCatalogFieldOptions,
  vocabularyCatalogFieldRows,
  vocabularyCatalogRecordedRows,
  vocabularyCatalogRemainingRows,
  vocabularyCatalogResultForDirection,
  vocabularyCatalogStatusRows,
} from '../lib/vocabCatalog.js'
import {
  VOCABULARY_HISTORY_ACTIVITY_META,
  VocabularyHistoryRow,
} from '../components/VocabularyHistoryRow.jsx'

const CATALOG_PAGE_SIZE = 80

function catalogDirectionLabel(sort, direction) {
  if (sort === 'memoryAt' || sort === 'testAt') {
    return direction === 'asc' ? '古い順' : '新しい順'
  }
  return direction === 'asc' ? '低い順' : '高い順'
}

function statusFilterLabel(statusFilter) {
  return VOCAB_CATALOG_STATUS_FILTER_OPTIONS.find((option) => option.id === statusFilter)?.label ?? ''
}

// 学習の自己判定とテストの結果は別の記録。選択肢もその2群に分けて見せる。
const MEMORY_STATUS_IDS = ['memoryUnlearned', 'memoryLearned', 'memoryReviewing']

const statusFilterOptionsFor = (group) => VOCAB_CATALOG_STATUS_FILTER_OPTIONS.filter((option) => (
  group === 'memory'
    ? MEMORY_STATUS_IDS.includes(option.id)
    : option.id !== 'all' && !MEMORY_STATUS_IDS.includes(option.id)
))

function LevelViewTabs({ view, onChange }) {
  return (
    <LearningViewTabs
      view={view}
      onChange={onChange}
      learnValue="fields"
      learnLabel="10分野から学ぶ"
      listLabel="一覧を確認"
      label="この級の単語の見方"
      data-vocab-level-view-tabs
    />
  )
}

function VocabularyCatalog({
  catalogKey,
  title,
  words,
  srs,
  review,
  onShowFields,
  onOpenWord,
  initialFieldFilter = VOCAB_CATALOG_FIELD_FILTER_ALL,
  ...rest
}) {
  const [activity, setActivity] = useState('memory')
  const [sort, setSort] = useState('weight')
  const [direction, setDirection] = useState(VOCAB_CATALOG_DEFAULT_DIRECTIONS.weight)
  const [statusFilter, setStatusFilter] = useState('all')
  const [fieldFilter, setFieldFilter] = useState(initialFieldFilter)
  const [visible, setVisible] = useState(CATALOG_PAGE_SIZE)
  const [swipeMessage, setSwipeMessage] = useState('')
  const [sortOpen, setSortOpen] = useState(false)
  const [dismissedByActivity, setDismissedByActivity] = useState(() => ({
    memory: new Set(),
    test: new Set(),
  }))
  const [now] = useState(() => Date.now())
  const rows = useMemo(
    () => vocabularyCatalogActivityRows(words, srs, {
      activity, sort, direction, now,
    }),
    [activity, direction, now, sort, srs, words],
  )
  const fieldOptions = useMemo(() => vocabularyCatalogFieldOptions(rows), [rows])
  const fieldRows = useMemo(
    () => vocabularyCatalogFieldRows(rows, fieldFilter),
    [fieldFilter, rows],
  )
  const memoryRecordedCount = useMemo(
    () => vocabularyCatalogRecordedRows(fieldRows, 'memory').length,
    [fieldRows],
  )
  const testRecordedCount = useMemo(
    () => vocabularyCatalogRecordedRows(fieldRows, 'test').length,
    [fieldRows],
  )
  const recordedCount = activity === 'test' ? testRecordedCount : memoryRecordedCount
  const filteredRows = useMemo(
    () => vocabularyCatalogStatusRows(fieldRows, statusFilter),
    [fieldRows, statusFilter],
  )
  const fieldFilterLabel = fieldOptions.find((option) => option.id === fieldFilter)?.label
    ?? 'すべての分野'
  const dismissedIds = dismissedByActivity[activity] ?? new Set()
  const remainingRows = vocabularyCatalogRemainingRows(filteredRows, dismissedIds)
  const visibleRows = remainingRows.slice(0, visible)
  const activityMeta = VOCABULARY_HISTORY_ACTIVITY_META[activity]
    ?? VOCABULARY_HISTORY_ACTIVITY_META.memory

  useEffect(
    () => setVisible(CATALOG_PAGE_SIZE),
    [activity, direction, fieldFilter, sort, statusFilter],
  )
  useEffect(() => {
    setDismissedByActivity({ memory: new Set(), test: new Set() })
    setSwipeMessage('')
    setFieldFilter(initialFieldFilter)
    setStatusFilter('all')
  }, [catalogKey, initialFieldFilter])

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
    setSwipeMessage(`${activity === 'test' ? 'テスト' : '学習'}の一覧を再表示しました。`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col" {...rest}>
      <ScreenHeader title={title} compact />

      <div
        className="shrink-0 space-y-1.5 border-b border-slate-200 bg-white px-3 pb-2 pt-1.5"
        data-vocab-catalog-compact-controls
      >
        {onShowFields && (
          <LevelViewTabs
            view="list"
            onChange={(nextView) => {
              if (nextView === 'fields') onShowFields()
            }}
          />
        )}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="確認する記録">
          {VOCAB_CATALOG_ACTIVITY_OPTIONS.map((option) => {
            const count = option.id === 'test' ? testRecordedCount : memoryRecordedCount
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
                aria-label={`${option.label}。済み${count.toLocaleString('ja-JP')}語、全${fieldRows.length.toLocaleString('ja-JP')}語`}
                data-vocab-catalog-activity-tab={option.id}
              >
                {option.id === 'test' ? 'テスト' : '学習'}
                <span className="ml-1 tabular-nums">{count.toLocaleString('ja-JP')}/{fieldRows.length.toLocaleString('ja-JP')}語</span>
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
            aria-label={`しぼり込みと並び替えを${sortOpen ? '閉じる' : '開く'}。現在は${fieldFilterLabel}・${statusFilter === 'all' ? 'すべての状況' : statusFilterLabel(statusFilter)}`}
            className="learning-catalog-tools-toggle min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-2 text-[10px] font-extrabold text-brand-700 active:bg-brand-50"
            data-vocab-catalog-tools-toggle
          >
            <span className="hidden min-[360px]:inline">しぼり込み・並び</span>
            <span className="min-[360px]:hidden">絞込</span>
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
            'space-y-1.5',
            !sortOpen && 'learning-catalog-tools-collapsible',
          )}
          data-vocab-catalog-tools
        >
          <label className="block min-w-0">
            <span className="mb-0.5 block px-1 text-[10px] font-extrabold text-ink/50">10分野でしぼり込み</span>
            <select
              value={fieldFilter}
              onChange={(event) => setFieldFilter(event.target.value)}
              aria-label="10分野でしぼり込み"
              className="h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm font-extrabold text-ink"
              data-vocab-catalog-field-filter={fieldFilter}
            >
              {fieldOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.id === VOCAB_CATALOG_FIELD_FILTER_ALL
                    ? `すべての分野（${option.count.toLocaleString('ja-JP')}語）`
                    : `${option.emoji} ${option.label}（${option.count.toLocaleString('ja-JP')}語）`}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="mb-0.5 block px-1 text-[10px] font-extrabold text-ink/50">学習状況でしぼり込み</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="学習状況でしぼり込み"
              className="h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm font-extrabold text-ink"
              data-vocab-catalog-status-filter={statusFilter}
            >
              <option value="all">すべての状況を表示</option>
              <optgroup label="学習の記録">
                {statusFilterOptionsFor('memory').map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </optgroup>
              <optgroup label="テストの記録">
                {statusFilterOptionsFor('test').map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </optgroup>
            </select>
          </label>
          <div className="min-w-0">
            <span className="mb-0.5 block px-1 text-[10px] font-extrabold text-ink/50">並び替え</span>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-1.5">
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
          </div>
        </div>
        <p className="sr-only" aria-live="polite" data-vocab-catalog-swipe-message>
          {swipeMessage}
        </p>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3" data-vocab-catalog-list>
        <p className="mb-2 px-1 text-xs font-extrabold text-ink/50" aria-live="polite">
          {fieldFilter !== VOCAB_CATALOG_FIELD_FILTER_ALL && `${fieldFilterLabel}・`}
          {`${activity === 'test' ? 'テスト済' : '学習済'} ${recordedCount.toLocaleString('ja-JP')}/${fieldRows.length.toLocaleString('ja-JP')}語`}
          {statusFilter !== 'all' && `・「${statusFilterLabel(statusFilter)}」${filteredRows.length.toLocaleString('ja-JP')}語`}
          {`・残り${remainingRows.length.toLocaleString('ja-JP')}語`}
        </p>
        <div className="space-y-2">
          {visibleRows.map((row) => (
            <VocabularyHistoryRow
              key={row.word.id}
              row={row}
              activity={activity}
              onSwipe={(swipeDirection) => handleSwipe(row, swipeDirection)}
              onOpen={() => onOpenWord(row.word.id)}
            />
          ))}
        </div>
        {!visibleRows.length && (
          <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm font-bold leading-relaxed text-ink/50">
            {!fieldRows.length
              ? activityMeta.empty
              : filteredRows.length
                ? 'この一覧をすべて確認しました。「一覧を再表示」で、同じ語彙をもう一度確認できます。'
                : `「${statusFilter === 'all' ? fieldFilterLabel : statusFilterLabel(statusFilter)}」の語はありません。しぼり込みを「すべて」に戻すと、全語を確認できます。`}
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
function FieldCard({ field, level, srs, onStudy, onQuiz, onCatalog }) {
  const status = summarizeVocabularySrsItems(field.wordIds, srs)
  const progress = wordProgress(field.wordIds.map(getWord).filter(Boolean), srs)
  return (
    <LearningEntryCard
      data-vocab-level-field={field.fieldId}
      emoji={field.emoji}
      accentColor={field.color}
      title={field.field}
      chip={<Chip color={level.color}>{field.size.toLocaleString('ja-JP')}語</Chip>}
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
        ? `${field.field}の復習または未学習 ${progress.ready}語を暗記`
        : `${field.field}は次の復習日まで待つ`}
      onStudy={onStudy}
      quizAriaLabel={`${field.field}の単語をテスト`}
      onQuiz={onQuiz}
      catalogLabel="一覧を確認"
      catalogAriaLabel={`英検${level.label}の${field.field}を一覧で確認する`}
      onCatalog={onCatalog}
    />
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
  const fieldGroup = VOCAB_FIELD_GROUPS.find((item) => item.id === params.field)
  const [view, setView] = useState(params.view === 'list' ? 'list' : 'fields')
  const [listFieldFilter, setListFieldFilter] = useState(
    params.fieldFilter ?? VOCAB_CATALOG_FIELD_FILTER_ALL,
  )
  const showList = (fieldId = VOCAB_CATALOG_FIELD_FILTER_ALL) => {
    scrollScreenToTop()
    setListFieldFilter(fieldId)
    setView('list')
  }

  const open = (field, quiz = false) => navigate(quiz ? 'vocabQuiz' : 'vocabStudy', {
    source: { type: 'levelField', levelId, field: field.fieldId },
    title: `英検${level.label}・${field.field}`,
    ...(quiz ? {} : { mode: 'study' }),
    returnTo: { screen: 'vocabDecks', params: { levelId } },
  })
  const openWord = (wordId) => navigate('wordDetail', { id: wordId })

  // 10分野の入口から来たときは、その分野の全級をまとめて一覧にする。
  if (fieldGroup) {
    return (
      <VocabularyCatalog
        data-vocab-catalog={`field:${fieldGroup.id}`}
        catalogKey={`field:${fieldGroup.id}`}
        title={`${fieldGroup.label}の一覧を確認`}
        words={wordsByField(fieldGroup.id)}
        srs={srs}
        review={review}
        onOpenWord={openWord}
      />
    )
  }

  if (view === 'list') {
    return (
      <VocabularyCatalog
        data-vocab-catalog={level.id}
        catalogKey={level.id}
        title={`英検${level.label}の一覧を確認`}
        words={wordsByLevel(level.id)}
        initialFieldFilter={listFieldFilter}
        srs={srs}
        review={review}
        onShowFields={() => setView('fields')}
        onOpenWord={openWord}
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
        <LevelViewTabs
          view="fields"
          onChange={(nextView) => (nextView === 'list' ? showList() : setView(nextView))}
        />
        {!toc && <p className="text-sm font-bold text-ink/50">この級の単語はまだありません。</p>}
        {toc?.chapters.map((field) => (
          <FieldCard
            key={field.fieldId}
            field={field}
            level={level}
            srs={srs}
            onStudy={() => open(field)}
            onQuiz={() => open(field, true)}
            onCatalog={() => showList(field.fieldId)}
          />
        ))}
      </div>
    </div>
  )
}
