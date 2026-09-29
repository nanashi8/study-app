import { JAPAN_MAP, WORLD_MAP } from '../data/subjects/maps.js'
import { CLIMATE_STATIONS } from '../data/subjects/climate.js'
import { SubjectText } from './SubjectText.jsx'

// 社会・理科の図。要点と演習の問題が、データ（figure）で図を指定する。種類は次のとおり。
//   table    … 表。{ columns, rows, note? }
//   bars     … 横棒グラフ。{ unit, items: [[名前, 値], …], note? }
//   lines    … 折れ線グラフ。{ x: { label, ticks? }, y: { label, min?, max?, step? }, series: [{ name, points: [[x, y], …] }] }
//   climate  … 雨温図（棒＝月の降水量、折れ線＝月の平均気温）。{ station: 'tokyo' }（地点は data/subjects/climate.js）。
//              問題で地点名をふせるときは { station, hideName: true, label: 'A' }。
//   japanMap … 日本地図。{ marks: { 'JP-13': 'A' }, fills?: { 'JP-13': 色 }, regions?: true（7地方区分で色分け）}
//   worldMap … 世界地図。{ marks: { USA: 'A' }, fills?, states?: true（州で色分け）, lines?: ['equator', …] }
// どの図も caption（図の題）を持てる。色はテーマの色ではなく、読みやすい固定の色を使う。

const INK = '#1f2937'
const GRID = '#e2e8f0'
const SERIES_COLORS = Object.freeze(['#0f766e', '#be123c', '#1d4ed8', '#b45309', '#7c3aed'])

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

function Caption({ children }) {
  if (!children) return null
  return <p className="mb-1.5 px-1 text-xs font-extrabold text-ink/70"><SubjectText>{children}</SubjectText></p>
}

function Note({ children }) {
  if (!children) return null
  return <p className="mt-1.5 px-1 text-[11px] font-bold leading-relaxed text-ink/50"><SubjectText>{children}</SubjectText></p>
}

function TableFigure({ figure }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs font-bold text-ink" data-subject-figure-table>
        <thead>
          <tr>
            {figure.columns.map((column) => (
              <th key={column} scope="col" className="border border-slate-300 bg-slate-100 px-2 py-1.5 font-extrabold"><SubjectText>{column}</SubjectText></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {figure.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                cellIndex === 0
                  ? <th key={cellIndex} scope="row" className="border border-slate-300 bg-white px-2 py-1.5 font-extrabold"><SubjectText>{cell}</SubjectText></th>
                  : <td key={cellIndex} className="border border-slate-300 bg-white px-2 py-1.5 tabular-nums"><SubjectText>{cell}</SubjectText></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BarsFigure({ figure }) {
  const max = figure.max ?? Math.max(...figure.items.map(([, value]) => value))
  const rowHeight = 26
  const labelWidth = 92
  const width = 340
  const barWidth = width - labelWidth - 56
  const height = figure.items.length * rowHeight + 6
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '棒グラフ'} data-subject-figure-bars>
      {figure.items.map(([label, value], index) => {
        const y = 4 + index * rowHeight
        const w = Math.max(1, (value / max) * barWidth)
        return (
          <g key={label}>
            <text x={labelWidth - 6} y={y + 15} textAnchor="end" fontSize="11" fontWeight="700" fill={INK}>{label}</text>
            <rect x={labelWidth} y={y + 4} width={w} height={rowHeight - 10} rx="3" fill={SERIES_COLORS[0]} opacity="0.85" />
            <text x={labelWidth + w + 4} y={y + 15} fontSize="10.5" fontWeight="700" fill={INK}>{`${value}${figure.unit ?? ''}`}</text>
          </g>
        )
      })}
    </svg>
  )
}

const niceStep = (span) => {
  const raw = span / 5
  const power = 10 ** Math.floor(Math.log10(raw))
  const unit = raw / power
  return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * power
}

function LinesFigure({ figure }) {
  const width = 340
  const height = 220
  const left = 44
  const right = 12
  const top = 12
  const bottom = 38
  const points = figure.series.flatMap((series) => series.points)
  const xs = figure.x.ticks ?? [...new Set(points.map(([x]) => x))].sort((a, b) => a - b)
  const xMin = figure.x.min ?? Math.min(...xs)
  const xMax = figure.x.max ?? Math.max(...xs)
  const yMin = figure.y.min ?? Math.min(0, ...points.map(([, y]) => y))
  const yMaxRaw = figure.y.max ?? Math.max(...points.map(([, y]) => y))
  const yStep = figure.y.step ?? niceStep(yMaxRaw - yMin)
  const yMax = figure.y.max ?? Math.ceil(yMaxRaw / yStep) * yStep
  const sx = (x) => left + ((x - xMin) / (xMax - xMin || 1)) * (width - left - right)
  const sy = (y) => height - bottom - ((y - yMin) / (yMax - yMin || 1)) * (height - top - bottom)
  const yTicks = []
  for (let y = yMin; y <= yMax + 1e-9; y += yStep) yTicks.push(Math.round(y * 1000) / 1000)
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '折れ線グラフ'} data-subject-figure-lines>
        {yTicks.map((y) => (
          <g key={y}>
            <line x1={left} x2={width - right} y1={sy(y)} y2={sy(y)} stroke={GRID} />
            <text x={left - 4} y={sy(y) + 3.5} textAnchor="end" fontSize="10" fill={INK}>{y}</text>
          </g>
        ))}
        {xs.map((x) => (
          <text key={x} x={sx(x)} y={height - bottom + 14} textAnchor="middle" fontSize="10" fill={INK}>{x}</text>
        ))}
        <line x1={left} x2={left} y1={top} y2={height - bottom} stroke={INK} />
        <line x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} stroke={INK} />
        <text x={(left + width - right) / 2} y={height - 6} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK}>{figure.x.label}</text>
        <text x={10} y={(top + height - bottom) / 2} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK} transform={`rotate(-90 10 ${(top + height - bottom) / 2})`}>{figure.y.label}</text>
        {figure.series.map((series, index) => {
          const color = series.color ?? SERIES_COLORS[index % SERIES_COLORS.length]
          return (
            <g key={series.name ?? index}>
              <polyline
                points={series.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2.2"
                strokeDasharray={series.dashed ? '5 4' : undefined}
              />
              {series.points.map(([x, y]) => <circle key={`${x}-${y}`} cx={sx(x)} cy={sy(y)} r="2.8" fill={color} />)}
            </g>
          )
        })}
      </svg>
      {figure.series.length > 1 && (
        <div className="mt-1 flex flex-wrap justify-center gap-3 text-[11px] font-bold text-ink/70">
          {figure.series.map((series, index) => (
            <span key={series.name} className="inline-flex items-center gap-1">
              <i className="inline-block h-1 w-4 rounded" style={{ backgroundColor: series.color ?? SERIES_COLORS[index % SERIES_COLORS.length] }} />
              {series.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ClimateFigure({ figure }) {
  const station = CLIMATE_STATIONS[figure.station]
  if (!station) return null
  const name = figure.hideName ? figure.label ?? '' : station.label
  const width = 300
  const height = 210
  const left = 34
  const right = 36
  const top = 16
  const bottom = 26
  const tMin = -30
  const tMax = 40
  const rMax = 700
  const plotW = width - left - right
  const plotH = height - top - bottom
  const colW = plotW / 12
  const ty = (t) => top + ((tMax - t) / (tMax - tMin)) * plotH
  const ry = (r) => top + plotH - (Math.min(r, rMax) / rMax) * plotH
  const average = (list) => Math.round((list.reduce((sum, value) => sum + value, 0) / list.length) * 10) / 10
  const total = Math.round(station.rain.reduce((sum, value) => sum + value, 0))
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={`${name}の雨温図`} data-subject-figure-climate>
        {[-30, -20, -10, 0, 10, 20, 30, 40].map((t) => (
          <g key={t}>
            <line x1={left} x2={width - right} y1={ty(t)} y2={ty(t)} stroke={t === 0 ? '#94a3b8' : GRID} />
            <text x={left - 4} y={ty(t) + 3.5} textAnchor="end" fontSize="9.5" fill="#b91c1c">{t}</text>
            <text x={width - right + 4} y={ty(t) + 3.5} fontSize="9.5" fill="#1d4ed8">{Math.round(((t - tMin) / (tMax - tMin)) * rMax)}</text>
          </g>
        ))}
        {station.rain.map((rain, month) => (
          <rect
            key={`rain-${month}`}
            x={left + month * colW + colW * 0.15}
            y={ry(rain)}
            width={colW * 0.7}
            height={top + plotH - ry(rain)}
            fill="#60a5fa"
          />
        ))}
        <polyline
          points={station.temp.map((t, month) => `${left + month * colW + colW / 2},${ty(t)}`).join(' ')}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.2"
        />
        {station.temp.map((t, month) => <circle key={`t-${month}`} cx={left + month * colW + colW / 2} cy={ty(t)} r="2.4" fill="#dc2626" />)}
        {Array.from({ length: 12 }, (_, month) => (
          <text key={`m-${month}`} x={left + month * colW + colW / 2} y={height - bottom + 12} textAnchor="middle" fontSize="9" fill={INK}>{month + 1}</text>
        ))}
        <text x={left - 4} y={top - 5} textAnchor="end" fontSize="9" fontWeight="700" fill="#b91c1c">℃</text>
        <text x={width - right + 4} y={top - 5} fontSize="9" fontWeight="700" fill="#1d4ed8">mm</text>
        <text x={width / 2} y={height - 3} textAnchor="middle" fontSize="9" fill={INK}>月</text>
      </svg>
      <p className="mt-1 text-center text-[11px] font-bold text-ink/60">
        {`${name ? `${name}　` : ''}年平均気温 ${average(station.temp)}℃・年降水量 ${total}mm`}
      </p>
    </div>
  )
}

function Mark({ x, y, label, size = 1 }) {
  const r = 9 * size
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#ffffff" stroke={INK} strokeWidth={1.4 * size} />
      <text x={x} y={y + 4 * size} textAnchor="middle" fontSize={11 * size} fontWeight="800" fill={INK}>{label}</text>
    </g>
  )
}

function JapanMapFigure({ figure }) {
  const marks = figure.marks ?? {}
  const fills = figure.fills ?? {}
  const { width, height, inset, prefectures, territories, lakes } = JAPAN_MAP
  const fillOf = (pref) => fills[pref.code] ?? (figure.regions ? JAPAN_REGION_META[pref.region].color : '#e2e8f0')
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '日本地図'} data-subject-figure-japan>
        <rect x="0" y="0" width={width} height={height} fill="#eff6ff" />
        <rect x={inset.x} y={inset.y} width={inset.w} height={inset.h} fill="#eff6ff" stroke="#94a3b8" strokeWidth="1.2" />
        {prefectures.map((pref) => (
          <path key={pref.code} d={pref.d} fill={fillOf(pref)} stroke="#ffffff" strokeWidth="0.9" strokeLinejoin="round" />
        ))}
        <path d={territories.northern} fill={fills.northern ?? (figure.regions ? JAPAN_REGION_META.hokkaido.color : '#e2e8f0')} stroke="#ffffff" strokeWidth="0.9" />
        <circle cx={territories.takeshima.x} cy={territories.takeshima.y} r="2.4" fill={figure.regions ? JAPAN_REGION_META.chugokuShikoku.color : '#cbd5e1'} stroke="#64748b" strokeWidth="0.6" />
        <circle cx={territories.senkaku.x} cy={territories.senkaku.y} r="2.4" fill={figure.regions ? JAPAN_REGION_META.kyushu.color : '#cbd5e1'} stroke="#64748b" strokeWidth="0.6" />
        {lakes.map((lake) => <path key={lake.name} d={lake.d} fill="#bfdbfe" stroke="#93c5fd" strokeWidth="0.6" />)}
        {prefectures.filter((pref) => marks[pref.code]).map((pref) => (
          <Mark key={pref.code} x={pref.x} y={pref.y} label={marks[pref.code]} size={1.5} />
        ))}
      </svg>
      {figure.regions && (
        <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-bold text-ink/70">
          {Object.values(JAPAN_REGION_META).map((region) => (
            <span key={region.label} className="inline-flex items-center gap-1">
              <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: region.color }} />
              {region.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const WORLD_LINE_LABELS = Object.freeze({
  equator: '赤道',
  tropicN: '北回帰線',
  tropicS: '南回帰線',
  primeMeridian: '本初子午線',
  meridian180: '180度の経線',
  meridian135: '東経135度',
})

function WorldMapFigure({ figure }) {
  const marks = figure.marks ?? {}
  const fills = figure.fills ?? {}
  const { width, height, lines, countries } = WORLD_MAP
  const fillOf = (country) => fills[country.code] ?? (figure.states ? WORLD_STATE_META[country.state].color : '#e2e8f0')
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '世界地図'} data-subject-figure-world>
        <rect x="0" y="0" width={width} height={height} fill="#eff6ff" />
        {countries.filter((country) => country.d).map((country) => (
          <path key={country.code} d={country.d} fill={fillOf(country)} stroke="#ffffff" strokeWidth="0.5" strokeLinejoin="round" />
        ))}
        {(figure.lines ?? []).map((line) => {
          const value = lines[line]
          const horizontal = line === 'equator' || line.startsWith('tropic')
          return horizontal ? (
            <g key={line}>
              <line x1="0" x2={width} y1={value} y2={value} stroke="#dc2626" strokeWidth="1" strokeDasharray="5 3" />
              <text x="4" y={value - 3} fontSize="10" fontWeight="700" fill="#b91c1c">{WORLD_LINE_LABELS[line]}</text>
            </g>
          ) : (
            <g key={line}>
              <line x1={value} x2={value} y1="0" y2={height} stroke="#dc2626" strokeWidth="1" strokeDasharray="5 3" />
              <text x={value + 3} y={height - 6} fontSize="10" fontWeight="700" fill="#b91c1c">{WORLD_LINE_LABELS[line]}</text>
            </g>
          )
        })}
        {countries.filter((country) => marks[country.code]).map((country) => (
          <Mark key={country.code} x={country.x} y={country.y} label={marks[country.code]} />
        ))}
      </svg>
      {figure.states && (
        <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-bold text-ink/70">
          {Object.values(WORLD_STATE_META).map((state) => (
            <span key={state.label} className="inline-flex items-center gap-1">
              <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: state.color }} />
              {state.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const FIGURES = Object.freeze({
  table: TableFigure,
  bars: BarsFigure,
  lines: LinesFigure,
  climate: ClimateFigure,
  japanMap: JapanMapFigure,
  worldMap: WorldMapFigure,
})

export const SUBJECT_FIGURE_TYPES = Object.freeze(Object.keys(FIGURES))

export function SubjectFigure({ figure }) {
  const Figure = FIGURES[figure?.type]
  if (!Figure) return null
  return (
    <figure className="m-0" data-subject-figure={figure.type}>
      <Caption>{figure.caption}</Caption>
      <Figure figure={figure} />
      <Note>{figure.note}</Note>
    </figure>
  )
}
