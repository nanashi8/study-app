import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getKoten, pickKotenDistractors } from '../data/koten.js'
import { Button, IconButton } from '../components/ui.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { KotenText, KotenWord } from '../components/KotenFurigana.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import {
  Bookmark,
  BookmarkFilled,
  Close,
  Check,
  ArrowRight,
} from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildKotenWordInstructorExplanation } from '../lib/instructorExplanations.js'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { growDeck } from '../lib/session.js'
import {
  QuestionSessionControls,
  useIndexedSessionState,
} from '../components/QuestionSessionControls.jsx'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 渡された id 群からシャッフルして作る（既定は設定した問題数）。
function buildQuizDeck(ids, seed, size = 20) { // eslint-disable-line no-unused-vars
  const words = (ids ?? []).map(getKoten).filter(Boolean)
  return size > 0 ? shuffle(words).slice(0, size) : shuffle(words)
}

export function KotenQuizScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const reviewKoten = useStore((s) => s.reviewKoten)
  const kotenWordList = useStore((s) => s.kotenWordList)
  const toggleKotenWordList = useStore((s) => s.toggleKotenWordList)

  const [seed, setSeed] = useState(0)
  const poolSize = (params.ids ?? []).length
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildQuizDeck(params.ids, 0, params.size ?? sessionSize))
  const [i, setI] = useState(0)
  const {
    value: selected,
    setValue: setSelected,
    clear: clearSelections,
  } = useIndexedSessionState(i)
  const autoAdvanceSequence = useRef(0)
  const [autoAdvanceSignal, setAutoAdvanceSignal] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const word = deck[i]
  const saved = word ? kotenWordList.includes(word.id) : false
  const options = useMemo(() => {
    if (!word) return []
    return shuffle([word, ...pickKotenDistractors(word, 3)])
  }, [word?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる語がありません</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const restart = () => {
    const next = seed + 1
    setSeed(next)
    setDeck(buildQuizDeck(params.ids, next, deck.length))
    setI(0)
    clearSelections()
    setCorrectCount(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((correctCount / deck.length) * 100)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 50 ? '👏' : '📚'}</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">{correctCount} / {deck.length} 正解</p>
          <p className="mt-1 text-sm font-bold text-ink/55">正答率 {pct}%</p>
        </div>
        {correctCount < deck.length && (
          <p className="max-w-xs text-xs font-bold leading-relaxed text-ink/50">
            間違えた{deck.length - correctCount}語は、「もう一度」で答えを確認できます。
          </p>
        )}
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={back}>戻る</Button>
        </div>
      </div>
    )
  }

  const answered = selected !== null

  const choose = (optId) => {
    if (answered) return
    setSelected(optId)
    if (optId === UNKNOWN_CHOICE_ID) {
      reviewKoten(word.id, 'unknown')
    } else if (optId === word.id) {
      reviewKoten(word.id, 'correct')
      setCorrectCount((n) => n + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    } else {
      reviewKoten(word.id, 'wrong')
    }
  }

  const next = () => {
    if (i + 1 >= deck.length) setDone(true)
    else {
      setI(i + 1)
    }
  }

  const isCorrectPick = answered && selected === word.id
  const instructorExplanation = answered
    ? buildKotenWordInstructorExplanation(
        word,
        selected === UNKNOWN_CHOICE_ID
          ? UNKNOWN_CHOICE_ID
          : options.find((option) => option.id === selected),
      )
    : null

  return (
    <div className="flex h-full flex-col">
      {/* 進捗 */}
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる">
          <Close size={22} />
        </IconButton>
        <span className="min-w-0 flex-1" aria-hidden="true" />
        <SpeechSettingsButton compact />
        <SessionCounter
          index={i}
          total={deck.length}
          max={poolSize}
          onResize={(size, { discard }) => {
            if (discard) {
              setDeck(buildQuizDeck(params.ids, seed + 1, size))
              setI(0)
              clearSelections()
              setCorrectCount(0)
              setDone(false)
            } else {
              setDeck((current) => growDeck(current, i + 1, buildQuizDeck(params.ids, seed + 1, size), size))
            }
          }}
        />
      </div>

      <QuestionSessionControls
        index={i}
        total={deck.length}
        onPrevious={() => setI((current) => Math.max(0, current - 1))}
        onNext={next}
        nextDisabled={!answered}
        showAutoAdvance
        autoAdvanceSignal={isCorrectPick ? autoAdvanceSignal : null}
        progressColor="#f59e0b"
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* 出題語 */}
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-card">
          <span className="self-start rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
            {word.pos}
          </span>
          <h2 className="mt-2 pt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
            <KotenWord word={word} />
          </h2>
          <p className="mt-4 text-sm font-extrabold text-ink/55">この古語の意味は？</p>
        </div>

        {/* 選択肢 */}
        <div className="mt-4 space-y-2.5">
          {options.map((o) => {
            const correct = o.id === word.id
            const chosen = selected === o.id
            let tone = 'idle'
            if (answered) {
              if (correct) tone = 'correct'
              else if (chosen) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                key={o.id}
                disabled={answered}
                onClick={() => choose(o.id)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                  tone === 'idle' && 'border-amber-100 bg-white text-ink active:bg-amber-50 active:scale-[0.99]',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className="flex-1">
                  <KotenText>{o.meanings?.[0] ?? o.meaning}</KotenText>
                </span>
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
          />
        </div>

        {/* 答え合わせ後 */}
        {answered && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <p className={cx('font-display text-lg font-extrabold', isCorrectPick ? 'text-emerald-600' : 'text-rose-500')}>
                {isCorrectPick ? '正解！🎉' : selected === UNKNOWN_CHOICE_ID ? '答えはこちら' : 'ざんねん…'}
              </p>
              <button
                onClick={() => toggleKotenWordList(word.id)}
                aria-label={saved ? `${word.word}を登録単語から外す` : `${word.word}を登録単語へ追加`}
                aria-pressed={saved}
                className={cx(
                  'flex items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-extrabold active:scale-95',
                  saved ? 'bg-amber-100 text-amber-700' : 'bg-paper text-ink/45',
                )}
              >
                {saved ? <BookmarkFilled size={16} /> : <Bookmark size={16} />}
                {saved ? '登録済み' : '登録'}
              </button>
            </div>
            <p className="mt-1 font-bold text-ink">
              <span className="font-display"><KotenWord word={word} /></span>
              {' ＝ '}
              <KotenText>{word.meanings.join('・')}</KotenText>
            </p>
            <InstructorExplanation
              explanation={instructorExplanation}
              className="mt-3"
              renderText={(text) => <KotenText>{text}</KotenText>}
            />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-amber-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {i + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
