import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  KOTEN_GRAMMAR,
  KOTEN_GRAMMAR_CATEGORIES,
  kotenGrammarByCategory,
} from '../data/koten-grammar.js'
import { Chip, cx, IconButton } from '../components/ui.jsx'
import {
  Bookmark,
  BookmarkFilled,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Search,
} from '../components/Icons.jsx'

export function KotenGrammarScreen() {
  const navigate = useStore((state) => state.navigate)
  const saved = useStore((state) => state.kotenGrammarList)
  const toggleSaved = useStore((state) => state.toggleKotenGrammarList)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  const items = useMemo(() => {
    const base = category === 'all' ? KOTEN_GRAMMAR : kotenGrammarByCategory(category)
    const normalized = query.trim().toLowerCase()
    if (!normalized) return base
    return base.filter((item) =>
      [item.title, item.forms, item.connection, item.meaning, item.summary]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    )
  }, [category, query])

  return (
    <div className="pb-7">
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <button
          onClick={() => navigate('kotenList')}
          className="mb-3 flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 transition-transform active:scale-95"
        >
          <ChevronLeft size={14} /> 古典アプリ
        </button>
        <p className="text-xs font-bold text-white/75">接続・活用・意味を一つに</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">古典文法</h1>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/15 p-3">
          <div>
            <div className="font-display font-extrabold">全{KOTEN_GRAMMAR.length}項目</div>
            <div className="text-xs font-bold text-white/75">登録済み {saved.length}項目</div>
          </div>
          <button
            onClick={() => navigate('kotenSaved', { tab: 'grammar' })}
            className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-amber-700 transition-transform active:scale-95"
          >
            <BookmarkFilled size={16} /> 登録文法
          </button>
        </div>
      </div>

      <div className="px-4 pt-5">
        <label className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
          <Search size={18} className="text-ink/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="助動詞・意味・接続で検索"
            aria-label="古典文法を検索"
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-ink/30"
          />
        </label>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory('all')}
            className={cx(
              'shrink-0 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors',
              category === 'all' ? 'bg-amber-600 text-white' : 'bg-white text-ink/55',
            )}
          >
            すべて {KOTEN_GRAMMAR.length}
          </button>
          {KOTEN_GRAMMAR_CATEGORIES.map((item) => (
            <button
              key={item.id}
              onClick={() => setCategory(item.id)}
              className={cx(
                'shrink-0 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors',
                category === item.id ? 'text-white' : 'bg-white text-ink/55',
              )}
              style={category === item.id ? { backgroundColor: item.color } : undefined}
            >
              {item.emoji} {item.label} {kotenGrammarByCategory(item.id).length}
            </button>
          ))}
        </div>

        <p className="mb-2 mt-4 px-1 text-xs font-bold text-ink/45">{items.length}項目</p>
        <div className="space-y-2">
          {items.map((item) => {
            const open = openId === item.id
            const isSaved = saved.includes(item.id)
            const categoryMeta = KOTEN_GRAMMAR_CATEGORIES.find((meta) => meta.id === item.category)
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="flex items-center gap-2 p-3">
                  <button
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={open}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-extrabold text-ink">{item.title}</span>
                      {categoryMeta && <Chip color={categoryMeta.color}>{categoryMeta.label}</Chip>}
                    </div>
                    <p className="mt-1 text-xs font-bold text-ink/55">{item.meaning}</p>
                  </button>
                  <IconButton
                    onClick={() => toggleSaved(item.id)}
                    aria-label={isSaved ? `${item.title}を登録から外す` : `${item.title}を登録する`}
                    aria-pressed={isSaved}
                    className={isSaved ? 'text-amber-600' : 'text-ink/25'}
                  >
                    {isSaved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                  </IconButton>
                  <button
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-label={open ? '説明を閉じる' : '説明を開く'}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink/35 active:bg-paper"
                  >
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {open && (
                  <div className="space-y-3 border-t border-amber-100 bg-amber-50/60 p-4 animate-slide-up">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wide text-amber-600">活用・形</div>
                      <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75">{item.forms}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wide text-amber-600">接続</div>
                      <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75">{item.connection}</p>
                    </div>
                    <p className="text-sm font-bold leading-relaxed text-ink/65">{item.summary}</p>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="font-serif font-bold text-ink">{item.example.ja}</p>
                      <p className="mt-1 text-xs font-bold text-ink/50">{item.example.gendai}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!items.length && (
          <div className="rounded-3xl bg-white/60 px-6 py-10 text-center">
            <div className="text-4xl">🔎</div>
            <p className="mt-2 font-bold text-ink/70">一致する文法がありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
