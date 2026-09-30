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
})
