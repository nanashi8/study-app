import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getKotenGrammar,
  KOTEN_GRAMMAR_CATEGORIES,
} from '../data/koten-grammar.js'
import { Button, Chip, IconButton } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { CardStudyFooter, CardSwipeRegion } from '../components/CardStudyControls.jsx'
import { growDeck } from '../lib/session.js'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useIndexedSessionState,
} from '../components/QuestionSessionControls.jsx'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  Close,
  Lightbulb,
} from '../components/Icons.jsx'

const SESSION_SIZE = 20

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const picked = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[picked]] = [result[picked], result[index]]
  }
  return result
}

// size=0 は「絞り込みなし」。
function buildDeck(ids, size = SESSION_SIZE, preserveOrder = false) {
  const unique = [...new Set(ids ?? [])]
  const selected = unique.map(getKotenGrammar).filter(Boolean)
  const items = preserveOrder ? selected : shuffle(selected)
  return size > 0 ? items.slice(0, size) : items
}

export function KotenGrammarStudyScreen() {
  const params = useStore((state) => state.params)
  const returnTo = useStore((state) => state.returnTo)
  const reviewGrammar = useStore((state) => state.reviewKotenGrammar)
  const savedIds = useStore((state) => state.kotenGrammarList)
  const toggleSaved = useStore((state) => state.toggleKotenGrammarList)
  const settings = useStore((state) => state.settings)
  const revealAll = settings.revealAnswers

  const [poolSize] = useState(() => buildDeck(params.ids, 0, params.preserveOrder).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildDeck(params.ids, params.size ?? sessionSize, params.preserveOrder))
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

  const item = deck[index]
  const category = item
    ? KOTEN_GRAMMAR_CATEGORIES.find((candidate) => candidate.id === item.category)
    : null
  const saved = item ? savedIds.includes(item.id) : false

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

  const restart = () => {
    setDeck(buildDeck(params.ids, deck.length, params.preserveOrder))
    setIndex(0)
    setFlipped(revealAll)
    setDone(false)
    setRemembered(0)
    clearRecordedAnswers()
  }

  const answer = (ok) => {
    if (recordedAnswer !== null) return
    reviewGrammar(item.id, ok ? 'remembered' : 'forgot')
    if (ok) setRemembered((count) => count + 1)
    const nextAnswers = { ...recordedAnswers, [index]: ok }
    setRecordedAnswer(ok)
    if (Object.keys(nextAnswers).length >= deck.length) setDone(true)
    else moveToCard(nextUnansweredSessionIndex(index, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setIndex(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">🪶</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">暗記カード完了</p>
          <p className="mt-1 text-sm font-bold text-ink/55">
            {deck.length}項目のうち {remembered}項目を「覚えた」
          </p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={backToKotenGrammar}>文法へ戻る</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-amber-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={backToKotenGrammar} aria-label="学習をやめる">
            <Close size={22} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-extrabold text-ink/40">
              {params.title ?? '古典文法を暗記'}
            </p>
          </div>
          <RevealAnswersToggle label="答え" onChange={(on) => setFlipped(on)} />
          <SpeechSettingsButton compact />
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            label="項目"
            onResize={(size, { discard }) => {
              if (discard) {
                setDeck(buildDeck(params.ids, size, params.preserveOrder))
                setIndex(0)
                setFlipped(revealAll)
                setDone(false)
                setRemembered(0)
                clearRecordedAnswers()
              } else {
                setDeck((current) => growDeck(current, index + 1, buildDeck(params.ids, size, params.preserveOrder), size))
              }
            }}
          />
        </div>
      </div>

      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => moveToCard(Math.max(0, index - 1))}
        onNext={() => moveToCard(Math.min(deck.length - 1, index + 1))}
        nextDisabled={index + 1 >= deck.length}
        itemLabel="カード"
        progressColor="#d97706"
      />

      <CardSwipeRegion
        index={index}
        total={deck.length}
        onIndexChange={moveToCard}
        className="flex-1 overflow-y-auto px-4 pb-4 pt-3"
      >
        <div
          key={item.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            {category && <Chip color={category.color}>{category.emoji} {category.label}</Chip>}
            <IconButton
              onClick={(event) => {
                event.stopPropagation()
                toggleSaved(item.id)
              }}
              className={saved ? '-mr-2 -mt-2 text-amber-600' : '-mr-2 -mt-2 text-ink/25'}
              aria-label={saved ? `${item.title}を登録文法から外す` : `${item.title}を登録文法へ追加`}
              aria-pressed={saved}
            >
              {saved ? <BookmarkFilled size={22} /> : <Bookmark size={22} />}
            </IconButton>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[11px] font-extrabold text-amber-600">古典文法</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-snug text-ink">
              {item.title}
            </h1>
            <p className="mt-3 text-sm font-bold leading-relaxed text-ink/45">
              意味・接続・活用を思い出そう
            </p>
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
                  {item.meaning}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-3.5">
                  <p className="text-[10px] font-extrabold tracking-wide text-sky-600">接続</p>
                  <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink/75">
                    {item.connection}
                  </p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-3.5">
                  <p className="text-[10px] font-extrabold tracking-wide text-violet-600">活用・形</p>
                  <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink/75">
                    {item.forms}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-amber-700">
                  <Lightbulb size={16} />
                  <span className="text-[10px] font-extrabold tracking-wide">入試での見分け方</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-ink/65">{item.summary}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-serif text-base font-bold leading-relaxed text-ink">{item.example.ja}</p>
                <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/50">
                  {item.example.gendai}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardSwipeRegion>

      <CardStudyFooter className="border-amber-100">
        {recordedAnswer !== null ? (
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
