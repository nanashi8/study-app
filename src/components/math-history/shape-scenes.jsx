import {
  ceilTo,
  circumscribedPerimeterRatio,
  floorTo,
  inscribedPerimeterRatio,
  nice,
} from '../../data/math-history/controls.js'
import { SOLID_COUNTS } from '../../data/math-history/basic-shape.js'
import { BLUE, GOOD, GRID, INK, MUTED, PAPER, ROSE, Stage, SvgText, WARM, apart, num } from './stage.jsx'

// 第1部「算数の基本」の図形と測定の話の図。

const rad = (degrees) => (degrees * Math.PI) / 180
// 数学の向き（反時計回りが正・y が上）の角度で、中心 (cx, cy) から r の点を SVG の座標にする。
const polar = (cx, cy, r, degrees) => ({ x: cx + r * Math.cos(rad(degrees)), y: cy - r * Math.sin(rad(degrees)) })
const pointsText = (points) => points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')

/** 中心から r の円弧（数学の向きで from → to。反時計回り）。 */
function arcPath(cx, cy, r, from, to) {
  const start = polar(cx, cy, r, from)
  const end = polar(cx, cy, r, to)
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} A${r} ${r} 0 ${large} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

// ── 長さ・かさ・重さ：えんぴつを1cm・1mmの目盛りで読む（上は拡大図） ─────────
function RulerScene({ values, color, markerId, label }) {
  const L = num(values.length)
  const mm = values.scale === 'mm'
  const px = (cm) => 20 + cm * 16
  // 上の拡大図：読み取る所を中心に前後1cm（1cmが120）。
  const zoom = (cm) => 180 + (cm - L) * 120
  const zoomCm = [Math.ceil(L - 1 - 1e-9), Math.ceil(L - 1e-9), Math.ceil(L + 1e-9)].filter((cm, index, list) => (
    cm >= L - 1 - 1e-9 && cm <= L + 1 + 1e-9 && list.indexOf(cm) === index
  ))
  const zoomMm = mm
    ? Array.from({ length: 21 }, (_, index) => Math.round((Math.floor((L - 1) * 10) + index) * 10) / 100)
      .filter((cm) => cm >= L - 1 - 1e-9 && cm <= L + 1 + 1e-9)
    : []
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <rect x="54" y="8" width="252" height="58" rx="8" fill={PAPER} stroke={GRID} strokeWidth="1.5" />
      <rect x="60" y="22" width={zoom(L) - 60} height="12" rx="3" fill={color} data-ruler-pencil-zoom />
      {zoomMm.map((cm) => (
        <line key={`mm${cm}`} x1={zoom(cm)} y1="40" x2={zoom(cm)} y2="47" stroke={MUTED} strokeWidth="1" />
      ))}
      {zoomCm.map((cm) => (
        <g key={`cm${cm}`}>
          <line x1={zoom(cm)} y1="38" x2={zoom(cm)} y2="52" stroke={INK} strokeWidth="1.6" />
          <SvgText x={zoom(cm)} y="59" size={10}>{`${cm}cm`}</SvgText>
        </g>
      ))}
      <line x1="180" y1="16" x2="180" y2="54" stroke={WARM} strokeWidth="2" strokeDasharray="3 2" />
      <SvgText x="306" y="14" anchor="end" size={9} fill={MUTED}>拡大</SvgText>

      <rect x={px(0)} y="88" width={px(L) - px(0)} height="16" rx="3" fill={color} data-ruler-pencil />
      <path d={`M${px(L)} 88 L${px(L) + 12} 96 L${px(L)} 104 Z`} fill={WARM} />
      <rect x="16" y="112" width="328" height="44" rx="6" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      {mm && Array.from({ length: 200 }, (_, index) => (
        index % 10 ? <line key={`r${index}`} x1={px(index / 10)} y1="112" x2={px(index / 10)} y2="118" stroke={MUTED} strokeWidth="0.6" /> : null
      ))}
      {Array.from({ length: 21 }, (_, cm) => (
        <g key={cm}>
          <line x1={px(cm)} y1="112" x2={px(cm)} y2={cm % 5 ? 124 : 128} stroke={INK} strokeWidth="1.2" />
          {cm % 2 === 0 && <SvgText x={px(cm)} y="140" size={9}>{cm}</SvgText>}
        </g>
      ))}
      <line x1={px(L)} y1="84" x2={px(L)} y2="156" stroke={WARM} strokeWidth="1.6" strokeDasharray="3 2" />
      <SvgText x="180" y="180" size={13} weight={800} fill={color}>
        {mm
          ? `${Math.round(L * 10)}mm ＝ ${nice(L, 1)}cm`
          : `${Math.floor(L + 1e-9)}cmと${Math.floor(L + 1e-9) + 1}cmの間 → 約${Math.round(L)}cm`}
      </SvgText>
      <SvgText x="180" y="204" size={11} fill={MUTED}>{mm ? '1mmの目盛りなら、小数第1位まで読める' : '1cmの目盛りでは、四捨五入した概数で表す'}</SvgText>
    </Stage>
  )
}

// ── 時間と60進法：1時間（60分）を等分する・もし100分だったら ────────────────
function ClockFace({ cx, cy, whole, parts, color, title }) {
  const exact = whole % parts === 0
  return (
    <g data-clock-whole={whole} data-clock-exact={exact ? 'true' : 'false'}>
      <circle cx={cx} cy={cy} r="64" fill={PAPER} stroke={INK} strokeWidth="2" />
      {Array.from({ length: whole }, (_, index) => {
        const outer = polar(cx, cy, 64, 90 - (index * 360) / whole)
        const inner = polar(cx, cy, index % 5 ? 60 : 56, 90 - (index * 360) / whole)
        return <line key={index} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={MUTED} strokeWidth="0.8" />
      })}
      {Array.from({ length: parts }, (_, index) => {
        const end = polar(cx, cy, 64, 90 - (index * 360) / parts)
        return <line key={`p${index}`} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={exact ? color : WARM} strokeWidth="2" />
      })}
      <SvgText x={cx} y={cy - 78} size={12} weight={800}>{title}</SvgText>
      <SvgText x={cx} y={cy + 82} size={12} weight={800} fill={exact ? GOOD : WARM}>
        {exact ? `1つ分 ${whole / parts}分` : `1つ分 ${nice(whole / parts, 2)}…分`}
      </SvgText>
    </g>
  )
}

function Clock60Scene({ values, color, markerId, label }) {
  const k = num(values.k)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <ClockFace cx={90} cy={104} whole={60} parts={k} color={color} title="1時間＝60分" />
      <ClockFace cx={270} cy={104} whole={100} parts={k} color={color} title="もし100分なら" />
      <SvgText x="180" y="210" size={11} fill={MUTED}>{`${k}等分したときの1つ分`}</SvgText>
    </Stage>
  )
}

// ── 角の大きさ：頂点を通る平行線に、3つの角が集まる ─────────────────────
function TriangleAnglesScene({ values, color, markerId, label }) {
  const A = num(values.a)
  const B = num(values.b)
  const C = 180 - A - B
  // 底辺を 1 とした三角形（P が左下、Q が右下、R が頂点）。
  const side = Math.sin(rad(B)) / Math.sin(rad(C))
  const rx = side * Math.cos(rad(A))
  const ry = side * Math.sin(rad(A))
  const minX = Math.min(0, rx)
  const maxX = Math.max(1, rx)
  const scale = Math.min(220 / (maxX - minX), 128 / ry)
  const offsetX = 180 - ((minX + maxX) / 2) * scale
  const baseY = 184
  const P = { x: offsetX, y: baseY }
  const Q = { x: offsetX + scale, y: baseY }
  const R = { x: offsetX + rx * scale, y: baseY - ry * scale }
  const labelAt = (cx, cy, r, from, to) => polar(cx, cy, r, (from + to) / 2)
  const aLabel = labelAt(P.x, P.y, 34, 0, A)
  const bLabel = labelAt(Q.x, Q.y, 34, 180 - B, 180)
  const cLabel = labelAt(R.x, R.y, 34, 180 + A, 360 - B)
  const aTop = labelAt(R.x, R.y, 30, 180, 180 + A)
  const bTop = labelAt(R.x, R.y, 30, 360 - B, 360)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="16" y1={R.y} x2="344" y2={R.y} stroke={MUTED} strokeWidth="1.5" strokeDasharray="5 4" data-parallel-line />
      <SvgText x="340" y={R.y - 10} anchor="end" size={10} fill={MUTED}>頂点を通る平行線</SvgText>
      <polygon points={pointsText([P, Q, R])} fill={`${color}14`} stroke={INK} strokeWidth="2" />
      <path d={`${arcPath(P.x, P.y, 22, 0, A)}`} fill="none" stroke={color} strokeWidth="3" />
      <path d={`${arcPath(Q.x, Q.y, 22, 180 - B, 180)}`} fill="none" stroke={WARM} strokeWidth="3" />
      <path d={`${arcPath(R.x, R.y, 22, 180 + A, 360 - B)}`} fill="none" stroke={apart(color, GOOD, BLUE)} strokeWidth="3" />
      <path d={`${arcPath(R.x, R.y, 18, 180, 180 + A)}`} fill="none" stroke={color} strokeWidth="3" />
      <path d={`${arcPath(R.x, R.y, 18, 360 - B, 360)}`} fill="none" stroke={WARM} strokeWidth="3" />
      <SvgText x={aLabel.x + 6} y={aLabel.y} size={12} fill={color}>{`${A}°`}</SvgText>
      <SvgText x={bLabel.x - 6} y={bLabel.y} size={12} fill={WARM}>{`${B}°`}</SvgText>
      <SvgText x={cLabel.x} y={cLabel.y + 4} size={12} fill={apart(color, GOOD, BLUE)}>{`${C}°`}</SvgText>
      <SvgText x={aTop.x - 8} y={aTop.y - 8} size={11} fill={color}>{`${A}°`}</SvgText>
      <SvgText x={bTop.x + 8} y={bTop.y - 8} size={11} fill={WARM}>{`${B}°`}</SvgText>
      <SvgText x="180" y="208" size={12} weight={800}>{`${A}° ＋ ${B}° ＋ ${C}° ＝ 180°`}</SvgText>
    </Stage>
  )
}

// ── 作図と対称：2つの円から正三角形と垂直二等分線 ──────────────────────
function ConstructionScene({ values, color, markerId, label }) {
  const step = num(values.step)
  const A = { x: 130, y: 116 }
  const B = { x: 230, y: 116 }
  const r = 100
  const C = { x: 180, y: 116 - r * Math.sqrt(3) / 2 }
  const D = { x: 180, y: 116 + r * Math.sqrt(3) / 2 }
  const dot = (point, name, tone, dx = 0, dy = -12) => (
    <g>
      <circle cx={point.x} cy={point.y} r="4.5" fill={tone} />
      <SvgText x={point.x + dx} y={point.y + dy} size={13} weight={800} fill={tone}>{name}</SvgText>
    </g>
  )
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {step >= 1 && <circle cx={A.x} cy={A.y} r={r} fill="none" stroke={color} strokeWidth="1.6" data-construction-circle="A" />}
      {step >= 2 && <circle cx={B.x} cy={B.y} r={r} fill="none" stroke={WARM} strokeWidth="1.6" data-construction-circle="B" />}
      {step >= 4 && <polygon points={pointsText([A, B, C])} fill={`${apart(color, GOOD, BLUE)}22`} stroke={apart(color, GOOD, BLUE)} strokeWidth="2.5" data-construction-triangle />}
      {step >= 5 && (
        <g data-construction-bisector>
          <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke={INK} strokeWidth="2" />
          <path d={`M${180 - 8} 116 V${116 - 8} H180`} fill="none" stroke={INK} strokeWidth="1.5" />
          <SvgText x="192" y="128" size={11}>M</SvgText>
        </g>
      )}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={INK} strokeWidth="3" />
      {dot(A, 'A', INK, -12, 12)}
      {dot(B, 'B', INK, 12, 12)}
      {step >= 3 && dot(C, 'C', apart(color, GOOD, BLUE), 12, 0)}
      {step >= 3 && dot(D, 'D', apart(color, GOOD, BLUE), 12, 0)}
    </Stage>
  )
}

// ── 面積：上の辺をずらしても面積は同じ ────────────────────────────
function AreaShearScene({ values, color, markerId, label }) {
  const shape = values.shape
  const s = num(values.slant)
  const unit = 24
  const baseY = 176
  const topY = baseY - 4 * unit
  const x0 = shape === 'trapezoid' ? 24 : 60
  const shift = s * unit
  const bottom = 6 * unit
  const labels = (
    <>
      <SvgText x={x0 + bottom / 2} y={baseY + 16} size={11}>底辺 6</SvgText>
      <line x1={x0 - 10} y1={topY} x2={x0 - 10} y2={baseY} stroke={MUTED} strokeWidth="1.2" />
      <SvgText x={x0 - 14} y={(topY + baseY) / 2} anchor="end" size={11} fill={MUTED}>高さ4</SvgText>
    </>
  )
  if (shape === 'triangle') {
    const apex = { x: x0 + shift, y: topY }
    const P = { x: x0, y: baseY }
    const Q = { x: x0 + bottom, y: baseY }
    const copy = [Q, apex, { x: apex.x + bottom, y: topY }]
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <polygon points={pointsText(copy)} fill={`${WARM}18`} stroke={WARM} strokeWidth="1.6" strokeDasharray="5 3" data-area-copy />
        <polygon points={pointsText([P, Q, apex])} fill={`${color}33`} stroke={color} strokeWidth="2.2" data-area-shape="triangle" />
        {labels}
        <SvgText x="250" y="30" size={11} fill={WARM}>同じ三角形を逆さにつなぐ</SvgText>
        <SvgText x="180" y="208" size={12} weight={800}>{'6 × 4 ÷ 2 ＝ 12（平行四辺形の半分）'}</SvgText>
      </Stage>
    )
  }
  if (shape === 'trapezoid') {
    const top = 3 * unit
    const P = { x: x0, y: baseY }
    const Q = { x: x0 + bottom, y: baseY }
    const T1 = { x: x0 + shift, y: topY }
    const T2 = { x: x0 + shift + top, y: topY }
    const copy = [Q, T2, { x: T2.x + bottom, y: topY }, { x: Q.x + top, y: baseY }]
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <polygon points={pointsText(copy)} fill={`${WARM}18`} stroke={WARM} strokeWidth="1.6" strokeDasharray="5 3" data-area-copy />
        <polygon points={pointsText([P, Q, T2, T1])} fill={`${color}33`} stroke={color} strokeWidth="2.2" data-area-shape="trapezoid" />
        {labels}
        <SvgText x={T1.x + top / 2} y={topY - 10} size={11}>上底 3</SvgText>
        <SvgText x="180" y="208" size={12} weight={800}>{'(3 ＋ 6) × 4 ÷ 2 ＝ 18'}</SvgText>
      </Stage>
    )
  }
  const P = { x: x0, y: baseY }
  const Q = { x: x0 + bottom, y: baseY }
  const T1 = { x: x0 + shift, y: topY }
  const T2 = { x: x0 + shift + bottom, y: topY }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <polygon points={pointsText([P, Q, T2, T1])} fill={`${color}33`} stroke={color} strokeWidth="2.2" data-area-shape="parallelogram" />
      {s > 0 && (
        <g data-area-move>
          <polygon points={pointsText([P, T1, { x: T1.x, y: baseY }])} fill={`${WARM}40`} stroke={WARM} strokeWidth="1.6" />
          <polygon points={pointsText([Q, T2, { x: T2.x, y: baseY }])} fill="none" stroke={WARM} strokeWidth="1.6" strokeDasharray="5 3" />
          <line x1={x0 + shift / 2 + 6} y1={baseY - 24} x2={x0 + bottom + shift / 2 - 6} y2={baseY - 24} stroke={WARM} strokeWidth="1.6" markerEnd={`url(#${markerId}-warm)`} />
        </g>
      )}
      {labels}
      <SvgText x="180" y="208" size={12} weight={800}>{s ? '三角形を動かすと長方形：6 × 4 ＝ 24' : '長方形：6 × 4 ＝ 24'}</SvgText>
    </Stage>
  )
}

// ── 円周率：内側と外側の正多角形ではさみうち ───────────────────────
function NumberLine({ y, from, to, lower, upper, tone }) {
  const x = (value) => 210 + ((value - from) / (to - from)) * 136
  const clampX = (value) => Math.max(210, Math.min(346, x(value)))
  return (
    <g>
      <line x1="210" y1={y} x2="346" y2={y} stroke={INK} strokeWidth="1.4" />
      <rect x={clampX(lower)} y={y - 6} width={Math.max(1.5, clampX(upper) - clampX(lower))} height="12" fill={`${tone}55`} stroke={tone} strokeWidth="1" />
      <line x1={x(Math.PI)} y1={y - 10} x2={x(Math.PI)} y2={y + 10} stroke={ROSE} strokeWidth="2" />
      <SvgText x="210" y={y + 18} anchor="start" size={9} fill={MUTED}>{String(from)}</SvgText>
      <SvgText x="346" y={y + 18} anchor="end" size={9} fill={MUTED}>{String(to)}</SvgText>
    </g>
  )
}

function ArchimedesScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const cx = 100
  const cy = 112
  const r = 84
  const inner = Array.from({ length: n }, (_, index) => polar(cx, cy, r, 90 + (index * 360) / n))
  const outer = Array.from({ length: n }, (_, index) => polar(cx, cy, r / Math.cos(Math.PI / n), 90 + 180 / n + (index * 360) / n))
  const lower = floorTo(inscribedPerimeterRatio(n), 4)
  const upper = ceilTo(circumscribedPerimeterRatio(n), 4)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <polygon points={pointsText(outer)} fill="none" stroke={WARM} strokeWidth="1.6" data-polygon="outer" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ROSE} strokeWidth="1.4" />
      <polygon points={pointsText(inner)} fill={`${color}14`} stroke={color} strokeWidth="1.6" data-polygon="inner" />
      <SvgText x="278" y="22" size={13} weight={800}>{`正${n}角形`}</SvgText>
      <SvgText x="278" y="48" size={11} fill={color}>{`内側の周り ÷ 直径 ＝ ${lower}`}</SvgText>
      <SvgText x="278" y="68" size={11} fill={WARM}>{`外側の周り ÷ 直径 ＝ ${upper}`}</SvgText>
      <NumberLine y={104} from={3} to={3.5} lower={Number(lower)} upper={Number(upper)} tone={color} />
      <NumberLine y={156} from={3.13} to={3.17} lower={Number(lower)} upper={Number(upper)} tone={color} />
      <SvgText x="278" y="200" size={10} fill={ROSE}>赤い線がπ（3.14159…）</SvgText>
    </Stage>
  )
}

// ── 円の面積：おうぎ形を並べかえると長方形に近づく ─────────────────────
function sectorPoints(apex, radius, center, spread, steps = 6) {
  const points = [apex]
  for (let index = 0; index <= steps; index += 1) {
    const angle = center - spread / 2 + (spread * index) / steps
    points.push({ x: apex.x + radius * Math.cos(angle), y: apex.y - radius * Math.sin(angle) })
  }
  return points
}

function CircleRearrangeScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const r = 48
  const theta = (2 * Math.PI) / n
  const tones = [color, WARM]
  const circleCenter = { x: 62, y: 108 }
  const x0 = 132
  const top = 84
  const arc = r * theta
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {Array.from({ length: n }, (_, index) => (
        <polygon
          key={`c${index}`}
          points={pointsText(sectorPoints(circleCenter, r, Math.PI / 2 + theta / 2 + index * theta, theta))}
          fill={tones[index % 2]}
          stroke={PAPER}
          strokeWidth="0.6"
        />
      ))}
      {Array.from({ length: n }, (_, index) => {
        const down = index % 2 === 0
        const apex = down
          ? { x: x0 + (index / 2) * arc + arc / 2, y: top }
          : { x: x0 + ((index + 1) / 2) * arc, y: top + r * Math.cos(theta / 2) }
        return (
          <polygon
            key={`r${index}`}
            points={pointsText(sectorPoints(apex, r, down ? -Math.PI / 2 : Math.PI / 2, theta))}
            fill={tones[index % 2]}
            stroke={PAPER}
            strokeWidth="0.6"
            data-rearranged-sector={index}
          />
        )
      })}
      <SvgText x={x0 + (Math.PI * r) / 2} y="66" size={11}>横 ≈ 円周の半分（πr）</SvgText>
      <SvgText x={x0 + Math.PI * r + arc / 2 + 12} y={top + r / 2} anchor="start" size={11}>たて ≈ r</SvgText>
      <SvgText x="62" y="176" size={11} fill={MUTED}>{`${n}個に切る`}</SvgText>
      <SvgText x="200" y="200" size={12} weight={800}>{'面積 ≈ πr × r ＝ πr²'}</SvgText>
    </Stage>
  )
}

// ── 体積：まっすぐ積んでも、ずらして積んでも同じ ────────────────────────
function CoinStack({ x, h, shift, color }) {
  return Array.from({ length: h }, (_, index) => {
    const cx = x + index * shift * 4
    const cy = 176 - index * 14
    return (
      <g key={index}>
        <rect x={cx - 34} y={cy - 9} width="68" height="9" fill={color} />
        <ellipse cx={cx} cy={cy} rx="34" ry="8" fill={color} />
        <ellipse cx={cx} cy={cy - 9} rx="34" ry="8" fill={PAPER} stroke={color} strokeWidth="1.6" />
      </g>
    )
  })
}

function CavalieriScene({ values, color, markerId, label }) {
  const h = num(values.h)
  const shift = num(values.shift)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <CoinStack x={90} h={h} shift={0} color={color} />
      <CoinStack x={216} h={h} shift={shift} color={WARM} />
      <line x1="20" y1={176 - (h - 1) * 14 - 9 - 16} x2="340" y2={176 - (h - 1) * 14 - 9 - 16} stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <SvgText x="90" y="202" size={11}>まっすぐ積む</SvgText>
      <SvgText x="250" y="202" size={11} fill={WARM}>ずらして積む</SvgText>
      <SvgText x="180" y="16" size={12} weight={800}>{`どちらもコイン${h}枚分`}</SvgText>
    </Stage>
  )
}

// ── 立体の形：頂点・辺・面を数える ─────────────────────────────
const PHI = (1 + Math.sqrt(5)) / 2
const SOLID_VERTICES = {
  tetra: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
  cube: [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z]))),
  octa: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  dodeca: [
    ...[-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z]))),
    ...[-1, 1].flatMap((a) => [-1, 1].flatMap((b) => [
      [0, a / PHI, b * PHI], [a / PHI, b * PHI, 0], [a * PHI, 0, b / PHI],
    ])),
  ],
  icosa: [-1, 1].flatMap((a) => [-1, 1].flatMap((b) => [[0, a, b * PHI], [a, b * PHI, 0], [a * PHI, 0, b]])),
  prism: [0, 1, 2].flatMap((index) => [-1, 1].map((z) => [Math.cos((index * 2 * Math.PI) / 3), Math.sin((index * 2 * Math.PI) / 3), z])),
  pyramid: [[1, 1, -0.8], [1, -1, -0.8], [-1, -1, -0.8], [-1, 1, -0.8], [0, 0, 1.2]],
}

function solidEdges(key, vertices) {
  if (key === 'prism') {
    return [[0, 2], [2, 4], [4, 0], [1, 3], [3, 5], [5, 1], [0, 1], [2, 3], [4, 5]]
  }
  if (key === 'pyramid') return [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]]
  const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]))
  let shortest = Infinity
  vertices.forEach((a, i) => vertices.forEach((b, j) => { if (i < j) shortest = Math.min(shortest, distance(a, b)) }))
  const edges = []
  vertices.forEach((a, i) => vertices.forEach((b, j) => {
    if (i < j && Math.abs(distance(a, b) - shortest) < 1e-6) edges.push([i, j])
  }))
  return edges
}

function PolyhedraScene({ values, color, markerId, label }) {
  const key = values.solid
  const vertices = SOLID_VERTICES[key]
  const edges = solidEdges(key, vertices)
  const counts = SOLID_COUNTS[key]
  // y 軸まわりに 35°、x 軸まわりに 22° 回して、正面から見る。
  const ay = rad(35)
  const ax = rad(22)
  const rotated = vertices.map(([x, y, z]) => {
    const x1 = x * Math.cos(ay) + z * Math.sin(ay)
    const z1 = -x * Math.sin(ay) + z * Math.cos(ay)
    const y1 = y * Math.cos(ax) - z1 * Math.sin(ax)
    const z2 = y * Math.sin(ax) + z1 * Math.cos(ax)
    return { x: x1, y: y1, z: z2 }
  })
  const extent = Math.max(...rotated.map((point) => Math.max(Math.abs(point.x), Math.abs(point.y))))
  const scale = 82 / extent
  const screen = rotated.map((point) => ({ x: 118 + point.x * scale, y: 110 - point.y * scale, z: point.z }))
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {edges.map(([i, j]) => {
        const back = screen[i].z + screen[j].z < -0.4
        return (
          <line
            key={`${i}-${j}`}
            x1={screen[i].x}
            y1={screen[i].y}
            x2={screen[j].x}
            y2={screen[j].y}
            stroke={back ? MUTED : color}
            strokeWidth={back ? 1.2 : 2.4}
            strokeDasharray={back ? '4 3' : undefined}
          />
        )
      })}
      {screen.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.4" fill={INK} />)}
      <SvgText x="282" y="34" size={14} weight={800}>{counts.name}</SvgText>
      <SvgText x="282" y="66" size={13} fill={INK}>{`頂点 ${counts.v}`}</SvgText>
      <SvgText x="282" y="90" size={13} fill={color}>{`辺 ${counts.e}`}</SvgText>
      <SvgText x="282" y="114" size={13} fill={WARM}>{`面 ${counts.f}`}</SvgText>
      <SvgText x="282" y="150" size={13} weight={800} fill={apart(color, GOOD, BLUE)}>{`${counts.v} − ${counts.e} ＋ ${counts.f} ＝ 2`}</SvgText>
      <SvgText x="118" y="208" size={10} fill={MUTED}>点線は向こう側の辺</SvgText>
    </Stage>
  )
}

// ── 位置の表し方：横・縦・高さの数の組 ───────────────────────────
function GridPositionScene({ values, color, markerId, label }) {
  const x = num(values.x)
  const y = num(values.y)
  const h = num(values.h)
  const origin = { x: 36, y: 196 }
  const at = (gx, gy, gh = 0) => ({ x: origin.x + gx * 28 + gy * 14, y: origin.y - gy * 13 - gh * 24 })
  const base = at(x, y)
  const top = at(x, y, h)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {Array.from({ length: 9 }, (_, gx) => {
        const from = at(gx, 0)
        const to = at(gx, 6)
        return <line key={`x${gx}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={MUTED} strokeOpacity="0.35" strokeWidth="1.2" />
      })}
      {Array.from({ length: 7 }, (_, gy) => {
        const from = at(0, gy)
        const to = at(8, gy)
        return <line key={`y${gy}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={MUTED} strokeOpacity="0.35" strokeWidth="1.2" />
      })}
      <line x1={origin.x} y1={origin.y} x2={at(8.6, 0).x} y2={origin.y} stroke={INK} strokeWidth="1.8" markerEnd={`url(#${markerId}-muted)`} />
      <line x1={origin.x} y1={origin.y} x2={at(0, 6.6).x} y2={at(0, 6.6).y} stroke={INK} strokeWidth="1.8" markerEnd={`url(#${markerId}-muted)`} />
      <SvgText x={at(8.6, 0).x - 4} y={origin.y + 12} size={10} fill={MUTED}>横</SvgText>
      <SvgText x={at(0, 6.6).x - 10} y={at(0, 6.6).y} size={10} fill={MUTED}>縦</SvgText>
      <polyline points={pointsText([origin, at(x, 0), base])} fill="none" stroke={WARM} strokeWidth="2" strokeDasharray="4 3" />
      <circle cx={base.x} cy={base.y} r="5.5" fill={h ? MUTED : color} />
      {h > 0 && (
        <g data-position-height={h}>
          <line x1={base.x} y1={base.y} x2={top.x} y2={top.y} stroke={color} strokeWidth="2.5" />
          <circle cx={top.x} cy={top.y} r="7" fill={color} />
        </g>
      )}
      <SvgText x={top.x} y={top.y - 14} size={12} weight={800} fill={color}>{h ? `(${x}, ${y}, ${h})` : `(${x}, ${y})`}</SvgText>
    </Stage>
  )
}

export const SHAPE_SCENES = Object.freeze({
  ruler: RulerScene,
  clock60: Clock60Scene,
  'triangle-angles': TriangleAnglesScene,
  construction: ConstructionScene,
  'area-shear': AreaShearScene,
  archimedes: ArchimedesScene,
  'circle-rearrange': CircleRearrangeScene,
  cavalieri: CavalieriScene,
  polyhedra: PolyhedraScene,
  'grid-position': GridPositionScene,
})
