import { nice } from '../../data/math-history/controls.js'
import {
  CHART_EXAMPLES,
  MEAN_BASE,
  RUN_TIMES,
  histogramBins,
  median,
} from '../../data/math-history/basic-data.js'
import { BLUE, GOOD, INK, MUTED, PAPER, ROSE, Stage, SvgText, WARM, apart, num } from './stage.jsx'

// 第1部「算数の基本」のデータの活用の話の図。

const rad = (degrees) => (degrees * Math.PI) / 180
// 円グラフ・帯グラフの色（話の色と重ならないよう、決まった5色を使う）。
const SLICE_TONES = [BLUE, WARM, GOOD, ROSE, MUTED]
const otherTone = (color) => apart(color, WARM, ROSE)

// ── 表とグラフ：同じデータを4つのグラフでかく ─────────────────────────
function ChartTypesScene({ values, color, markerId, label }) {
  const example = CHART_EXAMPLES[values.data]
  const type = values.type
  const rows = example.rows
  const total = rows.reduce((sum, [, value]) => sum + value, 0)
  const max = Math.max(...rows.map(([, value]) => value))
  const top = values.data === 'change' ? 100 : 16
  const tone = (index) => SLICE_TONES[index % SLICE_TONES.length]
  const plot = { left: 44, right: 340, top: 40, bottom: 180 }
  const xAt = (index) => plot.left + ((index + 0.5) * (plot.right - plot.left)) / rows.length
  const yAt = (value) => plot.bottom - (value / top) * (plot.bottom - plot.top)
  let content
  if (type === 'bar' || type === 'line') {
    content = (
      <g data-chart={type}>
        <line x1={plot.left} y1={plot.bottom} x2={plot.right} y2={plot.bottom} stroke={INK} strokeWidth="1.4" />
        <line x1={plot.left} y1={plot.bottom} x2={plot.left} y2={plot.top} stroke={INK} strokeWidth="1.4" />
        {[0, top / 2, top].map((tick) => (
          <SvgText key={tick} x={plot.left - 6} y={yAt(tick)} anchor="end" size={9} fill={MUTED}>{tick}</SvgText>
        ))}
        {type === 'bar'
          ? rows.map(([name, value], index) => (
            <rect key={name} x={xAt(index) - 14} y={yAt(value)} width="28" height={plot.bottom - yAt(value)} fill={color} />
          ))
          : (
            <polyline
              points={rows.map(([, value], index) => `${xAt(index)},${yAt(value)}`).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="2.6"
            />
          )}
        {type === 'line' && rows.map(([name, value], index) => <circle key={name} cx={xAt(index)} cy={yAt(value)} r="4" fill={color} />)}
        {rows.map(([name], index) => <SvgText key={name} x={xAt(index)} y={plot.bottom + 12} size={9} fill={MUTED}>{name}</SvgText>)}
      </g>
    )
  } else if (type === 'pie') {
    let angle = 90
    content = (
      <g data-chart="pie">
        {rows.map(([name, value], index) => {
          const sweep = (value / total) * 360
          const start = angle
          angle -= sweep
          const from = { x: 110 + 70 * Math.cos(rad(start)), y: 112 - 70 * Math.sin(rad(start)) }
          const to = { x: 110 + 70 * Math.cos(rad(angle)), y: 112 - 70 * Math.sin(rad(angle)) }
          const large = sweep > 180 ? 1 : 0
          return (
            <path
              key={name}
              d={`M110 112 L${from.x.toFixed(2)} ${from.y.toFixed(2)} A70 70 0 ${large} 1 ${to.x.toFixed(2)} ${to.y.toFixed(2)} Z`}
              fill={tone(index)}
              stroke={PAPER}
              strokeWidth="1.5"
            />
          )
        })}
        {rows.map(([name, value], index) => (
          <g key={name}>
            <rect x="214" y={42 + index * 26} width="12" height="12" fill={tone(index)} />
            <SvgText x="232" y={48 + index * 26} anchor="start" size={10}>{`${name} ${nice((value / total) * 100, 1)}%`}</SvgText>
          </g>
        ))}
      </g>
    )
  } else {
    let x = 30
    content = (
      <g data-chart="band">
        {rows.map(([name, value], index) => {
          const width = (value / total) * 300
          const left = x
          x += width
          return (
            <g key={name}>
              <rect x={left} y="80" width={width} height="40" fill={tone(index)} stroke={PAPER} strokeWidth="1.5" />
              <SvgText x={left + width / 2} y={index % 2 ? 140 : 66} size={9} fill={MUTED}>{name}</SvgText>
            </g>
          )
        })}
        <SvgText x="30" y="160" anchor="start" size={9} fill={MUTED}>0%</SvgText>
        <SvgText x="330" y="160" anchor="end" size={9} fill={MUTED}>100%</SvgText>
      </g>
    )
  }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="16" size={11} weight={800}>{example.title}</SvgText>
      {content}
      <SvgText x="180" y="210" size={10} fill={MUTED}>{`いちばん多いのは ${rows.find(([, value]) => value === max)[0]}（${max}${example.unit}）`}</SvgText>
    </Stage>
  )
}

// ── 平均と代表値：つり合う場所（平均）と真ん中（中央値） ──────────────────
function MeanBalanceScene({ values, color, markerId, label }) {
  const v = num(values.v)
  const data = [...MEAN_BASE, v]
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length
  const middle = median(data)
  const x = (value) => 30 + value * 15
  const stacks = {}
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <line x1="30" y1="130" x2="330" y2="130" stroke={INK} strokeWidth="2" />
      {Array.from({ length: 21 }, (_, tick) => (
        <g key={tick}>
          <line x1={x(tick)} y1="126" x2={x(tick)} y2="134" stroke={MUTED} strokeWidth="1" />
          {tick % 5 === 0 && <SvgText x={x(tick)} y="146" size={9} fill={MUTED}>{tick}</SvgText>}
        </g>
      ))}
      {data.map((value, index) => {
        stacks[value] = (stacks[value] ?? 0) + 1
        const last = index === data.length - 1
        return (
          <circle
            key={index}
            cx={x(value)}
            cy={130 - stacks[value] * 14}
            r="6"
            fill={last ? otherTone(color) : color}
            data-mean-dot={value}
          />
        )
      })}
      <path d={`M${x(mean)} 132 L${x(mean) - 10} 152 L${x(mean) + 10} 152 Z`} fill={color} data-mean-fulcrum={nice(mean, 2)} />
      <SvgText x={x(mean)} y="166" size={11} weight={800} fill={color}>{`平均 ${nice(mean, 2)}`}</SvgText>
      <line x1={x(middle)} y1="46" x2={x(middle)} y2="118" stroke={GOOD} strokeWidth="1.8" strokeDasharray="4 3" />
      <SvgText x={x(middle)} y="38" size={11} weight={800} fill={GOOD}>{`中央値 ${middle}`}</SvgText>
      <SvgText x="180" y="196" size={10} fill={MUTED}>▲の所で支えると、左右の点がつり合う（平均）</SvgText>
    </Stage>
  )
}

// ── 度数分布：ドットプロットと、階級の幅を変えた柱状グラフ ──────────────────
function HistogramBinsScene({ values, color, markerId, label }) {
  const width = num(values.width)
  const bins = histogramBins(RUN_TIMES, width)
  const x = (seconds) => 30 + ((seconds - 7) / 5) * 300
  const stacks = {}
  const maxCount = Math.max(...bins.map((bin) => bin.count))
  const barScale = 96 / Math.max(maxCount, 1)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="30" y="12" anchor="start" size={10} fill={MUTED}>30人の50m走の記録（例・秒）</SvgText>
      {RUN_TIMES.map((seconds, index) => {
        const key = nice(seconds, 1)
        stacks[key] = (stacks[key] ?? 0) + 1
        return <circle key={index} cx={x(seconds)} cy={52 - (stacks[key] - 1) * 8} r="3.4" fill={MUTED} />
      })}
      <line x1="30" y1="58" x2="330" y2="58" stroke={INK} strokeWidth="1.2" />
      {bins.map((bin) => {
        const from = Number(bin.from)
        const to = Number(bin.to)
        const height = bin.count * barScale
        return (
          <g key={bin.from} data-histogram-bin={`${bin.from}-${bin.to}`} data-histogram-count={bin.count}>
            <rect x={x(from)} y={188 - height} width={Math.max(0, x(Math.min(to, 12)) - x(from))} height={height} fill={`${color}55`} stroke={color} strokeWidth="1.4" />
            {bin.count > 0 && <SvgText x={(x(from) + x(Math.min(to, 12))) / 2} y={182 - height} size={9} fill={color}>{bin.count}</SvgText>}
          </g>
        )
      })}
      <line x1="30" y1="188" x2="330" y2="188" stroke={INK} strokeWidth="1.4" />
      {[7, 8, 9, 10, 11, 12].map((seconds) => <SvgText key={seconds} x={x(seconds)} y="202" size={9} fill={MUTED}>{seconds}</SvgText>)}
      <SvgText x="330" y="214" anchor="end" size={9} fill={MUTED}>{`階級の幅 ${width}秒`}</SvgText>
    </Stage>
  )
}

// ── 起こり得る場合：樹形図と、易の形を2進法で読む ──────────────────────
function BinaryTreeScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const value = Math.min(num(values.p), 2 ** n - 1)
  const bits = value.toString(2).padStart(n, '0').split('').map(Number)
  const levelY = (level) => 18 + (level * 172) / n
  const nodeX = (level, index) => 14 + ((index + 0.5) * 212) / 2 ** level
  const path = [0]
  bits.forEach((bit) => path.push(path.at(-1) * 2 + bit))
  const edges = []
  for (let level = 0; level < n; level += 1) {
    for (let index = 0; index < 2 ** level; index += 1) {
      for (const bit of [0, 1]) {
        const child = index * 2 + bit
        const onPath = path[level] === index && path[level + 1] === child
        edges.push({ key: `${level}-${index}-${bit}`, level, index, child, onPath })
      }
    }
  }
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {edges.map((edge) => (
        <line
          key={edge.key}
          x1={nodeX(edge.level, edge.index)}
          y1={levelY(edge.level)}
          x2={nodeX(edge.level + 1, edge.child)}
          y2={levelY(edge.level + 1)}
          stroke={edge.onPath ? color : MUTED}
          strokeOpacity={edge.onPath ? 1 : 0.45}
          strokeWidth={edge.onPath ? 2.6 : 0.8}
        />
      ))}
      <circle cx={nodeX(n, value)} cy={levelY(n)} r="4.5" fill={otherTone(color)} data-binary-leaf={value} />
      <SvgText x="120" y="212" size={10} fill={MUTED}>{`枝の先は全部で ${2 ** n} 通り`}</SvgText>
      {bits.map((bit, index) => {
        const y = 30 + index * 24
        return (
          <g key={index} data-binary-line={bit ? 'yang' : 'yin'}>
            {bit
              ? <rect x="254" y={y} width="64" height="10" rx="2" fill={color} />
              : (
                <>
                  <rect x="254" y={y} width="27" height="10" rx="2" fill={otherTone(color)} />
                  <rect x="291" y={y} width="27" height="10" rx="2" fill={otherTone(color)} />
                </>
              )}
            <SvgText x="336" y={y + 5} size={11} fill={bit ? color : otherTone(color)}>{bit}</SvgText>
          </g>
        )
      })}
      <SvgText x="290" y={Math.min(208, 46 + n * 24)} size={12} weight={800}>{`${bits.join('')}（2）＝ ${value}`}</SvgText>
    </Stage>
  )
}

export const DATA_SCENES = Object.freeze({
  'chart-types': ChartTypesScene,
  'mean-balance': MeanBalanceScene,
  'histogram-bins': HistogramBinsScene,
  'binary-tree': BinaryTreeScene,
})
