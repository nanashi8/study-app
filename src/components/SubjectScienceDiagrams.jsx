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
})
