import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getLevel } from '../data/levels.js'
import { getReadingStudy, passageWordCount } from '../data/reading-study.js'
import { readingApproachForPassage, readingRulesForPassage } from '../data/reading-rules.js'
import { longSentenceTranslationFor } from '../data/long-sentence-translations.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { LongSentenceTranslation } from '../components/LongSentenceTranslation.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { Button, Card, Chip, cx } from '../components/ui.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Cards,
  Check,
  Link,
} from '../components/Icons.jsx'

const phraseLabel = (item) =>
  item.category === 'expression' ? '表現' : item.kind === 'syntax' ? '構文' : '熟語'

export function ReadingPrepScreen() {
  const params = useStore((state) => state.params)
  const passageId = params.passageId
  const navigate = useStore((state) => state.navigate)
  const myList = useStore((state) => state.myList)
  const srs = useStore((state) => state.srs)
  const addManyToMyList = useStore((state) => state.addManyToMyList)
  const [view, setView] = useState(params.view === 'list' ? 'list' : 'prep')
  const [tab, setTab] = useState(params.listTab === 'phrases' ? 'phrases' : 'words')
  const [detail, setDetail] = useState(null)
  const scrollAreaRef = useRef(null)

  const passage = getPassage(passageId)

  if (!passage) {
    return (
      <div>
        <ScreenHeader title="読解の準備" />
        <div className="p-8 text-center font-bold text-ink/50">長文が見つかりませんでした。</div>
      </div>
    )
  }

  const level = getLevel(passage.level)
  const { words, phrases } = getReadingStudy(passage)
  const passageApproach = readingApproachForPassage(passage)
  const passageRules = readingRulesForPassage(passage)
  const wordIds = words.map((word) => word.id)
  const wordStatus = summarizeSrsItems(wordIds, srs)
  const phraseStatus = summarizeSrsItems(phrases, srs)
  const allSaved = wordIds.length > 0 && wordIds.every((id) => myList.includes(id))
  const detailTranslation = detail ? longSentenceTranslationFor(detail) : null
  const continueTo = {
    screen: 'readingPrep',
    params: { passageId },
    label: '読解の準備に戻る',
  }

  const studyWords = (asQuiz = false) =>
    navigate(asQuiz ? 'vocabQuiz' : 'vocabStudy', {
      source: { type: 'deck', ids: wordIds },
      size: wordIds.length,
      title: `${passage.titleJa}・必須語彙`,
      ...(asQuiz ? {} : { mode: 'study' }),
      continueTo,
      returnTo: { screen: 'readingPrep', params: { passageId } },
    })

  const studyPhrases = (asQuiz = false, items = phrases) =>
    navigate(asQuiz ? 'phraseQuiz' : 'phraseStudy', {
      source: { type: 'customPhrase', items },
      size: items.length,
      title: `${passage.titleJa}・熟語と表現`,
      ...(asQuiz ? {} : { mode: 'study', engine: 'phrase' }),
      continueTo,
      returnTo: { screen: 'readingPrep', params: { passageId } },
    })

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
            <h1 className="font-display text-xl font-extrabold leading-tight text-ink">
              {passage.title}
            </h1>
            <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">{passage.blurb}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-extrabold text-ink/45">
          <span>本文 {passageWordCount(passage)}語</span>
          <span>テーマ必須語彙 {words.length}語</span>
          <span>熟語・表現 {phrases.length}項目</span>
        </div>
      </section>

      <Card
        className="mb-4 p-4"
        data-reading-approach-for-passage={passage.id}
      >
        <div className="text-xs font-extrabold text-ink/45">厳選テーマ</div>
        <div className="mt-1 font-display text-base font-extrabold text-ink">
          {passage.theme}
        </div>
        <div className="mt-3 text-xs font-extrabold text-ink/45">入試・英検の読解ポイント</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {passage.examFocus.map((focus) => (
            <Chip key={focus} color={level.color}>{focus}</Chip>
          ))}
        </div>

        {passageApproach && (
          <div className="mt-4 border-t border-brand-100 pt-4">
            <div className="text-xs font-extrabold text-brand-600">このテーマの読み方</div>
            <h2 className="mt-1 font-display text-base font-extrabold leading-snug text-ink">
              {passageApproach.title}
            </h2>
            <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/55">
              {passageApproach.summary}
            </p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-3">
              {passageApproach.steps.map((step, index) => (
                <li key={step} className="flex gap-2 rounded-xl bg-brand-50 px-3 py-2.5">
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

      <Card className="mb-4 p-4" data-reading-rules-for-passage={passage.id}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold text-ink/45">この本文で使う</div>
            <div className="mt-0.5 font-display text-lg font-extrabold text-ink">
              読解ルール {passageRules.length}件
            </div>
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
          必要なルールだけ開いて確認できます。
        </p>
        <div className="mt-3 space-y-2">
          {passageRules.map((rule) => (
            <ReadingRuleCard key={rule.id} rule={rule} compact />
          ))}
        </div>
      </Card>

      {/* 事前学習：ほかの教材と同じ「暗記／テスト／一覧を確認」の並び */}
      <div className="px-1 pb-2">
        <p className="text-[10px] font-extrabold text-brand-600">事前学習</p>
        <h2 className="font-display text-lg font-extrabold text-ink">
          必須語彙・熟語を先に暗記する
        </h2>
        <p className="mt-1 text-xs font-bold text-ink/45">
          暗記 → テスト → 一覧で確認、の順に進めます。
        </p>
      </div>

      <div className="space-y-3">
        <LearningEntryCard
          data-reading-prep-entry="words"
          icon={<Cards size={22} />}
          accentColor={level.color}
          title="テーマ必須語彙"
          countLabel={`全${words.length}語`}
          subtitle="本文に出る語を、読む前に暗記する"
          status={wordStatus}
          units={{ learning: '語', quiz: '問' }}
          studyDisabled={!words.length}
          studyAriaLabel={`${passage.titleJa}の必須語彙を暗記`}
          onStudy={() => studyWords(false)}
          quizDisabled={!words.length}
          quizAriaLabel={`${passage.titleJa}の必須語彙をテスト`}
          onQuiz={() => studyWords(true)}
          catalogLabel="一覧を確認"
          catalogAriaLabel={`${passage.titleJa}の必須語彙を一覧で確認する`}
          catalogDisabled={!words.length}
          onCatalog={() => openList('words')}
        />

        <LearningEntryCard
          data-reading-prep-entry="phrases"
          icon={<BookOpen size={22} />}
          accentColor="#0ea5e9"
          title="熟語・表現"
          countLabel={`全${phrases.length}項目`}
          subtitle="本文の言い回しを、まとまりのまま暗記する"
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
    <div className="space-y-3 pt-1" data-reading-prep-catalog={tab}>
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
          { id: 'words', label: `必須語彙 ${words.length}` },
          { id: 'phrases', label: `熟語・表現 ${phrases.length}` },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            data-reading-prep-list-tab={item.id}
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
            variant={allSaved ? 'soft' : 'hint'}
            disabled={allSaved}
            onClick={() => addManyToMyList(wordIds)}
          >
            {allSaved ? (
              <>
                <Check size={17} /> 全語をマイ単語に保存済み
              </>
            ) : (
              <>
                <Bookmark size={17} /> 全語をマイ単語に保存
              </>
            )}
          </Button>
          <NormalLearningRecordList
            entryId="reading-prep-words"
            contentId="vocab"
            items={words}
            unit="語"
            onOpen={(item) => navigate('wordDetail', { id: item.id })}
            openLabel="この単語の詳細を見る"
            openHint="詳細"
            emptyMessage="この長文の必須語彙はまだありません。"
          />
        </>
      ) : (
        <NormalLearningRecordList
          entryId="reading-prep-phrases"
          contentId="usage"
          items={phrases}
          unit="項目"
          titleLanguage="en"
          onOpen={(item) => setDetail(item)}
          openLabel="この熟語・表現の説明を見る"
          openHint="説明"
          emptyMessage="この長文の熟語・表現はまだありません。"
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
        right={<Chip color={level.color}>{passage.examTypes.join('・')}</Chip>}
      />

      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 pb-4">
        {view === 'list' ? listView : prepView}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" onClick={() => navigate('reader', { passageId, returnTo: params.returnTo })}>
          本文を読む <ArrowRight size={18} />
        </Button>
      </div>

      <Sheet open={!!detail} onClose={() => setDetail(null)} title="くわしく">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SpeakButton text={phraseSpeechText(detail)} size="md" />
              <div className="min-w-0">
                <div className="font-display text-2xl font-extrabold text-ink">{detail.phrase}</div>
                <Chip color={phraseLabel(detail) === '構文' ? '#8b5cf6' : '#0ea5e9'}>
                  {phraseLabel(detail)}
                </Chip>
              </div>
            </div>
            <div className="rounded-2xl bg-brand-50 p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">意味</div>
              <div className="font-display text-lg font-extrabold text-ink">
                {(detail.meanings ?? [detail.meaning]).join('・')}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
              <div className="flex items-start gap-2">
                <SpeakButton text={detail.example.en} size="sm" />
                <div className="min-w-0">
                  <p className="font-bold text-ink">{detail.example.en}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55">
                    {detailTranslation && <span className="mr-1 text-[11px] text-ink/35">自然な和訳</span>}
                    {detail.example.ja}
                  </p>
                </div>
              </div>
            </div>
            <LongSentenceTranslation guide={detailTranslation} />
            {detail.origin && (
              <div className="rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100">
                <div className="mb-1 flex items-center gap-1.5 text-violet-600">
                  <Link size={16} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">
                    {detail.kind === 'syntax' ? 'この文のポイント' : '成り立ち'}
                  </span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-violet-900/90">{detail.origin}</p>
              </div>
            )}
            <Button
              full
              onClick={() => {
                const item = detail
                setDetail(null)
                studyPhrases(false, [item])
              }}
            >
              <Cards size={17} /> この項目を暗記
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
