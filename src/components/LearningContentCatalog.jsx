import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { selectProgressState } from '../lib/progressCode.js'
import { LEARNING_CONTENTS } from '../lib/learningContentProgress.js'
import {
  LEARNING_CONTENT_CATALOG_ACTIONS,
  LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS,
  LEARNING_CONTENT_CATALOG_SORT_OPTIONS,
  learningContentCatalogLaunch,
  learningContentCatalogRows,
  learningContentCatalogTotal,
} from '../lib/learningContentCatalog.js'
import { learningContentCatalogSwipeAction } from '../lib/learningContentCatalogSwipe.js'
import { ScreenHeader } from './AppShell.jsx'
import { Button, cx } from './ui.jsx'
import { BookOpen, Check, Search } from './Icons.jsx'

const CATALOG_PAGE_SIZE = 80

const CATALOG_VIEW_META = Object.freeze({
  all: {
    label: '全一覧',
    rightLabel: '学習項目に追加',
    leftLabel: '再表示しない',
    rightClassName: 'bg-emerald-600',
    leftClassName: 'bg-slate-600',
  },
  registered: {
    label: '学習項目',
    rightLabel: 'もっと先にする',
    leftLabel: '一覧から外す',
    rightClassName: 'bg-amber-600',
    leftClassName: 'bg-rose-600',
  },
  hidden: {
    label: '非表示',
    rightLabel: '全一覧へ戻す',
    leftLabel: '変更なし',
    rightClassName: 'bg-brand-600',
    leftClassName: 'bg-slate-400',
  },
})

const MANUAL_PRIORITY_LABELS = Object.freeze([
  '通常',
  '先にする',
  'かなり先',
  'いちばん先',
])

const PRIORITY_META = Object.freeze({
  retry: { label: 'もう一度取り組む', className: 'bg-rose-50 text-rose-700' },
  due: { label: '復習どき', className: 'bg-amber-50 text-amber-800' },
  waiting: { label: '学習記録あり', className: 'bg-emerald-50 text-emerald-700' },
  unlearned: { label: '未学習', className: 'bg-slate-100 text-slate-500' },
})

const ACTIVITY_DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

const activityDate = (timestamp, recorded) => {
  if (Number.isFinite(timestamp)) return ACTIVITY_DATE_FORMATTER.format(new Date(timestamp))
  return recorded ? '記録あり（日付なし）' : 'まだ'
}

function directionLabel(sort, direction) {
  if (sort === 'field') return direction === 'asc' ? 'あ→わ' : 'わ→あ'
  if (sort === 'memoryAt' || sort === 'testAt') {
    return direction === 'asc' ? '古い順' : '新しい順'
  }
  return direction === 'asc' ? '低い順' : '高い順'
}

const SWIPE_PREVIEW_MAX_DISTANCE = 88
const SWIPE_PREVIEW_START_DISTANCE = 8

function CatalogItemRow({
  content,
  row,
  selected,
  catalogView,
  onToggle,
  onSwipe,
}) {
  const meta = PRIORITY_META[row.priority] ?? PRIORITY_META.unlearned
  const swipeMeta = CATALOG_VIEW_META[catalogView] ?? CATALOG_VIEW_META.all
  const swipeStartRef = useRef(null)
  const suppressClickUntilRef = useRef(0)
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
      // 一部のブラウザーはスクロール開始直後など、取得できないポインターを通知する。
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

    const swipeAction = learningContentCatalogSwipeAction(start, {
      x: event.clientX,
      y: event.clientY,
    })
    if (!swipeAction) return

    suppressClickUntilRef.current = Date.now() + 450
    event.preventDefault()
    onSwipe(swipeAction)
  }

  const toggleFromClick = (event) => {
    if (Date.now() < suppressClickUntilRef.current) {
      event.preventDefault()
      return
    }
    onToggle()
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      data-learning-catalog-swipe-row={row.id}
    >
      <div className="pointer-events-none absolute inset-0 flex" aria-hidden="true">
        <span className={cx('flex flex-1 items-center px-4 text-xs font-extrabold text-white', swipeMeta.rightClassName)}>
          {swipeMeta.rightLabel} →
        </span>
        <span className={cx('flex flex-1 items-center justify-end px-4 text-xs font-extrabold text-white', swipeMeta.leftClassName)}>
          ← {swipeMeta.leftLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={toggleFromClick}
        onPointerDown={startSwipe}
        onPointerMove={previewSwipe}
        onPointerUp={finishSwipe}
        onPointerCancel={resetSwipe}
        aria-pressed={selected}
        aria-label={`${row.title}を${selected ? '選択から外す' : `${LEARNING_CONTENT_CATALOG_ACTIONS[content.id]?.verb || '学習'}に選ぶ`}。右スワイプで${swipeMeta.rightLabel}、左スワイプで${swipeMeta.leftLabel}`}
        className={cx(
          'relative flex min-h-20 w-full touch-pan-y items-start gap-3 rounded-xl border bg-white px-3 py-3 text-left transition-[background-color,border-color,box-shadow,transform]',
          swipeOffset ? 'duration-0' : 'duration-200',
          selected
            ? 'border-brand-400 bg-brand-50 ring-1 ring-brand-300'
            : 'border-slate-200 active:bg-brand-50/60',
        )}
        style={{ transform: `translate3d(${swipeOffset}px, 0, 0)` }}
        data-learning-catalog-item={row.id}
        data-review-priority={row.priority}
        data-learning-catalog-registered={row.registered || undefined}
        data-learning-catalog-hidden={row.hidden || undefined}
        data-learning-catalog-manual-priority={row.manualPriority}
        data-learning-catalog-swipe-offset={swipeOffset}
      >
        <span
          className={cx(
            'mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2',
            selected
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-slate-300 bg-white text-transparent',
          )}
          aria-hidden="true"
        >
          <Check size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <strong className="break-words font-display text-base font-extrabold leading-snug text-ink">
              {row.title}
            </strong>
            {row.level && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">
                {row.level}
              </span>
            )}
            <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-extrabold', meta.className)}>
              {meta.label}
            </span>
            {row.registered && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700">
                学習項目・{MANUAL_PRIORITY_LABELS[row.manualPriority]}
              </span>
            )}
            {row.hidden && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                全一覧で非表示
              </span>
            )}
          </span>
          {row.subtitle && (
            <span className="mt-1 block break-words text-sm font-bold leading-snug text-ink/70">
              {row.subtitle}
            </span>
          )}
          <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-ink/45">
            <span>分野 {row.field}</span>
            <span>学習 {activityDate(row.memoryAt, row.learningRecorded)}</span>
            <span>テスト {activityDate(row.testAt, row.testRecorded)}</span>
          </span>
        </span>
      </button>
    </div>
  )
}

export function LearningContentCatalog({ initialContentId, initialCatalogView }) {
  const navigate = useStore((state) => state.navigate)
  const replaceParams = useStore((state) => state.replaceParams)
  const updateLearningContentPlanItem = useStore((state) => state.updateLearningContentPlanItem)
  const state = useStore(useShallow(selectProgressState))
  const fallbackId = LEARNING_CONTENTS[0]?.id
  const validInitialId = LEARNING_CONTENTS.some((content) => content.id === initialContentId)
    ? initialContentId
    : fallbackId
  const [contentId, setContentId] = useState(validInitialId)
  const [catalogView, setCatalogView] = useState(
    Object.hasOwn(CATALOG_VIEW_META, initialCatalogView) ? initialCatalogView : 'all',
  )
  const [sort, setSort] = useState('weight')
  const [direction, setDirection] = useState(LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS.weight)
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(CATALOG_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [swipeMessage, setSwipeMessage] = useState('')
  const [toolsOpen, setToolsOpen] = useState(false)
  const [now] = useState(() => Date.now())
  const content = LEARNING_CONTENTS.find((item) => item.id === contentId) ?? LEARNING_CONTENTS[0]
  const action = LEARNING_CONTENT_CATALOG_ACTIONS[content.id]
  const rows = useMemo(
    () => learningContentCatalogRows(content, state, { sort, direction, now }),
    [content, direction, now, sort, state],
  )
  const normalizedQuery = query.trim().toLocaleLowerCase('ja')
  const viewRows = useMemo(() => {
    if (catalogView === 'registered') return rows.filter((row) => row.registered)
    if (catalogView === 'hidden') return rows.filter((row) => row.hidden)
    return rows.filter((row) => !row.hidden)
  }, [catalogView, rows])
  const filteredRows = useMemo(
    () => normalizedQuery
      ? viewRows.filter((row) => row.searchText.includes(normalizedQuery))
      : viewRows,
    [normalizedQuery, viewRows],
  )
  const visibleRows = filteredRows.slice(0, visible)
  const dueRows = filteredRows.filter((row) => row.needsReview)
  const selectedRows = rows.filter((row) => selectedIds.has(row.id))

  useEffect(() => setVisible(CATALOG_PAGE_SIZE), [catalogView, contentId, direction, normalizedQuery, sort])

  const chooseContent = (nextContentId) => {
    setContentId(nextContentId)
    replaceParams({ view: 'catalog', contentId: nextContentId, catalogView })
    setQuery('')
    setSelectedIds(new Set())
    setSort('weight')
    setDirection(LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS.weight)
    setToolsOpen(false)
  }

  const chooseCatalogView = (nextView) => {
    if (!Object.hasOwn(CATALOG_VIEW_META, nextView)) return
    setCatalogView(nextView)
    replaceParams({ view: 'catalog', contentId, catalogView: nextView })
    setQuery('')
    setSelectedIds(new Set())
    setToolsOpen(false)
  }

  const chooseSort = (nextSort) => {
    setSort(nextSort)
    setDirection(LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS[nextSort] ?? 'desc')
  }

  const toggleItem = (itemId) => setSelectedIds((current) => {
    if (action.selection === 'one') {
      return current.has(itemId) ? new Set() : new Set([itemId])
    }
    const next = new Set(current)
    if (next.has(itemId)) next.delete(itemId)
    else next.add(itemId)
    return next
  })

  const removeSelection = (itemId) => setSelectedIds((current) => {
    if (!current.has(itemId)) return current
    const next = new Set(current)
    next.delete(itemId)
    return next
  })

  const handleRowSwipe = (row, swipeDirection) => {
    if (catalogView === 'all') {
      if (swipeDirection === 'right') {
        if (row.registered) {
          setSwipeMessage(`${row.title}はすでに学習項目に入っています。`)
          return
        }
        updateLearningContentPlanItem(content.id, row.id, 'register')
        setSwipeMessage(`${row.title}を学習項目に追加しました。`)
        return
      }
      updateLearningContentPlanItem(content.id, row.id, 'hide')
      removeSelection(row.id)
      setSwipeMessage(`${row.title}を全一覧に再表示しない設定にしました。`)
      return
    }

    if (catalogView === 'registered') {
      if (swipeDirection === 'right') {
        if (row.manualPriority >= MANUAL_PRIORITY_LABELS.length - 1) {
          setSwipeMessage(`${row.title}はすでにいちばん先です。`)
          return
        }
        const nextPriority = row.manualPriority + 1
        updateLearningContentPlanItem(content.id, row.id, 'raise-priority')
        setSwipeMessage(`${row.title}の順番を「${MANUAL_PRIORITY_LABELS[nextPriority]}」へ上げました。`)
        return
      }
      updateLearningContentPlanItem(content.id, row.id, 'remove')
      removeSelection(row.id)
      setSwipeMessage(`${row.title}を学習項目から外しました。`)
      return
    }

    if (swipeDirection === 'right') {
      updateLearningContentPlanItem(content.id, row.id, 'restore')
      setSwipeMessage(`${row.title}を全一覧へ戻しました。`)
      return
    }
    setSwipeMessage('非表示の項目は、右にスワイプすると全一覧へ戻せます。')
  }

  const selectRows = (items) => setSelectedIds((current) => {
    const next = new Set(current)
    for (const row of items) next.add(row.id)
    return next
  })

  const startSelected = () => {
    const launch = learningContentCatalogLaunch(content, selectedRows, { catalogView })
    if (launch) navigate(launch.screen, launch.params)
  }

  const total = learningContentCatalogTotal(LEARNING_CONTENTS)
  const countLabel = `${content.items.length.toLocaleString('ja-JP')}${content.unit}`
  const viewCounts = {
    all: rows.filter((row) => !row.hidden).length,
    registered: rows.filter((row) => row.registered).length,
    hidden: rows.filter((row) => row.hidden).length,
  }
  const swipeMeta = CATALOG_VIEW_META[catalogView]

  return (
    <div className="flex h-full min-h-0 flex-col" data-learning-content-catalog={content.id}>
      <ScreenHeader
        title="全教材の一覧から学ぶ"
        subtitle={`18教材・全${total.toLocaleString('ja-JP')}項目`}
      />

      <div className="shrink-0 space-y-2.5 border-b border-slate-200 bg-white px-3 pb-3 pt-2.5">
        <label className="block">
          <span className="mb-1 block text-[11px] font-extrabold text-ink/55">教材</span>
          <select
            value={content.id}
            onChange={(event) => chooseContent(event.target.value)}
            aria-label="一覧に表示する教材"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-extrabold text-ink"
            data-learning-catalog-content-select
          >
            {LEARNING_CONTENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}（{item.items.length.toLocaleString('ja-JP')}{item.unit}）
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1" aria-label="表示する一覧">
          {Object.entries(CATALOG_VIEW_META).map(([viewId, viewMeta]) => (
            <button
              key={viewId}
              type="button"
              onClick={() => chooseCatalogView(viewId)}
              aria-pressed={catalogView === viewId}
              className={cx(
                'min-h-10 rounded-lg px-1 text-[10px] font-extrabold',
                catalogView === viewId
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-ink/55 active:bg-white/70',
              )}
              data-learning-catalog-view={viewId}
            >
              {viewMeta.label}<span className="ml-0.5 tabular-nums">{viewCounts[viewId].toLocaleString('ja-JP')}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setToolsOpen((current) => !current)}
          aria-expanded={toolsOpen}
          className="learning-catalog-tools-toggle min-h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm font-extrabold text-brand-700 active:bg-brand-50"
          data-learning-catalog-tools-toggle
        >
          <span>検索・並び替え・まとめて選ぶ</span>
          <span aria-hidden="true">{toolsOpen ? '−' : '＋'}</span>
        </button>

        <div
          className={cx('space-y-2.5', !toolsOpen && 'learning-catalog-tools-collapsible')}
          data-learning-catalog-tools
        >
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
            <Search size={17} className="shrink-0 text-ink/35" />
            <span className="sr-only">{content.label}を検索</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`${content.label}を検索`}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none"
              data-learning-catalog-search
            />
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <label className="min-w-0">
              <span className="sr-only">一覧の並び替え</span>
              <select
                value={sort}
                onChange={(event) => chooseSort(event.target.value)}
                aria-label="一覧の並び替え"
                className="h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm font-extrabold text-ink"
                data-learning-catalog-sort
              >
                {LEARNING_CONTENT_CATALOG_SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setDirection((current) => current === 'asc' ? 'desc' : 'asc')}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-extrabold text-brand-700 active:bg-brand-50"
              aria-label={`並び順を変更。現在は${directionLabel(sort, direction)}`}
              data-learning-catalog-direction={direction}
            >
              {directionLabel(sort, direction)}
            </button>
          </div>
          <p className="text-[11px] font-bold leading-relaxed text-ink/50">
            先に復習する順は、復習日・学習とテストの結果・前回からの日数で決まります。
          </p>
          <p
            className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-extrabold leading-relaxed text-ink/65"
            data-learning-catalog-swipe-guide
          >
            右にスワイプ：{swipeMeta.rightLabel}　左にスワイプ：{swipeMeta.leftLabel}（タップは今から学ぶ項目の選択）
          </p>

          {action.selection === 'many' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!dueRows.length}
                onClick={() => selectRows(dueRows)}
                className="min-h-11 rounded-xl bg-amber-50 px-2 text-xs font-extrabold text-amber-800 active:bg-amber-100 disabled:opacity-45"
              >
                復習どき {dueRows.length.toLocaleString('ja-JP')}{content.unit}を選ぶ
              </button>
              <button
                type="button"
                disabled={!visibleRows.length}
                onClick={() => selectRows(visibleRows)}
                className="min-h-11 rounded-xl bg-brand-50 px-2 text-xs font-extrabold text-brand-700 active:bg-brand-100 disabled:opacity-45"
              >
                表示中の{visibleRows.length.toLocaleString('ja-JP')}{content.unit}を選ぶ
              </button>
            </div>
          ) : (
            <p className="rounded-xl bg-brand-50 px-3 py-2 text-xs font-extrabold text-brand-800">
              この教材は1件ずつ学びます。開く項目を1つ選んでください。
            </p>
          )}
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3" data-learning-catalog-list>
        <p className="mb-2 px-1 text-xs font-extrabold text-ink/50" aria-live="polite">
          {normalizedQuery
            ? `${swipeMeta.label}${viewRows.length.toLocaleString('ja-JP')}${content.unit}から${filteredRows.length.toLocaleString('ja-JP')}${content.unit}が一致・${visibleRows.length.toLocaleString('ja-JP')}${content.unit}を表示`
            : `全${countLabel}・${swipeMeta.label}${viewRows.length.toLocaleString('ja-JP')}${content.unit}のうち${visibleRows.length.toLocaleString('ja-JP')}${content.unit}を表示`}
        </p>
        <div className="space-y-2">
          {visibleRows.map((row) => (
            <CatalogItemRow
              key={row.id}
              content={content}
              row={row}
              selected={selectedIds.has(row.id)}
              catalogView={catalogView}
              onToggle={() => toggleItem(row.id)}
              onSwipe={(swipeDirection) => handleRowSwipe(row, swipeDirection)}
            />
          ))}
        </div>
        {!visibleRows.length && (
          <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm font-bold text-ink/50">
            {normalizedQuery
              ? 'この検索に合う項目はありません。'
              : catalogView === 'registered'
                ? '学習項目はまだありません。全一覧で右にスワイプして追加できます。'
                : catalogView === 'hidden'
                  ? '再表示しない設定の項目はありません。'
                  : '表示できる項目はありません。非表示の一覧から戻せます。'}
          </p>
        )}
        {visible < filteredRows.length && (
          <Button
            full
            variant="secondary"
            className="mt-3"
            onClick={() => setVisible((count) => Math.min(filteredRows.length, count + CATALOG_PAGE_SIZE))}
          >
            さらに{Math.min(CATALOG_PAGE_SIZE, filteredRows.length - visible).toLocaleString('ja-JP')}{content.unit}を表示
          </Button>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2.5" data-learning-catalog-actions>
        <p className="sr-only" aria-live="polite">{swipeMessage}</p>
        <p className="sr-only" aria-live="polite">
          選択中 {selectedRows.length.toLocaleString('ja-JP')}{content.unit}
        </p>
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] gap-2">
          <Button
            full
            disabled={!selectedRows.length}
            onClick={startSelected}
            data-learning-catalog-start
          >
            <BookOpen size={17} />
            {selectedRows.length
              ? `選んだ${selectedRows.length.toLocaleString('ja-JP')}${content.unit}を${action.verb}`
              : `${action.verb}する項目を選ぶ`}
          </Button>
          <button
            type="button"
            disabled={!selectedRows.length}
            onClick={() => setSelectedIds(new Set())}
            aria-label={selectedRows.length
              ? `選択中の${selectedRows.length.toLocaleString('ja-JP')}${content.unit}をすべて解除`
              : '選択中の項目はありません'}
            className="min-h-12 rounded-xl border border-brand-200 bg-white px-1 text-xs font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/35"
          >
            {selectedRows.length
              ? `${selectedRows.length.toLocaleString('ja-JP')}${content.unit} 解除`
              : `0${content.unit}`}
          </button>
        </div>
      </div>
    </div>
  )
}
