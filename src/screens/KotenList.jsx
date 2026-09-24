import { isDue, todayIndex, useScreenParam, useStore } from '../store/useStore.js'
import { KOTEN_TOC, KOTEN_WORDS, KOTEN_WORD_LEVELS } from '../data/koten.js'
import { KOTEN_GROUPS, KOTEN_GROUP_TOC } from '../lib/kotenWordGroups.js'
import { KotenText, KotenWord } from '../components/KotenFurigana.jsx'
import {
  KOTEN_CURRICULUM_BY_ID,
  KOTEN_CURRICULUM_LEVELS,
} from '../data/koten-curriculum.js'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { CatalogTools } from '../components/CatalogTools.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import {
  ContentMenu,
  ContentMenuButton,
  ContentMenuSection,
} from '../components/ContentMenu.jsx'
import {
  ChooserTile,
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  WordBookTile,
} from '../components/ContentTop.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { readChoice, readOpen, readOpenId } from '../lib/screenParams.js'
import {
  Book,
  BookOpen,
  Headphones,
  Lightbulb,
  Scroll,
  Search,
  Sprout,
} from '../components/Icons.jsx'

function CategoryCard({ cat, words, srs, onStudy, onQuiz, onCatalog }) {
  const status = summarizeSrsItems(words, srs)
  return (
    <LearningEntryCard
      data-koten-category={cat.id}
      emoji={cat.emoji}
      accentColor={cat.color}
      title={cat.label}
      countLabel={`全${words.length}語`}
      status={status}
      units={{ learning: '語', quiz: '問' }}
      studyAriaLabel={`${cat.label}の古典単語を暗記`}
      onStudy={onStudy}
      quizAriaLabel={`${cat.label}の古典単語をテスト`}
      onQuiz={onQuiz}
      catalogLabel="一覧を確認"
      catalogAriaLabel={`${cat.label}の古典単語を一覧で確認する`}
      onCatalog={onCatalog}
    />
  )
}

// 仲間（まとめて暗記する組）の入口。暗記・テストは仲間の語だけで行い、
// 「使い分けの解説」を開くと、仲間の中での各語の意味と解説が読める（語を押すと辞書ページへ）。
function GroupCard({ group, srs, open, onToggle, onStudy, onQuiz, onOpenWord }) {
  const words = group.entries.map((entry) => entry.word)
  const status = summarizeSrsItems(words, srs)
  return (
    <LearningEntryCard
      data-koten-group={group.id}
      emoji={group.typeInfo?.emoji}
      accentColor="#0d9488"
      title={group.title}
      countLabel={`${words.length}語`}
      subtitle={words.map((word) => word.word).join('・')}
      status={status}
      units={{ learning: '語', quiz: '問' }}
      studyAriaLabel={`仲間「${group.title}」をまとめて暗記`}
      onStudy={onStudy}
      quizAriaLabel={`仲間「${group.title}」をテスト`}
      onQuiz={onQuiz}
      browseLabel={open ? '解説を閉じる' : '使い分けの解説'}
      browseIcon={<Lightbulb size={15} />}
      browseAriaLabel={`仲間「${group.title}」の使い分けの解説を${open ? '閉じる' : '読む'}`}
      browseProps={{ 'aria-expanded': open, 'data-koten-group-toggle': group.id }}
      onBrowse={onToggle}
    >
      {open && (
        <div className="mt-3 space-y-2 rounded-2xl bg-teal-50/70 p-3 ring-1 ring-teal-100" data-koten-group-detail={group.id}>
          <p className="text-sm font-bold leading-relaxed text-ink/75"><KotenText>{group.explain}</KotenText></p>
          <ul className="space-y-1">
            {group.entries.map((entry) => (
              <li key={entry.word.id}>
                <button
                  type="button"
                  onClick={() => onOpenWord(entry.word.id)}
                  className="flex w-full items-baseline gap-2 rounded-xl bg-white px-2.5 py-1.5 text-left"
                  aria-label={`${entry.word.word}の辞書ページを開く`}
                >
                  <span className="shrink-0 text-sm font-extrabold text-ink"><KotenWord word={entry.word} /></span>
                  <span className="min-w-0 text-xs font-bold leading-relaxed text-ink/60"><KotenText>{entry.role}</KotenText></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </LearningEntryCard>
  )
}

// 古典アプリは、英語アプリと同じく「ホーム（学ぶ内容を選ぶ）→ コンテンツのトップ」の2段にする。
// 古典単語のトップはこの画面の view 'vocab'。ホームから入ると履歴に積まれ、上部の「戻る」でホームへ戻る。
// 表示・コース・一覧の分野は params に置き、暗記・テストから戻ったときも同じ見え方から続ける。
const readView = readChoice(['home', 'vocab', 'list', 'groups'], 'home')
const readGroupType = readChoice(['all', ...KOTEN_GROUP_TOC.map(({ type }) => type.id)], 'all')
const readCourse = readChoice(KOTEN_CURRICULUM_LEVELS.map((level) => level.id), 'middle')
const readListCategory = readChoice(['all', ...KOTEN_TOC.map(({ category }) => category.id)], 'all')

export function KotenListScreen() {
  const navigate = useStore((s) => s.navigate)
  const kotenSrs = useStore((s) => s.kotenSrs)
  const [curriculumLevel, setCurriculumLevel] = useScreenParam('course', readCourse)
  const [view, setView] = useScreenParam('view', readView)
  const [listCategory, setListCategory] = useScreenParam('category', readListCategory)
  const [filtersOpen, setFiltersOpen] = useScreenParam('filtersOpen', readOpen)
  const [groupType, setGroupType] = useScreenParam('groupType', readGroupType)
  const [openGroupId, setOpenGroupId] = useScreenParam('openGroup', readOpenId)

  const dueWords = KOTEN_WORDS.filter((w) => kotenSrs[w.id] && isDue(kotenSrs[w.id]))
  const totalStatus = summarizeSrsItems(KOTEN_WORDS, kotenSrs)
  // 今日の学習：古典単語の復習。今日の分がなければ、学んだ語を復習日が近い順に。
  const vocabReview = contentReviewSummary(KOTEN_WORDS, kotenSrs, todayIndex())

  const study = (ids, title) => navigate('kotenStudy', { ids, title })
  const quiz = (ids, title) => navigate('kotenQuiz', { ids, title })
  const selectedCourse = KOTEN_CURRICULUM_BY_ID[curriculumLevel]
  const openVocabCatalog = (categoryId = 'all') => {
    scrollScreenToTop()
    setListCategory(categoryId)
    setView('list')
  }
  const listEntry = KOTEN_TOC.find(({ category }) => category.id === listCategory)
  const listWords = listEntry ? listEntry.words : KOTEN_WORDS
  const openWordDetail = (id) => navigate('kotenWordDetail', { id })
  const openGroups = () => {
    scrollScreenToTop()
    setView('groups')
  }

  // 仲間でまとめて暗記。似た意味・反対の意味・同じ語から生まれた語などの組で、使い分けといっしょに暗記する。
  if (view === 'groups') {
    const shownToc = KOTEN_GROUP_TOC.filter(({ type }) => groupType === 'all' || type.id === groupType)
    return (
      <div className="pb-6" data-koten-groups-view={groupType}>
        <ScreenHeader
          title="仲間でまとめて暗記"
          subtitle={`${KOTEN_GROUPS.length}組・全${KOTEN_WORDS.length}語`}
          compact
        />
        <div className="space-y-3 px-4 pt-3">
          <p className="px-1 text-xs font-bold leading-relaxed text-ink/50">
            {'似た意味・反対の意味・同じ語から生まれた語などの組で、使い分けの解説といっしょに暗記します。'}
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
              すべて {KOTEN_GROUPS.length}
            </button>
            {KOTEN_GROUP_TOC.map(({ type, groups }) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setGroupType(type.id)}
                aria-pressed={groupType === type.id}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                  groupType === type.id ? 'bg-teal-700 text-white' : 'bg-white text-ink/50'
                }`}
                data-koten-group-type={type.id}
              >
                {type.emoji} {type.label} {groups.length}
              </button>
            ))}
          </div>
          {shownToc.map(({ type, groups }) => (
            <section key={type.id} className="space-y-3" data-koten-group-section={type.id}>
              <h2 className="px-1 pt-1 font-display text-base font-extrabold text-ink/80">{type.emoji} {type.label}</h2>
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  srs={kotenSrs}
                  open={openGroupId === group.id}
                  onToggle={() => setOpenGroupId((current) => current === group.id ? null : group.id)}
                  onStudy={() => study(group.entries.map((entry) => entry.word.id), group.title)}
                  onQuiz={() => quiz(group.entries.map((entry) => entry.word.id), group.title)}
                  onOpenWord={openWordDetail}
                />
              ))}
            </section>
          ))}
        </div>
      </div>
    )
  }

  // 「一覧を確認」からは、古典単語の全項目を学習・テスト別に見直す。
  if (view === 'list') {
    return (
      <div className="pb-6" data-koten-vocab-catalog={listCategory}>
        <ScreenHeader
          title={`${listEntry ? listEntry.category.label : '古典単語'}の一覧を確認`}
          compact
        />
        <div className="space-y-3 px-4 pt-3">
          <CatalogTools
            open={filtersOpen}
            onToggle={() => setFiltersOpen((current) => !current)}
            summary={listEntry ? listEntry.category.label : 'すべて'}
            narrowed={Boolean(listEntry)}
            toolsClassName="space-y-3"
            label="しぼり込み"
            toggleProps={{ 'data-koten-vocab-tools-toggle': true }}
            tabs={(
              <LearningViewTabs
                view="list"
                onChange={(next) => setView(next === 'list' ? 'list' : 'vocab')}
                learnLabel="学ぶ"
                listLabel="一覧を確認"
                label="古典単語の見方"
              />
            )}
          >
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setListCategory('all')}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                  listCategory === 'all' ? 'bg-amber-700 text-white' : 'bg-white text-ink/50'
                }`}
              >
                すべて {KOTEN_WORDS.length}
              </button>
              {KOTEN_TOC.map(({ category, words }) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setListCategory(category.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                    listCategory === category.id ? 'text-white' : 'bg-white text-ink/50'
                  }`}
                  style={listCategory === category.id ? { background: category.color } : undefined}
                >
                  {category.emoji} {category.label} {words.length}
                </button>
              ))}
            </div>
          </CatalogTools>
          <p className="px-1 text-xs font-bold leading-relaxed text-ink/45">
            左右にスワイプして、学習とテストの結果を直接記録できます。
          </p>
          <NormalLearningRecordList
            entryId="koten-vocab"
            contentId="koten-vocab"
            items={listWords}
            unit="語"
            onOpen={(item) => openWordDetail(item.id)}
            openLabel="この単語の辞書ページを開く"
            openHint="辞書"
            emptyMessage="表示できる古典単語はありません。"
          />
        </div>
      </div>
    )
  }

  // 古典単語のトップ。英語アプリの単語画面と同じ並び（今日の学習 → 単語帳 → 分野のカード）。
  if (view === 'vocab') {
    return (
      <div className="pb-6" data-koten-vocab-top>
        <ScreenHeader
          title="古典単語"
          subtitle="中学古典〜最難関大学の重要語を暗記・テスト"
          right={(
            <IconButton onClick={() => openVocabCatalog('all')} aria-label="古典単語を一覧で確認する">
              <Search size={22} />
            </IconButton>
          )}
        />
        <div className="space-y-3 px-4">
          <TodayCard data-koten-vocab-today>
            <ReviewTodayRow
              state={vocabReview.state}
              due={vocabReview.dueItems.length}
              nextInDays={vocabReview.nextInDays}
              unit="語"
              onStart={() => study(
                reviewTargetItems(vocabReview).map((word) => word.id),
                vocabReview.state === 'due' ? '古典単語・今日の復習' : '古典単語・復習日より前に練習',
              )}
            />
          </TodayCard>
          <ChooserTiles data-koten-vocab-choosers>
            <ChooserTile
              onClick={openGroups}
              data-koten-groups-entry
              aria-label={`仲間でまとめて暗記。${KOTEN_GROUPS.length}組`}
              icon={<Sprout size={19} />}
              iconClassName="bg-teal-100 text-teal-700"
              label="仲間で暗記"
            >
              {`${KOTEN_GROUPS.length}組`}
            </ChooserTile>
            <WordBookTile domain="kotenVocab" returnTo={{ screen: 'kotenList', params: { view: 'vocab' } }} />
          </ChooserTiles>

          <LearningEntryCard
            data-koten-entry="vocab"
            emoji="📖"
            accentColor="#f97316"
            title="古典単語の全範囲"
            countLabel={`全${KOTEN_WORDS.length}語`}
            subtitle={`全${KOTEN_WORDS.length}語・全${KOTEN_WORDS.length}問`}
            status={totalStatus}
            units={{ learning: '語', quiz: '問' }}
            note={dueWords.length > 0 ? `復習が必要 ${dueWords.length}語` : undefined}
            noteTone={dueWords.length > 0 ? 'alert' : 'muted'}
            studyAriaLabel="古典単語の全範囲を暗記"
            onStudy={() => study(KOTEN_WORDS.map((word) => word.id), '古典単語・全範囲')}
            quizAriaLabel="古典単語の全範囲をテスト"
            onQuiz={() => quiz(KOTEN_WORDS.map((word) => word.id), '古典単語・全範囲')}
            catalogLabel="一覧を確認"
            catalogAriaLabel="古典単語の全項目を一覧で確認する"
            onCatalog={() => openVocabCatalog('all')}
          />

          <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">レベルから選ぶ</h2>
          {KOTEN_WORD_LEVELS.map((level) => {
            const levelWords = KOTEN_WORDS.filter((word) => word.level === level.id)
            return (
              <LearningEntryCard
                key={level.id}
                data-koten-level={level.id}
                emoji={level.shortLabel.slice(0, 1)}
                accentColor={level.color}
                title={level.label}
                countLabel={`${levelWords.length}語`}
                status={summarizeSrsItems(levelWords, kotenSrs)}
                units={{ learning: '語', quiz: '問' }}
                studyAriaLabel={`${level.label}の古典単語を暗記`}
                onStudy={() => study(levelWords.map((word) => word.id), `古典単語・${level.label}`)}
                quizAriaLabel={`${level.label}の古典単語をテスト`}
                onQuiz={() => quiz(levelWords.map((word) => word.id), `古典単語・${level.label}`)}
              />
            )
          })}

          <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">分野から選ぶ</h2>
          {KOTEN_TOC.map(({ category, words }) => (
            <CategoryCard
              key={category.id}
              cat={category}
              words={words}
              srs={kotenSrs}
              onStudy={() => study(words.map((w) => w.id), category.label)}
              onQuiz={() => quiz(words.map((w) => w.id), category.label)}
              onCatalog={() => openVocabCatalog(category.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  // 古典アプリのホーム。英語アプリのホームと同じく、学ぶ内容（コンテンツ）を選ぶ。
  return (
    <ContentMenu title="古典アプリ" data-koten-home-menu>
      <ContentMenuSection title="コンテンツを選ぶ" data-koten-mode-group>
        <ContentMenuButton
          icon={Book}
          color="#f97316"
          label="古典単語"
          onClick={() => navigate('kotenList', { view: 'vocab' })}
          data-koten-menu-entry="vocab"
        />
        <ContentMenuButton
          icon={BookOpen}
          color="#a855f7"
          label="古典文法"
          onClick={() => navigate('kotenGrammar')}
          data-koten-menu-entry="grammar"
        />
        <ContentMenuButton
          icon={Lightbulb}
          color="#d946ef"
          label="古典常識"
          onClick={() => navigate('kotenCulture')}
          data-koten-menu-entry="culture"
        />
        <ContentMenuButton
          icon={Scroll}
          color="#ea580c"
          label="短文解釈"
          onClick={() => navigate('kotenInterpretationList')}
          data-koten-menu-entry="interpretation"
        />
        <ContentMenuButton
          icon={Headphones}
          color="#0d9488"
          label="日本古典の名作"
          onClick={() => navigate('literatureLibrary', { kind: 'classical' })}
          data-koten-menu-entry="literature"
        />
      </ContentMenuSection>

      {/* 学年・目標別コースは、単語・文法・常識をまたいで学ぶので、ホームに置く。 */}
      <section data-koten-courses>
        <h2 className="mb-1 px-1 font-display text-sm font-extrabold text-ink/65">学年・目標から選ぶ</h2>
        <p className="mb-2 px-1 text-xs font-bold text-ink/45">各コースで、単語・文法・常識を偏りなく暗記してテストします。</p>

        <div className="-mx-4 overflow-x-auto px-4 pb-2">
          <div className="flex min-w-max gap-2">
            {KOTEN_CURRICULUM_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setCurriculumLevel(level.id)}
                aria-pressed={curriculumLevel === level.id}
                className={`rounded-full px-3 py-2 text-xs font-extrabold transition-colors ${
                  curriculumLevel === level.id
                    ? 'bg-amber-700 text-white'
                    : 'bg-white text-amber-900 ring-1 ring-amber-200'
                }`}
              >
                {level.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <Card className="border border-amber-200 p-4">
          <div>
            <Chip className="bg-amber-100 text-amber-950">{selectedCourse.label}</Chip>
            <p className="mt-2 text-sm font-extrabold leading-relaxed text-amber-950">
              {selectedCourse.description}
            </p>
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl bg-amber-50/70 p-2.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">古典単語</p>
                <p className="text-[10px] font-bold text-ink/45">{selectedCourse.vocabIds.length}語</p>
              </div>
              <Button size="sm" onClick={() => study(selectedCourse.vocabIds, `${selectedCourse.label}・古典単語`)}>暗記</Button>
              <Button variant="secondary" size="sm" onClick={() => quiz(selectedCourse.vocabIds, `${selectedCourse.label}・古典単語`)}>テスト</Button>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl bg-amber-50/70 p-2.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">古典文法</p>
                <p className="text-[10px] font-bold text-ink/45">{selectedCourse.grammarIds.length}項目</p>
              </div>
              <Button size="sm" onClick={() => navigate('kotenGrammarStudy', { ids: selectedCourse.grammarIds, title: `${selectedCourse.label}・古典文法` })}>暗記</Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('kotenGrammarQuiz', { ids: selectedCourse.grammarIds, title: `${selectedCourse.label}・古典文法` })}>テスト</Button>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl bg-amber-50/70 p-2.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">古典常識</p>
                <p className="text-[10px] font-bold text-ink/45">{selectedCourse.cultureIds.length}テーマ</p>
              </div>
              <Button size="sm" onClick={() => navigate('kotenCultureStudy', { ids: selectedCourse.cultureIds, title: `${selectedCourse.label}・古典常識` })}>暗記</Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('kotenCultureQuiz', { ids: selectedCourse.cultureIds, title: `${selectedCourse.label}・古典常識` })}>テスト</Button>
            </div>
          </div>
        </Card>
      </section>
    </ContentMenu>
  )
}
