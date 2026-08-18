import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
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
import { Sheet } from './Sheet.jsx'
import { SESSION_SIZE_ALL, SESSION_SIZE_OPTIONS } from './SessionSize.jsx'
import { Button, cx } from './ui.jsx'
import {
  Book,
  BookOpen,
  Bookmark,
  Chart,
  Check,
  ChevronLeft,
  ChevronRight,
  Gear,
  Headphones,
  Home,
  Keyboard,
  Lightbulb,
  Link,
  MathRoot,
  Menu,
  Refresh,
  Search,
  SpeakerWave,
  Sparkles,
  Trophy,
} from './Icons.jsx'
import { PortalSettingsPanel } from './PortalSettings.jsx'
import { ProgressBackupPanel } from './ProgressBackup.jsx'
import { requiresProgressSaveConfirmation } from '../lib/navigationPolicy.js'
import { overallProgress } from '../lib/session.js'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import { LearningAnalyticsPanel } from './LearningAnalytics.jsx'
import {
  LearningAdvisorPanel,
} from './LearningAdvisor.jsx'
import {
  APP_MENU_SECTIONS,
} from '../lib/appMenu.js'
import { resetProgressEverywhere } from '../lib/cloudSync.js'
import {
  ALL_PROGRESS_RESET_GROUP_IDS,
  PROGRESS_RESET_GROUPS,
  normalizeProgressResetGroupIds,
} from '../lib/progressReset.js'

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
// 1回の学習・クイズで出す問題数（学習中は進捗表示のタップでも変えられる）。
// 並びは学習画面の選択肢と同じものを使う。「全部」はその教材の在庫すべて。
const SESSION_SIZES = [...SESSION_SIZE_OPTIONS, SESSION_SIZE_ALL]

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
          desc="英単語・古文単語・熟語・文法・古典常識・漢文のカードで、意味や答えを最初から表示。カード画面の「意味」「答え」ボタンでも切り替えられます"
        >
          <Toggle
            label="答えを開いたまま見せる"
            on={settings.revealAnswers === true}
            onChange={(value) => setSetting('revealAnswers', value)}
          />
        </SettingRow>
        <SettingRow
          title="1回の問題数"
          desc={`現在 ${settings.sessionSize === SESSION_SIZE_ALL ? '全部' : `${settings.sessionSize ?? 10}問`}・学習中は「1/10」の表示をタップしても変更できます`}
          stacked
        >
          <div className="grid grid-cols-4 gap-2">
            {SESSION_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSetting('sessionSize', size)}
                aria-pressed={settings.sessionSize === size}
                className={cx(
                  'min-h-11 rounded-xl text-sm font-extrabold transition-colors',
                  settings.sessionSize === size
                    ? 'bg-brand-500 text-white'
                    : 'bg-brand-50 text-brand-700',
                )}
              >
                {size === SESSION_SIZE_ALL ? '全部' : `${size}問`}
              </button>
            ))}
          </div>
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
            保存される学習・音声・表示設定を、ここで変更できます。
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
          title="ホームの表示"
          desc="スタディアプリ ホームの並び順と表示・非表示"
        >
          <PortalSettingsPanel />
        </SettingsSection>
      </div>
    </section>
  )
}

const MENU_ITEM_ICONS = {
  portal: Home,
  mathMap: MathRoot,
  vocabSearch: Search,
  kotenList: Book,
  kanbunHome: BookOpen,
  literatureLibrary: BookOpen,
  home: BookOpen,
  vocabLevels: Book,
  readingList: BookOpen,
  phrases: Sparkles,
  grammar: Lightbulb,
  listening: Headphones,
  diagnostic: Trophy,
  writing: Book,
  dictation: Keyboard,
  roots: Link,
  vocabCamera: Search,
  wordRequests: Link,
  myList: Bookmark,
  myLearning: Bookmark,
  myGrammar: Lightbulb,
  kotenSaved: Book,
  kanbunSaved: BookOpen,
  progress: Chart,
  advisor: Sparkles,
  analytics: Chart,
  settings: Gear,
  account: Home,
  reset: Refresh,
}

function MenuDestinationList({
  items,
  onNavigate,
  onAction,
  account,
  authStatus,
  tone = 'brand',
}) {
  const colors = tone === 'violet'
    ? 'bg-violet-50 text-violet-600'
    : 'bg-brand-50 text-brand-600'
  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {items.map((item) => {
        const key = item.kind === 'screen' ? item.screen : item.action
        const Icon = MENU_ITEM_ICONS[key] ?? Book
        const isAccount = item.action === 'account'
        const label = isAccount
          ? account ? 'アカウント' : 'ログイン・保存'
          : item.label
        const description = isAccount
          ? account?.email ?? (authStatus === 'out' ? '任意でクラウド保存' : 'ゲストで端末保存中')
          : item.description
        const danger = item.tone === 'danger'
        return (
          <button
            key={`${item.kind}-${key}`}
            type="button"
            onClick={() => (
              item.kind === 'screen'
                ? onNavigate?.(item.screen, item.params ?? {})
                : onAction?.(item.action)
            )}
            className={cx(
              'flex min-h-12 w-full items-center gap-2.5 px-3 py-2 text-left',
              danger ? 'active:bg-rose-50' : 'active:bg-brand-50',
            )}
            data-menu-destination={item.kind === 'screen' ? item.screen : undefined}
            data-menu-action={item.kind === 'action' ? item.action : undefined}
            data-menu-settings-entry={item.action === 'settings' ? '' : undefined}
            data-menu-account-entry={item.action === 'account' ? '' : undefined}
            data-menu-reset-entry={item.action === 'reset' ? '' : undefined}
            data-menu-advisor-entry={item.action === 'advisor' ? '' : undefined}
            data-menu-retention-entry={item.action === 'analytics' ? '' : undefined}
            data-menu-item
          >
            <span className={cx(
              'grid h-8 w-8 shrink-0 place-items-center rounded-lg',
              danger ? 'bg-rose-50 text-rose-600' : colors,
            )}
            >
              <Icon size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className={cx('block text-sm font-extrabold leading-tight', danger ? 'text-rose-700' : 'text-ink')}>
                {label}
              </strong>
              <span className={cx(
                'mt-0.5 block text-[11px] font-bold leading-snug',
                danger ? 'text-rose-600/70' : 'text-ink/45',
              )}
              >
                {description}
              </span>
            </span>
            <ChevronRight size={18} className={cx('shrink-0', danger ? 'text-rose-300' : 'text-ink/25')} />
          </button>
        )
      })}
    </div>
  )
}

export function AppMenuPanel({
  account,
  authStatus,
  onNavigate,
  onAction,
}) {
  return (
    <section aria-label="メニュー" data-app-menu-panel>
      <nav className="space-y-4" aria-label="メニュー項目" data-menu-section-list>
        {APP_MENU_SECTIONS.map((menuSection) => (
          <section key={menuSection.id} aria-labelledby={`menu-section-${menuSection.id}`} data-menu-section={menuSection.id}>
            <h2
              id={`menu-section-${menuSection.id}`}
              className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65"
            >
              {menuSection.label}
            </h2>
            <MenuDestinationList
              items={menuSection.items}
              onNavigate={onNavigate}
              onAction={onAction}
              account={account}
              authStatus={authStatus}
              tone={menuSection.id === 'english' || menuSection.id === 'support' ? 'violet' : 'brand'}
            />
          </section>
        ))}
      </nav>
    </section>
  )
}

export function SpeechSettingsButton({
  className = '',
  compact = false,
  inverse = false,
  label = 'メニュー',
}) {
  const openSpeechSettings = useStore((state) => state.openSpeechSettings)

  return (
    <button
      type="button"
      onClick={() => openSpeechSettings()}
      aria-label={`${label}を開く`}
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
      {!compact && <span className="text-[11px]">{label}</span>}
    </button>
  )
}

function MenuBackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-xs font-extrabold text-brand-700 active:bg-brand-50"
    >
      <ChevronLeft size={18} /> メニューへ戻る
    </button>
  )
}

function ResetProgressPanel({
  selectedGroupIds,
  onSelectionChange,
  onBackup,
  onReset,
  onCancel,
  busy = false,
}) {
  const selectAllRef = useRef(null)
  const selected = new Set(normalizeProgressResetGroupIds(selectedGroupIds))
  const allSelected = selected.size === PROGRESS_RESET_GROUPS.length
  const someSelected = selected.size > 0

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected
    }
  }, [allSelected, someSelected])

  const toggleGroup = (groupId) => {
    const next = new Set(selected)
    if (next.has(groupId)) next.delete(groupId)
    else next.add(groupId)
    onSelectionChange(normalizeProgressResetGroupIds([...next]))
  }

  return (
    <section className="space-y-3" data-menu-reset-confirmation>
      <p className="text-xs font-bold leading-relaxed text-slate-600">
        ブラウザの履歴削除と同じように、すべて、または必要な項目だけを選べます。
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" data-reset-selection-list>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
          <input
            ref={selectAllRef}
            type="checkbox"
            checked={allSelected}
            onChange={() => onSelectionChange(
              allSelected ? [] : [...ALL_PROGRESS_RESET_GROUP_IDS],
            )}
            className="h-5 w-5 shrink-0 accent-brand-600"
            data-reset-select-all
          />
          <span className="text-sm font-extrabold text-slate-800">すべて選択</span>
          <span className="ml-auto text-[11px] font-bold text-slate-500">
            {selected.size}/{PROGRESS_RESET_GROUPS.length}
          </span>
        </label>

        <div className="divide-y divide-slate-100">
          {PROGRESS_RESET_GROUPS.map((group) => (
            <label
              key={group.id}
              className="flex min-h-14 cursor-pointer items-start gap-3 px-3 py-2.5"
              data-reset-group={group.id}
            >
              <input
                type="checkbox"
                checked={selected.has(group.id)}
                onChange={() => toggleGroup(group.id)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-brand-600"
                aria-label={`${group.label}を選択`}
              />
              <span className="min-w-0 flex-1">
                <strong className="block text-sm font-extrabold text-slate-800">{group.label}</strong>
                <span className="mt-0.5 block text-[11px] font-bold leading-snug text-slate-500">
                  {group.description}
                </span>
                {group.implies.length > 0 && (
                  <span className="mt-1 block text-[10px] font-bold leading-snug text-amber-700">
                    ※ この履歴から作られる「
                    {group.implies
                      .map((id) => PROGRESS_RESET_GROUPS.find((item) => item.id === id)?.label ?? id)
                      .join('・')}
                    」も一緒にリセットします（数値の食い違いを防ぐため）
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      <p className="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-emerald-800" data-reset-preserved-data>
        音声・カード設定と、スタディアプリ ホームの表示設定は選択にかかわらず残ります。
      </p>
      <Button full variant="secondary" onClick={onBackup}>
        リセット前にQR・コードを保存
      </Button>
      <Button full variant="danger" onClick={onReset} disabled={busy || !someSelected}>
        <Refresh size={18} /> {busy
          ? 'リセットしています…'
          : someSelected
            ? `選択した${selected.size}項目をリセット`
            : 'リセットする項目を選んでください'}
      </Button>
      <Button full variant="ghost" onClick={onCancel} disabled={busy}>キャンセル</Button>
    </section>
  )
}

function ResetCompletePanel({ status, resetGroupIds, onRetry, onHome, onMenu }) {
  const syncing = status === 'syncing'
  const cloudError = status === 'cloud-error'
  const resetGroups = PROGRESS_RESET_GROUPS.filter((group) => resetGroupIds.includes(group.id))
  const resetAll = resetGroups.length === PROGRESS_RESET_GROUPS.length
  return (
    <section className="space-y-4" data-menu-reset-complete>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white">
            <Check size={22} />
          </span>
          <h2 className="font-display text-lg font-extrabold">
            {resetAll ? 'すべての学習履歴をリセットしました' : '選択した学習履歴をリセットしました'}
          </h2>
        </div>
        <ul className="mt-3 space-y-1 text-xs font-bold text-emerald-800/80" data-reset-completed-groups>
          {resetGroups.map((group) => <li key={group.id}>・{group.label}</li>)}
        </ul>
      </div>

      {syncing ? (
        <p className="rounded-xl bg-brand-50 px-3 py-2.5 text-xs font-bold text-brand-700" role="status">
          端末への保存は完了しました。クラウドへ反映しています…
        </p>
      ) : cloudError ? (
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
          <p className="text-xs font-bold leading-relaxed text-amber-800" role="alert">
            端末の履歴は消去済みですが、クラウド保存を確認できませんでした。古い履歴が戻らないよう、通信を確認して再試行してください。
          </p>
          <Button full size="sm" variant="hint" onClick={onRetry}>クラウド保存を再試行</Button>
        </div>
      ) : (
        <p className="rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-bold leading-relaxed text-slate-600" role="status">
          {status === 'device-and-cloud'
            ? 'この端末とクラウドの初期化を確認しました。'
            : 'この端末の初期化を確認しました。'}
          音声・カード設定とホームの表示設定は保持されています。
        </p>
      )}

      <Button full onClick={onHome} disabled={syncing || cloudError}>スタディアプリ ホームへ</Button>
      <Button full variant="ghost" onClick={onMenu} disabled={syncing}>メニューへ戻る</Button>
    </section>
  )
}

function AccountPanel({ account, authStatus, onLogin, onSignOut }) {
  if (account) {
    return (
      <section className="space-y-3" data-menu-account-panel>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-extrabold text-brand-600">ログイン中</p>
          <p className="mt-1 break-all font-display text-base font-extrabold text-ink">{account.email}</p>
          <p className="mt-2 text-xs font-bold leading-relaxed text-ink/50">
            学習状況はクラウドへ自動保存され、同じIDで別端末から続けられます。
          </p>
        </div>
        <Button full variant="danger" onClick={onSignOut}>ログアウト</Button>
        <p className="text-xs font-bold leading-relaxed text-ink/45">
          ログアウトすると共有端末保護のため、この端末の学習状況を初期化します。クラウドの記録は残ります。
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-3" data-menu-account-panel>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="font-display text-lg font-extrabold text-ink">ゲストで学習中</p>
        <p className="mt-2 text-xs font-bold leading-relaxed text-ink/50">
          この端末には自動保存されています。QR・コードならログインなしでも持ち運べます。
        </p>
      </div>
      {authStatus === 'out' && (
        <Button full onClick={onLogin}>ログインしてクラウド保存を使う</Button>
      )}
    </section>
  )
}

export function SpeechSettingsSheet() {
  const open = useStore((state) => state.speechSettingsOpen)
  const menuRequest = useStore((state) => state.speechSettingsRequest)
  const closeSpeechSettings = useStore((state) => state.closeSpeechSettings)
  const navigate = useStore((state) => state.navigate)
  const globalBack = useStore((state) => state.globalBack)
  const goPortal = useStore((state) => state.goPortal)
  const currentScreen = useStore((state) => state.screen)
  const learningState = useStore(useShallow((state) => ({
    srs: state.srs,
    etymologySrs: state.etymologySrs,
    kotenSrs: state.kotenSrs,
    kotenGrammarSrs: state.kotenGrammarSrs,
    kotenCultureSrs: state.kotenCultureSrs,
    kotenInterpretationSrs: state.kotenInterpretationSrs,
    kanbunVocabSrs: state.kanbunVocabSrs,
    kanbunGrammarSrs: state.kanbunGrammarSrs,
    kanbunCultureSrs: state.kanbunCultureSrs,
    kanbunKundokuSrs: state.kanbunKundokuSrs,
    skillStats: state.skillStats,
    learningAnalytics: state.learningAnalytics,
    diagnosticHistory: state.diagnosticHistory,
    stats: state.stats,
  })))
  const account = useAuth((state) => state.user)
  const authStatus = useAuth((state) => state.status)
  const signOutNow = useAuth((state) => state.signOutNow)
  const [view, setView] = useState('menu')
  const [pendingNavigation, setPendingNavigation] = useState(null)
  const [resetStatus, setResetStatus] = useState('idle')
  const [resetGroupIds, setResetGroupIds] = useState([
    ...ALL_PROGRESS_RESET_GROUP_IDS,
  ])

  const dueCount = overallProgress(learningState.srs).due
  const profile = useMemo(
    () => buildLearningPowerProfile({
      learningAnalytics: learningState.learningAnalytics,
      srsStores: [
        learningState.srs,
        learningState.etymologySrs,
        learningState.kotenSrs,
        learningState.kotenGrammarSrs,
        learningState.kotenCultureSrs,
        learningState.kotenInterpretationSrs,
        learningState.kanbunVocabSrs,
        learningState.kanbunGrammarSrs,
        learningState.kanbunCultureSrs,
        learningState.kanbunKundokuSrs,
      ],
      skillStats: learningState.skillStats,
      diagnosticHistory: learningState.diagnosticHistory,
      stats: learningState.stats,
      dueCount,
    }),
    [learningState, dueCount],
  )

  useEffect(() => {
    if (!open) {
      setView('menu')
      setPendingNavigation(null)
      setResetStatus('idle')
      setResetGroupIds([...ALL_PROGRESS_RESET_GROUP_IDS])
      return
    }
    if (menuRequest === 'back') {
      setPendingNavigation({ type: 'back' })
      setView('save-progress')
    } else if (menuRequest?.type === 'navigate' && menuRequest.screen) {
      setPendingNavigation({
        type: 'screen',
        screen: menuRequest.screen,
        params: menuRequest.params ?? {},
      })
      setView('save-progress')
    } else {
      setView('menu')
    }
  }, [open, menuRequest])

  const close = () => {
    setView('menu')
    setResetStatus('idle')
    setResetGroupIds([...ALL_PROGRESS_RESET_GROUP_IDS])
    dismissSpeechPlayer()
    closeSpeechSettings()
  }
  const performNavigation = (destination) => {
    if (!destination) return
    close()
    if (destination.type === 'back') globalBack()
    else if (destination.screen === 'portal') goPortal()
    else navigate(destination.screen, destination.params ?? {})
  }
  const openScreen = (screen, params = {}) => {
    const destination = { type: 'screen', screen, params }
    if (requiresProgressSaveConfirmation(currentScreen, screen)) {
      setPendingNavigation(destination)
      setView('save-progress')
      return
    }
    performNavigation(destination)
  }
  const confirmReset = async () => {
    const selectedGroups = normalizeProgressResetGroupIds(resetGroupIds)
    if (resetStatus === 'syncing' || !selectedGroups.length) return
    setResetGroupIds(selectedGroups)
    setResetStatus('syncing')
    setView('reset-complete')
    try {
      const result = await resetProgressEverywhere(account, selectedGroups)
      setResetStatus(result.scope)
    } catch {
      setResetStatus('cloud-error')
    }
  }
  const retryResetCloudSave = async () => {
    if (!account || resetStatus === 'syncing') return
    setResetStatus('syncing')
    try {
      const result = await resetProgressEverywhere(account, resetGroupIds)
      setResetStatus(result.scope)
    } catch {
      setResetStatus('cloud-error')
    }
  }
  const signOutAndClose = async () => {
    await signOutNow()
    close()
    goPortal()
  }

  const pendingLabel = pendingNavigation?.type === 'back'
    ? '前の画面'
    : pendingNavigation?.screen === 'portal'
      ? 'スタディアプリ ホーム'
      : '選んだ画面'

  const sheetTitles = {
    menu: 'メニュー',
    settings: '設定',
    advisor: '学習アドバイザー',
    analytics: '定着・学習効率の分析',
    reset: '学習履歴のリセット',
    'reset-complete': 'リセット完了',
    'backup-reset': 'リセット前のバックアップ',
    account: account ? 'アカウント' : 'ログイン・保存',
    'save-progress': pendingNavigation?.type === 'back'
      ? '戻りますか？'
      : '途中の進捗を保存しますか？',
  }
  const sheetTitle = sheetTitles[view] ?? 'メニュー'

  return (
    <Sheet open={open} onClose={close} title={sheetTitle} maxH="92vh">
      {view === 'settings' ? (
        <>
          <MenuBackButton onClick={() => setView('menu')} />
          <SettingsMenuPanel heading={false} />
        </>
      ) : view === 'advisor' ? (
        <>
          <MenuBackButton onClick={() => setView('menu')} />
          <LearningAdvisorPanel
            profile={profile}
            onStart={openScreen}
            onOpenAnalysis={() => setView('analytics')}
          />
        </>
      ) : view === 'analytics' ? (
        <>
          <MenuBackButton onClick={() => setView('menu')} />
          <LearningAnalyticsPanel
            learningAnalytics={learningState.learningAnalytics}
            srs={learningState.srs}
            etymologySrs={learningState.etymologySrs}
            kotenSrs={learningState.kotenSrs}
            kotenGrammarSrs={learningState.kotenGrammarSrs}
            kotenCultureSrs={learningState.kotenCultureSrs}
            kotenInterpretationSrs={learningState.kotenInterpretationSrs}
            kanbunVocabSrs={learningState.kanbunVocabSrs}
            kanbunGrammarSrs={learningState.kanbunGrammarSrs}
            kanbunCultureSrs={learningState.kanbunCultureSrs}
            kanbunKundokuSrs={learningState.kanbunKundokuSrs}
            skillStats={learningState.skillStats}
            diagnosticHistory={learningState.diagnosticHistory}
            stats={learningState.stats}
            dueCount={dueCount}
            onOpenDiagnostic={() => openScreen('diagnostic')}
            onNavigate={openScreen}
          />
        </>
      ) : view === 'reset' ? (
        <>
          <MenuBackButton onClick={() => setView('menu')} />
          <ResetProgressPanel
            selectedGroupIds={resetGroupIds}
            onSelectionChange={setResetGroupIds}
            onBackup={() => setView('backup-reset')}
            onReset={confirmReset}
            onCancel={() => setView('menu')}
            busy={resetStatus === 'syncing'}
          />
        </>
      ) : view === 'reset-complete' ? (
        <ResetCompletePanel
          status={resetStatus}
          resetGroupIds={resetGroupIds}
          onRetry={retryResetCloudSave}
          onHome={() => {
            close()
            goPortal()
          }}
          onMenu={() => setView('menu')}
        />
      ) : view === 'backup-reset' ? (
        <>
          <MenuBackButton onClick={() => setView('reset')} />
          <ProgressBackupPanel
            onContinue={() => setView('reset')}
            continueLabel="保存を終えてリセット確認へ"
          />
        </>
      ) : view === 'account' ? (
        <>
          <MenuBackButton onClick={() => setView('menu')} />
          <AccountPanel
            account={account}
            authStatus={authStatus}
            onLogin={() => openScreen('login')}
            onSignOut={signOutAndClose}
          />
        </>
      ) : view === 'save-progress' ? (
        <div data-progress-save-confirmation>
          {pendingNavigation?.type === 'back' ? (
            <div data-progress-discard-confirmation>
              <p className="mb-3 rounded-2xl bg-rose-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-rose-800">
                途中で戻るボタンを押した場合は、進捗は破棄されます。戻りますか？
              </p>
              <div className="grid gap-2">
                <Button full onClick={() => performNavigation(pendingNavigation)}>
                  戻る
                </Button>
                <Button full variant="ghost" onClick={close}>
                  続ける
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-3 rounded-2xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-emerald-800">
                回答ボタンを押した分まで、この端末には自動保存されています。別端末でも再開する場合は、下のQR画像かコードを保存してから{pendingLabel}へ進んでください。
              </p>
              <ProgressBackupPanel
                onContinue={() => performNavigation(pendingNavigation)}
                continueLabel={`保存を終えて${pendingLabel}へ`}
              />
              <Button full className="mt-2" variant="ghost" onClick={() => performNavigation(pendingNavigation)}>
                この端末の自動保存だけで{pendingLabel}へ
              </Button>
              <Button full className="mt-1" variant="ghost" onClick={close}>
                戻らず学習を続ける
              </Button>
            </>
          )}
        </div>
      ) : (
        <AppMenuPanel
          account={account}
          authStatus={authStatus}
          onNavigate={openScreen}
          onAction={(action) => setView(action)}
        />
      )}
    </Sheet>
  )
}

// 既存画面の import 名は互換性のため保ち、
// 新しい画面からはメニューとして参照できる別名も公開する。
export const SettingsMenuButton = SpeechSettingsButton
export const SettingsMenuSheet = SpeechSettingsSheet
