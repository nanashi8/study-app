import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getKoten } from '../data/koten.js'
import { Button, IconButton } from '../components/ui.jsx'
import { KotenText, KotenWord } from '../components/KotenFurigana.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { CardSaveToggle, CardStudyFooter, CardSwipeRegion } from '../components/CardStudyControls.jsx'
import { growDeck } from '../lib/session.js'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useIndexedSessionState,
} from '../components/QuestionSessionControls.jsx'
import {
  Close,
  ArrowRight,
  Lightbulb,
} from '../components/Icons.jsx'

// 渡された id 配列から学習デッキを作る（1回だけシャッフル）。
function buildKotenDeck(ids, seed, size = 0, preserveOrder = false) {
  const words = (ids ?? []).map(getKoten).filter(Boolean)
  if (!preserveOrder) {
    // seed を変えるたびに並べ替え（「もう一度」用）。Math.random でよい。
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[words[i], words[j]] = [words[j], words[i]]
    }
  }
  // size=0 は「絞り込みなし」。
  return size > 0 ? words.slice(0, size) : words
}

export function KotenStudyScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const reviewKoten = useStore((s) => s.reviewKoten)
  const kotenWordList = useStore((s) => s.kotenWordList)
  const toggleKotenWordList = useStore((s) => s.toggleKotenWordList)
  const settings = useStore((s) => s.settings)
  const revealAll = settings.revealAnswers

  const [seed, setSeed] = useState(0)
  const poolSize = (params.ids ?? []).length
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildKotenDeck(params.ids, 0, params.size ?? sessionSize, params.preserveOrder))
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  const [done, setDone] = useState(false)
  const [remembered, setRemembered] = useState(0)
  const {
    value: recordedAnswer,
    setValue: setRecordedAnswer,
    clear: clearRecordedAnswers,
    values: recordedAnswers,
  } = useIndexedSessionState(i)

  const word = deck[i]
  const saved = word ? kotenWordList.includes(word.id) : false

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📜</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる語がありません</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const restart = () => {
    const next = seed + 1
    setSeed(next)
    setDeck(buildKotenDeck(params.ids, next, deck.length, params.preserveOrder))
    setI(0)
    setFlipped(revealAll)
    setDone(false)
    setRemembered(0)
    clearRecordedAnswers()
  }

  const answer = (ok) => {
    if (recordedAnswer !== null) return
    reviewKoten(word.id, ok ? 'remembered' : 'forgot')
    if (ok) setRemembered((n) => n + 1)
    const nextAnswers = { ...recordedAnswers, [i]: ok }
    setRecordedAnswer(ok)
    if (Object.keys(nextAnswers).length >= deck.length) setDone(true)
    else moveToCard(nextUnansweredSessionIndex(i, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setI(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">🎉</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">おつかれさま！</p>
          <p className="mt-1 text-sm font-bold text-ink/55">
            {deck.length}語のうち {remembered}語を「覚えた」
          </p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={back}>戻る</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={i}
        total={deck.length}
        onPrevious={() => moveToCard(Math.max(0, i - 1))}
        onNext={() => moveToCard(Math.min(deck.length - 1, i + 1))}
        nextDisabled={i + 1 >= deck.length}
        itemLabel="カード"
        progressColor="#f59e0b"
        leadingAction={(
          <IconButton
            onClick={back}
            aria-label="やめる"
            className="shrink-0 rounded-xl text-ink/45"
          >
            <Close size={19} />
          </IconButton>
        )}
        progressControl={(
          <SessionCounter
            index={i}
            total={deck.length}
            max={poolSize}
            label="語"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            onResize={(size, { discard }) => {
              if (discard) {
                setDeck(buildKotenDeck(params.ids, seed + 1, size, params.preserveOrder))
                setI(0)
                setFlipped(revealAll)
                setDone(false)
                setRemembered(0)
                clearRecordedAnswers()
              } else {
                setDeck((current) => growDeck(current, i + 1, buildKotenDeck(params.ids, seed + 1, size, params.preserveOrder), size))
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
            <CardSaveToggle
              saved={saved}
              onToggle={() => toggleKotenWordList(word.id)}
              label="登録"
              savedLabel={`${word.word}を登録単語から外す`}
              unsavedLabel={`${word.word}を登録単語へ追加`}
            />
          </>
        )}
      />

      {/* カード */}
      <CardSwipeRegion
        index={i}
        total={deck.length}
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
        {recordedAnswer !== null ? (
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
