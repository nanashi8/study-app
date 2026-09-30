import { useEffect, useState, useSyncExternalStore } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
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
import { SPEECH_RANGES, speechRangeOf } from '../lib/speechRange.js'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Stop,
} from './Icons.jsx'
import { VocabMixConsole, studyMixContext } from './VocabMixConsole.jsx'
import { WordBookSlotConsole, WordBookSlotSheet, useStudyDock } from './WordBookSlot.jsx'
import { studyDockPanels, studyDockShowing } from '../lib/studyDock.js'
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
        // アイコンの下に名前を置き、押せる高さ（44px）のまま1段に収める。左に切り替えが並んでも「一時停止」が切れない幅にする。
        'flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-[10px] font-extrabold leading-none transition-colors',
        primary
          ? 'bg-brand-600 text-white active:bg-brand-700'
          : 'bg-slate-100 text-ink/70 active:bg-slate-200',
        'disabled:cursor-not-allowed disabled:opacity-35',
      )}
    >
      <span className="shrink-0" aria-hidden="true">{children}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

/**
 * 暗記カードで読み上げる範囲（単語のみ／単語・意味／単語・意味・例文・例文の意味）の切り替え。
 * 見出し行に収まるよう、閉じているあいだは「単語のみ」「意味まで」「例文まで」と短く見せ、
 * 開いた一覧では設定と同じ名前で選ぶ。
 */
function SpeechRangeSelect({ range, onChange }) {
  return (
    <label
      className="relative flex h-7 shrink-0 items-center gap-0.5 rounded-lg bg-brand-50 pl-1.5 pr-0.5 text-[9px] font-extrabold text-brand-800 focus-within:ring-2 focus-within:ring-brand-300"
      data-speech-console-range
    >
      <span>範囲</span>
      <span
        aria-hidden="true"
        className="flex h-6 items-center gap-0.5 rounded-md bg-white pl-1 pr-0.5 text-[10px] font-extrabold text-brand-800 ring-1 ring-brand-100"
      >
        {speechRangeOf(range).short}
        <ChevronDown size={10} />
      </span>
      <select
        value={speechRangeOf(range).id}
        onChange={(event) => onChange(event.target.value)}
        aria-label="読み上げる範囲"
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      >
        {SPEECH_RANGES.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

/**
 * 全読み上げ導線で共有する、6操作固定の再生パネル。見出し1行＋操作1行に収める。
 * 英単語・熟語・構文の暗記カードを読んでいるときだけ、見出し行の速度の前に「範囲」も置く。
 * titled は見出し行に読み上げの名前（単語カードなど）を出すか（下部の枠を出題・単語帳と分け合うときは出さない）。
 */
export function SpeechConsole({ state, onRateChange, onRangeChange = null, range = null, titled = true }) {
  return (
    <section
      aria-label="読み上げ再生パネル"
      data-speech-console
      className="px-2 py-1"
    >
      <div className="mb-1 flex h-8 min-w-0 items-center gap-1.5">
        {/* 再生中かどうかは再生・一時停止ボタンの押せる／押せないで見えるので、文字は読み上げにだけ渡す。 */}
        <span aria-live="polite" className="sr-only">
          {STATUS_LABEL[state.status] ?? '待機中'}
        </span>
        <p className="min-w-0 flex-1 truncate text-[11px] font-extrabold leading-tight text-ink">
          {titled && state.title && (
            <span className="mr-1 text-[9px] font-black tracking-[0.08em] text-brand-600">
              {state.title}
            </span>
          )}
          {state.itemLabel || 'フレーズを選択'}
          {state.segmentLabel && (
            <span className="ml-1 font-bold text-ink/45">· {state.segmentLabel}</span>
          )}
        </p>
        <span className="shrink-0 text-[10px] font-extrabold tabular-nums text-ink/40">
          {state.count ? `${state.index + 1}/${state.count}` : '—'}
        </span>
        {state.rangeAdjustable && onRangeChange && (
          <SpeechRangeSelect range={range} onChange={onRangeChange} />
        )}
        <label className="flex h-7 shrink-0 items-center gap-0.5 rounded-lg bg-brand-50 pl-1.5 pr-0.5 text-[9px] font-extrabold text-brand-800">
          <span>速度</span>
          <select
            value={state.rate}
            onChange={(event) => onRateChange(Number(event.target.value))}
            aria-label="読み上げ速度"
            className="h-6 rounded-md bg-white px-0.5 text-[10px] font-extrabold text-brand-800 ring-1 ring-brand-100"
          >
            {RATE_OPTIONS.map((rate) => (
              <option key={rate} value={rate}>{rate.toFixed(1)}倍</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-5 gap-0.5" data-speech-console-controls>
        <ConsoleButton label="前へ" disabled={!state.canPrevious} onClick={previousSpeechItem}>
          <ChevronLeft size={15} />
        </ConsoleButton>
        <ConsoleButton label="再生" disabled={!state.canPlay} onClick={playSpeechPlayer} primary>
          <Play size={14} />
        </ConsoleButton>
        <ConsoleButton label="一時停止" disabled={!state.canPause} onClick={pauseSpeechPlayer}>
          <Pause size={14} />
        </ConsoleButton>
        <ConsoleButton label="次へ" disabled={!state.canNext} onClick={nextSpeechItem}>
          <ChevronRight size={15} />
        </ConsoleButton>
        <ConsoleButton label="停止" disabled={!state.canStop} onClick={() => stopSpeechPlayer()}>
          <Stop size={13} />
        </ConsoleButton>
      </div>
    </section>
  )
}

// 下部の枠の切り替えの名前（左の縦の切り替えに出す名前と、読み上げ名）。
const DOCK_PANELS = Object.freeze({
  speech: Object.freeze({ label: '音声', name: '読み上げ' }),
  mix: Object.freeze({ label: '出題', name: '出題バランス' }),
  book: Object.freeze({ label: '単語帳', name: '単語帳の登録先' }),
})
// 押した結果を見せるために「単語帳」を前に出しておく時間（ミリ秒）。そのあとは元の切り替えに戻す。
const BOOK_NOTICE_MS = 4000

/**
 * 画面下部の枠。読み上げ（再生パネル）・出題（出題バランス）・単語帳（登録先）のうち、いまの画面で使えるものを出す。
 * 2つ以上あれば、左の縦の切り替えで選ぶ（切り替えだけの段は作らない）。どれも見出し1行＋操作1行で、
 * 同じマスに重ねて見えていないものを隠すので、切り替えても枠の高さは上下しない。
 *   読み上げ … 読み上げ列があるとき（英単語・熟語・構文の暗記カードは、カードを出しているあいだずっと）
 *   出題     … 暗記・テストの全30画面（studyMixContext）
 *   単語帳   … 単語帳ボタンが画面に出ているとき。単語帳の設定（登録先を選ぶ窓）もここから開く
 */
export function GlobalSpeechConsole() {
  const state = useSyncExternalStore(
    subscribeSpeechPlayer,
    getSpeechPlayerSnapshot,
    getSpeechPlayerServerSnapshot,
  )
  const dock = useStudyDock()
  const screen = useStore((store) => store.screen)
  const params = useStore((store) => store.params)
  const settings = useContentSettings()
  const setSetting = useStore((store) => store.setSetting)
  // どれを開いていたかは画面のあいだだけ覚えていればよい一時状態。
  const [chosen, setChosen] = useState(null)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    updateSpeechPlayerVoices({
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
  }, [settings.ttsJapaneseVoiceURI, settings.ttsVoiceURI])

  useEffect(() => () => dismissSpeechPlayer(), [screen])

  // 画面を移ったら、前の画面で選んでいた切り替えは忘れる。
  useEffect(() => {
    setChosen(null)
    setFlash(null)
  }, [screen])

  // 読み上げを始めた瞬間は、押した本人が見たい再生操作へ戻す。
  useEffect(() => {
    if (state.visible) setChosen('speech')
  }, [state.visible])

  // 単語帳ボタンを押したら、入れた先と結果を見せるため、少しのあいだ「単語帳」を前に出す。
  useEffect(() => {
    if (!dock.notice) {
      setFlash(null)
      return undefined
    }
    setFlash('book')
    const timer = setTimeout(() => setFlash(null), BOOK_NOTICE_MS)
    return () => clearTimeout(timer)
  }, [dock.notice])

  const mix = studyMixContext(screen, params)
  const panels = studyDockPanels({
    speechVisible: state.visible,
    mixContext: mix,
    wordBookButtons: dock.wordBookButtons,
  })
  const sheet = <WordBookSlotSheet />
  if (!panels.length) return sheet

  const showing = studyDockShowing(panels, { flash, chosen })
  const shared = panels.length > 1

  const changeRate = (rate) => {
    setSetting('ttsRate', rate)
    setSpeechPlayerRate(rate)
  }

  // 範囲はいまの教材の設定を変える。カードの画面が新しい範囲で読み上げ列を作り直し、
  // 読んでいる途中なら、いまの部分を新しい範囲で読み直す（useCardAutoSpeech）。
  const changeRange = (range) => setSetting('speechRange', range)

  const panelFor = (id) => {
    if (id === 'speech') {
      return (
        <SpeechConsole
          state={state}
          onRateChange={changeRate}
          onRangeChange={changeRange}
          range={settings.speechRange}
          titled={!shared}
        />
      )
    }
    if (id === 'mix') return <VocabMixConsole context={mix} titled={!shared} />
    return <WordBookSlotConsole titled={!shared} />
  }

  return (
    <>
      <div
        data-study-dock
        className="flex shrink-0 border-t border-brand-100 bg-white/98 shadow-[0_-10px_30px_-22px_rgba(15,23,42,0.6)] backdrop-blur"
      >
        {shared && (
          // 切り替えは左に縦に並べ、見出し1行＋操作1行の高さの中に収める。
          <div
            role="group"
            aria-label="下部パネルの切り替え"
            data-study-dock-tabs
            className="flex w-10 shrink-0 flex-col gap-0.5 py-1 pl-1"
          >
            {panels.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setChosen(id)
                  setFlash(null)
                }}
                aria-pressed={showing === id}
                aria-label={DOCK_PANELS[id].name}
                data-study-dock-tab={id}
                className={cx(
                  'min-h-0 flex-1 whitespace-nowrap rounded-md text-[9px] font-extrabold leading-none tracking-normal transition-colors',
                  showing === id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-ink/55 active:bg-slate-200',
                )}
              >
                {DOCK_PANELS[id].label}
              </button>
            ))}
          </div>
        )}
        {/* 使えるものを同じマスに重ね、見えていないものは visibility で隠す。 */}
        <div className="grid min-w-0 flex-1" data-study-dock-panels>
          {panels.map((id) => (
            <div
              key={id}
              className={cx('col-start-1 row-start-1 min-w-0', showing !== id && 'invisible')}
              aria-hidden={showing !== id}
              data-study-dock-panel={id}
            >
              {panelFor(id)}
            </div>
          ))}
        </div>
      </div>
      {sheet}
    </>
  )
}
