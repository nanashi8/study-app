import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeechSettingsPanel } from '../components/SpeechSettings.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { Card, Button } from '../components/ui.jsx'
import { Refresh } from '../components/Icons.jsx'
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

export function SettingsScreen() {
  const settings = useStore((s) => s.settings)
  const setSetting = useStore((s) => s.setSetting)
  const resetProgress = useStore((s) => s.resetProgress)
  const goHome = useStore((s) => s.goHome)
  const account = useAuth((s) => s.user)
  const signOutNow = useAuth((s) => s.signOutNow)

  const [confirmReset, setConfirmReset] = useState(false)

  const goals = [10, 20, 30, 50]

  return (
    <div className="pb-6">
      <ScreenHeader title="設定" showSpeechSettings={false} />

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
          <SpeechSettingsPanel />
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
