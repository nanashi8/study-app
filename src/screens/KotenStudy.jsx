import { useRef, useState } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { getKoten } from '../data/koten.js'
import { Button } from '../components/ui.jsx'
import { KotenText, KotenWord } from '../components/KotenFurigana.jsx'
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
import {
  ArrowRight,
  Lightbulb,
} from '../components/Icons.jsx'

// 渡された id 配列から学習デッキを作る。一覧で選んだ順（preserveOrder）でなければ、
// いまの記録から全教材共通の出題順に並べる（「もう一度」のたびに並べ直す）。
function buildKotenDeck(ids, seed, size = 0, preserveOrder = false) {
  const words = (ids ?? []).map(getKoten).filter(Boolean)
  const ordered = preserveOrder
    ? words
    : orderForStudy(words, useStore.getState().kotenSrs, { purpose: 'study' })
  // size=0 は「絞り込みなし」。
  return size > 0 ? ordered.slice(0, size) : ordered
}

export function KotenStudyScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const reviewKoten = useStore((s) => s.reviewKoten)
  const settings = useContentSettings()
  const revealAll = settings.revealAnswers

  const [seed, setSeed] = useState(0)
  const poolSize = (params.ids ?? []).length
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildKotenDeck(params.ids, 0, params.size ?? sessionSize, params.preserveOrder))
  const [i, setI] = useState(0)
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
  } = useIndexedSessionState(i)
  // 答えたカードごとの記録の控え。前へ戻って選び直したとき、最初の答えを置き換える。
  const receipts = useAnswerReceipts()
  // 答えたあと戻ってきたカードは、「覚えた／まだ」を選び直せる。
  const reselectable = useRevisitedAnswer(i, recordedAnswer !== null)
  const reviseReview = useStore((state) => state.reviseReview)
  // 終えたあと「一覧で確認」と結果に見せる、今回「覚えた」「まだ」と答えた語。
  // 1回のカード数を減らして数え直す前に答えたカードも、この記録に残る。
  const answerLog = useStudyAnswerLog()
  const srs = useStore((state) => state.kotenSrs)
  const streak = useStore((state) => state.stats.streak)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const skillStats = useStore((state) => state.skillStats)
  // 答える前の記録。終わったときに「復習間隔が延びた語」を数えるのに使う。
  const srsAtStart = useRef(useStore.getState().kotenSrs)
  // ひと続きの学習で答えた語。「続けて次の◯へ」で一巡するまで出さない。
  const cycleIds = useRef(new Set())
  const completedAt = useRef(null)

  const word = deck[i]
  // 今回答えた語（前へ戻って選び直した分も、最後の答えで1件だけ数える）。
  const answeredIds = () => {
    const groups = answerLog.groups()
    return [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
  }

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📜</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる語がありません</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids, size = 0) => {
    // ひと続きの学習で答えた語は、一巡するまで「続けて次の◯へ」で出さない。
    for (const id of answeredIds()) cycleIds.current.add(id)
    receipts.clear()
    answerLog.reset()
    completedAt.current = null
    const next = seed + 1
    setSeed(next)
    setDeck(buildKotenDeck(ids, next, size, params.preserveOrder))
    setI(0)
    setFlipped(revealAll)
    setLastAnswered(null)
    setDone(false)
    clearRecordedAnswers()
  }

  // 答えた語と、その語を答える前の段階。全教材共通の暗記完了レポートへ渡す。
  const completionReport = () => {
    const groups = answerLog.groups()
    const ids = [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
    return buildStudyCompletionReport({
      contentId: 'koten-vocab',
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

  // 続けて次の回へ。ひと続きで答えた語を除いて、同じ範囲から次のぶんを出す。
  const remainingForNext = () => (
    nextStudyItems(
      buildKotenDeck(params.ids, seed, 0, params.preserveOrder),
      [...cycleIds.current, ...answeredIds()],
      0,
    )
  )
  const continueNext = () => {
    const next = remainingForNext()
    if (!next.length) {
      back()
      return
    }
    restart(next.slice(0, deck.length).map((entry) => entry.id), deck.length)
  }

  const answer = (ok) => {
    if (recordedAnswer === ok) return
    const result = ok ? 'remembered' : 'forgot'
    if (recordedAnswer !== null) {
      if (!reselectable) return
      // 前へ戻って選び直したときは、このカードの最初の答えを置き換える（記録も集計も二重に数えない）。
      receipts.set(i, reviseReview(receipts.get(i), result))
      setRecordedAnswer(ok)
      answerLog.record(word, ok)
      return
    }
    receipts.set(i, reviewKoten(word.id, result))
    answerLog.record(word, ok)
    const nextAnswers = { ...recordedAnswers, [i]: ok }
    setRecordedAnswer(ok)
    setLastAnswered(i)
    if (Object.keys(nextAnswers).length >= deck.length) {
      completedAt.current = Date.now()
      setDone(true)
    } else moveToCard(nextUnansweredSessionIndex(i, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setI(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  // 「まだ」「覚えた」を押したカードは、その回の輪から抜ける。前へ・次へとスワイプは
  // 残っているカードだけを回り、末尾まで行ったら先頭へ戻る。
  const turnRing = (direction) => moveToCard(ringIndexAfter(i, deck.length, recordedAnswers, direction))

  const answeredIndexes = answeredSessionIndexes(recordedAnswers)

  if (done) {
    // 終わったあとは英単語と同じ結果画面。今日の成果・次にすること・復習予定・今回の語を同じ順で見せる。
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <StudyCompletionReport
          report={completionReport()}
          contentId="koten-vocab"
          contentLabel="古典単語"
          unit="語"
          title={params.title ?? '古典単語'}
          streak={streak}
          onReviewNow={() => restart(answerLog.groups().forgot.map((entry) => entry.id))}
          onContinue={continueNext}
          continueLabel={studyContinueLabel(
            Math.min(deck.length, remainingForNext().length),
            '語',
          )}
          onBack={back}
          backLabel="古典単語へ戻る"
          onReviewSchedule={(scheduled) => restart(scheduled.ids)}
          answerGroups={answerLog.groups()}
          renderAnswerTitle={(entry) => <KotenWord word={entry} />}
          renderAnswerMeaning={(entry) => <KotenText>{entry.meanings.join('・')}</KotenText>}
        />
      </div>
    )
  }

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
        progressColor="#f59e0b"
        progressControl={(
          <SessionCounter
            index={i}
            total={deck.length}
            remaining={ringRemaining(deck.length, recordedAnswers)}
            position={ringPosition(i, deck.length, recordedAnswers)}
            max={poolSize}
            label="語"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            reached={Math.max(i, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                // 答えたカードの記録と結果は残したまま、まだ答えていないカードを1枚目として数え直す。
                const next = restartSessionCount(deck, answeredIndexes, i, buildKotenDeck(params.ids, seed + 1, 0, params.preserveOrder), size)
                receipts.clear()
                setDeck(next.deck)
                clearRecordedAnswers()
                setLastAnswered(null)
                moveToCard(0, {})
              } else {
                setDeck((current) => growDeck(current, Math.max(i, answeredIndexes.at(-1) ?? 0) + 1, buildKotenDeck(params.ids, seed + 1, size, params.preserveOrder), size))
              }
            }}
          />
        )}
        trailingActions={(
          <>
            <RevealAnswersToggle
              label="意味"
              toolbar
              onChange={(on) => setFlipped(on)}
            />
            <WordBookToggle domain="kotenVocab" itemId={word.id} itemLabel={word.word} />
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
          <div className="flex items-start">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
              {word.pos}
            </span>
          </div>

          <div className="mt-2 flex flex-col items-center text-center">
            <h2 className="font-display pt-2 text-4xl font-extrabold tracking-tight text-ink">
              <KotenWord word={word} />
            </h2>
            {/* この語をいつ答えたか・次にいつ復習するか。英単語のカードと同じ並べ方。 */}
            <StudyReviewHistory entry={srs?.[word.id]} className="mt-2" />
          </div>

          {!flipped ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 py-8 text-amber-500">
              <span className="text-sm font-extrabold">タップして意味を見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-5 space-y-4 animate-slide-up">
              {/* 意味 */}
              <div className="rounded-2xl bg-amber-50 p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-amber-500">意味</div>
                <div className="mt-0.5 font-display text-xl font-extrabold text-ink">
                  <KotenText>{word.meanings.join('・')}</KotenText>
                </div>
              </div>

              {/* ポイント */}
              {word.note && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-amber-100">
                  <div className="mb-1.5 flex items-center gap-1.5 text-amber-600">
                    <Lightbulb size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wide">覚え方・ポイント</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-ink/70">
                    <KotenText>{word.note}</KotenText>
                  </p>
                </div>
              )}

              {/* 用例 */}
              {word.example && (
                <div className="rounded-2xl bg-white p-3 ring-1 ring-amber-100">
                  <p className="font-bold text-ink">
                    <KotenText>{word.example.ja}</KotenText>
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55">
                    <KotenText>{word.example.gendai}</KotenText>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardSwipeRegion>

      {/* フッター操作 */}
      <CardStudyFooter className="border-amber-100">
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
        ) : !flipped ? (
          <Button full size="lg" onClick={() => setFlipped(true)}>
            意味を見る
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
