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
  cx,
} from '../components/ui.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { summarizeSrsItemsWithQuestions } from '../lib/contentProgress.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import {
  ArrowRight,
  Book,
  Bookmark,
  BookmarkFilled,
  Cards,
  ChevronLeft,
  Refresh,
  Search,
} from '../components/Icons.jsx'

function CategoryCard({ meta, items, srs, questions, quizResults, onStudy, onQuiz, onCatalog }) {
  const status = summarizeSrsItemsWithQuestions({
    items,
    srs,
    questions,
    quizResults,
    quizDomain: 'koten-grammar',
  })
  return (
    <LearningEntryCard
      data-koten-grammar-category={meta.id}
      emoji={meta.emoji}
      accentColor={meta.color}
      title={meta.label}
      countLabel={`${items.length}項目`}
      subtitle={`${items.length}項目・${questions.length}問`}
      status={status}
      units={{ learning: '項目', quiz: '問' }}
      studyAriaLabel={`${meta.label}の古典文法を暗記`}
      onStudy={onStudy}
      quizAriaLabel={`${meta.label}の古典文法をテスト`}
      onQuiz={onQuiz}
      catalogLabel="一覧を確認"
      catalogAriaLabel={`${meta.label}の古典文法を一覧で確認する`}
      onCatalog={onCatalog}
    />
  )
}

export function KotenGrammarScreen() {
  const navigate = useStore((state) => state.navigate)
  const params = useStore((state) => state.params)
  const grammarSrs = useStore((state) => state.kotenGrammarSrs)
  const saved = useStore((state) => state.kotenGrammarList)
  const toggleSaved = useStore((state) => state.toggleKotenGrammarList)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)
  const [view, setView] = useState(params.view === 'list' ? 'list' : 'home')

  const quizResults = useStore((state) => state.contentQuizResults)
  const totalStatus = summarizeSrsItemsWithQuestions({
    items: KOTEN_GRAMMAR,
    srs: grammarSrs,
    questions: KOTEN_GRAMMAR_QUESTIONS,
    quizResults,
    quizDomain: 'koten-grammar',
  })
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
  const openCatalog = (categoryId = 'all') => {
    scrollScreenToTop()
    setCategory(categoryId)
    setQuery('')
    setView('list')
  }

  const homeView = (
    <div className="pb-8">
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500 px-5 pb-7 pt-5 text-white">
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
          暗記 → 文中で見抜く → 日を空けてもう一度確認
        </p>

        <div className="mt-4 rounded-2xl bg-white/15 p-3.5">
          <div>
            <p className="font-display text-lg font-extrabold">
              全{KOTEN_GRAMMAR.length}項目・全{KOTEN_GRAMMAR_QUESTIONS.length}問
            </p>
            <p className="mt-0.5 text-xs font-bold text-white/70">
              学習済 {totalStatus.learning.learned}・復習中 {totalStatus.learning.reviewing}・未学習 {totalStatus.learning.unlearned}・登録 {savedItems.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pt-5">
        <Card className="p-4" data-koten-grammar-status>
          <LearningStatusBars progress={totalStatus} compact units={{ learning: '項目', quiz: '問' }} />
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
              <span className="mt-3 block font-display text-lg font-extrabold">暗記</span>
              <span className="mt-1 block text-[11px] font-bold leading-relaxed text-white/75">
                意味・接続・活用をカードで思い出す
              </span>
            </button>
            <button
              onClick={() => quiz(KOTEN_GRAMMAR, '全範囲・受験型テスト')}
              className="rounded-3xl bg-gradient-to-br from-slate-900 to-violet-900 p-4 text-left text-white shadow-card transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Cards size={23} />
              </span>
              <span className="mt-3 block font-display text-lg font-extrabold">テスト</span>
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
              <p className="text-[10px] font-extrabold text-amber-600">コース</p>
              <h2 className="font-display text-lg font-extrabold text-ink">分野から学ぶ</h2>
            </div>
            <span className="text-[10px] font-bold text-ink/35">{KOTEN_GRAMMAR_CATEGORIES.length}分野</span>
          </div>
          <div className="space-y-3">
            {KOTEN_GRAMMAR_CATEGORIES.map((meta) => {
              const categoryItems = kotenGrammarByCategory(meta.id)
              const categoryQuestions = KOTEN_GRAMMAR_QUESTIONS.filter(
                (question) => question.category === meta.id,
              )
              return (
                <CategoryCard
                  key={meta.id}
                  meta={meta}
                  items={categoryItems}
                  srs={grammarSrs}
                  questions={categoryQuestions}
                  quizResults={quizResults}
                  onStudy={() => study(categoryItems, `${meta.label}を暗記`)}
                  onQuiz={() => quiz(categoryItems, `${meta.label}・受験型テスト`)}
                  onCatalog={() => openCatalog(meta.id)}
                />
              )
            })}
          </div>
        </section>

        <LearningEntryCard
          data-koten-grammar-catalog-entry
          emoji="📚"
          accentColor="#d97706"
          title="文法辞典"
          countLabel={`全${KOTEN_GRAMMAR.length}項目`}
          subtitle="検索して、覚えた項目とまだの項目を見分ける"
          status={totalStatus}
          units={{ learning: '項目', quiz: '問' }}
          studyAriaLabel="古典文法の全範囲を暗記"
          onStudy={() => study(KOTEN_GRAMMAR, '古典文法・全範囲')}
          quizAriaLabel="古典文法の全範囲をテスト"
          onQuiz={() => quiz(KOTEN_GRAMMAR, '全範囲・受験型テスト')}
          catalogLabel="一覧を確認"
          catalogAriaLabel="古典文法の全項目を一覧で確認する"
          onCatalog={() => openCatalog('all')}
        />
      </div>
    </div>
  )

  const catalogView = (
    <div className="pb-8" data-koten-grammar-catalog={category}>
      <ScreenHeader title="古典文法の一覧を確認" compact />
      <div className="space-y-3 px-4 pt-3">
        <LearningViewTabs
          view="list"
          onChange={setView}
          learnLabel="学ぶ"
          listLabel="一覧を確認"
          label="古典文法の見方"
        />
        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold text-amber-600">参考</p>
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
          <NormalLearningRecordList
            entryId="koten-grammar"
            contentId="koten-grammar"
            items={items}
            unit="項目"
            onOpen={(item) => setOpenId((current) => current === item.id ? null : item.id)}
            openLabel="文法の説明を見る"
            openHint="説明"
            emptyMessage="一致する文法がありません。"
            renderAfter={(item) => openId === item.id && (
              <div
                className="mt-2 space-y-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 animate-slide-up"
                data-koten-grammar-detail={item.id}
              >
                <button
                  type="button"
                  onClick={() => toggleSaved(item.id)}
                  aria-pressed={saved.includes(item.id)}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-extrabold text-amber-700"
                >
                  {saved.includes(item.id) ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
                  {saved.includes(item.id) ? '登録から外す' : '登録する'}
                </button>
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
                    <Book size={15} /> 暗記
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => quiz([item], item.title)}>
                    <Cards size={15} /> テスト
                  </Button>
                </div>
              </div>
            )}
          />
        </section>
      </div>
    </div>
  )

  return view === 'list' ? catalogView : homeView
}
