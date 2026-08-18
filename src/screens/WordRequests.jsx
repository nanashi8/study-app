import { useEffect, useState } from 'react'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card } from '../components/ui.jsx'
import {
  WORD_REQUEST_DEVICE_DAILY_LIMIT,
  WORD_REQUEST_TOTAL_LIMIT,
  readWordRequestUsage,
} from '../lib/wordRequests.js'

export function WordRequestsScreen() {
  const [used, setUsed] = useState(null)

  useEffect(() => {
    let alive = true
    readWordRequestUsage().then((value) => {
      if (alive) setUsed(value)
    })
    return () => {
      alive = false
    }
  }, [])

  const remaining = used === null ? null : Math.max(0, WORD_REQUEST_TOTAL_LIMIT - used)

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="辞書リクエスト" subtitle="ログイン不要・全体の受付語数で調整" />

      <div className="space-y-4 px-4 pb-6 pt-4">
        <Card className="p-5">
          <div className="text-center text-4xl">📩</div>
          <h2 className="mt-3 text-center font-display text-lg font-extrabold text-ink">
            辞書にない語は自動でリクエストします
          </h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-ink/55">
            英和辞書で調べて見つからなかった語は、ボタンを押さなくてもそのまま追加リクエストになります。
            ログインは必要ありません。
          </p>
          <div className="mt-4 rounded-2xl bg-brand-50 p-4 text-center">
            <p className="text-xs font-extrabold text-brand-600">受付語数</p>
            <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-ink">
              {used === null ? '—' : used.toLocaleString('ja-JP')}
              <span className="text-sm text-ink/45"> / {WORD_REQUEST_TOTAL_LIMIT.toLocaleString('ja-JP')}語</span>
            </p>
            <p className="mt-1 text-xs font-bold text-ink/45">
              {remaining === null
                ? '通信できないときは受付状況を表示できません。'
                : remaining > 0
                  ? `あと${remaining.toLocaleString('ja-JP')}語ぶん受け付けられます。`
                  : '今はいっぱいです。辞書へ追加された分だけまた受け付けます。'}
            </p>
          </div>
          <p className="mt-3 text-xs font-bold leading-relaxed text-ink/45">
            同じ語は何度調べても1件だけ数えます。全体で
            {WORD_REQUEST_TOTAL_LIMIT.toLocaleString('ja-JP')}語まで受け付け、いっぱいになると新しい受付を止めます。
            打ち間違いで枠を使い切らないよう、自動リクエストは1台につき1日
            {WORD_REQUEST_DEVICE_DAILY_LIMIT}語までにしています。
          </p>
        </Card>

        <Card className="p-5">
          <div className="text-center text-4xl">🔒</div>
          <h2 className="mt-3 text-center font-display text-lg font-extrabold text-ink">
            リクエスト一覧は公開していません
          </h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-ink/55">
            調べた語やあなたの情報をほかの人に見せないため、一覧表示はしていません。
          </p>
          <p className="mt-3 text-xs font-bold leading-relaxed text-ink/40">
            送るのは英単語・送信時刻・検索または写真読み取りの区分だけです。メールアドレスや写真、教科書の本文は送りません。
          </p>
        </Card>
      </div>
    </div>
  )
}
