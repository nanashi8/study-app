import { useStore } from '../store/useStore.js'
import { speakWith, stopSpeaking } from '../lib/tts.js'
import { ArrowRight, BookOpen, Lightbulb, SpeakerWave } from './Icons.jsx'
import { cx } from './ui.jsx'

const ROLE_STYLE = {
  LINK: 'border-slate-200 bg-slate-50 text-slate-700',
  S: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  V: 'border-rose-200 bg-rose-50 text-rose-800',
  O: 'border-sky-200 bg-sky-50 text-sky-800',
  O1: 'border-sky-200 bg-sky-50 text-sky-800',
  O2: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  C: 'border-amber-200 bg-amber-50 text-amber-800',
  M: 'border-violet-200 bg-violet-50 text-violet-800',
}

const STATUS_STYLE = {
  'review-needed': {
    label: '確認待ち',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  reviewed: {
    label: '本文見直し済み',
    className: 'border-sky-200 bg-sky-50 text-sky-800',
  },
  confirmed: {
    label: '監査確認済み',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
}

const statusLabel = (item, fallback) => {
  if (item.reviewState === 'rule-review-needed') return '方法確認待ち'
  if (item.reviewState === 'unregistered') return '未登録・確認待ち'
  return fallback
}

export function LongSentenceTranslation({ guide, className = '' }) {
  const settings = useStore((state) => state.settings)
  if (!guide?.steps?.length) return null

  const speakPhraseExplanation = (item) => {
    stopSpeaking()
    speakWith(item.spokenEn ?? item.en, {
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      lang: 'en-US',
      style: 'narration',
      onend: () => {
        speakWith(`前からは、「${item.ja}」と取ります。`, {
          rate: settings.ttsRate,
          voiceURI: settings.ttsJapaneseVoiceURI,
          lang: 'ja-JP',
          style: 'translation',
          onend: () => {
            const explanation = [item.note, item.roleNote]
              .filter(Boolean)
              .join(' ')
            if (!explanation) return
            speakWith(explanation, {
              rate: settings.ttsRate,
              voiceURI: settings.ttsJapaneseVoiceURI,
              lang: 'ja-JP',
              style: 'explanation',
            })
          },
        })
      },
    })
  }

  return (
    <section
      className={`rounded-2xl border border-sky-100 bg-sky-50/60 p-3 ${className}`}
      data-long-sentence-translation
    >
      <div className="flex items-center gap-1.5 text-sky-700">
        <BookOpen size={16} />
        <span className="text-[11px] font-extrabold uppercase tracking-wide">
          フレーズで前から直訳
        </span>
      </div>
      <p className="mt-1 text-xs font-bold leading-relaxed text-sky-950/65">
        英語を戻らず、上から順に意味を足します。
      </p>

      <ol className="mt-3 space-y-2">
        {guide.steps.map((item, index) => (
          <li
            key={`${index}-${item.en}`}
            className="rounded-xl bg-white p-3 ring-1 ring-sky-100"
            data-long-sentence-step
            data-long-sentence-review-state={item.reviewState}
          >
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-extrabold text-sky-700">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-1" data-translation-role>
                  {item.roleParts.map((part) => (
                    <span
                      key={`${part.role}-${part.en}`}
                      className={cx(
                        'border px-1.5 py-0.5 text-[10px] font-black',
                        ROLE_STYLE[part.role] ?? ROLE_STYLE.M,
                      )}
                    >
                      {part.code} {part.en}
                    </span>
                  ))}
                  <span className="text-[10px] font-bold text-ink/45">
                    {item.roleQuestion}
                  </span>
                  {STATUS_STYLE[item.status] && (
                    <span className={cx(
                      'border px-1.5 py-0.5 text-[10px] font-black',
                      STATUS_STYLE[item.status].className,
                    )}>
                      {statusLabel(item, STATUS_STYLE[item.status].label)}
                    </span>
                  )}
                </div>
                <p className="break-words text-sm font-extrabold leading-relaxed text-ink">
                  {item.displayEn}
                </p>
                {item.structureEn && (
                  <p className="mt-0.5 text-[10px] font-bold text-ink/45">
                    音声では原文どおり「{item.spokenEn}」と発音
                  </p>
                )}
                <div className="mt-1 flex items-start gap-1.5 text-brand-700">
                  <ArrowRight size={14} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-extrabold leading-relaxed">{item.ja}</p>
                </div>
                <p className="mt-1.5 border-l-2 border-sky-200 pl-2 text-[11px] font-bold leading-relaxed text-ink/55">
                  {item.note}
                </p>
                <p className="mt-1.5 bg-slate-50 px-2 py-1.5 text-[10px] font-bold leading-relaxed text-ink/50">
                  {item.roleNote}
                </p>
              </div>
              <button
                type="button"
                onClick={() => speakPhraseExplanation(item)}
                aria-label={`${item.spokenEn ?? item.en}を英語、直訳、文法解説の順で再生`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 active:bg-sky-200"
              >
                <SpeakerWave size={17} />
              </button>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-amber-950/75">
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
        <p className="text-xs font-bold leading-relaxed">
          <span className="font-extrabold text-amber-800">読み方：</span>
          {guide.tip}
        </p>
      </div>
    </section>
  )
}
