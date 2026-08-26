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
  VOCAB_CATALOG_DEFAULT_DIRECTIONS,
  VOCAB_CATALOG_SORT_OPTIONS,
  vocabularyCatalogRows,
} from '../lib/vocabCatalog.js'
import { Book, Cards, Check } from '../components/Icons.jsx'

const CATALOG_PAGE_SIZE = 80

const PRIORITY_META = Object.freeze({
  retry: { label: 'もう一度復習', className: 'bg-rose-50 text-rose-700' },
  due: { label: '復習どき', className: 'bg-amber-50 text-amber-800' },
  waiting: { label: '復習日を待つ', className: 'bg-emerald-50 text-emerald-700' },
  unlearned: { label: '未学習', className: 'bg-slate-100 text-slate-500' },
})

const ACTIVITY_DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

const activityDate = (timestamp) => (
  Number.isFinite(timestamp)
    ? ACTIVITY_DATE_FORMATTER.format(new Date(timestamp))
    : 'まだ'
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
        ['list', '一覧から復習'],
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

function CatalogWordRow({ row, selected, onToggle }) {
  const meta = PRIORITY_META[row.priority] ?? PRIORITY_META.unlearned
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${row.word.word}（${row.word.meaning}）を${selected ? '選択から外す' : '復習に選ぶ'}`}
      className={cx(
        'flex min-h-20 w-full items-start gap-3 rounded-xl border bg-white px-3 py-3 text-left transition-colors',
        selected
          ? 'border-brand-400 bg-brand-50 ring-1 ring-brand-300'
          : 'border-slate-200 active:bg-brand-50/60',
      )}
      data-vocab-catalog-word={row.word.id}
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
          <strong lang="en" className="break-words font-display text-lg font-extrabold leading-tight text-ink">
            {row.word.word}
          </strong>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">
            {row.word.pos}
          </span>
          <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-extrabold', meta.className)}>
            {meta.label}
          </span>
        </span>
        <span className="mt-1 block break-words text-sm font-bold leading-snug text-ink/75">
          {row.word.meaning}
        </span>
        <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-ink/45">
          <span>分野 {row.field}</span>
          <span>学習 {activityDate(row.memoryAt)}</span>
          <span>テスト {activityDate(row.testAt)}</span>
        </span>
      </span>
    </button>
  )
}

function VocabularyCatalog({ level, srs, navigate, onShowFields }) {
  const words = useMemo(() => wordsByLevel(level.id), [level.id])
  const [sort, setSort] = useState('weight')
  const [direction, setDirection] = useState(VOCAB_CATALOG_DEFAULT_DIRECTIONS.weight)
  const [visible, setVisible] = useState(CATALOG_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [now] = useState(() => Date.now())
  const rows = useMemo(
    () => vocabularyCatalogRows(words, srs, { sort, direction, now }),
    [direction, now, sort, srs, words],
  )
  const visibleRows = rows.slice(0, visible)
  const dueRows = rows.filter((row) => row.metrics.needsReview)
  const selectedRows = rows.filter((row) => selectedIds.has(row.word.id))

  useEffect(() => setVisible(CATALOG_PAGE_SIZE), [direction, sort])

  const chooseSort = (nextSort) => {
    setSort(nextSort)
    setDirection(VOCAB_CATALOG_DEFAULT_DIRECTIONS[nextSort] ?? 'desc')
  }

  const toggleWord = (wordId) => setSelectedIds((current) => {
    const next = new Set(current)
    if (next.has(wordId)) next.delete(wordId)
    else next.add(wordId)
    return next
  })

  const selectRows = (items) => setSelectedIds((current) => {
    const next = new Set(current)
    for (const row of items) next.add(row.word.id)
    return next
  })

  const startReview = () => {
    const ids = selectedRows.map((row) => row.word.id)
    if (!ids.length) return
    navigate('vocabStudy', {
      source: { type: 'deck', ids, preserveOrder: true },
      title: `英検${level.label}・選んだ単語`,
      mode: 'study',
      size: ids.length,
      returnTo: { screen: 'vocabDecks', params: { levelId: level.id, view: 'list' } },
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col" data-vocab-catalog={level.id}>
      <ScreenHeader
        title={`英検${level.label}の単語一覧`}
        subtitle={`全${words.length.toLocaleString('ja-JP')}語から選んで復習`}
      />

      <div className="shrink-0 space-y-2.5 border-b border-slate-200 bg-white px-3 pb-3 pt-2.5">
        <LevelViewTabs
          view="list"
          onChange={(nextView) => {
            if (nextView === 'fields') onShowFields()
          }}
        />
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
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!dueRows.length}
            onClick={() => selectRows(dueRows)}
            className="min-h-11 rounded-xl bg-amber-50 px-2 text-xs font-extrabold text-amber-800 active:bg-amber-100 disabled:opacity-45"
          >
            復習どき {dueRows.length.toLocaleString('ja-JP')}語を選ぶ
          </button>
          <button
            type="button"
            onClick={() => selectRows(visibleRows)}
            className="min-h-11 rounded-xl bg-brand-50 px-2 text-xs font-extrabold text-brand-700 active:bg-brand-100"
          >
            表示中の{visibleRows.length.toLocaleString('ja-JP')}語を選ぶ
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3" data-vocab-catalog-list>
        <p className="mb-2 px-1 text-xs font-extrabold text-ink/50" aria-live="polite">
          全{rows.length.toLocaleString('ja-JP')}語のうち{visibleRows.length.toLocaleString('ja-JP')}語を表示
        </p>
        <div className="space-y-2">
          {visibleRows.map((row) => (
            <CatalogWordRow
              key={row.word.id}
              row={row}
              selected={selectedIds.has(row.word.id)}
              onToggle={() => toggleWord(row.word.id)}
            />
          ))}
        </div>
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

      <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2.5" data-vocab-catalog-actions>
        <p className="sr-only" aria-live="polite">
          選択中 {selectedRows.length.toLocaleString('ja-JP')}語
        </p>
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] gap-2">
          <Button full disabled={!selectedRows.length} onClick={startReview} data-vocab-catalog-start-review>
            <Book size={17} />
            {selectedRows.length
              ? `選んだ${selectedRows.length.toLocaleString('ja-JP')}語を復習`
              : '復習する語を選ぶ'}
          </Button>
          <button
            type="button"
            disabled={!selectedRows.length}
            onClick={() => setSelectedIds(new Set())}
            aria-label={selectedRows.length
              ? `選択中の${selectedRows.length.toLocaleString('ja-JP')}語をすべて解除`
              : '選択中の単語はありません'}
            className="min-h-12 rounded-xl border border-brand-200 bg-white px-1 text-xs font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/35"
          >
            {selectedRows.length
              ? `${selectedRows.length.toLocaleString('ja-JP')}語 解除`
              : '0語'}
          </button>
        </div>
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
        navigate={navigate}
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
