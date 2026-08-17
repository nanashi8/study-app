import { ScreenHeader } from '../components/AppShell.jsx'
import { Card } from '../components/ui.jsx'

export function WordRequestsScreen() {
  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="辞書リクエスト" subtitle="個人情報を公開しない受付方式" />

      <div className="px-4 pb-6 pt-4">
        <Card className="p-6 text-center">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-3 font-display text-lg font-extrabold text-ink">
            リクエスト一覧は公開していません
          </h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-ink/55">
            入力した単語や利用者情報をほかの人に見せないため、一覧表示を停止しました。
            辞書にない単語は、ログイン後に検索画面や教科書読み取り画面から送れます。
          </p>
          <p className="mt-3 text-xs font-bold leading-relaxed text-ink/40">
            送信するのは選んだ英単語・送信時刻・検索または読み取りの区分です。メールアドレスや写真、教科書本文は送りません。
          </p>
        </Card>
      </div>
    </div>
  )
}
