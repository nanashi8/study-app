import { useRef, useState } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { Button } from '../components/ui.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { StudyMixEmptyNotice, currentStudyMixShare, useStudyMixRebuild } from '../components/StudyMix.jsx'
import { answeredSessionIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import {
  CardStudyFooter,
  CardSwipeRegion,
  LastAnsweredReturn,
  StudyAnswerReselect,
  useStudyAnswerLog,
} from '../components/CardStudyControls.jsx'
import { StudyCompletionReport } from '../components/StudyCompletionReport.jsx'
import { StudyReviewHistory } from '../components/StudyReviewHistory.jsx'
import { buildStudyCompletionReport } from '../lib/learningAnalyticsReport.js'
import { nextStudyItems, studyContinueLabel } from '../lib/studyContinuation.js'
import {
  canTurnRing,
  ringIndexAfter,
  ringPosition,
  ringProgress,
  ringRemaining,
} from '../lib/studyRing.js'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useAnswerReceipts,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'
import {
  CUSTOM_SUBJECT_IDS,
  categoryTitle,
  pickCustomCards,
  templateFor,
} from '../lib/customCards.js'

// 自作カード（英単語以外のテンプレート）の暗記カード。表は用語・問題・古語・漢語と読み・漢字・品詞、裏は意味・答えとほかの欄。
// 出題順は全教材共通の決まり（lib/studyOrder.js）で、出題バランス（画面下部の「出題」）を当てる。
const SESSION_SIZE = 20
const CARD_COLOR = '#0891b2'
// 表に出す欄（答えではない手がかり）と、裏に答えのあとで出す欄。
const FRONT_EXTRA_KEYS = ['reading', 'kanji', 'pos']
const BACK_EXTRA_KEYS = ['example', 'exampleTranslation', 'note']

function buildDeck(ids, size = SESSION_SIZE, preserveOrder = false) {
  const srs = useStore.getState().customCardSrs
  return pickCustomCards(ids, { srs, size, freshShare: currentStudyMixShare(), preserveOrder })
}

const fieldLabel = (card, key) => templateFor(card.template).fields.find((item) => item.key === key)?.label ?? ''

export function CustomCardStudyScreen() {
  const params = useStore((state) => state.params)
  const returnTo = useStore((state) => state.returnTo)
  const reviewCard = useStore((state) => state.reviewCustomCard)
  const categories = useStore((state) => state.customCategories)
  const settings = useContentSettings()
  const revealAll = settings.revealAnswers
  const subject = CUSTOM_SUBJECT_IDS.includes(params.subject) ? params.subject : null

  const [poolSize] = useState(() => buildDeck(params.ids, 0, params.preserveOrder).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildDeck(params.ids, params.size ?? sessionSize, params.preserveOrder))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  // 直前に「まだ」「覚えた」を押したカードの番号。押し間違えたときだけここへ戻って選び直す。
  const [lastAnswered, setLastAnswered] = useState(null)
  const [done, setDone] = useState(false)
  const {
    value: recordedAnswer,
    setValue: setRecordedAnswer,
    clear: clearRecordedAnswers,
    values: recordedAnswers,
  } = useIndexedSessionState(index)
  const receipts = useAnswerReceipts()
  const reselectable = useRevisitedAnswer(index, recordedAnswer !== null)
  const reviseReview = useStore((state) => state.reviseReview)
  const srs = useStore((state) => state.customCardSrs)
  const streak = useStore((state) => state.stats.streak)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const skillStats = useStore((state) => state.skillStats)
  const srsAtStart = useRef(useStore.getState().customCardSrs)
  const cycleIds = useRef(new Set())
  const completedAt = useRef(null)
  const answerLog = useStudyAnswerLog()

  const card = deck[index]
  const template = card ? templateFor(card.template) : null
  const answeredIds = () => {
    const groups = answerLog.groups()
    return [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
  }

  const leave = () => (params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo('customWords', subject ? { subject } : {}))

  useStudyMixRebuild({
    index,
    answeredIndexes: answeredSessionIndexes(recordedAnswers),
    fixedOrder: params.preserveOrder === true,
    rebuild: (keepCount) => {
      const size = params.size ?? sessionSize
      setDeck((current) => growDeck(current, current.length ? keepCount : 0, nextStudyItems(buildDeck(params.ids, 0, params.preserveOrder), cycleIds.current, 0), Math.max(size, keepCount)))
    },
  })

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">✍️</div>
        <p className="font-display text-lg font-extrabold text-ink">暗記できるカードがありません</p>
        <StudyMixEmptyNotice />
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids, size = 0) => {
    for (const id of answeredIds()) cycleIds.current.add(id)
    receipts.clear()
    answerLog.reset()
    completedAt.current = null
    setDeck(buildDeck(ids, size, params.preserveOrder))
    setIndex(0)
    setFlipped(revealAll)
    setLastAnswered(null)
    setDone(false)
    clearRecordedAnswers()
  }

  const completionReport = () => {
    const groups = answerLog.groups()
    const ids = [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
    return buildStudyCompletionReport({
      contentId: 'custom-cards',
      srs,
      learningAnalytics,
      skillStats,
      ids,
      reviewIds: groups.forgot.map((entry) => entry.id),
      beforeBoxes: Object.fromEntries(ids.map((id) => [
        id,
        Number.isFinite(srsAtStart.current?.[id]?.box) ? srsAtStart.current[id].box : null,
      ])),
      correct: groups.remembered.length,
      wrong: groups.forgot.length,
      dailyGoal: settings.dailyGoal,
      now: completedAt.current ?? Date.now(),
    })
  }

  const remainingForNext = () => (
    nextStudyItems(buildDeck(params.ids, 0, params.preserveOrder), [...cycleIds.current, ...answeredIds()], 0)
  )
  const continueNext = () => {
    const next = remainingForNext()
    if (!next.length) {
      leave()
      return
    }
    restart(next.slice(0, deck.length).map((entry) => entry.id), deck.length)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setIndex(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  const answer = (ok) => {
    if (recordedAnswer === ok) return
    const result = ok ? 'remembered' : 'forgot'
    if (recordedAnswer !== null) {
      if (!reselectable) return
      receipts.set(index, reviseReview(receipts.get(index), result))
      setRecordedAnswer(ok)
      answerLog.record(card, ok)
      return
    }
    receipts.set(index, reviewCard(card.id, result))
    answerLog.record(card, ok)
    const nextAnswers = { ...recordedAnswers, [index]: ok }
    setRecordedAnswer(ok)
    setLastAnswered(index)
    if (Object.keys(nextAnswers).length >= deck.length) {
      completedAt.current = Date.now()
      setDone(true)
    } else moveToCard(nextUnansweredSessionIndex(index, deck.length, nextAnswers), nextAnswers)
  }

  const turnRing = (direction) => moveToCard(ringIndexAfter(index, deck.length, recordedAnswers, direction))
  const answeredIndexes = answeredSessionIndexes(recordedAnswers)

  if (done) {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <StudyCompletionReport
          report={completionReport()}
          contentId="custom-cards"
          contentLabel="自作カード"
          unit="枚"
          title={params.title ?? '自作カード'}
          streak={streak}
          onReviewNow={() => restart(answerLog.groups().forgot.map((entry) => entry.id))}
          onContinue={continueNext}
          continueLabel={studyContinueLabel(Math.min(deck.length, remainingForNext().length), '枚')}
          onBack={leave}
          backLabel="自作カードへ戻る"
          onReviewSchedule={(scheduled) => restart(scheduled.ids)}
          answerGroups={answerLog.groups()}
          renderAnswerTitle={(entry) => entry.front}
          renderAnswerMeaning={(entry) => entry.back}
        />
      </div>
    )
  }

  const frontExtras = FRONT_EXTRA_KEYS.filter((key) => card[key])
  const backExtras = BACK_EXTRA_KEYS.filter((key) => card[key])

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => turnRing('previous')}
        onNext={() => turnRing('next')}
        previousDisabled={!canTurnRing(index, deck.length, recordedAnswers, 'previous')}
        nextDisabled={!canTurnRing(index, deck.length, recordedAnswers, 'next')}
        progress={ringProgress(deck.length, recordedAnswers)}
        statusLabel={`残り${ringRemaining(deck.length, recordedAnswers)}枚の${ringPosition(index, deck.length, recordedAnswers)}枚目`}
        itemLabel="カード"
        progressColor={CARD_COLOR}
        progressControl={(
          <SessionCounter
            index={index}
            total={deck.length}
            remaining={ringRemaining(deck.length, recordedAnswers)}
            position={ringPosition(index, deck.length, recordedAnswers)}
            max={poolSize}
            label="枚"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            reached={Math.max(index, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                const next = restartSessionCount(deck, answeredIndexes, index, buildDeck(params.ids, 0, params.preserveOrder), size)
                receipts.clear()
                setDeck(next.deck)
                clearRecordedAnswers()
                setLastAnswered(null)
                moveToCard(0, {})
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, buildDeck(params.ids, size, params.preserveOrder), size))
              }
            }}
          />
        )}
        trailingActions={(
          <>
            <RevealAnswersToggle label="答え" toolbar onChange={(on) => setFlipped(on)} />
            <WordBookToggle domain="customCards" itemId={card.id} itemLabel={card.front} />
          </>
        )}
      />

      <CardSwipeRegion
        index={index}
        total={deck.length}
        answered={recordedAnswers}
        onIndexChange={moveToCard}
        className="flex-1 overflow-y-auto px-4 pb-4 pt-3"
      >
        <div
          key={card.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-card"
          data-custom-card={card.id}
        >
          <div className="flex flex-wrap items-start gap-2">
            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-extrabold text-cyan-800">{template.label}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">{categoryTitle(categories, card.category)}</span>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] font-extrabold text-cyan-700">{fieldLabel(card, 'front')}</p>
            <h1 className="mt-2 whitespace-pre-line break-words font-display text-3xl font-extrabold leading-snug text-ink">{card.front}</h1>
            {frontExtras.length > 0 && (
              <p className="mt-2 text-xs font-bold text-ink/50" data-custom-card-front-extras>
                {frontExtras.map((key) => `${fieldLabel(card, key)}：${card[key]}`).join('　')}
              </p>
            )}
            <StudyReviewHistory entry={srs?.[card.id]} className="mt-3" />
          </div>

          {!flipped ? (
            <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-cyan-200 py-9 text-cyan-700">
              <span className="text-sm font-extrabold">{`${fieldLabel(card, 'back')}を思い出してからタップ`}</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-6 space-y-3 animate-slide-up" data-custom-card-answer>
              <div className="rounded-2xl bg-cyan-50 p-4">
                <p className="text-[10px] font-extrabold tracking-wide text-cyan-700">{fieldLabel(card, 'back')}</p>
                <p className="mt-1 whitespace-pre-line break-words text-base font-extrabold leading-relaxed text-ink">{card.back}</p>
              </div>
              {backExtras.map((key) => (
                <div key={key} className="rounded-2xl bg-slate-50 p-4" data-custom-card-field={key}>
                  <p className="text-[10px] font-extrabold tracking-wide text-slate-500">{fieldLabel(card, key)}</p>
                  <p className="mt-1 whitespace-pre-line break-words text-sm font-bold leading-relaxed text-ink/70">{card[key]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardSwipeRegion>

      <CardStudyFooter className="border-cyan-100">
        {recordedAnswer === null && lastAnswered !== null && (
          <LastAnsweredReturn onOpen={() => moveToCard(lastAnswered)} />
        )}
        {recordedAnswer !== null && reselectable ? (
          <StudyAnswerReselect remembered={recordedAnswer} onAnswer={answer} />
        ) : recordedAnswer !== null ? (
          <Button full size="lg" variant={recordedAnswer ? 'success' : 'danger'} disabled>
            {recordedAnswer ? '覚えた' : 'まだ'}（回答済み）
          </Button>
        ) : (
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
    </div>
  )
}
