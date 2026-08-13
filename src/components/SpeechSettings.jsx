import { useEffect, useMemo, useState } from 'react'
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
import { Button, cx } from './ui.jsx'
import {
  Book,
  BookOpen,
  Bookmark,
  Chart,
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
import { notebookStoredSavedCount } from '../lib/learningNotebook.js'
import { overallProgress } from '../lib/session.js'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import { LearningAnalyticsPanel } from './LearningAnalytics.jsx'
import {
  LearningAdvisorPanel,
  LearningAdvisorSummary,
} from './LearningAdvisor.jsx'

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

function DataManagementPanel() {
  const clearLearningData = useStore((state) => state.clearLearningData)
  const data = useStore(useShallow((state) => ({
    analyticsScored: state.learningAnalytics?.scored ?? 0,
    skillCount: Object.keys(state.skillStats ?? {}).length,
    diagnostics: state.diagnosticHistory?.length ?? 0,
    saved: notebookStoredSavedCount(state) + (state.myGrammarList?.length ?? 0),
    vocabHistory: state.vocabHistory?.length ?? 0,
  })))
  const [confirmScope, setConfirmScope] = useState(null)
  const actions = [
    {
      id: 'analytics',
      label: '分析集計を消去',
      count: `${data.analyticsScored}回答・${data.skillCount}分野`,
      desc: '時刻・間隔・分野別の集計を初期化。SRSと保存項目は残します。',
    },
    {
      id: 'diagnostic',
      label: '診断履歴を消去',
      count: `${data.diagnostics}件`,
      desc: '過去の診断結果と受験回数を初期化。通常の学習履歴は残します。',
    },
    {
      id: 'saved',
      label: '保存リストを空にする',
      count: `${data.saved}項目`,
      desc: '8分野のノート、メモ、タグ、自作問題集と旧登録リストを空にします。学習進捗は残します。',
    },
    {
      id: 'vocabHistory',
      label: '辞書の参照履歴を消去',
      count: `${data.vocabHistory}語`,
      desc: '検索・参照した英単語の履歴だけを空にします。マイ単語は残します。',
    },
  ]
  const pending = actions.find((action) => action.id === confirmScope)

  if (pending) {
    return (
      <div className="space-y-3 py-3" data-data-clear-confirmation={pending.id}>
        <div className="border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm font-extrabold text-rose-900">{pending.label}</p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-rose-800/80">{pending.desc}</p>
          <p className="mt-2 text-[10px] font-extrabold text-rose-700">対象：{pending.count}・元に戻せません</p>
        </div>
        <Button
          full
          variant="danger"
          onClick={() => {
            clearLearningData(pending.id)
            setConfirmScope(null)
          }}
        >
          消去を実行する
        </Button>
        <Button full variant="ghost" onClick={() => setConfirmScope(null)}>キャンセル</Button>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100" data-data-management-panel>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => setConfirmScope(action.id)}
          className="flex min-h-16 w-full items-center gap-3 py-2.5 text-left"
          data-clear-learning-scope={action.id}
        >
          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-extrabold text-slate-800">{action.label}</strong>
            <span className="mt-0.5 block text-[10px] font-bold leading-relaxed text-slate-500">{action.desc}</span>
          </span>
          <span className="shrink-0 border border-slate-300 bg-slate-50 px-2 py-1 text-[10px] font-extrabold text-slate-600">{action.count}</span>
        </button>
      ))}
      <p className="py-3 text-[10px] font-bold leading-relaxed text-slate-500">
        全進捗の初期化はメニュー最下部の「学習状況をリセット」から行います。実行前にQR・コードを保存できます。
      </p>
    </div>
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
            保存される学習・音声・コンテンツ設定は、メニュー内のここに集約しています。
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
          title="コンテンツメニュー"
          desc="トップメニューの並び順と表示・非表示"
        >
          <PortalSettingsPanel />
        </SettingsSection>
        <SettingsSection
          title="データ・履歴管理"
          desc="分析、診断、保存リスト、辞書履歴を個別に消去"
        >
          <DataManagementPanel />
        </SettingsSection>
      </div>
    </section>
  )
}

const APP_MENU_DESTINATIONS = [
  {
    screen: 'portal',
    label: 'ホーム',
    desc: '全教科・辞書・名作の入口',
    Icon: Home,
  },
  {
    screen: 'mathMap',
    label: '数学アプリ',
    desc: '単元マップと理解度',
    Icon: MathRoot,
  },
  {
    screen: 'vocabSearch',
    label: '英和辞書',
    desc: '意味・語法・語源・履歴',
    Icon: Search,
  },
  {
    screen: 'kotenList',
    label: '古典アプリ',
    desc: '古典単語・文法・常識・短文',
    Icon: Book,
  },
  {
    screen: 'literatureLibrary',
    label: '名作に親しむ',
    desc: '英語・古典・漢文の朗読',
    Icon: BookOpen,
  },
]

const ENGLISH_MENU_DESTINATIONS = [
  {
    screen: 'home',
    label: '英語の主要学習',
    desc: '単語・長文・熟語・文法・リスニング',
    Icon: BookOpen,
  },
  {
    screen: 'vocabLevels',
    label: '英単語',
    desc: '級別・分野別・品詞別に学習',
    Icon: Book,
  },
  {
    screen: 'readingList',
    label: '長文読解',
    desc: '前から読む訳・文法・設問',
    Icon: BookOpen,
  },
  {
    screen: 'phrases',
    label: '熟語・構文',
    desc: '全1,500項目を検索・復習',
    Icon: Sparkles,
  },
  {
    screen: 'grammar',
    label: '英文法',
    desc: '級別問題と体系解説',
    Icon: Lightbulb,
  },
  {
    screen: 'listening',
    label: 'リスニング',
    desc: '級別形式・本文確認・復習',
    Icon: Headphones,
  },
]

const LEARNING_TOOL_DESTINATIONS = [
  {
    screen: 'diagnostic',
    label: '学習診断',
    desc: '28問で得意・弱点と現在地を確認',
    Icon: Trophy,
  },
  {
    screen: 'writing',
    label: '英作文',
    desc: '書いて使える知識にする',
    Icon: Book,
  },
  {
    screen: 'dictation',
    label: 'ディクテーション',
    desc: '聞き取りとつづりを結びつける',
    Icon: Keyboard,
  },
  {
    screen: 'roots',
    label: '語源学習',
    desc: '単語を部品と語族で整理する',
    Icon: Link,
  },
  {
    screen: 'vocabCamera',
    label: '教科書から単語追加',
    desc: '写真OCRで辞書照合・保存',
    Icon: Search,
  },
  {
    screen: 'wordRequests',
    label: '未登録語リクエスト管理',
    desc: '辞書にない候補の確認',
    Icon: Link,
  },
]

const PERSONAL_TOOL_DESTINATIONS = [
  {
    screen: 'myList',
    label: 'マイ学習ノート',
    desc: '8分野のメモ・問題集・履歴',
    Icon: Bookmark,
  },
  {
    screen: 'myLearning',
    label: '全学習索引',
    desc: '長文・英作文・数学を含む学習済み項目',
    Icon: Bookmark,
  },
  {
    screen: 'myGrammar',
    label: 'マイ文法',
    desc: '保存した文法を復習',
    Icon: Lightbulb,
  },
  {
    screen: 'kotenSaved',
    label: '古典の登録リスト',
    desc: '古典単語・文法・常識を管理',
    Icon: Book,
  },
  {
    screen: 'progress',
    label: '学習記録・バックアップ',
    desc: '成績、級別進捗、QR・コードを確認',
    Icon: Chart,
  },
]

function MenuDestinationList({ items, onNavigate, tone = 'brand' }) {
  const colors = tone === 'violet'
    ? 'bg-violet-50 text-violet-600'
    : 'bg-brand-50 text-brand-600'
  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      {items.map(({ screen, params, label, desc, Icon }) => (
        <button
          key={screen}
          type="button"
          onClick={() => onNavigate?.(screen, params ?? {})}
          className="flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left active:bg-brand-50"
          data-menu-destination={screen}
        >
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${colors}`}>
            <Icon size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-extrabold text-ink">{label}</strong>
            <span className="block text-xs font-bold leading-snug text-ink/45">{desc}</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-ink/25" />
        </button>
      ))}
    </div>
  )
}

export function AppMenuPanel({
  profile,
  account,
  authStatus,
  onNavigate,
  onOpenAdvisor,
  onOpenAnalysis,
  onOpenSettings,
  onOpenAccount,
  onOpenReset,
}) {
  return (
    <section className="space-y-4" aria-label="アプリメニュー" data-app-menu-panel>
      <p className="text-xs font-bold leading-relaxed text-ink/50">
        教材、検索、保存、分析、設定、データ管理の入口を機能別に集約しています。
      </p>

      <LearningAdvisorSummary
        profile={profile}
        onOpenAdvisor={onOpenAdvisor}
        onOpenAnalysis={onOpenAnalysis}
      />

      <section aria-label="教科と辞書">
        <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">教科・辞書・名作</h2>
        <MenuDestinationList items={APP_MENU_DESTINATIONS} onNavigate={onNavigate} />
      </section>

      <section aria-label="英語学習" data-menu-english-tools>
        <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">英語学習</h2>
        <MenuDestinationList items={ENGLISH_MENU_DESTINATIONS} onNavigate={onNavigate} />
      </section>

      <section aria-label="発展学習と診断" data-menu-support-tools>
        <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">発展学習・診断</h2>
        <MenuDestinationList items={LEARNING_TOOL_DESTINATIONS} onNavigate={onNavigate} tone="violet" />
      </section>

      <section aria-label="保存と記録" data-menu-personal-tools>
        <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">保存した学習・記録</h2>
        <MenuDestinationList items={PERSONAL_TOOL_DESTINATIONS} onNavigate={onNavigate} />
      </section>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenSettings}
          data-menu-settings-entry
          className="flex min-h-16 items-center gap-2 rounded-2xl bg-brand-600 px-3 text-left text-white active:bg-brand-700"
        >
          <Gear size={20} className="shrink-0" />
          <span>
            <strong className="block text-sm font-extrabold">設定</strong>
            <span className="block text-xs font-bold text-white/65">学習・音声・表示</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenAccount}
          data-menu-account-entry
          className="flex min-h-16 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-left text-ink active:bg-slate-50"
        >
          <Home size={20} className="shrink-0 text-brand-600" />
          <span className="min-w-0">
            <strong className="block text-sm font-extrabold">{account ? 'アカウント' : 'ログイン'}</strong>
            <span className="block truncate text-xs font-bold text-ink/45">
              {account?.email ?? (authStatus === 'out' ? '任意でクラウド保存' : 'ゲストで利用中')}
            </span>
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenReset}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-extrabold text-rose-700 active:bg-rose-100"
        data-menu-reset-entry
      >
        <Refresh size={18} /> 学習状況をリセット
      </button>
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

function ResetProgressPanel({ onBackup, onReset, onCancel }) {
  return (
    <section className="space-y-3" data-menu-reset-confirmation>
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
        <h2 className="font-display text-lg font-extrabold text-rose-800">学習状況を最初からにします</h2>
        <p className="mt-2 text-sm font-bold leading-relaxed text-rose-700/80">
          正誤・復習段階・診断・分析・保存リストなど、すべての学習履歴が消えます。
          ログイン中は、初期化した状態がクラウドにも保存されます。
        </p>
      </div>
      <p className="rounded-2xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-emerald-800">
        音声・カード設定と、メインメニューの並び順・表示設定は残ります。
      </p>
      <Button full variant="secondary" onClick={onBackup}>
        リセット前にQR・コードを保存
      </Button>
      <Button full variant="danger" onClick={onReset}>
        <Refresh size={18} /> 学習状況をリセットする
      </Button>
      <Button full variant="ghost" onClick={onCancel}>キャンセル</Button>
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
  const resetProgress = useStore((state) => state.resetProgress)
  const currentScreen = useStore((state) => state.screen)
  const learningState = useStore(useShallow((state) => ({
    srs: state.srs,
    etymologySrs: state.etymologySrs,
    kotenSrs: state.kotenSrs,
    kotenGrammarSrs: state.kotenGrammarSrs,
    kotenCultureSrs: state.kotenCultureSrs,
    kotenInterpretationSrs: state.kotenInterpretationSrs,
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
  const confirmReset = () => {
    resetProgress()
    close()
    goPortal()
  }
  const signOutAndClose = async () => {
    await signOutNow()
    close()
    goPortal()
  }

  const pendingLabel = pendingNavigation?.type === 'back'
    ? '前の画面'
    : pendingNavigation?.screen === 'portal'
      ? 'メインメニュー'
      : '選んだ画面'

  const sheetTitles = {
    menu: '統一メニュー',
    settings: '設定',
    advisor: '学習アドバイザー',
    analytics: '定着・学習効率の分析',
    reset: '学習状況のリセット',
    'backup-reset': 'リセット前のバックアップ',
    account: account ? 'アカウント' : 'ログイン・保存',
    'save-progress': '途中の進捗を保存しますか？',
  }

  return (
    <Sheet open={open} onClose={close} title={sheetTitles[view] ?? '統一メニュー'} maxH="92vh">
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
            onBackup={() => setView('backup-reset')}
            onReset={confirmReset}
            onCancel={() => setView('menu')}
          />
        </>
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
        </div>
      ) : (
        <AppMenuPanel
          profile={profile}
          account={account}
          authStatus={authStatus}
          onNavigate={openScreen}
          onOpenAdvisor={() => setView('advisor')}
          onOpenAnalysis={() => setView('analytics')}
          onOpenSettings={() => setView('settings')}
          onOpenAccount={() => setView('account')}
          onOpenReset={() => setView('reset')}
        />
      )}
    </Sheet>
  )
}

// 既存画面の import 名は互換性のため保ち、
// 新しい画面からは共通メニューとして参照できる別名も公開する。
export const SettingsMenuButton = SpeechSettingsButton
export const SettingsMenuSheet = SpeechSettingsSheet
