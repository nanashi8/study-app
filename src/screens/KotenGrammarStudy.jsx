import { useRef, useState } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import {
  getKotenGrammar,
  KOTEN_GRAMMAR_CATEGORIES,
} from '../data/koten-grammar.js'
import { Button, Chip } from '../components/ui.jsx'
import { KotenText } from '../components/KotenFurigana.jsx'
import {
  KotenGrammarLevelChip,
  KotenGrammarNotes,
  KotenGrammarSystemLinks,
  KotenGrammarTables,
} from '../components/KotenGrammarExtras.jsx'
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

const SESSION_SIZE = 20

// size=0 は「絞り込みなし」。一覧で選んだ順でなければ、いまの記録から全教材共通の出題順に並べる。
function buildDeck(ids, size = SESSION_SIZE, preserveOrder = false) {
  const unique = [...new Set(ids ?? [])]
  const selected = unique.map(getKotenGrammar).filter(Boolean)
  const items = preserveOrder
    ? selected
    : orderForStudy(selected, useStore.getState().kotenGrammarSrs, { purpose: 'study' })
  return size > 0 ? items.slice(0, size) : items
}

export function KotenGrammarStudyScreen() {
  const params = useStore((state) => state.params)
  const returnTo = useStore((state) => state.returnTo)
  const reviewGrammar = useStore((state) => state.reviewKotenGrammar)
  const settings = useContentSettings()
  const revealAll = settings.revealAnswers

  const [poolSize] = useState(() => buildDeck(params.ids, 0, params.preserveOrder).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildDeck(params.ids, params.size ?? sessionSize, params.preserveOrder))
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
  const srs = useStore((state) => state.kotenGrammarSrs)
  const streak = useStore((state) => state.stats.streak)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const skillStats = useStore((state) => state.skillStats)
  // 答える前の記録。終わったときに「復習間隔が延びた項目」を数えるのに使う。
  const srsAtStart = useRef(useStore.getState().kotenGrammarSrs)
  // ひと続きの学習で答えた項目。「続けて次の◯へ」で一巡するまで出さない。
  const cycleIds = useRef(new Set())
  const completedAt = useRef(null)
  // 終えたあと「一覧で確認」で見せる、今回「覚えた」「まだ」と答えた文法。
  const answerLog = useStudyAnswerLog()

  const item = deck[index]
  // 今回答えた項目（前へ戻って選び直した分も、最後の答えで1件だけ数える）。
  const answeredIds = () => {
    const groups = answerLog.groups()
    return [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
  }
  const category = item
    ? KOTEN_GRAMMAR_CATEGORIES.find((candidate) => candidate.id === item.category)
    : null

  // コンテンツ画面の「戻る」は履歴でなく、古典文法の内容選択画面へ。
  const backToKotenGrammar = () => params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo('kotenGrammar')

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる文法がありません</p>
        <Button onClick={backToKotenGrammar}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids, size = 0) => {
    // ひと続きの学習で答えた項目は、一巡するまで「続けて次の◯へ」で出さない。
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

  // 答えた項目と、その項目を答える前の段階。全教材共通の暗記完了レポートへ渡す。
  const completionReport = () => {
    const groups = answerLog.groups()
    const ids = [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
    return buildStudyCompletionReport({
      contentId: 'koten-grammar',
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

  // 続けて次の回へ。ひと続きで答えた項目を除いて、同じ範囲から次のぶんを出す。
  const remainingForNext = () => (
    nextStudyItems(buildDeck(params.ids, 0, params.preserveOrder), [...cycleIds.current, ...answeredIds()], 0)
  )
  const continueNext = () => {
    const next = remainingForNext()
    if (!next.length) {
      backToKotenGrammar()
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
      receipts.set(index, reviseReview(receipts.get(index), result))
      setRecordedAnswer(ok)
      answerLog.record(item, ok)
      return
    }
    receipts.set(index, reviewGrammar(item.id, result))
    answerLog.record(item, ok)
    const nextAnswers = { ...recordedAnswers, [index]: ok }
    setRecordedAnswer(ok)
    setLastAnswered(index)
    if (Object.keys(nextAnswers).length >= deck.length) {
      completedAt.current = Date.now()
      setDone(true)
    } else moveToCard(nextUnansweredSessionIndex(index, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setIndex(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  // 「まだ」「覚えた」を押したカードは、その回の輪から抜ける。前へ・次へとスワイプは
  // 残っているカードだけを回り、末尾まで行ったら先頭へ戻る。
  const turnRing = (direction) => moveToCard(ringIndexAfter(index, deck.length, recordedAnswers, direction))

  const answeredIndexes = answeredSessionIndexes(recordedAnswers)

  if (done) {
    // 終わったあとは英単語と同じ結果画面。今日の成果・次にすること・復習予定・今回の項目を同じ順で見せる。
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <StudyCompletionReport
          report={completionReport()}
          contentId="koten-grammar"
          contentLabel="古典文法"
          unit="項目"
          title={params.title ?? '古典文法'}
          streak={streak}
          onReviewNow={() => restart(answerLog.groups().forgot.map((entry) => entry.id))}
          onContinue={continueNext}
          continueLabel={studyContinueLabel(
            Math.min(deck.length, remainingForNext().length),
            '項目',
          )}
          onBack={backToKotenGrammar}
          backLabel="文法へ戻る"
          onReviewSchedule={(scheduled) => restart(scheduled.ids)}
          answerGroups={answerLog.groups()}
          renderAnswerTitle={(entry) => entry.title}
          renderAnswerMeaning={(entry) => entry.meaning}
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
        progressColor="#d97706"
        progressControl={(
          <SessionCounter
            index={index}
            total={deck.length}
            remaining={ringRemaining(deck.length, recordedAnswers)}
            position={ringPosition(index, deck.length, recordedAnswers)}
            max={poolSize}
            label="項目"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            reached={Math.max(index, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                // 答えたカードの記録と結果は残したまま、まだ答えていないカードを1枚目として数え直す。
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
            <RevealAnswersToggle
              label="答え"
              toolbar
              onChange={(on) => setFlipped(on)}
            />
            <WordBookToggle domain="kotenGrammar" itemId={item.id} itemLabel={item.title} />
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
          key={item.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-card"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {category && <Chip color={category.color}>{category.emoji} {category.label}</Chip>}
            <KotenGrammarLevelChip item={item} />
          </div>

          <div className="mt-5 text-center">
            <p className="text-[11px] font-extrabold text-amber-600">古典文法</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-snug text-ink">
              <KotenText>{item.title}</KotenText>
            </h1>
            <p className="mt-3 text-sm font-bold leading-relaxed text-ink/45">
              意味・接続・活用を思い出そう
            </p>
            {/* この項目をいつ答えたか・次にいつ復習するか。英単語のカードと同じ並べ方。 */}
            <StudyReviewHistory entry={srs?.[item.id]} className="mt-3" />
          </div>

          {!flipped ? (
            <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 py-9 text-amber-600">
              <span className="text-sm font-extrabold">タップして答えを見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-6 space-y-3 animate-slide-up">
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-[10px] font-extrabold tracking-wide text-amber-600">意味・働き</p>
                <p className="mt-1 font-display text-lg font-extrabold leading-relaxed text-ink">
                  <KotenText>{item.meaning}</KotenText>
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl bg-sky-50 p-3.5">
                  <p className="text-[10px] font-extrabold tracking-wide text-sky-600">接続</p>
                  <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink/75">
                    <KotenText>{item.connection}</KotenText>
                  </p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-3.5">
                  <p className="text-[10px] font-extrabold tracking-wide text-violet-600">活用・形</p>
                  <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink/75">
                    <KotenText>{item.forms}</KotenText>
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-amber-700">
                  <Lightbulb size={16} />
                  <span className="text-[10px] font-extrabold tracking-wide">入試での見分け方</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-ink/65"><KotenText>{item.summary}</KotenText></p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-serif text-base font-bold leading-relaxed text-ink"><KotenText>{item.example.ja}</KotenText></p>
                <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/50">
                  <KotenText>{item.example.gendai}</KotenText>
                </p>
              </div>
              {/* 活用表・見分け方の表、使い分け、時代背景、この項目が入っている体系表。 */}
              <KotenGrammarTables item={item} />
              <KotenGrammarNotes item={item} />
              <KotenGrammarSystemLinks item={item} />
            </div>
          )}
        </div>
      </CardSwipeRegion>

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
            答えを見る
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
