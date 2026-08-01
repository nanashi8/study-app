import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildPhraseDeck, pickPhraseDistractors } from '../lib/session.js'
import { shuffle } from '../data/vocab.js'
import { quizMeaning } from '../data/compact.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { Button, ProgressBar, IconButton, Chip } from '../components/ui.jsx'
import { Close, Check, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildPhraseInstructorExplanation } from '../lib/instructorExplanations.js'

export function PhraseQuizScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)

  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildPhraseDeck(params.source ?? { type: 'phrase', kind: 'idiom' }, {
      srs: useStore.getState().srs,
      size: 10,
    }),
  )
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState(null)
  const results = useRef({ correct: 0, wrong: 0, unknown: 0, wrongIds: [] })

  const item = deck[i]
  const options = useMemo(() => {
    if (!item) return []
    return shuffle([item, ...pickPhraseDistractors(item, 2)])
  }, [item?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる項目がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const answered = selected !== null

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? '熟語・構文',
      mode: 'quiz',
      engine: 'phrase',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      xpGained,
      reviewIds: results.current.wrongIds,
      source: params.source,
    })
  }

  const choose = (optId) => {
    if (answered) return
    setSelected(optId)
    if (optId === UNKNOWN_CHOICE_ID) {
      review(item.id, 'unknown', 'usage')
      results.current.unknown++
      results.current.wrongIds.push(item.id)
    } else if (optId === item.id) {
      review(item.id, 'correct', 'usage')
      results.current.correct++
    } else {
      review(item.id, 'wrong', 'usage')
      results.current.wrong++
      results.current.wrongIds.push(item.id)
    }
  }

  const next = () => {
    if (i + 1 >= deck.length) finish()
    else {
      setI(i + 1)
      setSelected(null)
    }
  }

  const isCorrectPick = answered && selected === item.id
  const instructorExplanation = answered
    ? buildPhraseInstructorExplanation(
        item,
        selected === UNKNOWN_CHOICE_ID
          ? UNKNOWN_CHOICE_ID
          : options.find((option) => option.id === selected),
      )
    : null

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#8b5cf6" /></div>
        <SpeechSettingsButton compact />
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-card">
          <Chip color={item.kind === 'syntax' ? '#8b5cf6' : '#0ea5e9'} className="self-start">
            {item.kind === 'syntax' ? '構文' : '熟語'}
          </Chip>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">{item.phrase}</h2>
          <div className="mt-3"><SpeakButton text={phraseSpeechText(item)} size="md" /></div>
          <p className="mt-4 text-sm font-extrabold text-ink/55">この意味は？</p>
        </div>

        <div className="mt-4 space-y-2.5">
          {options.map((o) => {
            const correct = o.id === item.id
            const chosen = selected === o.id
            let tone = 'idle'
            if (answered) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
            return (
              <button
                key={o.id}
                disabled={answered}
                onClick={() => choose(o.id)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:bg-brand-50 active:scale-[0.99]',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className="flex-1">{quizMeaning(o)}</span>
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

        {answered && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx('font-display text-lg font-extrabold', isCorrectPick ? 'text-emerald-600' : 'text-rose-500')}>
              {isCorrectPick ? '正解！🎉' : selected === UNKNOWN_CHOICE_ID ? '答えはこちら' : 'ざんねん…'}
            </p>
            <p className="mt-1 font-bold text-ink">
              <span className="font-display">{item.phrase}</span> ＝ {item.meanings.join('・')}
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-50/70 p-3">
              <SpeakButton text={item.example.en} size="sm" />
              <div className="min-w-0 text-left">
                <p className="text-sm font-bold leading-relaxed text-ink">{item.example.en}</p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">{item.example.ja}</p>
              </div>
            </div>
            <InstructorExplanation
              explanation={instructorExplanation}
              className="mt-3"
            />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {i + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
