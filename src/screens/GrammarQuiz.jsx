import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { shuffle } from '../data/vocab.js'
import {
  grammarChoiceGuidanceFor,
  samePatternExamplesFor,
} from '../data/grammar.js'
import { longSentenceTranslationFor } from '../data/long-sentence-translations.js'
import { buildGrammarDeck } from '../lib/grammarDeck.js'
import { growDeck } from '../lib/session.js'
import { todayIndex } from '../store/useStore.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { LongSentenceTranslation } from '../components/LongSentenceTranslation.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { Button, ProgressBar, IconButton, Chip, cx } from '../components/ui.jsx'
import { ArrowRight, Bookmark, BookmarkFilled, Check, Close } from '../components/Icons.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildGrammarInstructorExplanation } from '../lib/instructorExplanations.js'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

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
  const toggleNotebookItem = useStore((s) => s.toggleNotebookItem)
  const learningNotebook = useStore((s) => s.learningNotebook)
  const color = params.levelColor ?? '#6366f1'

  // size=0 は「絞り込みなし」。在庫数から、選べる問題数の上限を決める。
  const buildFor = (size) =>
    buildGrammarDeck(
      params.source ?? { type: 'grammar', level: '5' },
      { srs: useStore.getState().srs, day: todayIndex(), size },
    )
  const [poolSize] = useState(() => buildFor(0).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildFor(params.size ?? sessionSize))
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState(null)
  const results = useRef({ correct: 0, wrong: 0, unknown: 0, wrongIds: [] })

  const item = deck[i]
  const options = useMemo(() => (item ? shuffle(item.choices) : []), [item?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const patternExamples = useMemo(
    () => samePatternExamplesFor(item),
    [item?.id], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const choiceGuides = useMemo(
    () => item
      ? options
          .filter((choice) => choice !== item.answer)
          .map((choice) => ({
            choice,
            guidance: grammarChoiceGuidanceFor(item, choice),
          }))
      : [],
    [item?.id, options], // eslint-disable-line react-hooks/exhaustive-deps
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
  const selectedGuidance = choiceGuides.find(({ choice }) => choice === selected)?.guidance
  const instructorExplanation = answered
    ? buildGrammarInstructorExplanation(item, selected, selectedGuidance)
    : null
  const longSentenceTranslation = longSentenceTranslationFor(item)
  const saved = learningNotebook?.entries?.[`grammar:${item.id}`]?.saved === true

  const finish = () => {
    navigate('sessionResult', {
      title: params.title ?? '文法',
      mode: 'quiz',
      engine: 'grammar',
      replayScreen: 'grammarQuiz',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      reviewIds: results.current.wrongIds,
      source: params.source,
      continueTo: params.continueTo,
      returnTo: params.returnTo,
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
        <IconButton
          onClick={() => toggleNotebookItem('grammar', item.id)}
          aria-label={saved ? `${item.topic}の問題をマイ学習ノートから外す` : `${item.topic}の問題をマイ学習ノートへ保存`}
          aria-pressed={saved}
          className={saved ? 'text-amber-600' : 'text-ink/30'}
        >
          {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
        </IconButton>
        <SpeechSettingsButton compact />
        <SessionCounter
          index={i}
          total={deck.length}
          max={poolSize}
          onResize={(size, { discard }) => {
            if (discard) {
              setDeck(buildFor(size))
              setI(0)
              setSelected(null)
              results.current = { correct: 0, wrong: 0, unknown: 0, wrongIds: [] }
            } else {
              setDeck((current) => growDeck(current, i + 1, buildFor(size), size))
            }
          }}
        />
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
                <p className="mt-0.5 text-sm font-bold text-ink/55">
                  {longSentenceTranslation && <span className="mr-1 text-[11px] text-ink/35">自然な和訳</span>}
                  {item.sentence.ja}
                </p>
              </div>
            </div>
            <LongSentenceTranslation guide={longSentenceTranslation} className="mt-3" />
            <InstructorExplanation
              explanation={instructorExplanation}
              className="mt-3"
            />
            <div className="mt-3 border-t border-brand-100 pt-3" data-grammar-choice-guidance>
              <p className="font-display text-sm font-extrabold text-ink/70">選択肢解説</p>
              <div className="mt-2 space-y-2">
                {choiceGuides.map(({ choice, guidance }) => {
                  const chosenWrong = selected === choice
                  const usable = guidance?.status === 'valid'
                  const example = guidance?.example?.en ?? guidance?.pattern
                  return (
                    <div
                      key={choice}
                      data-grammar-choice-guide={choice}
                      data-choice-status={guidance?.status}
                      className={cx(
                        'rounded-xl border p-3',
                        usable
                          ? 'border-brand-100 bg-brand-50/55'
                          : 'border-rose-100 bg-rose-50/65',
                        chosenWrong && 'ring-2 ring-rose-300',
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-display text-sm font-extrabold text-ink">
                          {choice}
                        </span>
                        {!usable && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                            この形は使わない
                          </span>
                        )}
                        {chosenWrong && (
                          <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                            あなたの回答
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/65">
                        {guidance?.summary}
                      </p>
                      {example && (
                        <div className="mt-1.5 rounded-lg bg-white/80 px-2.5 py-2">
                          <p className="text-xs font-extrabold leading-relaxed text-ink">
                            例・型：{example}
                          </p>
                          {guidance?.example?.ja && (
                            <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-ink/45">
                              {guidance.example.ja}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
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

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {i + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
