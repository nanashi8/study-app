import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getEtymologyPack, getWord } from '../data/vocab.js'
import { Button, IconButton } from '../components/ui.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { CardStudyFooter, CardSwipeRegion } from '../components/CardStudyControls.jsx'
import { growDeck } from '../lib/session.js'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useIndexedSessionState,
} from '../components/QuestionSessionControls.jsx'
import { Close, ArrowRight, Book, Lightbulb } from '../components/Icons.jsx'

// 語源そのものを暗記するカード。表は語根の形、裏は意味・由来・確認済みの例語。
// 判定は語源専用の記録（etymologySrs）に入る。紐づく英単語の暗記は別画面。
function buildEtymologyCardDeck(ids, size = 0, preserveOrder = false) {
  const cards = (ids ?? []).map(getEtymologyPack).filter(Boolean)
  if (!preserveOrder) {
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1))
      ;[cards[index], cards[swap]] = [cards[swap], cards[index]]
    }
  }
  return size > 0 ? cards.slice(0, size) : cards
}

export function EtymologyStudyScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const reviewEtymology = useStore((state) => state.reviewEtymology)
  const settings = useStore((state) => state.settings)
  const revealAll = settings.revealAnswers

  const poolSize = (params.ids ?? []).length
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(
    () => buildEtymologyCardDeck(params.ids, params.size ?? sessionSize, params.preserveOrder),
  )
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  const [done, setDone] = useState(false)
  const [remembered, setRemembered] = useState(0)
  const {
    value: recordedAnswer,
    setValue: setRecordedAnswer,
    clear: clearRecordedAnswers,
    values: recordedAnswers,
  } = useIndexedSessionState(index)

  const card = deck[index]

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

  const restart = () => {
    setDeck(buildEtymologyCardDeck(params.ids, deck.length, params.preserveOrder))
    setIndex(0)
    setFlipped(revealAll)
    setDone(false)
    setRemembered(0)
    clearRecordedAnswers()
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setIndex(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  const answer = (ok) => {
    if (recordedAnswer !== null) return
    reviewEtymology(card.id, ok ? 'remembered' : 'forgot')
    if (ok) setRemembered((count) => count + 1)
    const nextAnswers = { ...recordedAnswers, [index]: ok }
    setRecordedAnswer(ok)
    if (Object.keys(nextAnswers).length >= deck.length) setDone(true)
    else moveToCard(nextUnansweredSessionIndex(index, deck.length, nextAnswers), nextAnswers)
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">🎉</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">おつかれさま！</p>
          <p className="mt-1 text-sm font-bold text-ink/55">
            {deck.length}枚のうち {remembered}枚を「覚えた」
          </p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={leave}>戻る</Button>
        </div>
      </div>
    )
  }

  const words = card.coverageIds.map(getWord).filter(Boolean)
  const examples = card.exampleIds.map(getWord).filter(Boolean)

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => moveToCard(Math.max(0, index - 1))}
        onNext={() => moveToCard(Math.min(deck.length - 1, index + 1))}
        nextDisabled={index + 1 >= deck.length}
        itemLabel="カード"
        progressColor="#7c3aed"
        leadingAction={(
          <IconButton onClick={leave} aria-label="やめる" className="shrink-0 rounded-xl text-ink/45">
            <Close size={19} />
          </IconButton>
        )}
        progressControl={(
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            label="枚"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            onResize={(size, { discard }) => {
              if (discard) {
                setDeck(buildEtymologyCardDeck(params.ids, size, params.preserveOrder))
                setIndex(0)
                setFlipped(revealAll)
                setDone(false)
                setRemembered(0)
                clearRecordedAnswers()
              } else {
                setDeck((current) => growDeck(
                  current,
                  index + 1,
                  buildEtymologyCardDeck(params.ids, size, params.preserveOrder),
                  size,
                ))
              }
            }}
          />
        )}
        trailingActions={(
          <RevealAnswersToggle label="意味" toolbar onChange={(on) => setFlipped(on)} />
        )}
      />

      <CardSwipeRegion
        index={index}
        total={deck.length}
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
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {examples.map((word) => (
                    <li key={word.id} className="flex min-w-0 items-baseline gap-2 rounded-xl bg-violet-50/70 px-3 py-1.5">
                      <span className="font-display text-sm font-extrabold text-ink">{word.word}</span>
                      <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink/55">
                        {word.meanings?.[0] ?? word.meaning}
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

              <button
                type="button"
                onClick={() => navigate('etymologyPack', { packId: card.id })}
                className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-3 text-xs font-extrabold text-violet-700 ring-1 ring-violet-100 active:bg-violet-100"
              >
                <Book size={15} /> このカードの単語と出典を見る
              </button>
            </div>
          )}
        </div>
      </CardSwipeRegion>

      <CardStudyFooter className="border-violet-100">
        {recordedAnswer !== null ? (
          <Button full size="lg" variant={recordedAnswer ? 'success' : 'danger'} disabled>
            {recordedAnswer ? '覚えた' : 'まだ'}（回答済み）
          </Button>
        ) : !flipped ? (
          <Button full size="lg" onClick={() => setFlipped(true)}>意味を見る</Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>まだ🤔</Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>覚えた👍</Button>
          </div>
        )}
      </CardStudyFooter>
    </div>
  )
}
