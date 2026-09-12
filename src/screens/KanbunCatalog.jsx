import { useMemo, useState } from 'react'
import { todayIndex, useStore } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { ChooserTiles, ReviewTodayRow, TodayCard, WordBookTile } from '../components/ContentTop.jsx'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'
import { kanbunNotebookDomain } from '../lib/wordBookLaunch.js'
import { KANBUN_VOCAB_CATEGORIES } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR_CATEGORIES } from '../data/kanbun-grammar.js'
import { KANBUN_CULTURE_CATEGORIES } from '../data/kanbun-culture.js'
import {
  KANBUN_COLLECTIONS,
  kanbunDomainMeta,
  kanbunSearchText,
} from '../data/kanbun-content.js'
import { KANBUN_LEVELS } from '../data/kanbun-meta.js'
import { kanbunDueItems } from '../lib/kanbunProgress.js'
import { Button, IconButton } from '../components/ui.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import { KanbunHeadword } from '../components/KanbunFurigana.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import {
  Search,
} from '../components/Icons.jsx'

const CATEGORY_MAP = {
  vocab: KANBUN_VOCAB_CATEGORIES,
  grammar: KANBUN_GRAMMAR_CATEGORIES,
  culture: KANBUN_CULTURE_CATEGORIES,
}

const LEARNING_RECORD_CONTENT_IDS = Object.freeze({
  vocab: 'kanbun-vocab',
  grammar: 'kanbun-grammar',
  culture: 'kanbun-culture',
})

export function KanbunCatalogScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const domain = KANBUN_COLLECTIONS[params.domain] ? params.domain : 'vocab'
  const meta = kanbunDomainMeta(domain)
  const collection = KANBUN_COLLECTIONS[domain]
  const categories = CATEGORY_MAP[domain]
  const learningRecordContentId = LEARNING_RECORD_CONTENT_IDS[domain]
  const srs = useStore((state) => state[meta.srsField])
  const wordBookDomain = kanbunNotebookDomain(domain)
  const [view, setView] = useState(params.view === 'list' ? 'list' : 'home')
  const [level, setLevel] = useState('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return collection.filter((item) =>
      (level === 'all' || item.level === level)
      && (category === 'all' || item.category === category)
      && (!normalized || kanbunSearchText(item).includes(normalized)))
  }, [category, collection, level, query])
  const totalStatus = summarizeSrsItems(collection, srs)
  const dueItems = kanbunDueItems(collection, srs)

  const study = (items, title) => navigate('kanbunStudy', {
    domain,
    ids: items.map((item) => item.id),
    title,
  })
  const quiz = (items, title) => navigate('kanbunQuiz', {
    domain,
    ids: items.map((item) => item.id),
    title,
  })
  const openCatalog = (categoryId = 'all') => {
    scrollScreenToTop()
    setCategory(categoryId)
    setLevel('all')
    setQuery('')
    setView('list')
  }

  // 今日の学習：この教材の復習。今日の分がなければ、学んだ項目を復習日が近い順に。
  const review = contentReviewSummary(collection, srs, todayIndex())

  const homeView = (
    <div className="pb-8">
      <ScreenHeader
        title={meta.label}
        subtitle={meta.description}
        right={(
          <IconButton onClick={() => openCatalog('all')} aria-label={`${meta.label}を検索`}>
            <Search size={22} />
          </IconButton>
        )}
      />

      <main className="space-y-3 px-4">
        <TodayCard data-kanbun-catalog-today={domain}>
          <ReviewTodayRow
            state={review.state}
            due={review.dueItems.length}
            nextInDays={review.nextInDays}
            unit={meta.itemLabel}
            onStart={() => study(
              reviewTargetItems(review),
              review.state === 'due' ? `${meta.label}・今日の復習` : `${meta.label}・復習日より前に練習`,
            )}
          />
        </TodayCard>
        <ChooserTiles data-kanbun-catalog-choosers={domain}>
          <WordBookTile domain={wordBookDomain} returnTo={{ screen: 'kanbunCatalog', params: { domain } }} />
        </ChooserTiles>

        {/* 全範囲：英単語の級カードと同じ並び */}
        <LearningEntryCard
          data-kanbun-catalog-entry={domain}
          emoji={meta.emoji}
          accentColor="#be123c"
          title={`${meta.label}の全範囲`}
          countLabel={`全${collection.length}${meta.itemLabel}`}
          subtitle={meta.description}
          status={totalStatus}
          units={{ learning: meta.itemLabel, quiz: '問' }}
          note={dueItems.length > 0
            ? `復習が必要 ${dueItems.length}${meta.itemLabel}`
            : undefined}
          noteTone={dueItems.length > 0 ? 'alert' : 'muted'}
          studyAriaLabel={`${meta.label}の全範囲を暗記`}
          onStudy={() => study(collection, `${meta.label}・全範囲`)}
          quizAriaLabel={`${meta.label}の全範囲をテスト`}
          onQuiz={() => quiz(collection, `${meta.label}・全範囲テスト`)}
          catalogLabel="一覧を確認"
          catalogAriaLabel={`${meta.label}の全項目を一覧で確認する`}
          onCatalog={() => openCatalog('all')}
        />

        <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">分野から選ぶ</h2>
        {categories.map((item) => {
          const categoryItems = collection.filter((entry) => entry.category === item.id)
          const categoryDue = kanbunDueItems(categoryItems, srs)
          return (
            <LearningEntryCard
              key={item.id}
              data-kanbun-category={item.id}
              emoji={item.emoji}
              accentColor={item.color}
              title={item.label}
              countLabel={`${categoryItems.length}${meta.itemLabel}`}
              subtitle={item.subtitle}
              status={summarizeSrsItems(categoryItems, srs)}
              units={{ learning: meta.itemLabel, quiz: '問' }}
              note={categoryDue.length > 0
                ? `復習が必要 ${categoryDue.length}${meta.itemLabel}`
                : undefined}
              noteTone={categoryDue.length > 0 ? 'alert' : 'muted'}
              studyDisabled={!categoryItems.length}
              studyAriaLabel={`${item.label}を暗記`}
              onStudy={() => study(categoryItems, `${item.label}を暗記`)}
              quizDisabled={!categoryItems.length}
              quizAriaLabel={`${item.label}をテスト`}
              onQuiz={() => quiz(categoryItems, `${item.label}のテスト`)}
              catalogLabel="一覧を確認"
              catalogAriaLabel={`${item.label}を一覧で確認する`}
              catalogDisabled={!categoryItems.length}
              onCatalog={() => openCatalog(item.id)}
            />
          )
        })}
      </main>
    </div>
  )

  const catalogView = (
    <div className="pb-8" data-kanbun-catalog-list={domain}>
      <ScreenHeader title={`${meta.label}の一覧を確認`} compact />

      <main className="space-y-3 px-4 pt-3">
        <LearningViewTabs
          view="list"
          onChange={setView}
          learnLabel="学ぶ"
          listLabel="一覧を確認"
          label={`${meta.label}の見方`}
        />

        <section>
          <h2 className="px-1 font-display text-sm font-extrabold text-ink">学年・難しさから選ぶ</h2>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setLevel('all')}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold ${level === 'all' ? 'bg-rose-800 text-white' : 'bg-white text-ink/55'}`}
            >
              全レベル
            </button>
            {KANBUN_LEVELS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setLevel(item.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold ${level === item.id ? 'bg-rose-800 text-white' : 'bg-white text-ink/55'}`}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="px-1 font-display text-sm font-extrabold text-ink">分野から選ぶ</h2>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold ${category === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-ink/55'}`}
            >
              全分野
            </button>
            {categories.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold ${category === item.id ? 'bg-slate-900 text-white' : 'bg-white text-ink/55'}`}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        </section>

        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search size={18} className="shrink-0 text-ink/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`${meta.label}を検索`}
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none"
          />
        </label>

        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink">教材一覧</h2>
            <p className="text-xs font-bold text-ink/40">該当 {filtered.length}{meta.itemLabel}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" disabled={!filtered.length} onClick={() => study(filtered, '絞り込み範囲')}>暗記</Button>
            <Button size="sm" variant="secondary" disabled={!filtered.length} onClick={() => quiz(filtered, '絞り込みテスト')}>テスト</Button>
          </div>
        </div>

        <NormalLearningRecordList
          entryId={learningRecordContentId}
          contentId={learningRecordContentId}
          items={filtered}
          unit={meta.itemLabel}
          onOpen={(item) => study([item], item.title)}
          openLabel={`この${meta.itemLabel}を暗記する`}
          openHint="暗記"
          emptyMessage={`条件に合う${meta.label}はありません。`}
          renderAfter={(item) => (
            <div className="mt-1.5 flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2" data-kanbun-list-note={item.id}>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-extrabold leading-relaxed text-ink"><KanbunHeadword item={item} /></h3>
                {item.reading && <p className="text-[11px] font-bold text-rose-700">読み：{item.reading}</p>}
                {item.pattern && <p className="text-[11px] font-bold text-rose-700">形：{item.pattern}</p>}
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">{item.clue}</p>
              </div>
              <WordBookToggle domain={wordBookDomain} itemId={item.id} itemLabel={item.title} />
            </div>
          )}
        />
      </main>
    </div>
  )

  return view === 'list' ? catalogView : homeView
}
