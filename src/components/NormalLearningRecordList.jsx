import { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { selectProgressState } from '../lib/progressCode.js'
import { LEARNING_CONTENTS } from '../lib/learningContentProgress.js'
import { learningContentCatalogRows } from '../lib/learningContentCatalog.js'
import {
  VOCAB_CATALOG_ACTIVITY_OPTIONS,
  vocabularyCatalogRecordedRows,
  vocabularyCatalogRemainingRows,
  vocabularyCatalogResultForDirection,
} from '../lib/vocabCatalog.js'
import { Button, cx } from './ui.jsx'
import {
  LearningRecordRow,
  VOCABULARY_HISTORY_ACTIVITY_META,
} from './VocabularyHistoryRow.jsx'

const DEFAULT_PAGE_SIZE = 80

/**
 * 各教材の通常画面に置く、学習・テスト記録用の共通一覧。
 * 一覧用の一時状態だけをここで持ち、結果は既存の教材別SRSへ保存する。
 */
export function NormalLearningRecordList({
  entryId,
  contentId,
  items = [],
  unit,
  pageSize = DEFAULT_PAGE_SIZE,
  onOpen,
  openLabel = '説明を見る',
  openHint = '説明',
  titleLanguage = 'ja',
  renderAfter,
  emptyMessage,
  className = '',
}) {
  const reviewLearningContent = useStore((state) => state.reviewLearningContent)
  const progressState = useStore(useShallow(selectProgressState))
  const [activity, setActivity] = useState('memory')
  const [dismissedByActivity, setDismissedByActivity] = useState(() => ({
    memory: new Set(),
    test: new Set(),
  }))
  const [visible, setVisible] = useState(pageSize)
  const [message, setMessage] = useState('')
  const [now] = useState(() => Date.now())
  const content = LEARNING_CONTENTS.find((candidate) => candidate.id === contentId)
  const normalizedItems = Array.isArray(items) ? items : []
  const itemKey = normalizedItems.map((item) => item?.id ?? item).join('\u001f')
  const itemUnit = unit ?? content?.unit ?? '項目'

  const rows = useMemo(() => {
    if (!content) return []
    const itemById = new Map(content.items.map((item) => [item.id, item]))
    // ID指定は教材の母集団から引く。長文ごとの固有表現のように母集団へ載らない
    // 項目も、同じ教材のSRSへ同じ形で記録するため、そのまま一覧へ通す。
    const selectedItems = normalizedItems
      .map((item) => typeof item === 'string' ? itemById.get(item) : item)
      .filter((item) => item?.id)
    const rowById = new Map(
      learningContentCatalogRows(
        { ...content, items: selectedItems },
        progressState,
        { now },
      ).map((row) => [row.id, row]),
    )
    return selectedItems
      .map((item) => rowById.get(item.id))
      .filter(Boolean)
  // itemKey is the stable identity and order of the caller's current filtered list.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, itemKey, now, progressState])

  const recordedMemory = vocabularyCatalogRecordedRows(rows, 'memory').length
  const recordedTest = vocabularyCatalogRecordedRows(rows, 'test').length
  const dismissedIds = dismissedByActivity[activity] ?? new Set()
  const remainingRows = vocabularyCatalogRemainingRows(rows, dismissedIds)
  const visibleRows = remainingRows.slice(0, visible)
  const activityMeta = VOCABULARY_HISTORY_ACTIVITY_META[activity]
    ?? VOCABULARY_HISTORY_ACTIVITY_META.memory

  useEffect(() => {
    setVisible(pageSize)
    setMessage('')
  }, [activity, entryId, itemKey, pageSize])

  if (!content) return null

  const swipeRow = (row, direction) => {
    const result = vocabularyCatalogResultForDirection(activity, direction)
    if (!result || !reviewLearningContent(contentId, row.id, result)) return
    const label = direction === 'left' ? activityMeta.leftLabel : activityMeta.rightLabel
    setDismissedByActivity((current) => {
      const next = new Set(current[activity])
      next.add(row.id)
      return { ...current, [activity]: next }
    })
    setMessage(`${row.title}を「${label}」として記録しました。`)
  }

  const restoreRows = () => {
    setDismissedByActivity((current) => ({ ...current, [activity]: new Set() }))
    setVisible(pageSize)
    setMessage(`${activity === 'test' ? 'テスト' : '学習'}の一覧を再表示しました。`)
  }

  return (
    <div
      className={cx('space-y-2.5', className)}
      data-normal-learning-record-list={entryId}
      data-normal-learning-record-content={contentId}
    >
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="一覧で記録する内容">
        {VOCAB_CATALOG_ACTIVITY_OPTIONS.map((option) => {
          const count = option.id === 'test' ? recordedTest : recordedMemory
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={activity === option.id}
              onClick={() => setActivity(option.id)}
              className={cx(
                'min-h-11 rounded-lg px-1 text-xs font-extrabold',
                activity === option.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-ink/55 active:bg-white/70',
              )}
              aria-label={`${option.label}。済み${count.toLocaleString('ja-JP')}${itemUnit}、全${rows.length.toLocaleString('ja-JP')}${itemUnit}`}
              data-normal-learning-record-activity-tab={option.id}
            >
              {option.id === 'test' ? 'テスト' : '学習'}
              <span className="ml-1 tabular-nums">{count.toLocaleString('ja-JP')}/{rows.length.toLocaleString('ja-JP')}{itemUnit}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <p
          className="flex min-h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-xl bg-brand-50 px-2 text-[10px] font-extrabold text-brand-800"
          aria-label={`左スワイプで${activityMeta.leftLabel}、右スワイプで${activityMeta.rightLabel}`}
          data-normal-learning-record-swipe-guide
        >
          <span aria-hidden="true">← {activityMeta.leftLabel}｜{activityMeta.rightLabel} →</span>
        </p>
        <button
          type="button"
          onClick={restoreRows}
          disabled={!dismissedIds.size}
          className="min-h-11 rounded-xl border border-brand-200 bg-white px-2 text-[10px] font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/35"
          aria-label="一覧を再表示"
          data-normal-learning-record-restore
        >
          一覧を再表示
        </button>
      </div>

      <p className="px-1 text-xs font-extrabold text-ink/50" aria-live="polite">
        {activity === 'test' ? 'テスト済' : '学習済'} {activity === 'test' ? recordedTest : recordedMemory}/{rows.length}{itemUnit}
        ・残り{remainingRows.length}{itemUnit}
      </p>
      <p className="sr-only" aria-live="polite" data-normal-learning-record-message>{message}</p>

      <div className="space-y-2" data-normal-learning-record-rows>
        {visibleRows.map((row) => (
          <div key={row.id} data-normal-learning-record-row-container={row.id}>
            <LearningRecordRow
              row={row}
              activity={activity}
              onSwipe={(direction) => swipeRow(row, direction)}
              onOpen={typeof onOpen === 'function' ? () => onOpen(row.item, row) : undefined}
              openLabel={openLabel}
              openHint={openHint}
              titleLanguage={titleLanguage}
            />
            {typeof renderAfter === 'function' && renderAfter(row.item, row)}
          </div>
        ))}
      </div>

      {!visibleRows.length && (
        <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm font-bold text-ink/50">
          {rows.length
            ? `この一覧をすべて確認しました。「一覧を再表示」で、同じ${content.label}をもう一度確認できます。`
            : emptyMessage ?? `表示できる${content.label}はありません。`}
        </p>
      )}

      {visible < remainingRows.length && (
        <Button
          full
          variant="secondary"
          onClick={() => setVisible((count) => Math.min(remainingRows.length, count + pageSize))}
        >
          さらに{Math.min(pageSize, remainingRows.length - visible).toLocaleString('ja-JP')}{itemUnit}を表示
        </Button>
      )}
    </div>
  )
}
