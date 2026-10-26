// 品詞バッジ。単語まわりの部品（WordBits.jsx）と、似た語の欄（LookalikeOrigins.jsx）が使う。
import { cx } from './ui.jsx'

const POS_COLORS = {
  動: '#6366f1', 名: '#0ea5e9', 形: '#f59e0b', 副: '#10b981',
  前: '#8b5cf6', 接: '#ec4899', 代: '#14b8a6',
}

export function PosBadge({ pos, className = '' }) {
  if (!pos) return null // 品詞を決めていない自作カード
  const color = POS_COLORS[pos] ?? '#6366f1'
  return (
    <span
      className={cx('inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-extrabold', className)}
      style={{ backgroundColor: `${color}1f`, color }}
    >
      {pos}
    </span>
  )
}
