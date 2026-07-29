import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getKotenGrammar,
  KOTEN_GRAMMAR_CATEGORIES,
} from '../data/koten-grammar.js'
import {
  KOTEN_GRAMMAR_LEVELS,
  KOTEN_GRAMMAR_QUESTION_FORMATS,
  pickKotenGrammarQuestions,
} from '../data/koten-grammar-questions.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, Chip, cx, ProgressBar, IconButton } from '../components/ui.jsx'
import {
  ArrowRight,
  Book,
  Bookmark,
  BookmarkFilled,
  Check,
  Close,
} from '../components/Icons.jsx'

const SESSION_SIZE = 12
const MASTER_BOX = 4

export function KotenGrammarQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const reviewGrammar = useStore((state) => state.reviewKotenGrammar)
  const savedIds = useStore((state) => state.kotenGrammarList)
  const addSaved = useStore((state) => state.addManyToKotenGrammarList)

  const [deck, setDeck] = useState(() =>
    pickKotenGrammarQuestions(params.ids, { size: params.size ?? SESSION_SIZE }),
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [unknownCount, setUnknownCount] = useState(0)
  const [boxUp, setBoxUp] = useState(0)
  const [newlyMastered, setNewlyMastered] = useState(0)
  const [weakIds, setWeakIds] = useState([])
  const [done, setDone] = useState(false)

  const question = deck[index]
  const relatedGrammar = question
    ? question.grammarIds.map(getKotenGrammar).filter(Boolean)
    : []
  const primary = relatedGrammar[0]
  const category = primary
    ? KOTEN_GRAMMAR_CATEGORIES.find((item) => item.id === primary.category)
    : null
  const level = question ? KOTEN_GRAMMAR_LEVELS[question.level] : null
  const format = question ? KOTEN_GRAMMAR_QUESTION_FORMATS[question.format] : null
  const allSaved = relatedGrammar.length > 0
    && relatedGrammar.every((item) => savedIds.includes(item.id))

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📝</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる文法問題がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const restart = (ids = params.ids) => {
    setDeck(pickKotenGrammarQuestions(ids, { size: params.size ?? SESSION_SIZE }))
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setUnknownCount(0)
    setBoxUp(0)
    setNewlyMastered(0)
    setWeakIds([])
    setDone(false)
  }

  const choose = (choice) => {
    if (selected !== null || !primary) return
    setSelected(choice)
    const previousBox = useStore.getState().kotenGrammarSrs[primary.id]?.box ?? 0
    if (choice === UNKNOWN_CHOICE_ID) {
      reviewGrammar(primary.id, 'unknown')
      setUnknownCount((count) => count + 1)
      setWeakIds((ids) => [...new Set([...ids, ...question.grammarIds])])
    } else if (choice === question.answer) {
      reviewGrammar(primary.id, 'correct')
      setCorrectCount((count) => count + 1)
      const nextBox = Math.min(6, previousBox + 1)
      if (nextBox > previousBox) setBoxUp((count) => count + 1)
      if (previousBox < MASTER_BOX && nextBox >= MASTER_BOX) {
        setNewlyMastered((count) => count + 1)
      }
    } else {
      reviewGrammar(primary.id, 'wrong')
      setWeakIds((ids) => [...new Set([...ids, ...question.grammarIds])])
    }
  }

  const next = () => {
    if (index + 1 >= deck.length) setDone(true)
    else {
      setIndex((current) => current + 1)
      setSelected(null)
    }
  }

  if (done) {
    const percentage = Math.round((correctCount / deck.length) * 100)
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center">
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '✍️' : '📚'}</div>
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-amber-600">GRAMMAR CHALLENGE</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">
              {correctCount} / {deck.length} 正解
            </p>
            <p className="mt-1 text-sm font-bold text-ink/50">
              正答率 {percentage}%{unknownCount > 0 && `・わからない ${unknownCount}問`}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl bg-amber-50 p-3">
              <p className="font-display text-2xl font-extrabold text-amber-700">+{boxUp}</p>
              <p className="text-[11px] font-bold text-ink/50">定着段階アップ</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3">
              <p className="font-display text-2xl font-extrabold text-emerald-700">+{newlyMastered}</p>
              <p className="text-[11px] font-bold text-ink/50">新たに習得</p>
            </div>
          </div>

          {weakIds.length > 0 && (
            <button
              onClick={() =>
                navigate('kotenGrammarStudy', {
                  ids: weakIds,
                  title: '間違えた文法',
                })
              }
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-left text-rose-800 transition-transform active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Book size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold">間違えた文法を覚え直す</span>
                <span className="block text-[11px] font-bold text-rose-700/65">{weakIds.length}項目</span>
              </span>
              <ArrowRight size={18} />
            </button>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(weakIds.length ? weakIds : params.ids)}>
              もう一度
            </Button>
            <Button onClick={back}>文法へ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const answered = selected !== null
  const correctPick = selected === question.answer
  const unknownPick = selected === UNKNOWN_CHOICE_ID

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-amber-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label="腕試しをやめる">
            <Close size={22} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <ProgressBar value={index / deck.length} color="#d97706" />
            <p className="mt-1 truncate text-[10px] font-extrabold text-ink/40">
              {params.title ?? '受験文法・腕試し'}
            </p>
          </div>
          <span className="w-12 text-right text-sm font-extrabold text-ink/50">
            {index + 1}/{deck.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex flex-wrap gap-2">
            {level && <Chip color={level.color}>{level.label}</Chip>}
            {format && <Chip color={category?.color ?? '#d97706'}>{format.emoji} {format.label}</Chip>}
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
              {question.source}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950 p-4 text-white">
            <p className="font-serif text-lg font-bold leading-[1.9]">{question.passage}</p>
            {question.target && (
              <p className="mt-2 inline-flex rounded-lg bg-amber-300/15 px-2 py-1 text-xs font-extrabold text-amber-200">
                傍線部相当：{question.target}
              </p>
            )}
          </div>

          <p className="mt-4 text-sm font-extrabold leading-relaxed text-ink/75">
            {question.question}
          </p>
        </section>

        <div className="mt-4 space-y-2.5">
          {question.choices.map((choice, choiceIndex) => {
            const correct = choice === question.answer
            const chosen = selected === choice
            let tone = 'idle'
            if (answered) {
              if (correct) tone = 'correct'
              else if (chosen) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                key={choice}
                disabled={answered}
                onClick={() => choose(choice)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all',
                  tone === 'idle' && 'border-amber-100 bg-white text-ink active:scale-[0.99] active:bg-amber-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                  tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-amber-100 text-amber-700',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold leading-relaxed">{choice}</span>
                {tone === 'correct' && <Check size={19} className="mt-0.5 shrink-0 text-emerald-600" />}
                {tone === 'wrong' && <Close size={17} className="mt-0.5 shrink-0 text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={unknownPick}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
          />
        </div>

        {answered && (
          <section className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <p className={cx(
                'font-display text-lg font-extrabold',
                correctPick ? 'text-emerald-600' : 'text-rose-500',
              )}>
                {correctPick ? '正解！' : unknownPick ? '答えを確認しよう' : 'ここを覚え直そう'}
              </p>
              <button
                onClick={() => addSaved(question.grammarIds)}
                disabled={allSaved}
                className={cx(
                  'flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-extrabold',
                  allSaved ? 'bg-amber-100 text-amber-700' : 'bg-paper text-ink/50 active:scale-95',
                )}
              >
                {allSaved ? <BookmarkFilled size={15} /> : <Bookmark size={15} />}
                {allSaved ? '登録済み' : '文法を登録'}
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] font-extrabold text-emerald-600">正解</p>
              <p className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-900">
                {question.answer}
              </p>
            </div>
            <p className="mt-3 text-sm font-bold leading-relaxed text-ink/65">
              {question.explanation}
            </p>
            {question.translation && (
              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="text-[10px] font-extrabold text-slate-500">現代語訳</p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">
                  {question.translation}
                </p>
              </div>
            )}

            <div className="mt-3 space-y-2">
              {relatedGrammar.map((item) => (
                <div key={item.id} className="rounded-xl border border-amber-100 px-3 py-2.5">
                  <p className="text-xs font-extrabold text-amber-800">{item.title}</p>
                  <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/50">
                    {item.connection} ｜ {item.meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-amber-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
