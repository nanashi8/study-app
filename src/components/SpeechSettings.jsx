import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  choosePreferredVoice,
  getEnglishVoices,
  getJapaneseVoices,
  isTTSSupported,
  subscribeVoices,
  voiceQuality,
  voiceQualityLabel,
} from '../lib/tts.js'
import {
  dismissSpeechPlayer,
  playSpeechItems,
} from '../lib/speech-player.js'
import { AFTER_SCHOOL_CHRONICLE } from '../lib/afterSchoolStory.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import {
  BookOpen,
  Chart,
  ChevronLeft,
  ChevronRight,
  Gear,
  Home,
  Menu,
  SpeakerWave,
  Sparkles,
  StarFilled,
} from './Icons.jsx'
import { GameSettingsPanel } from './GameSettings.jsx'
import { PortalSettingsPanel } from './PortalSettings.jsx'

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

const DAILY_GOALS = [10, 20, 30, 50]

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
            playSpeechItems(['After a brief pause, Alice looked up. “Where am I going?” she wondered.'], {
              title: '英語の試聴',
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
            playSpeechItems(['少し間を置いて、アリスは顔を上げました。「ここはどこ？」と、静かにたずねます。'], {
              title: '日本語の試聴',
              lang: 'ja-JP',
              rate: settings.ttsRate,
              japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
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

function LearningSettingsPanel() {
  const settings = useStore((state) => state.settings)
  const setSetting = useStore((state) => state.setSetting)

  return (
    <section aria-label="学習設定">
      <div className="divide-y divide-brand-50">
        <SettingRow
          title="答えを開いたまま見せる"
          desc="覚える・復習・マイ単語で、意味や語源を最初から表示"
        >
          <Toggle
            label="答えを開いたまま見せる"
            on={settings.revealAnswers === true}
            onChange={(value) => setSetting('revealAnswers', value)}
          />
        </SettingRow>
        <SettingRow
          title="1日の目標"
          desc={`現在 ${settings.dailyGoal ?? 20}語`}
          stacked
        >
          <div className="grid grid-cols-4 gap-2">
            {DAILY_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setSetting('dailyGoal', goal)}
                aria-pressed={settings.dailyGoal === goal}
                className={cx(
                  'min-h-11 rounded-xl text-sm font-extrabold transition-colors',
                  settings.dailyGoal === goal
                    ? 'bg-brand-500 text-white'
                    : 'bg-brand-50 text-brand-700',
                )}
              >
                {goal}語
              </button>
            ))}
          </div>
        </SettingRow>
      </div>
    </section>
  )
}

function SettingsSection({ title, desc, children, defaultOpen = false }) {
  return (
    <details
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white"
      data-settings-section={title}
      open={defaultOpen}
    >
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="min-w-0">
          <strong className="block font-display text-base font-extrabold text-ink">{title}</strong>
          <span className="mt-0.5 block text-xs font-bold leading-relaxed text-ink/45">{desc}</span>
        </span>
        <span className="shrink-0 text-lg font-extrabold text-brand-500 transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
      </summary>
      <div className="border-t border-slate-100 px-4 pb-2">{children}</div>
    </details>
  )
}

export function SettingsMenuPanel({ heading = true }) {
  return (
    <section aria-label="設定" data-settings-central-panel>
      {heading && (
        <div className="pt-3">
          <h2 className="font-display text-lg font-extrabold text-ink">設定</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
            保存される学習・音声・ゲーム・コンテンツ設定は、メニュー内のここに集約しています。
          </p>
        </div>
      )}
      <div className={cx('space-y-3', heading ? 'mt-3' : '')}>
        <SettingsSection
          title="学習カード・目標"
          desc="答えの表示方法と1日の学習量"
          defaultOpen
        >
          <LearningSettingsPanel />
        </SettingsSection>
        <SettingsSection
          title="音声・発音"
          desc="速度、英語・日本語の声、自動発音、発音記号"
        >
          <SpeechSettingsPanel heading={false} />
        </SettingsSection>
        <SettingsSection
          title="ゲーム"
          desc="龍脈調査の表示"
        >
          <GameSettingsPanel />
        </SettingsSection>
        <SettingsSection
          title="コンテンツメニュー"
          desc="トップメニューの並び順と表示・非表示"
        >
          <PortalSettingsPanel />
        </SettingsSection>
      </div>
    </section>
  )
}

const APP_MENU_DESTINATIONS = [
  {
    screen: 'portal',
    label: 'スタディトップ',
    desc: '学ぶコンテンツを選ぶ',
    Icon: Home,
  },
  {
    screen: 'home',
    label: '英語ホーム',
    desc: '英語の学習を続ける',
    Icon: BookOpen,
  },
  {
    screen: 'afterSchoolChronicle',
    label: AFTER_SCHOOL_CHRONICLE.title,
    desc: '日常の歪みと五地点を調査',
    Icon: StarFilled,
  },
  {
    screen: 'progress',
    label: '学習記録',
    desc: '成績と進捗コードを確認',
    Icon: Chart,
  },
]

const APP_MENU_EXTRAS = [
  {
    screen: 'storyAlbum',
    label: '思い出アルバム',
    desc: '出会いと龍脈調査のキービジュアル',
    Icon: Sparkles,
  },
]

export function AppMenuPanel({ onNavigate, onOpenSettings }) {
  return (
    <section aria-label="アプリメニュー" data-app-menu-panel>
      <p className="text-xs font-bold leading-relaxed text-ink/50">
        画面移動と設定を一つのメニューにまとめています。
      </p>

      <button
        type="button"
        onClick={onOpenSettings}
        data-menu-settings-entry
        className="mt-3 flex min-h-16 w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 px-4 text-left text-white shadow-lg shadow-brand-200/60 active:scale-[0.99]"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
          <Gear size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block font-display text-base font-extrabold">設定</strong>
          <span className="block truncate text-[10px] font-bold text-white/70">
            学習・音声・龍脈調査・表示
          </span>
        </span>
        <ChevronRight size={20} />
      </button>

      <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        {APP_MENU_DESTINATIONS.map(({ screen, label, desc, Icon }) => (
          <button
            key={screen}
            type="button"
            onClick={() => onNavigate?.(screen)}
            className="flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left active:bg-brand-50"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-sm font-extrabold text-ink">{label}</strong>
              <span className="block truncate text-[10px] font-bold text-ink/45">{desc}</span>
            </span>
            <ChevronRight size={18} className="text-ink/25" />
          </button>
        ))}
      </div>

      <div className="mt-4" data-menu-extras>
        <p className="px-1 text-[10px] font-extrabold tracking-[0.12em] text-ink/40">
          おまけ
        </p>
        <div className="mt-1.5 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/70">
          {APP_MENU_EXTRAS.map(({ screen, label, desc, Icon }) => (
            <button
              key={screen}
              type="button"
              onClick={() => onNavigate?.(screen)}
              data-menu-extra={screen}
              className="flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left active:bg-violet-100"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-violet-600 shadow-sm">
                <Icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-extrabold text-ink">{label}</strong>
                <span className="block truncate text-[10px] font-bold text-ink/45">{desc}</span>
              </span>
              <ChevronRight size={18} className="text-ink/25" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SpeechSettingsButton({
  className = '',
  compact = false,
  inverse = false,
}) {
  const openSpeechSettings = useStore((state) => state.openSpeechSettings)

  return (
    <button
      type="button"
      onClick={openSpeechSettings}
      aria-label="メニューを開く"
      aria-haspopup="dialog"
      data-settings-menu-trigger
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
      <Menu size={compact ? 20 : 18} />
      {!compact && <span className="text-[11px]">メニュー</span>}
    </button>
  )
}

export function SpeechSettingsSheet() {
  const open = useStore((state) => state.speechSettingsOpen)
  const closeSpeechSettings = useStore((state) => state.closeSpeechSettings)
  const navigate = useStore((state) => state.navigate)
  const [view, setView] = useState('menu')

  useEffect(() => {
    if (!open) setView('menu')
  }, [open])

  const close = () => {
    setView('menu')
    dismissSpeechPlayer()
    closeSpeechSettings()
  }
  const openScreen = (screen) => {
    close()
    navigate(screen)
  }

  return (
    <Sheet open={open} onClose={close} title={view === 'settings' ? '設定' : 'メニュー'} maxH="92vh">
      {view === 'settings' ? (
        <>
          <button
            type="button"
            onClick={() => setView('menu')}
            className="mb-3 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-xs font-extrabold text-brand-700 active:bg-brand-50"
          >
            <ChevronLeft size={18} /> メニューへ戻る
          </button>
          <SettingsMenuPanel heading={false} />
        </>
      ) : (
        <AppMenuPanel
          onNavigate={openScreen}
          onOpenSettings={() => setView('settings')}
        />
      )}
    </Sheet>
  )
}

// 既存画面の import 名は互換性のため保ち、
// 新しい画面からは共通メニューとして参照できる別名も公開する。
export const SettingsMenuButton = SpeechSettingsButton
export const SettingsMenuSheet = SpeechSettingsSheet
