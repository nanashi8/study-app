// 社会・理科の図解（名前で呼び出す図）。{ type: 'diagram', name: 'latitude', …その図の値 }。
// どの図も幅300の座標で描き、画面では約300pxに出る（文字の大きさ9〜11がそのまま画面の大きさになる）。
// 値から描く図（緯度の角度・時差など）は、テストが同じ値を計算して図と本文の数が合うことを確かめる。
import { GLOBE_LAND } from '../data/subjects/maps.js'
import { clockOf, localHour, shiftDate } from '../data/subjects/figureMath.js'
import { MAP_READING_DIAGRAMS } from './SubjectMapReadingDiagrams.jsx'
import { GEOGRAPHY_DIAGRAMS } from './SubjectGeographyDiagrams.jsx'
import { HISTORY_DIAGRAMS } from './SubjectHistoryDiagrams.jsx'
import { CIVICS_DIAGRAMS } from './SubjectCivicsDiagrams.jsx'
import { SCIENCE_DIAGRAMS } from './SubjectScienceDiagrams.jsx'
import { BIOLOGY_DIAGRAMS } from './SubjectBiologyDiagrams.jsx'
import { CHEMISTRY_DIAGRAMS } from './SubjectChemistryDiagrams.jsx'
import { PHYSICS_DIAGRAMS } from './SubjectPhysicsDiagrams.jsx'
import { EARTH_DIAGRAMS } from './SubjectEarthDiagrams.jsx'

const INK = '#1f2937'
const MUTED = '#64748b'
const RED = '#dc2626'
const BLUE = '#1d4ed8'
const GREEN = '#15803d'
const SEA = '#e0f2fe'

const rad = (degree) => (degree * Math.PI) / 180

function Label({ x, y, children, size = 10, weight = '700', color = INK, anchor = 'start', halo = true }) {
  const common = { x, y, fontSize: size, fontWeight: weight, textAnchor: anchor }
  return (
    <g>
      {halo && <text {...common} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">{children}</text>}
      <text {...common} fill={color}>{children}</text>
    </g>
  )
}

function ArrowLine({ x1, y1, x2, y2, color = INK, width = 1.6, head = 6, dashed = false }) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const a1 = angle + Math.PI * 0.84
  const a2 = angle - Math.PI * 0.84
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '4 3' : undefined} />
      <path d={`M${x2},${y2} L${x2 + head * Math.cos(a1)},${y2 + head * Math.sin(a1)} L${x2 + head * Math.cos(a2)},${y2 + head * Math.sin(a2)} Z`} fill={color} />
    </g>
  )
}

/** 中心 (cx, cy)・半径 r の、角度 a0 から a1（度、数学の向き＝左回り、右が0度）の弧。 */
function arcPath(cx, cy, r, a0, a1) {
  const x0 = cx + r * Math.cos(rad(a0))
  const y0 = cy - r * Math.sin(rad(a0))
  const x1 = cx + r * Math.cos(rad(a1))
  const y1 = cy - r * Math.sin(rad(a1))
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  const sweep = a1 > a0 ? 0 : 1
  return `M${x0},${y0} A${r},${r} 0 ${large} ${sweep} ${x1},${y1}`
}

// ── 緯度：地球を北極と南極を通る面で切った図。赤道の面から中心ではかった角度が緯度 ─────────────
function LatitudeDiagram({ lat = 35, place = '東京', label }) {
  const cx = 118
  const cy = 118
  const r = 88
  const px = cx + r * Math.cos(rad(lat))
  const py = cy - r * Math.sin(rad(lat))
  const parallels = [60, 30, -30, -60]
  return (
    <svg viewBox="0 0 300 240" className="h-auto w-full" role="img" aria-label="緯度のはかり方の図" data-subject-diagram="latitude">
      <circle cx={cx} cy={cy} r={r} fill={SEA} stroke={INK} strokeWidth="1.6" />
      {parallels.map((p) => {
        const y = cy - r * Math.sin(rad(p))
        const half = r * Math.cos(rad(p))
        return (
          <g key={p}>
            <line x1={cx - half} x2={cx + half} y1={y} y2={y} stroke={MUTED} strokeWidth="0.9" strokeDasharray="3 2" />
            <Label x={cx + half + 6} y={y + 3.5} size={9} color={MUTED}>{`${p > 0 ? '北緯' : '南緯'}${Math.abs(p)}度`}</Label>
          </g>
        )
      })}
      <line x1={cx - r} x2={cx + r} y1={cy} y2={cy} stroke={RED} strokeWidth="1.8" />
      <Label x={cx + r + 6} y={cy + 3.5} size={10} weight="800" color={RED}>赤道（緯度0度）</Label>
      <line x1={cx} x2={cx} y1={cy - r - 8} y2={cy + r + 8} stroke={MUTED} strokeWidth="0.9" />
      <circle cx={cx} cy={cy - r} r="3" fill={INK} />
      <Label x={cx + 6} y={cy - r - 4} size={10} weight="800">北極（北緯90度）</Label>
      <circle cx={cx} cy={cy + r} r="3" fill={INK} />
      <Label x={cx + 6} y={cy + r + 12} size={10} weight="800">南極（南緯90度）</Label>
      <line x1={cx} y1={cy} x2={px} y2={py} stroke={BLUE} strokeWidth="1.8" />
      <path d={arcPath(cx, cy, 30, 0, lat)} fill="none" stroke={BLUE} strokeWidth="1.8" />
      <Label x={cx + 34} y={cy - 8} size={10} weight="800" color={BLUE}>{`${lat}度`}</Label>
      <circle cx={cx} cy={cy} r="2.8" fill={INK} />
      <Label x={cx - 5} y={cy + 13} size={9} anchor="end" color={MUTED}>地球の中心</Label>
      <circle cx={px} cy={py} r="4" fill={BLUE} stroke="#ffffff" strokeWidth="1.2" />
      <Label x={px + 6} y={py - 5} size={10} weight="800" color={BLUE}>{label ?? `${place}（北緯${lat}度）`}</Label>
    </svg>
  )
}

// ── 経度：北極の真上から見た図。本初子午線から東・西にはかった角度が経度 ─────────────
function LongitudeDiagram({ lon = 135, place = '明石市' }) {
  const cx = 150
  const cy = 122
  const r = 92
  // 北極の真上から見ると、東へ進む向きは左回り。本初子午線（0度）を下に置く。
  const screenAngle = (longitude) => -90 + longitude
  const pointAt = (longitude, radius = r) => [
    cx + radius * Math.cos(rad(screenAngle(longitude))),
    cy - radius * Math.sin(rad(screenAngle(longitude))),
  ]
  const meridians = [0, 30, 60, 90, 120, 150, 180, -150, -120, -90, -60, -30]
  const [px, py] = pointAt(lon)
  const labelOf = (m) => (m === 0 ? '0度' : m === 180 ? '180度' : `${m > 0 ? '東経' : '西経'}${Math.abs(m)}度`)
  return (
    <svg viewBox="0 0 300 250" className="h-auto w-full" role="img" aria-label="経度のはかり方の図" data-subject-diagram="longitude">
      <circle cx={cx} cy={cy} r={r} fill={SEA} stroke={INK} strokeWidth="1.6" />
      {meridians.map((m) => {
        const [x, y] = pointAt(m)
        const [lx, ly] = pointAt(m, r + 14)
        const strong = m === 0 || m === 180
        return (
          <g key={m}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={m === 0 ? RED : MUTED} strokeWidth={strong ? 1.6 : 0.8} strokeDasharray={strong ? undefined : '3 2'} />
            {(m % 90 === 0 || m === 180) && (
              <Label x={lx} y={ly + 3.5} size={9} weight="800" anchor="middle" color={m === 0 ? RED : INK}>{labelOf(m)}</Label>
            )}
          </g>
        )
      })}
      <path d={arcPath(cx, cy, 34, screenAngle(0), screenAngle(lon))} fill="none" stroke={BLUE} strokeWidth="2" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke={BLUE} strokeWidth="2" />
      <circle cx={px} cy={py} r="4.2" fill={BLUE} stroke="#ffffff" strokeWidth="1.2" />
      <Label x={px - 8} y={py - 12} size={10} weight="800" color={BLUE} anchor="end">{place}</Label>
      <Label x={px - 8} y={py - 1} size={9.5} weight="800" color={BLUE} anchor="end">{`（東経${lon}度）`}</Label>
      <Label x={cx + 8} y={cy + 30} size={10} weight="800" color={BLUE}>{`${lon}度`}</Label>
      <circle cx={cx} cy={cy} r="3" fill={INK} />
      <Label x={cx + 5} y={cy - 5} size={9} weight="800">北極</Label>
      <Label x={cx} y={cy + r + 30} size={9.5} weight="800" color={RED} anchor="middle">本初子午線（ロンドンを通る）</Label>
      <Label x={cx + r - 4} y={cy + r - 18} size={9} color={GREEN} anchor="start">東へ →</Label>
      <Label x={cx - r + 4} y={cy + r - 18} size={9} color={GREEN} anchor="end">← 西へ</Label>
    </svg>
  )
}

// ── 地球儀：緯線と経線（30度ごと） ─────────────────────────────────
function GlobeDiagram({ tilt = 25, center = 135 }) {
  const cx = 150
  const cy = 125
  const r = 98
  const view = { lat: rad(tilt), lon: rad(center) }
  const project = (lat, lon) => {
    const phi = rad(lat)
    const lambda = rad(lon)
    const cosc = Math.sin(view.lat) * Math.sin(phi) + Math.cos(view.lat) * Math.cos(phi) * Math.cos(lambda - view.lon)
    const x = r * Math.cos(phi) * Math.sin(lambda - view.lon)
    const y = r * (Math.cos(view.lat) * Math.sin(phi) - Math.sin(view.lat) * Math.cos(phi) * Math.cos(lambda - view.lon))
    return { x: cx + x, y: cy - y, visible: cosc >= 0 }
  }
  const polyline = (points) => {
    let d = ''
    let drawing = false
    for (const point of points) {
      if (!point.visible) { drawing = false; continue }
      d += `${drawing ? 'L' : 'M'}${point.x.toFixed(1)},${point.y.toFixed(1)} `
      drawing = true
    }
    return d
  }
  const parallels = [-60, -30, 0, 30, 60]
  const meridians = Array.from({ length: 12 }, (_, i) => i * 30)
  const parallelPath = (lat) => polyline(Array.from({ length: 181 }, (_, i) => project(lat, i * 2)))
  const meridianPath = (lon) => polyline(Array.from({ length: 91 }, (_, i) => project(-90 + i * 2, lon)))
  // 陸：見えない側の点は円の縁へ寄せて描く（縁の外側へ回り込む形を、縁の細い帯にする）。
  const landPath = (ring) => ring.map(([lon, lat], i) => {
    const p = project(lat, lon)
    let { x, y } = p
    if (!p.visible) {
      const dx = x - cx
      const dy = y - cy
      const len = Math.hypot(dx, dy) || 1
      x = cx + (dx / len) * r
      y = cy + (dy / len) * r
    }
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ') + ' Z'
  const japan = project(36, 139)
  const northPole = project(90, 0)
  const equatorLabel = project(0, center + 55)
  const primeLabel = project(35, 0)
  const labelFor = (lat) => project(lat, center - 62)
  return (
    <svg viewBox="0 0 300 255" className="h-auto w-full" role="img" aria-label="緯線と経線をかいた地球儀の図" data-subject-diagram="globe">
      <defs>
        <clipPath id="globe-clip"><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={SEA} stroke={INK} strokeWidth="1.6" />
      <g clipPath="url(#globe-clip)">
        {GLOBE_LAND.map((ring, index) => <path key={index} d={landPath(ring)} fill="#d6e7c7" stroke="#9ca38f" strokeWidth="0.4" />)}
      </g>
      {meridians.map((lon) => (
        <path key={`m${lon}`} d={meridianPath(lon)} fill="none" stroke={lon === 0 ? RED : '#94a3b8'} strokeWidth={lon === 0 ? 1.8 : 0.9} />
      ))}
      {parallels.map((lat) => (
        <path key={`p${lat}`} d={parallelPath(lat)} fill="none" stroke={lat === 0 ? RED : '#94a3b8'} strokeWidth={lat === 0 ? 1.8 : 0.9} />
      ))}
      {japan.visible && <circle cx={japan.x} cy={japan.y} r="3.6" fill={RED} stroke="#ffffff" strokeWidth="1.2" />}
      {japan.visible && <Label x={japan.x + 6} y={japan.y + 4} size={10} weight="800" color="#b91c1c">日本</Label>}
      {northPole.visible && <circle cx={northPole.x} cy={northPole.y} r="3" fill={INK} />}
      {northPole.visible && <Label x={northPole.x + 5} y={northPole.y - 4} size={9.5} weight="800">北極</Label>}
      {equatorLabel.visible && <Label x={equatorLabel.x} y={equatorLabel.y - 4} size={10} weight="800" color={RED} anchor="middle">赤道</Label>}
      {primeLabel.visible && <Label x={primeLabel.x + 4} y={primeLabel.y} size={9.5} weight="800" color={RED}>本初子午線</Label>}
      {[60, 30, -30].map((lat) => {
        const at = labelFor(lat)
        return at.visible ? <Label key={lat} x={at.x} y={at.y - 3} size={9} color={MUTED} anchor="middle">{`${lat > 0 ? '北緯' : '南緯'}${Math.abs(lat)}度`}</Label> : null
      })}
      <Label x={cx + r + 4} y={cy - r + 20} size={9.5} weight="800" color={INK} anchor="end">緯線（横の線）</Label>
      <Label x={cx - r - 2} y={cy + r + 6} size={9.5} weight="800" color={INK}>経線（たての線）</Label>
    </svg>
  )
}

// ── 時差の数直線：経度15度ごとに1時間。東ほど時刻が進んでいる ─────────────
//   { name: 'timeZone', cities: [{ name: 'ロンドン', lon: 0 }], base: { lon: 135, hour: 10, date: '1月1日' }, from, to, showTimes }
//   showTimes: false … 都市の経度だけを出す（演習で、時刻を計算させるとき）
function TimeZoneDiagram({ cities = [], base = { lon: 135, hour: 10, date: '1月1日' }, from = -120, to = 180, showTimes = true }) {
  const left = 18
  const right = 282
  const y = 78
  const x = (lon) => left + ((lon - from) / (to - from)) * (right - left)
  const ticks = []
  for (let lon = Math.ceil(from / 15) * 15; lon <= to; lon += 15) ticks.push(lon)
  const clampX = (value, text, size) => {
    const half = (text.length * size) / 2
    return Math.max(half + 2, Math.min(300 - half - 2, value))
  }
  const lonText = (lon) => (lon === 0 ? '0度' : lon === 180 ? '180度' : `${lon > 0 ? '東経' : '西経'}${Math.abs(lon)}度`)
  return (
    <svg viewBox={`0 0 300 ${showTimes ? 165 : 142}`} className="h-auto w-full" role="img" aria-label="経度と時刻の数直線" data-subject-diagram="timeZone">
      {to >= 180 && (
        <g>
          <line x1={x(180)} x2={x(180)} y1={y - 16} y2={y + 26} stroke={RED} strokeWidth="1.4" strokeDasharray="4 3" />
          <Label x={x(180) - 2} y={y + 36} size={8.5} weight="800" color={RED} anchor="end">日付変更線</Label>
        </g>
      )}
      <line x1={left} x2={right} y1={y} y2={y} stroke={INK} strokeWidth="1.6" />
      {ticks.map((lon) => (
        <g key={lon}>
          <line x1={x(lon)} x2={x(lon)} y1={y - (lon % 45 === 0 ? 6 : 3.5)} y2={y + (lon % 45 === 0 ? 6 : 3.5)} stroke={INK} strokeWidth="1" />
          {lon % 45 === 0 && (
            <Label x={x(lon)} y={y + 18} size={8.5} anchor="middle" color={MUTED}>{lon === 0 ? '0度' : lon === 180 ? '180度' : `${lon > 0 ? '東' : '西'}${Math.abs(lon)}`}</Label>
          )}
        </g>
      ))}
      <ArrowLine x1={x(0) + 6} y1={y + 42} x2={x(45) - 4} y2={y + 42} color={GREEN} width={1.4} head={5} />
      <Label x={x(0) + 6} y={y + 56} size={8.5} color={GREEN}>東へ15度ごとに1時間進む</Label>
      {cities.map((city, index) => {
        const cxp = x(city.lon)
        const top = index % 2 === 0 ? 16 : 40
        const second = showTimes
          ? (() => {
              const { day: offset, text } = clockOf(localHour(base.hour, base.lon, city.lon))
              return `${shiftDate(base.date, offset)} ${text}`
            })()
          : `（${lonText(city.lon)}）`
        return (
          <g key={city.name}>
            <line x1={cxp} x2={cxp} y1={top + 14} y2={y} stroke={BLUE} strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={cxp} cy={y} r="3.6" fill={BLUE} stroke="#ffffff" strokeWidth="1" />
            <Label x={clampX(cxp, city.name, 9.5)} y={top} size={9.5} weight="800" anchor="middle" color={BLUE}>{city.name}</Label>
            <Label x={clampX(cxp, second, 8.5)} y={top + 11} size={8.5} weight="700" anchor="middle">{second}</Label>
          </g>
        )
      })}
      {showTimes && <Label x={left} y={y + 78} size={8.5} color={MUTED}>{`※ ${base.date}${base.hour}時の東経${base.lon}度（日本の標準時）を基準にした時刻`}</Label>}
    </svg>
  )
}

// ── 国の領域の断面図：領土・領海・領空・接続水域・排他的経済水域・公海（距離は実際の比ではない）─────────────
function TerritoryDiagram() {
  const sea = 118
  const coast = 62
  const marks = [
    { x: coast, label: '海岸線' },
    { x: 110, label: '12海里（約22km）' },
    { x: 150, label: '24海里' },
    { x: 262, label: '200海里（約370km）' },
  ]
  return (
    <svg viewBox="0 0 300 240" className="h-auto w-full" role="img" aria-label="国の領域と排他的経済水域の断面図" data-subject-diagram="territory">
      <rect x="4" y="30" width={110 - 4} height={sea - 30} fill="#fef3c7" opacity="0.8" />
      <Label x={40} y={52} size={10.5} weight="800" color="#92400e">領空</Label>
      <Label x={20} y={66} size={8.5} color="#92400e">（領土と領海の上空）</Label>
      <path d={`M4,${sea - 18} L40,${sea - 26} L${coast - 6},${sea - 20} L${coast},${sea} L${coast},${sea + 70} L4,${sea + 70} Z`} fill="#d6c7a1" stroke="#8b7355" strokeWidth="1" />
      <Label x={16} y={sea + 30} size={10.5} weight="800" color="#5b4636">領土</Label>
      <rect x={coast} y={sea} width={296 - coast} height="52" fill="#bfdbfe" />
      <path d={`M${coast},${sea + 52} L296,${sea + 62} L296,${sea + 70} L${coast},${sea + 70} Z`} fill="#cbd5e1" />
      <Label x={180} y={sea + 66} size={8.5} color="#475569" anchor="middle">海底（石油・天然ガスなどの鉱産資源）</Label>
      {marks.map((mark) => (
        <g key={mark.label}>
          <line x1={mark.x} x2={mark.x} y1={sea - 8} y2={sea + 52} stroke={INK} strokeWidth="1" strokeDasharray={mark.x === coast ? undefined : '3 2'} />
        </g>
      ))}
      <Label x={(coast + 110) / 2} y={sea + 24} size={9.5} weight="800" anchor="middle" color={BLUE}>領海</Label>
      <Label x={(110 + 150) / 2} y={sea + 14} size={8.5} weight="800" anchor="middle" color="#334155">接続</Label>
      <Label x={(110 + 150) / 2} y={sea + 24} size={8.5} weight="800" anchor="middle" color="#334155">水域</Label>
      <Label x={(150 + 262) / 2} y={sea + 20} size={9.5} weight="800" anchor="middle" color={GREEN}>排他的経済水域</Label>
      <Label x={(150 + 262) / 2} y={sea + 34} size={8.5} anchor="middle" color={GREEN}>（魚や海底の資源は沿岸国のもの）</Label>
      <Label x={281} y={sea + 24} size={9.5} weight="800" anchor="middle" color="#334155">公海</Label>
      <Label x={coast} y={sea - 12} size={8.5} anchor="middle" color={INK}>海岸線</Label>
      {marks.slice(1).map((mark, index) => (
        <g key={`d-${mark.label}`}>
          <line x1={coast} x2={mark.x} y1={sea + 82 + index * 15} y2={sea + 82 + index * 15} stroke={MUTED} strokeWidth="0.9" />
          <line x1={mark.x} x2={mark.x} y1={sea + 78 + index * 15} y2={sea + 86 + index * 15} stroke={MUTED} strokeWidth="0.9" />
          <Label x={mark.x + 3} y={sea + 85 + index * 15} size={8.5} color={INK} anchor={mark.x > 200 ? 'end' : 'start'}>{mark.label}</Label>
        </g>
      ))}
      <Label x={296} y={20} size={8.5} color={MUTED} anchor="end">※ 距離は実際の比ではない</Label>
    </svg>
  )
}

export const SUBJECT_DIAGRAMS = Object.freeze({
  latitude: LatitudeDiagram,
  longitude: LongitudeDiagram,
  globe: GlobeDiagram,
  timeZone: TimeZoneDiagram,
  territory: TerritoryDiagram,
  ...MAP_READING_DIAGRAMS,
  ...GEOGRAPHY_DIAGRAMS,
  ...HISTORY_DIAGRAMS,
  ...CIVICS_DIAGRAMS,
  ...SCIENCE_DIAGRAMS,
  ...BIOLOGY_DIAGRAMS,
  ...CHEMISTRY_DIAGRAMS,
  ...PHYSICS_DIAGRAMS,
  ...EARTH_DIAGRAMS,
})

export function DiagramFigure({ figure }) {
  const Diagram = SUBJECT_DIAGRAMS[figure.name]
  if (!Diagram) return null
  return <Diagram {...figure} />
}
