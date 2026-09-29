import { MATH_VISUAL_COLORS } from '../lib/mathVisualColors.js'

// 入試演習の問題の図。問題のデータに書いた座標から、図形・グラフを SVG で描く（縦横の縮尺は同じ）。
//
//   figure = {
//     label,                          // 図の説明（読み上げ用）
//     size: [幅, 高さ],               // 既定 [320, 220]
//     view: [xmin, xmax, ymin, ymax], // 描く範囲（数学の座標。y は上向き）
//     axes?: { x: 'x', y: 'y' },      // 座標軸（原点 O も書く）
//     points: { A: [x, y], … },       // 名前つきの点
//     hide?: ['P'],                   // 点の印と名前を描かない点（線の端に使うだけの点）
//     labels?: { A: 'ne' },           // 名前の置き場所（n ne e se s sw w nw。既定は図の中心から遠ざかる向き）
//     segments?: [['A', 'B'], ['B', 'C', { dash: true }]],
//     polygons?: [{ pts: ['A', 'B', 'C'], fill: true }],
//     lines?: [{ through: ['A', 'B'] }],        // 両側へのびる直線
//     circles?: [{ c: 'O', r: 3 }],             // r は数学の座標の長さ
//     ellipses?: [{ c: [x, y], rx, ry, dash? }],// 立体の底面など
//     arcs?: [{ c: 'O', r, from, to, sector? }],// 角度（度）。sector で扇形にぬる
//     curves?: [{ fn: (x) => y, from, to, label?, at? }],
//     angles?: [{ at: 'B', from: 'A', to: 'C', label?, r? }],
//     rights?: [{ at: 'H', from: 'A', to: 'B' }],
//     ticks?: [{ seg: ['A', 'B'], n: 1 }],      // 同じ長さの印
//     texts?: [{ at: [x, y] | ['A', 'B'], text, dx?, dy? }], // ['A','B'] は線分の中点の外側
//     dots?: [[x, y], …],                      // 名前のない点（散布図など）
//   }
const { ink: INK, muted: MUTED, grid: GRID } = MATH_VISUAL_COLORS
const ACCENT = '#6d28d9'
const FILL = '#ede9fe'
const PAD = 22

const DIRECTIONS = Object.freeze({
  n: [0, -1], ne: [0.8, -0.8], e: [1, 0], se: [0.8, 0.8], s: [0, 1], sw: [-0.8, 0.8], w: [-1, 0], nw: [-0.8, -0.8],
})

/** 図の座標を SVG の座標へ移す関数と、縮尺を返す。stretch のときだけ縦と横の縮尺を別にする（ヒストグラムなど）。 */
export function figureProjection(figure) {
  const [width, height] = figure.size ?? [320, 220]
  const [xmin, xmax, ymin, ymax] = figure.view
  const fitX = (width - 2 * PAD) / (xmax - xmin)
  const fitY = (height - 2 * PAD) / (ymax - ymin)
  const scaleX = figure.stretch ? fitX : Math.min(fitX, fitY)
  const scaleY = figure.stretch ? fitY : Math.min(fitX, fitY)
  const offsetX = (width - scaleX * (xmax - xmin)) / 2
  const offsetY = (height - scaleY * (ymax - ymin)) / 2
  const toSvg = ([x, y]) => [offsetX + (x - xmin) * scaleX, height - offsetY - (y - ymin) * scaleY]
  return { width, height, scale: scaleX, toSvg }
}

const round = (value) => Math.round(value * 100) / 100
const pathOf = (points) => points.map(([x, y], index) => `${index ? 'L' : 'M'}${round(x)},${round(y)}`).join(' ')

function Label({ x, y, children, size = 13, anchor = 'middle', weight = 800, fill = INK }) {
  return (
    <text
      x={round(x)}
      y={round(y)}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      fontFamily="system-ui, sans-serif"
      paintOrder="stroke"
      stroke="#ffffff"
      strokeWidth={3}
      strokeLinejoin="round"
    >
      {children}
    </text>
  )
}

export function MathExamFigure({ figure, className = '' }) {
  if (!figure) return null
  const { width, height, scale, toSvg } = figureProjection(figure)
  const points = figure.points ?? {}
  const at = (ref) => (Array.isArray(ref) ? ref : points[ref])
  const svgAt = (ref) => toSvg(at(ref))
  const [xmin, xmax, ymin, ymax] = figure.view
  const named = Object.entries(points).filter(([name]) => !(figure.hide ?? []).includes(name))
  // 名前を置く向きの既定：点全体の中心から遠ざかる向き。
  const center = named.length
    ? named.reduce(([sx, sy], [, [x, y]]) => [sx + x / named.length, sy + y / named.length], [0, 0])
    : [0, 0]

  const labelOffset = (name) => {
    const chosen = figure.labels?.[name]
    if (Array.isArray(chosen)) return chosen
    if (chosen && DIRECTIONS[chosen]) return DIRECTIONS[chosen].map((value) => value * 13)
    const [x, y] = points[name]
    const dx = x - center[0]
    const dy = -(y - center[1])
    const length = Math.hypot(dx, dy)
    if (length < 1e-9) return [0, -13]
    return [(dx / length) * 13, (dy / length) * 13]
  }

  const curvePaths = (curve) => {
    const from = curve.from ?? xmin
    const to = curve.to ?? xmax
    const steps = 160
    const pieces = []
    let current = []
    for (let step = 0; step <= steps; step += 1) {
      const x = from + ((to - from) * step) / steps
      const y = curve.fn(x)
      const inside = Number.isFinite(y) && y >= ymin - (ymax - ymin) * 0.05 && y <= ymax + (ymax - ymin) * 0.05
      if (inside) current.push(toSvg([x, y]))
      else if (current.length) {
        pieces.push(current)
        current = []
      }
    }
    if (current.length) pieces.push(current)
    return pieces.filter((piece) => piece.length > 1).map(pathOf)
  }

  const lineThrough = ([p, q]) => {
    const [x1, y1] = at(p)
    const [x2, y2] = at(q)
    const dx = x2 - x1
    const dy = y2 - y1
    const span = 4 * Math.max(xmax - xmin, ymax - ymin)
    const length = Math.hypot(dx, dy) || 1
    return [
      toSvg([x1 - (dx / length) * span, y1 - (dy / length) * span]),
      toSvg([x1 + (dx / length) * span, y1 + (dy / length) * span]),
    ]
  }

  const angleMark = ({ at: vertex, from, to, label, r = 16 }, index) => {
    const [vx, vy] = svgAt(vertex)
    const [ax, ay] = svgAt(from)
    const [bx, by] = svgAt(to)
    const a1 = Math.atan2(ay - vy, ax - vx)
    const a2 = Math.atan2(by - vy, bx - vx)
    let sweep = a2 - a1
    while (sweep <= -Math.PI) sweep += 2 * Math.PI
    while (sweep > Math.PI) sweep -= 2 * Math.PI
    const start = [vx + r * Math.cos(a1), vy + r * Math.sin(a1)]
    const end = [vx + r * Math.cos(a1 + sweep), vy + r * Math.sin(a1 + sweep)]
    const middle = a1 + sweep / 2
    const labelR = r + 12
    return (
      <g key={`angle-${index}`}>
        <path
          d={`M${round(start[0])},${round(start[1])} A${r},${r} 0 0 ${sweep > 0 ? 1 : 0} ${round(end[0])},${round(end[1])}`}
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.6}
        />
        {label && <Label x={vx + labelR * Math.cos(middle)} y={vy + labelR * Math.sin(middle)} size={11} fill={ACCENT}>{label}</Label>}
      </g>
    )
  }

  const rightMark = ({ at: vertex, from, to }, index) => {
    const [vx, vy] = svgAt(vertex)
    const unit = (ref) => {
      const [x, y] = svgAt(ref)
      const length = Math.hypot(x - vx, y - vy) || 1
      return [(x - vx) / length, (y - vy) / length]
    }
    const [ux, uy] = unit(from)
    const [wx, wy] = unit(to)
    const size = 9
    const p1 = [vx + ux * size, vy + uy * size]
    const p2 = [vx + (ux + wx) * size, vy + (uy + wy) * size]
    const p3 = [vx + wx * size, vy + wy * size]
    return <path key={`right-${index}`} d={pathOf([p1, p2, p3])} fill="none" stroke={ACCENT} strokeWidth={1.4} />
  }

  const tickMark = ({ seg: [p, q], n = 1 }, index) => {
    const [x1, y1] = svgAt(p)
    const [x2, y2] = svgAt(q)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const length = Math.hypot(x2 - x1, y2 - y1) || 1
    const [ux, uy] = [(x2 - x1) / length, (y2 - y1) / length]
    const [nx, ny] = [-uy, ux]
    return (
      <g key={`tick-${index}`}>
        {Array.from({ length: n }, (_, k) => {
          const shift = (k - (n - 1) / 2) * 4
          const cx = mx + ux * shift
          const cy = my + uy * shift
          return <path key={k} d={pathOf([[cx - nx * 5, cy - ny * 5], [cx + nx * 5, cy + ny * 5]])} stroke={ACCENT} strokeWidth={1.6} />
        })}
      </g>
    )
  }

  const textAt = ({ at: where, text, dx = 0, dy = 0, size = 12 }, index) => {
    let x
    let y
    if (Array.isArray(where) && typeof where[0] !== 'number') {
      // 線分の中点から、図の中心と反対側へ少し離して置く。
      const [x1, y1] = svgAt(where[0])
      const [x2, y2] = svgAt(where[1])
      const [cx, cy] = toSvg(center)
      const mx = (x1 + x2) / 2
      const my = (y1 + y2) / 2
      const length = Math.hypot(x2 - x1, y2 - y1) || 1
      let [nx, ny] = [-(y2 - y1) / length, (x2 - x1) / length]
      if ((mx - cx) * nx + (my - cy) * ny < 0) [nx, ny] = [-nx, -ny]
      x = mx + nx * 12
      y = my + ny * 12
    } else {
      ;[x, y] = toSvg(where)
    }
    return <Label key={`text-${index}`} x={x + dx} y={y + dy} size={size} weight={700}>{text}</Label>
  }

  const axes = figure.axes
  const origin = toSvg([0, 0])
  const [axisLeft] = toSvg([xmin, 0])
  const [axisRight] = toSvg([xmax, 0])
  const [, axisBottom] = toSvg([0, ymin])
  const [, axisTop] = toSvg([0, ymax])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={figure.label}
      className={className || 'mx-auto block h-auto w-full max-w-sm'}
      data-math-exam-figure
    >
      <defs>
        <marker id="math-exam-axis-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={MUTED} />
        </marker>
      </defs>
      <rect x="0" y="0" width={width} height={height} rx="14" fill="#ffffff" />

      {axes && (
        <g>
          {figure.grid && Array.from({ length: Math.floor(xmax) - Math.ceil(xmin) + 1 }, (_, k) => Math.ceil(xmin) + k)
            .filter((x) => x !== 0)
            .map((x) => {
              const [sx] = toSvg([x, 0])
              return <path key={`gx-${x}`} d={`M${round(sx)},${round(axisTop)} L${round(sx)},${round(axisBottom)}`} stroke={GRID} strokeWidth={1} />
            })}
          {figure.grid && Array.from({ length: Math.floor(ymax) - Math.ceil(ymin) + 1 }, (_, k) => Math.ceil(ymin) + k)
            .filter((y) => y !== 0)
            .map((y) => {
              const [, sy] = toSvg([0, y])
              return <path key={`gy-${y}`} d={`M${round(axisLeft)},${round(sy)} L${round(axisRight)},${round(sy)}`} stroke={GRID} strokeWidth={1} />
            })}
          <path d={`M${round(axisLeft)},${round(origin[1])} L${round(axisRight)},${round(origin[1])}`} stroke={MUTED} strokeWidth={1.3} markerEnd="url(#math-exam-axis-arrow)" />
          <path d={`M${round(origin[0])},${round(axisBottom)} L${round(origin[0])},${round(axisTop)}`} stroke={MUTED} strokeWidth={1.3} markerEnd="url(#math-exam-axis-arrow)" />
          <Label x={axisRight - 4} y={origin[1] + 12} size={12} fill={MUTED}>{axes.x ?? 'x'}</Label>
          <Label x={origin[0] + 12} y={axisTop + 4} size={12} fill={MUTED}>{axes.y ?? 'y'}</Label>
          {!points.O && <Label x={origin[0] - 9} y={origin[1] + 11} size={12} fill={MUTED}>O</Label>}
        </g>
      )}

      {(figure.polygons ?? []).map((polygon, index) => (
        <path
          key={`polygon-${index}`}
          d={`${pathOf(polygon.pts.map(svgAt))} Z`}
          fill={polygon.fill ? FILL : 'none'}
          stroke={polygon.stroke === false ? 'none' : INK}
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeDasharray={polygon.dash ? '5 4' : undefined}
        />
      ))}

      {(figure.arcs ?? []).map((arc, index) => {
        const [cx, cy] = svgAt(arc.c)
        const r = arc.r * scale
        const a1 = (-arc.from * Math.PI) / 180
        const a2 = (-arc.to * Math.PI) / 180
        const start = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)]
        const end = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)]
        const large = Math.abs(arc.to - arc.from) > 180 ? 1 : 0
        const d = `M${round(start[0])},${round(start[1])} A${round(r)},${round(r)} 0 ${large} 0 ${round(end[0])},${round(end[1])}`
        return arc.sector
          ? <path key={`arc-${index}`} d={`M${round(cx)},${round(cy)} L${round(start[0])},${round(start[1])} A${round(r)},${round(r)} 0 ${large} 0 ${round(end[0])},${round(end[1])} Z`} fill={FILL} stroke={INK} strokeWidth={1.8} />
          : <path key={`arc-${index}`} d={d} fill="none" stroke={INK} strokeWidth={1.8} strokeDasharray={arc.dash ? '5 4' : undefined} />
      })}

      {(figure.circles ?? []).map((circle, index) => {
        const [cx, cy] = svgAt(circle.c)
        const r = (circle.through
          ? Math.hypot(at(circle.through)[0] - at(circle.c)[0], at(circle.through)[1] - at(circle.c)[1])
          : circle.r) * scale
        return <circle key={`circle-${index}`} cx={round(cx)} cy={round(cy)} r={round(r)} fill="none" stroke={INK} strokeWidth={1.8} />
      })}

      {(figure.ellipses ?? []).map((ellipse, index) => {
        const [cx, cy] = svgAt(ellipse.c)
        return (
          <ellipse
            key={`ellipse-${index}`}
            cx={round(cx)}
            cy={round(cy)}
            rx={round(ellipse.rx * scale)}
            ry={round(ellipse.ry * scale)}
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeDasharray={ellipse.dash ? '5 4' : undefined}
          />
        )
      })}

      {(figure.lines ?? []).map((line, index) => {
        const [p, q] = lineThrough(line.through)
        return <path key={`line-${index}`} d={pathOf([p, q])} stroke={line.color ?? '#0369a1'} strokeWidth={1.8} />
      })}

      {(figure.curves ?? []).map((curve, index) => (
        <g key={`curve-${index}`}>
          {curvePaths(curve).map((d, piece) => (
            <path key={piece} d={d} fill="none" stroke={ACCENT} strokeWidth={2.2} strokeLinejoin="round" />
          ))}
          {curve.label && curve.at && (() => {
            const [lx, ly] = toSvg([curve.at, curve.fn(curve.at)])
            return <Label x={lx + 6} y={ly - 12} size={12} anchor="start" fill={ACCENT}>{curve.label}</Label>
          })()}
        </g>
      ))}

      {(figure.segments ?? []).map(([p, q, options = {}], index) => (
        <path
          key={`segment-${index}`}
          d={pathOf([svgAt(p), svgAt(q)])}
          stroke={INK}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray={options.dash ? '5 4' : undefined}
        />
      ))}

      {(figure.rights ?? []).map(rightMark)}
      {(figure.angles ?? []).map(angleMark)}
      {(figure.ticks ?? []).map(tickMark)}
      {(figure.texts ?? []).map(textAt)}

      {(figure.dots ?? []).map((dot, index) => {
        const [x, y] = toSvg(dot)
        return <circle key={`dot-${index}`} cx={round(x)} cy={round(y)} r={3.2} fill={ACCENT} />
      })}

      {named.map(([name]) => {
        const [x, y] = svgAt(name)
        const [dx, dy] = labelOffset(name)
        return (
          <g key={`point-${name}`}>
            <circle cx={round(x)} cy={round(y)} r={2.6} fill={INK} />
            <Label x={x + dx} y={y + dy}>{name}</Label>
          </g>
        )
      })}
    </svg>
  )
}
