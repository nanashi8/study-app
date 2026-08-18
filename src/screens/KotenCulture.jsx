import { useMemo, useState } from 'react'
import { isDue, useStore } from '../store/useStore.js'
import {
  KOTEN_CULTURE,
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_LEVELS,
  KOTEN_CULTURE_QUESTIONS,
  kotenCultureByCategory,
} from '../data/koten-culture.js'
import { pickKotenInterpretationIds } from '../data/koten-interpretations.js'
import {
  Button,
  Card,
  Chip,
  cx,
  IconButton,
} from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItemsWithQuestions } from '../lib/contentProgress.js'
import { KotenText } from '../components/KotenFurigana.jsx'
import { kotenTextForSearch } from '../lib/kotenFurigana.js'
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

function CategoryCard({ meta, items, srs, questions, quizResults, onStudy, onQuiz }) {
  const status = summarizeSrsItemsWithQuestions({
    items,
    srs,
    questions,
    quizResults,
    quizDomain: 'koten-culture',
  })
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
            {items.length}テーマ・{questions.length}問
          </p>
        </div>
      </div>
      <LearningStatusBars progress={status} className="mt-3" compact units={{ learning: 'テーマ', quiz: '問' }} />
      <p className="mt-2 text-[11px] font-bold leading-relaxed text-ink/45">{meta.subtitle}</p>
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

export function KotenCultureScreen() {
  const navigate = useStore((state) => state.navigate)
  const cultureSrs = useStore((state) => state.kotenCultureSrs)
  const saved = useStore((state) => state.kotenCultureList)
  const toggleSaved = useStore((state) => state.toggleKotenCultureList)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  const quizResults = useStore((state) => state.contentQuizResults)
  const totalStatus = summarizeSrsItemsWithQuestions({
    items: KOTEN_CULTURE,
    srs: cultureSrs,
    questions: KOTEN_CULTURE_QUESTIONS,
    quizResults,
    quizDomain: 'koten-culture',
  })
  const dueItems = KOTEN_CULTURE.filter(
    (item) => cultureSrs[item.id] && isDue(cultureSrs[item.id]),
  )
  const savedItems = saved
    .map((id) => KOTEN_CULTURE.find((item) => item.id === id))
    .filter(Boolean)

  const items = useMemo(() => {
    const base = category === 'all' ? KOTEN_CULTURE : kotenCultureByCategory(category)
    const normalized = query.trim().toLowerCase()
    if (!normalized) return base
    return base.filter((item) => {
      const text = [
        item.title,
        item.keyword,
        item.prompt,
        item.core,
        item.detail,
        item.examTip,
        item.scene.text,
      ]
        .join(' ')
        .toLowerCase()
      return kotenTextForSearch(text).includes(normalized)
    })
  }, [category, query])

  const study = (targetItems, title) =>
    navigate('kotenCultureStudy', {
      ids: targetItems.map((item) => item.id),
      title,
    })
  const quiz = (targetItems, title) =>
    navigate('kotenCultureQuiz', {
      ids: targetItems.map((item) => item.id),
      title,
    })

  return (
    <div className="pb-8">
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-violet-800 via-purple-700 to-fuchsia-600 px-5 pb-7 pt-5 text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate('kotenList')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 transition-transform active:scale-95"
          >
            <ChevronLeft size={14} /> 古典アプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <p className="text-xs font-bold text-white/70">大学受験・古文の背景知識</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">古典常識</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          覚える → 本文の行動理由を見抜く → 読解につなぐ
        </p>

        <div className="mt-4 rounded-2xl bg-white/15 p-3.5">
          <div>
            <p className="font-display text-lg font-extrabold">
              全{KOTEN_CULTURE.length}テーマ・全{KOTEN_CULTURE_QUESTIONS.length}問
            </p>
            <p className="mt-0.5 text-xs font-bold text-white/70">
              学習済 {totalStatus.learning.learned}・復習中 {totalStatus.learning.reviewing}・未学習 {totalStatus.learning.unlearned}・登録 {savedItems.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pt-5">
        <Card className="p-4" data-koten-culture-status>
          <LearningStatusBars progress={totalStatus} compact units={{ learning: 'テーマ', quiz: '問' }} />
        </Card>
        <section>
          <div className="mb-2 px-1">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-violet-600">LEARN → CHALLENGE</p>
            <h2 className="font-display text-lg font-extrabold text-ink">今日の古典常識</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => study(KOTEN_CULTURE, '古典常識・全範囲')}
              className="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-4 text-left text-white shadow-card transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Book size={23} />
              </span>
              <span className="mt-3 block font-display text-lg font-extrabold">覚える</span>
              <span className="mt-1 block text-[11px] font-bold leading-relaxed text-white/75">
                用語・背景・本文の手掛かりを思い出す
              </span>
            </button>
            <button
              onClick={() => quiz(KOTEN_CULTURE, '全範囲・入試型腕試し')}
              className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-left text-white shadow-card transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Cards size={23} />
              </span>
              <span className="mt-3 block font-display text-lg font-extrabold">腕試し</span>
              <span className="mt-1 block text-[11px] font-bold leading-relaxed text-white/65">
                本文・人物関係・資料から4択
              </span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              disabled={!dueItems.length}
              onClick={() => study(dueItems, '古典常識の復習')}
              className="flex items-center gap-2 rounded-2xl bg-hint-soft p-3 text-left transition-transform active:scale-[0.98] disabled:opacity-45"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hint/20 text-hint">
                <Refresh size={19} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-amber-900">復習</span>
                <span className="block text-[11px] font-bold text-amber-800/65">{dueItems.length}テーマ</span>
              </span>
            </button>
            <button
              disabled={!savedItems.length}
              onClick={() => study(savedItems, '登録した古典常識')}
              className="flex items-center gap-2 rounded-2xl bg-sky-100 p-3 text-left transition-transform active:scale-[0.98] disabled:opacity-45"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-200 text-sky-700">
                <BookmarkFilled size={19} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-sky-900">登録常識</span>
                <span className="block text-[11px] font-bold text-sky-800/60">{savedItems.length}テーマ</span>
              </span>
            </button>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-violet-600">COURSE</p>
              <h2 className="font-display text-lg font-extrabold text-ink">分野から学ぶ</h2>
            </div>
            <span className="text-[10px] font-bold text-ink/35">{KOTEN_CULTURE_CATEGORIES.length}分野</span>
          </div>
          <div className="space-y-3">
            {KOTEN_CULTURE_CATEGORIES.map((meta) => {
              const categoryItems = kotenCultureByCategory(meta.id)
              const categoryQuestions = KOTEN_CULTURE_QUESTIONS.filter(
                (question) => question.category === meta.id,
              )
              return (
                <CategoryCard
                  key={meta.id}
                  meta={meta}
                  items={categoryItems}
                  srs={cultureSrs}
                  questions={categoryQuestions}
                  quizResults={quizResults}
                  onStudy={() => study(categoryItems, `${meta.label}を覚える`)}
                  onQuiz={() => quiz(categoryItems, `${meta.label}・入試型腕試し`)}
                />
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-violet-600">REFERENCE</p>
              <h2 className="font-display text-lg font-extrabold text-ink">古典常識事典</h2>
            </div>
            <button
              onClick={() => navigate('kotenSaved', { tab: 'culture' })}
              className="flex items-center gap-1 text-xs font-extrabold text-violet-700"
            >
              <BookmarkFilled size={14} /> 登録リスト <ArrowRight size={14} />
            </button>
          </div>

          <label className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
            <Search size={18} className="text-ink/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="宮中・暦・信仰・作品名で検索"
              aria-label="古典常識を検索"
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-ink/30"
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategory('all')}
              className={cx(
                'shrink-0 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors',
                category === 'all' ? 'bg-violet-700 text-white' : 'bg-white text-ink/55',
              )}
            >
              すべて {KOTEN_CULTURE.length}
            </button>
            {KOTEN_CULTURE_CATEGORIES.map((meta) => (
              <button
                key={meta.id}
                onClick={() => setCategory(meta.id)}
                className={cx(
                  'shrink-0 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors',
                  category === meta.id ? 'text-white' : 'bg-white text-ink/55',
                )}
                style={category === meta.id ? { backgroundColor: meta.color } : undefined}
              >
                {meta.emoji} {meta.label} {kotenCultureByCategory(meta.id).length}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-4 px-1 text-xs font-bold text-ink/45">{items.length}テーマ</p>
          <div className="space-y-2">
            {items.map((item) => {
              const open = openId === item.id
              const isSaved = saved.includes(item.id)
              const categoryMeta = KOTEN_CULTURE_CATEGORIES.find(
                (meta) => meta.id === item.category,
              )
              const level = KOTEN_CULTURE_LEVELS[item.level]
              return (
                <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="flex items-center gap-2 p-3">
                    <button
                      onClick={() => setOpenId(open ? null : item.id)}
                      aria-expanded={open}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-sm font-extrabold leading-relaxed text-ink">
                          <KotenText>{item.title}</KotenText>
                        </span>
                        {categoryMeta && <Chip color={categoryMeta.color}>{categoryMeta.label}</Chip>}
                        {level && <Chip color={level.color}>{level.label}</Chip>}
                      </div>
                      <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                        <KotenText>{item.core}</KotenText>
                      </p>
                    </button>
                    <IconButton
                      onClick={() => toggleSaved(item.id)}
                      aria-label={isSaved ? `${item.title}を登録から外す` : `${item.title}を登録する`}
                      aria-pressed={isSaved}
                      className={isSaved ? 'text-violet-600' : 'text-ink/25'}
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
                    <div className="space-y-3 border-t border-violet-100 bg-violet-50/55 p-4 animate-slide-up">
                      <p className="text-sm font-bold leading-relaxed text-ink/65">
                        <KotenText>{item.detail}</KotenText>
                      </p>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[10px] font-extrabold tracking-wide text-violet-600">入試の読み方</p>
                        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65">
                          <KotenText>{item.examTip}</KotenText>
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="font-serif font-bold leading-relaxed text-ink">
                          <KotenText>{item.scene.text}</KotenText>
                        </p>
                        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">
                          <KotenText>{item.scene.note}</KotenText>
                        </p>
                      </div>
                      {item.relatedInterpretationIds.length > 0 && (
                        <button
                          onClick={() =>
                            navigate('kotenInterpretationPrep', {
                              ids: pickKotenInterpretationIds(item.relatedInterpretationIds),
                              title: `${item.title}が出る短文`,
                            })
                          }
                          className="flex w-full items-center justify-between rounded-xl bg-amber-100 px-3 py-2.5 text-left text-xs font-extrabold text-amber-800"
                        >
                          関連する短文解釈へ
                          <ArrowRight size={15} />
                        </button>
                      )}
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
              <p className="mt-2 font-bold text-ink/70">一致する古典常識がありません</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
