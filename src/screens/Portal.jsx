import { useStore, normalizeOrder } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { CONTENTS_BY_ID } from '../data/contents.js'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { ArrowRight } from '../components/Icons.jsx'

// 通常表示のコンテンツタイル。available はタップで入れる／coming は「準備中」。
function ContentTile({ content, onOpen }) {
  const coming = content.status === 'coming'
  return (
    <button
      onClick={coming ? undefined : onOpen}
      disabled={coming}
      className="relative flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-left shadow-card active:bg-brand-50 disabled:opacity-60"
    >
      <span
        className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl text-3xl"
        style={{ backgroundColor: `${content.color}22` }}
      >
        {content.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg font-extrabold text-ink">{content.title}</div>
        <div className="text-xs font-bold text-ink/50">{content.subtitle}</div>
      </div>
      {coming ? (
        <span className="rounded-full bg-ink/10 px-2.5 py-1 text-[10px] font-extrabold text-ink/50">
          準備中
        </span>
      ) : (
        <span style={{ color: content.color }}>
          <ArrowRight size={22} />
        </span>
      )}
    </button>
  )
}

// トップページ＝コンテンツ選択。並び順・表示の変更は共通設定メニューへ集約する。
export function PortalScreen() {
  const navigate = useStore((s) => s.navigate)
  const user = useAuth((s) => s.user)
  const status = useAuth((s) => s.status)
  const portalOrder = useStore((s) => s.portalOrder)
  const portalHidden = useStore((s) => s.portalHidden)

  // 保存済みの並び（未登場の新コンテンツも補完）→ 実コンテンツへ。
  const ordered = normalizeOrder(portalOrder)
    .map((id) => CONTENTS_BY_ID[id])
    .filter(Boolean)
  const isHidden = (id) => portalHidden.includes(id)
  const visible = ordered.filter((c) => !isHidden(c.id))

  return (
    <div className="min-h-full bg-paper">
      <div className="px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="whitespace-nowrap font-display text-2xl font-extrabold text-ink">スタディアプリ</h1>
          <SpeechSettingsButton compact />
        </div>
        <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink/55">
            {user?.email ? `${user.email}` : 'ゲストで学習中（ログインなし）'}
          </p>
          {/* 未ログイン時だけ：ログイン導線（任意） */}
          {status === 'out' && (
            <button
              onClick={() => navigate('login')}
              className="rounded-xl border border-brand-100 bg-white px-3 py-2 text-xs font-extrabold text-brand-700 active:bg-brand-50"
            >
              ログイン
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3.5 px-4">
        {visible.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-center text-sm font-bold text-ink/45 shadow-card">
            表示中のコンテンツがありません。右上の設定メニューから表示できます。
          </p>
        ) : (
          visible.map((content) => (
            <ContentTile
              key={content.id}
              content={content}
              onOpen={() => navigate(content.screen)}
            />
          ))
        )}
      </div>
    </div>
  )
}
