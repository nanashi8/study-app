// 理科の図解（顕微鏡・花のつくりなど）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。部分の名前は、引き出し線の先に書く。

const INK = '#1f2937'
const LINE = '#475569'
const METAL = '#cbd5e1'
const DARK = '#64748b'

function Label({ x, y, children, anchor = 'start', size = 10, color = INK, weight = '700' }) {
  const common = { x, y, fontSize: size, fontWeight: weight, textAnchor: anchor }
  return (
    <g>
      <text {...common} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">{children}</text>
      <text {...common} fill={color}>{children}</text>
    </g>
  )
}

/** 引き出し線つきの名前。from（部分の点）から to（文字の端）へ線を引き、文字を置く。 */
function Callout({ from, to, text, anchor = to[0] < from[0] ? 'end' : 'start' }) {
  const [x, y] = to
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} stroke={LINE} strokeWidth="0.8" />
      <circle cx={from[0]} cy={from[1]} r="1.6" fill={LINE} />
      <Label x={anchor === 'end' ? x - 3 : x + 3} y={y + 3.5} anchor={anchor}>{text}</Label>
    </g>
  )
}

// ── 顕微鏡 ─────────────────────────────────────────────────────────────
//   { name: 'microscope' }
// 学校で使う顕微鏡を横から見た形。接眼レンズ・鏡筒・レボルバー・対物レンズ・ステージ・しぼり・反射鏡・調節ねじ・アームの名前を示す。
function MicroscopeDiagram() {
  return (
    <svg viewBox="0 0 300 262" className="h-auto w-full" role="img" aria-label="顕微鏡の各部分の名前" data-subject-diagram="microscope">
      {/* 鏡台とアーム */}
      <rect x="92" y="236" width="118" height="14" rx="5" fill={DARK} />
      <path d="M168,238 L174,204 Q192,150 180,62 L166,62 Q178,148 160,204 L154,238 Z" fill={DARK} />
      {/* 鏡筒と接眼レンズ */}
      <rect x="132" y="40" width="22" height="58" rx="2" fill={METAL} stroke={LINE} strokeWidth="1" />
      <rect x="135" y="22" width="16" height="20" rx="2" fill="#e2e8f0" stroke={LINE} strokeWidth="1" />
      <rect x="152" y="62" width="18" height="10" fill={DARK} />
      {/* レボルバーと対物レンズ */}
      <path d="M124,98 L162,98 L156,108 L130,108 Z" fill={METAL} stroke={LINE} strokeWidth="1" />
      <rect x="136" y="108" width="14" height="24" rx="2" fill="#e2e8f0" stroke={LINE} strokeWidth="1" />
      <path d="M126,106 L118,122 L126,126 L132,108 Z" fill="#e2e8f0" stroke={LINE} strokeWidth="1" />
      {/* ステージ・プレパラート・クリップ */}
      <rect x="98" y="140" width="96" height="8" rx="1.5" fill={DARK} />
      <rect x="120" y="136" width="46" height="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.6" />
      <rect x="112" y="134" width="10" height="3" rx="1" fill={LINE} />
      <rect x="164" y="134" width="10" height="3" rx="1" fill={LINE} />
      <rect x="180" y="148" width="10" height="46" fill={DARK} />
      {/* しぼりと反射鏡 */}
      <rect x="130" y="150" width="26" height="6" rx="1" fill={METAL} stroke={LINE} strokeWidth="1" />
      <line x1="143" y1="194" x2="186" y2="194" stroke={DARK} strokeWidth="3" />
      <ellipse cx="143" cy="198" rx="17" ry="5" fill="#e0f2fe" stroke={LINE} strokeWidth="1.2" />
      {/* 調節ねじ */}
      <circle cx="184" cy="120" r="10" fill={METAL} stroke={LINE} strokeWidth="1.2" />
      <circle cx="184" cy="120" r="4" fill={LINE} />

      <Callout from={[135, 30]} to={[96, 30]} text="接眼レンズ" />
      <Callout from={[132, 70]} to={[96, 70]} text="鏡筒" />
      <Callout from={[126, 102]} to={[96, 100]} text="レボルバー" />
      <Callout from={[122, 120]} to={[96, 119]} text="対物レンズ" />
      <Callout from={[124, 138]} to={[96, 137]} text="プレパラート" />
      <Callout from={[100, 145]} to={[96, 155]} text="ステージ" />
      <Callout from={[130, 154]} to={[96, 173]} text="しぼり" />
      <Callout from={[127, 198]} to={[96, 206]} text="反射鏡" />
      <Callout from={[194, 120]} to={[214, 120]} text="調節ねじ" />
      <Callout from={[172, 150]} to={[214, 160]} text="アーム" />
      <Callout from={[170, 136]} to={[214, 140]} text="クリップ" />
      <Callout from={[186, 243]} to={[214, 243]} text="鏡台" />
    </svg>
  )
}

// ── 顕微鏡の視野と像の動かし方 ─────────────────────────────────────────────
//   { name: 'microscopeView' }
// 視野の左下に見える生物を中央に動かす例。像は上下左右が逆なので、プレパラートは像が見える向き（左下）へ動かす。
function MicroscopeViewDiagram() {
  const Cell = ({ cx, cy }) => (
    <g>
      <ellipse cx={cx} cy={cy} rx="13" ry="8" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.2" />
      <circle cx={cx + 2} cy={cy} r="2.5" fill="#15803d" />
    </g>
  )
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label="顕微鏡の視野の中で像を動かす向き" data-subject-diagram="microscopeView">
      <circle cx="62" cy="82" r="46" fill="#f8fafc" stroke={LINE} strokeWidth="1.5" />
      <Cell cx={42} cy={102} />
      <circle cx="238" cy="82" r="46" fill="#f8fafc" stroke={LINE} strokeWidth="1.5" />
      <Cell cx={238} cy={82} />
      <line x1="132" y1="82" x2="164" y2="82" stroke="#b91c1c" strokeWidth="2.2" />
      <path d="M168,82 L160,77 L160,87 Z" fill="#b91c1c" />
      <Label x={62} y={24} anchor="middle" size={10}>像が左下に見える</Label>
      <Label x={238} y={24} anchor="middle" size={10}>中央に来た</Label>
      <Label x={150} y={68} anchor="middle" size={9} color="#b91c1c">プレパラートを</Label>
      <Label x={150} y={102} anchor="middle" size={9} color="#b91c1c">左下へ動かす</Label>
      <Label x={150} y={160} anchor="middle" size={9.5} color={LINE}>像は上下左右が逆。プレパラートは像が見える向きへ動かす</Label>
    </svg>
  )
}

export const SCIENCE_DIAGRAMS = Object.freeze({
  microscope: MicroscopeDiagram,
  microscopeView: MicroscopeViewDiagram,
})
