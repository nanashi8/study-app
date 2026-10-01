// 理科（地学）の図解。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。部分の名前は引き出し線の先に書く。
import { Arrow, BLUE, Callout, GREEN, INK, LINE, MUTED, Panel, RED, T, steady } from './SubjectScienceParts.jsx'

// ── 噴火と火山噴出物 ─────────────────────────────────────────────────────────
//   { name: 'volcanicEjecta' }
// 地下のマグマだまりから上がってきたマグマが噴火でふき出す。火山ガス（主に水蒸気）・火山灰・火山弾・軽石がふき出し、溶岩が斜面を流れる。
function Spindle({ x, y, angle }) {
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path d={`M${x - 11},${y} Q${x - 6},${y - 4.5} ${x},${y - 4.5} Q${x + 6},${y - 4.5} ${x + 11},${y} Q${x + 6},${y + 4.5} ${x},${y + 4.5} Q${x - 6},${y + 4.5} ${x - 11},${y} Z`} fill="#57534e" stroke="#292524" strokeWidth="0.8" />
    </g>
  )
}
function Pumice({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r="5.5" fill="#f5f5f4" stroke="#a8a29e" />
      {[[-2, -2], [2, -1], [-1, 2], [2.5, 2.5], [-3, 1]].map(([dx, dy]) => <circle key={`${dx}-${dy}`} cx={x + dx} cy={y + dy} r="0.8" fill="#a8a29e" />)}
    </g>
  )
}
function VolcanicEjectaDiagram() {
  const random = steady(5)
  const ash = Array.from({ length: 80 }, () => {
    const x = 166 + random() * 128
    const center = 34 + (x - 166) * 0.42
    return [x, center + (random() - 0.5) * 36 * (0.5 + (x - 166) / 256)]
  })
  return (
    <svg viewBox="0 0 300 220" className="h-auto w-full" role="img" aria-label="噴火と火山噴出物" data-subject-diagram="volcanicEjecta">
      {ash.map(([x, y], index) => <circle key={index} cx={x} cy={y} r={index % 3 ? 0.9 : 1.3} fill="#9ca3af" />)}
      {[[150, 60, 26, 16], [136, 42, 20, 13], [164, 34, 22, 14], [150, 20, 16, 10]].map(([cx, cy, rx, ry]) => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#e5e7eb" stroke="#9ca3af" />
      ))}
      <path d="M134,80 Q118,60 104,66" fill="none" stroke="#a8a29e" strokeDasharray="2 2" />
      <path d="M168,80 Q186,66 196,84" fill="none" stroke="#a8a29e" strokeDasharray="2 2" />
      <Spindle x={104} y={66} angle={-35} />
      <Spindle x={198} y={88} angle={40} />
      <path d="M6,196 L126,84 Q150,96 174,84 L294,196 L294,220 L6,220 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="1.2" />
      <Pumice x={216} y={116} />
      <Pumice x={228} y={128} />
      <ellipse cx="150" cy="214" rx="62" ry="14" fill="#f97316" stroke="#c2410c" />
      <rect x="145" y="90" width="10" height="114" fill="#ef4444" />
      <path d="M128,86 Q116,100 98,118 Q82,134 70,152 L78,156 Q92,138 106,122 Q122,104 134,90 Z" fill="#fb923c" stroke="#c2410c" />
      <T x={6} y={16} size={9.5} weight="800">火山ガス</T>
      <T x={6} y={28} size={8.5} color={MUTED}>（主に水蒸気）</T>
      <line x1="68" y1="22" x2="120" y2="38" stroke={LINE} strokeWidth="0.8" />
      <T x={294} y={16} size={9.5} weight="800" anchor="end">火山灰</T>
      <T x={294} y={28} size={8.5} anchor="end" color={MUTED}>細かい粒。風で遠くへ</T>
      <Callout from={[104, 66]} to={[70, 56]} text="火山弾" />
      <Callout from={[232, 129]} to={[252, 122]} text="軽石" />
      <Callout from={[88, 132]} to={[44, 122]} text="溶岩" />
      <Callout from={[155, 150]} to={[184, 150]} text="マグマ" />
      <T x={150} y={214} size={9} weight="800" anchor="middle">マグマだまり</T>
    </svg>
  )
}

// ── 主な鉱物 ─────────────────────────────────────────────────────────────
//   { name: 'minerals' }
// 左は無色鉱物（石英・長石）、右は有色鉱物（黒雲母・角せん石・輝石・カンラン石・磁鉄鉱）。それぞれの色と、形や割れ方の特徴を示す。
function prism(cx, cy, length, width, angle, fill, stroke) {
  const h = length / 2
  const w = width / 2
  return (
    <g transform={`rotate(${angle} ${cx} ${cy})`}>
      <path d={`M${cx - h},${cy} L${cx - h + w},${cy - w} L${cx + h - w},${cy - w} L${cx + h},${cy} L${cx + h - w},${cy + w} L${cx - h + w},${cy + w} Z`} fill={fill} stroke={stroke} />
      <line x1={cx - h + w} y1={cy} x2={cx + h - w} y2={cy} stroke="#ffffff" strokeOpacity="0.35" />
    </g>
  )
}
function MineralsDiagram() {
  const cells = [
    { name: '石英', sub: '無色・白色\n不規則に割れる', x: 50, y: 62 },
    { name: '長石', sub: '白色・うすもも色\n決まった方向に割れる', x: 50, y: 142 },
    { name: '黒雲母', sub: 'うすくはがれる', x: 136, y: 62 },
    { name: '角せん石', sub: '長い柱の形', x: 199, y: 62 },
    { name: '輝石', sub: '短い柱の形', x: 262, y: 62 },
    { name: 'カンラン石', sub: '丸みのある粒', x: 136, y: 142 },
    { name: '磁鉄鉱', sub: '磁石につく', x: 199, y: 142 },
  ]
  return (
    <svg viewBox="0 0 300 204" className="h-auto w-full" role="img" aria-label="主な鉱物" data-subject-diagram="minerals">
      <Panel x={4} y={4} w={92} h={196} title="無色鉱物" />
      <Panel x={102} y={4} w={194} h={196} title="有色鉱物" tone="green" />
      <path d="M42,62 L42,46 L50,36 L58,46 L58,62 Z" fill="#f8fafc" stroke="#94a3b8" />
      <path d="M50,36 L50,62 M42,46 L50,50 L58,46" fill="none" stroke="#cbd5e1" />
      <path d="M38,124 L58,124 L58,142 L38,142 Z" fill="#fde2e2" stroke="#a8a29e" />
      <path d="M38,124 L46,116 L66,116 L58,124 Z" fill="#fff1f2" stroke="#a8a29e" />
      <path d="M58,124 L66,116 L66,134 L58,142 Z" fill="#fbcfe8" stroke="#a8a29e" />
      <path d="M42,128 L54,128 M42,133 L54,133 M42,138 L54,138" stroke="#e7b8b8" />
      {[50, 45, 40].map((y, index) => (
        <path key={y} d={`M124,${y} L130,${y - 5} L142,${y - 5} L148,${y} L142,${y + 5} L130,${y + 5} Z`} fill={index === 2 ? '#78716c' : '#44403c'} stroke="#1c1917" strokeWidth="0.8" />
      ))}
      {prism(199, 44, 46, 11, -22, '#14532d', '#052e16')}
      {prism(262, 44, 24, 15, -10, '#3f6212', '#1a2e05')}
      {[[128, 126, 7, 6], [141, 122, 6, 5], [138, 132, 6.5, 5.5]].map(([cx, cy, rx, ry]) => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#a3e635" stroke="#3f6212" />
      ))}
      {[[192, 126], [203, 120]].map(([x, y]) => <path key={x} d={`M${x},${y - 7} L${x + 6},${y} L${x},${y + 7} L${x - 6},${y} Z`} fill="#111827" stroke="#000000" />)}
      <path d="M214,114 L214,130 Q214,136 220,136 Q226,136 226,130 L226,114" fill="none" stroke="#ef4444" strokeWidth="4" />
      {cells.map((cell) => (
        <g key={cell.name}>
          <T x={cell.x} y={cell.y + 20} size={9.5} weight="800" anchor="middle">{cell.name}</T>
          <T x={cell.x} y={cell.y + 33} size={8.5} anchor="middle" color={MUTED}>{cell.sub}</T>
        </g>
      ))}
      <T x={262} y={132} size={8.5} anchor="middle" color={GREEN}>{'有色鉱物が\n多いほど\n岩石は黒っぽい'}</T>
    </svg>
  )
}

// ── 火山の恵みと災害 ───────────────────────────────────────────────────────
//   { name: 'volcanoLife' }
// 左に恵み（温泉・地熱発電・美しい景観）、右に災害（噴石・溶岩流・火砕流・火山灰）。下は、ハザードマップによる備え。
function VolcanoLifeDiagram() {
  const random = steady(9)
  const ash = Array.from({ length: 36 }, () => [244 + random() * 52, 70 + random() * 80])
  return (
    <svg viewBox="0 0 300 216" className="h-auto w-full" role="img" aria-label="火山の恵みと災害" data-subject-diagram="volcanoLife">
      <rect x="0" y="170" width="300" height="26" fill="#f5f5f4" />
      <ellipse cx="62" cy="196" rx="44" ry="11" fill="#fca5a5" />
      {ash.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="1.1" fill="#9ca3af" />)}
      <ellipse cx="150" cy="58" rx="14" ry="9" fill="#e5e7eb" stroke="#9ca3af" />
      <ellipse cx="160" cy="46" rx="12" ry="8" fill="#e5e7eb" stroke="#9ca3af" />
      <path d="M80,170 L140,74 L160,74 L220,170 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="1.2" />
      <path d="M158,76 Q172,100 182,126 Q188,142 198,156 L190,158 Q180,142 174,128 Q166,104 154,80 Z" fill="#fb923c" stroke="#c2410c" />
      {[[204, 158, 10], [216, 162, 9], [226, 156, 11], [238, 164, 8], [212, 150, 8]].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#9ca3af" stroke="#6b7280" />
      ))}
      <path d="M144,72 Q170,40 186,60" fill="none" stroke="#a8a29e" strokeDasharray="2 2" />
      <path d="M186,60 L190,64 L185,67 L181,63 Z" fill="#44403c" />
      <path d="M252,170 L252,158 L260,151 L268,158 L268,170 Z M272,170 L272,160 L280,153 L288,160 L288,170 Z" fill="#fef3c7" stroke="#b45309" />
      <line x1="0" y1="170" x2="300" y2="170" stroke="#78716c" />
      <ellipse cx="28" cy="166" rx="18" ry="4" fill="#bae6fd" stroke="#0284c7" />
      <path d="M22,158 Q19,154 22,150 Q25,146 22,142 M30,158 Q27,154 30,150 Q33,146 30,142" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
      <rect x="52" y="148" width="22" height="22" fill="#e2e8f0" stroke="#64748b" />
      <path d="M56,148 L58,136 L66,136 L68,148 Z" fill="#cbd5e1" stroke="#64748b" />
      <path d="M62,134 Q58,128 62,122" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="63" y1="170" x2="63" y2="190" stroke="#64748b" strokeWidth="2" />
      <T x={6} y={16} size={11} weight="800" color={GREEN}>恵み</T>
      <T x={294} y={16} size={11} weight="800" anchor="end" color={RED}>災害</T>
      <T x={28} y={134} size={9.5} weight="800" anchor="middle" color={GREEN}>温泉</T>
      <T x={63} y={114} size={9.5} weight="800" anchor="middle" color={GREEN}>地熱発電</T>
      <T x={63} y={190} size={8.5} anchor="middle" color={RED}>地下の熱</T>
      <Callout from={[138, 80]} to={[100, 52]} text="美しい景観" color={GREEN} />
      <Callout from={[186, 63]} to={[204, 40]} text="噴石" color={RED} />
      <T x={294} y={58} size={9.5} weight="800" anchor="end" color={RED}>火山灰</T>
      <T x={294} y={70} size={8.5} anchor="end" color={RED}>交通や農業に被害</T>
      <Callout from={[184, 124]} to={[214, 108]} text="溶岩流" color={RED} />
      <T x={196} y={188} size={9} weight="800" color={RED}>火砕流：高速で流れ下る</T>
      <T x={6} y={208} size={8.5}>備え：ハザードマップで、危険な場所と避難先を知る</T>
    </svg>
  )
}

// ── 震度とマグニチュード ─────────────────────────────────────────────────────
//   { name: 'quakeScale' }
// 上：1つの地震でも、ゆれの大きさ（震度）は場所ごとにちがい、ふつう震央から遠いほど小さくなる（例）。マグニチュードは1つの地震に1つの値。
// 下：マグニチュードが1大きいとエネルギーは約32倍、2大きいと約1000倍。小さな正方形1つが、もとの地震のエネルギー。
function QuakeScaleDiagram() {
  const cx = 84
  const cy = 76
  const rings = [
    { rx: 70, ry: 45, fill: '#fef9c3' },
    { rx: 56, ry: 36, fill: '#fde68a' },
    { rx: 40, ry: 26, fill: '#fdba74' },
    { rx: 22, ry: 15, fill: '#f87171' },
  ]
  const unit = 3
  const grid = (x, y, cols, rows) => {
    const lines = []
    for (let i = 1; i < cols; i += 1) lines.push(`M${x + i * unit},${y} L${x + i * unit},${y + rows * unit}`)
    for (let j = 1; j < rows; j += 1) lines.push(`M${x},${y + j * unit} L${x + cols * unit},${y + j * unit}`)
    return (
      <g>
        <rect x={x} y={y} width={cols * unit} height={rows * unit} fill="#fecaca" stroke="#b91c1c" strokeWidth="1" />
        <path d={lines.join(' ')} stroke="#ef4444" strokeOpacity="0.45" strokeWidth="0.5" />
      </g>
    )
  }
  return (
    <svg viewBox="0 0 300 262" className="h-auto w-full" role="img" aria-label="震度とマグニチュード" data-subject-diagram="quakeScale">
      <T x={6} y={14} size={9.5} weight="800">震度：場所ごとのゆれの大きさ（例）</T>
      {rings.map((ring) => <ellipse key={ring.rx} cx={cx} cy={cy} rx={ring.rx} ry={ring.ry} fill={ring.fill} stroke="#ffffff" />)}
      <path d={`M${cx - 4},${cy - 4} L${cx + 4},${cy + 4} M${cx + 4},${cy - 4} L${cx - 4},${cy + 4}`} stroke={INK} strokeWidth="2" />
      <Callout from={[cx - 3, cy - 3]} to={[34, 30]} text="震央" size={9} />
      <T x={cx} y={cy + 13} size={9} weight="800" anchor="middle">6弱</T>
      {[['5強', 31], ['5弱', 48], ['4', 63], ['3', 78]].map(([text, dx]) => (
        <T key={text} x={cx + dx} y={cy + 4} size={9} weight="800" anchor="middle">{text}</T>
      ))}
      <T x={172} y={42} size={10} weight="800">マグニチュード</T>
      <T x={172} y={66} size={18} weight="800" color={RED}>M7.0</T>
      <T x={172} y={82} size={8.5}>1つの地震に1つの値</T>
      <T x={172} y={100} size={8.5}>震央から遠いほど、</T>
      <T x={172} y={112} size={8.5}>震度は小さくなる</T>
      <line x1="4" y1="126" x2="296" y2="126" stroke="#cbd5e1" />
      <T x={6} y={142} size={9.5} weight="800">マグニチュードとエネルギーの大きさ</T>
      {grid(8, 154, 32, 32)}
      <rect x={120} y={190} width={unit} height={unit} fill="#b91c1c" />
      {grid(118, 226, 4, 8)}
      <line x1="104" y1="166" x2="134" y2="166" stroke={LINE} strokeWidth="0.8" />
      <T x={138} y={169.5} size={9} weight="800" color={RED}>Mが2大きい → 約1000倍</T>
      <T x={138} y={194.5} size={8.5}>もとの地震のエネルギー（1）</T>
      <T x={138} y={214} size={8.5} color={MUTED}>（小さな正方形1つ分）</T>
      <T x={138} y={241.5} size={9} weight="800" color={RED}>Mが1大きい → 約32倍</T>
    </svg>
  )
}

// ── 緊急地震速報のしくみ ───────────────────────────────────────────────────────
//   { name: 'earlyWarning' }
// 震源からP波（速く伝わる小さなゆれ）とS波（おそく伝わる大きなゆれ）が同時に出る。震源に近い観測点がP波をとらえると、
// 気象庁が震源と規模を計算して緊急地震速報を出す。速報（電波）は、S波の大きなゆれが届く前に、はなれた所へ届く。
function EarlyWarningDiagram() {
  const star = (x, y, r) => {
    const points = []
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5
      const radius = i % 2 ? r * 0.45 : r
      points.push(`${(x + radius * Math.cos(angle)).toFixed(1)},${(y + radius * Math.sin(angle)).toFixed(1)}`)
    }
    return <path d={`M${points.join(' L')} Z`} fill={RED} stroke="#7f1d1d" strokeWidth="0.8" />
  }
  const house = (x) => <path d={`M${x},70 L${x},58 L${x + 11},49 L${x + 22},58 L${x + 22},70 Z`} fill="#fef3c7" stroke="#b45309" />
  return (
    <svg viewBox="0 0 300 258" className="h-auto w-full" role="img" aria-label="緊急地震速報のしくみ" data-subject-diagram="earlyWarning">
      <rect x="0" y="70" width="300" height="126" fill="#f5f5f4" />
      <path d="M0,110 Q80,104 160,112 T300,108 M0,150 Q90,144 170,152 T300,148" fill="none" stroke="#e7e5e4" strokeWidth="1.2" />
      <line x1="0" y1="70" x2="300" y2="70" stroke="#78716c" strokeWidth="1.4" />
      <path d="M119.5,70 A110,110 0 0 1 143.9,196" fill="none" stroke={BLUE} strokeWidth="1.8" strokeDasharray="5 3" />
      <path d="M-19,138.9 A64,64 0 1 1 88.5,196" fill="none" stroke={RED} strokeWidth="2.4" />
      {star(44, 150, 9)}
      <T x={44} y={176} size={9.5} weight="800" anchor="middle" color={RED}>震源</T>
      <path d="M62,70 L62,60 L70,54 L78,60 L78,70 Z" fill="#e2e8f0" stroke="#475569" />
      <T x={70} y={36} size={8.5} weight="800" anchor="middle">震源に近い</T>
      <T x={70} y={48} size={8.5} weight="800" anchor="middle">観測点</T>
      <rect x="138" y="46" width="24" height="24" fill="#e2e8f0" stroke="#475569" />
      <T x={150} y={38} size={9} weight="800" anchor="middle">気象庁</T>
      <Arrow from={[82, 60]} to={[134, 58]} color={MUTED} width={1.2} head={5} dashed />
      <path d="M166,56 L174,50 L182,60 L190,50 L198,60 L206,50 L214,60 L222,50 L230,56" fill="none" stroke={RED} strokeWidth="1.6" />
      <path d="M236,56 L228,51 L229,60 Z" fill={RED} />
      <T x={198} y={42} size={9} weight="800" anchor="middle" color={RED}>緊急地震速報</T>
      {house(242)}
      {house(268)}
      <T x={266} y={16} size={8.5} anchor="middle">大きなゆれの</T>
      <T x={266} y={28} size={8.5} anchor="middle">前に知らせる</T>
      <line x1="8" y1="210" x2="28" y2="210" stroke={BLUE} strokeWidth="1.8" strokeDasharray="5 3" />
      <T x={32} y={213.5} size={8.5}>P波：速く伝わる、小さなゆれ</T>
      <line x1="8" y1="224" x2="28" y2="224" stroke={RED} strokeWidth="2.4" />
      <T x={32} y={227.5} size={8.5}>S波：おそく伝わる、大きなゆれ</T>
      <Arrow from={[8, 242]} to={[292, 242]} color={LINE} width={1.2} head={5} />
      {[[16, 'P波をとらえる', 'start'], [118, '速報が届く', 'middle'], [252, '大きなゆれ（S波）', 'middle']].map(([x, text, anchor]) => (
        <g key={text}>
          <line x1={x} x2={x} y1={238} y2={246} stroke={LINE} strokeWidth="1.4" />
          <T x={anchor === 'start' ? x - 6 : x} y={256} size={8.5} anchor={anchor}>{text}</T>
        </g>
      ))}
      <T x={185} y={237} size={8.5} weight="800" anchor="middle" color={RED}>数秒〜数十秒</T>
    </svg>
  )
}

// ── たい積岩 ─────────────────────────────────────────────────────────────
//   { name: 'sedimentaryRocks' }
// 上の段は粒の大きさで分けるたい積岩（流水で運ばれたので粒は丸い）。下の段は、生物の殻などからできた石灰岩・チャートと、火山灰などからできた凝灰岩（粒は角ばっている）。
function SedimentaryRocksDiagram() {
  const random = steady(3)
  const inside = (cx, cy, r, margin) => {
    for (;;) {
      const x = cx + (random() * 2 - 1) * r
      const y = cy + (random() * 2 - 1) * r
      if (Math.hypot(x - cx, y - cy) <= r - margin) return [x, y]
    }
  }
  const samples = [
    { name: 'れき岩', sub: 'れき（2mm以上）', x: 52, y: 46, base: '#e7e5e4' },
    { name: '砂岩', sub: '砂（約0.06〜2mm）', x: 150, y: 46, base: '#e7d8b8' },
    { name: '泥岩', sub: '泥（約0.06mm以下）', x: 248, y: 46, base: '#a8a29e' },
    { name: '石灰岩', sub: '塩酸で二酸化炭素が出る', x: 52, y: 152, base: '#e5e7eb' },
    { name: 'チャート', sub: 'とてもかたい', x: 150, y: 152, base: '#57534e' },
    { name: '凝灰岩', sub: '角ばった粒（火山灰など）', x: 248, y: 152, base: '#f5f5f4' },
  ]
  const r = 26
  const texture = {
    れき岩: (x, y) => Array.from({ length: 9 }, (_, i) => {
      const [px, py] = inside(x, y, r, 8)
      return <ellipse key={i} cx={px} cy={py} rx={5 + random() * 3} ry={4 + random() * 2.5} fill={['#a8a29e', '#78716c', '#d6d3d1'][i % 3]} stroke="#57534e" strokeWidth="0.6" />
    }),
    砂岩: (x, y) => Array.from({ length: 70 }, (_, i) => {
      const [px, py] = inside(x, y, r, 2)
      return <circle key={i} cx={px} cy={py} r={1.6} fill={i % 2 ? '#d6b98c' : '#a8a29e'} />
    }),
    泥岩: (x, y) => Array.from({ length: 110 }, (_, i) => {
      const [px, py] = inside(x, y, r, 1)
      return <circle key={i} cx={px} cy={py} r={0.5} fill="#78716c" />
    }),
    石灰岩: (x, y) => Array.from({ length: 9 }, (_, i) => {
      const [px, py] = inside(x, y, r, 6)
      return <path key={i} d={`M${px - 4},${py} A4,4 0 0 1 ${px + 4},${py}`} fill="none" stroke="#94a3b8" strokeWidth="1.2" />
    }),
    チャート: (x, y) => [<path key="band" d={`M${x - 24},${y - 6} Q${x},${y - 12} ${x + 24},${y - 4} M${x - 22},${y + 8} Q${x},${y + 2} ${x + 22},${y + 10}`} fill="none" stroke="#78716c" strokeWidth="2" />],
    凝灰岩: (x, y) => Array.from({ length: 26 }, (_, i) => {
      const [px, py] = inside(x, y, r, 4)
      const s = 2 + random() * 2
      return <path key={i} d={`M${px - s},${py + s} L${px + s * 0.8},${py + s * 0.6} L${px},${py - s} Z`} fill={['#cbd5e1', '#fde68a', '#94a3b8'][i % 3]} stroke="#64748b" strokeWidth="0.4" />
    }),
  }
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="たい積岩の種類" data-subject-diagram="sedimentaryRocks">
      <T x={6} y={12} size={9} weight="800" color={MUTED}>粒の大きさで分ける（流水で運ばれ、粒は丸い）</T>
      <T x={6} y={118} size={9} weight="800" color={MUTED}>生物の殻や、火山灰などからできる</T>
      {samples.map((sample) => (
        <g key={sample.name}>
          <circle cx={sample.x} cy={sample.y} r={r} fill={sample.base} stroke="#57534e" strokeWidth="1.2" />
          {texture[sample.name](sample.x, sample.y)}
          <T x={sample.x} y={sample.y + 42} size={10} weight="800" anchor="middle">{sample.name}</T>
          <T x={sample.x} y={sample.y + 55} size={8.5} anchor="middle" color={MUTED}>{sample.sub}</T>
        </g>
      ))}
    </svg>
  )
}

// ── 示相化石とわかる環境 ───────────────────────────────────────────────────────
//   { name: 'faciesFossils' }
// 陸地から海までの断面。ブナ（やや寒い気候の陸地）、シジミ（河口や湖）、アサリ・ハマグリ（岸に近い浅い海）、サンゴ（あたたかくて浅い海）。
// 地層からこれらの化石が見つかると、その地層ができた当時の環境がわかる。
function FaciesFossilsDiagram() {
  const tree = (x, y) => (
    <g key={`${x}-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#78350f" strokeWidth="1.6" />
      <circle cx={x} cy={y - 3} r="6.5" fill="#65a30d" stroke="#3f6212" />
    </g>
  )
  const shell = (x, y, fill) => (
    <g key={`${x}-${y}`}>
      <path d={`M${x - 6},${y} A6,5 0 0 1 ${x + 6},${y} Z`} fill={fill} stroke="#78350f" strokeWidth="0.8" />
      <path d={`M${x},${y} L${x - 3},${y - 4} M${x},${y} L${x},${y - 5} M${x},${y} L${x + 3},${y - 4}`} stroke="#78350f" strokeWidth="0.5" />
    </g>
  )
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="示相化石とわかる環境" data-subject-diagram="faciesFossils">
      <path d="M0,62 Q16,48 30,54 Q48,34 66,50 Q80,58 92,78 Q100,90 106,98 L0,98 Z" fill="#ecfccb" stroke="#65a30d" />
      <path d="M58,62 Q70,74 66,84 Q76,92 104,97" fill="none" stroke="#38bdf8" strokeWidth="2" />
      <rect x="104" y="98" width="196" height="98" fill="#bae6fd" />
      <path d="M0,98 L106,98 L150,112 L186,118 L236,122 L254,140 L300,184 L300,196 L0,196 Z" fill="#e7d8b8" stroke="#a8a29e" />
      <line x1="104" y1="98" x2="300" y2="98" stroke="#0284c7" />
      {[[32, 48], [48, 42], [64, 50]].map(([x, y]) => tree(x, y))}
      {shell(116, 104, '#78350f')}
      {shell(142, 110, '#fde68a')}
      {shell(158, 114, '#fed7aa')}
      <path d="M208,118 L208,104 M208,110 L201,102 M208,108 L215,99 M220,120 L220,108 M220,112 L226,104 M196,118 L196,110 M196,113 L191,106" fill="none" stroke="#f97316" strokeWidth="2.6" strokeLinecap="round" />
      <T x={6} y={14} size={9.5} weight="800" color={GREEN}>ブナ</T>
      <T x={6} y={26} size={8.5}>やや寒い気候の陸地</T>
      <line x1="40" y1="30" x2="46" y2="34" stroke={LINE} strokeWidth="0.8" />
      <T x={114} y={70} size={9.5} weight="800" anchor="middle" color="#78350f">シジミ</T>
      <T x={114} y={82} size={8.5} anchor="middle">河口や湖</T>
      <line x1="115" y1="86" x2="116" y2="99" stroke={LINE} strokeWidth="0.8" />
      <T x={166} y={52} size={9.5} weight="800" anchor="middle" color="#9a3412">アサリ・ハマグリ</T>
      <T x={166} y={64} size={8.5} anchor="middle">岸に近い浅い海</T>
      <line x1="152" y1="68" x2="148" y2="106" stroke={LINE} strokeWidth="0.8" />
      <T x={250} y={52} size={9.5} weight="800" anchor="middle" color="#c2410c">サンゴ</T>
      <T x={250} y={64} size={8.5} anchor="middle">あたたかくて浅い海</T>
      <line x1="240" y1="68" x2="214" y2="100" stroke={LINE} strokeWidth="0.8" />
      <T x={294} y={150} size={8.5} anchor="end" color={MUTED}>深い海</T>
    </svg>
  )
}

// ── 金星・地球・火星の環境 ─────────────────────────────────────────────────────
//   { name: 'habitablePlanets' }
// 上：太陽からの距離（地球＝1）を、長さの比で示す。下：表面の平均温度・大気・水のようす。地球だけに液体の水（海）がある。
function HabitablePlanetsDiagram() {
  const dot = (au) => 16 + (230 * au) / 1.52
  const planets = [
    { name: '金星', au: 0.72, x: 52, r: 9.5, fill: '#fde68a', stroke: '#ca8a04', temp: '約460℃', tempColor: RED, air: '二酸化炭素の\n厚い大気', water: '液体の水は\nない' },
    { name: '地球', au: 1, x: 150, r: 10, fill: '#60a5fa', stroke: '#1d4ed8', temp: '約15℃', tempColor: GREEN, air: '窒素と酸素の\n大気', water: '液体の水\n（海）がある' },
    { name: '火星', au: 1.52, x: 248, r: 5.5, fill: '#f87171', stroke: '#b91c1c', temp: '約−60℃', tempColor: BLUE, air: '二酸化炭素の\nうすい大気', water: '水は氷として\nある' },
  ]
  return (
    <svg viewBox="0 0 300 230" className="h-auto w-full" role="img" aria-label="金星・地球・火星の環境" data-subject-diagram="habitablePlanets">
      <T x={6} y={12} size={8.5} color={MUTED}>太陽からの距離（地球＝1）</T>
      <circle cx="4" cy="38" r="14" fill="#fbbf24" />
      <line x1="16" x2="252" y1="38" y2="38" stroke="#cbd5e1" strokeWidth="1.4" />
      {planets.map((planet) => (
        <g key={planet.name}>
          <line x1={dot(planet.au)} y1={42} x2={planet.x} y2={70} stroke="#cbd5e1" strokeDasharray="3 2" />
          <circle cx={dot(planet.au)} cy={38} r="4" fill={planet.fill} stroke={planet.stroke} />
          <T x={dot(planet.au)} y={30} size={8.5} weight="800" anchor="middle">{String(planet.au)}</T>
        </g>
      ))}
      {planets.map((planet) => (
        <g key={`${planet.name}-card`}>
          <rect x={planet.x - 46} y={72} width="92" height="154" rx="8" fill={planet.name === '地球' ? '#eff6ff' : '#f8fafc'} stroke={planet.name === '地球' ? '#93c5fd' : '#e2e8f0'} />
          <circle cx={planet.x} cy={92} r={planet.r} fill={planet.fill} stroke={planet.stroke} />
          <T x={planet.x} y={122} size={10} weight="800" anchor="middle">{planet.name}</T>
          <T x={planet.x} y={140} size={10} weight="800" anchor="middle" color={planet.tempColor}>{planet.temp}</T>
          <T x={planet.x} y={160} size={8.5} anchor="middle">{planet.air}</T>
          <T x={planet.x} y={196} size={8.5} anchor="middle" color={planet.name === '地球' ? BLUE : MUTED}>{planet.water}</T>
        </g>
      ))}
    </svg>
  )
}

// ── SDGsの17の目標と理科 ─────────────────────────────────────────────────────
//   { name: 'sdgsGrid', highlight: { 6: '水', … } }
// 17の目標を番号で並べ、highlight の目標に色をつけて、その内容を短く書く。
function SdgsGridDiagram({ highlight = {} }) {
  const w = 44
  const h = 52
  const gap = 4
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="SDGsの17の目標" data-subject-diagram="sdgsGrid">
      {Array.from({ length: 17 }, (_, i) => {
        const n = i + 1
        const col = i % 6
        const row = Math.floor(i / 6)
        const x = 8 + col * (w + gap)
        const y = 6 + row * (h + gap)
        const text = highlight[n]
        return (
          <g key={n}>
            <rect x={x} y={y} width={w} height={h} rx="6" fill={text ? '#ccfbf1' : '#f1f5f9'} stroke={text ? '#0f766e' : '#cbd5e1'} strokeWidth={text ? 1.6 : 1} />
            <text x={x + w / 2} y={y + 18} fontSize="13" fontWeight="800" textAnchor="middle" fill={text ? '#134e4a' : '#94a3b8'}>{n}</text>
            {text && <T x={x + w / 2} y={y + 33} size={8.5} weight="800" anchor="middle" color="#134e4a" halo="#ccfbf1" gap={10.5}>{text}</T>}
          </g>
        )
      })}
      <rect x="8" y="182" width="12" height="10" rx="2" fill="#ccfbf1" stroke="#0f766e" />
      <T x={24} y={191} size={8.5}>理科の学習とつながりが深い目標（表の6つ）</T>
    </svg>
  )
}

export const EARTH_DIAGRAMS = Object.freeze({
  volcanicEjecta: VolcanicEjectaDiagram,
  minerals: MineralsDiagram,
  volcanoLife: VolcanoLifeDiagram,
  quakeScale: QuakeScaleDiagram,
  earlyWarning: EarlyWarningDiagram,
  sedimentaryRocks: SedimentaryRocksDiagram,
  faciesFossils: FaciesFossilsDiagram,
  habitablePlanets: HabitablePlanetsDiagram,
  sdgsGrid: SdgsGridDiagram,
})
