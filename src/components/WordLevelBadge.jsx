import { getLevel } from '../data/levels.js'

// 単語カードの見出しの行（品詞の隣）に置く英検の級の印。一覧の行そのものが button なので、押せない span で出す。
// marks には画面ごとの data-* 属性を渡す。
export function WordLevelBadge({ word, marks = {} }) {
  const level = getLevel(word.level)
  return (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
      style={{ backgroundColor: `${level.color}1a`, color: level.color }}
      data-word-level-badge={word.id}
      {...marks}
    >
      {level.label}
    </span>
  )
}
