import { SubjectText } from './SubjectText.jsx'
import { ClimateFigure, climateAxisMax, climateAxisMin } from './SubjectClimateFigure.jsx'
import { AzimuthalMapFigure, JapanMapFigure, WorldMapFigure, WorldOverviewFigure } from './SubjectMapFigures.jsx'
import { DiagramFigure } from './SubjectDiagrams.jsx'
import { PeriodsFigure, RatioFigure, RelationFigure } from './SubjectFigureKinds.jsx'
import { ZoomableFigure } from './SubjectFigureZoom.jsx'
import { CLIMATE_STATIONS } from '../data/subjects/climate.js'

export { JAPAN_REGION_META, WORLD_STATE_META } from './SubjectMapFigures.jsx'

// 社会・理科の図。要点と演習の問題が、データ（figure）で図を指定する。種類は次のとおり。
//   table    … 表。{ columns, rows, note?, layout?: 'cards' | 'grid' }（列が4つ以上で長い文があれば、行ごとのカードで見せる。
//               列が2つのカードは欄が1つなので、欄の見出しを出さない）
//   bars     … 横棒グラフ。{ unit, items: [[名前, 値], …], note?, digits?（小数の桁をそろえる） }
//   lines    … 折れ線グラフ。{ x: { label, ticks? }, y: { label, min?, max?, step? }, series: [{ name, points: [[x, y], …] }],
//               marks?: [{ x? | y?, text?, at?（横の線の文字を置く x） }] }
//   climate  … 雨温図。{ station: 'tokyo', judge?, hideName?, label?, axis? }（SubjectClimateFigure.jsx）
//   japanMap … 日本地図。worldMap … 世界地図（SubjectMapFigures.jsx。切り出し・緯線経線・点・矢印・文字）
//   azimuthalMap … 東京を中心とした、中心からの距離と方位が正しい地図（正距方位図法）
//   worldOverview … 陸と海の世界全図（南極大陸まで。国境なし）
//   diagram  … 名前で呼び出す図解。{ name: 'latitude', … }（SubjectDiagrams.jsx）
//   decision … 判断の手順。{ steps: [{ ask, yes }], otherwise }（上から順に「はい」なら右の答え、「いいえ」なら次へ）
//   chain    … 流れ・順序・循環。{ items: [文, …], loop? }
//   timeline … 年表。{ groups: [{ era?, events: [[年, できごと], …] }] }
//   tree     … しくみの図（組織・分類の枝分かれ）。{ root: { text, children?: [{ text, children? }, …] } }
//   relation … しくみの図（箱と矢印）。ratio … 帯グラフ。periods … 時代の帯（SubjectFigureKinds.jsx）
//   set      … 図を並べて比べる。{ items: [図, …], layout?: 'stack' | 'scroll' }
// どの図も caption（図の題）と note（図の下の注）を持てる。要点の図は guide（図の読み方：何を表すか・どこを見るか・
// 特徴・判断の仕方を順に書いた文の並び）を持ち、単元のページで図の下に出す（演習の図の読み取り方は、答えたあとの解説に出す）。
// 色はテーマの色ではなく、読みやすい固定の色を使う。

const INK = '#1f2937'
const GRID = '#e2e8f0'
const SERIES_COLORS = Object.freeze(['#0f766e', '#be123c', '#1d4ed8', '#b45309', '#7c3aed'])

function Caption({ children }) {
  if (!children) return null
  return <p className="mb-1.5 px-1 text-xs font-extrabold text-ink/70"><SubjectText>{children}</SubjectText></p>
}

function Note({ children }) {
  if (!children) return null
  return <p className="mt-1.5 px-1 text-[11px] font-bold leading-relaxed text-ink/50"><SubjectText>{children}</SubjectText></p>
}

/** 図の読み方（要点の図の下に出す）。 */
export function FigureGuide({ guide }) {
  if (!Array.isArray(guide) || !guide.length) return null
  return (
    <div className="mt-2 rounded-xl border border-emerald-100 bg-white px-3 py-2.5" data-subject-figure-guide>
      <p className="text-[11px] font-extrabold tracking-wide text-emerald-700">図の読み方</p>
      <ol className="mt-1.5 space-y-1.5">
        {guide.map((step, index) => (
          <li key={step} className="flex items-start gap-2 text-[13px] font-bold leading-relaxed text-ink/80">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-extrabold text-white">{index + 1}</span>
            <span className="min-w-0 flex-1"><SubjectText>{step}</SubjectText></span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** 列が4つ以上で、長い文の入った表か。画面の幅では1文字ずつ折れて読みにくいので、行ごとのカードにする。 */
const tableAsCards = (figure) =>
  figure.layout === 'cards' ||
  (figure.layout !== 'grid' && figure.columns.length >= 4 && figure.rows.some((row) => row.slice(1).some((cell) => [...String(cell)].length > 20)))

function TableFigure({ figure }) {
  const highlight = new Set(figure.highlight ?? [])
  if (tableAsCards(figure)) {
    // 欄が1つだけのカードに、同じ見出しを何枚も並べない。
    const soleField = figure.columns.length === 2
    return (
      <div className="space-y-2" data-subject-figure-table="cards">
        {figure.rows.map((row, rowIndex) => (
          <section key={rowIndex} className={`rounded-xl border border-slate-300 px-3 py-2 ${highlight.has(rowIndex) ? 'bg-amber-50' : 'bg-white'}`}>
            <h4 className="text-sm font-black text-ink"><SubjectText>{row[0]}</SubjectText></h4>
            <dl className="mt-1 space-y-1.5">
              {row.slice(1).map((cell, cellIndex) => (
                <div key={cellIndex}>
                  {!soleField && <dt className="text-[11px] font-extrabold text-ink/50"><SubjectText>{figure.columns[cellIndex + 1]}</SubjectText></dt>}
                  <dd className="text-xs font-bold leading-relaxed text-ink"><SubjectText>{cell}</SubjectText></dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    )
  }
  // 行の見出し（1列目）が短い表は、見出しを1行に収める（「インドネシ／ア」のように折れないように）。
  // ほかの列も、3字以下の短い中身（うろこ・変温など）は折り返さない。
  const shortHeads = figure.rows.every((row) => [...String(row[0])].length <= 7)
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs font-bold text-ink" data-subject-figure-table>
        <thead>
          <tr>
            {figure.columns.map((column, columnIndex) => (
              <th key={column} scope="col" className={`border border-slate-300 bg-slate-100 px-2 py-1.5 font-extrabold ${(columnIndex === 0 && shortHeads && [...String(column)].length <= 7) || [...String(column)].length <= 3 ? 'whitespace-nowrap' : ''}`}><SubjectText>{column}</SubjectText></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {figure.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={highlight.has(rowIndex) ? 'bg-amber-50' : undefined}>
              {row.map((cell, cellIndex) => (
                cellIndex === 0
                  ? <th key={cellIndex} scope="row" className={`border border-slate-300 px-2 py-1.5 font-extrabold ${shortHeads ? 'whitespace-nowrap' : ''} ${highlight.has(rowIndex) ? 'bg-amber-50' : 'bg-white'}`}><SubjectText>{cell}</SubjectText></th>
                  : <td key={cellIndex} className={`border border-slate-300 px-2 py-1.5 leading-relaxed ${[...String(cell)].length <= 3 ? 'whitespace-nowrap' : ''} ${highlight.has(rowIndex) ? 'bg-amber-50' : 'bg-white'}`}><SubjectText>{cell}</SubjectText></td>
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
  const labelWidth = figure.labelWidth ?? 92
  const width = 340
  const barWidth = width - labelWidth - 60
  const height = figure.items.length * rowHeight + 6
  const highlight = new Set(figure.highlight ?? [])
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={figure.caption ?? '棒グラフ'} data-subject-figure-bars>
      {figure.items.map(([label, value], index) => {
        const y = 4 + index * rowHeight
        const w = Math.max(1, (value / max) * barWidth)
        return (
          <g key={label}>
            <text x={labelWidth - 6} y={y + 15} textAnchor="end" fontSize="11" fontWeight="700" fill={INK}>{label}</text>
            <rect x={labelWidth} y={y + 4} width={w} height={rowHeight - 10} rx="3" fill={highlight.has(index) ? '#be123c' : SERIES_COLORS[0]} opacity="0.85" />
            <text x={labelWidth + w + 4} y={y + 15} fontSize="10.5" fontWeight="700" fill={INK}>{`${value.toLocaleString('ja-JP', figure.digits === undefined ? undefined : { minimumFractionDigits: figure.digits, maximumFractionDigits: figure.digits })}${figure.unit ?? ''}`}</text>
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
  // 横の軸は、目もりの外にある値（最後の年など）も入るように広げる。
  const xMin = figure.x.min ?? Math.min(...xs, ...points.map(([x]) => x))
  const xMax = figure.x.max ?? Math.max(...xs, ...points.map(([x]) => x))
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
        {/* 横の目もりの文字は、縦の目もりのいちばん下の文字（左下の角）と重ならない高さに置く。 */}
        {xs.map((x) => (
          <text key={x} x={sx(x)} y={height - bottom + 16} textAnchor="middle" fontSize="10" fill={INK}>{x}</text>
        ))}
        <line x1={left} x2={left} y1={top} y2={height - bottom} stroke={INK} />
        <line x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} stroke={INK} />
        <text x={(left + width - right) / 2} y={height - 6} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK}>{figure.x.label}</text>
        <text x={10} y={(top + height - bottom) / 2} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK} transform={`rotate(-90 10 ${(top + height - bottom) / 2})`}>{figure.y.label}</text>
        {(figure.marks ?? []).map((mark, index) => (
          <g key={`mark-${index}`}>
            {mark.x !== undefined && <line x1={sx(mark.x)} x2={sx(mark.x)} y1={top} y2={height - bottom} stroke="#94a3b8" strokeDasharray="3 3" />}
            {mark.y !== undefined && <line x1={left} x2={width - right} y1={sy(mark.y)} y2={sy(mark.y)} stroke="#94a3b8" strokeDasharray="3 3" />}
            {mark.text && (
              <text x={mark.x !== undefined ? sx(mark.x) + 3 : mark.at !== undefined ? sx(mark.at) : left + 4} y={mark.y !== undefined ? sy(mark.y) - 4 : top + 10} fontSize="10" fontWeight="800" fill="#475569" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke">{mark.text}</text>
            )}
          </g>
        ))}
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
              <SubjectText>{series.name}</SubjectText>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function DecisionFigure({ figure }) {
  return (
    <div data-subject-figure-decision>
      {figure.steps.map((step, index) => (
        <div key={step.ask}>
          <div className="rounded-xl border border-slate-300 bg-white px-2.5 py-2">
            <p className="flex items-start gap-1.5 text-[12.5px] font-extrabold leading-snug text-ink">
              <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] text-white">{index + 1}</span>
              <span className="min-w-0 flex-1"><SubjectText>{step.ask}</SubjectText></span>
            </p>
            <p className="mt-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[12px] font-bold leading-snug text-emerald-900">
              <span className="mr-1 font-extrabold text-emerald-700">はい →</span>
              <SubjectText>{step.yes}</SubjectText>
            </p>
          </div>
          <p className="py-0.5 pl-3 text-[11px] font-extrabold text-rose-700">いいえ ↓</p>
        </div>
      ))}
      <div className="rounded-xl bg-emerald-50 px-2.5 py-2 text-[12.5px] font-extrabold leading-snug text-emerald-900 ring-1 ring-emerald-200">
        <SubjectText>{figure.otherwise}</SubjectText>
      </div>
    </div>
  )
}

function ChainFigure({ figure }) {
  return (
    <div data-subject-figure-chain>
      {figure.items.map((item, index) => (
        <div key={item}>
          {index > 0 && <p className="py-0.5 text-center text-sm font-extrabold leading-none text-slate-500" aria-hidden="true">↓</p>}
          <div className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-[12.5px] font-bold leading-relaxed text-ink">
            <SubjectText>{item}</SubjectText>
          </div>
        </div>
      ))}
      {figure.loop && (
        <p className="pt-1 text-center text-[11px] font-extrabold text-slate-500">↺ 最初にもどって、くり返す</p>
      )}
    </div>
  )
}

function TimelineFigure({ figure }) {
  return (
    <div className="space-y-2" data-subject-figure-timeline>
      {figure.groups.map((group, groupIndex) => (
        <div key={group.era ?? groupIndex}>
          {group.era && <p className="mb-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700"><SubjectText>{group.era}</SubjectText></p>}
          <ol className="relative ml-1 border-l-2 border-slate-300">
            {group.events.map(([year, text]) => (
              <li key={`${year}-${text}`} className="relative flex gap-2 py-1 pl-3">
                <span className="absolute -left-[5px] top-2.5 h-2 w-2 rounded-full bg-slate-600" aria-hidden="true" />
                <span className="w-14 shrink-0 text-[12px] font-extrabold tabular-nums text-slate-700"><SubjectText>{String(year)}</SubjectText></span>
                <span className="min-w-0 flex-1 text-[12.5px] font-bold leading-snug text-ink"><SubjectText>{text}</SubjectText></span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

function TreeNode({ node, depth }) {
  const box = depth === 0
    ? 'border-slate-700 bg-slate-700 text-white'
    : node.children?.length
      ? 'border-slate-400 bg-slate-100 text-ink'
      : 'border-slate-300 bg-white text-ink'
  return (
    <li className={depth === 0 ? '' : "relative before:absolute before:-left-3 before:top-[13px] before:h-0.5 before:w-3 before:bg-slate-300 before:content-['']"}>
      <div className={`inline-block max-w-full rounded-lg border px-2 py-1 text-[12px] font-bold leading-snug ${box}`}>
        <SubjectText>{node.text}</SubjectText>
      </div>
      {node.children?.length > 0 && (
        <ul className="ml-3 mt-1 space-y-1 border-l-2 border-slate-300 pl-3">
          {node.children.map((child, index) => <TreeNode key={`${child.text}-${index}`} node={child} depth={depth + 1} />)}
        </ul>
      )}
    </li>
  )
}

function TreeFigure({ figure }) {
  return (
    <ul className="space-y-1" data-subject-figure-tree>
      <TreeNode node={figure.root} depth={0} />
    </ul>
  )
}

function SetFigure({ figure }) {
  // 雨温図を並べるときは、目もりの下の端と上の端をそろえて比べられるようにする。
  const climateItems = figure.items.filter((item) => item.type === 'climate' && CLIMATE_STATIONS[item.station])
  const tMin = climateItems.length ? Math.min(...climateItems.map((item) => climateAxisMin(CLIMATE_STATIONS[item.station]))) : null
  const tMax = climateItems.length ? Math.max(...climateItems.map((item) => climateAxisMax(CLIMATE_STATIONS[item.station], tMin))) : null
  const items = figure.items.map((item) => (item.type === 'climate' && tMin !== null ? { ...item, axis: { tMin, tMax, ...item.axis } } : item))
  if (figure.layout === 'scroll') {
    return (
      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1" data-subject-figure-set="scroll">
        {items.map((item, index) => (
          <div key={index} className="w-[78%] shrink-0 snap-start rounded-xl bg-white p-1.5">
            <SubjectFigure figure={item} />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3" data-subject-figure-set="stack">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl bg-white p-1.5">
          <SubjectFigure figure={item} />
        </div>
      ))}
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
  azimuthalMap: AzimuthalMapFigure,
  worldOverview: WorldOverviewFigure,
  diagram: DiagramFigure,
  decision: DecisionFigure,
  chain: ChainFigure,
  timeline: TimelineFigure,
  tree: TreeFigure,
  relation: RelationFigure,
  ratio: RatioFigure,
  periods: PeriodsFigure,
  set: SetFigure,
})

export const SUBJECT_FIGURE_TYPES = Object.freeze(Object.keys(FIGURES))
/** svg で描く図の種類。押すと（「大きく見る」でも）画面いっぱいに大きくして見られる（SubjectFigureZoom.jsx）。 */
export const ZOOMABLE_FIGURE_TYPES = Object.freeze(['bars', 'lines', 'climate', 'japanMap', 'worldMap', 'azimuthalMap', 'worldOverview', 'diagram', 'relation', 'ratio', 'periods'])

export function SubjectFigure({ figure, showGuide = false }) {
  const Figure = FIGURES[figure?.type]
  if (!Figure) return null
  return (
    <figure className="m-0" data-subject-figure={figure.type}>
      {ZOOMABLE_FIGURE_TYPES.includes(figure.type)
        ? (
          <ZoomableFigure caption={figure.caption} renderCaption={<Caption>{figure.caption}</Caption>}>
            <Figure figure={figure} />
          </ZoomableFigure>
        )
        : (
          <>
            <Caption>{figure.caption}</Caption>
            <Figure figure={figure} />
          </>
        )}
      <Note>{figure.note}</Note>
      {showGuide && <FigureGuide guide={figure.guide} />}
    </figure>
  )
}
