import { nice } from '../../data/math-history/controls.js'
import {
  AREA_FUNCTIONS,
  WAVE_SHAPES,
  boxSlope,
  boxVolume,
  fibonacci,
  riemannSum,
  waveSum,
} from '../../data/math-history/senior-calculus.js'
import { BLUE, GOOD, GRID, INK, MUTED, ROSE, Stage, SvgText, WARM, apart, num } from './stage.jsx'

// 第3部「高校の数学」の話の図（中ほど：三角関数・微分・積分・数列）。

const rad = (degrees) => (degrees * Math.PI) / 180
const sample = (count, from, to, fn, toX, toY) => Array.from({ length: count + 1 }, (_, index) => {
  const t = from + ((to - from) * index) / count
  return `${index ? 'L' : 'M'}${toX(t).toFixed(2)} ${toY(fn(t)).toFixed(2)}`
}).join(' ')

// ── 三角関数と波：円をまわる点の高さと、サイン波の和 ───────────────────────
function FourierWavesScene({ values, color, markerId, label }) {
  const shape = values.shape
  const terms = num(values.terms)
  const theta = num(values.theta)
  const target = apart(color, BLUE, ROSE)
  const circle = { x: 52, y: 104, r: 34 }
  const graph = { left: 104, right: 344, mid: 104, amp: 34 }
  const gx = (degrees) => graph.left + (degrees / 360) * (graph.right - graph.left)
  const gy = (value) => graph.mid - value * graph.amp
  const wave = (fn) => sample(180, 0, 360, (degrees) => fn(rad(degrees)), gx, gy)
  const t = rad(theta)
  const point = { x: circle.x + circle.r * Math.cos(t), y: circle.y - circle.r * Math.sin(t) }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <circle cx={circle.x} cy={circle.y} r={circle.r} fill="none" stroke={INK} strokeWidth="1.4" />
      <line x1={circle.x - circle.r - 4} y1={circle.y} x2={circle.x + circle.r + 4} y2={circle.y} stroke={GRID} strokeWidth="1" />
      <line x1={circle.x} y1={circle.y} x2={point.x} y2={point.y} stroke={MUTED} strokeWidth="1.2" />
      <line x1={point.x} y1={point.y} x2={gx(theta)} y2={gy(Math.sin(t))} stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      <line x1={graph.left} y1={graph.mid} x2={graph.right + 6} y2={graph.mid} stroke={INK} strokeWidth="1.2" />
      {[0, 180, 360].map((degrees) => <SvgText key={degrees} x={gx(degrees)} y={graph.mid + 12} size={9} fill={MUTED}>{`${degrees}°`}</SvgText>)}
      <path d={wave(WAVE_SHAPES[shape].target)} fill="none" stroke={target} strokeWidth="1.2" strokeDasharray="1.5 2.5" />
      <path d={wave(Math.sin)} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <g data-fourier-terms={terms} data-fourier-peak={nice(waveSum(shape, terms, Math.PI / 2), 3)}>
        <path d={wave((x) => waveSum(shape, terms, x))} fill="none" stroke={color} strokeWidth="2.2" />
      </g>
      <line x1={gx(theta)} y1={graph.mid - 64} x2={gx(theta)} y2={graph.mid + 60} stroke={GRID} strokeWidth="1" />
      <circle cx={point.x} cy={point.y} r="4" fill={color} />
      <circle cx={gx(theta)} cy={gy(Math.sin(t))} r="3.5" fill={MUTED} />
      <SvgText x={circle.x} y={circle.y + circle.r + 14} size={9} fill={MUTED}>{`θ＝${theta}°`}</SvgText>
      <line x1="104" y1="192" x2="122" y2="192" stroke={color} strokeWidth="2.2" />
      <SvgText x="126" y="192" anchor="start" size={9}>{`サイン波${terms}個の和`}</SvgText>
      <line x1="210" y1="192" x2="228" y2="192" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <SvgText x="232" y="192" anchor="start" size={9} fill={MUTED}>sin x</SvgText>
      <line x1="268" y1="192" x2="286" y2="192" stroke={target} strokeWidth="1.2" strokeDasharray="1.5 2.5" />
      <SvgText x="290" y="192" anchor="start" size={9} fill={target}>めざす形</SvgText>
    </Stage>
  )
}

// ── 微分と接線：2点を結ぶ直線が接線に近づく ─────────────────────────────
function SecantTangentScene({ values, color, markerId, label }) {
  const x = num(values.x)
  const h = num(values.h)
  const other = apart(color, WARM, ROSE)
  const plot = { left: 24, right: 226, top: 16, bottom: 200 }
  const range = { x: [-3, 3.5], y: [-1.5, 10] }
  const X = (value) => plot.left + ((value - range.x[0]) / (range.x[1] - range.x[0])) * (plot.right - plot.left)
  const Y = (value) => plot.bottom - ((value - range.y[0]) / (range.y[1] - range.y[0])) * (plot.bottom - plot.top)
  const clip = `${markerId}-plot`
  const secant = 2 * x + h
  const tangent = 2 * x
  const line = (slope, key, tone, dash) => (
    <line
      key={key}
      x1={X(range.x[0])}
      y1={Y(x * x + slope * (range.x[0] - x))}
      x2={X(range.x[1])}
      y2={Y(x * x + slope * (range.x[1] - x))}
      stroke={tone}
      strokeWidth="1.8"
      strokeDasharray={dash}
      clipPath={`url(#${clip})`}
    />
  )
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <defs>
        <clipPath id={clip}>
          <rect x={plot.left} y={plot.top} width={plot.right - plot.left} height={plot.bottom - plot.top} />
        </clipPath>
      </defs>
      <line x1={X(range.x[0])} y1={Y(0)} x2={X(range.x[1])} y2={Y(0)} stroke={INK} strokeWidth="1.1" />
      <line x1={X(0)} y1={plot.bottom} x2={X(0)} y2={plot.top} stroke={INK} strokeWidth="1.1" />
      <path d={sample(80, -3, Math.sqrt(10), (value) => value * value, X, Y)} fill="none" stroke={INK} strokeWidth="2" clipPath={`url(#${clip})`} />
      {line(secant, 'secant', other)}
      {line(tangent, 'tangent', color, '5 3')}
      <circle cx={X(x)} cy={Y(x * x)} r="4.5" fill={color} />
      <circle cx={X(x + h)} cy={Y((x + h) ** 2)} r="3.5" fill={other} />
      <SvgText x={X(0) + 8} y={plot.top + 8} anchor="start" size={10} fill={MUTED}>y＝x²</SvgText>
      <SvgText x="240" y="30" anchor="start" size={10}>{`x ＝ ${nice(x, 1)}、h ＝ ${h}`}</SvgText>
      <g data-secant-slope={nice(secant, 3)} data-tangent-slope={nice(tangent, 2)}>
        <SvgText x="240" y="60" anchor="start" size={10} fill={other}>2点を結ぶ直線の傾き</SvgText>
        <SvgText x="240" y="80" anchor="start" size={15} weight={800} fill={other}>{nice(secant, 3)}</SvgText>
        <SvgText x="240" y="112" anchor="start" size={10} fill={color}>接線の傾き 2x</SvgText>
        <SvgText x="240" y="132" anchor="start" size={15} weight={800} fill={color}>{nice(tangent, 2)}</SvgText>
      </g>
      <SvgText x="240" y="164" anchor="start" size={9} fill={MUTED}>{`差 ${h}（h と同じ）`}</SvgText>
    </Stage>
  )
}

// ── 積分と面積：細い長方形の和 ──────────────────────────────────────
function RiemannSumScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const side = values.side
  const sum = riemannSum(n, side)
  const X = (value) => 40 + value * 210
  const Y = (value) => 196 - value * 160
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <g data-riemann-sum={nice(sum, 4)}>
        {Array.from({ length: n }, (_, k) => {
          const left = k / n
          const height = ((side === 'right' ? k + 1 : k) / n) ** 2
          return (
            <rect key={k} x={X(left)} y={Y(height)} width={X(1 / n) - X(0)} height={Y(0) - Y(height)} fill={`${color}33`} stroke={color} strokeWidth="1" />
          )
        })}
      </g>
      <path d={sample(60, 0, 1, (value) => value * value, X, Y)} fill="none" stroke={INK} strokeWidth="2.2" />
      <line x1={X(0)} y1={Y(0)} x2={X(1) + 8} y2={Y(0)} stroke={INK} strokeWidth="1.2" />
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(1) - 8} stroke={INK} strokeWidth="1.2" />
      <SvgText x={X(0)} y={Y(0) + 11} size={9} fill={MUTED}>0</SvgText>
      <SvgText x={X(1)} y={Y(0) + 11} size={9} fill={MUTED}>1</SvgText>
      <SvgText x={X(0) - 8} y={Y(1)} anchor="end" size={9} fill={MUTED}>1</SvgText>
      <SvgText x={X(0.55)} y={Y(0.62)} size={10} fill={MUTED}>y＝x²</SvgText>
      <SvgText x="266" y="40" anchor="start" size={10}>{`長方形 ${n}本`}</SvgText>
      <SvgText x="266" y="62" anchor="start" size={10} fill={color}>面積の和</SvgText>
      <SvgText x="266" y="84" anchor="start" size={15} weight={800} fill={color}>{nice(sum, 4)}</SvgText>
      <SvgText x="266" y="116" anchor="start" size={10}>本当の面積</SvgText>
      <SvgText x="266" y="136" anchor="start" size={12} weight={800}>1/3 ≈ 0.3333</SvgText>
      <SvgText x="266" y="166" anchor="start" size={10} fill={MUTED}>{`差 ${nice(Math.abs(sum - 1 / 3), 4)}`}</SvgText>
    </Stage>
  )
}

// ── 微分と積分は逆の計算：面積の関数の傾きは高さ ─────────────────────────
function AreaFunctionScene({ values, color, markerId, label }) {
  const meta = AREA_FUNCTIONS[values.f]
  const x = num(values.x)
  const other = apart(color, WARM, ROSE)
  const fMax = meta.f(3)
  const sMax = meta.S(3)
  const X = (value) => 44 + value * 70
  const upper = (value) => 100 - (value / fMax) * 76
  const lower = (value) => 206 - (value / sMax) * 76
  const S = meta.S(x)
  const f = meta.f(x)
  const area = [`M${X(0)} ${upper(0)}`, sample(40, 0, x, meta.f, X, upper).replace(/^M/, 'L'), `L${X(x)} ${upper(0)} Z`].join(' ')
  const strip = 0.25
  const tangentHalf = 0.45
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <path d={area} fill={`${color}33`} stroke="none" />
      <rect x={X(x)} y={upper(meta.f(x + strip / 2))} width={X(strip) - X(0)} height={upper(0) - upper(meta.f(x + strip / 2))} fill={`${other}40`} stroke={other} strokeWidth="1" />
      <path d={sample(60, 0, 3, meta.f, X, upper)} fill="none" stroke={INK} strokeWidth="2" />
      <line x1={X(0)} y1={upper(0)} x2={X(3) + 6} y2={upper(0)} stroke={INK} strokeWidth="1.1" />
      <line x1={X(x)} y1={upper(0)} x2={X(x)} y2={upper(f)} stroke={other} strokeWidth="1.6" />
      <SvgText x={X(0) - 6} y={upper(fMax)} anchor="end" size={9} fill={MUTED}>f</SvgText>
      <SvgText x={X(x) - 4} y={upper(f) - 8} anchor="end" size={10} weight={800} fill={other}>{`高さ ${nice(f, 2)}`}</SvgText>
      <path d={sample(60, 0, 3, meta.S, X, lower)} fill="none" stroke={color} strokeWidth="2" />
      <line x1={X(0)} y1={lower(0)} x2={X(3) + 6} y2={lower(0)} stroke={INK} strokeWidth="1.1" />
      <line
        x1={X(x - tangentHalf)}
        y1={lower(S - f * tangentHalf)}
        x2={X(x + tangentHalf)}
        y2={lower(S + f * tangentHalf)}
        stroke={other}
        strokeWidth="2"
      />
      <g data-area-s={nice(S, 3)} data-area-slope={nice(f, 2)}>
        <circle cx={X(x)} cy={lower(S)} r="4" fill={color} />
      </g>
      <SvgText x={X(0) - 6} y={lower(sMax)} anchor="end" size={9} fill={MUTED}>S</SvgText>
      {[0, 1, 2, 3].map((value) => <SvgText key={value} x={X(value)} y={lower(0) + 10} size={9} fill={MUTED}>{value}</SvgText>)}
      <SvgText x="270" y="34" anchor="start" size={10} fill={color}>上：面積（色）</SvgText>
      <SvgText x="270" y="54" anchor="start" size={10}>{`S(${nice(x, 1)})≈${nice(S, 2)}`}</SvgText>
      <SvgText x="270" y="128" anchor="start" size={10} fill={color}>下：面積の関数</SvgText>
      <SvgText x="270" y="148" anchor="start" size={10} fill={other}>{`傾き ${nice(f, 2)}`}</SvgText>
      <SvgText x="270" y="166" anchor="start" size={9} fill={MUTED}>＝上の高さ</SvgText>
    </Stage>
  )
}

// ── 最大・最小：箱の体積のグラフと、傾き 0 の点 ───────────────────────────
function BoxVolumeScene({ values, color, markerId, label }) {
  const x = num(values.x)
  const V = boxVolume(x)
  const slope = boxSlope(x)
  const other = apart(color, WARM, ROSE)
  const sheet = { x: 14, y: 52, size: 108, unit: 9 }
  const cut = x * sheet.unit
  const X = (value) => 150 + value * 32
  const Y = (value) => 190 - value * 1.1
  const half = 0.7
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x={sheet.x + sheet.size / 2} y="38" size={10} fill={MUTED}>1辺12cmの紙</SvgText>
      <rect x={sheet.x} y={sheet.y} width={sheet.size} height={sheet.size} fill={`${color}14`} stroke={INK} strokeWidth="1.4" />
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j]) => (
        <rect
          key={`${i}${j}`}
          x={sheet.x + i * (sheet.size - cut)}
          y={sheet.y + j * (sheet.size - cut)}
          width={cut}
          height={cut}
          fill={`${other}55`}
          stroke={other}
          strokeWidth="1"
        />
      ))}
      <rect x={sheet.x + cut} y={sheet.y + cut} width={sheet.size - 2 * cut} height={sheet.size - 2 * cut} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      <SvgText x={sheet.x + sheet.size / 2} y={sheet.y + sheet.size + 14} size={10}>{`底 ${nice(12 - 2 * x, 1)}×${nice(12 - 2 * x, 1)}・高さ ${nice(x, 1)}`}</SvgText>
      <line x1={X(0)} y1={Y(0)} x2={X(6) + 6} y2={Y(0)} stroke={INK} strokeWidth="1.2" />
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(140)} stroke={INK} strokeWidth="1.2" />
      <line x1={X(2)} y1={Y(0)} x2={X(2)} y2={Y(128)} stroke={GRID} strokeWidth="1.2" />
      <path d={sample(60, 0, 6, boxVolume, X, Y)} fill="none" stroke={color} strokeWidth="2.2" />
      <line x1={X(x - half)} y1={Y(V - slope * half)} x2={X(x + half)} y2={Y(V + slope * half)} stroke={other} strokeWidth="2" />
      <g data-box-volume={nice(V, 2)} data-box-slope={nice(slope, 2)}>
        <circle cx={X(x)} cy={Y(V)} r="4.5" fill={color} />
      </g>
      {[0, 2, 4, 6].map((value) => <SvgText key={value} x={X(value)} y={Y(0) + 11} size={9} fill={MUTED}>{value}</SvgText>)}
      <SvgText x={X(2)} y={Y(128) - 10} size={9} fill={MUTED}>最大 128</SvgText>
      <SvgText x={X(6)} y={Y(0) + 22} anchor="end" size={9} fill={MUTED}>x（cm）</SvgText>
      <SvgText x="352" y="30" anchor="end" size={11} weight={800} fill={color}>{`V ＝ ${nice(V, 2)} cm³`}</SvgText>
      <SvgText x="352" y="48" anchor="end" size={11} weight={800} fill={other}>{`V′ ＝ ${nice(slope, 2)}`}</SvgText>
    </Stage>
  )
}

// ── 等差数列の和：階段を2つ組み合わせると長方形 ─────────────────────────
function StaircaseSumScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const double = values.view === 'double'
  const other = apart(color, WARM, ROSE)
  const unit = Math.min(15, 170 / (n + 1))
  const base = { x: 24, y: 196 }
  const sum = (n * (n + 1)) / 2
  const cells = []
  for (let k = 1; k <= n; k += 1) {
    for (let row = 0; row < (double ? n + 1 : k); row += 1) {
      cells.push({ key: `${k}-${row}`, x: base.x + (k - 1) * unit, y: base.y - (row + 1) * unit, stairs: row < k })
    }
  }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <g data-staircase-sum={sum} data-staircase-cells={cells.length}>
        {cells.map((cell) => (
          <rect key={cell.key} x={cell.x} y={cell.y} width={unit} height={unit} fill={cell.stairs ? `${color}55` : `${other}40`} stroke={cell.stairs ? color : other} strokeWidth="0.8" />
        ))}
      </g>
      {Array.from({ length: n }, (_, index) => (
        <SvgText key={index} x={base.x + (index + 0.5) * unit} y={base.y + 10} size={unit >= 12 ? 9 : 7} fill={MUTED}>{index + 1}</SvgText>
      ))}
      <SvgText x="236" y="40" anchor="start" size={11}>{`1＋2＋…＋${n}`}</SvgText>
      <SvgText x="236" y="64" anchor="start" size={16} weight={800} fill={color}>{`＝ ${sum}`}</SvgText>
      {double && (
        <g>
          <SvgText x="236" y="100" anchor="start" size={10}>{`長方形 たて${n + 1}・横${n}`}</SvgText>
          <SvgText x="236" y="120" anchor="start" size={10}>{`${n}×${n + 1}＝${n * (n + 1)}ます`}</SvgText>
          <SvgText x="236" y="140" anchor="start" size={10} weight={800} fill={color}>{`その半分 ＝ ${sum}`}</SvgText>
        </g>
      )}
    </Stage>
  )
}

// ── フィボナッチ数列：正方形を並べた長方形と、比の近づき方 ───────────────────
function FibonacciSquaresScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const list = fibonacci(n + 1)
  const tones = [color, apart(color, WARM, ROSE), apart(color, GOOD, BLUE), BLUE]
  const squares = [{ x: 0, y: 0, s: 1 }]
  const box = { x0: 0, y0: 0, x1: 1, y1: 1 }
  for (let k = 2; k <= n; k += 1) {
    const s = list[k - 1]
    const direction = (k - 2) % 4
    let square
    if (direction === 0) square = { x: box.x1, y: box.y0, s }
    else if (direction === 1) square = { x: box.x1 - s, y: box.y1, s }
    else if (direction === 2) square = { x: box.x0 - s, y: box.y1 - s, s }
    else square = { x: box.x0, y: box.y0 - s, s }
    squares.push(square)
    box.x0 = Math.min(box.x0, square.x)
    box.y0 = Math.min(box.y0, square.y)
    box.x1 = Math.max(box.x1, square.x + s)
    box.y1 = Math.max(box.y1, square.y + s)
  }
  const width = box.x1 - box.x0
  const height = box.y1 - box.y0
  const scale = Math.min(200 / width, 180 / height)
  const px = (value) => 16 + (value - box.x0) * scale
  const py = (value) => 200 - (value - box.y0) * scale
  const ratio = list[n] / list[n - 1]
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {squares.map((square, index) => (
        <g key={index}>
          <rect
            x={px(square.x)}
            y={py(square.y + square.s)}
            width={square.s * scale}
            height={square.s * scale}
            fill={`${tones[index % tones.length]}2e`}
            stroke={tones[index % tones.length]}
            strokeWidth="1.2"
          />
          {square.s * scale >= 16 && (
            <SvgText x={px(square.x + square.s / 2)} y={py(square.y + square.s / 2)} size={Math.min(14, 8 + square.s * scale / 20)} weight={800} fill={tones[index % tones.length]}>
              {square.s}
            </SvgText>
          )}
        </g>
      ))}
      <g data-fib-value={list[n - 1]} data-fib-ratio={nice(ratio, 5)}>
        <SvgText x="236" y="30" anchor="start" size={10} fill={MUTED}>{`1番目から${n}番目まで`}</SvgText>
        {Array.from({ length: Math.ceil(n / 4) }, (_, row) => (
          <SvgText key={row} x="236" y={50 + row * 16} anchor="start" size={10}>{list.slice(row * 4, Math.min(n, row * 4 + 4)).join(', ')}</SvgText>
        ))}
        <SvgText x="236" y="126" anchor="start" size={10}>{`${list[n]} ÷ ${list[n - 1]}`}</SvgText>
        <SvgText x="236" y="148" anchor="start" size={15} weight={800} fill={color}>{`≈ ${nice(ratio, 5)}`}</SvgText>
        <SvgText x="236" y="172" anchor="start" size={10} fill={MUTED}>黄金比 1.61803…</SvgText>
      </g>
    </Stage>
  )
}

export const SENIOR_CALCULUS_SCENES = Object.freeze({
  'fourier-waves': FourierWavesScene,
  'secant-tangent': SecantTangentScene,
  'riemann-sum': RiemannSumScene,
  'area-function': AreaFunctionScene,
  'box-volume': BoxVolumeScene,
  'staircase-sum': StaircaseSumScene,
  'fibonacci-squares': FibonacciSquaresScene,
})
