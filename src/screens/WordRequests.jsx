import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { fetchWordRequests } from '../lib/wordRequests.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Chip } from '../components/ui.jsx'

// 「辞書に無くてリクエストされた単語」の一覧。生徒も閲覧できる。
// 件数の多い順＝みんなが欲しがっている語が上に来る。
function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`
}

export function WordRequestsScreen() {
  const [state, setState] = useState({ status: 'loading', items: [] })

  useEffect(() => {
    let alive = true
    fetchWordRequests()
      .then((items) => alive && setState({ status: 'ready', items }))
      .catch((e) => {
        console.warn('fetch word requests failed', e)
        alive && setState({ status: 'error', items: [] })
      })
    return () => {
      alive = false
    }
  }, [])

  const { status, items } = state

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="辞書リクエスト" subtitle="辞書に無くて求められた単語" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-6">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink/50">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
            <p className="text-sm font-bold">読み込み中…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-20 text-center font-bold text-ink/40">読み込めませんでした。<br />通信環境を確認してください。</div>
        )}

        {status === 'ready' && items.length === 0 && (
          <div className="px-6 py-20 text-center">
            <div className="text-4xl">📭</div>
            <p className="mt-3 font-extrabold text-ink/70">まだリクエストはありません</p>
            <p className="mt-1 text-sm font-bold text-ink/40">
              辞書で見つからなかった単語は「リクエスト」ボタンからここに集まります。
            </p>
          </div>
        )}

        {status === 'ready' && items.length > 0 && (
          <>
            <p className="mb-2 mt-3 px-1 text-xs font-bold text-ink/40">{items.length}語のリクエスト</p>
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.word} className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
                  <SpeakButton text={it.q} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-extrabold text-ink">{it.q}</div>
                    {it.lastTs > 0 && (
                      <div className="text-xs font-bold text-ink/40">最終リクエスト {formatDate(it.lastTs)}</div>
                    )}
                  </div>
                  {it.count > 1 && <Chip color="#0ea5e9">{it.count}回</Chip>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
