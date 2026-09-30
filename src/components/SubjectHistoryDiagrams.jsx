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

export const HISTORY_DIAGRAMS = Object.freeze({
  centuryLine: CenturyLineDiagram,
  keyholeTomb: KeyholeTombDiagram,
})
