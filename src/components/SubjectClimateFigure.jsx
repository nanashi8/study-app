import { CLIMATE_STATIONS } from '../data/subjects/climate.js'

// 雨温図（棒＝月の降水量、折れ線＝月の平均気温）。{ type: 'climate', station: 'tokyo' }（地点は data/subjects/climate.js）。
//   hideName: true と label: 'A' … 問題で地点名をふせる
//   judge: true … 気候帯を見分ける目安の線（18℃・10℃・-3℃）と、最も暖かい月・寒い月の気温を図に出す
//   axis: { tMin } … 気温の目もりの下の端（並べて比べる図で、目もりをそろえるとき）
// 目もりは、気温10℃と降水量100mmが同じ高さ。気温の下の端が降水量0mm。

const INK = '#1f2937'
const GRID = '#e2e8f0'
const TEMP = '#dc2626'
const RAIN = '#60a5fa'
const JUDGE_LINES = Object.freeze([
  { t: 18, label: '18℃', color: '#c2410c' },
  { t: 10, label: '10℃', color: '#15803d' },
  { t: -3, label: '-3℃', color: '#1d4ed8' },
])

/** 数を、マイナスの記号を「−」にして書く。 */
export const signed = (value) => (value < 0 ? `−${Math.abs(value)}` : `${value}`)

const round1 = (value) => Math.round(value * 10) / 10

/** 地点の気温の最低の月・最高の月・年平均・年降水量。 */
export function climateSummary(station) {
  const coldest = station.temp.reduce((best, t, month) => (t < station.temp[best] ? month : best), 0)
  const warmest = station.temp.reduce((best, t, month) => (t > station.temp[best] ? month : best), 0)
  return {
    coldest: { month: coldest + 1, temp: station.temp[coldest] },
    warmest: { month: warmest + 1, temp: station.temp[warmest] },
    average: round1(station.temp.reduce((sum, t) => sum + t, 0) / 12),
    total: Math.round(station.rain.reduce((sum, r) => sum + r, 0)),
  }
}

/** 気温の目もりの下の端。いちばん低い月の気温が入るように、-30℃より下へ10℃ずつ広げる。 */
export function climateAxisMin(station) {
  const lowest = Math.min(...station.temp)
  return Math.min(-30, Math.floor(lowest / 10) * 10)
}

export function ClimateFigure({ figure }) {
  const station = CLIMATE_STATIONS[figure.station]
  if (!station) return null
  const name = figure.hideName ? figure.label ?? '' : station.label
  const summary = climateSummary(station)
  const width = 300
  const height = 216
  const left = 30
  const right = 34
  const top = 16
  const bottom = 24
  const tMin = figure.axis?.tMin ?? climateAxisMin(station)
  const tMax = 40
  const rMax = (tMax - tMin) * 10
  const plotW = width - left - right
  const plotH = height - top - bottom
  const colW = plotW / 12
  const ty = (t) => top + ((tMax - t) / (tMax - tMin)) * plotH
  const ry = (r) => top + plotH - (Math.min(r, rMax) / rMax) * plotH
  const ticks = []
  for (let t = tMin; t <= tMax; t += 10) ticks.push(t)
  const cx = (month) => left + month * colW + colW / 2
  const judge = Boolean(figure.judge)
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={`${name}の雨温図`} data-subject-figure-climate>
        {ticks.map((t) => (
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
            fill={RAIN}
          />
        ))}
        {judge && JUDGE_LINES.filter((line) => line.t > tMin && line.t < tMax).map((line) => (
          <g key={`judge-${line.t}`}>
            <line x1={left} x2={width - right} y1={ty(line.t)} y2={ty(line.t)} stroke={line.color} strokeWidth="1.1" strokeDasharray="4 3" />
            <text x={width - right - 2} y={ty(line.t) - 2.5} textAnchor="end" fontSize="8.5" fontWeight="800" fill={line.color}>{line.label}</text>
          </g>
        ))}
        <polyline
          points={station.temp.map((t, month) => `${cx(month)},${ty(t)}`).join(' ')}
          fill="none"
          stroke={TEMP}
          strokeWidth="2.2"
        />
        {station.temp.map((t, month) => <circle key={`t-${month}`} cx={cx(month)} cy={ty(t)} r="2.4" fill={TEMP} />)}
        {judge && [summary.warmest, summary.coldest].map((point, index) => {
          const x = cx(point.month - 1)
          const y = ty(point.temp)
          const above = index === 0
          return (
            <g key={`extreme-${index}`}>
              <circle cx={x} cy={y} r="4.2" fill="#ffffff" stroke={TEMP} strokeWidth="2" />
              <text
                x={Math.min(width - right - 2, Math.max(left + 2, x))}
                y={above ? y - 7 : y + 13}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill="#991b1b"
                stroke="#ffffff"
                strokeWidth="2.5"
                paintOrder="stroke"
              >
                {`${signed(point.temp)}℃`}
              </text>
            </g>
          )
        })}
        {Array.from({ length: 12 }, (_, month) => (
          <text key={`m-${month}`} x={cx(month)} y={height - bottom + 12} textAnchor="middle" fontSize="9" fill={INK}>{month + 1}</text>
        ))}
        <text x={left - 4} y={top - 5} textAnchor="end" fontSize="9" fontWeight="700" fill="#b91c1c">℃</text>
        <text x={width - right + 4} y={top - 5} fontSize="9" fontWeight="700" fill="#1d4ed8">mm</text>
        <text x={width / 2} y={height - 2} textAnchor="middle" fontSize="9" fill={INK}>月</text>
      </svg>
      <p className="mt-1 text-center text-[11px] font-bold text-ink/60" data-subject-climate-summary>
        {`${name ? `${name}　` : ''}年平均気温 ${signed(summary.average)}℃・年降水量 ${summary.total.toLocaleString('ja-JP')}mm`}
      </p>
      {judge && (
        <p className="text-center text-[11px] font-bold text-ink/60" data-subject-climate-extremes>
          {`最も暖かい月 ${summary.warmest.month}月 ${signed(summary.warmest.temp)}℃・最も寒い月 ${summary.coldest.month}月 ${signed(summary.coldest.temp)}℃`}
        </p>
      )}
    </div>
  )
}
