// 地理の図解（川がつくる地形・人口ピラミッドの型）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。

const INK = '#1f2937'
const MUTED = '#64748b'

function Label({ x, y, children, size = 10, weight = '700', color = INK, anchor = 'start' }) {
  const common = { x, y, fontSize: size, fontWeight: weight, textAnchor: anchor }
  return (
    <g>
      <text {...common} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">{children}</text>
      <text {...common} fill={color}>{children}</text>
    </g>
  )
}

// ── 川がつくる地形（扇状地と三角州）───────────────────────────────────────
//   { name: 'riverLandforms' }
// 山地から平地へ出る所の扇状地と、河口の三角州を、上から見た図で並べる。
function RiverLandformsDiagram() {
  const mountains = [[20, 64, 40], [58, 58, 46], [102, 62, 40], [150, 54, 50], [198, 60, 44], [242, 56, 48], [282, 64, 34]]
  return (
    <svg viewBox="0 0 300 272" className="h-auto w-full" role="img" aria-label="扇状地と三角州" data-subject-diagram="riverLandforms">
      <rect x="0" y="0" width="300" height="272" fill="#f7f5ec" />
      {mountains.map(([x, base, h]) => (
        <path key={x} d={`M${x - h * 0.9},${base} L${x},${base - h} L${x + h * 0.9},${base} Z`} fill="#cbbf9f" stroke="#8b7355" strokeWidth="0.8" />
      ))}
      <Label x={24} y={20} size={9.5} weight="800" color="#5b4636">山地</Label>
      <path d="M150,62 L96,128 A70,70 0 0,0 204,128 Z" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      <path d="M150,18 L150,62" stroke="#2563eb" strokeWidth="2.2" fill="none" />
      <path d="M150,62 C146,84 158,100 150,128 C143,152 170,168 160,190 C152,208 132,212 142,226" stroke="#2563eb" strokeWidth="2.2" fill="none" />
      <path d="M150,70 C136,90 128,104 120,122 M150,70 C166,90 174,104 182,122" stroke="#93c5fd" strokeWidth="1.1" fill="none" strokeDasharray="3 3" />
      <Label x={150} y={112} size={10} weight="800" anchor="middle" color="#92400e">扇状地</Label>
      <Label x={206} y={100} size={8.5} color="#92400e">粒の大きい砂や石</Label>
      <Label x={206} y={112} size={8.5} color="#92400e">水はけがよい → 果樹園</Label>
      <Label x={24} y={172} size={9.5} weight="800" color="#4d7c0f">平野</Label>
      <rect x="0" y="236" width="300" height="36" fill="#bfdbfe" />
      <path d="M100,236 L142,222 L186,236 Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="1" />
      <path d="M142,224 L124,238 M142,224 L142,240 M142,224 L160,238" stroke="#2563eb" strokeWidth="1.6" fill="none" />
      <Label x={196} y={214} size={10} weight="800" color="#15803d">三角州</Label>
      <Label x={196} y={227} size={8.5} color="#15803d">細かい土や砂</Label>
      <Label x={196} y={239} size={8.5} color="#15803d">→ 水田・市街地</Label>
      <Label x={24} y={258} size={9.5} weight="800" color="#1d4ed8">海</Label>
      <Label x={296} y={264} size={8} color={MUTED} anchor="end">※ 上から見た図（大きさは実際の比ではない）</Label>
    </svg>
  )
}

// ── 人口ピラミッドの型 ─────────────────────────────────────────────────
//   { name: 'pyramidTypes' }
// 富士山型・つりがね型・つぼ型の形の見本を並べる（実際の人口の数ではない）。

const PYRAMID_TYPES = Object.freeze([
  { name: '富士山型', note: ['子どもが多い', '（出生率も死亡率も高い）'], widths: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1] },
  { name: 'つりがね型', note: ['子どもと大人の', '数の差が小さい'], widths: [0.72, 0.72, 0.72, 0.71, 0.7, 0.67, 0.6, 0.48, 0.32, 0.14] },
  { name: 'つぼ型', note: ['子どもが少なく', '高齢者が多い'], widths: [0.42, 0.46, 0.5, 0.56, 0.62, 0.7, 0.76, 0.72, 0.56, 0.3] },
])

function PyramidTypesDiagram() {
  const barH = 10
  const top = 26
  const half = 40
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="人口ピラミッドの型" data-subject-diagram="pyramidTypes">
      {PYRAMID_TYPES.map((type, column) => {
        const cx = 50 + column * 100
        return (
          <g key={type.name}>
            <Label x={cx} y={16} size={10.5} weight="800" anchor="middle">{type.name}</Label>
            {type.widths.map((w, index) => {
              const y = top + (type.widths.length - 1 - index) * barH
              return (
                <g key={index}>
                  <rect x={cx - w * half} y={y} width={w * half} height={barH - 1.5} fill="#93c5fd" />
                  <rect x={cx} y={y} width={w * half} height={barH - 1.5} fill="#fca5a5" />
                </g>
              )
            })}
            <line x1={cx} x2={cx} y1={top} y2={top + type.widths.length * barH} stroke={INK} strokeWidth="0.8" />
            <Label x={cx} y={top + type.widths.length * barH + 16} size={8.5} anchor="middle" color={MUTED}>{type.note[0]}</Label>
            <Label x={cx} y={top + type.widths.length * barH + 28} size={8.5} anchor="middle" color={MUTED}>{type.note[1]}</Label>
          </g>
        )
      })}
      <Label x={6} y={top + 8} size={8} color={MUTED}>高齢</Label>
      <Label x={6} y={top + 10 * barH - 2} size={8} color={MUTED}>子ども</Label>
      <rect x="96" y="190" width="9" height="9" fill="#93c5fd" />
      <Label x={108} y={198} size={8.5}>男性</Label>
      <rect x="148" y="190" width="9" height="9" fill="#fca5a5" />
      <Label x={160} y={198} size={8.5}>女性</Label>
    </svg>
  )
}

export const GEOGRAPHY_DIAGRAMS = Object.freeze({
  riverLandforms: RiverLandformsDiagram,
  pyramidTypes: PyramidTypesDiagram,
})
