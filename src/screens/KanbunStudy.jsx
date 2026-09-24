import { useRef, useState } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { kanbunNotebookDomain } from '../lib/wordBookLaunch.js'
import {
  KANBUN_COLLECTIONS,
  kanbunDomainMeta,
  kanbunItems,
} from '../data/kanbun-content.js'
import { orderForStudy } from '../lib/studyOrder.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { Button, Chip } from '../components/ui.jsx'
import { KanbunText, KanbunHeadword } from '../components/KanbunFurigana.jsx'
import { KanbunMarkedText, KanbunPatternText } from '../components/KanbunMarkedText.js'
import { KanbunExtras } from '../components/KanbunExtras.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
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
  ArrowRight,
  Lightbulb,
} from '../components/Icons.jsx'

function AnswerDetails({ domain, item }) {
  return (
    <div className="mt-6 space-y-3 animate-slide-up">
      <div className="rounded-2xl bg-rose-50 p-4">
        <p className="text-[10px] font-extrabold tracking-wide text-rose-700">答え</p>
        <p className="mt-1 font-display text-lg font-extrabold leading-relaxed text-ink">{item.answer}</p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-[10px] font-extrabold tracking-wide text-slate-500">くわしい説明</p>
        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/70">{item.detail}</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-1.5 text-amber-700">
          <Lightbulb size={16} />
          <span className="text-[10px] font-extrabold tracking-wide">見分けるヒント</span>
        </div>
        <p className="mt-1.5 text-sm font-bold leading-relaxed text-amber-950/75">{item.clue}</p>
      </div>

      {(item.original || item.scene) && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-rose-950 p-4 text-white">
          <p className="text-[10px] font-extrabold text-rose-200">{domain === 'culture' ? '本文で使う場面' : '用例'}</p>
          {item.marked
            ? <KanbunMarkedText marked={item.marked} className="mt-2" inverse showLegend={false} size="sm" />
            : <p className="mt-2 font-serif text-lg font-bold leading-[1.8]">{item.original || item.scene}</p>}
          {item.kakikudashi && <p className="mt-2 text-sm font-bold leading-relaxed text-white/80"><KanbunText>{item.kakikudashi}</KanbunText></p>}
          {item.translation && <p className="mt-1 text-xs font-bold leading-relaxed text-white/60">{item.translation}</p>}
          {item.application && <p className="mt-2 text-xs font-bold leading-relaxed text-white/70">{item.application}</p>}
        </div>
      )}

      <div className="rounded-2xl border border-rose-200 bg-white p-4">
        <p className="text-[10px] font-extrabold tracking-wide text-rose-600">まちがえやすい点</p>
        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65">{item.pitfall}</p>
      </div>

      {/* 使い分け・時代背景と、漢語なら仲間、漢文法ならこの項目が入っている体系表。 */}
      <KanbunExtras domain={domain} item={item} compact />
    </div>
  )
}

export function KanbunStudyScreen() {
  const params = useStore((state) => state.params)
  const returnTo = useStore((state) => state.returnTo)
  const review = useStore((state) => state.reviewKanbun)
  const domain = KANBUN_COLLECTIONS[params.domain] ? params.domain : 'vocab'
  const meta = kanbunDomainMeta(domain)
  const settings = useContentSettings()
  const revealAll = settings.revealAnswers
  // size を指定しないときは設定した問題数まで絞る。一覧で選んだ順でなければ、いまの記録から全教材共通の出題順に並べる。
  const buildFor = (ids, size) => {
    const selected = kanbunItems(domain, ids)
    const items = params.preserveOrder && Array.isArray(ids)
      ? ids.map((id) => selected.find((item) => item.id === id)).filter(Boolean)
      : orderForStudy(selected, useStore.getState()[meta.srsField], { purpose: 'study' })
    return size > 0 ? items.slice(0, size) : items
  }
  const [poolSize] = useState(() => kanbunItems(domain, params.ids).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildFor(params.ids, params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(revealAll)
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
  // 終えたあと「一覧で確認」と結果に見せる、今回「覚えた」「まだ」と答えた項目。
  // 1回のカード数を減らして数え直す前に答えたカードも、この記録に残る。
  const answerLog = useStudyAnswerLog()
  const srs = useStore((state) => state[meta.srsField])
  const streak = useStore((state) => state.stats.streak)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const skillStats = useStore((state) => state.skillStats)
  // 答える前の記録。終わったときに「復習間隔が延びた項目」を数えるのに使う。
  const srsAtStart = useRef(useStore.getState()[meta.srsField])
  // ひと続きの学習で答えた項目。「続けて次の◯へ」で一巡するまで出さない。
  const cycleIds = useRef(new Set())
  const completedAt = useRef(null)
  const item = deck[index]
  // 今回答えた項目（前へ戻って選び直した分も、最後の答えで1件だけ数える）。
  const answeredIds = () => {
    const groups = answerLog.groups()
    return [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
  }

  // コンテンツ画面の「戻る」は履歴でなく、この分野の内容選択画面へ。
  const backToKanbunCatalog = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    returnTo('kanbunCatalog', { domain })
  }

  if (!deck.length || !item) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📕</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる項目がありません</p>
        <Button onClick={backToKanbunCatalog}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids, size = 0) => {
    // ひと続きの学習で答えた項目は、一巡するまで「続けて次の◯へ」で出さない。
    for (const id of answeredIds()) cycleIds.current.add(id)
    receipts.clear()
    answerLog.reset()
    completedAt.current = null
    setDeck(buildFor(ids, size))
    setIndex(0)
    setRevealed(revealAll)
    setLastAnswered(null)
    setDone(false)
    clearRecordedAnswers()
  }

  // 答えた項目と、その項目を答える前の段階。全教材共通の暗記完了レポートへ渡す。
  const completionReport = () => {
    const groups = answerLog.groups()
    const ids = [...groups.forgot, ...groups.remembered].map((entry) => entry.id)
    return buildStudyCompletionReport({
      contentId: meta.contentId,
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
    nextStudyItems(buildFor(params.ids, 0), [...cycleIds.current, ...answeredIds()], 0)
  )
  const continueNext = () => {
    const next = remainingForNext()
    if (!next.length) {
      backToKanbunCatalog()
      return
    }
    restart(next.slice(0, deck.length).map((entry) => entry.id), deck.length)
  }

  const answer = (rememberedNow) => {
    if (recordedAnswer === rememberedNow) return
    const result = rememberedNow ? 'remembered' : 'forgot'
    if (recordedAnswer !== null) {
      if (!reselectable) return
      // 前へ戻って選び直したときは、このカードの最初の答えを置き換える（記録も集計も二重に数えない）。
      receipts.set(index, reviseReview(receipts.get(index), result))
      setRecordedAnswer(rememberedNow)
      answerLog.record(item, rememberedNow)
      return
    }
    receipts.set(index, review(domain, item.id, result))
    answerLog.record(item, rememberedNow)
    const nextAnswers = { ...recordedAnswers, [index]: rememberedNow }
    setRecordedAnswer(rememberedNow)
    setLastAnswered(index)
    if (Object.keys(nextAnswers).length >= deck.length) {
      completedAt.current = Date.now()
      setDone(true)
    } else moveToCard(nextUnansweredSessionIndex(index, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setIndex(nextIndex)
    setRevealed(revealAll || Object.hasOwn(answers, nextIndex))
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
          contentId={meta.contentId}
          contentLabel={meta.label}
          unit={meta.itemLabel}
          title={params.title ?? meta.label}
          streak={streak}
          onReviewNow={() => restart(answerLog.groups().forgot.map((entry) => entry.id))}
          onContinue={continueNext}
          continueLabel={studyContinueLabel(
            Math.min(deck.length, remainingForNext().length),
            meta.itemLabel,
          )}
          onBack={backToKanbunCatalog}
          backLabel={`${meta.label}へ戻る`}
          onReviewSchedule={(scheduled) => restart(scheduled.ids)}
          answerGroups={answerLog.groups()}
          renderAnswerTitle={(entry) => entry.title}
          renderAnswerMeaning={(entry) => entry.answer}
        />
      </div>
    )
  }

  const level = KANBUN_LEVEL_BY_ID[item.level]

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
        progressColor="#be123c"
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
                const next = restartSessionCount(deck, answeredIndexes, index, buildFor(params.ids, 0), size)
                receipts.clear()
                setDeck(next.deck)
                clearRecordedAnswers()
                setLastAnswered(null)
                moveToCard(0, {})
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, buildFor(params.ids, size), size))
              }
            }}
          />
        )}
        trailingActions={(
          <>
            <RevealAnswersToggle
              label="答え"
              toolbar
              onChange={(on) => setRevealed(on)}
            />
            <WordBookToggle domain={kanbunNotebookDomain(domain)} itemId={item.id} itemLabel={item.title} />
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
        <article
          key={item.id}
          onClick={() => !revealed && setRevealed(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-card"
        >
          <div className="flex flex-wrap items-start gap-2">
            <Chip color={level?.color}>{level?.label}</Chip>
            <Chip color={meta.color}>{meta.label}</Chip>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[10px] font-extrabold text-rose-600">漢文を暗記</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-snug text-ink"><KanbunHeadword item={item} /></h1>
            {/* 見出しのルビと同じ読みしかないときは、下の読み行を重ねて出さない。 */}
            {item.reading && item.reading.includes('・') && (
              <p className="mt-1 text-sm font-extrabold text-rose-700">{item.reading}</p>
            )}
            {item.pattern && <p className="mt-2 rounded-xl bg-slate-100 px-3 py-2 font-mono text-sm font-extrabold text-slate-800"><KanbunPatternText pattern={item.pattern} /></p>}
            <p className="mt-3 text-sm font-bold leading-relaxed text-ink/45">{item.front}</p>
            {/* この項目をいつ答えたか・次にいつ復習するか。英単語のカードと同じ並べ方。 */}
            <StudyReviewHistory entry={srs?.[item.id]} className="mt-3" />
          </div>

          {!revealed ? (
            <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 py-9 text-rose-700">
              <span className="text-sm font-extrabold">タップして答えを見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : <AnswerDetails domain={domain} item={item} />}
        </article>
      </CardSwipeRegion>

      <CardStudyFooter className="border-rose-100">
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
        ) : !revealed ? (
          <Button full size="lg" onClick={() => setRevealed(true)}>答えを見る</Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>まだ 🤔</Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>覚えた 👍</Button>
          </div>
        )}
      </CardStudyFooter>
    </div>
  )
}
