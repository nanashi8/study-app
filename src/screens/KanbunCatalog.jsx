import { useMemo } from 'react'
import { todayIndex, useScreenParam, useStore } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { ChooserTile, ChooserTiles, ReviewTodayRow, TodayCard, WordBookTile } from '../components/ContentTop.jsx'
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
import {
  KANBUN_GROUPS,
  KANBUN_GROUP_TOC,
  KANBUN_SYSTEMS,
  kanbunSystemItemIds,
} from '../lib/kanbunGroups.js'
import { Button, IconButton } from '../components/ui.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import { KanbunHeadword, KanbunText } from '../components/KanbunFurigana.jsx'
import { KanbunMarkedText, KanbunPatternText } from '../components/KanbunMarkedText.js'
import {
  KanbunExtras,
  KanbunGroupMembers,
  KanbunNotes,
  KanbunSystemAuxTables,
  KanbunSystemTable,
} from '../components/KanbunExtras.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { CatalogTools } from '../components/CatalogTools.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { readChoice, readOpen, readOpenId, readText } from '../lib/screenParams.js'
import {
  Book,
  BookOpen,
  Cards,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Search,
  Sprout,
} from '../components/Icons.jsx'

const CATEGORY_MAP = {
  vocab: KANBUN_VOCAB_CATEGORIES,
  grammar: KANBUN_GRAMMAR_CATEGORIES,
  culture: KANBUN_CULTURE_CATEGORIES,
}

const readLevel = readChoice(['all', ...KANBUN_LEVELS.map((item) => item.id)], 'all')

const LEARNING_RECORD_CONTENT_IDS = Object.freeze({
  vocab: 'kanbun-vocab',
  grammar: 'kanbun-grammar',
  culture: 'kanbun-culture',
})

// 見え方：home（トップ）・list（一覧を確認）・groups（漢語の仲間）・systems（漢文法の体系表）。
const readView = readChoice(['home', 'list', 'groups', 'systems'], 'home')
const readGroupType = readChoice(['all', ...KANBUN_GROUP_TOC.map(({ type }) => type.id)], 'all')
const readSystem = readChoice(KANBUN_SYSTEMS.map((system) => system.id), null)

// 漢語の仲間の入口。暗記・テストは仲間の語だけで行い、
// 「使い分けの解説」を開くと、仲間の使い分けと各語の読み・意味が読める。
function GroupCard({ group, srs, open, onToggle, onStudy, onQuiz }) {
  return (
    <LearningEntryCard
      data-kanbun-group-card={group.id}
      emoji={group.typeInfo?.emoji}
      accentColor="#0d9488"
      title={group.title}
      countLabel={`${group.items.length}語`}
      subtitle={group.items.map((item) => item.title).join('・')}
      status={summarizeSrsItems(group.items, srs)}
      units={{ learning: '語', quiz: '問' }}
      studyAriaLabel={`仲間「${group.title}」をまとめて暗記`}
      onStudy={onStudy}
      quizAriaLabel={`仲間「${group.title}」をテスト`}
      onQuiz={onQuiz}
      browseLabel={open ? '解説を閉じる' : '使い分けの解説'}
      browseIcon={<Lightbulb size={15} />}
      browseAriaLabel={`仲間「${group.title}」の使い分けの解説を${open ? '閉じる' : '読む'}`}
      browseProps={{ 'aria-expanded': open, 'data-kanbun-group-toggle': group.id }}
      onBrowse={onToggle}
    >
      {open && (
        <div className="mt-3 space-y-2 rounded-2xl bg-teal-50/70 p-3 ring-1 ring-teal-100" data-kanbun-group-detail={group.id}>
          <p className="text-sm font-bold leading-relaxed text-ink/75">{group.explain}</p>
          <KanbunGroupMembers items={group.items} />
        </div>
      )}
    </LearningEntryCard>
  )
}

// 体系表で開く、漢文法の項目1つの説明。
function GrammarItemDetail({ item, onStudy, onQuiz }) {
  return (
    <div className="space-y-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 animate-slide-up" data-kanbun-grammar-detail={item.id}>
      <div>
        <p className="font-display text-sm font-extrabold leading-relaxed text-ink"><KanbunHeadword item={item} /></p>
        {item.pattern && <p className="text-[11px] font-bold text-rose-700">形：<KanbunPatternText pattern={item.pattern} /></p>}
      </div>
      <div>
        <p className="text-[10px] font-extrabold tracking-wide text-rose-700">読み・意味</p>
        <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink/80">{item.answer}</p>
      </div>
      <p className="text-sm font-bold leading-relaxed text-ink/65">{item.detail}</p>
      {item.marked && (
        <div className="rounded-2xl bg-white p-3">
          <KanbunMarkedText marked={item.marked} showLegend={false} size="sm" />
          {item.kakikudashi && <p className="mt-2 text-sm font-bold leading-relaxed text-ink/75"><KanbunText>{item.kakikudashi}</KanbunText></p>}
          {item.translation && <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">{item.translation}</p>}
        </div>
      )}
      <KanbunNotes item={item} usageLabel="使い分け・見分け方" />
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" onClick={() => onStudy([item], item.title)}>
          <Book size={15} /> 暗記
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onQuiz([item], item.title)}>
          <Cards size={15} /> テスト
        </Button>
      </div>
    </div>
  )
}

// 体系表の入口。表ごとに、表に出てくる項目をまとめて暗記・テストする。
// 「表と使い分け」で解説と表を出し、表の行を押すとその項目の説明を表の中に開く。
function SystemCard({ system, items, srs, open, onToggle, onStudy, onQuiz, openRow, onToggleRow, renderItem }) {
  return (
    <LearningEntryCard
      data-kanbun-system={system.id}
      emoji={system.emoji}
      accentColor="#be123c"
      title={system.title}
      countLabel={`${items.length}項目`}
      subtitle={`${items.length}項目・${items.length}問`}
      status={summarizeSrsItems(items, srs)}
      units={{ learning: '項目', quiz: '問' }}
      studyAriaLabel={`体系表「${system.title}」の項目をまとめて暗記`}
      onStudy={onStudy}
      quizAriaLabel={`体系表「${system.title}」の項目をテスト`}
      onQuiz={onQuiz}
      browseLabel={open ? '表を閉じる' : '表と使い分け'}
      browseIcon={<Lightbulb size={15} />}
      browseAriaLabel={`体系表「${system.title}」を${open ? '閉じる' : '開く'}`}
      browseProps={{ 'aria-expanded': open, 'data-kanbun-system-card-toggle': system.id }}
      onBrowse={onToggle}
    >
      {open && (
        <div className="mt-3 space-y-2.5" data-kanbun-system-detail={system.id}>
          <p className="rounded-2xl bg-rose-50/70 p-3 text-sm font-bold leading-relaxed text-ink/75 ring-1 ring-rose-100">
            {system.explain}
          </p>
          <p className="px-1 text-[11px] font-bold text-ink/45">{'左の欄を押すと、その項目の説明が開きます。'}</p>
          <KanbunSystemTable system={system} openRow={openRow} onToggleRow={onToggleRow} renderItem={renderItem} />
          <KanbunSystemAuxTables system={system} />
        </div>
      )}
    </LearningEntryCard>
  )
}

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
  // 一覧の見え方は params に置き、暗記・テストから戻ったときも同じ一覧・同じ項目から続ける。
  const [view, setView] = useScreenParam('view', readView)
  const [level, setLevel] = useScreenParam('level', readLevel)
  const [category, setCategory] = useScreenParam(
    'category',
    readChoice(['all', ...categories.map((item) => item.id)], 'all'),
  )
  const [query, setQuery] = useScreenParam('query', readText)
  const [filtersOpen, setFiltersOpen] = useScreenParam('filtersOpen', readOpen)
  const [openId, setOpenId] = useScreenParam('openId', readOpenId)
  const [groupType, setGroupType] = useScreenParam('groupType', readGroupType)
  const [openGroupId, setOpenGroupId] = useScreenParam('openGroup', readOpenId)
  const [openSystem, setOpenSystem] = useScreenParam('system', readSystem)
  const [systemRow, setSystemRow] = useScreenParam('systemRow', readOpenId)

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
  const openGroups = () => {
    scrollScreenToTop()
    setView('groups')
  }
  // 体系表を開く。項目の説明から来たときは、その表を開いた状態で見せる。
  const openSystems = (systemId = null) => {
    scrollScreenToTop()
    setOpenSystem(systemId)
    setSystemRow(null)
    setView('systems')
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
          {domain === 'vocab' && (
            <ChooserTile
              onClick={openGroups}
              data-kanbun-groups-entry
              aria-label={`仲間でまとめて暗記。${KANBUN_GROUPS.length}組`}
              icon={<Sprout size={19} />}
              iconClassName="bg-teal-100 text-teal-700"
              label="仲間で暗記"
            >
              {`${KANBUN_GROUPS.length}組`}
            </ChooserTile>
          )}
          {domain === 'grammar' && (
            <ChooserTile
              onClick={() => openSystems()}
              data-kanbun-systems-entry
              aria-label={`体系表でまとめて暗記。${KANBUN_SYSTEMS.length}表`}
              icon={<BookOpen size={19} />}
              iconClassName="bg-rose-100 text-rose-700"
              label="体系表"
            >
              {`${KANBUN_SYSTEMS.length}表`}
            </ChooserTile>
          )}
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

  const levelLabel = KANBUN_LEVELS.find((item) => item.id === level)?.shortLabel ?? '全レベル'
  const categoryLabel = categories.find((item) => item.id === category)?.label ?? '全分野'
  const catalogView = (
    <div className="pb-8" data-kanbun-catalog-list={domain}>
      <ScreenHeader title={`${meta.label}の一覧を確認`} compact />

      <main className="space-y-3 px-4 pt-3">
        <CatalogTools
          open={filtersOpen}
          onToggle={() => setFiltersOpen((current) => !current)}
          summary={`${levelLabel}・${categoryLabel}${query.trim() ? `・検索「${query.trim()}」` : ''}`}
          narrowed={level !== 'all' || category !== 'all' || Boolean(query.trim())}
          toolsClassName="space-y-3"
          label="しぼり込み"
          toggleProps={{ 'data-kanbun-catalog-tools-toggle': true }}
          tabs={(
            <LearningViewTabs
              view="list"
              onChange={(next) => setView(next === 'list' ? 'list' : 'home')}
              learnLabel="学ぶ"
              listLabel="一覧を確認"
              label={`${meta.label}の見方`}
            />
          )}
        >
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
        </CatalogTools>

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
          renderAfter={(item) => {
            const extrasOpen = openId === item.id
            return (
              <div className="mt-1.5 rounded-xl bg-white/70 px-3 py-2" data-kanbun-list-note={item.id}>
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-extrabold leading-relaxed text-ink"><KanbunHeadword item={item} /></h3>
                    {item.reading && <p className="text-[11px] font-bold text-rose-700">読み：{item.reading}</p>}
                    {item.pattern && <p className="text-[11px] font-bold text-rose-700">形：<KanbunPatternText pattern={item.pattern} /></p>}
                    <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">{item.clue}</p>
                  </div>
                  <WordBookToggle domain={wordBookDomain} itemId={item.id} itemLabel={item.title} />
                </div>
                {/* 漢語は使い分けと仲間、漢文法は使い分けと体系表を、押したときだけ開く。 */}
                {domain !== 'culture' && (
                  <button
                    type="button"
                    onClick={() => setOpenId((current) => current === item.id ? null : item.id)}
                    aria-expanded={extrasOpen}
                    className="mt-1.5 flex items-center gap-1 text-xs font-extrabold text-rose-800"
                    data-kanbun-list-extras-toggle={item.id}
                  >
                    {extrasOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {domain === 'vocab' ? '使い分け・仲間' : '使い分け・体系表'}
                  </button>
                )}
                {extrasOpen && (
                  <KanbunExtras
                    domain={domain}
                    item={item}
                    onStudyGroup={(group) => study(group.items, `仲間「${group.title}」`)}
                    onOpenSystem={openSystems}
                    className="mt-2"
                  />
                )}
              </div>
            )
          }}
        />
      </main>
    </div>
  )

  // 仲間でまとめて暗記（漢語）。同じ読みの字・読み分ける字・反対の意味・テーマの組で、使い分けの解説といっしょに暗記する。
  const groupsView = () => {
    const shownToc = KANBUN_GROUP_TOC.filter(({ type }) => groupType === 'all' || type.id === groupType)
    return (
      <div className="pb-8" data-kanbun-groups-view={groupType}>
        <ScreenHeader
          title="仲間でまとめて暗記"
          subtitle={`${KANBUN_GROUPS.length}組・全${collection.length}語`}
          compact
        />
        <div className="space-y-3 px-4 pt-3">
          <p className="px-1 text-xs font-bold leading-relaxed text-ink/50">
            {'同じ読みの字・読み分ける字・反対の意味・テーマの組で、使い分けの解説といっしょに暗記します。'}
          </p>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setGroupType('all')}
              aria-pressed={groupType === 'all'}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                groupType === 'all' ? 'bg-teal-700 text-white' : 'bg-white text-ink/50'
              }`}
            >
              すべて {KANBUN_GROUPS.length}
            </button>
            {KANBUN_GROUP_TOC.map(({ type, groups }) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setGroupType(type.id)}
                aria-pressed={groupType === type.id}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                  groupType === type.id ? 'bg-teal-700 text-white' : 'bg-white text-ink/50'
                }`}
                data-kanbun-group-type={type.id}
              >
                {type.emoji} {type.label} {groups.length}
              </button>
            ))}
          </div>
          {shownToc.map(({ type, groups }) => (
            <section key={type.id} className="space-y-3" data-kanbun-group-section={type.id}>
              <h2 className="px-1 pt-1 font-display text-base font-extrabold text-ink/80">{type.emoji} {type.label}</h2>
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  srs={srs}
                  open={openGroupId === group.id}
                  onToggle={() => setOpenGroupId((current) => current === group.id ? null : group.id)}
                  onStudy={() => study(group.items, `仲間「${group.title}」`)}
                  onQuiz={() => quiz(group.items, `仲間「${group.title}」のテスト`)}
                />
              ))}
            </section>
          ))}
        </div>
      </div>
    )
  }

  // 体系表（漢文法）：再読文字・否定・疑問と反語などを表にまとめ、表ごとにまとめて暗記・テストする。
  const systemsView = () => (
    <div className="pb-8" data-kanbun-systems-view>
      <ScreenHeader
        title="体系表でまとめて暗記"
        subtitle={`${KANBUN_SYSTEMS.length}表・全${collection.length}項目`}
        compact
      />
      <div className="space-y-3 px-4 pt-3">
        <p className="px-1 text-xs font-bold leading-relaxed text-ink/50">
          {'再読文字・否定・疑問と反語などの句法を表で見比べ、表ごとにまとめて暗記・テストします。'}
        </p>
        {KANBUN_SYSTEMS.map((system) => {
          const items = kanbunSystemItemIds(system).map((id) => collection.find((item) => item.id === id)).filter(Boolean)
          return (
            <SystemCard
              key={system.id}
              system={system}
              items={items}
              srs={srs}
              open={openSystem === system.id}
              onToggle={() => {
                setSystemRow(null)
                setOpenSystem((current) => current === system.id ? null : system.id)
              }}
              onStudy={() => study(items, `${system.title}を暗記`)}
              onQuiz={() => quiz(items, `${system.title}のテスト`)}
              openRow={systemRow}
              onToggleRow={setSystemRow}
              renderItem={(id) => {
                const item = collection.find((entry) => entry.id === id)
                return item && <GrammarItemDetail item={item} onStudy={study} onQuiz={quiz} />
              }}
            />
          )
        })}
      </div>
    </div>
  )

  if (view === 'list') return catalogView
  if (view === 'groups' && domain === 'vocab') return groupsView()
  if (view === 'systems' && domain === 'grammar') return systemsView()
  return homeView
}
