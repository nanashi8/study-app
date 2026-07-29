import { useRef, useState, useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDeck } from '../lib/session.js'
import {
  isRecognitionSupported,
  PRONUNCIATION_PASS_SCORE,
  startRecognition,
  scorePronunciation,
} from '../lib/speech.js'
import { stopSpeaking } from '../lib/tts.js'
import { phoneticForWord } from '../data/vocab.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { Button, ProgressBar, ProgressRing, IconButton } from '../components/ui.jsx'
import { Close, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { buildPronunciationInstructorExplanation } from '../lib/instructorExplanations.js'

const ERR = {
  'not-allowed': 'マイクの使用が許可されていません。ブラウザのサイト設定からマイクを許可してください。',
  'service-not-allowed': 'このブラウザでは音声認識サービスを利用できません。',
  'no-speech': '音声が聞き取れませんでした。静かな場所でもう一度試してください。',
  'audio-capture': 'マイクが見つかりませんでした。',
  network: '音声認識サービスに接続できませんでした。通信状態を確認してください。',
  timeout: '録音時間が長すぎたため終了しました。単語を1回だけ話してみてください。',
  busy: 'マイクはすでに使用中です。少し待ってからもう一度試してください。',
  'language-not-supported': '英語の音声認識を利用できません。',
  unsupported: 'この端末では音声認識が使えません。',
}

const FALLBACK_ERRORS = new Set([
  'not-allowed',
  'service-not-allowed',
  'audio-capture',
  'network',
  'language-not-supported',
])

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
  const [phase, setPhase] = useState('idle') // idle | recording | processing | scored
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [manualFallback, setManualFallback] = useState(false)
  const results = useRef({ good: 0, wrongIds: [] })
  const recRef = useRef(null)
  const mountedRef = useRef(true)

  const word = deck[i]
  const target = word?.word ?? ''

  // 画面を離れるときに録音を解放し、遅れて返った結果で画面を更新しない。
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      recRef.current?.abort()
    }
  }, [])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🎤</div>
        <p className="font-display text-lg font-extrabold text-ink">対象の単語がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  // 1回タップで録音開始。無音検知またはもう一度のタップで確定する。
  const startRec = () => {
    if (phase === 'recording' || phase === 'processing' || recRef.current) return
    setError('')
    setResult(null)
    setManualFallback(false)
    setPhase('recording')
    // お手本TTSの残りをマイクが拾って満点になるのを防ぐ。
    stopSpeaking()
    const ctrl = startRecognition({ lang: 'en-US' })
    recRef.current = ctrl
    ctrl.result.then(({ transcript, alternatives, error: recognitionError }) => {
      if (!mountedRef.current || recRef.current !== ctrl) return
      recRef.current = null
      if (recognitionError || !transcript) {
        setPhase('idle')
        setError(ERR[recognitionError] || 'うまく認識できませんでした。もう一度試してください。')
        setManualFallback(FALLBACK_ERRORS.has(recognitionError))
        return
      }
      setResult(scorePronunciation(target, alternatives?.length ? alternatives : transcript, {
        targetPhonetic: word.phonetic,
        phoneticFor: phoneticForWord,
      }))
      setPhase('scored')
    })
  }

  // 録音中にもう一度タップすると、その時点までの音声を確定する。
  const stopRec = () => {
    if (!recRef.current) return
    setPhase('processing')
    recRef.current.stop()
  }

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? '発音チェック', mode: 'quiz', engine: 'word', replayScreen: 'pronouncePlay',
      total: deck.length, correct: results.current.good, wrong: deck.length - results.current.good, xpGained,
      reviewIds: results.current.wrongIds.length ? results.current.wrongIds : deck.map((item) => item.id),
      source: params.source,
    })
  }

  const proceed = (score) => {
    const remembered = score >= PRONUNCIATION_PASS_SCORE
    review(word.id, remembered ? 'remembered' : 'forgot', 'pronunciation')
    if (remembered) results.current.good++
    else results.current.wrongIds.push(word.id)
    if (i + 1 >= deck.length) finish()
    else {
      setI(i + 1)
      setPhase('idle')
      setResult(null)
      setError('')
      setManualFallback(false)
    }
  }

  const scoreColor = (score) =>
    score >= PRONUNCIATION_PASS_SCORE ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#f43f5e" /></div>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-card">
          <PosBadge pos={word.pos} className="self-start" />
          <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
          {word.phonetic && <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>}
          <p className="mt-1 text-sm font-bold text-ink/55">{word.meaning}</p>
          <div className="mt-3 flex items-center gap-2">
            <SpeakButton
              text={word.word}
              size="lg"
              disabled={phase === 'recording' || phase === 'processing'}
            />
            <span className="text-xs font-extrabold text-ink/40">お手本を聞く</span>
          </div>
        </div>

        {result && (
          <div className="mt-4 flex animate-pop-in flex-col items-center rounded-2xl bg-white p-4 shadow-card">
            <ProgressRing value={result.score / 100} size={96} stroke={10} color={scoreColor(result.score)}>
              <span className="font-display text-2xl font-extrabold text-ink">{result.score}</span>
              <span className="text-[9px] font-bold text-ink/40">認識一致度</span>
            </ProgressRing>
            <p className="mt-2 font-display font-extrabold" style={{ color: scoreColor(result.score) }}>
              {result.score >= PRONUNCIATION_PASS_SCORE
                ? 'はっきり認識されました！🎉'
                : result.score >= 50
                  ? 'ほぼ認識されました💪'
                  : 'お手本を聞いてもう一度🔁'}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {result.perWord.map((part, index) => (
                <span
                  key={`${part.word}-${index}`}
                  className={cx(
                    'rounded-full px-2 py-0.5 text-xs font-bold',
                    part.ok ? 'bg-correct-soft text-emerald-700' : 'bg-wrong-soft text-rose-600',
                  )}
                >
                  {part.word}
                </span>
              ))}
            </div>
            {result.heard && (
              <p className="mt-2 text-xs font-bold text-ink/40">認識された候補：{result.heard}</p>
            )}
            {result.matchedBySound && (
              <p className="mt-1 text-xs font-bold text-ink/40">同じ発音の別の綴りも正解として判定しました。</p>
            )}
            <InstructorExplanation
              explanation={buildPronunciationInstructorExplanation(word, result)}
              className="mt-3 w-full text-left"
              compact
            />
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 rounded-2xl bg-wrong-soft px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!supported ? (
          <div>
            <p className="mb-2 text-center text-xs font-bold text-ink/45">
              自動判定は使えません。お手本を聞き、自分の発音を評価して進められます。
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="lg" onClick={() => proceed(40)}>むずかしい🤔</Button>
              <Button variant="success" size="lg" onClick={() => proceed(100)}>言えた👍</Button>
            </div>
          </div>
        ) : manualFallback ? (
          <div>
            <p className="mb-2 text-center text-xs font-bold text-ink/45">
              自動判定を再試行するか、今回は自己評価で進められます。
            </p>
            <Button full variant="secondary" size="sm" className="mb-2" onClick={startRec}>
              🎤 自動判定を再試行
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="lg" onClick={() => proceed(40)}>むずかしい🤔</Button>
              <Button variant="success" size="lg" onClick={() => proceed(100)}>言えた👍</Button>
            </div>
          </div>
        ) : phase === 'scored' ? (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="lg" onClick={startRec}>もう一度録音</Button>
            <Button size="lg" onClick={() => proceed(result.score)}>
              {i + 1 >= deck.length ? '結果へ' : '次へ'} <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <div>
            <p aria-live="polite" className="mb-2 text-center text-xs font-bold text-ink/45">
              {phase === 'recording'
                ? '単語を1回話してください。話し終えると自動で採点します。'
                : phase === 'processing'
                  ? '音声を認識しています…'
                  : 'タップして録音を始め、単語を1回話してください。'}
            </p>
            <Button
              full
              size="lg"
              disabled={phase === 'processing'}
              variant={phase === 'recording' ? 'danger' : 'primary'}
              onClick={phase === 'recording' ? stopRec : startRec}
              aria-pressed={phase === 'recording'}
            >
              {phase === 'recording'
                ? '⏹ 話し終えたらタップ'
                : phase === 'processing'
                  ? '認識中…'
                  : '🎤 タップして録音'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
