import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { SESSION_SIZE } from '../lib/session.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'

// 1回に出す数の選択肢。教材の在庫がこれより少ないときは、その数を「全部」として足す。
const SIZE_OPTIONS = [5, 10, 20, 30, 50, 100, 200]

/** 設定値を、その教材で実際に出せる問題数の範囲へ収める。 */
export function normalizeSessionSize(value, max = Infinity) {
  const size = Math.floor(Number(value))
  if (!Number.isFinite(size) || size < 1) return Math.min(SESSION_SIZE, max)
  return Math.max(1, Math.min(size, max))
}

/** 保存済みの「1セッションの問題数」。教材の在庫数を渡すとその範囲へ収める。 */
export function useSessionSize(max = Infinity) {
  const stored = useStore((state) => state.settings.sessionSize)
  return normalizeSessionSize(stored, max)
}

/**
 * 学習・クイズ画面の「1/10」表示。
 * タップすると1セッションの問題数を選べる（選ぶと今のセッションを作り直す）。
 */
export function SessionCounter({
  index = 0,
  total = 0,
  max,
  onResize,
  className = '',
  label = '問題',
}) {
  const [open, setOpen] = useState(false)
  const setSetting = useStore((state) => state.setSetting)
  const stored = useStore((state) => state.settings.sessionSize)
  const pool = Number.isFinite(Number(max)) ? Math.max(1, Math.floor(Number(max))) : null
  const options = [...new Set([
    ...SIZE_OPTIONS.filter((size) => !pool || size < pool),
    ...(pool ? [pool] : []),
  ])].sort((a, b) => a - b)
  const current = normalizeSessionSize(stored, pool ?? Infinity)

  const choose = (size) => {
    setSetting('sessionSize', size)
    setOpen(false)
    onResize?.(size)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${label}数を変更する（現在 ${total}問）`}
        className={cx(
          'min-h-9 shrink-0 rounded-lg px-1.5 text-right text-sm font-extrabold tabular-nums text-ink/50 underline decoration-ink/20 decoration-dotted underline-offset-4 active:bg-ink/5',
          className,
        )}
        data-session-size-button
      >
        {Math.min(index + 1, total)}/{total}
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={`1回の${label}数`}>
        <div className="space-y-4 pb-2">
          <p className="text-xs font-bold leading-relaxed text-ink/50">
            1セッションで出す{label}数を選べます。選ぶと、いまのセッションをその{label}数で作り直します。
            設定はすべての学習・クイズに引き継がれます。
          </p>
          <div className="grid grid-cols-3 gap-2" data-session-size-options>
            {options.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => choose(size)}
                aria-pressed={size === current}
                className={cx(
                  'min-h-12 rounded-2xl text-sm font-extrabold ring-1 transition',
                  size === current
                    ? 'bg-brand-500 text-white ring-brand-500'
                    : 'bg-white text-ink ring-brand-100 active:bg-brand-50',
                )}
              >
                {pool && size === pool ? '全部' : `${size}問`}
              </button>
            ))}
          </div>
          {pool != null && (
            <p className="text-[11px] font-bold text-ink/40">
              この教材で出題できるのは全{pool}{label}です。
            </p>
          )}
          <Button full variant="ghost" onClick={() => setOpen(false)}>閉じる</Button>
        </div>
      </Sheet>
    </>
  )
}
