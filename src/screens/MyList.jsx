import { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore, todayIndex } from '../store/useStore.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Button, Card, Chip, EmptyState } from '../components/ui.jsx'
import {
  NOTEBOOK_LIMITS,
  parseNotebookRef,
} from '../lib/learningNotebook.js'
import {
  NOTEBOOK_DOMAINS,
  NOTEBOOK_DOMAIN_BY_ID,
  NOTEBOOK_TOTAL_ITEMS,
  isNotebookItemSaved,
  notebookItemProgress,
  notebookItemsForDomain,
  notebookLearningSummary,
  notebookRecentItems,
  notebookSavedCounts,
  notebookSavedRefs,
  notebookSetDomainGroups,
  resolveNotebookItem,
  searchNotebookItems,
} from '../lib/learningNotebookCatalog.js'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  Cards,
  Chart,
  Check,
  ChevronDown,
  ChevronUp,
  Close,
  Lightbulb,
  Plus,
  Search,
} from '../components/Icons.jsx'

const PAGE_SIZE = 40
const SESSION_LIMITS = Object.freeze({
  vocab: 20,
  phrases: 20,
  grammar: 10,
  listening: 20,
  etymology: 20,
  kotenVocab: 20,
  kotenGrammar: 20,
  kotenCulture: 12,
})

const STUDY_DOMAINS = new Set([
  'vocab',
  'phrases',
  'etymology',
  'kotenVocab',
  'kotenGrammar',
  'kotenCulture',
])

const FILTERS = [
  { id: 'saved', label: '保存中' },
  { id: 'due', label: '復習どき' },
  { id: 'studied', label: '学習済み' },
  { id: 'all', label: '全教材' },
]

const dateText = (timestamp) => {
  if (!Number.isFinite(timestamp)) return '日時なし'
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

const tagsFromText = (value) => String(value)
  .split(/[、,，\n]/)
  .map((tag) => tag.trim())
  .filter(Boolean)

function LearningStatus({ progress }) {
  if (!progress.entry) {
    return <span className="text-[10px] font-extrabold text-slate-400">未学習</span>
  }
  if (progress.due) {
    return <span className="text-[10px] font-extrabold text-rose-700">復習どき</span>
  }
  if (progress.box >= 4) {
    return <span className="text-[10px] font-extrabold text-emerald-700">定着段階 {progress.box}</span>
  }
  return (
    <span className="text-[10px] font-extrabold text-slate-500">
      学習 {progress.attempts}回・段階 {progress.box}
    </span>
  )
}

function NotebookItemCard({
  item,
  state,
  day,
  activeSet,
  onToggleSaved,
  onSaveNote,
  onToggleSet,
  onStart,
}) {
  const entry = state.learningNotebook?.entries?.[item.ref]
  const saved = isNotebookItemSaved(state, item.domain, item.id)
  const progress = notebookItemProgress(state, item.domain, item.id, day)
  const inSet = Boolean(activeSet?.refs.includes(item.ref))
  const [editing, setEditing] = useState(false)
  const [note, setNote] = useState(entry?.note ?? '')
  const [tags, setTags] = useState((entry?.tags ?? []).join('、'))
  const speechText = item.domain === 'vocab'
    ? item.raw.word
    : item.domain === 'phrases'
      ? item.raw.phrase
      : item.domain === 'grammar'
        ? item.raw.sentence?.en
        : null

  useEffect(() => {
    setNote(entry?.note ?? '')
    setTags((entry?.tags ?? []).join('、'))
  }, [item.ref, entry?.updatedAt])

  return (
    <Card className="overflow-hidden rounded-xl border-slate-300 shadow-none" data-notebook-item-ref={item.ref}>
      <div className="p-3">
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            onClick={() => onToggleSaved(item.domain, item.id)}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${saved ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}
            aria-label={saved ? `${item.title}をノートから外す` : `${item.title}をノートへ保存`}
            aria-pressed={saved}
          >
            {saved ? <BookmarkFilled size={19} /> : <Bookmark size={19} />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="break-words font-display text-[15px] font-extrabold leading-snug text-slate-950">
                {item.title}
              </h3>
              {item.level && <Chip className="px-2 py-0.5 text-[9px]" color={NOTEBOOK_DOMAIN_BY_ID[item.domain].color}>{item.level}</Chip>}
            </div>
            <p className="mt-0.5 break-words text-xs font-bold leading-relaxed text-slate-600">{item.subtitle}</p>
            {item.detail && <p className="mt-1 line-clamp-2 text-[10px] font-bold leading-relaxed text-slate-500">{item.detail}</p>}
          </div>
          {speechText && <SpeakButton text={speechText} size="sm" />}
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-2.5">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-extrabold text-slate-600">
            {NOTEBOOK_DOMAIN_BY_ID[item.domain].label}
          </span>
          {item.category && (
            <span className="max-w-full truncate rounded-md bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-500">
              {item.category}
            </span>
          )}
          <LearningStatus progress={progress} />
          {progress.attempts > 0 && (
            <span className="ml-auto text-[10px] font-extrabold tabular-nums text-slate-500">
              正答 {Math.round(progress.accuracy * 100)}%
            </span>
          )}
        </div>

        {(entry?.tags?.length > 0 || entry?.note) && (
          <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-2">
            {entry.tags?.length > 0 && (
              <div className="mb-1 flex flex-wrap gap-1">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-800">#{tag}</span>
                ))}
              </div>
            )}
            {entry.note && <p className="whitespace-pre-wrap text-[11px] font-bold leading-relaxed text-amber-950">{entry.note}</p>}
          </div>
        )}

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onStart(item.domain, [item], null, STUDY_DOMAINS.has(item.domain) ? 'study' : 'quiz')}
            className="min-h-10 rounded-lg bg-brand-600 px-2 text-[10px] font-extrabold text-white"
          >
            学習する
          </button>
          <button
            type="button"
            onClick={() => setEditing((open) => !open)}
            className="min-h-10 rounded-lg border border-slate-300 bg-white px-2 text-[10px] font-extrabold text-slate-700"
            aria-expanded={editing}
          >
            メモ・タグ
          </button>
          <button
            type="button"
            onClick={() => activeSet && onToggleSet(activeSet.id, item.domain, item.id, !inSet)}
            disabled={!activeSet}
            className={`min-h-10 rounded-lg border px-2 text-[10px] font-extrabold ${inSet ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-white text-slate-700'} disabled:bg-slate-100 disabled:text-slate-400`}
          >
            {inSet ? '問題集から外す' : '問題集へ追加'}
          </button>
        </div>
      </div>

      {editing && (
        <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-3" data-notebook-note-editor>
          <label className="block">
            <span className="text-[10px] font-extrabold text-slate-600">自分のメモ（最大{NOTEBOOK_LIMITS.noteLength.toLocaleString()}字）</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={NOTEBOOK_LIMITS.noteLength}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold leading-relaxed text-slate-900 outline-none focus:border-brand-500"
              placeholder="覚え方、間違えた理由、授業の補足など"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-extrabold text-slate-600">タグ（読点またはカンマ区切り）</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-brand-500"
              placeholder="例：入試、苦手、授業ノート"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              キャンセル
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onSaveNote(item.domain, item.id, { note, tags: tagsFromText(tags) })
                setEditing(false)
              }}
            >
              <Check size={15} /> 保存
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

function ProblemSetCard({
  set,
  onUpdate,
  onDelete,
  onMove,
  onRemove,
  onStart,
  onSelectForEditing,
  selected,
}) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [title, setTitle] = useState(set.title)
  const [description, setDescription] = useState(set.description)
  const groups = useMemo(() => notebookSetDomainGroups(set), [set])

  useEffect(() => {
    setTitle(set.title)
    setDescription(set.description)
  }, [set.title, set.description])

  return (
    <Card className={`overflow-hidden rounded-xl shadow-none ${selected ? 'border-2 border-brand-500' : 'border-slate-300'}`} data-notebook-set-id={set.id}>
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={() => onSelectForEditing(set.id)} className="min-w-0 flex-1 text-left">
            <p className="font-display text-base font-extrabold text-slate-950">{set.title}</p>
            <p className="mt-0.5 text-[10px] font-bold leading-relaxed text-slate-500">
              {set.description || '説明なし'}・{set.refs.length}項目
            </p>
          </button>
          <button
            type="button"
            onClick={() => setEditing((open) => !open)}
            className="min-h-10 shrink-0 rounded-lg border border-slate-300 px-2.5 text-[10px] font-extrabold text-slate-700"
          >
            編集
          </button>
        </div>

        {set.refs.length > 0 ? (
          <div className="mt-3 space-y-2">
            {NOTEBOOK_DOMAINS.map((domain) => {
              const items = groups[domain.id]
              if (!items.length) return null
              return (
                <div key={domain.id} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                  <span className="text-base">{domain.emoji}</span>
                  <span className="min-w-0 flex-1 text-[11px] font-extrabold text-slate-700">
                    {domain.label} {items.length}{domain.unit}
                  </span>
                  {STUDY_DOMAINS.has(domain.id) && (
                    <button
                      type="button"
                      onClick={() => onStart(domain.id, items, set, 'study')}
                      className="min-h-9 rounded-md border border-brand-200 bg-white px-2 text-[9px] font-extrabold text-brand-700"
                    >
                      カード
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onStart(domain.id, items, set, 'quiz')}
                    className="min-h-9 rounded-md bg-slate-800 px-2 text-[9px] font-extrabold text-white"
                  >
                    {domain.id === 'etymology' ? '確認' : '問題'}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-4 text-center text-[11px] font-bold text-slate-500">
            上の「ノート」タブで、この問題集を選んで教材を追加してください。
          </p>
        )}
      </div>

      {editing && (
        <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-3" data-notebook-set-editor>
          <label className="block">
            <span className="text-[10px] font-extrabold text-slate-600">問題集名</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={NOTEBOOK_LIMITS.setTitleLength}
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold outline-none focus:border-brand-500"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-extrabold text-slate-600">目的・説明</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={NOTEBOOK_LIMITS.setDescriptionLength}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-brand-500"
            />
          </label>
          <Button
            full
            size="sm"
            onClick={() => {
              onUpdate(set.id, { title, description })
              setEditing(false)
            }}
          >
            変更を保存
          </Button>

          {set.refs.length > 0 && (
            <details className="rounded-lg border border-slate-300 bg-white">
              <summary className="min-h-11 cursor-pointer px-3 py-3 text-xs font-extrabold text-slate-700">
                項目の順番・削除を編集（{set.refs.length}項目）
              </summary>
              <div className="divide-y divide-slate-200 border-t border-slate-200">
                {set.refs.map((ref, index) => {
                  const item = resolveNotebookItem(ref)
                  if (!item) return null
                  return (
                    <div key={ref} className="flex items-center gap-1.5 px-2 py-2">
                      <span className="w-6 shrink-0 text-center text-[9px] font-extrabold text-slate-400">{index + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-slate-700">{item.title}</span>
                      <button
                        type="button"
                        onClick={() => onMove(set.id, ref, 'up')}
                        disabled={index === 0}
                        aria-label={`${item.title}を上へ`}
                        className="grid h-9 w-9 place-items-center rounded-md text-slate-600 disabled:opacity-20"
                      >
                        <ChevronUp size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(set.id, ref, 'down')}
                        disabled={index === set.refs.length - 1}
                        aria-label={`${item.title}を下へ`}
                        className="grid h-9 w-9 place-items-center rounded-md text-slate-600 disabled:opacity-20"
                      >
                        <ChevronDown size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const parsed = parseNotebookRef(ref)
                          if (parsed) onRemove(set.id, parsed.domain, parsed.itemId)
                        }}
                        aria-label={`${item.title}を問題集から外す`}
                        className="grid h-9 w-9 place-items-center rounded-md text-rose-600"
                      >
                        <Close size={17} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </details>
          )}

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="min-h-10 w-full rounded-lg text-xs font-extrabold text-rose-700"
            >
              この問題集を削除
            </button>
          ) : (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs font-extrabold text-rose-900">「{set.title}」を削除しますか？ 教材のメモと学習履歴は残ります。</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button size="sm" variant="secondary" onClick={() => setConfirmDelete(false)}>戻る</Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(set.id)}>削除</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

function HistoryPanel({ state, day, onOpenProgress, onOpenDictionary }) {
  const summary = useMemo(() => notebookLearningSummary(state, day), [state, day])
  const recent = useMemo(() => notebookRecentItems(state, { limit: 80, day }), [state, day])
  const sessions = state.learningNotebook.sessions ?? []

  return (
    <div className="space-y-4" data-notebook-history>
      <section className="grid grid-cols-3 gap-2">
        {[
          ['学習済み', summary.studied, '項目'],
          ['回答・判定', summary.attempts, '回'],
          ['復習どき', summary.due, '項目'],
        ].map(([label, value, unit]) => (
          <div key={label} className="rounded-xl border border-slate-300 bg-white p-3 text-center">
            <p className="font-display text-xl font-extrabold tabular-nums text-slate-950">{value.toLocaleString()}</p>
            <p className="text-[9px] font-extrabold text-slate-500">{label}・{unit}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-2 px-1">
          <h2 className="font-display text-base font-extrabold text-slate-950">8分野の記録</h2>
          <p className="text-[10px] font-bold text-slate-500">正誤・覚えた／まだから自動集計</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {NOTEBOOK_DOMAINS.map((domain) => {
            const item = summary.domains[domain.id]
            return (
              <div key={domain.id} className="rounded-lg border border-slate-300 bg-white p-2.5">
                <div className="flex items-center gap-2">
                  <span>{domain.emoji}</span>
                  <span className="text-[11px] font-extrabold text-slate-800">{domain.label}</span>
                </div>
                <p className="mt-1 font-display text-lg font-extrabold text-slate-950">{item.studied.toLocaleString()}<span className="ml-1 text-[9px] text-slate-500">項目</span></p>
                <p className="text-[9px] font-bold text-slate-500">判定 {item.attempts.toLocaleString()}回・復習 {item.due}</p>
              </div>
            )
          })}
        </div>
      </section>

      {sessions.length > 0 && (
        <section>
          <div className="mb-2 px-1">
            <h2 className="font-display text-base font-extrabold text-slate-950">問題集の利用履歴</h2>
            <p className="text-[10px] font-bold text-slate-500">自作問題集から開始した記録</p>
          </div>
          <div className="space-y-1.5">
            {sessions.slice(0, 12).map((session) => {
              const domain = NOTEBOOK_DOMAIN_BY_ID[session.domain]
              return (
                <div key={session.id} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5">
                  <span>{domain.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-extrabold text-slate-800">{session.setTitle || '個別学習'}</p>
                    <p className="text-[9px] font-bold text-slate-500">{domain.label}・{session.mode === 'study' ? 'カード' : '問題'}・{session.count}項目</p>
                  </div>
                  <span className="text-[9px] font-extrabold text-slate-400">{dateText(session.startedAt)}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section>
        <div className="mb-2 px-1">
          <h2 className="font-display text-base font-extrabold text-slate-950">最近学習した項目</h2>
          <p className="text-[10px] font-bold text-slate-500">新しい判定順・最大80項目</p>
        </div>
        {recent.length ? (
          <div className="space-y-1.5">
            {recent.map(({ item, progress }) => (
              <div key={item.ref} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5">
                <span>{NOTEBOOK_DOMAIN_BY_ID[item.domain].emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-extrabold text-slate-800">{item.title}</p>
                  <p className="truncate text-[9px] font-bold text-slate-500">{item.subtitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-extrabold tabular-nums text-slate-700">
                    {progress.correct}/{progress.attempts}
                  </p>
                  <p className={`text-[9px] font-extrabold ${progress.due ? 'text-rose-700' : 'text-slate-400'}`}>
                    {progress.due ? '復習どき' : dateText(progress.lastAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="📝" title="まだ学習記録がありません">
            ノートや問題集から学習すると、8分野の正誤と復習時期がここへ集まります。
          </EmptyState>
        )}
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" onClick={onOpenDictionary}><Search size={15} /> 辞書履歴</Button>
        <Button variant="secondary" size="sm" onClick={onOpenProgress}><Chart size={15} /> 全進捗</Button>
      </div>
    </div>
  )
}

export function MyListScreen() {
  const navigate = useStore((state) => state.navigate)
  const toggleNotebookItem = useStore((state) => state.toggleNotebookItem)
  const updateNotebookItem = useStore((state) => state.updateNotebookItem)
  const createNotebookSet = useStore((state) => state.createNotebookSet)
  const updateNotebookSet = useStore((state) => state.updateNotebookSet)
  const deleteNotebookSet = useStore((state) => state.deleteNotebookSet)
  const setNotebookSetItem = useStore((state) => state.setNotebookSetItem)
  const moveNotebookSetItem = useStore((state) => state.moveNotebookSetItem)
  const recordNotebookSetLaunch = useStore((state) => state.recordNotebookSetLaunch)
  const state = useStore(useShallow((current) => ({
    srs: current.srs,
    etymologySrs: current.etymologySrs,
    kotenSrs: current.kotenSrs,
    kotenGrammarSrs: current.kotenGrammarSrs,
    kotenCultureSrs: current.kotenCultureSrs,
    myList: current.myList,
    myGrammarList: current.myGrammarList,
    kotenWordList: current.kotenWordList,
    kotenGrammarList: current.kotenGrammarList,
    kotenCultureList: current.kotenCultureList,
    learningNotebook: current.learningNotebook,
  })))
  const [tab, setTab] = useState('notebook')
  const [domain, setDomain] = useState('all')
  const [filter, setFilter] = useState('saved')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [activeSetId, setActiveSetId] = useState(state.learningNotebook.sets[0]?.id ?? '')
  const [newSetOpen, setNewSetOpen] = useState(false)
  const [newSetTitle, setNewSetTitle] = useState('')
  const [newSetDescription, setNewSetDescription] = useState('')
  const day = todayIndex()

  useEffect(() => {
    if (activeSetId && !state.learningNotebook.sets.some((set) => set.id === activeSetId)) {
      setActiveSetId(state.learningNotebook.sets[0]?.id ?? '')
    }
  }, [activeSetId, state.learningNotebook.sets])

  useEffect(() => setVisible(PAGE_SIZE), [domain, filter, query])

  const savedRefs = useMemo(() => notebookSavedRefs(state), [state])
  const savedRefSet = useMemo(() => new Set(savedRefs), [savedRefs])
  const savedCounts = useMemo(() => notebookSavedCounts(state), [state])
  const learningSummary = useMemo(() => notebookLearningSummary(state, day), [state, day])
  const activeSet = state.learningNotebook.sets.find((set) => set.id === activeSetId) ?? null

  const filteredItems = useMemo(() => {
    const domains = domain === 'all' ? NOTEBOOK_DOMAINS.map((item) => item.id) : [domain]
    const items = domains.flatMap((domainId) => searchNotebookItems(domainId, query))
    const selected = items.filter((item) => {
      if (filter === 'saved') return savedRefSet.has(item.ref)
      const progress = notebookItemProgress(state, item.domain, item.id, day)
      if (filter === 'due') return progress.due
      if (filter === 'studied') return Boolean(progress.entry)
      return true
    })
    if (filter === 'due') {
      selected.sort((a, b) => {
        const aProgress = notebookItemProgress(state, a.domain, a.id, day)
        const bProgress = notebookItemProgress(state, b.domain, b.id, day)
        return (aProgress.entry?.due ?? day) - (bProgress.entry?.due ?? day)
          || aProgress.box - bProgress.box
      })
    }
    return selected
  }, [day, domain, filter, query, savedRefSet, state])

  const startDomain = (domainId, sourceItems, set = null, requestedMode = 'quiz') => {
    const limit = SESSION_LIMITS[domainId] ?? 20
    const items = [...sourceItems]
      .sort((a, b) => {
        const aProgress = notebookItemProgress(state, domainId, a.id, day)
        const bProgress = notebookItemProgress(state, domainId, b.id, day)
        const rank = (progress) => progress.due ? 0 : !progress.entry ? 1 : 2
        return rank(aProgress) - rank(bProgress) || aProgress.box - bProgress.box
      })
      .slice(0, limit)
    const ids = items.map((item) => item.id)
    if (!ids.length) return
    const meta = NOTEBOOK_DOMAIN_BY_ID[domainId]
    const mode = requestedMode === 'study' && STUDY_DOMAINS.has(domainId) ? 'study' : 'quiz'
    const title = set?.title ?? `${meta.label}・マイノート`
    if (set) {
      recordNotebookSetLaunch({
        setId: set.id,
        setTitle: set.title,
        domain: domainId,
        mode,
        count: ids.length,
      })
    }

    if (domainId === 'vocab') {
      navigate(mode === 'study' ? 'vocabStudy' : 'vocabQuiz', {
        source: { type: 'mylist', ids },
        title,
        mode,
        size: ids.length,
      })
    } else if (domainId === 'phrases') {
      navigate(mode === 'study' ? 'phraseStudy' : 'phraseQuiz', {
        source: { type: 'phraseList', ids },
        title,
        mode,
        engine: 'phrase',
        size: ids.length,
      })
    } else if (domainId === 'grammar') {
      navigate('grammarQuiz', { source: { type: 'grammarList', ids }, title })
    } else if (domainId === 'listening') {
      navigate('listeningQuiz', {
        source: { type: 'listeningList', ids },
        title,
        engine: 'listening',
      })
    } else if (domainId === 'etymology') {
      navigate('etymologyStudy', {
        mode: 'all',
        status: 'all',
        packIds: ids,
        size: ids.length,
        title,
      })
    } else if (domainId === 'kotenVocab') {
      navigate(mode === 'study' ? 'kotenStudy' : 'kotenQuiz', { ids, title })
    } else if (domainId === 'kotenGrammar') {
      navigate(mode === 'study' ? 'kotenGrammarStudy' : 'kotenGrammarQuiz', {
        ids,
        title,
        size: ids.length,
      })
    } else if (domainId === 'kotenCulture') {
      navigate(mode === 'study' ? 'kotenCultureStudy' : 'kotenCultureQuiz', {
        ids,
        title,
        size: ids.length,
      })
    }
  }

  const createSet = () => {
    const setId = createNotebookSet(newSetTitle, newSetDescription)
    if (!setId) return
    setActiveSetId(setId)
    setNewSetTitle('')
    setNewSetDescription('')
    setNewSetOpen(false)
  }

  return (
    <div className="pb-6" data-learning-notebook-screen>
      <ScreenHeader
        title="マイ学習ノート"
        subtitle={`8分野・全${NOTEBOOK_TOTAL_ITEMS.toLocaleString()}項目を自分用に編集`}
      />

      <div className="space-y-4 px-3.5">
        <section className="overflow-hidden rounded-xl border-2 border-slate-700 bg-white" data-learning-notebook-summary>
          <div className="bg-slate-800 px-4 py-3 text-white">
            <p className="text-[9px] font-extrabold tracking-[0.16em] text-slate-300">PERSONAL NOTEBOOK & WORKBOOK</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-lg font-extrabold">保存・メモ・問題集・学習記録</p>
                <p className="mt-0.5 text-[10px] font-bold text-slate-300">これまでのマイ単語と古典の登録もそのまま引き継ぎ</p>
              </div>
              <p className="font-display text-3xl font-extrabold tabular-nums">{savedRefs.length.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
            {[
              ['保存項目', savedRefs.length],
              ['自作問題集', state.learningNotebook.sets.length],
              ['復習どき', learningSummary.due],
            ].map(([label, value]) => (
              <div key={label} className="px-2 py-2.5">
                <p className="font-display text-lg font-extrabold tabular-nums text-slate-950">{value.toLocaleString()}</p>
                <p className="text-[9px] font-extrabold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-3 rounded-xl border border-slate-300 bg-slate-100 p-1" role="tablist" aria-label="マイ学習ノートの機能">
          {[
            ['notebook', 'ノート'],
            ['sets', '問題集'],
            ['history', '履歴'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`min-h-10 rounded-lg text-xs font-extrabold ${tab === id ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'notebook' && (
          <div className="space-y-3" data-notebook-library>
            <div className="-mx-3.5 overflow-x-auto px-3.5 pb-1">
              <div className="flex min-w-max gap-2">
                <button
                  type="button"
                  onClick={() => setDomain('all')}
                  className={`min-h-14 min-w-24 rounded-xl border px-3 text-left ${domain === 'all' ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
                >
                  <span className="block text-[11px] font-extrabold">すべて</span>
                  <span className="block text-[9px] font-bold opacity-70">保存 {savedRefs.length} / 全 {NOTEBOOK_TOTAL_ITEMS.toLocaleString()}</span>
                </button>
                {NOTEBOOK_DOMAINS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDomain(item.id)}
                    className={`min-h-14 min-w-28 rounded-xl border px-3 text-left ${domain === item.id ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
                  >
                    <span className="block text-[11px] font-extrabold">{item.emoji} {item.label}</span>
                    <span className="block text-[9px] font-bold opacity-70">保存 {savedCounts[item.id]} / 全 {notebookItemsForDomain(item.id).length.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={17} /></span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-brand-500"
                placeholder={`${domain === 'all' ? '8分野' : NOTEBOOK_DOMAIN_BY_ID[domain].label}を見出し・意味・本文から検索`}
                aria-label="ノート教材を検索"
              />
            </label>

            <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`min-h-10 rounded-lg px-1 text-[10px] font-extrabold ${filter === item.id ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-300 bg-white p-3">
              <div className="flex items-center gap-2">
                <Cards size={17} className="text-brand-700" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold text-slate-800">追加先の問題集</p>
                  <p className="truncate text-[9px] font-bold text-slate-500">各教材の「問題集へ追加」で編集</p>
                </div>
                {state.learningNotebook.sets.length ? (
                  <select
                    value={activeSetId}
                    onChange={(event) => setActiveSetId(event.target.value)}
                    className="h-10 max-w-[45%] rounded-lg border border-slate-300 bg-white px-2 text-[10px] font-extrabold text-slate-700"
                    aria-label="追加先の問題集"
                  >
                    {state.learningNotebook.sets.map((set) => <option key={set.id} value={set.id}>{set.title}</option>)}
                  </select>
                ) : (
                  <button type="button" onClick={() => { setTab('sets'); setNewSetOpen(true) }} className="min-h-10 rounded-lg bg-brand-600 px-3 text-[10px] font-extrabold text-white">
                    作成する
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-extrabold text-slate-700">該当 {filteredItems.length.toLocaleString()}項目</p>
              {query && <button type="button" onClick={() => setQuery('')} className="text-[10px] font-extrabold text-brand-700">検索を消す</button>}
            </div>

            {filteredItems.length ? (
              <div className="space-y-2.5">
                {filteredItems.slice(0, visible).map((item) => (
                  <NotebookItemCard
                    key={item.ref}
                    item={item}
                    state={state}
                    day={day}
                    activeSet={activeSet}
                    onToggleSaved={toggleNotebookItem}
                    onSaveNote={updateNotebookItem}
                    onToggleSet={setNotebookSetItem}
                    onStart={startDomain}
                  />
                ))}
                {visible < filteredItems.length && (
                  <Button full variant="secondary" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
                    さらに {Math.min(PAGE_SIZE, filteredItems.length - visible)}項目を表示
                  </Button>
                )}
              </div>
            ) : (
              <EmptyState icon="📚" title="この条件の項目はありません">
                {filter === 'saved'
                  ? '「全教材」に切り替えて検索し、しおりを押すと自分のノートへ保存できます。'
                  : '分野・検索語・表示条件を変えてください。'}
              </EmptyState>
            )}

            <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-3">
              <Button variant="secondary" size="sm" onClick={() => navigate('vocabCamera')}>📷 教科書OCR</Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('myGrammar')}><Lightbulb size={15} /> 英作文の文法</Button>
            </div>
          </div>
        )}

        {tab === 'sets' && (
          <div className="space-y-3" data-notebook-workbooks>
            <div className="rounded-xl border border-slate-300 bg-white p-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-brand-700"><Plus size={19} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-slate-900">自分専用の問題集を作る</p>
                  <p className="text-[10px] font-bold leading-relaxed text-slate-500">8分野を混ぜて整理し、分野ごとの最適な出題形式で学習</p>
                </div>
                <button type="button" onClick={() => setNewSetOpen((open) => !open)} className="min-h-10 rounded-lg bg-brand-600 px-3 text-[10px] font-extrabold text-white">
                  新規
                </button>
              </div>
              {newSetOpen && (
                <div className="mt-3 space-y-2 border-t border-slate-200 pt-3" data-new-notebook-set>
                  <input
                    value={newSetTitle}
                    onChange={(event) => setNewSetTitle(event.target.value)}
                    maxLength={NOTEBOOK_LIMITS.setTitleLength}
                    className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-bold outline-none focus:border-brand-500"
                    placeholder="問題集名（例：定期テスト直前）"
                    aria-label="新しい問題集名"
                  />
                  <textarea
                    value={newSetDescription}
                    onChange={(event) => setNewSetDescription(event.target.value)}
                    maxLength={NOTEBOOK_LIMITS.setDescriptionLength}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold outline-none focus:border-brand-500"
                    placeholder="目的や使い方（任意）"
                    aria-label="新しい問題集の説明"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setNewSetOpen(false)}>キャンセル</Button>
                    <Button size="sm" disabled={!newSetTitle.trim()} onClick={createSet}>作成</Button>
                  </div>
                </div>
              )}
            </div>

            {state.learningNotebook.sets.length ? (
              <div className="space-y-2.5">
                {state.learningNotebook.sets.map((set) => (
                  <ProblemSetCard
                    key={set.id}
                    set={set}
                    selected={set.id === activeSetId}
                    onSelectForEditing={setActiveSetId}
                    onUpdate={updateNotebookSet}
                    onDelete={deleteNotebookSet}
                    onMove={moveNotebookSetItem}
                    onRemove={(setId, domainId, itemId) => setNotebookSetItem(setId, domainId, itemId, false)}
                    onStart={startDomain}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon="🗂️" title="まだ自作問題集がありません">
                問題集を作った後、「ノート」タブで追加先を選び、教材を自由に集められます。
              </EmptyState>
            )}

            <p className="rounded-xl bg-slate-100 px-3 py-3 text-[10px] font-bold leading-relaxed text-slate-600">
              1冊に最大{NOTEBOOK_LIMITS.itemsPerSet}項目、最大{NOTEBOOK_LIMITS.sets}冊。1回の学習は分野に応じて10〜20項目を、復習期限・未学習・定着段階の順で優先します。
            </p>
          </div>
        )}

        {tab === 'history' && (
          <HistoryPanel
            state={state}
            day={day}
            onOpenDictionary={() => navigate('vocabSearch')}
            onOpenProgress={() => navigate('progress')}
          />
        )}

        <button
          type="button"
          onClick={() => navigate('myLearning')}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 text-left"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700"><Chart size={17} /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-extrabold text-slate-800">全教科のマイ学習索引</span>
            <span className="block text-[10px] font-bold text-slate-500">長文・英作文・数学を含む学習済み項目</span>
          </span>
          <ArrowRight size={17} className="text-slate-400" />
        </button>
      </div>
    </div>
  )
}
