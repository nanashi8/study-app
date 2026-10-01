// 社会・理科の図のうち、データで形を指定して描く図（しくみの図・帯グラフ・時代の帯）。SubjectFigure.jsx から呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。文字は地図と同じ Halo で描くので、読みがなの辞書にある語には
// 上に小さく読みがなが付く（白いふちどりで、線や色の上でも読める）。
//
//   relation … しくみの図（箱と矢印）。{ height, nodes, edges?, frames?, labels? }
//     nodes  … [{ id, x, y, w, h, text, sub?, tone?, size? }]（x・y は箱の中心。text と sub は「\n」で行を分けられる）
//     edges  … [{ from, to, text?, tone?, dashed?, both?, offset?, at?, shift?, via? }]
//               offset … 2本の矢印を並べるときに、線を横へずらす長さ。at … 文字を置く位置（0〜1）。
//               shift … 文字を線から横へずらす長さ（右回りに見て右がプラス）。via … 曲げる点 [[x, y], …]
//     frames … 箱をまとめる枠。[{ x, y, w, h, text?, tone? }]（x・y は左上）
//     labels … 自由に置く文字。[{ x, y, text, size?, tone?, anchor? }]
//   ratio    … 帯グラフ（全体を100とした割合）。{ unit?: '％', rows: [{ label, parts: [[名前, 値], …] }], colors?: { 名前: 色 } }
//   periods  … 時代の帯（長さが年数に比例する帯）。{ rows: [{ label?, from, to, bands: [{ from, to, text, tone?, size?, quiet? }], ticks?: [{ at, text, anchor? }], marks?: [{ at, text, anchor?, level? }], markLevels? }] }
//               帯に入らない名前は帯の外に書く。quiet: true の帯は名前を書かない（細い帯の名前を、しるしで示すとき）。
//               zoom: true の行は、1つ上の行のその範囲を拡大したことを、2本の線で示す。
import { Halo, textWidth } from './SubjectMapFigures.jsx'
import { tokenizeSubjectText } from '../lib/subjectText.js'

const INK = '#1f2937'
const MUTED = '#64748b'

/** 箱・帯の色。fill は塗り、stroke はふち、ink は文字。 */
export const FIGURE_TONES = Object.freeze({
  dark: { fill: '#334155', stroke: '#334155', ink: '#ffffff', sub: '#e2e8f0' },
  light: { fill: '#fef3c7', stroke: '#b45309', ink: '#78350f', sub: '#92400e' },
  blue: { fill: '#dbeafe', stroke: '#1d4ed8', ink: '#1e3a8a', sub: '#1e40af' },
  green: { fill: '#dcfce7', stroke: '#15803d', ink: '#14532d', sub: '#166534' },
  red: { fill: '#fee2e2', stroke: '#b91c1c', ink: '#7f1d1d', sub: '#991b1b' },
  purple: { fill: '#ede9fe', stroke: '#6d28d9', ink: '#4c1d95', sub: '#5b21b6' },
  teal: { fill: '#ccfbf1', stroke: '#0f766e', ink: '#134e4a', sub: '#115e59' },
  gray: { fill: '#f1f5f9', stroke: '#64748b', ink: INK, sub: '#475569' },
  white: { fill: '#ffffff', stroke: '#94a3b8', ink: INK, sub: '#475569' },
})

/** 矢印の色。 */
const EDGE_COLORS = Object.freeze({
  dark: '#334155',
  light: '#b45309',
  blue: '#1d4ed8',
  green: '#15803d',
  red: '#b91c1c',
  purple: '#6d28d9',
  teal: '#0f766e',
  gray: '#64748b',
})

const toneOf = (tone) => FIGURE_TONES[tone] ?? FIGURE_TONES.white
const hasReading = (row) => tokenizeSubjectText(row).some((segment) => segment.reading)
const lines = (text) => String(text ?? '').split('\n').filter((line) => line !== '')

/** 何行かの文字（行の間は size の1.25倍）。cy を行のまとまりの中心にする。 */
function TextLines({ x, cy, text, size, weight = '800', color = INK, anchor = 'middle', haloColor = '#ffffff' }) {
  const rows = lines(text)
  // 2行目より下に読みがなの付く語があるときは、読みがなが上の行にかからないように行の間を広げる。
  const gap = rows.slice(1).some(hasReading) ? size * 1.8 : size * 1.25
  const first = cy - ((rows.length - 1) * gap) / 2 + size * 0.36
  return rows.map((row, index) => (
    <Halo key={`${index}-${row}`} x={x} y={first + index * gap} u={1} size={size} weight={weight} color={color} anchor={anchor} haloColor={haloColor}>{row}</Halo>
  ))
}

/** 箱のふちと、中心から (dx, dy) の向きにのばした線が交わる点。 */
function rectEdge(node, dx, dy, gap = 2) {
  const hw = node.w / 2 + gap
  const hh = node.h / 2 + gap
  if (!dx && !dy) return [node.x, node.y]
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity)
  return [node.x + dx * t, node.y + dy * t]
}

function head(x1, y1, x2, y2, color, size = 7) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const a1 = angle + Math.PI * 0.84
  const a2 = angle - Math.PI * 0.84
  return <path d={`M${x2},${y2} L${x2 + size * Math.cos(a1)},${y2 + size * Math.sin(a1)} L${x2 + size * Math.cos(a2)},${y2 + size * Math.sin(a2)} Z`} fill={color} />
}

/** 矢印の道すじ（箱のふちからふちまで）。offset で線を横にずらす。 */
export function edgePoints(edge, nodes) {
  const a = nodes.get(edge.from)
  const b = nodes.get(edge.to)
  const via = edge.via ?? []
  const firstTarget = via[0] ?? [b.x, b.y]
  const lastSource = via.length ? via[via.length - 1] : [a.x, a.y]
  // ずらす向きは、箱の中心どうしを結ぶ向きに直角（右回りに見て右）。
  const ux = b.x - a.x
  const uy = b.y - a.y
  const len = Math.hypot(ux, uy) || 1
  const ox = (-uy / len) * (edge.offset ?? 0)
  const oy = (ux / len) * (edge.offset ?? 0)
  const start = rectEdge({ ...a, x: a.x + ox, y: a.y + oy }, firstTarget[0] - a.x, firstTarget[1] - a.y)
  const end = rectEdge({ ...b, x: b.x + ox, y: b.y + oy }, lastSource[0] - b.x, lastSource[1] - b.y)
  return [start, ...via, end]
}

/** 道すじの長さの at（0〜1）の位置と、その場所の線の向き。 */
function pointAt(points, at) {
  const segments = points.slice(1).map((point, index) => [points[index], point, Math.hypot(point[0] - points[index][0], point[1] - points[index][1])])
  const total = segments.reduce((sum, [, , length]) => sum + length, 0)
  let rest = total * at
  for (const [index, [p, q, length]] of segments.entries()) {
    if (rest <= length || index === segments.length - 1) {
      const t = length ? Math.min(1, rest / length) : 0
      return { x: p[0] + (q[0] - p[0]) * t, y: p[1] + (q[1] - p[1]) * t, dx: (q[0] - p[0]) / (length || 1), dy: (q[1] - p[1]) / (length || 1) }
    }
    rest -= length
  }
  const [p, q] = segments[segments.length - 1]
  return { x: q[0], y: q[1], dx: q[0] - p[0], dy: q[1] - p[1] }
}

export function RelationFigure({ figure }) {
  const width = figure.width ?? 300
  const nodes = new Map(figure.nodes.map((node) => [node.id, node]))
  return (
    <svg viewBox={`0 0 ${width} ${figure.height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? 'しくみの図'} data-subject-figure-relation>
      {(figure.frames ?? []).map((frame, index) => {
        const tone = toneOf(frame.tone ?? 'gray')
        return (
          <g key={`frame-${index}`}>
            <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} rx="10" fill={tone.fill} fillOpacity="0.55" stroke={tone.stroke} strokeWidth="1.2" strokeDasharray="4 3" />
            {frame.text && <TextLines x={frame.x + 7} cy={frame.y + 11} text={frame.text} size={9.5} color={tone.ink} anchor="start" />}
          </g>
        )
      })}
      {(figure.edges ?? []).map((edge, index) => {
        const color = EDGE_COLORS[edge.tone ?? 'dark'] ?? EDGE_COLORS.dark
        const points = edgePoints(edge, nodes)
        const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
        const [px, py] = points[points.length - 2]
        const [ex, ey] = points[points.length - 1]
        const [sx, sy] = points[0]
        const [nx, ny] = points[1]
        const label = edge.text ? pointAt(points, edge.at ?? 0.5) : null
        // 文字を線から横へずらす（右回りに見て右がプラス）。
        const shift = edge.shift ?? 0
        return (
          <g key={`edge-${index}`}>
            <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeDasharray={edge.dashed ? '5 3' : undefined} strokeLinejoin="round" />
            {head(px, py, ex, ey, color)}
            {edge.both && head(nx, ny, sx, sy, color)}
            {label && <TextLines x={label.x - label.dy * shift} cy={label.y + label.dx * shift} text={edge.text} size={edge.size ?? 9.5} color={color} weight="800" anchor={edge.anchor ?? 'middle'} />}
          </g>
        )
      })}
      {figure.nodes.map((node) => {
        const tone = toneOf(node.tone)
        const size = node.size ?? 12
        const subSize = node.subSize ?? 9.5
        const titleRows = lines(node.text).length
        const subRows = lines(node.sub).length
        const block = titleRows * size * 1.25 + (subRows ? subRows * subSize * 1.25 + 2 : 0)
        const top = node.y - block / 2
        return (
          <g key={node.id}>
            <rect x={node.x - node.w / 2} y={node.y - node.h / 2} width={node.w} height={node.h} rx="8" fill={tone.fill} stroke={tone.stroke} strokeWidth="1.4" />
            <TextLines x={node.x} cy={top + (titleRows * size * 1.25) / 2} text={node.text} size={size} color={tone.ink} haloColor={tone.fill} />
            {subRows > 0 && <TextLines x={node.x} cy={top + titleRows * size * 1.25 + 2 + (subRows * subSize * 1.25) / 2} text={node.sub} size={subSize} color={tone.sub} weight="700" haloColor={tone.fill} />}
          </g>
        )
      })}
      {(figure.labels ?? []).map((label, index) => (
        <TextLines key={`label-${index}`} x={label.x} cy={label.y} text={label.text} size={label.size ?? 9.5} color={EDGE_COLORS[label.tone] ?? (label.tone ? toneOf(label.tone).ink : INK)} weight={label.weight ?? '800'} anchor={label.anchor ?? 'middle'} />
      ))}
    </svg>
  )
}

/** 帯グラフの色（部分の順に使う）。 */
export const RATIO_COLORS = Object.freeze(['#0f766e', '#f59e0b', '#2563eb', '#be123c', '#7c3aed', '#64748b', '#16a34a', '#ea580c'])

export function RatioFigure({ figure }) {
  const unit = figure.unit ?? '％'
  const width = 300
  const labelWidth = figure.labelWidth ?? 58
  const barX = labelWidth
  const barW = width - labelWidth - 4
  const names = [...new Set(figure.rows.flatMap((row) => row.parts.map(([name]) => name)))]
  const colorOf = (name) => figure.colors?.[name] ?? RATIO_COLORS[names.indexOf(name) % RATIO_COLORS.length]
  const format = (value) => `${Number(value).toLocaleString('ja-JP', figure.digits === undefined ? undefined : { minimumFractionDigits: figure.digits, maximumFractionDigits: figure.digits })}${unit}`
  const fontSize = 9.5
  // 帯ごとに、部分の幅と、帯の中に名前と値（入らなければ値だけ）が入るかを決める。入らない部分は、帯の下に名前と値を並べる。
  const layout = figure.rows.map((row) => {
    const total = row.parts.reduce((sum, [, value]) => sum + value, 0) || 1
    let left = barX
    const parts = row.parts.map(([name, value]) => {
      const w = (value / total) * barW
      const x = left
      left += w
      const both = `${name} ${format(value)}`
      const inside = textWidth(both, fontSize) + 6 <= w ? both : textWidth(format(value), fontSize) + 4 <= w ? format(value) : null
      return { name, value, x, w, inside }
    })
    return { row, parts, below: parts.filter((part) => part.inside === null) }
  })
  const heights = layout.map(({ below }) => 30 + (below.length ? 14 : 0))
  const tops = heights.reduce((list, h, index) => [...list, index ? list[index - 1] + heights[index - 1] : 4], [])
  const height = tops.length ? tops[tops.length - 1] + heights[heights.length - 1] + 2 : 4
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '帯グラフ'} data-subject-figure-ratio>
        {layout.map(({ row, parts, below }, rowIndex) => {
          const y = tops[rowIndex]
          return (
            <g key={row.label}>
              <TextLines x={labelWidth - 5} cy={y + 13} text={row.label} size={10} color={INK} anchor="end" />
              {parts.map((part) => {
                const dark = ['#f59e0b', '#16a34a', '#ea580c', '#94a3b8'].includes(colorOf(part.name)) || figure.darkText?.includes(part.name)
                return (
                  <g key={part.name}>
                    <rect x={part.x} y={y + 2} width={Math.max(0, part.w - 0.6)} height={22} fill={colorOf(part.name)} />
                    {part.inside && (
                      <text x={part.x + part.w / 2} y={y + 16.5} textAnchor="middle" fontSize={fontSize} fontWeight="800" fill={dark ? INK : '#ffffff'}>{part.inside}</text>
                    )}
                  </g>
                )
              })}
              {below.length > 0 && (
                <text x={width - 4} y={y + 36} textAnchor="end" fontSize="9" fontWeight="800" fill={INK}>
                  {below.map((part) => `${part.name} ${format(part.value)}`).join('・')}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-bold text-ink/70" data-subject-figure-legend>
        {names.map((name) => (
          <span key={name} className="inline-flex items-center gap-1">
            <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colorOf(name) }} />
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 時代の帯の色（帯の順に使う）。tone で決めることもできる。 */
const PERIOD_COLORS = Object.freeze(['#e0f2fe', '#dcfce7', '#fef3c7', '#fee2e2', '#ede9fe', '#ccfbf1', '#fce7f3', '#f1f5f9'])

export function PeriodsFigure({ figure }) {
  const width = 300
  const left = figure.labelWidth ?? 0
  const right = 6
  const barW = width - left - right - 6
  const rowGap = 16
  // しるしの文字に読みがなの付く語があるときは、読みがなが上の段にかからないように段の間を広げる。
  const markGap = (row) => ((row.marks ?? []).some((mark) => hasReading(mark.text)) ? 18 : 12)
  const markStart = (row) => (row.ticks?.length ? 16 : 4) + ((row.marks ?? []).some((mark) => hasReading(mark.text)) ? 6 : 0)
  // 1行の高さ：帯（26）＋目もりの文字（14）＋しるしの文字（段の数×段の間）。
  const rowHeights = figure.rows.map((row) => 26 + markStart(row) + (row.marks?.length ? (row.markLevels ?? 1) * markGap(row) + 4 : 0))
  const tops = []
  let y = 4
  for (const [index, h] of rowHeights.entries()) {
    if (figure.rows[index].zoom) y += 14
    // 段の名前は帯のすぐ上に置くので、その分あける。
    if (figure.rows[index].label) y += 12
    tops.push(y)
    y += h + rowGap
  }
  const height = y - rowGap + 4
  const scaleOf = (row) => (value) => left + 3 + ((value - row.from) / (row.to - row.from)) * barW
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '時代の帯'} data-subject-figure-periods>
      {figure.rows.map((row, rowIndex) => {
        const sx = scaleOf(row)
        const top = tops[rowIndex]
        const bands = row.bands.map((band, index) => {
          const x1 = sx(Math.max(row.from, band.from))
          const x2 = sx(Math.min(row.to, band.to))
          const tone = band.tone ? toneOf(band.tone) : { fill: PERIOD_COLORS[index % PERIOD_COLORS.length], stroke: '#94a3b8', ink: INK }
          const size = band.size ?? 9.5
          const width = textWidth(lines(band.text)[0] ?? '', size)
          return { ...band, index, x1, x2, tone, size, fits: width + 4 <= x2 - x1, outsideLeft: x1 - 3 - width >= left + 2 }
        })
        const parent = rowIndex > 0 && row.zoom ? figure.rows[rowIndex - 1] : null
        return (
          <g key={`row-${rowIndex}`}>
            {parent && (() => {
              const px = scaleOf(parent)
              const parentBottom = tops[rowIndex - 1] + 26
              return (
                <g>
                  <line x1={px(row.from)} y1={parentBottom} x2={sx(row.from)} y2={top} stroke={MUTED} strokeDasharray="3 2" />
                  <line x1={px(row.to)} y1={parentBottom} x2={sx(row.to)} y2={top} stroke={MUTED} strokeDasharray="3 2" />
                </g>
              )
            })()}
            {row.label && <TextLines x={left + 3} cy={top - 6} text={row.label} size={9} color={MUTED} anchor="start" />}
            {/* 帯の色 → しるしの線 → 帯の文字の順にかき、しるしの線が帯の文字を横切らないようにする。 */}
            {bands.map((band) => <rect key={`rect-${band.index}`} x={band.x1} y={top} width={Math.max(0.5, band.x2 - band.x1)} height={26} fill={band.tone.fill} stroke={band.tone.stroke} strokeWidth="0.8" />)}
            {(row.marks ?? []).map((mark, markIndex) => {
              const markTop = top + 26 + markStart(row) + (mark.level ?? 0) * markGap(row)
              // 目もりの文字の高さ（帯の下の4〜16）は線を切って、線が年の文字を横切らないようにする。
              const gapFrom = row.ticks?.length ? top + 29 : null
              const gapTo = row.ticks?.length ? top + 26 + 16 : null
              return gapFrom === null
                ? <line key={`markline-${markIndex}`} x1={sx(mark.at)} y1={top} x2={sx(mark.at)} y2={markTop + 2} stroke="#be123c" strokeWidth="1.2" />
                : (
                  <g key={`markline-${markIndex}`}>
                    <line x1={sx(mark.at)} y1={top} x2={sx(mark.at)} y2={gapFrom} stroke="#be123c" strokeWidth="1.2" />
                    <line x1={sx(mark.at)} y1={gapTo} x2={sx(mark.at)} y2={markTop + 2} stroke="#be123c" strokeWidth="1.2" />
                  </g>
                )
            })}
            {bands.filter((band) => !band.quiet).map((band) => (
              // 帯に入らない名前は、帯の左（あいていなければ右）に書く。quiet の帯は、しるしで名前を示すので書かない。
              <TextLines
                key={`text-${band.index}`}
                x={band.fits ? (band.x1 + band.x2) / 2 : band.outsideLeft ? band.x1 - 3 : band.x2 + 3}
                cy={top + 13}
                text={band.text}
                size={band.size}
                color={band.fits ? band.tone.ink : INK}
                anchor={band.fits ? 'middle' : band.outsideLeft ? 'end' : 'start'}
              />
            ))}
            {(row.ticks ?? []).map((tick) => (
              <g key={`tick-${tick.at}`}>
                <line x1={sx(tick.at)} y1={top + 26} x2={sx(tick.at)} y2={top + 30} stroke={MUTED} />
                <text x={sx(tick.at)} y={top + 39} textAnchor={tick.anchor ?? 'middle'} fontSize="9" fontWeight="700" fill={MUTED}>{tick.text}</text>
              </g>
            ))}
            {(row.marks ?? []).map((mark, markIndex) => {
              const markTop = top + 26 + markStart(row) + (mark.level ?? 0) * markGap(row)
              return <TextLines key={`mark-${markIndex}`} x={sx(mark.at)} cy={markTop + 7} text={mark.text} size={9} color="#be123c" anchor={mark.anchor ?? 'middle'} />
            })}
          </g>
        )
      })}
    </svg>
  )
}
