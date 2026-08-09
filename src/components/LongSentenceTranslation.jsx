import { useStore } from '../store/useStore.js'
import { playSpeechItems } from '../lib/speech-player.js'
import { japanesePhraseSpeechText } from '../lib/phrase-speech.js'
import { ArrowRight, Lightbulb, SpeakerWave } from './Icons.jsx'
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

export function LongSentenceTranslation({ guide, className = '' }) {
  const settings = useStore((state) => state.settings)
  const phraseSteps = guide?.meaningSteps?.length ? guide.meaningSteps : guide?.steps
  if (!phraseSteps?.length) return null

  const speechItems = phraseSteps.map((item, index) => {
    const explanation = [item.note, item.roleNote]
      .filter(Boolean)
      .join(' ')
    return {
      id: `${index}-${item.en}`,
      label: item.displayEn ?? item.en,
      segments: [
        {
          text: item.spokenEn ?? item.en,
          label: '英語フレーズ',
          lang: 'en-US',
          style: 'narration',
        },
        {
          text: `前からは、「${japanesePhraseSpeechText(item.ja)}」と取ります。`,
          label: '対応する日本語',
          lang: 'ja-JP',
          style: 'translation',
        },
        ...(explanation
          ? [{
              text: explanation,
              label: '読み方・文法解説',
              lang: 'ja-JP',
              style: 'explanation',
            }]
          : []),
      ],
    }
  })

  const speakPhraseExplanation = (index) => {
    playSpeechItems(speechItems, {
      index,
      title: 'フレーズ解説',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
  }

  return (
    <section
      className={`rounded-2xl border border-sky-100 bg-sky-50/60 p-3 ${className}`}
      data-long-sentence-translation
    >
      <p className="text-xs font-bold leading-relaxed text-sky-950/65">
        英語を発音できて意味が通るまとまりで読み、上から順に意味を足します。SVOCMは各フレーズ内部の構造を示します。
      </p>

      <ol className="mt-3 space-y-2">
        {phraseSteps.map((item, index) => (
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
                onClick={() => speakPhraseExplanation(index)}
                aria-label={`${item.spokenEn ?? item.en}を英語、対応する日本語、文法解説の順で再生`}
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
