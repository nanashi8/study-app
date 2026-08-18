import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getKotenCulture,
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_LEVELS,
  KOTEN_CULTURE_QUESTION_FORMATS,
  pickKotenCultureQuestions,
} from '../data/koten-culture.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { KotenText } from '../components/KotenFurigana.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, Chip, cx, ProgressBar, IconButton } from '../components/ui.jsx'
import { growDeck } from '../lib/session.js'
import {
  ArrowRight,
  Book,
  Bookmark,
  BookmarkFilled,
  Check,
  Close,
} from '../components/Icons.jsx'
import { buildKotenCultureInstructorExplanation } from '../lib/instructorExplanations.js'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

const MASTER_BOX = 4

const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限

export function KotenCultureQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const reviewCulture = useStore((state) => state.reviewKotenCulture)
  const savedIds = useStore((state) => state.kotenCultureList)
  const addSaved = useStore((state) => state.addManyToKotenCultureList)
  const recordQuizResult = useStore((state) => state.recordContentQuizResult)

  // 在庫を数えて、選べる問題数の上限を実態に合わせる。
  const [poolSize] = useState(() => pickKotenCultureQuestions(params.ids, { size: ALL_QUESTIONS }).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() =>
    pickKotenCultureQuestions(params.ids, { size: params.size ?? sessionSize }),
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
  const relatedCulture = question
    ? question.cultureIds.map(getKotenCulture).filter(Boolean)
    : []
  const primary = relatedCulture[0]
  const category = primary
    ? KOTEN_CULTURE_CATEGORIES.find((item) => item.id === primary.category)
    : null
  const level = question ? KOTEN_CULTURE_LEVELS[question.level] : null
  const format = question ? KOTEN_CULTURE_QUESTION_FORMATS[question.format] : null
  const allSaved = relatedCulture.length > 0
    && relatedCulture.every((item) => savedIds.includes(item.id))

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🏯</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる古典常識問題がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const restart = (ids = params.ids) => {
    setDeck(pickKotenCultureQuestions(ids, { size: deck.length || sessionSize }))
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
    // クイズの進み具合は「全112問」に対して数えるので、問題そのものの結果も残す。
    recordQuizResult('koten-culture', question.id, choice === question.answer ? 1 : 0, 1)
    const previousBox = useStore.getState().kotenCultureSrs[primary.id]?.box ?? 0
    if (choice === UNKNOWN_CHOICE_ID) {
      reviewCulture(primary.id, 'unknown')
      setUnknownCount((count) => count + 1)
      setWeakIds((ids) => [...new Set([...ids, ...question.cultureIds])])
    } else if (choice === question.answer) {
      reviewCulture(primary.id, 'correct')
      setCorrectCount((count) => count + 1)
      const nextBox = Math.min(6, previousBox + 1)
      if (nextBox > previousBox) setBoxUp((count) => count + 1)
      if (previousBox < MASTER_BOX && nextBox >= MASTER_BOX) {
        setNewlyMastered((count) => count + 1)
      }
    } else {
      reviewCulture(primary.id, 'wrong')
      setWeakIds((ids) => [...new Set([...ids, ...question.cultureIds])])
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
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '🪭' : '📚'}</div>
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-violet-600">CULTURE CHALLENGE</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">
              {correctCount} / {deck.length} 正解
            </p>
            <p className="mt-1 text-sm font-bold text-ink/50">
              正答率 {percentage}%{unknownCount > 0 && `・わからない ${unknownCount}問`}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl bg-violet-50 p-3">
              <p className="font-display text-2xl font-extrabold text-violet-700">+{boxUp}</p>
              <p className="text-[11px] font-bold text-ink/50">復習の段階が上がった</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3">
              <p className="font-display text-2xl font-extrabold text-emerald-700">+{newlyMastered}</p>
              <p className="text-[11px] font-bold text-ink/50">よく覚えた段階に到達</p>
            </div>
          </div>

          {weakIds.length > 0 && (
            <button
              onClick={() =>
                navigate('kotenCultureStudy', {
                  ids: weakIds,
                  title: '間違えた古典常識',
                })
              }
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-left text-rose-800 transition-transform active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Book size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold">間違えた常識を覚え直す</span>
                <span className="block text-[11px] font-bold text-rose-700/65">{weakIds.length}テーマ</span>
              </span>
              <ArrowRight size={18} />
            </button>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(weakIds.length ? weakIds : params.ids)}>
              もう一度
            </Button>
            <Button onClick={back}>常識へ戻る</Button>
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
      <div className="border-b border-violet-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label="腕試しをやめる">
            <Close size={22} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <ProgressBar value={index / deck.length} color="#7c3aed" />
            <p className="mt-1 truncate text-[10px] font-extrabold text-ink/40">
              {params.title ?? '古典常識・入試型腕試し'}
            </p>
          </div>
          <SpeechSettingsButton compact />
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            onResize={(size, { discard }) => {
              if (discard) {
                setDeck(pickKotenCultureQuestions(params.ids, { size }))
                setIndex(0)
                setSelected(null)
                setCorrectCount(0)
                setUnknownCount(0)
                setBoxUp(0)
                setNewlyMastered(0)
                setWeakIds([])
                setDone(false)
              } else {
                setDeck((current) => growDeck(
                  current,
                  index + 1,
                  pickKotenCultureQuestions(params.ids, { size }),
                  size,
                ))
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex flex-wrap gap-2">
            {level && <Chip color={level.color}>{level.label}</Chip>}
            {format && <Chip color={category?.color ?? '#7c3aed'}>{format.emoji} {format.label}</Chip>}
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
              {question.source}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-950 to-violet-950 p-4 text-white">
            <p className="font-serif text-lg font-bold leading-[1.9]">
              <KotenText>{question.passage}</KotenText>
            </p>
            {question.target && (
              <p className="mt-2 inline-flex rounded-lg bg-violet-300/15 px-2 py-1 text-xs font-extrabold text-violet-200">
                注目：<KotenText>{question.target}</KotenText>
              </p>
            )}
          </div>

          <p className="mt-4 text-sm font-extrabold leading-relaxed text-ink/75">
            <KotenText>{question.question}</KotenText>
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
                  tone === 'idle' && 'border-violet-100 bg-white text-ink active:scale-[0.99] active:bg-violet-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                  tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-violet-100 text-violet-700',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold leading-relaxed">
                  <KotenText>{choice}</KotenText>
                </span>
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
                onClick={() => addSaved(question.cultureIds)}
                disabled={allSaved}
                className={cx(
                  'flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-extrabold',
                  allSaved ? 'bg-violet-100 text-violet-700' : 'bg-paper text-ink/50 active:scale-95',
                )}
              >
                {allSaved ? <BookmarkFilled size={15} /> : <Bookmark size={15} />}
                {allSaved ? '登録済み' : '常識を登録'}
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] font-extrabold text-emerald-600">正解</p>
              <p className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-900">
                <KotenText>{question.answer}</KotenText>
              </p>
            </div>
            <InstructorExplanation
              explanation={buildKotenCultureInstructorExplanation(
                question,
                selected,
                relatedCulture[0],
              )}
              className="mt-3"
              renderText={(text) => <KotenText>{text}</KotenText>}
            />

            <div className="mt-3 space-y-2">
              {relatedCulture.map((item) => (
                <div key={item.id} className="rounded-xl border border-violet-100 px-3 py-2.5">
                  <p className="text-xs font-extrabold leading-relaxed text-violet-800">
                    <KotenText>{item.title}</KotenText>
                  </p>
                  <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/50">
                    <KotenText>{item.core}</KotenText>
                  </p>
                  <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/40">
                    <KotenText>{item.examTip}</KotenText>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
