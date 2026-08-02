import { useStore } from '../store/useStore.js'
import { isTTSSupported } from '../lib/tts.js'
import { playSpeechItems } from '../lib/speech-player.js'
import { SpeakerWave } from './Icons.jsx'
import { cx } from './ui.jsx'

const SIZES = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
}
const ICON = { sm: 16, md: 20, lg: 26 }

function visibleSpeechButtons(root) {
  if (!root) return []
  return [...root.querySelectorAll('button[data-speech-text]')]
    .filter((button) => !button.disabled && !button.closest('[hidden]'))
}

/** 英語テキスト読み上げボタン（丸型）。 */
export function SpeakButton({
  text,
  size = 'md',
  rate,
  style = 'auto',
  className = '',
  tone = 'brand',
  disabled = false,
  phrases,
  phraseIndex = 0,
  title = '読み上げ',
  lang = 'en-US',
}) {
  const settings = useStore((s) => s.settings)
  if (!isTTSSupported()) return null
  const handle = (e) => {
    e.stopPropagation()
    if (disabled) return
    const root = e.currentTarget.closest('[data-speech-group], .study-app-content')
    const groupedButtons = phrases?.length ? [] : visibleSpeechButtons(root)
    const currentIndex = groupedButtons.indexOf(e.currentTarget)
    const items = phrases?.length
      ? phrases
      : groupedButtons.length
        ? groupedButtons.map((button) => ({
            text: button.dataset.speechText,
            label: button.dataset.speechText,
            style: button.dataset.speechStyle || 'auto',
            lang: button.dataset.speechLang || 'en-US',
          }))
        : [text]
    playSpeechItems(items, {
      index: phrases?.length
        ? phraseIndex
        : Math.max(0, currentIndex),
      title,
      rate: rate ?? settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      lang,
      style,
    })
  }
  return (
    <button
      onClick={handle}
      disabled={disabled}
      aria-label={`「${text}」を読み上げる`}
      data-speech-text={text}
      data-speech-style={style}
      data-speech-lang={lang}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        'transition-transform active:scale-90 select-none disabled:cursor-not-allowed disabled:opacity-40',
        tone === 'brand'
          ? 'bg-brand-100 text-brand-600 active:bg-brand-200'
          : 'bg-white/20 text-white active:bg-white/30',
        SIZES[size],
        className,
      )}
    >
      <SpeakerWave size={ICON[size]} />
    </button>
  )
}
