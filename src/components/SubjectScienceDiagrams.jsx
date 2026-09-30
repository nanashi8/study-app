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
})
