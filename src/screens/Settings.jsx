import { ScreenHeader } from '../components/AppShell.jsx'
import { SettingsMenuPanel } from '../components/SpeechSettings.jsx'

export function SettingsScreen() {
  return (
    <div className="pb-6">
      <ScreenHeader title="設定" showSpeechSettings={false} />

      <div className="space-y-4 px-4">
        <SettingsMenuPanel />

        <p className="rounded-2xl bg-slate-100 px-4 py-3 text-xs font-bold leading-relaxed text-slate-600">
          バックアップと学習履歴のリセットは、画面上部の「メニュー」から直接開けます。
        </p>
      </div>
    </div>
  )
}
