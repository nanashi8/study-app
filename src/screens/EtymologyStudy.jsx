import { useRef, useState } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { getEtymologyPack, getWord } from '../data/vocab.js'
import { Button } from '../components/ui.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
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
import { answeredSessionIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import { orderForStudy } from '../lib/studyOrder.js'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useAnswerReceipts,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'
import { ArrowRight, Book, Lightbulb } from '../components/Icons.jsx'
import { MeaningText } from '../components/MeaningText.jsx'
import { LookalikeCardSection } from '../components/LookalikeOrigins.jsx'

// 語源そのものを暗記するカード。表は語根の形、裏は意味・由来・確認済みの例語。
// 判定は語源専用の記録（etymologySrs）に入る。紐づく英単語の暗記は別画面。
// 一覧で選んだ順でなければ、その記録から全教材共通の出題順に並べる。
function buildEtymologyCardDeck(ids, size = 0, preserveOrder = false) {
  const cards = (ids ?? []).map(getEtymologyPack).filter(Boolean)
  const ordered = preserveOrder
    ? cards
    : orderForStudy(cards, useStore.getState().etymologySrs, { purpose: 'study' })
  return size > 0 ? ordered.slice(0, size) : ordered
}

export function EtymologyStudyScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const reviewEtymology = useStore((state) => state.reviewEtymology)
  const settings = useContentSettings()
  const revealAll = settings.revealAnswers

  const poolSize = (params.ids ?? []).length
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(
    () => buildEtymologyCardDeck(params.ids, params.size ?? sessionSize, params.preserveOrder),
  )
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  // 直前に「まだ」「覚えた」を押したカードの番号。押したカードは輪から抜けるので、
  // 押し間違えたときだけここへ戻って選び直す。
  const [lastAnswered, setLastAnswered] = useState(null)
  const [done, setDone] = useState(false)
  const {
    value: recordedAnswer,
    setValue: setRecordedAnswer,
    clear: clearRecordedAnswers,
    values: recordedAnswers,
  } = useIndexedSessionState(index)
  // 答えたカードごとの記録の控え。前へ戻って選び直したとき、最初の答えを置き換える。
  const receipts = useAnswerReceipts()
  // 答えたあと戻ってきたカードは、「覚えた／まだ」を選び直せる。
  const reselectable = useRevisitedAnswer(index, recordedAnswer !== null)
  const reviseReview = useStore((state) => state.reviseReview)
  // 終えたあと「一覧で確認」と結果に見せる、今回「覚えた」「まだ」と答えた語源カード。
  // 1回のカード数を減らして数え直す前に答えたカードも、この記録に残る。
  const answerLog = useStudyAnswerLog()
  const srs = useStore((state) => state.etymologySrs)
  const streak = useStore((state) => state.stats.streak)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const skillStats = useStore((state) => state.skillStats)
  // 答える前の記録。終わったときに「復習間隔が延びたカード」を数えるのに使う。
  const srsAtStart = useRef(useStore.getState().etymologySrs)
  // ひと続きの学習で答えたカード。「続けて次の◯へ」で一巡するまで出さない。
  const cycleIds = useRef(new Set())
  const completedAt = useRef(null)

  const card = deck[index]
  // 今回答えたカード（前へ戻って選び直した分も、最後の答えで1件だけ数える）。
  const answeredIds = () => {
    const groups = answerLog.groups()
    return [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
  }

  const leave = () => (params.returnTo
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : back())

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🌱</div>
        <p className="font-display text-lg font-extrabold text-ink">暗記できる語源カードがありません</p>
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids, size = 0) => {
    // ひと続きの学習で答えたカードは、一巡するまで「続けて次の◯へ」で出さない。
    for (const id of answeredIds()) cycleIds.current.add(id)
    receipts.clear()
    answerLog.reset()
    completedAt.current = null
    setDeck(buildEtymologyCardDeck(ids, size, params.preserveOrder))
    setIndex(0)
    setFlipped(revealAll)
    setLastAnswered(null)
    setDone(false)
    clearRecordedAnswers()
  }

  // 答えたカードと、そのカードを答える前の段階。全教材共通の暗記完了レポートへ渡す。
  const completionReport = () => {
    const groups = answerLog.groups()
    const ids = [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
    return buildStudyCompletionReport({
      contentId: 'etymology',
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

  // 続けて次の回へ。ひと続きで答えたカードを除いて、同じ範囲から次のぶんを出す。
  const remainingForNext = () => (
    nextStudyItems(
      buildEtymologyCardDeck(params.ids, 0, params.preserveOrder),
      [...cycleIds.current, ...answeredIds()],
      0,
    )
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

  // 「まだ」「覚えた」を押したカードは、その回の輪から抜ける。前へ・次へとスワイプは
  // 残っているカードだけを回り、末尾まで行ったら先頭へ戻る。
  const turnRing = (direction) => moveToCard(ringIndexAfter(index, deck.length, recordedAnswers, direction))

  const answer = (ok) => {
    if (recordedAnswer === ok) return
    const result = ok ? 'remembered' : 'forgot'
    if (recordedAnswer !== null) {
      if (!reselectable) return
      // 前へ戻って選び直したときは、このカードの最初の答えを置き換える（記録も集計も二重に数えない）。
      receipts.set(index, reviseReview(receipts.get(index), result))
      setRecordedAnswer(ok)
      answerLog.record(card, ok)
      return
    }
    receipts.set(index, reviewEtymology(card.id, result))
    answerLog.record(card, ok)
    const nextAnswers = { ...recordedAnswers, [index]: ok }
    setRecordedAnswer(ok)
    setLastAnswered(index)
    if (Object.keys(nextAnswers).length >= deck.length) {
      completedAt.current = Date.now()
      setDone(true)
    } else moveToCard(nextUnansweredSessionIndex(index, deck.length, nextAnswers), nextAnswers)
  }

  if (done) {
    // 終わったあとは英単語と同じ結果画面。今日の成果・次にすること・復習予定・今回のカードを同じ順で見せる。
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <StudyCompletionReport
          report={completionReport()}
          contentId="etymology"
          contentLabel="語源"
          unit="枚"
          titleLanguage="en"
          title={params.title ?? '語源カード'}
          streak={streak}
          onReviewNow={() => restart(answerLog.groups().forgot.map((entry) => entry.id))}
          onContinue={continueNext}
          continueLabel={studyContinueLabel(
            Math.min(deck.length, remainingForNext().length),
            '枚',
          )}
          onBack={leave}
          backLabel="語源へ戻る"
          onReviewSchedule={(scheduled) => restart(scheduled.ids)}
          answerGroups={answerLog.groups()}
          renderAnswerTitle={(entry) => entry.rootForm}
          renderAnswerMeaning={(entry) => entry.rootMeaning}
        />
      </div>
    )
  }

  const answeredIndexes = answeredSessionIndexes(recordedAnswers)
  const words = card.coverageIds.map(getWord).filter(Boolean)
  const examples = card.exampleIds.map(getWord).filter(Boolean)

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
        progressColor="#7c3aed"
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
                // 答えたカードの記録と結果は残したまま、まだ答えていないカードを1枚目として数え直す。
                const next = restartSessionCount(deck, answeredIndexes, index, buildEtymologyCardDeck(params.ids, 0, params.preserveOrder), size)
                receipts.clear()
                setDeck(next.deck)
                clearRecordedAnswers()
                setLastAnswered(null)
                moveToCard(0, {})
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, buildEtymologyCardDeck(params.ids, size, params.preserveOrder), size))
              }
            }}
          />
        )}
        trailingActions={(
          <>
            <RevealAnswersToggle label="意味" toolbar onChange={(on) => setFlipped(on)} />
            <WordBookToggle domain="etymology" itemId={card?.id} itemLabel={card?.title} />
          </>
        )}
      />

      <CardSwipeRegion
        index={index}
        total={deck.length}
        answered={recordedAnswers}
        onIndexChange={moveToCard}
        className="flex-1 overflow-y-auto px-4 pb-4"
      >
        <div
          key={card.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-6 shadow-card"
          data-etymology-card-study
        >
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-extrabold text-violet-700">
              語根
            </span>
            <span className="text-[11px] font-extrabold text-ink/40">関連する{words.length}語</span>
          </div>

          <div className="mt-2 flex flex-col items-center text-center">
            <span className="text-4xl" aria-hidden="true">{card.emoji}</span>
            <h2 className="font-display pt-2 text-4xl font-extrabold tracking-tight text-ink">
              {card.rootForm}
            </h2>
            {/* このカードをいつ答えたか・次にいつ復習するか。英単語のカードと同じ並べ方。 */}
            <StudyReviewHistory entry={srs?.[card.id]} className="mt-2" />
          </div>

          {!flipped ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 py-8 text-violet-500">
              <span className="text-sm font-extrabold">タップして意味を見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-5 animate-slide-up space-y-4">
              <div className="rounded-2xl bg-violet-50 p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-violet-500">意味</div>
                <div className="mt-0.5 font-display text-xl font-extrabold text-ink">{card.rootMeaning}</div>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-violet-100">
                <div className="mb-1.5 flex items-center gap-1.5 text-violet-600">
                  <Lightbulb size={16} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">意味の出発点</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-ink/70">{card.rootOrigin}</p>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-violet-100">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-violet-500">この形を使う語</div>
                <ul className="mt-2 grid gap-1.5">
                  {examples.map((word) => (
                    <li key={word.id} className="flex min-w-0 items-baseline gap-2 rounded-xl bg-violet-50/70 px-3 py-1.5">
                      <span className="font-display text-sm font-extrabold text-ink">{word.word}</span>
                      <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink/55">
                        <MeaningText>{word.meanings?.[0] ?? word.meaning}</MeaningText>
                      </span>
                    </li>
                  ))}
                </ul>
                {words.length > examples.length && (
                  <p className="mt-2 text-[11px] font-extrabold text-ink/40">
                    ほか{words.length - examples.length}語がこのカードに紐づいています
                  </p>
                )}
              </div>

              {/* つづりが似た語は同じ語源か。暗記の途中なので見出しだけにしておき、語は開かない。 */}
              <LookalikeCardSection rootId={card.rootId} collapsible />

              <button
                type="button"
                onClick={() => navigate('etymologyPack', { packId: card.id })}
                className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-3 text-xs font-extrabold text-violet-700 ring-1 ring-violet-100 active:bg-violet-100"
              >
                <Book size={15} /> このカードの単語を見る
              </button>
            </div>
          )}
        </div>
      </CardSwipeRegion>

      {/* フッター操作。意味を開いたかに関わらず「まだ／覚えた」だけを置く。
          意味の出し入れは、上の目のボタンとカードのタップが受け持つ。 */}
      <CardStudyFooter className="border-violet-100">
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
            <Button variant="danger" size="lg" onClick={() => answer(false)}>まだ🤔</Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>覚えた👍</Button>
          </div>
        )}
      </CardStudyFooter>
    </div>
  )
}
