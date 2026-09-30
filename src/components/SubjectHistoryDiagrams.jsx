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

export const HISTORY_DIAGRAMS = Object.freeze({
  centuryLine: CenturyLineDiagram,
})
