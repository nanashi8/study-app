// 歴史の図解（年代の数え方など）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。

const INK = '#1f2937'
const MUTED = '#64748b'
const RED = '#b91c1c'

function Label({ x, y, children, size = 10, weight = '700', color = INK, anchor = 'start' }) {
  const common = { x, y, fontSize: size, fontWeight: weight, textAnchor: anchor }
  return (
    <g>
      <text {...common} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">{children}</text>
      <text {...common} fill={color}>{children}</text>
    </g>
  )
}

/** 世紀の名前（紀元前をふくむ）。n は 1, 2, …（紀元後）か −1, −2, …（紀元前）。 */
export const centuryName = (n) => (n < 0 ? `紀元前${-n}世紀` : `${n}世紀`)

/** 西暦の年（紀元前は負の数、0年はない）が何世紀か。 */
export const centuryOf = (year) => (year > 0 ? Math.floor((year - 1) / 100) + 1 : -(Math.floor((-year - 1) / 100) + 1))

// ── 世紀と西暦の数直線 ───────────────────────────────────────────────────
//   { name: 'centuryLine' }
// 紀元前3世紀〜3世紀と、19〜21世紀を100年ずつの区切りで並べ、紀元前1年の次が紀元1年（0年はない）ことと、世紀の求め方を示す。
function CenturyLineDiagram() {
  const left = 16
  const right = 284
  const segment = (right - left) / 6
  const row1 = 46
  const row2 = 128
  const colors = ['#fee2e2', '#fef3c7', '#dcfce7', '#dbeafe', '#ede9fe', '#fce7f3']
  const ancient = [-3, -2, -1, 1, 2, 3]
  const modern = [19, 20, 21]
  const modernSegment = (right - left) / 3
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="世紀と西暦の数直線" data-subject-diagram="centuryLine">
      <Label x={left} y={16} size={9.5} weight="800" color={MUTED}>紀元前と紀元後のさかい目（前300年＝紀元前300年）</Label>
      {ancient.map((n, index) => (
        <g key={n}>
          <rect x={left + index * segment} y={row1} width={segment} height="16" fill={colors[index]} stroke="#94a3b8" strokeWidth="0.8" />
          <Label x={left + index * segment + segment / 2} y={row1 + 11.5} size={n < 0 ? 7.5 : 8.5} weight="800" anchor="middle">{centuryName(n)}</Label>
        </g>
      ))}
      {[-300, -200, -100, null, 100, 200, 300].map((year, index) => (
        <g key={index}>
          <line x1={left + index * segment} x2={left + index * segment} y1={row1 - 4} y2={row1 + 20} stroke={INK} strokeWidth="1" />
          {year !== null && <Label x={left + index * segment} y={row1 + 32} size={8} anchor="middle">{year < 0 ? `前${-year}年` : `${year}年`}</Label>}
        </g>
      ))}
      <line x1={left + 3 * segment} x2={left + 3 * segment} y1={row1 - 10} y2={row1 + 24} stroke={RED} strokeWidth="2" />
      <Label x={left + 3 * segment - 3} y={row1 - 12} size={8} weight="800" color={RED} anchor="end">紀元前1年</Label>
      <Label x={left + 3 * segment + 3} y={row1 - 12} size={8} weight="800" color={RED}>紀元1年</Label>
      <Label x={left + 3 * segment} y={row1 + 46} size={8.5} weight="800" color={RED} anchor="middle">0年はない（紀元前1年の次が紀元1年）</Label>

      <Label x={left} y={row2 - 14} size={9.5} weight="800" color={MUTED}>今に近い世紀</Label>
      {modern.map((n, index) => (
        <g key={n}>
          <rect x={left + index * modernSegment} y={row2} width={modernSegment} height="16" fill={colors[index + 3]} stroke="#94a3b8" strokeWidth="0.8" />
          <Label x={left + index * modernSegment + modernSegment / 2} y={row2 + 11.5} size={9} weight="800" anchor="middle">{centuryName(n)}</Label>
          <Label x={left + index * modernSegment + modernSegment / 2} y={row2 + 30} size={8} anchor="middle" color={MUTED}>{`${(n - 1) * 100 + 1}〜${n * 100}年`}</Label>
        </g>
      ))}
      <rect x="4" y="176" width="292" height="52" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
      <Label x={150} y={194} size={9.5} weight="800" anchor="middle">世紀＝西暦の百の位までの数＋1</Label>
      <Label x={150} y={210} size={8.5} anchor="middle" color={MUTED}>例：1543年 → 15＋1＝16世紀</Label>
      <Label x={150} y={223} size={8.5} anchor="middle" color={MUTED}>ただし「00」で終わる年はたさない（2000年は20世紀）</Label>
    </svg>
  )
}

// ── 前方後円墳 ─────────────────────────────────────────────────────────
//   { name: 'keyholeTomb' }
// 上から見た前方後円墳の形（後円部・前方部・周りの堀・埴輪）。大きさは実際の比ではない。
function KeyholeTombDiagram() {
  const haniwa = []
  for (let a = 200; a <= 340; a += 20) {
    const r = (a * Math.PI) / 180
    haniwa.push([150 + 50 * Math.cos(r), 72 + 50 * Math.sin(r)])
  }
  // 前方部の左右のふち（(102,100)〜(84,190) と (198,100)〜(216,190)）の少し内側に並べる。
  for (let t = 0.15; t <= 0.9; t += 0.25) {
    haniwa.push([103.4 - 14 * t, 108 + 70 * t], [196.6 + 14 * t, 108 + 70 * t])
  }
  return (
    <svg viewBox="0 0 300 228" className="h-auto w-full" role="img" aria-label="前方後円墳の形" data-subject-diagram="keyholeTomb">
      <path d="M150,6 A72,72 0 0,1 214,104 L236,204 L64,204 L86,104 A72,72 0 0,1 150,6 Z" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1" />
      <path d="M150,22 A56,56 0 0,1 198,100 L216,190 L84,190 L102,100 A56,56 0 0,1 150,22 Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.4" />
      {haniwa.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="2.6" fill="#c2410c" />)}
      <Label x={150} y={70} size={11} weight="800" anchor="middle">後円部（円い）</Label>
      <Label x={150} y={86} size={8.5} anchor="middle" color={MUTED}>王や豪族をほうむった</Label>
      <Label x={150} y={160} size={11} weight="800" anchor="middle">前方部（四角い）</Label>
      <Label x={246} y={40} size={9} weight="800" color="#1d4ed8">堀</Label>
      <line x1={244} y1={43} x2={214} y2={60} stroke="#1d4ed8" strokeWidth="1" />
      <Label x={8} y={128} size={9} weight="800" color="#c2410c">埴輪</Label>
      <line x1={36} y1={125} x2={96} y2={130} stroke="#c2410c" strokeWidth="1" />
      <Label x={150} y={222} size={8} anchor="middle" color={MUTED}>※ 上から見た形（大きさは実際の比ではない）</Label>
    </svg>
  )
}

// ── 主従の関係（御恩と奉公など）────────────────────────────────────────────
//   { name: 'mutualBond', top: '将軍', bottom: '御家人', down: ['御恩', '…'], up: ['奉公', '…'] }
// 上の者が下の者にあたえるもの（down）と、下の者が上の者につくすもの（up）を、向き合う矢印で示す。
function wrapText(text, max) {
  const lines = []
  let line = ''
  for (const char of [...text]) {
    line += char
    if (line.length >= max) {
      lines.push(line)
      line = ''
    }
  }
  if (line) lines.push(line)
  return lines
}

function MutualBondDiagram({ top = '将軍', bottom = '御家人', down = ['御恩', ''], up = ['奉公', ''] }) {
  const downLines = wrapText(down[1], 11)
  const upLines = wrapText(up[1], 11)
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label={`${top}と${bottom}の関係`} data-subject-diagram="mutualBond">
      <rect x="95" y="6" width="110" height="30" rx="8" fill="#334155" />
      <text x="150" y="26" textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff">{top}</text>
      <rect x="95" y="170" width="110" height="30" rx="8" fill="#e2e8f0" stroke="#64748b" />
      <text x="150" y="190" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>{bottom}</text>
      <line x1="120" y1="40" x2="120" y2="160" stroke="#b91c1c" strokeWidth="3" />
      <path d="M120,168 L113,156 L127,156 Z" fill="#b91c1c" />
      <line x1="180" y1="166" x2="180" y2="46" stroke="#1d4ed8" strokeWidth="3" />
      <path d="M180,38 L173,50 L187,50 Z" fill="#1d4ed8" />
      <Label x={112} y={66} size={11} weight="800" color="#b91c1c" anchor="end">{down[0]}</Label>
      {downLines.map((line, index) => <Label key={`d-${index}`} x={112} y={84 + index * 13} size={8.5} color="#7f1d1d" anchor="end">{line}</Label>)}
      <Label x={188} y={66} size={11} weight="800" color="#1d4ed8">{up[0]}</Label>
      {upLines.map((line, index) => <Label key={`u-${index}`} x={188} y={84 + index * 13} size={8.5} color="#1e3a8a">{line}</Label>)}
    </svg>
  )
}

// ── 三角貿易 ─────────────────────────────────────────────────────────
//   { name: 'tradeTriangle', nodes: ['イギリス', '清', 'インド'], flows: ['綿織物', 'アヘン', '茶'], note? }
// 3つの国を三角形に置き、1つ目→3つ目、3つ目→2つ目、2つ目→1つ目の順に、運ばれた品物を矢印で示す。
function TradeTriangleDiagram({ nodes = ['イギリス', '清', 'インド'], flows = ['綿織物', 'アヘン', '茶'], note }) {
  const at = [[62, 40], [238, 40], [150, 176]]
  const box = (x, y, text) => (
    <g key={text}>
      <rect x={x - 42} y={y - 15} width="84" height="30" rx="8" fill="#334155" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff">{text}</text>
    </g>
  )
  // 矢印：[始まりの国, 終わりの国, 品物, 文字の位置]
  const arrows = [
    [0, 2, flows[0], [72, 118]],
    [2, 1, flows[1], [228, 118]],
    [1, 0, flows[2], [150, 26]],
  ]
  // 矢印は、国の四角（はば84・高さ30）のふちの少し外で止める。
  const shorten = ([x1, y1], [x2, y2]) => {
    const length = Math.hypot(x2 - x1, y2 - y1)
    const cos = Math.abs(x2 - x1) / length
    const sin = Math.abs(y2 - y1) / length
    const by = Math.min(cos > 0.001 ? 42 / cos : Infinity, sin > 0.001 ? 15 / sin : Infinity) + 6
    return [x1 + ((x2 - x1) * by) / length, y1 + ((y2 - y1) * by) / length]
  }
  return (
    <svg viewBox="0 0 300 226" className="h-auto w-full" role="img" aria-label="三角貿易" data-subject-diagram="tradeTriangle">
      {arrows.map(([from, to, text, [tx, ty]]) => {
        const start = shorten(at[from], at[to])
        const end = shorten(at[to], at[from])
        const angle = Math.atan2(end[1] - start[1], end[0] - start[0])
        const head = (a) => `${end[0] + 8 * Math.cos(angle + a)},${end[1] + 8 * Math.sin(angle + a)}`
        return (
          <g key={text}>
            <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke="#b91c1c" strokeWidth="2.4" />
            <path d={`M${end[0]},${end[1]} L${head(Math.PI * 0.85)} L${head(-Math.PI * 0.85)} Z`} fill="#b91c1c" />
            <Label x={tx} y={ty} size={11} weight="800" color="#991b1b" anchor="middle">{text}</Label>
          </g>
        )
      })}
      {nodes.map((text, index) => box(at[index][0], at[index][1], text))}
      {note && <Label x={150} y={218} size={8.5} anchor="middle" color={MUTED}>{note}</Label>}
    </svg>
  )
}

export const HISTORY_DIAGRAMS = Object.freeze({
  centuryLine: CenturyLineDiagram,
  keyholeTomb: KeyholeTombDiagram,
  mutualBond: MutualBondDiagram,
  tradeTriangle: TradeTriangleDiagram,
})
