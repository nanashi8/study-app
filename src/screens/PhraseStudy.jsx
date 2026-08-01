import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildPhraseDeck, recordStudyAnswer } from '../lib/session.js'
import { getLevel } from '../data/levels.js'
import { longSentenceTranslationFor } from '../data/long-sentence-translations.js'
import { speak } from '../lib/tts.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { LongSentenceTranslation } from '../components/LongSentenceTranslation.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, ProgressBar, IconButton, Chip } from '../components/ui.jsx'
import { Close, ArrowRight, Lightbulb, Eye, EyeOff, Link } from '../components/Icons.jsx'

const itemKind = (p) =>
  p.category === 'expression' ? { label: '表現', color: '#0ea5e9' }
  : p.kind === 'syntax' ? { label: '構文', color: '#8b5cf6' }
  : { label: '熟語', color: '#0ea5e9' }

export function PhraseStudyScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)
  const setSetting = useStore((s) => s.setSetting)

  // 暗記モード：ONなら毎カード最初から意味・成り立ちを開いて見せる（単語学習と共通）。
  const revealAll = settings.revealAnswers

  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildPhraseDeck(params.source ?? { type: 'phrase', kind: 'idiom' }, {
      srs: useStore.getState().srs,
      size: params.size ?? 10,
    }),
  )
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  const results = useRef({ remembered: 0, forgot: 0, forgotIds: [] })
  const item = deck[i]

  useEffect(() => {
    if (item && settings.autoSpeak) {
      speak(phraseSpeechText(item), {
        rate: settings.ttsRate,
        voiceURI: settings.ttsVoiceURI,
        style: item.kind === 'syntax' ? 'sentence' : 'phrase',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, item?.id])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">対象の項目がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? '熟語・構文',
      mode: 'study',
      engine: 'phrase',
      total: deck.length,
      correct: results.current.remembered,
      wrong: results.current.forgot,
      xpGained,
      reviewIds: results.current.forgotIds,
      source: params.source,
      size: params.size,
      continueTo: params.continueTo,
    })
  }

  const answer = (remembered) => {
    review(item.id, remembered ? 'remembered' : 'forgot', 'usage')
    results.current = recordStudyAnswer(results.current, item.id, remembered)
    if (i + 1 >= deck.length) finish()
    else {
      setI(i + 1)
      setFlipped(revealAll)
    }
  }

  const level = getLevel(item.level)
  const kind = itemKind(item)
  const longSentenceTranslation = longSentenceTranslationFor(item)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#8b5cf6" /></div>
        {/* 暗記モード：タップせず内容を開いたまま見せる切り替え（再タップで戻せる） */}
        <IconButton
          onClick={() => {
            const next = !revealAll
            setSetting('revealAnswers', next)
            setFlipped(next)
          }}
          className={revealAll ? 'text-violet-500' : 'text-ink/35'}
          aria-label={revealAll ? '内容を隠してタップ式にする' : '内容を開いたまま見せる'}
        >
          {revealAll ? <Eye size={22} /> : <EyeOff size={22} />}
        </IconButton>
        <SpeechSettingsButton compact />
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div key={item.id} onClick={() => setFlipped((f) => !f)} className="animate-pop-in rounded-[2rem] bg-white p-6 shadow-card">
          <div className="flex justify-between">
            <Chip color={level.color}>英検{level.label}</Chip>
            <Chip color={kind.color}>{kind.label}</Chip>
          </div>
          <div className="mt-3 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">{item.phrase}</h2>
            <div className="mt-3"><SpeakButton text={phraseSpeechText(item)} size="lg" /></div>
          </div>

          {!flipped ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 py-8 text-brand-400">
              <span className="text-sm font-extrabold">タップして意味と成り立ちを見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-5 space-y-4 animate-slide-up">
              <div className="rounded-2xl bg-brand-50 p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">意味</div>
                <div className="mt-0.5 font-display text-xl font-extrabold text-ink">{item.meanings.join('・')}</div>
              </div>

              {/* 成り立ち（語源・部品の意味から組み立てる）＝単語の語源にあたる */}
              {item.origin && (
                <div className="rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-100">
                  <div className="mb-1.5 flex items-center gap-1.5 text-violet-600">
                    <Link size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wide">成り立ち</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-violet-900/90">{item.origin}</p>
                </div>
              )}

              <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
                <div className="flex items-start gap-2">
                  <SpeakButton text={item.example.en} size="sm" />
                  <div>
                    <p className="font-bold text-ink">{item.example.en}</p>
                    <p className="mt-0.5 text-sm font-bold text-ink/55">
                      {longSentenceTranslation && <span className="mr-1 text-[11px] text-ink/35">自然な和訳</span>}
                      {item.example.ja}
                    </p>
                  </div>
                </div>
              </div>
              <LongSentenceTranslation guide={longSentenceTranslation} />
              {item.note && (
                <div className="flex gap-2 rounded-2xl bg-hint-soft/70 p-3">
                  <span className="mt-0.5 shrink-0 text-hint"><Lightbulb size={18} /></span>
                  <p className="text-sm font-bold leading-relaxed text-amber-900/90">{item.note}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!flipped ? (
          <Button full size="lg" onClick={() => setFlipped(true)}>意味・成り立ちを見る</Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>まだ🤔</Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>覚えた👍</Button>
          </div>
        )}
      </div>
    </div>
  )
}
