import { useRef, useState } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { SUBJECTS, bookMeta, getSubjectUnit, pickSubjectTerms } from '../data/subjects/index.js'
import { Button, Chip } from '../components/ui.jsx'
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
import { SubjectText } from '../components/SubjectText.jsx'
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

// 社会・理科の重要語句の暗記カード。表は語句、裏は意味と解説（用語集の程度の説明）。
// 出題順は全教材共通の決まり（lib/studyOrder.js）で、出題バランス（画面下部の「出題」）を当てる。
const SESSION_SIZE = 20

function buildDeck(subject, ids, size = SESSION_SIZE, preserveOrder = false) {
  const srs = useStore.getState()[SUBJECTS[subject].termSrsField]
  return pickSubjectTerms(ids, { srs, size, freshShare: currentStudyMixShare(), preserveOrder })
}

function SubjectStudyScreen({ subject }) {
  const meta = SUBJECTS[subject]
  const params = useStore((state) => state.params)
  const returnTo = useStore((state) => state.returnTo)
  const reviewTerm = useStore((state) => state.reviewSubjectTerm)
  const settings = useContentSettings()
  const revealAll = settings.revealAnswers

  const [poolSize] = useState(() => buildDeck(subject, params.ids, 0, params.preserveOrder).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildDeck(subject, params.ids, params.size ?? sessionSize, params.preserveOrder))
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
  const srs = useStore((state) => state[meta.termSrsField])
  const streak = useStore((state) => state.stats.streak)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const skillStats = useStore((state) => state.skillStats)
  const srsAtStart = useRef(useStore.getState()[meta.termSrsField])
  const cycleIds = useRef(new Set())
  const completedAt = useRef(null)
  const answerLog = useStudyAnswerLog()

  const term = deck[index]
  const unit = term ? getSubjectUnit(term.unitId) : null
  const book = unit ? bookMeta(subject, unit.book) : null
  const answeredIds = () => {
    const groups = answerLog.groups()
    return [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
  }

  const leave = () => (params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo(meta.screens.home))

  useStudyMixRebuild({
    index,
    answeredIndexes: answeredSessionIndexes(recordedAnswers),
    fixedOrder: params.preserveOrder === true,
    rebuild: (keepCount) => {
      const size = params.size ?? sessionSize
      setDeck((current) => growDeck(current, current.length ? keepCount : 0, nextStudyItems(buildDeck(subject, params.ids, 0, params.preserveOrder), cycleIds.current, 0), Math.max(size, keepCount)))
    },
  })

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">{meta.emoji}</div>
        <p className="font-display text-lg font-extrabold text-ink">暗記できる語句がありません</p>
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
    setDeck(buildDeck(subject, ids, size, params.preserveOrder))
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
      contentId: meta.termDomain,
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
    nextStudyItems(buildDeck(subject, params.ids, 0, params.preserveOrder), [...cycleIds.current, ...answeredIds()], 0)
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
      answerLog.record(term, ok)
      return
    }
    receipts.set(index, reviewTerm(subject, term.id, result))
    answerLog.record(term, ok)
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
          contentId={meta.termDomain}
          contentLabel={`${meta.label}の重要語句`}
          unit="語句"
          title={<SubjectText>{params.title ?? `${meta.label}の重要語句`}</SubjectText>}
          streak={streak}
          onReviewNow={() => restart(answerLog.groups().forgot.map((entry) => entry.id))}
          onContinue={continueNext}
          continueLabel={studyContinueLabel(Math.min(deck.length, remainingForNext().length), '語句')}
          onBack={leave}
          backLabel={`${meta.label}へ戻る`}
          onReviewSchedule={(scheduled) => restart(scheduled.ids)}
          answerGroups={answerLog.groups()}
          renderAnswerTitle={(entry) => <SubjectText>{entry.term}</SubjectText>}
          renderAnswerMeaning={(entry) => <SubjectText>{entry.meaning}</SubjectText>}
        />
      </div>
    )
  }

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
        progressColor={meta.color}
        progressControl={(
          <SessionCounter
            index={index}
            total={deck.length}
            remaining={ringRemaining(deck.length, recordedAnswers)}
            position={ringPosition(index, deck.length, recordedAnswers)}
            max={poolSize}
            label="語句"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            reached={Math.max(index, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                const next = restartSessionCount(deck, answeredIndexes, index, buildDeck(subject, params.ids, 0, params.preserveOrder), size)
                receipts.clear()
                setDeck(next.deck)
                clearRecordedAnswers()
                setLastAnswered(null)
                moveToCard(0, {})
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, buildDeck(subject, params.ids, size, params.preserveOrder), size))
              }
            }}
          />
        )}
        trailingActions={(
          <>
            <RevealAnswersToggle label="答え" toolbar onChange={(on) => setFlipped(on)} />
            <WordBookToggle domain={meta.notebookTerms} itemId={term.id} itemLabel={term.term} />
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
          key={term.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-card"
          data-subject-card={term.id}
        >
          <div className="flex flex-wrap items-start gap-2">
            {book && <Chip color={book.color}>{`${book.emoji} ${book.label}`}</Chip>}
            {unit && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500"><SubjectText>{unit.title}</SubjectText></span>}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] font-extrabold" style={{ color: meta.color }}>{`${meta.label}の重要語句`}</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-snug text-ink"><SubjectText>{term.term}</SubjectText></h1>
            <StudyReviewHistory entry={srs?.[term.id]} className="mt-3" />
          </div>

          {!flipped ? (
            <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-emerald-200 py-9 text-emerald-700">
              <span className="text-sm font-extrabold">意味を思い出してからタップ</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-6 space-y-3 animate-slide-up" data-subject-card-answer>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-[10px] font-extrabold tracking-wide text-emerald-700">意味</p>
                <p className="mt-1 text-base font-extrabold leading-relaxed text-ink"><SubjectText>{term.meaning}</SubjectText></p>
              </div>
              {term.note && (
                <div className="rounded-2xl bg-slate-50 p-4" data-subject-card-note>
                  <p className="text-[10px] font-extrabold tracking-wide text-slate-500">解説</p>
                  <p className="mt-1 text-sm font-bold leading-relaxed text-ink/70"><SubjectText>{term.note}</SubjectText></p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardSwipeRegion>

      <CardStudyFooter className="border-emerald-100">
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

export function SocialStudyScreen() {
  return <SubjectStudyScreen subject="social" />
}

export function ScienceStudyScreen() {
  return <SubjectStudyScreen subject="science" />
}
