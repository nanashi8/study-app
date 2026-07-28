import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { shuffle } from '../data/vocab.js'
import { samePatternExamplesFor } from '../data/grammar.js'
import { buildGrammarDeck } from '../lib/grammarDeck.js'
import { todayIndex } from '../store/useStore.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, ProgressBar, IconButton, Chip, cx } from '../components/ui.jsx'
import { Close, Check, ArrowRight, Lightbulb } from '../components/Icons.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'

// 空所 ___ を下線つきの空欄として表示。
function renderQuestion(q) {
  const parts = q.split('___')
  return parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 && <span className="mx-1 inline-block min-w-[2.5em] border-b-2 border-brand-300 align-baseline">&nbsp;</span>}
    </span>
  ))
}

export function GrammarQuizScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const color = params.levelColor ?? '#6366f1'

  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildGrammarDeck(
      params.source ?? { type: 'grammar', level: '5' },
      { srs: useStore.getState().srs, day: todayIndex() },
    ),
  )
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState(null)
  const results = useRef({ correct: 0, wrong: 0, unknown: 0, wrongIds: [] })

  const item = deck[i]
  const options = useMemo(() => (item ? shuffle(item.choices) : []), [item?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const patternExamples = useMemo(
    () => samePatternExamplesFor(item),
    [item?.id], // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📝</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる問題がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const answered = selected !== null
  const isCorrectPick = answered && selected === item.answer

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? '文法',
      mode: 'quiz',
      engine: 'grammar',
      replayScreen: 'grammarQuiz',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      xpGained,
      reviewIds: results.current.wrongIds.length ? results.current.wrongIds : deck.map((g) => g.id),
      source: params.source,
    })
  }

  const choose = (opt) => {
    if (answered) return
    setSelected(opt)
    if (opt === UNKNOWN_CHOICE_ID) {
      review(item.id, 'unknown', 'grammar')
      results.current.unknown++
      results.current.wrongIds.push(item.id)
    } else if (opt === item.answer) {
      review(item.id, 'correct', 'grammar')
      results.current.correct++
    } else {
      review(item.id, 'wrong', 'grammar')
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color={color} /></div>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mt-2 rounded-[2rem] bg-white p-6 text-center shadow-card">
          <Chip color={color} className="self-start">{item.topic}</Chip>
          <h2 className="mt-3 font-display text-2xl font-extrabold leading-relaxed text-ink">
            {renderQuestion(item.q)}
          </h2>
          <p className="mt-3 text-sm font-extrabold text-ink/55">空所に入るのは？</p>
        </div>

        <div className="mt-4 space-y-2.5">
          {options.map((o) => {
            const correct = o === item.answer
            const chosen = selected === o
            let tone = 'idle'
            if (answered) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
            return (
              <button
                key={o}
                disabled={answered}
                onClick={() => choose(o)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:bg-brand-50 active:scale-[0.99]',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className="flex-1">{o}</span>
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
            <div className="mt-2 flex items-start gap-2">
              <SpeakButton text={item.sentence.en} size="sm" />
              <div>
                <p className="font-bold text-ink">{item.sentence.en}</p>
                <p className="mt-0.5 text-sm font-bold text-ink/55">{item.sentence.ja}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 rounded-2xl bg-hint-soft/70 p-3">
              <span className="mt-0.5 shrink-0 text-hint"><Lightbulb size={18} /></span>
              <p className="text-sm font-bold leading-relaxed text-amber-900/90">{item.explain}</p>
            </div>
            <div className="mt-3 border-t border-brand-100 pt-3">
              <p className="font-display text-sm font-extrabold text-ink/70">同じ形の例</p>
              <div className="mt-2 space-y-2">
                {patternExamples.map((example, index) => (
                  <div key={example.id} className="flex items-start gap-2 rounded-xl bg-brand-50/70 p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-extrabold text-brand-600">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold leading-relaxed text-ink">{example.en}</p>
                      <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">{example.ja}</p>
                    </div>
                    <SpeakButton text={example.en} size="sm" />
                  </div>
                ))}
              </div>
            </div>
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
