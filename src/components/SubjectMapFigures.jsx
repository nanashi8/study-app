import { AZIMUTHAL_MAP, GLOBE_LAND, JAPAN_MAP, WORLD_MAP } from '../data/subjects/maps.js'
import { tokenizeSubjectText } from '../lib/subjectText.js'
import {
  AZIMUTHAL_PROJECTION,
  JAPAN_PROJECTION,
  projectAzimuthal,
  projectJapan,
  projectJapanMain,
  projectWorld,
  projectWorldShifted,
  worldLongitude,
} from '../data/subjects/projection.js'

// 社会の地図の図（世界地図・日本地図）。形は data/subjects/maps.js、投影は data/subjects/projection.js。
// 文字や記号は、画面での大きさ（図の幅を約300pxとして）がどの切り出しでも同じになるように、切り出した幅に合わせて大きさを決める。
//   view   … 切り出す範囲。{ lon: [西, 東], lat: [南, 北] }（西経・南緯は負の数）。無ければ地図の全体。
//            世界地図は西経25.5度（大西洋）で切れているので、その線をまたぐ範囲は切り出せない（テストが止める）。
//   marks  … 国・県に付ける記号。{ USA: 'A' } / { 'JP-13': 'A' }
//   fills  … 国・県の色。{ USA: '#fde68a' }
//   grid   … 緯線・経線を引く間隔（度）。例 30。gridLabels: false で目盛りの文字を出さない。gridLabelEvery: 2 で経線の文字を1本おきに
//   parallels / meridians … 1本ずつ引く緯線・経線。[{ lat: 22, text: '北緯22度', side?: 'right' }] / [{ lon: 25, text: '東経25度' }]
//   lines  … 特別な緯線・経線（世界地図）。['equator', 'tropicN', 'tropicS', 'primeMeridian', 'meridian180', 'meridian135']
//   points … 緯度・経度で置く点。[{ lon, lat, label?: 'A', text?: '東京', side?: 'left' | 'right' }]（地名は、図の右寄りなら点の左、ほかは右。side で決められる）
//   arrows … 緯度・経度を順にたどる矢印。[{ path: [[lon, lat], …], color?, dashed?, text?, textAt?: [lon, lat], head?: false（矢じりなしの線）, width?: 線の太さ（帯のように太く引くとき）, textSize?, textColor? }]
//   labels … 緯度・経度に置く文字（海・山脈など）。[{ lon, lat, text, color?, size?, italic? }]
//   states: true … 州で色分け（hideLegend: true で凡例を出さない。同じ凡例の図を並べるとき）
//   rivers … 大河の線（世界地図）。['yangtze', 'huanghe']（id は maps.js の WORLD_MAP.rivers。川の名前は labels で置く）

export const INK = '#1f2937'
const SEA = '#e0f2fe'
const LAND = '#e2e8f0'
const LINE_RED = '#dc2626'
const RIVER = '#2563eb'
const SCREEN_WIDTH = 300

export const JAPAN_REGION_META = Object.freeze({
  hokkaido: { label: '北海道地方', color: '#bfdbfe' },
  tohoku: { label: '東北地方', color: '#bbf7d0' },
  kanto: { label: '関東地方', color: '#fde68a' },
  chubu: { label: '中部地方', color: '#fecaca' },
  kinki: { label: '近畿地方', color: '#ddd6fe' },
  chugokuShikoku: { label: '中国・四国地方', color: '#a5f3fc' },
  kyushu: { label: '九州地方', color: '#fed7aa' },
})

export const WORLD_STATE_META = Object.freeze({
  asia: { label: 'アジア州', color: '#fde68a' },
  europe: { label: 'ヨーロッパ州', color: '#bfdbfe' },
  africa: { label: 'アフリカ州', color: '#fed7aa' },
  northAmerica: { label: '北アメリカ州', color: '#bbf7d0' },
  southAmerica: { label: '南アメリカ州', color: '#fecaca' },
  oceania: { label: 'オセアニア州', color: '#ddd6fe' },
})

const WORLD_LINE_META = Object.freeze({
  equator: { label: '赤道', lat: 0 },
  tropicN: { label: '北回帰線', lat: 23.44 },
  tropicS: { label: '南回帰線', lat: -23.44 },
  primeMeridian: { label: '本初子午線（経度0度）', lon: 0 },
  meridian180: { label: '経度180度', lon: 180 },
  meridian135: { label: '東経135度', lon: 135 },
})

/** 文字の幅の見積もり（全角は1字分、半角は0.55字分）。 */
export const textWidth = (text, size) => [...String(text)].reduce((sum, char) => sum + (/[\u0000-\u007f]/.test(char) ? 0.55 : 1), 0) * size

/** 文字が図（box）の外へはみ出さないように、x を内側へ寄せる。anchor は start・middle・end。 */
export function clampTextX(x, text, size, box, anchor = 'start', margin = 2) {
  const width = textWidth(text, size)
  const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2
  const shift = Math.max(box.x + margin - left, Math.min(0, box.x + box.w - margin - (left + width)))
  return x + shift
}

/** 緯度の文字（北緯30度・赤道・南緯30度）。 */
export const latitudeText = (lat) => (lat === 0 ? '赤道' : `${lat > 0 ? '北緯' : '南緯'}${Math.abs(lat)}度`)
/** 経度の文字（東経135度・西経75度・0度・180度）。 */
export const longitudeText = (lon) => {
  const value = ((lon + 540) % 360) - 180
  if (value === 0) return '0度'
  if (Math.abs(value) === 180) return '180度'
  return `${value > 0 ? '東経' : '西経'}${Math.abs(value)}度`
}

function Legend({ items }) {
  if (!items?.length) return null
  return (
    <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-bold text-ink/70">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  )
}

/** 記号（白い丸に文字）。u は画面の1pxにあたる図の長さ。 */
function Mark({ x, y, label, u, tone = INK }) {
  const r = 8.5 * u
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#ffffff" stroke={tone} strokeWidth={1.5 * u} />
      <text x={x} y={y + 3.8 * u} textAnchor="middle" fontSize={10.5 * u} fontWeight="800" fill={tone}>{label}</text>
    </g>
  )
}

/** 点（小さな丸と地名）。図の右寄りの点は、地名を左に置く。地名が図の外へはみ出すときは、反対の側へ移すか内側へ寄せる。 */
function Point({ x, y, label, text, u, flip = false, box = null }) {
  const gap = (label ? 11 : 5) * u
  let left = flip
  let textX = left ? x - gap : x + gap
  if (box && text) {
    const width = textWidth(text, 10 * u)
    const margin = 2 * u
    const fitsRight = x + gap + width <= box.x + box.w - margin
    const fitsLeft = x - gap - width >= box.x + margin
    if (!left && !fitsRight && fitsLeft) left = true
    else if (left && !fitsLeft && fitsRight) left = false
    textX = left ? x - gap : x + gap
    if (left && !fitsLeft && !fitsRight) textX = Math.max(textX, box.x + margin + width)
    if (!left && !fitsLeft && !fitsRight) textX = Math.min(textX, box.x + box.w - margin - width)
  }
  const anchor = left ? 'end' : 'start'
  return (
    <g>
      {label ? <Mark x={x} y={y} label={label} u={u} /> : <circle cx={x} cy={y} r={3.2 * u} fill={INK} stroke="#ffffff" strokeWidth={1.2 * u} />}
      {text && <Halo x={textX} y={y + 3.5 * u} u={u} size={10} weight="800" anchor={anchor}>{text}</Halo>}
    </g>
  )
}

/** 白いふちどりの文字（地図の上でも読めるように）。常用漢字にない字をふくむ語には、上に小さく読みがなを出す。 */
export function Halo({ x, y, u, size = 10, weight = '700', color = INK, anchor = 'start', italic = false, children }) {
  const common = {
    x,
    y,
    fontSize: size * u,
    fontWeight: weight,
    textAnchor: anchor,
    fontStyle: italic ? 'italic' : undefined,
  }
  const segments = typeof children === 'string' ? tokenizeSubjectText(children) : []
  const rubies = []
  if (segments.some((segment) => segment.reading)) {
    const total = textWidth(children, size * u)
    let left = anchor === 'start' ? x : anchor === 'end' ? x - total : x - total / 2
    for (const segment of segments) {
      const width = textWidth(segment.text, size * u)
      if (segment.reading) rubies.push({ x: left + width / 2, text: segment.reading })
      left += width
    }
  }
  return (
    <g>
      <text {...common} fill="none" stroke="#ffffff" strokeWidth={3 * u} strokeLinejoin="round">{children}</text>
      <text {...common} fill={color}>{children}</text>
      {rubies.map((ruby) => (
        <g key={`${ruby.x}-${ruby.text}`}>
          <text x={ruby.x} y={y - size * u * 0.95} fontSize={size * u * 0.5} fontWeight="700" textAnchor="middle" fill="none" stroke="#ffffff" strokeWidth={2 * u} strokeLinejoin="round">{ruby.text}</text>
          <text x={ruby.x} y={y - size * u * 0.95} fontSize={size * u * 0.5} fontWeight="700" textAnchor="middle" fill={color}>{ruby.text}</text>
        </g>
      ))}
    </g>
  )
}

function arrowHead(points, u, color) {
  if (points.length < 2) return null
  const [x1, y1] = points[points.length - 2]
  const [x2, y2] = points[points.length - 1]
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const size = 7 * u
  const a1 = angle + Math.PI * 0.84
  const a2 = angle - Math.PI * 0.84
  return (
    <path
      d={`M${x2},${y2} L${x2 + size * Math.cos(a1)},${y2 + size * Math.sin(a1)} L${x2 + size * Math.cos(a2)},${y2 + size * Math.sin(a2)} Z`}
      fill={color}
    />
  )
}

function Arrows({ arrows, project, u, box }) {
  return (arrows ?? []).map((arrow, index) => {
    const color = arrow.color ?? '#b91c1c'
    const points = arrow.path.map(([lon, lat]) => project(lon, lat))
    const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
    const textAt = arrow.textAt ? project(...arrow.textAt) : null
    // 矢印の文字は、図の外へはみ出さないように内側へ寄せる。
    const textX = textAt && box ? clampTextX(textAt[0], arrow.text, (arrow.textSize ?? 10) * u, box, 'start', 2 * u) : textAt?.[0]
    return (
      <g key={`arrow-${index}`}>
        <path d={d} fill="none" stroke={color} strokeWidth={(arrow.width ?? 2.2) * u} strokeDasharray={arrow.dashed ? `${6 * u} ${4 * u}` : undefined} strokeLinecap="round" strokeLinejoin="round" />
        {arrow.head !== false && arrowHead(points, u, color)}
        {textAt && <Halo x={textX} y={textAt[1]} u={u} size={arrow.textSize ?? 10} weight="800" color={arrow.textColor ?? color}>{arrow.text}</Halo>}
      </g>
    )
  })
}

function Labels({ labels, project, u, box }) {
  return (labels ?? []).map((label, index) => {
    const [px, y] = project(label.lon, label.lat)
    const size = label.size ?? 10
    const x = box ? clampTextX(px, label.text, size * u, box, 'middle', 2 * u) : px
    return (
      <Halo key={`label-${index}`} x={x} y={y} u={u} size={size} weight="800" color={label.color ?? '#1e3a8a'} anchor="middle" italic={label.italic}>
        {label.text}
      </Halo>
    )
  })
}

// ── 世界地図 ─────────────────────────────────────────────────────────

function worldBox(view) {
  if (!view) return { x: 0, y: 0, w: WORLD_MAP.width, h: WORLD_MAP.height }
  const west = worldLongitude(view.lon[0])
  let east = worldLongitude(view.lon[1])
  if (east <= west) east += 360
  const [x0, y0] = projectWorldShifted(west, view.lat[1])
  const [x1, y1] = projectWorldShifted(east, view.lat[0])
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

function WorldGrid({ step, box, u, showLabels = true, labelEvery = 1, skipLat = [], skipLon = [] }) {
  const lines = []
  for (let lat = -90 + step; lat < 90; lat += step) {
    if (lat > 84 || lat < -57) continue
    const [, y] = projectWorld(0, lat)
    if (y < box.y - 1 || y > box.y + box.h + 1) continue
    lines.push(
      <g key={`lat-${lat}`}>
        <line x1={box.x} x2={box.x + box.w} y1={y} y2={y} stroke={lat === 0 ? '#475569' : '#94a3b8'} strokeWidth={(lat === 0 ? 1.2 : 0.8) * u} strokeDasharray={lat === 0 ? undefined : `${3 * u} ${2 * u}`} />
        {showLabels && !skipLat.includes(lat) && <Halo x={box.x + 3 * u} y={y - 2.5 * u} u={u} size={9} color="#334155">{latitudeText(lat)}</Halo>}
      </g>,
    )
  }
  for (let lon = -180; lon < 360; lon += step) {
    const shifted = lon
    if (shifted < -25.5 || shifted > 349.5) continue
    const [x] = projectWorldShifted(shifted, 0)
    if (x < box.x - 1 || x > box.x + box.w + 1) continue
    const real = ((shifted + 540) % 360) - 180
    const labeled = showLabels && Math.round(lon / step) % labelEvery === 0 && !skipLon.includes(real)
    lines.push(
      <g key={`lon-${lon}`}>
        <line x1={x} x2={x} y1={box.y} y2={box.y + box.h} stroke={real === 0 ? '#475569' : '#94a3b8'} strokeWidth={(real === 0 ? 1.2 : 0.8) * u} strokeDasharray={real === 0 ? undefined : `${3 * u} ${2 * u}`} />
        {labeled && <Halo x={clampTextX(x, longitudeText(real), 9 * u, box, 'middle', 2 * u)} y={box.y + box.h - 3 * u} u={u} size={9} color="#334155" anchor="middle">{longitudeText(real)}</Halo>}
      </g>,
    )
  }
  return <g>{lines}</g>
}

export function WorldMapFigure({ figure }) {
  const marks = figure.marks ?? {}
  const fills = figure.fills ?? {}
  const box = worldBox(figure.view)
  const u = box.w / SCREEN_WIDTH
  const fillOf = (country) => fills[country.code] ?? (figure.states ? WORLD_STATE_META[country.state].color : LAND)
  const clipId = `world-clip-${Math.round(box.x)}-${Math.round(box.y)}-${Math.round(box.w)}`
  return (
    <div>
      <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '世界地図'} data-subject-figure-world>
        <defs>
          <clipPath id={clipId}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={SEA} />
          {WORLD_MAP.countries.filter((country) => country.d).map((country) => (
            <path key={country.code} d={country.d} fill={fillOf(country)} stroke="#ffffff" strokeWidth={0.6 * u} strokeLinejoin="round" />
          ))}
          {WORLD_MAP.lakes.map((lake) => <path key={lake.name} d={lake.d} fill={SEA} stroke="#93c5fd" strokeWidth={0.5 * u} />)}
          {WORLD_MAP.rivers.filter((river) => (figure.rivers ?? []).includes(river.id)).map((river) => (
            <path key={river.id} d={river.d} fill="none" stroke={RIVER} strokeWidth={1.3 * u} strokeLinejoin="round" strokeLinecap="round" data-river={river.id} />
          ))}
          {figure.grid && (
            <WorldGrid
              step={figure.grid}
              box={box}
              u={u}
              showLabels={figure.gridLabels !== false}
              labelEvery={figure.gridLabelEvery ?? 1}
              skipLat={(figure.lines ?? []).includes('equator') ? [0] : []}
              skipLon={(figure.lines ?? []).includes('primeMeridian') ? [0] : []}
            />
          )}
          {(figure.parallels ?? []).map((line) => {
            const [, y] = projectWorld(0, line.lat)
            return (
              <g key={`par-${line.lat}`}>
                <line x1={box.x} x2={box.x + box.w} y1={y} y2={y} stroke={line.color ?? LINE_RED} strokeWidth={1.5 * u} strokeDasharray={`${5 * u} ${3 * u}`} />
                {line.text && (
                  <Halo
                    x={line.side === 'right' ? box.x + box.w - 3 * u : box.x + 3 * u}
                    y={y - 3 * u}
                    u={u}
                    size={9.5}
                    weight="800"
                    color={line.color ?? '#b91c1c'}
                    anchor={line.side === 'right' ? 'end' : 'start'}
                  >
                    {line.text}
                  </Halo>
                )}
              </g>
            )
          })}
          {(figure.meridians ?? []).map((line) => {
            const [x] = projectWorld(line.lon, 0)
            return (
              <g key={`mer-${line.lon}`}>
                <line x1={x} x2={x} y1={box.y} y2={box.y + box.h} stroke={line.color ?? LINE_RED} strokeWidth={1.5 * u} strokeDasharray={`${5 * u} ${3 * u}`} />
                {line.text && <Halo x={x + 3 * u} y={box.y + 12 * u} u={u} size={9.5} weight="800" color={line.color ?? '#b91c1c'}>{line.text}</Halo>}
              </g>
            )
          })}
          {(figure.lines ?? []).map((line) => {
            const meta = WORLD_LINE_META[line]
            if (!meta) return null
            // たての線の名前は、重ならないように段をずらす。
            const column = (figure.lines ?? []).filter((name) => WORLD_LINE_META[name]?.lon !== undefined).indexOf(line)
            if (meta.lat !== undefined) {
              const [, y] = projectWorld(0, meta.lat)
              return (
                <g key={line}>
                  <line x1={box.x} x2={box.x + box.w} y1={y} y2={y} stroke={LINE_RED} strokeWidth={1.4 * u} strokeDasharray={`${5 * u} ${3 * u}`} />
                  <Halo x={box.x + box.w - 3 * u} y={y - 3 * u} u={u} size={9.5} weight="800" color="#b91c1c" anchor="end">{meta.label}</Halo>
                </g>
              )
            }
            const [x] = projectWorld(meta.lon, 0)
            return (
              <g key={line}>
                <line x1={x} x2={x} y1={box.y} y2={box.y + box.h} stroke={LINE_RED} strokeWidth={1.4 * u} strokeDasharray={`${5 * u} ${3 * u}`} />
                <Halo x={x + 3 * u} y={box.y + (12 + column * 13) * u} u={u} size={9.5} weight="800" color="#b91c1c">{meta.label}</Halo>
              </g>
            )
          })}
          <Labels labels={figure.labels} project={projectWorld} u={u} box={box} />
          <Arrows arrows={figure.arrows} project={projectWorld} u={u} box={box} />
          {WORLD_MAP.countries.filter((country) => marks[country.code]).map((country) => (
            <Mark key={country.code} x={country.x} y={country.y} label={marks[country.code]} u={u} />
          ))}
          {(figure.points ?? []).map((point, index) => {
            const [x, y] = projectWorld(point.lon, point.lat)
            return <Point key={`point-${index}`} x={x} y={y} label={point.label} text={point.text} u={u} flip={point.side ? point.side === 'left' : x > box.x + box.w * 0.62} box={box} />
          })}
        </g>
      </svg>
      {figure.states && !figure.hideLegend && <Legend items={Object.values(WORLD_STATE_META)} />}
      {figure.legend && <Legend items={figure.legend.map(([label, color]) => ({ label, color }))} />}
    </div>
  )
}

// ── 日本地図 ─────────────────────────────────────────────────────────

function japanBox(view) {
  if (!view) return { x: 0, y: 0, w: JAPAN_MAP.width, h: JAPAN_MAP.height, inset: true }
  const [x0, y0] = projectJapanMain(view.lon[0], view.lat[1])
  const [x1, y1] = projectJapanMain(view.lon[1], view.lat[0])
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, inset: false }
}

function JapanGrid({ step, box, u, showLabels = true }) {
  const { main } = JAPAN_PROJECTION
  const lines = []
  for (let lat = Math.ceil(main.lat0 / step) * step; lat <= main.lat1; lat += step) {
    const [, y] = projectJapanMain(main.lon0, lat)
    if (y < box.y || y > box.y + box.h) continue
    lines.push(
      <g key={`lat-${lat}`}>
        <line x1={box.x} x2={box.x + box.w} y1={y} y2={y} stroke="#94a3b8" strokeWidth={0.8 * u} strokeDasharray={`${3 * u} ${2 * u}`} />
        {showLabels && <Halo x={box.x + box.w - 3 * u} y={y - 2.5 * u} u={u} size={9} color="#334155" anchor="end">{latitudeText(lat)}</Halo>}
      </g>,
    )
  }
  for (let lon = Math.ceil(main.lon0 / step) * step; lon <= 150; lon += step) {
    const [x] = projectJapanMain(lon, main.lat0)
    if (x < box.x || x > box.x + box.w) continue
    lines.push(
      <g key={`lon-${lon}`}>
        <line x1={x} x2={x} y1={box.y} y2={box.y + box.h} stroke="#94a3b8" strokeWidth={0.8 * u} strokeDasharray={`${3 * u} ${2 * u}`} />
        {showLabels && <Halo x={clampTextX(x + 2 * u, longitudeText(lon), 9 * u, box, 'start', 2 * u)} y={box.y + box.h - 3 * u} u={u} size={9} color="#334155">{longitudeText(lon)}</Halo>}
      </g>,
    )
  }
  return <g>{lines}</g>
}

export function JapanMapFigure({ figure }) {
  const marks = figure.marks ?? {}
  const fills = figure.fills ?? {}
  const { prefectures, territories, lakes, inset } = JAPAN_MAP
  const box = japanBox(figure.view)
  const u = box.w / SCREEN_WIDTH
  const fillOf = (pref) => fills[pref.code] ?? (figure.regions ? JAPAN_REGION_META[pref.region].color : LAND)
  const clipId = `japan-clip-${Math.round(box.x)}-${Math.round(box.y)}-${Math.round(box.w)}`
  const showInset = box.inset && figure.inset !== false
  return (
    <div>
      <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '日本地図'} data-subject-figure-japan>
        <defs>
          <clipPath id={clipId}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={SEA} />
          {showInset && <rect x={inset.x} y={inset.y} width={inset.w} height={inset.h} fill={SEA} stroke="#94a3b8" strokeWidth={1.2 * u} />}
          {prefectures.map((pref) => (
            <path key={pref.code} d={pref.d} fill={fillOf(pref)} stroke="#ffffff" strokeWidth={0.9 * u} strokeLinejoin="round" />
          ))}
          <path d={territories.northern} fill={fills.northern ?? (figure.regions ? JAPAN_REGION_META.hokkaido.color : LAND)} stroke="#ffffff" strokeWidth={0.9 * u} />
          <circle cx={territories.takeshima.x} cy={territories.takeshima.y} r={2.6 * u} fill={figure.regions ? JAPAN_REGION_META.chugokuShikoku.color : '#cbd5e1'} stroke="#64748b" strokeWidth={0.7 * u} />
          {/* 尖閣諸島は南西諸島の囲みの中に描く（囲みを出さない図では描かない）。 */}
          {showInset && <circle cx={territories.senkaku.x} cy={territories.senkaku.y} r={2.6 * u} fill={figure.regions ? JAPAN_REGION_META.kyushu.color : '#cbd5e1'} stroke="#64748b" strokeWidth={0.7 * u} />}
          {lakes.map((lake) => <path key={lake.name} d={lake.d} fill="#bfdbfe" stroke="#93c5fd" strokeWidth={0.6 * u} />)}
          {figure.grid && <JapanGrid step={figure.grid} box={box} u={u} showLabels={figure.gridLabels !== false} />}
          <Labels labels={figure.labels} project={projectJapan} u={u} box={box} />
          <Arrows arrows={figure.arrows} project={projectJapan} u={u} box={box} />
          {prefectures.filter((pref) => marks[pref.code]).map((pref) => (
            <Mark key={pref.code} x={pref.x} y={pref.y} label={marks[pref.code]} u={u} />
          ))}
          {(figure.points ?? []).map((point, index) => {
            const [x, y] = projectJapan(point.lon, point.lat)
            return <Point key={`point-${index}`} x={x} y={y} label={point.label} text={point.text} u={u} flip={point.side ? point.side === 'left' : x > box.x + box.w * 0.62} box={box} />
          })}
        </g>
      </svg>
      {figure.regions && <Legend items={Object.values(JAPAN_REGION_META)} />}
      {figure.legend && <Legend items={figure.legend.map(([label, color]) => ({ label, color }))} />}
    </div>
  )
}

// ── 東京を中心とした正距方位図法（中心からの距離と方位が正しい地図）─────────────
//   { type: 'azimuthalMap', rays?: [{ bearing: 90, text: '真東', color? }], points?: [{ lon, lat, label?, text? }], labels?: [{ lon, lat, text }], fills? }
// 上が北。中心から引いた直線は最短の経路で、中心から見た方位が正しい。縁は地球の反対側（約2万km）。

const DIRECTIONS = Object.freeze([
  ['北', 0], ['北東', 45], ['東', 90], ['南東', 135], ['南', 180], ['南西', 225], ['西', 270], ['北西', 315],
])

export function AzimuthalMapFigure({ figure }) {
  const { radius: R, countries } = AZIMUTHAL_MAP
  const pad = 26
  const size = R * 2 + pad * 2
  const u = size / SCREEN_WIDTH
  const fills = figure.fills ?? {}
  const km = AZIMUTHAL_PROJECTION.halfCircumferenceKm
  const at = (bearing, r) => [R + r * Math.sin((bearing * Math.PI) / 180), R - r * Math.cos((bearing * Math.PI) / 180)]
  const clipId = 'azimuthal-clip'
  return (
    <div>
      <svg viewBox={`${-pad} ${-pad} ${size} ${size}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '東京を中心とした、中心からの距離と方位が正しい地図'} data-subject-figure-azimuthal>
        <defs>
          <clipPath id={clipId}><circle cx={R} cy={R} r={R} /></clipPath>
        </defs>
        <circle cx={R} cy={R} r={R} fill={SEA} stroke={INK} strokeWidth={1.2 * u} />
        <g clipPath={`url(#${clipId})`}>
          {countries.map((country) => (
            <path key={country.code} d={country.d} fill={fills[country.code] ?? LAND} stroke="#ffffff" strokeWidth={0.5 * u} strokeLinejoin="round" />
          ))}
          {[5000, 10000, 15000].map((distance) => (
            <circle key={distance} cx={R} cy={R} r={(distance / km) * R} fill="none" stroke="#64748b" strokeWidth={0.8 * u} strokeDasharray={`${3 * u} ${2 * u}`} />
          ))}
          {DIRECTIONS.map(([, bearing]) => {
            const [x, y] = at(bearing, R)
            return <line key={bearing} x1={R} y1={R} x2={x} y2={y} stroke="#94a3b8" strokeWidth={0.7 * u} strokeDasharray={`${2 * u} ${2 * u}`} />
          })}
          {(figure.rays ?? []).map((ray) => {
            const [x, y] = at(ray.bearing, R - 2 * u)
            const color = ray.color ?? LINE_RED
            return (
              <g key={`ray-${ray.bearing}`}>
                <line x1={R} y1={R} x2={x} y2={y} stroke={color} strokeWidth={2.2 * u} />
                {arrowHead([[R, R], [x, y]], u, color)}
              </g>
            )
          })}
        </g>
        {[5000, 10000, 15000].map((distance) => {
          const [x, y] = at(28, (distance / km) * R)
          return <Halo key={`d-${distance}`} x={x + 2 * u} y={y} u={u} size={8.5} color="#475569">{`${distance.toLocaleString('ja-JP')}km`}</Halo>
        })}
        {DIRECTIONS.map(([label, bearing]) => {
          const [x, y] = at(bearing, R + 12 * u)
          return <Halo key={label} x={x} y={y + 3.5 * u} u={u} size={10} weight="800" anchor="middle">{label}</Halo>
        })}
        <Labels labels={figure.labels} project={(lon, lat) => projectAzimuthal(lon, lat)} u={u} box={{ x: -pad, y: -pad, w: size, h: size }} />
        {(figure.rays ?? []).filter((ray) => ray.text).map((ray) => {
          const [x, y] = at(ray.bearing, R * 0.62)
          return <Halo key={`rt-${ray.bearing}`} x={x} y={y - 5 * u} u={u} size={10} weight="800" color={ray.color ?? '#b91c1c'} anchor="middle">{ray.text}</Halo>
        })}
        {(figure.points ?? []).map((point, index) => {
          const [x, y] = projectAzimuthal(point.lon, point.lat)
          return <Point key={`point-${index}`} x={x} y={y} label={point.label} text={point.text} u={u} flip={x > R * 1.25} />
        })}
        <circle cx={R} cy={R} r={3.4 * u} fill={LINE_RED} stroke="#ffffff" strokeWidth={1.2 * u} />
        <Halo x={R + 5 * u} y={R - 5 * u} u={u} size={10} weight="800" color="#b91c1c">東京</Halo>
      </svg>
      <p className="mt-1 text-center text-[11px] font-bold text-ink/55">円の縁は、東京から見た地球の反対側（約2万km）</p>
    </div>
  )
}

// ── 陸と海の世界全図（南極大陸まで。国境は描かない）─────────────────────────
//   { type: 'worldOverview', west?: -25, labels?: [{ lon, lat, text, color? }], points?: [{ lon, lat, text?, label? }], arrows?: [{ path, color?, dashed?, head?, text?, textAt? }] }
// 正距円筒図法（緯度・経度を等間隔の方眼にした図）。west は図の左の端の経度で、ふつうは太平洋を中央にした −25。
// 大西洋をまたぐ航路などは、west: −180（大西洋を中央にした図）で描く。図の端をまたぐ道すじは、端で分けて2本の矢印にする。
const OVERVIEW_WEST = -25
const OVERVIEW_WIDTH = 360
export function WorldOverviewFigure({ figure }) {
  const west = figure.west ?? OVERVIEW_WEST
  const width = OVERVIEW_WIDTH
  const height = 180
  const u = width / SCREEN_WIDTH
  // 図の右の端（west + 360 度）ちょうどの経度は右の端に置く（端をまたぐ道すじを右の端から描き始められるように）。
  const wrap = (lon) => (lon < west ? lon + 360 : lon > west + 360 ? lon - 360 : lon)
  const x = (lon) => (wrap(lon) - west) * (width / 360)
  const y = (lat) => (90 - lat) * (height / 180)
  const project = (lon, lat) => [x(lon), y(lat)]
  const box = { x: 0, y: 0, w: width, h: height }
  const ringPath = (ring) => {
    // 輪の重心が図の左の端より西なら、輪ごと右側へ回す（大陸が図の両端で切れないように）。
    const meanLon = ring.reduce((sum, [lon]) => sum + lon, 0) / ring.length
    const shift = meanLon < west ? 360 : meanLon > west + 360 ? -360 : 0
    return ring.map(([lon, lat], i) => `${i ? 'L' : 'M'}${((lon + shift - west) * (width / 360)).toFixed(1)},${y(lat).toFixed(1)}`).join(' ') + ' Z'
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '六大陸と三大洋の図'} data-subject-figure-overview>
      <rect x="0" y="0" width={width} height={height} fill={SEA} />
      {GLOBE_LAND.map((ring, index) => <path key={index} d={ringPath(ring)} fill="#d6e7c7" stroke="#9ca38f" strokeWidth={0.4 * u} />)}
      <line x1="0" x2={width} y1={y(0)} y2={y(0)} stroke="#94a3b8" strokeWidth={0.8 * u} strokeDasharray={`${3 * u} ${2 * u}`} />
      <Arrows arrows={figure.arrows} project={project} u={u} box={box} />
      {(figure.points ?? []).map((point, index) => {
        const [px, py] = project(point.lon, point.lat)
        return <Point key={`point-${index}`} x={px} y={py} label={point.label} text={point.text} u={u} flip={point.side ? point.side === 'left' : px > width * 0.62} box={box} />
      })}
      {(figure.labels ?? []).map((label, index) => (
        <Halo key={index} x={clampTextX(x(label.lon), label.text, (label.size ?? 10) * u, box, 'middle', 2 * u)} y={y(label.lat)} u={u} size={label.size ?? 10} weight="800" color={label.color ?? INK} anchor="middle">{label.text}</Halo>
      ))}
    </svg>
  )
}
