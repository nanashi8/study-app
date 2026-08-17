import { useMemo, useState } from 'react'
import { isDue, useStore } from '../store/useStore.js'
import {
  KOTEN_GRAMMAR,
  KOTEN_GRAMMAR_CATEGORIES,
  kotenGrammarByCategory,
} from '../data/koten-grammar.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../data/koten-grammar-questions.js'
import {
  Button,
  Card,
  Chip,
  cx,
  IconButton,
} from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import {
  ArrowRight,
  Book,
  Bookmark,
  BookmarkFilled,
  Cards,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Refresh,
  Search,
} from '../components/Icons.jsx'

function CategoryCard({ meta, items, srs, questionCount, onStudy, onQuiz }) {
  const status = summarizeSrsItems(items, srs)
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${meta.color}20` }}
        >
          {meta.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-extrabold text-ink">{meta.label}</h3>
          <p className="mt-0.5 text-[11px] font-bold text-ink/45">
            {items.length}項目・{questionCount}問
          </p>
        </div>
      </div>
      <LearningStatusBars progress={status} className="mt-3" compact />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button size="sm" onClick={onStudy}>
          <Book size={16} /> 覚える
        </Button>
        <Button variant="secondary" size="sm" onClick={onQuiz}>
          <Cards size={16} /> 腕試し
        </Button>
      </div>
    </Card>
  )
}

export function KotenGrammarScreen() {
  const navigate = useStore((state) => state.navigate)
  const grammarSrs = useStore((state) => state.kotenGrammarSrs)
  const saved = useStore((state) => state.kotenGrammarList)
  const toggleSaved = useStore((state) => state.toggleKotenGrammarList)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  const totalStatus = summarizeSrsItems(KOTEN_GRAMMAR, grammarSrs)
  const dueItems = KOTEN_GRAMMAR.filter(
    (item) => grammarSrs[item.id] && isDue(grammarSrs[item.id]),
  )
  const savedItems = saved
    .map((id) => KOTEN_GRAMMAR.find((item) => item.id === id))
    .filter(Boolean)

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

  const study = (targetItems, title) =>
    navigate('kotenGrammarStudy', {
      ids: targetItems.map((item) => item.id),
      title,
    })
  const quiz = (targetItems, title) =>
    navigate('kotenGrammarQuiz', {
      ids: targetItems.map((item) => item.id),
      title,
    })

  return (
    <div className="pb-8">
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate('kotenList')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 transition-transform active:scale-95"
          >
            <ChevronLeft size={14} /> 古典アプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <p className="text-xs font-bold text-white/70">大学受験・古文文法</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">古典文法</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          覚える → 文中で見抜く → くり返して定着
        </p>

        <div className="mt-4 rounded-2xl bg-white/15 p-3.5">
          <div>
            <p className="font-display text-lg font-extrabold">
              全{KOTEN_GRAMMAR.length}項目・{KOTEN_GRAMMAR_QUESTIONS.length}問
            </p>
            <p className="mt-0.5 text-xs font-bold text-white/70">
              学習済 {totalStatus.learning.learned}・復習中 {totalStatus.learning.reviewing}・未学習 {totalStatus.learning.unlearned}・登録 {savedItems.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pt-5">
        <Card className="p-4" data-koten-grammar-status>
          <LearningStatusBars progress={totalStatus} compact />
        </Card>
        <section>
          <div className="mb-2 px-1">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-amber-600">LEARN → CHALLENGE</p>
            <h2 className="font-display text-lg font-extrabold text-ink">今日の古典文法</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => study(KOTEN_GRAMMAR, '古典文法・全範囲')}
              className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-left text-white shadow-card transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Book size={23} />
              </span>
              <span className="mt-3 block font-display text-lg font-extrabold">覚える</span>
              <span className="mt-1 block text-[11px] font-bold leading-relaxed text-white/75">
                意味・接続・活用をカードで想起
              </span>
            </button>
            <button
              onClick={() => quiz(KOTEN_GRAMMAR, '全範囲・受験型腕試し')}
              className="rounded-3xl bg-gradient-to-br from-slate-900 to-violet-900 p-4 text-left text-white shadow-card transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Cards size={23} />
              </span>
              <span className="mt-3 block font-display text-lg font-extrabold">腕試し</span>
              <span className="mt-1 block text-[11px] font-bold leading-relaxed text-white/65">
                識別・活用・敬語を入試型4択で
              </span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              disabled={!dueItems.length}
              onClick={() => study(dueItems, '古典文法の復習')}
              className="flex items-center gap-2 rounded-2xl bg-hint-soft p-3 text-left transition-transform active:scale-[0.98] disabled:opacity-45"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hint/20 text-hint">
                <Refresh size={19} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-amber-900">復習</span>
                <span className="block text-[11px] font-bold text-amber-800/65">{dueItems.length}項目</span>
              </span>
            </button>
            <button
              disabled={!savedItems.length}
              onClick={() => study(savedItems, '登録文法')}
              className="flex items-center gap-2 rounded-2xl bg-sky-100 p-3 text-left transition-transform active:scale-[0.98] disabled:opacity-45"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-200 text-sky-700">
                <BookmarkFilled size={19} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-sky-900">登録文法</span>
                <span className="block text-[11px] font-bold text-sky-800/60">{savedItems.length}項目</span>
              </span>
            </button>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-amber-600">COURSE</p>
              <h2 className="font-display text-lg font-extrabold text-ink">分野から学ぶ</h2>
            </div>
            <span className="text-[10px] font-bold text-ink/35">{KOTEN_GRAMMAR_CATEGORIES.length}分野</span>
          </div>
          <div className="space-y-3">
            {KOTEN_GRAMMAR_CATEGORIES.map((meta) => {
              const categoryItems = kotenGrammarByCategory(meta.id)
              const questionCount = KOTEN_GRAMMAR_QUESTIONS.filter(
                (question) => question.category === meta.id,
              ).length
              return (
                <CategoryCard
                  key={meta.id}
                  meta={meta}
                  items={categoryItems}
                  srs={grammarSrs}
                  questionCount={questionCount}
                  onStudy={() => study(categoryItems, `${meta.label}を覚える`)}
                  onQuiz={() => quiz(categoryItems, `${meta.label}・受験型腕試し`)}
                />
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-amber-600">REFERENCE</p>
              <h2 className="font-display text-lg font-extrabold text-ink">文法辞典</h2>
            </div>
            <button
              onClick={() => navigate('kotenSaved', { tab: 'grammar' })}
              className="flex items-center gap-1 text-xs font-extrabold text-amber-700"
            >
              <BookmarkFilled size={14} /> 登録リスト <ArrowRight size={14} />
            </button>
          </div>

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
            {KOTEN_GRAMMAR_CATEGORIES.map((meta) => (
              <button
                key={meta.id}
                onClick={() => setCategory(meta.id)}
                className={cx(
                  'shrink-0 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors',
                  category === meta.id ? 'text-white' : 'bg-white text-ink/55',
                )}
                style={category === meta.id ? { backgroundColor: meta.color } : undefined}
              >
                {meta.emoji} {meta.label} {kotenGrammarByCategory(meta.id).length}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-4 px-1 text-xs font-bold text-ink/45">{items.length}項目</p>
          <div className="space-y-2">
            {items.map((item) => {
              const open = openId === item.id
              const isSaved = saved.includes(item.id)
              const categoryMeta = KOTEN_GRAMMAR_CATEGORIES.find(
                (meta) => meta.id === item.category,
              )
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
                        <p className="text-[10px] font-extrabold tracking-wide text-amber-600">活用・形</p>
                        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75">{item.forms}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold tracking-wide text-amber-600">接続</p>
                        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75">{item.connection}</p>
                      </div>
                      <p className="text-sm font-bold leading-relaxed text-ink/65">{item.summary}</p>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="font-serif font-bold text-ink">{item.example.ja}</p>
                        <p className="mt-1 text-xs font-bold text-ink/50">{item.example.gendai}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" onClick={() => study([item], item.title)}>
                          <Book size={15} /> 覚える
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => quiz([item], item.title)}>
                          <Cards size={15} /> 腕試し
                        </Button>
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
        </section>
      </div>
    </div>
  )
}
