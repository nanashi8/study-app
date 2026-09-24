import { approxText, nice } from '../../data/math-history/controls.js'
import {
  BOX_BASE,
  POND_FISH,
  POND_MARKED,
  POND_TOTAL,
  PYRAMID_BASE,
  PYRAMID_HEIGHT,
  RECAPTURE_ROUNDS,
  completeSquare,
  fiveNumbers,
  heronSteps,
  pointsOutcomes,
  recaptureEstimates,
  recaptureSample,
} from '../../data/math-history/junior-more.js'
import { BLUE, GOOD, GRID, INK, MUTED, PAPER, ROSE, Stage, SvgText, WARM, apart, num } from './stage.jsx'

// 第2部「中学の数学」の話の図（後半：確率・データ・二次方程式・平方根・y＝ax²・相似・円・三平方・標本調査）。

const rad = (degrees) => (degrees * Math.PI) / 180
const deg = (radians) => (radians * 180) / Math.PI

/** 中心 (cx, cy)・半径 r の円の、数学の向き（左回り・上が正）で from°〜to° の弧。 */
const arcPath = (cx, cy, r, from, to) => {
  const start = { x: cx + r * Math.cos(rad(from)), y: cy - r * Math.sin(rad(from)) }
  const end = { x: cx + r * Math.cos(rad(to)), y: cy - r * Math.sin(rad(to)) }
  const large = Math.abs(to - from) > 180 ? 1 : 0
  const sweep = to > from ? 0 : 1
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} A${r} ${r} 0 ${large} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

const points = (list) => list.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')

// ── 確率：残りの勝ち負けの並び方を全部書き出す（フェルマーの方法） ─────────────
function PointsSplitScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const rows = pointsOutcomes(a, b)
  const n = a + b - 1
  const bTone = apart(color, BLUE, ROSE)
  const perRow = Math.min(8, rows.length)
  const cellW = rows.length > 8 ? 40 : Math.min(72, 320 / perRow)
  const cellH = 26
  const rowCount = Math.ceil(rows.length / perRow)
  const left = 180 - (perRow * cellW) / 2
  const top = 40 + (4 - rowCount) * 16
  const letterGap = n >= 5 ? 6.9 : 9.5
  const wa = rows.filter((row) => row.winner === 'A').length
  const wb = rows.length - wa
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="16" size={11} weight={800}>{`決着まであと最大${n}回。勝ち負けの並び方は全部で${rows.length}通り`}</SvgText>
      {rows.map((row, index) => {
        const x = left + (index % perRow) * cellW
        const y = top + Math.floor(index / perRow) * (cellH + 6)
        const tone = row.winner === 'A' ? color : bTone
        return (
          <g key={index} data-points-cell={row.winner}>
            <rect x={x + 2} y={y} width={cellW - 4} height={cellH} rx="4" fill={`${tone}1f`} stroke={tone} strokeWidth="1.4" />
            {row.games.map((game, gameIndex) => (
              <SvgText
                key={gameIndex}
                x={x + cellW / 2 + (gameIndex - (n - 1) / 2) * letterGap}
                y={y + cellH / 2}
                size={n >= 5 ? 11 : 12}
                weight={800}
                fill={gameIndex < row.decidedAt ? (game === 'A' ? color : bTone) : MUTED}
              >
                {game}
              </SvgText>
            ))}
          </g>
        )
      })}
      <g data-points-a={wa} data-points-b={wb}>
        <SvgText x="100" y="186" size={12} weight={800} fill={color}>{`Aが勝つ ${wa}通り`}</SvgText>
        <SvgText x="260" y="186" size={12} weight={800} fill={bTone}>{`Bが勝つ ${wb}通り`}</SvgText>
      </g>
      <SvgText x="180" y="208" size={9} fill={MUTED}>うすい字は決着のあとの回（それでも1通りとして数える）</SvgText>
    </Stage>
  )
}

// ── 箱ひげ図：ドットプロットと、5つの数でかいた箱ひげ図 ────────────────────
function BoxPlotScene({ values, color, markerId, label }) {
  const v = num(values.v)
  const five = fiveNumbers([...BOX_BASE, v])
  const meanTone = apart(color, BLUE, ROSE)
  const x = (score) => 30 + score * 3
  const stacks = {}
  const dots = [...BOX_BASE.map((score) => ({ score, moved: false })), { score: v, moved: true }]
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="30" y="12" anchor="start" size={10} fill={MUTED}>11人の点数（色の点が動かせる1人）</SvgText>
      {dots.map((dot, index) => {
        stacks[dot.score] = (stacks[dot.score] ?? 0) + 1
        return (
          <circle
            key={index}
            cx={x(dot.score)}
            cy={58 - (stacks[dot.score] - 1) * 9}
            r="4"
            fill={dot.moved ? color : MUTED}
            data-box-dot={dot.score}
          />
        )
      })}
      <line x1={x(0)} y1="64" x2={x(100)} y2="64" stroke={INK} strokeWidth="1.2" />
      {[0, 50, 100].map((score) => <SvgText key={score} x={x(score)} y="74" size={9} fill={MUTED}>{score}</SvgText>)}
      <g data-box-five={`${five.min},${five.q1},${five.median},${five.q3},${five.max}`}>
        <line x1={x(five.min)} y1="122" x2={x(five.q1)} y2="122" stroke={INK} strokeWidth="1.6" />
        <line x1={x(five.q3)} y1="122" x2={x(five.max)} y2="122" stroke={INK} strokeWidth="1.6" />
        <line x1={x(five.min)} y1="114" x2={x(five.min)} y2="130" stroke={INK} strokeWidth="1.6" />
        <line x1={x(five.max)} y1="114" x2={x(five.max)} y2="130" stroke={INK} strokeWidth="1.6" />
        <rect x={x(five.q1)} y="108" width={x(five.q3) - x(five.q1)} height="28" fill={`${color}33`} stroke={color} strokeWidth="1.8" />
        <line x1={x(five.median)} y1="108" x2={x(five.median)} y2="136" stroke={color} strokeWidth="3" />
      </g>
      <SvgText x={x(five.q1)} y="98" size={10} weight={800} fill={color}>{`Q1 ${five.q1}`}</SvgText>
      <SvgText x={x(five.q3)} y="98" size={10} weight={800} fill={color}>{`Q3 ${five.q3}`}</SvgText>
      <SvgText x={x(five.min)} y="150" size={10}>{`最小 ${five.min}`}</SvgText>
      <SvgText x={x(five.median)} y="150" size={10} weight={800} fill={color}>{`中央 ${five.median}`}</SvgText>
      <SvgText x={x(five.max)} y="150" size={10}>{`最大 ${five.max}`}</SvgText>
      <g data-box-mean={nice(five.mean, 1)}>
        <path d={`M${x(five.mean)} 160 L${x(five.mean) - 6} 170 L${x(five.mean) + 6} 170 Z`} fill={meanTone} />
        <SvgText x={x(five.mean)} y="182" size={10} weight={800} fill={meanTone}>{`平均 ${nice(five.mean, 1)}`}</SvgText>
      </g>
      <SvgText x="180" y="206" size={10} fill={MUTED}>{`箱の長さ（四分位範囲）＝ ${five.q3} − ${five.q1} ＝ ${five.q3 - five.q1}`}</SvgText>
    </Stage>
  )
}

// ── 二次方程式：欠けた角を補って正方形を完成させる ─────────────────────────
function CompleteSquareScene({ values, color, markerId, label }) {
  const b = num(values.b)
  const c = num(values.c)
  const step = num(values.step)
  const { h, total, root, exact, x } = completeSquare(b, c)
  const rectTone = apart(color, WARM, ROSE)
  const cornerTone = apart(color, GOOD, BLUE)
  const unit = 170 / root
  const X0 = 20
  const Y0 = 26
  const xs = x * unit
  const hs = h * unit
  const center = (left, top, width, height) => ({ x: left + width / 2, y: top + height / 2 })
  const inner = (left, top, width, height, text, fill) => (width >= 24 && height >= 16
    ? <SvgText x={center(left, top, width, height).x} y={center(left, top, width, height).y} size={11} weight={800} fill={fill}>{text}</SvgText>
    : null)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <g data-complete-total={total} data-complete-x={exact ? x : nice(x, 3)}>
        <rect x={X0} y={Y0} width={xs} height={xs} fill={`${color}30`} stroke={color} strokeWidth="1.8" />
        <rect x={X0 + xs} y={Y0} width={hs} height={xs} fill={`${rectTone}26`} stroke={rectTone} strokeWidth="1.6" />
        <rect x={X0} y={Y0 + xs} width={xs} height={hs} fill={`${rectTone}26`} stroke={rectTone} strokeWidth="1.6" />
        <rect
          x={X0 + xs}
          y={Y0 + xs}
          width={hs}
          height={hs}
          fill={step >= 1 ? `${cornerTone}40` : 'none'}
          stroke={step >= 1 ? cornerTone : MUTED}
          strokeWidth="1.6"
          strokeDasharray={step >= 1 ? undefined : '4 3'}
          data-complete-corner={step >= 1 ? 'filled' : 'missing'}
        />
      </g>
      {inner(X0, Y0, xs, xs, 'x²', color)}
      {inner(X0 + xs, Y0, hs, xs, `${h}x`, rectTone)}
      {inner(X0, Y0 + xs, xs, hs, `${h}x`, rectTone)}
      {inner(X0 + xs, Y0 + xs, hs, hs, step >= 1 ? `${h * h}` : '？', step >= 1 ? cornerTone : MUTED)}
      {xs >= 12 && <SvgText x={X0 + xs / 2} y={Y0 - 8} size={10} fill={color}>x</SvgText>}
      <SvgText x={X0 + xs + hs / 2} y={Y0 - 8} size={10} fill={rectTone}>{h}</SvgText>
      {step === 2 && (
        <g>
          <line x1={X0} y1={Y0 + 176} x2={X0 + 170} y2={Y0 + 176} stroke={INK} strokeWidth="1.4" />
          <SvgText x={X0 + 85} y={Y0 + 187} size={10} weight={800}>{exact ? `1辺 x＋${h} ＝ ${root}` : `1辺 x＋${h} ≈ ${nice(root, 3)}`}</SvgText>
        </g>
      )}
      <SvgText x="208" y="36" anchor="start" size={12} weight={800}>{`x² ＋ ${b}x ＝ ${c}`}</SvgText>
      {step >= 1 && <SvgText x="208" y="60" anchor="start" size={11} fill={cornerTone}>{`角を補う：両辺に ＋${h * h}`}</SvgText>}
      {step >= 1 && <SvgText x="208" y="84" anchor="start" size={12} weight={800}>{`(x＋${h})² ＝ ${total}`}</SvgText>}
      {step === 2 && <SvgText x="208" y="112" anchor="start" size={12}>{exact ? `x＋${h} ＝ ${root}` : `x＋${h} ≈ ${nice(root, 3)}`}</SvgText>}
      {step === 2 && <SvgText x="208" y="140" anchor="start" size={15} weight={800} fill={color}>{exact ? `x ＝ ${x}` : `x ≈ ${nice(x, 3)}`}</SvgText>}
      {step === 0 && <SvgText x="208" y="84" anchor="start" size={10} fill={MUTED}>{`角に1辺${h}の正方形が欠けている`}</SvgText>}
    </Stage>
  )
}

// ── 平方根と無理数：√2 にいちばん近い分数 p/q ─────────────────────────────
function Sqrt2FractionsScene({ values, color, markerId, label }) {
  const q = num(values.q)
  const p = Math.round(q * Math.SQRT2)
  const gap = p * p - 2 * q * q
  const unit = 100 / q
  const O = { x: 20, y: 176 }
  const diagonal = 100 * Math.SQRT2
  const pTone = apart(color, WARM, ROSE)
  const ratio = p / q
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {Array.from({ length: q + 1 }, (_, index) => (
        <g key={index}>
          <line x1={O.x + index * unit} y1={O.y - 100} x2={O.x + index * unit} y2={O.y} stroke={GRID} strokeWidth="1" />
          <line x1={O.x} y1={O.y - index * unit} x2={O.x + 100} y2={O.y - index * unit} stroke={GRID} strokeWidth="1" />
        </g>
      ))}
      <rect x={O.x} y={O.y - 100} width="100" height="100" fill="none" stroke={INK} strokeWidth="1.6" />
      <line x1={O.x} y1={O.y} x2={O.x + 100} y2={O.y - 100} stroke={color} strokeWidth="2.6" />
      <path d={`M${O.x + 100} ${O.y - 100} A${diagonal.toFixed(2)} ${diagonal.toFixed(2)} 0 0 1 ${(O.x + diagonal).toFixed(2)} ${O.y}`} fill="none" stroke={color} strokeWidth="1.4" strokeDasharray="4 3" />
      <line x1={O.x} y1={O.y} x2={O.x + (p + 1) * unit} y2={O.y} stroke={INK} strokeWidth="1.4" />
      {Array.from({ length: p + 2 }, (_, index) => (
        <line key={index} x1={O.x + index * unit} y1={O.y} x2={O.x + index * unit} y2={O.y + (index === p ? 9 : 5)} stroke={index === p ? pTone : MUTED} strokeWidth={index === p ? 2 : 1} />
      ))}
      <circle cx={O.x + diagonal} cy={O.y} r="3.5" fill={color} />
      <SvgText x={O.x + p * unit} y={O.y + 18} size={10} weight={800} fill={pTone}>{p}</SvgText>
      <SvgText x={O.x} y={O.y + 14} size={9} fill={MUTED}>0</SvgText>
      <SvgText x={O.x + 50} y={O.y - 108} size={10} fill={MUTED}>{`1辺 ${q} の正方形`}</SvgText>
      <g data-sqrt-p={p} data-sqrt-gap={Math.abs(gap)}>
        <SvgText x="196" y="30" anchor="start" size={11}>{`分母 q ＝ ${q}`}</SvgText>
        <SvgText x="196" y="52" anchor="start" size={12} weight={800} fill={color}>{`いちばん近い分数 ${p}/${q}`}</SvgText>
        <SvgText x="196" y="74" anchor="start" size={11}>{`${p}/${q} ${approxText(ratio, 5) === '=' ? '＝' : '≈'} ${nice(ratio, 5)}`}</SvgText>
        <SvgText x="196" y="94" anchor="start" size={11}>√2 ＝ 1.41421…</SvgText>
        <SvgText x="196" y="124" anchor="start" size={11}>{`${p}² ＝ ${p * p}`}</SvgText>
        <SvgText x="196" y="144" anchor="start" size={11}>{`2×${q}² ＝ ${2 * q * q}`}</SvgText>
        <SvgText x="196" y="170" anchor="start" size={12} weight={800} fill={pTone}>{`差 ${Math.abs(gap)}（0にならない）`}</SvgText>
      </g>
      <SvgText x="196" y="200" anchor="start" size={9} fill={MUTED}>点線の弧：対角線を底辺の上へ回した</SvgText>
    </Stage>
  )
}

// ── 平方根の近い値：面積を変えずに長方形を正方形へ ─────────────────────────
function HeronRectangleScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const n = num(values.n)
  const steps = heronSteps(a, n)
  const scale = Math.min(60, 170 / a)
  const base = { x: 16, y: 196 }
  const target = apart(color, GOOD, WARM)
  const side = Math.sqrt(a) * scale
  const current = steps[n]
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <rect x={base.x} y={base.y - side} width={side} height={side} fill="none" stroke={target} strokeWidth="1.2" strokeDasharray="2 3" />
      {steps.slice(0, n).map((x, index) => (
        <rect key={index} x={base.x} y={base.y - (a / x) * scale} width={x * scale} height={(a / x) * scale} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      ))}
      <g data-heron-x={nice(current, 8)}>
        <rect x={base.x} y={base.y - (a / current) * scale} width={current * scale} height={(a / current) * scale} fill={`${color}30`} stroke={color} strokeWidth="2" />
      </g>
      <SvgText x={base.x} y={base.y - (a / current) * scale - 8} anchor="start" size={10} weight={800} fill={color}>{`横 ${nice(current, 4)}・たて ${nice(a / current, 4)}`}</SvgText>
      <SvgText x="206" y="18" anchor="start" size={11} weight={800}>{`面積はいつも ${a}`}</SvgText>
      {steps.map((x, index) => (
        <SvgText key={index} x="206" y={44 + index * 20} anchor="start" size={10} weight={index === n ? 800 : 700} fill={index === n ? color : MUTED}>
          {index === 0 ? `はじめ　横 ${a}` : `${index}回目　横 ${nice(x, 8)}`}
        </SvgText>
      ))}
      <SvgText x="206" y="176" anchor="start" size={10} fill={target}>点線の正方形：1辺 √{a}</SvgText>
      <SvgText x="206" y="196" anchor="start" size={10} weight={800}>{`√${a} ＝ ${nice(Math.sqrt(a), 8)}…`}</SvgText>
    </Stage>
  )
}

// ── 関数 y＝ax²：斜面を転がる玉と、同じ時間ごとに進む距離 ─────────────────────
function GalileoRampScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const t = num(values.t)
  const start = { x: 20, y: 40 }
  const end = { x: 204, y: 172 }
  const length = Math.hypot(end.x - start.x, end.y - start.y)
  const dir = { x: (end.x - start.x) / length, y: (end.y - start.y) / length }
  const normal = { x: dir.y, y: -dir.x }
  const along = (fraction) => ({ x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction })
  const ball = along((t * t) / 25)
  const ballTone = apart(color, WARM, ROSE)
  const graph = { left: 236, bottom: 176, width: 110, height: 136 }
  const gx = (x) => graph.left + (x / 5) * graph.width
  const gy = (y) => graph.bottom - (y / 75) * graph.height
  const curve = Array.from({ length: 51 }, (_, index) => {
    const x = index / 10
    return `${index ? 'L' : 'M'}${gx(x).toFixed(2)} ${gy(a * x * x).toFixed(2)}`
  }).join(' ')
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <path d={`M${start.x} ${start.y} L${end.x} ${end.y} L${start.x} ${end.y} Z`} fill={`${MUTED}1a`} />
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={INK} strokeWidth="2.4" />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const point = along((k * k) / 25)
        return (
          <g key={k}>
            <line x1={point.x - normal.x * 6} y1={point.y - normal.y * 6} x2={point.x + normal.x * 6} y2={point.y + normal.y * 6} stroke={MUTED} strokeWidth="1.2" />
            <SvgText x={point.x - normal.x * 14} y={point.y - normal.y * 14} size={9} fill={MUTED}>{k}</SvgText>
          </g>
        )
      })}
      {[1, 2, 3, 4, 5].filter((k) => k <= t).map((k) => {
        const mid = along(((k - 1) * (k - 1) + k * k) / 50)
        return <SvgText key={k} x={mid.x + normal.x * 18} y={mid.y + normal.y * 18} size={10} weight={800} fill={color}>{`＋${a * (2 * k - 1)}`}</SvgText>
      })}
      <circle cx={ball.x + normal.x * 7} cy={ball.y + normal.y * 7} r="7" fill={ballTone} />
      <SvgText x="20" y="200" anchor="start" size={12} weight={800} fill={color}>{`${t}目もりで ${a * t * t}`}</SvgText>
      <line x1={graph.left} y1={graph.bottom} x2={graph.left + graph.width + 6} y2={graph.bottom} stroke={INK} strokeWidth="1.2" />
      <line x1={graph.left} y1={graph.bottom} x2={graph.left} y2={graph.bottom - graph.height - 6} stroke={INK} strokeWidth="1.2" />
      <path d={curve} fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="3 3" />
      {Array.from({ length: t + 1 }, (_, k) => <circle key={k} cx={gx(k)} cy={gy(a * k * k)} r="3" fill={color} />)}
      <g data-galileo-y={a * t * t}>
        <circle cx={gx(t)} cy={gy(a * t * t)} r="5" fill={ballTone} />
      </g>
      <SvgText x={graph.left + 4} y={graph.bottom - graph.height - 12} anchor="start" size={11} weight={800} fill={color}>{`y＝${a}x²`}</SvgText>
      <SvgText x={graph.left + graph.width} y={graph.bottom + 12} anchor="end" size={9} fill={MUTED}>x（目もり）</SvgText>
    </Stage>
  )
}

// ── 相似：棒の影とピラミッドの影 ──────────────────────────────────────
function ShadowSimilarScene({ values, color, markerId, label }) {
  const r = num(values.sun)
  const s = num(values.stick)
  const sun = apart(color, WARM, ROSE)
  const scale = 0.72
  const ground = 178
  const center = 20 + (PYRAMID_BASE / 2) * scale
  const apex = { x: center, y: ground - PYRAMID_HEIGHT * scale }
  const shadowP = PYRAMID_HEIGHT * r
  const tip = center + shadowP * scale
  const back = { x: apex.x - 40, y: apex.y - 40 / r }
  const inset = { left: 244, ground: 96, unit: 20 }
  const stickTop = { x: inset.left + 18, y: inset.ground - s * inset.unit }
  const stickTip = stickTop.x + s * r * inset.unit
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="10" y1={ground} x2="350" y2={ground} stroke={INK} strokeWidth="1.4" />
      <line x1={20 + PYRAMID_BASE * scale} y1={ground} x2={tip} y2={ground} stroke={MUTED} strokeWidth="6" />
      <polygon points={`20,${ground} ${apex.x},${apex.y} ${20 + PYRAMID_BASE * scale},${ground}`} fill="#e9d29a" stroke={MUTED} strokeWidth="1.2" />
      <line x1={back.x} y1={back.y} x2={tip} y2={ground} stroke={sun} strokeWidth="1.4" markerEnd={`url(#${markerId}-warm)`} />
      <line x1={apex.x} y1={apex.y} x2={apex.x} y2={ground} stroke={color} strokeWidth="1.8" strokeDasharray="4 3" />
      <line x1={center} y1={ground + 8} x2={tip} y2={ground + 8} stroke={color} strokeWidth="2.4" />
      <SvgText x={apex.x - 6} y={(apex.y + ground) / 2} anchor="end" size={11} weight={800} fill={color}>H</SvgText>
      <g data-shadow-height={PYRAMID_HEIGHT} data-shadow-length={shadowP}>
        <SvgText x={(center + tip) / 2} y={ground + 20} size={10} weight={800} fill={color}>{`影 ${shadowP}m（底の中心から）`}</SvgText>
      </g>
      <rect x={inset.left} y="14" width="106" height="100" rx="6" fill={PAPER} stroke={GRID} strokeWidth="1.2" />
      <line x1={inset.left + 6} y1={inset.ground} x2={inset.left + 100} y2={inset.ground} stroke={INK} strokeWidth="1.2" />
      <line x1={stickTop.x} y1={inset.ground} x2={stickTop.x} y2={stickTop.y} stroke={INK} strokeWidth="3" />
      <line x1={stickTop.x} y1={inset.ground + 5} x2={stickTip} y2={inset.ground + 5} stroke={color} strokeWidth="2.4" />
      <line x1={stickTop.x - 14} y1={stickTop.y - 14 / r} x2={stickTip} y2={inset.ground} stroke={sun} strokeWidth="1.2" />
      <SvgText x={stickTop.x + 4} y={stickTop.y - 4} anchor="start" size={9} weight={800}>{`棒 ${nice(s, 1)}m`}</SvgText>
      <SvgText x={(stickTop.x + stickTip) / 2} y={inset.ground + 14} size={9} weight={800} fill={color}>{`影 ${nice(s * r, 2)}m`}</SvgText>
      <SvgText x="180" y="208" size={11} weight={800} fill={color}>{`H ＝ ${shadowP} × ${nice(s, 1)} ÷ ${nice(s * r, 2)} ＝ ${PYRAMID_HEIGHT}m`}</SvgText>
    </Stage>
  )
}

// ── 円周角の定理：点Pを動かしても角APBは変わらない ─────────────────────────
function InscribedAngleScene({ values, color, markerId, label }) {
  const theta = num(values.central)
  const p = num(values.p)
  const O = { x: 118, y: 112 }
  const R = 86
  const at = (angle) => ({ x: O.x + R * Math.cos(rad(angle)), y: O.y - R * Math.sin(rad(angle)) })
  const aDeg = -90 - theta / 2
  const bDeg = -90 + theta / 2
  const A = at(aDeg)
  const B = at(bDeg)
  const P = at(bDeg + (p / 10) * (360 - theta))
  const oTone = apart(color, WARM, ROSE)
  const toward = (from, to) => deg(Math.atan2(-(to.y - from.y), to.x - from.x))
  const angA = toward(P, A)
  let turn = toward(P, B) - angA
  while (turn > 180) turn -= 360
  while (turn <= -180) turn += 360
  const mid = rad(angA + turn / 2)
  const labelP = { x: P.x + 34 * Math.cos(mid), y: P.y - 34 * Math.sin(mid) }
  const outward = (point, distance) => ({ x: O.x + ((point.x - O.x) * (R + distance)) / R, y: O.y + ((point.y - O.y) * (R + distance)) / R })
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <circle cx={O.x} cy={O.y} r={R} fill="none" stroke={INK} strokeWidth="1.6" />
      <path d={arcPath(O.x, O.y, R, aDeg, bDeg)} fill="none" stroke={oTone} strokeWidth="3.4" />
      <line x1={O.x} y1={O.y} x2={A.x} y2={A.y} stroke={oTone} strokeWidth="1.6" />
      <line x1={O.x} y1={O.y} x2={B.x} y2={B.y} stroke={oTone} strokeWidth="1.6" />
      <path d={arcPath(O.x, O.y, 16, aDeg, bDeg)} fill="none" stroke={oTone} strokeWidth="1.8" />
      <line x1={P.x} y1={P.y} x2={A.x} y2={A.y} stroke={color} strokeWidth="2" />
      <line x1={P.x} y1={P.y} x2={B.x} y2={B.y} stroke={color} strokeWidth="2" />
      <path d={arcPath(P.x, P.y, 20, angA, angA + turn)} fill="none" stroke={color} strokeWidth="2" />
      <SvgText x={labelP.x} y={labelP.y} size={10} weight={800} fill={color}>{`${theta / 2}°`}</SvgText>
      <SvgText x={O.x} y={O.y + 26} size={10} weight={800} fill={oTone}>{`${theta}°`}</SvgText>
      {[['A', A], ['B', B], ['P', P]].map(([name, point]) => {
        const spot = outward(point, 12)
        return <SvgText key={name} x={spot.x} y={spot.y} size={11} weight={800}>{name}</SvgText>
      })}
      <circle cx={O.x} cy={O.y} r="2.5" fill={INK} />
      <SvgText x={O.x - 8} y={O.y - 8} size={10} weight={800}>O</SvgText>
      <g data-inscribed={theta / 2}>
        <SvgText x="230" y="44" anchor="start" size={11}>角APB</SvgText>
        <SvgText x="230" y="66" anchor="start" size={16} weight={800} fill={color}>{`＝ ${theta / 2}°`}</SvgText>
      </g>
      <SvgText x="230" y="100" anchor="start" size={11}>角AOB（中心角）</SvgText>
      <SvgText x="230" y="122" anchor="start" size={14} weight={800} fill={oTone}>{`＝ ${theta}°`}</SvgText>
      <SvgText x="230" y="156" anchor="start" size={10} fill={MUTED}>円周角は中心角の半分</SvgText>
    </Stage>
  )
}

// ── 三平方の定理：3辺の正方形と、並べかえの証明 ────────────────────────────
function PythagorasSquaresScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const sum = a * a + b * b
  const c = Math.sqrt(sum)
  const exact = Number.isInteger(c)
  const bTone = apart(color, BLUE, ROSE)
  const cTone = apart(color, WARM, ROSE)
  const cText = exact ? `c ＝ ${c}` : `c ≈ ${nice(c, 2)}`
  if (values.view === 'proof') {
    const unit = 150 / (a + b)
    const make = (origin) => (px, py) => ({ x: origin.x + px * unit, y: origin.y + py * unit })
    const L = make({ x: 14, y: 30 })
    const Rt = make({ x: 196, y: 30 })
    const tri = (list, key) => <polygon key={key} points={points(list)} fill={`${MUTED}33`} stroke={MUTED} strokeWidth="1.2" />
    const inner = [L(a, 0), L(a + b, a), L(b, a + b), L(0, b)]
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <SvgText x="89" y="16" size={10} weight={800}>三角形4つ ＋ c²</SvgText>
        <SvgText x="271" y="16" size={10} weight={800}>三角形4つ ＋ a² ＋ b²</SvgText>
        <g data-pyth-sum={sum} data-pyth-view="proof">
          <polygon points={points(inner)} fill={`${cTone}40`} stroke={cTone} strokeWidth="1.8" />
          {tri([L(0, 0), L(a, 0), L(0, b)], 'l1')}
          {tri([L(a + b, 0), L(a + b, a), L(a, 0)], 'l2')}
          {tri([L(a + b, a + b), L(b, a + b), L(a + b, a)], 'l3')}
          {tri([L(0, a + b), L(0, b), L(b, a + b)], 'l4')}
          <rect x={Rt(0, 0).x} y={Rt(0, 0).y} width={a * unit} height={a * unit} fill={`${color}40`} stroke={color} strokeWidth="1.8" />
          <rect x={Rt(a, a).x} y={Rt(a, a).y} width={b * unit} height={b * unit} fill={`${bTone}40`} stroke={bTone} strokeWidth="1.8" />
          {tri([Rt(a, 0), Rt(a + b, 0), Rt(a + b, a)], 'r1')}
          {tri([Rt(a, 0), Rt(a, a), Rt(a + b, a)], 'r2')}
          {tri([Rt(0, a), Rt(a, a), Rt(0, a + b)], 'r3')}
          {tri([Rt(a, a), Rt(a, a + b), Rt(0, a + b)], 'r4')}
        </g>
        <SvgText x={L((a + b) / 2, (a + b) / 2).x} y={L((a + b) / 2, (a + b) / 2).y} size={11} weight={800} fill={cTone}>c²</SvgText>
        {a * unit >= 22 && <SvgText x={Rt(a / 2, a / 2).x} y={Rt(a / 2, a / 2).y} size={11} weight={800} fill={color}>a²</SvgText>}
        {b * unit >= 22 && <SvgText x={Rt(a + b / 2, a + b / 2).x} y={Rt(a + b / 2, a + b / 2).y} size={11} weight={800} fill={bTone}>b²</SvgText>}
        <SvgText x="180" y="202" size={11} weight={800}>{`c² ＝ a² ＋ b² ＝ ${a * a} ＋ ${b * b} ＝ ${sum}`}</SvgText>
      </Stage>
    )
  }
  const unit = Math.min(26, 186 / (a + 2 * b), 206 / (2 * a + b))
  const C = { x: 14 + a * unit, y: 18 + (a + b) * unit }
  const A = { x: C.x, y: C.y - a * unit }
  const B = { x: C.x + b * unit, y: C.y }
  const n = { x: a * unit, y: -b * unit }
  const grid = (left, top, count, tone, key) => Array.from({ length: count - 1 }, (_, index) => (
    <g key={`${key}${index}`}>
      <line x1={left + (index + 1) * unit} y1={top} x2={left + (index + 1) * unit} y2={top + count * unit} stroke={`${tone}55`} strokeWidth="0.8" />
      <line x1={left} y1={top + (index + 1) * unit} x2={left + count * unit} y2={top + (index + 1) * unit} stroke={`${tone}55`} strokeWidth="0.8" />
    </g>
  ))
  const hyp = [A, B, { x: B.x + n.x, y: B.y + n.y }, { x: A.x + n.x, y: A.y + n.y }]
  const hypCenter = { x: (A.x + B.x) / 2 + n.x / 2, y: (A.y + B.y) / 2 + n.y / 2 }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <g data-pyth-sum={sum} data-pyth-view="squares">
        <rect x={C.x - a * unit} y={A.y} width={a * unit} height={a * unit} fill={`${color}33`} stroke={color} strokeWidth="1.8" />
        {grid(C.x - a * unit, A.y, a, color, 'a')}
        <rect x={C.x} y={C.y} width={b * unit} height={b * unit} fill={`${bTone}33`} stroke={bTone} strokeWidth="1.8" />
        {grid(C.x, C.y, b, bTone, 'b')}
        <polygon points={points(hyp)} fill={`${cTone}33`} stroke={cTone} strokeWidth="1.8" />
        <polygon points={points([A, B, C])} fill={PAPER} stroke={INK} strokeWidth="2" />
      </g>
      {a * unit >= 26 && <SvgText x={C.x - (a * unit) / 2} y={A.y + (a * unit) / 2} size={10} weight={800} fill={color}>{`a²＝${a * a}`}</SvgText>}
      {b * unit >= 26 && <SvgText x={C.x + (b * unit) / 2} y={C.y + (b * unit) / 2} size={10} weight={800} fill={bTone}>{`b²＝${b * b}`}</SvgText>}
      <SvgText x={hypCenter.x} y={hypCenter.y} size={11} weight={800} fill={cTone}>{`c²＝${sum}`}</SvgText>
      <SvgText x="236" y="40" anchor="start" size={11}>{`a ＝ ${a}、b ＝ ${b}`}</SvgText>
      <SvgText x="236" y="64" anchor="start" size={11} fill={color}>{`a² ＝ ${a * a}`}</SvgText>
      <SvgText x="236" y="84" anchor="start" size={11} fill={bTone}>{`b² ＝ ${b * b}`}</SvgText>
      <SvgText x="236" y="108" anchor="start" size={12} weight={800} fill={cTone}>{`c² ＝ ${sum}`}</SvgText>
      <SvgText x="236" y="134" anchor="start" size={14} weight={800}>{cText}</SvgText>
      {exact && <SvgText x="236" y="158" anchor="start" size={10} weight={800} fill={GOOD}>3辺とも整数</SvgText>}
      {exact && <SvgText x="236" y="174" anchor="start" size={10} weight={800} fill={GOOD}>（ピタゴラス数）</SvgText>}
    </Stage>
  )
}

// ── 標本調査：印をつけた魚の割合から、池の魚の数を見積もる ────────────────────
function CaptureRecaptureScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const s = num(values.s)
  const { chosen, marked, estimate } = recaptureSample(n, s)
  const picked = new Set(chosen)
  const pond = { cx: 108, cy: 86, rx: 96, ry: 66 }
  const estimates = recaptureEstimates(n)
  const lineX = (value) => 20 + Math.min(value, 800) * 0.4
  const failures = estimates.filter((value) => value === null).length
  const stacks = {}
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <ellipse cx={pond.cx} cy={pond.cy} rx={pond.rx} ry={pond.ry} fill="#e0f2fe" stroke={BLUE} strokeWidth="1.4" />
      {POND_FISH.map((fish, index) => {
        const x = pond.cx + fish.x * (pond.rx - 6)
        const y = pond.cy + fish.y * (pond.ry - 6)
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="2.2" fill={fish.marked ? color : '#94a3b8'} />
            {picked.has(index) && <circle cx={x} cy={y} r="4" fill="none" stroke={INK} strokeWidth="1" />}
          </g>
        )
      })}
      <g data-recapture-m={marked} data-recapture-estimate={estimate ? Math.round(estimate) : 'none'}>
        <SvgText x="214" y="22" anchor="start" size={10} fill={color}>{`● 印をつけた魚 ${POND_MARKED}匹`}</SvgText>
        <SvgText x="214" y="42" anchor="start" size={10}>{`○ 2回目にとった ${n}匹`}</SvgText>
        <SvgText x="214" y="62" anchor="start" size={11} weight={800} fill={color}>{`そのうち印 ${marked}匹`}</SvgText>
        <SvgText x="214" y="90" anchor="start" size={13} weight={800}>{estimate ? `見積もり 約${Math.round(estimate)}匹` : '見積もれない'}</SvgText>
        <SvgText x="214" y="112" anchor="start" size={10} fill={MUTED}>{`本当の数 ${POND_TOTAL}匹`}</SvgText>
      </g>
      <SvgText x="20" y="166" anchor="start" size={9} fill={MUTED}>{`${n}匹ずつ${RECAPTURE_ROUNDS}回調べたときの見積もり`}</SvgText>
      {failures > 0 && <SvgText x="340" y="166" anchor="end" size={9} weight={800} fill={MUTED}>{`見積もれない回：${failures}回`}</SvgText>}
      <line x1={lineX(0)} y1="192" x2={lineX(800)} y2="192" stroke={INK} strokeWidth="1.2" />
      {[0, 400, 800].map((value) => <SvgText key={value} x={lineX(value)} y="204" size={9} fill={MUTED}>{value}</SvgText>)}
      <line x1={lineX(POND_TOTAL)} y1="172" x2={lineX(POND_TOTAL)} y2="196" stroke={INK} strokeWidth="1.2" strokeDasharray="3 2" />
      {estimates.map((value, index) => {
        const current = index + 1 === s
        if (value === null) return null
        const key = Math.round(value)
        stacks[key] = (stacks[key] ?? 0) + 1
        return <circle key={index} cx={lineX(value)} cy={188 - (stacks[key] - 1) * 7} r={current ? 4.5 : 3} fill={current ? color : MUTED} />
      })}
    </Stage>
  )
}

export const JUNIOR_MORE_SCENES = Object.freeze({
  'points-split': PointsSplitScene,
  'box-plot': BoxPlotScene,
  'complete-square': CompleteSquareScene,
  'sqrt2-fractions': Sqrt2FractionsScene,
  'heron-rectangle': HeronRectangleScene,
  'galileo-ramp': GalileoRampScene,
  'shadow-similar': ShadowSimilarScene,
  'inscribed-angle': InscribedAngleScene,
  'pythagoras-squares': PythagorasSquaresScene,
  'capture-recapture': CaptureRecaptureScene,
})
