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
    playSpeechItems(phrases?.length ? phrases : [text], {
      index: phraseIndex,
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
