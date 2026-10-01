// 地理の図解（川がつくる地形・人口ピラミッドの型）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。
import { Halo } from './SubjectMapFigures.jsx'

const INK = '#1f2937'
const MUTED = '#64748b'

// 白いふちどりの文字。地図と同じ Halo で描くので、読みがなの辞書の語には上に小さく読みがなが付く。
function Label({ x, y, children, size = 10, weight = '700', color = INK, anchor = 'start' }) {
  return <Halo x={x} y={y} u={1} size={size} weight={weight} color={color} anchor={anchor}>{children}</Halo>
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
      <Label x={296} y={264} size={8.5} color={MUTED} anchor="end">※ 上から見た図（大きさは実際の比ではない）</Label>
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
      <Label x={6} y={top + 8} size={8.5} color={MUTED}>高齢</Label>
      <Label x={6} y={top + 10 * barH - 2} size={8.5} color={MUTED}>子ども</Label>
      <rect x="96" y="190" width="9" height="9" fill="#93c5fd" />
      <Label x={108} y={198} size={8.5}>男性</Label>
      <rect x="148" y="190" width="9" height="9" fill="#fca5a5" />
      <Label x={160} y={198} size={8.5}>女性</Label>
    </svg>
  )
}

// ── 気候帯の並び方（仮想の大陸）──────────────────────────────────────────
//   { name: 'climateZones' }
// 陸地を1つの大陸にまとめて、緯度ごとの気候帯の並び方を模式的に表す。赤道の周りに熱帯、回帰線の付近の大陸の
// 西側から内陸に乾燥帯、中緯度に温帯、北半球の高緯度に冷帯（南半球には広い陸地がないので冷帯がない）、両極に寒帯。
const ZONE_COLORS = Object.freeze({ tropical: '#fca5a5', dry: '#fde68a', temperate: '#86efac', cool: '#a5b4fc', polar: '#e0f2fe' })
function ClimateZonesDiagram() {
  const top = 12
  const scale = 1.5
  const y = (lat) => top + (80 - lat) * scale
  const path = (points) => points.map(([x, lat], index) => `${index ? 'L' : 'M'}${x},${y(lat)}`).join(' ') + ' Z'
  const continent = path([
    [74, 76], [228, 76], [246, 60], [252, 45], [244, 30], [228, 15], [216, 0], [206, -15], [192, -30], [178, -42], [166, -52], [158, -56],
    [150, -56], [140, -46], [128, -32], [116, -18], [106, -4], [92, 8], [68, 18], [52, 30], [48, 45], [56, 60], [64, 70],
  ])
  const zones = [
    { key: 'temperate', d: path([[30, 66], [270, 66], [270, -60], [30, -60]]) },
    { key: 'cool', d: path([[30, 66], [270, 66], [270, 40], [120, 45], [30, 55]]) },
    { key: 'dry', d: path([[30, 32], [120, 38], [186, 35], [192, 24], [130, 16], [30, 17]]) },
    { key: 'tropical', d: path([[30, 17], [130, 16], [200, 22], [270, 23], [270, -22], [200, -20], [160, -14], [30, -12]]) },
    { key: 'dry', d: path([[30, -12], [160, -14], [176, -22], [172, -32], [134, -34], [30, -30]]) },
    { key: 'polar', d: path([[30, 66], [270, 66], [270, 80], [30, 80]]) },
  ]
  const lines = [[60, '北緯60度'], [30, '北緯30度'], [0, '赤道'], [-30, '南緯30度']]
  const labels = [
    [150, 71, '寒帯', 'polar'], [190, 54, '冷帯', 'cool'], [84, 42, '温帯', 'temperate'], [212, 32, '温帯', 'temperate'], [112, 26, '乾燥帯', 'dry'],
    [168, 3, '熱帯', 'tropical'], [150, -24, '乾燥帯', 'dry'], [158, -43, '温帯', 'temperate'],
  ]
  return (
    <svg viewBox="0 0 300 242" className="h-auto w-full" role="img" aria-label="気候帯の並び方（仮想の大陸）" data-subject-diagram="climateZones">
      <rect x="0" y="0" width="300" height="242" fill="#f8fafc" />
      <defs>
        <clipPath id="climate-zones-continent"><path d={continent} /></clipPath>
      </defs>
      <g clipPath="url(#climate-zones-continent)">
        {zones.map((zone, index) => <path key={index} d={zone.d} fill={ZONE_COLORS[zone.key]} />)}
      </g>
      <path d={continent} fill="none" stroke="#475569" strokeWidth="1.2" />
      {lines.map(([lat, text]) => (
        <g key={lat}>
          <line x1="48" x2="268" y1={y(lat)} y2={y(lat)} stroke={lat === 0 ? '#dc2626' : MUTED} strokeWidth={lat === 0 ? 1.2 : 0.8} strokeDasharray={lat === 0 ? undefined : '4 3'} />
          <Label x={3} y={y(lat) + 3.5} size={8.5} color={lat === 0 ? '#dc2626' : MUTED}>{text}</Label>
        </g>
      ))}
      {labels.map(([x, lat, text]) => <Label key={`${x}-${lat}`} x={x} y={y(lat) + 4} size={11} weight="800" anchor="middle">{text}</Label>)}
      <rect x="40" y={y(-62)} width="228" height="12" fill={ZONE_COLORS.polar} stroke="#475569" strokeWidth="0.8" />
      <Label x={154} y={y(-62) + 9.5} size={8.5} weight="800" anchor="middle">南極大陸（寒帯）</Label>
    </svg>
  )
}

// ── グラフと主題図の表し方の見本 ─────────────────────────────────────────
//   { name: 'chartTypes' }
// 表したいこと（移り変わり・大小・割合・地域ごとのちがい）に合うグラフと主題図の形を、数値を入れない小さな見本で並べる。
function ChartTypesDiagram() {
  const frame = (x, y) => <rect x={x} y={y} width="140" height="104" rx="8" fill="#ffffff" stroke="#cbd5e1" />
  const axis = (x, y) => <path d={`M${x + 14},${y + 10} L${x + 14},${y + 74} L${x + 130},${y + 74}`} fill="none" stroke="#475569" strokeWidth="1" />
  const line = [[20, 62], [42, 56], [64, 50], [86, 38], [108, 30], [126, 20]]
  const bars = [44, 30, 56, 22, 38]
  const sectors = [[0, 0.5, '#0f766e'], [0.5, 0.8, '#f59e0b'], [0.8, 1, '#2563eb']]
  const arc = (cx, cy, r, a0, a1) => {
    const p = (t) => [cx + r * Math.sin(t * 2 * Math.PI), cy - r * Math.cos(t * 2 * Math.PI)]
    const [x0, y0] = p(a0)
    const [x1, y1] = p(a1)
    return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1},${y1} Z`
  }
  const cells = [
    [0, 0, 3], [1, 0, 2], [2, 0, 1], [3, 0, 1],
    [0, 1, 2], [1, 1, 3], [2, 1, 2], [3, 1, 1],
    [0, 2, 1], [1, 2, 2], [2, 2, 3], [3, 2, 2],
  ]
  const shade = ['#ffffff', '#fecaca', '#f87171', '#b91c1c']
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="グラフと主題図の表し方の見本" data-subject-diagram="chartTypes">
      {frame(6, 4)}
      {axis(6, 4)}
      <polyline points={line.map(([x, y]) => `${6 + x},${4 + y}`).join(' ')} fill="none" stroke="#be123c" strokeWidth="2" />
      {line.map(([x, y]) => <circle key={x} cx={6 + x} cy={4 + y} r="2.4" fill="#be123c" />)}
      <Label x={76} y={96} size={9.5} weight="800" anchor="middle">折れ線グラフ（移り変わり）</Label>
      {frame(154, 4)}
      {axis(154, 4)}
      {bars.map((h, i) => <rect key={i} x={154 + 24 + i * 21} y={4 + 74 - h} width="13" height={h} fill="#0f766e" />)}
      <Label x={224} y={96} size={9.5} weight="800" anchor="middle">棒グラフ（大小の比較）</Label>
      {frame(6, 118)}
      {sectors.map(([a0, a1, color]) => <path key={a0} d={arc(44, 160, 26, a0, a1)} fill={color} stroke="#ffffff" strokeWidth="1" />)}
      {sectors.map(([a0, a1, color]) => <rect key={`b${a0}`} x={82 + a0 * 56} y={150} width={(a1 - a0) * 56} height="20" fill={color} stroke="#ffffff" strokeWidth="1" />)}
      <Label x={76} y={212} size={9.5} weight="800" anchor="middle">円グラフ・帯グラフ（割合）</Label>
      {frame(154, 118)}
      {cells.map(([cx, cy, level]) => <rect key={`${cx}-${cy}`} x={154 + 22 + cx * 25} y={118 + 6 + cy * 19} width="25" height="19" fill={shade[level]} stroke="#475569" strokeWidth="0.8" />)}
      <Label x={224} y={196} size={8.5} anchor="middle" color={MUTED}>色が濃いほど多い</Label>
      <Label x={224} y={212} size={9.5} weight="800" anchor="middle">階級区分図（地域のちがい）</Label>
    </svg>
  )
}

// ── 広がったまちとコンパクトなまち ───────────────────────────────────────
//   { name: 'compactCity' }
// 左は、住宅が郊外まで広がり、店も郊外の大型店に移ったまち（自動車がないと暮らしにくい）。
// 右は、住宅や店・病院を路面電車などの駅の近くに集めたコンパクトなまち（公共交通で暮らせる）。
function CompactCityDiagram() {
  const spread = [[16, 52], [34, 96], [58, 36], [88, 120], [112, 58], [126, 104], [22, 132], [64, 150], [104, 150], [134, 30], [44, 70], [96, 84]]
  const near = [[176, 66], [190, 58], [204, 70], [218, 82], [232, 94], [246, 104], [260, 114], [182, 80], [226, 70], [254, 92], [214, 98], [240, 120]]
  const stops = [[178, 50], [212, 82], [248, 112], [280, 140]]
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="広がったまちとコンパクトなまち" data-subject-diagram="compactCity">
      <rect x="2" y="16" width="144" height="150" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
      <rect x="154" y="16" width="144" height="150" rx="8" fill="#f0fdf4" stroke="#86efac" />
      <Label x={74} y={11} size={10} weight="800" anchor="middle">広がったまち</Label>
      <Label x={226} y={11} size={10} weight="800" anchor="middle" color="#15803d">コンパクトなまち</Label>
      <rect x="62" y="80" width="22" height="16" fill="#94a3b8" />
      <Label x={73} y={108} size={8.5} anchor="middle" color={MUTED}>駅前</Label>
      {spread.map(([x, y]) => <rect key={`s${x}-${y}`} x={x} y={y} width="8" height="7" fill="#f59e0b" />)}
      <rect x="112" y="128" width="28" height="22" fill="#64748b" />
      <Label x={126} y={160} size={8.5} anchor="middle">大型店</Label>
      <polyline points={stops.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="#15803d" strokeWidth="3" />
      {stops.map(([x, y]) => <circle key={`t${x}`} cx={x} cy={y} r="4.5" fill="#ffffff" stroke="#15803d" strokeWidth="2" />)}
      {near.map(([x, y]) => <rect key={`n${x}-${y}`} x={x} y={y} width="8" height="7" fill="#f59e0b" />)}
      <rect x="196" y="40" width="16" height="12" fill="#dc2626" />
      <Label x={204} y={36} size={8.5} anchor="middle" color="#b91c1c">病院</Label>
      <rect x="262" y="124" width="16" height="12" fill="#64748b" />
      <Label x={270} y={150} size={8.5} anchor="middle">店</Label>
      <Label x={176} y={152} size={8.5} color="#15803d">路面電車</Label>
      <Label x={74} y={180} size={8.5} anchor="middle" color={MUTED}>自動車がないと暮らしにくい</Label>
      <Label x={226} y={180} size={8.5} anchor="middle" color="#15803d">公共交通で暮らせる</Label>
      <rect x="40" y="186" width="8" height="7" fill="#f59e0b" />
      <Label x={52} y={193} size={8.5} color={MUTED}>住宅</Label>
    </svg>
  )
}

// ── 環境・経済・社会のバランス ─────────────────────────────────────────────
//   { name: 'sustainabilityBalance' }
// 3つの円が重なる真ん中が、持続可能な社会。どれか1つだけでなく、3つのバランスをとる。
function SustainabilityBalanceDiagram() {
  const circles = [
    { cx: 150, cy: 70, color: '#16a34a', fill: '#dcfce7', title: '環境', sub: '自然や資源を守る', tx: 150, ty: 40 },
    { cx: 106, cy: 142, color: '#2563eb', fill: '#dbeafe', title: '経済', sub: '産業や仕事を育てる', tx: 82, ty: 168 },
    { cx: 194, cy: 142, color: '#c2410c', fill: '#ffedd5', title: '社会', sub: '暮らしや福祉を守る', tx: 218, ty: 168 },
  ]
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="環境・経済・社会のバランス" data-subject-diagram="sustainabilityBalance">
      {circles.map((c) => <circle key={c.title} cx={c.cx} cy={c.cy} r="62" fill={c.fill} fillOpacity="0.75" stroke={c.color} strokeWidth="1.6" />)}
      {circles.map((c) => (
        <g key={`${c.title}-t`}>
          <Label x={c.tx} y={c.ty} size={12} weight="800" anchor="middle" color={c.color}>{c.title}</Label>
          <Label x={c.tx} y={c.ty + 13} size={8.5} anchor="middle" color={c.color}>{c.sub}</Label>
        </g>
      ))}
      <Label x={150} y={113} size={9.5} weight="800" anchor="middle">持続可能な</Label>
      <Label x={150} y={126} size={9.5} weight="800" anchor="middle">社会</Label>
    </svg>
  )
}

export const GEOGRAPHY_DIAGRAMS = Object.freeze({
  riverLandforms: RiverLandformsDiagram,
  pyramidTypes: PyramidTypesDiagram,
  climateZones: ClimateZonesDiagram,
  chartTypes: ChartTypesDiagram,
  compactCity: CompactCityDiagram,
  sustainabilityBalance: SustainabilityBalanceDiagram,
})
