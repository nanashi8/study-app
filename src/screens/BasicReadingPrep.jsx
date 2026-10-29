import { useMemo, useRef, useState } from 'react'
import { useScreenParam, useStore } from '../store/useStore.js'
import {
  BASIC_READING_KINDS,
  basicReadingThemeLabel,
  getBasicReadingPassage,
} from '../data/basic-reading/index.js'
import { basicReadingApproach } from '../data/basic-reading/approaches.js'
import { getLevel } from '../data/levels.js'
import { getReadingRulePhase } from '../data/reading-rules.js'
import { basicReadingLevelWords, basicReadingPhrases, basicReadingWordCount } from '../lib/basicReading.js'
import { basicReadingPassageRules } from '../lib/basicReadingSentence.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { PhraseDetailSheet } from '../components/PhraseDetailSheet.jsx'
import { useWordBookSlot, wordBookSlotButtonText } from '../components/WordBookSlot.jsx'
import { wordBookRef } from '../lib/wordBooks.js'
import { Button, Card, Chip, cx } from '../components/ui.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { ArrowRight, BookOpen, Bookmark, Cards, Check } from '../components/Icons.jsx'

const readPrepView = (value) => (value === 'list' ? 'list' : 'prep')
const readListTab = (value) => (value === 'phrases' ? 'phrases' : 'words')

// 基礎長文の読解の準備。長文（読解の準備）と同じ作りで、テーマの読み方と読解ルールの紹介、
// 本文に出るその級の単語と熟語・表現の「暗記／テスト／一覧を確認」を並べる。
export function BasicReadingPrepScreen() {
  const params = useStore((state) => state.params)
  const passageId = params.passageId
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  // 表示とタブは params に置き、語の詳細や暗記から戻ったときも同じ一覧・同じ位置から続ける。
  const [view, setView] = useScreenParam('view', readPrepView)
  const [tab, setTab] = useScreenParam('listTab', readListTab)
  const [detail, setDetail] = useState(null)
  const scrollAreaRef = useRef(null)

  const passage = getBasicReadingPassage(passageId)
  const passageRules = useMemo(() => (passage ? basicReadingPassageRules(passage) : []), [passage])
  const words = passage ? basicReadingLevelWords(passage) : []
  const wordIds = words.map((word) => word.id)
  // 単語は、画面下部の「単語帳」で選んだ登録先にまとめて入れる（全部入っていれば外す）。
  const wordsBook = useWordBookSlot(wordIds.map(wordBookRef), {
    label: `この長文の単語${wordIds.length}語`,
  })

  if (!passage) {
    return (
      <div>
        <ScreenHeader title="読解の準備" />
        <div className="p-8 text-center font-bold text-ink/50">長文が見つかりませんでした。</div>
      </div>
    )
  }

  const level = getLevel(passage.level)
  const phrases = basicReadingPhrases(passage)
  const approach = basicReadingApproach(passage)
  const ruleGroups = passageRules.reduce((groups, use) => {
    const last = groups.at(-1)
    if (last?.phase.id === use.rule.phase) last.uses.push(use)
    else groups.push({ phase: getReadingRulePhase(use.rule.phase), uses: [use] })
    return groups
  }, [])
  const wordStatus = summarizeSrsItems(wordIds, srs)
  const phraseStatus = summarizeSrsItems(phrases, srs)
  const returnTo = { screen: 'basicReadingPrep', params: { passageId } }
  const continueTo = { ...returnTo, label: '読解の準備に戻る' }

  const studyWords = (asQuiz = false) =>
    navigate(asQuiz ? 'vocabQuiz' : 'vocabStudy', {
      source: { type: 'deck', ids: wordIds },
      size: wordIds.length,
      title: `${passage.titleJa}・英検${level.label}の単語`,
      ...(asQuiz ? {} : { mode: 'study' }),
      continueTo,
      returnTo,
    })

  const studyPhrases = (asQuiz = false, items = phrases) =>
    navigate(asQuiz ? 'phraseQuiz' : 'phraseStudy', {
      source: { type: 'customPhrase', items },
      size: items.length,
      title: `${passage.titleJa}・熟語と表現`,
      ...(asQuiz ? {} : { mode: 'study', engine: 'phrase' }),
      continueTo,
      returnTo,
    })

  const readPassage = () => navigate('basicReadingLesson', { passageId, returnTo: params.returnTo })

  // 「準備」と「一覧を確認」を切り替えたときは、切り替え先を先頭から読み始められるようにする。
  const showView = (nextView) => {
    scrollScreenToTop()
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0
    setView(nextView)
  }

  const openList = (nextTab) => {
    setTab(nextTab)
    showView('list')
  }

  const prepView = (
    <>
      <section className="pb-4 pt-1">
        <div className="flex items-start gap-3">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: `${level.color}22` }}
          >
            {passage.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-extrabold leading-tight text-ink">{passage.title}</h1>
            <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">{passage.titleJa}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-extrabold text-ink/45">
          <span>本文 {basicReadingWordCount(passage)}語</span>
          <span>英検{level.label}の単語 {words.length}語</span>
          <span>熟語・表現 {phrases.length}項目</span>
        </div>
      </section>

      <Card className="mb-4 p-4" data-basic-reading-approach={passage.id}>
        <div className="text-xs font-extrabold text-ink/45">テーマ</div>
        <div className="mt-1 font-display text-base font-extrabold text-ink">{basicReadingThemeLabel(passage)}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip color={level.color}>{BASIC_READING_KINDS[passage.kind]}</Chip>
        </div>

        {approach && (
          <div className="mt-4 border-t border-brand-100 pt-4">
            <div className="text-xs font-extrabold text-brand-600">このテーマの読み方</div>
            <h2 className="mt-1 font-display text-base font-extrabold leading-snug text-ink">{approach.title}</h2>
            <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/55">{approach.summary}</p>
            <ol className="mt-3 grid gap-2" aria-label="この長文の問題で学ぶルールの使いどころ">
              {approach.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5" data-basic-reading-approach-step={passage.lessons[index]?.rule}>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-xs font-extrabold leading-relaxed text-ink/70">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>

      <Card className="mb-4 p-4" data-basic-reading-rules-for-passage={passage.id}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold text-ink/45">この本文で使う</div>
            <div className="mt-0.5 font-display text-lg font-extrabold text-ink">読解ルール {passageRules.length}件</div>
          </div>
          <button
            type="button"
            onClick={() => navigate('readingRules')}
            className="shrink-0 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
          >
            全30件
          </button>
        </div>
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
          {'本文の文で出てくるルールです。「問題で学ぶ」のルールは、本文のあとの問題で使います。'}
        </p>
        <div className="mt-3 space-y-3">
          {ruleGroups.map(({ phase, uses }) => (
            <section key={phase.id} data-basic-reading-prep-rule-phase={phase.id}>
              <h3 className="px-1 text-[11px] font-extrabold" style={{ color: phase.color }}>
                {phase.step}. {phase.label}
              </h3>
              <div className="mt-1.5 space-y-2">
                {uses.map(({ rule, lesson, sentences }) => (
                  <div key={rule.id} data-basic-reading-prep-rule={rule.id} data-basic-reading-prep-rule-lesson={lesson ? 'true' : 'false'}>
                    <div className="mb-1 flex flex-wrap gap-1 px-1">
                      {lesson && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">問題で学ぶ</span>
                      )}
                      {sentences.length > 0 && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-ink/55">
                          {`第${sentences.join('・')}文`}
                        </span>
                      )}
                    </div>
                    <ReadingRuleCard rule={rule} compact />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Card>

      {/* 事前学習：ほかの教材と同じ「暗記／テスト／一覧を確認」の並び */}
      <div className="px-1 pb-2">
        <p className="text-[10px] font-extrabold text-brand-600">事前学習</p>
        <h2 className="font-display text-lg font-extrabold text-ink">単語・熟語を先に暗記する</h2>
        <p className="mt-1 text-xs font-bold text-ink/45">暗記 → テスト → 一覧で確認、の順に進めます。</p>
      </div>

      <div className="space-y-3">
        <LearningEntryCard
          data-basic-reading-prep-entry="words"
          icon={<Cards size={22} />}
          accentColor={level.color}
          title={`英検${level.label}の単語`}
          countLabel={`全${words.length}語`}
          subtitle="本文に出るこの級の単語を、読む前に暗記する"
          status={wordStatus}
          units={{ learning: '語', quiz: '問' }}
          studyDisabled={!words.length}
          studyAriaLabel={`${passage.titleJa}の単語を暗記`}
          onStudy={() => studyWords(false)}
          quizDisabled={!words.length}
          quizAriaLabel={`${passage.titleJa}の単語をテスト`}
          onQuiz={() => studyWords(true)}
          catalogLabel="一覧を確認"
          catalogAriaLabel={`${passage.titleJa}の単語を一覧で確認する`}
          catalogDisabled={!words.length}
          onCatalog={() => openList('words')}
        />

        <LearningEntryCard
          data-basic-reading-prep-entry="phrases"
          icon={<BookOpen size={22} />}
          accentColor="#0ea5e9"
          title="熟語・表現"
          countLabel={`全${phrases.length}項目`}
          subtitle={phrases.length ? '本文の言い回しを、まとまりのまま暗記する' : 'この長文には、覚えておく熟語・表現はありません'}
          status={phraseStatus}
          units={{ learning: '項目', quiz: '問' }}
          studyDisabled={!phrases.length}
          studyAriaLabel={`${passage.titleJa}の熟語・表現を暗記`}
          onStudy={() => studyPhrases(false)}
          quizDisabled={!phrases.length}
          quizAriaLabel={`${passage.titleJa}の熟語・表現をテスト`}
          onQuiz={() => studyPhrases(true)}
          catalogLabel="一覧を確認"
          catalogAriaLabel={`${passage.titleJa}の熟語・表現を一覧で確認する`}
          catalogDisabled={!phrases.length}
          onCatalog={() => openList('phrases')}
        />
      </div>
    </>
  )

  const listView = (
    <div className="space-y-3 pt-1" data-basic-reading-prep-catalog={tab}>
      <LearningViewTabs
        view="list"
        onChange={(nextView) => {
          if (nextView !== 'list') showView('prep')
        }}
        learnValue="prep"
        label="読解の準備の見方"
      />

      <div className="grid grid-cols-2 rounded-2xl bg-brand-100 p-1" role="tablist" aria-label="一覧で確認する教材">
        {[
          { id: 'words', label: `単語 ${words.length}` },
          { id: 'phrases', label: `熟語・表現 ${phrases.length}` },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            data-basic-reading-prep-list-tab={item.id}
            className={cx(
              'min-h-11 rounded-xl px-2 py-2 text-sm font-extrabold transition-colors',
              tab === item.id ? 'bg-white text-brand-700 shadow-sm' : 'text-brand-700/65',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="px-1 text-xs font-bold leading-relaxed text-ink/45">
        左右にスワイプして、学習とテストの結果を直接記録できます。
      </p>

      {tab === 'words' ? (
        <>
          <Button
            full
            variant={wordsBook.inBook ? 'soft' : 'hint'}
            disabled={!wordIds.length}
            onClick={wordsBook.press}
            aria-pressed={wordsBook.inBook}
            data-basic-reading-prep-word-book
          >
            {wordsBook.inBook ? <Check size={17} /> : <Bookmark size={17} />}
            {wordBookSlotButtonText({ bookTitle: wordsBook.bookTitle, inBook: wordsBook.inBook, what: `全${wordIds.length}語を` })}
          </Button>
          <NormalLearningRecordList
            entryId="basic-reading-prep-words"
            contentId="vocab"
            items={words}
            unit="語"
            onOpen={(item) => navigate('wordDetail', { id: item.id })}
            openLabel="この単語の詳細を見る"
            openHint="詳細"
            emptyMessage="この長文の単語はありません。"
          />
        </>
      ) : (
        <NormalLearningRecordList
          entryId="basic-reading-prep-phrases"
          contentId="usage"
          items={phrases}
          unit="項目"
          titleLanguage="en"
          onOpen={(item) => setDetail(item)}
          openLabel="この熟語・表現の説明を見る"
          openHint="説明"
          emptyMessage="この長文には、覚えておく熟語・表現はありません。"
        />
      )}
    </div>
  )

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title={view === 'list' ? '準備の一覧を確認' : '読解の準備'}
        subtitle={passage.titleJa}
        color={level.color}
        right={<Chip color={level.color}>英検{level.label}</Chip>}
      />

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 pb-4" data-return-scroll="basic-reading-prep">
        {view === 'list' ? listView : prepView}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" onClick={readPassage} data-basic-reading-prep-read>
          本文を読む <ArrowRight size={18} />
        </Button>
      </div>

      <PhraseDetailSheet phrase={detail} onClose={() => setDetail(null)} returnTo={returnTo} />
    </div>
  )
}
