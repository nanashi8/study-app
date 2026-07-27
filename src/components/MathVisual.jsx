import { MATH_VISUAL_COLORS, readableMathAccent } from '../lib/mathVisualColors.js'

const {
  ink: INK,
  muted: MUTED,
  grid: GRID,
  paper: PAPER,
  good: GOOD,
  warm: WARM,
  rose: ROSE,
} = MATH_VISUAL_COLORS

const n = (value) => Number(value)
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const rad = (degrees) => degrees * Math.PI / 180
const point = (cx, cy, radius, degrees) => ({
  x: cx + radius * Math.cos(rad(degrees)),
  y: cy - radius * Math.sin(rad(degrees)),
})

function Stage({ label, markerId, color, children }) {
  return (
    <svg
      viewBox="0 0 360 220"
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
        <marker id={`${markerId}-rose`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={ROSE} />
        </marker>
        <marker id={`${markerId}-muted`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={MUTED} />
        </marker>
        <pattern id={`${markerId}-grid`} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M18 0H0V18" fill="none" stroke={GRID} strokeWidth="1" />
        </pattern>
      </defs>
      {children}
    </svg>
  )
}

function SvgText({ x, y, children, anchor = 'middle', size = 11, weight = 700, fill = INK }) {
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

function NumberScene({ variant, values, color, markerId, label }) {
  if (variant === 'signed-add') {
    const start = -3
    const end = start + n(values.b)
    const x = (value) => 28 + ((value + 10) / 20) * 304
    const startX = x(start)
    const endX = x(end)
    const middleX = (startX + endX) / 2
    const curveY = 72 - Math.min(24, Math.abs(endX - startX)) / 3
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <line x1="28" y1="130" x2="332" y2="130" stroke={INK} strokeWidth="2" />
        {Array.from({ length: 21 }, (_, i) => i - 10).map((value) => (
          <g key={value}>
            <line x1={x(value)} y1="124" x2={x(value)} y2="136" stroke={value === 0 ? INK : MUTED} strokeWidth={value === 0 ? 2 : 1} />
            {value % 2 === 0 && <SvgText x={x(value)} y="151" size={9} fill={MUTED}>{value}</SvgText>}
          </g>
        ))}
        <path
          data-number-motion="signed-add"
          data-start-x={startX}
          data-end-x={endX}
          d={`M ${startX} 108 Q ${middleX} ${curveY} ${endX} 108`}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          markerEnd={start === end ? undefined : `url(#${markerId})`}
          className="transition-all duration-300"
        />
        <circle cx={x(start)} cy="130" r="7" fill={PAPER} stroke={INK} strokeWidth="3" />
        <circle cx={x(end)} cy="130" r="8" fill={color} />
        <SvgText x={x(start)} y="177" size={12}>開始 -3</SvgText>
        <SvgText x={x(end)} y="94" size={13} fill={color}>{end}</SvgText>
      </Stage>
    )
  }

  if (variant === 'absolute') {
    const value = n(values.x)
    const x = (v) => 35 + ((v + 6) / 12) * 290
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <line x1="35" y1="120" x2="325" y2="120" stroke={INK} strokeWidth="2" />
        {Array.from({ length: 13 }, (_, i) => i - 6).map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} y1="113" x2={x(tick)} y2="127" stroke={tick === 0 ? INK : MUTED} strokeWidth={tick === 0 ? 3 : 1} />
            <SvgText x={x(tick)} y="144" size={9} fill={MUTED}>{tick}</SvgText>
          </g>
        ))}
        <line x1={x(0)} y1="88" x2={x(value)} y2="88" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <line x1={x(0)} y1="78" x2={x(0)} y2="98" stroke={color} strokeWidth="2" />
        <line x1={x(value)} y1="78" x2={x(value)} y2="98" stroke={color} strokeWidth="2" />
        <circle cx={x(value)} cy="120" r="9" fill={color} />
        <SvgText x={(x(0) + x(value)) / 2} y="68" size={13} fill={color}>距離 {Math.abs(value)}</SvgText>
        <SvgText x="180" y="184" size={12}>符号ではなく、0からの長さを見る</SvgText>
      </Stage>
    )
  }

  if (variant === 'square-root') {
    const area = n(values.n)
    const root = Math.sqrt(area)
    const side = 38 + root * 17
    const xScale = (v) => 186 + (v / 4) * 142
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <rect x={92 - side / 2} y={112 - side / 2} width={side} height={side} rx="6" fill={`${color}28`} stroke={color} strokeWidth="3" className="transition-all duration-300" />
        <SvgText x="92" y="108" size={16} fill={color}>面積 {area}</SvgText>
        <SvgText x="92" y={122 + side / 2} size={12}>一辺 √{area}</SvgText>
        <line x1="186" y1="154" x2="328" y2="154" stroke={INK} strokeWidth="2" />
        {[0, 1, 2, 3, 4].map((tick) => (
          <g key={tick}>
            <line x1={xScale(tick)} y1="148" x2={xScale(tick)} y2="160" stroke={MUTED} />
            <SvgText x={xScale(tick)} y="175" size={10} fill={MUTED}>{tick}</SvgText>
          </g>
        ))}
        <circle cx={xScale(root)} cy="154" r="8" fill={color} className="transition-all duration-300" />
        <SvgText x={xScale(root)} y="132" size={12} fill={color}>√{area}</SvgText>
        <SvgText x="257" y="44" size={12}>一辺 × 一辺 = 面積</SvgText>
      </Stage>
    )
  }

  const level = n(values.level)
  const distance = 10 ** -(level + 1)
  const currentX = 1 + distance
  const sx = (v) => 35 + ((v + 1) / 4) * 290
  const sy = (v) => 186 - ((v + 0.5) / 4) * 145
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <GraphAxes xMin={-1} xMax={3} yMin={-0.5} yMax={3.5} sx={sx} sy={sy} />
      <path d={plotPath((x) => x + 1, -1, 3, -0.5, 3.5, sx, sy)} fill="none" stroke={color} strokeWidth="4" />
      <circle cx={sx(1)} cy={sy(2)} r="8" fill={PAPER} stroke={color} strokeWidth="3" />
      <circle cx={sx(currentX)} cy={sy(currentX + 1)} r="7" fill={WARM} />
      <line x1={sx(currentX)} y1={sy(currentX + 1)} x2={sx(1)} y2={sy(currentX + 1)} stroke={WARM} strokeDasharray="4 4" />
      <SvgText x={sx(1) - 13} y={sy(2) - 14} anchor="end" size={11}>穴 (1, 2)</SvgText>
      <SvgText x="180" y="205" size={11} fill={MUTED}>点は穴に触れなくても、限りなく近づける</SvgText>
    </Stage>
  )
}

function BalanceScene({ values, color, markerId, label }) {
  const step = n(values.step)
  const leftX = step < 2 ? 2 : 1
  const leftDots = step === 0 ? 3 : 0
  const rightDots = step === 0 ? 9 : step === 1 ? 6 : 3
  const drawItems = (cx, xCount, dotCount) => {
    const items = []
    for (let i = 0; i < xCount; i++) {
      items.push(
        <g key={`x-${i}`}>
          <rect x={cx - (xCount * 23 + dotCount * 10) / 2 + i * 23} y="78" width="20" height="30" rx="4" fill={`${color}2f`} stroke={color} strokeWidth="2" />
          <SvgText x={cx - (xCount * 23 + dotCount * 10) / 2 + i * 23 + 10} y="94" size={12} fill={color}>x</SvgText>
        </g>,
      )
    }
    for (let i = 0; i < dotCount; i++) {
      items.push(<circle key={`d-${i}`} cx={cx - (xCount * 23 + dotCount * 10) / 2 + xCount * 23 + i * 10 + 5} cy="94" r="4" fill={WARM} />)
    }
    return items
  }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="65" y1="118" x2="295" y2="118" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <line x1="180" y1="118" x2="180" y2="168" stroke={INK} strokeWidth="4" />
      <path d="M150 184H210L180 164Z" fill={`${color}22`} stroke={INK} strokeWidth="2" />
      <line x1="92" y1="118" x2="92" y2="138" stroke={MUTED} strokeWidth="2" />
      <line x1="268" y1="118" x2="268" y2="138" stroke={MUTED} strokeWidth="2" />
      <path d="M45 138H139L128 156H56Z" fill={PAPER} stroke={MUTED} strokeWidth="2" />
      <path d="M221 138H315L304 156H232Z" fill={PAPER} stroke={MUTED} strokeWidth="2" />
      {drawItems(92, leftX, leftDots)}
      {drawItems(268, 0, rightDots)}
      <SvgText x="92" y="49" size={15} fill={color}>{['2x + 3', '2x', 'x'][step]}</SvgText>
      <SvgText x="268" y="49" size={15} fill={WARM}>{[9, 6, 3][step]}</SvgText>
      <SvgText x="180" y="207" size={11} fill={MUTED}>左右へ同じ操作 → つり合いは変わらない</SvgText>
    </Stage>
  )
}

function AlgebraScene({ variant, values, color, markerId, label }) {
  if (variant === 'groups') {
    const value = n(values.x)
    return (
      <Stage label={label} markerId={markerId} color={color}>
        {[0, 1, 2].map((group) => {
          const gx = 26 + group * 112
          return (
            <g key={group}>
              <rect x={gx} y="58" width="96" height="105" rx="14" fill={`${color}12`} stroke={color} strokeWidth="2" strokeDasharray="5 4" />
              <rect x={gx + 12} y="78" width={24 + value * 9} height="34" rx="6" fill={`${color}35`} stroke={color} strokeWidth="2" />
              <SvgText x={gx + 24 + value * 4.5} y="96" size={13} fill={color}>x = {value}</SvgText>
              <circle cx={gx + 30} cy="137" r="8" fill={WARM} />
              <circle cx={gx + 58} cy="137" r="8" fill={WARM} />
              <SvgText x={gx + 48} y="183" size={11}>x + 2 = {value + 2}</SvgText>
            </g>
          )
        })}
      </Stage>
    )
  }

  if (variant === 'combine') {
    const k = n(values.k)
    const drawXTiles = (count, y, prefix) => Array.from({ length: Math.abs(count) }, (_, i) => (
      <g key={`${prefix}-${i}`}>
        <rect
          x={42 + i * 34}
          y={y}
          width="27"
          height="36"
          rx="5"
          fill={count >= 0 ? `${color}35` : `${ROSE}25`}
          stroke={count >= 0 ? color : ROSE}
          strokeWidth="2"
          strokeDasharray={count >= 0 ? undefined : '4 3'}
        />
        <SvgText x={55.5 + i * 34} y={y + 19} size={12} fill={count >= 0 ? color : ROSE}>{count >= 0 ? 'x' : '−x'}</SvgText>
      </g>
    ))
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <SvgText x="24" y="55" anchor="start" size={12}>2x + 3</SvgText>
        {drawXTiles(2, 70, 'a')}
        {[0, 1, 2].map((i) => <circle key={i} cx={132 + i * 22} cy="88" r="7" fill={WARM} />)}
        <SvgText x="24" y="124" anchor="start" size={12}>{k}x − 1</SvgText>
        {drawXTiles(k, 137, 'b')}
        <circle cx={42 + Math.abs(k) * 34 + 10} cy="155" r="7" fill={PAPER} stroke={ROSE} strokeWidth="2" />
        <line x1="25" y1="190" x2="335" y2="190" stroke={GRID} strokeWidth="2" />
        <SvgText x="180" y="207" size={13} fill={color}>まとめると {2 + k}x + 2</SvgText>
      </Stage>
    )
  }

  if (variant === 'expand') {
    const a = n(values.a)
    const b = n(values.b)
    const left = 48, top = 35, width = 264, height = 150
    const splitX = left + width * (3 / (3 + a))
    const splitY = top + height * (3 / (3 + b))
    const cells = [
      { x: left, y: top, w: splitX - left, h: splitY - top, text: 'x²', fill: `${color}2c` },
      { x: splitX, y: top, w: left + width - splitX, h: splitY - top, text: `${a}x`, fill: `${WARM}32` },
      { x: left, y: splitY, w: splitX - left, h: top + height - splitY, text: `${b}x`, fill: `${GOOD}28` },
      { x: splitX, y: splitY, w: left + width - splitX, h: top + height - splitY, text: String(a * b), fill: `${ROSE}25` },
    ]
    return (
      <Stage label={label} markerId={markerId} color={color}>
        {cells.map((cell) => (
          <g key={cell.text}>
            <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} fill={cell.fill} stroke={PAPER} strokeWidth="3" />
            <SvgText x={cell.x + cell.w / 2} y={cell.y + cell.h / 2} size={14}>{cell.text}</SvgText>
          </g>
        ))}
        <rect x={left} y={top} width={width} height={height} fill="none" stroke={INK} strokeWidth="2" />
        <SvgText x={(left + splitX) / 2} y="18" size={11}>x</SvgText>
        <SvgText x={(splitX + left + width) / 2} y="18" size={11}>{a}</SvgText>
        <SvgText x="28" y={(top + splitY) / 2} size={11}>x</SvgText>
        <SvgText x="28" y={(splitY + top + height) / 2} size={11}>{b}</SvgText>
        <SvgText x="180" y="207" size={11} fill={MUTED}>全体の面積 = 4つの部分の面積の和</SvgText>
      </Stage>
    )
  }

  if (variant === 'factor') {
    const m = n(values.m)
    const height = 55 + m * 18
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <rect x="48" y={115 - height / 2} width="264" height={height} fill={`${color}18`} stroke={INK} strokeWidth="2" />
        <line x1="225" y1={115 - height / 2} x2="225" y2={115 + height / 2} stroke={INK} strokeWidth="2" />
        <rect x="48" y={115 - height / 2} width="177" height={height} fill={`${color}2d`} />
        <rect x="225" y={115 - height / 2} width="87" height={height} fill={`${WARM}30`} />
        <SvgText x="136" y="115" size={16}>{m}x</SvgText>
        <SvgText x="268" y="115" size={16}>{2 * m}</SvgText>
        <SvgText x="32" y="115" size={13} fill={color}>{m}</SvgText>
        <SvgText x="136" y={136 + height / 2} size={12}>x</SvgText>
        <SvgText x="268" y={136 + height / 2} size={12}>2</SvgText>
        <SvgText x="180" y="24" size={13} fill={color}>共通の高さ {m} で1つにくくる</SvgText>
      </Stage>
    )
  }

  const rows = [[1]]
  const order = n(values.n)
  for (let r = 1; r <= order; r++) {
    const prev = rows[r - 1]
    rows.push(Array.from({ length: r + 1 }, (_, i) => (prev[i - 1] ?? 0) + (prev[i] ?? 0)))
  }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {rows.map((row, ri) => {
        const gap = 37
        const start = 180 - (row.length - 1) * gap / 2
        return row.map((value, ci) => (
          <g key={`${ri}-${ci}`}>
            <circle cx={start + ci * gap} cy={27 + ri * 29} r="13" fill={ri === order ? `${color}34` : PAPER} stroke={ri === order ? color : GRID} strokeWidth="2" />
            <SvgText x={start + ci * gap} y={28 + ri * 29} size={10} fill={ri === order ? color : MUTED}>{value}</SvgText>
          </g>
        ))
      })}
      <SvgText x="180" y="207" size={12} fill={color}>n={order} の係数：{rows[order].join(' , ')}</SvgText>
    </Stage>
  )
}

function GraphAxes({ sx, sy, xMin = -4, xMax = 4, yMin = -4, yMax = 4 }) {
  const xTicks = []
  const yTicks = []
  for (let value = Math.ceil(xMin); value <= Math.floor(xMax); value++) xTicks.push(value)
  for (let value = Math.ceil(yMin); value <= Math.floor(yMax); value++) yTicks.push(value)
  return (
    <>
      {xTicks.map((value) => <line key={`gx-${value}`} x1={sx(value)} y1={sy(yMin)} x2={sx(value)} y2={sy(yMax)} stroke={GRID} strokeWidth="1" />)}
      {yTicks.map((value) => <line key={`gy-${value}`} x1={sx(xMin)} y1={sy(value)} x2={sx(xMax)} y2={sy(value)} stroke={GRID} strokeWidth="1" />)}
      <line x1={sx(xMin)} y1={sy(0)} x2={sx(xMax)} y2={sy(0)} stroke={INK} strokeWidth="1.5" />
      <line x1={sx(0)} y1={sy(yMin)} x2={sx(0)} y2={sy(yMax)} stroke={INK} strokeWidth="1.5" />
      <SvgText x={sx(xMax) - 4} y={sy(0) - 11} size={10}>x</SvgText>
      <SvgText x={sx(0) + 12} y={sy(yMax) + 8} size={10}>y</SvgText>
    </>
  )
}

function plotPath(fn, xMin, xMax, yMin, yMax, sx, sy, samples = 140) {
  let path = ''
  let drawing = false
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (xMax - xMin) * i / samples
    const y = fn(x)
    if (!Number.isFinite(y) || y < yMin - 0.2 || y > yMax + 0.2) {
      drawing = false
      continue
    }
    path += `${drawing ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(y).toFixed(2)} `
    drawing = true
  }
  return path
}

function GraphScene({ variant, values, color, markerId, label }) {
  const xMin = -4, xMax = 4, yMin = -4, yMax = 4
  const sx = (x) => 35 + ((x - xMin) / (xMax - xMin)) * 290
  const sy = (y) => 190 - ((y - yMin) / (yMax - yMin)) * 160
  let paths = []
  let marks = null

  if (variant === 'proportion') {
    const a = n(values.a)
    if (values.mode === 'direct') {
      paths = [{ fn: (x) => a * x, stroke: color }]
      marks = <circle cx={sx(1)} cy={sy(a)} r="6" fill={WARM} />
    } else {
      paths = [
        { fn: (x) => a / x, stroke: color, domain: [-4, -0.08] },
        { fn: (x) => a / x, stroke: color, domain: [0.08, 4] },
      ]
      marks = a === 0 ? (
        <>
          <circle cx={sx(1)} cy={sy(0)} r="6" fill={WARM} />
          <circle cx={sx(0)} cy={sy(0)} r="6" fill={PAPER} stroke={color} strokeWidth="3" />
          <SvgText x="180" y="208" size={11}>a=0 は反比例ではない</SvgText>
        </>
      ) : (
        <>
          <circle cx={sx(1)} cy={sy(a)} r="6" fill={WARM} />
          <circle cx={sx(a)} cy={sy(1)} r="6" fill={WARM} />
        </>
      )
    }
  } else if (variant === 'intersection') {
    const b = n(values.b)
    const ix = (b - 1) / 2
    const iy = (b + 1) / 2
    paths = [{ fn: (x) => x + 1, stroke: color }, { fn: (x) => -x + b, stroke: ROSE }]
    marks = (
      <>
        <circle cx={sx(ix)} cy={sy(iy)} r="7" fill={WARM} stroke={PAPER} strokeWidth="2" />
        <SvgText x={sx(ix) + 10} y={sy(iy) - 12} anchor="start" size={10}>両方を満たす</SvgText>
      </>
    )
  } else if (variant === 'line') {
    const a = n(values.a)
    paths = [{ fn: (x) => a * x + 1, stroke: color }]
    marks = (
      <>
        <path d={`M${sx(0)},${sy(1)} L${sx(1)},${sy(1)} L${sx(1)},${sy(a + 1)}`} fill="none" stroke={WARM} strokeWidth="3" />
        <SvgText x={(sx(0) + sx(1)) / 2} y={sy(1) + 13} size={10}>1</SvgText>
        <SvgText x={sx(1) + 13} y={(sy(1) + sy(a + 1)) / 2} size={10} fill={WARM}>{a}</SvgText>
      </>
    )
  } else if (variant === 'quadratic-roots') {
    const c = n(values.c)
    paths = [{ fn: (x) => x * x + c, stroke: color }]
    if (c <= 0) {
      const root = Math.sqrt(-c)
      marks = (
        <>
          <circle cx={sx(root)} cy={sy(0)} r="6" fill={WARM} />
          {root > 0 && <circle cx={sx(-root)} cy={sy(0)} r="6" fill={WARM} />}
        </>
      )
    }
  } else if (variant === 'parabola') {
    const a = n(values.a)
    paths = [{ fn: (x) => a * x * x, stroke: color }]
    marks = <circle cx={sx(0)} cy={sy(0)} r="6" fill={WARM} />
  } else if (variant === 'vertex') {
    const h = n(values.h)
    paths = [{ fn: (x) => (x - h) ** 2 - 2, stroke: color }]
    marks = (
      <>
        <line x1={sx(h)} y1={sy(-2)} x2={sx(h)} y2={sy(0)} stroke={WARM} strokeDasharray="4 3" />
        <circle cx={sx(h)} cy={sy(-2)} r="7" fill={WARM} />
        <SvgText x={sx(h) + 10} y={sy(-2) - 12} anchor="start" size={10}>({h}, −2)</SvgText>
      </>
    )
  } else {
    const base = n(values.base)
    paths = [
      { fn: (x) => base ** x, stroke: color },
      { fn: (x) => x > 0 ? Math.log(x) / Math.log(base) : NaN, stroke: ROSE },
    ]
    marks = (
      <>
        <line x1={sx(-4)} y1={sy(-4)} x2={sx(4)} y2={sy(4)} stroke={MUTED} strokeDasharray="5 4" />
        <SvgText x={sx(2.8)} y={sy(3.2)} size={10} fill={MUTED}>y=x</SvgText>
        <circle cx={sx(0)} cy={sy(1)} r="5" fill={color} />
        <circle cx={sx(1)} cy={sy(0)} r="5" fill={ROSE} />
      </>
    )
  }

  return (
    <Stage label={label} markerId={markerId} color={color}>
      <GraphAxes sx={sx} sy={sy} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
      {paths.map((item, index) => (
        <path
          key={index}
          d={plotPath(item.fn, item.domain?.[0] ?? xMin, item.domain?.[1] ?? xMax, yMin, yMax, sx, sy)}
          fill="none"
          stroke={item.stroke}
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      ))}
      {marks}
    </Stage>
  )
}

function GeometryScene({ variant, values, color, markerId, label }) {
  if (variant === 'sector') {
    const theta = n(values.theta)
    const start = point(180, 112, 73, 90)
    const end = point(180, 112, 73, 90 - theta)
    const large = theta > 180 ? 1 : 0
    const sector = `M180 112 L${start.x} ${start.y} A73 73 0 ${large} 1 ${end.x} ${end.y} Z`
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <circle cx="180" cy="112" r="73" fill={PAPER} stroke={GRID} strokeWidth="3" />
        <path d={sector} fill={`${color}35`} stroke={color} strokeWidth="3" className="transition-all duration-300" />
        <circle cx="180" cy="112" r="4" fill={INK} />
        <SvgText x="180" y="112" size={13} fill={color}>{theta}°</SvgText>
        <SvgText x="180" y="205" size={11} fill={MUTED}>{theta}/360 周ぶん</SvgText>
      </Stage>
    )
  }

  if (variant === 'angles') {
    const theta = n(values.theta)
    const direction = { x: Math.cos(rad(theta)), y: -Math.sin(rad(theta)) }
    const halfLength = 105
    const intersections = [70, 154].map((y) => {
      const distance = (y - 112) / direction.y
      return { x: 180 + distance * direction.x, y }
    })
    const angleArc = ({ x, y }) => {
      const radius = 21
      const end = {
        x: x + radius * Math.cos(rad(theta)),
        y: y - radius * Math.sin(rad(theta)),
      }
      return `M${x + radius} ${y} A${radius} ${radius} 0 0 0 ${end.x} ${end.y}`
    }
    const angleLabel = ({ x, y }) => ({
      x: x + 34 * Math.cos(rad(theta / 2)),
      y: y - 34 * Math.sin(rad(theta / 2)),
    })
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <line x1="30" y1="70" x2="330" y2="70" stroke={INK} strokeWidth="4" />
        <line x1="30" y1="154" x2="330" y2="154" stroke={INK} strokeWidth="4" />
        <line
          x1={180 - halfLength * direction.x}
          y1={112 - halfLength * direction.y}
          x2={180 + halfLength * direction.x}
          y2={112 + halfLength * direction.y}
          stroke={color}
          strokeWidth="4"
        />
        <path d="M70 58l12 12-12 12M286 58l12 12-12 12" fill="none" stroke={MUTED} strokeWidth="2" />
        {intersections.map((intersection) => {
          const text = angleLabel(intersection)
          return (
            <g key={intersection.y}>
              <path d={angleArc(intersection)} fill="none" stroke={WARM} strokeWidth="4" />
              <SvgText x={text.x} y={text.y} size={13} fill={color}>{theta}°</SvgText>
              <circle cx={intersection.x} cy={intersection.y} r="3.5" fill={WARM} />
            </g>
          )
        })}
        <SvgText x="258" y="47" size={11} fill={MUTED}>平行</SvgText>
        <SvgText x="180" y="203" size={11}>同じ印の角は、離れていても等しい</SvgText>
      </Stage>
    )
  }

  if (variant === 'congruence') {
    const t = n(values.slide) / 100
    const target = [[80, 168], [145, 55], [220, 168]]
    const source = target.map(([x, y]) => [x + 92, y - 14])
    const moved = target.map(([x, y], i) => [
      source[i][0] + (x - source[i][0]) * t,
      source[i][1] + (y - source[i][1]) * t,
    ])
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <polygon points={target.map((p) => p.join(',')).join(' ')} fill={`${color}18`} stroke={color} strokeWidth="4" />
        <polygon points={moved.map((p) => p.join(',')).join(' ')} fill={`${WARM}2b`} stroke={WARM} strokeWidth="4" className="transition-all duration-200" />
        <SvgText x="64" y="180" size={11}>A</SvgText>
        <SvgText x="145" y="39" size={11}>B</SvgText>
        <SvgText x="235" y="180" size={11}>C</SvgText>
        <SvgText x="180" y="207" size={12} fill={t > 0.95 ? GOOD : MUTED}>{t > 0.95 ? 'ぴったり重なった！' : '形と大きさを保ったまま移動'}</SvgText>
      </Stage>
    )
  }

  if (variant === 'similarity') {
    const k = n(values.k)
    const small = [[35, 170], [35, 98], [89, 170]]
    const bx = 175, by = 180
    const big = [[bx, by], [bx, by - 72 * k], [bx + 54 * k, by]]
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <polygon points={small.map((p) => p.join(',')).join(' ')} fill={`${color}20`} stroke={color} strokeWidth="3" />
        <polygon points={big.map((p) => p.join(',')).join(' ')} fill={`${WARM}26`} stroke={WARM} strokeWidth="3" className="transition-all duration-300" />
        <SvgText x="61" y="190" size={11}>3 : 4 : 5</SvgText>
        <SvgText x={bx + 27 * k} y="201" size={11}>{(3 * k).toFixed(1)} : {(4 * k).toFixed(1)} : {(5 * k).toFixed(1)}</SvgText>
        <SvgText x="180" y="26" size={13} fill={color}>対応する角は同じ・辺はすべて {k.toFixed(1)}倍</SvgText>
      </Stage>
    )
  }

  if (variant === 'circle-angle') {
    const p = point(180, 112, 76, n(values.theta))
    const a = point(180, 112, 76, 210)
    const b = point(180, 112, 76, 330)
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <circle cx="180" cy="112" r="76" fill={`${color}0d`} stroke={color} strokeWidth="3" />
        <line x1={p.x} y1={p.y} x2={a.x} y2={a.y} stroke={INK} strokeWidth="3" />
        <line x1={p.x} y1={p.y} x2={b.x} y2={b.y} stroke={INK} strokeWidth="3" />
        <line x1="180" y1="112" x2={a.x} y2={a.y} stroke={MUTED} strokeDasharray="4 3" />
        <line x1="180" y1="112" x2={b.x} y2={b.y} stroke={MUTED} strokeDasharray="4 3" />
        <circle cx={p.x} cy={p.y} r="7" fill={WARM} />
        <circle cx={a.x} cy={a.y} r="6" fill={color} />
        <circle cx={b.x} cy={b.y} r="6" fill={color} />
        <SvgText x={p.x} y={p.y - 15} size={11}>P</SvgText>
        <SvgText x={a.x - 12} y={a.y + 9} size={11}>A</SvgText>
        <SvgText x={b.x + 12} y={b.y + 9} size={11}>B</SvgText>
        <SvgText x="180" y="205" size={12} fill={color}>同じ弧ABを見る ∠APB = 60°</SvgText>
      </Stage>
    )
  }

  if (variant === 'pythagorean') {
    const scale = 13
    const legA = 3 * scale
    const legB = n(values.b) * scale
    const A = { x: 135, y: 145 }, B = { x: 135 + legA, y: 145 }, C = { x: 135, y: 145 - legB }
    const vx = C.x - B.x, vy = C.y - B.y
    // BC の反対側（直角頂点 A がない側）へ斜辺上の正方形を出す。
    const outward = { x: -vy, y: vx }
    const squareC = [
      [B.x, B.y],
      [C.x, C.y],
      [C.x + outward.x, C.y + outward.y],
      [B.x + outward.x, B.y + outward.y],
    ]
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <rect x={A.x} y={A.y} width={legA} height={legA} fill={`${color}25`} stroke={color} strokeWidth="2" />
        <rect x={A.x - legB} y={C.y} width={legB} height={legB} fill={`${WARM}27`} stroke={WARM} strokeWidth="2" />
        <polygon points={squareC.map((p) => p.join(',')).join(' ')} fill={`${GOOD}20`} stroke={GOOD} strokeWidth="2" />
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={PAPER} stroke={INK} strokeWidth="3" />
        <path d={`M${A.x + 11} ${A.y}v-11h-11`} fill="none" stroke={INK} strokeWidth="2" />
        <SvgText x={A.x + legA / 2} y={A.y + legA / 2} size={10}>3² = 9</SvgText>
        <SvgText x={A.x - legB / 2} y={(A.y + C.y) / 2} size={10}>{values.b}² = {n(values.b) ** 2}</SvgText>
        <SvgText x="265" y="45" size={12} fill={GOOD}>斜辺² = {9 + n(values.b) ** 2}</SvgText>
      </Stage>
    )
  }

  if (variant === 'trig') {
    const theta = n(values.theta)
    const tangent = Math.tan(rad(theta))
    const origin = { x: 80, y: 175 }
    const radius = 125
    const p = { x: origin.x + radius * Math.cos(rad(theta)), y: origin.y - radius * Math.sin(rad(theta)) }
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <line x1={origin.x} y1={origin.y} x2="325" y2={origin.y} stroke={INK} strokeWidth="2" />
        <line x1={origin.x} y1={origin.y} x2={p.x} y2={p.y} stroke={color} strokeWidth="5" />
        <line x1={p.x} y1={p.y} x2={p.x} y2={origin.y} stroke={WARM} strokeWidth="4" />
        <line x1={origin.x} y1={origin.y} x2={p.x} y2={origin.y} stroke={GOOD} strokeWidth="4" />
        <path d={`M${origin.x + 34} ${origin.y} A34 34 0 0 0 ${origin.x + 34 * Math.cos(rad(theta))} ${origin.y - 34 * Math.sin(rad(theta))}`} fill="none" stroke={INK} strokeWidth="2" />
        <SvgText x={origin.x + 48} y={origin.y - 18} size={11}>{theta}°</SvgText>
        <SvgText x={(origin.x + p.x) / 2} y={origin.y + 17} size={11} fill={GOOD}>cos θ</SvgText>
        <SvgText x={p.x + 24} y={(origin.y + p.y) / 2} size={11} fill={WARM}>sin θ</SvgText>
        <SvgText x={(origin.x + p.x) / 2 - 10} y={(origin.y + p.y) / 2 - 12} size={11} fill={color}>斜辺 1</SvgText>
        <SvgText x="270" y="27" size={12} fill={ROSE}>tan θ ≈ {tangent.toFixed(2)}</SvgText>
      </Stage>
    )
  }

  if (variant === 'cevian') {
    const t = n(values.t)
    const A = { x: 50, y: 176 }, B = { x: 310, y: 176 }, C = { x: 190, y: 42 }
    const D = { x: A.x + (B.x - A.x) * t, y: 176 }
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${C.x},${C.y}`} fill={`${color}29`} />
        <polygon points={`${D.x},${D.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={`${WARM}29`} />
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="none" stroke={INK} strokeWidth="3" />
        <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke={INK} strokeWidth="3" />
        <circle cx={D.x} cy={D.y} r="7" fill={GOOD} />
        <SvgText x={A.x} y="196" size={11}>A</SvgText>
        <SvgText x={D.x} y="196" size={11}>D</SvgText>
        <SvgText x={B.x} y="196" size={11}>B</SvgText>
        <SvgText x="180" y="19" size={12} fill={color}>同じ高さ → 底辺の比 = 面積の比</SvgText>
      </Stage>
    )
  }

  if (variant === 'circle-equation') {
    const radius = n(values.r)
    const unitScale = 18
    const sx = (x) => 180 + x * unitScale
    const sy = (y) => 105 - y * unitScale
    const cx = sx(1), cy = sy(-1), rr = radius * unitScale
    const p = point(cx, cy, rr, 35)
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <rect x="20" y="16" width="320" height="190" fill={`url(#${markerId}-grid)`} />
        <line x1="20" y1={sy(0)} x2="340" y2={sy(0)} stroke={INK} strokeWidth="1.5" />
        <line x1={sx(0)} y1="16" x2={sx(0)} y2="206" stroke={INK} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={rr} fill={`${color}10`} stroke={color} strokeWidth="4" />
        <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={WARM} strokeWidth="3" />
        <circle cx={cx} cy={cy} r="6" fill={INK} />
        <circle cx={p.x} cy={p.y} r="6" fill={WARM} />
        <SvgText x={cx - 8} y={cy + 17} anchor="end" size={10}>(1, −1)</SvgText>
        <SvgText x={(cx + p.x) / 2} y={(cy + p.y) / 2 - 11} size={11} fill={WARM}>r={radius}</SvgText>
      </Stage>
    )
  }

  const e = n(values.e)
  if (e < 0.95) {
    const rx = 108
    const ry = rx * Math.sqrt(1 - e ** 2)
    const focusOffset = rx * e
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <line x1="30" y1="112" x2="330" y2="112" stroke={GRID} strokeWidth="2" />
        <ellipse cx="180" cy="112" rx={rx} ry={ry} fill={`${color}16`} stroke={color} strokeWidth="4" />
        <circle cx={180 - focusOffset} cy="112" r="6" fill={WARM} />
        <circle cx={180 + focusOffset} cy="112" r="6" fill={WARM} />
        <SvgText x="180" y="207" size={13} fill={color}>e &lt; 1　楕円</SvgText>
      </Stage>
    )
  }
  if (e <= 1.05) {
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <path d="M88 30 Q285 110 88 195" fill={`${color}12`} stroke={color} strokeWidth="4" />
        <line x1="70" y1="20" x2="70" y2="205" stroke={MUTED} strokeDasharray="5 4" />
        <circle cx="150" cy="112" r="6" fill={WARM} />
        <SvgText x="180" y="207" size={13} fill={color}>e = 1　放物線</SvgText>
      </Stage>
    )
  }
  const spread = 46 + (e - 1) * 45
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <path d={`M${180 - spread} 112 C${105 - spread / 2} 70 80 42 42 30 M${180 - spread} 112 C${105 - spread / 2} 154 80 182 42 194`} fill="none" stroke={color} strokeWidth="4" />
      <path d={`M${180 + spread} 112 C${255 + spread / 2} 70 280 42 318 30 M${180 + spread} 112 C${255 + spread / 2} 154 280 182 318 194`} fill="none" stroke={color} strokeWidth="4" />
      <circle cx="120" cy="112" r="6" fill={WARM} /><circle cx="240" cy="112" r="6" fill={WARM} />
      <SvgText x="180" y="207" size={13} fill={color}>e &gt; 1　双曲線</SvgText>
    </Stage>
  )
}

function SolidScene({ variant, values, color, markerId, label }) {
  if (variant === 'prism') {
    const layers = n(values.h)
    return (
      <Stage label={label} markerId={markerId} color={color}>
        {Array.from({ length: layers }, (_, index) => {
          const y = 178 - index * 24
          return (
            <g key={index}>
              <path d={`M90 ${y} L235 ${y} L275 ${y - 20} L130 ${y - 20} Z`} fill={`${color}${index % 2 ? '25' : '35'}`} stroke={color} strokeWidth="2" />
              <line x1="90" y1={y} x2="90" y2={y + 22} stroke={color} strokeWidth="2" />
              <line x1="235" y1={y} x2="235" y2={y + 22} stroke={color} strokeWidth="2" />
              <line x1="275" y1={y - 20} x2="275" y2={y + 2} stroke={color} strokeWidth="2" />
            </g>
          )
        })}
        <SvgText x="180" y="28" size={13} fill={color}>底面積 4×3 = 12</SvgText>
        <SvgText x="180" y="207" size={12}>{layers}段 × 12 = 体積 {layers * 12}</SvgText>
      </Stage>
    )
  }

  const b = n(values.b)
  const count = Math.max(3, Math.round(b * 5))
  const startX = 65
  const endX = 300
  const axisY = 125
  const radiusScale = 23
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="45" y1={axisY} x2="325" y2={axisY} stroke={INK} strokeWidth="2" />
      <path d={`M${startX} ${axisY} L${endX} ${axisY - b * radiusScale}`} fill="none" stroke={color} strokeWidth="4" />
      {Array.from({ length: count }, (_, index) => {
        const t = (index + 1) / count
        const x = startX + (endX - startX) * t
        const radius = b * radiusScale * t
        return <ellipse key={index} cx={x} cy={axisY} rx="5" ry={radius} fill={`${color}10`} stroke={index === count - 1 ? WARM : `${color}88`} strokeWidth={index === count - 1 ? 3 : 1.5} />
      })}
      <SvgText x="180" y="28" size={13} fill={color}>半径 y=x の円盤を積み重ねる</SvgText>
      <SvgText x="180" y="207" size={11} fill={MUTED}>細い円盤ほど、曲線の形を正確に埋める</SvgText>
    </Stage>
  )
}

const DATA_VALUES = [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 5, 6, 7, 7, 8, 8, 9]

function DataScene({ variant, values, color, markerId, label }) {
  if (variant === 'histogram') {
    const width = n(values.width)
    const bins = []
    for (let start = 0; start < 10; start += width) {
      bins.push({ start, count: DATA_VALUES.filter((value) => value >= start && value < start + width).length })
    }
    const max = Math.max(...bins.map((bin) => bin.count))
    const barW = 288 / bins.length
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <line x1="42" y1="180" x2="330" y2="180" stroke={INK} strokeWidth="2" />
        <line x1="42" y1="30" x2="42" y2="180" stroke={INK} strokeWidth="2" />
        {bins.map((bin, index) => {
          const height = bin.count / max * 126
          return (
            <g key={bin.start}>
              <rect x={42 + index * barW} y={180 - height} width={barW - 2} height={height} fill={`${color}42`} stroke={color} strokeWidth="2" className="transition-all duration-300" />
              <SvgText x={42 + index * barW + (barW - 2) / 2} y={168 - height} size={10}>{bin.count}</SvgText>
              <SvgText x={42 + index * barW + (barW - 2) / 2} y="196" size={9} fill={MUTED}>{bin.start}–{bin.start + width}</SvgText>
            </g>
          )
        })}
      </Stage>
    )
  }

  if (variant === 'boxplot') {
    const max = n(values.outlier)
    const sx = (value) => 38 + ((value - 0) / 30) * 290
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <line x1={sx(2)} y1="112" x2={sx(max)} y2="112" stroke={INK} strokeWidth="3" />
        <line x1={sx(2)} y1="90" x2={sx(2)} y2="134" stroke={INK} strokeWidth="3" />
        <line x1={sx(max)} y1="90" x2={sx(max)} y2="134" stroke={INK} strokeWidth="3" />
        <rect x={sx(5)} y="76" width={sx(9) - sx(5)} height="72" fill={`${color}2c`} stroke={color} strokeWidth="3" />
        <line x1={sx(7)} y1="76" x2={sx(7)} y2="148" stroke={WARM} strokeWidth="5" />
        {[2, 5, 7, 9, max].map((value, i) => (
          <SvgText key={`${value}-${i}`} x={sx(value)} y="170" size={10} fill={i === 2 ? WARM : MUTED}>{value}</SvgText>
        ))}
        <SvgText x={(sx(5) + sx(9)) / 2} y="52" size={12} fill={color}>中央50%</SvgText>
        <SvgText x="180" y="207" size={11}>最大値を動かしても、箱の位置はそのまま</SvgText>
      </Stage>
    )
  }

  if (variant === 'sample') {
    const sampleSize = n(values.n)
    const band = 82 / Math.sqrt(sampleSize / 5)
    return (
      <Stage label={label} markerId={markerId} color={color}>
        {Array.from({ length: 50 }, (_, index) => {
          const x = 39 + (index % 10) * 31
          const y = 38 + Math.floor(index / 10) * 25
          const selected = index < sampleSize
          return <circle key={index} cx={x} cy={y} r="7" fill={selected ? color : GRID} opacity={selected ? 0.85 : 0.65} />
        })}
        <line x1="70" y1="183" x2="290" y2="183" stroke={INK} strokeWidth="2" />
        <rect x={180 - band} y="172" width={band * 2} height="22" rx="11" fill={`${WARM}3d`} />
        <line x1="180" y1="167" x2="180" y2="199" stroke={WARM} strokeWidth="3" />
        <SvgText x="180" y="211" size={10} fill={MUTED}>推定のぶれ幅</SvgText>
      </Stage>
    )
  }

  if (variant === 'correlation') {
    const strength = n(values.strength) / 100
    const noise = [0.7, -0.9, 0.4, -0.2, 1, -0.6, 0.2, 0.8, -0.5, 0.5, -0.8, 0.1]
    const xs = Array.from({ length: 12 }, (_, i) => -2.75 + i * 0.5)
    const sx = (x) => 45 + ((x + 3) / 6) * 270
    const sy = (y) => 180 - ((y + 3) / 6) * 145
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <GraphAxes sx={sx} sy={sy} xMin={-3} xMax={3} yMin={-3} yMax={3} />
        {xs.map((x, index) => {
          const y = clamp(strength * x + (1 - Math.abs(strength)) * noise[index] * 2.2, -2.9, 2.9)
          return <circle key={index} cx={sx(x)} cy={sy(y)} r="6" fill={color} opacity="0.78" className="transition-all duration-300" />
        })}
        {Math.abs(strength) > 0.15 && <line x1={sx(-3)} y1={sy(strength * -3)} x2={sx(3)} y2={sy(strength * 3)} stroke={WARM} strokeWidth="3" strokeDasharray="6 4" />}
      </Stage>
    )
  }

  const sampleSize = n(values.n)
  const sx = (x) => 35 + ((x + 3.5) / 7) * 290
  const sy = (y) => 184 - y * 145
  const curve = (x) => Math.exp(-x * x / 2)
  const interval = 2.3 * Math.sqrt(10 / sampleSize)
  const left = sx(-interval), right = sx(interval)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <path d={plotPath(curve, -3.5, 3.5, 0, 1.05, sx, sy)} fill="none" stroke={color} strokeWidth="4" />
      <path d={`M${left} 184 L${left} ${sy(curve(-interval))} ${plotPath(curve, -interval, interval, 0, 1.05, sx, sy, 70).replace(/^M/, 'L')} L${right} 184 Z`} fill={`${color}2c`} />
      <line x1={left} y1="174" x2={left} y2="194" stroke={WARM} strokeWidth="3" />
      <line x1={right} y1="174" x2={right} y2="194" stroke={WARM} strokeWidth="3" />
      <SvgText x="180" y="28" size={12} fill={color}>平均の推定範囲</SvgText>
      <SvgText x="180" y="207" size={11} fill={MUTED}>nが増えるほど中央の区間が狭くなる</SvgText>
    </Stage>
  )
}

function ProbabilityScene({ variant, values, color, markerId, label }) {
  if (variant === 'die') {
    const favorable = n(values.favorable)
    return (
      <Stage label={label} markerId={markerId} color={color}>
        {Array.from({ length: 6 }, (_, index) => {
          const value = index + 1
          const x = 34 + (index % 3) * 104
          const y = 38 + Math.floor(index / 3) * 87
          const active = value <= favorable
          return (
            <g key={value}>
              <rect x={x} y={y} width="82" height="66" rx="14" fill={active ? `${color}31` : PAPER} stroke={active ? color : GRID} strokeWidth="3" />
              <SvgText x={x + 41} y={y + 34} size={22} fill={active ? color : MUTED}>{value}</SvgText>
            </g>
          )
        })}
        <SvgText x="180" y="211" size={12} fill={color}>色のついた結果：{favorable} / 6</SvgText>
      </Stage>
    )
  }

  const branches = n(values.n)
  const ys = Array.from({ length: branches }, (_, i) => 38 + i * (145 / Math.max(1, branches - 1)))
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <circle cx="40" cy="110" r="8" fill={INK} />
      {ys.map((y, index) => (
        <g key={index}>
          <line x1="48" y1="110" x2="155" y2={y} stroke={color} strokeWidth="2.5" />
          <circle cx="155" cy={y} r="7" fill={color} />
          <line x1="162" y1={y} x2="300" y2={y - 12} stroke={MUTED} strokeWidth="2" />
          <line x1="162" y1={y} x2="300" y2={y + 12} stroke={MUTED} strokeWidth="2" />
          <circle cx="307" cy={y - 12} r="5" fill={WARM} />
          <circle cx="307" cy={y + 12} r="5" fill={GOOD} />
          <SvgText x="134" y={y - 12} size={9} fill={color}>{String.fromCharCode(65 + index)}</SvgText>
        </g>
      ))}
      <SvgText x="180" y="207" size={12}>葉の数は {branches} × 2 = {branches * 2}</SvgText>
    </Stage>
  )
}

function SetScene({ values, color, markerId, label }) {
  const mode = values.case
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {mode === 'sufficient' && (
        <>
          <circle cx="180" cy="112" r="90" fill={`${color}15`} stroke={color} strokeWidth="3" />
          <circle cx="180" cy="112" r="48" fill={`${WARM}35`} stroke={WARM} strokeWidth="3" />
          <SvgText x="180" y="112" size={17} fill={WARM}>P</SvgText>
          <SvgText x="180" y="48" size={17} fill={color}>Q</SvgText>
        </>
      )}
      {mode === 'necessary' && (
        <>
          <circle cx="180" cy="112" r="90" fill={`${WARM}18`} stroke={WARM} strokeWidth="3" />
          <circle cx="180" cy="112" r="48" fill={`${color}35`} stroke={color} strokeWidth="3" />
          <SvgText x="180" y="112" size={17} fill={color}>Q</SvgText>
          <SvgText x="180" y="48" size={17} fill={WARM}>P</SvgText>
        </>
      )}
      {mode === 'equivalent' && (
        <>
          <circle cx="180" cy="112" r="78" fill={`${color}25`} stroke={color} strokeWidth="5" />
          <SvgText x="180" y="112" size={18} fill={color}>P = Q</SvgText>
        </>
      )}
      <SvgText x="180" y="207" size={12}>{mode === 'equivalent' ? '集合が一致' : '内側の条件を満たせば、外側の条件も満たす'}</SvgText>
    </Stage>
  )
}

function IntegerScene({ values, color, markerId, label }) {
  const step = n(values.step)
  const divisions = [
    { large: 1071, small: 462, quotient: 2, remainder: 147 },
    { large: 462, small: 147, quotient: 3, remainder: 21 },
    { large: 147, small: 21, quotient: 7, remainder: 0 },
  ]

  if (step === 0) {
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <SvgText x="180" y="30" size={15} fill={color}>1071 と 462 から開始</SvgText>
        <rect x="55" y="66" width="112" height="64" rx="12" fill={`${color}18`} stroke={color} strokeWidth="2" />
        <rect x="193" y="66" width="112" height="64" rx="12" fill={`${WARM}20`} stroke={WARM} strokeWidth="2" />
        <SvgText x="111" y="84" size={10} fill={MUTED}>大きい数</SvgText>
        <SvgText x="249" y="84" size={10} fill={MUTED}>小さい数</SvgText>
        <SvgText x="111" y="108" size={20} fill={color}>1071</SvgText>
        <SvgText x="249" y="108" size={20} fill={WARM}>462</SvgText>
        <path d="M80 158H280" stroke={MUTED} strokeWidth="2" markerEnd={`url(#${markerId}-muted)`} />
        <SvgText x="180" y="184" size={12}>大きい数を小さい数で割る</SvgText>
      </Stage>
    )
  }

  const { large, small, quotient, remainder } = divisions[step - 1]
  const unit = 245 / large
  const complete = remainder === 0

  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="30" size={15} fill={color}>{large} を {small} で割る</SvgText>
      <rect x="55" y="62" width="250" height="42" rx="8" fill={`${color}14`} stroke={color} strokeWidth="2" />
      {Array.from({ length: quotient }, (_, index) => (
        <rect key={index} x={55 + index * small * unit} y="62" width={small * unit} height="42" fill={`${color}30`} stroke={PAPER} strokeWidth="2" />
      ))}
      {remainder > 0 && <rect x={55 + quotient * small * unit} y="62" width={remainder * unit} height="42" fill={`${WARM}45`} />}
      <SvgText x="180" y="83" size={13}>{small} × {quotient}　+　余り {remainder}</SvgText>

      {complete ? (
        <>
          <SvgText x="180" y="124" size={12} fill={GOOD}>余りが 0 → 完了</SvgText>
          <rect x="91" y="145" width="178" height="50" rx="12" fill={`${GOOD}20`} stroke={GOOD} strokeWidth="3" />
          <SvgText x="180" y="170" size={18} fill={GOOD}>最大公約数 = {small}</SvgText>
        </>
      ) : (
        <>
          <path d="M80 143H280" stroke={MUTED} strokeWidth="2" markerEnd={`url(#${markerId}-muted)`} />
          <SvgText x="180" y="169" size={12}>次は ({small}, {remainder}) で同じことをする</SvgText>
        </>
      )}
    </Stage>
  )
}

function ComplexScene({ values, color, markerId, label }) {
  const turn = n(values.turn)
  const angle = turn * 90
  const p = point(180, 112, 70, angle)
  const labels = ['1', 'i', '−1', '−i', '1']
  const rotationArcs = Array.from({ length: turn }, (_, index) => {
    const start = point(180, 112, 56, index * 90)
    const end = point(180, 112, 56, (index + 1) * 90)
    return {
      index,
      path: `M${start.x} ${start.y} A56 56 0 0 0 ${end.x} ${end.y}`,
    }
  })
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="55" y1="112" x2="305" y2="112" stroke={INK} strokeWidth="2" />
      <line x1="180" y1="20" x2="180" y2="204" stroke={INK} strokeWidth="2" />
      <circle cx="180" cy="112" r="70" fill={`${color}0e`} stroke={GRID} strokeWidth="2" />
      {rotationArcs.map((arc) => (
        <path
          key={arc.index}
          d={arc.path}
          fill="none"
          stroke={WARM}
          strokeWidth="3"
          markerEnd={arc.index === rotationArcs.length - 1 ? `url(#${markerId}-warm)` : undefined}
          data-rotation-quarter={arc.index + 1}
        />
      ))}
      <line x1="180" y1="112" x2={p.x} y2={p.y} stroke={color} strokeWidth="4" />
      <circle cx={p.x} cy={p.y} r="8" fill={color} />
      <SvgText x="267" y="112" size={12}>1</SvgText>
      <SvgText x="180" y="29" size={12}>i</SvgText>
      <SvgText x="91" y="112" size={12}>−1</SvgText>
      <SvgText x="180" y="198" size={12}>−i</SvgText>
      <SvgText x={p.x} y={p.y - 18} size={14} fill={color}>{labels[turn]}</SvgText>
    </Stage>
  )
}

function TrigWaveScene({ values, color, markerId, label }) {
  const theta = n(values.theta)
  const circle = { cx: 82, cy: 108, r: 55 }
  const p = point(circle.cx, circle.cy, circle.r, theta)
  const graphLeft = 160, graphRight = 335
  const gx = (degrees) => graphLeft + degrees / 360 * (graphRight - graphLeft)
  const gy = (value) => circle.cy - value * circle.r
  const path = Array.from({ length: 121 }, (_, index) => {
    const degrees = index * 3
    return `${index ? 'L' : 'M'}${gx(degrees)},${gy(Math.sin(rad(degrees)))}`
  }).join(' ')
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill={`${color}10`} stroke={color} strokeWidth="3" />
      <line x1={circle.cx - circle.r - 10} y1={circle.cy} x2={circle.cx + circle.r + 10} y2={circle.cy} stroke={GRID} />
      <line x1={circle.cx} y1={circle.cy - circle.r - 10} x2={circle.cx} y2={circle.cy + circle.r + 10} stroke={GRID} />
      <line x1={circle.cx} y1={circle.cy} x2={p.x} y2={p.y} stroke={color} strokeWidth="3" />
      <line x1={p.x} y1={p.y} x2={p.x} y2={circle.cy} stroke={WARM} strokeWidth="4" />
      <circle cx={p.x} cy={p.y} r="6" fill={WARM} />
      <line x1={graphLeft} y1={circle.cy} x2={graphRight} y2={circle.cy} stroke={INK} strokeWidth="1.5" />
      <path d={path} fill="none" stroke={color} strokeWidth="4" />
      <line x1={gx(theta)} y1={circle.cy - circle.r - 8} x2={gx(theta)} y2={circle.cy + circle.r + 8} stroke={WARM} strokeDasharray="4 3" />
      <circle cx={gx(theta)} cy={gy(Math.sin(rad(theta)))} r="6" fill={WARM} />
      <line x1={p.x} y1={p.y} x2={gx(theta)} y2={gy(Math.sin(rad(theta)))} stroke={WARM} strokeDasharray="4 4" opacity="0.7" />
      <SvgText x="247" y="194" size={11}>0°　　　　 180°　　　 360°</SvgText>
    </Stage>
  )
}

function CalculusScene({ variant, values, color, markerId, label }) {
  const xMin = variant === 'derivative3' ? -2.2 : -3
  const xMax = variant === 'derivative3' ? 2.2 : 3
  const yMin = variant === 'derivative3' ? -4 : -1
  const yMax = variant === 'derivative3' ? 4 : 7
  const sx = (x) => 38 + ((x - xMin) / (xMax - xMin)) * 284
  const sy = (y) => 190 - ((y - yMin) / (yMax - yMin)) * 160

  if (variant === 'integral') {
    const b = n(values.b)
    const area = `M${sx(0)} ${sy(0)} L${sx(b)} ${sy(0)} L${sx(b)} ${sy(b)} Z`
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <GraphAxes sx={sx} sy={sy} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
        <path d={area} fill={`${color}32`} stroke="none" />
        {Array.from({ length: Math.max(3, Math.round(b * 4)) }, (_, index) => {
          const count = Math.max(3, Math.round(b * 4))
          const x0 = b * index / count
          const x1 = b * (index + 1) / count
          return <rect key={index} x={sx(x0)} y={sy(x1)} width={sx(x1) - sx(x0)} height={sy(0) - sy(x1)} fill="none" stroke={`${color}88`} strokeWidth="1" />
        })}
        <path d={plotPath((x) => x, 0, 3, yMin, yMax, sx, sy)} fill="none" stroke={color} strokeWidth="4" />
        <line x1={sx(b)} y1={sy(0)} x2={sx(b)} y2={sy(b)} stroke={WARM} strokeWidth="3" />
      </Stage>
    )
  }

  const x0 = n(values.x)
  const fn = variant === 'derivative3' ? (x) => x ** 3 - 3 * x : (x) => x * x
  const slope = variant === 'derivative3' ? 3 * x0 * x0 - 3 : 2 * x0
  const y0 = fn(x0)
  const tangent = (x) => y0 + slope * (x - x0)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <GraphAxes sx={sx} sy={sy} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
      <path d={plotPath(fn, xMin, xMax, yMin, yMax, sx, sy)} fill="none" stroke={color} strokeWidth="4" />
      <path d={plotPath(tangent, xMin, xMax, yMin, yMax, sx, sy)} fill="none" stroke={WARM} strokeWidth="3" />
      <circle cx={sx(x0)} cy={sy(y0)} r="7" fill={WARM} stroke={PAPER} strokeWidth="2" />
      {variant === 'derivative3' && (
        <SvgText x="180" y="18" size={11} fill={x0 < 0 ? color : ROSE}>{x0 < 0 ? '上に凸' : x0 > 0 ? '下に凸' : '変曲点'}</SvgText>
      )}
      <SvgText x="180" y="207" size={11}>オレンジの接線の傾き = {slope.toFixed(2)}</SvgText>
    </Stage>
  )
}

function SequenceScene({ values, color, markerId, label }) {
  const d = n(values.d)
  const terms = Array.from({ length: 6 }, (_, index) => 3 + index * d)
  const min = Math.min(...terms, 0), max = Math.max(...terms, 0)
  const sy = (value) => 178 - ((value - min) / Math.max(1, max - min)) * 120
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="34" y1="180" x2="332" y2="180" stroke={INK} strokeWidth="2" />
      {terms.map((value, index) => {
        const x = 58 + index * 52
        return (
          <g key={index}>
            <line x1={x} y1="180" x2={x} y2={sy(value)} stroke={`${color}65`} strokeWidth="8" strokeLinecap="round" />
            <circle cx={x} cy={sy(value)} r="7" fill={color} />
            <SvgText x={x} y={sy(value) - 16} size={11}>{value}</SvgText>
            <SvgText x={x} y="199" size={9} fill={MUTED}>a{index + 1}</SvgText>
          </g>
        )
      })}
      {terms.slice(0, -1).map((_, index) => (
        <SvgText key={index} x={84 + index * 52} y="45" size={10} fill={WARM}>{d >= 0 ? '+' : ''}{d}</SvgText>
      ))}
    </Stage>
  )
}

function VectorScene({ values, color, markerId, label }) {
  const theta = n(values.theta)
  const origin = { x: 85, y: 165 }
  const a = { x: 120, y: 0 }
  const b = { x: 80 * Math.cos(rad(theta)), y: -80 * Math.sin(rad(theta)) }
  const aEnd = { x: origin.x + a.x, y: origin.y + a.y }
  const bEnd = { x: origin.x + b.x, y: origin.y + b.y }
  const sum = { x: origin.x + a.x + b.x, y: origin.y + b.y }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line data-vector="a" x1={origin.x} y1={origin.y} x2={aEnd.x} y2={aEnd.y} stroke={color} strokeWidth="5" markerEnd={`url(#${markerId})`} />
      <line data-vector="b" x1={origin.x} y1={origin.y} x2={bEnd.x} y2={bEnd.y} stroke={ROSE} strokeWidth="5" markerEnd={`url(#${markerId}-rose)`} />
      <line x1={aEnd.x} y1={aEnd.y} x2={sum.x} y2={sum.y} stroke={ROSE} strokeWidth="3" strokeDasharray="6 4" />
      <line x1={bEnd.x} y1={bEnd.y} x2={sum.x} y2={sum.y} stroke={color} strokeWidth="3" strokeDasharray="6 4" />
      <line data-vector="sum" x1={origin.x} y1={origin.y} x2={sum.x} y2={sum.y} stroke={WARM} strokeWidth="6" markerEnd={`url(#${markerId}-warm)`} />
      <circle cx={origin.x} cy={origin.y} r="5" fill={INK} />
      <SvgText x={(origin.x + aEnd.x) / 2} y={origin.y + 18} size={12} fill={color}>a</SvgText>
      <SvgText x={(origin.x + bEnd.x) / 2 - 10} y={(origin.y + bEnd.y) / 2 - 8} size={12} fill={ROSE}>b</SvgText>
      <SvgText x={(origin.x + sum.x) / 2 + 15} y={(origin.y + sum.y) / 2 - 12} size={12} fill={WARM}>a+b</SvgText>
      <SvgText x="180" y="207" size={11}>平行四辺形の対角線が和になる</SvgText>
    </Stage>
  )
}

export function MathVisual({ intro, values, unit, label }) {
  const color = readableMathAccent(unit?.color)
  const markerId = `math-intro-arrow-${unit?.id ?? 'unit'}`
  const props = { variant: intro.variant, values, color, markerId, label }

  switch (intro.kind) {
    case 'number': return <NumberScene {...props} />
    case 'balance': return <BalanceScene {...props} />
    case 'algebra': return <AlgebraScene {...props} />
    case 'graph': return <GraphScene {...props} />
    case 'geometry': return <GeometryScene {...props} />
    case 'solid': return <SolidScene {...props} />
    case 'data': return <DataScene {...props} />
    case 'probability': return <ProbabilityScene {...props} />
    case 'set': return <SetScene {...props} />
    case 'integer': return <IntegerScene {...props} />
    case 'complex': return <ComplexScene {...props} />
    case 'trig-wave': return <TrigWaveScene {...props} />
    case 'calculus': return <CalculusScene {...props} />
    case 'sequence': return <SequenceScene {...props} />
    case 'vector': return <VectorScene {...props} />
    default: return null
  }
}
