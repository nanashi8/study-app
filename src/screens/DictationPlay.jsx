import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDeck } from '../lib/session.js'
import { shuffle } from '../data/vocab.js'
import { speak } from '../lib/tts.js'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, ArrowRight, SpeakerWave, Check, Refresh } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

const norm = (w) => (w || '').toLowerCase().replace(/[^a-z0-9']/g, '')

export function DictationPlayScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)

  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildDeck(params.source ?? { type: 'due' }, {
      srs: useStore.getState().srs,
      size: params.source?.type === 'level' ? 8 : 15,
    }),
  )
  const [i, setI] = useState(0)
  const [placed, setPlaced] = useState([]) // bank の id を並べた配列
  const [result, setResult] = useState(null)
  const results = useRef({ correct: 0, wrong: 0, wrongIds: [] })

  const word = deck[i]
  const target = word?.example?.en ?? word?.word ?? ''
  const targetBlocks = useMemo(() => target.split(/\s+/).filter(Boolean), [target])
  // 単語ブロックをシャッフル（設問ごとに固定）
  const bank = useMemo(
    () => shuffle(targetBlocks.map((w, idx) => ({ id: idx, w }))),
    [word?.id], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const play = (rate) => target && speak(target, { rate: rate ?? settings.ttsRate, voiceURI: settings.ttsVoiceURI })
  useEffect(() => {
    play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, word?.id])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">⌨️</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる英文がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const placedSet = new Set(placed)
  const available = bank.filter((b) => !placedSet.has(b.id))
  const byId = (id) => bank.find((b) => b.id === id)
  const allPlaced = placed.length === targetBlocks.length

  const add = (id) => { if (!result) setPlaced((p) => [...p, id]) }
  const removeAt = (pos) => { if (!result) setPlaced((p) => p.filter((_, k) => k !== pos)) }
  const clearAll = () => { if (!result) setPlaced([]) }

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? 'ディクテーション', mode: 'quiz', engine: 'word', replayScreen: 'dictationPlay',
      total: deck.length, correct: results.current.correct, wrong: results.current.wrong, xpGained,
      reviewIds: results.current.wrongIds.length ? results.current.wrongIds : deck.map((w) => w.id),
      source: params.source,
    })
  }

  const check = () => {
    const perPos = placed.map((id, pos) => norm(byId(id).w) === norm(targetBlocks[pos] ?? ''))
    const okCount = perPos.filter(Boolean).length
    const correct = okCount === targetBlocks.length
    const score = Math.round((okCount / targetBlocks.length) * 100)
    setResult({ perPos, okCount, score, correct })
    review(word.id, correct ? 'correct' : score >= 60 ? 'wrong' : 'unknown')
    if (correct) results.current.correct++
    else { results.current.wrong++; results.current.wrongIds.push(word.id) }
  }

  const next = () => {
    if (i + 1 >= deck.length) finish()
    else { setI(i + 1); setPlaced([]); setResult(null) }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#14b8a6" /></div>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* 再生 */}
        <div className="mt-2 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-teal-400 to-teal-600 p-4 text-white shadow-card">
          <button
            onClick={() => play()}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 active:scale-90 transition-transform"
            aria-label="もう一度聞く"
          >
            <SpeakerWave size={32} />
          </button>
          <div className="flex-1">
            <p className="font-display font-extrabold">音声を聞いて並べよう</p>
            <button onClick={() => play(0.6)} className="mt-1 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold active:bg-white/30">
              🐢 ゆっくり再生
            </button>
          </div>
        </div>

        {/* 解答エリア（並べた単語） */}
        <div className="mt-4 min-h-[4.5rem] rounded-2xl border-2 border-dashed border-brand-200 bg-white/60 p-3">
          {placed.length === 0 ? (
            <p className="flex h-full items-center justify-center py-4 text-sm font-bold text-ink/35">
              下の単語をタップして、聞こえた順に並べてね
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {placed.map((id, pos) => {
                const ok = result?.perPos[pos]
                return (
                  <button
                    key={`${id}-${pos}`}
                    onClick={() => removeAt(pos)}
                    disabled={!!result}
                    className={cx(
                      'rounded-xl px-3 py-2 font-bold shadow-sm transition-all',
                      !result && 'bg-brand-500 text-white active:scale-95',
                      result && ok && 'bg-correct-soft text-emerald-700 ring-2 ring-emerald-400',
                      result && ok === false && 'bg-wrong-soft text-rose-600 ring-2 ring-rose-400',
                    )}
                  >
                    {byId(id).w}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 単語バンク */}
        {!result && (
          <div className="mt-3 flex flex-wrap gap-2">
            {available.map((b) => (
              <button
                key={b.id}
                onClick={() => add(b.id)}
                className="rounded-xl bg-white px-3 py-2 font-bold text-ink shadow-card ring-1 ring-brand-100 active:scale-95 active:bg-brand-50 transition-transform"
              >
                {b.w}
              </button>
            ))}
            {available.length > 0 && placed.length > 0 && (
              <button onClick={clearAll} className="rounded-xl px-3 py-2 text-sm font-extrabold text-ink/40 active:text-ink/60">
                <Refresh size={16} className="inline" /> やりなおす
              </button>
            )}
          </div>
        )}

        {/* 採点結果 */}
        {result && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <p className={cx('font-display text-lg font-extrabold', result.correct ? 'text-emerald-600' : 'text-amber-600')}>
                {result.correct ? '正解！🎉' : `${result.okCount}/${targetBlocks.length} 語が正しい位置`}
              </p>
              <span className="font-display text-2xl font-extrabold" style={{ color: result.correct ? '#10b981' : '#f59e0b' }}>
                {result.score}
              </span>
            </div>
            <div className="mt-2 flex items-start gap-2 border-t border-brand-50 pt-2">
              <span className="mt-0.5 shrink-0 text-emerald-500"><Check size={16} /></span>
              <div>
                <p className="font-bold text-ink">{target}</p>
                <p className="mt-0.5 text-sm font-bold text-ink/55">{word.example?.ja}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!result ? (
          <Button full size="lg" disabled={!allPlaced} onClick={check}>
            答え合わせ{!allPlaced && `（あと${targetBlocks.length - placed.length}語）`}
          </Button>
        ) : (
          <Button full size="lg" onClick={next}>
            {i + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}
