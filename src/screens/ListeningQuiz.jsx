import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDeck } from '../lib/session.js'
import { pickDistractors, shuffle } from '../data/vocab.js'
import { speak, isTTSSupported } from '../lib/tts.js'
import { PosBadge } from '../components/WordBits.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, Check, ArrowRight, SpeakerWave } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

export function ListeningQuizScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)

  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildDeck(params.source ?? { type: 'due' }, {
      srs: useStore.getState().srs,
      size: params.source?.type === 'level' ? 10 : 20,
    }),
  )
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState(null)
  const results = useRef({ correct: 0, wrong: 0, unknown: 0, wrongIds: [] })

  const word = deck[i]
  const options = useMemo(() => {
    if (!word) return []
    return shuffle([word, ...pickDistractors(word, 2)])
  }, [word?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const play = (rate) => word && speak(word.word, { rate: rate ?? settings.ttsRate, voiceURI: settings.ttsVoiceURI })

  // 設問が変わるたび自動再生
  useEffect(() => {
    play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, word?.id])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🎧</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる単語がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const answered = selected !== null

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? 'リスニング', mode: 'quiz', engine: 'word', replayScreen: 'listeningQuiz',
      total: deck.length, correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown, xpGained,
      reviewIds: results.current.wrongIds.length ? results.current.wrongIds : deck.map((w) => w.id),
      source: params.source,
    })
  }

  const choose = (optId) => {
    if (answered) return
    setSelected(optId)
    if (optId === 'unknown') { review(word.id, 'unknown'); results.current.unknown++; results.current.wrongIds.push(word.id) }
    else if (optId === word.id) { review(word.id, 'correct'); results.current.correct++ }
    else { review(word.id, 'wrong'); results.current.wrong++; results.current.wrongIds.push(word.id) }
  }

  const next = () => {
    if (i + 1 >= deck.length) finish()
    else { setI(i + 1); setSelected(null) }
  }

  const isCorrectPick = answered && selected === word.id

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#0ea5e9" /></div>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* 再生カード */}
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-gradient-to-br from-sky-400 to-sky-600 p-6 text-center text-white shadow-card">
          {!isTTSSupported() && <p className="text-sm font-bold">この端末は音声合成に未対応です</p>}
          <button
            onClick={() => play()}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 active:scale-90 transition-transform"
            aria-label="もう一度聞く"
          >
            <SpeakerWave size={48} />
          </button>
          <p className="mt-3 font-display text-lg font-extrabold">タップでもう一度</p>
          <button onClick={() => play(0.6)} className="mt-1 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold active:bg-white/30">
            🐢 ゆっくり再生
          </button>
          {answered && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 animate-pop-in">
              <PosBadge pos={word.pos} className="bg-white/25 text-white" />
              <span className="font-display text-2xl font-extrabold">{word.word}</span>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm font-extrabold text-ink/55">聞こえた単語の意味は？</p>

        <div className="mt-3 space-y-2.5">
          {options.map((o) => {
            const correct = o.id === word.id
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
                <span className="flex-1">{o.meanings?.[0] ?? o.meaning}</span>
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}

          <button
            disabled={answered}
            onClick={() => choose('unknown')}
            className={cx(
              'w-full rounded-2xl border-2 border-dashed px-4 py-3 text-sm font-extrabold transition-all',
              selected === 'unknown' ? 'border-amber-400 bg-hint-soft text-amber-800' : 'border-ink/15 bg-transparent text-ink/45 active:bg-ink/5',
              answered && selected !== 'unknown' && 'opacity-40',
            )}
          >
            わからない🙈
          </button>
        </div>

        {answered && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx('font-display text-lg font-extrabold', isCorrectPick ? 'text-emerald-600' : 'text-rose-500')}>
              {isCorrectPick ? '正解！🎉' : selected === 'unknown' ? '答えはこちら' : 'ざんねん…'}
            </p>
            <p className="mt-1 font-bold text-ink"><span className="font-display">{word.word}</span> ＝ {word.meanings.join('・')}</p>
            <button onClick={() => navigate('wordDetail', { id: word.id })} className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold text-brand-600">
              語源をくわしく見る <ArrowRight size={15} />
            </button>
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
