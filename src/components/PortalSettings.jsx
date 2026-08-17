import { useStore, normalizeOrder } from '../store/useStore.js'
import { CONTENTS_BY_ID } from '../data/contents.js'
import { cx } from './ui.jsx'
import { ChevronUp, ChevronDown, Eye, EyeOff } from './Icons.jsx'

function ContentSettingRow({
  content,
  hidden,
  first,
  last,
  onUp,
  onDown,
  onToggle,
}) {
  return (
    <div
      className={cx(
        'flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-2.5 transition-opacity',
        hidden && 'opacity-55',
      )}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl"
        style={{ backgroundColor: `${content.color}22` }}
        aria-hidden="true"
      >
        {content.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-extrabold text-ink">{content.title}</p>
        <p className="truncate text-[10px] font-bold text-ink/45">
          {hidden ? 'ホームで非表示' : 'ホームに表示'}
        </p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cx(
          'grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform active:scale-90',
          hidden ? 'bg-paper text-ink/40' : 'bg-brand-50 text-brand-600',
        )}
        aria-label={`${content.title}を${hidden ? '表示する' : '非表示にする'}`}
      >
        {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      <div className="flex shrink-0 flex-col gap-1">
        <button
          type="button"
          onClick={onUp}
          disabled={first}
          className="grid h-8 w-8 place-items-center rounded-lg bg-paper text-ink/55 transition-transform active:scale-90 disabled:opacity-30"
          aria-label={`${content.title}を上へ移動`}
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          onClick={onDown}
          disabled={last}
          className="grid h-8 w-8 place-items-center rounded-lg bg-paper text-ink/55 transition-transform active:scale-90 disabled:opacity-30"
          aria-label={`${content.title}を下へ移動`}
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  )
}

export function PortalSettingsPanel() {
  const portalOrder = useStore((state) => state.portalOrder)
  const portalHidden = useStore((state) => state.portalHidden)
  const moveContent = useStore((state) => state.moveContent)
  const togglePortalHidden = useStore((state) => state.togglePortalHidden)
  const resetPortal = useStore((state) => state.resetPortal)
  const ordered = normalizeOrder(portalOrder)
    .map((id) => CONTENTS_BY_ID[id])
    .filter(Boolean)

  return (
    <section aria-label="ホームの表示設定">
      <p className="text-xs font-bold leading-relaxed text-ink/50">
        スタディアプリ ホームの並び順と表示・非表示を、ここで変更します。
      </p>
      <div className="mt-3 space-y-2">
        {ordered.map((content, index) => (
          <ContentSettingRow
            key={content.id}
            content={content}
            hidden={portalHidden.includes(content.id)}
            first={index === 0}
            last={index === ordered.length - 1}
            onUp={() => moveContent(content.id, -1)}
            onDown={() => moveContent(content.id, 1)}
            onToggle={() => togglePortalHidden(content.id)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={resetPortal}
        className="mt-3 min-h-11 w-full rounded-xl bg-paper px-3 text-xs font-extrabold text-ink/55 active:bg-brand-50"
      >
        並び順と表示を初期状態に戻す
      </button>
    </section>
  )
}
