// 歴史の図解（年代の数え方など）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。
import { Halo } from './SubjectMapFigures.jsx'

const INK = '#1f2937'
const MUTED = '#64748b'
const RED = '#b91c1c'

// 白いふちどりの文字。地図と同じ Halo で描くので、読みがなの辞書の語には上に小さく読みがなが付く。
function Label({ x, y, children, size = 10, weight = '700', color = INK, anchor = 'start' }) {
  return <Halo x={x} y={y} u={1} size={size} weight={weight} color={color} anchor={anchor}>{children}</Halo>
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
          <rect x={left + index * segment} y={row1} width={segment} height="26" fill={colors[index]} stroke="#94a3b8" strokeWidth="0.8" />
          {n < 0
            ? (
              <g>
                <Label x={left + index * segment + segment / 2} y={row1 + 11} size={8.5} weight="800" anchor="middle">紀元前</Label>
                <Label x={left + index * segment + segment / 2} y={row1 + 22} size={8.5} weight="800" anchor="middle">{`${-n}世紀`}</Label>
              </g>
            )
            : <Label x={left + index * segment + segment / 2} y={row1 + 16.5} size={8.5} weight="800" anchor="middle">{centuryName(n)}</Label>}
        </g>
      ))}
      {[-300, -200, -100, null, 100, 200, 300].map((year, index) => (
        <g key={index}>
          <line x1={left + index * segment} x2={left + index * segment} y1={row1 - 4} y2={row1 + 30} stroke={INK} strokeWidth="1" />
          {year !== null && <Label x={left + index * segment} y={row1 + 42} size={8.5} anchor="middle">{year < 0 ? `前${-year}年` : `${year}年`}</Label>}
        </g>
      ))}
      <line x1={left + 3 * segment} x2={left + 3 * segment} y1={row1 - 10} y2={row1 + 34} stroke={RED} strokeWidth="2" />
      <Label x={left + 3 * segment - 3} y={row1 - 12} size={8.5} weight="800" color={RED} anchor="end">紀元前1年</Label>
      <Label x={left + 3 * segment + 3} y={row1 - 12} size={8.5} weight="800" color={RED}>紀元1年</Label>
      <Label x={left + 3 * segment} y={row1 + 58} size={8.5} weight="800" color={RED} anchor="middle">0年はない（紀元前1年の次が紀元1年）</Label>

      <Label x={left} y={row2 - 14} size={9.5} weight="800" color={MUTED}>今に近い世紀</Label>
      {modern.map((n, index) => (
        <g key={n}>
          <rect x={left + index * modernSegment} y={row2} width={modernSegment} height="16" fill={colors[index + 3]} stroke="#94a3b8" strokeWidth="0.8" />
          <Label x={left + index * modernSegment + modernSegment / 2} y={row2 + 11.5} size={9} weight="800" anchor="middle">{centuryName(n)}</Label>
          <Label x={left + index * modernSegment + modernSegment / 2} y={row2 + 30} size={8.5} anchor="middle" color={MUTED}>{`${(n - 1) * 100 + 1}〜${n * 100}年`}</Label>
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
      <Label x={8} y={128} size={9} weight="800" color="#c2410c">埴輪（はにわ）</Label>
      <line x1={70} y1={125} x2={96} y2={130} stroke="#c2410c" strokeWidth="1" />
      <Label x={150} y={222} size={8.5} anchor="middle" color={MUTED}>※ 上から見た形（大きさは実際の比ではない）</Label>
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
      <Halo x={150} y={26} u={1} size={12} weight="800" anchor="middle" color="#ffffff" haloColor="#334155">{top}</Halo>
      <rect x="95" y="170" width="110" height="30" rx="8" fill="#e2e8f0" stroke="#64748b" />
      <Halo x={150} y={190} u={1} size={12} weight="800" anchor="middle" color={INK} haloColor="#e2e8f0">{bottom}</Halo>
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

// ── 地名からわかる町の成り立ち（架空の町）──────────────────────────────────
//   { name: 'placeNames' }
// 城の周りの職人の町（鍛冶町）、街道の宿場町（〜宿）、市が開かれた所（〜市）、新しく開いた田（〜新田）、港（〜津）を、
// 1つの架空の町の地図に置いて、地名と土地の成り立ちの結びつきを示す。
function PlaceNamesDiagram() {
  const houses = [[44, 112], [56, 124], [100, 112], [106, 128], [52, 140], [92, 142], [118, 116], [70, 150]]
  const inn = [[214, 44], [224, 50], [234, 44], [244, 50]]
  const fields = []
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 4; c += 1) fields.push([196 + c * 22, 104 + r * 14])
  return (
    <svg viewBox="0 0 300 230" className="h-auto w-full" role="img" aria-label="地名からわかる町の成り立ち（架空の町）" data-subject-diagram="placeNames">
      <rect x="0" y="0" width="300" height="230" fill="#f8fafc" />
      <path d="M300,168 C262,172 230,194 214,230 L300,230 Z" fill="#bfdbfe" />
      <Label x={268} y={214} size={9} weight="800" color="#1d4ed8" anchor="middle">海</Label>
      <path d="M8,0 C46,52 112,84 150,112 C178,134 194,170 214,214" fill="none" stroke="#60a5fa" strokeWidth="5" />
      <path d="M0,34 L300,56" stroke="#a8a29e" strokeWidth="5" />
      <path d="M150,0 L162,100" stroke="#a8a29e" strokeWidth="3.5" />
      <Label x={10} y={26} size={8.5} color={MUTED}>街道</Label>
      <rect x="62" y="74" width="40" height="34" fill="none" stroke="#93c5fd" strokeWidth="4" />
      <rect x="70" y="80" width="24" height="22" fill="#78716c" />
      <Label x={82} y={68} size={10} weight="800" anchor="middle">城</Label>
      {houses.map(([x, y]) => <rect key={`h${x}-${y}`} x={x} y={y} width="9" height="7" fill="#f59e0b" />)}
      <Label x={14} y={168} size={9.5} weight="800" color="#92400e">鍛冶町</Label>
      <Label x={14} y={180} size={8.5} color="#92400e">同じ仕事の職人の町</Label>
      {inn.map(([x, y]) => <rect key={`i${x}`} x={x} y={y} width="8" height="7" fill="#a16207" />)}
      <Label x={226} y={74} size={9.5} weight="800" color="#a16207" anchor="middle">○○宿</Label>
      <Label x={226} y={86} size={8.5} color="#a16207" anchor="middle">街道の宿場町</Label>
      <circle cx="157" cy="49" r="5" fill="#be123c" />
      <Label x={146} y={12} size={9.5} weight="800" color="#be123c" anchor="end">四日市</Label>
      <Label x={146} y={24} size={8.5} color="#be123c" anchor="end">市が開かれた所</Label>
      {fields.map(([x, y]) => <rect key={`f${x}-${y}`} x={x} y={y} width="20" height="12" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.8" />)}
      <Label x={240} y={164} size={9.5} weight="800" color="#15803d" anchor="middle">○○新田</Label>
      <Label x={240} y={176} size={8.5} color="#15803d" anchor="middle">新しく開いた田</Label>
      <rect x="196" y="204" width="14" height="8" fill="#475569" />
      <Label x={190} y={200} size={9.5} weight="800" color="#1d4ed8" anchor="end">○○津</Label>
      <Label x={190} y={212} size={8.5} color="#1d4ed8" anchor="end">港があった所</Label>
    </svg>
  )
}

// ── 文化財の種類と、国宝・重要文化財 ─────────────────────────────────────────
//   { name: 'heritageLevels' }
// 有形文化財の中から国が特に重要なものを重要文化財に、その中でも特に価値の高いものを国宝に指定する（入れ子の箱）。
// 右に、ほかの文化財の種類（無形・民俗・記念物）を並べる。
function HeritageLevelsDiagram() {
  const others = [
    ['無形文化財', '能などの芸能、工芸の技術'],
    ['民俗文化財', '祭りや年中行事と、その道具'],
    ['記念物', '遺跡・名勝・天然記念物'],
  ]
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="文化財の種類と、国宝・重要文化財" data-subject-diagram="heritageLevels">
      <rect x="4" y="6" width="166" height="186" rx="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.4" />
      <Label x={14} y={24} size={10.5} weight="800" color="#92400e">有形文化財</Label>
      <Label x={14} y={37} size={8.5} color="#92400e">建物・絵画・仏像・古文書など</Label>
      <rect x="18" y="48" width="138" height="132" rx="9" fill="#fde68a" stroke="#d97706" strokeWidth="1.4" />
      <Label x={28} y={66} size={10.5} weight="800" color="#92400e">重要文化財</Label>
      <Label x={28} y={79} size={8.5} color="#92400e">国が特に重要なものを指定</Label>
      <rect x="32" y="92" width="110" height="74" rx="8" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.4" />
      <text x={87} y={124} fontSize="13" fontWeight="800" textAnchor="middle" fill="#ffffff">国宝</text>
      <text x={87} y={140} fontSize="8.5" fontWeight="700" textAnchor="middle" fill="#fee2e2">特に価値の高いもの</text>
      {others.map(([title, sub], index) => (
        <g key={title}>
          <rect x="178" y={6 + index * 63} width="118" height="56" rx="8" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.2" />
          <Label x={237} y={28 + index * 63} size={10.5} weight="800" anchor="middle">{title}</Label>
          <Label x={237} y={44 + index * 63} size={8.5} anchor="middle" color="#475569">{sub}</Label>
        </g>
      ))}
    </svg>
  )
}

// ── たて穴住居（断面）──────────────────────────────────────────────────────
//   { name: 'pitDwelling' }
// 地面をほり下げて床をつくり、柱を立てて草などで屋根をふいた住まい。床の真ん中に、火をたく炉がある。
function PitDwellingDiagram() {
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="たて穴住居の断面" data-subject-diagram="pitDwelling">
      <rect x="0" y="0" width="300" height="200" fill="#f8fafc" />
      <path d="M0,150 L66,150 L76,172 L224,172 L234,150 L300,150 L300,200 L0,200 Z" fill="#d6c7a1" />
      <path d="M0,150 L66,150 L76,172 L224,172 L234,150 L300,150" fill="none" stroke="#8b7355" strokeWidth="1.6" />
      <path d="M40,152 L150,30 L260,152 Z" fill="#c8a96a" stroke="#8b6b2e" strokeWidth="1.6" />
      <path d="M58,152 L150,48 L242,152" fill="none" stroke="#a37f3b" strokeWidth="1" strokeDasharray="3 3" />
      {[112, 188].map((x) => <rect key={x} x={x - 3} y={78} width="6" height="94" fill="#6b4f2a" />)}
      <rect x="106" y="74" width="88" height="6" fill="#6b4f2a" />
      <path d="M150,170 C142,160 146,150 150,144 C154,150 158,160 150,170 Z" fill="#f97316" />
      <rect x="136" y="170" width="28" height="4" fill="#57534e" />
      <Label x={170} y={44} size={9.5} weight="800">屋根（草や木の皮でふく）</Label>
      <Label x={86} y={110} size={9.5} weight="800" anchor="end">柱</Label>
      <Label x={150} y={190} size={9.5} weight="800" anchor="middle">炉（火をたく所）</Label>
      <Label x={252} y={168} size={9.5} weight="800">地面</Label>
      <Label x={20} y={186} size={8.5} color="#5b4636">地面をほり下げた床</Label>
    </svg>
  )
}

// ── 平城京（模式図）──────────────────────────────────────────────────────
//   { name: 'heijokyo' }
// 唐の都長安にならい、道路で碁盤の目のように区切った都。北の中央に平城宮、そこから南へ朱雀大路がのびる。
// 東（右）が左京、西（左）が右京で、左京の北東に外京が張り出す。東大寺は外京の東、興福寺は外京の中にある。
// 東市（左京八条）・西市（右京八条）、薬師寺（右京六条）・唐招提寺（右京五条）も、およその位置に示す。
function HeijokyoDiagram() {
  const x0 = 40
  const y0 = 34
  const cw = 20
  const ch = 18
  const cols = 8
  const rows = 9
  const gx = (col) => x0 + col * cw
  const gy = (row) => y0 + row * ch
  const extra = 3
  const extraRows = 5
  const place = (col, row, color, w = 0.7, h = 0.7) => (
    <rect x={gx(col) + cw * ((1 - w) / 2)} y={gy(row) + ch * ((1 - h) / 2)} width={cw * w} height={ch * h} fill={color} />
  )
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="平城京の模式図" data-subject-diagram="heijokyo">
      <rect x="0" y="0" width="300" height="232" fill="#f8fafc" />
      <rect x={gx(cols)} y={gy(0)} width={cw * extra} height={ch * extraRows} fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
      <rect x={gx(0)} y={gy(0)} width={cw * cols} height={ch * rows} fill="#ffffff" stroke="#475569" strokeWidth="1.2" />
      {Array.from({ length: cols - 1 }, (_, i) => <line key={`v${i}`} x1={gx(i + 1)} x2={gx(i + 1)} y1={gy(0)} y2={gy(rows)} stroke="#cbd5e1" strokeWidth="0.8" />)}
      {Array.from({ length: rows - 1 }, (_, i) => <line key={`h${i}`} x1={gx(0)} x2={gx(cols)} y1={gy(i + 1)} y2={gy(i + 1)} stroke="#cbd5e1" strokeWidth="0.8" />)}
      {Array.from({ length: extra - 1 }, (_, i) => <line key={`ev${i}`} x1={gx(cols + i + 1)} x2={gx(cols + i + 1)} y1={gy(0)} y2={gy(extraRows)} stroke="#e7d68a" strokeWidth="0.8" />)}
      {Array.from({ length: extraRows - 1 }, (_, i) => <line key={`eh${i}`} x1={gx(cols)} x2={gx(cols + extra)} y1={gy(i + 1)} y2={gy(i + 1)} stroke="#e7d68a" strokeWidth="0.8" />)}
      <rect x={gx(3)} y={gy(0)} width={cw * 2} height={ch * 2} fill="#7c3aed" />
      <Halo x={gx(4)} y={gy(1) + 6} u={1} size={9.5} weight="800" anchor="middle" color="#ffffff" haloColor="#7c3aed">平城宮</Halo>
      <line x1={gx(4)} x2={gx(4)} y1={gy(2)} y2={gy(rows)} stroke="#b91c1c" strokeWidth="3" />
      <Label x={gx(4) + 4} y={gy(6) + 4} size={9} weight="800" color={RED}>朱雀大路</Label>
      <Label x={gx(4)} y={gy(rows) + 13} size={9} weight="800" anchor="middle" color={RED}>羅城門</Label>
      {place(6, 7, '#0f766e')}
      <Label x={gx(7) + 2} y={gy(7) + 13} size={9} weight="800" color="#0f766e">東市</Label>
      {place(1, 7, '#0f766e')}
      <Label x={gx(1) - 2} y={gy(7) + 13} size={9} weight="800" anchor="end" color="#0f766e">西市</Label>
      {place(1, 4, '#b45309')}
      <Label x={gx(1) - 2} y={gy(4) + 13} size={9} weight="800" anchor="end" color="#92400e">唐招提寺</Label>
      {place(1, 5, '#b45309')}
      <Label x={gx(1) - 2} y={gy(5) + 13} size={9} weight="800" anchor="end" color="#92400e">薬師寺</Label>
      {place(cols + 1, 2, '#b45309')}
      <Label x={gx(cols + 1) + cw / 2} y={gy(2) - 3} size={9} weight="800" anchor="middle" color="#92400e">興福寺</Label>
      <rect x={gx(cols + extra) + 6} y={gy(0) + 6} width="22" height="22" fill="#b45309" />
      <Label x={gx(cols + extra) + 17} y={gy(2) + 4} size={9} weight="800" anchor="middle" color="#92400e">東大寺</Label>
      <Label x={gx(2)} y={gy(0) - 6} size={9.5} weight="800" anchor="middle">右京（西）</Label>
      <Label x={gx(6)} y={gy(0) - 6} size={9.5} weight="800" anchor="middle">左京（東）</Label>
      <Label x={gx(cols) + (cw * extra) / 2} y={gy(0) - 6} size={9.5} weight="800" anchor="middle" color="#a16207">外京</Label>
      <path d="M14,40 L18,30 L22,40 Z" fill={INK} />
      <Label x={18} y={52} size={9} weight="800" anchor="middle">北</Label>
      <Label x={286} y={226} size={8.5} anchor="end" color={MUTED}>※ 道路で碁盤の目のように区切られた（模式図）</Label>
    </svg>
  )
}

// ── 仮名文字のもとになった漢字 ──────────────────────────────────────────────
//   { name: 'kanaOrigins' }
// ひらがなは漢字をくずした形から、カタカナは漢字の一部をとってつくられた（あ←安、ア←阿 など）。
function KanaOriginsDiagram() {
  const hira = [['安', 'あ'], ['以', 'い'], ['宇', 'う'], ['衣', 'え'], ['於', 'お']]
  const kata = [['阿', 'ア'], ['伊', 'イ'], ['宇', 'ウ'], ['江', 'エ'], ['於', 'オ']]
  const column = (items, x, color) => items.map(([kanji, kana], index) => {
    const y = 58 + index * 26
    return (
      <g key={`${x}-${kanji}-${kana}`}>
        <text x={x} y={y} fontSize="15" fontWeight="700" textAnchor="middle" fill="#64748b">{kanji}</text>
        <path d={`M${x + 14},${y - 5} L${x + 34},${y - 5}`} stroke={color} strokeWidth="1.6" />
        <path d={`M${x + 34},${y - 5} L${x + 29},${y - 8.5} L${x + 29},${y - 1.5} Z`} fill={color} />
        <text x={x + 50} y={y} fontSize="17" fontWeight="800" textAnchor="middle" fill={color}>{kana}</text>
      </g>
    )
  })
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="仮名文字のもとになった漢字" data-subject-diagram="kanaOrigins">
      <rect x="6" y="6" width="138" height="184" rx="10" fill="#fff7ed" stroke="#f97316" strokeWidth="1.2" />
      <rect x="156" y="6" width="138" height="184" rx="10" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.2" />
      <Label x={75} y={24} size={10.5} weight="800" anchor="middle" color="#c2410c">ひらがな</Label>
      <Label x={75} y={37} size={8.5} anchor="middle" color="#c2410c">漢字をくずした形から</Label>
      <Label x={225} y={24} size={10.5} weight="800" anchor="middle" color="#1d4ed8">カタカナ</Label>
      <Label x={225} y={37} size={8.5} anchor="middle" color="#1d4ed8">漢字の一部をとって</Label>
      {column(hira, 50, '#c2410c')}
      {column(kata, 200, '#1d4ed8')}
    </svg>
  )
}

// ── 城と天守（横から見た模式図）───────────────────────────────────────────
//   { name: 'castleKeep' }
// 堀と石垣で守った高い土台（本丸）の上に、何層もの屋根をもつ天守がそびえる。天守は、城主の権力を示した。
function CastleKeepDiagram() {
  const tiers = [
    { x: 104, w: 92, y: 118, h: 16 },
    { x: 112, w: 76, y: 96, h: 14 },
    { x: 120, w: 60, y: 76, h: 13 },
    { x: 127, w: 46, y: 58, h: 12 },
    { x: 133, w: 34, y: 41, h: 12 },
  ]
  return (
    <svg viewBox="0 0 300 212" className="h-auto w-full" role="img" aria-label="城と天守" data-subject-diagram="castleKeep">
      <rect x="0" y="0" width="300" height="212" fill="#f0f9ff" />
      <rect x="0" y="172" width="300" height="40" fill="#d6c7a1" />
      <rect x="18" y="164" width="44" height="22" fill="#60a5fa" />
      <rect x="238" y="164" width="44" height="22" fill="#60a5fa" />
      <path d="M62,172 L84,134 L216,134 L238,172 Z" fill="#a8a29e" stroke="#57534e" strokeWidth="1.2" />
      {[146, 158].map((y) => <line key={y} x1={62 + (172 - y) * 0.58} x2={238 - (172 - y) * 0.58} y1={y} y2={y} stroke="#78716c" strokeWidth="0.8" />)}
      {tiers.map((tier) => (
        <g key={tier.y}>
          <rect x={tier.x} y={tier.y} width={tier.w} height={tier.h} fill="#f8fafc" stroke="#475569" strokeWidth="1" />
          <path d={`M${tier.x - 8},${tier.y} L${tier.x + 4},${tier.y - 7} L${tier.x + tier.w - 4},${tier.y - 7} L${tier.x + tier.w + 8},${tier.y} Z`} fill="#334155" />
        </g>
      ))}
      <path d="M140,34 L150,22 L160,34 Z" fill="#334155" />
      <Label x={206} y={70} size={10.5} weight="800">天守</Label>
      <Label x={206} y={83} size={8.5} color="#475569">高くそびえ、遠くからも</Label>
      <Label x={206} y={95} size={8.5} color="#475569">城主の力が見える</Label>
      <Label x={150} y={156} size={10} weight="800" anchor="middle" color="#292524">石垣</Label>
      <Label x={40} y={160} size={10} weight="800" anchor="middle" color="#1d4ed8">堀</Label>
      <Label x={260} y={160} size={10} weight="800" anchor="middle" color="#1d4ed8">堀</Label>
      <Label x={150} y={202} size={8.5} anchor="middle" color={MUTED}>※ 横から見た模式図</Label>
    </svg>
  )
}

// ── フランス革命の前の三つの身分 ─────────────────────────────────────────
//   { name: 'estates' }
// 上の二つの身分（聖職者・貴族）は人口のごく一部なのに税を納めない特権をもち、人口の大部分の第三身分（平民）が
// 重い税を負担した。三角形の段の広さで、人数のちがいを表す（およその形）。
function EstatesDiagram() {
  // 三角形の頂点 (70, 14)、底辺 y=174（x は 4〜136）。y の高さでの右の辺の x。
  const right = (y) => 70 + ((y - 14) * 66) / 160
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="フランス革命の前の三つの身分" data-subject-diagram="estates">
      <path d={`M70,14 L${right(40)},40 L${140 - right(40)},40 Z`} fill="#7c3aed" />
      <path d={`M${140 - right(40)},40 L${right(40)},40 L${right(70)},70 L${140 - right(70)},70 Z`} fill="#c4b5fd" />
      <path d={`M${140 - right(70)},70 L${right(70)},70 L136,174 L4,174 Z`} fill="#fde68a" />
      <path d="M70,14 L136,174 L4,174 Z" fill="none" stroke="#475569" strokeWidth="1.2" />
      <line x1={right(32) + 2} y1={32} x2={96} y2={32} stroke="#7c3aed" strokeWidth="1" />
      <Label x={98} y={36} size={9.5} weight="800" color="#5b21b6">第一身分（聖職者）</Label>
      <line x1={right(56) + 2} y1={56} x2={104} y2={56} stroke="#7c3aed" strokeWidth="1" />
      <Label x={106} y={60} size={9.5} weight="800" color="#6d28d9">第二身分（貴族）</Label>
      <path d="M200,24 L206,24 L206,64 L200,64" fill="none" stroke="#7c3aed" strokeWidth="1.2" />
      <Label x={212} y={36} size={9} weight="800" color="#5b21b6">人口のごく一部</Label>
      <Label x={212} y={50} size={9} weight="800" color="#5b21b6">税を納めない</Label>
      <Label x={212} y={64} size={9} weight="800" color="#5b21b6">特権をもつ</Label>
      <Label x={70} y={130} size={11} weight="800" anchor="middle" color="#78350f">第三身分（平民）</Label>
      <Label x={70} y={146} size={8.5} anchor="middle" color="#92400e">農民・商工業者など</Label>
      <Label x={150} y={124} size={9.5} weight="800" color="#92400e">人口の大部分</Label>
      <Label x={150} y={139} size={9.5} weight="800" color="#92400e">重い税を負担する</Label>
      <Label x={150} y={190} size={8.5} anchor="middle" color={MUTED}>※ 段の広さは人数のおよそのちがい</Label>
    </svg>
  )
}

export const HISTORY_DIAGRAMS = Object.freeze({
  centuryLine: CenturyLineDiagram,
  keyholeTomb: KeyholeTombDiagram,
  mutualBond: MutualBondDiagram,
  tradeTriangle: TradeTriangleDiagram,
  placeNames: PlaceNamesDiagram,
  heritageLevels: HeritageLevelsDiagram,
  pitDwelling: PitDwellingDiagram,
  heijokyo: HeijokyoDiagram,
  kanaOrigins: KanaOriginsDiagram,
  castleKeep: CastleKeepDiagram,
  estates: EstatesDiagram,
})
