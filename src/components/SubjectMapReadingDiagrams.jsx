// 地形図を読むための図解（縮尺・等高線と断面図・地図記号）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。

const INK = '#1f2937'
const MUTED = '#64748b'
const BROWN = '#92400e'
const RIVER = '#2563eb'

function Label({ x, y, children, size = 10, weight = '700', color = INK, anchor = 'start' }) {
  const common = { x, y, fontSize: size, fontWeight: weight, textAnchor: anchor }
  return (
    <g>
      <text {...common} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">{children}</text>
      <text {...common} fill={color}>{children}</text>
    </g>
  )
}

// ── 縮尺 ─────────────────────────────────────────────────────────────
//   { name: 'mapScale', scales?: [25000, 50000] }
// 地図上の1〜4cmが、縮尺ごとに実際の何mにあたるかを、目もりで並べる。

/** 実際の距離（cm）を、m か km の文字にする。 */
export const distanceText = (cm) => {
  const m = cm / 100
  return m < 1000 ? `${m}m` : `${m / 1000}km`
}

/** 2万5千分の1 のような縮尺の読み方。 */
export const scaleText = (denominator) => (denominator % 10000 === 0 ? `${denominator / 10000}万分の1` : `${Math.floor(denominator / 10000)}万${(denominator % 10000) / 1000}千分の1`)

function MapScaleDiagram({ scales = [25000, 50000] }) {
  const left = 78
  const unit = 50
  const rowGap = 58
  const top = 34
  const height = top + scales.length * rowGap + 58
  return (
    <svg viewBox={`0 0 300 ${height}`} className="h-auto w-full" role="img" aria-label="縮尺と実際の距離" data-subject-diagram="mapScale">
      <Label x={left + 2 * unit} y={14} size={9.5} weight="800" anchor="middle" color={MUTED}>地図上の長さ</Label>
      {[0, 1, 2, 3, 4].map((cm) => (
        <Label key={`cm-${cm}`} x={left + cm * unit} y={27} size={9} anchor="middle" color={MUTED}>{`${cm}cm`}</Label>
      ))}
      {scales.map((denominator, row) => {
        const y = top + row * rowGap + 8
        return (
          <g key={denominator}>
            <Label x={4} y={y + 8} size={10} weight="800">{scaleText(denominator)}</Label>
            {[0, 1, 2, 3].map((cm) => (
              <rect key={cm} x={left + cm * unit} y={y} width={unit} height="9" fill={cm % 2 === 0 ? INK : '#ffffff'} stroke={INK} strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4].map((cm) => (
              <g key={`t-${cm}`}>
                <line x1={left + cm * unit} x2={left + cm * unit} y1={y - 3} y2={y + 12} stroke={INK} strokeWidth="1" />
                <Label x={left + cm * unit} y={y + 25} size={9} anchor="middle" weight={cm === 1 ? '800' : '700'} color={cm === 1 ? '#b91c1c' : INK}>{cm === 0 ? '0' : distanceText(cm * denominator)}</Label>
              </g>
            ))}
          </g>
        )
      })}
      <rect x="4" y={height - 50} width="292" height="46" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
      <Label x={150} y={height - 32} size={10} weight="800" anchor="middle">実際の距離 ＝ 地図上の長さ × 縮尺の分母</Label>
      <Label x={150} y={height - 14} size={9.5} anchor="middle" color={MUTED}>{`例：4cm × ${scales[0]} ＝ ${4 * scales[0]}cm ＝ ${distanceText(4 * scales[0])}`}</Label>
    </svg>
  )
}

// ── 等高線と断面図 ─────────────────────────────────────────────────────
//   { name: 'contour', labels?: true, profile?: true, marks?: [{ at: 'ridge' | 'valley' | 'steep' | 'gentle' | 'summit', label: 'X' }] }
// 1つの山の標高を式で決め、10mごとの等高線（50mごとは太い計曲線）と、A－Bの断面図を描く。
// 山頂の東は傾斜が急、西はゆるやか。南西へのびる尾根と、北へ下る谷（川が流れる）がある。

const MAP_W = 300
const MAP_H = 196
const SUMMIT = Object.freeze({ x: 168, y: 84, h: 170 })
const RIDGE = Object.freeze([[150, 100], [58, 176]])
const VALLEY = Object.freeze([[174, 60], [204, -8]])
const PROFILE_Y = SUMMIT.y

/** 点 (x, y) から線分 [p, q] への距離と、線分の上の位置 t（0〜1）。 */
function toSegment(x, y, [[px, py], [qx, qy]]) {
  const dx = qx - px
  const dy = qy - py
  const t = Math.max(0, Math.min(1, ((x - px) * dx + (y - py) * dy) / (dx * dx + dy * dy)))
  return { d: Math.hypot(x - (px + dx * t), y - (py + dy * t)), t }
}

/** 地点の標高（m）。 */
export function contourHeight(x, y) {
  const dx = x - SUMMIT.x
  const dy = y - SUMMIT.y
  const sx = dx < 0 ? 64 : 30
  const sy = 44
  let h = SUMMIT.h * Math.exp(-((dx * dx) / (2 * sx * sx) + (dy * dy) / (2 * sy * sy)))
  const ridge = toSegment(x, y, RIDGE)
  h += 46 * Math.exp(-(ridge.d * ridge.d) / (2 * 13 * 13)) * Math.sin(Math.PI * Math.min(1, ridge.t * 1.15)) ** 0.8 * (1 - ridge.t * 0.55)
  const valley = toSegment(x, y, VALLEY)
  h -= 30 * Math.exp(-(valley.d * valley.d) / (2 * 8 * 8)) * Math.min(1, valley.t * 2.5)
  return Math.max(0, h)
}

// 等高線は、2px ごとの格子で標高を求め、四角ごとに線を引く（マーチングスクエア法）。形は変わらないので一度だけ計算する。
let contourCache = null
function contourLines() {
  if (contourCache) return contourCache
  const step = 2
  const nx = MAP_W / step
  const ny = MAP_H / step
  const values = []
  for (let j = 0; j <= ny; j += 1) for (let i = 0; i <= nx; i += 1) values.push(contourHeight(i * step, j * step))
  const at = (i, j) => values[j * (nx + 1) + i]
  const top = Math.floor(Math.max(...values) / 10) * 10
  const lines = []
  for (let level = 10; level <= top; level += 10) {
    const parts = []
    const cross = (x1, y1, v1, x2, y2, v2) => {
      const t = (level - v1) / (v2 - v1)
      return `${Math.round((x1 + (x2 - x1) * t) * 10) / 10},${Math.round((y1 + (y2 - y1) * t) * 10) / 10}`
    }
    for (let j = 0; j < ny; j += 1) {
      for (let i = 0; i < nx; i += 1) {
        const x = i * step
        const y = j * step
        const v0 = at(i, j)
        const v1 = at(i + 1, j)
        const v2 = at(i + 1, j + 1)
        const v3 = at(i, j + 1)
        const code = (v0 >= level ? 8 : 0) | (v1 >= level ? 4 : 0) | (v2 >= level ? 2 : 0) | (v3 >= level ? 1 : 0)
        if (code === 0 || code === 15) continue
        const t = () => cross(x, y, v0, x + step, y, v1)
        const r = () => cross(x + step, y, v1, x + step, y + step, v2)
        const b = () => cross(x, y + step, v3, x + step, y + step, v2)
        const l = () => cross(x, y, v0, x, y + step, v3)
        const seg = (p, q) => parts.push(`M${p}L${q}`)
        if (code === 1 || code === 14) seg(l(), b())
        else if (code === 2 || code === 13) seg(b(), r())
        else if (code === 3 || code === 12) seg(l(), r())
        else if (code === 4 || code === 11) seg(t(), r())
        else if (code === 6 || code === 9) seg(t(), b())
        else if (code === 7 || code === 8) seg(l(), t())
        else if (code === 5) { seg(l(), t()); seg(b(), r()) }
        else if (code === 10) { seg(t(), r()); seg(l(), b()) }
      }
    }
    lines.push({ level, d: parts.join('') })
  }
  contourCache = lines
  return lines
}

/** 山頂の標高（図の山頂の点の値）。 */
export const contourSummitHeight = () => Math.round(contourHeight(SUMMIT.x, SUMMIT.y))

const MARK_AT = Object.freeze({
  ridge: [102, 142],
  valley: [190, 28],
  steep: [214, 92],
  gentle: [70, 70],
  summit: [SUMMIT.x, SUMMIT.y],
})

function ContourDiagram({ labels = true, profile = true, marks = [] }) {
  const lines = contourLines()
  const summit = contourSummitHeight()
  const A = 14
  const B = 286
  // 計曲線の数字は、A－B の線の西側（間隔が広い側）で、その高さを横切る所に置く。
  const numberAt = (level) => {
    for (let x = A; x < SUMMIT.x; x += 0.5) if (contourHeight(x, PROFILE_Y) >= level) return x
    return null
  }
  const profileTop = MAP_H + 22
  const profileH = 64
  const py = (h) => profileTop + profileH - (h / 200) * profileH
  const samples = []
  for (let x = A; x <= B; x += 2) samples.push([x, contourHeight(x, PROFILE_Y)])
  const height = profile ? profileTop + profileH + 22 : MAP_H + 4
  const river = VALLEY[0].map((value, index) => value + (VALLEY[1][index] - value) * 0.45)
  return (
    <svg viewBox={`0 0 300 ${height}`} className="h-auto w-full" role="img" aria-label="等高線の図" data-subject-diagram="contour">
      <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="#fbfaf5" stroke="#cbd5e1" />
      <path d={`M${river[0]},${river[1]} L${VALLEY[1][0]},${VALLEY[1][1]}`} stroke={RIVER} strokeWidth="2" fill="none" strokeLinecap="round" />
      {lines.map((line) => (
        <path key={line.level} d={line.d} fill="none" stroke={BROWN} strokeWidth={line.level % 50 === 0 ? 1.6 : 0.7} strokeLinecap="round" />
      ))}
      {labels && [50, 100, 150].filter((level) => level < summit).map((level) => {
        const x = numberAt(level)
        return x === null ? null : <Label key={`n-${level}`} x={x} y={PROFILE_Y - 3} size={8} weight="800" color={BROWN} anchor="middle">{String(level)}</Label>
      })}
      <path d={`M${SUMMIT.x},${SUMMIT.y - 4.5} L${SUMMIT.x - 4},${SUMMIT.y + 2.5} L${SUMMIT.x + 4},${SUMMIT.y + 2.5} Z`} fill={INK} />
      {labels && <Label x={SUMMIT.x + 6} y={SUMMIT.y - 5} size={9} weight="800">{`山頂 ${summit}m`}</Label>}
      {profile && (
        <g>
          <line x1={A} x2={B} y1={PROFILE_Y} y2={PROFILE_Y} stroke="#b91c1c" strokeWidth="1" strokeDasharray="4 3" />
          <Label x={A - 1} y={PROFILE_Y + 12} size={9.5} weight="800" color="#b91c1c" anchor="middle">A</Label>
          <Label x={B + 1} y={PROFILE_Y + 12} size={9.5} weight="800" color="#b91c1c" anchor="middle">B</Label>
        </g>
      )}
      {labels && (
        <g>
          <Label x={MARK_AT.ridge[0] - 14} y={MARK_AT.ridge[1] + 2} size={10} weight="800" color="#7c2d12" anchor="end">尾根</Label>
          <Label x={MARK_AT.valley[0] + 10} y={MARK_AT.valley[1] + 4} size={10} weight="800" color={RIVER}>谷</Label>
          <Label x={236} y={128} size={8.5} weight="800" color="#b45309" anchor="middle">間隔がせまい</Label>
          <Label x={236} y={139} size={8.5} weight="800" color="#b45309" anchor="middle">＝傾斜が急</Label>
          <Label x={52} y={36} size={8.5} weight="800" color="#15803d" anchor="middle">間隔が広い</Label>
          <Label x={52} y={47} size={8.5} weight="800" color="#15803d" anchor="middle">＝傾斜がゆるやか</Label>
        </g>
      )}
      {marks.map((mark) => {
        const [x, y] = MARK_AT[mark.at] ?? [0, 0]
        return (
          <g key={mark.label}>
            <circle cx={x} cy={y} r="8" fill="#ffffff" stroke={INK} strokeWidth="1.5" />
            <text x={x} y={y + 3.8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>{mark.label}</text>
          </g>
        )
      })}
      {profile && (
        <g>
          <Label x={4} y={profileTop - 6} size={9} weight="800" color={MUTED}>A－B の断面図</Label>
          {[0, 50, 100, 150, 200].map((h) => (
            <g key={`p-${h}`}>
              <line x1={A} x2={B} y1={py(h)} y2={py(h)} stroke="#e2e8f0" />
              <text x={B + 3} y={py(h) + 3} fontSize="7.5" fill={MUTED}>{h}</text>
            </g>
          ))}
          <path d={`M${A},${py(0)} ${samples.map(([x, h]) => `L${x},${Math.round(py(h) * 10) / 10}`).join(' ')} L${B},${py(0)} Z`} fill="#e7d9b8" stroke={BROWN} strokeWidth="1.2" />
          <text x={B + 3} y={profileTop - 4} fontSize="7.5" fill={MUTED}>m</text>
          <Label x={A} y={py(0) + 12} size={9} weight="800" color="#b91c1c" anchor="middle">A</Label>
          <Label x={B} y={py(0) + 12} size={9} weight="800" color="#b91c1c" anchor="middle">B</Label>
        </g>
      )}
    </svg>
  )
}

// ── 地図記号 ───────────────────────────────────────────────────────────
//   { name: 'mapSymbols', symbols: ['rice', 'field', …] }（記号の名前は MAP_SYMBOLS）
// 国土地理院の2万5千分の1地形図の記号を、線でかいたもの。

const S = { fill: 'none', stroke: INK, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
const glyph = (text, size = 15) => (
  <text x="12" y={12 + size * 0.36} textAnchor="middle" fontSize={size} fontWeight="700" fill={INK}>{text}</text>
)
const monument = (inner) => (
  <g>
    <path d="M8,20 L8,9 L12,5 L16,9 L16,20" {...S} />
    <path d="M5,20 L19,20" {...S} />
    {inner}
  </g>
)

export const MAP_SYMBOLS = Object.freeze({
  rice: { name: '田', draw: <g><path d="M9,7 L9,17 M13,7 L13,17" {...S} /></g> },
  field: { name: '畑', draw: <path d="M6,7 Q8,15 12,18 Q16,15 18,7" {...S} /> },
  orchard: { name: '果樹園', draw: <g><circle cx="12" cy="14" r="5" {...S} /><path d="M12,4 L12,9" {...S} /></g> },
  tea: { name: '茶畑', draw: <g><circle cx="12" cy="7.5" r="2" {...S} /><circle cx="7.5" cy="15.5" r="2" {...S} /><circle cx="16.5" cy="15.5" r="2" {...S} /></g> },
  conifer: { name: '針葉樹林', draw: <path d="M7,12 L12,5 L17,12 M12,5 L12,19" {...S} /> },
  broadleaf: { name: '広葉樹林', draw: <g><circle cx="12" cy="10" r="5" {...S} /><path d="M12,15 L12,20" {...S} /></g> },
  cityhall: { name: '市役所', draw: <g><circle cx="12" cy="12" r="7.5" {...S} /><circle cx="12" cy="12" r="3.5" {...S} /></g> },
  townhall: { name: '町村役場', draw: <g><circle cx="12" cy="12" r="7.5" {...S} /><circle cx="12" cy="12" r="1.8" fill={INK} /></g> },
  school: { name: '小・中学校', draw: glyph('文') },
  highschool: { name: '高等学校', draw: <g><circle cx="12" cy="12" r="9.5" {...S} />{glyph('文', 12)}</g> },
  post: { name: '郵便局', draw: <g><circle cx="12" cy="12" r="9.5" {...S} />{glyph('〒', 12)}</g> },
  police: { name: '警察署', draw: <g><circle cx="12" cy="12" r="8.5" {...S} /><path d="M8,8 L16,16 M16,8 L8,16" {...S} /></g> },
  koban: { name: '交番', draw: <path d="M7,7 L17,17 M17,7 L7,17" {...S} /> },
  fire: { name: '消防署', draw: <path d="M12,20 L12,12 M6,5 Q7,11 12,12 Q17,11 18,5" {...S} /> },
  shrine: { name: '神社', draw: <path d="M4,7 Q12,5 20,7 M6,10.5 L18,10.5 M8,7 L8,19 M16,7 L16,19" {...S} /> },
  temple: { name: '寺院', draw: glyph('卍') },
  library: { name: '図書館', draw: <path d="M4,8 L12,6 L20,8 L20,18 L12,16 L4,18 Z M12,6 L12,16" {...S} /> },
  museum: { name: '博物館', draw: <path d="M4,10 L12,5 L20,10 Z M6,19 L18,19 M8,11 L8,18 M12,11 L12,18 M16,11 L16,18" {...S} /> },
  elderly: { name: '老人ホーム', draw: <path d="M5,11 L12,5 L19,11 L19,19 L5,19 Z M12,18 L12,11 Q12,9 14,9" {...S} /> },
  factory: {
    name: '工場',
    draw: (
      <g>
        <circle cx="12" cy="12" r="5" {...S} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const a = (angle * Math.PI) / 180
          return <path key={angle} d={`M${12 + 5 * Math.cos(a)},${12 + 5 * Math.sin(a)} L${12 + 8.5 * Math.cos(a)},${12 + 8.5 * Math.sin(a)}`} {...S} strokeWidth="2.4" strokeLinecap="butt" />
        })}
      </g>
    ),
  },
  monument: { name: '記念碑', draw: monument(null) },
  disasterMonument: { name: '自然災害伝承碑', draw: monument(<path d="M12,10 L12,17" {...S} />) },
  hotspring: { name: '温泉', draw: glyph('♨', 16) },
})

function MapSymbolsDiagram({ symbols = Object.keys(MAP_SYMBOLS) }) {
  const list = symbols.filter((id) => MAP_SYMBOLS[id])
  const columns = 3
  const cellW = 100
  const cellH = 36
  const rows = Math.ceil(list.length / columns)
  return (
    <svg viewBox={`0 0 300 ${rows * cellH + 4}`} className="h-auto w-full" role="img" aria-label="地図記号" data-subject-diagram="mapSymbols">
      {list.map((id, index) => {
        const x = (index % columns) * cellW
        const y = Math.floor(index / columns) * cellH + 2
        const { name, draw } = MAP_SYMBOLS[id]
        return (
          <g key={id}>
            <rect x={x + 2} y={y} width={cellW - 4} height={cellH - 4} rx="6" fill="#ffffff" stroke="#e2e8f0" />
            <g transform={`translate(${x + 6}, ${y + 4})`}>{draw}</g>
            <text x={x + 34} y={y + cellH / 2 + 2} fontSize={name.length > 5 ? 8.5 : 10} fontWeight="800" fill={INK}>{name}</text>
          </g>
        )
      })}
    </svg>
  )
}

export const MAP_READING_DIAGRAMS = Object.freeze({
  mapScale: MapScaleDiagram,
  contour: ContourDiagram,
  mapSymbols: MapSymbolsDiagram,
})
