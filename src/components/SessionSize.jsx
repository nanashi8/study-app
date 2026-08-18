import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { SESSION_SIZE } from '../lib/session.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'

// 1回に出す数の選択肢。教材の在庫がこれより少ないときは、その数を「全部」として足す。
// 学習マップの「一度に解く問題数」も同じ並びを使うので、ここが唯一の出どころ。
export const SESSION_SIZE_OPTIONS = [5, 10, 20, 30, 50, 100, 200]

// 「全部」を表す値。デッキ作成側は size が 0 なら在庫すべてを出す。
export const SESSION_SIZE_ALL = 0

/** 設定値を、その教材で実際に出せる問題数の範囲へ収める。「全部」はその教材の在庫数になる。 */
export function normalizeSessionSize(value, max = Infinity) {
  const size = Math.floor(Number(value))
  if (size === SESSION_SIZE_ALL) return max
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
  // 減らすと今の進捗が失われる変更（解決済みの目標数）。null なら選択肢一覧を表示中。
  const [pendingDiscard, setPendingDiscard] = useState(null)
  const setSetting = useStore((state) => state.setSetting)
  const stored = useStore((state) => state.settings.sessionSize)
  const pool = Number.isFinite(Number(max)) ? Math.max(1, Math.floor(Number(max))) : null
  // 在庫より多い選択肢は出さず、最後に「全部」を置く。
  const options = [
    ...SESSION_SIZE_OPTIONS.filter((size) => !pool || size < pool),
    SESSION_SIZE_ALL,
  ]
  const storedSize = Math.floor(Number(stored))
  // 「全部」は0で保存する。以前の設定で在庫数ちょうどが入っている場合も全部として扱う。
  const showsAll = storedSize === SESSION_SIZE_ALL || (pool != null && storedSize >= pool)
  const current = showsAll ? SESSION_SIZE_ALL : normalizeSessionSize(stored, pool ?? Infinity)

  const closeSheet = () => {
    setOpen(false)
    setPendingDiscard(null)
  }

  const apply = (rawSize, resolvedSize) => {
    setSetting('sessionSize', rawSize)
    closeSheet()
    // 進捗（index）より少なくする変更だけ、いまの学習・回答を破棄する。
    onResize?.(resolvedSize, { discard: resolvedSize <= index })
  }

  const choose = (size) => {
    // 教材ごとの在庫数で組み直す（全部＝その教材の在庫すべて）。
    const resolvedSize = size === SESSION_SIZE_ALL ? (pool ?? SESSION_SIZE_ALL) : size
    // 進捗より少なくすると今の学習・回答が破棄されるので、確認してから変更する。
    if (index > 0 && resolvedSize <= index) {
      setPendingDiscard({ rawSize: size, resolvedSize })
      return
    }
    apply(size, resolvedSize)
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

      <Sheet open={open} onClose={closeSheet} title={`1回の${label}数`}>
        {pendingDiscard ? (
          <div className="space-y-4 pb-2" data-session-size-discard-warning>
            <p className="text-xs font-bold leading-relaxed text-rose-600">
              いま{Math.min(index + 1, total)}/{total}
              {label}まで進んでいます。{pendingDiscard.resolvedSize}
              {label}に変更すると、ここまでの学習・回答は破棄されます。
            </p>
            <div className="flex gap-2">
              <Button full variant="ghost" onClick={() => setPendingDiscard(null)}>
                やめる
              </Button>
              <Button
                full
                variant="danger"
                onClick={() => apply(pendingDiscard.rawSize, pendingDiscard.resolvedSize)}
              >
                破棄して変更する
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            <p className="text-xs font-bold leading-relaxed text-ink/50">
              1セッションで出す{label}数を選べます。いまの進捗より多い数を選べば続きから、
              少ない数を選ぶとここまでの学習・回答は破棄されます。
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
                  {size === SESSION_SIZE_ALL ? '全部' : `${size}問`}
                </button>
              ))}
            </div>
            {pool != null && (
              <p className="text-[11px] font-bold text-ink/40">
                この教材で出題できるのは全{pool}{label}です。
              </p>
            )}
            <Button full variant="ghost" onClick={closeSheet}>閉じる</Button>
          </div>
        )}
      </Sheet>
    </>
  )
}
