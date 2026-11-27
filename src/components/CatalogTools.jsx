import { ChevronDown, ChevronUp } from './Icons.jsx'
import { cx } from './ui.jsx'

/**
 * 一覧の上に置く操作をまとめて畳む器。
 * 閉じているあいだは、いま見ている記録の切替とこのボタンの1行だけを残し、
 * しぼり込み・並び替え・見方の切替は開いたときに出す。画面の残りは一覧へ渡す。
 */
export function CatalogTools({
  open,
  onToggle,
  // 読み上げる名前。並び替えのない一覧は「しぼり込み」だけにする。
  label = 'しぼり込みと並び替え',
  summary = '',
  // しぼり込みが「すべて」でないときは、閉じていてもボタンの色で分かるようにする。
  narrowed = false,
  tabs,
  // 絞り込んだ範囲の数（CatalogRecordCounts）。渡すと、タブを上の段に、数をしぼり込みボタンの左に置く。
  // 一覧をスクロールしても隠れないところで、記録のたびに変わる数を見せるため。
  counts,
  // 畳む側の中身どうしの間。画面ごとのまわりの間隔にそろえる。
  toolsClassName = 'space-y-1.5',
  toggleProps,
  toolsProps,
  children,
}) {
  const action = open ? '閉じる' : '開く'
  const toggle = (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={summary ? `${label}を${action}。現在は${summary}` : `${label}を${action}`}
      className={cx(
        'learning-catalog-tools-toggle min-h-11 shrink-0 items-center justify-center gap-0.5 rounded-xl border px-2 text-[10px] font-extrabold text-brand-700 active:bg-brand-50',
        narrowed ? 'border-brand-300 bg-brand-50' : 'border-slate-300 bg-white',
      )}
      {...toggleProps}
    >
      <span>しぼり込み</span>
      {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
    </button>
  )
  return (
    <>
      {counts ? (
        <div className="space-y-1.5">
          {tabs}
          <div className="flex items-center gap-1.5" data-catalog-tools-counts-row>
            <div className="min-w-0 flex-1">{counts}</div>
            {toggle}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-1.5">
          {tabs}
          {toggle}
        </div>
      )}
      <div
        className={cx(toolsClassName, !open && 'learning-catalog-tools-collapsible')}
        {...toolsProps}
      >
        {children}
      </div>
    </>
  )
}
