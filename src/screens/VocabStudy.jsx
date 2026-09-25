import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, useContentSettings, currentContentSettings } from '../store/useStore.js'
import { etymologyCardsForWord, etymologyStoryForWord, homographsFor } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import {
  answeredSessionIndexes,
  buildDeck,
  growDeck,
  isAutomaticVocabularySource,
  recordStudyAnswer,
  restartSessionCount,
  reviseStudyAnswer,
  vocabularyStockCount,
} from '../lib/session.js'
import { vocabMixEmptyNotice, vocabMixFreshShare } from '../lib/vocabMix.js'
import { phraseGroupsForWord } from '../lib/wordPhrases.js'
import { wordRelationsFor } from '../lib/wordRelations.js'
import { cardSpeechItems } from '../lib/cardSpeech.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { useCardAutoSpeech } from '../components/useCardAutoSpeech.js'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { EtymologyBlock } from '../components/WordBits.jsx'
import { HomographWords, OtherSenses, PosBadge } from '../components/WordBits.jsx'
import { PronunciationNote } from '../components/PronunciationNote.jsx'
import { exampleSpeechAllowed } from '../lib/speechGuard.js'
import { MeaningText } from '../components/MeaningText.jsx'
import { UsageGuideCards } from '../components/UsageGuideCards.jsx'
import {
  AntonymSection,
  ConfusableSection,
  IdiomEquivalentSection,
  LoanwordHint,
  SynonymSection,
  UsagePartnerSection,
  WordFormSection,
  WordPhraseSection,
} from '../components/WordRelations.jsx'
import { Button, Chip } from '../components/ui.jsx'
import { ArrowRight, Lightbulb } from '../components/Icons.jsx'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import { StudyReviewHistory } from '../components/StudyReviewHistory.jsx'
import {
  CardSaveToggle,
  CardStudyFooter,
  CardSwipeRegion,
  LastAnsweredReturn,
  StudyAnswerReselect,
} from '../components/CardStudyControls.jsx'
import {
  canTurnRing,
  ringIndexAfter,
  ringPosition,
  ringProgress,
  ringRemaining,
} from '../lib/studyRing.js'
import { WordListSheet, useWordInAnyBook } from '../components/WordListSheet.jsx'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useAnswerReceipts,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'

const sessionKey = (params) => (
  `vocab-study|${JSON.stringify(params.source ?? { type: 'due' })}|${params.title ?? ''}|${params.size ?? ''}`
)

export function VocabStudyScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const returnTo = useStore((s) => s.returnTo)
  const review = useStore((s) => s.review)
  const reviseReview = useStore((s) => s.reviseReview)
  const settings = useContentSettings()
  const saveQuizSession = useStore((s) => s.saveQuizSession)
  const clearQuizSession = useStore((s) => s.clearQuizSession)

  // 暗記モード：ONなら毎カード、タップせず最初から意味・語源を開いて見せる。
  const revealAll = settings.revealAnswers
  // スペルを隠すモード：意味を先に見せ、スペルと発音はカードを開くまで出さない（上部の目のボタンで切り替え）。
  const hideSpelling = settings.hideSpelling === true

  const source = params.source ?? { type: 'due' }

  // コンテンツ画面の「戻る」は履歴でなく、単語の種類を選ぶ画面（元の階層）へ。
  const backToVocabParent = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    if (source?.type === 'field') {
      returnTo('vocabGroups')
      return
    }
    if (source?.type === 'levelField') {
      returnTo('vocabDecks', { levelId: source.levelId })
      return
    }
    returnTo('vocabLevels')
  }

  const [restore] = useState(() => {
    const saved = useStore.getState().quizSession
    return saved && saved.key === sessionKey(params) ? saved : null
  })
  useEffect(() => clearQuizSession(), [clearQuizSession])

  const srsAtStart = useRef(useStore.getState().srs)
  // size=0 は「絞り込みなし」。在庫数を数えて、問題数の選択肢を実態に合わせる。
  const buildFor = (size) =>
    buildDeck(source, {
      srs: srsAtStart.current,
      size,
      purpose: 'study',
      cycleIds: params.vocabCycleIds,
      freshShareOverride: vocabMixFreshShare(currentContentSettings().vocabMix),
    })
  // 「1回のカード数」で選べる上限は、今日の候補ではなく教材の在庫。
  // 今日ぶんを終えかけた級でも、5〜200枚とすべてを選べる状態を保つ。
  const [poolSize] = useState(() => vocabularyStockCount(source, {
    srs: srsAtStart.current,
    purpose: 'study',
    cycleIds: params.vocabCycleIds,
  }))
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => (
    restore?.deck ?? buildFor(params.size ?? sessionSize)
  ))
  const [i, setI] = useState(restore?.i ?? 0)
  const [flipped, setFlipped] = useState(restore?.flipped ?? revealAll)
  // 直前に「まだ」「覚えた」を押したカードの番号。押したカードは輪から抜けるので、
  // 押し間違えたときだけここへ戻って選び直す。
  const [lastAnswered, setLastAnswered] = useState(null)
  const [listSheetOpen, setListSheetOpen] = useState(false)
  const {
    value: recordedAnswer,
    setValue: setRecordedAnswer,
    clear: clearRecordedAnswers,
    values: recordedAnswers,
  } = useIndexedSessionState(i, null, restore?.ratings ?? {})
  const results = useRef(restore
    ? {
        ...restore.results,
        forgotIds: [...(restore.results?.forgotIds ?? [])],
      }
    : { remembered: 0, forgot: 0, forgotIds: [] })
  // 1回のカード数を減らして数え直す前に答えたカード。結果の「今回学んだ語」に含める。
  const carried = useCarriedAnswers(restore?.carried)
  // 答えたカードごとの記録の控え。前へ戻って選び直したとき、最初の答えを置き換える。
  const receipts = useAnswerReceipts(restore?.receipts)
  const beforeBoxesAtStart = useRef(
    restore?.beforeBoxes
    ?? Object.fromEntries(deck.map((item) => [
      item.id,
      Number.isFinite(srsAtStart.current[item.id]?.box)
        ? srsAtStart.current[item.id].box
        : null,
    ])),
  )
  const rememberBoxesAtStart = (items) => {
    for (const item of items) {
      if (!Object.hasOwn(beforeBoxesAtStart.current, item.id)) {
        beforeBoxesAtStart.current[item.id] = Number.isFinite(srsAtStart.current[item.id]?.box)
          ? srsAtStart.current[item.id].box
          : null
      }
    }
  }

  // 出題バランスのバーを動かしたら、まだ答えていない先のカードをその割合で組み直す。
  // いま見ているカードと答えたカードはそのまま残す（次の回まで待たせない）。
  const appliedVocabMix = useRef(settings.vocabMix)
  useEffect(() => {
    if (appliedVocabMix.current === settings.vocabMix) return
    appliedVocabMix.current = settings.vocabMix
    if (!isAutomaticVocabularySource(source)) return
    const size = params.size ?? sessionSize
    const answeredIndexes = answeredSessionIndexes(recordedAnswers)
    setDeck((current) => {
      const keepCount = current.length
        ? Math.max(i + 1, ...answeredIndexes.map((index) => index + 1))
        : 0
      const nextDeck = growDeck(current, keepCount, buildFor(size), Math.max(size, keepCount))
      rememberBoxesAtStart(nextDeck)
      return nextDeck
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.vocabMix])
  const word = deck[i]
  // 答えたあと戻ってきたカードは、「覚えた／まだ」を選び直せる。
  const reselectable = useRevisitedAnswer(i, recordedAnswer !== null)
  const entry = useStore((state) => (word ? state.srs[word.id] : null))
  const inWordBook = useWordInAnyBook(word?.id)
  // その語を含む熟語・構文は全部見せる（数を絞ると使い方が抜ける）。
  const relatedPhrases = useMemo(() => phraseGroupsForWord(word), [word?.id])
  // 意味が同じ・近い語、同じ意味の熟語、つづりが似た語、カタカナ語のヒント。
  const relations = useMemo(() => wordRelationsFor(word), [word?.id])

  // スペルを隠していて、まだカードを開いていない。
  const spellingHidden = Boolean(word) && hideSpelling && !flipped

  // 読み上げは設定の範囲で、単語→意味→例文→例文の意味。意味と例文の意味は、カードを開いてから読む。
  // 使い方で発音が変わる語は単語を読まず（再生パネル側で外れる）、文でも読み分けられない語は例文も読まない。
  // 読み上げ列の持ち主。自動の読み上げと見出し・例文のボタンで同じものを使い、再生パネルの「範囲」をこのカードへ効かせる。
  const speechKey = word ? `${i}:${word.id}` : null
  const wordSpeechItems = word
    ? cardSpeechItems({
        id: word.id,
        head: word.word,
        meanings: word.meanings,
        meaningReadings: true,
        example: word.example,
        exampleSpeech: exampleSpeechAllowed(word),
        range: settings.speechRange,
        answerOpen: flipped,
      })
    : []

  // カードが変わるたび自動で読み上げ、カードを開いたら意味から続きを読む。スペルを隠しているあいだは読まず、
  // 流れている音声と、つづりが出る下の再生パネルも閉じる。カードを開いてスペルが見えたら、そこで読み上げる。
  useCardAutoSpeech({
    speechKey,
    items: wordSpeechItems,
    spellingHidden,
    answerOpen: flipped,
    title: '単語カード',
  })

  if (!deck.length) {
    // 「未修だけ」「復習だけ」で出せる語がないときは、そう選んでいることと続け方を示す。
    const mixNotice = isAutomaticVocabularySource(source) ? vocabMixEmptyNotice(settings.vocabMix) : null
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center" data-vocab-empty-deck>
        <div className="text-5xl">🌳</div>
        <p className="font-display text-lg font-extrabold text-ink">
          {mixNotice?.title ?? '学習できる単語がありません'}
        </p>
        <p className="text-sm font-bold text-ink/50">
          {mixNotice?.detail ?? 'この条件では対象の単語が見つかりませんでした。'}
        </p>
        <Button onClick={backToVocabParent}>戻る</Button>
      </div>
    )
  }

  const answeredIndexes = answeredSessionIndexes(recordedAnswers)
  // 結果として送るのは、実際に答えたカードだけ。途中で枚数を変えてデッキが
  // 組み直されても、まだ見ていない語を「学んだ語」に混ぜない。
  const answeredWordIds = (answers) => (
    Object.keys(answers)
      .map(Number)
      .filter(Number.isInteger)
      .sort((a, b) => a - b)
      .map((index) => deck[index]?.id)
      .filter(Boolean)
  )

  const finish = (answers = recordedAnswers) => {
    const completedAt = Date.now()
    const wordIds = [...carried.ids, ...answeredWordIds(answers)]
    navigate('sessionResult', {
      title: params.title ?? '単語学習',
      mode: 'study',
      total: wordIds.length,
      correct: results.current.remembered,
      wrong: results.current.forgot,
      reviewIds: results.current.forgotIds,
      source,
      size: params.size,
      continueTo: params.continueTo,
      returnTo: params.returnTo,
      vocabSession: {
        cycleIds: params.vocabCycleIds,
        wordIds,
        beforeBoxes: Object.fromEntries(
          wordIds.map((id) => [
            id,
            Object.hasOwn(beforeBoxesAtStart.current, id)
              ? beforeBoxesAtStart.current[id]
              : Number.isFinite(srsAtStart.current[id]?.box)
                ? srsAtStart.current[id].box
                : null,
          ]),
        ),
        completedAt,
      },
    })
  }

  const answer = (remembered) => {
    if (recordedAnswer === remembered) return
    const result = remembered ? 'remembered' : 'forgot'
    if (recordedAnswer !== null) {
      if (!reselectable) return
      // 前へ戻って選び直したときは、このカードの最初の答えを置き換える（記録も集計も二重に数えない）。
      receipts.set(i, reviseReview(receipts.get(i), result))
      results.current = reviseStudyAnswer(results.current, word.id, recordedAnswer, remembered)
      setRecordedAnswer(remembered)
      return
    }
    receipts.set(i, review(word.id, result, 'vocab'))
    results.current = recordStudyAnswer(results.current, word.id, remembered)
    const nextAnswers = { ...recordedAnswers, [i]: remembered }
    setRecordedAnswer(remembered)
    setLastAnswered(i)
    if (Object.keys(nextAnswers).length >= deck.length) finish(nextAnswers)
    else moveToCard(nextUnansweredSessionIndex(i, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setI(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  // 「まだ」「覚えた」を押したカードは、その回の輪から抜ける。前へ・次へとスワイプは
  // 残っているカードだけを回り、末尾まで行ったら先頭へ戻る。
  const turnRing = (direction) => moveToCard(ringIndexAfter(i, deck.length, recordedAnswers, direction))

  const level = getLevel(word.level)
  // スペルを隠しているあいだは、単語帳の窓や読み上げ名にも語を出さない。
  const wordName = spellingHidden ? 'この単語' : word.word

  const saveBeforeReference = (screen, referenceParams) => {
    saveQuizSession({
      key: sessionKey(params),
      deck,
      i,
      flipped,
      ratings: { ...recordedAnswers },
      receipts: receipts.snapshot(),
      carried: carried.snapshot(),
      beforeBoxes: { ...beforeBoxesAtStart.current },
      results: {
        ...results.current,
        forgotIds: [...results.current.forgotIds],
      },
    })
    navigate(screen, referenceParams)
  }
  const openRelatedWord = (id) => saveBeforeReference('wordDetail', { id })

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={i}
        total={deck.length}
        onPrevious={() => turnRing('previous')}
        onNext={() => turnRing('next')}
        previousDisabled={!canTurnRing(i, deck.length, recordedAnswers, 'previous')}
        nextDisabled={!canTurnRing(i, deck.length, recordedAnswers, 'next')}
        progress={ringProgress(deck.length, recordedAnswers)}
        statusLabel={`残り${ringRemaining(deck.length, recordedAnswers)}枚の${ringPosition(i, deck.length, recordedAnswers)}枚目`}
        itemLabel="カード"
        progressColor="var(--color-brand-500)"
        progressControl={(
          <SessionCounter
            index={i}
            total={deck.length}
            remaining={ringRemaining(deck.length, recordedAnswers)}
            position={ringPosition(i, deck.length, recordedAnswers)}
            max={poolSize}
            label="カード"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            reached={Math.max(i, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                // 答えたカードの記録と結果は残したまま、まだ答えていないカードを1枚目として数え直す。
                const next = restartSessionCount(deck, answeredIndexes, i, buildFor(size + deck.length), size)
                carried.carry(next.answeredItems)
                receipts.clear()
                rememberBoxesAtStart(next.deck)
                setDeck(next.deck)
                clearRecordedAnswers()
                setLastAnswered(null)
                moveToCard(0, {})
              } else {
                setDeck((current) => {
                  const nextDeck = growDeck(current, Math.max(i, answeredIndexes.at(-1) ?? 0) + 1, buildFor(size), size)
                  rememberBoxesAtStart(nextDeck)
                  return nextDeck
                })
              }
            }}
          />
        )}
        trailingActions={(
          <>
            <RevealAnswersToggle
              label="意味"
              spellingLabel="スペル"
              toolbar
              onChange={(on) => setFlipped(on)}
            />
            {/* 保存先は「単語帳」1つ。押すと入れる冊を選ぶ。 */}
            <CardSaveToggle
              saved={inWordBook}
              onToggle={() => setListSheetOpen(true)}
              label="単語帳"
              savedLabel={`${wordName}の単語帳を選ぶ（単語帳に入っています）`}
              unsavedLabel={`${wordName}を入れる単語帳を選ぶ`}
              aria-pressed={undefined}
              aria-haspopup="dialog"
              data-vocab-word-book-toggle
            />
          </>
        )}
      />

      {/* カード */}
      <CardSwipeRegion
        index={i}
        total={deck.length}
        answered={recordedAnswers}
        onIndexChange={moveToCard}
        className="flex-1 overflow-y-auto px-4 pb-4"
      >
        <div
          key={word.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-6 shadow-card"
        >
          {/* 表：単語（左上に英検の級、右上に品詞） */}
          <div className="flex items-start justify-between gap-2" data-vocab-card-level>
            <Chip color={level.color}>英検{level.label}</Chip>
            <PosBadge pos={word.pos} />
          </div>

          <div className="mt-2 flex flex-col items-center text-center">
            {spellingHidden ? (
              // スペルを隠すモード：意味から英単語を思い出す。つづり・発音記号・読み上げはカードを開くまで出さない。
              <>
                <p className="text-xs font-extrabold text-brand-500">意味</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold leading-snug text-ink" data-vocab-spelling-hidden>
                  <MeaningText>{word.meanings.join('・')}</MeaningText>
                </h2>
              </>
            ) : (
              <>
                <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
                {settings.showPhonetic && word.phonetic && (
                  <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>
                )}
                {/* 同じつづりで由来のちがう語が、別のカードになっている。どちらの語かは品詞と裏の意味で確かめる。 */}
                {homographsFor(word).length > 0 && (
                  <p className="mt-1 text-[11px] font-extrabold text-rose-600/80" data-vocab-homograph-note>
                    同じつづりの別の語があります
                  </p>
                )}
                {/* 使い方で発音が変わる語は音声を出さない。裏を見る前は意味を書かない短い形で知らせる。 */}
                <PronunciationNote word={word} compact className="mt-1" />
                <div className="mt-3">
                  <SpeakButton
                    text={word.word}
                    phrases={wordSpeechItems}
                    phraseIndex={0}
                    speechKey={speechKey}
                    title="単語カード"
                    size="lg"
                  />
                </div>
              </>
            )}
            <StudyReviewHistory entry={entry} className="mt-2" />
          </div>

          {!flipped ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 py-8 text-brand-400">
              <span className="text-sm font-extrabold">
                {hideSpelling ? 'タップしてスペルと発音を確かめる' : 'タップして意味と語源を見る'}
              </span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-5 space-y-4 animate-slide-up">
              {/* 意味 */}
              <div className="rounded-2xl bg-brand-50 p-4">
                <div className="text-xs font-extrabold text-brand-500">意味</div>
                <div className="mt-0.5 font-display text-xl font-extrabold text-ink">
                  <MeaningText>{word.meanings.join('・')}</MeaningText>
                </div>
              </div>

              {/* 使い方で発音が変わる語の読み分け */}
              <PronunciationNote word={word} />

              {/* 日本語に定着したカタカナ語。意味がずれる語は注意書きを添える。 */}
              <LoanwordHint hint={relations.loanword} />

              {/* 代表義以外の意味。取り違えないよう品詞と習う級を添えて並べる。 */}
              <OtherSenses senses={word.otherSenses} level={word.level} />

              {/* 由来のちがう、同じつづりの別の語。それぞれ独立したカードとして暗記する。 */}
              <HomographWords word={word} onWord={openRelatedWord} />

              {/* 例文 */}
              {word.example && (
                <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
                  <div className="flex items-start gap-2">
                    {exampleSpeechAllowed(word) && (
                      <SpeakButton
                        text={word.example.en}
                        phrases={wordSpeechItems}
                        phraseIndex={1}
                        speechKey={speechKey}
                        title="単語カード"
                        size="sm"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-ink">{word.example.en}</p>
                      <p className="mt-0.5 text-sm font-bold text-ink/55"><MeaningText>{word.example.ja}</MeaningText></p>
                    </div>
                  </div>
                </div>
              )}

              {/* 手動監査を通った語源だけを表示する。語根カードが無い語も成り立ちは出す。 */}
              {(etymologyCardsForWord(word).length > 0 || etymologyStoryForWord(word)) && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
                  <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                    <Lightbulb size={16} />
                    <span className="text-xs font-extrabold">語源</span>
                  </div>
                  <EtymologyBlock
                    word={word}
                    onRoot={(rootId) => saveBeforeReference('rootDetail', { rootId })}
                  />
                </div>
              )}

              {/* 使い方・使い分け（辞書ページと同じ中身）。 */}
              {word.usage && (
                <div className="rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100" data-word-usage>
                  <div className="mb-1 flex items-center gap-1.5 text-amber-600">
                    <Lightbulb size={14} />
                    <span className="text-xs font-extrabold">使い方・使い分け</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-amber-900/90">{word.usage}</p>
                </div>
              )}
              <UsageGuideCards guides={word.usageGuides} />

              {/* 品詞がちがうだけで同じ語から来た形。発音を聞いて、その語の辞書ページへ移れる。 */}
              {(relations.forms.length > 0 || relations.sameForms.length > 0) && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
                  <WordFormSection items={relations.forms} sameItems={relations.sameForms} ownNote={relations.formOwnNote} onWord={openRelatedWord} showPhonetic={settings.showPhonetic} />
                </div>
              )}

              {/* 意味が同じ・近い語、同じ意味の熟語、反対・対照の語。辞書にある語はタップでその語の辞書ページへ。 */}
              {(relations.synonyms.length > 0 || relations.idioms.length > 0 || relations.antonyms.length > 0 || relations.usagePartners.length > 0) && (
                <div className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-brand-100">
                  <SynonymSection items={relations.synonyms} onWord={openRelatedWord} showPhonetic={settings.showPhonetic} />
                  <IdiomEquivalentSection phrases={relations.idioms} />
                  <AntonymSection items={relations.antonyms} onWord={openRelatedWord} showPhonetic={settings.showPhonetic} />
                  <UsagePartnerSection items={relations.usagePartners} onWord={openRelatedWord} showPhonetic={settings.showPhonetic} />
                </div>
              )}

              {/* つづりが似ていて間違えやすい語。ちがう文字に色をつける。 */}
              {relations.confusables.length > 0 && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-rose-100">
                  <ConfusableSection word={word} items={relations.confusables} onWord={openRelatedWord} showPhonetic={settings.showPhonetic} />
                </div>
              )}

              {/* その語を含む熟語・構文と、ほかの品詞の形を使う熟語・構文。辞書ページと同じ中身。 */}
              {(relatedPhrases.all.length > 0 || relatedPhrases.viaForms.length > 0) && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-sky-100">
                  <WordPhraseSection word={word} groups={relatedPhrases} />
                </div>
              )}

              <button
                onClick={() => saveBeforeReference('wordDetail', { id: word.id })}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-100 py-3 text-sm font-extrabold text-brand-700 active:bg-brand-200"
              >
                辞書ページで関連語も見る
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </CardSwipeRegion>

      {/* フッター操作。意味を開いたかに関わらず「まだ／覚えた」だけを置く。
          意味とスペルの出し入れは、上の目のボタンとカードのタップが受け持つ。 */}
      <CardStudyFooter className="vocab-study-actions border-brand-100" data-vocab-study-actions>
        {recordedAnswer === null && lastAnswered !== null && (
          <LastAnsweredReturn onOpen={() => moveToCard(lastAnswered)} />
        )}
        {recordedAnswer !== null && reselectable ? (
          // 答えたあと戻ってきたカード。いまの答えを示したまま、もう一方を押すと選び直せる。
          <StudyAnswerReselect remembered={recordedAnswer} onAnswer={answer} />
        ) : recordedAnswer !== null ? (
          <Button full size="lg" variant={recordedAnswer ? 'success' : 'danger'} disabled>
            {recordedAnswer ? '覚えた' : 'まだ'}（回答済み）
          </Button>
        ) : (
          // 意味を見ずに思い出せた日は、開かないまま答えて次のカードへ進める。
          <div className="grid grid-cols-2 gap-2">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>
              まだ🤔
            </Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>
              覚えた👍
            </Button>
          </div>
        )}
      </CardStudyFooter>

      <WordListSheet
        open={listSheetOpen}
        onClose={() => setListSheetOpen(false)}
        wordId={word.id}
        wordLabel={wordName}
      />
    </div>
  )
}
