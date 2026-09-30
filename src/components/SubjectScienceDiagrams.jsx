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
function Callout({ from, to, text, anchor = to[0] < from[0] ? 'end' : 'start', color = INK }) {
  const [x, y] = to
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} stroke={LINE} strokeWidth="0.8" />
      <circle cx={from[0]} cy={from[1]} r="1.6" fill={LINE} />
      <Label x={anchor === 'end' ? x - 3 : x + 3} y={y + 3.5} anchor={anchor} color={color}>{text}</Label>
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

const LEAF = '#bbf7d0'
const LEAF_LINE = '#15803d'
const PETAL = '#fef08a'
const PETAL_LINE = '#ca8a04'

// ── 花のつくり ───────────────────────────────────────────────────────────
//   { name: 'flowerParts' }
// アブラナのような花を縦に切った形。外側から、がく・花弁・おしべ（やく）・めしべ（柱頭・子房・胚珠）を示す。
function FlowerPartsDiagram() {
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="花のつくり" data-subject-diagram="flowerParts">
      {/* 花弁（左右） */}
      <path d="M140,186 C110,160 70,120 62,70 C92,82 124,120 146,176 Z" fill={PETAL} stroke={PETAL_LINE} strokeWidth="1.2" />
      <path d="M160,186 C190,160 230,120 238,70 C208,82 176,120 154,176 Z" fill={PETAL} stroke={PETAL_LINE} strokeWidth="1.2" />
      {/* がく（左右） */}
      <path d="M142,192 C124,196 104,206 92,218 C114,214 132,206 146,198 Z" fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.1" />
      <path d="M158,192 C176,196 196,206 208,218 C186,214 168,206 154,198 Z" fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.1" />
      {/* 花柄 */}
      <line x1="150" y1="196" x2="150" y2="234" stroke={LEAF_LINE} strokeWidth="3" />
      {/* おしべ（左右） */}
      <path d="M140,188 Q126,150 120,112" fill="none" stroke="#a16207" strokeWidth="1.6" />
      <path d="M160,188 Q174,150 180,112" fill="none" stroke="#a16207" strokeWidth="1.6" />
      <ellipse cx="119" cy="104" rx="5" ry="9" fill="#facc15" stroke="#a16207" strokeWidth="1" />
      <ellipse cx="181" cy="104" rx="5" ry="9" fill="#facc15" stroke="#a16207" strokeWidth="1" />
      {/* めしべ：柱頭・花柱・子房・胚珠 */}
      <rect x="147" y="92" width="6" height="52" fill={LEAF} stroke={LEAF_LINE} strokeWidth="1" />
      <ellipse cx="150" cy="90" rx="8" ry="4.5" fill="#86efac" stroke={LEAF_LINE} strokeWidth="1" />
      <ellipse cx="150" cy="166" rx="15" ry="24" fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.3" />
      {[148, 160, 172, 184].map((y) => <circle key={y} cx="150" cy={y - 2} r="3.2" fill="#fef3c7" stroke="#b45309" strokeWidth="0.9" />)}
      {/* 花たく */}
      <path d="M132,190 Q150,202 168,190" fill="none" stroke={LEAF_LINE} strokeWidth="2" />

      <Callout from={[157, 89]} to={[214, 64]} text="柱頭" />
      <Callout from={[153, 120]} to={[214, 96]} text="めしべ" />
      <Callout from={[163, 160]} to={[240, 150]} text="子房" />
      <Callout from={[153, 170]} to={[240, 176]} text="胚珠" />
      <Callout from={[114, 100]} to={[70, 104]} text="やく" />
      <Callout from={[128, 150]} to={[70, 142]} text="おしべ" />
      <Callout from={[82, 88]} to={[48, 44]} text="花弁" />
      <Callout from={[112, 208]} to={[70, 226]} text="がく" />
    </svg>
  )
}

// ── マツの花（雌花と雄花のりん片） ─────────────────────────────────────────────
//   { name: 'pineScales' }
// 雌花のりん片には胚珠がむき出しでつき、雄花のりん片には花粉のうがある。花粉は風で運ばれ、胚珠に直接つく。
function PineScalesDiagram() {
  const Scale = ({ x }) => <path d={`M${x - 42},132 Q${x - 44},62 ${x},40 Q${x + 44},62 ${x + 42},132 Q${x},144 ${x - 42},132 Z`} fill="#d6b58c" stroke="#7c5a2f" strokeWidth="1.3" />
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="マツの雌花と雄花のりん片" data-subject-diagram="pineScales">
      <Label x={70} y={24} anchor="middle" size={10.5}>雌花のりん片</Label>
      <Scale x={70} />
      <ellipse cx="54" cy="112" rx="9" ry="13" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />
      <ellipse cx="86" cy="112" rx="9" ry="13" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />
      <Callout from={[54, 124]} to={[40, 160]} text="胚珠（むき出し）" anchor="start" />

      <Label x={230} y={24} anchor="middle" size={10.5}>雄花のりん片</Label>
      <Scale x={230} />
      <ellipse cx="214" cy="116" rx="11" ry="15" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
      <ellipse cx="246" cy="116" rx="11" ry="15" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
      <Callout from={[246, 128]} to={[260, 160]} text="花粉のう" anchor="end" />
      {[[178, 70], [170, 84], [160, 74]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#facc15" stroke="#a16207" strokeWidth="0.8" />)}
      <line x1="150" y1="80" x2="104" y2="96" stroke="#b91c1c" strokeWidth="1.8" />
      <path d="M100,98 L107,90 L110,99 Z" fill="#b91c1c" />
      <Label x={150} y={186} anchor="middle" size={9.5} color="#b91c1c">花粉が風で運ばれ、胚珠に直接つく（子房はない）</Label>
    </svg>
  )
}

// ── 単子葉類と双子葉類 ─────────────────────────────────────────────────────
//   { name: 'monocotDicot' }
// 子葉の数・葉脈・根のようすを、左（単子葉類）と右（双子葉類）で比べる。
function MonocotDicotDiagram() {
  const col = [75, 225]
  return (
    <svg viewBox="0 0 300 300" className="h-auto w-full" role="img" aria-label="単子葉類と双子葉類のちがい" data-subject-diagram="monocotDicot">
      <line x1="150" y1="8" x2="150" y2="296" stroke="#cbd5e1" strokeWidth="1" />
      <Label x={col[0]} y={20} anchor="middle" size={11.5} weight="800">単子葉類</Label>
      <Label x={col[1]} y={20} anchor="middle" size={11.5} weight="800">双子葉類</Label>
      {/* 子葉 */}
      <line x1={col[0]} y1="84" x2={col[0]} y2="62" stroke={LEAF_LINE} strokeWidth="2" />
      <path d={`M${col[0]},64 C${col[0] - 6},50 ${col[0] - 4},36 ${col[0] + 2},30 C${col[0] + 6},42 ${col[0] + 4},54 ${col[0]},64 Z`} fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.2" />
      <line x1={col[1]} y1="84" x2={col[1]} y2="56" stroke={LEAF_LINE} strokeWidth="2" />
      <ellipse cx={col[1] - 15} cy="50" rx="15" ry="8" fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.2" transform={`rotate(-18 ${col[1] - 15} 50)`} />
      <ellipse cx={col[1] + 15} cy="50" rx="15" ry="8" fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.2" transform={`rotate(18 ${col[1] + 15} 50)`} />
      <Label x={col[0]} y={100} anchor="middle" size={10}>子葉が1枚</Label>
      <Label x={col[1]} y={100} anchor="middle" size={10}>子葉が2枚</Label>
      {/* 葉脈 */}
      <path d={`M${col[0]},178 C${col[0] - 16},156 ${col[0] - 14},128 ${col[0]},112 C${col[0] + 14},128 ${col[0] + 16},156 ${col[0]},178 Z`} fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.2" />
      {[-8, -4, 0, 4, 8].map((dx) => <path key={dx} d={`M${col[0] + dx * 0.15},116 Q${col[0] + dx * 1.3},145 ${col[0] + dx * 0.15},174`} fill="none" stroke={LEAF_LINE} strokeWidth="0.9" />)}
      <path d={`M${col[1]},178 C${col[1] - 30},160 ${col[1] - 28},128 ${col[1]},112 C${col[1] + 28},128 ${col[1] + 30},160 ${col[1]},178 Z`} fill={LEAF} stroke={LEAF_LINE} strokeWidth="1.2" />
      <line x1={col[1]} y1="114" x2={col[1]} y2="176" stroke={LEAF_LINE} strokeWidth="1.3" />
      {[[128, 9], [140, 14], [152, 15], [164, 10]].map(([y, w]) => (
        <g key={y}>
          <path d={`M${col[1]},${y + 5} L${col[1] - w},${y - 3} M${col[1] - w * 0.55},${y + 1} L${col[1] - w * 0.8},${y + 6}`} fill="none" stroke={LEAF_LINE} strokeWidth="0.9" />
          <path d={`M${col[1]},${y + 5} L${col[1] + w},${y - 3} M${col[1] + w * 0.55},${y + 1} L${col[1] + w * 0.8},${y + 6}`} fill="none" stroke={LEAF_LINE} strokeWidth="0.9" />
        </g>
      ))}
      <Label x={col[0]} y={196} anchor="middle" size={10}>平行脈</Label>
      <Label x={col[1]} y={196} anchor="middle" size={10}>網状脈</Label>
      {/* 根 */}
      {[-24, -16, -8, 0, 8, 16, 24].map((dx) => <path key={dx} d={`M${col[0]},210 Q${col[0] + dx * 0.6},238 ${col[0] + dx},266`} fill="none" stroke="#92400e" strokeWidth="1.2" />)}
      <line x1={col[1]} y1="208" x2={col[1]} y2="270" stroke="#92400e" strokeWidth="3.2" />
      {[222, 236, 250].map((y) => (
        <g key={y}>
          <path d={`M${col[1]},${y} L${col[1] - 18},${y + 10}`} stroke="#92400e" strokeWidth="1.1" />
          <path d={`M${col[1]},${y + 4} L${col[1] + 18},${y + 14}`} stroke="#92400e" strokeWidth="1.1" />
        </g>
      ))}
      <Label x={col[0]} y={288} anchor="middle" size={10}>ひげ根</Label>
      <Label x={col[1]} y={288} anchor="middle" size={10}>主根と側根</Label>
    </svg>
  )
}

// ── 昆虫のからだのつくり ───────────────────────────────────────────────────
//   { name: 'insectBody' }
// 上から見た昆虫。からだは頭部・胸部・腹部に分かれ、あし6本とはねは胸部につく。
function InsectBodyDiagram() {
  const body = '#fcd34d'
  const edge = '#92400e'
  const legs = [[74, -1], [86, 0], [98, 1]]
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="昆虫のからだのつくり" data-subject-diagram="insectBody">
      {/* はね */}
      <ellipse cx="118" cy="104" rx="14" ry="44" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" opacity="0.9" transform="rotate(28 118 104)" />
      <ellipse cx="182" cy="104" rx="14" ry="44" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" opacity="0.9" transform="rotate(-28 182 104)" />
      {/* あし（胸部から左右に3本ずつ） */}
      {legs.map(([y, k]) => (
        <g key={y}>
          <path d={`M138,${y} L112,${y - 8 + k * 10} L96,${y + 10 + k * 16}`} fill="none" stroke={edge} strokeWidth="1.8" />
          <path d={`M162,${y} L188,${y - 8 + k * 10} L204,${y + 10 + k * 16}`} fill="none" stroke={edge} strokeWidth="1.8" />
        </g>
      ))}
      {/* 触角 */}
      <path d="M144,28 Q132,10 118,6" fill="none" stroke={edge} strokeWidth="1.4" />
      <path d="M156,28 Q168,10 182,6" fill="none" stroke={edge} strokeWidth="1.4" />
      {/* 頭部・胸部・腹部 */}
      <circle cx="150" cy="40" r="14" fill={body} stroke={edge} strokeWidth="1.3" />
      <ellipse cx="150" cy="86" rx="16" ry="26" fill={body} stroke={edge} strokeWidth="1.3" />
      <ellipse cx="150" cy="156" rx="19" ry="44" fill={body} stroke={edge} strokeWidth="1.3" />
      {[128, 142, 156, 170, 184].map((y) => <line key={y} x1={150 - Math.sqrt(Math.max(0, 1 - ((y - 156) / 44) ** 2)) * 19} y1={y} x2={150 + Math.sqrt(Math.max(0, 1 - ((y - 156) / 44) ** 2)) * 19} y2={y} stroke={edge} strokeWidth="0.8" />)}
      <Callout from={[163, 38]} to={[236, 30]} text="頭部" />
      <Callout from={[165, 86]} to={[236, 60]} text="胸部" />
      <Callout from={[168, 160]} to={[236, 176]} text="腹部" />
      <Callout from={[118, 4]} to={[70, 12]} text="触角" />
      <Callout from={[100, 120]} to={[70, 150]} text="はね" anchor="end" />
      <Callout from={[96, 80]} to={[70, 90]} text="あし（6本）" anchor="end" />
      <Label x={150} y={224} anchor="middle" size={9.5} color="#92400e">あしとはねは、どちらも胸部につく</Label>
    </svg>
  )
}

// ── 肉食動物と草食動物の目のつき方 ─────────────────────────────────────────────
//   { name: 'eyeFields' }
// 上から見た頭と、左右の目で見える範囲。肉食動物は両目で見える範囲が広く、草食動物は見わたせる範囲が広い。
function EyeFieldsDiagram() {
  const r = 62
  const sector = (cx, cy, a1, a2) => {
    const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
    const [x1, y1] = p(a1)
    const [x2, y2] = p(a2)
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2},${y2} Z`
  }
  const Panel = ({ cx, title, left, right, eyes, note }) => (
    <g>
      <Label x={cx} y={16} anchor="middle" size={10.5} weight="800">{title}</Label>
      <path d={sector(cx, 104, ...left)} fill="#60a5fa" opacity="0.28" />
      <path d={sector(cx, 104, ...right)} fill="#60a5fa" opacity="0.28" />
      <ellipse cx={cx} cy="110" rx="17" ry="22" fill="#fde68a" stroke="#92400e" strokeWidth="1.2" />
      {eyes.map(([dx, dy]) => <circle key={dx} cx={cx + dx} cy={104 + dy} r="3.2" fill={INK} />)}
      <Label x={cx} y={184} anchor="middle" size={9.5}>{note}</Label>
    </g>
  )
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="肉食動物と草食動物の見える範囲" data-subject-diagram="eyeFields">
      <Panel cx={75} title="肉食動物（ライオン）" left={[-180, -20]} right={[-160, 0]} eyes={[[-7, -14], [7, -14]]} note="両目で見える範囲が広い" />
      <Panel cx={225} title="草食動物（シマウマ）" left={[110, 290]} right={[-110, 70]} eyes={[[-15, -4], [15, -4]]} note="見わたせる範囲が広い" />
      <Label x={75} y={62} anchor="middle" size={8.5} color="#1d4ed8">両目で見える</Label>
      <Label x={225} y={30} anchor="middle" size={8.5} color="#1d4ed8">▲前</Label>
      <Label x={75} y={30} anchor="middle" size={8.5} color="#1d4ed8">▲前</Label>
      <Label x={225} y={172} anchor="middle" size={8.5} color={DARK}>見えない</Label>
    </svg>
  )
}

// ── ガスバーナー ──────────────────────────────────────────────────────
//   { name: 'gasBurner' }
// 上が空気調節ねじ、下がガス調節ねじ。空気の量を増やすと、炎は赤っぽい色から青い色になる。
function GasBurnerDiagram() {
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="ガスバーナーの各部分の名前" data-subject-diagram="gasBurner">
      <path d="M150,14 C136,34 138,50 142,62 L158,62 C162,50 164,34 150,14 Z" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1.2" />
      <path d="M150,34 C144,46 145,54 147,62 L153,62 C155,54 156,46 150,34 Z" fill="#dbeafe" />
      <rect x="142" y="62" width="16" height="118" fill={METAL} stroke={LINE} strokeWidth="1.2" />
      <rect x="134" y="120" width="32" height="12" rx="2" fill="#94a3b8" stroke={LINE} strokeWidth="1.2" />
      <rect x="132" y="146" width="36" height="12" rx="2" fill={DARK} stroke={LINE} strokeWidth="1.2" />
      <path d="M120,180 L180,180 L196,206 L104,206 Z" fill={DARK} />
      <rect x="180" y="190" width="64" height="8" fill={METAL} stroke={LINE} strokeWidth="1" />
      <rect x="220" y="184" width="10" height="20" rx="2" fill="#94a3b8" stroke={LINE} strokeWidth="1" />
      <Callout from={[158, 40]} to={[206, 30]} text="炎" />
      <Callout from={[166, 126]} to={[206, 112]} text="空気調節ねじ（上）" />
      <Callout from={[168, 152]} to={[206, 150]} text="ガス調節ねじ（下）" />
      <Callout from={[225, 184]} to={[206, 222]} text="コック" anchor="end" />
      <Label x={16} y={40} size={9.5} color="#1d4ed8">空気を増やすと</Label>
      <Label x={16} y={54} size={9.5} color="#1d4ed8">赤い炎 → 青い炎</Label>
    </svg>
  )
}

// ── メスシリンダーの目もりの読み方 ───────────────────────────────────────────
//   { name: 'cylinderReading' }
// 液面のへこんだ下の面を、真横から見て、最小目もり（1mL）の10分の1まで読む。例は45.5mL。
function CylinderReadingDiagram() {
  const y = (mL) => 150 - (mL - 43) * 20
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label="メスシリンダーの目もりの読み方" data-subject-diagram="cylinderReading">
      <path d={`M122,${y(45.5) - 6} Q148,${y(45.5) + 6} 174,${y(45.5) - 6} L174,166 L122,166 Z`} fill="#bae6fd" />
      <line x1="122" y1="20" x2="122" y2="166" stroke={LINE} strokeWidth="1.6" />
      <line x1="174" y1="20" x2="174" y2="166" stroke={LINE} strokeWidth="1.6" />
      {[43, 44, 45, 46, 47, 48].map((mL) => (
        <g key={mL}>
          <line x1="174" y1={y(mL)} x2="186" y2={y(mL)} stroke={INK} strokeWidth="1" />
          <Label x={190} y={y(mL) + 3.5} size={9}>{mL}</Label>
        </g>
      ))}
      <line x1="40" y1={y(45.5)} x2="146" y2={y(45.5)} stroke="#15803d" strokeWidth="1.4" />
      <circle cx="36" cy={y(45.5)} r="5" fill="#ffffff" stroke="#15803d" strokeWidth="1.4" />
      <Label x={36} y={y(45.5) - 10} anchor="middle" size={9} color="#15803d">真横から見る</Label>
      <line x1="40" y1="30" x2="140" y2={y(45.5)} stroke="#b91c1c" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="36" cy="28" r="5" fill="#ffffff" stroke="#b91c1c" strokeWidth="1.2" />
      <Label x={52} y={24} size={8.5} color="#b91c1c">上から見るのはまちがい</Label>
      <Callout from={[148, y(45.5)]} to={[214, 62]} text="へこんだ下の面" />
      <Label x={214} y={124} size={9.5} weight="800">読み：45.5mL</Label>
      <Label x={214} y={138} size={8.5} color={LINE}>（1mLの10分の1</Label>
      <Label x={214} y={150} size={8.5} color={LINE}>まで読む）</Label>
    </svg>
  )
}

const WATER = '#bae6fd'
const GLASS = '#f8fafc'

// ── 気体の集め方 ─────────────────────────────────────────────────────────
//   { name: 'gasCollection' }
// 水上置換法・上方置換法・下方置換法の3つ。試験管の口の向きと、気体を入れる管の位置を比べる。
function GasCollectionDiagram() {
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="気体の集め方" data-subject-diagram="gasCollection">
      {/* 水上置換法 */}
      <rect x="8" y="112" width="84" height="46" fill={WATER} stroke={LINE} strokeWidth="1.2" />
      <path d="M42,40 L42,128 L58,128 L58,40 Q50,32 42,40 Z" fill={WATER} stroke={LINE} strokeWidth="1.2" />
      <rect x="43" y="42" width="14" height="30" fill={GLASS} />
      <path d="M2,92 L20,92 L20,146 L50,146 L50,130" fill="none" stroke={DARK} strokeWidth="2.4" />
      {[122, 110, 96, 84].map((y) => <circle key={y} cx="50" cy={y} r="2.6" fill="#ffffff" stroke="#0284c7" strokeWidth="0.8" />)}
      {/* 上方置換法 */}
      <path d="M140,26 L140,112 L160,112 L160,26 Q150,16 140,26 Z" fill={GLASS} stroke={LINE} strokeWidth="1.2" />
      <path d="M104,160 L150,160 L150,34" fill="none" stroke={DARK} strokeWidth="2.4" />
      <path d="M150,30 L146,38 L154,38 Z" fill="#b91c1c" />
      {/* 下方置換法 */}
      <path d="M240,64 L240,146 Q250,156 260,146 L260,64 Z" fill={GLASS} stroke={LINE} strokeWidth="1.2" />
      <path d="M206,30 L250,30 L250,140" fill="none" stroke={DARK} strokeWidth="2.4" />
      <path d="M250,144 L246,136 L254,136 Z" fill="#b91c1c" />

      <Label x={50} y={178} anchor="middle" size={10.5} weight="800">水上置換法</Label>
      <Label x={50} y={194} anchor="middle" size={8.5} color={LINE}>水にとけにくい気体</Label>
      <Label x={150} y={178} anchor="middle" size={10.5} weight="800">上方置換法</Label>
      <Label x={150} y={194} anchor="middle" size={8.5} color={LINE}>とけやすく、空気より軽い</Label>
      <Label x={250} y={178} anchor="middle" size={10.5} weight="800">下方置換法</Label>
      <Label x={250} y={194} anchor="middle" size={8.5} color={LINE}>とけやすく、空気より重い</Label>
    </svg>
  )
}

// ── アンモニアの噴水の実験 ─────────────────────────────────────────────────
//   { name: 'ammoniaFountain' }
// アンモニアを満たしたフラスコにスポイトで水を少し入れると、アンモニアが水にとけてフラスコ内の気体が減り、
// フェノールフタレイン液を加えた水が吸い上げられて、赤い噴水になる。
function AmmoniaFountainDiagram() {
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="アンモニアの噴水の実験" data-subject-diagram="ammoniaFountain">
      <circle cx="96" cy="62" r="46" fill={GLASS} stroke={LINE} strokeWidth="1.4" />
      <rect x="88" y="104" width="16" height="16" fill="#94a3b8" stroke={LINE} strokeWidth="1" />
      <line x1="92" y1="80" x2="92" y2="198" stroke={LINE} strokeWidth="2" />
      <path d="M92,78 Q86,58 74,50 M92,78 Q98,56 110,50 M92,78 Q92,56 92,44" fill="none" stroke="#e11d48" strokeWidth="2" />
      {[[74, 50], [110, 50], [92, 44], [82, 40], [102, 40]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#fb7185" />)}
      <rect x="102" y="100" width="6" height="30" rx="2" fill="#e2e8f0" stroke={LINE} strokeWidth="1" />
      <ellipse cx="105" cy="132" rx="6" ry="4" fill="#f59e0b" stroke={LINE} strokeWidth="1" />
      <path d="M52,170 L52,222 L132,222 L132,170" fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x="53" y="186" width="78" height="35" fill="#e0f2fe" />
      <Callout from={[124, 36]} to={[160, 24]} text="アンモニアを満たす" />
      <Callout from={[110, 50]} to={[160, 56]} text="赤い噴水" />
      <Callout from={[108, 128]} to={[160, 124]} text="スポイトで水を入れる" />
      <Callout from={[132, 200]} to={[160, 196]} text="フェノールフタレイン液" />
      <Label x={163} y={212} size={10}>を加えた水</Label>
    </svg>
  )
}

// ── 物質が水にとけるようす（粒子のモデル） ────────────────────────────────────
//   { name: 'dissolvingParticles' }
// 砂糖を水に入れた直後・しばらくして・時間がたったあと。粒子は水全体に均一に広がり、下にたまらない。
function DissolvingParticlesDiagram() {
  // 粒子の位置は、決まった並びで描く（毎回同じ図になるように）。
  const bottom = [[-18, 0], [-9, 0], [0, 0], [9, 0], [18, 0], [-14, -8], [-4, -8], [5, -8], [14, -8], [-8, -16], [2, -16], [11, -16]]
  const middle = [[-20, 0], [-6, 2], [8, 0], [20, 2], [-14, -12], [2, -10], [16, -14], [-22, -24], [-6, -26], [10, -22], [-12, -40], [14, -38]]
  const even = [[-20, -8], [-4, -4], [12, -8], [22, -2], [-14, -28], [2, -24], [18, -30], [-22, -50], [-4, -46], [12, -52], [-12, -70], [8, -68]]
  const Beaker = ({ cx, dots, title }) => (
    <g>
      <Label x={cx} y={18} anchor="middle" size={9.5} weight="800">{title}</Label>
      <rect x={cx - 38} y="44" width="76" height="92" fill="#e0f2fe" />
      <path d={`M${cx - 38},34 L${cx - 38},136 L${cx + 38},136 L${cx + 38},34`} fill="none" stroke={LINE} strokeWidth="1.5" />
      {dots.map(([dx, dy], index) => <circle key={index} cx={cx + dx} cy={128 + dy} r="3.2" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />)}
    </g>
  )
  return (
    <svg viewBox="0 0 300 168" className="h-auto w-full" role="img" aria-label="物質が水にとけるようす" data-subject-diagram="dissolvingParticles">
      <Beaker cx={50} dots={bottom} title="入れた直後" />
      <Beaker cx={150} dots={middle} title="しばらくすると" />
      <Beaker cx={250} dots={even} title="時間がたつと" />
      <path d="M94,90 L106,90 M100,86 L106,90 L100,94" fill="none" stroke={DARK} strokeWidth="1.6" />
      <path d="M194,90 L206,90 M200,86 L206,90 L200,94" fill="none" stroke={DARK} strokeWidth="1.6" />
      <Label x={150} y={160} anchor="middle" size={9} color={LINE}>●は砂糖の粒子。最後は水全体に均一に広がり、下にたまらない</Label>
    </svg>
  )
}

// ── ろ過のしかた ──────────────────────────────────────────────────────────
//   { name: 'filtration' }
// ろ紙を水でぬらしてろうとにつけ、ろうとのあしの長いほうをビーカーの壁につける。液はガラス棒を伝わらせて注ぐ。
function FiltrationDiagram() {
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="ろ過のしかた" data-subject-diagram="filtration">
      {/* ろうと台 */}
      <line x1="28" y1="226" x2="28" y2="40" stroke={DARK} strokeWidth="3" />
      <rect x="10" y="222" width="150" height="8" fill={DARK} />
      <line x1="28" y1="100" x2="106" y2="100" stroke={DARK} strokeWidth="3" />
      {/* ろうととろ紙 */}
      <path d="M93,60 L173,60 L141,112 L125,112 Z" fill="#f8fafc" stroke={LINE} strokeWidth="1.4" />
      <path d="M101,64 L165,64 L135,108 L131,108 Z" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" />
      <path d="M127,112 L127,166 L133,158 L133,112 Z" fill="#f8fafc" stroke={LINE} strokeWidth="1.2" />
      {/* ビーカーとろ液 */}
      <path d="M126,140 L126,220 L196,220 L196,140" fill="none" stroke={LINE} strokeWidth="1.5" />
      <rect x="127" y="196" width="68" height="23" fill="#e0f2fe" />
      {/* ガラス棒とビーカー（注ぐ液） */}
      <line x1="210" y1="18" x2="146" y2="78" stroke={LINE} strokeWidth="2.2" />
      <Callout from={[200, 28]} to={[216, 40]} text="ガラス棒を" />
      <Label x={219} y={56} size={10}>伝わらせて注ぐ</Label>
      <Callout from={[106, 66]} to={[80, 56]} text="ろ紙" />
      <Callout from={[109, 84]} to={[80, 80]} text="ろうと" />
      <Callout from={[127, 160]} to={[118, 146]} text="あしの長いほうを" />
      <Label x={115} y={164} size={10} anchor="end">ビーカーの壁につける</Label>
      <Callout from={[196, 206]} to={[214, 200]} text="ろ液" />
    </svg>
  )
}

// ── 状態変化と粒子のようす ─────────────────────────────────────────────────
//   { name: 'statesParticles' }
// 固体（規則正しく並ぶ）・液体（自由に動く）・気体（激しく飛び回る）。加熱すると右へ、冷やすと左へ変化する。
function StatesParticlesDiagram() {
  const solid = []
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) solid.push([-15 + c * 10, -15 + r * 10])
  const liquid = [[-18, 12], [-7, 16], [5, 13], [16, 16], [-14, 2], [-2, 5], [10, 2], [20, 6], [-20, -9], [-6, -6], [7, -10], [18, -6], [-12, -18], [2, -17], [14, -19], [-1, -28]]
  const gas = [[-26, -30], [10, -34], [28, -18], [-12, -12], [20, 4], [-28, 8], [2, 12], [-16, 30], [18, 30], [30, 34]]
  const Box = ({ cx, dots, title, moving }) => (
    <g>
      <rect x={cx - 38} y="36" width="76" height="92" rx="6" fill="#f8fafc" stroke={LINE} strokeWidth="1.2" />
      {dots.map(([dx, dy], index) => (
        <g key={index}>
          {moving && <line x1={cx + dx} y1={82 + dy} x2={cx + dx - 8} y2={82 + dy + (index % 2 ? 6 : -6)} stroke="#94a3b8" strokeWidth="1" />}
          <circle cx={cx + dx} cy={82 + dy} r="4.2" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="0.8" />
        </g>
      ))}
      <Label x={cx} y={24} anchor="middle" size={11} weight="800">{title}</Label>
    </g>
  )
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="状態変化と粒子のようす" data-subject-diagram="statesParticles">
      <Box cx={46} dots={solid} title="固体" />
      <Box cx={150} dots={liquid} title="液体" />
      <Box cx={254} dots={gas} title="気体" moving />
      {[[86, 110], [190, 214]].map(([x1, x2]) => (
        <g key={x1}>
          <line x1={x1} y1="68" x2={x2} y2="68" stroke="#dc2626" strokeWidth="1.6" />
          <path d={`M${x2 + 2},68 L${x2 - 5},64 L${x2 - 5},72 Z`} fill="#dc2626" />
          <line x1={x2} y1="100" x2={x1} y2="100" stroke="#2563eb" strokeWidth="1.6" />
          <path d={`M${x1 - 2},100 L${x1 + 5},96 L${x1 + 5},104 Z`} fill="#2563eb" />
        </g>
      ))}
      <Label x={98} y={62} anchor="middle" size={8.5} color="#dc2626">加熱</Label>
      <Label x={202} y={62} anchor="middle" size={8.5} color="#dc2626">加熱</Label>
      <Label x={98} y={114} anchor="middle" size={8.5} color="#2563eb">冷却</Label>
      <Label x={202} y={114} anchor="middle" size={8.5} color="#2563eb">冷却</Label>
      <Label x={46} y={148} anchor="middle" size={8.5} color={LINE}>規則正しく並び</Label>
      <Label x={46} y={160} anchor="middle" size={8.5} color={LINE}>その場でふるえる</Label>
      <Label x={150} y={148} anchor="middle" size={8.5} color={LINE}>比較的自由に</Label>
      <Label x={150} y={160} anchor="middle" size={8.5} color={LINE}>動き回る</Label>
      <Label x={254} y={148} anchor="middle" size={8.5} color={LINE}>激しく飛び回り</Label>
      <Label x={254} y={160} anchor="middle" size={8.5} color={LINE}>間隔がとても大きい</Label>
      <Label x={150} y={186} anchor="middle" size={9} color={INK}>粒子の数は変わらない → 質量は変わらない</Label>
    </svg>
  )
}

// ── 蒸留の装置 ────────────────────────────────────────────────────────────
//   { name: 'distillation' }
// 枝つきフラスコで混合物を加熱し、出てきた気体を氷水で冷やした試験管に液体として集める。温度計の球部は枝の高さ。
function DistillationDiagram() {
  return (
    <svg viewBox="0 0 300 220" className="h-auto w-full" role="img" aria-label="蒸留の装置" data-subject-diagram="distillation">
      {/* 枝つきフラスコ */}
      <circle cx="80" cy="140" r="34" fill="#f8fafc" stroke={LINE} strokeWidth="1.4" />
      <path d="M47,148 A34,34 0 0,0 113,148 Z" fill="#e0f2fe" />
      <rect x="72" y="40" width="16" height="70" fill="#f8fafc" stroke={LINE} strokeWidth="1.3" />
      <rect x="70" y="36" width="20" height="10" fill="#94a3b8" stroke={LINE} strokeWidth="1" />
      <line x1="80" y1="14" x2="80" y2="66" stroke="#dc2626" strokeWidth="1.8" />
      <circle cx="80" cy="68" r="3" fill="#dc2626" />
      {/* 枝と、つなぐ管 */}
      <line x1="88" y1="68" x2="206" y2="120" stroke={LINE} strokeWidth="3" />
      {/* 試験管と氷水 */}
      <rect x="180" y="118" width="80" height="70" fill="#dbeafe" stroke={LINE} strokeWidth="1.3" />
      <path d="M198,96 L198,176 Q206,186 214,176 L214,96" fill="#f8fafc" stroke={LINE} strokeWidth="1.3" />
      <rect x="199" y="160" width="14" height="17" fill="#fef3c7" />
      {/* 沸騰石と加熱 */}
      {[[70, 166], [86, 168], [78, 162]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.8" fill={DARK} />)}
      <path d="M72,196 Q80,182 88,196 Z" fill="#fb923c" />
      <Callout from={[80, 16]} to={[118, 14]} text="温度計" />
      <Callout from={[83, 68]} to={[118, 40]} text="球部は枝の高さに" />
      <Callout from={[92, 166]} to={[130, 196]} text="沸騰石" />
      <Callout from={[56, 150]} to={[44, 116]} text="混合物" anchor="end" />
      <Callout from={[260, 150]} to={[270, 106]} text="氷水" anchor="end" />
      <Callout from={[213, 170]} to={[240, 210]} text="集めた液体" anchor="end" />
    </svg>
  )
}

const RAY = '#dc2626'

function Ray({ points, dashed = false, color = RAY, head = true }) {
  const d = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ')
  const [x1, y1] = points[points.length - 2]
  const [x2, y2] = points[points.length - 1]
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const tip = (a, r) => `${mx + r * Math.cos(angle + a)},${my + r * Math.sin(angle + a)}`
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeDasharray={dashed ? '4 3' : undefined} />
      {head && !dashed && <path d={`M${tip(0, 5)} L${tip(Math.PI * 0.8, 5)} L${tip(-Math.PI * 0.8, 5)} Z`} fill={color} />}
    </g>
  )
}

// ── 光の反射の法則と乱反射 ─────────────────────────────────────────────────
//   { name: 'reflectionLaw' }
function ReflectionLawDiagram() {
  return (
    <svg viewBox="0 0 300 182" className="h-auto w-full" role="img" aria-label="光の反射の法則と乱反射" data-subject-diagram="reflectionLaw">
      <Label x={86} y={16} anchor="middle" size={10.5} weight="800">反射の法則</Label>
      <rect x="20" y="138" width="132" height="8" fill="#cbd5e1" />
      <line x1="20" y1="138" x2="152" y2="138" stroke={LINE} strokeWidth="1.6" />
      <line x1="86" y1="38" x2="86" y2="138" stroke={DARK} strokeWidth="1" strokeDasharray="4 3" />
      <Ray points={[[30, 58], [86, 138]]} />
      <Ray points={[[86, 138], [142, 58]]} />
      <path d="M80,112 A26,26 0 0,1 86,112" fill="none" />
      <path d="M71,116 Q76,110 86,109" fill="none" stroke="#1d4ed8" strokeWidth="1.3" />
      <path d="M86,109 Q96,110 101,116" fill="none" stroke="#1d4ed8" strokeWidth="1.3" />
      <Label x={62} y={100} anchor="middle" size={9} color="#1d4ed8">入射角</Label>
      <Label x={110} y={100} anchor="middle" size={9} color="#1d4ed8">反射角</Label>
      <Label x={86} y={34} anchor="middle" size={8.5} color={DARK}>鏡の面に垂直な線</Label>
      <Label x={86} y={166} anchor="middle" size={9.5}>入射角＝反射角</Label>
      <Label x={236} y={16} anchor="middle" size={10.5} weight="800">乱反射</Label>
      <path d="M176,138 L188,128 L198,140 L210,126 L222,140 L234,128 L246,140 L258,127 L270,140 L284,130 L296,138 L296,146 L176,146 Z" fill="#cbd5e1" stroke={LINE} strokeWidth="1.2" />
      {[[190, 40, 193, 132], [212, 40, 215, 132], [234, 40, 237, 132], [256, 40, 259, 132]].map(([x1, y1, x2, y2], index) => (
        <g key={index}>
          <Ray points={[[x1, y1], [x2, y2]]} />
          <Ray points={[[x2, y2], [x2 + [-36, -14, 14, 34][index], y2 - [58, 74, 72, 58][index]]]} />
        </g>
      ))}
      <Label x={236} y={166} anchor="middle" size={9.5}>いろいろな方向に反射する</Label>
    </svg>
  )
}

// ── 鏡にうつる像 ──────────────────────────────────────────────────────────
//   { name: 'mirrorImage' }
// 鏡で反射した光を逆にたどると、鏡をはさんで物体と対称の位置に像があるように見える。
function MirrorImageDiagram() {
  const eye = [52, 58]
  const top = [110, 92]
  const image = [190, 92]
  const my = eye[1] + ((image[1] - eye[1]) * (150 - eye[0])) / (image[0] - eye[0])
  return (
    <svg viewBox="0 0 300 172" className="h-auto w-full" role="img" aria-label="鏡にうつる像" data-subject-diagram="mirrorImage">
      <rect x="150" y="26" width="7" height="122" fill="#cbd5e1" />
      <line x1="150" y1="26" x2="150" y2="148" stroke={LINE} strokeWidth="1.8" />
      <line x1="110" y1="140" x2="110" y2="92" stroke="#2563eb" strokeWidth="3" />
      <path d="M110,86 L104,96 L116,96 Z" fill="#2563eb" />
      <line x1="190" y1="140" x2="190" y2="92" stroke="#93c5fd" strokeWidth="3" strokeDasharray="5 3" />
      <path d="M190,86 L184,96 L196,96 Z" fill="#93c5fd" />
      <line x1="110" y1="160" x2="190" y2="160" stroke={DARK} strokeWidth="0.8" />
      <Label x={130} y={170} anchor="middle" size={8.5} color={DARK}>同じ距離</Label>
      <Label x={170} y={170} anchor="middle" size={8.5} color={DARK}>同じ距離</Label>
      <Ray points={[top, [150, my]]} />
      <Ray points={[[150, my], eye]} />
      <Ray points={[[150, my], image]} dashed />
      <ellipse cx={eye[0] - 6} cy={eye[1]} rx="9" ry="5.5" fill="#ffffff" stroke={INK} strokeWidth="1.2" />
      <circle cx={eye[0] - 4} cy={eye[1]} r="2.5" fill={INK} />
      <Label x={eye[0] - 6} y={eye[1] - 12} anchor="middle" size={9.5}>目</Label>
      <Label x={110} y={154} anchor="middle" size={9.5}>物体</Label>
      <Label x={190} y={154} anchor="middle" size={9.5} color="#2563eb">像</Label>
      <Label x={157} y={20} anchor="middle" size={9.5}>鏡</Label>
      <Label x={206} y={46} size={8.5} color={LINE}>光を逆にたどった</Label>
      <Label x={206} y={58} size={8.5} color={LINE}>位置に見える</Label>
    </svg>
  )
}

// ── 光の屈折と全反射 ───────────────────────────────────────────────────────
//   { name: 'refraction' }
// 空気→水では屈折角が入射角より小さく、水→空気では大きい。水→空気で入射角が大きいと、すべて反射する。
function RefractionDiagram() {
  const Panel = ({ cx, title }) => (
    <g>
      <rect x={cx - 48} y="86" width="96" height="70" fill={WATER} />
      <line x1={cx - 48} y1="86" x2={cx + 48} y2="86" stroke={LINE} strokeWidth="1.3" />
      <line x1={cx} y1="30" x2={cx} y2="150" stroke={DARK} strokeWidth="0.9" strokeDasharray="4 3" />
      <Label x={cx} y={16} anchor="middle" size={10} weight="800">{title}</Label>
      <Label x={cx - 44} y={80} size={8} color={DARK}>空気</Label>
      <Label x={cx - 44} y={100} size={8} color="#0369a1">水</Label>
    </g>
  )
  return (
    <svg viewBox="0 0 300 186" className="h-auto w-full" role="img" aria-label="光の屈折と全反射" data-subject-diagram="refraction">
      <Panel cx={50} title="空気→水" />
      <Ray points={[[16, 32], [50, 86]]} />
      <Ray points={[[50, 86], [74, 150]]} />
      <Label x={50} y={172} anchor="middle" size={8.5}>屈折角は小さくなる</Label>
      <Panel cx={150} title="水→空気" />
      <Ray points={[[126, 150], [150, 86]]} />
      <Ray points={[[150, 86], [184, 32]]} />
      <Label x={150} y={172} anchor="middle" size={8.5}>屈折角は大きくなる</Label>
      <Panel cx={250} title="全反射" />
      <Ray points={[[206, 116], [250, 86]]} />
      <Ray points={[[250, 86], [294, 116]]} />
      <Label x={250} y={172} anchor="middle" size={8.5}>すべて反射する</Label>
    </svg>
  )
}

// ── 凸レンズと焦点 ────────────────────────────────────────────────────────
//   { name: 'convexLensFocus' }
// 光軸に平行な光は屈折して焦点に集まり、レンズの中心を通る光は直進する。
function ConvexLensFocusDiagram() {
  const f = 56
  return (
    <svg viewBox="0 0 300 178" className="h-auto w-full" role="img" aria-label="凸レンズと焦点" data-subject-diagram="convexLensFocus">
      <line x1="10" y1="90" x2="290" y2="90" stroke={DARK} strokeWidth="1" />
      <ellipse cx="150" cy="90" rx="10" ry="62" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.3" />
      {[60, 75, 105, 120].map((y) => <Ray key={y} points={[[16, y], [150, y], [150 + f, 90], [270, 90 + ((90 - y) * (270 - 150 - f)) / f]]} />)}
      <circle cx={150 + f} cy="90" r="3.5" fill="#1d4ed8" />
      <circle cx={150 - f} cy="90" r="3.5" fill="#1d4ed8" />
      <Label x={150 + f} y={82} anchor="middle" size={9.5} color="#1d4ed8">焦点</Label>
      <Label x={150 - f} y={82} anchor="middle" size={9.5} color="#1d4ed8">焦点</Label>
      <line x1="150" y1="160" x2={150 + f} y2="160" stroke={INK} strokeWidth="1" />
      <line x1="150" y1="155" x2="150" y2="165" stroke={INK} strokeWidth="1" />
      <line x1={150 + f} y1="155" x2={150 + f} y2="165" stroke={INK} strokeWidth="1" />
      <Label x={150 + f / 2} y={174} anchor="middle" size={9}>焦点距離</Label>
      <Label x={40} y={52} anchor="middle" size={8.5} color={RAY}>光軸に平行な光</Label>
      <Label x={290} y={82} anchor="end" size={8.5} color={DARK}>光軸</Label>
    </svg>
  )
}

// ── 凸レンズによる像のでき方 ─────────────────────────────────────────────────
//   { name: 'lensImage', object: 3 }（物体の位置を、焦点距離の何倍かで表す。1より小さいと虚像）
function LensImageDiagram({ object = 3 }) {
  const f = 40
  const axis = 88
  const lens = 150
  const h = 28
  const xo = lens - object * f
  const top = [xo, axis - h]
  const real = object > 1
  // レンズの式 1/a + 1/b = 1/f で像の位置 b と倍率を求める（b が負なら、物体と同じ側の虚像）。
  const b = (object * f) / (object - 1)
  const xi = lens + b
  const hi = -(h * b) / (object * f)
  const imageTop = [xi, axis - hi]
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label="凸レンズによる像のでき方" data-subject-diagram="lensImage">
      <line x1="4" y1={axis} x2="296" y2={axis} stroke={DARK} strokeWidth="1" />
      <ellipse cx={lens} cy={axis} rx="9" ry="66" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.3" />
      {[-2, -1, 1, 2].map((k) => (
        <g key={k}>
          <circle cx={lens + k * f} cy={axis} r="2.8" fill="#1d4ed8" />
          <Label x={lens + k * f} y={axis + 16} anchor="middle" size={8} color="#1d4ed8">{Math.abs(k) === 1 ? '焦点' : '2倍'}</Label>
        </g>
      ))}
      <line x1={xo} y1={axis} x2={xo} y2={axis - h + 5} stroke="#2563eb" strokeWidth="3" />
      <path d={`M${xo},${axis - h} L${xo - 5},${axis - h + 8} L${xo + 5},${axis - h + 8} Z`} fill="#2563eb" />
      <Label x={xo} y={axis + 28} anchor="middle" size={9}>物体</Label>
      <Ray points={[top, [lens, axis - h], real ? imageTop : [lens + 2.8 * f, axis - h + (h / f) * 2.8 * f]]} />
      {real ? <Ray points={[top, imageTop]} /> : <Ray points={[top, [lens + 70, axis + (70 * h) / (lens - xo)]]} />}
      {!real && (
        <g>
          <Ray points={[[lens, axis - h], imageTop]} dashed />
          <Ray points={[top, imageTop]} dashed />
        </g>
      )}
      <line x1={xi} y1={axis} x2={xi} y2={axis - hi + (hi > 0 ? 5 : -5)} stroke={real ? '#7c3aed' : '#a78bfa'} strokeWidth="3" strokeDasharray={real ? undefined : '5 3'} />
      <path d={hi > 0 ? `M${xi},${axis - hi} L${xi - 5},${axis - hi + 8} L${xi + 5},${axis - hi + 8} Z` : `M${xi},${axis - hi} L${xi - 5},${axis - hi - 8} L${xi + 5},${axis - hi - 8} Z`} fill={real ? '#7c3aed' : '#a78bfa'} />
      <Label x={xi} y={hi > 0 ? axis + 28 : axis - hi + 14} anchor="middle" size={9} color="#7c3aed">{real ? '実像' : '虚像'}</Label>
    </svg>
  )
}

// ── 音の波形 ─────────────────────────────────────────────────────────────
//   { name: 'waveforms', waves: [{ label: '大きい音', amplitude: 1, cycles: 3 }, …], annotate?: true }
// オシロスコープで見た音の波形を、上から順に並べる。横軸は時間、縦軸は振動の振れ幅。
// amplitude は振れ幅（1が最大）、cycles は同じ時間に見られる波の数。annotate で1段目に振幅と1回の振動を書く。
function WaveformsDiagram({ waves = [], annotate = false }) {
  const left = 76
  const right = 290
  const rowH = 70
  const height = waves.length * rowH + 26
  const pathOf = (amplitude, cycles, mid) => {
    const points = []
    for (let i = 0; i <= 200; i += 1) {
      const x = left + ((right - left) * i) / 200
      points.push(`${i ? 'L' : 'M'}${x.toFixed(1)},${(mid - Math.sin((i / 200) * cycles * 2 * Math.PI) * amplitude * 24).toFixed(1)}`)
    }
    return points.join(' ')
  }
  return (
    <svg viewBox={`0 0 300 ${height}`} className="h-auto w-full" role="img" aria-label="音の波形" data-subject-diagram="waveforms">
      {waves.map((wave, index) => {
        const mid = 36 + index * rowH
        return (
          <g key={wave.label}>
            <line x1={left} y1={mid} x2={right} y2={mid} stroke="#cbd5e1" strokeWidth="1" />
            <line x1={left} y1={mid - 30} x2={left} y2={mid + 30} stroke={DARK} strokeWidth="1" />
            <path d={pathOf(wave.amplitude, wave.cycles, mid)} fill="none" stroke="#2563eb" strokeWidth="1.8" />
            <Label x={left - 8} y={mid + 4} anchor="end" size={10} weight="800">{wave.label}</Label>
            {annotate && index === 0 && (
              <g>
                <line x1={left + (right - left) / (4 * wave.cycles)} y1={mid} x2={left + (right - left) / (4 * wave.cycles)} y2={mid - wave.amplitude * 24} stroke="#dc2626" strokeWidth="1.4" />
                <Label x={left + (right - left) / (4 * wave.cycles) + 4} y={mid - wave.amplitude * 12} size={8.5} color="#dc2626">振幅</Label>
                <line x1={left} y1={mid + 30} x2={left + (right - left) / wave.cycles} y2={mid + 30} stroke="#15803d" strokeWidth="1.4" />
                <Label x={left + (right - left) / (2 * wave.cycles)} y={mid + 42} anchor="middle" size={8.5} color="#15803d">1回の振動</Label>
              </g>
            )}
          </g>
        )
      })}
      <Label x={right} y={height - 6} anchor="end" size={8.5} color={DARK}>時間 →</Label>
    </svg>
  )
}

function ForceArrow({ from, to, color = '#dc2626', width = 2.4 }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const tip = (a) => `${x2 + 9 * Math.cos(angle + a)},${y2 + 9 * Math.sin(angle + a)}`
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 6 * Math.cos(angle)} y2={y2 - 6 * Math.sin(angle)} stroke={color} strokeWidth={width} />
      <path d={`M${x2},${y2} L${tip(Math.PI * 0.84)} L${tip(-Math.PI * 0.84)} Z`} fill={color} />
      <circle cx={x1} cy={y1} r="3.2" fill={color} />
    </g>
  )
}

// ── 力の矢印の表し方 ──────────────────────────────────────────────────────
//   { name: 'forceArrow' }
// 作用点（矢印の始まり）・力の向き（矢印の向き）・力の大きさ（矢印の長さ）。1目もりを1Nとして、ひもが箱を引く力5N。
function ForceArrowDiagram() {
  const unit = 18
  return (
    <svg viewBox="0 0 300 190" className="h-auto w-full" role="img" aria-label="力の矢印の表し方" data-subject-diagram="forceArrow">
      {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={150 + k * unit} y1="58" x2={150 + k * unit} y2="138" stroke="#e2e8f0" strokeWidth="1" />)}
      <rect x="40" y="70" width="110" height="60" fill="#fde68a" stroke="#92400e" strokeWidth="1.3" />
      <line x1="20" y1="130" x2="290" y2="130" stroke={DARK} strokeWidth="2" />
      <ForceArrow from={[150, 100]} to={[150 + 5 * unit, 100]} />
      <Callout from={[150, 103]} to={[150, 160]} text="作用点（矢印の始まり）" anchor="start" />
      <Label x={150 + 5 * unit + 6} y={96} size={10} weight="800" color="#dc2626">5N</Label>
      <line x1="150" y1="84" x2={150 + 5 * unit} y2="84" stroke={INK} strokeWidth="0.9" />
      <Label x={150 + 2.5 * unit} y={78} anchor="middle" size={8.5}>矢印の長さ＝力の大きさ</Label>
      <Label x={150 + 2.5 * unit} y={50} anchor="middle" size={8.5} color={LINE}>1目もり＝1N</Label>
      <Label x={95} y={104} anchor="middle" size={10}>箱</Label>
      <Label x={150} y={180} size={8.5} color={LINE}>矢印の向き＝力の向き（右向き）</Label>
    </svg>
  )
}

// ── 2力のつり合い ────────────────────────────────────────────────────────
//   { name: 'forceBalance' }
// 左：机の上の本（重力と垂直抗力）。右：動かない綱（左右に引く力）。どちらも同じ直線上・同じ大きさ・反対向き。
function ForceBalanceDiagram() {
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="2力のつり合い" data-subject-diagram="forceBalance">
      <Label x={70} y={16} anchor="middle" size={10} weight="800">机の上の本</Label>
      <rect x="10" y="118" width="120" height="10" fill="#d6b58c" stroke="#7c5a2f" strokeWidth="1" />
      <rect x="40" y="96" width="60" height="22" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1.2" />
      <ForceArrow from={[70, 107]} to={[70, 160]} />
      <ForceArrow from={[70, 118]} to={[70, 58]} color="#2563eb" />
      <Label x={78} y={160} size={9} color="#dc2626">重力</Label>
      <Label x={78} y={62} size={9} color="#2563eb">垂直抗力</Label>
      <Label x={220} y={16} anchor="middle" size={10} weight="800">動かない綱</Label>
      <line x1="170" y1="100" x2="270" y2="100" stroke="#92400e" strokeWidth="4" />
      <ForceArrow from={[200, 100]} to={[160, 100]} />
      <ForceArrow from={[240, 100]} to={[280, 100]} color="#2563eb" />
      <Label x={178} y={90} anchor="middle" size={8.5}>左に引く力</Label>
      <Label x={262} y={90} anchor="middle" size={8.5}>右に引く力</Label>
      <Label x={150} y={184} anchor="middle" size={9} color={LINE}>同じ直線上で、大きさが等しく、向きが反対</Label>
    </svg>
  )
}

// ── マグマのねばりけと火山の形 ─────────────────────────────────────────────────
//   { name: 'volcanoShapes' }
// 左から、ねばりけが強い（ドーム状）・中間（円すい形）・弱い（傾斜のゆるやかな形）。
function VolcanoShapesDiagram() {
  const base = 118
  return (
    <svg viewBox="0 0 300 218" className="h-auto w-full" role="img" aria-label="マグマのねばりけと火山の形" data-subject-diagram="volcanoShapes">
      <path d={`M14,${base} C22,${base - 40} 70,${base - 40} 78,${base} Z`} fill="#e7e5e4" stroke="#78716c" strokeWidth="1.3" />
      <path d={`M104,${base} L150,${base - 62} L196,${base} Z`} fill="#d6d3d1" stroke="#78716c" strokeWidth="1.3" />
      <path d={`M210,${base} Q254,${base - 26} 298,${base} Z`} fill="#57534e" stroke="#44403c" strokeWidth="1.3" />
      <line x1="6" y1={base} x2="298" y2={base} stroke="#a8a29e" strokeWidth="1" />
      <Label x={46} y={base + 16} anchor="middle" size={9.5} weight="800">ドーム状</Label>
      <Label x={46} y={base + 30} anchor="middle" size={8.5} color={LINE}>昭和新山など</Label>
      <Label x={150} y={base + 16} anchor="middle" size={9.5} weight="800">円すい形</Label>
      <Label x={150} y={base + 30} anchor="middle" size={8.5} color={LINE}>富士山・桜島など</Label>
      <Label x={254} y={base + 16} anchor="middle" size={9.5} weight="800">傾斜がゆるやか</Label>
      <Label x={254} y={base + 30} anchor="middle" size={8.5} color={LINE}>マウナロアなど</Label>
      {[['マグマのねばりけ', '強い', '弱い', 174], ['噴火のようす', '激しい', 'おだやか', 192], ['溶岩の色', '白っぽい', '黒っぽい', 210]].map(([title, left, right, y]) => (
        <g key={title}>
          <line x1="96" y1={y - 4} x2="204" y2={y - 4} stroke={DARK} strokeWidth="1.2" />
          <path d={`M92,${y - 4} L99,${y - 8} L99,${y} Z`} fill={DARK} />
          <path d={`M208,${y - 4} L201,${y - 8} L201,${y} Z`} fill={DARK} />
          <Label x={150} y={y - 8} anchor="middle" size={8.5} color={LINE}>{title}</Label>
          <Label x={86} y={y} anchor="end" size={9} weight="800">{left}</Label>
          <Label x={214} y={y} size={9} weight="800">{right}</Label>
        </g>
      ))}
    </svg>
  )
}

// ── 火山岩と深成岩のつくり ─────────────────────────────────────────────────
//   { name: 'rockTextures' }
// ルーペで見たつくり。左：はん状組織（石基の中にはん晶）。右：等粒状組織（大きな鉱物がすき間なく組み合う）。
function RockTexturesDiagram() {
  const phenocrysts = [[-18, -16, 0], [14, -20, 30], [-4, 4, -20], [20, 12, 10], [-22, 18, 40]]
  const grains = [
    'M-38,-6 L-20,-30 L-2,-24 L-6,-4 Z', 'M-2,-24 L18,-34 L34,-14 L10,-6 Z', 'M-6,-4 L10,-6 L14,16 L-10,18 Z',
    'M10,-6 L34,-14 L38,10 L14,16 Z', 'M-38,-6 L-6,-4 L-10,18 L-34,22 Z', 'M-34,22 L-10,18 L-4,38 L-24,36 Z',
    'M-10,18 L14,16 L18,36 L-4,38 Z', 'M14,16 L38,10 L30,32 L18,36 Z',
  ]
  const colors = ['#f8fafc', '#fecdd3', '#e2e8f0', '#1f2937', '#f1f5f9', '#475569', '#fde68a', '#e5e7eb']
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label="火山岩と深成岩のつくり" data-subject-diagram="rockTextures">
      <defs>
        <clipPath id="rock-left"><circle cx="76" cy="82" r="50" /></clipPath>
        <clipPath id="rock-right"><circle cx="224" cy="82" r="50" /></clipPath>
      </defs>
      <g clipPath="url(#rock-left)">
        <rect x="26" y="32" width="100" height="100" fill="#cbd5e1" />
        {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={30 + ((i * 37) % 92)} cy={36 + ((i * 53) % 92)} r="1.3" fill="#64748b" />)}
        {phenocrysts.map(([dx, dy, rot], index) => <rect key={index} x={76 + dx - 7} y={82 + dy - 4} width="14" height="8" fill={index % 2 ? '#f8fafc' : '#1f2937'} stroke="#334155" strokeWidth="0.8" transform={`rotate(${rot} ${76 + dx} ${82 + dy})`} />)}
      </g>
      <circle cx="76" cy="82" r="50" fill="none" stroke={LINE} strokeWidth="1.6" />
      <g clipPath="url(#rock-right)">
        <rect x="174" y="32" width="100" height="100" fill="#f1f5f9" />
        <g transform="translate(224 82) scale(1.35)">
          {grains.map((d, index) => <path key={index} d={d} fill={colors[index]} stroke="#334155" strokeWidth="0.7" />)}
        </g>
      </g>
      <circle cx="224" cy="82" r="50" fill="none" stroke={LINE} strokeWidth="1.6" />
      <Label x={76} y={20} anchor="middle" size={10.5} weight="800">はん状組織（火山岩）</Label>
      <Label x={224} y={20} anchor="middle" size={10.5} weight="800">等粒状組織（深成岩）</Label>
      <Label x={76} y={150} anchor="middle" size={8.5} color={LINE}>細かい粒の石基の中に</Label>
      <Label x={76} y={163} anchor="middle" size={8.5} color={LINE}>大きな鉱物（はん晶）</Label>
      <Label x={224} y={150} anchor="middle" size={8.5} color={LINE}>大きな鉱物が</Label>
      <Label x={224} y={163} anchor="middle" size={8.5} color={LINE}>すき間なく組み合わさる</Label>
    </svg>
  )
}

const starPath = (cx, cy, r) => Array.from({ length: 10 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * Math.PI) / 5
  const radius = i % 2 ? r * 0.45 : r
  return `${i ? 'L' : 'M'}${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`
}).join(' ') + ' Z'

function DoubleArrow({ x1, x2, y, color = LINE }) {
  return (
    <g>
      <line x1={x1 + 4} y1={y} x2={x2 - 4} y2={y} stroke={color} strokeWidth="1" />
      <path d={`M${x1},${y} L${x1 + 6},${y - 3} L${x1 + 6},${y + 3} Z`} fill={color} />
      <path d={`M${x2},${y} L${x2 - 6},${y - 3} L${x2 - 6},${y + 3} Z`} fill={color} />
    </g>
  )
}

// ── 震源・震央と地震計の記録 ──────────────────────────────────────────────
//   { name: 'quakeRecord' }
// 上：地下の震源（★）と、その真上の震央、はなれた観測点。下：観測点の地震計の記録。P波が届くと初期微動、S波が届くと主要動が始まる。
function QuakeRecordDiagram() {
  const surface = 46
  const focus = [64, 104]
  const station = 236
  const base = 192
  const pAt = 64
  const sAt = 144
  const trace = []
  for (let x = 16; x <= 288; x += 1) {
    let y = base
    if (x >= pAt && x < sAt) y = base - 4.5 * Math.sin((x - pAt) * 1.35) * (0.7 + 0.3 * Math.sin(x * 0.37))
    if (x >= sAt) y = base - (30 * Math.exp(-(x - sAt) / 70) + 3) * Math.sin((x - sAt) * 0.62)
    trace.push(`${x === 16 ? 'M' : 'L'}${x},${y.toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 300 264" className="h-auto w-full" role="img" aria-label="震源・震央と地震計の記録" data-subject-diagram="quakeRecord">
      <rect x="8" y={surface} width="284" height="76" fill="#f5f5f4" />
      <line x1="8" y1={surface} x2="292" y2={surface} stroke={DARK} strokeWidth="1.6" />
      <line x1={focus[0]} y1={focus[1]} x2={focus[0]} y2={surface} stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <line x1={focus[0]} y1={focus[1]} x2={station} y2={surface} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d={starPath(focus[0], focus[1], 8)} fill="#dc2626" />
      <circle cx={focus[0]} cy={surface} r="3.2" fill={INK} />
      <path d={`M${station - 8},${surface} L${station},${surface - 12} L${station + 8},${surface} Z`} fill="#94a3b8" stroke={LINE} strokeWidth="1" />
      <Label x={focus[0]} y={20} anchor="middle" size={10} weight="800">震央</Label>
      <Label x={station} y={20} anchor="middle" size={10} weight="800">観測点（地震計）</Label>
      <DoubleArrow x1={focus[0] + 6} x2={station - 10} y={34} />
      <Label x={150} y={30} anchor="middle" size={8.5} color={LINE}>震央からの距離</Label>
      <Label x={focus[0] + 12} y={focus[1] + 4} size={10} weight="800" color="#dc2626">震源</Label>
      <Label x={150} y={98} size={8.5} color="#dc2626">震源からの距離</Label>

      <Label x={16} y={134} size={9} weight="800">観測点の地震計の記録</Label>
      <line x1={pAt} y1={146} x2={pAt} y2={230} stroke={LINE} strokeWidth="0.9" strokeDasharray="3 3" />
      <line x1={sAt} y1={146} x2={sAt} y2={230} stroke={LINE} strokeWidth="0.9" strokeDasharray="3 3" />
      <Label x={pAt} y={152} anchor="middle" size={8.5} color={LINE}>P波が届く</Label>
      <Label x={sAt} y={152} anchor="middle" size={8.5} color={LINE}>S波が届く</Label>
      <path d={trace.join(' ')} fill="none" stroke="#2563eb" strokeWidth="1.3" />
      <Label x={(pAt + sAt) / 2} y={178} anchor="middle" size={9} weight="800">初期微動</Label>
      <Label x={256} y={164} anchor="middle" size={9} weight="800">主要動</Label>
      <DoubleArrow x1={pAt} x2={sAt} y={238} color="#15803d" />
      <Label x={(pAt + sAt) / 2} y={254} anchor="middle" size={8.5} color="#15803d">初期微動継続時間</Label>
      <Label x={288} y={254} anchor="end" size={8.5} color={DARK}>時間 →</Label>
    </svg>
  )
}

// ── 日本付近のプレートの断面と震源の分布 ─────────────────────────────────────────
//   { name: 'plateSubduction' }
// 東北地方を東西に切ったようす。左が日本海側、右が太平洋側。海洋プレートが海溝から大陸プレートの下へ沈みこむ。●は震源。
function PlateSubductionDiagram() {
  const land = 'M8,52 L50,50 L92,40 L118,30 L140,26 L164,36 L186,46 L198,52'
  const slabQuakes = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((t, i) => [200 - 150 * t + 2.7 + (i % 2 ? 2 : -2), 78 + 98 * t + 4.2 + (i % 3) * 1.5])
  const nearTrench = [[194, 84], [186, 90], [180, 86]]
  const inland = [[100, 62], [126, 58], [150, 66], [112, 72]]
  return (
    <svg viewBox="0 0 300 224" className="h-auto w-full" role="img" aria-label="日本付近のプレートの断面と震源の分布" data-subject-diagram="plateSubduction">
      <path d="M198,52 L292,52 L292,66 L212,66 L206,74 Z" fill="#dbeafe" />
      <line x1="198" y1="52" x2="292" y2="52" stroke="#60a5fa" strokeWidth="1" />
      <path d={`${land} L206,74 L184,86 L8,86 Z`} fill="#fde68a" stroke="#92400e" strokeWidth="1.1" />
      <path d="M292,66 L212,66 L206,74 L184,86 L44,178 L57,198 L197,106 L216,92 L292,92 Z" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1.1" />
      {[...slabQuakes, ...nearTrench, ...inland].map(([x, y], index) => <circle key={index} cx={x} cy={y} r="2.3" fill="#dc2626" />)}
      <Label x={10} y={16} size={9} weight="800" color={LINE}>日本海側</Label>
      <Label x={290} y={16} anchor="end" size={9} weight="800" color={LINE}>太平洋側</Label>
      <Label x={60} y={77} anchor="middle" size={9} weight="800" color="#92400e">大陸プレート</Label>
      <Label x={254} y={83} anchor="middle" size={9} weight="800" color="#1d4ed8">海洋プレート</Label>
      <Callout from={[206, 74]} to={[232, 40]} text="海溝" />
      <Callout from={[126, 58]} to={[140, 12]} text="内陸の地震" />
      <Callout from={[194, 84]} to={[226, 150]} text="海溝型地震" />
      <line x1="284" y1="104" x2="242" y2="104" stroke={INK} strokeWidth="1.6" />
      <path d="M236,104 L244,100 L244,108 Z" fill={INK} />
      <Label x={262} y={119} anchor="middle" size={8.5} color={LINE}>動く向き</Label>
      <circle cx="226" cy="211" r="2.3" fill="#dc2626" />
      <Label x={232} y={214.5} size={8.5} color={LINE}>震源</Label>
      <Label x={132} y={214.5} anchor="middle" size={8.5} color={LINE}>震源は日本海側ほど深い</Label>
    </svg>
  )
}

// ── 地層の変形（断層・しゅう曲） ───────────────────────────────────────────────
//   { name: 'layerDeformation', kinds: ['normal', 'reverse', 'fold'] }
// 地層に力がはたらいてできるつくりを、上から順に並べる。normal：引っぱる力でできる正断層、reverse：おす力でできる逆断層、
// fold：おす力でできるしゅう曲。断層は赤い線で、左の地層が断層面に沿ってずれる。
const DEFORMATION = {
  normal: { title: '正断層', force: '左右から引っぱる力', inward: false },
  reverse: { title: '逆断層', force: '左右からおす力', inward: true },
  fold: { title: 'しゅう曲', force: '左右からおす力', inward: true },
}
function LayerDeformationDiagram({ kinds = ['normal', 'reverse'] }) {
  const rowH = 106
  const left = 90
  const width = 120
  const height = 56
  const layer = height / 4
  const colors = ['#fde68a', '#fdba74', '#d6d3d1', '#a8a29e', '#bbf7d0']
  const run = 20 / height
  const arrow = (x1, x2, y) => {
    const dir = Math.sign(x2 - x1)
    return (
      <g>
        <line x1={x1} y1={y} x2={x2 - dir * 6} y2={y} stroke="#dc2626" strokeWidth="2.4" />
        <path d={`M${x2},${y} L${x2 - dir * 9},${y - 5} L${x2 - dir * 9},${y + 5} Z`} fill="#dc2626" />
      </g>
    )
  }
  return (
    <svg viewBox={`0 0 300 ${kinds.length * rowH}`} className="h-auto w-full" role="img" aria-label="地層の変形" data-subject-diagram="layerDeformation">
      {kinds.map((kind, index) => {
        const { title, force, inward } = DEFORMATION[kind]
        const y0 = index * rowH
        const top = y0 + 28
        const mid = top + height / 2
        const xa = left + 70
        const slip = kind === 'normal' ? 11 : -11
        const shift = [-(20 / Math.hypot(20, height)) * slip, (height / Math.hypot(20, height)) * slip]
        const blockPath = (side) => {
          const deep = top + height + 16
          const xDeep = xa - (deep - top) * run
          return side === 'left'
            ? `M${left - 10},${top - 16} L${xa + 16 * run},${top - 16} L${xDeep},${deep} L${left - 10},${deep} Z`
            : `M${xa + 16 * run},${top - 16} L${left + width + 10},${top - 16} L${left + width + 10},${deep} L${xDeep},${deep} Z`
        }
        const layers = (dy) => colors.map((color, k) => <rect key={k} x={left - 10} y={top + dy + k * layer} width={width + 20} height={layer} fill={color} stroke="#78716c" strokeWidth="0.6" />)
        return (
          <g key={kind}>
            <Label x={16} y={y0 + 16} size={10} weight="800">{title}</Label>
            <defs>
              <clipPath id={`deform-frame-${index}`}><rect x={left} y={top - 16} width={width} height={height + 16} /></clipPath>
              <clipPath id={`deform-left-${index}`}><path d={blockPath('left')} /></clipPath>
              <clipPath id={`deform-right-${index}`}><path d={blockPath('right')} /></clipPath>
            </defs>
            {kind === 'fold' ? (
              <g>
                {[0, 1, 2, 3].map((k) => {
                  const edge = (j) => Array.from({ length: 41 }, (_, i) => [left + (width * i) / 40, top - 4 + j * layer + 8 * Math.sin((i / 40) * 2 * Math.PI)])
                  const upper = edge(k)
                  const lower = edge(k + 1).reverse()
                  return <path key={k} d={`M${[...upper, ...lower].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')} Z`} fill={colors[k]} stroke="#78716c" strokeWidth="0.6" />
                })}
              </g>
            ) : (
              <g clipPath={`url(#deform-frame-${index})`}>
                <g clipPath={`url(#deform-right-${index})`}>{layers(0)}</g>
                <g transform={`translate(${shift[0].toFixed(2)} ${shift[1].toFixed(2)})`}>
                  <g clipPath={`url(#deform-left-${index})`}>{layers(0)}</g>
                </g>
                <line x1={xa - Math.min(0, shift[1]) * run} y1={top + Math.min(0, shift[1])} x2={xa - height * run} y2={top + height} stroke="#dc2626" strokeWidth="1.8" />
              </g>
            )}
            {inward ? arrow(38, 82, mid) : arrow(82, 38, mid)}
            {inward ? arrow(262, 218, mid) : arrow(218, 262, mid)}
            <Label x={150} y={y0 + rowH - 6} anchor="middle" size={9} color={LINE}>{force}</Label>
          </g>
        )
      })}
    </svg>
  )
}

// 土砂と岩石の模様（れき・砂・泥・火山灰・石灰岩）。同じ模様なので、1ページに2つ出ても id が重なってよい。
const ROCK_KINDS = {
  gravel: { name: 'れき', fill: '#fed7aa' },
  sand: { name: '砂', fill: '#fef3c7' },
  mud: { name: '泥', fill: '#e7e5e4' },
  ash: { name: '火山灰', fill: '#fecaca' },
  lime: { name: '石灰岩', fill: '#e0f2fe' },
}
function RockPatterns() {
  return (
    <defs>
      <pattern id="rock-gravel" width="9" height="9" patternUnits="userSpaceOnUse">
        <rect width="9" height="9" fill={ROCK_KINDS.gravel.fill} />
        <circle cx="4.5" cy="4.5" r="2.6" fill="none" stroke="#9a3412" strokeWidth="0.8" />
      </pattern>
      <pattern id="rock-sand" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={ROCK_KINDS.sand.fill} />
        <circle cx="1.5" cy="1.5" r="0.8" fill="#a16207" />
        <circle cx="4.5" cy="4.5" r="0.8" fill="#a16207" />
      </pattern>
      <pattern id="rock-mud" width="10" height="5" patternUnits="userSpaceOnUse">
        <rect width="10" height="5" fill={ROCK_KINDS.mud.fill} />
        <line x1="1" y1="2.5" x2="6" y2="2.5" stroke="#78716c" strokeWidth="0.8" />
      </pattern>
      <pattern id="rock-ash" width="8" height="7" patternUnits="userSpaceOnUse">
        <rect width="8" height="7" fill={ROCK_KINDS.ash.fill} />
        <path d="M2,2 L4,5 L6,2" fill="none" stroke="#b91c1c" strokeWidth="0.8" />
      </pattern>
      <pattern id="rock-lime" width="12" height="8" patternUnits="userSpaceOnUse">
        <rect width="12" height="8" fill={ROCK_KINDS.lime.fill} />
        <path d="M0,4 L12,4 M3,0 L3,4 M9,4 L9,8" stroke="#0369a1" strokeWidth="0.6" />
      </pattern>
    </defs>
  )
}

// ── 河口から沖合への土砂の積もり方 ───────────────────────────────────────────
//   { name: 'sedimentSorting' }
// 川が運んだ土砂が海に出ると、粒の大きいれきは河口の近く、砂はその先、泥は沖合に積もる。
function SedimentSortingDiagram() {
  const floor = (x) => 62 + (x - 62) * (66 / 230)
  const band = (x1, x2) => `M${x1},${floor(x1)} L${x2},${floor(x2)} L${x2},${floor(x2) + 10} L${x1},${floor(x1) + 10} Z`
  const zones = [['gravel', 62, 125, '2mm以上'], ['sand', 125, 205, '約0.06〜2mm'], ['mud', 205, 292, '約0.06mm以下']]
  return (
    <svg viewBox="0 0 300 172" className="h-auto w-full" role="img" aria-label="河口から沖合への土砂の積もり方" data-subject-diagram="sedimentSorting">
      <RockPatterns />
      <path d="M8,46 L56,56 L62,62 L292,128 L292,172 L8,172 Z" fill="#d6d3d1" />
      <path d="M58,60 L292,60 L292,128 L62,62 Z" fill="#dbeafe" />
      <line x1="58" y1="60" x2="292" y2="60" stroke="#60a5fa" strokeWidth="1" />
      <line x1="8" y1="45" x2="58" y2="57" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      {zones.map(([kind, x1, x2]) => <path key={kind} d={band(x1, x2)} fill={`url(#rock-${kind})`} stroke="#57534e" strokeWidth="0.7" />)}
      {zones.map(([kind, x1, x2, size]) => {
        const cx = (x1 + x2) / 2
        return (
          <g key={`label-${kind}`}>
            <Label x={cx} y={floor(cx) + 28} anchor="middle" size={10} weight="800">{ROCK_KINDS[kind].name}</Label>
            <Label x={cx} y={floor(cx) + 40} anchor="middle" size={8.5} color={LINE}>{size}</Label>
          </g>
        )
      })}
      <Label x={26} y={36} anchor="middle" size={9} weight="800" color="#1d4ed8">川</Label>
      <Label x={62} y={24} anchor="middle" size={9} weight="800">河口</Label>
      <line x1="62" y1="28" x2="62" y2="56" stroke={LINE} strokeWidth="0.8" />
      <Label x={270} y={24} anchor="middle" size={9} weight="800">沖合</Label>
      <line x1="86" y1="20" x2="240" y2="20" stroke={LINE} strokeWidth="1.2" />
      <path d="M246,20 L238,16 L238,24 Z" fill={LINE} />
      <Label x={163} y={40} anchor="middle" size={8.5} color={LINE}>粒が小さいものほど遠くまで運ばれる</Label>
    </svg>
  )
}

// ── 柱状図と地層の対比 ──────────────────────────────────────────────────────
//   { name: 'columnSections', min: 50, max: 80, sites: [{ name: 'A', elevation: 80, layers: [['mud', 10], ['ash', 2], …] }] }
// 地点ごとの柱状図を、地表の標高にそろえて並べる。layers は地表から下へ [種類, 厚さ(m)]。種類は gravel（れき）・sand（砂）・
// mud（泥）・ash（火山灰）・lime（石灰岩）。火山灰の層（鍵層）の上面を、となりの地点どうし赤い点線で結ぶ。
function ColumnSectionsDiagram({ sites = [], min = 50, max = 80 }) {
  const top = 34
  const bottom = 194
  const y = (elevation) => top + ((max - elevation) * (bottom - top)) / (max - min)
  const half = 17
  const cx = (index) => 100 + index * 70
  const used = [...new Set(sites.flatMap((site) => site.layers.map(([kind]) => kind)))]
  const ashTop = (site) => {
    let depth = 0
    for (const [kind, thickness] of site.layers) {
      if (kind === 'ash') return site.elevation - depth
      depth += thickness
    }
    return null
  }
  const ticks = []
  for (let value = max; value >= min; value -= 5) ticks.push(value)
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="柱状図と地層の対比" data-subject-diagram="columnSections">
      <RockPatterns />
      <line x1="44" y1={top} x2="44" y2={bottom} stroke={DARK} strokeWidth="1" />
      {ticks.map((value) => (
        <g key={value}>
          <line x1="40" y1={y(value)} x2="44" y2={y(value)} stroke={DARK} strokeWidth="1" />
          <Label x={37} y={y(value) + 3.5} anchor="end" size={8.5} color={LINE}>{value}</Label>
          <line x1="44" y1={y(value)} x2="290" y2={y(value)} stroke="#e2e8f0" strokeWidth="0.6" />
        </g>
      ))}
      <Label x={44} y={top - 18} anchor="middle" size={8.5} color={LINE}>標高(m)</Label>
      {sites.map((site, index) => {
        let depth = 0
        return (
          <g key={site.name}>
            <Label x={cx(index)} y={y(site.elevation) - 7} anchor="middle" size={10} weight="800">{site.name}</Label>
            {site.layers.map(([kind, thickness], k) => {
              const rect = <rect key={k} x={cx(index) - half} y={y(site.elevation - depth)} width={half * 2} height={y(site.elevation - depth - thickness) - y(site.elevation - depth)} fill={`url(#rock-${kind})`} stroke="#57534e" strokeWidth="0.7" />
              depth += thickness
              return rect
            })}
          </g>
        )
      })}
      {sites.slice(1).map((site, index) => {
        const a = ashTop(sites[index])
        const b = ashTop(site)
        if (a === null || b === null) return null
        return <line key={site.name} x1={cx(index) + half} y1={y(a)} x2={cx(index + 1) - half} y2={y(b)} stroke="#dc2626" strokeWidth="1.4" strokeDasharray="4 3" />
      })}
      {used.map((kind, index) => (
        <g key={kind}>
          <rect x={48 + index * 62} y="212" width="16" height="11" fill={`url(#rock-${kind})`} stroke="#57534e" strokeWidth="0.7" />
          <Label x={68 + index * 62} y={221} size={9}>{ROCK_KINDS[kind].name}</Label>
        </g>
      ))}
    </svg>
  )
}

// ── 試験管で加熱して、出てきた気体を石灰水に通す実験 ─────────────────────────────────
//   { name: 'thermalDecomposition', variant?: 'reduction' }
// 既定：炭酸水素ナトリウムの熱分解。試験管の口を少し下げて加熱し、出てきた気体をガラス管で石灰水に通す。口には液体（水）がつく。
// reduction：酸化銅と炭素の混合物を加熱する還元の実験。ゴム管とピンチコック（加熱をやめたら閉じる）を示す。
function ThermalDecompositionDiagram({ variant }) {
  const reduction = variant === 'reduction'
  const tube = 'M52,72 L172,86 L170,102 L50,88 Q40,80 52,72 Z'
  return (
    <svg viewBox="0 0 300 222" className="h-auto w-full" role="img" aria-label={reduction ? '酸化銅と炭素の混合物を加熱する実験' : '炭酸水素ナトリウムの熱分解'} data-subject-diagram="thermalDecomposition">
      <path d={tube} fill={GLASS} stroke={LINE} strokeWidth="1.2" />
      <path d="M50,84 Q46,80 52,76 L108,83 L106,95 L50,88 Z" fill={reduction ? '#374151' : '#f1f5f9'} stroke="#94a3b8" strokeWidth="0.8" />
      {!reduction && [[150, 92], [158, 94], [163, 91], [155, 97]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#0284c7" />)}
      <rect x="168" y="84" width="12" height="20" rx="2" fill="#a8a29e" stroke={LINE} strokeWidth="1" transform="rotate(7 174 94)" />
      <path d="M180,93 L240,93 L240,172" fill="none" stroke={DARK} strokeWidth="2.4" />
      {reduction && (
        <g>
          <line x1="196" y1="93" x2="224" y2="93" stroke="#1f2937" strokeWidth="5" />
          <rect x="206" y="86" width="8" height="14" rx="1.5" fill="#94a3b8" stroke={LINE} strokeWidth="0.8" />
        </g>
      )}
      <path d="M230,112 L230,196 Q240,206 250,196 L250,112" fill={GLASS} stroke={LINE} strokeWidth="1.2" />
      <path d="M231,150 L231,196 Q240,205 249,196 L249,150 Z" fill="#e2e8f0" />
      {[164, 178, 188].map((y) => <circle key={y} cx="240" cy={y} r="2.4" fill="#ffffff" stroke="#64748b" strokeWidth="0.8" />)}
      <rect x="80" y="150" width="18" height="50" rx="2" fill={DARK} />
      <rect x="72" y="198" width="34" height="8" rx="2" fill={DARK} />
      <path d="M89,150 Q76,124 89,98 Q102,124 89,150 Z" fill="#93c5fd" stroke="#2563eb" strokeWidth="1" />
      <Callout from={[80, 86]} to={[98, 36]} text={reduction ? '酸化銅と炭素の混合物' : '炭酸水素ナトリウム'} />
      {reduction ? <Callout from={[210, 86]} to={[226, 56]} text="ピンチコック" /> : <Callout from={[160, 93]} to={[196, 56]} text="液体（水）" />}
      <Callout from={[232, 93]} to={[250, 76]} text="ガラス管" />
      {reduction ? (
        <Label x={164} y={176} anchor="middle" size={9} color={LINE}>ピンチコックは加熱後に閉じる</Label>
      ) : (
        <g>
          <line x1="168" y1="102" x2="164" y2="164" stroke={LINE} strokeWidth="0.8" />
          <circle cx="168" cy="102" r="1.6" fill={LINE} />
          <Label x={164} y={176} anchor="middle">試験管の口を少し下げる</Label>
        </g>
      )}
      <Callout from={[232, 184]} to={[196, 214]} text="石灰水" />
    </svg>
  )
}

// ── 水の電気分解 ───────────────────────────────────────────────────────────
//   { name: 'waterElectrolysis' }
// 電気分解装置。電源の−極につないだ陰極に水素、＋極につないだ陽極に酸素が、体積2：1で集まる。
function WaterElectrolysisDiagram() {
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="水の電気分解" data-subject-diagram="waterElectrolysis">
      <path d="M96,40 Q106,28 116,40 L116,170 L196,170 L196,40 Q206,28 216,40 L216,186 L96,186 Z" fill={WATER} stroke={LINE} strokeWidth="1.2" />
      <path d="M146,170 L146,64 L136,50 L176,50 L166,64 L166,170" fill={WATER} stroke={LINE} strokeWidth="1.2" />
      <path d="M97,41 Q106,31 115,41 L115,112 L97,112 Z" fill={GLASS} />
      <path d="M197,41 Q206,31 215,41 L215,76 L197,76 Z" fill={GLASS} />
      <rect x="102" y="150" width="8" height="18" fill="#475569" />
      <rect x="202" y="150" width="8" height="18" fill="#475569" />
      {[[106, 132], [104, 122], [108, 140]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#ffffff" stroke="#0284c7" strokeWidth="0.6" />)}
      {[[206, 128], [208, 140]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#ffffff" stroke="#0284c7" strokeWidth="0.6" />)}
      <path d="M106,186 L106,194 L70,194 L70,202" fill="none" stroke={INK} strokeWidth="1.4" />
      <path d="M206,186 L206,196 L130,196 L130,202" fill="none" stroke="#dc2626" strokeWidth="1.4" />
      <rect x="56" y="202" width="88" height="24" rx="3" fill="#e2e8f0" stroke={LINE} strokeWidth="1" />
      <Label x={64} y={218} anchor="middle" size={11} weight="800">−</Label>
      <Label x={136} y={218} anchor="middle" size={11} weight="800" color="#dc2626">＋</Label>
      <Label x={100} y={218} anchor="middle" size={8.5} color={LINE}>電源装置</Label>
      <Label x={106} y={22} anchor="middle" size={9.5} weight="800">陰極（−）</Label>
      <Label x={206} y={22} anchor="middle" size={9.5} weight="800" color="#dc2626">陽極（＋）</Label>
      <Callout from={[96, 76]} to={[74, 76]} text="水素" />
      <Label x={71} y={92} anchor="end" size={8.5} color={LINE}>体積2</Label>
      <Callout from={[216, 58]} to={[236, 58]} text="酸素" />
      <Label x={239} y={74} size={8.5} color={LINE}>体積1</Label>
      <Callout from={[176, 186]} to={[204, 206]} text="水酸化ナトリウム" />
      <Label x={207} y={222} size={10}>をとかした水</Label>
    </svg>
  )
}

// ── 原子のモデルと化学式 ─────────────────────────────────────────────────────
//   { name: 'moleculeModels' }
// 円を原子として、水素・酸素・水・二酸化炭素の分子と、分子をつくらない銅・塩化ナトリウムを並べ、化学式と対応させる。
const ATOM_STYLE = {
  H: { fill: '#ffffff', text: INK },
  O: { fill: '#fca5a5', text: INK },
  C: { fill: '#475569', text: '#ffffff' },
  Cu: { fill: '#fdba74', text: INK },
  Na: { fill: '#c4b5fd', text: INK },
  Cl: { fill: '#86efac', text: INK },
  Fe: { fill: '#a1a1aa', text: INK },
  S: { fill: '#fde047', text: INK },
  Mg: { fill: '#f5f5f4', text: INK },
  Ag: { fill: '#e2e8f0', text: INK },
}
function Atom({ x, y, kind, r = 10 }) {
  const style = ATOM_STYLE[kind]
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={style.fill} stroke={LINE} strokeWidth="1" />
      <text x={x} y={y + 3.2} fontSize={kind.length > 1 ? 7.5 : 9} fontWeight="800" textAnchor="middle" fill={style.text}>{kind}</text>
    </g>
  )
}
function MoleculeModelsDiagram() {
  const grid = (kinds, y) => [0, 1].flatMap((row) => [0, 1, 2, 3, 4].map((col) => <Atom key={`${row}-${col}`} x={112 + col * 18} y={y - 9 + row * 18} kind={kinds[(row + col) % kinds.length]} r={8.5} />))
  const rows = [
    ['水素', 38, [[141, 'H'], [159, 'H']], 'H₂'],
    ['酸素', 74, [[141, 'O'], [159, 'O']], 'O₂'],
    ['水', 110, null, 'H₂O'],
    ['二酸化炭素', 146, [[131, 'O'], [150, 'C'], [169, 'O']], 'CO₂'],
  ]
  return (
    <svg viewBox="0 0 300 262" className="h-auto w-full" role="img" aria-label="原子のモデルと化学式" data-subject-diagram="moleculeModels">
      <Label x={10} y={14} size={8.5} color={LINE}>物質</Label>
      <Label x={150} y={14} anchor="middle" size={8.5} color={LINE}>原子のモデル</Label>
      <Label x={290} y={14} anchor="end" size={8.5} color={LINE}>化学式</Label>
      {rows.map(([name, y, atoms, formula]) => (
        <g key={name}>
          <Label x={10} y={y + 4} size={10} weight="800">{name}</Label>
          {atoms ? atoms.map(([x, kind]) => <Atom key={x} x={x} y={y} kind={kind} />) : (
            <g>
              <Atom x={133} y={y + 8} kind="H" />
              <Atom x={167} y={y + 8} kind="H" />
              <Atom x={150} y={y - 2} kind="O" />
            </g>
          )}
          <Label x={290} y={y + 5} anchor="end" size={13} weight="800">{formula}</Label>
        </g>
      ))}
      <Label x={10} y={186} size={10} weight="800">銅</Label>
      <Label x={10} y={199} size={8} color={LINE}>分子をつくらない</Label>
      {grid(['Cu'], 190)}
      <Label x={290} y={195} anchor="end" size={13} weight="800">Cu</Label>
      <Label x={10} y={234} size={10} weight="800">塩化ナトリウム</Label>
      <Label x={10} y={247} size={8} color={LINE}>分子をつくらない</Label>
      {grid(['Na', 'Cl'], 238)}
      <Label x={290} y={243} anchor="end" size={13} weight="800">NaCl</Label>
    </svg>
  )
}

// ── 化学変化の原子のモデル ─────────────────────────────────────────────────────
//   { name: 'reactionModels', reactions: [{ label: '水素と酸素の反応', left: ['H2', 'H2', 'O2'], right: ['H2O', 'H2O'], equation: '2H₂＋O₂→2H₂O', count: '左右とも…' }] }
// 化学変化の前（矢印の左）と後（右）を原子のモデルで並べ、化学反応式と原子の数を下に書く。
// 分子などの名前は MOLECULE_SHAPES のもの（1個の原子は元素記号のまま）。
const MOLECULE_SHAPES = {
  H2: [[-8, 0, 'H'], [8, 0, 'H']],
  O2: [[-8, 0, 'O'], [8, 0, 'O']],
  H2O: [[0, -4, 'O'], [-14, 5, 'H'], [14, 5, 'H']],
  CO2: [[-16, 0, 'O'], [0, 0, 'C'], [16, 0, 'O']],
  FeS: [[-8, 0, 'Fe'], [8, 0, 'S']],
  CuS: [[-8, 0, 'Cu'], [8, 0, 'S']],
  CuO: [[-8, 0, 'Cu'], [8, 0, 'O']],
  MgO: [[-8, 0, 'Mg'], [8, 0, 'O']],
  Ag2O: [[0, -4, 'O'], [-15, 5, 'Ag'], [15, 5, 'Ag']],
}
const moleculeAtoms = (name) => MOLECULE_SHAPES[name] ?? [[0, 0, name]]
function ReactionModelsDiagram({ reactions = [] }) {
  const r = 9
  const symbolW = 14
  const rowH = 92
  return (
    <svg viewBox={`0 0 300 ${reactions.length * rowH}`} className="h-auto w-full" role="img" aria-label="化学変化の原子のモデル" data-subject-diagram="reactionModels">
      {reactions.map((reaction, index) => {
        const y0 = index * rowH
        const cy = y0 + 42
        const pieces = []
        const push = (names) => names.forEach((name, k) => {
          if (k) pieces.push({ symbol: '＋' })
          const atoms = moleculeAtoms(name)
          const xs = atoms.map(([dx]) => dx)
          pieces.push({ atoms, width: Math.max(...xs) - Math.min(...xs) + 2 * r, min: Math.min(...xs) })
        })
        push(reaction.left)
        pieces.push({ symbol: '→' })
        push(reaction.right)
        const gap = 3
        const total = pieces.reduce((sum, piece) => sum + (piece.symbol ? symbolW : piece.width) + gap, -gap)
        let x = 150 - total / 2
        const drawn = pieces.map((piece, k) => {
          const width = piece.symbol ? symbolW : piece.width
          const left = x
          x += width + gap
          if (piece.symbol) return <text key={k} x={left + width / 2} y={cy + 4.5} fontSize="13" fontWeight="800" textAnchor="middle" fill={piece.symbol === '→' ? '#dc2626' : LINE}>{piece.symbol}</text>
          const origin = left + r - piece.min
          return <g key={k}>{piece.atoms.map(([dx, dy, kind], a) => <Atom key={a} x={origin + dx} y={cy + dy} kind={kind} r={r} />)}</g>
        })
        const fit = Math.min(1, 284 / total)
        return (
          <g key={reaction.label}>
            <Label x={10} y={y0 + 14} size={9.5} weight="800">{reaction.label}</Label>
            <g transform={`translate(150 ${cy}) scale(${fit.toFixed(3)}) translate(-150 ${-cy})`}>{drawn}</g>
            <Label x={150} y={y0 + 70} anchor="middle" size={11} weight="800">{reaction.equation}</Label>
            {reaction.count && <Label x={150} y={y0 + 84} anchor="middle" size={8.5} color={LINE}>{reaction.count}</Label>}
          </g>
        )
      })}
    </svg>
  )
}

// ── 植物の細胞と動物の細胞 ────────────────────────────────────────────────────
//   { name: 'cellStructure' }
// 上が植物の細胞、下が動物の細胞。緑の字（細胞壁・液胞・葉緑体）は植物の細胞だけに見られるつくり。
function CellStructureDiagram() {
  const plantOnly = '#15803d'
  const chloroplasts = [[34, 100], [54, 108], [84, 108], [114, 106], [134, 104], [138, 40], [110, 34], [80, 34], [50, 36]]
  return (
    <svg viewBox="0 0 300 250" className="h-auto w-full" role="img" aria-label="植物の細胞と動物の細胞" data-subject-diagram="cellStructure">
      <Label x={20} y={16} size={10} weight="800">植物の細胞</Label>
      <rect x="20" y="24" width="130" height="94" rx="6" fill="#dcfce7" stroke="#15803d" strokeWidth="2.4" />
      <rect x="26" y="30" width="118" height="82" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1" />
      <ellipse cx="72" cy="72" rx="40" ry="24" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
      {chloroplasts.map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="6" ry="3.5" fill="#22c55e" stroke="#15803d" strokeWidth="0.6" />)}
      <circle cx="124" cy="62" r="11" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1" />
      <Callout from={[150, 28]} to={[174, 26]} text="細胞壁" color={plantOnly} />
      <Callout from={[135, 62]} to={[174, 46]} text="核" />
      <Callout from={[144, 76]} to={[174, 66]} text="細胞膜" />
      <Callout from={[136, 88]} to={[174, 86]} text="細胞質" />
      <Callout from={[92, 80]} to={[174, 104]} text="液胞" color={plantOnly} />
      <Callout from={[134, 104]} to={[174, 122]} text="葉緑体" color={plantOnly} />

      <Label x={20} y={140} size={10} weight="800">動物の細胞</Label>
      <ellipse cx="84" cy="190" rx="62" ry="40" fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />
      <circle cx="104" cy="184" r="12" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1" />
      <Callout from={[116, 182]} to={[174, 168]} text="核" />
      <Callout from={[146, 192]} to={[174, 190]} text="細胞膜" />
      <Callout from={[60, 206]} to={[174, 212]} text="細胞質" />
      <Label x={290} y={244} anchor="end" size={8.5} color={plantOnly}>緑の字は、植物の細胞だけに見られるつくり</Label>
    </svg>
  )
}

function Arrow({ from, to, color = INK, width = 1.8 }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const tip = (a) => `${(x2 + 8 * Math.cos(angle + a)).toFixed(1)},${(y2 + 8 * Math.sin(angle + a)).toFixed(1)}`
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 5 * Math.cos(angle)} y2={y2 - 5 * Math.sin(angle)} stroke={color} strokeWidth={width} />
      <path d={`M${x2},${y2} L${tip(Math.PI * 0.85)} L${tip(-Math.PI * 0.85)} Z`} fill={color} />
    </g>
  )
}

// ── 光合成の材料とできるもの ──────────────────────────────────────────────────
//   { name: 'photosynthesis' }
// 葉に入るもの（光・二酸化炭素・水）と、できるもの（デンプンなど・酸素）を矢印で示す。
function PhotosynthesisDiagram() {
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="光合成の材料とできるもの" data-subject-diagram="photosynthesis">
      <path d="M70,108 Q150,30 240,108 Q150,186 70,108 Z" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.4" />
      <path d="M70,108 L240,108" stroke="#15803d" strokeWidth="1.2" />
      <path d="M70,108 Q56,130 36,150" fill="none" stroke="#15803d" strokeWidth="3" />
      <circle cx="36" cy="30" r="13" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <Arrow from={[52, 44]} to={[100, 80]} color="#ca8a04" />
      <Label x={62} y={36} size={9.5} weight="800" color="#a16207">光</Label>
      <Arrow from={[254, 36]} to={[206, 72]} color="#475569" />
      <Label x={296} y={24} anchor="end" size={9} weight="800">二酸化炭素（気孔から入る）</Label>
      <Arrow from={[24, 186]} to={[96, 132]} color="#2563eb" />
      <Label x={8} y={204} size={9} weight="800" color="#1d4ed8">水（根から道管を通って）</Label>
      <Arrow from={[204, 146]} to={[252, 180]} color="#dc2626" />
      <Label x={296} y={204} anchor="end" size={9} weight="800" color="#b91c1c">酸素（気孔から出る）</Label>
      <Label x={155} y={100} anchor="middle" size={12} weight="800" color="#14532d">光合成</Label>
      <Label x={155} y={124} anchor="middle" size={9} color="#14532d">葉緑体でデンプンなどができる</Label>
    </svg>
  )
}

// ── 茎の断面と維管束 ─────────────────────────────────────────────────────────
//   { name: 'stemSections' }
// 左：双子葉類（ホウセンカ）は維管束が輪のように並ぶ。右：単子葉類（トウモロコシ）は散らばる。
// 維管束の内側（中心側・赤）が道管、外側（緑）が師管。
function StemSectionsDiagram() {
  const ring = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4 - Math.PI / 2)
  const scattered = [[-30, -24], [0, -38], [28, -26], [-40, 4], [-12, -10], [16, -4], [40, 8], [-26, 26], [4, 22], [30, 32], [-6, 42], [-40, -16], [44, -12]]
  const bundle = (cx, cy, ux, uy, size = 1) => (
    <g>
      <circle cx={cx} cy={cy} r={5.5 * size} fill="#fca5a5" stroke="#b91c1c" strokeWidth="0.7" />
      <circle cx={cx + ux * 9 * size} cy={cy + uy * 9 * size} r={4.2 * size} fill="#86efac" stroke="#15803d" strokeWidth="0.7" />
    </g>
  )
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="茎の断面と維管束" data-subject-diagram="stemSections">
      <circle cx="78" cy="92" r="58" fill="#f0fdf4" stroke="#15803d" strokeWidth="1.4" />
      {ring.map((a) => <g key={a}>{bundle(78 + 32 * Math.cos(a), 92 + 32 * Math.sin(a), Math.cos(a), Math.sin(a))}</g>)}
      <circle cx="222" cy="92" r="58" fill="#f0fdf4" stroke="#15803d" strokeWidth="1.4" />
      {scattered.map(([dx, dy]) => {
        const d = Math.hypot(dx, dy) || 1
        return <g key={`${dx}-${dy}`}>{bundle(222 + dx, 92 + dy, dx / d, dy / d, 0.7)}</g>
      })}
      <Callout from={[74, 62]} to={[40, 18]} text="道管" />
      <Callout from={[80, 50]} to={[110, 18]} text="師管" />
      <Callout from={[250, 66]} to={[266, 22]} text="維管束" />
      <Label x={78} y={170} anchor="middle" size={9.5} weight="800">ホウセンカ（双子葉類）</Label>
      <Label x={78} y={186} anchor="middle" size={8.5} color={LINE}>維管束が輪のように並ぶ</Label>
      <Label x={222} y={170} anchor="middle" size={9.5} weight="800">トウモロコシ（単子葉類）</Label>
      <Label x={222} y={186} anchor="middle" size={8.5} color={LINE}>維管束が全体に散らばる</Label>
    </svg>
  )
}

// ── 葉の断面と気孔 ───────────────────────────────────────────────────────────
//   { name: 'leafSection' }
// 葉を輪切りにしたようす。上下の表皮、葉緑体をもつ細胞、葉脈（維管束：上が道管・下が師管）、裏側の表皮の気孔と孔辺細胞。
// 左下は、表皮を上から見た気孔。
function LeafSectionDiagram() {
  const palisade = Array.from({ length: 19 }, (_, i) => 12 + i * 14.4)
  const spongy = [[24, 84], [46, 96], [30, 110], [66, 86], [84, 104], [60, 114], [104, 84], [112, 112], [190, 84], [206, 106], [226, 88], [246, 108], [262, 86], [280, 104], [186, 114], [236, 116], [270, 118], [90, 90]]
  return (
    <svg viewBox="0 0 300 218" className="h-auto w-full" role="img" aria-label="葉の断面と気孔" data-subject-diagram="leafSection">
      {Array.from({ length: 14 }, (_, i) => <rect key={`u${i}`} x={10 + i * 20} y="24" width="20" height="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.7" />)}
      {palisade.map((x) => (
        <g key={`p${x}`}>
          <rect x={x} y="34" width="12" height="36" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="0.7" />
          {[42, 52, 62].map((y) => <circle key={y} cx={x + 6} cy={y} r="1.9" fill="#22c55e" />)}
        </g>
      ))}
      {spongy.map(([x, y]) => (
        <g key={`s${x}-${y}`}>
          <ellipse cx={x} cy={y} rx="9" ry="7" fill="#dcfce7" stroke="#16a34a" strokeWidth="0.7" />
          <circle cx={x - 2} cy={y} r="1.7" fill="#22c55e" />
        </g>
      ))}
      <ellipse cx="150" cy="98" rx="24" ry="22" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
      {[[140, 90], [150, 87], [160, 90]].map(([x, y]) => <circle key={`x${x}`} cx={x} cy={y} r="4.2" fill="#ffffff" stroke="#b91c1c" strokeWidth="1" />)}
      {[[142, 107], [150, 109], [158, 107]].map(([x, y]) => <circle key={`f${x}`} cx={x} cy={y} r="3" fill="#bbf7d0" stroke="#15803d" strokeWidth="0.8" />)}
      {Array.from({ length: 14 }, (_, i) => i).filter((i) => i !== 11).map((i) => <rect key={`l${i}`} x={10 + i * 20} y="124" width="20" height="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.7" />)}
      <ellipse cx="235" cy="128" rx="5" ry="4.5" fill="#86efac" stroke="#15803d" strokeWidth="0.8" />
      <ellipse cx="245" cy="128" rx="5" ry="4.5" fill="#86efac" stroke="#15803d" strokeWidth="0.8" />
      <Callout from={[40, 28]} to={[48, 10]} text="表皮" />
      <Callout from={[80, 52]} to={[92, 10]} text="葉緑体" />
      <Callout from={[150, 87]} to={[176, 10]} text="道管" />
      <Callout from={[150, 109]} to={[124, 156]} text="師管" />
      <Callout from={[172, 104]} to={[186, 156]} text="葉脈（維管束）" />
      <Callout from={[240, 131]} to={[256, 196]} text="気孔" />
      <Callout from={[233, 131]} to={[222, 196]} text="孔辺細胞" />
      <ellipse cx="52" cy="186" rx="7" ry="15" fill="#86efac" stroke="#15803d" strokeWidth="0.8" />
      <ellipse cx="68" cy="186" rx="7" ry="15" fill="#86efac" stroke="#15803d" strokeWidth="0.8" />
      <ellipse cx="60" cy="186" rx="2.6" ry="9" fill="#475569" />
      <Label x={60} y={214} anchor="middle" size={8.5} color={LINE}>表皮を上から見た気孔</Label>
    </svg>
  )
}

// ── 消化にかかわる器官 ─────────────────────────────────────────────────────────
//   { name: 'digestiveSystem' }
// 正面から見たようす（図の左がからだの右側）。口→食道→胃→小腸→大腸→肛門の消化管と、だ液せん・肝臓・胆のう・すい臓。
function DigestiveSystemDiagram() {
  return (
    <svg viewBox="0 0 300 284" className="h-auto w-full" role="img" aria-label="消化にかかわる器官" data-subject-diagram="digestiveSystem">
      <path d="M92,236 L86,178 L198,176 L200,250 Q182,262 146,262" fill="none" stroke="#d6a676" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M140,144 L148,166 C120,172 100,184 110,196 C122,208 176,196 178,212 C180,226 112,214 108,230 C106,238 100,238 94,234" fill="none" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="130" y1="30" x2="140" y2="94" stroke="#fca5a5" strokeWidth="6" strokeLinecap="round" />
      <path d="M60,98 Q56,80 96,78 L134,82 Q138,100 118,110 Q90,120 66,112 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
      <ellipse cx="104" cy="118" rx="7" ry="5" fill="#86efac" stroke="#15803d" strokeWidth="0.8" />
      <path d="M140,92 C170,84 198,100 192,126 C186,152 150,156 138,140 C150,142 168,136 170,122 C172,108 156,102 140,104 Z" fill="#fca5a5" stroke="#b91c1c" strokeWidth="1" />
      <path d="M118,160 Q150,150 192,156 Q194,165 150,167 Q126,169 118,160 Z" fill="#fde68a" stroke="#b45309" strokeWidth="0.8" />
      <ellipse cx="130" cy="22" rx="12" ry="6" fill="#fecaca" stroke="#b91c1c" strokeWidth="0.8" />
      <ellipse cx="112" cy="34" rx="6" ry="4" fill="#fde68a" stroke="#b45309" strokeWidth="0.8" />
      <Callout from={[118, 22]} to={[92, 14]} text="口" />
      <Callout from={[108, 35]} to={[92, 40]} text="だ液せん" />
      <Callout from={[70, 100]} to={[42, 90]} text="肝臓" />
      <Callout from={[98, 120]} to={[42, 126]} text="胆のう" />
      <Callout from={[88, 214]} to={[42, 214]} text="大腸" />
      <Callout from={[136, 62]} to={[226, 56]} text="食道" />
      <Callout from={[188, 112]} to={[226, 104]} text="胃" />
      <Callout from={[190, 160]} to={[226, 152]} text="すい臓" />
      <Callout from={[178, 212]} to={[226, 206]} text="小腸" />
      <Callout from={[148, 262]} to={[226, 270]} text="肛門" />
    </svg>
  )
}

// ── 小腸の柔毛 ───────────────────────────────────────────────────────────
//   { name: 'villus' }
// 柔毛1本を大きくしたようす。ブドウ糖・アミノ酸は毛細血管へ、脂肪酸とモノグリセリドは再び脂肪になってリンパ管へ入る。
function VillusDiagram() {
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="小腸の柔毛" data-subject-diagram="villus">
      <rect x="50" y="184" width="200" height="12" fill="#fecaca" stroke="#b91c1c" strokeWidth="0.8" />
      <path d="M104,186 L104,70 Q140,14 176,70 L176,186" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />
      <path d="M114,186 L114,76 Q140,36 166,76 L166,186" fill="none" stroke="#dc2626" strokeWidth="2" />
      {[100, 128, 156].map((y) => <path key={y} d={`M114,${y} Q140,${y + 10} 166,${y}`} fill="none" stroke="#dc2626" strokeWidth="1.4" />)}
      <path d="M140,186 L140,78" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />
      <Callout from={[104, 120]} to={[70, 104]} text="柔毛" />
      <Callout from={[166, 118]} to={[196, 88]} text="毛細血管" />
      <Label x={199} y={104} size={8.5} color={LINE}>ブドウ糖・アミノ酸</Label>
      <Label x={199} y={116} size={8.5} color={LINE}>が入る</Label>
      <Callout from={[140, 150]} to={[196, 150]} text="リンパ管" />
      <Label x={199} y={166} size={8.5} color={LINE}>脂肪になって入る</Label>
      <Label x={150} y={210} anchor="middle" size={8.5} color={LINE}>小腸の内側の壁</Label>
    </svg>
  )
}

// ── 肺胞での気体の交換 ────────────────────────────────────────────────────────
//   { name: 'alveolus' }
// 左：気管→気管支→肺胞のふさ。右：肺胞1つを大きくしたようす。血液に酸素がとり入れられ、二酸化炭素が出される。
function AlveolusDiagram() {
  const clusterA = [[36, 108], [54, 104], [44, 124], [62, 122], [52, 140]]
  const clusterB = [[82, 104], [100, 108], [88, 124], [106, 126], [96, 142]]
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="肺胞での気体の交換" data-subject-diagram="alveolus">
      <path d="M72,12 L72,64 L50,96 M72,64 L92,96" fill="none" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      {[...clusterA, ...clusterB].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="9.5" fill="#fee2e2" stroke="#be123c" strokeWidth="1" />)}
      <circle cx="54" cy="104" r="14" fill="none" stroke={LINE} strokeWidth="0.9" strokeDasharray="3 2" />
      <line x1="66" y1="96" x2="160" y2="66" stroke={LINE} strokeWidth="0.9" strokeDasharray="3 2" />
      <circle cx="206" cy="100" r="50" fill="#fee2e2" stroke="#be123c" strokeWidth="1.4" />
      <path d="M146,150 C168,190 244,194 268,150" fill="none" stroke="#3b82f6" strokeWidth="11" strokeLinecap="round" />
      <path d="M268,150 C282,124 280,84 262,62" fill="none" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" />
      <Arrow from={[214, 118]} to={[232, 164]} color="#dc2626" />
      <Label x={236} y={132} size={9} weight="800" color="#b91c1c">酸素</Label>
      <Arrow from={[180, 168]} to={[186, 126]} color="#1d4ed8" />
      <Label x={140} y={132} size={9} weight="800" color="#1d4ed8">二酸化炭素</Label>
      <Label x={206} y={84} anchor="middle" size={9.5} weight="800">肺胞（中は空気）</Label>
      <Callout from={[170, 184]} to={[130, 198]} text="毛細血管" />
      <Callout from={[76, 30]} to={[98, 22]} text="気管" />
      <Callout from={[84, 80]} to={[112, 88]} text="気管支" />
      <Callout from={[52, 150]} to={[62, 180]} text="肺胞" />
    </svg>
  )
}

// ── 血液の循環 ──────────────────────────────────────────────────────────────
//   { name: 'circulation' }
// 正面から見たようす（図の左がからだの右側）。赤は動脈血、青は静脈血。上の輪が肺循環、下の輪が体循環。
function CirculationDiagram() {
  const ART = '#dc2626'
  const VEIN = '#2563eb'
  const heads = {
    left: (x, y) => `M${x},${y} L${x + 8},${y - 4.5} L${x + 8},${y + 4.5} Z`,
    right: (x, y) => `M${x},${y} L${x - 8},${y - 4.5} L${x - 8},${y + 4.5} Z`,
    up: (x, y) => `M${x},${y} L${x - 4.5},${y + 8} L${x + 4.5},${y + 8} Z`,
  }
  const vessel = (d, color, [x, y, dir]) => (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <path d={heads[dir](x, y)} fill={color} />
    </g>
  )
  return (
    <svg viewBox="0 0 300 272" className="h-auto w-full" role="img" aria-label="血液の循環" data-subject-diagram="circulation">
      <rect x="112" y="16" width="76" height="32" rx="10" fill="#fee2e2" stroke="#be123c" strokeWidth="1" />
      <Label x={150} y={36} anchor="middle" size={10} weight="800">肺</Label>
      <rect x="104" y="226" width="92" height="34" rx="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
      <Label x={150} y={247} anchor="middle" size={10} weight="800">全身の細胞</Label>
      <rect x="100" y="102" width="36" height="30" fill="#bfdbfe" stroke={LINE} strokeWidth="1" />
      <rect x="164" y="102" width="36" height="30" fill="#fecaca" stroke={LINE} strokeWidth="1" />
      <rect x="100" y="132" width="36" height="42" fill="#bfdbfe" stroke={LINE} strokeWidth="1" />
      <rect x="164" y="132" width="36" height="42" fill="#fecaca" stroke={LINE} strokeWidth="1" />
      <Label x={118} y={121} anchor="middle" size={8}>右心房</Label>
      <Label x={182} y={121} anchor="middle" size={8}>左心房</Label>
      <Label x={118} y={157} anchor="middle" size={8}>右心室</Label>
      <Label x={182} y={157} anchor="middle" size={8}>左心室</Label>
      {vessel('M136,152 L150,152 L150,58', VEIN, [150, 50, 'up'])}
      {vessel('M188,32 L214,32 L214,117 L208,117', ART, [200, 117, 'left'])}
      {vessel('M200,160 L228,160 L228,243 L204,243', ART, [196, 243, 'left'])}
      {vessel('M104,243 L72,243 L72,117 L92,117', VEIN, [100, 117, 'right'])}
      <Label x={145} y={86} anchor="end" size={9} weight="800" color={VEIN}>肺動脈</Label>
      <Label x={218} y={80} size={9} weight="800" color={ART}>肺静脈</Label>
      <Label x={232} y={204} size={9} weight="800" color={ART}>大動脈</Label>
      <Label x={68} y={204} anchor="end" size={9} weight="800" color={VEIN}>大静脈</Label>
      <Label x={182} y={80} anchor="middle" size={9} color={LINE}>肺循環</Label>
      <Label x={150} y={204} anchor="middle" size={9} color={LINE}>体循環</Label>
      <line x1="8" y1="262" x2="24" y2="262" stroke={ART} strokeWidth="4" />
      <Label x={28} y={265.5} size={8.5}>動脈血</Label>
      <line x1="232" y1="262" x2="248" y2="262" stroke={VEIN} strokeWidth="4" />
      <Label x={252} y={265.5} size={8.5}>静脈血</Label>
    </svg>
  )
}

// ── 目と耳のつくり ─────────────────────────────────────────────────────────
//   { name: 'senseOrgans' }
// 上：目を横から見た断面（左が前）。光はレンズで屈折して網膜に像を結び、像は上下が逆になる。下：耳のつくり。
function SenseOrgansDiagram() {
  const spiral = Array.from({ length: 61 }, (_, i) => {
    const t = (i / 60) * 5 * Math.PI
    const r = 3 + (t / (5 * Math.PI)) * 15
    return `${i ? 'L' : 'M'}${(160 + r * Math.cos(t)).toFixed(1)},${(216 + r * Math.sin(t)).toFixed(1)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 300 282" className="h-auto w-full" role="img" aria-label="目と耳のつくり" data-subject-diagram="senseOrgans">
      <Label x={10} y={16} size={10} weight="800">目のつくり</Label>
      <circle cx="150" cy="80" r="48" fill="#f8fafc" stroke={LINE} strokeWidth="1.2" />
      <path d="M165,38 A44,44 0 0,1 165,122" fill="none" stroke="#f472b6" strokeWidth="4" />
      <line x1="196" y1="80" x2="238" y2="86" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
      <line x1="112" y1="54" x2="112" y2="67" stroke="#92400e" strokeWidth="5" />
      <line x1="112" y1="93" x2="112" y2="106" stroke="#92400e" strokeWidth="5" />
      <ellipse cx="121" cy="80" rx="7" ry="14" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1" />
      <line x1="30" y1="104" x2="30" y2="58" stroke="#16a34a" strokeWidth="2.4" />
      <path d="M30,52 L25.5,61 L34.5,61 Z" fill="#16a34a" />
      <path d="M30,58 L121,73 L192,98" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
      <path d="M30,104 L121,87 L192,62" fill="none" stroke="#ca8a04" strokeWidth="1.2" />
      <Callout from={[112, 56]} to={[88, 32]} text="こう彩" />
      <Callout from={[110, 80]} to={[88, 128]} text="ひとみ" />
      <Callout from={[124, 68]} to={[146, 20]} text="レンズ（水晶体）" />
      <Callout from={[192, 52]} to={[226, 40]} text="網膜" />
      <Callout from={[226, 84]} to={[242, 108]} text="視神経" />

      <Label x={10} y={166} size={10} weight="800">耳のつくり</Label>
      <line x1="20" y1="208" x2="90" y2="208" stroke={LINE} strokeWidth="1.2" />
      <line x1="20" y1="224" x2="92" y2="224" stroke={LINE} strokeWidth="1.2" />
      <line x1="90" y1="202" x2="96" y2="230" stroke="#b45309" strokeWidth="3" />
      <path d="M98,216 L106,212 L116,210 L128,208" fill="none" stroke="#a8a29e" strokeWidth="4" strokeLinecap="round" />
      <path d={spiral} fill="none" stroke="#7c3aed" strokeWidth="2.6" />
      <line x1="178" y1="216" x2="232" y2="222" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <Label x={24} y={200} size={8.5} color={LINE}>音 →</Label>
      <Callout from={[92, 204]} to={[78, 184]} text="鼓膜" />
      <Callout from={[114, 210]} to={[124, 184]} text="耳小骨" />
      <Callout from={[168, 204]} to={[186, 184]} text="うずまき管" />
      <Callout from={[222, 221]} to={[236, 248]} text="聴神経" />
      <Callout from={[44, 224]} to={[54, 250]} text="外耳道" />
    </svg>
  )
}

// ── 刺激から反応までの信号の伝わり方 ───────────────────────────────────────────
//   { name: 'reflexPath', mode: 'conscious' | 'reflex' }
// conscious：皮膚→感覚神経→せきずい→脳（判断）→せきずい→運動神経→筋肉。
// reflex：皮膚→感覚神経→せきずい→運動神経→筋肉。脳を通らずに、せきずいから直接命令が出る。
function ReflexPathDiagram({ mode = 'conscious' }) {
  const reflex = mode === 'reflex'
  const SENSE = '#2563eb'
  const MOTOR = '#dc2626'
  const faint = '#cbd5e1'
  const box = (x, y, w, text, fill) => (
    <g>
      <rect x={x} y={y} width={w} height="30" rx="8" fill={fill} stroke={LINE} strokeWidth="1" />
      <Label x={x + w / 2} y={y + 19.5} anchor="middle" size={10} weight="800">{text}</Label>
    </g>
  )
  const arrowHead = (x, y, dir, color) => {
    const d = { up: `M${x},${y} L${x - 4.5},${y + 8} L${x + 4.5},${y + 8} Z`, down: `M${x},${y} L${x - 4.5},${y - 8} L${x + 4.5},${y - 8} Z`, right: `M${x},${y} L${x - 8},${y - 4.5} L${x - 8},${y + 4.5} Z` }[dir]
    return <path d={d} fill={color} />
  }
  return (
    <svg viewBox="0 0 300 230" className="h-auto w-full" role="img" aria-label={reflex ? '反射の信号の伝わり方' : '意識して起こす反応の信号の伝わり方'} data-subject-diagram="reflexPath">
      {box(110, 12, 80, '脳', reflex ? '#f1f5f9' : '#ede9fe')}
      {box(110, 92, 80, 'せきずい', '#fef3c7')}
      {box(16, 170, 96, '皮膚（感覚器官）', '#e0f2fe')}
      {box(188, 170, 96, '筋肉', '#fee2e2')}
      <path d="M64,170 L64,107 L102,107" fill="none" stroke={SENSE} strokeWidth="3" />
      {arrowHead(110, 107, 'right', SENSE)}
      <Label x={60} y={144} anchor="end" size={9} weight="800" color={SENSE}>感覚神経</Label>
      <line x1="140" y1="92" x2="140" y2="50" stroke={reflex ? faint : SENSE} strokeWidth="3" strokeDasharray={reflex ? '4 3' : undefined} />
      {arrowHead(140, 42, 'up', reflex ? faint : SENSE)}
      {!reflex && <line x1="160" y1="42" x2="160" y2="84" stroke={MOTOR} strokeWidth="3" />}
      {!reflex && arrowHead(160, 92, 'down', MOTOR)}
      <path d="M190,107 L236,107 L236,162" fill="none" stroke={MOTOR} strokeWidth="3" />
      {arrowHead(236, 170, 'down', MOTOR)}
      <Label x={240} y={144} size={9} weight="800" color={MOTOR}>運動神経</Label>
      {reflex ? (
        <g>
          <Label x={196} y={62} size={8.5} color={LINE}>脳には、あとから伝わる</Label>
          <Label x={150} y={140} anchor="middle" size={9} weight="800" color={MOTOR}>せきずいから直接命令が出る</Label>
          <Label x={150} y={222} anchor="middle" size={8.5} color={LINE}>例：熱いものにふれて、思わず手を引っこめる</Label>
        </g>
      ) : (
        <g>
          <Label x={196} y={31} size={8.5} color={LINE}>判断して命令を出す</Label>
          <Label x={150} y={222} anchor="middle" size={8.5} color={LINE}>例：ボールが見えたので、バットをふる</Label>
        </g>
      )}
    </svg>
  )
}

// ── 腕の骨と筋肉 ───────────────────────────────────────────────────────────
//   { name: 'armMuscles' }
// 腕を曲げたとき。内側の筋肉が縮み、外側の筋肉はゆるむ。筋肉の両端はけんで、関節をまたいだ2つの骨についている。
function ArmMusclesDiagram() {
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="腕の骨と筋肉" data-subject-diagram="armMuscles">
      <line x1="60" y1="40" x2="150" y2="130" stroke="#d6d3d1" strokeWidth="11" strokeLinecap="round" />
      <line x1="150" y1="130" x2="244" y2="70" stroke="#d6d3d1" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="114" cy="74" rx="40" ry="16" transform="rotate(45 114 74)" fill="#f87171" stroke="#b91c1c" strokeWidth="1" />
      <ellipse cx="96" cy="96" rx="44" ry="7" transform="rotate(45 96 96)" fill="#fecaca" stroke="#b91c1c" strokeWidth="1" />
      <line x1="140" y1="102" x2="168" y2="116" stroke="#94a3b8" strokeWidth="3" />
      <line x1="126" y1="124" x2="150" y2="143" stroke="#94a3b8" strokeWidth="3" />
      <circle cx="150" cy="130" r="9" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
      <Callout from={[114, 70]} to={[140, 26]} text="内側の筋肉（縮む）" />
      <Callout from={[92, 100]} to={[112, 180]} text="外側の筋肉（ゆるむ）" />
      <Callout from={[156, 110]} to={[196, 122]} text="けん" />
      <Callout from={[154, 138]} to={[176, 160]} text="関節" />
      <Callout from={[214, 90]} to={[236, 108]} text="骨" />
    </svg>
  )
}

// ── 面積と圧力（スポンジのへこみ） ─────────────────────────────────────────────
//   { name: 'pressureFaces' }
// 同じ直方体（重さ6N、20cm×10cm×5cm）を、ちがう面を下にしてスポンジに置く。面積が小さいほど圧力が大きく、深くへこむ。
function PressureFacesDiagram() {
  const cases = [[50, 72, 18, 3, '0.02m²', '300Pa'], [150, 72, 36, 6, '0.01m²', '600Pa'], [250, 36, 72, 12, '0.005m²', '1200Pa']]
  return (
    <svg viewBox="0 0 300 192" className="h-auto w-full" role="img" aria-label="面積と圧力" data-subject-diagram="pressureFaces">
      <Label x={150} y={16} anchor="middle" size={9} color={LINE}>同じ直方体（重さ6N）を、ちがう面を下にして置く</Label>
      {cases.map(([c, w, h, dent, area, pressure]) => (
        <g key={c}>
          <path d={`M${c - 44},122 L${c - w / 2 - 6},122 L${c - w / 2},${122 + dent} L${c + w / 2},${122 + dent} L${c + w / 2 + 6},122 L${c + 44},122 L${c + 44},150 L${c - 44},150 Z`} fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" />
          <rect x={c - w / 2} y={122 + dent - h} width={w} height={h} fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1.2" />
          <Label x={c} y={166} anchor="middle" size={9}>{`面積 ${area}`}</Label>
          <Label x={c} y={182} anchor="middle" size={9.5} weight="800" color="#dc2626">{`圧力 ${pressure}`}</Label>
        </g>
      ))}
    </svg>
  )
}

// ── 大気圧のはたらく向き ──────────────────────────────────────────────────────
//   { name: 'airPressureAll' }
// 大気圧は、物体のあらゆる面に、あらゆる向きから垂直にはたらく。
function AirPressureAllDiagram() {
  const arrows = [
    [[150, 18], [150, 50]], [[110, 18], [110, 50]], [[190, 18], [190, 50]],
    [[150, 152], [150, 120]], [[110, 152], [110, 120]], [[190, 152], [190, 120]],
    [[40, 70], [72, 70]], [[40, 100], [72, 100]],
    [[260, 70], [228, 70]], [[260, 100], [228, 100]],
  ]
  return (
    <svg viewBox="0 0 300 180" className="h-auto w-full" role="img" aria-label="大気圧のはたらく向き" data-subject-diagram="airPressureAll">
      <rect x="80" y="56" width="140" height="58" rx="6" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.4" />
      <Label x={150} y={89} anchor="middle" size={10} weight="800">物体</Label>
      {arrows.map(([from, to]) => <Arrow key={`${from}`} from={from} to={to} color="#dc2626" />)}
      <Label x={150} y={174} anchor="middle" size={9} color={LINE}>大気圧は、あらゆる向きから面に垂直にはたらく</Label>
    </svg>
  )
}

// ── 高気圧・低気圧のまわりの風と、空気の上下の動き ──────────────────────────────────
//   { name: 'pressureSystems', view: 'top' | 'side' }
// top：北半球で上から見たようす。高気圧は時計回りにふき出し、低気圧は反時計回りにふきこむ。等圧線の間隔がせまいほど風が強い。
// side：横から見たようす。高気圧は下降気流で晴れ、低気圧は上昇気流で雲ができる。
function PressureSystemsDiagram({ view = 'top' }) {
  if (view === 'side') {
    return (
      <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="高気圧と低気圧の空気の動き" data-subject-diagram="pressureSystems">
        <line x1="8" y1="150" x2="292" y2="150" stroke={DARK} strokeWidth="2" />
        <circle cx="122" cy="34" r="11" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        <Arrow from={[78, 34]} to={[78, 124]} color="#2563eb" width={2.4} />
        <Arrow from={[70, 140]} to={[22, 140]} color="#2563eb" />
        <Arrow from={[86, 140]} to={[134, 140]} color="#2563eb" />
        <Label x={84} y={92} size={9} weight="800" color="#1d4ed8">下降気流</Label>
        <Label x={78} y={170} anchor="middle" size={10} weight="800">高気圧</Label>
        <Label x={78} y={186} anchor="middle" size={8.5} color={LINE}>雲ができにくく、晴れ</Label>
        <path d="M196,50 Q196,34 212,36 Q220,22 236,32 Q252,28 252,44 Q262,50 250,58 L200,58 Q188,56 196,50 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
        {[206, 222, 238].map((x) => <line key={x} x1={x} y1="64" x2={x - 4} y2="74" stroke="#3b82f6" strokeWidth="1.4" />)}
        <Arrow from={[170, 140]} to={[214, 140]} color="#dc2626" />
        <Arrow from={[274, 140]} to={[230, 140]} color="#dc2626" />
        <Arrow from={[222, 132]} to={[222, 80]} color="#dc2626" width={2.4} />
        <Label x={228} y={112} size={9} weight="800" color="#b91c1c">上昇気流</Label>
        <Label x={222} y={170} anchor="middle" size={10} weight="800">低気圧</Label>
        <Label x={222} y={186} anchor="middle" size={8.5} color={LINE}>雲ができやすく、くもりや雨</Label>
      </svg>
    )
  }
  const spiral = (cx, cy, r0, r1, a0, turn) => {
    const pts = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12
      const a = a0 + turn * t
      const r = r0 + (r1 - r0) * t
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
    })
    return pts
  }
  const flow = (pts, color) => {
    const [x2, y2] = pts[pts.length - 1]
    const [x1, y1] = pts[pts.length - 2]
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const tip = (a) => `${(x2 + 7 * Math.cos(angle + a)).toFixed(1)},${(y2 + 7 * Math.sin(angle + a)).toFixed(1)}`
    return (
      <g>
        <path d={`M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`} fill="none" stroke={color} strokeWidth="1.8" />
        <path d={`M${x2.toFixed(1)},${y2.toFixed(1)} L${tip(Math.PI * 0.85)} L${tip(-Math.PI * 0.85)} Z`} fill={color} />
      </g>
    )
  }
  const high = [[24, '1024'], [42, '1020'], [60, '1016']]
  const low = [[18, '1000'], [32, '1004'], [46, '1008'], [60, '1012']]
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="高気圧と低気圧のまわりの風" data-subject-diagram="pressureSystems">
      {high.map(([r, text]) => (
        <g key={text}>
          <circle cx="76" cy="92" r={r} fill="none" stroke={LINE} strokeWidth="1" />
          <Label x={76} y={92 - r + 4} anchor="middle" size={7.5} color={LINE}>{text}</Label>
        </g>
      ))}
      <Label x={76} y={96} anchor="middle" size={12} weight="800" color="#1d4ed8">高</Label>
      {[0, 1, 2, 3].map((k) => <g key={k}>{flow(spiral(76, 92, 14, 58, (k * Math.PI) / 2 + 0.3, 0.9), '#2563eb')}</g>)}
      {low.map(([r, text]) => (
        <g key={text}>
          <circle cx="224" cy="92" r={r} fill="none" stroke={LINE} strokeWidth="1" />
          <Label x={224} y={92 - r + 4} anchor="middle" size={7.5} color={LINE}>{text}</Label>
        </g>
      ))}
      <Label x={224} y={96} anchor="middle" size={12} weight="800" color="#b91c1c">低</Label>
      {[0, 1, 2, 3].map((k) => <g key={k}>{flow(spiral(224, 92, 62, 14, (k * Math.PI) / 2 + 0.3, -0.9), '#dc2626')}</g>)}
      <Label x={76} y={172} anchor="middle" size={10} weight="800">高気圧</Label>
      <Label x={76} y={188} anchor="middle" size={8.5} color={LINE}>時計回りにふき出す</Label>
      <Label x={224} y={172} anchor="middle" size={10} weight="800">低気圧</Label>
      <Label x={224} y={188} anchor="middle" size={8.5} color={LINE}>反時計回りにふきこむ</Label>
    </svg>
  )
}

// ── 天気記号と風向・風力 ───────────────────────────────────────────────────────
//   { name: 'weatherSymbols' }
// 上：日本式の天気記号（快晴・晴れ・くもり・雨・雪）。下：天気図での表し方の例（北東の風、風力3、晴れ）。
// 矢は風がふいてくる方向にのばし、はねは矢の時計回りの側に、風力の数だけかく。
function WeatherSymbol({ x, y, kind, r = 11 }) {
  const ring = <circle cx={x} cy={y} r={r} fill={kind === 'rain' ? INK : '#ffffff'} stroke={INK} strokeWidth="1.6" />
  if (kind === 'sunny') return <g>{ring}<line x1={x} y1={y - r} x2={x} y2={y + r} stroke={INK} strokeWidth="1.6" /></g>
  if (kind === 'cloudy') return <g>{ring}<circle cx={x} cy={y} r={r * 0.5} fill="none" stroke={INK} strokeWidth="1.6" /></g>
  if (kind === 'snow') {
    const d = r * 0.71
    return (
      <g>
        {ring}
        <line x1={x - r} y1={y} x2={x + r} y2={y} stroke={INK} strokeWidth="1.6" />
        <line x1={x - d} y1={y - d} x2={x + d} y2={y + d} stroke={INK} strokeWidth="1.6" />
        <line x1={x - d} y1={y + d} x2={x + d} y2={y - d} stroke={INK} strokeWidth="1.6" />
      </g>
    )
  }
  return ring
}
function WeatherSymbolsDiagram() {
  const kinds = [['clear', '快晴'], ['sunny', '晴れ'], ['cloudy', 'くもり'], ['rain', '雨'], ['snow', '雪']]
  const cx = 110
  const cy = 142
  const angle = -Math.PI / 4
  const ux = Math.cos(angle)
  const uy = Math.sin(angle)
  const start = [cx + 11 * ux, cy + 11 * uy]
  const end = [cx + 62 * ux, cy + 62 * uy]
  const side = [-uy, ux]
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="天気記号と風向・風力" data-subject-diagram="weatherSymbols">
      {kinds.map(([kind, name], index) => (
        <g key={kind}>
          <WeatherSymbol x={34 + index * 58} y={28} kind={kind} />
          <Label x={34 + index * 58} y={58} anchor="middle" size={9.5} weight="800">{name}</Label>
        </g>
      ))}
      <line x1="8" y1="76" x2="292" y2="76" stroke="#e2e8f0" strokeWidth="1" />
      <Label x={10} y={96} size={9} weight="800">天気図での表し方の例</Label>
      <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke={INK} strokeWidth="1.8" />
      {[0, 1, 2].map((k) => {
        const along = 56 - k * 7
        const bx = cx + along * ux
        const by = cy + along * uy
        return <line key={k} x1={bx} y1={by} x2={bx + 11 * side[0]} y2={by + 11 * side[1]} stroke={INK} strokeWidth="1.8" />
      })}
      <WeatherSymbol x={cx} y={cy} kind="sunny" />
      <line x1="40" y1="186" x2="40" y2="160" stroke={LINE} strokeWidth="1" />
      <path d="M40,154 L36,162 L44,162 Z" fill={LINE} />
      <Label x={40} y={198} anchor="middle" size={8.5} color={LINE}>北</Label>
      <Label x={186} y={116} size={9}>風向：北東（矢の向き）</Label>
      <Label x={186} y={136} size={9}>風力：3（はねの数）</Label>
      <Label x={186} y={156} size={9}>天気：晴れ（円の中）</Label>
    </svg>
  )
}

const cloudPath = (cx, cy, w, h) => `M${cx - w / 2},${cy + h / 2} Q${cx - w / 2 - 6},${cy} ${cx - w / 4},${cy - h / 4} Q${cx - w / 6},${cy - h / 2 - 4} ${cx},${cy - h / 3} Q${cx + w / 6},${cy - h / 2 - 6} ${cx + w / 4},${cy - h / 4} Q${cx + w / 2 + 6},${cy} ${cx + w / 2},${cy + h / 2} Z`
function Cloud({ cx, cy, w = 50, h = 22, fill = '#e2e8f0' }) {
  return <path d={cloudPath(cx, cy, w, h)} fill={fill} stroke="#64748b" strokeWidth="1" />
}

// ── 上昇する空気と雲のでき方 ───────────────────────────────────────────────────
//   { name: 'cloudRise' }
// 地表で24℃・露点18℃の空気が上昇すると、100mで約1℃ずつ温度が下がり、600mで露点に達して雲ができ始める。
function CloudRiseDiagram() {
  const y = (h) => 210 - h * 0.15
  const parcels = [[0, 9, '24℃'], [300, 11, '21℃'], [600, 13, '18℃'], [900, 15, '15℃']]
  return (
    <svg viewBox="0 0 300 224" className="h-auto w-full" role="img" aria-label="上昇する空気と雲のでき方" data-subject-diagram="cloudRise">
      <Cloud cx={216} cy={86} w={80} h={60} />
      <line x1="40" y1="30" x2="40" y2="210" stroke={DARK} strokeWidth="1" />
      {[0, 300, 600, 900, 1200].map((h) => (
        <g key={h}>
          <line x1="36" y1={y(h)} x2="40" y2={y(h)} stroke={DARK} strokeWidth="1" />
          <Label x={33} y={y(h) + 3.5} anchor="end" size={8.5} color={LINE}>{h}</Label>
        </g>
      ))}
      <Label x={40} y={20} anchor="middle" size={8.5} color={LINE}>高さ(m)</Label>
      <line x1="40" y1="210" x2="292" y2="210" stroke={DARK} strokeWidth="2" />
      <line x1="40" y1={y(600)} x2="292" y2={y(600)} stroke="#2563eb" strokeWidth="1.2" strokeDasharray="4 3" />
      <Label x={46} y={y(600) - 6} size={8.5} weight="800" color="#1d4ed8">雲ができ始める高さ（露点18℃）</Label>
      {parcels.map(([h, r, t]) => (
        <g key={h}>
          <circle cx="206" cy={y(h)} r={r} fill={h >= 600 ? '#f1f5f9' : '#ffffff'} stroke="#dc2626" strokeWidth="1.2" />
          <Label x={230} y={y(h) + 4} size={9} weight="800" color="#b91c1c">{t}</Label>
        </g>
      ))}
      <Arrow from={[270, 202]} to={[270, 42]} color={LINE} />
      <Label x={264} y={150} anchor="end" size={8.5} color={LINE}>上昇</Label>
    </svg>
  )
}

// ── 空気が上昇する3つの場合 ───────────────────────────────────────────────────
//   { name: 'risingAir' }
// 左：地表があたためられる。中：風が山の斜面をのぼる。右：暖気が寒気の上にのぼる（前線）。
function RisingAirDiagram() {
  return (
    <svg viewBox="0 0 300 156" className="h-auto w-full" role="img" aria-label="空気が上昇する場合" data-subject-diagram="risingAir">
      <line x1="4" y1="110" x2="96" y2="110" stroke={DARK} strokeWidth="2" />
      <circle cx="18" cy="20" r="8" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      {[34, 50, 66].map((x) => <path key={x} d={`M${x},106 q3,-4 0,-8 q-3,-4 0,-8`} fill="none" stroke="#f97316" strokeWidth="1.2" />)}
      <Arrow from={[50, 88]} to={[50, 48]} color="#dc2626" />
      <Cloud cx={50} cy={32} w={46} h={18} />
      <Label x={50} y={130} anchor="middle" size={8.5}>地表が</Label>
      <Label x={50} y={144} anchor="middle" size={8.5}>あたためられる</Label>

      <path d="M112,110 L160,42 L196,110 Z" fill="#d9f99d" stroke="#4d7c0f" strokeWidth="1" />
      <Arrow from={[104, 104]} to={[146, 58]} color="#dc2626" />
      <Cloud cx={142} cy={32} w={44} h={18} />
      <Label x={150} y={130} anchor="middle" size={8.5}>風が山の斜面を</Label>
      <Label x={150} y={144} anchor="middle" size={8.5}>のぼる</Label>

      <line x1="204" y1="110" x2="296" y2="110" stroke={DARK} strokeWidth="2" />
      <path d="M210,110 L292,110 L292,64 Z" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1" />
      <Label x={272} y={102} anchor="middle" size={8.5} weight="800" color="#1d4ed8">寒気</Label>
      <Arrow from={[214, 100]} to={[270, 64]} color="#dc2626" />
      <Label x={222} y={80} anchor="middle" size={8.5} weight="800" color="#b91c1c">暖気</Label>
      <Cloud cx={262} cy={36} w={46} h={18} />
      <Label x={250} y={130} anchor="middle" size={8.5}>暖気が寒気の</Label>
      <Label x={250} y={144} anchor="middle" size={8.5}>上にのぼる</Label>
    </svg>
  )
}

// ── 雲をつくる実験 ─────────────────────────────────────────────────────────
//   { name: 'cloudFlask' }
// 少量の水と線香のけむりを入れたフラスコに注射器をつなぎ、ピストンを引くと、中が白くくもる。
function CloudFlaskDiagram() {
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="雲をつくる実験" data-subject-diagram="cloudFlask">
      <defs>
        <clipPath id="cloud-flask"><circle cx="80" cy="124" r="42" /></clipPath>
      </defs>
      <path d="M72,48 L72,84 A42,42 0 1,0 88,84 L88,48" fill={GLASS} stroke={LINE} strokeWidth="1.3" />
      <g clipPath="url(#cloud-flask)">
        <rect x="30" y="80" width="100" height="90" fill="#e2e8f0" opacity="0.75" />
        <rect x="30" y="152" width="100" height="20" fill={WATER} />
      </g>
      <rect x="68" y="40" width="24" height="10" rx="2" fill="#a8a29e" stroke={LINE} strokeWidth="1" />
      <path d="M80,40 L80,24 L150,24 L150,72 L168,72" fill="none" stroke={DARK} strokeWidth="2.4" />
      <rect x="168" y="60" width="80" height="24" rx="2" fill={GLASS} stroke={LINE} strokeWidth="1.2" />
      <rect x="226" y="61" width="5" height="22" fill="#64748b" />
      <line x1="231" y1="72" x2="276" y2="72" stroke="#64748b" strokeWidth="3" />
      <rect x="276" y="58" width="6" height="28" rx="1.5" fill="#64748b" />
      <Arrow from={[244, 104]} to={[288, 104]} color="#dc2626" />
      <Label x={266} y={122} anchor="middle" size={9} weight="800" color="#b91c1c">ピストンを引く</Label>
      <Label x={208} y={52} anchor="middle" size={9} weight="800">注射器</Label>
      <Label x={80} y={122} anchor="middle" size={9} weight="800" color={LINE}>白くくもる</Label>
      <Callout from={[96, 104]} to={[140, 150]} text="線香のけむり（芯になる）" />
      <Callout from={[86, 160]} to={[140, 180]} text="少量の水" />
    </svg>
  )
}

// ── 水の循環 ──────────────────────────────────────────────────────────────
//   { name: 'waterCycle' }
// 太陽のエネルギーで海や陸から水が蒸発し、雲になって雨や雪を降らせ、川や地下水となって海にもどる。
function WaterCycleDiagram() {
  return (
    <svg viewBox="0 0 300 204" className="h-auto w-full" role="img" aria-label="水の循環" data-subject-diagram="waterCycle">
      <circle cx="274" cy="22" r="12" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <path d="M0,190 L0,124 L40,72 L84,118 L130,150 L172,162 L172,196 L0,196 Z" fill="#dcfce7" stroke="#15803d" strokeWidth="1" />
      <rect x="172" y="162" width="128" height="34" fill="#bfdbfe" />
      <path d="M58,104 Q84,128 104,134 Q136,146 172,166" fill="none" stroke="#3b82f6" strokeWidth="3" />
      <path d="M36,172 L164,184" fill="none" stroke="#60a5fa" strokeWidth="1.6" strokeDasharray="5 3" />
      <path d="M164,184 L156,180 L157,188 Z" fill="#60a5fa" />
      <Cloud cx={62} cy={36} w={60} h={24} />
      <Cloud cx={196} cy={44} w={56} h={22} />
      {[46, 58, 70, 82].map((x) => <line key={x} x1={x} y1="54" x2={x - 5} y2="70" stroke="#3b82f6" strokeWidth="1.4" />)}
      <Arrow from={[218, 156]} to={[218, 66]} color="#0284c7" />
      <Arrow from={[246, 156]} to={[246, 74]} color="#0284c7" />
      <Arrow from={[168, 40]} to={[100, 36]} color={LINE} />
      <Label x={252} y={120} size={9} weight="800" color="#0369a1">蒸発</Label>
      <Label x={134} y={30} anchor="middle" size={8.5} color={LINE}>風で運ばれる</Label>
      <Label x={96} y={70} size={9} weight="800" color="#1d4ed8">雨・雪</Label>
      <Label x={118} y={132} size={9} weight="800" color="#1d4ed8">川</Label>
      <Label x={96} y={170} anchor="middle" size={8.5} color="#1d4ed8">地下水</Label>
      <Label x={236} y={186} anchor="middle" size={9} weight="800" color="#1d4ed8">海</Label>
    </svg>
  )
}

// ── 前線の記号 ─────────────────────────────────────────────────────────────
//   { name: 'frontSymbols' }
// 寒冷前線（三角）・温暖前線（半円）・停滞前線（三角と半円が反対側）・閉塞前線（三角と半円が同じ側）。記号のある側へ進む。
function FrontSymbolsDiagram() {
  const COLD = '#2563eb'
  const WARM = '#dc2626'
  const OCC = '#7c3aed'
  const x0 = 116
  const x1 = 290
  const tri = (x, y, color, up = true) => <path d={up ? `M${x - 7},${y} L${x},${y - 11} L${x + 7},${y} Z` : `M${x - 7},${y} L${x},${y + 11} L${x + 7},${y} Z`} fill={color} />
  const semi = (x, y, color, up = true) => <path d={up ? `M${x - 7},${y} A7,7 0 0,1 ${x + 7},${y} Z` : `M${x - 7},${y} A7,7 0 0,0 ${x + 7},${y} Z`} fill={color} />
  const xs = [140, 180, 220, 260]
  const rows = [
    ['寒冷前線', 30, (y) => <g><line x1={x0} y1={y} x2={x1} y2={y} stroke={COLD} strokeWidth="2.4" />{xs.map((x) => <g key={x}>{tri(x, y, COLD)}</g>)}</g>],
    ['温暖前線', 76, (y) => <g><line x1={x0} y1={y} x2={x1} y2={y} stroke={WARM} strokeWidth="2.4" />{xs.map((x) => <g key={x}>{semi(x, y, WARM)}</g>)}</g>],
    ['停滞前線', 122, (y) => (
      <g>
        {[0, 1, 2, 3].map((k) => <line key={k} x1={x0 + (k * (x1 - x0)) / 4} y1={y} x2={x0 + ((k + 1) * (x1 - x0)) / 4} y2={y} stroke={k % 2 ? COLD : WARM} strokeWidth="2.4" />)}
        {xs.map((x, k) => <g key={x}>{k % 2 ? tri(x, y, COLD, false) : semi(x, y, WARM)}</g>)}
      </g>
    )],
    ['閉塞前線', 168, (y) => <g><line x1={x0} y1={y} x2={x1} y2={y} stroke={OCC} strokeWidth="2.4" />{xs.map((x, k) => <g key={x}>{k % 2 ? semi(x, y, OCC) : tri(x, y, OCC)}</g>)}</g>],
  ]
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="前線の記号" data-subject-diagram="frontSymbols">
      {rows.map(([name, y, draw]) => (
        <g key={name}>
          <Label x={10} y={y + 4} size={10} weight="800">{name}</Label>
          {draw(y)}
        </g>
      ))}
      <Label x={290} y={192} anchor="end" size={8.5} color={LINE}>三角や半円のある側へ進む（停滞前線はほとんど動かない）</Label>
    </svg>
  )
}

// ── 寒冷前線と温暖前線の断面 ──────────────────────────────────────────────────
//   { name: 'frontSections' }
// 上：寒冷前線。寒気が暖気の下にもぐりこみ、暖気を急におし上げるので積乱雲ができる。
// 下：温暖前線。暖気が寒気の上をゆるやかにはい上がるので、乱層雲などの層状の雲が広がる。どちらも右へ進む。
function FrontSectionsDiagram() {
  return (
    <svg viewBox="0 0 300 262" className="h-auto w-full" role="img" aria-label="寒冷前線と温暖前線の断面" data-subject-diagram="frontSections">
      <Label x={10} y={14} size={10} weight="800">寒冷前線</Label>
      <line x1="8" y1="112" x2="292" y2="112" stroke={DARK} strokeWidth="2" />
      <path d="M8,112 L8,34 Q70,38 118,112 Z" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1" />
      <Label x={40} y={96} anchor="middle" size={9.5} weight="800" color="#1d4ed8">寒気</Label>
      <Label x={220} y={96} anchor="middle" size={9.5} weight="800" color="#b91c1c">暖気</Label>
      <path d="M100,72 Q98,40 112,34 Q106,12 128,14 Q144,6 150,22 Q166,24 160,44 Q166,62 150,72 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      {[106, 116, 126].map((x) => <line key={x} x1={x} y1="76" x2={x - 5} y2="104" stroke="#2563eb" strokeWidth="1.8" />)}
      <Arrow from={[158, 106]} to={[142, 58]} color="#dc2626" />
      <Label x={168} y={50} size={8.5} color={LINE}>積乱雲（強い雨）</Label>
      <Arrow from={[222, 30]} to={[284, 30]} color={LINE} />
      <Label x={218} y={34} anchor="end" size={8.5} color={LINE}>進む向き</Label>

      <Label x={10} y={146} size={10} weight="800">温暖前線</Label>
      <line x1="8" y1="244" x2="292" y2="244" stroke={DARK} strokeWidth="2" />
      <path d="M292,244 L292,184 Q190,196 60,244 Z" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1" />
      <Label x={256} y={232} anchor="middle" size={9.5} weight="800" color="#1d4ed8">寒気</Label>
      <Label x={40} y={206} anchor="middle" size={9.5} weight="800" color="#b91c1c">暖気</Label>
      <path d="M104,176 Q116,160 150,162 Q196,154 240,158 Q286,156 288,170 Q270,180 200,178 Q140,182 104,176 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      {[130, 160, 190, 220, 250].map((x) => <line key={x} x1={x} y1="182" x2={x - 3} y2="196" stroke="#60a5fa" strokeWidth="1.2" />)}
      <Arrow from={[74, 236]} to={[150, 206]} color="#dc2626" />
      <Label x={196} y={150} anchor="middle" size={8.5} color={LINE}>乱層雲など（おだやかな雨が長く続く）</Label>
      <Arrow from={[222, 136]} to={[284, 136]} color={LINE} />
      <Label x={218} y={140} anchor="end" size={8.5} color={LINE}>進む向き</Label>
    </svg>
  )
}

// ── 温帯低気圧 ─────────────────────────────────────────────────────────────
//   { name: 'midLatitudeCyclone' }
// 上から見たようす（上が北）。中心から南東へ温暖前線、南西へ寒冷前線がのびる。前線の間は暖気、まわりは寒気。
// 青くぬった所が雨の降りやすい所。低気圧は西から東へ進む。
function MidLatitudeCycloneDiagram() {
  const COLD = '#2563eb'
  const WARM = '#dc2626'
  const along = (p0, c, p1, t) => [
    (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
    (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1],
  ]
  const tangent = (p0, c, p1, t) => {
    const dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0])
    const dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])
    const d = Math.hypot(dx, dy)
    return [dx / d, dy / d]
  }
  const center = [120, 64]
  const warm = [center, [184, 70], [240, 122]]
  const cold = [center, [104, 124], [54, 178]]
  const marks = (curve, kind, color, sideSign) => [0.25, 0.45, 0.65, 0.85].map((t) => {
    const [x, y] = along(...curve, t)
    const [tx, ty] = tangent(...curve, t)
    const nx = -ty * sideSign
    const ny = tx * sideSign
    if (kind === 'tri') {
      return <path key={t} d={`M${(x - 6 * tx).toFixed(1)},${(y - 6 * ty).toFixed(1)} L${(x + 10 * nx).toFixed(1)},${(y + 10 * ny).toFixed(1)} L${(x + 6 * tx).toFixed(1)},${(y + 6 * ty).toFixed(1)} Z`} fill={color} />
    }
    const pts = Array.from({ length: 9 }, (_, i) => {
      const a = (i / 8) * Math.PI
      return `${(x + 6.5 * Math.cos(a) * -tx + 6.5 * Math.sin(a) * nx).toFixed(1)},${(y + 6.5 * Math.cos(a) * -ty + 6.5 * Math.sin(a) * ny).toFixed(1)}`
    })
    return <path key={t} d={`M${pts.join(' L')} Z`} fill={color} />
  })
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="温帯低気圧" data-subject-diagram="midLatitudeCyclone">
      <path d="M145,68 L170,76 L194,88 L217,103 L240,122 L260,103 L236,83 L211,66 L184,52 L158,43 Z" fill="#bfdbfe" opacity="0.8" />
      <path d="M112,88 L102,111 L88,134 L73,156 L54,178 L44,172 L63,150 L78,128 L92,105 L102,82 Z" fill="#bfdbfe" opacity="0.8" />
      <ellipse cx="120" cy="64" rx="26" ry="18" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <ellipse cx="120" cy="64" rx="52" ry="36" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d={`M${warm[0]} Q${warm[1]} ${warm[2]}`} fill="none" stroke={WARM} strokeWidth="2.4" />
      {marks(warm, 'semi', WARM, -1)}
      <path d={`M${cold[0]} Q${cold[1]} ${cold[2]}`} fill="none" stroke={COLD} strokeWidth="2.4" />
      {marks(cold, 'tri', COLD, -1)}
      <Label x={120} y={68} anchor="middle" size={12} weight="800" color="#b91c1c">低</Label>
      <Label x={160} y={140} anchor="middle" size={10} weight="800" color="#b91c1c">暖気</Label>
      <Label x={36} y={70} anchor="middle" size={10} weight="800" color="#1d4ed8">寒気</Label>
      <Label x={252} y={60} anchor="middle" size={10} weight="800" color="#1d4ed8">寒気</Label>
      <Callout from={[236, 118]} to={[250, 146]} text="温暖前線" />
      <Callout from={[58, 174]} to={[48, 200]} text="寒冷前線" />
      <Arrow from={[192, 200]} to={[262, 200]} color={LINE} />
      <Label x={188} y={204} anchor="end" size={8.5} color={LINE}>西から東へ進む</Label>
      <Label x={290} y={16} anchor="end" size={8.5} color={LINE}>上が北</Label>
    </svg>
  )
}

// ── 海風と陸風 ─────────────────────────────────────────────────────────────
//   { name: 'seaLandBreeze' }
// 上：晴れた日の昼。陸があたたまって上昇気流が生じ、海から陸へ海風がふく。下：夜。陸が冷えて、陸から海へ陸風がふく。
function SeaLandBreezeDiagram() {
  const panel = (y0, day) => {
    const surface = day ? [[240, y0 + 86], [84, y0 + 86]] : [[84, y0 + 86], [240, y0 + 86]]
    const up = day ? [[70, y0 + 82], [70, y0 + 46]] : [[252, y0 + 82], [252, y0 + 46]]
    const top = day ? [[84, y0 + 40], [238, y0 + 40]] : [[238, y0 + 40], [84, y0 + 40]]
    const down = day ? [[252, y0 + 46], [252, y0 + 80]] : [[70, y0 + 46], [70, y0 + 80]]
    return (
      <g>
        <Label x={10} y={y0 + 14} size={10} weight="800">{day ? '晴れた日の昼（海風）' : '夜（陸風）'}</Label>
        {day ? <circle cx="120" cy={y0 + 18} r="9" fill="#fde047" stroke="#ca8a04" strokeWidth="1" /> : <path d={`M120,${y0 + 9} A9,9 0 1,0 120,${y0 + 27} A6.5,9 0 1,1 120,${y0 + 9} Z`} fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />}
        <rect x="10" y={y0 + 94} width="150" height="20" fill="#d9f99d" stroke="#4d7c0f" strokeWidth="1" />
        <rect x="160" y={y0 + 98} width="130" height="16" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1" />
        <Arrow from={surface[0]} to={surface[1]} color="#dc2626" width={2.6} />
        <Arrow from={up[0]} to={up[1]} color="#94a3b8" />
        <Arrow from={top[0]} to={top[1]} color="#94a3b8" />
        <Arrow from={down[0]} to={down[1]} color="#94a3b8" />
        <Label x={162} y={y0 + 80} anchor="middle" size={9.5} weight="800" color="#b91c1c">{day ? '海風' : '陸風'}</Label>
        <Label x={85} y={y0 + 108} anchor="middle" size={8.5}>{day ? '陸（あたたまる・気圧が低い）' : '陸（冷える・気圧が高い）'}</Label>
        <Label x={225} y={y0 + 110} anchor="middle" size={8.5}>{day ? '海（気圧が高い）' : '海（気圧が低い）'}</Label>
      </g>
    )
  }
  return (
    <svg viewBox="0 0 300 244" className="h-auto w-full" role="img" aria-label="海風と陸風" data-subject-diagram="seaLandBreeze">
      {panel(0, true)}
      {panel(124, false)}
    </svg>
  )
}

// ── 冬の季節風と日本海側の雪 ─────────────────────────────────────────────────
//   { name: 'winterMonsoon' }
// 大陸からの冷たく乾いた北西の季節風が、日本海の上で水蒸気をふくみ、山地にぶつかって雲をつくり、日本海側に雪を降らせる。
// 山をこえて太平洋側にふき下りる風は乾燥していて、太平洋側は晴れる。
function WinterMonsoonDiagram() {
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="冬の季節風と日本海側の雪" data-subject-diagram="winterMonsoon">
      <rect x="0" y="150" width="60" height="30" fill="#e7e5e4" stroke="#78716c" strokeWidth="1" />
      <rect x="60" y="154" width="92" height="26" fill="#bfdbfe" />
      <path d="M150,180 L150,150 Q176,146 192,112 L212,82 L232,116 Q256,146 300,150 L300,180 Z" fill="#d9f99d" stroke="#4d7c0f" strokeWidth="1" />
      <Arrow from={[4, 132]} to={[58, 132]} color="#2563eb" width={2.4} />
      <Arrow from={[64, 132]} to={[140, 132]} color="#2563eb" width={2.4} />
      {[84, 104, 124].map((x) => <path key={x} d={`M${x},152 q-3,-5 0,-10 q3,-5 0,-10`} fill="none" stroke="#0284c7" strokeWidth="1.2" />)}
      <Cloud cx={160} cy={98} w={56} h={24} />
      <Cloud cx={198} cy={70} w={44} h={20} />
      {[[164, 118], [176, 126], [170, 138], [186, 110], [182, 132], [158, 132]].map(([x, y]) => <Label key={`${x}-${y}`} x={x} y={y} anchor="middle" size={9} color="#1d4ed8">＊</Label>)}
      <Arrow from={[222, 92]} to={[268, 136]} color="#f97316" width={2.2} />
      <circle cx="274" cy="60" r="10" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <Label x={30} y={122} anchor="middle" size={8.5} color="#1d4ed8">冷たく乾いた</Label>
      <Label x={100} y={122} anchor="middle" size={8.5} color="#1d4ed8">北西の季節風</Label>
      <Label x={96} y={116 - 22} anchor="middle" size={8.5} color="#0369a1">水蒸気をふくむ</Label>
      <Label x={252} y={112} size={8.5} color="#c2410c">乾いた風</Label>
      <Label x={30} y={170} anchor="middle" size={8.5}>大陸</Label>
      <Label x={106} y={172} anchor="middle" size={8.5} color="#1d4ed8">日本海</Label>
      <Label x={176} y={172} anchor="middle" size={8.5}>日本海側（雪）</Label>
      <Label x={266} y={172} anchor="middle" size={8.5}>太平洋側（晴れ）</Label>
    </svg>
  )
}

function Charge({ x, y, sign, r = 6.5 }) {
  const plus = sign === '+'
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={plus ? '#fee2e2' : '#dbeafe'} stroke={plus ? '#dc2626' : '#2563eb'} strokeWidth="1" />
      <text x={x} y={y + 3.4} fontSize="9.5" fontWeight="800" textAnchor="middle" fill={plus ? '#b91c1c' : '#1d4ed8'}>{plus ? '＋' : '－'}</text>
    </g>
  )
}

// ── こすり合わせて生じる静電気と、電気の力 ──────────────────────────────────────────
//   { name: 'staticCharge' }
// 上：こする前はどちらも＋と－が同じ数。こすると、ティッシュペーパーの電子（－）がストローに移る。
// 下：同じ種類の電気はしりぞけ合い、ちがう種類の電気は引き合う。
function StaticChargeDiagram() {
  const body = (x, y, name, sub, pluses, minuses) => (
    <g>
      <rect x={x} y={y} width="118" height="30" rx="6" fill="#f8fafc" stroke={LINE} strokeWidth="1" />
      {[...Array(pluses).fill('+'), ...Array(minuses).fill('-')].map((sign, i) => <Charge key={i} x={x + 14 + i * 15} y={y + 15} sign={sign} r={6} />)}
      <Label x={x + 59} y={y + 44} anchor="middle" size={8.5} color={LINE}>{name}</Label>
      {sub && <Label x={x + 59} y={y + 56} anchor="middle" size={8.5} weight="800" color={sub.includes('－') ? '#1d4ed8' : '#b91c1c'}>{sub}</Label>}
    </g>
  )
  return (
    <svg viewBox="0 0 300 276" className="h-auto w-full" role="img" aria-label="静電気と電気の力" data-subject-diagram="staticCharge">
      <Label x={10} y={14} size={9.5} weight="800">こする前（どちらも電気を帯びていない）</Label>
      {body(16, 22, 'ストロー', null, 3, 3)}
      {body(166, 22, 'ティッシュペーパー', null, 3, 3)}
      <Label x={10} y={96} size={9.5} weight="800">こすったあと</Label>
      {body(16, 108, 'ストロー', '－の電気を帯びる', 3, 4)}
      {body(166, 108, 'ティッシュペーパー', '＋の電気を帯びる', 3, 2)}
      <Arrow from={[164, 123]} to={[137, 123]} color="#2563eb" />
      <Label x={150} y={104} anchor="middle" size={8} color="#1d4ed8">電子が移る</Label>

      <line x1="8" y1="184" x2="292" y2="184" stroke="#e2e8f0" strokeWidth="1" />
      <Charge x={48} y={212} sign="-" r={10} />
      <Charge x={100} y={212} sign="-" r={10} />
      <Arrow from={[38, 212]} to={[14, 212]} color={INK} />
      <Arrow from={[110, 212]} to={[134, 212]} color={INK} />
      <Label x={74} y={246} anchor="middle" size={9} weight="800">同じ種類：しりぞけ合う</Label>
      <Charge x={196} y={212} sign="+" r={10} />
      <Charge x={262} y={212} sign="-" r={10} />
      <Arrow from={[208, 212]} to={[224, 212]} color={INK} />
      <Arrow from={[250, 212]} to={[234, 212]} color={INK} />
      <Label x={229} y={246} anchor="middle" size={9} weight="800">ちがう種類：引き合う</Label>
      <Label x={150} y={270} anchor="middle" size={8.5} color={LINE}>電気の力は、はなれていてもはたらく</Label>
    </svg>
  )
}

// ── 電子線（陰極線）の曲がり方 ───────────────────────────────────────────────────
//   { name: 'crookesTube' }
// 真空放電管の－極から出た電子線が、上下の電極板に加えた電圧で、＋極（上）の側に曲がる。
function CrookesTubeDiagram() {
  return (
    <svg viewBox="0 0 300 190" className="h-auto w-full" role="img" aria-label="電子線の曲がり方" data-subject-diagram="crookesTube">
      <path d="M30,70 Q18,90 30,110 L270,120 Q284,90 270,60 Z" fill="#f8fafc" stroke={LINE} strokeWidth="1.3" />
      <rect x="34" y="80" width="8" height="20" fill="#2563eb" />
      <rect x="262" y="68" width="6" height="44" fill="#dc2626" />
      <rect x="64" y="84" width="4" height="12" fill={DARK} />
      <line x1="120" y1="72" x2="190" y2="72" stroke="#dc2626" strokeWidth="3" />
      <line x1="120" y1="108" x2="190" y2="108" stroke="#2563eb" strokeWidth="3" />
      <path d="M42,90 L120,90 Q170,90 240,70" fill="none" stroke="#16a34a" strokeWidth="2.2" />
      <path d="M120,90 L240,90" fill="none" stroke="#16a34a" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <Label x={38} y={134} anchor="middle" size={9} weight="800" color="#1d4ed8">－極</Label>
      <Label x={266} y={140} anchor="middle" size={9} weight="800" color="#b91c1c">＋極</Label>
      <Label x={155} y={62} anchor="middle" size={8.5} weight="800" color="#b91c1c">電極板（＋）</Label>
      <Label x={155} y={124} anchor="middle" size={8.5} weight="800" color="#1d4ed8">電極板（－）</Label>
      <Callout from={[90, 90]} to={[80, 40]} text="電子線" />
      <Callout from={[236, 72]} to={[214, 34]} text="＋極の側に曲がる" />
      <Label x={150} y={168} anchor="middle" size={8.5} color={LINE}>電圧を加えないとき、電子線は点線のようにまっすぐ進む</Label>
    </svg>
  )
}

// ── 回路の電流と電子の移動 ────────────────────────────────────────────────────
//   { name: 'electronFlow' }
// 電流は＋極から－極へ流れ（赤）、電子は－極から＋極へ移動する（青）。向きは反対。
function ElectronFlowDiagram() {
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="回路の電流と電子の移動" data-subject-diagram="electronFlow">
      <rect x="60" y="40" width="180" height="110" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="130" y="138" width="40" height="24" fill="#ffffff" />
      <line x1="140" y1="132" x2="140" y2="168" stroke={INK} strokeWidth="3" />
      <line x1="158" y1="140" x2="158" y2="160" stroke={INK} strokeWidth="5" />
      <Label x={134} y={186} anchor="middle" size={9} weight="800" color="#b91c1c">＋極</Label>
      <Label x={166} y={186} anchor="middle" size={9} weight="800" color="#1d4ed8">－極</Label>
      <circle cx="150" cy="40" r="11" fill="#fef9c3" stroke={INK} strokeWidth="1.4" />
      <path d="M143,33 L157,47 M157,33 L143,47" stroke={INK} strokeWidth="1.2" />
      <Label x={150} y={20} anchor="middle" size={8.5} color={LINE}>豆電球</Label>
      <Arrow from={[40, 130]} to={[40, 64]} color="#dc2626" width={2.4} />
      <Arrow from={[92, 24]} to={[118, 24]} color="#dc2626" width={2.4} />
      <Label x={36} y={100} anchor="end" size={8.5} weight="800" color="#b91c1c">電流</Label>
      {[[82, 58], [218, 58], [218, 130]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" />)}
      <Arrow from={[260, 130]} to={[260, 64]} color="#2563eb" width={2.4} />
      <Arrow from={[208, 24]} to={[182, 24]} color="#2563eb" width={2.4} />
      <Label x={264} y={100} size={8.5} weight="800" color="#1d4ed8">電子</Label>
      <Label x={150} y={102} anchor="middle" size={8.5} color={LINE}>電流：＋極 → 豆電球 → －極</Label>
      <Label x={150} y={118} anchor="middle" size={8.5} color={LINE}>電子：－極 → 豆電球 → ＋極</Label>
    </svg>
  )
}

// ── 放射線の通りぬけ方 ──────────────────────────────────────────────────────
//   { name: 'radiationPenetration' }
// α線は紙1枚で、β線はうすいアルミニウムの板で止まる。γ線やX線は通りぬけやすく、鉛の板などで止める。
function RadiationPenetrationDiagram() {
  const rows = [['α線', 44, 108], ['β線', 84, 168], ['γ線・X線', 124, 228]]
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label="放射線の通りぬけ方" data-subject-diagram="radiationPenetration">
      <rect x="104" y="28" width="4" height="116" fill="#fef3c7" stroke="#a16207" strokeWidth="0.8" />
      <rect x="162" y="28" width="8" height="116" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
      <rect x="222" y="28" width="18" height="116" fill="#64748b" stroke="#334155" strokeWidth="0.8" />
      <Label x={106} y={20} anchor="middle" size={8.5} weight="800">紙</Label>
      <Label x={166} y={20} anchor="middle" size={8.5} weight="800">アルミニウム板</Label>
      <Label x={231} y={20} anchor="middle" size={8.5} weight="800">鉛板</Label>
      {rows.map(([name, y, stop]) => (
        <g key={name}>
          <Label x={8} y={y + 4} size={9} weight="800" color="#b91c1c">{name}</Label>
          <Arrow from={[58, y]} to={[stop - 2, y]} color="#dc2626" width={2.2} />
        </g>
      ))}
      <Label x={150} y={166} anchor="middle" size={8.5} color={LINE}>放射線は種類によって、物質を通りぬける力（透過性）がちがう</Label>
    </svg>
  )
}

// 電気用図記号（線の太さ・大きさは回路図の中でそろえる）
function CellSymbol({ x, y, vertical = false }) {
  if (vertical) {
    return (
      <g>
        <line x1={x - 12} y1={y - 4} x2={x + 12} y2={y - 4} stroke={INK} strokeWidth="1.6" />
        <line x1={x - 7} y1={y + 4} x2={x + 7} y2={y + 4} stroke={INK} strokeWidth="3.4" />
      </g>
    )
  }
  return (
    <g>
      <rect x={x - 8} y={y - 14} width="16" height="28" fill="#ffffff" />
      <line x1={x - 4} y1={y - 12} x2={x - 4} y2={y + 12} stroke={INK} strokeWidth="1.6" />
      <line x1={x + 4} y1={y - 7} x2={x + 4} y2={y + 7} stroke={INK} strokeWidth="3.4" />
    </g>
  )
}
function BulbSymbol({ x, y, r = 9 }) {
  const d = r * 0.7
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#ffffff" stroke={INK} strokeWidth="1.4" />
      <path d={`M${x - d},${y - d} L${x + d},${y + d} M${x + d},${y - d} L${x - d},${y + d}`} stroke={INK} strokeWidth="1.2" />
    </g>
  )
}
function ResistorSymbol({ x, y, vertical = false }) {
  return vertical
    ? <rect x={x - 5} y={y - 13} width="10" height="26" fill="#ffffff" stroke={INK} strokeWidth="1.4" />
    : <rect x={x - 13} y={y - 5} width="26" height="10" fill="#ffffff" stroke={INK} strokeWidth="1.4" />
}
function MeterSymbol({ x, y, letter }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill="#ffffff" stroke={INK} strokeWidth="1.4" />
      <text x={x} y={y + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill={INK}>{letter}</text>
    </g>
  )
}

// ── 電気用図記号 ──────────────────────────────────────────────────────────
//   { name: 'circuitSymbols' }
function CircuitSymbolsDiagram() {
  const cells = [
    ['電源（電池）', (x, y) => <g><line x1={x - 20} y1={y} x2={x - 4} y2={y} stroke={INK} strokeWidth="1.4" /><line x1={x + 4} y1={y} x2={x + 20} y2={y} stroke={INK} strokeWidth="1.4" /><CellSymbol x={x} y={y} /><text x={x - 12} y={y - 12} fontSize="9" fontWeight="800" textAnchor="middle" fill="#b91c1c">＋</text><text x={x + 12} y={y - 12} fontSize="9" fontWeight="800" textAnchor="middle" fill="#1d4ed8">－</text></g>],
    ['電球', (x, y) => <g><line x1={x - 22} y1={y} x2={x + 22} y2={y} stroke={INK} strokeWidth="1.4" /><BulbSymbol x={x} y={y} /></g>],
    ['抵抗器（電熱線）', (x, y) => <g><line x1={x - 24} y1={y} x2={x + 24} y2={y} stroke={INK} strokeWidth="1.4" /><ResistorSymbol x={x} y={y} /></g>],
    ['スイッチ', (x, y) => <g><line x1={x - 22} y1={y} x2={x - 10} y2={y} stroke={INK} strokeWidth="1.4" /><line x1={x + 10} y1={y} x2={x + 22} y2={y} stroke={INK} strokeWidth="1.4" /><circle cx={x - 10} cy={y} r="2" fill="#ffffff" stroke={INK} strokeWidth="1.2" /><circle cx={x + 10} cy={y} r="2" fill="#ffffff" stroke={INK} strokeWidth="1.2" /><line x1={x - 9} y1={y - 1} x2={x + 10} y2={y - 11} stroke={INK} strokeWidth="1.4" /></g>],
    ['電流計', (x, y) => <g><line x1={x - 22} y1={y} x2={x + 22} y2={y} stroke={INK} strokeWidth="1.4" /><MeterSymbol x={x} y={y} letter="A" /></g>],
    ['電圧計', (x, y) => <g><line x1={x - 22} y1={y} x2={x + 22} y2={y} stroke={INK} strokeWidth="1.4" /><MeterSymbol x={x} y={y} letter="V" /></g>],
    ['導線がつながる', (x, y) => <g><line x1={x - 18} y1={y} x2={x + 18} y2={y} stroke={INK} strokeWidth="1.4" /><line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={INK} strokeWidth="1.4" /><circle cx={x} cy={y} r="3" fill={INK} /></g>],
    ['導線がつながらない', (x, y) => <g><line x1={x - 18} y1={y} x2={x + 18} y2={y} stroke={INK} strokeWidth="1.4" /><line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={INK} strokeWidth="1.4" /></g>],
  ]
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label="電気用図記号" data-subject-diagram="circuitSymbols">
      {cells.map(([name, draw], index) => {
        const x = 38 + (index % 4) * 75
        const y = 36 + Math.floor(index / 4) * 84
        return (
          <g key={name}>
            {draw(x, y)}
            <Label x={x} y={y + 36} anchor="middle" size={8}>{name}</Label>
          </g>
        )
      })}
    </svg>
  )
}

// ── 直列回路と並列回路の電流・電圧 ───────────────────────────────────────────────
//   { name: 'seriesParallel', show: 'current' | 'voltage' }（show がなければ回路だけ）
// 左：直列回路（豆電球2個が1本の道筋）。右：並列回路（道筋が枝分かれ）。
// current：直列はどこも同じ電流、並列は枝分かれ後の和が全体の電流。voltage：直列は各部分の和が電源の電圧、並列はどこも電源の電圧。
function SeriesParallelDiagram({ show }) {
  const wire = { fill: 'none', stroke: INK, strokeWidth: 1.4 }
  const tag = (x, y, text, color = '#b91c1c') => <Label x={x} y={y} anchor="middle" size={8.5} weight="800" color={color}>{text}</Label>
  const current = show === 'current'
  const voltage = show === 'voltage'
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="直列回路と並列回路" data-subject-diagram="seriesParallel">
      <Label x={75} y={14} anchor="middle" size={10} weight="800">直列回路</Label>
      <rect x="20" y="40" width="110" height="100" {...wire} />
      <BulbSymbol x={50} y={40} />
      <BulbSymbol x={100} y={40} />
      <CellSymbol x={75} y={140} />
      <Label x={62} y={160} anchor="middle" size={8} color="#b91c1c">＋</Label>
      <Label x={88} y={160} anchor="middle" size={8} color="#1d4ed8">－</Label>

      <Label x={225} y={14} anchor="middle" size={10} weight="800">並列回路</Label>
      <rect x="170" y="40" width="110" height="100" {...wire} />
      <line x1="170" y1="90" x2="280" y2="90" {...wire} />
      <circle cx="170" cy="90" r="2.6" fill={INK} />
      <circle cx="280" cy="90" r="2.6" fill={INK} />
      <BulbSymbol x={225} y={40} />
      <BulbSymbol x={225} y={90} />
      <CellSymbol x={225} y={140} />
      <Label x={212} y={160} anchor="middle" size={8} color="#b91c1c">＋</Label>
      <Label x={238} y={160} anchor="middle" size={8} color="#1d4ed8">－</Label>

      {current && (
        <g>
          {tag(20 + 14, 90, '0.3A')}
          {tag(75, 32, '0.3A')}
          {tag(130 - 14, 90, '0.3A')}
          {tag(196, 32, '0.2A')}
          {tag(196, 84, '0.3A')}
          {tag(265, 134, '0.5A')}
          <Label x={75} y={180} anchor="middle" size={8.5} color={LINE}>電流はどこも同じ大きさ</Label>
          <Label x={225} y={180} anchor="middle" size={8.5} color={LINE}>0.2A＋0.3A＝0.5A</Label>
        </g>
      )}
      {voltage && (
        <g>
          {tag(50, 64, '2V', '#1d4ed8')}
          {tag(100, 64, '4V', '#1d4ed8')}
          {tag(75, 126, '6V', '#1d4ed8')}
          {tag(250, 32, '6V', '#1d4ed8')}
          {tag(250, 82, '6V', '#1d4ed8')}
          {tag(250, 132, '6V', '#1d4ed8')}
          <Label x={75} y={180} anchor="middle" size={8.5} color={LINE}>2V＋4V＝6V（電源の電圧）</Label>
          <Label x={225} y={180} anchor="middle" size={8.5} color={LINE}>どれも電源の電圧と同じ</Label>
        </g>
      )}
    </svg>
  )
}

// ── 電流計と電圧計のつなぎ方 ──────────────────────────────────────────────────
//   { name: 'meterConnection' }
// 電流計ははかりたい部分に直列に、電圧計ははかりたい部分（抵抗器）に並列につなぐ。
function MeterConnectionDiagram() {
  const wire = { fill: 'none', stroke: INK, strokeWidth: 1.4 }
  return (
    <svg viewBox="0 0 300 172" className="h-auto w-full" role="img" aria-label="電流計と電圧計のつなぎ方" data-subject-diagram="meterConnection">
      <rect x="40" y="80" width="200" height="60" {...wire} />
      <path d="M110,80 L110,40 L128,40 M152,40 L170,40 L170,80" {...wire} />
      <circle cx="110" cy="80" r="2.6" fill={INK} />
      <circle cx="170" cy="80" r="2.6" fill={INK} />
      <ResistorSymbol x={140} y={80} />
      <MeterSymbol x={140} y={40} letter="V" />
      <rect x="228" y="96" width="24" height="28" fill="#ffffff" />
      <MeterSymbol x={240} y={110} letter="A" />
      <CellSymbol x={140} y={140} />
      <Label x={126} y={160} anchor="middle" size={8} color="#b91c1c">＋</Label>
      <Label x={154} y={160} anchor="middle" size={8} color="#1d4ed8">－</Label>
      <Label x={176} y={36} size={9} weight="800" color="#1d4ed8">電圧計（並列につなぐ）</Label>
      <Label x={224} y={116} anchor="end" size={9} weight="800" color="#b91c1c">電流計（直列につなぐ）</Label>
      <Label x={140} y={102} anchor="middle" size={8.5} color={LINE}>抵抗器</Label>
    </svg>
  )
}

// ── 棒磁石のまわりの磁力線 ────────────────────────────────────────────────────
//   { name: 'magneticField' }
// 磁力線はN極から出てS極に入る。間隔がせまい所（極の近く）ほど磁界が強い。方位磁針のN極は磁界の向きをさす。
function MagneticFieldDiagram() {
  const lines = [18, 34, 52, 74].map((h) => `M104,${96 - 4} C120,${96 - 4 - h * 1.3} 180,${96 - 4 - h * 1.3} 196,${96 - 4}`)
  const lower = [18, 34, 52, 74].map((h) => `M104,${96 + 4} C120,${96 + 4 + h * 1.3} 180,${96 + 4 + h * 1.3} 196,${96 + 4}`)
  const needle = (x, y, angle) => (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path d={`M${x - 9},${y} L${x},${y - 3} L${x},${y + 3} Z`} fill="#94a3b8" />
      <path d={`M${x + 9},${y} L${x},${y - 3} L${x},${y + 3} Z`} fill="#dc2626" />
      <circle cx={x} cy={y} r="11" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
    </g>
  )
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="棒磁石のまわりの磁力線" data-subject-diagram="magneticField">
      {[...lines, ...lower].map((d, i) => <path key={i} d={d} fill="none" stroke="#64748b" strokeWidth="1" />)}
      <path d="M104,96 L60,96 M196,96 L240,96" stroke="#64748b" strokeWidth="1" />
      <rect x="104" y="84" width="46" height="24" fill="#dc2626" />
      <rect x="150" y="84" width="46" height="24" fill="#2563eb" />
      <text x={127} y={101} fontSize="11" fontWeight="800" textAnchor="middle" fill="#ffffff">N</text>
      <text x={173} y={101} fontSize="11" fontWeight="800" textAnchor="middle" fill="#ffffff">S</text>
      <path d="M150,20.6 L143,17 L143,24 Z" fill="#64748b" />
      <path d="M150,171.4 L143,168 L143,175 Z" fill="#64748b" />
      <path d="M72,96 L80,92 L80,100 Z" fill="#64748b" />
      <path d="M232,96 L224,92 L224,100 Z" transform="rotate(180 228 96)" fill="#64748b" />
      {needle(150, 40, 0)}
      {needle(46, 70, 200)}
      {needle(254, 70, 160)}
      <Label x={150} y={192} anchor="middle" size={8.5} color={LINE}>磁力線はN極から出てS極に入る。赤は方位磁針のN極</Label>
    </svg>
  )
}

// ── 電流がつくる磁界（導線とコイル） ──────────────────────────────────────────────
//   { name: 'currentField', part?: 'wire' | 'coil' }（part がなければ両方を並べる）
// 左：まっすぐな導線を上から下へ電流が流れるとき、真上から見ると磁界は時計回り（右ねじの向き）。
// 右：コイルに電流を流すと、内側に同じ向きの磁界が重なって強い磁界ができる。
function CurrentFieldDiagram({ part }) {
  const wireShift = part === 'wire' ? 80 : 0
  const coilShift = part === 'coil' ? -68 : 0
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="電流がつくる磁界" data-subject-diagram="currentField">
      {part !== 'coil' && <g transform={`translate(${wireShift} 0)`}>
      <Label x={70} y={14} anchor="middle" size={9.5} weight="800">まっすぐな導線</Label>
      {[16, 30, 44].map((r) => <ellipse key={r} cx="70" cy="100" rx={r * 1.3} ry={r * 0.5} fill="none" stroke="#2563eb" strokeWidth="1" />)}
      <path d="M127,107 L123,98 L131,98 Z" fill="#2563eb" />
      <line x1="70" y1="26" x2="70" y2="176" stroke="#b45309" strokeWidth="3" />
      <Arrow from={[82, 40]} to={[82, 70]} color="#dc2626" />
      <Label x={88} y={50} size={8.5} weight="800" color="#b91c1c">電流</Label>
      <Label x={70} y={194} anchor="middle" size={8.5} color={LINE}>上から見ると磁界は時計回り</Label>
      </g>}
      {part !== 'wire' && <g transform={`translate(${coilShift} 0)`}>
      <Label x={218} y={14} anchor="middle" size={9.5} weight="800">コイル</Label>
      {[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={178 + k * 20} cy="100" rx="8" ry="26" fill="none" stroke="#b45309" strokeWidth="2.4" />)}
      <line x1="150" y1="100" x2="290" y2="100" stroke="#2563eb" strokeWidth="1.2" />
      <path d="M290,100 L282,96 L282,104 Z" fill="#2563eb" />
      <path d="M186,70 C170,40 266,40 250,70" fill="none" stroke="#2563eb" strokeWidth="1" />
      <path d="M186,130 C170,160 266,160 250,130" fill="none" stroke="#2563eb" strokeWidth="1" />
      <Label x={150} y={94} size={8.5} color="#1d4ed8">磁界</Label>
      <Label x={218} y={194} anchor="middle" size={8.5} color={LINE}>内側に同じ向きの強い磁界</Label>
      <Label x={218} y={178} anchor="middle" size={8} color={LINE}>鉄心を入れると電磁石になる</Label>
      </g>}
    </svg>
  )
}

// ── 電磁誘導 ──────────────────────────────────────────────────────────────
//   { name: 'electromagneticInduction' }
// 棒磁石のN極をコイルに近づけると、コイルの中の磁界が変化して誘導電流が流れ、検流計の針がふれる。
function ElectromagneticInductionDiagram() {
  return (
    <svg viewBox="0 0 300 184" className="h-auto w-full" role="img" aria-label="電磁誘導" data-subject-diagram="electromagneticInduction">
      <rect x="16" y="68" width="40" height="22" fill="#2563eb" />
      <rect x="56" y="68" width="40" height="22" fill="#dc2626" />
      <text x={36} y={83} fontSize="10" fontWeight="800" textAnchor="middle" fill="#ffffff">S</text>
      <text x={76} y={83} fontSize="10" fontWeight="800" textAnchor="middle" fill="#ffffff">N</text>
      <Arrow from={[62, 56]} to={[104, 56]} color={INK} />
      <Label x={83} y={48} anchor="middle" size={8.5} weight="800">近づける</Label>
      {[0, 1, 2, 3, 4, 5].map((k) => <ellipse key={k} cx={128 + k * 14} cy="79" rx="7" ry="24" fill="none" stroke="#b45309" strokeWidth="2.2" />)}
      <path d="M128,103 L128,160 L222,160 L222,140" fill="none" stroke={INK} strokeWidth="1.4" />
      <path d="M198,103 L198,116 L272,116 L272,140 L258,140" fill="none" stroke={INK} strokeWidth="1.4" />
      <circle cx="240" cy="136" r="18" fill="#ffffff" stroke={INK} strokeWidth="1.4" />
      <line x1="240" y1="140" x2="250" y2="124" stroke="#dc2626" strokeWidth="1.8" />
      <Label x={262} y={166} size={8.5} weight="800">検流計</Label>
      <Label x={162} y={40} anchor="middle" size={8.5} weight="800">コイル</Label>
      <Label x={140} y={180} anchor="middle" size={8.5} color={LINE}>コイルの中の磁界が変化すると電流が流れる</Label>
    </svg>
  )
}

// ── 磁界の中の電流が受ける力 ───────────────────────────────────────────────────
//   { name: 'forceOnCurrent' }
// 上にN極、下にS極（磁界は下向き）。導線（断面）の電流が手前向き（●）なら右に、奥向き（×）なら左に力を受ける。
function ForceOnCurrentDiagram() {
  const panel = (cx, toward) => (
    <g>
      <rect x={cx - 50} y="20" width="100" height="20" fill="#dc2626" />
      <rect x={cx - 50} y="136" width="100" height="20" fill="#2563eb" />
      <text x={cx} y={34} fontSize="10" fontWeight="800" textAnchor="middle" fill="#ffffff">N</text>
      <text x={cx} y={150} fontSize="10" fontWeight="800" textAnchor="middle" fill="#ffffff">S</text>
      {[-30, 30].map((dx) => <Arrow key={dx} from={[cx + dx, 44]} to={[cx + dx, 132]} color="#94a3b8" />)}
      <circle cx={cx} cy="88" r="11" fill="#fef3c7" stroke="#b45309" strokeWidth="1.6" />
      {toward ? <circle cx={cx} cy="88" r="3" fill={INK} /> : <path d={`M${cx - 6},82 L${cx + 6},94 M${cx + 6},82 L${cx - 6},94`} stroke={INK} strokeWidth="1.8" />}
      <Arrow from={[cx + (toward ? 12 : -12), 88]} to={[cx + (toward ? 44 : -44), 88]} color="#dc2626" width={2.6} />
      <Label x={cx} y={172} anchor="middle" size={8.5}>{toward ? '電流：手前向き（●）' : '電流：奥向き（×）'}</Label>
      <Label x={cx} y={186} anchor="middle" size={8.5} weight="800" color="#b91c1c">{toward ? '力：右向き' : '力：左向き'}</Label>
    </g>
  )
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="磁界の中の電流が受ける力" data-subject-diagram="forceOnCurrent">
      {panel(78, true)}
      {panel(222, false)}
      <Label x={150} y={12} anchor="middle" size={8.5} color={LINE}>灰色の矢印は磁界の向き（N極→S極）</Label>
    </svg>
  )
}

// ── 直流と交流 ─────────────────────────────────────────────────────────────
//   { name: 'dcAc' }
// 上：直流は向きが一定。下：交流は向きと大きさが周期的に変わる（1回の変化にかかる時間が、50Hzなら50分の1秒）。
function DcAcDiagram() {
  const left = 60
  const right = 288
  const sine = Array.from({ length: 121 }, (_, i) => {
    const x = left + ((right - left) * i) / 120
    const y = 142 - 30 * Math.sin((i / 120) * 3 * 2 * Math.PI)
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const period = (right - left) / 3
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="直流と交流" data-subject-diagram="dcAc">
      <line x1={left} y1="52" x2={right} y2="52" stroke="#cbd5e1" strokeWidth="1" />
      <line x1={left} y1="20" x2={left} y2="84" stroke={DARK} strokeWidth="1" />
      <line x1={left} y1="32" x2={right} y2="32" stroke="#dc2626" strokeWidth="2" />
      <Label x={left - 8} y={36} anchor="end" size={10} weight="800">直流</Label>
      <Label x={left - 8} y={56} anchor="end" size={8} color={LINE}>0</Label>
      <Label x={right} y={24} anchor="end" size={8.5} color={LINE}>向きが一定</Label>

      <line x1={left} y1="142" x2={right} y2="142" stroke="#cbd5e1" strokeWidth="1" />
      <line x1={left} y1="104" x2={left} y2="180" stroke={DARK} strokeWidth="1" />
      <path d={sine} fill="none" stroke="#2563eb" strokeWidth="2" />
      <Label x={left - 8} y={134} anchor="end" size={10} weight="800">交流</Label>
      <Label x={left - 8} y={146} anchor="end" size={8} color={LINE}>0</Label>
      <line x1={left} y1="184" x2={left + period} y2="184" stroke="#15803d" strokeWidth="1.2" />
      <line x1={left} y1="180" x2={left} y2="188" stroke="#15803d" strokeWidth="1.2" />
      <line x1={left + period} y1="180" x2={left + period} y2="188" stroke="#15803d" strokeWidth="1.2" />
      <Label x={left + period / 2} y={200} anchor="middle" size={8.5} color="#15803d">1回の変化</Label>
      <Label x={right} y={200} anchor="end" size={8.5} color={LINE}>時間 →</Label>
    </svg>
  )
}

function Particle({ x, y, text, fill, stroke = LINE, r = 8, size = 7.5, color = INK }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth="1" />
      <text x={x} y={y + size * 0.36} fontSize={size} fontWeight="800" textAnchor="middle" fill={color}>{text}</text>
    </g>
  )
}

// ── 塩化銅水溶液の電気分解 ───────────────────────────────────────────────────
//   { name: 'chlorideElectrolysis', view?: 'ions' }
// 既定：結果。陰極（電源の－極側）に赤色の銅が付着し、陽極（＋極側）から塩素が発生する。
// ions：イオンの動き。銅イオンは陰極へ、塩化物イオンは陽極へ引かれる。
function ChlorideElectrolysisDiagram({ view }) {
  const ions = view === 'ions'
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label={ions ? '塩化銅水溶液の電気分解とイオン' : '塩化銅水溶液の電気分解'} data-subject-diagram="chlorideElectrolysis">
      <path d="M100,34 L100,14 L141,14 M159,14 L200,14 L200,34" fill="none" stroke={INK} strokeWidth="1.4" />
      <line x1="146" y1="4" x2="146" y2="24" stroke={INK} strokeWidth="3.4" />
      <line x1="154" y1="0" x2="154" y2="28" stroke={INK} strokeWidth="1.6" />
      <Label x={138} y={10} anchor="end" size={8} color="#1d4ed8">－</Label>
      <Label x={162} y={10} size={8} color="#b91c1c">＋</Label>
      <rect x="62" y="80" width="176" height="114" fill="#99f6e4" opacity="0.55" />
      <path d="M60,56 L60,190 Q60,196 66,196 L234,196 Q240,196 240,190 L240,56" fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x="95" y="34" width="10" height="136" fill="#475569" />
      <rect x="195" y="34" width="10" height="136" fill="#475569" />
      {ions ? (
        <g>
          {[[136, 104], [146, 146], [130, 178]].map(([x, y]) => (
            <g key={`c${x}`}>
              <Particle x={x} y={y} text="Cu²⁺" fill="#bfdbfe" stroke="#1d4ed8" r={11} size={7} />
              <Arrow from={[x - 13, y]} to={[108, y]} color="#1d4ed8" width={1.4} />
            </g>
          ))}
          {[[166, 92], [182, 112], [164, 132], [184, 152], [166, 172], [185, 182]].map(([x, y]) => (
            <Particle key={`l${x}-${y}`} x={x} y={y} text="Cl⁻" fill="#bbf7d0" stroke="#15803d" r={9} size={7} />
          ))}
          <Arrow from={[176, 92]} to={[193, 92]} color="#15803d" width={1.4} />
          <Arrow from={[174, 132]} to={[193, 132]} color="#15803d" width={1.4} />
          <Label x={80} y={214} anchor="middle" size={8.5} color="#1d4ed8">Cu²⁺が電子を2個受けとり、銅になる</Label>
          <Label x={220} y={228} anchor="middle" size={8.5} color="#15803d">Cl⁻が電子をわたし、塩素になる</Label>
        </g>
      ) : (
        <g>
          <rect x="93" y="104" width="14" height="66" rx="2" fill="#b45309" opacity="0.85" />
          {[[212, 150], [214, 128], [210, 108], [216, 90]].map(([x, y]) => <circle key={y} cx={x} cy={y} r="3" fill="#ffffff" stroke="#16a34a" strokeWidth="0.9" />)}
          <Callout from={[93, 140]} to={[44, 212]} text="銅が付着（赤色）" anchor="start" />
          <Callout from={[216, 92]} to={[246, 40]} text="塩素が発生" />
        </g>
      )}
      <Label x={100} y={52} anchor="end" size={8.5} weight="800" color="#1d4ed8">陰極</Label>
      <Label x={206} y={52} size={8.5} weight="800" color="#b91c1c">陽極</Label>
    </svg>
  )
}

// ── 原子のなり立ち（ヘリウム原子のモデル） ─────────────────────────────────────────
//   { name: 'atomStructure' }
// 中心の原子核は、＋の電気をもつ陽子2個と、電気をもたない中性子2個。まわりに－の電気をもつ電子が2個。
function AtomStructureDiagram() {
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="原子のなり立ち" data-subject-diagram="atomStructure">
      <Label x={110} y={16} anchor="middle" size={9.5} weight="800">ヘリウム原子のモデル</Label>
      <circle cx="110" cy="100" r="54" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <Particle x={104} y={94} text="＋" fill="#fecaca" stroke="#dc2626" r={7} size={9} color="#b91c1c" />
      <Particle x={116} y={94} text="" fill="#e2e8f0" stroke="#64748b" r={7} />
      <Particle x={104} y={106} text="" fill="#e2e8f0" stroke="#64748b" r={7} />
      <Particle x={116} y={106} text="＋" fill="#fecaca" stroke="#dc2626" r={7} size={9} color="#b91c1c" />
      <Particle x={56} y={100} text="－" fill="#dbeafe" stroke="#2563eb" r={6} size={9} color="#1d4ed8" />
      <Particle x={164} y={100} text="－" fill="#dbeafe" stroke="#2563eb" r={6} size={9} color="#1d4ed8" />
      <Callout from={[120, 88]} to={[186, 40]} text="原子核" />
      <Callout from={[121, 108]} to={[186, 78]} text="陽子（＋の電気）" />
      <Callout from={[104, 112]} to={[186, 136]} text="中性子（電気なし）" />
      <Callout from={[168, 104]} to={[186, 108]} text="電子（－の電気）" />
      <Label x={150} y={188} anchor="middle" size={8.5} color={LINE}>陽子の数＝電子の数なので、原子全体は電気を帯びていない</Label>
    </svg>
  )
}

// ── イオンのでき方 ─────────────────────────────────────────────────────────
//   { name: 'ionFormation' }
// 原子が電子を失うと陽イオン、電子を受けとると陰イオンになる。
function IonFormationDiagram() {
  const rows = [
    ['Na', 'ナトリウム原子', '電子を1個失う', 'Na⁺', 'ナトリウムイオン', true],
    ['Cu', '銅原子', '電子を2個失う', 'Cu²⁺', '銅イオン', true],
    ['Cl', '塩素原子', '電子を1個受けとる', 'Cl⁻', '塩化物イオン', false],
  ]
  return (
    <svg viewBox="0 0 300 210" className="h-auto w-full" role="img" aria-label="イオンのでき方" data-subject-diagram="ionFormation">
      {rows.map(([atom, atomName, change, ion, ionName, positive], index) => {
        const y = 36 + index * 64
        return (
          <g key={atom}>
            <Particle x={50} y={y} text={atom} fill="#f1f5f9" r={16} size={11} />
            <Label x={50} y={y + 30} anchor="middle" size={8}>{atomName}</Label>
            <Arrow from={[74, y]} to={[216, y]} color={positive ? '#dc2626' : '#2563eb'} width={1.8} />
            <Label x={145} y={y - 8} anchor="middle" size={8.5} weight="800" color={positive ? '#b91c1c' : '#1d4ed8'}>{change}</Label>
            <Particle x={246} y={y} text={ion} fill={positive ? '#fee2e2' : '#dbeafe'} stroke={positive ? '#dc2626' : '#2563eb'} r={18} size={10} />
            <Label x={246} y={y + 32} anchor="middle" size={8}>{ionName}</Label>
          </g>
        )
      })}
    </svg>
  )
}

// ── 電解質と非電解質の水溶液 ────────────────────────────────────────────────
//   { name: 'ionBeaker' }
// 左：塩化ナトリウム水溶液。Na⁺とCl⁻に電離して散らばる（電流が流れる）。右：砂糖水。砂糖は分子のまま散らばる（電流は流れない）。
function IonBeakerDiagram() {
  const beaker = (x) => (
    <g>
      <rect x={x + 2} y="44" width="116" height="104" fill="#e0f2fe" opacity="0.8" />
      <path d={`M${x},30 L${x},146 Q${x},152 ${x + 6},152 L${x + 114},152 Q${x + 120},152 ${x + 120},146 L${x + 120},30`} fill="none" stroke={LINE} strokeWidth="1.3" />
    </g>
  )
  const hexagon = (cx, cy) => `M${Array.from({ length: 6 }, (_, i) => `${(cx + 9 * Math.cos((i * Math.PI) / 3)).toFixed(1)},${(cy + 9 * Math.sin((i * Math.PI) / 3)).toFixed(1)}`).join(' L')} Z`
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="電解質と非電解質の水溶液" data-subject-diagram="ionBeaker">
      {beaker(14)}
      {[[34, 70, '+'], [66, 64, '-'], [98, 76, '+'], [48, 100, '-'], [80, 108, '+'], [112, 102, '-'], [36, 132, '+'], [70, 136, '-'], [104, 132, '+'], [118, 70, '-']].map(([x, y, sign]) => (
        sign === '+'
          ? <Particle key={`${x}-${y}`} x={x} y={y} text="Na⁺" fill="#fee2e2" stroke="#dc2626" r={8.5} size={6} />
          : <Particle key={`${x}-${y}`} x={x} y={y} text="Cl⁻" fill="#bbf7d0" stroke="#15803d" r={8.5} size={6} />
      ))}
      <Label x={74} y={170} anchor="middle" size={8.5} weight="800">塩化ナトリウム水溶液</Label>
      <Label x={74} y={186} anchor="middle" size={8.5} color="#b91c1c">イオンがある → 電流が流れる</Label>
      {beaker(166)}
      {[[192, 72], [236, 66], [210, 104], [256, 110], [196, 134], [240, 136]].map(([x, y]) => <path key={`${x}-${y}`} d={hexagon(x, y)} fill="#fef3c7" stroke="#b45309" strokeWidth="1" />)}
      <Label x={226} y={170} anchor="middle" size={8.5} weight="800">砂糖水</Label>
      <Label x={226} y={186} anchor="middle" size={8.5} color={LINE}>分子のまま → 電流は流れない</Label>
    </svg>
  )
}

// ── 酸性・アルカリ性のもとを調べる実験 ─────────────────────────────────────────────
//   { name: 'litmusMigration', mode: 'acid' | 'alkali' }
// 硝酸カリウム水溶液でしめらせたろ紙にリトマス紙を置き、中央に水溶液をしみこませた糸を置いて電圧を加える。
// acid：青色リトマス紙の赤くなった部分が陰極側へ広がる（H⁺）。alkali：赤色リトマス紙の青くなった部分が陽極側へ広がる（OH⁻）。
function LitmusMigrationDiagram({ mode = 'acid' }) {
  const acid = mode === 'acid'
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label={acid ? '酸性のもとを調べる実験' : 'アルカリ性のもとを調べる実験'} data-subject-diagram="litmusMigration">
      <path d="M26,58 L26,14 L141,14 M159,14 L274,14 L274,58" fill="none" stroke={INK} strokeWidth="1.4" />
      <line x1="146" y1="4" x2="146" y2="24" stroke={INK} strokeWidth="3.4" />
      <line x1="154" y1="0" x2="154" y2="28" stroke={INK} strokeWidth="1.6" />
      <Label x={138} y={10} anchor="end" size={8} color="#1d4ed8">－</Label>
      <Label x={162} y={10} size={8} color="#b91c1c">＋</Label>
      <rect x="20" y="56" width="260" height="66" rx="3" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" />
      <rect x="20" y="62" width="12" height="54" fill="#475569" />
      <rect x="268" y="62" width="12" height="54" fill="#475569" />
      <rect x="44" y="80" width="212" height="18" fill={acid ? '#93c5fd' : '#fca5a5'} stroke={LINE} strokeWidth="0.8" />
      <rect x={acid ? 86 : 150} y="80" width="64" height="18" fill={acid ? '#ef4444' : '#2563eb'} opacity="0.9" />
      <line x1="150" y1="60" x2="150" y2="118" stroke="#92400e" strokeWidth="3" />
      {(acid ? [106, 128] : [172, 194]).map((x) => <Particle key={x} x={x} y={89} text={acid ? 'H⁺' : 'OH⁻'} fill="#ffffff" stroke={acid ? '#b91c1c' : '#1d4ed8'} r={7} size={6} />)}
      <Arrow from={acid ? [140, 134] : [160, 134]} to={acid ? [90, 134] : [210, 134]} color={acid ? '#dc2626' : '#2563eb'} width={2} />
      <Label x={150} y={152} anchor="middle" size={8.5} weight="800" color={acid ? '#b91c1c' : '#1d4ed8'}>{acid ? '赤色に変わった部分が陰極側へ広がる' : '青色に変わった部分が陽極側へ広がる'}</Label>
      <Label x={150} y={46} anchor="middle" size={8.5}>{acid ? '塩酸をしみこませた糸' : '水酸化ナトリウム水溶液をしみこませた糸'}</Label>
      <Label x={26} y={134} anchor="middle" size={8.5} weight="800" color="#1d4ed8">陰極</Label>
      <Label x={274} y={134} anchor="middle" size={8.5} weight="800" color="#b91c1c">陽極</Label>
      <Label x={150} y={170} anchor="middle" size={8} color={LINE}>{acid ? '青色リトマス紙' : '赤色リトマス紙'}を、硝酸カリウム水溶液でしめらせたろ紙にのせる</Label>
    </svg>
  )
}

// ── pHの目もり ─────────────────────────────────────────────────────────────
//   { name: 'phScale' }
// pH7が中性。7より小さいほど酸性が強く、7より大きいほどアルカリ性が強い。身近な水溶液のおよそのpHを示す。
function PhScaleDiagram() {
  const colors = ['#dc2626', '#ea580c', '#f97316', '#fb923c', '#facc15', '#fde047', '#bef264', '#4ade80', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#3b82f6', '#6366f1']
  const x = (ph) => 20 + (260 * ph) / 14
  const marks = [[2, 'レモン汁', 22], [7, '食塩水', 22], [9.5, 'せっけん水', 22], [1.5, '胃液', 42], [3, '食酢', 42], [12, '石灰水', 42]]
  return (
    <svg viewBox="0 0 300 132" className="h-auto w-full" role="img" aria-label="pHの目もり" data-subject-diagram="phScale">
      {colors.map((color, i) => <rect key={i} x={x(i)} y="60" width={260 / 14 + 0.5} height="18" fill={color} />)}
      <rect x="20" y="60" width="260" height="18" fill="none" stroke={LINE} strokeWidth="1" />
      {marks.map(([ph, name, y]) => (
        <g key={name}>
          <line x1={x(ph)} y1={y + 3} x2={x(ph)} y2="60" stroke={LINE} strokeWidth="0.8" />
          <Label x={x(ph)} y={y} anchor="middle" size={8.5}>{name}</Label>
        </g>
      ))}
      {[0, 2, 4, 6, 7, 8, 10, 12, 14].map((ph) => <Label key={ph} x={x(ph)} y={92} anchor="middle" size={8.5} weight={ph === 7 ? '800' : '700'} color={LINE}>{ph}</Label>)}
      <Label x={20} y={114} size={8.5} weight="800" color="#b91c1c">← 酸性が強い</Label>
      <Label x={150} y={114} anchor="middle" size={8.5} weight="800" color="#15803d">中性</Label>
      <Label x={280} y={114} anchor="end" size={8.5} weight="800" color="#1d4ed8">アルカリ性が強い →</Label>
      <Label x={150} y={128} anchor="middle" size={8} color={LINE}>身近なもののpHは、およその値</Label>
    </svg>
  )
}

// ── 中和のイオンのモデル ─────────────────────────────────────────────────────
//   { name: 'neutralizationModel' }
// 塩酸（H⁺・Cl⁻）と水酸化ナトリウム水溶液（Na⁺・OH⁻）を混ぜると、H⁺とOH⁻が結びついて水になり、Na⁺とCl⁻が残る（塩化ナトリウム）。
function NeutralizationModelDiagram() {
  const box = (x, w) => <rect x={x} y="36" width={w} height="86" rx="8" fill="#f0f9ff" stroke={LINE} strokeWidth="1" />
  const H = (x, y) => <Particle key={`h${x}-${y}`} x={x} y={y} text="H⁺" fill="#fee2e2" stroke="#dc2626" r={10} size={7} />
  const Cl = (x, y) => <Particle key={`c${x}-${y}`} x={x} y={y} text="Cl⁻" fill="#dcfce7" stroke="#15803d" r={10} size={7} />
  const Na = (x, y) => <Particle key={`n${x}-${y}`} x={x} y={y} text="Na⁺" fill="#ffedd5" stroke="#ea580c" r={10} size={7} />
  const OH = (x, y) => <Particle key={`o${x}-${y}`} x={x} y={y} text="OH⁻" fill="#dbeafe" stroke="#2563eb" r={11} size={6.5} />
  const water = (x, y) => (
    <g key={`w${x}-${y}`}>
      <Atom x={x} y={y - 3} kind="O" r={7} />
      <Atom x={x - 9} y={y + 4} kind="H" r={6} />
      <Atom x={x + 9} y={y + 4} kind="H" r={6} />
    </g>
  )
  return (
    <svg viewBox="0 0 300 168" className="h-auto w-full" role="img" aria-label="中和のイオンのモデル" data-subject-diagram="neutralizationModel">
      {box(6, 80)}
      {[H(28, 60), Cl(64, 60), Cl(28, 98), H(64, 98)]}
      <Label x={96} y={84} anchor="middle" size={13} weight="800" color={LINE}>＋</Label>
      {box(106, 80)}
      {[Na(128, 60), OH(164, 60), OH(128, 98), Na(164, 98)]}
      <Label x={199} y={84} anchor="middle" size={13} weight="800" color="#dc2626">→</Label>
      {box(212, 82)}
      {[Na(232, 56), Cl(272, 56), Cl(232, 86), Na(272, 86)]}
      {[water(236, 112), water(270, 112)]}
      <Label x={46} y={138} anchor="middle" size={8.5} weight="800">塩酸</Label>
      <Label x={146} y={138} anchor="middle" size={8.5} weight="800">水酸化ナトリウム水溶液</Label>
      <Label x={253} y={138} anchor="middle" size={8.5} weight="800">中性（塩と水）</Label>
      <Label x={150} y={20} anchor="middle" size={9} weight="800" color="#b91c1c">H⁺＋OH⁻→H₂O（水ができる）</Label>
      <Label x={150} y={160} anchor="middle" size={8.5} color={LINE}>残ったNa⁺とCl⁻が、塩の塩化ナトリウム</Label>
    </svg>
  )
}

function MotorSymbol({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill="#ffffff" stroke={INK} strokeWidth="1.4" />
      <text x={x} y={y + 4} fontSize="10" fontWeight="800" textAnchor="middle" fill={INK}>M</text>
    </g>
  )
}

// ── 電解質の水溶液と2種類の金属でつくる電池 ─────────────────────────────────────────
//   { name: 'simpleCell' }
function SimpleCellDiagram() {
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="電解質の水溶液と2種類の金属でつくる電池" data-subject-diagram="simpleCell">
      <path d="M109,42 L109,22 L140,22 M160,22 L191,22 L191,42" fill="none" stroke={INK} strokeWidth="1.4" />
      <MotorSymbol x={150} y={22} />
      <Label x={166} y={12} size={8.5} color={LINE}>モーターが回る</Label>
      <rect x="72" y="92" width="156" height="82" fill="#e0f2fe" />
      <path d="M70,66 L70,172 Q70,178 76,178 L224,178 Q230,178 230,172 L230,66" fill="none" stroke={LINE} strokeWidth="1.3" />
      <rect x="104" y="42" width="10" height="118" fill="#cbd5e1" stroke={LINE} strokeWidth="0.8" />
      <rect x="186" y="42" width="10" height="118" fill="#fdba74" stroke="#c2410c" strokeWidth="0.8" />
      <Label x={150} y={140} anchor="middle" size={8.5} color="#0369a1">電解質の水溶液</Label>
      <Label x={150} y={153} anchor="middle" size={8.5} color="#0369a1">（うすい塩酸など）</Label>
      <Label x={109} y={192} anchor="middle" size={8.5} weight="800">亜鉛板（－極）</Label>
      <Label x={191} y={192} anchor="middle" size={8.5} weight="800">銅板（＋極）</Label>
    </svg>
  )
}

// ── 亜鉛と銅イオンの反応 ───────────────────────────────────────────────────
//   { name: 'metalDisplacement' }
// 硫酸銅水溶液に亜鉛板を入れると、亜鉛が亜鉛イオンになってとけ出し、銅イオンが電子を受けとって銅になって付着する。
function MetalDisplacementDiagram() {
  return (
    <svg viewBox="0 0 300 224" className="h-auto w-full" role="img" aria-label="亜鉛と銅イオンの反応" data-subject-diagram="metalDisplacement">
      <rect x="62" y="60" width="176" height="112" fill="#7dd3fc" opacity="0.6" />
      <path d="M60,36 L60,170 Q60,176 66,176 L234,176 Q240,176 240,170 L240,36" fill="none" stroke={LINE} strokeWidth="1.3" />
      <rect x="142" y="20" width="16" height="140" fill="#cbd5e1" stroke={LINE} strokeWidth="0.8" />
      {[70, 88, 106, 124, 142].map((y) => <g key={y}><rect x="136" y={y} width="6" height="10" rx="2" fill="#b45309" /><rect x="158" y={y + 6} width="6" height="10" rx="2" fill="#b45309" /></g>)}
      <Particle x={196} y={84} text="Zn²⁺" fill="#f1f5f9" stroke={LINE} r={12} size={7} />
      <Arrow from={[166, 96]} to={[184, 88]} color={LINE} width={1.4} />
      <Particle x={96} y={136} text="Zn²⁺" fill="#f1f5f9" stroke={LINE} r={12} size={7} />
      <Arrow from={[134, 124]} to={[110, 132]} color={LINE} width={1.4} />
      <Particle x={206} y={140} text="Cu²⁺" fill="#bfdbfe" stroke="#1d4ed8" r={12} size={7} />
      <Arrow from={[192, 136]} to={[168, 128]} color="#1d4ed8" width={1.4} />
      <Particle x={92} y={88} text="Cu²⁺" fill="#bfdbfe" stroke="#1d4ed8" r={12} size={7} />
      <Arrow from={[106, 92]} to={[132, 98]} color="#1d4ed8" width={1.4} />
      <Label x={150} y={14} anchor="middle" size={8.5} weight="800">亜鉛板</Label>
      <Callout from={[138, 146]} to={[96, 164]} text="付着した銅（赤色）" />
      <Label x={150} y={196} anchor="middle" size={8.5}>亜鉛：Zn → Zn²⁺＋電子2個（とけ出す）</Label>
      <Label x={150} y={214} anchor="middle" size={8.5} color="#1d4ed8">銅イオン：Cu²⁺＋電子2個 → Cu（付着する）</Label>
    </svg>
  )
}

// ── ダニエル電池 ────────────────────────────────────────────────────────────
//   { name: 'danielCell', view?: 'membrane' }
// 亜鉛板を硫酸亜鉛水溶液に、銅板を硫酸銅水溶液に入れ、セロハンで仕切る。電子は亜鉛板（－極）から導線を通って銅板（＋極）へ移動する。
// membrane：セロハンを通ってイオンが少しずつ移動するようす（亜鉛イオンは銅板側へ、硫酸イオンは亜鉛板側へ）。
function DanielCellDiagram({ view }) {
  const membrane = view === 'membrane'
  return (
    <svg viewBox="0 0 300 212" className="h-auto w-full" role="img" aria-label="ダニエル電池" data-subject-diagram="danielCell">
      <path d="M86,50 L86,24 L140,24 M160,24 L214,24 L214,50" fill="none" stroke={INK} strokeWidth="1.4" />
      <MotorSymbol x={150} y={24} />
      <Arrow from={[98, 12]} to={[132, 12]} color="#2563eb" />
      <Arrow from={[168, 12]} to={[202, 12]} color="#2563eb" />
      <Label x={94} y={16} anchor="end" size={8.5} weight="800" color="#1d4ed8">電子</Label>
      <rect x="40" y="72" width="110" height="104" fill="#f1f5f9" />
      <rect x="150" y="72" width="110" height="104" fill="#7dd3fc" opacity="0.6" />
      <rect x="40" y="72" width="220" height="104" rx="3" fill="none" stroke={LINE} strokeWidth="1.3" />
      <line x1="150" y1="72" x2="150" y2="176" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5 3" />
      <rect x="80" y="50" width="12" height="116" fill="#cbd5e1" stroke={LINE} strokeWidth="0.8" />
      <rect x="208" y="50" width="12" height="116" fill="#fdba74" stroke="#c2410c" strokeWidth="0.8" />
      <Label x={78} y={44} anchor="end" size={9} weight="800" color="#1d4ed8">－極</Label>
      <Label x={222} y={44} size={9} weight="800" color="#b91c1c">＋極</Label>
      <Label x={150} y={64} anchor="middle" size={8.5} color={LINE}>セロハン</Label>
      <Label x={95} y={170} anchor="middle" size={8} color={LINE}>硫酸亜鉛水溶液</Label>
      <Label x={205} y={170} anchor="middle" size={8} color="#0369a1">硫酸銅水溶液</Label>
      {membrane ? (
        <g>
          <Particle x={124} y={104} text="Zn²⁺" fill="#f1f5f9" stroke={LINE} r={11} size={6.5} />
          <Arrow from={[136, 104]} to={[170, 104]} color={LINE} width={1.6} />
          <Particle x={178} y={140} text="SO₄²⁻" fill="#fef3c7" stroke="#b45309" r={13} size={6} />
          <Arrow from={[164, 140]} to={[130, 140]} color="#b45309" width={1.6} />
          <Label x={150} y={196} anchor="middle" size={8.5}>イオンがセロハンを少しずつ通りぬけ、電気のかたよりを防ぐ</Label>
        </g>
      ) : (
        <g>
          <Label x={95} y={196} anchor="middle" size={8}>Zn → Zn²⁺＋電子2個</Label>
          <Label x={205} y={196} anchor="middle" size={8} color="#1d4ed8">Cu²⁺＋電子2個 → Cu</Label>
          <Label x={95} y={209} anchor="middle" size={8} color={LINE}>（亜鉛がとけ出す）</Label>
          <Label x={205} y={209} anchor="middle" size={8} color={LINE}>（銅が付着する）</Label>
        </g>
      )}
    </svg>
  )
}

// ── タマネギの根の成長 ─────────────────────────────────────────────────────
//   { name: 'rootTip' }
// 根の先端に近いA・中ほどB・もとに近いCの細胞を顕微鏡で見たようす。先端近くでは小さい細胞が分裂し、もとに近いほど細胞が大きい。
function RootTipDiagram() {
  const cellsBox = (y, w, h, rows, cols, dividing) => (
    <g>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols)
        const c = i % cols
        const x = 112 + c * w
        const yy = y + 4 + r * h
        return (
          <g key={i}>
            <rect x={x} y={yy} width={w} height={h} fill="#fef9c3" stroke="#a16207" strokeWidth="0.7" />
            {dividing.includes(i)
              ? <g>{[-2, 0, 2].map((d) => <line key={d} x1={x + w / 2 + d} y1={yy + h / 2 - 3} x2={x + w / 2 + d} y2={yy + h / 2 + 3} stroke="#b91c1c" strokeWidth="1" />)}</g>
              : <circle cx={x + w / 2} cy={yy + h / 2} r={Math.min(w, h) * 0.18} fill="#f87171" />}
          </g>
        )
      })}
    </g>
  )
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="タマネギの根の成長" data-subject-diagram="rootTip">
      <path d="M44,6 L44,176 Q44,200 58,200 Q72,200 72,176 L72,6" fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />
      {[['C', 40], ['B', 108], ['A', 176]].map(([name, y]) => (
        <g key={name}>
          <line x1="44" y1={y} x2="72" y2={y} stroke="#b91c1c" strokeWidth="1.4" />
          <Label x={38} y={y + 4} anchor="end" size={10} weight="800" color="#b91c1c">{name}</Label>
          <line x1="74" y1={y} x2="108" y2={y} stroke={LINE} strokeWidth="0.7" strokeDasharray="3 2" />
        </g>
      ))}
      {cellsBox(14, 12, 50, 1, 7, [])}
      <Label x={206} y={32} size={8.5}>細長い大きな細胞</Label>
      <Label x={206} y={46} size={8.5} color={LINE}>（大きくなった）</Label>
      {cellsBox(88, 12, 18, 2, 7, [])}
      <Label x={206} y={106} size={8.5}>やや大きい細胞</Label>
      {cellsBox(152, 10, 10, 4, 8, [3, 12, 21])}
      <Label x={206} y={170} size={8.5}>小さい細胞が多い</Label>
      <Label x={206} y={184} size={8.5} color="#b91c1c">分裂中の細胞がある</Label>
    </svg>
  )
}

// ── 体細胞分裂の順序（植物の細胞） ───────────────────────────────────────────────
//   { name: 'mitosisSteps' }
function MitosisStepsDiagram() {
  const chromosome = (x, y, color = '#b91c1c') => <rect x={x - 1.6} y={y - 5} width="3.2" height="10" rx="1.4" fill={color} />
  const steps = [
    ['① 核の中に、ひものような染色体が見えるようになる', (y) => <g><circle cx="44" cy={y + 18} r="13" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.8" />{[[38, 14], [46, 12], [42, 22], [50, 22]].map(([x, dy]) => <path key={`${x}-${dy}`} d={`M${x},${y + dy} q2,3 0,6`} fill="none" stroke="#b91c1c" strokeWidth="1.6" />)}</g>],
    ['② 染色体が、細胞の中央に並ぶ', (y) => <g>{[8, 14, 20, 26].map((dy) => <g key={dy}>{chromosome(42, y + dy + 1)}{chromosome(46, y + dy + 1)}</g>)}</g>],
    ['③ 染色体が分かれて、細胞の両端に移動する', (y) => <g>{[10, 18, 26].map((dy) => <g key={dy}>{chromosome(22, y + dy)}{chromosome(66, y + dy)}</g>)}<path d={`M34,${y + 18} L28,${y + 18} M54,${y + 18} L60,${y + 18}`} stroke={LINE} strokeWidth="1" /></g>],
    ['④ 2つの核ができ、中央に仕切りができる', (y) => <g><circle cx="28" cy={y + 18} r="9" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.8" /><circle cx="60" cy={y + 18} r="9" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.8" /><line x1="44" y1={y + 2} x2="44" y2={y + 34} stroke="#a16207" strokeWidth="1.6" /></g>],
    ['⑤ 2個の細胞になる（染色体の数はもとと同じ）', null],
  ]
  return (
    <svg viewBox="0 0 300 250" className="h-auto w-full" role="img" aria-label="体細胞分裂の順序" data-subject-diagram="mitosisSteps">
      {steps.map(([text, draw], index) => {
        const y = 8 + index * 48
        return (
          <g key={text}>
            {draw ? (
              <g>
                <rect x="12" y={y} width="64" height="36" rx="6" fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
                {draw(y)}
              </g>
            ) : (
              <g>
                <rect x="10" y={y} width="32" height="36" rx="5" fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
                <rect x="46" y={y} width="32" height="36" rx="5" fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
                <circle cx="26" cy={y + 18} r="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.8" />
                <circle cx="62" cy={y + 18} r="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.8" />
              </g>
            )}
            <Label x={88} y={y + 22} size={8.5}>{text}</Label>
          </g>
        )
      })}
    </svg>
  )
}

// ── 染色体の受けつがれ方 ───────────────────────────────────────────────────
//   { name: 'chromosomeInheritance', mode: 'sexual' | 'asexual' }
// sexual：両親の体細胞（染色体2本）→ 減数分裂で精子・卵（1本）→ 受精卵（2本。父と母から1本ずつ）。
// asexual：体細胞分裂でふえた子は、親とまったく同じ染色体をもつ。
function ChromosomeInheritanceDiagram({ mode = 'sexual' }) {
  const bar = (x, y, color) => <rect x={x - 3} y={y - 11} width="6" height="22" rx="2.6" fill={color} />
  const cell = (x, y, r, colors, fill = '#fef9c3') => (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke="#a16207" strokeWidth="1" />
      {colors.map((color, i) => <g key={i}>{bar(x + (i - (colors.length - 1) / 2) * 10, y, color)}</g>)}
    </g>
  )
  if (mode === 'asexual') {
    return (
      <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="無性生殖での染色体の受けつがれ方" data-subject-diagram="chromosomeInheritance">
        {cell(150, 44, 24, ['#15803d', '#86efac'])}
        <Label x={150} y={84} anchor="middle" size={8.5}>親の細胞</Label>
        <Arrow from={[136, 92]} to={[92, 124]} color={LINE} />
        <Arrow from={[164, 92]} to={[208, 124]} color={LINE} />
        <Label x={150} y={118} anchor="middle" size={8.5} weight="800" color={LINE}>体細胞分裂</Label>
        {cell(80, 150, 24, ['#15803d', '#86efac'])}
        {cell(220, 150, 24, ['#15803d', '#86efac'])}
        <Label x={150} y={194} anchor="middle" size={8.5} color="#15803d">子は、親とまったく同じ染色体（同じ形質）</Label>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="有性生殖での染色体の受けつがれ方" data-subject-diagram="chromosomeInheritance">
      {cell(70, 40, 24, ['#1d4ed8', '#93c5fd'])}
      {cell(230, 40, 24, ['#dc2626', '#fca5a5'])}
      <Label x={70} y={80} anchor="middle" size={8.5}>雄の体細胞</Label>
      <Label x={230} y={80} anchor="middle" size={8.5}>雌の体細胞</Label>
      <Arrow from={[70, 86]} to={[70, 108]} color={LINE} />
      <Arrow from={[230, 86]} to={[230, 104]} color={LINE} />
      <Label x={150} y={100} anchor="middle" size={8.5} weight="800" color={LINE}>減数分裂（数が半分に）</Label>
      {cell(70, 126, 15, ['#1d4ed8'])}
      {cell(230, 126, 19, ['#dc2626'])}
      <Label x={96} y={130} size={8.5}>精子</Label>
      <Label x={204} y={130} anchor="end" size={8.5}>卵</Label>
      <Arrow from={[82, 142]} to={[126, 172]} color={LINE} />
      <Arrow from={[216, 144]} to={[174, 172]} color={LINE} />
      <Label x={150} y={158} anchor="middle" size={8.5} weight="800" color={LINE}>受精</Label>
      {cell(150, 196, 24, ['#1d4ed8', '#dc2626'])}
      <Label x={196} y={200} size={8.5}>受精卵</Label>
      <Label x={150} y={232} anchor="middle" size={8.5} color={LINE}>子は、両方の親から半分ずつ染色体を受けつぐ</Label>
    </svg>
  )
}

// ── 被子植物の受精（花粉管） ──────────────────────────────────────────────────
//   { name: 'pollenTube' }
// 花粉が柱頭につくと、花粉管が胚珠に向かってのびる。花粉管の中を精細胞が移動し、胚珠の中の卵細胞と受精する。
function PollenTubeDiagram() {
  return (
    <svg viewBox="0 0 300 226" className="h-auto w-full" role="img" aria-label="被子植物の受精" data-subject-diagram="pollenTube">
      <ellipse cx="150" cy="30" rx="26" ry="8" fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
      <path d="M142,36 L142,132 L158,132 L158,36" fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
      <ellipse cx="150" cy="170" rx="52" ry="42" fill="#dcfce7" stroke="#15803d" strokeWidth="1.2" />
      <rect x="143" y="126" width="14" height="12" fill="#fef9c3" />
      <ellipse cx="150" cy="176" rx="17" ry="24" fill="#fef3c7" stroke="#a16207" strokeWidth="1" />
      <circle cx="150" cy="188" r="5" fill="#b91c1c" />
      <circle cx="160" cy="22" r="7" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <path d="M158,28 Q155,90 151,152" fill="none" stroke="#ca8a04" strokeWidth="1.8" />
      <circle cx="153.4" cy="128" r="2.4" fill="#2563eb" />
      <circle cx="152.8" cy="138" r="2.4" fill="#2563eb" />
      <Callout from={[166, 20]} to={[206, 12]} text="花粉" />
      <Callout from={[128, 30]} to={[96, 22]} text="柱頭" />
      <Callout from={[156, 80]} to={[204, 66]} text="花粉管" />
      <Callout from={[155, 134]} to={[208, 112]} text="精細胞" />
      <Callout from={[166, 170]} to={[222, 176]} text="胚珠" />
      <Callout from={[146, 190]} to={[92, 206]} text="卵細胞" />
      <Callout from={[100, 162]} to={[72, 146]} text="子房" />
    </svg>
  )
}

function PeaSeed({ x, y, wrinkled = false, r = 11 }) {
  if (!wrinkled) return <circle cx={x} cy={y} r={r} fill="#fde68a" stroke="#a16207" strokeWidth="1.2" />
  const points = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * 2 * Math.PI
    const rr = i % 2 ? r * 0.82 : r
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`
  })
  return <path d={`M${points.join(' L')} Z`} fill="#fde68a" stroke="#a16207" strokeWidth="1.2" />
}
function GeneBall({ x, y, letter }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill="#ffffff" stroke={letter === 'A' ? '#b45309' : '#15803d'} strokeWidth="1.4" />
      <text x={x} y={y + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill={letter === 'A' ? '#b45309' : '#15803d'}>{letter}</text>
    </g>
  )
}

// ── 純系どうしのかけ合わせ（分離の法則） ────────────────────────────────────────────
//   { name: 'geneCross' }
// 丸の純系（AA）としわの純系（aa）。減数分裂で対の遺伝子が分かれ、生殖細胞はAとaだけをもつ。受精した子はすべてAaで丸。
function GeneCrossDiagram() {
  return (
    <svg viewBox="0 0 300 240" className="h-auto w-full" role="img" aria-label="純系どうしのかけ合わせ" data-subject-diagram="geneCross">
      <PeaSeed x={70} y={34} />
      <PeaSeed x={230} y={34} wrinkled />
      <Label x={70} y={64} anchor="middle" size={9} weight="800">丸の純系（AA）</Label>
      <Label x={230} y={64} anchor="middle" size={9} weight="800">しわの純系（aa）</Label>
      <Label x={150} y={40} anchor="middle" size={14} weight="800" color={LINE}>×</Label>
      <Arrow from={[70, 72]} to={[70, 100]} color={LINE} />
      <Arrow from={[230, 72]} to={[230, 100]} color={LINE} />
      <Label x={150} y={90} anchor="middle" size={8.5} color={LINE}>減数分裂（対の遺伝子が分かれる）</Label>
      <GeneBall x={56} y={118} letter="A" />
      <GeneBall x={84} y={118} letter="A" />
      <GeneBall x={216} y={118} letter="a" />
      <GeneBall x={244} y={118} letter="a" />
      <Label x={70} y={146} anchor="middle" size={8.5} color={LINE}>生殖細胞はAだけ</Label>
      <Label x={230} y={146} anchor="middle" size={8.5} color={LINE}>生殖細胞はaだけ</Label>
      <Arrow from={[86, 152]} to={[134, 184]} color={LINE} />
      <Arrow from={[214, 152]} to={[166, 184]} color={LINE} />
      <Label x={150} y={170} anchor="middle" size={8.5} weight="800" color={LINE}>受精</Label>
      <PeaSeed x={150} y={200} />
      <Label x={172} y={204} size={9} weight="800">子：すべてAaで丸</Label>
      <Label x={150} y={232} anchor="middle" size={8.5} color={LINE}>Aがあると、顕性形質の丸が現れる</Label>
    </svg>
  )
}

// ── 子どうしのかけ合わせ（孫の代） ──────────────────────────────────────────────
//   { name: 'punnettSquare' }
// 子（Aa）の生殖細胞はAとaが1：1。組み合わせると、孫は AA：Aa：aa＝1：2：1、丸：しわ＝3：1。
function PunnettSquareDiagram() {
  const cells = [
    [0, 0, 'AA', false], [1, 0, 'Aa', false],
    [0, 1, 'Aa', false], [1, 1, 'aa', true],
  ]
  return (
    <svg viewBox="0 0 300 250" className="h-auto w-full" role="img" aria-label="子どうしのかけ合わせ" data-subject-diagram="punnettSquare">
      <Label x={160} y={14} anchor="middle" size={8.5} color={LINE}>一方の子（Aa）の生殖細胞</Label>
      <GeneBall x={125} y={34} letter="A" />
      <GeneBall x={195} y={34} letter="a" />
      <text x="42" y="120" fontSize="8.5" fontWeight="700" fill={LINE} textAnchor="middle" style={{ writingMode: 'vertical-rl' }}>もう一方の子（Aa）の生殖細胞</text>
      <GeneBall x={72} y={85} letter="A" />
      <GeneBall x={72} y={155} letter="a" />
      {cells.map(([c, r, gene, wrinkled]) => (
        <g key={`${c}-${r}`}>
          <rect x={90 + c * 70} y={50 + r * 70} width="70" height="70" fill={wrinkled ? '#dcfce7' : '#fef9c3'} stroke={LINE} strokeWidth="1" />
          <PeaSeed x={125 + c * 70} y={76 + r * 70} wrinkled={wrinkled} />
          <Label x={125 + c * 70} y={108 + r * 70} anchor="middle" size={10} weight="800">{gene}</Label>
        </g>
      ))}
      <Label x={160} y={214} anchor="middle" size={9.5} weight="800">AA：Aa：aa＝1：2：1</Label>
      <Label x={160} y={234} anchor="middle" size={9.5} weight="800" color="#b45309">丸：しわ＝3：1</Label>
    </svg>
  )
}

// ── 相同器官（前あしの骨格） ────────────────────────────────────────────────────
//   { name: 'homologousLimbs' }
// ヒトの腕・クジラの胸びれ・コウモリの翼。形やはたらきはちがうが、上腕の骨（赤）・前腕の骨（青）・手の骨（黄）の並び方が共通。
function HomologousLimbsDiagram() {
  const UPPER = '#dc2626'
  const FORE = '#2563eb'
  const HAND = '#ca8a04'
  const bone = (x1, y1, x2, y2, color, w = 5) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="相同器官" data-subject-diagram="homologousLimbs">
      {[[UPPER, '上腕の骨', 20], [FORE, '前腕の骨', 116], [HAND, '手の骨', 212]].map(([color, name, x]) => (
        <g key={name}>
          <line x1={x} y1="12" x2={x + 16} y2="12" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <Label x={x + 22} y={16} size={8.5}>{name}</Label>
        </g>
      ))}
      {bone(50, 34, 50, 84, UPPER, 6)}
      {bone(45, 90, 43, 130, FORE)}
      {bone(55, 90, 57, 130, FORE)}
      {[[40, 138], [47, 136], [54, 136], [61, 138]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill={HAND} />)}
      {[[-14, 164], [-7, 172], [0, 174], [7, 172], [14, 164]].map(([dx, y]) => <g key={dx}>{bone(50 + dx * 0.4, 144, 50 + dx, y, HAND, 2.6)}</g>)}

      <path d="M130,40 Q124,90 132,140 Q142,184 150,186 Q160,184 168,140 Q176,90 170,40 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      {bone(150, 44, 150, 66, UPPER, 7)}
      {bone(145, 72, 145, 90, FORE)}
      {bone(155, 72, 155, 90, FORE)}
      {[-12, -6, 0, 6, 12].map((dx) => <g key={dx}>{bone(150 + dx * 0.5, 98, 150 + dx, 172 - Math.abs(dx) * 2, HAND, 2.6)}</g>)}

      <path d="M236,72 L270,122 L296,172 L282,178 L266,184 L250,178 L226,150 Z" fill="#e5e7eb" stroke="#94a3b8" strokeWidth="0.8" />
      {bone(226, 40, 238, 74, UPPER, 6)}
      {bone(240, 80, 264, 122, FORE, 4)}
      {[[294, 170], [282, 178], [266, 184], [250, 178]].map(([x, y]) => <g key={x}>{bone(268, 126, x, y, HAND, 2.2)}</g>)}

      <Label x={50} y={200} anchor="middle" size={9} weight="800">ヒトの腕</Label>
      <Label x={150} y={200} anchor="middle" size={9} weight="800">クジラの胸びれ</Label>
      <Label x={256} y={200} anchor="middle" size={9} weight="800">コウモリの翼</Label>
    </svg>
  )
}

// ── 記録タイマーのテープ ────────────────────────────────────────────────────
//   { name: 'tickerTape' }
// 上：だんだん速くなる運動のテープ。5打点ごと（1秒間に50回打点するとき0.1秒）の長さが長くなる。
// 下：テープを0.1秒ごとに切って順に並べたもの。長さのふえ方が一定なら、速さは一定の割合でふえている。
function TickerTapeDiagram() {
  const groups = [18, 42, 66, 90]
  let x = 24
  const dots = [x]
  const bounds = [x]
  groups.forEach((length) => {
    for (let i = 1; i <= 5; i += 1) dots.push(x + (length * i) / 5)
    x += length
    bounds.push(x)
  })
  return (
    <svg viewBox="0 0 300 204" className="h-auto w-full" role="img" aria-label="記録タイマーのテープ" data-subject-diagram="tickerTape">
      <Label x={150} y={12} anchor="middle" size={8.5} color={LINE}>打点の間隔が広いほど、速さが速い</Label>
      <rect x="12" y="20" width="276" height="20" fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
      {dots.map((dx, i) => <circle key={i} cx={dx} cy="30" r="1.8" fill={INK} />)}
      {bounds.map((bx) => <line key={bx} x1={bx} y1="18" x2={bx} y2="42" stroke="#dc2626" strokeWidth="1" />)}
      {groups.map((length, i) => (
        <g key={i}>
          <path d={`M${bounds[i] + 1},46 L${bounds[i] + 1},50 L${bounds[i + 1] - 1},50 L${bounds[i + 1] - 1},46`} fill="none" stroke={LINE} strokeWidth="0.8" />
          <Label x={(bounds[i] + bounds[i + 1]) / 2} y={62} anchor="middle" size={8}>0.1秒</Label>
        </g>
      ))}
      <line x1="40" y1="186" x2="200" y2="186" stroke={DARK} strokeWidth="1" />
      {groups.map((length, i) => (
        <g key={`c${i}`}>
          <rect x={52 + i * 34} y={186 - length} width="24" height={length} fill="#fef9c3" stroke="#a16207" strokeWidth="1" />
          {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={64 + i * 34} cy={186 - (length * k) / 5 - length / 10} r="1.6" fill={INK} />)}
          <Label x={64 + i * 34} y={198} anchor="middle" size={8}>{`${i + 1}本目`}</Label>
        </g>
      ))}
      <Label x={206} y={124} size={8.5}>0.1秒ごとに切って</Label>
      <Label x={206} y={138} size={8.5}>順に並べたもの</Label>
      <Label x={206} y={158} size={8.5} color="#b91c1c">長さ＝0.1秒間に</Label>
      <Label x={206} y={172} size={8.5} color="#b91c1c">進んだ距離</Label>
    </svg>
  )
}

// ── 斜面上の物体にはたらく重力の分解 ───────────────────────────────────────────
//   { name: 'slopeForces', angle?: 30 }
// 重力を、斜面に平行な分力（運動の向き）と斜面に垂直な分力に分解する。点線は平行四辺形の残りの2辺。
function SlopeForcesDiagram({ angle = 30 }) {
  const t = (angle * Math.PI) / 180
  const base = Math.min(260, 150 / Math.tan(t))
  const left = 280 - base
  const top = 180 - base * Math.tan(t)
  const u = [-Math.cos(t), Math.sin(t)]
  const nIn = [Math.sin(t), Math.cos(t)]
  const along = 0.42 * Math.hypot(base, 180 - top)
  const P = [280 + u[0] * along, top + u[1] * along]
  const C = [P[0] - nIn[0] * 12, P[1] - nIn[1] * 12]
  const g = 64
  const G = [C[0], C[1] + g]
  const par = [C[0] + u[0] * g * Math.sin(t), C[1] + u[1] * g * Math.sin(t)]
  const per = [C[0] + nIn[0] * g * Math.cos(t), C[1] + nIn[1] * g * Math.cos(t)]
  const f = (v) => v.toFixed(1)
  const viewTop = Math.max(0, Math.floor(Math.min(top, C[1] - 30) - 12))
  const perRight = per[0] + 6 + 70 <= 298
  return (
    <svg viewBox={`0 ${viewTop} 300 ${200 - viewTop}`} className="h-auto w-full" role="img" aria-label="斜面上の物体にはたらく重力の分解" data-subject-diagram="slopeForces">
      <path d={`M${f(left)},180 L280,180 L280,${f(top)} Z`} fill="#e7e5e4" stroke="#78716c" strokeWidth="1.2" />
      <g transform={`translate(${f(C[0])} ${f(C[1])}) rotate(${-angle})`}>
        <rect x="-18" y="-10" width="36" height="16" rx="3" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1" />
        <circle cx="-10" cy="8" r="4" fill="#475569" />
        <circle cx="10" cy="8" r="4" fill="#475569" />
      </g>
      <line x1={f(par[0])} y1={f(par[1])} x2={f(G[0])} y2={f(G[1])} stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <line x1={f(per[0])} y1={f(per[1])} x2={f(G[0])} y2={f(G[1])} stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <Arrow from={C} to={G} color="#dc2626" width={2.4} />
      <Arrow from={C} to={par} color="#2563eb" width={2.2} />
      <Arrow from={C} to={per} color="#15803d" width={2.2} />
      <Label x={G[0] + 6} y={G[1] + 10} size={9} weight="800" color="#b91c1c">重力</Label>
      <Label x={par[0] - 6} y={par[1] - 4} anchor="end" size={8.5} weight="800" color="#1d4ed8">斜面に平行な分力</Label>
      <Label x={perRight ? per[0] + 6 : per[0]} y={perRight ? per[1] + 2 : per[1] + 16} anchor={perRight ? 'start' : 'middle'} size={8.5} weight="800" color="#15803d">斜面に垂直な分力</Label>
      <Label x={left + 34} y={174} size={8.5} color={LINE}>{`傾き${angle}°`}</Label>
    </svg>
  )
}

// ── 力の合成 ──────────────────────────────────────────────────────────────
//   { name: 'forceComposition' }
// a：同じ向きの2力の合力は和。b：反対向きの2力の合力は差で、大きいほうの向き。c：角度をもつ2力の合力は、平行四辺形の対角線。
function ForceCompositionDiagram() {
  const RED = '#dc2626'
  const BLUE = '#2563eb'
  const SUM = '#7c3aed'
  const scale = 20
  return (
    <svg viewBox="0 0 300 226" className="h-auto w-full" role="img" aria-label="力の合成" data-subject-diagram="forceComposition">
      <Label x={8} y={16} size={9} weight="800">a 同じ向きの2力</Label>
      <circle cx="60" cy="36" r="3" fill={INK} />
      <Arrow from={[60, 32]} to={[60 + 3 * scale, 32]} color={RED} width={2.2} />
      <Arrow from={[60, 42]} to={[60 + 2 * scale, 42]} color={BLUE} width={2.2} />
      <Arrow from={[60, 58]} to={[60 + 5 * scale, 58]} color={SUM} width={3} />
      <Label x={126} y={30} size={8.5} weight="800" color={RED}>3N</Label>
      <Label x={106} y={46} size={8.5} weight="800" color={BLUE}>2N</Label>
      <Label x={166} y={62} size={8.5} weight="800" color={SUM}>合力 3＋2＝5N</Label>

      <Label x={8} y={90} size={9} weight="800">b 反対向きの2力</Label>
      <circle cx="80" cy="110" r="3" fill={INK} />
      <Arrow from={[80, 106]} to={[80 + 5 * scale, 106]} color={RED} width={2.2} />
      <Arrow from={[80, 116]} to={[80 - 2 * scale, 116]} color={BLUE} width={2.2} />
      <Arrow from={[80, 132]} to={[80 + 3 * scale, 132]} color={SUM} width={3} />
      <Label x={186} y={110} size={8.5} weight="800" color={RED}>5N</Label>
      <Label x={20} y={120} anchor="end" size={8.5} weight="800" color={BLUE}>2N</Label>
      <Label x={146} y={136} size={8.5} weight="800" color={SUM}>合力 5－2＝3N</Label>

      <Label x={8} y={160} size={9} weight="800">c 角度をもつ2力</Label>
      <line x1="160" y1="212" x2="200" y2="170" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="100" y1="170" x2="200" y2="170" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="60" cy="212" r="3" fill={INK} />
      <Arrow from={[60, 212]} to={[160, 212]} color={RED} width={2.2} />
      <Arrow from={[60, 212]} to={[100, 170]} color={BLUE} width={2.2} />
      <Arrow from={[60, 212]} to={[200, 170]} color={SUM} width={3} />
      <Label x={206} y={170} size={8.5} weight="800" color={SUM}>合力</Label>
      <Label x={206} y={184} size={8} color={LINE}>（平行四辺形の対角線）</Label>
    </svg>
  )
}

// ── 作用・反作用 ────────────────────────────────────────────────────────────
//   { name: 'actionReaction' }
// スケートボードに乗ったAがBをおすと、同時にBもAを、同じ大きさで逆向きにおし返す。2人とも動く。
function ActionReactionDiagram() {
  const person = (x, color, name) => (
    <g>
      <rect x={x} y="54" width="70" height="60" rx="10" fill={color} stroke={LINE} strokeWidth="1" />
      <text x={x + 35} y={90} fontSize="14" fontWeight="800" textAnchor="middle" fill={INK}>{name}</text>
      <line x1={x + 6} y1="120" x2={x + 64} y2="120" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
      <circle cx={x + 16} cy="127" r="4" fill={DARK} />
      <circle cx={x + 54} cy="127" r="4" fill={DARK} />
    </g>
  )
  return (
    <svg viewBox="0 0 300 180" className="h-auto w-full" role="img" aria-label="作用・反作用" data-subject-diagram="actionReaction">
      {person(70, '#dbeafe', 'A')}
      {person(140, '#fee2e2', 'B')}
      <Arrow from={[140, 74]} to={[196, 74]} color="#dc2626" width={2.6} />
      <Arrow from={[140, 96]} to={[84, 96]} color="#2563eb" width={2.6} />
      <line x1="140" y1="54" x2="140" y2="114" stroke={INK} strokeWidth="1" />
      <Label x={196} y={150} anchor="middle" size={8.5} weight="800" color="#b91c1c">作用：AがBをおす力</Label>
      <Label x={100} y={150} anchor="middle" size={8.5} weight="800" color="#1d4ed8">反作用：BがAをおす力</Label>
      <Label x={150} y={172} anchor="middle" size={8.5} color={LINE}>2つの物体の間で、同じ大きさ・逆向きに同時にはたらく</Label>
      <Label x={150} y={30} anchor="middle" size={8.5} color={LINE}>AがBをおすと、AもBも動く</Label>
    </svg>
  )
}

// ── 水圧 ─────────────────────────────────────────────────────────────────
//   { name: 'waterPressure' }
// 左：深い穴ほど水が勢いよく出る。右：水中の物体には、あらゆる面に垂直に水圧がはたらき、深い下面ほど大きい。
function WaterPressureDiagram() {
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="水圧" data-subject-diagram="waterPressure">
      <rect x="22" y="44" width="96" height="136" fill={WATER} opacity="0.8" />
      <path d="M20,30 L20,180 L120,180 L120,30" fill="none" stroke={LINE} strokeWidth="1.4" />
      {[[70, 'M120,70 Q134,70 146,180'], [110, 'M120,110 Q146,110 164,180'], [150, 'M120,150 Q158,150 184,180']].map(([y, d]) => (
        <g key={y}>
          <circle cx="120" cy={y} r="2.4" fill="#ffffff" stroke={LINE} strokeWidth="0.8" />
          <path d={d} fill="none" stroke="#0284c7" strokeWidth="2.2" />
        </g>
      ))}
      <line x1="8" y1="180" x2="192" y2="180" stroke={DARK} strokeWidth="1.2" />
      <Label x={70} y={200} anchor="middle" size={8.5} color={LINE}>深い穴ほど勢いよく出る</Label>

      <rect x="202" y="44" width="90" height="136" fill={WATER} opacity="0.8" />
      <path d="M200,30 L200,180 L294,180 L294,30" fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x="231" y="96" width="32" height="32" fill="#fde68a" stroke="#a16207" strokeWidth="1" />
      {[237, 247, 257].map((x) => <Arrow key={`t${x}`} from={[x, 82]} to={[x, 94]} color="#dc2626" width={1.6} />)}
      {[237, 247, 257].map((x) => <Arrow key={`b${x}`} from={[x, 152]} to={[x, 130]} color="#dc2626" width={2.2} />)}
      {[[104, 13], [120, 17]].map(([y, len]) => (
        <g key={y}>
          <Arrow from={[229 - len, y]} to={[229, y]} color="#dc2626" width={1.6} />
          <Arrow from={[265 + len, y]} to={[265, y]} color="#dc2626" width={1.6} />
        </g>
      ))}
      <Label x={247} y={200} anchor="middle" size={8.5} color={LINE}>下面の水圧＞上面の水圧</Label>
    </svg>
  )
}

// ── 浮力の大きさの求め方 ─────────────────────────────────────────────────────
//   { name: 'springBuoyancy' }
// 空気中で1.5Nを示した物体を水中に全部しずめると、ばねばかりは1.0Nを示す。浮力は 1.5－1.0＝0.5N。
function SpringBuoyancyDiagram() {
  const scale = (x, reading) => (
    <g>
      <rect x={x - 10} y="8" width="20" height="46" rx="3" fill="#f1f5f9" stroke={LINE} strokeWidth="1" />
      {[16, 24, 32, 40, 48].map((y) => <line key={y} x1={x - 6} y1={y} x2={x - 1} y2={y} stroke={LINE} strokeWidth="0.8" />)}
      <line x1={x} y1="54" x2={x} y2="84" stroke={DARK} strokeWidth="1.4" />
      <Label x={x + 16} y={34} size={10} weight="800" color="#b91c1c">{reading}</Label>
    </g>
  )
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="浮力の大きさの求め方" data-subject-diagram="springBuoyancy">
      {scale(80, '1.5N')}
      <rect x="64" y="84" width="32" height="32" fill="#fde68a" stroke="#a16207" strokeWidth="1" />
      <Label x={80} y={140} anchor="middle" size={9} weight="800">空気中</Label>
      {scale(220, '1.0N')}
      <rect x="180" y="100" width="80" height="80" fill={WATER} opacity="0.8" />
      <path d="M178,92 L178,182 L262,182 L262,92" fill="none" stroke={LINE} strokeWidth="1.3" />
      <rect x="204" y="124" width="32" height="32" fill="#fde68a" stroke="#a16207" strokeWidth="1" />
      <Arrow from={[220, 168]} to={[220, 146]} color="#2563eb" width={2.4} />
      <Label x={244} y={174} size={8.5} weight="800" color="#1d4ed8">浮力</Label>
      <Label x={220} y={200} anchor="middle" size={9} weight="800">水中</Label>
      <Label x={150} y={210} anchor="middle" size={9} weight="800" color="#1d4ed8">浮力＝1.5－1.0＝0.5N</Label>
    </svg>
  )
}

// ── ふりこのエネルギーの移り変わり ──────────────────────────────────────────────
//   { name: 'pendulumEnergy' }
// A・Cはいちばん高い点（位置エネルギーが最大）、Bはいちばん低い点（運動エネルギーが最大）。2つの和（力学的エネルギー）は一定。
function PendulumEnergyDiagram() {
  const pivot = [150, 14]
  const len = 90
  const bob = (deg) => [pivot[0] + len * Math.sin((deg * Math.PI) / 180), pivot[1] + len * Math.cos((deg * Math.PI) / 180)]
  const points = [['A', -40, 1, 0], ['B', 0, 0, 1], ['C', 40, 1, 0]]
  const POS = '#2563eb'
  const KIN = '#dc2626'
  return (
    <svg viewBox="0 0 300 224" className="h-auto w-full" role="img" aria-label="ふりこのエネルギーの移り変わり" data-subject-diagram="pendulumEnergy">
      <line x1="120" y1={pivot[1]} x2="180" y2={pivot[1]} stroke={DARK} strokeWidth="2" />
      <path d={`M${bob(-40).map((v) => v.toFixed(1)).join(',')} A${len},${len} 0 0,0 ${bob(40).map((v) => v.toFixed(1)).join(',')}`} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="40" y1="104" x2="260" y2="104" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="4 3" />
      <Label x={262} y={108} size={8} color={LINE}>基準面</Label>
      {points.map(([name, deg]) => {
        const [x, y] = bob(deg)
        return (
          <g key={name}>
            <line x1={pivot[0]} y1={pivot[1]} x2={x} y2={y} stroke={deg === 0 ? INK : '#94a3b8'} strokeWidth="1.2" />
            <circle cx={x} cy={y} r="8" fill={deg === 0 ? '#fde68a' : '#fef3c7'} stroke="#a16207" strokeWidth="1" />
            <Label x={deg < 0 ? x - 12 : x + 12} y={y + 4} anchor={deg < 0 ? 'end' : 'start'} size={9} weight="800">{name}</Label>
          </g>
        )
      })}
      <line x1="60" y1="190" x2="240" y2="190" stroke={DARK} strokeWidth="1" />
      <line x1="60" y1="140" x2="240" y2="140" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 3" />
      <Label x={240} y={134} anchor="end" size={8} color="#7c3aed">和はいつも同じ（力学的エネルギー）</Label>
      {points.map(([name, deg, pos, kin]) => {
        const [x] = bob(deg)
        return (
          <g key={`bar-${name}`}>
            <rect x={x - 14} y={190 - pos * 50} width="12" height={pos * 50} fill={POS} />
            <rect x={x + 2} y={190 - kin * 50} width="12" height={kin * 50} fill={KIN} />
            <Label x={x} y={202} anchor="middle" size={9} weight="800">{name}</Label>
          </g>
        )
      })}
      <rect x="62" y="210" width="10" height="8" fill={POS} />
      <Label x={76} y={217} size={8.5}>位置エネルギー</Label>
      <rect x="170" y="210" width="10" height="8" fill={KIN} />
      <Label x={184} y={217} size={8.5}>運動エネルギー</Label>
    </svg>
  )
}

// ── 動滑車と仕事の原理 ──────────────────────────────────────────────────────
//   { name: 'movablePulley' }
// 重さ20Nの物体を動滑車で1m上げる。ひもを引く力は半分の10Nになるが、引く距離は2倍の2m。仕事はどちらも20J。
function MovablePulleyDiagram() {
  return (
    <svg viewBox="0 0 300 210" className="h-auto w-full" role="img" aria-label="動滑車と仕事の原理" data-subject-diagram="movablePulley">
      <line x1="70" y1="14" x2="170" y2="14" stroke={DARK} strokeWidth="2.4" />
      {[76, 88, 100, 112, 124, 136, 148, 160].map((x) => <line key={x} x1={x} y1="14" x2={x - 6} y2="6" stroke={DARK} strokeWidth="1" />)}
      <line x1="120" y1="14" x2="120" y2="110" stroke="#a16207" strokeWidth="1.6" />
      <line x1="160" y1="110" x2="160" y2="44" stroke="#a16207" strokeWidth="1.6" />
      <circle cx="140" cy="110" r="20" fill="#e2e8f0" stroke={LINE} strokeWidth="1.4" />
      <circle cx="140" cy="110" r="3" fill={LINE} />
      <line x1="140" y1="130" x2="140" y2="150" stroke={LINE} strokeWidth="1.6" />
      <rect x="118" y="150" width="44" height="32" rx="3" fill="#fde68a" stroke="#a16207" strokeWidth="1.2" />
      <Label x={140} y={170} anchor="middle" size={10} weight="800">20N</Label>
      <Arrow from={[160, 44]} to={[160, 24]} color="#dc2626" width={2.4} />
      <Label x={168} y={34} size={9} weight="800" color="#b91c1c">ひもを引く力 10N</Label>
      <Callout from={[122, 100]} to={[90, 84]} text="動滑車" />
      <Label x={186} y={112} size={8.5}>物体を1m上げるには、</Label>
      <Label x={186} y={126} size={8.5}>ひもを2m引く</Label>
      <Label x={186} y={150} size={8.5} color="#1d4ed8">道具なし：20N×1m＝20J</Label>
      <Label x={186} y={164} size={8.5} color="#1d4ed8">動滑車：10N×2m＝20J</Label>
      <Label x={150} y={204} anchor="middle" size={8.5} color={LINE}>力は半分、距離は2倍で、仕事は変わらない（仕事の原理）</Label>
    </svg>
  )
}

// ── 熱の伝わり方 ───────────────────────────────────────────────────────────
//   { name: 'heatTransfer' }
// 伝導：物体の中を伝わる。対流：あたためられた液体や気体が動いて運ぶ。放射：光などとして空間をへだてて伝わる。
function HeatTransferDiagram() {
  const flame = (x, y) => <path d={`M${x},${y} Q${x - 7},${y - 12} ${x},${y - 24} Q${x + 7},${y - 12} ${x},${y} Z`} fill="#fb923c" stroke="#ea580c" strokeWidth="0.8" />
  return (
    <svg viewBox="0 0 300 176" className="h-auto w-full" role="img" aria-label="熱の伝わり方" data-subject-diagram="heatTransfer">
      <Label x={50} y={20} anchor="middle" size={10} weight="800">伝導</Label>
      {['#dc2626', '#f97316', '#facc15', '#cbd5e1'].map((color, i) => <rect key={color} x={12 + i * 19} y="66" width="19" height="9" fill={color} />)}
      <rect x="12" y="66" width="76" height="9" fill="none" stroke={LINE} strokeWidth="0.8" />
      {flame(20, 108)}
      <Arrow from={[30, 54]} to={[82, 54]} color="#dc2626" />
      <Label x={50} y={142} anchor="middle" size={8.5} color={LINE}>物体の中を</Label>
      <Label x={50} y={156} anchor="middle" size={8.5} color={LINE}>熱が伝わる</Label>

      <Label x={150} y={20} anchor="middle" size={10} weight="800">対流</Label>
      <rect x="120" y="46" width="60" height="68" fill={WATER} opacity="0.8" />
      <path d="M118,36 L118,116 L182,116 L182,36" fill="none" stroke={LINE} strokeWidth="1.2" />
      <path d="M136,104 L136,62 Q150,52 164,62 L164,100" fill="none" stroke="#dc2626" strokeWidth="1.8" />
      <path d="M136,58 L132,66 L140,66 Z" fill="#dc2626" />
      <path d="M164,106 L160,98 L168,98 Z" fill="#2563eb" />
      {flame(136, 140)}
      <Label x={150} y={156} anchor="middle" size={8.5} color={LINE}>水が動いて運ぶ</Label>

      <Label x={250} y={20} anchor="middle" size={10} weight="800">放射</Label>
      <circle cx="214" cy="76" r="14" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180
        return <line key={a} x1={214 + 17 * Math.cos(r)} y1={76 + 17 * Math.sin(r)} x2={214 + 23 * Math.cos(r)} y2={76 + 23 * Math.sin(r)} stroke="#ca8a04" strokeWidth="1.2" />
      })}
      {[62, 76, 90].map((y) => <path key={y} d={`M240,${y} q5,-4 10,0 q5,4 10,0 q5,-4 10,0`} fill="none" stroke="#ea580c" strokeWidth="1.2" />)}
      <rect x="276" y="60" width="16" height="32" rx="3" fill="#cbd5e1" stroke={LINE} strokeWidth="1" />
      <Label x={250} y={142} anchor="middle" size={8.5} color={LINE}>空間をへだてて</Label>
      <Label x={250} y={156} anchor="middle" size={8.5} color={LINE}>熱が伝わる</Label>
    </svg>
  )
}

function StarShape({ x, y, r = 5, fill = '#facc15' }) {
  return <path d={starPath(x, y, r)} fill={fill} stroke="#ca8a04" strokeWidth="0.6" />
}

// ── 透明半球に記録した太陽の動き ─────────────────────────────────────────────────
//   { name: 'transparentHemisphere' }
// 南側から見たようす（手前が南、右が東、左が西）。太陽は東からのぼり、南の空で最も高くなり（南中）、西にしずむ。1時間ごとの点の間隔は等しい。
function TransparentHemisphereDiagram() {
  const cx = 150
  const cy = 150
  const R = 110
  const ry = 34
  const alt = (55 * Math.PI) / 180
  const pt = (t) => {
    const east = Math.cos(t)
    const south = Math.sin(t) * Math.cos(alt)
    const up = Math.sin(t) * Math.sin(alt)
    return [cx + R * east, cy - R * up + ry * south]
  }
  const path = Array.from({ length: 61 }, (_, i) => pt((i / 60) * Math.PI))
  const hours = Array.from({ length: 11 }, (_, i) => pt(((i + 0.5) / 11) * Math.PI))
  const top = pt(Math.PI / 2)
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="透明半球に記録した太陽の動き" data-subject-diagram="transparentHemisphere">
      <ellipse cx={cx} cy={cy} rx={R} ry={ry} fill="#f1f5f9" stroke={LINE} strokeWidth="1" />
      <path d={`M${cx - R},${cy} A${R},${R} 0 0,1 ${cx + R},${cy}`} fill="#e0f2fe" fillOpacity="0.35" stroke={LINE} strokeWidth="1" />
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#cbd5e1" strokeWidth="0.8" />
      <line x1={cx} y1={cy - ry} x2={cx} y2={cy + ry} stroke="#cbd5e1" strokeWidth="0.8" />
      <path d={`M${path.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`} fill="none" stroke="#dc2626" strokeWidth="1.8" />
      {hours.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#ffffff" stroke="#dc2626" strokeWidth="1.2" />)}
      <circle cx={cx} cy={cy} r="3" fill={INK} />
      <Label x={cx + 6} y={cy - 4} size={8.5}>O（観測者）</Label>
      <Label x={cx} y={cy + ry + 14} anchor="middle" size={10} weight="800">南</Label>
      <Label x={cx} y={cy - ry - 4} anchor="middle" size={10} weight="800">北</Label>
      <Label x={cx + R + 4} y={cy + 4} size={10} weight="800">東</Label>
      <Label x={cx - R - 4} y={cy + 4} anchor="end" size={10} weight="800">西</Label>
      <Label x={top[0]} y={top[1] - 10} anchor="middle" size={8.5} weight="800" color="#b91c1c">南中</Label>
      <Label x={cx + R - 12} y={cy + 30} anchor="end" size={8} color={LINE}>日の出</Label>
      <Label x={cx - R + 12} y={cy + 30} size={8} color={LINE}>日の入り</Label>
    </svg>
  )
}

// ── 地球の自転と時刻 ─────────────────────────────────────────────────────────
//   { name: 'earthRotation' }
// 北極の真上から見たようす。地球は反時計回りに自転する。太陽の光が左から当たるとき、左が正午、右が真夜中、上が明け方、下が夕方。
function EarthRotationDiagram() {
  const c = [180, 100]
  const r = 60
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="地球の自転と時刻" data-subject-diagram="earthRotation">
      {[60, 100, 140].map((y) => <Arrow key={y} from={[10, y]} to={[60, y]} color="#ca8a04" width={1.8} />)}
      <Label x={36} y={40} anchor="middle" size={8.5} color="#a16207">太陽の光</Label>
      <circle cx={c[0]} cy={c[1]} r={r} fill="#dbeafe" stroke={LINE} strokeWidth="1.2" />
      <path d={`M${c[0]},${c[1] - r} A${r},${r} 0 0,1 ${c[0]},${c[1] + r} Z`} fill="#334155" opacity="0.55" />
      <path d={`M${c[0] + 22},${c[1]} A22,22 0 1,0 ${c[0]},${c[1] + 22}`} fill="none" stroke="#dc2626" strokeWidth="1.6" />
      <path d={`M${c[0] + 6},${c[1] + 22} L${c[0] - 2},${c[1] + 17} L${c[0] - 2},${c[1] + 27} Z`} fill="#dc2626" />
      <circle cx={c[0]} cy={c[1]} r="2.6" fill={INK} />
      <Label x={c[0] - 4} y={c[1] - 5} anchor="end" size={8} color={INK}>北極</Label>
      {[[c[0] - r, c[1], '正午', 'end', -6, 4], [c[0] + r, c[1], '真夜中', 'start', 6, 4], [c[0], c[1] - r, '明け方', 'middle', 0, -8], [c[0], c[1] + r, '夕方', 'middle', 0, 16]].map(([x, y, text, anchor, dx, dy]) => (
        <g key={text}>
          <circle cx={x} cy={y} r="3.2" fill="#f97316" />
          <Label x={x + dx} y={y + dy} anchor={anchor} size={9} weight="800">{text}</Label>
        </g>
      ))}
      <Label x={c[0]} y={196} anchor="middle" size={8.5} color={LINE}>赤い矢印：自転の向き（反時計回り）</Label>
    </svg>
  )
}

// ── 4つの方位の星の動き ──────────────────────────────────────────────────────
//   { name: 'starTrails' }
// 北の空：北極星付近を中心に反時計回り。東の空：右上へのぼる。南の空：東（左）から西（右）へ弧をえがく。西の空：右下へしずむ。
function StarTrailsDiagram() {
  const head = (x, y, angle) => {
    const tip = (a) => `${(x + 7 * Math.cos(angle + a)).toFixed(1)},${(y + 7 * Math.sin(angle + a)).toFixed(1)}`
    return <path d={`M${x},${y} L${tip(Math.PI * 0.85)} L${tip(-Math.PI * 0.85)} Z`} fill="#2563eb" />
  }
  const panel = (x0, y0, title, left, right, draw) => (
    <g>
      <rect x={x0} y={y0} width="144" height="100" rx="6" fill="#0f172a" />
      <line x1={x0 + 4} y1={y0 + 88} x2={x0 + 140} y2={y0 + 88} stroke="#94a3b8" strokeWidth="1.2" />
      <text x={x0 + 8} y={y0 + 14} fontSize="9" fontWeight="800" fill="#f8fafc">{title}</text>
      <text x={x0 + 6} y={y0 + 98} fontSize="8" fontWeight="700" fill="#cbd5e1">{left}</text>
      <text x={x0 + 138} y={y0 + 98} fontSize="8" fontWeight="700" fill="#cbd5e1" textAnchor="end">{right}</text>
      {draw(x0, y0)}
    </g>
  )
  return (
    <svg viewBox="0 0 300 212" className="h-auto w-full" role="img" aria-label="4つの方位の星の動き" data-subject-diagram="starTrails">
      {panel(4, 4, '北の空', '西', '東', (x0, y0) => (
        <g>
          {[14, 24, 34].map((r) => {
            const cxp = x0 + 72
            const cyp = y0 + 50
            const a1 = -0.2
            const a2 = -0.2 - 1.4
            return (
              <g key={r}>
                <path d={`M${(cxp + r * Math.cos(a1)).toFixed(1)},${(cyp + r * Math.sin(a1)).toFixed(1)} A${r},${r} 0 0,0 ${(cxp + r * Math.cos(a2)).toFixed(1)},${(cyp + r * Math.sin(a2)).toFixed(1)}`} fill="none" stroke="#93c5fd" strokeWidth="1.3" />
                {head(cxp + r * Math.cos(a2), cyp + r * Math.sin(a2), a2 - Math.PI / 2)}
              </g>
            )
          })}
          <StarShape x={x0 + 72} y={y0 + 50} r={4} />
          <text x={x0 + 80} y={y0 + 66} fontSize="7.5" fill="#fde68a">北極星</text>
        </g>
      ))}
      {panel(152, 4, '東の空', '北', '南', (x0, y0) => (
        <g>
          {[16, 46, 76].map((dx) => (
            <g key={dx}>
              <line x1={x0 + dx} y1={y0 + 86} x2={x0 + dx + 40} y2={y0 + 30} stroke="#93c5fd" strokeWidth="1.3" />
              {head(x0 + dx + 40, y0 + 30, Math.atan2(-56, 40))}
            </g>
          ))}
        </g>
      ))}
      {panel(4, 108, '南の空', '東', '西', (x0, y0) => (
        <g>
          {[[30, 'M12,86 Q72,20 132,86'], [44, 'M34,86 Q72,44 110,86']].map(([k, d]) => {
            const shifted = d.replace(/(-?\d+),(-?\d+)/g, (m, a, b) => `${Number(a) + x0},${Number(b) + y0}`)
            return <path key={k} d={shifted} fill="none" stroke="#93c5fd" strokeWidth="1.3" />
          })}
          {head(x0 + 124, y0 + 76, Math.atan2(10, 8))}
          {head(x0 + 104, y0 + 78, Math.atan2(8, 6))}
        </g>
      ))}
      {panel(152, 108, '西の空', '南', '北', (x0, y0) => (
        <g>
          {[16, 46, 76].map((dx) => (
            <g key={dx}>
              <line x1={x0 + dx} y1={y0 + 30} x2={x0 + dx + 40} y2={y0 + 86} stroke="#93c5fd" strokeWidth="1.3" />
              {head(x0 + dx + 40, y0 + 86, Math.atan2(56, 40))}
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}

// ── 地球の公転と真夜中に見える星座 ──────────────────────────────────────────────
//   { name: 'orbitConstellations' }
// 北極の真上から見たようす。地球は反時計回りに公転する。真夜中に南の空に見えるのは、太陽と反対側にある星座。
function OrbitConstellationsDiagram() {
  const sun = [150, 140]
  const earth = [[150, 210, '春分', 'しし座', 150, 268], [220, 140, '夏至', 'さそり座', 276, 140], [150, 70, '秋分', 'ペガスス座', 150, 14], [80, 140, '冬至', 'オリオン座', 24, 140]]
  return (
    <svg viewBox="0 0 300 282" className="h-auto w-full" role="img" aria-label="地球の公転と真夜中に見える星座" data-subject-diagram="orbitConstellations">
      <circle cx={sun[0]} cy={sun[1]} r="70" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx={sun[0]} cy={sun[1]} r="15" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <Label x={sun[0]} y={sun[1] + 4} anchor="middle" size={8.5} weight="800">太陽</Label>
      {earth.map(([x, y, season, star, sx, sy]) => (
        <g key={season}>
          <line x1={x} y1={y} x2={sx} y2={sy} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 3" />
          <circle cx={x} cy={y} r="8" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1" />
          <rect x={sx - 30} y={sy - 9} width="60" height="17" rx="4" fill="#0f172a" />
          <text x={sx} y={sy + 3} fontSize="8.5" fontWeight="800" textAnchor="middle" fill="#fde68a">{star}</text>
        </g>
      ))}
      <Label x={150} y={228} anchor="middle" size={9} weight="800">春分</Label>
      <Label x={226} y={130} size={9} weight="800">夏至</Label>
      <Label x={150} y={58} anchor="middle" size={9} weight="800">秋分</Label>
      <Label x={74} y={130} anchor="end" size={9} weight="800">冬至</Label>
      <path d="M203.7,185.3 L200.9,193.7 L195.3,188.1 Z" fill="#dc2626" />
      <Label x={206} y={200} size={8.5} color="#b91c1c">公転の向き</Label>
    </svg>
  )
}

// ── 地軸の傾きと季節 ────────────────────────────────────────────────────────
//   { name: 'seasonsOrbit' }
// 地軸は公転面に垂直な方向から23.4°傾いたまま公転する。夏至（右）では北半球が太陽の側に傾き、冬至（左）では反対側に傾く。
function SeasonsOrbitDiagram() {
  const sun = [150, 116]
  const tilt = (23.4 * Math.PI) / 180
  const axis = [-Math.sin(tilt), -Math.cos(tilt)]
  const positions = [[262, 116, '夏至', 'start', 20, 4], [38, 116, '冬至', 'end', -20, 4], [150, 176, '春分', 'end', -18, 22], [150, 56, '秋分', 'start', 18, -12]]
  return (
    <svg viewBox="0 0 300 224" className="h-auto w-full" role="img" aria-label="地軸の傾きと季節" data-subject-diagram="seasonsOrbit">
      <ellipse cx={sun[0]} cy={sun[1]} rx="112" ry="60" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx={sun[0]} cy={sun[1]} r="16" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      {positions.map(([x, y, name, anchor, dx, dy]) => (
        <g key={name}>
          <circle cx={x} cy={y} r="14" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1" />
          <line x1={x - axis[0] * 22} y1={y - axis[1] * 22} x2={x + axis[0] * 22} y2={y + axis[1] * 22} stroke={INK} strokeWidth="1.4" />
          <text x={x + axis[0] * 27} y={y + axis[1] * 27 + 3} fontSize="8" fontWeight="800" textAnchor="middle" fill={INK}>N</text>
          <Label x={x + dx} y={y + dy} anchor={anchor} size={9} weight="800">{name}</Label>
        </g>
      ))}
      <path d="M235.3,155.1 L227.3,163.5 L223.9,157.2 Z" fill="#dc2626" />
      <Label x={150} y={214} anchor="middle" size={8.5} color={LINE}>地軸は、いつも同じ向きに23.4°傾いたまま</Label>
    </svg>
  )
}

// ── 季節による南中高度 ───────────────────────────────────────────────────────
//   { name: 'noonAltitude' }
// 北緯35°の地点で南を向いたとき。春分・秋分は55°、夏至は78.4°、冬至は31.6°。
function NoonAltitudeDiagram() {
  const O = [70, 170]
  const len = 150
  const rows = [[31.6, '冬至 31.6°', 34], [55, '春分・秋分 55°', 52], [78.4, '夏至 78.4°', 70]]
  return (
    <svg viewBox="0 0 300 204" className="h-auto w-full" role="img" aria-label="季節による南中高度" data-subject-diagram="noonAltitude">
      <line x1="20" y1={O[1]} x2="284" y2={O[1]} stroke={DARK} strokeWidth="1.6" />
      <Label x={284} y={O[1] + 16} anchor="end" size={9} weight="800">南</Label>
      <Label x={20} y={O[1] + 16} size={9} weight="800">北</Label>
      <circle cx={O[0]} cy={O[1]} r="3.4" fill={INK} />
      <Label x={O[0]} y={O[1] + 16} anchor="middle" size={8.5}>観測者</Label>
      {rows.map(([deg, text, r]) => {
        const a = (deg * Math.PI) / 180
        const end = [O[0] + len * Math.cos(a), O[1] - len * Math.sin(a)]
        return (
          <g key={deg}>
            <line x1={O[0]} y1={O[1]} x2={end[0]} y2={end[1]} stroke="#ca8a04" strokeWidth="1.2" />
            <circle cx={end[0]} cy={end[1]} r="7" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <path d={`M${O[0] + r},${O[1]} A${r},${r} 0 0,0 ${(O[0] + r * Math.cos(a)).toFixed(1)},${(O[1] - r * Math.sin(a)).toFixed(1)}`} fill="none" stroke="#dc2626" strokeWidth="1" />
            <Label x={end[0] + 10} y={end[1] + 4} size={8.5} weight="800">{text}</Label>
          </g>
        )
      })}
      <Label x={150} y={200} anchor="middle" size={8.5} color={LINE}>北緯35°の地点。赤い弧が南中高度</Label>
    </svg>
  )
}

/** 線の途中に置く矢じり。at の点で dir の向きへ向ける。 */
function ArrowHead({ at, dir, color = '#dc2626', size = 5 }) {
  const len = Math.hypot(dir[0], dir[1]) || 1
  const [ux, uy] = [dir[0] / len, dir[1] / len]
  const tip = [at[0] + ux * size, at[1] + uy * size]
  const base = [at[0] - ux * size, at[1] - uy * size]
  const w = size * 0.7
  const p = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`
  return <path d={`M${p(tip[0], tip[1])} L${p(base[0] - uy * w, base[1] + ux * w)} L${p(base[0] + uy * w, base[1] - ux * w)} Z`} fill={color} />
}

/**
 * 満ち欠けした月・金星の形。side の側が光り、alpha は位相角（0＝全体が光る、90＝半分、180＝光る部分がない）。
 * rotate で、光る側（side）を回して向ける。
 */
function PhaseDisk({ cx, cy, r, side = 'right', alpha, rotate = 0, lit = '#fde68a', dark = '#64748b', stroke = '#a16207' }) {
  const a = Math.max(0, Math.min(180, alpha))
  const rx = Math.abs(Math.cos((a * Math.PI) / 180)) * r
  const gibbous = a < 90
  const limbSweep = side === 'right' ? 1 : 0
  const termSweep = side === 'right' ? (gibbous ? 1 : 0) : gibbous ? 0 : 1
  const d = `M${cx},${cy - r} A${r},${r} 0 0,${limbSweep} ${cx},${cy + r} A${rx.toFixed(2)},${r} 0 0,${termSweep} ${cx},${cy - r} Z`
  return (
    <g transform={rotate ? `rotate(${rotate.toFixed(1)} ${cx} ${cy})` : undefined}>
      <circle cx={cx} cy={cy} r={r} fill={dark} />
      {a < 179.5 ? <path d={d} fill={lit} /> : null}
      {stroke === 'none' ? null : <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="0.8" />}
    </g>
  )
}

// ── 月の満ち欠け ─────────────────────────────────────────────────────────────
//   { name: 'moonPhases' }
// 北極の真上から見たようす。太陽の光は左から（地球の自転の図と同じ向き）。月は反時計回りに公転し、
// 新月（左）→上弦の月（下）→満月（右）→下弦の月（上）。外側の輪は、北半球で地球から見た月の形。
function MoonPhasesDiagram() {
  const c = [164, 146]
  const orbit = 54
  const ring = 96
  const at = (radius, deg) => [c[0] + radius * Math.cos((deg * Math.PI) / 180), c[1] - radius * Math.sin((deg * Math.PI) / 180)]
  const names = { 0: ['新月', 22], 45: ['三日月', 24], 90: ['上弦の月', 24], 180: ['満月', 22], 270: ['下弦の月', -16] }
  const arrowAt = at(orbit, 202)
  const arrowDir = [-Math.sin((202 * Math.PI) / 180), -Math.cos((202 * Math.PI) / 180)]
  return (
    <svg viewBox="0 0 300 304" className="h-auto w-full" role="img" aria-label="月の満ち欠け" data-subject-diagram="moonPhases">
      {[100, 146, 192].map((y) => <Arrow key={y} from={[6, y]} to={[42, y]} color="#ca8a04" width={1.6} />)}
      <Label x={24} y={88} anchor="middle" size={8.5} color="#a16207">太陽の光</Label>
      <circle cx={c[0]} cy={c[1]} r={orbit} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <ArrowHead at={arrowAt} dir={arrowDir} />
      <circle cx={c[0]} cy={c[1]} r="16" fill="#dbeafe" stroke={LINE} strokeWidth="1" />
      <path d={`M${c[0]},${c[1] - 16} A16,16 0 0,1 ${c[0]},${c[1] + 16} Z`} fill="#334155" opacity="0.55" />
      <Label x={c[0]} y={c[1] + 30} anchor="middle" size={8.5}>地球</Label>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((e) => {
        const [mx, my] = at(orbit, 180 + e)
        const [vx, vy] = at(ring, 180 + e)
        const waxing = e <= 180
        const name = names[e]
        return (
          <g key={e}>
            <PhaseDisk cx={mx} cy={my} r={7} alpha={90} rotate={180} />
            <PhaseDisk cx={vx} cy={vy} r={10} side={waxing ? 'right' : 'left'} alpha={waxing ? 180 - e : e - 180} />
            {name ? <Label x={vx} y={vy + name[1]} anchor="middle" size={9} weight="800">{name[0]}</Label> : null}
          </g>
        )
      })}
      <Label x={150} y={286} anchor="middle" size={8.5} color={LINE}>外側の月：地球から見た形</Label>
      <Label x={150} y={299} anchor="middle" size={8.5} color={LINE}>赤い矢印：月の公転の向き（反時計回り）</Label>
    </svg>
  )
}

// ── 夕方に見える月 ───────────────────────────────────────────────────────────
//   { name: 'moonEveningSky' }
// 夕方（午後6時ごろ）に南を向いて見た空。東は左、西は右。太陽は西の地平線にしずむところ。
// 月は太陽から東へ離れた角度だけ、西の地平線から東へ寄った位置に見える（三日月36°・上弦の月90°・126°・満月180°）。
// 光っている側は、空の道すじ（弧）に沿って、しずんだ太陽の方を向く（三日月は右下、上弦の月は右、その先は右上）。
function MoonEveningSkyDiagram() {
  const c = [150, 176]
  const rx = 124
  const ry = 112
  const on = (deg, sx = rx, sy = ry) => [c[0] + sx * Math.cos((deg * Math.PI) / 180), c[1] - sy * Math.sin((deg * Math.PI) / 180)]
  const sun = on(0)
  const moons = [[36, '三日月', 'middle', 0, -16], [90, '上弦の月', 'middle', 0, -16], [126, '', 'middle', 0, 0], [180, '満月', 'middle', 2, -18]]
  const shift = Array.from({ length: 21 }, (_, i) => on(48 + i * 5, 92, 80))
  const shiftEnd = shift[shift.length - 1]
  const shiftDir = [shiftEnd[0] - shift[shift.length - 2][0], shiftEnd[1] - shift[shift.length - 2][1]]
  return (
    <svg viewBox="0 0 300 212" className="h-auto w-full" role="img" aria-label="夕方に見える月の位置" data-subject-diagram="moonEveningSky">
      <rect x="0" y="0" width="300" height="196" rx="8" fill="#1e293b" />
      <path d={`M${on(180)[0]},${c[1]} A${rx},${ry} 0 0,1 ${sun[0]},${c[1]}`} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <polyline points={shift.slice(0, -1).map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} fill="none" stroke="#fbbf24" strokeWidth="1.4" />
      <ArrowHead at={shiftEnd} dir={shiftDir} color="#fbbf24" size={5} />
      <text x={150} y={126} fontSize="8.5" fontWeight="800" textAnchor="middle" fill="#fde68a">日がたつと、東へ移る</text>
      <circle cx={sun[0]} cy={sun[1]} r="10" fill="#fb923c" />
      <text x={296} y={158} fontSize="8.5" fontWeight="800" textAnchor="end" fill="#fed7aa">しずむ太陽</text>
      {moons.map(([deg, name, anchor, dx, dy]) => {
        const [x, y] = on(deg)
        const a = (deg * Math.PI) / 180
        const toSun = (Math.atan2(ry * Math.cos(a), rx * Math.sin(a)) * 180) / Math.PI
        return (
          <g key={deg}>
            <PhaseDisk cx={x} cy={y} r={10} alpha={180 - deg} rotate={toSun} dark="#334155" stroke="none" />
            {name ? <text x={x + dx} y={y + dy} fontSize="9" fontWeight="800" textAnchor={anchor} fill="#f8fafc">{name}</text> : null}
          </g>
        )
      })}
      <rect x="0" y="176" width="300" height="36" fill="#3f6212" />
      <line x1="0" y1="176" x2="300" y2="176" stroke="#a3e635" strokeWidth="1.2" />
      <text x={14} y={196} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="#f8fafc">東</text>
      <text x={150} y={196} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="#f8fafc">南</text>
      <text x={286} y={196} fontSize="9.5" fontWeight="800" textAnchor="middle" fill="#f8fafc">西</text>
    </svg>
  )
}

// ── 日食・月食と、太陽と月の見かけの大きさ ───────────────────────────────────
//   { name: 'eclipse', kind: 'solar' | 'lunar' | 'size' }
// solar：太陽・月（新月）・地球の順。月の影が地球の昼の側に落ちる。
// lunar：太陽・地球・月（満月）の順。月が地球の影に入る。
// size：近くの小さな月と遠くの大きな太陽が、見る人から同じ角度の中に収まる。
function EclipseDiagram({ kind = 'solar' }) {
  const sunDisk = (
    <g>
      <circle cx="-14" cy="56" r="42" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <Label x={12} y={60} anchor="middle" size={9} weight="800" color="#a16207">太陽</Label>
    </g>
  )
  if (kind === 'lunar') {
    return (
      <svg viewBox="0 0 300 112" className="h-auto w-full" role="img" aria-label="月食のときの太陽・地球・月" data-subject-diagram="eclipse">
        {sunDisk}
        <path d="M130,34 L298,46 L298,66 L130,78 Z" fill="#1e293b" opacity="0.45" />
        <circle cx="130" cy="56" r="22" fill="#dbeafe" stroke={LINE} strokeWidth="1" />
        <path d="M130,34 A22,22 0 0,1 130,78 Z" fill="#334155" opacity="0.55" />
        <Label x={130} y={96} anchor="middle" size={9} weight="800">地球</Label>
        <circle cx="236" cy="56" r="8" fill="#9a3412" stroke="#7c2d12" strokeWidth="0.8" />
        <Label x={236} y={84} anchor="middle" size={9} weight="800">月（満月）</Label>
        <Label x={222} y={33} anchor="middle" size={8.5} color={LINE}>地球の影</Label>
      </svg>
    )
  }
  if (kind === 'size') {
    const slope = 26 / 264
    return (
      <svg viewBox="0 0 300 112" className="h-auto w-full" role="img" aria-label="太陽と月が同じ大きさに見えるわけ" data-subject-diagram="eclipse">
        <path d="M8,56 Q19,45 30,56 Q19,67 8,56 Z" fill="#ffffff" stroke={INK} strokeWidth="1" />
        <circle cx="19" cy="56" r="3.2" fill={INK} />
        <Label x={19} y={80} anchor="middle" size={8.5}>見る人</Label>
        <line x1="30" y1="56" x2="294" y2="30" stroke={DARK} strokeWidth="0.9" strokeDasharray="4 3" />
        <line x1="30" y1="56" x2="294" y2="82" stroke={DARK} strokeWidth="0.9" strokeDasharray="4 3" />
        <circle cx="76" cy="56" r={(46 * slope).toFixed(2)} fill="#cbd5e1" stroke={LINE} strokeWidth="0.8" />
        <Label x={76} y={44} anchor="middle" size={9} weight="800">月</Label>
        <circle cx="250" cy="56" r={(220 * slope).toFixed(2)} fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        <Label x={250} y={60} anchor="middle" size={9} weight="800" color="#a16207">太陽</Label>
        <Label x={150} y={106} anchor="middle" size={8.5} color={LINE}>近くの小さな月と、遠くの大きな太陽が、同じ大きさに見える</Label>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 300 112" className="h-auto w-full" role="img" aria-label="日食のときの太陽・月・地球" data-subject-diagram="eclipse">
      {sunDisk}
      <circle cx="250" cy="56" r="24" fill="#dbeafe" stroke={LINE} strokeWidth="1" />
      <path d="M250,32 A24,24 0 0,1 250,80 Z" fill="#334155" opacity="0.55" />
      <path d="M140,49 L234.1,38 A24,24 0 0,0 234.1,74 L140,63 Z" fill="#94a3b8" opacity="0.4" />
      <path d="M140,49 L226.1,54 A24,24 0 0,0 226.1,58 L140,63 Z" fill="#1e293b" opacity="0.6" />
      <PhaseDisk cx={140} cy={56} r={7} alpha={90} rotate={180} />
      <Label x={140} y={40} anchor="middle" size={9} weight="800">月（新月）</Label>
      <Label x={196} y={34} anchor="middle" size={8.5} color={LINE}>月の影</Label>
      <Label x={278} y={60} size={9} weight="800">地球</Label>
      <Callout from={[226.5, 56]} to={[206, 92]} text="日食が見える所" />
    </svg>
  )
}

// ── 金星が見える時間帯と方位 ─────────────────────────────────────────────────
//   { name: 'venusVisibility' }
// 北極の真上から見たようす。太陽は上、地球は下（昼の側が上）。地球は反時計回りに自転するので、
// 左の地点が夕方、右の地点が明け方、下の地点が真夜中。金星の公転軌道の半径は、太陽と地球の距離の約0.72倍。
// 地球から見て太陽から最も離れる位置（最大離角）に、よいの明星（左）と明けの明星（右）を置く。
function VenusVisibilityDiagram() {
  const sun = [150, 82]
  const rv = 64
  const earth = [150, 172]
  const re = 16
  const k = Math.PI / 2 - Math.asin(rv / (earth[1] - sun[1]))
  const east = [sun[0] - rv * Math.sin(k), sun[1] + rv * Math.cos(k)]
  const west = [sun[0] + rv * Math.sin(k), sun[1] + rv * Math.cos(k)]
  const dusk = [earth[0] - re, earth[1]]
  const dawn = [earth[0] + re, earth[1]]
  const night = [earth[0], earth[1] + re]
  const face = (p) => (Math.atan2(sun[1] - p[1], sun[0] - p[0]) * 180) / Math.PI
  return (
    <svg viewBox="0 0 300 246" className="h-auto w-full" role="img" aria-label="金星が見える時間帯と方位" data-subject-diagram="venusVisibility">
      <circle cx={sun[0]} cy={sun[1]} r={rv} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <Callout from={[sun[0] - rv * Math.SQRT1_2, sun[1] - rv * Math.SQRT1_2]} to={[78, 20]} text="金星の公転軌道" />
      <circle cx={sun[0]} cy={sun[1]} r="11" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <Label x={sun[0]} y={sun[1] + 3.5} anchor="middle" size={8.5} weight="800" color="#a16207">太陽</Label>
      <line x1={dusk[0]} y1={dusk[1]} x2={east[0]} y2={east[1]} stroke="#ca8a04" strokeWidth="1.1" strokeDasharray="3 2" />
      <line x1={dawn[0]} y1={dawn[1]} x2={west[0]} y2={west[1]} stroke="#ca8a04" strokeWidth="1.1" strokeDasharray="3 2" />
      <PhaseDisk cx={east[0]} cy={east[1]} r={5.5} alpha={90} rotate={face(east)} />
      <PhaseDisk cx={west[0]} cy={west[1]} r={5.5} alpha={90} rotate={face(west)} />
      <Label x={east[0] - 9} y={east[1] - 2} anchor="end" size={9} weight="800">よいの明星</Label>
      <Label x={east[0] - 9} y={east[1] + 10} anchor="end" size={8}>（夕方、西の空）</Label>
      <Label x={west[0] + 9} y={west[1] - 2} size={9} weight="800">明けの明星</Label>
      <Label x={west[0] + 9} y={west[1] + 10} size={8}>（明け方、東の空）</Label>
      <circle cx={earth[0]} cy={earth[1]} r={re} fill="#dbeafe" stroke={LINE} strokeWidth="1" />
      <path d={`M${earth[0] + re},${earth[1]} A${re},${re} 0 0,1 ${earth[0] - re},${earth[1]} Z`} fill="#334155" opacity="0.55" />
      <Label x={earth[0]} y={earth[1] - 4} anchor="middle" size={8.5} weight="800">地球</Label>
      {[dusk, dawn, night].map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="3" fill="#f97316" />)}
      <Label x={dusk[0] - 6} y={dusk[1] + 12} anchor="end" size={9} weight="800">夕方</Label>
      <Label x={dawn[0] + 6} y={dawn[1] + 12} size={9} weight="800">明け方</Label>
      <Arrow from={[night[0], night[1] + 4]} to={[night[0], night[1] + 30]} color={LINE} width={1.4} />
      <Label x={night[0] + 8} y={night[1] + 16} size={9} weight="800">真夜中</Label>
      <Label x={150} y={236} anchor="middle" size={8.5} color={LINE}>真夜中に見える空の方向（金星はこない）</Label>
    </svg>
  )
}

// ── 金星の満ち欠けと見かけの大きさ ───────────────────────────────────────────
//   { name: 'venusPhases' }
// 上：北極の真上から見た太陽・金星・地球（太陽は上、地球は下）。金星の公転軌道の半径は約0.72。
// 下：A〜Fの位置の金星を地球から肉眼で見た形。大きさは地球との距離に反比例させて計算する。
// よいの明星（A→B→C）は右側が光り、明けの明星（D→E→F）は左側が光る。B・Eは最大離角で半分が光る。
function VenusPhasesDiagram() {
  const sun = [150, 60]
  const rv = 50
  const earth = [150, 130]
  const s = rv / (earth[1] - sun[1])
  const rad = (d) => (d * Math.PI) / 180
  const place = (deg) => [sun[0] + rv * Math.cos(rad(deg)), sun[1] - rv * Math.sin(rad(deg))]
  const seen = (deg) => {
    const v = [s * Math.cos(rad(deg)), s * Math.sin(rad(deg))]
    const toEarth = [-v[0], -1 - v[1]]
    const d = Math.hypot(toEarth[0], toEarth[1])
    const cos = (-v[0] * toEarth[0] - v[1] * toEarth[1]) / (s * d)
    return { d, alpha: (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI }
  }
  const maxDeg = 180 + (Math.asin(s) * 180) / Math.PI
  const items = [
    ['A', 165, 'right', 30, [-9, 0]],
    ['B', maxDeg, 'right', 66, [-8, 9]],
    ['C', 255, 'right', 112, [-10, 12]],
    ['D', 285, 'left', 188, [10, 12]],
    ['E', 540 - maxDeg, 'left', 234, [8, 9]],
    ['F', 15, 'left', 270, [9, 0]],
  ]
  const nearest = seen(255).d
  const face = (p) => (Math.atan2(sun[1] - p[1], sun[0] - p[0]) * 180) / Math.PI
  const arrowAt = (deg) => [place(deg), [-Math.sin(rad(deg)), -Math.cos(rad(deg))]]
  const [a1, d1] = arrowAt(195)
  const [a2, d2] = arrowAt(345)
  return (
    <svg viewBox="0 0 300 262" className="h-auto w-full" role="img" aria-label="金星の位置と見え方" data-subject-diagram="venusPhases">
      <circle cx={sun[0]} cy={sun[1]} r={rv} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <ArrowHead at={a1} dir={d1} size={4.5} />
      <ArrowHead at={a2} dir={d2} size={4.5} />
      <line x1={earth[0]} y1={earth[1]} x2={place(maxDeg)[0]} y2={place(maxDeg)[1]} stroke="#ca8a04" strokeWidth="0.9" strokeDasharray="3 2" />
      <line x1={earth[0]} y1={earth[1]} x2={place(540 - maxDeg)[0]} y2={place(540 - maxDeg)[1]} stroke="#ca8a04" strokeWidth="0.9" strokeDasharray="3 2" />
      <circle cx={sun[0]} cy={sun[1]} r="10" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <Label x={sun[0]} y={sun[1] + 3} anchor="middle" size={7.5} weight="800" color="#a16207">太陽</Label>
      <circle cx={earth[0]} cy={earth[1]} r="8" fill="#dbeafe" stroke={LINE} strokeWidth="1" />
      <path d={`M${earth[0] + 8},${earth[1]} A8,8 0 0,1 ${earth[0] - 8},${earth[1]} Z`} fill="#334155" opacity="0.55" />
      <Label x={earth[0]} y={earth[1] + 20} anchor="middle" size={8.5} weight="800">地球</Label>
      {items.map(([name, deg, side, x, off]) => {
        const p = place(deg)
        const { d, alpha } = seen(deg)
        return (
          <g key={name}>
            <PhaseDisk cx={p[0]} cy={p[1]} r={4.5} alpha={90} rotate={face(p)} />
            <Label x={p[0] + off[0]} y={p[1] + off[1] + 3.5} anchor="middle" size={9} weight="800">{name}</Label>
            <PhaseDisk cx={x} cy={200} r={16 * (nearest / d)} side={side} alpha={alpha} />
            <Label x={x} y={234} anchor="middle" size={9} weight="800">{name}</Label>
          </g>
        )
      })}
      <line x1="150" y1="158" x2="150" y2="238" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
      <Label x={75} y={168} anchor="middle" size={8.5} weight="800">よいの明星（夕方・西の空）</Label>
      <Label x={225} y={168} anchor="middle" size={8.5} weight="800">明けの明星（明け方・東の空）</Label>
      <Label x={150} y={256} anchor="middle" size={8.5} color={LINE}>地球に近いほど大きく見え、大きく欠ける</Label>
    </svg>
  )
}

/** 図の中で散らす点の位置を毎回同じにする、決まった並びの乱数（0以上1未満）。 */
function steadyRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

// ── 太陽のようす ─────────────────────────────────────────────────────────────
//   { name: 'sunSurface' }
// 表面（約6000℃）・黒点（約4000℃）・コロナ（100万℃以上）・プロミネンス（紅炎）。
// 右下の点は、同じ縮尺の地球（直径は太陽の約109分の1）。
function SunSurfaceDiagram() {
  const c = [126, 104]
  const R = 62
  const limb = (deg) => [c[0] + R * Math.cos((deg * Math.PI) / 180), c[1] - R * Math.sin((deg * Math.PI) / 180)]
  const arch = (from, to, rise) => {
    const [p, q] = [limb(from), limb(to)]
    const [pn, qn] = [from, to].map((deg) => [Math.cos((deg * Math.PI) / 180), -Math.sin((deg * Math.PI) / 180)])
    const f = (v) => v.toFixed(1)
    return `M${f(p[0])},${f(p[1])} C${f(p[0] + pn[0] * rise)},${f(p[1] + pn[1] * rise)} ${f(q[0] + qn[0] * rise)},${f(q[1] + qn[1] * rise)} ${f(q[0])},${f(q[1])}`
  }
  const earth = [264, 194]
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="太陽の表面のようす" data-subject-diagram="sunSurface">
      <circle cx={c[0]} cy={c[1]} r="92" fill="#fef3c7" opacity="0.6" />
      <circle cx={c[0]} cy={c[1]} r="78" fill="#fde68a" opacity="0.5" />
      <ellipse cx={c[0]} cy={c[1]} rx="98" ry="15" fill="#fde68a" opacity="0.35" transform={`rotate(-28 ${c[0]} ${c[1]})`} />
      <ellipse cx={c[0]} cy={c[1]} rx="96" ry="13" fill="#fde68a" opacity="0.35" transform={`rotate(36 ${c[0]} ${c[1]})`} />
      <path d={arch(24, 48, 44)} fill="none" stroke="#fca5a5" strokeWidth="9" strokeLinecap="round" opacity="0.6" />
      <path d={arch(24, 48, 44)} fill="none" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx={c[0]} cy={c[1]} r={R} fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      {[[104, 88, 8, 7], [144, 118, 5.5, 5], [116, 136, 3.5, 3.2]].map(([x, y, rx, ry]) => (
        <g key={`${x},${y}`}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#b45309" />
          <ellipse cx={x} cy={y} rx={rx * 0.55} ry={ry * 0.55} fill="#1f2937" />
        </g>
      ))}
      <Callout from={[72, 46]} to={[20, 16]} anchor="start" text="コロナ（100万℃以上）" />
      <Callout from={[c[0] + 72, c[1] - 52]} to={[210, 66]} text="プロミネンス" />
      <Label x={213} y={82} size={10}>（紅炎）</Label>
      <Callout from={[144, 118]} to={[204, 124]} text="黒点（約4000℃）" />
      <Callout from={[150, 150]} to={[204, 158]} text="表面（約6000℃）" />
      <circle cx={earth[0]} cy={earth[1]} r="0.6" fill="#1d4ed8" />
      <circle cx={earth[0]} cy={earth[1]} r="5" fill="none" stroke="#1d4ed8" strokeWidth="0.8" strokeDasharray="2 1.5" />
      <Label x={earth[0] - 9} y={earth[1] + 3.5} anchor="end" size={9}>同じ縮尺の地球</Label>
    </svg>
  )
}

// ── 黒点の位置と形の変化 ─────────────────────────────────────────────────────
//   { name: 'sunspotMotion' }
// 空で見た向き（東が左）。太陽の自転で、黒点は東（左）から西（右）へ移る。3日ごとに約40°。
// 中央部では円形、周辺部では横に縮んだだ円形に見える。
function SunspotMotionDiagram() {
  const R = 30
  const cy = 66
  const lat = (14 * Math.PI) / 180
  const days = [[38, -65, '1日目'], [112, -25, '4日目'], [186, 15, '7日目'], [260, 55, '10日目']]
  return (
    <svg viewBox="0 0 300 120" className="h-auto w-full" role="img" aria-label="黒点の位置と形の変化" data-subject-diagram="sunspotMotion">
      <Label x={96} y={18} anchor="end" size={9.5} weight="800">東</Label>
      <Arrow from={[102, 14]} to={[176, 14]} color="#b45309" width={1.6} />
      <Label x={182} y={18} size={9.5} weight="800">西</Label>
      <Label x={198} y={18} size={8.5} color={LINE}>黒点が動く向き</Label>
      {days.map(([cx, L, text]) => {
        const a = (L * Math.PI) / 180
        const y = cy - R * Math.sin(lat)
        const x = cx + R * Math.cos(lat) * Math.sin(a)
        const squeeze = Math.cos(a)
        return (
          <g key={text}>
            <circle cx={cx} cy={cy} r={R} fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <line x1={cx - R * Math.cos(lat)} y1={y} x2={cx + R * Math.cos(lat)} y2={y} stroke="#b45309" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
            <ellipse cx={x} cy={y} rx={5 * squeeze} ry={4.6} fill="#b45309" />
            <ellipse cx={x} cy={y} rx={2.6 * squeeze} ry={2.4} fill="#1f2937" />
            <Label x={cx} y={112} anchor="middle" size={9} weight="800">{text}</Label>
          </g>
        )
      })}
    </svg>
  )
}

// ── 周辺部の黒点がだ円形に見えるわけ ─────────────────────────────────────────
//   { name: 'sunspotShape' }
// 太陽を北極側から見た断面（下半分）。地球（下）からは平行な向きに見る。
// 中央部の黒点は幅がそのまま、周辺部の黒点はななめなので幅がせまく見える（中心から55°で約0.57倍）。
function SunspotShapeDiagram() {
  const c = [150, 20]
  const R = 70
  const at = (deg) => [c[0] + R * Math.cos((deg * Math.PI) / 180), c[1] - R * Math.sin((deg * Math.PI) / 180)]
  const spot = (from, to) => {
    const [p, q] = [at(from), at(to)]
    return { p, q, d: `M${p[0].toFixed(1)},${p[1].toFixed(1)} A${R},${R} 0 0,0 ${q[0].toFixed(1)},${q[1].toFixed(1)}` }
  }
  const center = spot(261, 279)
  const edge = spot(316, 334)
  const base = 106
  return (
    <svg viewBox="0 0 300 128" className="h-auto w-full" role="img" aria-label="周辺部の黒点がだ円形に見えるわけ" data-subject-diagram="sunspotShape">
      <path d={`M${c[0] - R},${c[1]} A${R},${R} 0 0,0 ${c[0] + R},${c[1]} Z`} fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <Label x={c[0]} y={42} anchor="middle" size={9}>太陽を北極側から見た断面</Label>
      {[center, edge].map(({ p, q, d }) => (
        <g key={d}>
          <path d={d} fill="none" stroke="#1f2937" strokeWidth="4" />
          {[p, q].map(([x, y]) => <line key={x} x1={x} y1={y + 2} x2={x} y2={base} stroke={LINE} strokeWidth="0.7" strokeDasharray="2 2" />)}
          <line x1={p[0]} y1={base} x2={q[0]} y2={base} stroke="#1f2937" strokeWidth="4" />
        </g>
      ))}
      <line x1="64" y1={base} x2="252" y2={base} stroke={DARK} strokeWidth="1" />
      <Label x={edge.q[0] + 8} y={edge.q[1] + 4} size={9} weight="800">黒点</Label>
      <Label x={140} y={121} anchor="middle" size={9} weight="800">円形に見える</Label>
      <Label x={216} y={121} anchor="middle" size={9} weight="800">だ円形に見える</Label>
      <Arrow from={[34, 118]} to={[34, 74]} color={LINE} width={1.4} />
      <Label x={42} y={96} size={8.5} color={LINE}>地球から見る向き</Label>
    </svg>
  )
}

// ── 太陽系の天体 ─────────────────────────────────────────────────────────────
//   { name: 'solarSystemBodies' }
// 左の太陽から、水・金・地・火（地球型惑星）、小惑星が多い所、木・土・天・海（木星型惑星）、
// 海王星の外側の太陽系外縁天体（冥王星など）。細長い軌道のすい星は、尾を太陽と反対側にのばす。
// 大きさや距離の割合は実際とちがう。
function SolarSystemBodiesDiagram() {
  const sun = [-26, 108]
  const planets = [
    ['水', 34, 1.8, '#a8a29e'], ['金', 45, 2.8, '#facc15'], ['地', 56, 3, '#3b82f6'], ['火', 68, 2.3, '#ef4444'],
    ['木', 110, 9, '#d6a36b'], ['土', 144, 7.5, '#e5c07b'], ['天', 176, 5, '#67e8f9'], ['海', 204, 5, '#2563eb'],
  ]
  const polar = (rho, deg) => [sun[0] + rho * Math.cos((deg * Math.PI) / 180), sun[1] - rho * Math.sin((deg * Math.PI) / 180)]
  const arc = (rho, span) => {
    const [p, q] = [polar(rho, span), polar(rho, -span)]
    return `M${p[0].toFixed(1)},${p[1].toFixed(1)} A${rho},${rho} 0 0,1 ${q[0].toFixed(1)},${q[1].toFixed(1)}`
  }
  const rand = steadyRandom(7)
  const belt = Array.from({ length: 46 }, () => polar(104 + rand() * 20, (rand() - 0.5) * 26))
  const outer = Array.from({ length: 30 }, () => polar(244 + rand() * 26, (rand() - 0.5) * 22))
  const pluto = polar(248, 9)
  const comet = { c: [152, 42], rx: 140, ry: 22, tilt: -8 }
  const cometAt = (deg) => {
    const t = (deg * Math.PI) / 180
    const g = (comet.tilt * Math.PI) / 180
    const [x, y] = [comet.rx * Math.cos(t), comet.ry * Math.sin(t)]
    return [comet.c[0] + x * Math.cos(g) - y * Math.sin(g), comet.c[1] + x * Math.sin(g) + y * Math.cos(g)]
  }
  const head = cometAt(196)
  const away = [head[0] - sun[0], head[1] - sun[1]]
  const len = Math.hypot(away[0], away[1])
  const u = [away[0] / len, away[1] / len]
  const tail = [head[0] + u[0] * 34, head[1] + u[1] * 34]
  const side = [-u[1] * 5, u[0] * 5]
  return (
    <svg viewBox="0 0 300 190" className="h-auto w-full" role="img" aria-label="太陽系の天体" data-subject-diagram="solarSystemBodies">
      {planets.map(([name, x]) => <path key={name} d={arc(x - sun[0], 13)} fill="none" stroke="#cbd5e1" strokeWidth="0.8" />)}
      <ellipse cx={comet.c[0]} cy={comet.c[1]} rx={comet.rx} ry={comet.ry} fill="none" stroke="#0ea5e9" strokeWidth="0.9" strokeDasharray="4 3" transform={`rotate(${comet.tilt} ${comet.c[0]} ${comet.c[1]})`} />
      <circle cx={sun[0]} cy={sun[1]} r="50" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <Label x={10} y={112} anchor="middle" size={9} weight="800" color="#a16207">太陽</Label>
      {belt.map(([x, y], i) => <circle key={`b${i}`} cx={x} cy={y} r="0.9" fill="#78716c" />)}
      {outer.map(([x, y], i) => <circle key={`o${i}`} cx={x} cy={y} r="0.9" fill="#78716c" />)}
      <circle cx={pluto[0]} cy={pluto[1]} r="1.8" fill="#a8a29e" />
      <Label x={pluto[0] + 5} y={pluto[1] - 3} size={8.5}>冥王星</Label>
      <path d={`M${head[0].toFixed(1)},${head[1].toFixed(1)} L${(tail[0] + side[0]).toFixed(1)},${(tail[1] + side[1]).toFixed(1)} L${(tail[0] - side[0]).toFixed(1)},${(tail[1] - side[1]).toFixed(1)} Z`} fill="#7dd3fc" opacity="0.8" />
      <circle cx={head[0]} cy={head[1]} r="2.4" fill="#0284c7" />
      <Label x={tail[0] + 6} y={tail[1] + 2} size={9} weight="800">すい星</Label>
      {planets.map(([name, x, r, color]) => (
        <g key={name}>
          {name === '土' ? <ellipse cx={x} cy={sun[1]} rx={r + 6} ry={2.6} fill="none" stroke="#a16207" strokeWidth="1" /> : null}
          <circle cx={x} cy={sun[1]} r={r} fill={color} stroke="#475569" strokeWidth="0.5" />
          <Label x={x} y={sun[1] + (r > 6 ? r + 12 : 16)} anchor="middle" size={9} weight="800">{name}</Label>
        </g>
      ))}
      <circle cx="110" cy={sun[1]} r="15" fill="none" stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="2 2" />
      <circle cx={110 + 15 * Math.SQRT1_2} cy={sun[1] - 15 * Math.SQRT1_2} r="1.6" fill="#475569" />
      <Callout from={[110 + 15 * Math.SQRT1_2, sun[1] - 15 * Math.SQRT1_2]} to={[128, 80]} text="衛星" />
      <path d="M30,142 L30,146 L72,146 L72,142" fill="none" stroke={LINE} strokeWidth="1" />
      <Label x={51} y={158} anchor="middle" size={9} weight="800">地球型惑星</Label>
      <path d="M98,142 L98,146 L212,146 L212,142" fill="none" stroke={LINE} strokeWidth="1" />
      <Label x={155} y={158} anchor="middle" size={9} weight="800">木星型惑星</Label>
      <line x1="86" y1="126" x2="86" y2="166" stroke={LINE} strokeWidth="0.8" />
      <Label x={86} y={178} anchor="middle" size={9} weight="800">小惑星</Label>
      <line x1="232" y1="132" x2="232" y2="166" stroke={LINE} strokeWidth="0.8" />
      <Label x={232} y={178} anchor="middle" size={9} weight="800">太陽系外縁天体</Label>
    </svg>
  )
}

// ── 銀河系 ───────────────────────────────────────────────────────────────────
//   { name: 'milkyWay' }
// 左：上から見たうずまき状の円盤（直径約10万光年）。太陽系は中心から半分ほど離れた所。
// 右：横から見たうすい円盤とふくらんだ中心部。円盤の向きに見ると星が重なり、天の川として見える。
function MilkyWayDiagram() {
  const top = [80, 92]
  const R = 62
  const rand = steadyRandom(11)
  const b = Math.log(54 / 9) / (3 * Math.PI)
  const arms = [0, Math.PI].map((offset) =>
    Array.from({ length: 80 }, (_, i) => {
      const t = i * 0.12
      const r = 9 * Math.exp(b * t)
      const a = t + offset
      return [top[0] + r * Math.cos(a) + (rand() - 0.5) * 5, top[1] - r * Math.sin(a) * 0.92 + (rand() - 0.5) * 5]
    }),
  )
  const sunTop = [top[0] + 33 * Math.cos((245 * Math.PI) / 180), top[1] - 33 * Math.sin((245 * Math.PI) / 180) * 0.92]
  const side = [222, 92]
  const sunSide = [side[0] - 36, side[1]]
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="銀河系のすがた" data-subject-diagram="milkyWay">
      <Label x={top[0]} y={14} anchor="middle" size={9} weight="800">上から見たようす</Label>
      <Label x={side[0]} y={14} anchor="middle" size={9} weight="800">横から見たようす</Label>
      <ellipse cx={top[0]} cy={top[1]} rx={R} ry={R * 0.92} fill="#1e293b" />
      {arms.map((points, k) => (
        <g key={k}>
          <polyline points={points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')} fill="none" stroke="#93c5fd" strokeWidth="7" opacity="0.18" strokeLinecap="round" />
          {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.3 : 0.8} fill="#e0f2fe" />)}
        </g>
      ))}
      <ellipse cx={top[0]} cy={top[1]} rx="12" ry="11" fill="#fde68a" opacity="0.9" />
      <circle cx={sunTop[0]} cy={sunTop[1]} r="2.6" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
      <Callout from={sunTop} to={[112, 166]} text="太陽系" />
      <path d={`M${top[0] - R},172 L${top[0] - R},178 L${top[0] + R},178 L${top[0] + R},172`} fill="none" stroke={LINE} strokeWidth="1" />
      <Label x={top[0]} y={194} anchor="middle" size={9} weight="800">約10万光年</Label>
      <ellipse cx={side[0]} cy={side[1]} rx="70" ry="6" fill="#1e293b" />
      <ellipse cx={side[0]} cy={side[1]} rx="18" ry="13" fill="#fde68a" opacity="0.95" />
      <ellipse cx={side[0]} cy={side[1]} rx="62" ry="2.2" fill="#93c5fd" opacity="0.5" />
      <circle cx={sunSide[0]} cy={sunSide[1]} r="2.6" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
      <Arrow from={[sunSide[0] - 4, sunSide[1] + 16]} to={[sunSide[0] - 30, sunSide[1] + 16]} color="#ca8a04" width={1.4} />
      <Arrow from={[sunSide[0] + 4, sunSide[1] + 16]} to={[sunSide[0] + 74, sunSide[1] + 16]} color="#ca8a04" width={1.4} />
      <Label x={side[0]} y={side[1] + 34} anchor="middle" size={8.5}>円盤の向き：星が重なり</Label>
      <Label x={side[0]} y={side[1] + 46} anchor="middle" size={8.5}>天の川として見える</Label>
      <Arrow from={[sunSide[0], sunSide[1] - 8]} to={[sunSide[0], sunSide[1] - 40]} color={LINE} width={1.2} />
      <Label x={sunSide[0] + 6} y={sunSide[1] - 32} size={8.5}>星が少ない向き</Label>
      <Label x={sunSide[0] - 8} y={sunSide[1] - 6} anchor="end" size={9} weight="800">太陽系</Label>
    </svg>
  )
}

export const SCIENCE_DIAGRAMS = Object.freeze({
  microscope: MicroscopeDiagram,
  microscopeView: MicroscopeViewDiagram,
  flowerParts: FlowerPartsDiagram,
  pineScales: PineScalesDiagram,
  monocotDicot: MonocotDicotDiagram,
  insectBody: InsectBodyDiagram,
  eyeFields: EyeFieldsDiagram,
  gasBurner: GasBurnerDiagram,
  cylinderReading: CylinderReadingDiagram,
  gasCollection: GasCollectionDiagram,
  ammoniaFountain: AmmoniaFountainDiagram,
  dissolvingParticles: DissolvingParticlesDiagram,
  filtration: FiltrationDiagram,
  statesParticles: StatesParticlesDiagram,
  distillation: DistillationDiagram,
  reflectionLaw: ReflectionLawDiagram,
  mirrorImage: MirrorImageDiagram,
  refraction: RefractionDiagram,
  convexLensFocus: ConvexLensFocusDiagram,
  lensImage: LensImageDiagram,
  waveforms: WaveformsDiagram,
  forceArrow: ForceArrowDiagram,
  forceBalance: ForceBalanceDiagram,
  volcanoShapes: VolcanoShapesDiagram,
  rockTextures: RockTexturesDiagram,
  quakeRecord: QuakeRecordDiagram,
  plateSubduction: PlateSubductionDiagram,
  layerDeformation: LayerDeformationDiagram,
  sedimentSorting: SedimentSortingDiagram,
  columnSections: ColumnSectionsDiagram,
  thermalDecomposition: ThermalDecompositionDiagram,
  waterElectrolysis: WaterElectrolysisDiagram,
  moleculeModels: MoleculeModelsDiagram,
  reactionModels: ReactionModelsDiagram,
  cellStructure: CellStructureDiagram,
  photosynthesis: PhotosynthesisDiagram,
  stemSections: StemSectionsDiagram,
  leafSection: LeafSectionDiagram,
  digestiveSystem: DigestiveSystemDiagram,
  villus: VillusDiagram,
  alveolus: AlveolusDiagram,
  circulation: CirculationDiagram,
  senseOrgans: SenseOrgansDiagram,
  reflexPath: ReflexPathDiagram,
  armMuscles: ArmMusclesDiagram,
  pressureFaces: PressureFacesDiagram,
  airPressureAll: AirPressureAllDiagram,
  pressureSystems: PressureSystemsDiagram,
  weatherSymbols: WeatherSymbolsDiagram,
  cloudRise: CloudRiseDiagram,
  risingAir: RisingAirDiagram,
  cloudFlask: CloudFlaskDiagram,
  waterCycle: WaterCycleDiagram,
  frontSymbols: FrontSymbolsDiagram,
  frontSections: FrontSectionsDiagram,
  midLatitudeCyclone: MidLatitudeCycloneDiagram,
  seaLandBreeze: SeaLandBreezeDiagram,
  winterMonsoon: WinterMonsoonDiagram,
  staticCharge: StaticChargeDiagram,
  crookesTube: CrookesTubeDiagram,
  electronFlow: ElectronFlowDiagram,
  radiationPenetration: RadiationPenetrationDiagram,
  circuitSymbols: CircuitSymbolsDiagram,
  seriesParallel: SeriesParallelDiagram,
  meterConnection: MeterConnectionDiagram,
  magneticField: MagneticFieldDiagram,
  currentField: CurrentFieldDiagram,
  electromagneticInduction: ElectromagneticInductionDiagram,
  forceOnCurrent: ForceOnCurrentDiagram,
  dcAc: DcAcDiagram,
  chlorideElectrolysis: ChlorideElectrolysisDiagram,
  atomStructure: AtomStructureDiagram,
  ionFormation: IonFormationDiagram,
  ionBeaker: IonBeakerDiagram,
  litmusMigration: LitmusMigrationDiagram,
  phScale: PhScaleDiagram,
  neutralizationModel: NeutralizationModelDiagram,
  simpleCell: SimpleCellDiagram,
  metalDisplacement: MetalDisplacementDiagram,
  danielCell: DanielCellDiagram,
  rootTip: RootTipDiagram,
  mitosisSteps: MitosisStepsDiagram,
  chromosomeInheritance: ChromosomeInheritanceDiagram,
  pollenTube: PollenTubeDiagram,
  geneCross: GeneCrossDiagram,
  punnettSquare: PunnettSquareDiagram,
  homologousLimbs: HomologousLimbsDiagram,
  tickerTape: TickerTapeDiagram,
  slopeForces: SlopeForcesDiagram,
  forceComposition: ForceCompositionDiagram,
  actionReaction: ActionReactionDiagram,
  waterPressure: WaterPressureDiagram,
  springBuoyancy: SpringBuoyancyDiagram,
  pendulumEnergy: PendulumEnergyDiagram,
  movablePulley: MovablePulleyDiagram,
  heatTransfer: HeatTransferDiagram,
  transparentHemisphere: TransparentHemisphereDiagram,
  earthRotation: EarthRotationDiagram,
  starTrails: StarTrailsDiagram,
  orbitConstellations: OrbitConstellationsDiagram,
  seasonsOrbit: SeasonsOrbitDiagram,
  noonAltitude: NoonAltitudeDiagram,
  moonPhases: MoonPhasesDiagram,
  moonEveningSky: MoonEveningSkyDiagram,
  eclipse: EclipseDiagram,
  venusVisibility: VenusVisibilityDiagram,
  venusPhases: VenusPhasesDiagram,
  sunSurface: SunSurfaceDiagram,
  sunspotMotion: SunspotMotionDiagram,
  sunspotShape: SunspotShapeDiagram,
  solarSystemBodies: SolarSystemBodiesDiagram,
  milkyWay: MilkyWayDiagram,
})
