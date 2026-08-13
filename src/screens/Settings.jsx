import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SettingsMenuPanel } from '../components/SpeechSettings.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { Card, Button } from '../components/ui.jsx'
import { Refresh } from '../components/Icons.jsx'

export function SettingsScreen() {
  const resetProgress = useStore((s) => s.resetProgress)
  const goHome = useStore((s) => s.goHome)
  const account = useAuth((s) => s.user)
  const signOutNow = useAuth((s) => s.signOutNow)

  const [confirmReset, setConfirmReset] = useState(false)

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

        <SettingsMenuPanel />

        {/* データ */}
        <Card className="p-4">
          <h2 className="mb-2 font-display text-base font-extrabold text-ink/80">データ</h2>
          <p className="mb-3 text-xs font-bold text-ink/50">
            進捗のバックアップ・復元は、統一メニューの「学習記録・バックアップ」から行えます。
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
            学習履歴・XP・診断・分析・保存リストがすべて消えます。音声などの設定は残ります。元に戻せないため、先に統一メニューから進捗コードを保存してください。
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
