import { nice, withCommas } from '../../data/math-history/controls.js'
import { CONGRUENCE_CONDITIONS, COORDINATE_CURVES } from '../../data/math-history/junior.js'
import { GOOD, GRID, INK, MUTED, PAPER, ROSE, Stage, SvgText, WARM, apart, num } from './stage.jsx'

// 第2部「中学の数学」の話の図（前半：負の数・方程式・関数・図形）。

const rad = (degrees) => (degrees * Math.PI) / 180
const BLACK_ROD = '#1f2937'
const signedText = (value) => (value > 0 ? `+${value}` : String(value))

/** 中心 (cx, cy)・半径 r の円の、数学の向き（左回り・上が正）で from°〜to° の弧。 */
const arcPath = (cx, cy, r, from, to) => {
  const start = { x: cx + r * Math.cos(rad(from)), y: cy - r * Math.sin(rad(from)) }
  const end = { x: cx + r * Math.cos(rad(to)), y: cy - r * Math.sin(rad(to)) }
  const large = Math.abs(to - from) > 180 ? 1 : 0
  const sweep = to > from ? 0 : 1
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} A${r} ${r} 0 ${large} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

// ── 負の数：赤（正）と黒（負）の算木が組になって打ち消し合う ────────────────
function SignedRodsScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const sum = a + b
  const pairs = a * b < 0 ? Math.min(Math.abs(a), Math.abs(b)) : 0
  const rodX = (index) => 112 + index * 23
  const tone = (value) => (value > 0 ? ROSE : value < 0 ? BLACK_ROD : INK)
  const rows = [
    { id: 'a', y: 24, value: a, title: 'はじめの数' },
    { id: 'b', y: 86, value: b, title: 'たす数' },
    { id: 'sum', y: 150, value: sum, title: 'のこり' },
  ]
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {Array.from({ length: pairs }, (_, index) => (
        <g key={index} data-rod-pair={index}>
          <rect x={rodX(index) - 10} y="19" width="20" height="106" rx="6" fill="none" stroke={MUTED} strokeWidth="1.2" strokeDasharray="3 3" />
          <SvgText x={rodX(index)} y="73" size={11} weight={800} fill={MUTED}>0</SvgText>
        </g>
      ))}
      <line x1="10" y1="137" x2="350" y2="137" stroke={MUTED} strokeWidth="1" />
      {rows.map((row) => (
        <g key={row.id}>
          <SvgText x="10" y={row.y + 7} anchor="start" size={11} fill={MUTED}>{row.title}</SvgText>
          <SvgText x="10" y={row.y + 26} anchor="start" size={17} weight={800} fill={tone(row.value)}>{signedText(row.value)}</SvgText>
          {row.value === 0 && <SvgText x={rodX(0) - 5} y={row.y + 17} anchor="start" size={11} fill={MUTED}>算木なし（0）</SvgText>}
          {Array.from({ length: Math.abs(row.value) }, (_, index) => {
            const paired = row.id !== 'sum' && index < pairs
            return (
              <rect
                key={index}
                x={rodX(index) - 5}
                y={row.y}
                width="10"
                height="34"
                rx="2"
                fill={row.value > 0 ? ROSE : BLACK_ROD}
                fillOpacity={paired ? 0.3 : 1}
                data-rod-row={row.id}
                data-rod-sign={row.value > 0 ? 'pos' : 'neg'}
                data-rod-paired={paired ? '1' : '0'}
              />
            )
          })}
        </g>
      ))}
      <rect x="112" y="198" width="9" height="17" rx="2" fill={ROSE} />
      <SvgText x="127" y="207" anchor="start" size={11} fill={ROSE}>赤＝正（＋）</SvgText>
      <rect x="226" y="198" width="9" height="17" rx="2" fill={BLACK_ROD} />
      <SvgText x="241" y="207" anchor="start" size={11} fill={BLACK_ROD}>黒＝負（−）</SvgText>
    </Stage>
  )
}

// ── 一次方程式：天びんの両側に同じものをのせ下ろしする ──────────────────────
const PANS = { left: 92, right: 268 }
const PAN_Y = 150

function PanContent({ side, cx, boxes, units, negatives, boxLabel, color }) {
  const left = cx - 78
  const addedTone = apart(color, GOOD, WARM)
  const circles = [
    ...negatives.map((state) => ({ kind: 'neg', state })),
    ...units.map((state) => ({ kind: 'unit', state })),
  ]
  const circleStart = left + 2 + boxes.length * 34 + 15
  return (
    <g
      data-pan={side}
      data-pan-boxes={boxes.filter((state) => state !== 'removed').length}
      data-pan-units={units.length}
      data-pan-negatives={negatives.filter((state) => state !== 'canceled').length}
    >
      {boxes.map((state, index) => (
        <g key={`box-${index}`} data-token={`box-${state}`}>
          <rect
            x={left + 2 + index * 34}
            y={PAN_Y - 32}
            width="30"
            height="30"
            rx="3"
            fill={state === 'removed' ? 'none' : `${color}22`}
            stroke={state === 'removed' ? MUTED : color}
            strokeWidth="2"
            strokeDasharray={state === 'removed' ? '4 3' : undefined}
          />
          <SvgText x={left + 17 + index * 34} y={PAN_Y - 17} size={boxLabel === 'x' ? 16 : 12} weight={800} fill={state === 'removed' ? MUTED : color}>
            {boxLabel}
          </SvgText>
        </g>
      ))}
      {circles.map((circle, index) => {
        const x = circleStart + (index % 5) * 16
        const y = PAN_Y - 9 - Math.floor(index / 5) * 16
        if (circle.kind === 'neg') {
          return (
            <g key={`c-${index}`} data-token={`neg-${circle.state}`}>
              <circle cx={x} cy={y} r="7" fill="none" stroke={ROSE} strokeWidth="1.5" strokeDasharray="2.5 2" />
              {circle.state === 'canceled'
                ? <circle cx={x} cy={y} r="4.5" fill={addedTone} />
                : <line x1={x - 3.5} y1={y} x2={x + 3.5} y2={y} stroke={ROSE} strokeWidth="1.8" />}
            </g>
          )
        }
        return (
          <circle
            key={`c-${index}`}
            cx={x}
            cy={y}
            r="7"
            fill={circle.state === 'added' ? addedTone : WARM}
            data-token={`unit-${circle.state}`}
          />
        )
      })}
    </g>
  )
}

function AlJabrScene({ values, color, markerId, label }) {
  const c = num(values.c)
  const d = num(values.d)
  const step = num(values.step)
  const x = c + d
  const repeat = (count, state) => Array.from({ length: count }, () => state)
  const pans = [
    {
      left: { boxes: ['normal', 'normal'], units: [], negatives: repeat(c, 'normal'), boxLabel: 'x', text: `2x − ${c}` },
      right: { boxes: ['normal'], units: repeat(d, 'normal'), negatives: [], boxLabel: 'x', text: `x ＋ ${d}` },
      action: 'もとの式',
    },
    {
      left: { boxes: ['normal', 'normal'], units: [], negatives: repeat(c, 'canceled'), boxLabel: 'x', text: '2x' },
      right: { boxes: ['normal'], units: [...repeat(d, 'normal'), ...repeat(c, 'added')], negatives: [], boxLabel: 'x', text: `x ＋ ${x}` },
      action: `両辺に ${c} をたす（アル・ジャブル）`,
    },
    {
      left: { boxes: ['normal', 'removed'], units: [], negatives: [], boxLabel: 'x', text: 'x' },
      right: { boxes: ['removed'], units: repeat(x, 'normal'), negatives: [], boxLabel: 'x', text: String(x) },
      action: '両辺から x をひく（アル・ムカーバラ）',
    },
    {
      left: { boxes: ['normal', 'normal'], units: [], negatives: repeat(c, 'normal'), boxLabel: String(x), text: `2×${x} − ${c} ＝ ${2 * x - c}` },
      right: { boxes: ['normal'], units: repeat(d, 'normal'), negatives: [], boxLabel: String(x), text: `${x} ＋ ${d} ＝ ${x + d}` },
      action: `x ＝ ${x} を入れて確かめる`,
    },
  ][step]
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="14" size={13} weight={800} fill={color}>{pans.action}</SvgText>
      <line x1="180" y1="38" x2="180" y2="182" stroke={INK} strokeWidth="3" />
      <path d="M162 190 L198 190 L180 176 Z" fill={INK} />
      <path d="M172 40 L188 40 L180 28 Z" fill={INK} />
      <line x1="30" y1="40" x2="330" y2="40" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {Object.entries(PANS).map(([side, cx]) => (
        <g key={side}>
          <line x1={cx} y1="40" x2={cx - 78} y2={PAN_Y} stroke={MUTED} strokeWidth="1" />
          <line x1={cx} y1="40" x2={cx + 78} y2={PAN_Y} stroke={MUTED} strokeWidth="1" />
          <line x1={cx - 80} y1={PAN_Y + 1} x2={cx + 80} y2={PAN_Y + 1} stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <PanContent side={side} cx={cx} color={color} {...pans[side]} />
          <SvgText x={cx} y={PAN_Y + 20} size={13} weight={800}>{pans[side].text}</SvgText>
        </g>
      ))}
      <rect x="14" y="199" width="13" height="13" rx="2" fill={`${color}22`} stroke={color} strokeWidth="1.4" />
      <SvgText x="32" y="206" anchor="start" size={10} fill={MUTED}>分からない数</SvgText>
      {step === 1 && (
        <g>
          <circle cx="128" cy="206" r="6" fill={apart(color, GOOD, WARM)} />
          <SvgText x="137" y="206" anchor="start" size={10} fill={MUTED}>たした1</SvgText>
        </g>
      )}
      <circle cx="214" cy="206" r="6" fill={WARM} />
      <SvgText x="223" y="206" anchor="start" size={10} fill={MUTED}>＋1</SvgText>
      <circle cx="258" cy="206" r="6" fill="none" stroke={ROSE} strokeWidth="1.5" strokeDasharray="2.5 2" />
      <SvgText x="267" y="206" anchor="start" size={10} fill={MUTED}>−1（ひく数）</SvgText>
    </Stage>
  )
}

// ── 座標とグラフ：式を満たす点を集めるとグラフになる ─────────────────────────
const COORDINATE_PLOTS = {
  line: { unit: 14, originY: 112, grid: [-7, 7], yTicks: [-6, 6] },
  parabola: { unit: 19, originY: 194, grid: [-1, 9], yTicks: [9] },
  circle: { unit: 28, originY: 112, grid: [-3, 3], yTicks: [-3, 3] },
}

function CoordinateCurveScene({ values, color, markerId, label }) {
  const curve = values.curve
  const meta = COORDINATE_CURVES[curve]
  const plot = COORDINATE_PLOTS[curve]
  const X = num(values.x)
  const Y = meta.y(X)
  const originX = 130
  const px = (x) => originX + x * plot.unit
  const py = (y) => plot.originY - y * plot.unit
  const xs = Array.from({ length: 9 }, (_, index) => index - 4)
  const ys = Array.from({ length: plot.grid[1] - plot.grid[0] + 1 }, (_, index) => plot.grid[0] + index)
  const path = curve === 'circle'
    ? `M${px(3)} ${py(0)} A${3 * plot.unit} ${3 * plot.unit} 0 1 0 ${px(-3)} ${py(0)} A${3 * plot.unit} ${3 * plot.unit} 0 1 0 ${px(3)} ${py(0)}`
    : Array.from({ length: 61 }, (_, index) => {
      const x = -3 + index * 0.1
      return `${index ? 'L' : 'M'}${px(x).toFixed(2)} ${py(meta.y(x)).toFixed(2)}`
    }).join(' ')
  const top = py(plot.grid[1]) - 8
  const bottom = py(plot.grid[0]) + 4
  const exact = Math.abs(Number(nice(Y, 2)) - Y) < 1e-10
  const check = {
    line: `2 × ${X < 0 ? `(${nice(X, 1)})` : nice(X, 1)} ＝ ${nice(Y, 2)}`,
    parabola: `${X < 0 ? `(${nice(X, 1)})` : nice(X, 1)}² ＝ ${nice(Y, 2)}`,
    circle: `x² ＋ y² ＝ 9`,
  }[curve]
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {xs.map((x) => <line key={`gx${x}`} x1={px(x)} y1={py(plot.grid[1])} x2={px(x)} y2={py(plot.grid[0])} stroke={GRID} strokeWidth="1" />)}
      {ys.map((y) => <line key={`gy${y}`} x1={px(-4)} y1={py(y)} x2={px(4)} y2={py(y)} stroke={GRID} strokeWidth="1" />)}
      <line x1={px(-4)} y1={py(0)} x2={px(4) + 6} y2={py(0)} stroke={INK} strokeWidth="1.4" markerEnd={`url(#${markerId}-muted)`} />
      <line x1={px(0)} y1={bottom} x2={px(0)} y2={top} stroke={INK} strokeWidth="1.4" markerEnd={`url(#${markerId}-muted)`} />
      <SvgText x={px(4) + 10} y={py(0) - 8} size={10} fill={MUTED}>x</SvgText>
      <SvgText x={px(0) + 9} y={top + 2} size={10} fill={MUTED}>y</SvgText>
      {[-3, 3].map((x) => <SvgText key={`tx${x}`} x={px(x)} y={py(0) + 10} size={9} fill={MUTED}>{x}</SvgText>)}
      {plot.yTicks.map((y) => <SvgText key={`ty${y}`} x={px(0) - 8} y={py(y)} anchor="end" size={9} fill={MUTED}>{y}</SvgText>)}
      <path d={path} fill="none" stroke={color} strokeWidth="2.4" />
      <line x1={px(X)} y1={py(Y)} x2={px(X)} y2={py(0)} stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      <line x1={px(X)} y1={py(Y)} x2={px(0)} y2={py(Y)} stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={px(X)} cy={py(Y)} r="5.5" fill={WARM} stroke={PAPER} strokeWidth="1.5" data-point-x={nice(X, 1)} data-point-y={nice(Y, 2)} />
      <SvgText x="258" y="26" anchor="start" size={11} weight={800} fill={color}>{meta.label}</SvgText>
      <SvgText x="258" y="42" anchor="start" size={12} weight={800} fill={color}>{meta.equation}</SvgText>
      <SvgText x="258" y="70" anchor="start" size={12} weight={800}>{`x ＝ ${nice(X, 1)}`}</SvgText>
      <SvgText x="258" y="90" anchor="start" size={12} weight={800}>{`y ${exact ? '＝' : '≈'} ${nice(Y, 2)}`}</SvgText>
      <SvgText x="258" y="114" anchor="start" size={10} fill={MUTED}>点</SvgText>
      <SvgText x="258" y="130" anchor="start" size={12} weight={800} fill={WARM}>{`(${nice(X, 1)}, ${nice(Y, 2)})`}</SvgText>
      <SvgText x="258" y="162" anchor="start" size={11} fill={MUTED}>{check}</SvgText>
    </Stage>
  )
}

// ── 球の体積：半球の切り口と、円柱から円すいをくりぬいた切り口 ─────────────────
function SphereSlicesScene({ values, color, markerId, label }) {
  const h = num(values.h)
  const ringTone = apart(color, WARM, ROSE)
  const s = 14
  const base = 112
  const cut = base - h * s
  const half = Math.sqrt(Math.max(0, 25 - h * h)) * s
  const area = nice(25 - h * h, 2)
  const small = 6.4
  const outer = 5 * small
  const inner = h * small
  const disk = Math.sqrt(Math.max(0, 25 - h * h)) * small
  const circle = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`
  return (
    <Stage label={label} markerId={markerId} color={color} height={236}>
      <SvgText x="90" y="16" size={11} weight={800} fill={color}>半球（半径5）</SvgText>
      <SvgText x="270" y="16" size={11} weight={800} fill={ringTone}>円柱 − さかさまの円すい</SvgText>
      <path d={`M20 ${base} A70 70 0 0 1 160 ${base} Z`} fill={`${color}26`} stroke={color} strokeWidth="2" />
      <rect x="200" y="42" width="140" height="70" fill="none" stroke={ringTone} strokeWidth="2" />
      <path d={`M200 42 L270 ${base} L200 ${base} Z M340 42 L270 ${base} L340 ${base} Z`} fill={`${ringTone}26`} />
      <path d={`M200 42 L270 ${base} L340 42`} fill="none" stroke={ringTone} strokeWidth="1.4" strokeDasharray="4 3" />
      <line x1="12" y1={cut} x2="348" y2={cut} stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      <line x1={90 - half} y1={cut} x2={90 + half} y2={cut} stroke={color} strokeWidth="3.4" data-slice-disk={area} />
      <line x1="200" y1={cut} x2={270 - h * s} y2={cut} stroke={ringTone} strokeWidth="3.4" />
      <line x1={270 + h * s} y1={cut} x2="340" y2={cut} stroke={ringTone} strokeWidth="3.4" data-slice-ring={area} />
      <SvgText x="180" y={cut - 8} size={9} fill={MUTED}>{`高さ ${nice(h, 1)}`}</SvgText>
      <SvgText x="180" y="130" size={10} fill={MUTED}>上から見た切り口</SvgText>
      <circle cx="90" cy="176" r={outer} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      {disk > 0 && <path d={circle(90, 176, disk)} fill={`${color}55`} stroke={color} strokeWidth="1.8" />}
      {h < 5
        ? <path d={h > 0 ? `${circle(270, 176, outer)} ${circle(270, 176, inner)}` : circle(270, 176, outer)} fillRule="evenodd" fill={`${ringTone}55`} stroke={ringTone} strokeWidth="1.8" />
        : <circle cx="270" cy="176" r={outer} fill="none" stroke={ringTone} strokeWidth="1.8" />}
      <SvgText x="90" y="224" size={11} weight={800} fill={color}>{`π×(25−${nice(h * h, 2)}) ＝ ${area}π`}</SvgText>
      <SvgText x="270" y="224" size={11} weight={800} fill={ringTone}>{`π×25 − π×${nice(h * h, 2)} ＝ ${area}π`}</SvgText>
    </Stage>
  )
}

// ── 連立方程式：つるかめ算（頭10のまま、足の数を合わせる） ─────────────────────
function Crane({ x, tone }) {
  return (
    <g data-animal="crane">
      <ellipse cx={x} cy="74" rx="9" ry="6" fill={`${tone}33`} stroke={tone} strokeWidth="1.6" />
      <line x1={x + 6} y1="70" x2={x + 9} y2="54" stroke={tone} strokeWidth="1.6" />
      <circle cx={x + 9} cy="52" r="3" fill={tone} />
      <line x1={x - 2} y1="80" x2={x - 3} y2="96" stroke={tone} strokeWidth="1.6" />
      <line x1={x + 2} y1="80" x2={x + 3} y2="96" stroke={tone} strokeWidth="1.6" />
    </g>
  )
}

function Turtle({ x, tone }) {
  return (
    <g data-animal="turtle">
      <path d={`M${x - 11} 88 A11 9 0 0 1 ${x + 11} 88 Z`} fill={`${tone}33`} stroke={tone} strokeWidth="1.6" />
      <circle cx={x + 13} cy="85" r="3" fill={tone} />
      {[-8, -3, 3, 8].map((dx) => (
        <line key={dx} x1={x + dx} y1="88" x2={x + dx * 1.15} y2="96" stroke={tone} strokeWidth="1.6" />
      ))}
    </g>
  )
}

function TsurukameScene({ values, color, markerId, label }) {
  const legs = num(values.legs)
  const t = num(values.t)
  const cranes = 10 - t
  const now = cranes * 2 + t * 4
  const turtleTone = apart(color, GOOD, WARM)
  const meterX = (count) => 40 + count * 7
  const diff = legs - now
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="16" size={11} weight={800}>頭はいつも10</SvgText>
      {Array.from({ length: 10 }, (_, index) => {
        const x = 26 + index * 34
        return (
          <g key={index}>
            {index < cranes ? <Crane x={x} tone={color} /> : <Turtle x={x} tone={turtleTone} />}
            <SvgText x={x} y="110" size={9} fill={MUTED}>{index < cranes ? '2本' : '4本'}</SvgText>
          </g>
        )
      })}
      <rect x={meterX(0)} y="136" width={meterX(40) - meterX(0)} height="16" rx="3" fill={PAPER} stroke={MUTED} strokeWidth="1" />
      <rect x={meterX(0)} y="136" width={meterX(now) - meterX(0)} height="16" rx="3" fill={`${color}55`} stroke={color} strokeWidth="1.4" data-legs-now={now} />
      <line x1={meterX(legs)} y1="128" x2={meterX(legs)} y2="160" stroke={INK} strokeWidth="2" data-legs-target={legs} />
      <SvgText x={meterX(legs)} y="124" size={10} weight={800}>{`目標 ${legs}本`}</SvgText>
      {[0, 20, 40].map((count) => <SvgText key={count} x={meterX(count)} y="168" size={9} fill={MUTED}>{count}</SvgText>)}
      <SvgText x="180" y="186" size={11} weight={800}>{`つる ${cranes}羽×2 ＋ かめ ${t}匹×4 ＝ ${now}本`}</SvgText>
      <SvgText x="180" y="206" size={11} weight={800} fill={diff === 0 ? GOOD : WARM}>
        {diff === 0 ? `目標の${legs}本とぴったり` : diff > 0 ? `目標まで あと${diff}本` : `目標より${-diff}本多い`}
      </SvgText>
    </Stage>
  )
}

// ── 一次関数と速さのグラフ：グラフの下の面積が道のり ─────────────────────────
function OresmeAreaScene({ values, color, markerId, label }) {
  const v0 = num(values.v0)
  const a = num(values.a)
  const t = num(values.t)
  const end = v0 + a * t
  const mean = (v0 + end) / 2
  const area = mean * t
  const X = (time) => 44 + time * 46
  const Y = (speed) => 186 - speed * 6.8
  const rectTone = apart(color, WARM, ROSE)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="150" y1="14" x2="170" y2="14" stroke={color} strokeWidth="2.6" />
      <SvgText x="176" y="14" anchor="start" size={10}>速さのグラフ（下の面積＝道のり）</SvgText>
      <line x1="150" y1="30" x2="170" y2="30" stroke={rectTone} strokeWidth="1.8" strokeDasharray="4 3" />
      <SvgText x="176" y="30" anchor="start" size={10}>{`真ん中の速さ ${nice(mean, 2)} の長方形`}</SvgText>
      {[0, 10, 20].map((speed) => (
        <g key={speed}>
          <line x1={X(0)} y1={Y(speed)} x2={X(6)} y2={Y(speed)} stroke={GRID} strokeWidth="1" />
          <SvgText x={X(0) - 6} y={Y(speed)} anchor="end" size={9} fill={MUTED}>{speed}</SvgText>
        </g>
      ))}
      <polygon
        points={`${X(0)},${Y(0)} ${X(0)},${Y(v0)} ${X(t)},${Y(end)} ${X(t)},${Y(0)}`}
        fill={`${color}40`}
        stroke={color}
        strokeWidth="1.2"
        data-oresme-area={nice(area, 2)}
      />
      <line x1={X(0)} y1={Y(v0)} x2={X(t)} y2={Y(end)} stroke={color} strokeWidth="2.6" />
      <rect x={X(0)} y={Y(mean)} width={X(t) - X(0)} height={Y(0) - Y(mean)} fill="none" stroke={rectTone} strokeWidth="1.8" strokeDasharray="4 3" data-oresme-mean={nice(mean, 2)} />
      <line x1={X(t / 2)} y1={Y(0)} x2={X(t / 2)} y2={Y(mean)} stroke={MUTED} strokeWidth="1" strokeDasharray="2 3" />
      <circle cx={X(t / 2)} cy={Y(mean)} r="4" fill={rectTone} />
      <line x1={X(0)} y1={Y(0)} x2={X(6) + 8} y2={Y(0)} stroke={INK} strokeWidth="1.4" />
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(22) - 4} stroke={INK} strokeWidth="1.4" />
      {[0, 1, 2, 3, 4, 5, 6].map((time) => <SvgText key={time} x={X(time)} y={Y(0) + 11} size={9} fill={MUTED}>{time}</SvgText>)}
      <SvgText x={X(6) + 8} y={Y(0) + 24} anchor="end" size={9} fill={MUTED}>時間（秒）</SvgText>
      <SvgText x={X(0) - 6} y={Y(22)} anchor="end" size={9} fill={MUTED}>速さ</SvgText>
      <SvgText x={X(0) + 6} y="52" anchor="start" size={12} weight={800} fill={color}>{`道のり ＝ ${nice(area, 2)}`}</SvgText>
    </Stage>
  )
}

// ── 平行線と角：影の角度から地球一周を求める ──────────────────────────────
function EratosthenesScene({ values, color, markerId, label }) {
  const theta = num(values.theta)
  const d = num(values.d)
  const drawn = theta * 4
  const O = { x: 150, y: 134 }
  const R = 78
  const S = { x: O.x, y: O.y - R }
  const u = { x: -Math.sin(rad(drawn)), y: -Math.cos(rad(drawn)) }
  const A = { x: O.x + R * u.x, y: O.y + R * u.y }
  const T = { x: A.x + 26 * u.x, y: A.y + 26 * u.y }
  const surfaceY = (x) => O.y - Math.sqrt(Math.max(0, R * R - (x - O.x) ** 2))
  const ratio = 360 / theta
  const circumference = d * ratio
  const sun = apart(color, WARM, ROSE)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="10" y="12" anchor="start" size={10} fill={sun}>太陽の光（平行）</SvgText>
      {[T.x, O.x, O.x + 40].map((x, index) => (
        <line
          key={index}
          x1={x}
          y1="20"
          x2={x}
          y2={index === 0 ? T.y : surfaceY(x) - 2}
          stroke={sun}
          strokeWidth="1.4"
          markerEnd={`url(#${markerId}-warm)`}
        />
      ))}
      <circle cx={O.x} cy={O.y} r={R} fill={`${color}12`} stroke={INK} strokeWidth="1.6" />
      <path d={arcPath(O.x, O.y, R, 90, 90 + drawn)} fill="none" stroke={color} strokeWidth="3.4" data-earth-arc={d} />
      <line x1={S.x} y1={S.y} x2={O.x} y2={O.y} stroke={sun} strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1={A.x} y1={A.y} x2={O.x} y2={O.y} stroke={INK} strokeWidth="1.2" />
      <line x1={T.x} y1={T.y} x2={T.x} y2={surfaceY(T.x)} stroke={sun} strokeWidth="1.4" />
      <line x1={A.x} y1={A.y} x2={T.x} y2={T.y} stroke={INK} strokeWidth="3" />
      <path d={arcPath(T.x, T.y, 14, 270, 270 + drawn)} fill="none" stroke={color} strokeWidth="1.8" />
      <path d={arcPath(O.x, O.y, 20, 90, 90 + drawn)} fill="none" stroke={color} strokeWidth="1.8" />
      <SvgText x={O.x + 6} y={O.y - 26} anchor="start" size={10} weight={800} fill={color}>{`${nice(theta, 1)}°`}</SvgText>
      <SvgText x={T.x + 14} y={T.y + 8} anchor="start" size={10} weight={800} fill={color}>{`${nice(theta, 1)}°`}</SvgText>
      <circle cx={O.x} cy={O.y} r="2.5" fill={INK} />
      <SvgText x={O.x + 6} y={O.y + 10} anchor="start" size={9} fill={MUTED}>地球の中心</SvgText>
      <SvgText x={S.x + 6} y={S.y - 8} anchor="start" size={10} fill={INK}>シエネ</SvgText>
      <SvgText x={T.x - 6} y={A.y} anchor="end" size={9} fill={INK}>アレクサンドリア</SvgText>
      <SvgText x="236" y="44" anchor="start" size={11} weight={800}>{`中心の角 ${nice(theta, 1)}°`}</SvgText>
      <SvgText x="236" y="64" anchor="start" size={10}>{`360° ÷ ${nice(theta, 1)}° ＝ ${nice(ratio, 2)}`}</SvgText>
      <SvgText x="236" y="92" anchor="start" size={10} fill={color}>{`町の間（色の弧）${d}km`}</SvgText>
      <SvgText x="236" y="112" anchor="start" size={10}>{`一周 ≈ ${d}km × ${nice(ratio, 2)}`}</SvgText>
      <g data-earth-circumference={Math.round(circumference)}>
        <SvgText x="236" y="136" anchor="start" size={14} weight={800} fill={color}>
          {`≈ ${withCommas(Math.round(circumference))}km`}
        </SvgText>
      </g>
      <SvgText x="236" y="206" anchor="start" size={9} fill={MUTED}>図の角は4倍にかいてある</SvgText>
    </Stage>
  )
}

// ── 平行線の公理と曲がった世界：球面の三角形の角の和 ─────────────────────────
function SphereTriangleScene({ values, color, markerId, label }) {
  const lambda = num(values.lambda)
  const C = { x: 118, y: 118 }
  const R = 92
  const tilt = rad(22)
  const project = (lon, lat) => {
    const X = R * Math.cos(rad(lat)) * Math.sin(rad(lon))
    const Yv = R * Math.sin(rad(lat))
    const Z = R * Math.cos(rad(lat)) * Math.cos(rad(lon))
    return {
      x: C.x + X,
      y: C.y - (Yv * Math.cos(tilt) - Z * Math.sin(tilt)),
      z: Yv * Math.sin(tilt) + Z * Math.cos(tilt),
    }
  }
  const polyline = (points) => points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')
  const steps = (from, to, count) => Array.from({ length: count + 1 }, (_, index) => from + ((to - from) * index) / count)
  const half = lambda / 2
  const meridianA = steps(90, 0, 30).map((lat) => project(-half, lat))
  const equatorAB = steps(-half, half, 40).map((lon) => project(lon, 0))
  const meridianB = steps(0, 90, 30).map((lat) => project(half, lat))
  const front = steps(-90, 90, 60).map((lon) => project(lon, 0))
  const back = steps(90, 270, 60).map((lon) => project(lon, 0))
  const P = project(0, 90)
  const A = project(-half, 0)
  const B = project(half, 0)
  const cornerSize = Math.min(8, lambda / 3)
  const corner = (lon, dir) => polyline([project(lon, cornerSize), project(lon + dir * cornerSize, cornerSize), project(lon + dir * cornerSize, 0)])
  const poleArc = steps(-half, half, 24).map((lon) => project(lon, 76))
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <circle cx={C.x} cy={C.y} r={R} fill={`${color}0f`} stroke={INK} strokeWidth="1.6" />
      <path d={polyline(back)} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      <path d={polyline(front)} fill="none" stroke={INK} strokeWidth="1.2" />
      <path d={`${polyline([...meridianA, ...equatorAB, ...meridianB])} Z`} fill={`${color}38`} stroke={color} strokeWidth="2.4" data-sphere-triangle={lambda} />
      <path d={corner(-half, 1)} fill="none" stroke={INK} strokeWidth="1.2" />
      <path d={corner(half, -1)} fill="none" stroke={INK} strokeWidth="1.2" />
      <path d={polyline(poleArc)} fill="none" stroke={INK} strokeWidth="1.4" />
      <circle cx={P.x} cy={P.y} r="3.5" fill={INK} />
      <SvgText x={P.x} y={P.y - 14} size={11} weight={800} fill={color}>{`${lambda}°`}</SvgText>
      <SvgText x={A.x - 4} y={A.y + 13} anchor="end" size={10} weight={800} fill={color}>90°</SvgText>
      <SvgText x={B.x + 4} y={B.y + 13} anchor="start" size={10} weight={800} fill={color}>90°</SvgText>
      <SvgText x="232" y="40" anchor="start" size={10} fill={MUTED}>3つの角の和</SvgText>
      <SvgText x="232" y="62" anchor="start" size={11} weight={800}>{`90° ＋ 90° ＋ ${lambda}°`}</SvgText>
      <g data-angle-sum={180 + lambda}>
        <SvgText x="232" y="88" anchor="start" size={16} weight={800} fill={color}>{`＝ ${180 + lambda}°`}</SvgText>
      </g>
      <SvgText x="232" y="120" anchor="start" size={10} fill={MUTED}>平らな面なら 180°</SvgText>
      <SvgText x="232" y="138" anchor="start" size={10} weight={800} fill={WARM}>{`${lambda}° 大きい`}</SvgText>
      <circle cx="236" cy="176" r="3.5" fill={INK} />
      <SvgText x="244" y="176" anchor="start" size={9} fill={MUTED}>北極</SvgText>
      <line x1="230" y1="194" x2="244" y2="194" stroke={INK} strokeWidth="1.2" />
      <SvgText x="248" y="194" anchor="start" size={9} fill={MUTED}>赤道</SvgText>
    </Stage>
  )
}

// ── 合同と証明：分かっていることから、三角形が1つに決まるか ──────────────────
function CongruenceScene({ values, color, markerId, label }) {
  const condition = values.condition
  const meta = CONGRUENCE_CONDITIONS[condition]
  const other = apart(color, WARM, ROSE)
  const scale = 30
  const at = (origin, point) => ({ x: origin.x + point.x * scale, y: origin.y - point.y * scale })
  const origin = { x: 56, y: 186 }
  const given = { stroke: color, strokeWidth: 4, strokeLinecap: 'round' }
  const found = { stroke: MUTED, strokeWidth: 1.4, strokeDasharray: '5 4' }
  const seg = (p, q, style, key) => <line key={key} x1={p.x} y1={p.y} x2={q.x} y2={q.y} {...style} />
  const angle = (center, from, to, tone = color, r = 18) => (
    <path d={arcPath(center.x, center.y, r, from, to)} fill="none" stroke={tone} strokeWidth="2.4" />
  )
  const name = (point, text, dx = 0, dy = 0) => <SvgText x={point.x + dx} y={point.y + dy} size={11} weight={800}>{text}</SvgText>
  let figure
  let triangles = 1
  if (condition === 'ssa') {
    triangles = 2
    const A = at(origin, { x: 0, y: 0 })
    const B = at(origin, { x: 6, y: 0 })
    const C1 = at(origin, { x: 2.208, y: 1.275 })
    const C2 = at(origin, { x: 6.791, y: 3.921 })
    const far = at(origin, { x: 7.36, y: 4.25 })
    figure = (
      <g>
        <circle cx={B.x} cy={B.y} r={4 * scale} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="3 4" />
        {seg(A, far, found, 'ray')}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C2.x},${C2.y}`} fill={`${color}26`} stroke={color} strokeWidth="1.4" data-congruence-triangle="1" />
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C1.x},${C1.y}`} fill={`${other}26`} stroke={other} strokeWidth="1.4" strokeDasharray="5 3" data-congruence-triangle="2" />
        {seg(A, B, given, 'ab')}
        {seg(B, C2, given, 'bc2')}
        {seg(B, C1, { ...given, stroke: other }, 'bc1')}
        {angle(A, 0, 30)}
        {name(A, 'A', -10, 6)}
        {name(B, 'B', 8, 8)}
        {name(C2, 'C', 8, -6)}
        {name(C1, 'C′', -2, -12)}
      </g>
    )
  } else if (condition === 'aaa') {
    triangles = 2
    const make = (left, base) => {
      const side = (base * Math.sin(rad(60))) / Math.sin(rad(70))
      return {
        A: at(left, { x: 0, y: 0 }),
        B: at(left, { x: base, y: 0 }),
        C: at(left, { x: side * Math.cos(rad(50)), y: side * Math.sin(rad(50)) }),
      }
    }
    const small = make({ x: 22, y: 186 }, 3)
    const big = make({ x: 150, y: 186 }, 5)
    const tri = (t, tone, index) => (
      <g key={index}>
        <polygon points={`${t.A.x},${t.A.y} ${t.B.x},${t.B.y} ${t.C.x},${t.C.y}`} fill={`${tone}20`} stroke={MUTED} strokeWidth="1.4" strokeDasharray="5 4" data-congruence-triangle={index} />
        {angle(t.A, 0, 50, tone)}
        {angle(t.B, 120, 180, tone)}
        {angle(t.C, 230, 300, tone, 14)}
      </g>
    )
    figure = (
      <g>
        {tri(small, color, 1)}
        {tri(big, other, 2)}
        <SvgText x={small.A.x + 20} y="202" anchor="start" size={9} fill={MUTED}>50°・60°・70°</SvgText>
        <SvgText x={big.A.x + 40} y="202" anchor="start" size={9} fill={MUTED}>50°・60°・70°</SvgText>
      </g>
    )
  } else {
    const A = at(origin, { x: 0, y: 0 })
    const B = at(origin, { x: 6, y: 0 })
    const C = at(origin, { x: 2, y: 3.464 })
    const angleB = 180 - (Math.atan2(3.464, 4) * 180) / Math.PI
    const sides = {
      sss: { ab: given, ac: given, bc: given },
      sas: { ab: given, ac: given, bc: found },
      asa: { ab: given, ac: found, bc: found },
    }[condition]
    figure = (
      <g>
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={`${color}1a`} data-congruence-triangle="1" />
        {condition === 'sss' && (
          <g>
            <path d={arcPath(A.x, A.y, 4 * scale, 45, 75)} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
            <path d={arcPath(B.x, B.y, Math.sqrt(28) * scale, 125, 155)} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
          </g>
        )}
        {seg(A, B, sides.ab, 'ab')}
        {seg(A, C, sides.ac, 'ac')}
        {seg(B, C, sides.bc, 'bc')}
        {(condition === 'sas' || condition === 'asa') && angle(A, 0, 60)}
        {condition === 'asa' && angle(B, angleB, 180)}
        {name(A, 'A', -10, 6)}
        {name(B, 'B', 10, 6)}
        {name(C, 'C', 0, -12)}
      </g>
    )
  }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="10" y="16" anchor="start" size={11} weight={800} fill={color}>{`分かっていること：${meta.label}`}</SvgText>
      <line x1="232" y1="16" x2="252" y2="16" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <SvgText x="256" y="16" anchor="start" size={9} fill={MUTED}>分かっている</SvgText>
      <line x1="232" y1="32" x2="252" y2="32" stroke={MUTED} strokeWidth="1.4" strokeDasharray="5 4" />
      <SvgText x="256" y="32" anchor="start" size={9} fill={MUTED}>あとで決まる</SvgText>
      {figure}
      <g data-congruence-unique={meta.unique ? 'yes' : 'no'} data-congruence-count={triangles}>
        <SvgText x="10" y="38" anchor="start" size={12} weight={800} fill={meta.unique ? GOOD : ROSE}>
          {meta.unique ? '→ 三角形は1つに決まる' : condition === 'ssa' ? '→ 三角形が2つできる' : '→ 大きさが決まらない'}
        </SvgText>
      </g>
    </Stage>
  )
}

export const JUNIOR_SCENES = Object.freeze({
  'signed-rods': SignedRodsScene,
  'al-jabr': AlJabrScene,
  'coordinate-curve': CoordinateCurveScene,
  'sphere-slices': SphereSlicesScene,
  tsurukame: TsurukameScene,
  'oresme-area': OresmeAreaScene,
  eratosthenes: EratosthenesScene,
  'sphere-triangle': SphereTriangleScene,
  congruence: CongruenceScene,
})
