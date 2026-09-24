import { nice } from '../../data/math-history/controls.js'
import {
  ELLIPSE_A,
  NORMAL_BANDS,
  SERIES,
  bandProbability,
  binomialHalf,
  ellipsePoint,
  partialSum,
  teaAtLeast,
  teaWays,
  vectorSum,
} from '../../data/math-history/senior-more.js'
import { BLUE, GOOD, GRID, INK, MUTED, PAPER, ROSE, Stage, SvgText, WARM, apart, num } from './stage.jsx'

// 第3部「高校の数学」の話の図（おわり：統計的な推測・ベクトル・式と曲線・極限）。

const rad = (degrees) => (degrees * Math.PI) / 180

/** 始点から終点への矢印（線と三角の頭）。 */
function Arrow({ from, to, tone, width = 2.4 }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)
  if (length < 1) return null
  const ux = dx / length
  const uy = dy / length
  const head = Math.min(9, length / 2)
  const base = { x: to.x - ux * head, y: to.y - uy * head }
  const side = { x: -uy * head * 0.5, y: ux * head * 0.5 }
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={base.x} y2={base.y} stroke={tone} strokeWidth={width} />
      <polygon points={`${to.x},${to.y} ${base.x + side.x},${base.y + side.y} ${base.x - side.x},${base.y - side.y}`} fill={tone} />
    </g>
  )
}

// ── 二項分布と正規分布：表の回数の確率の山 ───────────────────────────────
function GaltonBoardScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const width = NORMAL_BANDS[values.band].width
  const probs = binomialHalf(n)
  const max = Math.max(...probs)
  const plot = { left: 24, right: 248, bottom: 180, height: 140 }
  const barW = (plot.right - plot.left) / (n + 1)
  const X = (k) => plot.left + (k + 0.5) * barW
  const H = (p) => (p / max) * plot.height
  const { lo, hi, sum, mean, sd } = bandProbability(n, width || 1)
  const pdf = (x) => Math.exp(-(((x - mean) / sd) ** 2) / 2) / (sd * Math.sqrt(2 * Math.PI))
  const curve = Array.from({ length: 121 }, (_, index) => {
    const x = -0.5 + ((n + 1) * index) / 120
    return `${index ? 'L' : 'M'}${X(x).toFixed(2)} ${(plot.bottom - H(pdf(x))).toFixed(2)}`
  }).join(' ')
  const curveTone = apart(color, BLUE, ROSE)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {probs.map((p, k) => {
        const inBand = width > 0 && k >= lo && k <= hi
        return (
          <rect
            key={k}
            x={X(k) - barW / 2 + (barW > 4 ? 0.8 : 0)}
            y={plot.bottom - H(p)}
            width={Math.max(0.6, barW - (barW > 4 ? 1.6 : 0))}
            height={H(p)}
            fill={inBand ? color : `${MUTED}66`}
          />
        )
      })}
      <path d={curve} fill="none" stroke={curveTone} strokeWidth="1.8" />
      <line x1={plot.left} y1={plot.bottom} x2={plot.right} y2={plot.bottom} stroke={INK} strokeWidth="1.2" />
      <line x1={X(mean)} y1={plot.bottom} x2={X(mean)} y2={plot.bottom - plot.height - 8} stroke={INK} strokeWidth="1" strokeDasharray="3 3" />
      <SvgText x={X(0)} y={plot.bottom + 11} size={9} fill={MUTED}>0</SvgText>
      <SvgText x={X(n)} y={plot.bottom + 11} size={9} fill={MUTED}>{n}</SvgText>
      <SvgText x={X(mean)} y={plot.bottom + 11} size={9} fill={MUTED}>{mean}</SvgText>
      {width > 0 && (
        <g>
          <line x1={X(lo) - barW / 2} y1={plot.bottom + 22} x2={X(hi) + barW / 2} y2={plot.bottom + 22} stroke={color} strokeWidth="2" />
          <SvgText x={X(mean)} y={plot.bottom + 33} size={9} weight={800} fill={color}>{`${lo}回〜${hi}回`}</SvgText>
        </g>
      )}
      <SvgText x="24" y="18" anchor="start" size={9} fill={MUTED}>表の回数ごとの確率（線はつりがね形の曲線）</SvgText>
      <SvgText x="258" y="48" anchor="start" size={10}>{`${n}回投げる`}</SvgText>
      <SvgText x="258" y="68" anchor="start" size={10}>{`平均 ${mean}回`}</SvgText>
      <SvgText x="258" y="88" anchor="start" size={10}>{`標準偏差 ${nice(sd, 2)}`}</SvgText>
      <g data-normal-band={width ? nice(sum * 100, 1) : 'none'}>
        {width > 0 && <SvgText x="258" y="120" anchor="start" size={10} fill={color}>この範囲に入る</SvgText>}
        {width > 0 && <SvgText x="258" y="142" anchor="start" size={16} weight={800} fill={color}>{`${nice(sum * 100, 1)}%`}</SvgText>}
      </g>
      {width > 0 && <SvgText x="258" y="164" anchor="start" size={9} fill={MUTED}>{`正規分布なら ${width === 1 ? '68.3' : '95.4'}%`}</SvgText>}
    </Stage>
  )
}

// ── 仮説検定：8杯の紅茶と、あてずっぽうで当たる確率 ───────────────────────
const CUP_ORDER = ['milk', 'tea', 'tea', 'milk', 'tea', 'milk', 'milk', 'tea']

function TeaTestScene({ values, color, markerId, label }) {
  const hits = num(values.hits)
  const other = apart(color, BLUE, ROSE)
  let milkPicked = 0
  let teaPicked = 0
  const cups = CUP_ORDER.map((kind) => {
    let picked = false
    if (kind === 'milk' && milkPicked < hits) {
      milkPicked += 1
      picked = true
    } else if (kind === 'tea' && teaPicked < 4 - hits) {
      teaPicked += 1
      picked = true
    }
    return { kind, picked }
  })
  const count = teaAtLeast(hits)
  const barX = (k) => 44 + k * 42
  const barH = (ways) => (ways / 36) * 70
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="16" y="14" anchor="start" size={9} fill={MUTED}>8杯（◯＝ミルクが先、△＝紅茶が先）と、選んだ4杯（色のわく）</SvgText>
      {cups.map((cup, index) => {
        const x = 30 + index * 40
        return (
          <g key={index} data-tea-cup={cup.kind} data-tea-picked={cup.picked ? 'yes' : 'no'}>
            {cup.picked && <rect x={x - 16} y="24" width="32" height="48" rx="6" fill="none" stroke={cup.kind === 'milk' ? color : other} strokeWidth="2.2" />}
            <path d={`M${x - 10} 34 L${x + 10} 34 L${x + 7} 58 L${x - 7} 58 Z`} fill="#c08457" stroke={MUTED} strokeWidth="1" />
            <SvgText x={x} y="66" size={10} weight={800} fill={cup.kind === 'milk' ? color : MUTED}>{cup.kind === 'milk' ? '◯' : '△'}</SvgText>
          </g>
        )
      })}
      {[0, 1, 2, 3, 4].map((k) => {
        const ways = teaWays(k)
        const on = k >= hits
        return (
          <g key={k}>
            <rect x={barX(k) - 14} y={188 - barH(ways)} width="28" height={barH(ways)} fill={on ? color : `${MUTED}55`} />
            <SvgText x={barX(k)} y={182 - barH(ways)} size={9} fill={on ? color : MUTED}>{`${ways}`}</SvgText>
            <SvgText x={barX(k)} y="200" size={9} fill={MUTED}>{`${k}杯`}</SvgText>
          </g>
        )
      })}
      <SvgText x="44" y="214" anchor="start" size={9} fill={MUTED}>当たった杯の数ごとの選び方（全部で70通り）</SvgText>
      <g data-tea-count={count}>
        <SvgText x="262" y="118" anchor="start" size={10}>{`${hits}杯以上当たる`}</SvgText>
        <SvgText x="262" y="138" anchor="start" size={11} weight={800} fill={color}>{`${count}/70 通り`}</SvgText>
        <SvgText x="262" y="162" anchor="start" size={16} weight={800} fill={color}>{`≈${nice((count / 70) * 100, 1)}%`}</SvgText>
      </g>
    </Stage>
  )
}

// ── ベクトル：力の平行四辺形 ─────────────────────────────────────────
function VectorSumScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const angle = num(values.angle)
  const { bx, by, rx, ry, length } = vectorSum(a, b, angle)
  const O = { x: 100, y: 172 }
  const unit = 26
  const P = (x, y) => ({ x: O.x + x * unit, y: O.y - y * unit })
  const A = P(a, 0)
  const B = P(bx, by)
  const R = P(rx, ry)
  const bTone = apart(color, WARM, BLUE)
  const aTone = apart(color, BLUE, GOOD)
  const arc = (() => {
    const r = 20
    if (angle === 0) return null
    const end = { x: O.x + r * Math.cos(rad(angle)), y: O.y - r * Math.sin(rad(angle)) }
    return `M${O.x + r} ${O.y} A${r} ${r} 0 0 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
  })()
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="14" y1={O.y} x2="346" y2={O.y} stroke={GRID} strokeWidth="1.2" />
      <line x1={A.x} y1={A.y} x2={R.x} y2={R.y} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <line x1={B.x} y1={B.y} x2={R.x} y2={R.y} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      {arc && <path d={arc} fill="none" stroke={INK} strokeWidth="1.2" />}
      {arc && <SvgText x={O.x + 30 * Math.cos(rad(angle / 2))} y={O.y - 30 * Math.sin(rad(angle / 2))} size={9} fill={MUTED}>{`${angle}°`}</SvgText>}
      <Arrow from={O} to={A} tone={aTone} />
      <Arrow from={O} to={B} tone={bTone} />
      <g data-vector-length={nice(length, 2)}>
        <Arrow from={O} to={R} tone={color} width={3} />
      </g>
      <circle cx={O.x} cy={O.y} r="3" fill={INK} />
      <SvgText x={A.x + 4} y={A.y + 12} anchor="start" size={11} weight={800} fill={aTone}>a</SvgText>
      <SvgText x={B.x + (bx >= 0 ? 6 : -6)} y={B.y - 8} anchor={bx >= 0 ? 'start' : 'end'} size={11} weight={800} fill={bTone}>b</SvgText>
      <SvgText x={R.x + (rx >= 0 ? 6 : -6)} y={R.y - 8} anchor={rx >= 0 ? 'start' : 'end'} size={11} weight={800} fill={color}>a＋b</SvgText>
      <SvgText x="350" y="22" anchor="end" size={10}>{`a＝(${a}, 0)　b＝(${nice(bx, 2)}, ${nice(by, 2)})`}</SvgText>
      <SvgText x="350" y="42" anchor="end" size={10} fill={color}>{`a＋b＝(${nice(rx, 2)}, ${nice(ry, 2)})`}</SvgText>
      <SvgText x="350" y="66" anchor="end" size={14} weight={800} fill={color}>{`大きさ ${nice(length, 2)}`}</SvgText>
    </Stage>
  )
}

// ── だ円：2本のピンと糸 ─────────────────────────────────────────────
function EllipseStringScene({ values, color, markerId, label }) {
  const e = num(values.e)
  const t = num(values.t)
  const { b, c, x, y, d1, d2 } = ellipsePoint(e, t)
  const unit = 19
  const C = { x: 180, y: 114 }
  const F1 = { x: C.x - c * unit, y: C.y }
  const F2 = { x: C.x + c * unit, y: C.y }
  const P = { x: C.x + x * unit, y: C.y - y * unit }
  const one = apart(color, BLUE, ROSE)
  const two = apart(color, WARM, ROSE)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <ellipse cx={C.x} cy={C.y} rx={ELLIPSE_A * unit} ry={b * unit} fill={`${color}14`} stroke={color} strokeWidth="2.2" />
      <line x1={F1.x} y1={F1.y} x2={P.x} y2={P.y} stroke={one} strokeWidth="1.8" />
      <line x1={P.x} y1={P.y} x2={F2.x} y2={F2.y} stroke={two} strokeWidth="1.8" />
      <circle cx={F1.x} cy={F1.y} r="4" fill={INK} />
      <circle cx={F2.x} cy={F2.y} r="4" fill={INK} />
      <circle cx={P.x} cy={P.y} r="5" fill={color} />
      <SvgText x={F1.x} y={F1.y + 14} size={9} fill={MUTED}>焦点1</SvgText>
      <SvgText x={F2.x} y={F2.y + (c > 0.3 ? 14 : 26)} size={9} fill={MUTED}>焦点2</SvgText>
      <SvgText x={(F1.x + P.x) / 2 - 6} y={(F1.y + P.y) / 2 - 6} anchor="end" size={10} weight={800} fill={one}>{nice(d1, 2)}</SvgText>
      <SvgText x={(F2.x + P.x) / 2 + 6} y={(F2.y + P.y) / 2 - 6} anchor="start" size={10} weight={800} fill={two}>{nice(d2, 2)}</SvgText>
      <SvgText x="12" y="18" anchor="start" size={10}>{`離心率 ${nice(e, 1)}`}</SvgText>
      <g data-ellipse-sum={nice(d1 + d2, 2)}>
        <SvgText x="348" y="18" anchor="end" size={11} weight={800} fill={color}>{`${nice(d1, 2)} ＋ ${nice(d2, 2)} ＝ ${nice(d1 + d2, 2)}`}</SvgText>
      </g>
      <SvgText x="348" y="208" anchor="end" size={9} fill={MUTED}>2つの焦点からの距離の和（糸の長さ）</SvgText>
    </Stage>
  )
}

// ── 放物線と焦点：平行な光が焦点に集まる ───────────────────────────────
function ParabolaFocusScene({ values, color, markerId, label }) {
  const p = num(values.p)
  const ray = num(values.ray)
  const ymax = 3.5 ** 2 / (4 * p)
  const unit = Math.min(38, 170 / (ymax + p))
  const O = { x: 150, y: 196 - p * unit }
  const X = (value) => O.x + value * unit
  const Y = (value) => O.y - value * unit
  const f = (value) => (value * value) / (4 * p)
  const rayTone = apart(color, WARM, ROSE)
  const focus = { x: X(0), y: Y(p) }
  const top = Math.min(Y(ymax) - 6, 20)
  const curve = Array.from({ length: 71 }, (_, index) => {
    const value = -3.5 + index * 0.1
    return `${index ? 'L' : 'M'}${X(value).toFixed(2)} ${Y(f(value)).toFixed(2)}`
  }).join(' ')
  const hit = { x: X(ray), y: Y(f(ray)) }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1={X(-3.8)} y1={Y(-p)} x2={X(3.8)} y2={Y(-p)} stroke={MUTED} strokeWidth="1.2" strokeDasharray="5 3" />
      <SvgText x={X(-3.8)} y={Y(-p) + 12} anchor="start" size={9} fill={MUTED}>準線</SvgText>
      {[-3, -2, -1, 1, 2, 3].filter((value) => value !== ray).map((value) => (
        <g key={value}>
          <line x1={X(value)} y1={top} x2={X(value)} y2={Y(f(value))} stroke={`${MUTED}88`} strokeWidth="0.8" />
          <line x1={X(value)} y1={Y(f(value))} x2={focus.x} y2={focus.y} stroke={`${MUTED}88`} strokeWidth="0.8" />
        </g>
      ))}
      <path d={curve} fill="none" stroke={color} strokeWidth="2.4" />
      <line x1={hit.x} y1={top} x2={hit.x} y2={hit.y} stroke={rayTone} strokeWidth="2" />
      {ray !== 0 && <line x1={hit.x} y1={hit.y} x2={focus.x} y2={focus.y} stroke={rayTone} strokeWidth="2" />}
      {ray !== 0 && <line x1={hit.x} y1={hit.y} x2={hit.x} y2={Y(-p)} stroke={rayTone} strokeWidth="1" strokeDasharray="2 3" />}
      <circle cx={hit.x} cy={hit.y} r="3.5" fill={rayTone} />
      <circle cx={focus.x} cy={focus.y} r="4.5" fill={INK} />
      <SvgText x={focus.x + 8} y={focus.y - 8} anchor="start" size={10} weight={800}>焦点</SvgText>
      <g data-parabola-distance={nice(f(ray) + p, 2)}>
        <SvgText x="350" y="22" anchor="end" size={10}>{`焦点 (0, ${nice(p, 1)})`}</SvgText>
        {ray !== 0 && <SvgText x="350" y="42" anchor="end" size={10} weight={800} fill={rayTone}>{`焦点まで＝準線まで＝${nice(f(ray) + p, 2)}`}</SvgText>}
      </g>
    </Stage>
  )
}

// ── 極限：半分ずつたす和と、アキレスと亀 ───────────────────────────────
function ZenoSeriesScene({ values, color, markerId, label }) {
  const series = values.series
  const n = num(values.n)
  const sum = partialSum(series, n)
  const tones = [color, apart(color, WARM, ROSE), apart(color, BLUE, GOOD)]
  if (series === 'half') {
    const L = 300
    const x0 = 30
    let start = 0
    const parts = Array.from({ length: n }, (_, index) => {
      const size = 1 / 2 ** (index + 1)
      const part = { start, size, index }
      start += size
      return part
    })
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <rect x={x0} y="70" width={L} height="44" fill="none" stroke={INK} strokeWidth="1.4" />
        {parts.map((part) => (
          <g key={part.index}>
            <rect x={x0 + part.start * L} y="70" width={part.size * L} height="44" fill={`${tones[part.index % tones.length]}55`} stroke={tones[part.index % tones.length]} strokeWidth="1" />
            {part.index < 4 && <SvgText x={x0 + (part.start + part.size / 2) * L} y="92" size={10} weight={800} fill={tones[part.index % tones.length]}>{`1/${2 ** (part.index + 1)}`}</SvgText>}
          </g>
        ))}
        <SvgText x={x0} y="128" size={9} fill={MUTED}>0</SvgText>
        <SvgText x={x0 + L} y="128" size={9} fill={MUTED}>1</SvgText>
        <SvgText x={x0} y="54" anchor="start" size={10} fill={MUTED}>全体（1）を半分、その半分、…とうめていく</SvgText>
        <g data-zeno-sum={nice(sum, 6)}>
          <SvgText x="180" y="160" size={13} weight={800} fill={color}>{`${n}回たした和 ＝ ${nice(sum, 6)}`}</SvgText>
        </g>
        <SvgText x="180" y="184" size={10} fill={MUTED}>{`残り 1/${2 ** n}（回数をふやすほど0に近づく）`}</SvgText>
      </Stage>
    )
  }
  const X = (meters) => 20 + meters * 2.6
  const jumps = Array.from({ length: n }, (_, index) => ({ from: index === 0 ? 0 : partialSum(series, index), to: partialSum(series, index + 1), index }))
  const limit = SERIES.achilles.limit
  const tortoise = 100 + sum / 10
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1={X(0)} y1="150" x2={X(124)} y2="150" stroke={INK} strokeWidth="1.4" />
      {[0, 50, 100].map((meters) => <SvgText key={meters} x={X(meters)} y="164" size={9} fill={MUTED}>{`${meters}m`}</SvgText>)}
      <line x1={X(limit)} y1="60" x2={X(limit)} y2="156" stroke={INK} strokeWidth="1" strokeDasharray="3 3" />
      <SvgText x={X(limit) - 4} y="52" anchor="end" size={9} fill={MUTED}>追いつく場所 111.1m</SvgText>
      {jumps.map((jump) => {
        const mid = (X(jump.from) + X(jump.to)) / 2
        const height = Math.max(6, (X(jump.to) - X(jump.from)) / 2)
        return (
          <path
            key={jump.index}
            d={`M${X(jump.from).toFixed(2)} 150 Q${mid.toFixed(2)} ${(150 - height).toFixed(2)} ${X(jump.to).toFixed(2)} 150`}
            fill="none"
            stroke={tones[jump.index % tones.length]}
            strokeWidth="1.6"
          />
        )
      })}
      <circle cx={X(sum)} cy="150" r="4.5" fill={color} />
      <circle cx={X(tortoise)} cy="150" r="4.5" fill={INK} />
      <SvgText x={X(sum) - 2} y="176" anchor="end" size={10} weight={800} fill={color}>アキレス</SvgText>
      <SvgText x={X(tortoise) + 2} y="190" anchor="start" size={10} weight={800}>亀</SvgText>
      <g data-zeno-sum={nice(sum, 6)}>
        <SvgText x="20" y="20" anchor="start" size={11} weight={800} fill={color}>{`${n}回目までに走った距離 ${nice(sum, 4)}m`}</SvgText>
      </g>
      <SvgText x="20" y="38" anchor="start" size={9} fill={MUTED}>亀は100m先から、アキレスの10分の1の速さで進む</SvgText>
    </Stage>
  )
}

export const SENIOR_MORE_SCENES = Object.freeze({
  'galton-board': GaltonBoardScene,
  'tea-test': TeaTestScene,
  'vector-sum': VectorSumScene,
  'ellipse-string': EllipseStringScene,
  'parabola-focus': ParabolaFocusScene,
  'zeno-series': ZenoSeriesScene,
})
