import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  KANBUN_COLLECTIONS,
  getKanbunItem,
  kanbunDomainMeta,
  pickKanbunQuestions,
} from '../data/kanbun-content.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, Chip, cx, IconButton, ProgressBar } from '../components/ui.jsx'
import {
  ArrowRight,
  Book,
  Bookmark,
  BookmarkFilled,
  Check,
  Close,
  Lightbulb,
} from '../components/Icons.jsx'

const SESSION_SIZE = 12

function ChoiceExplanation({ question, selected }) {
  const selectedItemId = selected?.split(':')[1]
  const selectedItem = selectedItemId ? getKanbunItem(question.domain, selectedItemId) : null
  const unknown = selected === UNKNOWN_CHOICE_ID
  const correct = selected === question.answerId
  return (
    <div className="mt-3 space-y-2.5">
      <div className="rounded-xl bg-emerald-50 p-3">
        <p className="text-[10px] font-extrabold text-emerald-700">正解と決定的な手掛かり</p>
        <p className="mt-1 text-sm font-extrabold leading-relaxed text-emerald-950">{question.answer}</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-emerald-900/70">{question.clue}</p>
      </div>
      {!correct && (
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="text-[10px] font-extrabold text-rose-700">{unknown ? 'わからない時の切り方' : '選んだ答えがここで違う理由'}</p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-rose-950/70">
            {unknown
              ? `まず「${question.clue}」を探し、形・主語・比較対象のどれが問われているか一つに絞る。`
              : `「${selectedItem?.answer ?? 'その選択肢'}」は「${selectedItem?.title ?? '別項目'}」の説明。ここでは「${getKanbunItem(question.domain, question.itemId)?.title}」に固有の手掛かりと一致しない。`}
          </p>
        </div>
      )}
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-[10px] font-extrabold text-slate-500">再利用できる見抜き方</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/65">{question.detail}</p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-[10px] font-extrabold text-amber-700">取り違え注意</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-amber-950/70">{question.pitfall}</p>
      </div>
    </div>
  )
}

export function KanbunQuizScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const navigate = useStore((state) => state.navigate)
  const review = useStore((state) => state.reviewKanbun)
  const addSaved = useStore((state) => state.addManyToKanbunList)
  const domain = KANBUN_COLLECTIONS[params.domain] ? params.domain : 'vocab'
  const meta = kanbunDomainMeta(domain)
  const savedIds = useStore((state) => state[meta.listField])
  const [deck, setDeck] = useState(() => pickKanbunQuestions(domain, params.ids, { size: params.size ?? SESSION_SIZE }))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [unknownCount, setUnknownCount] = useState(0)
  const [weakIds, setWeakIds] = useState([])
  const [done, setDone] = useState(false)
  const question = deck[index]
  const item = question ? getKanbunItem(domain, question.itemId) : null

  if (!question || !item) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📝</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる問題がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const restart = (ids = params.ids) => {
    setDeck(pickKanbunQuestions(domain, ids, { size: params.size ?? SESSION_SIZE }))
    setIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setUnknownCount(0)
    setWeakIds([])
    setDone(false)
  }

  const choose = (choiceId) => {
    if (selected !== null) return
    setSelected(choiceId)
    if (choiceId === question.answerId) {
      review(domain, question.itemId, 'correct')
      setCorrectCount((count) => count + 1)
    } else {
      review(domain, question.itemId, choiceId === UNKNOWN_CHOICE_ID ? 'unknown' : 'wrong')
      setWeakIds((ids) => [...new Set([...ids, question.itemId])])
      if (choiceId === UNKNOWN_CHOICE_ID) setUnknownCount((count) => count + 1)
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
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '📕' : '🧭'}</div>
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-rose-700">KANBUN TEST</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{correctCount} / {deck.length} 正解</p>
            <p className="mt-1 text-sm font-bold text-ink/50">正答率 {percentage}%{unknownCount ? `・わからない ${unknownCount}問` : ''}</p>
          </div>
          {weakIds.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('kanbunStudy', { domain, ids: weakIds, title: `間違えた${meta.label}` })}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-left text-rose-900"
            >
              <Book size={20} />
              <span className="min-w-0 flex-1 text-sm font-extrabold">間違えた {weakIds.length}{meta.itemLabel}を覚え直す</span>
              <ArrowRight size={18} />
            </button>
          )}
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(weakIds.length ? weakIds : params.ids)}>もう一度</Button>
            <Button onClick={() => navigate('kanbunCatalog', { domain })}>{meta.label}へ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const answered = selected !== null
  const correctPick = selected === question.answerId
  const saved = savedIds.includes(item.id)
  const level = KANBUN_LEVEL_BY_ID[item.level]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-rose-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label="テストをやめる"><Close size={22} /></IconButton>
          <div className="min-w-0 flex-1">
            <ProgressBar value={index / deck.length} color="#be123c" />
            <p className="mt-1 truncate text-[10px] font-extrabold text-ink/40">{params.title ?? `${meta.label}テスト`}</p>
          </div>
          <SpeechSettingsButton compact />
          <span className="w-12 text-right text-sm font-extrabold text-ink/50">{index + 1}/{deck.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Chip color={level?.color}>{level?.label}</Chip>
              <Chip color={meta.color}>{meta.label}</Chip>
            </div>
            <button
              type="button"
              onClick={() => addSaved(domain, [item.id])}
              disabled={saved}
              className={cx('flex items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-extrabold', saved ? 'bg-amber-100 text-amber-700' : 'bg-paper text-ink/50')}
            >
              {saved ? <BookmarkFilled size={15} /> : <Bookmark size={15} />} {saved ? '登録済み' : '登録'}
            </button>
          </div>

          {question.passage && (
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-950 to-rose-950 p-4 text-white">
              <p className="font-serif text-lg font-bold leading-[1.9]">{question.passage}</p>
              {question.kakikudashi && <p className="mt-2 text-xs font-bold leading-relaxed text-white/60">{question.kakikudashi}</p>}
            </div>
          )}
          <p className="mt-4 text-sm font-extrabold leading-relaxed text-ink/75">{question.prompt}</p>
        </section>

        <div className="mt-4 space-y-2.5">
          {question.choices.map((choice, choiceIndex) => {
            const isCorrect = choice.id === question.answerId
            const isSelected = selected === choice.id
            let tone = 'idle'
            if (answered) {
              if (isCorrect) tone = 'correct'
              else if (isSelected) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                type="button"
                key={choice.id}
                disabled={answered}
                onClick={() => choose(choice.id)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all',
                  tone === 'idle' && 'border-rose-100 bg-white text-ink active:scale-[0.99] active:bg-rose-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-950',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-950',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                  tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold leading-relaxed">{choice.label}</span>
                {tone === 'correct' && <Check size={19} className="mt-0.5 shrink-0 text-emerald-600" />}
                {tone === 'wrong' && <Close size={17} className="mt-0.5 shrink-0 text-rose-500" />}
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
          <section className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Lightbulb size={19} className={correctPick ? 'text-emerald-600' : 'text-rose-600'} />
              <p className={cx('font-display text-lg font-extrabold', correctPick ? 'text-emerald-700' : 'text-rose-700')}>
                {correctPick ? '正解。根拠を固定しよう' : selected === UNKNOWN_CHOICE_ID ? '答えと手掛かりを確認' : 'この違いを覚え直そう'}
              </p>
            </div>
            <ChoiceExplanation question={question} selected={selected} />
            {question.translation && (
              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-extrabold text-slate-500">現代語訳</p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/60">{question.translation}</p>
              </div>
            )}
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-rose-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'}
        </Button>
      </div>
    </div>
  )
}
