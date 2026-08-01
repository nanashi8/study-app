import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  choosePreferredVoice,
  getEnglishVoices,
  getJapaneseVoices,
  isTTSSupported,
  speak,
  stopSpeaking,
  subscribeVoices,
  voiceQuality,
  voiceQualityLabel,
} from '../lib/tts.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { SpeakerWave } from './Icons.jsx'

const VOICE_GROUPS = [
  { quality: 'high', label: '高品質音声' },
  { quality: 'standard', label: '標準音声' },
  { quality: 'low', label: '低音質（代替用）' },
]

const RATE_PRESETS = [
  { value: 0.7, label: 'ゆっくり' },
  { value: 0.9, label: '標準' },
  { value: 1.1, label: 'はやめ' },
]

function SettingRow({ title, desc, children, stacked = false }) {
  return (
    <div className={cx('gap-3 py-3', stacked ? 'space-y-2' : 'flex items-center justify-between')}>
      <div className="min-w-0">
        <div className="font-bold text-ink">{title}</div>
        {desc && <div className="text-xs font-bold leading-relaxed text-ink/45">{desc}</div>}
      </div>
      <div className={cx(stacked ? 'w-full' : 'shrink-0')}>{children}</div>
    </div>
  )
}

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cx('relative h-7 w-12 rounded-full transition-colors', on ? 'bg-brand-500' : 'bg-ink/20')}
      aria-label={label}
      aria-pressed={on}
    >
      <span
        className={cx(
          'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
          on ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

function usableSelectedVoiceURI(voices, selectedVoiceURI) {
  const selected = voices.find((voice) => voice.voiceURI === selectedVoiceURI)
  if (!selected) return ''
  const betterVoiceAvailable = voices.some((voice) => voiceQuality(voice) !== 'low')
  if (voiceQuality(selected) === 'low' && betterVoiceAvailable) return ''
  return selectedVoiceURI
}

function voiceStatus(voices, selectedVoiceURI) {
  const choice = choosePreferredVoice(voices, selectedVoiceURI)
  if (!choice.voice) return '音声一覧を取得できないため、端末の既定音声を使います'
  if (choice.quality === 'high') return `使用候補：${choice.voice.name}（高品質）`
  if (choice.quality === 'standard') return `使用候補：${choice.voice.name}（標準）`
  return `高品質・標準音声が使えないため、${choice.voice.name}を代替使用`
}

function VoiceSelect({ voices, value, onChange, label }) {
  const betterVoiceAvailable = voices.some((voice) => voiceQuality(voice) !== 'low')
  const effectiveValue = usableSelectedVoiceURI(voices, value)

  return (
    <select
      aria-label={label}
      value={effectiveValue}
      onChange={(event) => onChange(event.target.value || null)}
      className="w-full rounded-xl bg-white px-3 py-2 text-sm font-bold text-ink ring-1 ring-brand-100"
    >
      <option value="">自動（高品質優先）</option>
      {VOICE_GROUPS.map((group) => {
        const groupedVoices = voices.filter(
          (voice) => voiceQuality(voice) === group.quality,
        )
        if (!groupedVoices.length) return null
        return (
          <optgroup key={group.quality} label={group.label}>
            {groupedVoices.map((voice) => (
              <option
                key={voice.voiceURI}
                value={voice.voiceURI}
                disabled={group.quality === 'low' && betterVoiceAvailable}
              >
                {voice.name}（{voiceQualityLabel(voice)}）
              </option>
            ))}
          </optgroup>
        )
      })}
    </select>
  )
}

function VoiceUpgradeNotice({ voices }) {
  if (!voices.length || voices.some((voice) => voiceQuality(voice) !== 'low')) {
    return null
  }
  return (
    <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-bold leading-relaxed text-amber-800">
      この端末には標準以上の声がありません。端末の音声設定で「拡張」「Premium」「Enhanced」などの高品質音声を追加すると、自動で優先します。
    </p>
  )
}

export function SpeechSettingsPanel({ heading = true }) {
  const settings = useStore((state) => state.settings)
  const setSetting = useStore((state) => state.setSetting)
  const [englishVoices, setEnglishVoices] = useState(getEnglishVoices())
  const [japaneseVoices, setJapaneseVoices] = useState(getJapaneseVoices())

  useEffect(
    () =>
      subscribeVoices(() => {
        setEnglishVoices(getEnglishVoices())
        setJapaneseVoices(getJapaneseVoices())
      }),
    [],
  )

  return (
    <section aria-label="音声・発音設定">
      {heading && (
        <h2 className="pt-3 font-display text-base font-extrabold text-ink/80">
          音声・発音
        </h2>
      )}
      <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
        自動では高品質、標準、低音質の順で選びます。低音質は高品質・標準音声が使えない場合だけ使用します。
      </p>
      <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
        <p className="text-xs font-extrabold text-emerald-800">
          自然な間・抑揚補正：すべての読み上げで有効
        </p>
        <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-emerald-700/75">
          単語・例文・長文・名作・直訳・解説・リスニングを判別し、句読点、引用、文・段落の境界に合わせて調整します。
        </p>
      </div>
      {!isTTSSupported() && (
        <p className="mt-1 text-xs font-bold text-rose-500">
          この端末/ブラウザは音声合成に対応していないようです。
        </p>
      )}

      <div className="divide-y divide-brand-50">
        <SettingRow
          title="読み上げの速さ"
          desc={`現在 ${settings.ttsRate.toFixed(1)}倍。次の再生から反映します。`}
          stacked
        >
          <input
            type="range"
            min="0.5"
            max="1.2"
            step="0.1"
            value={settings.ttsRate}
            onChange={(event) => setSetting('ttsRate', Number(event.target.value))}
            aria-label="読み上げの速さ"
            className="w-full accent-brand-500"
          />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {RATE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setSetting('ttsRate', preset.value)}
                aria-pressed={settings.ttsRate === preset.value}
                className={cx(
                  'rounded-xl px-2 py-2 text-xs font-extrabold transition-colors',
                  settings.ttsRate === preset.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-brand-50 text-brand-700 active:bg-brand-100',
                )}
              >
                {preset.label} {preset.value.toFixed(1)}倍
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow
          title="英語の声"
          desc={voiceStatus(englishVoices, settings.ttsVoiceURI)}
          stacked
        >
          <VoiceSelect
            label="英語の読み上げ音声"
            voices={englishVoices}
            value={settings.ttsVoiceURI}
            onChange={(value) => setSetting('ttsVoiceURI', value)}
          />
          <VoiceUpgradeNotice voices={englishVoices} />
        </SettingRow>

        <SettingRow
          title="日本語の声"
          desc={voiceStatus(japaneseVoices, settings.ttsJapaneseVoiceURI)}
          stacked
        >
          <VoiceSelect
            label="日本語の読み上げ音声"
            voices={japaneseVoices}
            value={settings.ttsJapaneseVoiceURI}
            onChange={(value) => setSetting('ttsJapaneseVoiceURI', value)}
          />
          <VoiceUpgradeNotice voices={japaneseVoices} />
        </SettingRow>

        <SettingRow title="カード表示時に自動で発音" desc="単語カードを開くと自動で読み上げ">
          <Toggle
            label="カード表示時に自動で発音"
            on={settings.autoSpeak}
            onChange={(value) => setSetting('autoSpeak', value)}
          />
        </SettingRow>

        <SettingRow title="発音記号を表示" desc="単語カードに発音記号を出す">
          <Toggle
            label="発音記号を表示"
            on={settings.showPhonetic}
            onChange={(value) => setSetting('showPhonetic', value)}
          />
        </SettingRow>
      </div>

      <div className="grid grid-cols-2 gap-2 pb-3">
        <Button
          variant="soft"
          size="sm"
          onClick={() =>
            speak('After a brief pause, Alice looked up. “Where am I going?” she wondered.', {
              rate: settings.ttsRate,
              voiceURI: settings.ttsVoiceURI,
              style: 'passage',
            })
          }
        >
          <SpeakerWave size={16} /> 英語をテスト
        </Button>
        <Button
          variant="soft"
          size="sm"
          onClick={() =>
            speak('少し間を置いて、アリスは顔を上げました。「ここはどこ？」と、静かにたずねます。', {
              lang: 'ja-JP',
              rate: settings.ttsRate,
              voiceURI: settings.ttsJapaneseVoiceURI,
              style: 'passage',
            })
          }
        >
          <SpeakerWave size={16} /> 日本語をテスト
        </Button>
      </div>
    </section>
  )
}

export function SpeechSettingsButton({
  className = '',
  compact = false,
  inverse = false,
}) {
  const rate = useStore((state) => state.settings.ttsRate)
  const openSpeechSettings = useStore((state) => state.openSpeechSettings)

  return (
    <button
      type="button"
      onClick={openSpeechSettings}
      aria-label={`音声・発音メニューを開く（現在${rate.toFixed(1)}倍）`}
      aria-haspopup="dialog"
      data-speech-settings-trigger
      className={cx(
        'inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full font-extrabold transition-transform active:scale-90',
        compact ? 'w-11' : 'min-w-16 px-2.5',
        inverse
          ? 'bg-white/15 text-white active:bg-white/25'
          : 'bg-brand-50 text-brand-700 active:bg-brand-100',
        className,
      )}
    >
      <SpeakerWave size={compact ? 20 : 18} />
      {!compact && <span className="text-[11px]">{rate.toFixed(1)}倍</span>}
    </button>
  )
}

export function SpeechSettingsSheet() {
  const open = useStore((state) => state.speechSettingsOpen)
  const closeSpeechSettings = useStore((state) => state.closeSpeechSettings)
  const close = () => {
    stopSpeaking()
    closeSpeechSettings()
  }

  return (
    <Sheet open={open} onClose={close} title="音声・発音" maxH="90vh">
      <SpeechSettingsPanel heading={false} />
    </Sheet>
  )
}
