import { useMemo, useState } from 'react'
import { isDue, todayIndex, useStore } from '../store/useStore.js'
import { ChooserTile, ChooserTiles, ReviewTodayRow, TodayCard, WordBookTile } from '../components/ContentTop.jsx'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'
import { WordBookButton, WordBookStudySheet } from '../components/WordListSheet.jsx'
import {
  KOTEN_CULTURE,
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_QUESTIONS,
  kotenCultureByCategory,
} from '../data/koten-culture.js'
import { pickKotenInterpretationIds } from '../data/koten-interpretations.js'
import {
  Button,
  IconButton,
  cx,
} from '../components/ui.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { summarizeSrsItemsWithQuestions } from '../lib/contentProgress.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { KotenText } from '../components/KotenFurigana.jsx'
import { kotenTextForSearch } from '../lib/kotenFurigana.js'
import {
  ArrowRight,
  Book,
  Cards,
  Search,
} from '../components/Icons.jsx'

function CategoryCard({ meta, items, srs, questions, quizResults, onStudy, onQuiz, onCatalog }) {
  const status = summarizeSrsItemsWithQuestions({
    items,
    srs,
    questions,
    quizResults,
    quizDomain: 'koten-culture',
  })
  return (
    <LearningEntryCard
      data-koten-culture-category={meta.id}
      emoji={meta.emoji}
      accentColor={meta.color}
      title={meta.label}
      countLabel={`${items.length}テーマ`}
      subtitle={meta.subtitle}
      status={status}
      units={{ learning: 'テーマ', quiz: '問' }}
      studyAriaLabel={`${meta.label}の古典常識を暗記`}
      onStudy={onStudy}
      quizAriaLabel={`${meta.label}の古典常識をテスト`}
      onQuiz={onQuiz}
      catalogLabel="一覧を確認"
      catalogAriaLabel={`${meta.label}の古典常識を一覧で確認する`}
      onCatalog={onCatalog}
    />
  )
}

export function KotenCultureScreen() {
  const navigate = useStore((state) => state.navigate)
  const params = useStore((state) => state.params)
  const cultureSrs = useStore((state) => state.kotenCultureSrs)
  const [wordBookOpen, setWordBookOpen] = useState(false)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)
  const [view, setView] = useState(params.view === 'list' ? 'list' : 'home')

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
  const openCatalog = (categoryId = 'all') => {
    scrollScreenToTop()
    setCategory(categoryId)
    setQuery('')
    setView('list')
  }

  // 今日の学習：古典常識の復習。今日の分がなければ、学んだ項目を復習日が近い順に。
  const review = contentReviewSummary(KOTEN_CULTURE, cultureSrs, todayIndex())

  const homeView = (
    <div className="pb-8">
      <ScreenHeader
        title="古典常識"
        subtitle="暗記 → 本文の行動理由を見抜く → 読解につなぐ"
        right={(
          <IconButton onClick={() => openCatalog('all')} aria-label="古典常識を検索">
            <Search size={22} />
          </IconButton>
        )}
      />
      <div className="space-y-3 px-4">
        <TodayCard data-koten-culture-today>
          <ReviewTodayRow
            state={review.state}
            due={review.dueItems.length}
            nextInDays={review.nextInDays}
            unit="テーマ"
            onStart={() => study(
              reviewTargetItems(review),
              review.state === 'due' ? '古典常識・今日の復習' : '古典常識・復習日より前に練習',
            )}
          />
        </TodayCard>

        {/* 分野のほかの選び方：常識事典（一覧）と単語帳 */}
        <ChooserTiles data-koten-culture-choosers>
          <ChooserTile
            onClick={() => openCatalog('all')}
            data-koten-culture-dictionary-entry
            aria-label={`常識事典で探す。全${KOTEN_CULTURE.length}テーマ`}
            icon={<Book size={19} />}
            iconClassName="bg-violet-100 text-violet-700"
            label="常識事典"
          >
            全{KOTEN_CULTURE.length}テーマ
          </ChooserTile>
          <WordBookTile domain="kotenCulture" returnTo={{ screen: 'kotenCulture' }} />
        </ChooserTiles>

        <LearningEntryCard
          data-koten-culture-catalog-entry
          emoji="📚"
          accentColor="#7c3aed"
          title="古典常識の全範囲"
          countLabel={`全${KOTEN_CULTURE.length}テーマ`}
          subtitle="用語・背景・本文の手掛かりを、暗記と入試型3択で"
          status={totalStatus}
          units={{ learning: 'テーマ', quiz: '問' }}
          note={dueItems.length > 0 ? `復習が必要 ${dueItems.length}テーマ` : undefined}
          noteTone={dueItems.length > 0 ? 'alert' : 'muted'}
          studyAriaLabel="古典常識の全範囲を暗記"
          onStudy={() => study(KOTEN_CULTURE, '古典常識・全範囲')}
          quizAriaLabel="古典常識の全範囲をテスト"
          onQuiz={() => quiz(KOTEN_CULTURE, '全範囲・入試型テスト')}
          catalogLabel="一覧を確認"
          catalogAriaLabel="古典常識の全項目を一覧で確認する"
          onCatalog={() => openCatalog('all')}
        />

        <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">分野から選ぶ</h2>
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
              onStudy={() => study(categoryItems, `${meta.label}を暗記`)}
              onQuiz={() => quiz(categoryItems, `${meta.label}・入試型テスト`)}
              onCatalog={() => openCatalog(meta.id)}
            />
          )
        })}
      </div>
    </div>
  )

  const catalogView = (
    <div className="pb-8" data-koten-culture-catalog={category}>
      <ScreenHeader title="古典常識の一覧を確認" compact />
      <div className="space-y-3 px-4 pt-3">
        <LearningViewTabs
          view="list"
          onChange={setView}
          learnLabel="学ぶ"
          listLabel="一覧を確認"
          label="古典常識の見方"
        />
        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold text-violet-600">参考</p>
              <h2 className="font-display text-lg font-extrabold text-ink">古典常識事典</h2>
            </div>
            <button
              onClick={() => setWordBookOpen(true)}
              aria-haspopup="dialog"
              className="flex items-center gap-1 text-xs font-extrabold text-violet-700"
            >
              <Cards size={14} /> 単語帳 <ArrowRight size={14} />
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
          <NormalLearningRecordList
            entryId="koten-culture"
            contentId="koten-culture"
            items={items}
            unit="テーマ"
            onOpen={(item) => setOpenId((current) => current === item.id ? null : item.id)}
            openLabel="古典常識の説明を見る"
            openHint="説明"
            emptyMessage="一致する古典常識がありません。"
            renderAfter={(item) => openId === item.id && (
              <div
                className="mt-2 space-y-3 rounded-2xl border border-violet-100 bg-violet-50/55 p-4 animate-slide-up"
                data-koten-culture-detail={item.id}
              >
                <WordBookButton domain="kotenCulture" itemId={item.id} itemLabel={item.title} className="text-violet-700" />
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

  return (
    <>
      {view === 'list' ? catalogView : homeView}
      <WordBookStudySheet
        open={wordBookOpen}
        onClose={() => setWordBookOpen(false)}
        domain="kotenCulture"
        returnTo={{ screen: 'kotenCulture' }}
      />
    </>
  )
}
