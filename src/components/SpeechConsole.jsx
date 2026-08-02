import { useEffect, useSyncExternalStore } from 'react'
import { useStore } from '../store/useStore.js'
import {
  dismissSpeechPlayer,
  getSpeechPlayerServerSnapshot,
  getSpeechPlayerSnapshot,
  nextSpeechItem,
  pauseSpeechPlayer,
  playSpeechPlayer,
  previousSpeechItem,
  setSpeechPlayerRate,
  stopSpeechPlayer,
  subscribeSpeechPlayer,
  updateSpeechPlayerVoices,
} from '../lib/speech-player.js'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Stop,
} from './Icons.jsx'
import { cx } from './ui.jsx'

const RATE_OPTIONS = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2]

const STATUS_LABEL = {
  playing: '再生中',
  paused: '一時停止中',
  stopped: '停止中',
  ended: '再生完了',
}

function ConsoleButton({ label, disabled, onClick, children, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cx(
        'flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-extrabold transition-colors',
        primary
          ? 'bg-brand-600 text-white active:bg-brand-700'
          : 'bg-slate-100 text-ink/70 active:bg-slate-200',
        'disabled:cursor-not-allowed disabled:opacity-35',
      )}
    >
      {children}
      <span>{label}</span>
    </button>
  )
}

/** 全読み上げ導線で共有する、6操作固定の再生コンソール。 */
export function SpeechConsole({ state, onRateChange }) {
  return (
    <section
      aria-label="読み上げコンソール"
      data-speech-console
      className="border-t border-brand-100 bg-white/98 px-3 py-2 shadow-[0_-10px_30px_-22px_rgba(15,23,42,0.6)] backdrop-blur"
    >
      <div className="mb-2 flex min-w-0 items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.12em] text-brand-600">
              {state.title}
            </span>
            <span aria-live="polite" className="text-[10px] font-extrabold text-ink/40">
              {STATUS_LABEL[state.status] ?? '待機中'}
            </span>
          </div>
          <p className="truncate text-xs font-extrabold text-ink">
            {state.itemLabel || '読み上げるフレーズを選んでください'}
          </p>
          {state.segmentLabel && (
            <p className="truncate text-[10px] font-bold text-ink/45">{state.segmentLabel}</p>
          )}
        </div>
        <span className="shrink-0 text-[11px] font-extrabold tabular-nums text-ink/40">
          {state.count ? `${state.index + 1}/${state.count}` : '—'}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5" data-speech-console-controls>
        <ConsoleButton label="前へ" disabled={!state.canPrevious} onClick={previousSpeechItem}>
          <ChevronLeft size={18} />
        </ConsoleButton>
        <ConsoleButton label="再生" disabled={!state.canPlay} onClick={playSpeechPlayer} primary>
          <Play size={18} />
        </ConsoleButton>
        <ConsoleButton label="一時停止" disabled={!state.canPause} onClick={pauseSpeechPlayer}>
          <Pause size={18} />
        </ConsoleButton>
        <ConsoleButton label="次へ" disabled={!state.canNext} onClick={nextSpeechItem}>
          <ChevronRight size={18} />
        </ConsoleButton>
        <ConsoleButton label="停止" disabled={!state.canStop} onClick={() => stopSpeechPlayer()}>
          <Stop size={17} />
        </ConsoleButton>
      </div>

      <label className="mt-2 flex min-h-9 items-center justify-between gap-3 rounded-xl bg-brand-50 px-3 text-xs font-extrabold text-brand-800">
        <span>速度</span>
        <select
          value={state.rate}
          onChange={(event) => onRateChange(Number(event.target.value))}
          aria-label="読み上げ速度"
          className="min-h-8 rounded-lg bg-white px-2 font-extrabold text-brand-800 ring-1 ring-brand-100"
        >
          {RATE_OPTIONS.map((rate) => (
            <option key={rate} value={rate}>{rate.toFixed(1)}倍</option>
          ))}
        </select>
      </label>
    </section>
  )
}

export function GlobalSpeechConsole() {
  const state = useSyncExternalStore(
    subscribeSpeechPlayer,
    getSpeechPlayerSnapshot,
    getSpeechPlayerServerSnapshot,
  )
  const screen = useStore((store) => store.screen)
  const settings = useStore((store) => store.settings)
  const setSetting = useStore((store) => store.setSetting)

  useEffect(() => {
    updateSpeechPlayerVoices({
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
  }, [settings.ttsJapaneseVoiceURI, settings.ttsVoiceURI])

  useEffect(() => () => dismissSpeechPlayer(), [screen])

  if (!state.visible) return null

  const changeRate = (rate) => {
    setSetting('ttsRate', rate)
    setSpeechPlayerRate(rate)
  }

  return <SpeechConsole state={state} onRateChange={changeRate} />
}
