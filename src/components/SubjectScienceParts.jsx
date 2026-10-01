// 理科の図解（SubjectBiologyDiagrams.jsx・SubjectChemistryDiagrams.jsx・SubjectPhysicsDiagrams.jsx・SubjectEarthDiagrams.jsx）の部品。
// 文字は地図と同じ Halo で描くので、読みがなの辞書にある語には上に小さく読みがなが付く（白いふちどりで、線や色の上でも読める）。
import { Halo } from './SubjectMapFigures.jsx'
import { tokenizeSubjectText } from '../lib/subjectText.js'

export const INK = '#1f2937'
export const LINE = '#475569'
export const MUTED = '#64748b'
export const WATER = '#bae6fd'
export const GLASS = '#f8fafc'
export const RED = '#b91c1c'
export const GREEN = '#15803d'
export const BLUE = '#1d4ed8'
export const AMBER = '#b45309'

const hasReading = (row) => tokenizeSubjectText(row).some((segment) => segment.reading)

/** 文字。「\n」で行を分ける（行の間は size の1.3倍。2行目より下に読みがなが付く語があれば広げる）。y は1行目の文字の下の線。 */
export function T({ x, y, size = 10, weight = '700', color = INK, anchor = 'start', halo = '#ffffff', italic = false, gap, children }) {
  const rows = String(children ?? '').split('\n')
  const step = gap ?? (rows.slice(1).some(hasReading) ? size * 1.8 : size * 1.3)
  return rows.map((row, index) => (
    <Halo key={`${index}-${row}`} x={x} y={y + index * step} u={1} size={size} weight={weight} color={color} anchor={anchor} haloColor={halo} italic={italic}>{row}</Halo>
  ))
}

/** 矢印（from から to へ。矢じりは to の点）。 */
export function Arrow({ from, to, color = INK, width = 1.8, head = 7, dashed = false }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const a1 = angle + Math.PI * 0.84
  const a2 = angle - Math.PI * 0.84
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - head * 0.7 * Math.cos(angle)} y2={y2 - head * 0.7 * Math.sin(angle)} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '4 3' : undefined} />
      <path d={`M${x2},${y2} L${x2 + head * Math.cos(a1)},${y2 + head * Math.sin(a1)} L${x2 + head * Math.cos(a2)},${y2 + head * Math.sin(a2)} Z`} fill={color} />
    </g>
  )
}

/** 曲がった矢印（from から to へ。bend は、線のまん中を進む向きの右へずらす長さ）。 */
export function CurvedArrow({ from, to, bend = 20, color = INK, width = 1.8, head = 7, dashed = false }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const length = Math.hypot(x2 - x1, y2 - y1) || 1
  const cx = (x1 + x2) / 2 + (-(y2 - y1) / length) * bend
  const cy = (y1 + y2) / 2 + ((x2 - x1) / length) * bend
  const angle = Math.atan2(y2 - cy, x2 - cx)
  const a1 = angle + Math.PI * 0.84
  const a2 = angle - Math.PI * 0.84
  const ex = x2 - head * 0.7 * Math.cos(angle)
  const ey = y2 - head * 0.7 * Math.sin(angle)
  return (
    <g>
      <path d={`M${x1},${y1} Q${cx},${cy} ${ex},${ey}`} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? '4 3' : undefined} />
      <path d={`M${x2},${y2} L${x2 + head * Math.cos(a1)},${y2 + head * Math.sin(a1)} L${x2 + head * Math.cos(a2)},${y2 + head * Math.sin(a2)} Z`} fill={color} />
    </g>
  )
}

/** 引き出し線つきの名前。from（部分の点）から to へ線を引き、to の先に文字を置く。 */
export function Callout({ from, to, text, anchor, size = 9.5, color = INK, weight = '700' }) {
  const [x, y] = to
  const side = anchor ?? (to[0] < from[0] ? 'end' : 'start')
  const tx = side === 'end' ? x - 3 : side === 'start' ? x + 3 : x
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} stroke={LINE} strokeWidth="0.8" />
      <circle cx={from[0]} cy={from[1]} r="1.6" fill={LINE} />
      <T x={tx} y={y + size * 0.35} size={size} anchor={side} color={color} weight={weight}>{text}</T>
    </g>
  )
}

/** 丸の中の番号（図の中の手順や場所を、表や流れ図の番号と結びつける）。 */
export function Num({ x, y, n, color = AMBER }) {
  return (
    <g>
      <circle cx={x} cy={y} r="7.5" fill="#ffffff" stroke={color} strokeWidth="1.4" />
      <text x={x} y={y + 3.4} fontSize="9.5" fontWeight="800" textAnchor="middle" fill={color}>{n}</text>
    </g>
  )
}

const PANEL_TONES = Object.freeze({
  gray: { fill: '#f8fafc', stroke: '#cbd5e1', ink: INK },
  blue: { fill: '#eff6ff', stroke: '#93c5fd', ink: '#1e3a8a' },
  green: { fill: '#f0fdf4', stroke: '#86efac', ink: '#14532d' },
  red: { fill: '#fef2f2', stroke: '#fca5a5', ink: '#7f1d1d' },
  amber: { fill: '#fffbeb', stroke: '#fcd34d', ink: '#78350f' },
})

/** 区切りの枠（x・y は左上）。title は枠の左上に書く。 */
export function Panel({ x, y, w, h, title, tone = 'gray', size = 9.5 }) {
  const style = PANEL_TONES[tone] ?? PANEL_TONES.gray
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={style.fill} stroke={style.stroke} strokeWidth="1.2" />
      {title && <T x={x + 7} y={y + size + 5} size={size} weight="800" color={style.ink} halo={style.fill}>{title}</T>}
    </g>
  )
}

/** ガラスの管の道すじ（太い線の中に細い白い線を重ねて、管に見せる）。 */
export function GlassTube({ d, width = 4 }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#64748b" strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#f1f5f9" strokeWidth={width - 2.2} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  )
}

/** 試験管（x は左の線、y は口、h は長さ。口は上。level は液の高さの割合 0〜1）。 */
export function TestTube({ x, y, w = 16, h = 56, liquid, level = 0.4, rotate = 0 }) {
  const r = w / 2
  const bottom = y + h
  const outline = `M${x},${y} L${x},${bottom - r} A${r},${r} 0 0 0 ${x + w},${bottom - r} L${x + w},${y}`
  const top = bottom - (h - 2) * level
  return (
    <g transform={rotate ? `rotate(${rotate} ${x + r} ${y + h / 2})` : undefined}>
      <path d={`${outline} Z`} fill={GLASS} stroke="none" />
      {liquid && <path d={`M${x},${top} L${x},${bottom - r} A${r},${r} 0 0 0 ${x + w},${bottom - r} L${x + w},${top} Z`} fill={liquid} />}
      <path d={outline} fill="none" stroke={LINE} strokeWidth="1.2" />
    </g>
  )
}

/** アルコールランプなどの炎（x・y は炎の下のまん中）。 */
export function Flame({ x, y, size = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M0,0 C-8,-6 -6,-16 0,-26 C6,-16 8,-6 0,0 Z" fill="#fb923c" />
      <path d="M0,-2 C-4,-6 -3,-12 0,-17 C3,-12 4,-6 0,-2 Z" fill="#fde68a" />
    </g>
  )
}

/** 小さな泡。 */
export function Bubbles({ points, r = 2.2, stroke = '#0284c7' }) {
  return points.map(([x, y], index) => <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r={index % 3 === 1 ? r * 0.75 : r} fill="#ffffff" stroke={stroke} strokeWidth="0.8" />)
}

/** 決まった並びの乱数（図を描くたびに同じ形にする）。 */
export function steady(seed) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 2 ** 32
  }
}
