import { nice } from '../../data/math-history/controls.js'
import { SPEED_VEHICLES, SPRINGS } from '../../data/math-history/basic-change.js'
import { GOOD, INK, MUTED, PAPER, Stage, SvgText, WARM, num } from './stage.jsx'

// 第1部「算数の基本」の変化と関係の話の図。

const rad = (degrees) => (degrees * Math.PI) / 180

// ── 比と縮図：歯の数の比で、かみ合う歯車の回転が決まる ───────────────────
function Gear({ cx, cy, teeth, angle, color, label }) {
  const radius = teeth * 1.9
  return (
    <g data-gear-teeth={teeth}>
      {Array.from({ length: teeth }, (_, index) => {
        const theta = rad(angle + (index * 360) / teeth)
        return (
          <line
            key={index}
            x1={cx + radius * Math.cos(theta)}
            y1={cy + radius * Math.sin(theta)}
            x2={cx + (radius + 6) * Math.cos(theta)}
            y2={cy + (radius + 6) * Math.sin(theta)}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx={cx} cy={cy} r={radius} fill={`${color}22`} stroke={color} strokeWidth="2.4" />
      <line x1={cx} y1={cy} x2={cx + radius * Math.cos(rad(angle - 90))} y2={cy + radius * Math.sin(rad(angle - 90))} stroke={INK} strokeWidth="2.5" />
      <circle cx={cx + (radius - 6) * Math.cos(rad(angle - 90))} cy={cy + (radius - 6) * Math.sin(rad(angle - 90))} r="4" fill={INK} />
      <circle cx={cx} cy={cy} r="4" fill={INK} />
      <SvgText x={cx} y={cy + radius + 20} size={11} fill={color}>{label}</SvgText>
    </g>
  )
}

function GearsScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const turns = num(values.turn) / 4
  const ra = a * 1.9
  const rb = b * 1.9
  const left = 180 - rb - 3
  const right = left + ra + rb + 6
  const rightTurns = (turns * a) / b
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="14" size={12} weight={800}>{`歯の数の比 ${a}：${b}`}</SvgText>
      <Gear cx={left} cy={108} teeth={a} angle={turns * 360} color={color} label={`歯${a}・${nice(turns, 2)}回転`} />
      <Gear cx={right} cy={108} teeth={b} angle={-rightTurns * 360} color={WARM} label={`歯${b}・${nice(rightTurns, 2)}回転`} />
    </Stage>
  )
}

// ── 割合と百分率：100のます目と、割り引いた値段 ─────────────────────────
function PercentGridScene({ values, color, markerId, label }) {
  const p = num(values.p)
  const price = num(values.price)
  const part = (price * p) / 100
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {Array.from({ length: 100 }, (_, index) => (
        <rect
          key={index}
          x={18 + (index % 10) * 15}
          y={32 + Math.floor(index / 10) * 15}
          width="13"
          height="13"
          rx="2"
          fill={index < p ? color : PAPER}
          stroke={index < p ? color : MUTED}
          strokeWidth="0.8"
          data-percent-cell={index < p ? 'on' : 'off'}
        />
      ))}
      <SvgText x="92" y="20" size={11} fill={MUTED}>100こ中</SvgText>
      <SvgText x="92" y="198" size={13} weight={800} fill={color}>{`${p}こ ＝ ${p}%`}</SvgText>
      <SvgText x="266" y="40" size={12}>{`定価 ${price}円`}</SvgText>
      <rect x="186" y="52" width="160" height="26" rx="4" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="186" y="52" width={(160 * p) / 100} height="26" rx="4" fill={color} />
      <SvgText x="266" y="100" size={12} fill={color}>{`${p}% ＝ ${part}円`}</SvgText>
      <SvgText x="266" y="130" size={12} fill={WARM}>{`${p}%引き → ${price - part}円`}</SvgText>
      <SvgText x="266" y="160" size={11} fill={MUTED}>{`（残りの${100 - p}%）`}</SvgText>
    </Stage>
  )
}

// ── 速さ：時間と道のりのグラフ（道のりは時間に比例） ──────────────────────
function SpeedGraphScene({ values, color, markerId, label }) {
  const { label: name, speed } = SPEED_VEHICLES[values.vehicle]
  const t = num(values.t)
  const distance = (speed * t) / 60
  const top = 60
  const x = (minutes) => 50 + (minutes / 60) * 280
  const y = (km) => 184 - (km / top) * 120
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="30" y1="24" x2="330" y2="24" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx={30 + (t / 60) * 300} cy="24" r="7" fill={color} data-speed-mover />
      <SvgText x="30" y="40" anchor="start" size={10} fill={MUTED}>{`${name}（時速${speed}km）`}</SvgText>
      <line x1="50" y1="184" x2="336" y2="184" stroke={INK} strokeWidth="1.6" />
      <line x1="50" y1="184" x2="50" y2="56" stroke={INK} strokeWidth="1.6" />
      {[0, 15, 30, 45, 60].map((minutes) => (
        <SvgText key={minutes} x={x(minutes)} y="198" size={9} fill={MUTED}>{`${minutes}分`}</SvgText>
      ))}
      {[0, 15, 30, 45, 60].map((km) => (
        <SvgText key={km} x="44" y={y(km)} anchor="end" size={9} fill={MUTED}>{`${km}km`}</SvgText>
      ))}
      {Object.entries(SPEED_VEHICLES).map(([key, vehicle]) => (
        <g key={key}>
          <line
            x1={x(0)}
            y1={y(0)}
            x2={x(60)}
            y2={y(vehicle.speed)}
            stroke={key === values.vehicle ? color : MUTED}
            strokeOpacity={key === values.vehicle ? 1 : 0.5}
            strokeWidth={key === values.vehicle ? 2.8 : 1.2}
            data-speed-line={key}
          />
          {key !== values.vehicle && (
            <SvgText x={x(60) + 2} y={y(vehicle.speed) - 6} anchor="end" size={8} fill={MUTED}>{vehicle.label}</SvgText>
          )}
        </g>
      ))}
      <line x1={x(t)} y1="184" x2={x(t)} y2={y(distance)} stroke={WARM} strokeWidth="1.4" strokeDasharray="3 2" />
      <circle cx={x(t)} cy={y(distance)} r="5" fill={WARM} />
      <SvgText x={Math.min(300, x(t) + 8)} y={y(distance) - 12} anchor="middle" size={11} fill={WARM}>{`${nice(distance, 2)}km`}</SvgText>
      <SvgText x="190" y="214" size={10} fill={MUTED}>横：時間（分）　たて：道のり（km）</SvgText>
    </Stage>
  )
}

// ── 比例：ばねののびと、比例のグラフ ─────────────────────────────
function SpringScene({ values, color, markerId, label }) {
  const selected = values.spring
  const w = num(values.w)
  const { stretch } = SPRINGS[selected]
  const extension = stretch * w
  const top = 22
  const length = 44 + extension * 6
  const coils = 10
  const path = Array.from({ length: coils + 1 }, (_, index) => {
    const yy = top + (length * index) / coils
    const xx = index === 0 || index === coils ? 70 : 70 + (index % 2 ? -12 : 12)
    return `${index ? 'L' : 'M'}${xx} ${yy.toFixed(1)}`
  }).join(' ')
  const gx = (weights) => 196 + weights * 24
  const gy = (cm) => 180 - cm * 7
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="40" y1={top} x2="100" y2={top} stroke={INK} strokeWidth="4" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.4" />
      {w > 0 && <rect x="56" y={top + length} width="28" height="22" rx="4" fill={WARM} data-spring-weight={w} />}
      <SvgText x="94" y={top + length + 11} anchor="start" size={11} fill={WARM}>{w ? `おもり${w}こ` : 'おもりなし'}</SvgText>
      <SvgText x="94" y={top + length - 8} anchor="start" size={11} fill={color}>{`のび ${extension}cm`}</SvgText>
      <line x1="196" y1="180" x2="348" y2="180" stroke={INK} strokeWidth="1.4" />
      <line x1="196" y1="180" x2="196" y2="46" stroke={INK} strokeWidth="1.4" />
      {Object.entries(SPRINGS).map(([key, spring]) => (
        <line
          key={key}
          x1={gx(0)}
          y1={gy(0)}
          x2={gx(6)}
          y2={gy(spring.stretch * 6)}
          stroke={key === selected ? color : MUTED}
          strokeWidth={key === selected ? 2.6 : 1.4}
          strokeDasharray={key === selected ? undefined : '4 3'}
        />
      ))}
      <circle cx={gx(w)} cy={gy(extension)} r="5" fill={WARM} />
      {[0, 2, 4, 6].map((weights) => <SvgText key={weights} x={gx(weights)} y="194" size={9} fill={MUTED}>{weights}</SvgText>)}
      <SvgText x="272" y="208" size={10} fill={MUTED}>おもりの数</SvgText>
      <SvgText x="200" y="40" anchor="start" size={10} fill={MUTED}>のび（cm）</SvgText>
    </Stage>
  )
}

// ── 反比例：てこのつり合いと、反比例のグラフ ─────────────────────────
function LeverScene({ values, color, markerId, label }) {
  const load = num(values.load)
  const d = num(values.d)
  const force = load / d
  const fulcrum = 60
  const unit = 22
  const beamY = 92
  const graphX = (distance) => 70 + distance * 22
  const graphY = (value) => 204 - (value / 12) * 60
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1={fulcrum - unit - 8} y1={beamY} x2={fulcrum + 12 * unit + 6} y2={beamY} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${fulcrum} ${beamY + 2} L${fulcrum - 12} ${beamY + 22} L${fulcrum + 12} ${beamY + 22} Z`} fill={MUTED} />
      <rect x={fulcrum - unit - 14} y={beamY - 14 - load * 2} width="28" height={14 + load * 2} rx="3" fill={WARM} />
      <SvgText x={fulcrum - unit} y={beamY - 22 - load * 2} size={10} fill={WARM}>{`${load}kg`}</SvgText>
      {Array.from({ length: 12 }, (_, index) => (
        <line key={index} x1={fulcrum + (index + 1) * unit} y1={beamY + 3} x2={fulcrum + (index + 1) * unit} y2={beamY + 8} stroke={MUTED} strokeWidth="1" />
      ))}
      <line
        x1={fulcrum + d * unit}
        y1={beamY - 12 - force * 3}
        x2={fulcrum + d * unit}
        y2={beamY - 4}
        stroke={color}
        strokeWidth="3"
        markerEnd={`url(#${markerId})`}
        data-lever-force={nice(force, 2)}
      />
      <SvgText x={fulcrum + d * unit} y={beamY - 20 - force * 3} size={11} fill={color}>{`${nice(force, 2)}kg`}</SvgText>
      <line x1="70" y1="204" x2="340" y2="204" stroke={INK} strokeWidth="1.2" />
      <line x1="70" y1="204" x2="70" y2="140" stroke={INK} strokeWidth="1.2" />
      {Array.from({ length: 12 }, (_, index) => {
        const distance = index + 1
        const value = load / distance
        return <circle key={distance} cx={graphX(distance)} cy={graphY(value)} r={distance === d ? 5 : 2.6} fill={distance === d ? WARM : color} />
      })}
      <SvgText x="66" y="146" anchor="end" size={9} fill={MUTED}>力</SvgText>
      <SvgText x="344" y="214" anchor="end" size={9} fill={MUTED}>距離</SvgText>
      <SvgText x="250" y="150" size={10} fill={GOOD}>{`力×距離＝${load}`}</SvgText>
    </Stage>
  )
}

export const CHANGE_SCENES = Object.freeze({
  gears: GearsScene,
  'percent-grid': PercentGridScene,
  'speed-graph': SpeedGraphScene,
  spring: SpringScene,
  lever: LeverScene,
})
