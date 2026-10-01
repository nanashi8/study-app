// 公民の図解（三権分立など）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。矢印には番号を付け、番号の意味は図の下の表で示す。
import { Halo } from './SubjectMapFigures.jsx'

const INK = '#1f2937'
const POWER = '#334155'
const PEOPLE = '#b45309'

function Box({ x, y, w, h, title, sub, dark = true }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="9" fill={dark ? POWER : '#fef3c7'} stroke={dark ? POWER : PEOPLE} strokeWidth="1.4" />
      <text x={x} y={sub ? y - 1 : y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={dark ? '#ffffff' : '#78350f'}>{title}</text>
      {sub && <text x={x} y={y + 13} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={dark ? '#e2e8f0' : '#92400e'}>{sub}</text>}
    </g>
  )
}

/** 番号つきの矢印。from→to に引き、線の t の位置に番号の丸を置く。 */
function NumberedArrow({ from, to, number, t = 0.5, color }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const head = (a) => `${x2 + 8 * Math.cos(angle + a)},${y2 + 8 * Math.sin(angle + a)}`
  const cx = x1 + (x2 - x1) * t
  const cy = y1 + (y2 - y1) * t
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 4 * Math.cos(angle)} y2={y2 - 4 * Math.sin(angle)} stroke={color} strokeWidth="2" />
      <path d={`M${x2},${y2} L${head(Math.PI * 0.84)} L${head(-Math.PI * 0.84)} Z`} fill={color} />
      <circle cx={cx} cy={cy} r="7.5" fill="#ffffff" stroke={color} strokeWidth="1.4" />
      <text x={cx} y={cy + 3.4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK}>{number}</text>
    </g>
  )
}

// ── 三権分立 ───────────────────────────────────────────────────────────
//   { name: 'separationOfPowers' }
// 国会（立法権）・内閣（行政権）・裁判所（司法権）を三角形に置き、たがいのはたらきかけ（①〜⑥）と、
// 主権者の国民からのはたらきかけ（⑦〜⑨）を番号つきの矢印で示す（丸の中に数字）。番号の意味は、同じ図の組の表で示す。
function SeparationOfPowersDiagram() {
  const arrows = [
    { number: '1', from: [96, 52], to: [44, 178], t: 0.35, color: POWER },
    { number: '2', from: [60, 178], to: [112, 52], t: 0.35, color: POWER },
    { number: '3', from: [204, 52], to: [256, 178], t: 0.35, color: POWER },
    { number: '4', from: [240, 178], to: [188, 52], t: 0.35, color: POWER },
    { number: '5', from: [112, 193], to: [188, 193], t: 0.3, color: POWER },
    { number: '6', from: [188, 207], to: [112, 207], t: 0.3, color: POWER },
    { number: '7', from: [150, 104], to: [150, 52], t: 0.5, color: PEOPLE },
    { number: '8', from: [118, 140], to: [86, 178], t: 0.5, color: PEOPLE },
    { number: '9', from: [182, 140], to: [214, 178], t: 0.5, color: PEOPLE },
  ]
  return (
    <svg viewBox="0 0 300 226" className="h-auto w-full" role="img" aria-label="三権分立のしくみ" data-subject-diagram="separationOfPowers">
      {arrows.map((arrow) => <NumberedArrow key={arrow.number} {...arrow} />)}
      <Box x={150} y={30} w={132} h={40} title="国会" sub="立法権" />
      <Box x={58} y={200} w={104} h={40} title="内閣" sub="行政権" />
      <Box x={242} y={200} w={104} h={40} title="裁判所" sub="司法権" />
      <Box x={150} y={122} w={96} h={34} title="国民" sub="主権者" dark={false} />
    </svg>
  )
}

// ── 地方公共団体のしくみ（二元代表制） ─────────────────────────────────────
//   { name: 'localGovernment' }
// 首長と地方議会を並べ、住民がそれぞれを選挙で選ぶこと（①②）と、議会と首長のはたらきかけ（③④）を番号つきの矢印で示す。
function LocalGovernmentDiagram() {
  const arrows = [
    { number: '1', from: [118, 150], to: [74, 58], t: 0.5, color: PEOPLE },
    { number: '2', from: [182, 150], to: [226, 58], t: 0.5, color: PEOPLE },
    { number: '3', from: [175, 26], to: [127, 26], t: 0.5, color: POWER },
    { number: '4', from: [125, 42], to: [173, 42], t: 0.5, color: POWER },
  ]
  return (
    <svg viewBox="0 0 300 192" className="h-auto w-full" role="img" aria-label="地方公共団体のしくみ" data-subject-diagram="localGovernment">
      {arrows.map((arrow) => <NumberedArrow key={arrow.number} {...arrow} />)}
      <Box x={66} y={34} w={116} h={42} title="首長" sub="知事・市（区）町村長" />
      <Box x={234} y={34} w={116} h={42} title="地方議会" sub="条例・予算を議決" />
      <Box x={150} y={168} w={116} h={36} title="住民" sub="有権者" dark={false} />
    </svg>
  )
}

// ── 経済の循環（家計・企業・政府） ─────────────────────────────────────────
//   { name: 'economicCircuit' }
// 3つの経済主体を三角形に置き、たがいの間を行き来するもの（お金・労働力・財やサービス）を番号つきの矢印で示す。
function EconomicCircuitDiagram() {
  const arrows = [
    { number: '1', from: [60, 178], to: [112, 52], t: 0.35, color: POWER },
    { number: '2', from: [96, 52], to: [44, 178], t: 0.35, color: POWER },
    { number: '3', from: [112, 193], to: [188, 193], t: 0.3, color: POWER },
    { number: '4', from: [188, 207], to: [112, 207], t: 0.3, color: POWER },
    { number: '5', from: [240, 178], to: [188, 52], t: 0.35, color: POWER },
    { number: '6', from: [204, 52], to: [256, 178], t: 0.35, color: POWER },
  ]
  return (
    <svg viewBox="0 0 300 226" className="h-auto w-full" role="img" aria-label="家計・企業・政府の結びつき" data-subject-diagram="economicCircuit">
      {arrows.map((arrow) => <NumberedArrow key={arrow.number} {...arrow} />)}
      <Box x={150} y={30} w={132} h={40} title="政府" sub="国・地方公共団体" />
      <Box x={58} y={200} w={104} h={40} title="家計" sub="消費の中心" dark={false} />
      <Box x={242} y={200} w={104} h={40} title="企業" sub="生産の中心" />
    </svg>
  )
}

// 白いふちどりの文字。地図と同じ Halo で描くので、読みがなの辞書の語には上に小さく読みがなが付く。
function Label({ x, y, children, size = 10, weight = '700', color = INK, anchor = 'start' }) {
  return <Halo x={x} y={y} u={1} size={size} weight={weight} color={color} anchor={anchor}>{children}</Halo>
}

// ── 1年の輪（年中行事）──────────────────────────────────────────────────────
//   { name: 'yearCircle', events: [[月, '行事'], …] }
// 1月を上にして12か月を時計回りに並べ、季節で色を分ける。行事は、その月の外側に書く。
const SEASONS = Object.freeze([
  { months: [3, 4, 5], label: '春', color: '#fce7f3' },
  { months: [6, 7, 8], label: '夏', color: '#dcfce7' },
  { months: [9, 10, 11], label: '秋', color: '#ffedd5' },
  { months: [12, 1, 2], label: '冬', color: '#dbeafe' },
])
function YearCircleDiagram({ events = [] }) {
  const cx = 150
  const cy = 100
  const r1 = 34
  const r2 = 70
  const angle = (month) => ((month - 1) / 12) * 2 * Math.PI - Math.PI / 2
  const point = (month, r, offset = 0.5) => {
    const a = ((month - 1 + offset) / 12) * 2 * Math.PI - Math.PI / 2
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const sector = (month) => {
    const a0 = angle(month)
    const a1 = angle(month + 1)
    const p = (a, r) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
    return `M${p(a0, r1)} L${p(a0, r2)} A${r2},${r2} 0 0 1 ${p(a1, r2)} L${p(a1, r1)} A${r1},${r1} 0 0 0 ${p(a0, r1)} Z`
  }
  const colorOf = (month) => SEASONS.find((season) => season.months.includes(month)).color
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="1年の年中行事" data-subject-diagram="yearCircle">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
        <path key={month} d={sector(month)} fill={colorOf(month)} stroke="#ffffff" strokeWidth="1.5" />
      ))}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
        const [x, y] = point(month, (r1 + r2) / 2)
        return <text key={`m${month}`} x={x} y={y + 3.5} fontSize="9.5" fontWeight="800" textAnchor="middle" fill={INK}>{`${month}月`}</text>
      })}
      {SEASONS.map((season) => {
        const [x, y] = point(season.months[1], r1 - 14)
        return <text key={season.label} x={x} y={y + 4} fontSize="10" fontWeight="800" textAnchor="middle" fill="#475569">{season.label}</text>
      })}
      {events.map(([month, text]) => {
        const [x, y] = point(month, r2 + 8)
        const [lx, ly] = point(month, r2 + 2)
        const right = x >= cx + 2
        const left = x <= cx - 2
        return (
          <g key={`${month}-${text}`}>
            <line x1={lx} y1={ly} x2={x} y2={y} stroke="#94a3b8" strokeWidth="1" />
            <Label x={right ? x + 3 : left ? x - 3 : x} y={y + (y < cy ? -2 : 10)} size={9.5} weight="800" anchor={right ? 'start' : left ? 'end' : 'middle'}>{text}</Label>
          </g>
        )
      })}
    </svg>
  )
}

// ── 2つの観点で比べる図 ───────────────────────────────────────────────────
//   { name: 'quadrant', x: { label, low, high }, y: { label, low, high }, items: [{ x: 0〜1, y: 0〜1, text, tone? }] }
// 横は x の観点（右ほど high）、縦は y の観点（上ほど high）。両方を満たす案は右上に来る。
const QUADRANT_TONES = Object.freeze({ good: '#15803d', mid: '#b45309', bad: '#b91c1c' })
function QuadrantDiagram({ x = {}, y = {}, items = [] }) {
  const left = 46
  const right = 290
  const top = 14
  const bottom = 194
  const px = (value) => left + value * (right - left)
  const py = (value) => bottom - value * (bottom - top)
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label={`${x.label ?? ''}と${y.label ?? ''}で比べる図`} data-subject-diagram="quadrant">
      <rect x={px(0.5)} y={top} width={right - px(0.5)} height={py(0.5) - top} fill="#dcfce7" />
      <rect x={left} y={top} width={right - left} height={bottom - top} fill="none" stroke="#94a3b8" />
      <line x1={px(0.5)} x2={px(0.5)} y1={top} y2={bottom} stroke="#cbd5e1" strokeDasharray="4 3" />
      <line x1={left} x2={right} y1={py(0.5)} y2={py(0.5)} stroke="#cbd5e1" strokeDasharray="4 3" />
      <Label x={right - 4} y={top + 12} size={8.5} anchor="end" color="#15803d">両方を満たす</Label>
      <Label x={(left + right) / 2} y={bottom + 16} size={10} weight="800" anchor="middle">{`${x.label}（右ほど${x.high}）`}</Label>
      <Label x={left + 2} y={bottom + 30} size={8.5} color="#64748b">{x.low}</Label>
      <Label x={right} y={bottom + 30} size={8.5} anchor="end" color="#64748b">{x.high}</Label>
      <text x={14} y={(top + bottom) / 2} fontSize="10" fontWeight="800" textAnchor="middle" fill={INK} transform={`rotate(-90 14 ${(top + bottom) / 2})`}>{`${y.label}（上ほど${y.high}）`}</text>
      <text x={30} y={top + 10} fontSize="8.5" fontWeight="700" textAnchor="middle" fill="#64748b" transform={`rotate(-90 30 ${top + 10})`}>{y.high}</text>
      <text x={30} y={bottom - 10} fontSize="8.5" fontWeight="700" textAnchor="middle" fill="#64748b" transform={`rotate(-90 30 ${bottom - 10})`}>{y.low}</text>
      {items.map((item) => {
        const color = QUADRANT_TONES[item.tone] ?? INK
        const cx = px(item.x)
        const cy = py(item.y)
        return (
          <g key={item.text}>
            <circle cx={cx} cy={cy} r="11" fill="#ffffff" stroke={color} strokeWidth="2" />
            <text x={cx} y={cy + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill={color}>{item.label}</text>
            <Label x={cx + (item.x > 0.6 ? -15 : 15)} y={cy + 4} size={9} weight="800" anchor={item.x > 0.6 ? 'end' : 'start'} color={color}>{item.text}</Label>
          </g>
        )
      })}
    </svg>
  )
}

// ── バリアフリーとユニバーサルデザイン ──────────────────────────────────────────
//   { name: 'barrierFree' }
// 左：段差のある入り口に、あとからスロープを付ける（さまたげを取り除く）。
// 右：はじめから段差のない入り口と、広い自動ドア（だれにとっても使いやすくつくる）。
function BarrierFreeDiagram() {
  return (
    <svg viewBox="0 0 300 198" className="h-auto w-full" role="img" aria-label="バリアフリーとユニバーサルデザイン" data-subject-diagram="barrierFree">
      <rect x="2" y="4" width="144" height="190" rx="10" fill="#fef3c7" stroke="#b45309" />
      <rect x="154" y="4" width="144" height="190" rx="10" fill="#dcfce7" stroke="#15803d" />
      <Label x={74} y={22} size={10.5} weight="800" anchor="middle" color="#92400e">バリアフリー</Label>
      <Label x={226} y={22} size={10.5} weight="800" anchor="middle" color="#166534">ユニバーサルデザイン</Label>
      <rect x="84" y="44" width="52" height="86" fill="#e2e8f0" stroke="#64748b" />
      <rect x="98" y="70" width="26" height="40" fill="#bae6fd" stroke="#64748b" />
      <path d="M84,130 L84,118 L96,118 L96,124 L136,124 L136,130 Z" fill="#cbd5e1" stroke="#64748b" />
      <path d="M84,118 L84,130 L18,140" fill="none" stroke="#94a3b8" />
      <path d="M84,118 L22,140 L84,140 Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.4" />
      <rect x="10" y="140" width="130" height="6" fill="#a8a29e" />
      <Label x={74} y={160} size={9.5} weight="800" anchor="middle" color="#92400e">あとから付けたスロープ</Label>
      <Label x={74} y={176} size={8.5} anchor="middle" color="#92400e">すでにある段差を取り除く</Label>
      <rect x="196" y="44" width="80" height="96" fill="#e2e8f0" stroke="#64748b" />
      <rect x="206" y="66" width="28" height="74" fill="#bae6fd" stroke="#64748b" />
      <rect x="238" y="66" width="28" height="74" fill="#bae6fd" stroke="#64748b" />
      <path d="M220,58 L252,58" stroke="#15803d" strokeWidth="2" />
      <Label x={236} y={54} size={8.5} anchor="middle" color="#166534">広い自動ドア</Label>
      <rect x="162" y="140" width="130" height="6" fill="#a8a29e" />
      <Label x={226} y={160} size={9.5} weight="800" anchor="middle" color="#166534">はじめから段差がない</Label>
      <Label x={226} y={176} size={8.5} anchor="middle" color="#166534">だれでも使いやすくつくる</Label>
    </svg>
  )
}

// ── 景気変動の波 ─────────────────────────────────────────────────────────
//   { name: 'businessCycle' }
// 景気は、好況（山）→後退→不況（谷）→回復をくり返す。山と谷の上下に、生産・雇用・物価の動きを書く。
function BusinessCycleDiagram() {
  const left = 16
  const right = 292
  const mid = 104
  const amp = 52
  const points = []
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120
    points.push([left + t * (right - left), mid - amp * Math.sin(t * 2 * Math.PI * 1.25 + 0.15)])
  }
  const path = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const at = (t) => [left + t * (right - left), mid - amp * Math.sin(t * 2 * Math.PI * 1.25 + 0.15)]
  const [px, py] = at((Math.PI / 2 - 0.15) / (2 * Math.PI * 1.25))
  const [tx, ty] = at((1.5 * Math.PI - 0.15) / (2 * Math.PI * 1.25))
  const [dx, dy] = at((Math.PI - 0.15) / (2 * Math.PI * 1.25))
  const [ux, uy] = at((2 * Math.PI - 0.15) / (2 * Math.PI * 1.25))
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="景気変動の波" data-subject-diagram="businessCycle">
      <line x1={left} x2={right} y1={mid} y2={mid} stroke="#cbd5e1" strokeDasharray="4 3" />
      <path d={path} fill="none" stroke="#0f766e" strokeWidth="3" />
      <circle cx={px} cy={py} r="4" fill="#be123c" />
      <circle cx={tx} cy={ty} r="4" fill="#1d4ed8" />
      <Label x={8} y={py - 22} size={11} weight="800" color="#be123c">好況（景気の山）</Label>
      <Label x={8} y={py - 9} size={8.5} color="#be123c">生産・雇用が増え、物価が上がりやすい</Label>
      <Label x={tx} y={ty + 20} size={11} weight="800" anchor="middle" color="#1d4ed8">不況（景気の谷）</Label>
      <Label x={tx} y={ty + 33} size={8.5} anchor="middle" color="#1d4ed8">生産・雇用が減り、物価が下がりやすい</Label>
      <Label x={dx + 10} y={dy + 4} size={10} weight="800" color="#475569">後退</Label>
      <Label x={ux + 10} y={uy + 4} size={10} weight="800" color="#475569">回復</Label>
      <Label x={right} y={206} size={8.5} anchor="end" color="#64748b">時間 →（模式図）</Label>
    </svg>
  )
}

export const CIVICS_DIAGRAMS = Object.freeze({
  separationOfPowers: SeparationOfPowersDiagram,
  localGovernment: LocalGovernmentDiagram,
  economicCircuit: EconomicCircuitDiagram,
  yearCircle: YearCircleDiagram,
  quadrant: QuadrantDiagram,
  barrierFree: BarrierFreeDiagram,
  businessCycle: BusinessCycleDiagram,
})
