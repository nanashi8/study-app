import { useRef, useState, useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDeck } from '../lib/session.js'
import { isRecognitionSupported, startRecognition, scorePronunciation } from '../lib/speech.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Button, ProgressBar, ProgressRing, IconButton } from '../components/ui.jsx'
import { Close, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

const ERR = {
  'not-allowed': 'マイクの使用が許可されていません。ブラウザの設定を確認してください。',
  'no-speech': '音声が聞き取れませんでした。もう一度試してください。',
  'audio-capture': 'マイクが見つかりませんでした。',
  unsupported: 'この端末では音声認識が使えません。',
}

export function PronouncePlayScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)

  const supported = isRecognitionSupported()
  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildDeck(params.source ?? { type: 'due' }, {
      srs: useStore.getState().srs,
      size: params.source?.type === 'level' ? 8 : 15,
    }),
  )
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | recording | scored
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const results = useRef({ good: 0, wrongIds: [] })
  const recRef = useRef(null) // 録音中のコントローラ

  const word = deck[i]
  const target = word?.word ?? ''

  // 画面を離れる/単語が変わるときに録音が残らないよう後始末。
  useEffect(() => () => recRef.current?.abort(), [])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🎤</div>
        <p className="font-display text-lg font-extrabold text-ink">対象の単語がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  // 押した瞬間に録音開始（プッシュトゥトーク）。
  const startRec = () => {
    if (phase === 'recording' || recRef.current) return
    setError('')
    setResult(null)
    setPhase('recording')
    const ctrl = startRecognition({ lang: 'en-US' })
    recRef.current = ctrl
    ctrl.result.then(({ transcript, error: err }) => {
      recRef.current = null
      if (err || !transcript) {
        setPhase('idle')
        setError(ERR[err] || 'うまく認識できませんでした。もう一度試してください。')
        return
      }
      setResult(scorePronunciation(target, transcript))
      setPhase('scored')
    })
  }

  // 指を離したら確定。
  const stopRec = () => {
    if (recRef.current) recRef.current.stop()
  }

  // プッシュトゥトーク：押下で開始、離す/外れる/キャンセルで確定。
  const pttHandlers = {
    onPointerDown: (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      e.preventDefault()
      startRec()
    },
    onPointerUp: stopRec,
    onPointerLeave: stopRec,
    onPointerCancel: stopRec,
    onKeyDown: (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault()
        startRec()
      }
    },
    onKeyUp: (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        stopRec()
      }
    },
    'aria-pressed': phase === 'recording',
    'aria-label': phase === 'recording' ? '録音を終了する' : '押している間、発音を録音する',
  }

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? '発音チェック', mode: 'quiz', engine: 'word', replayScreen: 'pronouncePlay',
      total: deck.length, correct: results.current.good, wrong: deck.length - results.current.good, xpGained,
      reviewIds: results.current.wrongIds.length ? results.current.wrongIds : deck.map((w) => w.id),
      source: params.source,
    })
  }

  const proceed = (score) => {
    review(word.id, score >= 70 ? 'remembered' : 'forgot', 'pronunciation')
    if (score >= 70) results.current.good++
    else results.current.wrongIds.push(word.id)
    if (i + 1 >= deck.length) finish()
    else { setI(i + 1); setPhase('idle'); setResult(null); setError('') }
  }

  const scoreColor = (s) => (s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#f43f5e')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#f43f5e" /></div>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* お手本カード */}
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-card">
          <PosBadge pos={word.pos} className="self-start" />
          <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
          {word.phonetic && <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>}
          <p className="mt-1 text-sm font-bold text-ink/55">{word.meaning}</p>
          <div className="mt-3 flex items-center gap-2">
            <SpeakButton text={word.word} size="lg" />
            <span className="text-xs font-extrabold text-ink/40">お手本を聞く</span>
          </div>
        </div>

        {/* 採点結果 */}
        {result && (
          <div className="mt-4 flex animate-pop-in flex-col items-center rounded-2xl bg-white p-4 shadow-card">
            <ProgressRing value={result.score / 100} size={96} stroke={10} color={scoreColor(result.score)}>
              <span className="font-display text-2xl font-extrabold text-ink">{result.score}</span>
              <span className="text-[9px] font-bold text-ink/40">認識一致度</span>
            </ProgressRing>
            <p className="mt-2 font-display font-extrabold" style={{ color: scoreColor(result.score) }}>
              {result.score >= 80 ? 'はっきり認識されました！🎉' : result.score >= 50 ? 'ほぼ認識されました💪' : 'お手本を聞いてもう一度🔁'}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {result.perWord.map((p, k) => (
                <span key={k} className={cx('rounded-full px-2 py-0.5 text-xs font-bold', p.ok ? 'bg-correct-soft text-emerald-700' : 'bg-wrong-soft text-rose-600')}>
                  {p.word}
                </span>
              ))}
            </div>
            {result.heard && <p className="mt-2 text-xs font-bold text-ink/40">聞こえた音声：{result.heard}</p>}
          </div>
        )}

        {error && <p className="mt-3 rounded-2xl bg-wrong-soft px-4 py-3 text-sm font-bold text-rose-600">{error}</p>}
      </div>

      {/* フッター操作 */}
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {supported ? (
          phase === 'scored' ? (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="lg" className="touch-none" {...pttHandlers}>もう一度話す</Button>
              <Button size="lg" onClick={() => proceed(result.score)}>
                {i + 1 >= deck.length ? '結果へ' : '次へ'} <ArrowRight size={18} />
              </Button>
            </div>
          ) : (
            <Button full size="lg" className="touch-none" variant={phase === 'recording' ? 'danger' : 'primary'} {...pttHandlers}>
              {phase === 'recording' ? '🎤 指をはなすと採点…' : '🎤 押している間だけ話す'}
            </Button>
          )
        ) : (
          <div>
            <p className="mb-2 text-center text-xs font-bold text-ink/45">音声認識は使えません。お手本に近づけたか自己評価しよう。</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="lg" onClick={() => proceed(40)}>むずかしい🤔</Button>
              <Button variant="success" size="lg" onClick={() => proceed(100)}>言えた👍</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
