import { useMemo, useRef, useState } from 'react'
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
 * 1回の数をいまの番号より少なくして数え直したとき、それまでに答えた問題を結果へ持ち越す。
 * count は結果の全問数に足し、ids は「今回学んだ語」など答えた問題の一覧に足す。
 * 「もう一度」で新しく始めるときは reset する。辞書などを開いて戻る画面は、退避した値を initial で戻す。
 */
export function useCarriedAnswers(initial = null) {
  const carried = useRef({
    count: Math.max(0, Math.floor(Number(initial?.count) || 0)),
    ids: Array.isArray(initial?.ids) ? [...initial.ids] : [],
  })
  return useMemo(() => ({
    get count() {
      return carried.current.count
    },
    get ids() {
      return carried.current.ids
    },
    carry(items = []) {
      carried.current = {
        count: carried.current.count + items.length,
        ids: [...carried.current.ids, ...items.map((item) => item.id)],
      }
    },
    reset() {
      carried.current = { count: 0, ids: [] }
    },
    snapshot() {
      return { count: carried.current.count, ids: [...carried.current.ids] }
    },
  }), [])
}

/**
 * 暗記・テスト画面の「1/10」表示。
 * タップすると1セッションの問題数を選べる。増やすと続きに足し、いまの番号より少なくすると
 * 答えた分の記録と結果は残したまま、まだ答えていない問題から1問目として数え直す（restart）。
 */
export function SessionCounter({
  index = 0,
  // いちばん先まで進んだ位置（答えた問題のうち最も後ろ・いま表示中のどちらか遠いほう）。
  // 前へ戻って見直している途中でも、答えた問題をデッキから落とさないために使う。
  reached = index,
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
  // 在庫より多い選択肢は出さず、最後に「全部」を置く。
  const options = [
    ...SESSION_SIZE_OPTIONS.filter((size) => !pool || size < pool),
    SESSION_SIZE_ALL,
  ]
  const storedSize = Math.floor(Number(stored))
  // 「全部」は0で保存する。以前の設定で在庫数ちょうどが入っている場合も全部として扱う。
  const showsAll = storedSize === SESSION_SIZE_ALL || (pool != null && storedSize >= pool)
  const current = showsAll ? SESSION_SIZE_ALL : normalizeSessionSize(stored, pool ?? Infinity)

  const closeSheet = () => setOpen(false)

  const choose = (size) => {
    // 教材ごとの在庫数で組み直す（全部＝その教材の在庫すべて）。
    const resolvedSize = size === SESSION_SIZE_ALL ? (pool ?? SESSION_SIZE_ALL) : size
    setSetting('sessionSize', size)
    closeSheet()
    // いまの番号より少なくしても、答えた分は消さない。番号だけを1から数え直す。
    onResize?.(resolvedSize, { restart: resolvedSize <= Math.max(index, reached) })
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
        <div className="space-y-4 pb-2">
          <p className="text-xs font-bold leading-relaxed text-ink/50" data-session-size-restart-note>
            この問題数は、すべての暗記・テストに使われます。
            今の番号より少なくしても、答えた分の記録と結果はそのまま残り、番号だけを1から数え直します。
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
      </Sheet>
    </>
  )
}
