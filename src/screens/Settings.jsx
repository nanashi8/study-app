import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import {
  choosePreferredVoice,
  getEnglishVoices,
  getJapaneseVoices,
  isTTSSupported,
  speak,
  subscribeVoices,
  voiceQuality,
  voiceQualityLabel,
} from '../lib/tts.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { Card, Button } from '../components/ui.jsx'
import { SpeakerWave, Refresh } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

function Row({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <div className="font-bold text-ink">{title}</div>
        {desc && <div className="text-xs font-bold text-ink/45">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cx('relative h-7 w-12 rounded-full transition-colors', on ? 'bg-brand-500' : 'bg-ink/20')}
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

const VOICE_GROUPS = [
  { quality: 'high', label: '高品質音声' },
  { quality: 'standard', label: '標準音声' },
  { quality: 'low', label: '低音質（代替用）' },
]

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
      className="max-w-[10rem] rounded-xl bg-paper px-2 py-1.5 text-sm font-bold text-ink ring-1 ring-brand-100"
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

export function SettingsScreen() {
  const settings = useStore((s) => s.settings)
  const setSetting = useStore((s) => s.setSetting)
  const resetProgress = useStore((s) => s.resetProgress)
  const goHome = useStore((s) => s.goHome)
  const account = useAuth((s) => s.user)
  const signOutNow = useAuth((s) => s.signOutNow)

  const [englishVoices, setEnglishVoices] = useState(getEnglishVoices())
  const [japaneseVoices, setJapaneseVoices] = useState(getJapaneseVoices())
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(
    () =>
      subscribeVoices(() => {
        setEnglishVoices(getEnglishVoices())
        setJapaneseVoices(getJapaneseVoices())
      }),
    [],
  )

  const goals = [10, 20, 30, 50]

  return (
    <div className="pb-6">
      <ScreenHeader title="設定" />

      <div className="space-y-4 px-4">
        {/* アカウント */}
        {account && (
          <Card className="p-4">
            <h2 className="mb-2 font-display text-base font-extrabold text-ink/80">アカウント</h2>
            <p className="mb-3 break-all text-sm font-bold text-ink/60">
              ログイン中：{account.email}
            </p>
            <p className="mb-3 text-xs font-bold text-ink/45">
              進捗はクラウドに保存され、どの端末でもこのIDで続きから学習できます。
            </p>
            <Button variant="secondary" size="sm" onClick={signOutNow}>
              ログアウト
            </Button>
          </Card>
        )}

        {/* 音声 */}
        <Card className="px-4">
          <h2 className="pt-3 font-display text-base font-extrabold text-ink/80">音声・発音</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
            自動では高品質、標準、低音質の順で選びます。低音質は高品質・標準音声が使えない場合だけ使用します。
          </p>
          {!isTTSSupported() && (
            <p className="mt-1 text-xs font-bold text-rose-500">
              この端末/ブラウザは音声合成に対応していないようです。
            </p>
          )}
          <div className="divide-y divide-brand-50">
            <Row title="読み上げの速さ" desc={`${settings.ttsRate.toFixed(1)}x`}>
              <input
                type="range"
                min="0.5"
                max="1.2"
                step="0.1"
                value={settings.ttsRate}
                onChange={(e) => setSetting('ttsRate', Number(e.target.value))}
                className="w-28 accent-brand-500"
              />
            </Row>
            <Row
              title="英語の声"
              desc={voiceStatus(englishVoices, settings.ttsVoiceURI)}
            >
              <VoiceSelect
                label="英語の読み上げ音声"
                voices={englishVoices}
                value={settings.ttsVoiceURI}
                onChange={(value) => setSetting('ttsVoiceURI', value)}
              />
            </Row>
            <Row
              title="日本語の声"
              desc={voiceStatus(japaneseVoices, settings.ttsJapaneseVoiceURI)}
            >
              <VoiceSelect
                label="日本語の読み上げ音声"
                voices={japaneseVoices}
                value={settings.ttsJapaneseVoiceURI}
                onChange={(value) => setSetting('ttsJapaneseVoiceURI', value)}
              />
            </Row>
            <Row title="カード表示時に自動で発音" desc="単語カードを開くと自動で読み上げ">
              <Toggle on={settings.autoSpeak} onChange={(v) => setSetting('autoSpeak', v)} />
            </Row>
            <Row title="発音記号を表示" desc="単語カードに発音記号を出す">
              <Toggle on={settings.showPhonetic} onChange={(v) => setSetting('showPhonetic', v)} />
            </Row>
          </div>
          <div className="flex flex-wrap gap-2 pb-3">
            <Button
              variant="soft"
              size="sm"
              onClick={() => speak('Hello! This is a pronunciation test.', { rate: settings.ttsRate, voiceURI: settings.ttsVoiceURI })}
            >
              <SpeakerWave size={16} /> 英語音声をテスト
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={() =>
                speak('高品質な音声を優先して読み上げます。', {
                  lang: 'ja-JP',
                  rate: settings.ttsRate,
                  voiceURI: settings.ttsJapaneseVoiceURI,
                })
              }
            >
              <SpeakerWave size={16} /> 日本語音声をテスト
            </Button>
          </div>
        </Card>

        {/* 学習カード */}
        <Card className="px-4">
          <h2 className="pt-3 font-display text-base font-extrabold text-ink/80">学習カード</h2>
          <div className="divide-y divide-brand-50">
            <Row title="答えを開いたまま見せる" desc="覚える・復習・マイ単語で、タップせず最初から意味・語源を表示">
              <Toggle on={settings.revealAnswers} onChange={(v) => setSetting('revealAnswers', v)} />
            </Row>
          </div>
        </Card>

        {/* 学習目標 */}
        <Card className="p-4">
          <h2 className="mb-2 font-display text-base font-extrabold text-ink/80">1日の目標（語数）</h2>
          <div className="grid grid-cols-4 gap-2">
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => setSetting('dailyGoal', g)}
                className={cx(
                  'rounded-2xl py-3 font-display text-lg font-extrabold transition-colors',
                  settings.dailyGoal === g ? 'bg-brand-500 text-white' : 'bg-paper text-ink/60',
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </Card>

        {/* 発音チェックの注意 */}
        <Card className="p-4">
          <h2 className="mb-1 font-display text-base font-extrabold text-ink/80">発音チェックについて</h2>
          <p className="text-xs font-bold leading-relaxed text-ink/55">
            ブラウザの音声認識結果と見出し語の綴りを比べる簡易チェックです。音素・母音・アクセントを
            精密に採点する機能ではありません。音声認識に未対応の環境では自己評価に切り替わります。
          </p>
        </Card>

        {/* データ */}
        <Card className="p-4">
          <h2 className="mb-2 font-display text-base font-extrabold text-ink/80">データ</h2>
          <p className="mb-3 text-xs font-bold text-ink/50">
            進捗のバックアップ・復元は「記録」タブの進捗コードから行えます。
          </p>
          <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}>
            <Refresh size={16} /> 進捗をリセット
          </Button>
        </Card>

        <p className="pt-2 text-center text-xs font-bold text-ink/30">英語アプリ v0.1 ・ 英検5級〜1級</p>
      </div>

      <Sheet open={confirmReset} onClose={() => setConfirmReset(false)} title="進捗をリセットしますか？">
        <div className="space-y-3">
          <p className="text-sm font-bold text-ink/60">
            学習履歴・XP・マイ単語がすべて消えます。元に戻せません。残しておきたい場合は、先に「記録」タブで進捗コードを発行してください。
          </p>
          <Button
            full
            variant="danger"
            onClick={() => {
              resetProgress()
              setConfirmReset(false)
              goHome()
            }}
          >
            リセットする
          </Button>
          <Button full variant="ghost" onClick={() => setConfirmReset(false)}>
            キャンセル
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
