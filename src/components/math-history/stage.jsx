import { MATH_VISUAL_COLORS } from '../../lib/mathVisualColors.js'

// 数学の歴史の話の「動かしてみよう」の図で共通に使う、SVG の舞台と文字。どの図も 360×220（高さは変えられる）。

export const {
  ink: INK,
  muted: MUTED,
  grid: GRID,
  paper: PAPER,
  good: GOOD,
  warm: WARM,
  rose: ROSE,
} = MATH_VISUAL_COLORS

export const num = (value) => Number(value)
export const BLUE = '#1d4ed8'

/** 話の色と同じになるときは別の色にかえる（同じ図の中の2つのものを色で見分けられるように）。 */
export const apart = (color, tone, fallback) => (color === tone ? fallback : tone)

export function Stage({ label, markerId, color, children, height = 220 }) {
  return (
    <svg
      viewBox={`0 0 360 ${height}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full"
    >
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={color} />
        </marker>
        <marker id={`${markerId}-warm`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={WARM} />
        </marker>
        <marker id={`${markerId}-muted`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={MUTED} />
        </marker>
      </defs>
      {children}
    </svg>
  )
}

export function SvgText({ x, y, children, anchor = 'middle', size = 11, weight = 700, fill = INK }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      fontFamily="system-ui, sans-serif"
    >
      {children}
    </text>
  )
}
