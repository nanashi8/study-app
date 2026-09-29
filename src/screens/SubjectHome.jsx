import { useMemo } from 'react'
import { todayIndex, useScreenParam, useStore } from '../store/useStore.js'
import {
  SUBJECTS,
  bookMeta,
  getSubjectUnit,
  subjectQuestions,
  subjectTerms,
  subjectUnits,
} from '../data/subjects/index.js'
import { summarizeQuizItems, summarizeSrsItems } from '../lib/contentProgress.js'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'
import { STUDY_ORDER_STAGE, rankQuestionsForStudy } from '../lib/studyOrder.js'
import { retrySubjectPracticeIds } from '../lib/subjectPractice.js'
import { readChoice, readListView, readOpen, readOpenId, readText } from '../lib/screenParams.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { subjectTextForSearch } from '../lib/subjectText.js'
import { SubjectText } from '../components/SubjectText.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import {
  ChooserTile,
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  TodayRow,
  WordBookTile,
} from '../components/ContentTop.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { CatalogTools } from '../components/CatalogTools.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { WordBookButton } from '../components/WordListSheet.jsx'
import { Button, IconButton, cx } from '../components/ui.jsx'
import { ArrowRight, Book, BookOpen, Cards, Refresh, Search, Target } from '../components/Icons.jsx'

// 社会・理科アプリのトップ。今日の学習 → 選び方の入口（語句の一覧・単語帳）→ 冊の切り替え →
// 冊の全範囲 → 単元ごとの入口の順に並べる。単元は教科書の単元の順。
// 単元のカードは、見出しで要点のページを開き、「暗記」で重要語句のカード、「演習」で基礎〜入試の問題へ進む。

// 一覧（重要語句）の記録の置き場所。src/lib/normalLearningRecordEntries.js の ID と同じ。
const RECORD_LIST_ENTRIES = Object.freeze({ social: 'social-terms', science: 'science-terms' })
const STATUS_UNITS = Object.freeze({ learning: '語句', quiz: '問' })

const bookIdsOf = (subject) => SUBJECTS[subject].books.map((book) => book.id)

/** 単元（または冊）の進み具合：暗記は重要語句、テストは演習の問題で数える。 */
export function subjectStatus({ terms, questions, srs, quizResults, practiceDomain }) {
  const learning = summarizeSrsItems(terms, srs)
  const practice = summarizeQuizItems({ items: questions, quizResults, quizDomain: practiceDomain })
  return { ...learning, quiz: practice.counts, quizTotal: practice.total }
}

/** 冊（地理・歴史・公民、1年・2年・3年）の切り替え。 */
export function BookSwitch({ subject, value, onChange, label = '冊を選ぶ', allLabel = null }) {
  const books = SUBJECTS[subject].books
  const items = allLabel ? [{ id: 'all', label: allLabel }, ...books] : books
  return (
    <div
      className={cx('grid gap-1 rounded-2xl bg-brand-50 p-1', items.length === 4 ? 'grid-cols-4' : 'grid-cols-3')}
      role="group"
      aria-label={label}
      data-subject-book-switch={subject}
    >
      {items.map((item) => {
        const on = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={on}
            className={cx(
              'min-h-11 rounded-xl px-1 py-1.5 font-display text-sm font-extrabold transition-colors',
              on ? 'bg-white text-brand-700 shadow-sm' : 'text-ink/55 active:bg-white/70',
            )}
            data-subject-book-option={item.id}
          >
            {item.emoji ? `${item.emoji} ${item.label}` : item.label}
          </button>
        )
      })}
    </div>
  )
}

/** 単元を、教科書の編・単元ごとにまとめる。 */
function groupByPart(units) {
  const groups = []
  for (const unit of units) {
    const last = groups.at(-1)
    if (last && last.part === unit.part) last.units.push(unit)
    else groups.push({ part: unit.part, units: [unit] })
  }
  return groups
}

function SubjectHomeScreen({ subject }) {
  const meta = SUBJECTS[subject]
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state[meta.termSrsField])
  const practiceLog = useStore((state) => state[meta.practiceLogField])
  const quizResults = useStore((state) => state.contentQuizResults)
  const readBook = useMemo(() => readChoice(bookIdsOf(subject), bookIdsOf(subject)[0]), [subject])
  const readCatalogBook = useMemo(() => readChoice(['all', ...bookIdsOf(subject)], 'all'), [subject])
  const [bookId, setBookId] = useScreenParam('book', readBook)
  const [view, setView] = useScreenParam('view', readListView)
  const [catalogBook, setCatalogBook] = useScreenParam('catalogBook', readCatalogBook)
  const [query, setQuery] = useScreenParam('query', readText)
  const [openId, setOpenId] = useScreenParam('openId', readOpenId)
  const [filtersOpen, setFiltersOpen] = useScreenParam('filtersOpen', readOpen)

  const book = bookMeta(subject, bookId)
  const units = subjectUnits(subject, bookId)
  const allTerms = subjectTerms(subject)
  const allQuestions = subjectQuestions(subject)
  const bookTerms = subjectTerms(subject, bookId)
  const bookQuestions = subjectQuestions(subject, bookId)
  const returnTo = { screen: meta.screens.home, params: { book: bookId } }

  const review = contentReviewSummary(allTerms, srs, todayIndex())
  const ranked = rankQuestionsForStudy(bookQuestions, { quizResults, quizDomain: meta.practiceDomain, rng: null })
  const dueCount = ranked.filter((entry) => entry.stage <= STUDY_ORDER_STAGE.review).length
  const freshCount = ranked.filter((entry) => entry.stage === STUDY_ORDER_STAGE.fresh).length
  const retryIds = retrySubjectPracticeIds(practiceLog, allQuestions.map((question) => question.id))
  const bookStatus = subjectStatus({
    terms: bookTerms,
    questions: bookQuestions,
    srs,
    quizResults,
    practiceDomain: meta.practiceDomain,
  })

  const study = (terms, title) => navigate(meta.screens.study, { ids: terms.map((term) => term.id), title, returnTo })
  const quiz = (terms, title) => navigate(meta.screens.quiz, { ids: terms.map((term) => term.id), title, returnTo })
  const practice = (extra) => navigate(meta.screens.practice, { ...extra, returnTo })
  const openUnit = (unit) => navigate(meta.screens.unit, { unitId: unit.id })
  const openCatalog = (targetBook = 'all') => {
    scrollScreenToTop()
    setCatalogBook(targetBook)
    setQuery('')
    setView('list')
  }

  const catalogTerms = useMemo(() => {
    const base = subjectTerms(subject, catalogBook === 'all' ? null : catalogBook)
    const normalized = query.trim().toLocaleLowerCase('ja')
    if (!normalized) return base
    return base.filter((term) => (
      subjectTextForSearch([term.term, term.meaning, term.note, getSubjectUnit(term.unitId)?.title].join(' '))
        .toLocaleLowerCase('ja')
        .includes(normalized)
    ))
  }, [subject, catalogBook, query])

  const homeView = (
    <div className="pb-8" data-subject-home={subject}>
      <ScreenHeader
        title={meta.label}
        subtitle="単元ごとに要点を学び、重要語句を暗記し、基礎〜入試の問題で演習する"
        right={(
          <IconButton onClick={() => openCatalog('all')} aria-label={`${meta.label}の重要語句を検索`}>
            <Search size={22} />
          </IconButton>
        )}
      />
      <div className="space-y-3 px-4 pt-3">
        {/* 今日の学習：重要語句の復習・今日の演習（選んでいる冊）・解き直し。 */}
        <TodayCard data-subject-today={subject}>
          <ReviewTodayRow
            state={review.state}
            due={review.dueItems.length}
            nextInDays={review.nextInDays}
            unit="語句"
            onStart={() => study(
              reviewTargetItems(review),
              review.state === 'due' ? `${meta.label}・今日の復習` : `${meta.label}・復習日より前に練習`,
            )}
          />
          <TodayRow
            onClick={() => practice({ bookId, title: `今日の演習（${book.label}）` })}
            disabled={!bookQuestions.length}
            aria-label={`今日の演習。${book.label}の復習${dueCount}問、まだ解いていない問題${freshCount}問`}
            data-subject-today-practice
            icon={<Target size={20} />}
            iconClassName="bg-brand-100 text-brand-600"
            title="今日の演習"
            detail={`${book.label}：復習${dueCount}問・まだ解いていない問題${freshCount}問`}
          />
          <TodayRow
            onClick={() => practice({ ids: retryIds, title: '解き直し' })}
            disabled={!retryIds.length}
            aria-label={retryIds.length ? `解き直し。${retryIds.length}問` : '解き直し。まだありません'}
            data-subject-retry
            icon={<Refresh size={20} />}
            iconClassName="bg-hint/20 text-amber-600"
            title="解き直し"
            detail={retryIds.length
              ? `不正解・わからなかった問題 ${retryIds.length}問`
              : '正解できなかった問題がここに出ます。'}
          />
        </TodayCard>

        {/* 選び方のほかの入口：重要語句の一覧と単語帳。 */}
        <ChooserTiles data-subject-choosers={subject}>
          <ChooserTile
            onClick={() => openCatalog('all')}
            data-subject-catalog-entry
            aria-label={`重要語句の一覧で探す。全${allTerms.length}語句`}
            icon={<Book size={19} />}
            iconClassName="bg-emerald-100 text-emerald-700"
            label="語句の一覧"
          >
            全{allTerms.length}語句
          </ChooserTile>
          <WordBookTile domain={meta.notebookTerms} returnTo={{ screen: meta.screens.home, params: { book: bookId } }} />
        </ChooserTiles>

        <BookSwitch subject={subject} value={bookId} onChange={setBookId} />

        <LearningEntryCard
          data-subject-book-card={bookId}
          emoji={book.emoji}
          accentColor={book.color}
          title={`${book.label}の全範囲`}
          countLabel={`${units.length}単元`}
          subtitle={book.description}
          status={bookStatus}
          units={STATUS_UNITS}
          studyAriaLabel={`${book.label}の重要語句${bookTerms.length}語句を暗記`}
          onStudy={() => study(bookTerms, `${book.label}の重要語句`)}
          studyDisabled={!bookTerms.length}
          quizLabel="語句テスト"
          quizAriaLabel={`${book.label}の重要語句をテスト`}
          quizDisabled={!bookTerms.length}
          onQuiz={() => quiz(bookTerms, `${book.label}の語句テスト`)}
          browseLabel="単元を混ぜて演習"
          browseIcon={<Cards size={15} />}
          browseAriaLabel={`${book.label}の単元を混ぜて演習（${bookQuestions.length}問）`}
          browseDisabled={!bookQuestions.length}
          browseProps={{ 'data-subject-book-mixed': bookId }}
          onBrowse={() => practice({ bookId, mixed: true, title: `${book.label}の総合演習` })}
          catalogLabel="語句の一覧"
          catalogAriaLabel={`${book.label}の重要語句を一覧で確認する`}
          onCatalog={() => openCatalog(bookId)}
        />

        <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">単元から選ぶ</h2>
        <div className="space-y-6" data-subject-units={bookId}>
          {groupByPart(units).map((group) => (
            <section key={group.part}>
              <h3 className="mb-2 px-1 text-sm font-extrabold leading-relaxed text-ink/65"><SubjectText>{group.part}</SubjectText></h3>
              <ol className="space-y-3">
                {group.units.map((unit) => (
                  <li key={unit.id} data-return-row={unit.id}>
                    <LearningEntryCard
                      data-subject-unit={unit.id}
                      accentColor={book.color}
                      title={<SubjectText>{unit.title}</SubjectText>}
                      subtitle={unit.chapter}
                      countLabel={`${unit.questions.length}問`}
                      onOpen={() => openUnit(unit)}
                      openAriaLabel={`${unit.title}の要点を読む`}
                      status={subjectStatus({
                        terms: unit.terms,
                        questions: unit.questions,
                        srs,
                        quizResults,
                        practiceDomain: meta.practiceDomain,
                      })}
                      units={STATUS_UNITS}
                      studyAriaLabel={`${unit.title}の重要語句${unit.terms.length}語句を暗記`}
                      studyDisabled={!unit.terms.length}
                      onStudy={() => study(unit.terms, `${unit.title}の重要語句`)}
                      quizLabel="演習"
                      quizAriaLabel={`${unit.title}の演習（基礎・標準・入試 ${unit.questions.length}問）`}
                      quizDisabled={!unit.questions.length}
                      onQuiz={() => practice({ unitId: unit.id, title: `${unit.title}の演習` })}
                      catalogLabel="要点を読む"
                      catalogAriaLabel={`${unit.title}の要点・重要語句・問題の一覧を見る`}
                      onCatalog={() => openUnit(unit)}
                    />
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  )

  const catalogLabel = catalogBook === 'all' ? 'すべて' : bookMeta(subject, catalogBook)?.label ?? 'すべて'
  const catalogView = (
    <div className="pb-8" data-subject-catalog={subject}>
      <ScreenHeader title={`${meta.label}の重要語句の一覧`} compact />
      <div className="space-y-3 px-4 pt-3">
        <CatalogTools
          open={filtersOpen}
          onToggle={() => setFiltersOpen((current) => !current)}
          summary={`${catalogLabel}${query.trim() ? `・検索「${query.trim()}」` : ''}`}
          narrowed={catalogBook !== 'all' || Boolean(query.trim())}
          toolsClassName="space-y-3"
          label="しぼり込み"
          toggleProps={{ 'data-subject-tools-toggle': true }}
          tabs={(
            <LearningViewTabs
              view="list"
              onChange={setView}
              learnLabel="学ぶ"
              listLabel="一覧を確認"
              label={`${meta.label}の見方`}
            />
          )}
        >
          <label className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
            <Search size={18} className="text-ink/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="語句・意味・単元名で検索"
              aria-label={`${meta.label}の重要語句を検索`}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-ink/30"
            />
          </label>
          <BookSwitch
            subject={subject}
            value={catalogBook}
            onChange={setCatalogBook}
            allLabel="すべて"
            label="一覧に出す冊"
          />
        </CatalogTools>
        <section>
          <p className="mb-2 px-1 text-xs font-bold text-ink/45">{catalogTerms.length}語句</p>
          <NormalLearningRecordList
            entryId={RECORD_LIST_ENTRIES[subject]}
            contentId={meta.termDomain}
            items={catalogTerms}
            unit="語句"
            onOpen={(term) => setOpenId((current) => (current === term.id ? null : term.id))}
            openLabel="語句の説明を見る"
            openHint="説明"
            emptyMessage="一致する語句がありません。"
            renderAfter={(term) => {
              if (openId !== term.id) return null
              const unit = getSubjectUnit(term.unitId)
              return (
                <div
                  className="mt-2 space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/55 p-4 animate-slide-up"
                  data-subject-term-detail={term.id}
                >
                  <WordBookButton domain={meta.notebookTerms} itemId={term.id} itemLabel={term.term} className="text-emerald-800" />
                  <p className="text-sm font-bold leading-relaxed text-ink/70"><SubjectText>{term.meaning}</SubjectText></p>
                  {term.note && <p className="text-xs font-bold leading-relaxed text-ink/55"><SubjectText>{term.note}</SubjectText></p>}
                  {unit && (
                    <button
                      type="button"
                      onClick={() => openUnit(unit)}
                      className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left text-xs font-extrabold text-emerald-800"
                    >
                      <span className="min-w-0 flex-1">{bookMeta(subject, unit.book)?.label}・<SubjectText>{unit.title}</SubjectText>の要点へ</span>
                      <ArrowRight size={15} />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => study([term], term.term)}>
                      <BookOpen size={15} /> 暗記
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => quiz([term], term.term)}>
                      <Cards size={15} /> テスト
                    </Button>
                  </div>
                </div>
              )
            }}
          />
        </section>
      </div>
    </div>
  )

  return view === 'list' ? catalogView : homeView
}

export function SocialHomeScreen() {
  return <SubjectHomeScreen subject="social" />
}

export function ScienceHomeScreen() {
  return <SubjectHomeScreen subject="science" />
}
