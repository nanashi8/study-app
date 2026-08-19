import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  KANBUN_KUNDOKU_LEVELS,
  isCorrectKanbunKundokuOrder,
  pickKanbunKundokuExercises,
} from '../data/kanbun-kundoku.js'
import { Button, Chip, cx, IconButton, ProgressBar } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { KanbunText } from '../components/KanbunFurigana.jsx'
import { KanbunMarkedText } from '../components/KanbunMarkedText.js'
import { Check, Close, Lightbulb, Refresh } from '../components/Icons.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { growDeck } from '../lib/session.js'

const ALL_EXERCISES = 9999 // 在庫数を数えるための十分大きな上限

export function KanbunKundokuQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const review = useStore((state) => state.reviewKanbunKundoku)
  const [poolSize] = useState(() => pickKanbunKundokuExercises(params.ids, { size: ALL_EXERCISES }).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => pickKanbunKundokuExercises(params.ids, { size: params.size ?? sessionSize }))
  const [index, setIndex] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [weakIds, setWeakIds] = useState([])
  const [done, setDone] = useState(false)
  const exercise = deck[index]
  const correct = answered && isCorrectKanbunKundokuOrder(exercise, selectedIds)
  const level = KANBUN_KUNDOKU_LEVELS.find((item) => item.id === exercise?.level)
  const tokenById = useMemo(
    () => new Map((exercise?.tokens ?? []).map((token) => [token.id, token])),
    [exercise],
  )

  // コンテンツ画面の「戻る」は履歴でなく、返り点の内容選択画面へ。
  const backToKanbunKundoku = () => navigate('kanbunKundoku')

  if (!exercise) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">↩️</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる返り点問題がありません</p>
        <Button onClick={backToKanbunKundoku}>もどる</Button>
      </div>
    )
  }

  const available = exercise.tokens.filter((token) => !selectedIds.includes(token.id))
  const selectToken = (id) => {
    if (answered || selectedIds.includes(id)) return
    setSelectedIds((ids) => [...ids, id])
  }
  const unselectToken = (id) => {
    if (answered) return
    setSelectedIds((ids) => ids.filter((selectedId) => selectedId !== id))
  }
  const submit = () => {
    if (answered || selectedIds.length !== exercise.order.length) return
    const isCorrect = isCorrectKanbunKundokuOrder(exercise, selectedIds)
    review(exercise.id, isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setCorrectCount((count) => count + 1)
    else setWeakIds((ids) => [...new Set([...ids, exercise.id])])
    setAnswered(true)
  }
  const next = () => {
    if (index + 1 >= deck.length) setDone(true)
    else {
      setIndex((current) => current + 1)
      setSelectedIds([])
      setAnswered(false)
    }
  }
  const restart = (ids = params.ids) => {
    setDeck(pickKanbunKundokuExercises(ids, { size: deck.length || sessionSize }))
    setIndex(0)
    setSelectedIds([])
    setAnswered(false)
    setCorrectCount(0)
    setWeakIds([])
    setDone(false)
  }

  if (done) {
    const percentage = Math.round((correctCount / deck.length) * 100)
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center">
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{percentage >= 80 ? '🏆' : '↩️'}</div>
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-rose-700">KUNDOKU ORDER</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{correctCount} / {deck.length} 正解</p>
            <p className="mt-1 text-sm font-bold text-ink/50">返り点の読む順・正答率 {percentage}%</p>
          </div>
          {weakIds.length > 0 && (
            <button
              type="button"
              onClick={() => restart(weakIds)}
              className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-left text-sm font-extrabold text-rose-900"
            >
              間違えた {weakIds.length}題だけ解き直す
            </button>
          )}
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart()}>もう一度</Button>
            <Button onClick={backToKanbunKundoku}>返り点へ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-rose-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={backToKanbunKundoku} aria-label="返り点テストをやめる"><Close size={22} /></IconButton>
          <div className="min-w-0 flex-1">
            <ProgressBar value={index / deck.length} color="#be123c" />
            <p className="mt-1 truncate text-[10px] font-extrabold text-ink/40">{params.title ?? '返り点・訓読ドリル'}</p>
          </div>
          <SpeechSettingsButton compact />
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            onResize={(size, { discard }) => {
              if (discard) {
                setDeck(pickKanbunKundokuExercises(params.ids, { size }))
                setIndex(0)
                setSelectedIds([])
                setAnswered(false)
                setCorrectCount(0)
                setWeakIds([])
                setDone(false)
              } else {
                setDeck((current) => growDeck(
                  current,
                  index + 1,
                  pickKanbunKundokuExercises(params.ids, { size }),
                  size,
                ))
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
        <section className="rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex flex-wrap gap-2">
            <Chip color={level?.color}>{level?.label}</Chip>
            <Chip color="#be123c">{exercise.title}</Chip>
          </div>
          <p className="mt-4 text-xs font-extrabold text-ink/50">返り点に従い、読む順に漢字をタップ</p>
          <div className="mt-3 rounded-2xl bg-gradient-to-br from-slate-950 to-rose-950 px-4 py-6 text-center text-white">
            <KanbunMarkedText marked={exercise.marked} inverse />
          </div>

          <div className="mt-5">
            <div className="flex min-h-20 flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/50 p-3">
              {selectedIds.length ? selectedIds.map((id, selectedIndex) => (
                <button
                  type="button"
                  key={id}
                  disabled={answered}
                  onClick={() => unselectToken(id)}
                  className={cx(
                    'rounded-xl border-2 px-3 py-2 text-sm font-extrabold shadow-sm',
                    answered && exercise.order[selectedIndex] === id
                      ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                      : answered
                        ? 'border-rose-400 bg-rose-100 text-rose-900'
                        : 'border-rose-200 bg-white text-rose-950',
                  )}
                >
                  <span className="mr-1 text-[10px] text-ink/35">{selectedIndex + 1}</span>
                  {tokenById.get(id)?.label}
                </button>
              )) : (
                <p className="m-auto text-xs font-bold text-rose-900/40">ここに読む順が並びます</p>
              )}
            </div>
            {!answered && selectedIds.length > 0 && (
              <button type="button" onClick={() => setSelectedIds([])} className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-ink/45">
                <Refresh size={14} /> 並びをやり直す
              </button>
            )}
          </div>

          {!answered && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {available.map((token) => (
                <button
                  type="button"
                  key={token.id}
                  onClick={() => selectToken(token.id)}
                  className="min-h-12 rounded-xl border-2 border-slate-200 bg-white px-2 py-2 font-serif text-base font-extrabold text-ink active:scale-95 active:border-rose-400"
                >
                  {token.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {answered && (
          <section className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx('flex items-center gap-2 font-display text-lg font-extrabold', correct ? 'text-emerald-700' : 'text-rose-700')}>
              {correct ? <Check size={20} /> : <Close size={20} />} {correct ? '正しい読む順です' : '返る階層を確認しよう'}
            </p>
            {!correct && (
              <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                <p className="text-[10px] font-extrabold text-emerald-700">正しい順</p>
                <p className="mt-1 flex flex-wrap gap-1 text-sm font-extrabold text-emerald-950">
                  {exercise.order.map((id, orderIndex) => (
                    <span key={id}>{orderIndex > 0 && '→'} {tokenById.get(id)?.label}</span>
                  ))}
                </p>
              </div>
            )}
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-extrabold text-slate-500">書き下し文</p>
              <p className="mt-1 font-serif text-base font-bold leading-relaxed text-ink"><KanbunText>{exercise.kakikudashi}</KanbunText></p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">{exercise.translation}</p>
            </div>
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="flex items-center gap-1 text-[10px] font-extrabold text-amber-700"><Lightbulb size={14} /> 解き方</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-amber-950/70">{exercise.clue}</p>
            </div>
            <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-[10px] font-extrabold text-rose-700">間違えやすい点</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-rose-950/70">{exercise.pitfall}</p>
            </div>
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-rose-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button
          full
          size="lg"
          disabled={!answered && selectedIds.length !== exercise.order.length}
          onClick={answered ? next : submit}
        >
          {answered ? index + 1 >= deck.length ? '結果を見る' : '次の問題へ' : 'この順で答える'}
        </Button>
      </div>
    </div>
  )
}
