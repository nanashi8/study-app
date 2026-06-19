import { useState } from 'react'
import { useStore, normalizeOrder } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { CONTENTS_BY_ID } from '../data/contents.js'
import { cx } from '../components/ui.jsx'
import { ArrowRight, ChevronUp, ChevronDown, Eye, EyeOff } from '../components/Icons.jsx'

// 通常表示のコンテンツタイル。available はタップで入れる／coming は「準備中」。
function ContentTile({ content, onOpen }) {
  const coming = content.status === 'coming'
  return (
    <button
      onClick={coming ? undefined : onOpen}
      disabled={coming}
      className="relative flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-card active:scale-[0.99] transition-transform disabled:opacity-60 disabled:active:scale-100"
    >
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
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

// 編集モードのタイル。上下移動と表示/非表示の切り替えができる。
function EditTile({ content, hidden, first, last, onUp, onDown, onToggle }) {
  return (
    <div
      className={cx(
        'flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-card transition-opacity',
        hidden && 'opacity-50',
      )}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl"
        style={{ backgroundColor: `${content.color}22` }}
      >
        {content.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-extrabold text-ink">{content.title}</div>
        <div className="truncate text-[11px] font-bold text-ink/45">
          {hidden ? '非表示' : content.subtitle}
        </div>
      </div>

      {/* 表示/非表示 */}
      <button
        onClick={onToggle}
        className={cx(
          'flex h-9 w-9 items-center justify-center rounded-xl active:scale-90 transition-transform',
          hidden ? 'bg-paper text-ink/40' : 'bg-brand-50 text-brand-500',
        )}
        aria-label={hidden ? '表示する' : '非表示にする'}
      >
        {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      {/* 上下移動 */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onUp}
          disabled={first}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-paper text-ink/55 active:scale-90 transition-transform disabled:opacity-30"
          aria-label="上へ"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={onDown}
          disabled={last}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-paper text-ink/55 active:scale-90 transition-transform disabled:opacity-30"
          aria-label="下へ"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  )
}

// トップページ＝コンテンツ選択（ポータル）。並び順・表示はユーザーが編集できる。
export function PortalScreen() {
  const navigate = useStore((s) => s.navigate)
  const user = useAuth((s) => s.user)
  const status = useAuth((s) => s.status)
  const portalOrder = useStore((s) => s.portalOrder)
  const portalHidden = useStore((s) => s.portalHidden)
  const moveContent = useStore((s) => s.moveContent)
  const togglePortalHidden = useStore((s) => s.togglePortalHidden)
  const resetPortal = useStore((s) => s.resetPortal)
  const [editing, setEditing] = useState(false)

  // 保存済みの並び（未登場の新コンテンツも補完）→ 実コンテンツへ。
  const ordered = normalizeOrder(portalOrder)
    .map((id) => CONTENTS_BY_ID[id])
    .filter(Boolean)
  const isHidden = (id) => portalHidden.includes(id)
  const visible = ordered.filter((c) => !isHidden(c.id))

  return (
    <div className="min-h-full bg-paper">
      <div className="flex items-start justify-between gap-3 px-5 pb-6 pt-[calc(env(safe-area-inset-top)+2rem)]">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold text-ink">スタディアプリ</h1>
          <p className="mt-1 truncate text-sm font-bold text-ink/50">
            {editing ? '並べ替え・表示の切り替えができます' : user?.email ? `${user.email}` : 'ゲストで学習中（ログインなし）'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* 未ログイン時だけ：ログイン導線（任意） */}
          {!editing && status === 'out' && (
            <button
              onClick={() => navigate('login')}
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-extrabold text-brand-600 shadow-card active:scale-95 transition-transform"
            >
              ログイン
            </button>
          )}
          <button
            onClick={() => setEditing((v) => !v)}
            className={cx(
              'rounded-full px-3.5 py-1.5 text-xs font-extrabold active:scale-95 transition-transform',
              editing ? 'bg-brand-500 text-white' : 'bg-white text-brand-600 shadow-card',
            )}
          >
            {editing ? '完了' : '編集'}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2.5 px-4">
          {ordered.map((content, i) => (
            <EditTile
              key={content.id}
              content={content}
              hidden={isHidden(content.id)}
              first={i === 0}
              last={i === ordered.length - 1}
              onUp={() => moveContent(content.id, -1)}
              onDown={() => moveContent(content.id, +1)}
              onToggle={() => togglePortalHidden(content.id)}
            />
          ))}
          <button
            onClick={resetPortal}
            className="mt-1 w-full rounded-2xl py-3 text-xs font-extrabold text-ink/45 active:text-ink/70"
          >
            並び順を初期状態に戻す
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 px-4">
          {visible.length === 0 ? (
            <p className="rounded-2xl bg-white p-5 text-center text-sm font-bold text-ink/45 shadow-card">
              表示中のコンテンツがありません。「編集」から表示してください。
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
      )}
    </div>
  )
}
