import { useEffect, useState, useSyncExternalStore } from 'react'
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
import { VocabMixConsole, vocabMixApplies } from './VocabMixConsole.jsx'
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
        'flex min-h-11 min-w-0 flex-col items-center justify-center gap-px rounded-lg px-0.5 text-[9px] font-extrabold leading-none transition-colors',
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

/** 全読み上げ導線で共有する、6操作固定の再生パネル。 */
export function SpeechConsole({ state, onRateChange }) {
  return (
    <section
      aria-label="読み上げ再生パネル"
      data-speech-console
      className="px-2 py-1.5"
    >
      <div className="mb-1 flex min-w-0 items-center gap-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="max-w-[5.5rem] shrink-0 truncate text-[9px] font-black tracking-[0.08em] text-brand-600">
            {state.title}
          </span>
          <span
            aria-live="polite"
            className="shrink-0 rounded bg-slate-100 px-1 py-0.5 text-[9px] font-extrabold leading-none text-ink/45"
          >
            {STATUS_LABEL[state.status] ?? '待機中'}
          </span>
          <p className="min-w-0 flex-1 truncate text-[11px] font-extrabold leading-tight text-ink">
            {state.itemLabel || 'フレーズを選択'}
            {state.segmentLabel && (
              <span className="ml-1 font-bold text-ink/45">· {state.segmentLabel}</span>
            )}
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-extrabold tabular-nums text-ink/40">
          {state.count ? `${state.index + 1}/${state.count}` : '—'}
        </span>
        <label className="flex h-7 shrink-0 items-center gap-1 rounded-lg bg-brand-50 px-1.5 text-[9px] font-extrabold text-brand-800">
          <span>速度</span>
          <select
            value={state.rate}
            onChange={(event) => onRateChange(Number(event.target.value))}
            aria-label="読み上げ速度"
            className="h-6 rounded-md bg-white px-1 text-[10px] font-extrabold text-brand-800 ring-1 ring-brand-100"
          >
            {RATE_OPTIONS.map((rate) => (
              <option key={rate} value={rate}>{rate.toFixed(1)}倍</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-5 gap-1" data-speech-console-controls>
        <ConsoleButton label="前へ" disabled={!state.canPrevious} onClick={previousSpeechItem}>
          <ChevronLeft size={16} />
        </ConsoleButton>
        <ConsoleButton label="再生" disabled={!state.canPlay} onClick={playSpeechPlayer} primary>
          <Play size={16} />
        </ConsoleButton>
        <ConsoleButton label="一時停止" disabled={!state.canPause} onClick={pauseSpeechPlayer}>
          <Pause size={16} />
        </ConsoleButton>
        <ConsoleButton label="次へ" disabled={!state.canNext} onClick={nextSpeechItem}>
          <ChevronRight size={16} />
        </ConsoleButton>
        <ConsoleButton label="停止" disabled={!state.canStop} onClick={() => stopSpeechPlayer()}>
          <Stop size={15} />
        </ConsoleButton>
      </div>
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
  const params = useStore((store) => store.params)
  const settings = useStore((store) => store.settings)
  const setSetting = useStore((store) => store.setSetting)
  // 画面下部の同じ場所を、読み上げ操作と出題バランスで分け合う。
  // どちらを開いていたかは画面のあいだだけ覚えていればよい一時状態。
  const [panel, setPanel] = useState('speech')

  useEffect(() => {
    updateSpeechPlayerVoices({
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
  }, [settings.ttsJapaneseVoiceURI, settings.ttsVoiceURI])

  useEffect(() => () => dismissSpeechPlayer(), [screen])

  // 読み上げを始めた瞬間は、押した本人が見たい再生操作へ戻す。
  useEffect(() => {
    if (state.visible) setPanel('speech')
  }, [state.visible])

  const mixAvailable = vocabMixApplies(screen, params)
  if (!state.visible && !mixAvailable) return null

  const showing = !mixAvailable || (state.visible && panel === 'speech')
    ? 'speech'
    : 'mix'

  const changeRate = (rate) => {
    setSetting('ttsRate', rate)
    setSpeechPlayerRate(rate)
  }

  return (
    <div
      data-study-dock
      className="shrink-0 border-t border-brand-100 bg-white/98 shadow-[0_-10px_30px_-22px_rgba(15,23,42,0.6)] backdrop-blur"
    >
      {state.visible && mixAvailable && (
        <div className="grid grid-cols-2 gap-1 px-2 pt-1.5" data-study-dock-tabs>
          {[
            { id: 'speech', label: '読み上げ' },
            { id: 'mix', label: '出題バランス' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPanel(tab.id)}
              aria-pressed={showing === tab.id}
              className={cx(
                'min-h-9 rounded-lg text-[10px] font-extrabold transition-colors',
                showing === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-ink/60 active:bg-slate-200',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      {showing === 'speech'
        ? <SpeechConsole state={state} onRateChange={changeRate} />
        : <VocabMixConsole />}
    </div>
  )
}
