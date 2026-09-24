import { nice, withCommas } from '../../data/math-history/controls.js'
import {
  COMPLEX_MULTIPLIERS,
  CORRELATION_DATA,
  SET_OPERATIONS,
  combination,
  complexText,
  compoundValue,
  correlation,
  euclidSteps,
  setRegions,
} from '../../data/math-history/senior.js'
import { BLUE, GOOD, GRID, INK, MUTED, PAPER, ROSE, Stage, SvgText, WARM, apart, num } from './stage.jsx'

// 第3部「高校の数学」の話の図（数I・数A・数IIのはじめ：集合・三角比・相関・組合せ・互除法・複素数・対数・e）。

const rad = (degrees) => (degrees * Math.PI) / 180

/** 中心 (cx, cy)・半径 r の円の、数学の向き（左回り・上が正）で from°〜to° の弧。 */
const arcPath = (cx, cy, r, from, to) => {
  const start = { x: cx + r * Math.cos(rad(from)), y: cy - r * Math.sin(rad(from)) }
  const end = { x: cx + r * Math.cos(rad(to)), y: cy - r * Math.sin(rad(to)) }
  const large = Math.abs(to - from) > 180 ? 1 : 0
  const sweep = to > from ? 0 : 1
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} A${r} ${r} 0 ${large} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

// ── 集合と命題：ベン図のどこが選ばれるか ─────────────────────────────────
const VENN = { a: { x: 110, y: 108 }, b: { x: 170, y: 108 }, r: 70, box: { x: 12, y: 24, w: 256, h: 180 } }
const grid = (xs, ys) => ys.flatMap((y) => xs.map((x) => ({ x, y })))
const VENN_SLOTS = {
  onlyA: grid([62, 78, 94], [72, 90, 108, 126, 144]),
  both: grid([132, 148], [80, 96, 112, 128]),
  onlyB: grid([186, 202, 218], [72, 90, 108, 126, 144]),
  neither: Array.from({ length: 11 }, (_, index) => ({ x: 26 + index * 22, y: 192 })),
}

function VennSetsScene({ values, color, markerId, label }) {
  const op = values.op
  const n = num(values.n)
  const regions = setRegions(n)
  const chosen = regions.numbers.filter((value) => SET_OPERATIONS[op].has(regions.inA(value), regions.inB(value)))
  const picked = new Set(chosen)
  const clip = `${markerId}-clip-a`
  const { a, b, r, box } = VENN
  const fill = (() => {
    if (op === 'and') return <circle cx={b.x} cy={b.y} r={r} fill={color} opacity="0.28" clipPath={`url(#${clip})`} />
    if (op === 'or') {
      return (
        <g opacity="0.28">
          <circle cx={a.x} cy={a.y} r={r} fill={color} />
          <circle cx={b.x} cy={b.y} r={r} fill={color} />
        </g>
      )
    }
    return (
      <g>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={color} opacity="0.28" />
        {op === 'notA'
          ? <circle cx={a.x} cy={a.y} r={r} fill={PAPER} />
          : <circle cx={b.x} cy={b.y} r={r} fill={PAPER} clipPath={`url(#${clip})`} />}
      </g>
    )
  })()
  const place = (list, slots) => list.map((value, index) => {
    const slot = slots[index]
    if (!slot) return null
    const on = picked.has(value)
    return <SvgText key={value} x={slot.x} y={slot.y} size={10} weight={on ? 800 : 700} fill={on ? color : MUTED}>{value}</SvgText>
  })
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <defs>
        <clipPath id={clip}>
          <circle cx={a.x} cy={a.y} r={r} />
        </clipPath>
      </defs>
      {fill}
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={INK} strokeWidth="1.4" />
      <circle cx={a.x} cy={a.y} r={r} fill="none" stroke={INK} strokeWidth="1.6" />
      <circle cx={b.x} cy={b.y} r={r} fill="none" stroke={INK} strokeWidth="1.6" />
      <SvgText x={a.x - 50} y="34" size={10} weight={800}>A（2の倍数）</SvgText>
      <SvgText x={b.x + 50} y="34" size={10} weight={800}>B（3の倍数）</SvgText>
      <SvgText x={box.x + 4} y="16" anchor="start" size={10} fill={MUTED}>{`U：1から${n}までの整数`}</SvgText>
      {place(regions.onlyA, VENN_SLOTS.onlyA)}
      {place(regions.both, VENN_SLOTS.both)}
      {place(regions.onlyB, VENN_SLOTS.onlyB)}
      {place(regions.neither, VENN_SLOTS.neither)}
      <g data-venn-count={chosen.length}>
        <SvgText x="276" y="48" anchor="start" size={10} fill={MUTED}>選んだ数</SvgText>
        <SvgText x="276" y="72" anchor="start" size={18} weight={800} fill={color}>{`${chosen.length}個`}</SvgText>
      </g>
      <SvgText x="276" y="108" anchor="start" size={10}>{`n(A)＝${regions.onlyA.length + regions.both.length}`}</SvgText>
      <SvgText x="276" y="126" anchor="start" size={10}>{`n(B)＝${regions.onlyB.length + regions.both.length}`}</SvgText>
      <SvgText x="276" y="144" anchor="start" size={10}>{`n(A∩B)＝${regions.both.length}`}</SvgText>
    </Stage>
  )
}

// ── 三角比：見上げる角度と距離から塔の高さを求める ──────────────────────
function TrigTowerScene({ values, color, markerId, label }) {
  const d = num(values.d)
  const theta = num(values.theta)
  const t = rad(theta)
  const h = d * Math.tan(t)
  const scale = Math.min(200 / d, 150 / h)
  const ground = 188
  const O = { x: 26, y: ground }
  const T = { x: O.x + d * scale, y: ground }
  const top = { x: T.x, y: ground - h * scale }
  const other = apart(color, WARM, ROSE)
  const mid = rad(theta / 2)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="10" y1={ground} x2="350" y2={ground} stroke={INK} strokeWidth="1.4" />
      <rect x={T.x} y={top.y} width="10" height={ground - top.y} fill="#e2e8f0" stroke={MUTED} strokeWidth="1.2" />
      <line x1={O.x} y1={O.y} x2={top.x} y2={top.y} stroke={color} strokeWidth="2.2" />
      <path d={`M${T.x - 8} ${ground} L${T.x - 8} ${ground - 8} L${T.x} ${ground - 8}`} fill="none" stroke={INK} strokeWidth="1" />
      <path d={arcPath(O.x, O.y, 30, 0, theta)} fill="none" stroke={other} strokeWidth="2" />
      <SvgText x={O.x + 44 * Math.cos(mid)} y={O.y - 44 * Math.sin(mid)} size={11} weight={800} fill={other}>{`${theta}°`}</SvgText>
      <circle cx={O.x} cy={O.y} r="3.5" fill={INK} />
      <SvgText x={(O.x + T.x) / 2} y={ground + 13} size={10} weight={800}>{`${d}m`}</SvgText>
      <g data-trig-height={nice(h, 1)}>
        <SvgText x={T.x + 14} y={(top.y + ground) / 2} anchor="start" size={11} weight={800} fill={color}>{`h≈${nice(h, 1)}m`}</SvgText>
      </g>
      <SvgText x="248" y="30" anchor="start" size={10}>{`tan${theta}°≈${nice(Math.tan(t), 3)}`}</SvgText>
      <SvgText x="248" y="48" anchor="start" size={10}>{`sin${theta}°≈${nice(Math.sin(t), 3)}`}</SvgText>
      <SvgText x="248" y="66" anchor="start" size={10}>{`cos${theta}°≈${nice(Math.cos(t), 3)}`}</SvgText>
    </Stage>
  )
}

// ── 散布図と相関：点の散らばりと相関係数 ───────────────────────────────
function ScatterCorrelationScene({ values, color, markerId, label }) {
  const meta = CORRELATION_DATA[values.data]
  const { r, mx, my } = correlation(meta.x, meta.y)
  const meanTone = apart(color, BLUE, ROSE)
  const xmin = Math.min(...meta.x)
  const xmax = Math.max(...meta.x)
  const ymin = Math.min(...meta.y)
  const ymax = Math.max(...meta.y)
  const padX = (xmax - xmin) * 0.08
  const padY = (ymax - ymin) * 0.08
  const plot = { left: 44, right: 244, top: 34, bottom: 176 }
  const px = (x) => plot.left + ((x - xmin + padX) / (xmax - xmin + 2 * padX)) * (plot.right - plot.left)
  const py = (y) => plot.bottom - ((y - ymin + padY) / (ymax - ymin + 2 * padY)) * (plot.bottom - plot.top)
  const same = meta.x.filter((x, index) => (x - mx) * (meta.y[index] - my) > 0).length
  const opposite = meta.x.filter((x, index) => (x - mx) * (meta.y[index] - my) < 0).length
  const strength = Math.abs(r) >= 0.7 ? '強い' : Math.abs(r) >= 0.4 ? 'ある程度の' : Math.abs(r) >= 0.2 ? '弱い' : ''
  const words = Math.abs(r) < 0.2 ? '相関はほとんどない' : `${strength}${r > 0 ? '正' : '負'}の相関`
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="10" y="20" anchor="start" size={9} fill={MUTED}>{`↑ ${meta.yLabel}（例のデータ）`}</SvgText>
      <line x1={plot.left} y1={plot.bottom} x2={plot.right} y2={plot.bottom} stroke={INK} strokeWidth="1.2" />
      <line x1={plot.left} y1={plot.bottom} x2={plot.left} y2={plot.top} stroke={INK} strokeWidth="1.2" />
      <SvgText x={px(xmin)} y={plot.bottom + 10} size={9} fill={MUTED}>{xmin}</SvgText>
      <SvgText x={px(xmax)} y={plot.bottom + 10} size={9} fill={MUTED}>{xmax}</SvgText>
      <SvgText x={plot.left - 5} y={py(ymin)} anchor="end" size={9} fill={MUTED}>{ymin}</SvgText>
      <SvgText x={plot.left - 5} y={py(ymax)} anchor="end" size={9} fill={MUTED}>{ymax}</SvgText>
      <SvgText x={(plot.left + plot.right) / 2} y="204" size={9} fill={MUTED}>{`${meta.xLabel} →`}</SvgText>
      {values.view === 'mean' && (
        <g>
          <line x1={px(mx)} y1={plot.top} x2={px(mx)} y2={plot.bottom} stroke={meanTone} strokeWidth="1.2" strokeDasharray="4 3" />
          <line x1={plot.left} y1={py(my)} x2={plot.right} y2={py(my)} stroke={meanTone} strokeWidth="1.2" strokeDasharray="4 3" />
        </g>
      )}
      {meta.x.map((x, index) => <circle key={index} cx={px(x)} cy={py(meta.y[index])} r="4.2" fill={color} />)}
      <g data-correlation-r={nice(r, 2)}>
        <SvgText x="256" y="44" anchor="start" size={10} fill={MUTED}>相関係数</SvgText>
        <SvgText x="256" y="68" anchor="start" size={17} weight={800} fill={color}>{`r≈${nice(r, 2)}`}</SvgText>
      </g>
      <SvgText x="256" y="92" anchor="start" size={10} weight={800}>{words}</SvgText>
      {values.view === 'mean' && (
        <g>
          <SvgText x="256" y="124" anchor="start" size={9} fill={meanTone}>点線＝平均</SvgText>
          <SvgText x="256" y="144" anchor="start" size={9}>{`右上・左下 ${same}個`}</SvgText>
          <SvgText x="256" y="160" anchor="start" size={9}>{`左上・右下 ${opposite}個`}</SvgText>
        </g>
      )}
    </Stage>
  )
}

// ── パスカルの三角形：上の2つの和と組合せの数 ───────────────────────────
function PascalTriangleScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const r = num(values.r)
  const parent = apart(color, BLUE, ROSE)
  const rowY = (k) => 20 + k * 16.4
  const cellX = (k, i) => 180 + (i - k / 2) * 30
  const valid = r <= n
  const value = combination(n, r)
  const parents = valid ? [[n - 1, r - 1], [n - 1, r]].filter(([k, i]) => i >= 0 && i <= k) : []
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <rect x="10" y={rowY(n) - 8} width="340" height="16" rx="4" fill={`${color}18`} />
      {parents.map(([k, i]) => (
        <line key={`l${i}`} x1={cellX(k, i)} y1={rowY(k) + 5} x2={cellX(n, r)} y2={rowY(n) - 5} stroke={parent} strokeWidth="1.4" />
      ))}
      {Array.from({ length: 11 }, (_, k) => Array.from({ length: k + 1 }, (__, i) => {
        const here = valid && k === n && i === r
        const isParent = parents.some(([pk, pi]) => pk === k && pi === i)
        return (
          <g key={`${k}-${i}`}>
            {(here || isParent) && <circle cx={cellX(k, i)} cy={rowY(k)} r="9" fill={PAPER} stroke={here ? color : parent} strokeWidth="1.8" />}
            <SvgText x={cellX(k, i)} y={rowY(k)} size={9} weight={here || isParent ? 800 : 700} fill={here ? color : isParent ? parent : k === n ? INK : MUTED}>
              {combination(k, i)}
            </SvgText>
          </g>
        )
      }))}
      <SvgText x="14" y={rowY(n)} anchor="start" size={9} weight={800} fill={color}>{`${n}段目`}</SvgText>
      <g data-pascal-value={value}>
        <SvgText x="180" y="208" size={12} weight={800} fill={valid ? color : MUTED}>
          {valid ? `${n}個から${r}個を選ぶ選び方 ＝ ${value}通り` : `${n}個から${r}個は選べない（0通り）`}
        </SvgText>
      </g>
    </Stage>
  )
}

// ── 互除法：長方形から正方形を切り取っていく ───────────────────────────
const EUCLID_TONES = (color) => [color, apart(color, WARM, ROSE), apart(color, GOOD, BLUE), BLUE, ROSE, WARM]

function EuclidRectangleScene({ values, color, markerId, label }) {
  const [a, b] = String(values.pair).split('-').map(Number)
  const step = num(values.step)
  const { steps, gcd } = euclidSteps(a, b)
  const shown = steps.slice(0, step)
  const scale = Math.min(196 / a, 172 / b)
  const x0 = 14
  const y0 = 24
  const tones = EUCLID_TONES(color)
  let rest = { x: 0, y: 0, w: a, h: b }
  const squares = []
  shown.forEach((item, index) => {
    const side = Math.min(rest.w, rest.h)
    const wide = rest.w >= rest.h
    for (let k = 0; k < item.q; k += 1) {
      squares.push({ x: wide ? rest.x + k * side : rest.x, y: wide ? rest.y : rest.y + k * side, side, index })
    }
    rest = wide
      ? { x: rest.x + item.q * side, y: rest.y, w: rest.w - item.q * side, h: rest.h }
      : { x: rest.x, y: rest.y + item.q * side, w: rest.w, h: rest.h - item.q * side }
  })
  const done = step >= steps.length
  const last = squares.at(-1)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <g data-euclid-gcd={gcd} data-euclid-squares={squares.length}>
        {squares.map((square, index) => (
          <g key={index}>
            <rect
              x={x0 + square.x * scale}
              y={y0 + square.y * scale}
              width={square.side * scale}
              height={square.side * scale}
              fill={`${tones[square.index % tones.length]}33`}
              stroke={tones[square.index % tones.length]}
              strokeWidth="1.4"
            />
            {square.side * scale >= 18 && (
              <SvgText x={x0 + (square.x + square.side / 2) * scale} y={y0 + (square.y + square.side / 2) * scale} size={10} weight={800} fill={tones[square.index % tones.length]}>
                {square.side}
              </SvgText>
            )}
          </g>
        ))}
      </g>
      {!done && rest.w > 0 && rest.h > 0 && (
        <rect x={x0 + rest.x * scale} y={y0 + rest.y * scale} width={rest.w * scale} height={rest.h * scale} fill="none" stroke={MUTED} strokeWidth="1.2" strokeDasharray="4 3" />
      )}
      {done && last && (
        <rect x={x0 + last.x * scale} y={y0 + last.y * scale} width={last.side * scale} height={last.side * scale} fill="none" stroke={INK} strokeWidth="2.6" />
      )}
      <rect x={x0} y={y0} width={a * scale} height={b * scale} fill="none" stroke={INK} strokeWidth="1.6" />
      <SvgText x={x0 + (a * scale) / 2} y={y0 - 9} size={10} fill={MUTED}>{`横 ${a}`}</SvgText>
      {shown.map(({ big, small, q, r }, index) => (
        <SvgText key={index} x="226" y={40 + index * 19} anchor="start" size={10} weight={800} fill={tones[index % tones.length]}>
          {`${big}÷${small}＝${q} あまり ${r}`}
        </SvgText>
      ))}
      {!shown.length && <SvgText x="226" y="40" anchor="start" size={10} fill={MUTED}>{`たて ${b}・横 ${a}`}</SvgText>}
      {done && <SvgText x="226" y="176" anchor="start" size={13} weight={800} fill={color}>{`最大公約数 ${gcd}`}</SvgText>}
    </Stage>
  )
}

// ── 複素数：かけ算で点が原点のまわりに回る ───────────────────────────────
function ComplexRotateScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const m = COMPLEX_MULTIPLIERS[values.times]
  const re = a * m.re - b * m.im
  const im = a * m.im + b * m.re
  const O = { x: 118, y: 112 }
  const unit = 13
  const P = (x, y) => ({ x: O.x + x * unit, y: O.y - y * unit })
  const z = P(a, b)
  const w = P(re, im)
  const other = apart(color, WARM, ROSE)
  const zero = a === 0 && b === 0
  const argZ = (Math.atan2(b, a) * 180) / Math.PI
  const ticks = Array.from({ length: 13 }, (_, index) => index - 6)
  const outward = (x, y) => {
    const length = Math.hypot(x, y) || 1
    return { x: (x / length) * 14, y: (-y / length) * 14 }
  }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={P(tick, -6).x} y1={P(tick, -6).y} x2={P(tick, 6).x} y2={P(tick, 6).y} stroke={GRID} strokeWidth="1" />
          <line x1={P(-6, tick).x} y1={P(-6, tick).y} x2={P(6, tick).x} y2={P(6, tick).y} stroke={GRID} strokeWidth="1" />
        </g>
      ))}
      <line x1={P(-6, 0).x} y1={O.y} x2={P(6, 0).x + 6} y2={O.y} stroke={INK} strokeWidth="1.3" />
      <line x1={O.x} y1={P(0, -6).y} x2={O.x} y2={P(0, 6).y - 6} stroke={INK} strokeWidth="1.3" />
      <SvgText x={P(6, 0).x + 4} y={O.y + 12} size={9} fill={MUTED}>実軸</SvgText>
      <SvgText x={O.x + 18} y={P(0, 6).y - 4} size={9} fill={MUTED}>虚軸</SvgText>
      {!zero && <path d={arcPath(O.x, O.y, 22, argZ, argZ + m.turn)} fill="none" stroke={other} strokeWidth="1.8" />}
      {!zero && <line x1={O.x} y1={O.y} x2={z.x} y2={z.y} stroke={color} strokeWidth="2.2" />}
      {!zero && <line x1={O.x} y1={O.y} x2={w.x} y2={w.y} stroke={other} strokeWidth="2.2" />}
      <circle cx={z.x} cy={z.y} r="4.5" fill={color} />
      <g data-complex-result={`${re},${im}`}>
        <circle cx={w.x} cy={w.y} r="4.5" fill={other} />
      </g>
      {!zero && <SvgText x={z.x + outward(a, b).x} y={z.y + outward(a, b).y} size={11} weight={800} fill={color}>z</SvgText>}
      {!zero && <SvgText x={w.x + outward(re, im).x} y={w.y + outward(re, im).y} size={11} weight={800} fill={other}>w</SvgText>}
      <SvgText x="214" y="40" anchor="start" size={11} weight={800} fill={color}>{`z ＝ ${complexText(a, b)}`}</SvgText>
      <SvgText x="214" y="62" anchor="start" size={11}>{`× ${m.label.replace(' をかける', '').replace('を2回かける', '×i')}`}</SvgText>
      <SvgText x="214" y="84" anchor="start" size={12} weight={800} fill={other}>{`w ＝ ${complexText(re, im)}`}</SvgText>
      <SvgText x="214" y="116" anchor="start" size={10}>{`${m.turn}°回る`}</SvgText>
      <SvgText x="214" y="134" anchor="start" size={10}>{m.scale === '1' ? '原点からの距離はそのまま' : '原点からの距離は √2 倍'}</SvgText>
    </Stage>
  )
}

// ── 対数と計算尺：長さのたし算でかけ算 ───────────────────────────────
const SLIDE_TICKS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10]

function SlideRuleScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const product = a * b
  const L = 300
  const x0 = 30
  const X = (value) => x0 + L * Math.log10(value)
  const shift = L * Math.log10(a)
  const bTone = apart(color, WARM, ROSE)
  const pTone = apart(color, GOOD, BLUE)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="20" size={13} weight={800}>{`${a} × ${b} ＝ ${nice(product, 2)}`}</SvgText>
      <rect x={x0 + shift} y="62" width={L} height="34" fill="#f8fafc" stroke={INK} strokeWidth="1.2" />
      <rect x={x0} y="100" width={L} height="34" fill="#f8fafc" stroke={INK} strokeWidth="1.2" />
      {SLIDE_TICKS.map((value) => {
        const x = X(value) + shift
        if (x > 350) return null
        const major = Number.isInteger(value)
        return (
          <g key={`u${value}`}>
            <line x1={x} y1="96" x2={x} y2={major ? 84 : 89} stroke={INK} strokeWidth="1" />
            {major && <SvgText x={x} y="74" size={9} fill={MUTED}>{value}</SvgText>}
          </g>
        )
      })}
      {SLIDE_TICKS.map((value) => {
        const major = Number.isInteger(value)
        return (
          <g key={`d${value}`}>
            <line x1={X(value)} y1="100" x2={X(value)} y2={major ? 112 : 107} stroke={INK} strokeWidth="1" />
            {major && <SvgText x={X(value)} y="122" size={9} fill={MUTED}>{value}</SvgText>}
          </g>
        )
      })}
      <line x1={X(a)} y1="58" x2={X(a)} y2="138" stroke={color} strokeWidth="2" />
      <line x1={X(product)} y1="58" x2={X(product)} y2="138" stroke={pTone} strokeWidth="2" strokeDasharray="4 3" />
      <SvgText x={X(a)} y="50" size={10} weight={800} fill={color}>上の1</SvgText>
      <SvgText x={X(a)} y="148" size={10} weight={800} fill={color}>{`下の${a}`}</SvgText>
      <SvgText x={X(product)} y="50" size={10} weight={800} fill={bTone}>{`上の${b}`}</SvgText>
      <g data-slide-product={nice(product, 2)}>
        <SvgText x={X(product)} y="148" size={10} weight={800} fill={pTone}>{`下の${nice(product, 2)}`}</SvgText>
      </g>
      <line x1={X(1)} y1="176" x2={X(a)} y2="176" stroke={color} strokeWidth="6" />
      <line x1={X(a)} y1="176" x2={X(product)} y2="176" stroke={bTone} strokeWidth="6" />
      <SvgText x={(X(1) + X(a)) / 2} y="192" size={9} weight={800} fill={color}>{`log ${a}`}</SvgText>
      <SvgText x={(X(a) + X(product)) / 2} y="192" size={9} weight={800} fill={bTone}>{`log ${b}`}</SvgText>
      <SvgText x={X(product) + 4} y="176" anchor="start" size={9} weight={800} fill={pTone}>{`＝ log ${nice(product, 2)}`}</SvgText>
    </Stage>
  )
}

// ── 複利と e：分ける回数をふやすと e に近づく ─────────────────────────────
function CompoundInterestScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const value = compoundValue(n)
  const plot = { left: 46, right: 246, top: 30, bottom: 180 }
  const X = (t) => plot.left + t * (plot.right - plot.left)
  const Y = (v) => plot.bottom - ((v - 1) / 1.8) * (plot.bottom - plot.top)
  const eTone = apart(color, WARM, ROSE)
  let path
  if (n <= 52) {
    path = `M${X(0)} ${Y(1)}`
    for (let k = 1; k <= n; k += 1) path += ` H${X(k / n).toFixed(2)} V${Y((1 + 1 / n) ** k).toFixed(2)}`
  } else {
    path = Array.from({ length: 61 }, (_, index) => {
      const t = index / 60
      return `${index ? 'L' : 'M'}${X(t).toFixed(2)} ${Y((1 + 1 / n) ** (n * t)).toFixed(2)}`
    }).join(' ')
  }
  const eCurve = Array.from({ length: 61 }, (_, index) => {
    const t = index / 60
    return `${index ? 'L' : 'M'}${X(t).toFixed(2)} ${Y(Math.exp(t)).toFixed(2)}`
  }).join(' ')
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {[1, 2].map((v) => (
        <g key={v}>
          <line x1={plot.left} y1={Y(v)} x2={plot.right} y2={Y(v)} stroke={GRID} strokeWidth="1" />
          <SvgText x={plot.left - 6} y={Y(v)} anchor="end" size={9} fill={MUTED}>{`${v}倍`}</SvgText>
        </g>
      ))}
      <line x1={plot.left} y1={Y(Math.E)} x2={plot.right} y2={Y(Math.E)} stroke={eTone} strokeWidth="1.2" strokeDasharray="4 3" />
      <SvgText x={plot.left - 6} y={Y(Math.E)} anchor="end" size={9} weight={800} fill={eTone}>e</SvgText>
      <line x1={plot.left} y1={plot.bottom} x2={plot.right} y2={plot.bottom} stroke={INK} strokeWidth="1.2" />
      <line x1={plot.left} y1={plot.bottom} x2={plot.left} y2={plot.top} stroke={INK} strokeWidth="1.2" />
      <SvgText x={plot.left} y={plot.bottom + 11} size={9} fill={MUTED}>0</SvgText>
      <SvgText x={plot.right} y={plot.bottom + 11} size={9} fill={MUTED}>1年</SvgText>
      <path d={eCurve} fill="none" stroke={eTone} strokeWidth="1" strokeDasharray="2 3" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" />
      <g data-compound-value={nice(value, 5)}>
        <circle cx={X(1)} cy={Y(value)} r="4.5" fill={color} />
      </g>
      <SvgText x="258" y="40" anchor="start" size={10}>{`1年に${n}回`}</SvgText>
      <SvgText x="258" y="62" anchor="start" size={13} weight={800} fill={color}>{`${nice(value, 5)}倍`}</SvgText>
      <SvgText x="258" y="84" anchor="start" size={10}>{`1万円 → 約${withCommas(Math.round(10000 * value))}円`}</SvgText>
      <SvgText x="258" y="118" anchor="start" size={10} fill={eTone}>e＝2.71828…</SvgText>
      <SvgText x="258" y="136" anchor="start" size={9} fill={MUTED}>点線：いつもふえ続ける</SvgText>
      <SvgText x="258" y="150" anchor="start" size={9} fill={MUTED}>ときのふえ方（e^t）</SvgText>
    </Stage>
  )
}

export const SENIOR_SCENES = Object.freeze({
  'venn-sets': VennSetsScene,
  'trig-tower': TrigTowerScene,
  'scatter-correlation': ScatterCorrelationScene,
  'pascal-triangle': PascalTriangleScene,
  'euclid-rectangle': EuclidRectangleScene,
  'complex-rotate': ComplexRotateScene,
  'slide-rule': SlideRuleScene,
  'compound-interest': CompoundInterestScene,
})
