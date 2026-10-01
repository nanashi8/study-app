// 理科（化学）の図解。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。部分の名前は引き出し線の先に書く。
import { AMBER, Arrow, BLUE, Bubbles, Callout, Flame, GLASS, GREEN, GlassTube, INK, LINE, MUTED, Num, Panel, RED, T, TestTube, WATER, steady } from './SubjectScienceParts.jsx'

// ── 物体と物質 ─────────────────────────────────────────────────────────────
//   { name: 'objectMaterial' }
// 縦に物体（コップ・スプーン・くぎ）、横に物質（ガラス・プラスチック・紙・金属・木）。
// 黄の行（コップ）を横に見ると、同じ物体でも物質がいろいろ。青の列（金属）を縦に見ると、同じ物質でいろいろな物体ができている。
const MATERIALS = Object.freeze([
  { name: 'ガラス', fill: '#e0f2fe', stroke: '#0284c7', shine: true },
  { name: 'プラスチック', fill: '#fda4af', stroke: '#be123c' },
  { name: '紙', fill: '#fef9c3', stroke: '#a16207', stripes: true },
  { name: '金属', fill: '#cbd5e1', stroke: '#475569', shine: true },
  { name: '木', fill: '#d6a26b', stroke: '#7c2d12', grain: true },
])
function Cup({ x, y, material }) {
  const body = `M${x - 14},${y - 15} L${x + 14},${y - 15} L${x + 11},${y + 15} L${x - 11},${y + 15} Z`
  return (
    <g>
      <path d={body} fill={material.fill} stroke={material.stroke} strokeWidth="1.2" opacity={material.name === 'ガラス' ? 0.85 : 1} />
      {material.stripes && <path d={`M${x - 8},${y - 15} L${x - 6},${y + 15} M${x},${y - 15} L${x},${y + 15} M${x + 8},${y - 15} L${x + 6},${y + 15}`} stroke="#f59e0b" strokeWidth="1.4" opacity="0.6" />}
      {material.shine && <path d={`M${x - 8},${y - 11} L${x - 6},${y + 11}`} stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />}
      <ellipse cx={x} cy={y - 15} rx="14" ry="3" fill="#ffffff" stroke={material.stroke} strokeWidth="1" />
    </g>
  )
}
function Spoon({ x, y, material }) {
  return (
    <g transform={`rotate(-40 ${x} ${y})`}>
      <rect x={x - 2.5} y={y - 22} width="5" height="24" rx="2.5" fill={material.fill} stroke={material.stroke} strokeWidth="1.1" />
      <ellipse cx={x} cy={y + 9} rx="7" ry="10" fill={material.fill} stroke={material.stroke} strokeWidth="1.2" />
      {material.shine && <path d={`M${x - 3},${y + 4} Q${x - 4},${y + 10} ${x - 2},${y + 14}`} fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />}
      {material.grain && <path d={`M${x - 1},${y - 20} L${x - 1},${y} M${x - 3},${y + 4} Q${x},${y + 10} ${x - 2},${y + 16}`} fill="none" stroke="#92400e" strokeWidth="0.7" />}
    </g>
  )
}
function Nail({ x, y }) {
  return (
    <g transform={`rotate(-20 ${x} ${y})`}>
      <rect x={x - 8} y={y - 17} width="16" height="4" rx="1" fill="#cbd5e1" stroke="#475569" />
      <rect x={x - 2} y={y - 13} width="4" height="24" fill="#cbd5e1" stroke="#475569" />
      <path d={`M${x - 2},${y + 11} L${x + 2},${y + 11} L${x},${y + 18} Z`} fill="#cbd5e1" stroke="#475569" />
    </g>
  )
}
function ObjectMaterialDiagram() {
  const left = 46
  const colW = 50
  const cx = (index) => left + colW * index + colW / 2
  const rows = [
    { name: 'コップ', y: 56, has: [0, 1, 2, 3], Draw: Cup },
    { name: 'スプーン', y: 104, has: [1, 3, 4], Draw: Spoon },
    { name: 'くぎ', y: 150, has: [3], Draw: Nail },
  ]
  return (
    <svg viewBox="0 0 300 210" className="h-auto w-full" role="img" aria-label="物体と物質の見方" data-subject-diagram="objectMaterial">
      <rect x={left} y={33} width={colW * 5} height={46} fill="#fef3c7" />
      <rect x={left + colW * 3} y={4} width={colW} height={170} fill="#dbeafe" opacity="0.75" />
      {MATERIALS.map((material, index) => (
        <T key={material.name} x={cx(index)} y={22} size={material.name.length > 4 ? 8.5 : 9.5} weight="800" anchor="middle" color={material.stroke}>{material.name}</T>
      ))}
      {rows.map((row) => (
        <g key={row.name}>
          <T x={4} y={row.y + 4} size={9.5} weight="800">{row.name}</T>
          {row.has.map((index) => <row.Draw key={index} x={cx(index)} y={row.y} material={MATERIALS[index]} />)}
        </g>
      ))}
      <T x={cx(3) + 14} y={160} size={8.5} weight="800" color={LINE}>鉄</T>
      <rect x="6" y="182" width="10" height="8" fill="#fef3c7" stroke="#d97706" />
      <T x={20} y={190} size={8.5}>横に見る：同じ物体（コップ）でも、物質はいろいろ</T>
      <rect x="6" y="194" width="10" height="8" fill="#dbeafe" stroke="#60a5fa" />
      <T x={20} y={202} size={8.5}>縦に見る：同じ物質（金属）で、いろいろな物体</T>
    </svg>
  )
}

// ── 金属の性質 ─────────────────────────────────────────────────────────────
//   { name: 'metalProperties' }
// 青の枠の4つ（金属光沢・電気を通す・熱を伝える・たたくと広がりのびる）は金属に共通の性質。
// 黄の枠：磁石につくのは鉄など一部の金属だけで、共通の性質ではない。灰の枠：金属以外（非金属）。
function MetalPropertiesDiagram() {
  const cell = (col, row) => [4 + col * 148, 4 + row * 80]
  const [a, b] = [cell(0, 0), cell(1, 0)]
  const [c, d] = [cell(0, 1), cell(1, 1)]
  const [e, f] = [cell(0, 2), cell(1, 2)]
  return (
    <svg viewBox="0 0 300 248" className="h-auto w-full" role="img" aria-label="金属の性質" data-subject-diagram="metalProperties">
      <Panel x={a[0]} y={a[1]} w={144} h={76} title="みがくと光る（金属光沢）" tone="blue" />
      <rect x={a[0] + 34} y={a[1] + 26} width="76" height="26" rx="5" fill="#cbd5e1" stroke="#475569" />
      <path d={`M${a[0] + 46},${a[1] + 50} L${a[0] + 64},${a[1] + 28} M${a[0] + 56},${a[1] + 50} L${a[0] + 70},${a[1] + 32}`} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      {[[a[0] + 116, a[1] + 28], [a[0] + 28, a[1] + 48]].map(([x, y]) => (
        <path key={x} d={`M${x},${y - 6} L${x + 1.5},${y - 1.5} L${x + 6},${y} L${x + 1.5},${y + 1.5} L${x},${y + 6} L${x - 1.5},${y + 1.5} L${x - 6},${y} L${x - 1.5},${y - 1.5} Z`} fill="#facc15" />
      ))}
      <T x={a[0] + 72} y={a[1] + 68} size={8.5} anchor="middle">特有のかがやきがある</T>

      <Panel x={b[0]} y={b[1]} w={144} h={76} title="電気をよく通す" tone="blue" />
      <path d={`M${b[0] + 20},${b[1] + 42} L${b[0] + 20},${b[1] + 56} L${b[0] + 124},${b[1] + 56} L${b[0] + 124},${b[1] + 42} M${b[0] + 20},${b[1] + 34} L${b[0] + 20},${b[1] + 28} L${b[0] + 56},${b[1] + 28} M${b[0] + 88},${b[1] + 28} L${b[0] + 124},${b[1] + 28} L${b[0] + 124},${b[1] + 34}`} fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x={b[0] + 14} y={b[1] + 34} width="12" height="8" fill="#334155" />
      <circle cx={b[0] + 124} cy={b[1] + 38} r="6" fill="#fde047" stroke="#ca8a04" />
      <path d={`M${b[0] + 133},${b[1] + 34} L${b[0] + 138},${b[1] + 31} M${b[0] + 133},${b[1] + 42} L${b[0] + 138},${b[1] + 45} M${b[0] + 134},${b[1] + 38} L${b[0] + 140},${b[1] + 38}`} stroke="#ca8a04" strokeWidth="1.2" />
      <rect x={b[0] + 52} y={b[1] + 24} width="40" height="8" rx="4" fill="#cbd5e1" stroke="#475569" />
      <T x={b[0] + 72} y={b[1] + 68} size={8.5} anchor="middle">金属をつなぐと、豆電球がつく</T>

      <Panel x={c[0]} y={c[1]} w={144} h={76} title="熱をよく伝える" tone="blue" />
      <defs>
        <linearGradient id="metal-heat" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="0.45" stopColor="#fb923c" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <rect x={c[0] + 26} y={c[1] + 32} width="100" height="8" rx="2" fill="url(#metal-heat)" stroke="#475569" />
      <path d={`M${c[0] + 30},${c[1] + 58} C${c[0] + 22},${c[1] + 52} ${c[0] + 24},${c[1] + 44} ${c[0] + 30},${c[1] + 38} C${c[0] + 36},${c[1] + 44} ${c[0] + 38},${c[1] + 52} ${c[0] + 30},${c[1] + 58} Z`} fill="#fb923c" />
      <Arrow from={[c[0] + 54, c[1] + 26]} to={[c[0] + 112, c[1] + 26]} color={RED} width={1.4} head={5} />
      <T x={c[0] + 86} y={c[1] + 68} size={8.5} anchor="middle">熱した所から熱が広がる</T>

      <Panel x={d[0]} y={d[1]} w={144} h={76} title="たたくと広がり、のびる" tone="blue" />
      <rect x={d[0] + 22} y={d[1] + 24} width="8" height="18" fill="#a16207" transform={`rotate(-30 ${d[0] + 26} ${d[1] + 33})`} />
      <rect x={d[0] + 14} y={d[1] + 22} width="22" height="8" rx="2" fill="#64748b" transform={`rotate(-30 ${d[0] + 26} ${d[1] + 33})`} />
      <ellipse cx={d[0] + 40} cy={d[1] + 52} rx="22" ry="4" fill="#cbd5e1" stroke="#475569" />
      <line x1={d[0] + 82} y1={d[1] + 44} x2={d[0] + 128} y2={d[1] + 44} stroke="#b45309" strokeWidth="2" />
      <Arrow from={[d[0] + 96, d[1] + 34]} to={[d[0] + 76, d[1] + 34]} color={RED} width={1.4} head={5} />
      <Arrow from={[d[0] + 114, d[1] + 34]} to={[d[0] + 134, d[1] + 34]} color={RED} width={1.4} head={5} />
      <T x={d[0] + 72} y={d[1] + 68} size={8.5} anchor="middle">うすく広がり、細くのびる</T>

      <Panel x={e[0]} y={e[1]} w={144} h={76} title="磁石につくのは一部だけ" tone="amber" />
      <rect x={e[0] + 12} y={e[1] + 29} width="20" height="12" fill="#ef4444" />
      <rect x={e[0] + 32} y={e[1] + 29} width="20" height="12" fill="#3b82f6" />
      <text x={e[0] + 22} y={e[1] + 38.3} fontSize="9" fontWeight="800" textAnchor="middle" fill="#ffffff">N</text>
      <text x={e[0] + 42} y={e[1] + 38.3} fontSize="9" fontWeight="800" textAnchor="middle" fill="#ffffff">S</text>
      <rect x={e[0] + 52} y={e[1] + 33} width="18" height="4" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" />
      <T x={e[0] + 61} y={e[1] + 52} size={8.5} weight="800" anchor="middle" color={GREEN}>鉄：つく</T>
      <circle cx={e[0] + 100} cy={e[1] + 36} r="8" fill="#fdba74" stroke="#c2410c" />
      <rect x={e[0] + 116} y={e[1] + 28} width="16" height="16" rx="2" fill="#e2e8f0" stroke="#64748b" />
      <T x={e[0] + 72} y={e[1] + 68} size={8.5} anchor="middle" color={RED}>銅・アルミニウム：つかない</T>

      <Panel x={f[0]} y={f[1]} w={144} h={76} title="金属以外（非金属）" />
      <path d={`M${f[0] + 26},${f[1] + 28} L${f[0] + 44},${f[1] + 28} L${f[0] + 42},${f[1] + 52} L${f[0] + 28},${f[1] + 52} Z`} fill="#e0f2fe" stroke="#0284c7" />
      <rect x={f[0] + 60} y={f[1] + 34} width="26" height="18" fill="#d6a26b" stroke="#7c2d12" />
      <path d={`M${f[0] + 108},${f[1] + 52} L${f[0] + 108},${f[1] + 36} Q${f[0] + 108},${f[1] + 30} ${f[0] + 113},${f[1] + 28} L${f[0] + 113},${f[1] + 24} L${f[0] + 119},${f[1] + 24} L${f[0] + 119},${f[1] + 28} Q${f[0] + 124},${f[1] + 30} ${f[0] + 124},${f[1] + 36} L${f[0] + 124},${f[1] + 52} Z`} fill="#fda4af" stroke="#be123c" />
      <T x={f[0] + 72} y={f[1] + 68} size={8.5} anchor="middle">光らない・電気を通しにくい</T>
    </svg>
  )
}

// ── 気体の発生と集め方・確かめ方 ───────────────────────────────────────────────
//   { name: 'gasGeneration', gas: 'oxygen' | 'carbonDioxide' | 'hydrogen' }
// 三角フラスコの固体に、ろうとから液体を加えて気体を発生させ、水上置換法で試験管に集める。下の段は、集めた気体の確かめ方。
const GENERATED_GASES = Object.freeze({
  oxygen: {
    name: '酸素',
    solid: '二酸化マンガン',
    grains: 'black',
    liquid: 'うすい過酸化水素水\n（オキシドール）',
    test: '火のついた線香を入れると、\n線香が激しく燃える',
    testKind: 'incense',
  },
  carbonDioxide: {
    name: '二酸化炭素',
    solid: '石灰石',
    grains: 'white',
    liquid: 'うすい塩酸',
    test: '石灰水を入れてよくふると、\n石灰水が白くにごる',
    testKind: 'limewater',
    note: '下方置換法でも\n集められる',
  },
  hydrogen: {
    name: '水素',
    solid: '亜鉛',
    grains: 'gray',
    liquid: 'うすい塩酸',
    test: 'マッチの火を近づけると、\n音を立てて燃え、水ができる',
    testKind: 'flame',
  },
})
const GRAIN_STYLE = Object.freeze({ black: ['#1f2937', '#111827'], white: ['#f5f5f4', '#a8a29e'], gray: ['#9ca3af', '#4b5563'] })
function GasGenerationDiagram({ gas = 'oxygen' }) {
  const info = GENERATED_GASES[gas] ?? GENERATED_GASES.oxygen
  const [grainFill, grainStroke] = GRAIN_STYLE[info.grains]
  const random = steady(gas.length * 31)
  const grains = Array.from({ length: 14 }, (_, index) => [40 + index * 4.6 + random() * 2, 164 + random() * 4])
  return (
    <svg viewBox="0 0 300 256" className="h-auto w-full" role="img" aria-label={`${info.name}の発生と集め方`} data-subject-diagram="gasGeneration">
      {/* 水そうと、水を満たして逆さに立てた試験管 */}
      <rect x="140" y="108" width="150" height="88" rx="3" fill={GLASS} stroke={LINE} />
      <rect x="141" y="122" width="148" height="73" fill={WATER} />
      <path d="M180,186 L180,64 Q190,50 200,64 L200,186" fill="#ffffff" stroke="none" />
      <rect x="180.5" y="120" width="19" height="66" fill={WATER} />
      <path d="M180,186 L180,64 Q190,50 200,64 L200,186" fill="none" stroke={LINE} strokeWidth="1.3" />
      <Bubbles points={[[190, 176], [189, 162], [191, 148], [190, 134]]} r={2.4} />
      {/* 三角フラスコと、ろうと */}
      <path d="M62,94 L62,112 L30,170 L110,170 L78,112 L78,94" fill={GLASS} stroke="none" />
      <path d="M41,150 L99,150 L110,170 L30,170 Z" fill="#e0f2fe" />
      {grains.map(([x, y], index) => <circle key={index} cx={x} cy={y} r={info.grains === 'white' ? 3 : 2.2} fill={grainFill} stroke={grainStroke} strokeWidth="0.6" />)}
      <Bubbles points={[[52, 156], [70, 154], [88, 157], [60, 146]]} r={1.8} />
      <path d="M62,94 L62,112 L30,170 L110,170 L78,112 L78,94" fill="none" stroke={LINE} strokeWidth="1.3" />
      <rect x="58" y="86" width="24" height="10" rx="2" fill="#57534e" />
      <path d="M46,26 L90,26 L70,50 L66,50 Z" fill={GLASS} stroke={LINE} strokeWidth="1.2" />
      <path d="M57,38 L79,38 L70,49 L66,49 Z" fill="#e0f2fe" />
      <rect x="66" y="50" width="4" height="108" fill={GLASS} stroke={LINE} strokeWidth="0.9" />
      <GlassTube d="M76,90 L76,68 Q76,62 82,62 L154,62 Q160,62 160,68 L160,188 Q160,194 166,194 L184,194 Q190,194 190,190" />
      <Callout from={[86, 32]} to={[98, 20]} text={info.liquid} size={9} />
      <T x={70} y={186} size={9} weight="800" anchor="middle">{info.solid}</T>
      <Callout from={[196, 88]} to={[210, 76]} text={`${info.name}が\nたまる`} size={9} color={BLUE} />
      <T x={250} y={info.note ? 152 : 182} size={9.5} weight="800" anchor="middle" color="#0369a1">水上置換法</T>
      {info.note && <T x={250} y={168} size={8.5} anchor="middle" color="#0369a1">{info.note}</T>}
      {/* 確かめ方 */}
      <line x1="4" y1="204" x2="296" y2="204" stroke="#cbd5e1" />
      <TestTube x={20} y={212} w={14} h={36} liquid={info.testKind === 'limewater' ? '#f1f5f9' : undefined} level={0.45} />
      {info.testKind === 'incense' && (
        <g>
          <line x1="27" y1="206" x2="27" y2="234" stroke="#78350f" strokeWidth="1.6" />
          <path d="M27,242 C22,238 23,232 27,226 C31,232 32,238 27,242 Z" fill="#fb923c" />
        </g>
      )}
      {info.testKind === 'limewater' && [[24, 238], [29, 241], [26, 244], [31, 236]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#94a3b8" />)}
      {info.testKind === 'flame' && (
        <g>
          <line x1="44" y1="210" x2="36" y2="216" stroke="#a16207" strokeWidth="1.6" />
          <path d="M30,214 C26,211 27,206 30,202 C33,206 34,211 30,214 Z" fill="#fb923c" />
        </g>
      )}
      <T x={54} y={222} size={9}>{info.test.split('\n')[0]}</T>
      <T x={54} y={238} size={9.5} weight="800" color={RED}>{`${info.test.split('\n')[1]} → ${info.name}`}</T>
    </svg>
  )
}

// ── 気体の性質と集め方 ───────────────────────────────────────────────────────
//   { name: 'gasMap' }
// 横は水へのとけやすさ（右ほどとけやすい）、縦は空気と比べた密度（上ほど小さい＝軽い）。点は大小の順を表し、目もりはない。
// 水にとけにくい気体は水上置換法、とけやすく空気より軽い気体は上方置換法、とけやすく空気より重い気体は下方置換法で集める。
function GasMapDiagram() {
  const left = 56
  const right = 294
  const top = 22
  const bottom = 184
  const air = 100
  const split = 150
  const gases = [
    { name: '水素（最も軽い）', x: 80, y: 32 },
    { name: '窒素', x: 72, y: 92 },
    { name: '酸素', x: 92, y: 112 },
    { name: '二酸化炭素', sub: '（水に少しとける）', x: split, y: 132 },
    { name: '塩素', x: 250, y: 150 },
    { name: 'アンモニア', sub: '（非常にとけやすい）', x: 274, y: 62, side: 'end' },
  ]
  return (
    <svg viewBox="0 0 300 226" className="h-auto w-full" role="img" aria-label="気体の性質と集め方" data-subject-diagram="gasMap">
      <rect x={left} y={top} width={split - left} height={bottom - top} fill="#dbeafe" />
      <rect x={split} y={top} width={right - split} height={air - top} fill="#dcfce7" />
      <rect x={split} y={air} width={right - split} height={bottom - air} fill="#fef3c7" />
      <rect x={left} y={top} width={right - left} height={bottom - top} fill="none" stroke="#94a3b8" />
      <line x1={left} x2={right} y1={air} y2={air} stroke={MUTED} strokeDasharray="4 3" />
      <T x={4} y={12} size={8.5} color={MUTED}>空気と比べた密度</T>
      <line x1="26" y1="36" x2="26" y2="170" stroke="#cbd5e1" strokeWidth="2" />
      <T x={26} y={34} size={9.5} weight="800" anchor="middle">軽い</T>
      <T x={26} y={air + 4} size={9} weight="800" anchor="middle" color={MUTED}>空気</T>
      <T x={26} y={180} size={9.5} weight="800" anchor="middle">重い</T>
      <T x={(left + split) / 2} y={168} size={9.5} weight="800" anchor="middle" color="#1e3a8a">水上置換法</T>
      <T x={(left + split) / 2} y={180} size={8.5} anchor="middle" color="#1e3a8a">水にとけにくい気体</T>
      <T x={(split + right) / 2} y={36} size={9.5} weight="800" anchor="middle" color="#14532d">上方置換法</T>
      <T x={(split + right) / 2} y={48} size={8.5} anchor="middle" color="#14532d">水にとけやすく、軽い気体</T>
      <T x={(split + right) / 2} y={168} size={9.5} weight="800" anchor="middle" color="#78350f">下方置換法</T>
      <T x={(split + right) / 2} y={180} size={8.5} anchor="middle" color="#78350f">水にとけやすく、重い気体</T>
      <T x={right - 3} y={air - 4} size={8.5} anchor="end" color={MUTED}>空気と同じ密度</T>
      {gases.map((item) => (
        <g key={item.name}>
          <circle cx={item.x} cy={item.y} r="5" fill="#ffffff" stroke={INK} strokeWidth="1.6" />
          <T x={item.side === 'end' ? item.x - 8 : item.x + 8} y={item.y + 3.5} size={9.5} weight="800" anchor={item.side === 'end' ? 'end' : 'start'}>{item.name}</T>
          {item.sub && <T x={item.side === 'end' ? item.x - 8 : item.x + 8} y={item.y + 16} size={8.5} anchor={item.side === 'end' ? 'end' : 'start'} color={MUTED}>{item.sub}</T>}
        </g>
      ))}
      <T x={left + 2} y={198} size={8.5} color={MUTED}>とけにくい</T>
      <T x={right} y={198} size={8.5} anchor="end" color={MUTED}>とけやすい</T>
      <T x={(left + right) / 2} y={216} size={9} weight="800" anchor="middle">水へのとけやすさ（右ほどとけやすい）</T>
    </svg>
  )
}

// ── 結晶の形 ─────────────────────────────────────────────────────────────
//   { name: 'crystalShapes' }
// 塩化ナトリウムは立方体、ミョウバンは正八面体、硝酸カリウムは細長い柱のような形。結晶の形は物質によって決まっている。
function CrystalShapesDiagram() {
  const needle = (x, y, length, angle) => (
    <g key={`${x}-${y}-${angle}`} transform={`rotate(${angle} ${x} ${y})`}>
      <path d={`M${x - length / 2},${y} L${x - length / 2 + 5},${y - 4} L${x + length / 2 - 5},${y - 4} L${x + length / 2},${y} L${x + length / 2 - 5},${y + 4} L${x - length / 2 + 5},${y + 4} Z`} fill="#f8fafc" stroke="#64748b" />
      <line x1={x - length / 2 + 5} y1={y} x2={x + length / 2 - 5} y2={y} stroke="#cbd5e1" />
    </g>
  )
  return (
    <svg viewBox="0 0 300 150" className="h-auto w-full" role="img" aria-label="物質と結晶の形" data-subject-diagram="crystalShapes">
      <path d="M34,46 L64,46 L64,76 L34,76 Z" fill="#f8fafc" stroke="#475569" />
      <path d="M34,46 L46,34 L76,34 L64,46 Z" fill="#ffffff" stroke="#475569" />
      <path d="M64,46 L76,34 L76,64 L64,76 Z" fill="#e2e8f0" stroke="#475569" />
      <path d="M150,22 L124,58 L144,68 Z" fill="#f0f9ff" stroke="#475569" />
      <path d="M150,22 L144,68 L178,56 Z" fill="#e0f2fe" stroke="#475569" />
      <path d="M150,96 L124,58 L144,68 Z" fill="#e2e8f0" stroke="#475569" />
      <path d="M150,96 L144,68 L178,56 Z" fill="#cbd5e1" stroke="#475569" />
      <path d="M150,22 L158,50 L178,56 M158,50 L124,58" fill="none" stroke="#94a3b8" strokeDasharray="2 2" />
      {needle(248, 44, 78, -18)}
      {needle(240, 62, 64, 12)}
      {needle(258, 78, 70, -6)}
      <T x={52} y={110} size={9.5} weight="800" anchor="middle">塩化ナトリウム</T>
      <T x={52} y={124} size={9} anchor="middle">立方体</T>
      <T x={52} y={140} size={8.5} anchor="middle" color={AMBER}>水を蒸発させる</T>
      <T x={150} y={110} size={9.5} weight="800" anchor="middle">ミョウバン</T>
      <T x={150} y={124} size={9} anchor="middle">正八面体</T>
      <T x={150} y={140} size={8.5} anchor="middle" color={BLUE}>水溶液を冷やす</T>
      <T x={248} y={110} size={9.5} weight="800" anchor="middle">硝酸カリウム</T>
      <T x={248} y={124} size={9} anchor="middle">細長い柱のような形</T>
      <T x={248} y={140} size={8.5} anchor="middle" color={BLUE}>水溶液を冷やす</T>
    </svg>
  )
}

// ── 状態変化と体積 ─────────────────────────────────────────────────────────────
//   { name: 'volumeChange' }
// 液体のロウを冷やして固体にすると、体積が小さくなり中央がへこむ。水を冷やして氷にすると、体積が大きくなり盛り上がる。
// 点線は液体のときの液面の高さ。どちらも、質量は変わらない。
function Beaker({ x, children }) {
  return (
    <g>
      {children}
      <path d={`M${x - 4},56 L${x},60 L${x},150 Q${x},156 ${x + 6},156 L${x + 84},156 Q${x + 90},156 ${x + 90},150 L${x + 90},56`} fill="none" stroke={LINE} strokeWidth="1.4" />
    </g>
  )
}
function VolumeChangeDiagram() {
  return (
    <svg viewBox="0 0 300 204" className="h-auto w-full" role="img" aria-label="ロウと水の、固体になったときの体積" data-subject-diagram="volumeChange">
      <line x1="80" y1="26" x2="104" y2="26" stroke={MUTED} strokeWidth="1.4" strokeDasharray="4 3" />
      <T x={108} y={29.5} size={8.5} color={MUTED}>液体のときの液面の高さ</T>
      <T x={75} y={48} size={10} weight="800" anchor="middle">ロウ</T>
      <T x={225} y={48} size={10} weight="800" anchor="middle">水</T>
      <Beaker x={30}>
        <path d="M30.7,96 Q75,124 119.3,96 L119.3,150 Q119.3,155.3 114,155.3 L36,155.3 Q30.7,155.3 30.7,150 Z" fill="#fef3c7" />
        <path d="M30.7,96 Q75,124 119.3,96" fill="none" stroke={AMBER} strokeWidth="1.2" />
        <line x1="26" y1="92" x2="124" y2="92" stroke={MUTED} strokeWidth="1.4" strokeDasharray="4 3" />
      </Beaker>
      <Beaker x={180}>
        <path d="M180.7,104 Q225,76 269.3,104 L269.3,150 Q269.3,155.3 264,155.3 L186,155.3 Q180.7,155.3 180.7,150 Z" fill="#e0f2fe" />
        <path d="M180.7,104 Q225,76 269.3,104" fill="none" stroke="#0284c7" strokeWidth="1.2" />
        <path d="M200,120 L212,112 M232,132 L246,124" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="176" y1="104" x2="274" y2="104" stroke={MUTED} strokeWidth="1.4" strokeDasharray="4 3" />
      </Beaker>
      <T x={75} y={172} size={9.5} weight="800" anchor="middle" color={AMBER}>体積が小さくなる</T>
      <T x={75} y={185} size={8.5} anchor="middle">（中央がへこむ）</T>
      <T x={225} y={172} size={9.5} weight="800" anchor="middle" color={BLUE}>体積が大きくなる</T>
      <T x={225} y={185} size={8.5} anchor="middle">（盛り上がる）</T>
      <T x={150} y={200} size={8.5} anchor="middle" color={MUTED}>どちらも、質量は変わらない</T>
    </svg>
  )
}

// ── 周期表（一部） ─────────────────────────────────────────────────────────
//   { name: 'periodicTable', highlight: ['H', 'C', …] }
// 第1周期〜第5周期の元素記号。青は金属の元素、黄は金属でない元素。highlight の元素は太いわくで示す。縦の列には性質の似た元素が並ぶ。
const PERIODIC_ROWS = Object.freeze([
  ['H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'He'],
  ['Li', 'Be', '', '', '', '', '', '', '', '', '', '', 'B', 'C', 'N', 'O', 'F', 'Ne'],
  ['Na', 'Mg', '', '', '', '', '', '', '', '', '', '', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
  ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
  ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
])
const NONMETALS = new Set(['H', 'He', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Si', 'P', 'S', 'Cl', 'Ar', 'As', 'Se', 'Br', 'Kr', 'Te', 'I', 'Xe'])
function PeriodicTableDiagram({ highlight = [] }) {
  const marked = new Set(highlight)
  const x0 = 6
  const y0 = 28
  const w = 16
  const h = 19
  return (
    <svg viewBox="0 0 300 146" className="h-auto w-full" role="img" aria-label="周期表（第1〜第5周期）" data-subject-diagram="periodicTable">
      <rect x="6" y="6" width="11" height="11" fill="#dbeafe" stroke="#60a5fa" />
      <T x={21} y={15.5} size={9}>金属の元素</T>
      <rect x="76" y="6" width="11" height="11" fill="#fef3c7" stroke="#f59e0b" />
      <T x={91} y={15.5} size={9}>金属でない元素</T>
      <rect x="164" y="6" width="11" height="11" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <T x={179} y={15.5} size={9}>図2の元素</T>
      {PERIODIC_ROWS.map((row, r) => row.map((symbol, c) => {
        if (!symbol) return null
        const nonmetal = NONMETALS.has(symbol)
        const strong = marked.has(symbol)
        const fill = nonmetal ? (strong ? '#fcd34d' : '#fef3c7') : (strong ? '#93c5fd' : '#dbeafe')
        return (
          <g key={symbol}>
            <rect x={x0 + c * w + 0.5} y={y0 + r * h + 0.5} width={w - 1} height={h - 1} rx="1.5" fill={fill} stroke={strong ? INK : nonmetal ? '#f59e0b' : '#60a5fa'} strokeWidth={strong ? 1.8 : 0.6} />
            <text x={x0 + c * w + w / 2} y={y0 + r * h + 13} fontSize="8.5" fontWeight={strong ? '800' : '600'} textAnchor="middle" fill={INK}>{symbol}</text>
          </g>
        )
      }))}
      <T x={150} y={140} size={8.5} anchor="middle" color={MUTED}>縦の列には、性質の似た元素が並ぶ</T>
    </svg>
  )
}

// ── 鉄と硫黄の反応 ───────────────────────────────────────────────────────
//   { name: 'ironSulfurHeating' }
// 左：鉄粉と硫黄の粉末の混合物の上の部分を加熱する。右：赤くなったら加熱をやめても、発生する熱で反応が下へ進み、黒い硫化鉄ができる。
function Mixture({ x, y, w, h, seed }) {
  const random = steady(seed)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#d6d3d1" />
      {Array.from({ length: Math.round((w * h) / 22) }, (_, index) => (
        <circle key={index} cx={x + 1.5 + random() * (w - 3)} cy={y + 1.5 + random() * (h - 3)} r="1.1" fill={index % 2 ? '#facc15' : '#78716c'} />
      ))}
    </g>
  )
}
function IronSulfurHeatingDiagram() {
  const tube = (x) => `M${x},32 L${x},160 A9,9 0 0 0 ${x + 18},160 L${x + 18},32`
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full" role="img" aria-label="鉄と硫黄の混合物を加熱する" data-subject-diagram="ironSulfurHeating">
      <T x={61} y={14} size={9.5} weight="800" anchor="middle">① 加熱する</T>
      <T x={223} y={14} size={9.5} weight="800" anchor="middle">② 加熱をやめる</T>
      <path d={`${tube(52)} Z`} fill={GLASS} />
      <Mixture x={52.6} y={86} w={16.8} h={82} seed={4} />
      <path d={tube(52)} fill="none" stroke={LINE} strokeWidth="1.3" />
      <ellipse cx="61" cy="31" rx="9" ry="4.5" fill="#ffffff" stroke="#94a3b8" />
      <rect x="14" y="128" width="12" height="44" fill="#94a3b8" stroke={LINE} />
      <g transform="rotate(42 20 128)"><Flame x={20} y={128} size={1.7} /></g>
      <path d={`${tube(214)} Z`} fill={GLASS} />
      <Mixture x={214.6} y={124} w={16.8} h={44} seed={6} />
      <rect x="214.6" y="86" width="16.8" height="28" fill="#1f2937" />
      <rect x="214.6" y="113" width="16.8" height="11" fill="#ef4444" />
      <path d={tube(214)} fill="none" stroke={LINE} strokeWidth="1.3" />
      <ellipse cx="223" cy="31" rx="9" ry="4.5" fill="#ffffff" stroke="#94a3b8" />
      <Arrow from={[246, 104]} to={[246, 150]} color={RED} width={2} />
      <Arrow from={[96, 64]} to={[178, 64]} color={LINE} width={2} />
      <T x={137} y={46} size={8.5} anchor="middle">赤くなったら</T>
      <T x={137} y={58} size={8.5} anchor="middle">加熱をやめる</T>
      <Callout from={[66, 140]} to={[92, 150]} text={'鉄粉と硫黄の\n混合物'} size={9} />
      <T x={6} y={190} size={8.5}>上の部分を加熱する</T>
      <Callout from={[218, 96]} to={[184, 100]} text="黒い硫化鉄" size={9} />
      <T x={254} y={124} size={8.5}>{'発生する\n熱で反応\nが下へ\n進む'}</T>
    </svg>
  )
}

// ── 加熱前と加熱後の性質 ─────────────────────────────────────────────────────
//   { name: 'ironSulfurTests' }
// 左の列は鉄と硫黄の混合物（加熱前）、右の列は硫化鉄（加熱後）。見た目・磁石・うすい塩酸を加えたときの結果を比べる。
function IronSulfurTestsDiagram() {
  const c1 = 119
  const c2 = 239
  const magnet = (x, y) => (
    <g>
      <rect x={x - 22} y={y} width="22" height="10" fill="#ef4444" />
      <rect x={x} y={y} width="22" height="10" fill="#3b82f6" />
    </g>
  )
  const testTube = (x, y, liquid) => (
    <g>
      <path d={`M${x - 7},${y} L${x - 7},${y + 36} A7,7 0 0 0 ${x + 7},${y + 36} L${x + 7},${y}`} fill={GLASS} stroke={LINE} />
      <path d={`M${x - 6.4},${y + 18} L${x - 6.4},${y + 36} A6.4,6.4 0 0 0 ${x + 6.4},${y + 36} L${x + 6.4},${y + 18} Z`} fill={liquid} />
    </g>
  )
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="鉄と硫黄の混合物と硫化鉄の性質のちがい" data-subject-diagram="ironSulfurTests">
      <T x={c1} y={16} size={9.5} weight="800" anchor="middle">加熱前（混合物）</T>
      <T x={c2} y={16} size={9.5} weight="800" anchor="middle">加熱後（硫化鉄）</T>
      {[24, 92, 160].map((y) => <line key={y} x1="4" x2="296" y1={y} y2={y} stroke="#e2e8f0" />)}
      <line x1="179" x2="179" y1="22" y2="232" stroke="#e2e8f0" />
      <T x={4} y={58} size={9.5} weight="800" color={MUTED}>見た目</T>
      <T x={4} y={122} size={9.5} weight="800" color={MUTED}>{'磁石を\n近づける'}</T>
      <T x={4} y={190} size={9.5} weight="800" color={MUTED}>{'うすい\n塩酸を\n加える'}</T>
      <path d={`M${c1 - 26},64 Q${c1},36 ${c1 + 26},64 Z`} fill="#d6d3d1" stroke="#a8a29e" />
      {Array.from({ length: 26 }, (_, i) => {
        const t = ((i * 0.6180339) % 1) * 2 - 1
        const top = 64 - 28 * (1 - t * t) * 0.9
        return <circle key={i} cx={c1 + t * 22} cy={top + ((i * 0.3819) % 1) * (62 - top)} r="1.3" fill={i % 2 ? '#facc15' : '#57534e'} />
      })}
      <T x={c1} y={82} size={8.5} anchor="middle">灰色と黄色の粉が混じる</T>
      <path d={`M${c2 - 22},62 L${c2 - 16},44 L${c2 + 2},40 L${c2 + 20},48 L${c2 + 22},62 Z`} fill="#1f2937" stroke="#000000" />
      <T x={c2} y={82} size={8.5} anchor="middle">黒い固体</T>
      {magnet(c1, 98)}
      {[[c1 - 8, 110], [c1 - 2, 111], [c1 + 6, 110], [c1 + 12, 111]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.4" fill="#57534e" />)}
      <path d={`M${c1 - 22},128 Q${c1},116 ${c1 + 22},128 Z`} fill="#d6d3d1" stroke="#a8a29e" />
      <T x={c1} y={146} size={9} weight="800" anchor="middle" color={GREEN}>つく（鉄が混じっている）</T>
      {magnet(c2, 98)}
      <path d={`M${c2 - 14},130 L${c2 - 10},118 L${c2 + 4},116 L${c2 + 14},122 L${c2 + 14},130 Z`} fill="#1f2937" />
      <T x={c2} y={146} size={9} weight="800" anchor="middle" color={RED}>つかない</T>
      {testTube(c1 - 30, 168, '#e0f2fe')}
      <Bubbles points={[[c1 - 30, 198], [c1 - 31, 190], [c1 - 29, 182]]} r={1.8} />
      <T x={c1 + 12} y={190} size={9} weight="800" anchor="middle" color={GREEN}>水素が出る</T>
      <T x={c1 + 12} y={204} size={8.5} anchor="middle">においはない</T>
      {testTube(c2 - 34, 168, '#e0f2fe')}
      <Bubbles points={[[c2 - 34, 198], [c2 - 35, 190], [c2 - 33, 182]]} r={1.8} />
      <path d={`M${c2 - 40},164 q3,-4 0,-8 q-3,-4 0,-8 M${c2 - 30},164 q3,-4 0,-8 q-3,-4 0,-8`} fill="none" stroke="#a16207" strokeWidth="1.2" />
      <T x={c2 + 14} y={186} size={9} weight="800" anchor="middle" color={RED}>硫化水素が出る</T>
      <T x={c2 + 14} y={200} size={8.5} anchor="middle">{'卵のくさった\nようなにおい'}</T>
    </svg>
  )
}

// ── 高炉で鉄をとり出す（製鉄） ─────────────────────────────────────────────────
//   { name: 'blastFurnace' }
// 上から鉄鉱石（酸化鉄）・コークス（炭素）・石灰石を入れ、下から熱風をふきこむ。炭素などが酸化鉄から酸素をうばい（還元）、とけた鉄が底にたまる。
function BlastFurnaceDiagram() {
  const outline = 'M118,32 L182,32 L206,122 L196,196 L104,196 L94,122 Z'
  const layers = []
  for (let y = 34; y < 132; y += 10) layers.push(<rect key={y} x="80" y={y} width="140" height="10" fill={(y - 34) % 20 ? '#292524' : '#b45309'} />)
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="高炉で鉄をとり出すしくみ" data-subject-diagram="blastFurnace">
      <defs>
        <clipPath id="blast-furnace-inside"><path d={outline} /></clipPath>
      </defs>
      <g clipPath="url(#blast-furnace-inside)">
        {layers}
        <rect x="80" y="132" width="140" height="36" fill="#fb923c" />
        <rect x="80" y="168" width="140" height="14" fill="#facc15" />
        <rect x="80" y="182" width="140" height="16" fill="#ef4444" />
      </g>
      <path d={outline} fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinejoin="round" />
      {[128, 150, 172].map((x) => <Arrow key={x} from={[x, 160]} to={[x, 138]} color="#ffffff" width={1.6} head={5} />)}
      <Arrow from={[150, 6]} to={[150, 28]} color={LINE} width={2} />
      <T x={140} y={14} size={9} weight="800" anchor="end">鉄鉱石（酸化鉄）</T>
      <T x={160} y={14} size={9} weight="800">コークス（炭素）</T>
      <T x={160} y={26} size={9} weight="800">・石灰石</T>
      <Arrow from={[58, 152]} to={[94, 152]} color={RED} width={2} />
      <Arrow from={[242, 152]} to={[206, 152]} color={RED} width={2} />
      <T x={52} y={155.5} size={9.5} weight="800" anchor="end" color={RED}>熱風</T>
      <T x={248} y={155.5} size={9.5} weight="800" color={RED}>熱風</T>
      <Arrow from={[102, 176]} to={[66, 190]} color="#a16207" width={1.8} />
      <T x={62} y={200} size={9.5} weight="800" anchor="end" color="#a16207">スラグ</T>
      <Arrow from={[198, 190]} to={[238, 204]} color={RED} width={2} />
      <T x={242} y={208} size={9.5} weight="800" color={RED}>とけた鉄</T>
      <Callout from={[176, 140]} to={[214, 104]} text={'ここで酸化鉄が\n還元される'} size={9} />
      <T x={150} y={226} size={8.5} anchor="middle">炭素（コークス）などが、酸化鉄から酸素をうばう（還元）</T>
    </svg>
  )
}

// ── 密閉した容器と開いた容器での質量 ─────────────────────────────────────────────
//   { name: 'closedOpenMass' }
// 3つの化学変化を、上の段は密閉した容器で、下の段はふたを開けた容器（空気中）で行い、反応の前と後の全体の質量を比べる。
// 気体が出ていく反応では減り、空気中の酸素と結びつく反応では増える。密閉すれば、どれも変わらない。
function Scale({ x, y }) {
  return (
    <g>
      <rect x={x - 28} y={y} width="56" height="10" rx="2" fill="#64748b" />
      <rect x={x - 10} y={y + 2.5} width="20" height="5" rx="1" fill="#e2e8f0" />
    </g>
  )
}
function ClosedOpenMassDiagram() {
  const cols = [99, 179, 259]
  const badge = (x, y, text, tone) => {
    const color = { same: GREEN, down: RED, up: BLUE }[tone]
    return (
      <g>
        <rect x={x - 32} y={y - 11} width="64" height="16" rx="8" fill="#ffffff" stroke={color} strokeWidth="1.3" />
        <T x={x} y={y + 1.5} size={9} weight="800" anchor="middle" color={color}>{text}</T>
      </g>
    )
  }
  const flask = (x, base, inner) => (
    <g>
      <path d={`M${x - 5},${base - 34} L${x - 5},${base - 24} L${x - 18},${base} L${x + 18},${base} L${x + 5},${base - 24} L${x + 5},${base - 34}`} fill={GLASS} stroke={LINE} />
      {inner}
    </g>
  )
  const stopper = (x, base) => <rect x={x - 6.5} y={base - 39} width="13" height="7" rx="1.5" fill="#57534e" />
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="密閉した容器と開いた容器での化学変化の質量" data-subject-diagram="closedOpenMass">
      <T x={cols[0]} y={14} size={9} weight="800" anchor="middle">{'沈殿が\nできる'}</T>
      <T x={cols[1]} y={14} size={9} weight="800" anchor="middle">{'気体が\n出る'}</T>
      <T x={cols[2]} y={14} size={9} weight="800" anchor="middle">{'スチールウール\nを燃やす'}</T>
      <line x1="4" x2="296" y1="34" y2="34" stroke="#e2e8f0" />
      <line x1="4" x2="296" y1="130" y2="130" stroke="#e2e8f0" />
      <T x={4} y={72} size={9.5} weight="800" color={MUTED}>{'密閉\nした\n容器'}</T>
      <T x={4} y={168} size={9.5} weight="800" color={MUTED}>{'ふたを\n開けた\n容器'}</T>
      {[0, 1].map((row) => {
        const base = row ? 192 : 96
        const open = row === 1
        return (
          <g key={row}>
            {cols.map((x) => <Scale key={x} x={x} y={base} />)}
            {flask(cols[0], base, (
              <g>
                <path d={`M${cols[0] - 11},${base - 16} L${cols[0] + 11},${base - 16} L${cols[0] + 17.4},${base - 0.6} L${cols[0] - 17.4},${base - 0.6} Z`} fill="#e0f2fe" />
                {[-11, -6, -1, 4, 9, -8, 2, 7].map((dx, k) => <circle key={k} cx={cols[0] + dx} cy={base - (k < 5 ? 3 : 6.5)} r="2.2" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.6" />)}
              </g>
            ))}
            {flask(cols[1], base, (
              <g>
                <path d={`M${cols[1] - 11},${base - 16} L${cols[1] + 11},${base - 16} L${cols[1] + 17.4},${base - 0.6} L${cols[1] - 17.4},${base - 0.6} Z`} fill="#e0f2fe" />
                <Bubbles points={[[cols[1] - 4, base - 6], [cols[1] + 5, base - 10], [cols[1], base - 13]]} r={1.8} />
              </g>
            ))}
            {flask(cols[2], base, <path d={`M${cols[2] - 8},${base - 6} q4,-6 8,0 q4,6 8,0 M${cols[2] - 6},${base - 10} q4,-5 8,0 q3,4 6,0`} fill="none" stroke="#64748b" strokeWidth="1.2" />)}
            {!open && cols.map((x) => <g key={x}>{stopper(x, base)}</g>)}
            {open && (
              <g>
                <path d={`M${cols[1] - 3},${base - 36} q-3,-4 0,-8 M${cols[1] + 4},${base - 36} q-3,-4 0,-8`} fill="none" stroke={MUTED} strokeWidth="1.2" />
                <T x={cols[1]} y={base - 50} size={8.5} anchor="middle" color={MUTED}>気体が出ていく</T>
                <path d={`M${cols[2]},${base - 8} C${cols[2] - 6},${base - 14} ${cols[2] - 3},${base - 22} ${cols[2]},${base - 28} C${cols[2] + 3},${base - 22} ${cols[2] + 6},${base - 14} ${cols[2]},${base - 8} Z`} fill="#fb923c" opacity="0.9" />
                <T x={cols[2]} y={base - 50} size={8.5} anchor="middle" color={MUTED}>酸素が結びつく</T>
              </g>
            )}
            {badge(cols[0], base + 26, '変わらない', 'same')}
            {badge(cols[1], base + 26, open ? '減る' : '変わらない', open ? 'down' : 'same')}
            {badge(cols[2], base + 26, open ? '増える' : '変わらない', open ? 'up' : 'same')}
          </g>
        )
      })}
    </svg>
  )
}

// ── 鉄の酸化で温度が上がる ───────────────────────────────────────────────────
//   { name: 'ironOxidationHeat' }
// 鉄粉と活性炭を入れたビーカーに食塩水を数滴加えてかき混ぜると、鉄が空気中の酸素と結びつき（酸化）、熱が出て温度計の示す温度が上がる。
function Thermometer({ x, top, bottom, level }) {
  return (
    <g>
      <rect x={x - 3.5} y={top} width="7" height={bottom - top} rx="3.5" fill="#ffffff" stroke={LINE} />
      <circle cx={x} cy={bottom + 3} r="5.5" fill="#ef4444" stroke={LINE} />
      <rect x={x - 1.5} y={level} width="3" height={bottom - level + 2} fill="#ef4444" />
    </g>
  )
}
function IronOxidationHeatDiagram() {
  const random = steady(12)
  const grains = Array.from({ length: 40 }, (_, i) => [44 + random() * 82, 128 + random() * 18, i % 3 === 0])
  return (
    <svg viewBox="0 0 300 186" className="h-auto w-full" role="img" aria-label="鉄粉の酸化で温度が上がるようす" data-subject-diagram="ironOxidationHeat">
      <path d="M38,56 L42,60 L42,146 Q42,152 48,152 L124,152 Q130,152 130,146 L130,56" fill={GLASS} stroke={LINE} strokeWidth="1.4" />
      {grains.map(([x, y, dark], i) => <circle key={i} cx={x} cy={y} r="2" fill={dark ? '#111827' : '#9ca3af'} />)}
      <Thermometer x={104} top={24} bottom={138} level={70} />
      <path d="M60,14 L60,30 L56,40 L64,40 L60,30" fill="#e0f2fe" stroke={LINE} />
      <rect x="55" y="4" width="10" height="12" rx="3" fill="#94a3b8" />
      {[50, 60, 70].map((y) => <ellipse key={y} cx="60" cy={y + 2} rx="1.6" ry="2.4" fill="#7dd3fc" />)}
      <T x={70} y={22} size={8.5}>食塩水を数滴</T>
      <Callout from={[50, 138]} to={[36, 124]} text={'鉄粉＋\n活性炭'} size={9} />
      <T x={110} y={34} size={8.5} color={MUTED}>温度計</T>
      <Thermometer x={196} top={40} bottom={136} level={118} />
      <Thermometer x={262} top={40} bottom={136} level={64} />
      <Arrow from={[212, 96]} to={[246, 96]} color={RED} width={2} />
      <T x={196} y={162} size={8.5} anchor="middle">はじめ</T>
      <T x={262} y={162} size={8.5} anchor="middle">しばらくすると</T>
      <T x={229} y={28} size={9.5} weight="800" anchor="middle" color={RED}>温度が上がる</T>
      <T x={150} y={182} size={8.5} anchor="middle">鉄が空気中の酸素と結びつき（酸化）、熱が出る</T>
    </svg>
  )
}

// ── 化学かいろと加熱式の弁当 ─────────────────────────────────────────────────
//   { name: 'handWarmer' }
// 左：化学かいろ。小さな穴から入る空気中の酸素と鉄粉が結びつき、熱を出す。活性炭と食塩水は、鉄の酸化を速める。
// 右：加熱式の弁当。ひもを引くと水と酸化カルシウムが混ざり、出た熱で食べ物が温まる。
function HandWarmerDiagram() {
  const random = steady(21)
  const grains = Array.from({ length: 70 }, (_, i) => [28 + random() * 96, 50 + random() * 82, i % 3])
  const colors = ['#9ca3af', '#111827', '#38bdf8']
  return (
    <svg viewBox="0 0 300 196" className="h-auto w-full" role="img" aria-label="化学かいろと加熱式の弁当のしくみ" data-subject-diagram="handWarmer">
      <Panel x={4} y={4} w={144} h={188} title="化学かいろ" />
      <Panel x={152} y={4} w={144} h={188} title="加熱式の弁当" />
      <rect x="22" y="44" width="108" height="94" rx="10" fill="#fff7ed" stroke="#c2410c" strokeWidth="1.4" strokeDasharray="5 3" />
      {grains.map(([x, y, kind], i) => <circle key={i} cx={x} cy={y} r={kind === 2 ? 1.6 : 2} fill={colors[kind]} />)}
      {[[14, 70], [14, 110]].map(([x, y]) => <Arrow key={y} from={[x - 4, y]} to={[x + 12, y]} color={BLUE} width={1.4} head={5} />)}
      <T x={6} y={62} size={8.5} weight="800" color={BLUE}>酸素</T>
      <path d="M136,64 q5,-4 0,-8 q-5,-4 0,-8 M140,104 q5,-4 0,-8 q-5,-4 0,-8" fill="none" stroke={RED} strokeWidth="1.4" />
      <T x={142} y={124} size={8.5} weight="800" anchor="end" color={RED}>熱</T>
      {[['鉄粉', 0], ['活性炭', 1], ['食塩水', 2]].map(([name, kind], index) => (
        <g key={name}>
          <circle cx={20} cy={154 + index * 13} r="3" fill={colors[kind]} />
          <T x={28} y={157.5 + index * 13} size={8.5}>{name}</T>
        </g>
      ))}
      <T x={84} y={157.5} size={8.5} color={MUTED}>{'小さな穴から\n酸素が少しずつ\n入る'}</T>
      <rect x="168" y="58" width="112" height="46" rx="4" fill="#fef3c7" stroke="#b45309" />
      <ellipse cx="200" cy="80" rx="16" ry="8" fill="#ffffff" stroke="#e5e7eb" />
      <ellipse cx="246" cy="82" rx="18" ry="9" fill="#fdba74" stroke="#ea580c" />
      <rect x="168" y="106" width="112" height="34" rx="4" fill="#f1f5f9" stroke="#64748b" />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={176 + (i % 12) * 8} cy={i < 12 ? 120 : 130} r="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.6" />)}
      <rect x="236" y="112" width="36" height="22" rx="5" fill="#bae6fd" stroke="#0284c7" />
      <path d="M280,124 L292,124 L292,150" fill="none" stroke={LINE} strokeWidth="1.4" />
      <circle cx="292" cy="154" r="4" fill="none" stroke={LINE} strokeWidth="1.4" />
      {[190, 222, 254].map((x) => <path key={x} d={`M${x},104 q-4,-5 0,-10 q4,-5 0,-10`} fill="none" stroke={RED} strokeWidth="1.4" />)}
      <T x={160} y={40} size={8.5} color={RED}>熱で食べ物が温まる</T>
      <T x={196} y={156} size={8.5} anchor="middle">酸化カルシウム</T>
      <T x={254} y={156} size={8.5} anchor="middle">水</T>
      <T x={160} y={184} size={8.5}>ひもを引くと、水と混ざる</T>
    </svg>
  )
}

// ── ホットケーキがふくらむわけ ─────────────────────────────────────────────────
//   { name: 'pancakeRise' }
// 生地にふくまれる炭酸水素ナトリウム（ベーキングパウダー）が加熱で分解し、出てきた二酸化炭素の泡で生地がふくらむ。
function PancakeRiseDiagram() {
  const random = steady(31)
  const bubbles = Array.from({ length: 16 }, () => [26 + random() * 112, 76 + random() * 26])
  return (
    <svg viewBox="0 0 300 168" className="h-auto w-full" role="img" aria-label="ホットケーキがふくらむわけ" data-subject-diagram="pancakeRise">
      <path d="M20,108 Q20,70 82,68 Q144,70 144,108 Z" fill="#fcd34d" stroke="#b45309" />
      {bubbles.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 3 : 4.5} fill="#fffbeb" stroke="#d97706" strokeWidth="0.7" />)}
      <path d="M8,108 L156,108 L150,118 L14,118 Z" fill="#334155" />
      <rect x="156" y="110" width="26" height="5" rx="2" fill="#334155" />
      <path d="M60,148 C52,140 56,130 60,124 C64,130 68,140 60,148 Z M104,148 C96,140 100,130 104,124 C108,130 112,140 104,148 Z" fill="#fb923c" />
      <Callout from={[110, 84]} to={[124, 46]} text="二酸化炭素の泡" size={9} />
      <T x={82} y={164} size={8.5} anchor="middle">加熱する</T>
      <T x={232} y={28} size={9} weight="800" anchor="middle">炭酸水素ナトリウム</T>
      <T x={232} y={41} size={8.5} anchor="middle" color={MUTED}>（ベーキングパウダー）</T>
      <Arrow from={[232, 48]} to={[232, 72]} color={RED} width={2} />
      <T x={238} y={64} size={8.5} color={RED}>加熱で分解</T>
      <T x={232} y={90} size={9} weight="800" anchor="middle">炭酸ナトリウム</T>
      <T x={232} y={106} size={9} weight="800" anchor="middle" color={RED}>＋ 二酸化炭素</T>
      <T x={232} y={122} size={9} weight="800" anchor="middle">＋ 水</T>
      <T x={232} y={146} size={8.5} anchor="middle">{'泡で生地が\nふくらむ'}</T>
    </svg>
  )
}

// ── 水溶液に電流が流れるか ─────────────────────────────────────────────────────
//   { name: 'electrolyteTest' }
// 左：塩化ナトリウム水溶液。水溶液の中に電気を帯びた粒（＋と－）があり、電流が流れて豆電球がつく（電解質）。
// 右：砂糖水。電気を帯びた粒がなく、電流が流れない（非電解質）。
function ElectrolyteSetup({ x0, lit }) {
  // 粒は電極（x0+50〜56、x0+88〜94）をよけて、重ならないように置く。
  const particles = [[37, 114], [39, 134], [36, 152], [66, 112], [78, 126], [65, 140], [79, 153], [105, 114], [110, 132], [103, 150]].map(([dx, y], i) => [x0 + dx, y, i % 2])
  return (
    <g>
      <path d={`M${x0 + 22},80 L${x0 + 22},156 Q${x0 + 22},162 ${x0 + 28},162 L${x0 + 116},162 Q${x0 + 122},162 ${x0 + 122},156 L${x0 + 122},80`} fill={GLASS} stroke={LINE} strokeWidth="1.3" />
      <rect x={x0 + 23} y={104} width="98" height="57.4" fill="#e0f2fe" />
      {particles.map(([x, y, kind], i) => (lit
        ? <circle key={i} cx={x} cy={y} r="5.5" fill={kind ? '#c4b5fd' : '#86efac'} stroke={LINE} strokeWidth="0.6" />
        : <path key={i} d={`M${x - 5},${y} L${x - 2.5},${y - 4.3} L${x + 2.5},${y - 4.3} L${x + 5},${y} L${x + 2.5},${y + 4.3} L${x - 2.5},${y + 4.3} Z`} fill="#fef3c7" stroke="#a16207" strokeWidth="0.7" />))}
      {lit && particles.map(([x, y, kind], i) => <text key={`t${i}`} x={x} y={y + 3.3} fontSize="9" fontWeight="800" textAnchor="middle" fill={INK}>{kind ? '＋' : '－'}</text>)}
      <rect x={x0 + 50} y={60} width="6" height="84" fill="#64748b" />
      <rect x={x0 + 88} y={60} width="6" height="84" fill="#64748b" />
      <path d={`M${x0 + 53},60 L${x0 + 53},32 L${x0 + 64},32 M${x0 + 80},32 L${x0 + 91},32 L${x0 + 91},60`} fill="none" stroke={LINE} strokeWidth="1.3" />
      <rect x={x0 + 64} y={26} width="7" height="12" fill="#334155" />
      <line x1={x0 + 74} y1={24} x2={x0 + 74} y2={40} stroke="#334155" strokeWidth="1.4" />
      <path d={`M${x0 + 74},32 L${x0 + 80},32`} stroke={LINE} strokeWidth="1.3" />
      <circle cx={x0 + 72} cy={14} r="7" fill={lit ? '#fde047' : '#f1f5f9'} stroke={lit ? '#ca8a04' : '#94a3b8'} />
      <line x1={x0 + 72} y1={21} x2={x0 + 72} y2={26} stroke={LINE} />
      {lit && <path d={`M${x0 + 82},8 L${x0 + 88},4 M${x0 + 83},15 L${x0 + 90},15 M${x0 + 62},8 L${x0 + 56},4 M${x0 + 61},15 L${x0 + 54},15`} stroke="#ca8a04" strokeWidth="1.3" />}
    </g>
  )
}
function ElectrolyteTestDiagram() {
  return (
    <svg viewBox="0 0 300 214" className="h-auto w-full" role="img" aria-label="水溶液に電流が流れるかを調べる" data-subject-diagram="electrolyteTest">
      <ElectrolyteSetup x0={2} lit />
      <ElectrolyteSetup x0={150} lit={false} />
      <T x={74} y={178} size={9.5} weight="800" anchor="middle">塩化ナトリウム水溶液</T>
      <T x={74} y={192} size={8.5} anchor="middle" color={GREEN}>電流が流れる（電解質）</T>
      <T x={74} y={206} size={8.5} anchor="middle" color={MUTED}>電気を帯びた粒がある</T>
      <T x={222} y={178} size={9.5} weight="800" anchor="middle">砂糖水</T>
      <T x={222} y={192} size={8.5} anchor="middle" color={RED}>電流が流れない（非電解質）</T>
      <T x={222} y={206} size={8.5} anchor="middle" color={MUTED}>電気を帯びた粒がない</T>
    </svg>
  )
}

// ── 指示薬の色と、マグネシウムとの反応 ─────────────────────────────────────────────
//   { name: 'indicatorColors' }
// 横に酸性・中性・アルカリ性。縦に調べ方。色の見本に、色の名前もそえる。
const INDICATOR_ROWS = Object.freeze([
  { label: '青色リトマス紙', kind: 'strip', cells: [['#ef4444', '赤'], ['#3b82f6', '青のまま'], ['#3b82f6', '青のまま']] },
  { label: '赤色リトマス紙', kind: 'strip', cells: [['#ef4444', '赤のまま'], ['#ef4444', '赤のまま'], ['#3b82f6', '青']] },
  { label: 'BTB液', kind: 'tube', cells: [['#facc15', '黄色'], ['#22c55e', '緑色'], ['#2563eb', '青色']] },
  { label: 'フェノール\nフタレイン液', kind: 'tube', cells: [['#f8fafc', '無色'], ['#f8fafc', '無色'], ['#e11d74', '赤色']] },
  { label: 'マグネシウム\nを入れる', kind: 'metal', cells: [[null, '水素が出る'], [null, '変化なし'], [null, '変化なし']] },
])
function IndicatorColorsDiagram() {
  const cols = [126, 196, 264]
  const heads = [['酸性', RED], ['中性', GREEN], ['アルカリ性', BLUE]]
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="酸性・中性・アルカリ性の水溶液の調べ方" data-subject-diagram="indicatorColors">
      {heads.map(([text, color], index) => <T key={text} x={cols[index]} y={16} size={10} weight="800" anchor="middle" color={color}>{text}</T>)}
      {INDICATOR_ROWS.map((row, r) => {
        const y = 26 + r * 36
        return (
          <g key={row.label}>
            <line x1="4" x2="296" y1={y} y2={y} stroke="#e2e8f0" />
            <T x={4} y={y + (row.label.includes('\n') ? 15 : 21)} size={9} weight="800" color={MUTED}>{row.label}</T>
            {row.cells.map(([color, text], c) => {
              const x = cols[c]
              return (
                <g key={c}>
                  {row.kind === 'strip' && <rect x={x - 26} y={y + 7} width="16" height="22" rx="1.5" fill={color} stroke="#475569" strokeWidth="0.6" />}
                  {row.kind === 'tube' && (
                    <g>
                      <path d={`M${x - 24},${y + 5} L${x - 24},${y + 25} A6,6 0 0 0 ${x - 12},${y + 25} L${x - 12},${y + 5}`} fill={GLASS} stroke={LINE} />
                      <path d={`M${x - 23.4},${y + 13} L${x - 23.4},${y + 25} A5.4,5.4 0 0 0 ${x - 12.6},${y + 25} L${x - 12.6},${y + 13} Z`} fill={color} />
                    </g>
                  )}
                  {row.kind === 'metal' && (
                    <g>
                      <rect x={x - 27} y={y + 22} width="14" height="4" fill="#94a3b8" />
                      {c === 0 && <Bubbles points={[[x - 22, y + 16], [x - 17, y + 11], [x - 21, y + 6]]} r={1.8} />}
                    </g>
                  )}
                  <T x={x - 7} y={y + 22} size={8.5} weight="800">{text}</T>
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

// ── プラスチックの浮きしずみ ─────────────────────────────────────────────────────
//   { name: 'plasticFloat' }
// 水に入れると、ポリエチレン（PE）とポリプロピレン（PP）は浮き、ポリスチレン（PS）・PET・ポリ塩化ビニル（PVC）はしずむ。
// 水より密度が小さいものは浮き、大きいものはしずむ（発泡させていないもの）。
function PlasticFloatDiagram() {
  const piece = (x, y, label, fill, angle = 0) => (
    <g key={label} transform={`rotate(${angle} ${x} ${y})`}>
      <rect x={x - 16} y={y - 6} width="32" height="12" rx="2" fill={fill} stroke="#475569" />
      <text x={x} y={y + 3.4} fontSize="9" fontWeight="800" textAnchor="middle" fill={INK}>{label}</text>
    </g>
  )
  return (
    <svg viewBox="0 0 300 162" className="h-auto w-full" role="img" aria-label="プラスチックを水に入れたときの浮きしずみ" data-subject-diagram="plasticFloat">
      <path d="M36,30 L40,34 L40,150 Q40,156 46,156 L254,156 Q260,156 260,150 L260,30" fill={GLASS} stroke={LINE} strokeWidth="1.4" />
      <rect x="40.7" y="48" width="218.6" height="107.3" fill="#e0f2fe" />
      <line x1="40.7" x2="259.3" y1="48" y2="48" stroke="#0284c7" />
      {piece(96, 46, 'PE', '#fde68a', -4)}
      {piece(148, 46, 'PP', '#fbcfe8', 3)}
      {piece(92, 148, 'PS', '#e2e8f0', 2)}
      {piece(150, 148, 'PET', '#bfdbfe', -3)}
      {piece(206, 148, 'PVC', '#d9f99d', 4)}
      <T x={176} y={44} size={9.5} weight="800" color={BLUE}>浮く</T>
      <T x={238} y={128} size={9.5} weight="800" anchor="middle" color={RED}>しずむ</T>
      <T x={150} y={98} size={8.5} anchor="middle" color={MUTED}>{'水（密度1.0g/cm³）より\n密度が小さいものは浮く'}</T>
    </svg>
  )
}

// ── 海に流れ出たプラスチックごみ ─────────────────────────────────────────────────
//   { name: 'oceanPlastic' }
// ①捨てられたごみが川から海へ流れ出る → ②自然界ではほとんど分解されずに残る → ③波や紫外線で細かくくだける → ④生物が飲みこむ。番号は流れ図と同じ。
function OceanPlasticDiagram() {
  const random = steady(41)
  const bits = Array.from({ length: 26 }, () => [168 + random() * 120, 108 + random() * 26])
  return (
    <svg viewBox="0 0 300 172" className="h-auto w-full" role="img" aria-label="海に流れ出たプラスチックごみの問題" data-subject-diagram="oceanPlastic">
      <path d="M0,40 L80,40 Q110,60 120,100 L0,100 Z" fill="#ecfccb" stroke="#65a30d" />
      <path d="M0,62 Q40,58 70,70 Q96,82 120,96" fill="none" stroke="#38bdf8" strokeWidth="5" />
      <rect x="112" y="96" width="188" height="76" fill="#bae6fd" />
      <path d="M112,96 Q130,90 148,96 T184,96 T220,96 T256,96 T292,96" fill="none" stroke="#0284c7" strokeWidth="1.2" />
      <circle cx="262" cy="22" r="10" fill="#fde047" stroke="#ca8a04" />
      <path d="M248,34 L234,52 M258,38 L250,58" stroke="#a855f7" strokeWidth="1.4" strokeDasharray="3 2" />
      <rect x="40" y="56" width="10" height="16" rx="2" fill="#f8fafc" stroke="#64748b" transform="rotate(-20 45 64)" />
      <path d="M86,72 q6,-6 12,0 q-6,8 -12,0 Z" fill="#fda4af" stroke="#be123c" />
      <rect x="138" y="100" width="12" height="20" rx="3" fill="#f8fafc" stroke="#64748b" transform="rotate(30 144 110)" />
      {bits.map(([x, y], i) => <rect key={i} x={x} y={y} width={i % 3 ? 2.2 : 3.2} height="2.2" fill={['#f43f5e', '#f8fafc', '#facc15'][i % 3]} stroke="#64748b" strokeWidth="0.3" />)}
      <path d="M228,150 Q244,140 262,150 Q244,160 228,150 Z M262,150 L272,144 L272,156 Z" fill="#fb923c" stroke="#c2410c" />
      <circle cx="236" cy="148" r="1.2" fill={INK} />
      <Num x={60} y={30} n="1" color={BLUE} />
      <Num x={160} y={84} n="2" color={BLUE} />
      <Num x={214} y={48} n="3" color={BLUE} />
      <Num x={284} y={136} n="4" color={BLUE} />
      <T x={6} y={118} size={8.5}>{'①川から海へ\n②分解されず残る'}</T>
      <T x={148} y={40} size={8.5}>{'③波や紫外線で\n細かくくだける'}</T>
      <T x={6} y={156} size={8.5}>④生物が飲みこむ</T>
    </svg>
  )
}

// ── 一次電池と二次電池 ───────────────────────────────────────────────────────
//   { name: 'batteryCycle' }
// 上：二次電池。放電で化学エネルギーを電気エネルギーとしてとり出し、充電（外部から電流を流す）で逆の化学変化を起こして、もとの状態にもどす。
// 下：一次電池。放電すると電圧が下がり、充電してもとにもどすことはできない。
function Battery({ x, y, level, w = 34, h = 54 }) {
  const color = level > 0.5 ? '#4ade80' : '#f87171'
  return (
    <g>
      <rect x={x + w / 2 - 6} y={y - 5} width="12" height="6" rx="1.5" fill="#94a3b8" />
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#ffffff" stroke={LINE} strokeWidth="1.4" />
      <rect x={x + 4} y={y + 4 + (h - 8) * (1 - level)} width={w - 8} height={(h - 8) * level} rx="2" fill={color} />
    </g>
  )
}
function BatteryCycleDiagram() {
  return (
    <svg viewBox="0 0 300 236" className="h-auto w-full" role="img" aria-label="一次電池と二次電池" data-subject-diagram="batteryCycle">
      <T x={6} y={14} size={9.5} weight="800">二次電池（充電してくり返し使える）</T>
      <Battery x={44} y={52} level={0.9} />
      <Battery x={222} y={52} level={0.2} />
      <T x={22} y={74} size={8.5} anchor="middle">{'充電された\n状態'}</T>
      <T x={278} y={74} size={8.5} anchor="middle">{'放電した\n状態'}</T>
      <path d="M86,60 Q150,30 214,60" fill="none" stroke={RED} strokeWidth="2" />
      <path d="M214,60 L203,58 L208,51 Z" fill={RED} />
      <T x={150} y={36} size={8.5} weight="800" anchor="middle" color={RED}>放電：化学エネルギー→電気エネルギー</T>
      <path d="M214,100 Q150,130 86,100" fill="none" stroke={BLUE} strokeWidth="2" />
      <path d="M86,100 L97,102 L92,109 Z" fill={BLUE} />
      <T x={150} y={130} size={8.5} weight="800" anchor="middle" color={BLUE}>充電：電気エネルギー→化学エネルギー</T>
      <T x={150} y={143} size={8.5} anchor="middle" color={MUTED}>（外部から電流を流し、逆の化学変化を起こす）</T>
      <line x1="4" x2="296" y1="152" y2="152" stroke="#e2e8f0" />
      <T x={6} y={168} size={9.5} weight="800">一次電池（充電できない）</T>
      <Battery x={60} y={178} level={0.9} w={28} h={40} />
      <Battery x={212} y={178} level={0.2} w={28} h={40} />
      <Arrow from={[100, 192]} to={[200, 192]} color={RED} width={2} />
      <T x={150} y={186} size={8.5} weight="800" anchor="middle" color={RED}>放電</T>
      <line x1="200" y1="210" x2="100" y2="210" stroke={MUTED} strokeWidth="1.4" strokeDasharray="4 3" />
      <path d="M144,204 L156,216 M156,204 L144,216" stroke={RED} strokeWidth="2" />
      <T x={150} y={231} size={8.5} anchor="middle" color={MUTED}>充電して、もとにもどすことはできない</T>
    </svg>
  )
}

export const CHEMISTRY_DIAGRAMS = Object.freeze({
  objectMaterial: ObjectMaterialDiagram,
  metalProperties: MetalPropertiesDiagram,
  gasGeneration: GasGenerationDiagram,
  gasMap: GasMapDiagram,
  crystalShapes: CrystalShapesDiagram,
  volumeChange: VolumeChangeDiagram,
  periodicTable: PeriodicTableDiagram,
  ironSulfurHeating: IronSulfurHeatingDiagram,
  ironSulfurTests: IronSulfurTestsDiagram,
  blastFurnace: BlastFurnaceDiagram,
  closedOpenMass: ClosedOpenMassDiagram,
  ironOxidationHeat: IronOxidationHeatDiagram,
  handWarmer: HandWarmerDiagram,
  pancakeRise: PancakeRiseDiagram,
  electrolyteTest: ElectrolyteTestDiagram,
  indicatorColors: IndicatorColorsDiagram,
  plasticFloat: PlasticFloatDiagram,
  oceanPlastic: OceanPlasticDiagram,
  batteryCycle: BatteryCycleDiagram,
})
