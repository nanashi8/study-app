// 理科（生物）の図解。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。部分の名前は引き出し線の先に書く。
import { AMBER, Arrow, BLUE, Callout, CurvedArrow, GREEN, INK, LINE, MUTED, Num, Panel, RED, T, steady } from './SubjectScienceParts.jsx'

// ── 双眼実体顕微鏡 ───────────────────────────────────────────────────────
//   { name: 'stereoMicroscope' }
// 正面から見た双眼実体顕微鏡。接眼レンズ・視度調節リング・鏡筒・粗動ねじ・微動ねじ・対物レンズ・ステージの名前を示す。
// ①〜③は、ピントの合わせ方の手順（①鏡筒の間隔を目の幅に合わせる、②右目で微動ねじ、③左目で視度調節リング）の場所。
function tubePath(x1, y1, x2, y2, w) {
  const length = Math.hypot(x2 - x1, y2 - y1)
  const nx = (-(y2 - y1) / length) * (w / 2)
  const ny = ((x2 - x1) / length) * (w / 2)
  return `M${x1 + nx},${y1 + ny} L${x2 + nx},${y2 + ny} L${x2 - nx},${y2 - ny} L${x1 - nx},${y1 - ny} Z`
}
function StereoMicroscopeDiagram() {
  const left = { from: [126, 110], to: [110, 52] }
  const right = { from: [156, 110], to: [172, 52] }
  const along = (tube, t) => [tube.to[0] + (tube.from[0] - tube.to[0]) * t, tube.to[1] + (tube.from[1] - tube.to[1]) * t]
  const ring = along(left, 0.22)
  const ringEnd = along(left, 0.32)
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="双眼実体顕微鏡の各部の名前" data-subject-diagram="stereoMicroscope">
      <rect x="62" y="204" width="176" height="18" rx="5" fill="#94a3b8" stroke={LINE} />
      <ellipse cx="140" cy="205" rx="40" ry="5" fill="#f1f5f9" stroke={LINE} />
      <rect x="210" y="94" width="14" height="112" fill="#cbd5e1" stroke={LINE} />
      <rect x="207" y="90" width="20" height="6" rx="2" fill="#94a3b8" stroke={LINE} />
      <rect x="168" y="112" width="62" height="24" rx="4" fill="#cbd5e1" stroke={LINE} />
      <rect x="230" y="120" width="5" height="8" fill="#64748b" />
      <circle cx="239" cy="124" r="6.5" fill="#64748b" stroke={LINE} />
      <circle cx="192" cy="124" r="9" fill="#64748b" stroke={LINE} />
      <circle cx="192" cy="124" r="3.5" fill="#94a3b8" />
      <rect x="108" y="106" width="66" height="46" rx="8" fill="#e2e8f0" stroke={LINE} />
      <path d="M124,152 L158,152 L153,168 L129,168 Z" fill="#94a3b8" stroke={LINE} />
      <ellipse cx="141" cy="168" rx="12" ry="2.5" fill="#bae6fd" stroke={LINE} strokeWidth="0.8" />
      <path d={tubePath(...left.from, ...left.to, 14)} fill="#e2e8f0" stroke={LINE} />
      <path d={tubePath(...right.from, ...right.to, 14)} fill="#e2e8f0" stroke={LINE} />
      <path d={tubePath(...ring, ...ringEnd, 19)} fill="#fbbf24" stroke={AMBER} />
      <path d={tubePath(110, 52, 107, 38, 17)} fill="#334155" stroke={LINE} />
      <path d={tubePath(172, 52, 175, 38, 17)} fill="#334155" stroke={LINE} />
      <line x1="104" y1="26" x2="178" y2="26" stroke={AMBER} strokeWidth="1.2" />
      <path d="M104,26 l6,-3.5 v7 Z M178,26 l-6,-3.5 v7 Z" fill={AMBER} />
      <Callout from={[176, 42]} to={[212, 30]} text="接眼レンズ" />
      <Callout from={[167, 78]} to={[212, 70]} text="鏡筒" />
      <Callout from={[ring[0] - 4, ring[1] + 2]} to={[80, 66]} text="視度調節リング" />
      <Callout from={[239, 124]} to={[248, 100]} text="粗動ねじ" />
      <Callout from={[196, 131]} to={[248, 156]} text="微動ねじ" />
      <Callout from={[131, 164]} to={[90, 180]} text="対物レンズ" />
      <Callout from={[114, 205]} to={[60, 194]} text="ステージ" />
      <Num x={141} y={14} n="1" />
      <Num x={192} y={103} n="2" />
      <Num x={141} y={62} n="3" />
    </svg>
  )
}

// ── スケッチのしかた ─────────────────────────────────────────────────────────
//   { name: 'sketchRules' }
// 同じ葉を、左はよいかき方（細い1本の線・小さな点・言葉で書きそえる）で、右はよくないかき方（線を重ねる・影やぬりつぶし・まわりの景色）でかいたもの。
const leafPath = (cx) => `M${cx},44 C${cx + 30},62 ${cx + 32},104 ${cx},134 C${cx - 32},104 ${cx - 30},62 ${cx},44 Z`
function leafVeins(cx) {
  return [70, 86, 102, 118].flatMap((y, index) => {
    const reach = [16, 21, 21, 15][index]
    return [`M${cx},${y} L${cx + reach},${y - 13}`, `M${cx},${y} L${cx - reach},${y - 13}`]
  })
}
function SketchRulesDiagram() {
  const random = steady(7)
  const dots = []
  while (dots.length < 34) {
    const x = 61 + random() * 22
    const y = 64 + random() * 58
    const halfWidth = 26 * Math.sin(((y - 44) / 90) * Math.PI)
    if (x - 58 < halfWidth - 3) dots.push([x, y])
  }
  return (
    <svg viewBox="0 0 300 204" className="h-auto w-full" role="img" aria-label="よいスケッチとよくないスケッチ" data-subject-diagram="sketchRules">
      <Panel x={4} y={4} w={144} h={196} title="○ よいかき方" tone="green" />
      <Panel x={152} y={4} w={144} h={196} title="× よくないかき方" tone="red" />
      {/* よい例：細い1本の線と、小さな点 */}
      <path d={leafPath(58)} fill="#ffffff" stroke={INK} strokeWidth="1" />
      <path d={`M58,48 L58,132 M58,134 L58,146 ${leafVeins(58).join(' ')}`} fill="none" stroke={INK} strokeWidth="0.8" />
      {dots.map(([x, y]) => <circle key={`${x.toFixed(1)}-${y.toFixed(1)}`} cx={x} cy={y} r="0.9" fill={INK} />)}
      <line x1="86" y1="80" x2="96" y2="74" stroke={MUTED} strokeWidth="0.8" />
      <T x={98} y={70} size={8.5} color={GREEN}>{'うらは\n白っぽい'}</T>
      <T x={12} y={164} size={8.5} color={GREEN}>{'・細い1本の線ではっきりかく\n・明るさは小さな点で表す\n・気づいたことは言葉で書く'}</T>
      {/* よくない例：線を重ねる・影をつける・ぬりつぶす・まわりの景色 */}
      <circle cx="272" cy="36" r="10" fill="#fde68a" stroke="#d97706" />
      <path d="M272,20 L272,15 M272,52 L272,57 M256,36 L251,36 M288,36 L293,36 M261,25 L258,22 M283,25 L286,22 M261,47 L258,50 M283,47 L286,50" stroke="#d97706" strokeWidth="1.2" />
      <path d="M160,148 L288,148 M168,148 L164,140 M176,148 L178,139 M262,148 L258,139 M274,148 L277,140 M282,148 L285,141" stroke="#65a30d" strokeWidth="1.2" fill="none" />
      <ellipse cx="214" cy="140" rx="26" ry="5" fill="#94a3b8" opacity="0.6" />
      <path d={leafPath(206)} fill="#9ca3af" opacity="0.55" />
      {[[0, 0, 1.3], [1.8, -1.3, 1], [-1.6, 1.6, 1], [0.8, 2.2, 0.8]].map(([dx, dy, width]) => (
        <path key={`${dx}-${dy}`} d={leafPath(206)} transform={`translate(${dx} ${dy})`} fill="none" stroke={INK} strokeWidth={width} />
      ))}
      <path d={`M206,48 L206,132 M206,134 L206,146 ${leafVeins(206).join(' ')}`} fill="none" stroke={INK} strokeWidth="1.6" />
      <T x={160} y={164} size={8.5} color={RED}>{'・線を重ねてかく\n・影をつける・ぬりつぶす\n・まわりの景色もかく'}</T>
    </svg>
  )
}

// ── めしべが果実と種子になる ───────────────────────────────────────────────────
//   { name: 'pistilToFruit' }
// 左は受粉したばかりのめしべ（柱頭に花粉がついている）、右は成長した果実。同じ色の部分が成長して変わる：子房（緑）→果実、胚珠（黄）→種子。
function PistilToFruitDiagram() {
  const ovary = '#bbf7d0'
  const seed = '#fde68a'
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="めしべが果実と種子になる" data-subject-diagram="pistilToFruit">
      <rect x="67" y="38" width="6" height="34" fill={ovary} stroke={GREEN} />
      <ellipse cx="70" cy="36" rx="10" ry="5" fill="#fef9c3" stroke={GREEN} />
      {[[63, 31], [71, 30], [77, 33]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.4" fill="#f59e0b" stroke={AMBER} strokeWidth="0.6" />)}
      <ellipse cx="70" cy="118" rx="22" ry="47" fill={ovary} stroke={GREEN} strokeWidth="1.4" />
      {[88, 108, 128, 148].map((y) => (
        <g key={y}>
          <line x1="77" y1={y} x2="88" y2={y} stroke={GREEN} strokeWidth="1" />
          <ellipse cx="70" cy={y} rx="7" ry="6" fill={seed} stroke={AMBER} />
        </g>
      ))}
      <path d="M228,40 L227,26" stroke="#a16207" strokeWidth="2" />
      <ellipse cx="228" cy="110" rx="34" ry="72" fill="#86efac" stroke={GREEN} strokeWidth="1.6" />
      {[66, 96, 126, 156].map((y) => <circle key={y} cx="228" cy={y} r="12" fill={seed} stroke={AMBER} strokeWidth="1.2" />)}
      <Arrow from={[106, 104]} to={[176, 104]} color={LINE} width={2.2} head={8} />
      <T x={141} y={96} size={9} anchor="middle">受粉すると成長</T>
      <T x={141} y={124} size={9.5} weight="800" anchor="middle" color={GREEN}>子房 → 果実</T>
      <T x={141} y={147} size={9.5} weight="800" anchor="middle" color={AMBER}>胚珠 → 種子</T>
      <Callout from={[79, 35]} to={[96, 22]} text="柱頭" />
      <Callout from={[63, 31]} to={[36, 18]} text="花粉" />
      <Callout from={[49, 112]} to={[28, 112]} text="子房" color={GREEN} />
      <Callout from={[75, 150]} to={[100, 172]} text="胚珠" color={AMBER} />
      <Callout from={[200, 70]} to={[186, 52]} text="果実" color={GREEN} />
      <Callout from={[218, 162]} to={[186, 178]} text="種子" color={AMBER} />
    </svg>
  )
}

// ── カエルの成長と呼吸 ─────────────────────────────────────────────────────────
//   { name: 'frogLifeCycle' }
// 卵は水中にうまれ、子（オタマジャクシ）は水中でえらと皮膚で呼吸する。成長した親（カエル）は陸上でも生活し、肺と皮膚で呼吸する。
function FrogLifeCycleDiagram() {
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="カエルの成長と呼吸の変化" data-subject-diagram="frogLifeCycle">
      <rect x="0" y="80" width="232" height="116" fill="#e0f2fe" />
      <path d="M0,80 Q12,76 24,80 T48,80 T72,80 T96,80 T120,80 T144,80 T168,80 T192,80 T216,80 L228,80" fill="none" stroke="#0284c7" strokeWidth="1.2" />
      <path d="M196,196 L222,80 L242,56 L300,56 L300,196 Z" fill="#ecfccb" stroke="#65a30d" strokeWidth="1.2" />
      <T x={8} y={98} size={10} weight="800" color="#0369a1">水中</T>
      <T x={290} y={186} size={10} weight="800" anchor="end" color="#3f6212">陸上</T>
      {/* 卵 */}
      <ellipse cx="36" cy="128" rx="24" ry="17" fill="#f0f9ff" stroke="#7dd3fc" />
      {[[24, 122], [36, 119], [48, 123], [28, 134], [40, 132], [51, 136], [18, 131]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="4.3" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
          <circle cx={x} cy={y} r="1.8" fill="#1f2937" />
        </g>
      ))}
      {/* オタマジャクシ */}
      <path d="M118,124 Q132,116 142,126 Q148,131 156,124 L156,127 Q148,135 142,131 Q132,123 118,134 Z" fill="#57534e" />
      <ellipse cx="110" cy="128" rx="11" ry="8" fill="#57534e" />
      <circle cx="104" cy="125" r="1.7" fill="#ffffff" />
      {/* カエル（右を向いてすわっている） */}
      <ellipse cx="251" cy="50" rx="10" ry="6" fill="#4d7c0f" stroke="#365314" />
      <ellipse cx="263" cy="45" rx="18" ry="10" transform="rotate(-12 263 45)" fill="#65a30d" stroke="#365314" />
      <path d="M243,55 L262,55" stroke="#365314" strokeWidth="2" strokeLinecap="round" />
      <path d="M272,49 L275,55 L280,55" fill="none" stroke="#365314" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="276" cy="35" r="4.5" fill="#65a30d" stroke="#365314" />
      <circle cx="277" cy="34" r="1.8" fill="#1f2937" />
      <path d="M272,44 Q277,46 281,42" fill="none" stroke="#365314" strokeWidth="0.9" />
      <CurvedArrow from={[64, 128]} to={[94, 128]} bend={-6} color={LINE} />
      <CurvedArrow from={[160, 116]} to={[236, 44]} bend={-18} color={LINE} />
      <T x={196} y={108} size={8.5} anchor="middle" color={LINE}>成長する</T>
      <T x={36} y={160} size={10} weight="800" anchor="middle">卵</T>
      <T x={36} y={174} size={8.5} anchor="middle">水中にうまれる</T>
      <T x={122} y={160} size={9.5} weight="800" anchor="middle">子：オタマジャクシ</T>
      <T x={122} y={174} size={8.5} anchor="middle" color="#0369a1">えらと皮膚で呼吸</T>
      <T x={264} y={76} size={9.5} weight="800" anchor="middle">親：カエル</T>
      <T x={264} y={90} size={8.5} anchor="middle" color="#3f6212">{'肺と皮膚で呼吸\n陸上でも生活'}</T>
    </svg>
  )
}

// ── 脊椎動物の特徴の比べ方 ───────────────────────────────────────────────────────
//   { name: 'vertebrateTraits', rows: ['habitat' | 'breathing' | 'skin' | 'birth', …], arrow?: true }
// 横に5つのなかま（魚類→両生類→は虫類→鳥類→哺乳類）を並べ、行ごとに特徴の帯を引く。同じ特徴をもつなかまは1本の帯でつながる。
// 帯の色：青は水中の生活に合った特徴、黄は陸上の生活に合った特徴、緑は両生類（子と親で変わる）。arrow で下に「水中→陸上」の矢印。
const VERTEBRATES = ['魚類', '両生類', 'は虫類', '鳥類', '哺乳類']
const VERTEBRATE_WIDTHS = [43, 66, 43, 43, 43]
const TRAIT_TONES = Object.freeze({
  water: { fill: '#dbeafe', stroke: '#1d4ed8', ink: '#1e3a8a' },
  both: { fill: '#dcfce7', stroke: '#15803d', ink: '#14532d' },
  land: { fill: '#fef3c7', stroke: '#b45309', ink: '#78350f' },
  live: { fill: '#ffedd5', stroke: '#c2410c', ink: '#7c2d12' },
})
const TRAIT_ROWS = Object.freeze({
  habitat: { label: '生活場所', bands: [[0, 1, '水中', 'water'], [1, 2, '子：水中\n親：陸上と水辺', 'both'], [2, 5, '陸上', 'land']] },
  breathing: { label: '呼吸', bands: [[0, 1, 'えら', 'water'], [1, 2, '子：えらと皮膚\n親：肺と皮膚', 'both'], [2, 5, '肺', 'land']] },
  skin: { label: '体表', bands: [[0, 1, 'うろこ', 'water'], [1, 2, 'しめった皮膚', 'both'], [2, 3, 'うろこ', 'land'], [3, 4, '羽毛', 'land'], [4, 5, '毛', 'land']] },
  birth: { label: '子の\nうまれ方', bands: [[0, 2, '卵生\n殻のない卵を水中に', 'water'], [2, 4, '卵生\n殻のある卵を陸上に', 'land'], [4, 5, '胎生\n乳で育つ', 'live']] },
})
function VertebrateTraitsDiagram({ rows = ['breathing', 'skin', 'birth'], arrow = false }) {
  const x0 = 58
  const edges = VERTEBRATE_WIDTHS.reduce((list, width) => [...list, list[list.length - 1] + width], [x0])
  const rowTop = (index) => 28 + index * 42
  const height = rowTop(rows.length) + (arrow ? 26 : 0) + 2
  return (
    <svg viewBox={`0 0 300 ${height}`} className="h-auto w-full" role="img" aria-label="脊椎動物のなかまの特徴の比べ方" data-subject-diagram="vertebrateTraits">
      {VERTEBRATES.map((name, index) => (
        <T key={name} x={(edges[index] + edges[index + 1]) / 2} y={18} size={9.5} weight="800" anchor="middle">{name}</T>
      ))}
      {edges.slice(1, -1).map((x) => <line key={x} x1={x} x2={x} y1={24} y2={rowTop(rows.length) - 4} stroke="#e2e8f0" strokeDasharray="3 3" />)}
      {rows.map((key, rowIndex) => {
        const row = TRAIT_ROWS[key]
        const top = rowTop(rowIndex)
        const labelLines = row.label.split('\n').length
        return (
          <g key={key}>
            <T x={4} y={top + 20 - (labelLines - 1) * 6} size={9.5} weight="800" color={MUTED}>{row.label}</T>
            {row.bands.map(([from, to, text, tone]) => {
              const style = TRAIT_TONES[tone]
              const x1 = edges[from] + 1.5
              const x2 = edges[to] - 1.5
              const lines = text.split('\n')
              return (
                <g key={`${from}-${to}`}>
                  <rect x={x1} y={top} width={x2 - x1} height={36} rx="6" fill={style.fill} stroke={style.stroke} strokeWidth="1" />
                  <T x={(x1 + x2) / 2} y={top + (lines.length === 1 ? 21.5 : 15)} size={lines.length === 1 ? 9.5 : 8.5} weight="800" anchor="middle" color={style.ink} halo={style.fill} gap={11.5}>{text}</T>
                </g>
              )
            })}
          </g>
        )
      })}
      {arrow && (
        <g>
          <Arrow from={[124, rowTop(rows.length) + 12]} to={[232, rowTop(rows.length) + 12]} color={MUTED} width={2} />
          <T x={120} y={rowTop(rows.length) + 15.5} size={9} weight="800" anchor="end" color="#1e3a8a">水中の生活</T>
          <T x={236} y={rowTop(rows.length) + 15.5} size={9} weight="800" color="#78350f">陸上の生活</T>
        </g>
      )}
    </svg>
  )
}

// ── 顕微鏡で見た細胞 ─────────────────────────────────────────────────────────
//   { name: 'cellViews' }
// 左からオオカナダモの葉（緑色の葉緑体）、タマネギの表皮（細長い細胞、染色した核は赤）、ヒトのほおの内側（丸みのある細胞、染色した核は赤）。
function CellViewsDiagram() {
  const fields = [52, 150, 248]
  const cy = 58
  const r = 44
  const random = steady(17)
  const elodea = []
  for (let row = -4; row <= 4; row += 1) {
    for (let col = -3; col <= 3; col += 1) {
      const x = fields[0] + col * 18 + (row % 2 ? 9 : 0) - 9
      const y = cy + row * 12 - 6
      elodea.push(
        <g key={`${row}-${col}`}>
          <rect x={x} y={y} width="17" height="11" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="0.7" />
          {[[3, 3], [8, 2.5], [13, 3.5], [4, 8], [10, 8.5], [14, 7.5]].map(([dx, dy]) => <circle key={`${dx}-${dy}`} cx={x + dx} cy={y + dy} r="1.3" fill="#15803d" />)}
        </g>,
      )
    }
  }
  const onion = []
  for (let row = -4; row <= 4; row += 1) {
    for (let col = -2; col <= 2; col += 1) {
      const x = fields[1] + col * 30 + (row % 2 ? 15 : 0) - 15
      const y = cy + row * 10 - 5
      onion.push(
        <g key={`${row}-${col}`}>
          <rect x={x} y={y} width="29" height="9.5" fill="#fff1f2" stroke="#be185d" strokeWidth="0.6" />
          <ellipse cx={x + 10 + (Math.abs(row + col) % 3) * 4} cy={y + 4.8} rx="2.4" ry="2" fill="#be123c" />
        </g>,
      )
    }
  }
  const cheek = Array.from({ length: 9 }, (_, i) => {
    const x = fields[2] - 26 + (i % 3) * 26 + (random() - 0.5) * 8
    const y = cy - 26 + Math.floor(i / 3) * 26 + (random() - 0.5) * 8
    const points = Array.from({ length: 7 }, (__, k) => {
      const angle = (k / 7) * Math.PI * 2
      const radius = 12 + random() * 4
      return `${(x + radius * Math.cos(angle)).toFixed(1)},${(y + radius * Math.sin(angle)).toFixed(1)}`
    })
    return (
      <g key={i}>
        <path d={`M${points.join(' L')} Z`} fill="#ffe4e6" stroke="#be185d" strokeWidth="0.7" />
        <circle cx={x + 1} cy={y} r="2.6" fill="#be123c" />
      </g>
    )
  })
  return (
    <svg viewBox="0 0 300 160" className="h-auto w-full" role="img" aria-label="顕微鏡で見た植物と動物の細胞" data-subject-diagram="cellViews">
      <defs>
        {fields.map((x, index) => <clipPath key={x} id={`cell-view-${index}`}><circle cx={x} cy={cy} r={r} /></clipPath>)}
      </defs>
      {fields.map((x) => <circle key={x} cx={x} cy={cy} r={r} fill="#ffffff" />)}
      <g clipPath="url(#cell-view-0)">{elodea}</g>
      <g clipPath="url(#cell-view-1)">{onion}</g>
      <g clipPath="url(#cell-view-2)">{cheek}</g>
      {fields.map((x) => <circle key={x} cx={x} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="3" />)}
      <T x={fields[0]} y={118} size={9.5} weight="800" anchor="middle">オオカナダモの葉</T>
      <T x={fields[0]} y={132} size={8.5} anchor="middle" color={GREEN}>{'緑色の葉緑体が\nたくさん見える'}</T>
      <T x={fields[1]} y={118} size={9.5} weight="800" anchor="middle">タマネギの表皮</T>
      <T x={fields[1]} y={132} size={8.5} anchor="middle" color={RED}>{'染色すると、\n核が赤く見える'}</T>
      <T x={fields[2]} y={118} size={9.5} weight="800" anchor="middle">ヒトのほおの内側</T>
      <T x={fields[2]} y={132} size={8.5} anchor="middle" color={RED}>{'丸みのある細胞。\n核が赤く見える'}</T>
    </svg>
  )
}

// ── 植物の細胞と動物の細胞のつくりの比べ方 ───────────────────────────────────────────
//   { name: 'cellPartsSets' }
// 大きなわく（緑）は植物の細胞に見られるつくり、その中の小さなわく（青）は動物の細胞にもあるつくり（核・細胞膜）。
// 小さなわくの外にある細胞壁・葉緑体・よく発達した液胞は、植物の細胞だけに見られる。
function CellPartsSetsDiagram() {
  return (
    <svg viewBox="0 0 300 210" className="h-auto w-full" role="img" aria-label="植物の細胞と動物の細胞のつくりの比べ方" data-subject-diagram="cellPartsSets">
      <ellipse cx="150" cy="104" rx="144" ry="88" fill="#f0fdf4" stroke={GREEN} strokeWidth="1.6" />
      <ellipse cx="204" cy="114" rx="78" ry="52" fill="#eff6ff" stroke={BLUE} strokeWidth="1.6" />
      <T x={150} y={12} size={9.5} weight="800" anchor="middle" color="#14532d">植物の細胞に見られるつくり</T>
      <T x={204} y={80} size={9} weight="800" anchor="middle" color="#1e3a8a">動物の細胞にもある</T>
      <circle cx="180" cy="114" r="10" fill="#7c3aed" opacity="0.8" />
      <T x={180} y={140} size={9.5} weight="800" anchor="middle">核</T>
      <rect x="216" y="102" width="34" height="24" rx="8" fill="none" stroke="#2563eb" strokeWidth="1.4" />
      <T x={233} y={140} size={9.5} weight="800" anchor="middle">細胞膜</T>
      <rect x="40" y="38" width="36" height="22" rx="2" fill="none" stroke="#15803d" strokeWidth="3" />
      <T x={84} y={53} size={9.5} weight="800" color="#14532d">細胞壁</T>
      <ellipse cx="58" cy="94" rx="12" ry="7" fill="#22c55e" stroke="#15803d" />
      <T x={84} y={98} size={9.5} weight="800" color="#14532d">葉緑体</T>
      <rect x="42" y="124" width="32" height="24" rx="10" fill="#e0f2fe" stroke="#0284c7" />
      <T x={84} y={134} size={9.5} weight="800" color="#14532d">よく発達</T>
      <T x={84} y={146} size={9.5} weight="800" color="#14532d">した液胞</T>
      <T x={150} y={205} size={8.5} anchor="middle" color={MUTED}>小さなわくの外は、植物の細胞だけに見られる</T>
    </svg>
  )
}

// ── 単細胞生物 ─────────────────────────────────────────────────────────────
//   { name: 'unicellular' }
// からだが1つの細胞でできている生物。ゾウリムシ（せん毛で泳ぐ）、アメーバ（形を変えて動く）、ミカヅキモ（緑色）、ミドリムシ（緑色で、べん毛をもつ）。
function UnicellularDiagram() {
  const cilia = []
  for (let k = 0; k < 28; k += 1) {
    const angle = (k / 28) * Math.PI * 2
    const x = 40 + 26 * Math.cos(angle)
    const y = 46 + 12 * Math.sin(angle)
    cilia.push(`M${x.toFixed(1)},${y.toFixed(1)} L${(40 + 30 * Math.cos(angle)).toFixed(1)},${(46 + 15 * Math.sin(angle)).toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 300 104" className="h-auto w-full" role="img" aria-label="単細胞生物の例" data-subject-diagram="unicellular">
      <path d={cilia.join(' ')} stroke="#a16207" strokeWidth="0.7" />
      <path d="M14,46 Q16,34 40,34 Q66,34 66,46 Q64,58 40,58 Q30,58 26,52 Q20,50 14,46 Z" fill="#fef3c7" stroke="#a16207" />
      <circle cx="44" cy="46" r="4" fill="#a16207" opacity="0.6" />
      <path d="M92,48 Q88,30 104,32 Q110,20 120,30 Q134,26 132,40 Q142,50 128,56 Q124,68 110,62 Q96,66 92,48 Z" fill="#e0e7ff" stroke="#4f46e5" />
      <circle cx="112" cy="46" r="4.5" fill="#4f46e5" opacity="0.6" />
      <path d="M160,52 Q186,20 212,52 Q186,34 160,52 Z" fill="#86efac" stroke="#15803d" />
      <path d="M244,50 Q258,36 272,44 Q280,48 272,54 Q258,62 244,50 Z" fill="#bbf7d0" stroke="#15803d" />
      <circle cx="266" cy="45" r="1.8" fill="#dc2626" />
      <path d="M273,47 Q282,40 286,48 Q290,56 296,50" fill="none" stroke="#15803d" strokeWidth="1" />
      <T x={40} y={84} size={9.5} weight="800" anchor="middle">ゾウリムシ</T>
      <T x={114} y={84} size={9.5} weight="800" anchor="middle">アメーバ</T>
      <T x={186} y={84} size={9.5} weight="800" anchor="middle">ミカヅキモ</T>
      <T x={262} y={84} size={9.5} weight="800" anchor="middle">ミドリムシ</T>
      <T x={150} y={100} size={8.5} anchor="middle" color={MUTED}>どれも、からだが1つの細胞でできている</T>
    </svg>
  )
}

// ── 多細胞生物のからだのなり立ち ───────────────────────────────────────────────
//   { name: 'bodyLevels' }
// 細胞 → 組織（形やはたらきが同じ細胞の集まり） → 器官（いくつかの組織が集まったもの） → 個体（いくつかの器官が集まった1つの生物）。例はヒトの胃。
function BodyLevelsDiagram() {
  const xs = [38, 112, 188, 262]
  const tissue = []
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) tissue.push(<rect key={`${row}-${col}`} x={94 + col * 9 + (row % 2 ? 4.5 : 0)} y={30 + row * 9} width="9" height="9" fill="#fecdd3" stroke="#be123c" strokeWidth="0.6" />)
  }
  return (
    <svg viewBox="0 0 300 156" className="h-auto w-full" role="img" aria-label="多細胞生物のからだのなり立ち" data-subject-diagram="bodyLevels">
      <rect x="26" y="36" width="24" height="18" rx="5" fill="#fecdd3" stroke="#be123c" />
      <circle cx="38" cy="45" r="3.2" fill="#be123c" />
      {tissue}
      <path d="M172,26 Q170,52 182,62 Q196,72 206,58 Q212,46 204,40 Q198,50 190,48 Q182,44 184,26 Z" fill="#fda4af" stroke="#be123c" />
      <circle cx="262" cy="22" r="7" fill="#fed7aa" stroke="#c2410c" />
      <path d="M252,32 L272,32 L270,58 L266,58 L265,76 L259,76 L258,58 L254,58 Z" fill="#fed7aa" stroke="#c2410c" />
      <path d="M252,34 L246,54 M272,34 L278,54" stroke="#c2410c" strokeWidth="3" strokeLinecap="round" />
      {xs.slice(0, 3).map((x) => <Arrow key={x} from={[x + 24, 48]} to={[x + 50, 48]} color={MUTED} width={1.6} head={6} />)}
      <T x={xs[0]} y={98} size={10} weight="800" anchor="middle">細胞</T>
      <T x={xs[0]} y={112} size={8.5} anchor="middle">{'からだを\nつくる\n基本の単位'}</T>
      <T x={xs[1]} y={98} size={10} weight="800" anchor="middle">組織</T>
      <T x={xs[1]} y={112} size={8.5} anchor="middle">{'形やはたらき\nが同じ細胞\nの集まり'}</T>
      <T x={xs[2]} y={98} size={10} weight="800" anchor="middle">器官</T>
      <T x={xs[2]} y={112} size={8.5} anchor="middle">{'組織が\n集まったもの\n例：胃'}</T>
      <T x={xs[3]} y={98} size={10} weight="800" anchor="middle">個体</T>
      <T x={xs[3]} y={112} size={8.5} anchor="middle">{'器官が\n集まった生物\n例：ヒト'}</T>
    </svg>
  )
}

// ── 昼と夜の、光合成と呼吸 ───────────────────────────────────────────────────
//   { name: 'dayNightGas' }
// 昼は光合成（太い矢印）と呼吸（細い矢印）の両方を行い、光合成のほうがさかんなので、全体として二酸化炭素をとり入れて酸素を出す。
// 夜は呼吸だけを行い、酸素をとり入れて二酸化炭素を出す。灰色の矢印は二酸化炭素、青の矢印は酸素。
function Plant({ x }) {
  return (
    <g>
      <path d={`M${x},132 L${x},70`} stroke="#15803d" strokeWidth="2.4" />
      <path d={`M${x},96 Q${x - 22},84 ${x - 26},98 Q${x - 12},106 ${x},96 Z M${x},84 Q${x + 22},72 ${x + 26},86 Q${x + 12},94 ${x},84 Z M${x},72 Q${x - 16},56 ${x},50 Q${x + 16},56 ${x},72 Z`} fill="#4ade80" stroke="#15803d" />
      <path d={`M${x - 16},132 L${x + 16},132 L${x + 12},150 L${x - 12},150 Z`} fill="#d6a26b" stroke="#92400e" />
    </g>
  )
}
function DayNightGasDiagram() {
  const co2 = '#475569'
  const o2 = '#2563eb'
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="昼と夜の光合成と呼吸による気体の出入り" data-subject-diagram="dayNightGas">
      <Panel x={4} y={4} w={144} h={188} title="昼（光が当たる）" tone="amber" />
      <Panel x={152} y={4} w={144} h={188} title="夜（光が当たらない）" tone="blue" />
      <circle cx="132" cy="18" r="7" fill="#fde047" stroke="#ca8a04" />
      <path d="M283,12 A8,8 0 1 0 288,26 A6,6 0 1 1 283,12 Z" fill="#fde68a" stroke="#ca8a04" />
      <Plant x={76} />
      <Plant x={224} />
      <Arrow from={[14, 62]} to={[56, 62]} color={co2} width={4.5} head={9} />
      <Arrow from={[96, 62]} to={[138, 62]} color={o2} width={4.5} head={9} />
      <T x={35} y={52} size={8.5} weight="800" anchor="middle" color={co2}>二酸化炭素</T>
      <T x={117} y={52} size={8.5} weight="800" anchor="middle" color={o2}>酸素</T>
      <T x={76} y={40} size={8.5} weight="800" anchor="middle" color="#92400e">光合成（さかん）</T>
      <Arrow from={[16, 112]} to={[52, 112]} color={o2} width={1.3} head={5} />
      <Arrow from={[100, 112]} to={[136, 112]} color={co2} width={1.3} head={5} />
      <T x={34} y={126} size={8.5} anchor="middle" color={o2}>酸素</T>
      <T x={118} y={126} size={8.5} anchor="middle" color={co2}>二酸化炭素</T>
      <T x={34} y={104} size={8.5} weight="800" anchor="middle" color="#92400e">呼吸</T>
      <T x={76} y={168} size={8.5} anchor="middle">{'全体として、二酸化炭素を\nとり入れ、酸素を出す'}</T>
      <Arrow from={[162, 120]} to={[200, 120]} color={o2} width={2} head={6} />
      <Arrow from={[248, 120]} to={[286, 120]} color={co2} width={2} head={6} />
      <T x={181} y={110} size={8.5} weight="800" anchor="middle" color={o2}>酸素</T>
      <T x={267} y={110} size={8.5} weight="800" anchor="middle" color={co2}>二酸化炭素</T>
      <T x={224} y={40} size={8.5} weight="800" anchor="middle" color="#1e3a8a">呼吸だけ</T>
      <T x={224} y={168} size={8.5} anchor="middle">{'酸素をとり入れ、\n二酸化炭素を出す'}</T>
    </svg>
  )
}

// ── 不要な物質を体外へ出すしくみ ───────────────────────────────────────────────
//   { name: 'excretion' }
// 体を正面から見た図（左右は、見ている人と逆）。②肝臓でアンモニアを尿素に変え、③血液（赤い線は血管）でじん臓へ運び、④じん臓で血液から尿素などをこし出して尿にし、
// ⑤尿は輸尿管を通ってぼうこうにためられ、体外へ出される。肺は二酸化炭素を出す。番号は、流れ図の番号と同じ。
function ExcretionDiagram() {
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="不要な物質を体外へ出す器官" data-subject-diagram="excretion">
      <path d="M100,8 Q150,0 200,8 L212,44 Q222,124 206,226 L94,226 Q78,124 88,44 Z" fill="#fff7ed" stroke="#fdba74" strokeWidth="1.4" />
      <path d="M144,16 Q118,16 112,40 Q108,58 118,62 Q136,62 144,46 Z M156,16 Q182,16 188,40 Q192,58 182,62 Q164,62 156,46 Z" fill="#fecdd3" stroke="#e11d48" />
      <path d="M106,74 Q140,64 174,76 Q166,96 132,100 Q110,100 106,74 Z" fill="#b45309" opacity="0.85" />
      <path d="M118,124 Q110,114 116,104 Q126,98 132,108 Q128,116 132,126 Q126,134 118,124 Z" fill="#be123c" />
      <path d="M182,124 Q190,114 184,104 Q174,98 168,108 Q172,116 168,126 Q174,134 182,124 Z" fill="#be123c" />
      <path d="M130,126 Q138,160 146,194 M170,126 Q162,160 154,194" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
      <ellipse cx="150" cy="202" rx="17" ry="11" fill="#fde68a" stroke="#b45309" />
      <path d="M150,213 L150,226" stroke="#f59e0b" strokeWidth="2.2" />
      <path d="M150,98 L150,106 Q150,114 136,114 M150,106 Q150,114 164,114" fill="none" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" />
      <Num x={124} y={84} n="2" />
      <Num x={160} y={136} n="3" />
      <Num x={200} y={112} n="4" />
      <Num x={176} y={202} n="5" />
      <Callout from={[116, 40]} to={[70, 30]} text="肺" size={9.5} />
      <Callout from={[108, 82]} to={[70, 80]} text="肝臓" size={9.5} />
      <Callout from={[116, 116]} to={[70, 130]} text="じん臓" size={9.5} />
      <Callout from={[140, 166]} to={[70, 170]} text="輸尿管" size={9.5} />
      <Callout from={[136, 204]} to={[70, 210]} text="ぼうこう" size={9.5} />
      <T x={228} y={30} size={8.5} color={MUTED}>{'肺：二酸化\n炭素を出す'}</T>
      <T x={228} y={72} size={8.5} color={MUTED}>{'②アンモニア\nを尿素に'}</T>
      <T x={228} y={110} size={8.5} color={MUTED}>{'③血液で\nじん臓へ'}</T>
      <T x={228} y={148} size={8.5} color={MUTED}>{'④こし出し\nて尿に'}</T>
      <T x={228} y={194} size={8.5} color={MUTED}>{'⑤ためて\n体外へ'}</T>
    </svg>
  )
}

// ── 体細胞分裂の観察のしかた ───────────────────────────────────────────────────
//   { name: 'mitosisPrep' }
// ①根の先端を切りとり、あたためたうすい塩酸に入れる（細胞を離れやすくする）、②酢酸オルセイン液などで染める（核や染色体を染める）、
// ③カバーガラスをかけ、ろ紙の上から指で静かにおしつぶす（細胞が重ならないように広げる）。
function MitosisPrepDiagram() {
  const slide = (x, y) => <rect x={x} y={y} width="70" height="9" rx="1" fill="#f1f5f9" stroke={LINE} />
  return (
    <svg viewBox="0 0 300 158" className="h-auto w-full" role="img" aria-label="体細胞分裂を観察するプレパラートのつくり方" data-subject-diagram="mitosisPrep">
      <Panel x={4} y={4} w={94} h={150} title="①塩酸に入れる" size={9} />
      <Panel x={103} y={4} w={94} h={150} title="②染める" size={9} />
      <Panel x={202} y={4} w={94} h={150} title="③おしつぶす" size={9} />
      <path d="M18,50 L18,96 Q18,100 22,100 L80,100 Q84,100 84,96 L84,50" fill="#fff7ed" stroke={LINE} />
      <rect x="18.6" y="62" width="64.8" height="37.4" fill="#fed7aa" opacity="0.6" />
      <path d="M44,32 L44,90 A7,7 0 0 0 58,90 L58,32" fill="#f8fafc" stroke={LINE} />
      <path d="M44.6,62 L44.6,90 A6.4,6.4 0 0 0 57.4,90 L57.4,62 Z" fill="#e0f2fe" />
      {[[48, 82], [52, 86], [54, 78]].map(([x, y]) => <rect key={x} x={x - 1} y={y - 5} width="2.4" height="9" rx="1.2" fill="#fefce8" stroke="#a16207" strokeWidth="0.5" />)}
      <T x={51} y={120} size={8.5} anchor="middle">{'あたためた\nうすい塩酸'}</T>
      {slide(115, 76)}
      <rect x="146" y="73" width="8" height="3" rx="1.5" fill="#fefce8" stroke="#a16207" strokeWidth="0.5" />
      <path d="M150,30 L150,46 L146,56 L154,56 L150,46" fill="#fecdd3" stroke={LINE} />
      <rect x="145" y="20" width="10" height="12" rx="3" fill="#94a3b8" />
      <ellipse cx="150" cy="66" rx="2" ry="3" fill="#be123c" />
      <T x={150} y={104} size={8.5} anchor="middle">{'酢酸オルセイン液\nなどを落とす'}</T>
      {slide(214, 86)}
      <rect x="230" y="82" width="38" height="4" fill="#e0f2fe" stroke="#64748b" strokeWidth="0.6" />
      <rect x="226" y="74" width="46" height="8" fill="#fefce8" stroke="#a16207" strokeWidth="0.6" />
      <ellipse cx="249" cy="58" rx="14" ry="10" fill="#fed7aa" stroke="#c2410c" />
      <Arrow from={[272, 40]} to={[272, 70]} color={RED} width={1.8} head={6} />
      <T x={249} y={110} size={8.5} anchor="middle">{'ろ紙の上から\n指でおす'}</T>
      <T x={51} y={146} size={8.5} anchor="middle" color={GREEN}>離れやすくする</T>
      <T x={150} y={146} size={8.5} anchor="middle" color={GREEN}>核を染める</T>
      <T x={249} y={146} size={8.5} anchor="middle" color={GREEN}>重ならず広がる</T>
    </svg>
  )
}

// ── エンドウの対立形質 ─────────────────────────────────────────────────────────
//   { name: 'peaTraits' }
// 種子の形（丸／しわ）、子葉の色（黄色／緑色）、さやの色（緑色／黄色）、草たけ（高い／低い）。左が顕性形質、右が潜性形質。
function wrinkled(cx, cy, r) {
  const points = Array.from({ length: 36 }, (_, k) => {
    const angle = (k / 36) * Math.PI * 2
    const radius = r + 1.6 * Math.sin(angle * 9)
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`
  })
  return `M${points.join(' L')} Z`
}
function PeaTraitsDiagram() {
  const cols = [116, 222]
  const pod = (x, y, fill, stroke) => <path d={`M${x - 20},${y} Q${x},${y - 12} ${x + 20},${y - 2} Q${x + 24},${y + 2} ${x + 18},${y + 5} Q${x},${y + 10} ${x - 20},${y} Z`} fill={fill} stroke={stroke} />
  const plant = (x, base, h) => (
    <g>
      <line x1={x} y1={base} x2={x} y2={base - h} stroke="#15803d" strokeWidth="2" />
      {Array.from({ length: Math.max(1, Math.round(h / 10)) }, (_, k) => {
        const y = base - 6 - k * 9
        return <path key={k} d={`M${x},${y} q${k % 2 ? 8 : -8},-4 ${k % 2 ? 10 : -10},2`} fill="#86efac" stroke="#15803d" strokeWidth="0.8" />
      })}
    </g>
  )
  const rows = [
    { label: '種子の形', a: [<circle key="a" cx={cols[0] - 20} cy={44} r="11" fill="#d9f99d" stroke="#65a30d" />, '丸'], b: [<path key="b" d={wrinkled(cols[1] - 20, 44, 10)} fill="#d9f99d" stroke="#65a30d" />, 'しわ'] },
    { label: '子葉の色', a: [<circle key="a" cx={cols[0] - 20} cy={88} r="11" fill="#facc15" stroke="#a16207" />, '黄色'], b: [<circle key="b" cx={cols[1] - 20} cy={88} r="11" fill="#4ade80" stroke="#15803d" />, '緑色'] },
    { label: 'さやの色', a: [<g key="a">{pod(cols[0] - 20, 132, '#4ade80', '#15803d')}</g>, '緑色'], b: [<g key="b">{pod(cols[1] - 20, 132, '#fde047', '#a16207')}</g>, '黄色'] },
    { label: '草たけ', a: [<g key="a">{plant(cols[0] - 20, 194, 40)}</g>, '高い'], b: [<g key="b">{plant(cols[1] - 20, 194, 14)}</g>, '低い'] },
  ]
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="エンドウの対立形質" data-subject-diagram="peaTraits">
      <T x={cols[0]} y={16} size={9.5} weight="800" anchor="middle" color={RED}>顕性形質</T>
      <T x={cols[1]} y={16} size={9.5} weight="800" anchor="middle" color={BLUE}>潜性形質</T>
      {rows.map((row, index) => {
        const y = 24 + index * 44
        return (
          <g key={row.label}>
            <line x1="4" x2="296" y1={y} y2={y} stroke="#e2e8f0" />
            <T x={6} y={y + 25} size={9.5} weight="800" color={MUTED}>{row.label}</T>
            {row.a[0]}
            {row.b[0]}
            <T x={cols[0] + 4} y={y + 25} size={9.5} weight="800">{row.a[1]}</T>
            <T x={cols[1] + 4} y={y + 25} size={9.5} weight="800">{row.b[1]}</T>
          </g>
        )
      })}
    </svg>
  )
}

// ── 遺伝子の本体 ─────────────────────────────────────────────────────────────
//   { name: 'dnaZoom' }
// 細胞 → 核（細胞の中にふつう1つ） → 染色体（核の中にある） → DNA（遺伝子の本体）と、順に拡大して見たもの。点線は、拡大した部分。
function DnaZoomDiagram() {
  const helix = []
  for (let k = 0; k <= 40; k += 1) {
    const y = 18 + k * 1.6
    helix.push([y, 258 + 9 * Math.sin(k / 4.2), 258 - 9 * Math.sin(k / 4.2)])
  }
  return (
    <svg viewBox="0 0 300 150" className="h-auto w-full" role="img" aria-label="細胞から遺伝子の本体のDNAまで" data-subject-diagram="dnaZoom">
      <rect x="12" y="28" width="52" height="44" rx="12" fill="#fee2e2" stroke="#be123c" />
      <circle cx="44" cy="50" r="9" fill="#c4b5fd" stroke="#6d28d9" />
      <path d="M44,41 L112,24 M44,59 L112,76" stroke={MUTED} strokeDasharray="3 2" />
      <circle cx="112" cy="50" r="26" fill="#ede9fe" stroke="#6d28d9" />
      {[[100, 40, 20], [116, 44, -30], [106, 58, 60], [122, 56, 10]].map(([x, y, a]) => (
        <path key={`${x}-${y}`} d={`M${x - 6},${y} q3,-3 6,0 q3,3 6,0`} transform={`rotate(${a} ${x} ${y})`} fill="none" stroke="#7c3aed" strokeWidth="2" />
      ))}
      <path d="M122,52 L182,25 M122,60 L182,76" stroke={MUTED} strokeDasharray="3 2" />
      <path d="M176,26 Q196,50 176,74 M196,26 Q176,50 196,74" fill="none" stroke="#7c3aed" strokeWidth="7" strokeLinecap="round" />
      <circle cx="186" cy="50" r="4" fill="#5b21b6" />
      <path d="M194,34 L250,18 M194,42 L250,82" stroke={MUTED} strokeDasharray="3 2" />
      {helix.filter((_, k) => k % 3 === 0).map(([y, a, b]) => <line key={y} x1={a} x2={b} y1={y} y2={y} stroke="#94a3b8" strokeWidth="1" />)}
      <polyline points={helix.map(([y, a]) => `${a},${y}`).join(' ')} fill="none" stroke="#2563eb" strokeWidth="2" />
      <polyline points={helix.map(([y, , b]) => `${b},${y}`).join(' ')} fill="none" stroke="#db2777" strokeWidth="2" />
      <T x={38} y={100} size={10} weight="800" anchor="middle">細胞</T>
      <T x={112} y={100} size={10} weight="800" anchor="middle">核</T>
      <T x={112} y={114} size={8.5} anchor="middle">{'細胞の中に\nふつう1つ'}</T>
      <T x={186} y={100} size={10} weight="800" anchor="middle">染色体</T>
      <T x={186} y={114} size={8.5} anchor="middle">{'核の中に\nある'}</T>
      <T x={258} y={100} size={10} weight="800" anchor="middle">DNA</T>
      <T x={258} y={114} size={8.5} anchor="middle">{'遺伝子の\n本体'}</T>
    </svg>
  )
}

// ── 遺伝子の研究成果の活用 ─────────────────────────────────────────────────────
//   { name: 'geneTech' }
// 遺伝子組換え（ある生物の遺伝子を別の生物に入れる）、ゲノム編集（遺伝子のねらった部分を変える）、クローン（同じ遺伝子をもつ個体をつくる。さし木など）。
function DnaStrip({ x, y, w, marks = [] }) {
  const rungs = []
  for (let k = 0; k <= w; k += 5) rungs.push(<line key={k} x1={x + k} x2={x + k} y1={y} y2={y + 8} stroke="#94a3b8" strokeWidth="0.8" />)
  return (
    <g>
      {marks.map(([from, to, color]) => <rect key={from} x={x + from} y={y - 1} width={to - from} height="10" fill={color} opacity="0.8" />)}
      {rungs}
      <line x1={x} x2={x + w} y1={y} y2={y} stroke="#475569" strokeWidth="1.4" />
      <line x1={x} x2={x + w} y1={y + 8} y2={y + 8} stroke="#475569" strokeWidth="1.4" />
    </g>
  )
}
function GeneTechDiagram() {
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="遺伝子組換え・ゲノム編集・クローン" data-subject-diagram="geneTech">
      {[4, 72, 140].map((y) => <rect key={y} x="4" y={y} width="292" height="62" rx="8" fill="#f8fafc" stroke="#e2e8f0" />)}
      <T x={10} y={20} size={9.5} weight="800" color="#6d28d9">遺伝子組換え</T>
      <DnaStrip x={14} y={34} w={60} marks={[[22, 40, '#f87171']]} />
      <Arrow from={[80, 38]} to={[118, 38]} color={MUTED} width={1.4} head={5} />
      <rect x="124" y="22" width="62" height="32" rx="16" fill="#dcfce7" stroke={GREEN} />
      <circle cx="150" cy="38" r="10" fill="none" stroke="#475569" strokeWidth="1.4" />
      <path d="M159,33 A10,10 0 0 1 159,43" fill="none" stroke="#ef4444" strokeWidth="3" />
      <Arrow from={[192, 38]} to={[208, 38]} color={MUTED} width={1.4} head={5} />
      {[[218, 34], [226, 42], [234, 34]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="#f87171" />)}
      <T x={244} y={42} size={8.5}>薬などを</T>
      <T x={244} y={53} size={8.5}>つくる</T>
      <T x={14} y={60} size={8.5} color={MUTED}>ある生物の遺伝子を、別の生物（微生物など）に入れる</T>
      <T x={10} y={88} size={9.5} weight="800" color="#6d28d9">ゲノム編集</T>
      <DnaStrip x={14} y={100} w={96} marks={[[56, 74, '#fdba74']]} />
      <path d="M75,88 L83,96 M83,88 L75,96" stroke={RED} strokeWidth="1.6" />
      <circle cx="73" cy="86" r="2.5" fill="none" stroke={RED} />
      <circle cx="85" cy="86" r="2.5" fill="none" stroke={RED} />
      <Arrow from={[116, 104]} to={[148, 104]} color={MUTED} width={1.4} head={5} />
      <DnaStrip x={154} y={100} w={96} marks={[[56, 74, '#86efac']]} />
      <T x={14} y={128} size={8.5} color={MUTED}>遺伝子のねらった部分だけを変える</T>
      <T x={10} y={156} size={9.5} weight="800" color="#6d28d9">クローン</T>
      <g>
        <line x1="40" y1="196" x2="40" y2="166" stroke="#15803d" strokeWidth="2.4" />
        <path d="M40,176 q-10,-4 -12,-12 q8,0 12,8 M40,170 q10,-4 12,-12 q-8,0 -12,8" fill="#86efac" stroke="#15803d" />
      </g>
      <Arrow from={[60, 180]} to={[96, 180]} color={MUTED} width={1.4} head={5} />
      <T x={78} y={174} size={8.5} anchor="middle" color={MUTED}>さし木</T>
      {[130, 176, 222].map((x) => (
        <g key={x}>
          <line x1={x} y1="196" x2={x} y2="170" stroke="#15803d" strokeWidth="2.2" />
          <path d={`M${x},178 q-9,-3 -11,-10 q7,0 11,7 M${x},174 q9,-3 11,-10 q-7,0 -11,7`} fill="#86efac" stroke="#15803d" />
        </g>
      ))}
      <T x={250} y={180} size={8.5}>{'同じ遺伝\n子をもつ'}</T>
    </svg>
  )
}

// ── 進化の道すじ（系統の図） ─────────────────────────────────────────────────────
//   { name: 'cladogram', taxa: ['藻類', …], traits: ['陸上へ', …] }
// 左下から右上へのびる幹に、先に現れたなかまから順に枝を出す。traits[i] は、taxa[i] より右のなかまがもつようになった特徴。
function CladogramDiagram({ taxa = [], traits = [] }) {
  const n = taxa.length
  const xs = taxa.map((_, i) => 34 + (i * 232) / Math.max(1, n - 1))
  const ys = taxa.map((_, i) => 150 - i * 22)
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="なかまが現れた順と、それぞれが得た特徴" data-subject-diagram="cladogram">
      <line x1={xs[0] - 14} y1={ys[0] + 10} x2={xs[n - 1]} y2={ys[n - 1]} stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      {taxa.map((name, i) => (
        <g key={name}>
          <line x1={xs[i]} y1={ys[i]} x2={xs[i]} y2={30} stroke="#15803d" strokeWidth="2" />
          <T x={xs[i]} y={20} size={9.5} weight="800" anchor="middle">{name}</T>
        </g>
      ))}
      {traits.map((text, i) => {
        const x = (xs[i] + xs[i + 1]) / 2
        const y = (ys[i] + ys[i + 1]) / 2
        return (
          <g key={text}>
            <circle cx={x} cy={y} r="3.5" fill="#fbbf24" stroke={AMBER} />
            <T x={x} y={y + 16} size={8.5} weight="800" anchor="middle" color={AMBER}>{text}</T>
          </g>
        )
      })}
      <Arrow from={[150, 196]} to={[290, 196]} color={MUTED} width={1.2} head={5} />
      <T x={146} y={199.5} size={8.5} anchor="end" color={MUTED}>先に現れた</T>
      <T x={290} y={190} size={8.5} anchor="end" color={MUTED}>あとに現れた</T>
    </svg>
  )
}

// ── 川の水質と、すんでいる生物 ───────────────────────────────────────────────────
//   { name: 'riverWaterQuality' }
// 山から流れる川は、町の生活排水などが流れこむと、きたなくなっていく（例）。色は水質の区分、名前はその水にすむ指標生物の例。
function RiverWaterQualityDiagram() {
  const points = [[24, 40], [92, 74], [150, 104], [208, 136], [286, 176]]
  const colors = ['#60a5fa', '#86efac', '#facc15', '#a16207']
  return (
    <svg viewBox="0 0 300 208" className="h-auto w-full" role="img" aria-label="川の水質と、すんでいる生物の例" data-subject-diagram="riverWaterQuality">
      <path d="M0,46 L22,16 L44,34 L66,8 L96,40 L0,40 Z" fill="#ecfccb" stroke="#65a30d" />
      {points.slice(0, -1).map(([x1, y1], i) => {
        const [x2, y2] = points[i + 1]
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[i]} strokeWidth="14" strokeLinecap="round" />
      })}
      {[[232, 96], [254, 96], [276, 96]].map(([x, y]) => <path key={x} d={`M${x},${y + 20} L${x},${y + 8} L${x + 9},${y} L${x + 18},${y + 8} L${x + 18},${y + 20} Z`} fill="#fef3c7" stroke="#b45309" />)}
      <path d="M244,116 L240,140 M266,116 L262,150" stroke="#78716c" strokeWidth="2" />
      <T x={292} y={92} size={8.5} anchor="end">生活排水</T>
      <T x={102} y={26} size={9} weight="800" color="#1d4ed8">きれいな水</T>
      <T x={102} y={38} size={8.5}>カワゲラ・サワガニ</T>
      <T x={6} y={96} size={9} weight="800" color="#15803d">ややきれいな水</T>
      <T x={6} y={108} size={8.5}>ゲンジボタル・カワニナ</T>
      <T x={156} y={74} size={9} weight="800" color="#a16207">きたない水</T>
      <T x={156} y={86} size={8.5}>タニシ・ヒル</T>
      <T x={92} y={162} size={9} weight="800" color="#7c2d12">とてもきたない水</T>
      <T x={92} y={174} size={8.5}>アメリカザリガニ・サカマキガイ</T>
      <T x={6} y={202} size={8.5} color={MUTED}>すんでいる生物（指標生物）から、水質がわかる</T>
    </svg>
  )
}

// ── 赤潮・アオコが発生するしくみ ─────────────────────────────────────────────────
//   { name: 'eutrophication' }
// ①生活排水などが流れこむ → ②窒素やリンなどの養分がふえる → ③植物プランクトンが大量にふえる（④赤潮・アオコ）
// → ⑤死んだプランクトンの分解で水中の酸素が不足し、魚や貝が死ぬことがある。番号は流れ図と同じ。
function EutrophicationDiagram() {
  const random = steady(53)
  const bloom = Array.from({ length: 90 }, () => [126 + random() * 170, 74 + random() * 14])
  const sinking = Array.from({ length: 16 }, () => [170 + random() * 110, 104 + random() * 54])
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="赤潮やアオコが発生するしくみ" data-subject-diagram="eutrophication">
      <path d="M0,58 L86,58 L94,70 L0,70 Z" fill="#ecfccb" stroke="#65a30d" />
      {[[8, 38], [32, 38], [56, 38]].map(([x, y]) => <path key={x} d={`M${x},${y + 20} L${x},${y + 8} L${x + 9},${y} L${x + 18},${y + 8} L${x + 18},${y + 20} Z`} fill="#fef3c7" stroke="#b45309" />)}
      <path d="M74,58 L74,64 L100,76" fill="none" stroke="#78716c" strokeWidth="3" />
      <rect x="86" y="70" width="214" height="136" fill="#bae6fd" />
      <rect x="86" y="190" width="214" height="16" fill="#d6b98c" />
      {bloom.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill={i % 2 ? '#b91c1c' : '#16a34a'} opacity="0.85" />)}
      {[[104, 104, 'N'], [126, 120, 'P'], [112, 138, 'N'], [138, 100, 'P']].map(([x, y, t]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="7" fill="#ffffff" stroke="#0284c7" />
          <text x={x} y={y + 3.3} fontSize="9" fontWeight="800" textAnchor="middle" fill="#0369a1">{t}</text>
        </g>
      ))}
      {sinking.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="#78716c" />)}
      <path d="M244,180 Q256,172 268,180 Q256,188 244,180 Z M268,180 L276,174 L276,186 Z" fill="#cbd5e1" stroke="#64748b" />
      <path d="M248,178 l3,3 m0,-3 l-3,3" stroke={INK} strokeWidth="0.8" />
      <Num x={86} y={46} n="1" color={BLUE} />
      <Num x={154} y={124} n="2" color={BLUE} />
      <Num x={118} y={62} n="3" color={BLUE} />
      <Num x={236} y={162} n="5" color={BLUE} />
      <T x={6} y={14} size={8.5}>①生活排水などが流れこむ</T>
      <T x={6} y={26} size={8.5}>②窒素やリン（N・P）がふえる</T>
      <T x={130} y={56} size={8.5}>③④植物プランクトンが大量に</T>
      <T x={130} y={68} size={8.5} weight="800" color={RED}>ふえる（赤潮・アオコ）</T>
      <T x={176} y={124} size={8.5}>{'死んだプランクトン\nの分解で酸素が減る'}</T>
      <T x={150} y={202} size={8.5} anchor="middle" weight="800" color="#7c2d12">⑤酸素が足りなくなり、魚や貝が死ぬ</T>
    </svg>
  )
}

export const BIOLOGY_DIAGRAMS = Object.freeze({
  stereoMicroscope: StereoMicroscopeDiagram,
  sketchRules: SketchRulesDiagram,
  pistilToFruit: PistilToFruitDiagram,
  frogLifeCycle: FrogLifeCycleDiagram,
  vertebrateTraits: VertebrateTraitsDiagram,
  cellViews: CellViewsDiagram,
  cellPartsSets: CellPartsSetsDiagram,
  unicellular: UnicellularDiagram,
  bodyLevels: BodyLevelsDiagram,
  dayNightGas: DayNightGasDiagram,
  excretion: ExcretionDiagram,
  mitosisPrep: MitosisPrepDiagram,
  peaTraits: PeaTraitsDiagram,
  dnaZoom: DnaZoomDiagram,
  geneTech: GeneTechDiagram,
  cladogram: CladogramDiagram,
  riverWaterQuality: RiverWaterQualityDiagram,
  eutrophication: EutrophicationDiagram,
})
