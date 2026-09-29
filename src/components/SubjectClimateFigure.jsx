import { CLIMATE_STATIONS } from '../data/subjects/climate.js'
import { textWidth } from './SubjectMapFigures.jsx'

// 雨温図（棒＝月の降水量、折れ線＝月の平均気温）。{ type: 'climate', station: 'tokyo' }（地点は data/subjects/climate.js）。
//   hideName: true と label: 'A' … 問題で地点名をふせる
//   judge: true … 気候帯を見分ける目安の線（18℃・10℃・−3℃）と、最も暖かい月・寒い月の気温を図に出す
//   axis: { tMin } … 気温の目もりの下の端（並べて比べる図で、目もりをそろえるとき）
// 目もりは、気温10℃と降水量100mmが同じ高さ。気温の下の端が降水量0mm。

const INK = '#1f2937'
const GRID = '#e2e8f0'
const TEMP = '#dc2626'
const RAIN = '#60a5fa'
const JUDGE_LINES = Object.freeze([
  { t: 18, label: '18℃', color: '#c2410c' },
  { t: 10, label: '10℃', color: '#15803d' },
  { t: -3, label: '−3℃', color: '#1d4ed8' },
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

/** 文字の四角（x0〜x1・y0〜y1）。y は文字の下の線。 */
function textBox(x, y, text, size, anchor) {
  const width = textWidth(text, size)
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2
  return { x0, x1: x0 + width, y0: y - size * 0.82, y1: y + size * 0.22 }
}

const overlaps = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1

/** 四角が、気温の折れ線（点と線）にかかるか。pad は四角の周りにあける幅。 */
function hitsLine(rect, points, pad) {
  const inside = ([x, y]) => x > rect.x0 - pad && x < rect.x1 + pad && y > rect.y0 - pad && y < rect.y1 + pad
  for (let i = 0; i < points.length; i += 1) {
    if (inside(points[i])) return true
    if (i === 0) continue
    const [ax, ay] = points[i - 1]
    const [bx, by] = points[i]
    for (let k = 1; k < 16; k += 1) {
      if (inside([ax + ((bx - ax) * k) / 16, ay + ((by - ay) * k) / 16])) return true
    }
  }
  return false
}

/**
 * 候補の置き場所から、折れ線とほかの文字にかからない最初の場所を選ぶ。
 * 降水量の棒（bars）にもかからない場所を先に探し、なければ棒の上に重ねる。どれもかかるなら最初の候補。
 */
function placeText(candidates, { points, pad, taken, bars, bounds }) {
  const fits = (candidate, avoidBars) => {
    const rect = textBox(candidate.x, candidate.y, candidate.text, candidate.size, candidate.anchor)
    if (rect.x0 < bounds.x0 || rect.x1 > bounds.x1 || rect.y0 < bounds.y0 || rect.y1 > bounds.y1) return false
    if (avoidBars && bars.some((bar) => overlaps(rect, bar))) return false
    return !hitsLine(rect, points, pad) && !taken.some((other) => overlaps(rect, other))
  }
  const chosen = candidates.find((candidate) => fits(candidate, true)) ?? candidates.find((candidate) => fits(candidate, false)) ?? candidates[0]
  taken.push(textBox(chosen.x, chosen.y, chosen.text, chosen.size, chosen.anchor))
  return chosen
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
  // 目安の線の文字と、最も暖かい月・寒い月の気温の文字を、折れ線やおたがいに重ならない場所へ置く。
  const linePoints = station.temp.map((t, month) => [cx(month), ty(t)])
  const taken = []
  const bars = station.rain.map((rain, month) => ({ x0: left + month * colW + colW * 0.15, x1: left + month * colW + colW * 0.85, y0: ry(rain), y1: top + plotH }))
  const bounds = { x0: left, x1: width - right, y0: 0, y1: top + plotH }
  const extremes = judge
    ? [summary.warmest, summary.coldest].map((point, index) => {
        const x = cx(point.month - 1)
        const y = ty(point.temp)
        const text = `${signed(point.temp)}℃`
        const edge = x < left + 24 ? { anchor: 'start', x: x - 4 } : x > width - right - 24 ? { anchor: 'end', x: x + 4 } : { anchor: 'middle', x }
        const above = { ...edge, y: y - 7 }
        const below = { ...edge, y: y + 13 }
        const beside = [{ anchor: 'start', x: x + 6, y: y + 3 }, { anchor: 'end', x: x - 6, y: y + 3 }]
        const order = index === 0 ? [above, below, ...beside] : [below, above, ...beside]
        taken.push({ x0: x - 5, x1: x + 5, y0: y - 5, y1: y + 5 })
        return { x, y, label: placeText(order.map((c) => ({ ...c, text, size: 9 })), { points: linePoints, pad: 1.5, taken, bars, bounds }) }
      })
    : []
  const judgeLabels = judge
    ? JUDGE_LINES.filter((line) => line.t > tMin && line.t < tMax).map((line) => {
        // 右の端から左へ半月ずつずらして、線の上・下の空いた場所を探す。月の点のすぐそばには置かない（その月の気温と見まちがえる）。
        const y = ty(line.t)
        const order = []
        for (let step = 0; step <= 22; step += 1) {
          const x = width - right - 2 - (step * colW) / 2
          order.push({ anchor: 'end', x, y: y - 2.5 }, { anchor: 'end', x, y: y + 9 })
        }
        return { ...line, y, label: placeText(order.map((c) => ({ ...c, text: line.label, size: 8.5 })), { points: linePoints, pad: 4, taken, bars, bounds }) }
      })
    : []
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
        {judgeLabels.map((line) => (
          <line key={`judge-${line.t}`} x1={left} x2={width - right} y1={line.y} y2={line.y} stroke={line.color} strokeWidth="1.1" strokeDasharray="4 3" />
        ))}
        <polyline
          points={station.temp.map((t, month) => `${cx(month)},${ty(t)}`).join(' ')}
          fill="none"
          stroke={TEMP}
          strokeWidth="2.2"
        />
        {station.temp.map((t, month) => <circle key={`t-${month}`} cx={cx(month)} cy={ty(t)} r="2.4" fill={TEMP} />)}
        {extremes.map((point, index) => (
          <circle key={`extreme-${index}`} cx={point.x} cy={point.y} r="4.2" fill="#ffffff" stroke={TEMP} strokeWidth="2" />
        ))}
        {judgeLabels.map((line) => (
          <text key={`judge-text-${line.t}`} x={line.label.x} y={line.label.y} textAnchor={line.label.anchor} fontSize="8.5" fontWeight="800" fill={line.color} stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke">
            {line.label.text}
          </text>
        ))}
        {extremes.map((point, index) => (
          <text key={`extreme-text-${index}`} x={point.label.x} y={point.label.y} textAnchor={point.label.anchor} fontSize="9" fontWeight="800" fill="#991b1b" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke">
            {point.label.text}
          </text>
        ))}
        {Array.from({ length: 12 }, (_, month) => (
          <text key={`m-${month}`} x={cx(month)} y={height - bottom + 12} textAnchor="middle" fontSize="9" fill={INK}>{month + 1}</text>
        ))}
        <text x={left - 4} y={top - 5} textAnchor="end" fontSize="9" fontWeight="700" fill="#b91c1c">℃</text>
        <text x={width - right + 4} y={top - 5} fontSize="9" fontWeight="700" fill="#1d4ed8">mm</text>
        <text x={width / 2} y={height - 2} textAnchor="middle" fontSize="9" fill={INK}>月</text>
      </svg>
      {/* 行が折り返すときは「・」の切れ目で折り返す（数と単位を分けない）。 */}
      <p className="mt-1 text-center text-[11px] font-bold text-ink/60" data-subject-climate-summary>
        {name && <span className="mr-[1em] inline-block">{name}</span>}
        <span className="inline-block">{`年平均気温 ${signed(summary.average)}℃・`}</span>
        <span className="inline-block">{`年降水量 ${summary.total.toLocaleString('ja-JP')}mm`}</span>
      </p>
      {judge && (
        <p className="text-center text-[11px] font-bold text-ink/60" data-subject-climate-extremes>
          <span className="inline-block">{`最も暖かい月 ${summary.warmest.month}月 ${signed(summary.warmest.temp)}℃・`}</span>
          <span className="inline-block">{`最も寒い月 ${summary.coldest.month}月 ${signed(summary.coldest.temp)}℃`}</span>
        </p>
      )}
    </div>
  )
}
