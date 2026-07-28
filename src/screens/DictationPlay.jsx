import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDictationDeck, DICTATION_PROFILES } from '../data/dictation.js'
import { scoreDictation } from '../lib/dictation.js'
import { isTTSSupported, speak, stopSpeaking } from '../lib/tts.js'
import { Button, Chip, ProgressBar, IconButton, cx } from '../components/ui.jsx'
import { Close, ArrowRight, SpeakerWave, Check } from '../components/Icons.jsx'

const clampRate = (rate) => Math.max(0.55, Math.min(1.25, rate))

export function DictationPlayScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)

  const source = params.source ?? { type: 'level', levelId: '5' }
  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildDictationDeck(source, {
      size: source.type === 'dictationList' ? 0 : 8,
    }),
  )
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [normalPlays, setNormalPlays] = useState(0)
  const [slowPlays, setSlowPlays] = useState(0)
  const results = useRef({ correct: 0, wrong: 0, wrongIds: [] })

  const item = deck[i]
  const profile = DICTATION_PROFILES[item?.level ?? source.levelId] ?? DICTATION_PROFILES['5']
  const userRateScale = (settings.ttsRate ?? 0.9) / 0.9
  const normalRate = clampRate(profile.rate * userRateScale)
  const slowRate = clampRate(profile.slowRate * userRateScale)

  const play = (slow = false) => {
    if (!item) return
    const started = speak(item.text, {
      rate: slow ? slowRate : normalRate,
      voiceURI: settings.ttsVoiceURI,
    })
    if (started) {
      if (slow) setSlowPlays((count) => count + 1)
      else setNormalPlays((count) => count + 1)
    }
  }

  useEffect(() => {
    setNormalPlays(0)
    setSlowPlays(0)
    if (settings.autoSpeak !== false) play()
    return stopSpeaking
    // 設問が変わったときだけ、その級の速度で自動再生する。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, item?.id])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">⌨️</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる英文がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? `英検${profile.label}`,
      mode: 'quiz',
      engine: 'dictation',
      replayScreen: 'dictationPlay',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong,
      xpGained,
      reviewIds: results.current.wrongIds.length
        ? results.current.wrongIds
        : deck.map((question) => question.id),
      source,
    })
  }

  const check = () => {
    if (!answer.trim() || result) return
    const checked = scoreDictation(answer, item.text, { passScore: profile.passScore })
    setResult(checked)
    review(
      item.id,
      checked.passed ? 'correct' : checked.score >= 60 ? 'wrong' : 'unknown',
      'dictation',
    )
    if (checked.passed) {
      results.current.correct++
    } else {
      results.current.wrong++
      results.current.wrongIds.push(item.id)
    }
  }

  const next = () => {
    if (i + 1 >= deck.length) {
      finish()
      return
    }
    setI((current) => current + 1)
    setAnswer('')
    setResult(null)
  }

  const playGoal =
    profile.recommendedPlays === 1 ? '通常速度1回で聞き取る' : `通常速度${profile.recommendedPlays}回以内`
  const targetParts = result?.alignment ?? []

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#14b8a6" /></div>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Chip color="#14b8a6">{profile.label}</Chip>
          <Chip color="#64748b">{item.kind}</Chip>
          <span className="text-xs font-extrabold text-ink/45">{item.wordCount}語・{profile.benchmark}</span>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-teal-400 to-teal-600 p-5 text-white shadow-card">
          {!isTTSSupported() && (
            <p className="mb-3 rounded-xl bg-white/15 px-3 py-2 text-sm font-bold">
              この端末は音声合成に対応していません
            </p>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={() => play(false)}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform active:scale-90"
              aria-label="通常速度でもう一度聞く"
            >
              <SpeakerWave size={40} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-extrabold">英文を書き取ろう</p>
              <p className="mt-1 text-xs font-bold text-white/80">目標：{playGoal}</p>
              <p className="mt-2 text-xs font-extrabold">
                通常 {normalPlays}回
                {slowPlays > 0 && <span className="ml-2 text-white/75">・ゆっくり {slowPlays}回</span>}
              </p>
            </div>
          </div>
          <button
            onClick={() => play(true)}
            className="mt-4 w-full rounded-2xl bg-white/15 px-3 py-2 text-xs font-extrabold transition-colors active:bg-white/25"
          >
            🐢 練習用のゆっくり再生
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
          <label htmlFor="dictation-answer" className="font-display text-sm font-extrabold text-ink">
            聞こえた英文
          </label>
          <textarea
            id="dictation-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') check()
            }}
            disabled={!!result}
            rows={item.wordCount >= 20 ? 5 : 3}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="聞こえたとおりに英語で入力"
            className="mt-2 w-full resize-none rounded-2xl border-2 border-brand-100 bg-paper/60 px-4 py-3 font-medium leading-relaxed text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-teal-400 disabled:opacity-65"
          />
          <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-bold text-ink/40">
            <span>大文字・句読点は採点しません</span>
            <span>{answer.trim() ? `${answer.trim().split(/\s+/).length}語入力` : '⌘/Ctrl + Enter で採点'}</span>
          </div>
        </div>

        {result && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={cx(
                    'font-display text-lg font-extrabold',
                    result.exact ? 'text-emerald-600' : result.passed ? 'text-teal-600' : 'text-amber-600',
                  )}
                >
                  {result.exact ? '完全正解！' : result.passed ? '練習クリア！' : 'もう一度確認しよう'}
                </p>
                <p className="mt-0.5 text-xs font-bold text-ink/45">
                  {result.correctWords}/{result.target.length}語一致・この練習のクリア基準 {profile.passScore}%
                </p>
              </div>
              <span
                className="font-display text-3xl font-extrabold"
                style={{ color: result.passed ? '#0f9f8f' : '#f59e0b' }}
              >
                {result.score}
              </span>
            </div>

            <div className="mt-3 border-t border-brand-50 pt-3">
              <p className="text-[11px] font-extrabold text-ink/40">語ごとの差分</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {targetParts.map((part, index) => {
                  const label =
                    part.status === 'correct'
                      ? part.target
                      : part.status === 'incorrect'
                        ? `${part.answer} → ${part.target}`
                        : part.status === 'missing'
                          ? `＋ ${part.target}`
                          : `− ${part.answer}`
                  return (
                    <span
                      key={`${part.status}-${index}`}
                      className={cx(
                        'rounded-lg px-2 py-1 text-xs font-extrabold',
                        part.status === 'correct' && 'bg-correct-soft text-emerald-700',
                        part.status === 'incorrect' && 'bg-wrong-soft text-rose-700',
                        part.status === 'missing' && 'bg-hint-soft text-amber-800',
                        part.status === 'extra' && 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-50/70 p-3">
              <span className="mt-0.5 shrink-0 text-emerald-500"><Check size={16} /></span>
              <div>
                <p className="font-bold leading-relaxed text-ink">{item.text}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">{item.ja}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Chip color="#0f9f8f">{item.topic}</Chip>
              <Chip color="#6366f1">{item.focus}</Chip>
              <span className="self-center text-[11px] font-bold text-ink/45">
                通常再生 {normalPlays}回{slowPlays ? `・ゆっくり ${slowPlays}回` : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!result ? (
          <Button full size="lg" disabled={!answer.trim()} onClick={check}>
            採点する
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
