import { useAuth } from '../store/useAuth.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SettingsMenuPanel } from '../components/SpeechSettings.jsx'
import { Card, Button } from '../components/ui.jsx'

export function SettingsScreen() {
  const account = useAuth((s) => s.user)
  const signOutNow = useAuth((s) => s.signOutNow)

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

        <p className="rounded-2xl bg-slate-100 px-4 py-3 text-xs font-bold leading-relaxed text-slate-600">
          バックアップと学習履歴のリセットは、画面上部の「メニュー」から直接開けます。
        </p>

        <p className="pt-2 text-center text-xs font-bold text-ink/30">英語アプリ v0.1 ・ 英検5級〜1級</p>
      </div>
    </div>
  )
}
