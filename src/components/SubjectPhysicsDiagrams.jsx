// 理科（物理）の図解。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。力の矢印は赤、重力は青で描く。
import { Arrow, BLUE, GREEN, INK, LINE, MUTED, Panel, RED, T, steady } from './SubjectScienceParts.jsx'

// ── 音の伝わり方 ───────────────────────────────────────────────────────────
//   { name: 'soundTransmission' }
// 上：振動するたいこ（音源）が、まわりの空気を次々に振動させ、空気の濃い所とうすい所が波として耳まで伝わり、鼓膜を振動させる。
// 下：ブザーを入れた容器の空気をぬいていくと、音が小さくなる。音を伝える物質がない真空中では、音は伝わらない。
function SoundTransmissionDiagram() {
  const random = steady(11)
  const particles = []
  for (const y of [44, 54, 64, 74, 84]) {
    for (let x0 = 76; x0 <= 228; x0 += 5.2) {
      const x = x0 + 2.8 * Math.sin((2 * Math.PI * (x0 - 76)) / 38)
      particles.push([x, y + (random() - 0.5) * 3])
    }
  }
  return (
    <svg viewBox="0 0 300 232" className="h-auto w-full" role="img" aria-label="音の伝わり方" data-subject-diagram="soundTransmission">
      <path d="M10,50 L10,84 A22,6 0 0 0 54,84 L54,50 Z" fill="#fecaca" stroke="#b91c1c" />
      <path d="M10,56 L20,80 L30,56 L40,80 L50,56" fill="none" stroke="#b91c1c" strokeWidth="0.8" />
      <ellipse cx="32" cy="50" rx="22" ry="6" fill="#fef2f2" stroke="#b91c1c" />
      <line x1="54" y1="18" x2="38" y2="44" stroke="#78350f" strokeWidth="2" />
      <circle cx="38" cy="44" r="3" fill="#78350f" />
      <path d="M60,52 Q64,60 60,68 M65,48 Q71,60 65,72" fill="none" stroke="#b91c1c" strokeWidth="1.2" />
      {particles.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="1.7" fill={MUTED} />)}
      <path d="M252,36 C234,40 232,58 246,62 L246,74 C232,78 234,96 252,100" fill="#fed7aa" stroke="#c2410c" />
      <rect x="246" y="62" width="27" height="12" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.8" />
      <ellipse cx="274" cy="68" rx="2.6" ry="9" fill="#f59e0b" stroke="#b45309" />
      <T x={274} y={92} size={9.5} weight="800" anchor="middle">鼓膜</T>
      <T x={240} y={32} size={9.5} weight="800" anchor="middle">耳</T>
      <T x={32} y={104} size={9.5} weight="800" anchor="middle">音源</T>
      <T x={32} y={117} size={8.5} anchor="middle">振動している</T>
      <Arrow from={[80, 100]} to={[228, 100]} color={LINE} width={1.6} />
      <T x={154} y={116} size={8.5} anchor="middle">空気を次々に振動させ、波として伝わる</T>
      <line x1="4" y1="126" x2="296" y2="126" stroke="#cbd5e1" />
      <T x={6} y={142} size={9.5} weight="800">真空中では、音は伝わらない</T>
      <rect x="20" y="214" width="100" height="6" rx="1" fill="#94a3b8" />
      <path d="M30,214 L30,180 Q30,154 70,154 Q110,154 110,180 L110,214 Z" fill="#f1f5f9" opacity="0.75" stroke="#64748b" strokeWidth="1.2" />
      <rect x="58" y="192" width="24" height="20" rx="3" fill="#475569" />
      <circle cx="70" cy="202" r="5" fill="#94a3b8" />
      <path d="M86,196 Q90,202 86,208 M90,192 Q96,202 90,212" fill="none" stroke={MUTED} strokeWidth="1" opacity="0.5" />
      <path d="M120,217 L132,217" stroke="#64748b" strokeWidth="3" />
      <rect x="132" y="204" width="40" height="22" rx="3" fill="#cbd5e1" stroke="#64748b" />
      <T x={152} y={219} size={9} weight="800" anchor="middle">ポンプ</T>
      <Arrow from={[112, 196]} to={[150, 196]} color={BLUE} width={1.4} head={5} />
      <T x={131} y={190} size={8.5} anchor="middle" color={BLUE}>空気をぬく</T>
      <T x={182} y={164} size={8.5}>{'空気をぬいていくと、\nブザーの音が小さくなる。\n音を伝える物質がない\n真空中では伝わらない。'}</T>
    </svg>
  )
}

// ── 力の3つのはたらき ─────────────────────────────────────────────────────────
//   { name: 'forceEffects' }
// 形を変える（ばねをのばす・スポンジをおしつぶす）、動きを変える（ボールをける・動いている台車を止める）、物体を支える（荷物を支える）。
// 赤い矢印は、物体に加えた力。
function ForceEffectsDiagram() {
  const spring = []
  for (let i = 0; i <= 12; i += 1) spring.push(`${i ? 'L' : 'M'}${16 + i * 4.4},${40 + (i === 0 || i === 12 ? 0 : i % 2 ? -6 : 6)}`)
  return (
    <svg viewBox="0 0 300 156" className="h-auto w-full" role="img" aria-label="力の3つのはたらき" data-subject-diagram="forceEffects">
      <Panel x={4} y={4} w={94} h={148} title="形を変える" />
      <Panel x={103} y={4} w={94} h={148} title="動きを変える" />
      <Panel x={202} y={4} w={94} h={148} title="支える" />
      <rect x="10" y="28" width="6" height="24" fill="#94a3b8" />
      <path d={spring.join(' ')} fill="none" stroke={INK} strokeWidth="1.3" />
      <Arrow from={[70, 40]} to={[92, 40]} color={RED} width={2.2} />
      <T x={51} y={66} size={8.5} anchor="middle">ばねをのばす</T>
      <Arrow from={[51, 76]} to={[51, 97]} color={RED} width={2.2} />
      <path d="M22,94 L40,94 Q51,104 62,94 L80,94 L80,114 L22,114 Z" fill="#fde047" stroke="#ca8a04" />
      {[[30, 104], [46, 108], [70, 103], [60, 109], [36, 110]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" fill="#ca8a04" />)}
      <T x={51} y={130} size={8.5} anchor="middle">スポンジを</T>
      <T x={51} y={142} size={8.5} anchor="middle">おしつぶす</T>

      <path d="M110,52 L136,52" stroke={MUTED} strokeDasharray="3 3" />
      <path d="M150,48 Q164,30 186,24" fill="none" stroke={MUTED} strokeDasharray="3 3" />
      <circle cx="144" cy="52" r="7" fill="#ffffff" stroke={INK} />
      <path d="M140,48 L148,56 M148,48 L140,56" stroke={INK} strokeWidth="0.7" />
      <Arrow from={[128, 70]} to={[140, 58]} color={RED} width={2.2} />
      <T x={150} y={84} size={8.5} anchor="middle">ボールをける</T>
      <T x={150} y={96} size={8.5} anchor="middle">（向きが変わる）</T>
      <rect x="116" y="110" width="36" height="14" rx="2" fill="#bfdbfe" stroke={BLUE} />
      <circle cx="124" cy="126" r="3.5" fill={INK} />
      <circle cx="144" cy="126" r="3.5" fill={INK} />
      <Arrow from={[176, 117]} to={[155, 117]} color={RED} width={2.2} />
      <Arrow from={[116, 104]} to={[142, 104]} color={MUTED} width={1.2} head={5} dashed />
      <T x={150} y={144} size={8.5} anchor="middle">台車を止める</T>

      <rect x="232" y="72" width="36" height="40" rx="5" fill="#93c5fd" stroke={BLUE} />
      <path d="M240,72 Q240,56 250,56 Q260,56 260,72" fill="none" stroke={BLUE} strokeWidth="2" />
      <rect x="243" y="48" width="14" height="10" rx="4" fill="#fcd34d" stroke="#b45309" />
      <Arrow from={[250, 54]} to={[250, 26]} color={RED} width={2.2} />
      <Arrow from={[250, 92]} to={[250, 128]} color={BLUE} width={2.2} />
      <T x={256} y={34} size={8.5} weight="800" color={RED}>支える力</T>
      <T x={256} y={126} size={8.5} weight="800" color={BLUE}>重力</T>
      <T x={249} y={144} size={8.5} anchor="middle">荷物を支える</T>
    </svg>
  )
}

// ── 重さと質量（地球上と月面） ──────────────────────────────────────────────────
//   { name: 'weightMass' }
// 質量600gの物体を、ばねばかり（重さ）と上皿てんびん（質量）ではかる。100gの物体にはたらく重力をおよそ1Nとする。
// 月面では重力が地球上の約6分の1なので、ばねばかりは約1Nを示すが、上皿てんびんは地球上と同じ分銅でつり合う。
function SpringScale({ x0, value, color }) {
  const top = 30
  const pointer = 36 + value * 8
  const coils = []
  const turns = 8
  for (let i = 0; i <= turns; i += 1) coils.push(`${i ? 'L' : 'M'}${x0 + 32 + (i === 0 || i === turns ? 0 : i % 2 ? -4 : 4)},${top + 3 + ((pointer - top - 3) * i) / turns}`)
  return (
    <g>
      <line x1={x0 + 14} x2={x0 + 50} y1={24} y2={24} stroke={LINE} strokeWidth="2" />
      <line x1={x0 + 32} x2={x0 + 32} y1={24} y2={top} stroke={LINE} strokeWidth="1.2" />
      <rect x={x0 + 24} y={top} width="16" height="64" rx="3" fill="#f8fafc" stroke={LINE} />
      {[0, 2, 4, 6].map((n) => (
        <g key={n}>
          <line x1={x0 + 24} x2={x0 + 28} y1={36 + n * 8} y2={36 + n * 8} stroke={LINE} />
          <text x={x0 + 21} y={39 + n * 8} fontSize="8.5" fontWeight="700" textAnchor="end" fill={MUTED}>{n}</text>
        </g>
      ))}
      <path d={coils.join(' ')} fill="none" stroke={MUTED} strokeWidth="1" />
      <line x1={x0 + 25} x2={x0 + 39} y1={pointer} y2={pointer} stroke={color} strokeWidth="2" />
      <T x={x0 + 44} y={pointer + 3.5} size={10} weight="800" color={color}>{`${value}N`}</T>
      <line x1={x0 + 32} x2={x0 + 32} y1={94} y2={104} stroke={LINE} strokeWidth="1.2" />
      <rect x={x0 + 20} y={104} width="24" height="18" rx="2" fill="#fde68a" stroke="#b45309" />
      <text x={x0 + 32} y={116.5} fontSize="8.5" fontWeight="800" textAnchor="middle" fill={INK}>600g</text>
    </g>
  )
}
function Balance({ x0 }) {
  const c = x0 + 106
  return (
    <g>
      <path d={`M${c - 16},122 L${c + 16},122 L${c + 12},116 L${c - 12},116 Z`} fill="#94a3b8" stroke={LINE} />
      <rect x={c - 2} y={100} width="4" height="16" fill="#94a3b8" />
      <line x1={c - 26} x2={c + 26} y1={100} y2={100} stroke={LINE} strokeWidth="2.4" />
      <line x1={c - 24} x2={c - 24} y1={100} y2={93} stroke={LINE} />
      <line x1={c + 24} x2={c + 24} y1={100} y2={93} stroke={LINE} />
      <ellipse cx={c - 24} cy={92} rx="15" ry="3" fill="#cbd5e1" stroke={LINE} />
      <ellipse cx={c + 24} cy={92} rx="15" ry="3" fill="#cbd5e1" stroke={LINE} />
      <rect x={c - 36} y={74} width="24" height="16" rx="2" fill="#fde68a" stroke="#b45309" />
      <text x={c - 24} y={85.5} fontSize="8.5" fontWeight="800" textAnchor="middle" fill={INK}>600g</text>
      <rect x={c + 14} y={76} width="9" height="14" rx="1.5" fill="#a8a29e" stroke="#57534e" />
      <rect x={c + 25} y={80} width="8" height="10" rx="1.5" fill="#a8a29e" stroke="#57534e" />
    </g>
  )
}
function WeightMassDiagram() {
  return (
    <svg viewBox="0 0 300 182" className="h-auto w-full" role="img" aria-label="地球上と月面での重さと質量" data-subject-diagram="weightMass">
      <Panel x={4} y={4} w={144} h={174} title="地球上" tone="blue" />
      <Panel x={152} y={4} w={144} h={174} title="月面（重力は約6分の1）" />
      <SpringScale x0={4} value={6} color={RED} />
      <SpringScale x0={152} value={1} color={RED} />
      <Balance x0={4} />
      <Balance x0={152} />
      {[4, 152].map((x0) => (
        <g key={x0}>
          <T x={x0 + 32} y={138} size={8.5} anchor="middle" color={MUTED}>ばねばかり</T>
          <T x={x0 + 106} y={138} size={8.5} anchor="middle" color={MUTED}>上皿てんびん</T>
        </g>
      ))}
      <T x={12} y={156} size={9.5} weight="800" color={RED}>重さ：6N</T>
      <T x={12} y={171} size={9.5} weight="800" color={BLUE}>質量：600g</T>
      <T x={160} y={156} size={9.5} weight="800" color={RED}>重さ：1N（約6分の1）</T>
      <T x={160} y={171} size={9.5} weight="800" color={BLUE}>質量：600g（変わらない）</T>
    </svg>
  )
}

// ── 放電 ─────────────────────────────────────────────────────────────────
//   { name: 'discharge' }
// 左：雷。雲の上の方に＋、下の方に－の電気がたまり、地面には＋の電気が引き寄せられる。たまった電気が空気中を一気に流れる大規模な放電。
// 右上：真空放電。管の空気をぬいて気圧を低くし、大きな電圧を加えると、管の中を電流が流れて光る。右下：からだにたまった静電気がドアノブへ流れる。
function DischargeDiagram() {
  const cloud = 'M22,62 Q12,62 14,50 Q12,38 28,38 Q32,24 50,26 Q60,14 78,22 Q96,14 106,28 Q124,26 126,42 Q138,46 132,58 Q130,68 116,66 Z'
  return (
    <svg viewBox="0 0 300 204" className="h-auto w-full" role="img" aria-label="身のまわりの放電" data-subject-diagram="discharge">
      <Panel x={4} y={4} w={144} h={196} title="雷" />
      <Panel x={152} y={4} w={144} h={110} title="真空放電" />
      <Panel x={152} y={118} w={144} h={82} title="ドアノブでパチッ" />
      <path d={cloud} transform="translate(4 14)" fill="#cbd5e1" stroke="#64748b" />
      {[[44, 50], [66, 44], [88, 46], [110, 52]].map(([x, y]) => <text key={x} x={x} y={y} fontSize="11" fontWeight="800" textAnchor="middle" fill={RED}>＋</text>)}
      {[[36, 74], [58, 78], [80, 78], [102, 76], [122, 72]].map(([x, y]) => <text key={x} x={x} y={y} fontSize="11" fontWeight="800" textAnchor="middle" fill={BLUE}>－</text>)}
      <path d="M72,84 L62,116 L74,114 L60,152 L82,108 L70,110 L80,84 Z" fill="#fde047" stroke="#ca8a04" />
      <line x1="10" x2="142" y1="156" y2="156" stroke="#78716c" strokeWidth="1.6" />
      {[30, 52, 96, 118].map((x) => <text key={x} x={x} y={170} fontSize="11" fontWeight="800" textAnchor="middle" fill={RED}>＋</text>)}
      <T x={76} y={186} size={8.5} anchor="middle">{'雲にたまった電気が\n空気中を一気に流れる'}</T>
      <rect x="168" y="44" width="112" height="22" rx="11" fill="#f8fafc" stroke={LINE} />
      <ellipse cx="224" cy="55" rx="44" ry="7" fill="#e9d5ff" />
      <ellipse cx="224" cy="55" rx="30" ry="4.5" fill="#c084fc" opacity="0.8" />
      <rect x="172" y="50" width="6" height="10" fill="#64748b" />
      <rect x="270" y="50" width="6" height="10" fill="#64748b" />
      <path d="M224,44 L224,30" stroke="#64748b" strokeWidth="3" />
      <Arrow from={[232, 40]} to={[232, 26]} color={BLUE} width={1.4} head={5} />
      <T x={238} y={34} size={8.5} color={BLUE}>空気をぬく</T>
      <T x={224} y={84} size={8.5} anchor="middle">{'気圧を低くすると、\n管の中を電流が流れて光る'}</T>
      <circle cx="252" cy="160" r="12" fill="#e2e8f0" stroke="#64748b" />
      <rect x="262" y="154" width="22" height="12" fill="#cbd5e1" stroke="#64748b" />
      <rect x="170" y="150" width="30" height="26" rx="9" fill="#fed7aa" stroke="#c2410c" />
      <rect x="194" y="156" width="34" height="9" rx="4.5" fill="#fed7aa" stroke="#c2410c" />
      <path d="M178,152 L178,146 M186,151 L186,145" stroke="#c2410c" strokeWidth="1" />
      <path d="M229,160 L234,154 L234,162 L240,157" fill="none" stroke="#ca8a04" strokeWidth="1.8" />
      <T x={224} y={190} size={8.5} anchor="middle">{'からだの静電気が流れる'}</T>
    </svg>
  )
}

// ── 慣性の法則 ─────────────────────────────────────────────────────────────
//   { name: 'inertia' }
// 電車が急に動き出すと、乗客のからだは静止し続けようとして後ろにたおれそうになる。急に止まると、動き続けようとして前にたおれそうになる。
// だるま落としは、たたいた段だけがとび出し、上の段はその場にとどまって真下に落ちる。
function Passenger({ x, lean }) {
  const top = [x + lean, 46]
  return (
    <g stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none">
      <circle cx={top[0] + lean * 0.2} cy={top[1] - 6} r="5" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
      <line x1={x} y1={70} x2={top[0]} y2={top[1]} />
      <line x1={x} y1={70} x2={x - 4} y2={80} />
      <line x1={x} y1={70} x2={x + 4} y2={80} />
      <line x1={(x + top[0]) / 2} y1={58} x2={(x + top[0]) / 2 + 8} y2={54} />
    </g>
  )
}
function TrainCar({ x0 }) {
  return (
    <g>
      <rect x={x0 + 12} y={30} width="120" height="52" rx="6" fill="#e0f2fe" stroke="#0369a1" />
      <rect x={x0 + 22} y={36} width="24" height="14" rx="2" fill="#ffffff" stroke="#0369a1" strokeWidth="0.8" />
      <rect x={x0 + 98} y={36} width="24" height="14" rx="2" fill="#ffffff" stroke="#0369a1" strokeWidth="0.8" />
      <line x1={x0 + 12} x2={x0 + 132} y1={80} y2={80} stroke="#0369a1" strokeWidth="1.4" />
      <circle cx={x0 + 34} cy={86} r="4" fill={INK} />
      <circle cx={x0 + 110} cy={86} r="4" fill={INK} />
    </g>
  )
}
function InertiaDiagram() {
  return (
    <svg viewBox="0 0 300 206" className="h-auto w-full" role="img" aria-label="慣性の法則で説明できる例" data-subject-diagram="inertia">
      <T x={6} y={14} size={9.5} weight="800">急に動き出す</T>
      <T x={154} y={14} size={9.5} weight="800">急に止まる</T>
      <TrainCar x0={0} />
      <TrainCar x0={148} />
      <Passenger x={72} lean={-10} />
      <Passenger x={220} lean={10} />
      <Arrow from={[96, 20]} to={[136, 20]} color={RED} width={2} head={6} />
      <T x={92} y={23.5} size={8.5} anchor="end" color={RED}>電車が進み出す</T>
      <Arrow from={[284, 20]} to={[244, 20]} color={RED} width={2} head={6} />
      <T x={240} y={23.5} size={8.5} anchor="end" color={RED}>ブレーキ</T>
      <T x={72} y={106} size={8.5} anchor="middle">{'からだは止まったまま\nでいようとし、後ろへ'}</T>
      <T x={220} y={106} size={8.5} anchor="middle">{'からだは動き続け\nようとし、前へ'}</T>
      <line x1="4" x2="296" y1="128" y2="128" stroke="#e2e8f0" />
      <T x={6} y={144} size={9.5} weight="800">だるま落とし</T>
      {[0, 1, 2, 3].map((k) => <rect key={k} x={k === 2 ? 214 : 120} y={182 - (k + 1) * 14} width="40" height="13" rx="2" fill={['#fca5a5', '#fde68a', '#86efac', '#93c5fd'][k]} stroke="#475569" />)}
      <rect x="120" y="140" width="40" height="13" rx="2" fill="none" stroke="#94a3b8" strokeDasharray="3 2" />
      <rect x="80" y="140" width="22" height="13" rx="2" fill="#a16207" />
      <line x1="91" y1="153" x2="91" y2="190" stroke="#a16207" strokeWidth="3" />
      <Arrow from={[166, 146]} to={[208, 146]} color={RED} width={1.6} head={5} />
      <Arrow from={[113, 128]} to={[113, 150]} color={MUTED} width={1.4} head={5} />
      <T x={172} y={176} size={8.5}>{'たたいた段だけがとび出し、\n上の段は真下に落ちる'}</T>
    </svg>
  )
}

// ── 仕事になるとき・ならないとき ─────────────────────────────────────────────────
//   { name: 'workExamples' }
// 赤い矢印は物体に加えた力、青い点線の矢印は物体が動いた向きと距離。力の向きに動いたときだけ仕事をしたことになる。
function WorkExamplesDiagram() {
  const box = (x, y, dashed = false, text = '') => (
    <g>
      <rect x={x - 14} y={y - 10} width="28" height="20" rx="2" fill={dashed ? '#ffffff' : '#fde68a'} stroke="#b45309" strokeDasharray={dashed ? '3 2' : undefined} />
      {text && <text x={x} y={y + 3.4} fontSize="9" fontWeight="800" textAnchor="middle" fill={INK}>{text}</text>}
    </g>
  )
  return (
    <svg viewBox="0 0 300 220" className="h-auto w-full" role="img" aria-label="仕事になるときとならないとき" data-subject-diagram="workExamples">
      <line x1="8" x2="24" y1="10" y2="10" stroke={RED} strokeWidth="2.2" />
      <T x={28} y={13.5} size={8.5} weight="800" color={RED}>力</T>
      <line x1="56" x2="72" y1="10" y2="10" stroke={BLUE} strokeWidth="1.8" strokeDasharray="3 2" />
      <T x={76} y={13.5} size={8.5} weight="800" color={BLUE}>動いた向き</T>
      <Panel x={4} y={20} w={144} h={96} title="持ち上げる" tone="green" size={9} />
      <Panel x={152} y={20} w={144} h={96} title="持ったまま静止" tone="red" size={9} />
      <Panel x={4} y={120} w={144} h={96} title="持ったまま横に運ぶ" tone="red" size={9} />
      <Panel x={152} y={120} w={144} h={96} title="水平に引く" tone="green" size={9} />
      <line x1="14" x2="100" y1="100" y2="100" stroke="#78716c" />
      {box(40, 90, true)}
      {box(40, 60, false, '10N')}
      <Arrow from={[40, 50]} to={[40, 40]} color={RED} width={2.2} head={6} />
      <Arrow from={[66, 90]} to={[66, 58]} color={BLUE} width={1.8} head={6} dashed />
      <T x={72} y={78} size={8.5} weight="800" color={BLUE}>2m</T>
      <T x={76} y={112} size={8.5} weight="800" anchor="middle" color={GREEN}>10N×2m＝20J</T>
      {box(214, 70, false, '10N')}
      <Arrow from={[214, 60]} to={[214, 40]} color={RED} width={2.2} head={6} />
      <T x={236} y={56} size={8.5} color={MUTED}>動かない</T>
      <T x={224} y={108} size={8.5} weight="800" anchor="middle" color={RED}>仕事は0</T>
      {box(40, 168, false, '10N')}
      <Arrow from={[40, 158]} to={[40, 140]} color={RED} width={2.2} head={6} />
      <Arrow from={[62, 168]} to={[130, 168]} color={BLUE} width={1.8} head={6} dashed />
      <T x={60} y={190} size={8.5} color={MUTED}>力と動いた向きがちがう</T>
      <T x={76} y={208} size={8.5} weight="800" anchor="middle" color={RED}>仕事は0</T>
      <line x1="162" x2="290" y1="178" y2="178" stroke="#78716c" />
      {box(182, 168, false, '')}
      <line x1="196" y1="168" x2="214" y2="168" stroke="#a16207" strokeWidth="1.4" />
      <Arrow from={[214, 168]} to={[246, 168]} color={RED} width={2.2} head={6} />
      <T x={230} y={160} size={8.5} weight="800" anchor="middle" color={RED}>5N</T>
      <Arrow from={[170, 190]} to={[264, 190]} color={BLUE} width={1.8} head={6} dashed />
      <T x={270} y={193.5} size={8.5} weight="800" color={BLUE}>3m</T>
      <T x={224} y={208} size={8.5} weight="800" anchor="middle" color={GREEN}>5N×3m＝15J</T>
    </svg>
  )
}

// ── エネルギーの変換と保存 ─────────────────────────────────────────────────────
//   { name: 'energyFlow' }
// 帯の太さがエネルギーの量（数値は例）。電気エネルギー100が、目的の光エネルギー30と、目的以外の熱エネルギーなど70に変わる。
// 合計は100のまま（エネルギーの保存）で、変換効率は30％。
function EnergyFlowDiagram() {
  return (
    <svg viewBox="0 0 300 170" className="h-auto w-full" role="img" aria-label="エネルギーの変換と保存（例）" data-subject-diagram="energyFlow">
      <rect x="10" y="40" width="96" height="60" fill="#facc15" />
      <path d="M106,40 C150,40 150,24 196,24 L196,42 C150,42 150,58 106,58 Z" fill="#fde68a" stroke="#ca8a04" strokeWidth="0.8" />
      <path d="M106,58 C150,58 150,96 196,96 L196,138 C150,138 150,100 106,100 Z" fill="#fca5a5" stroke="#dc2626" strokeWidth="0.8" />
      <T x={58} y={66} size={9.5} weight="800" anchor="middle" halo="#facc15">電気エネルギー</T>
      <T x={58} y={82} size={11} weight="800" anchor="middle" halo="#facc15">100</T>
      <T x={202} y={30} size={9.5} weight="800">光エネルギー 30</T>
      <T x={202} y={43} size={8.5} color={MUTED}>（目的のエネルギー）</T>
      <T x={202} y={112} size={9.5} weight="800">熱エネルギーなど 70</T>
      <T x={202} y={125} size={8.5} color={MUTED}>（目的以外）</T>
      <T x={10} y={150} size={8.5}>合計 30＋70＝100（総量は変わらない）</T>
      <T x={10} y={164} size={8.5} weight="800" color={RED}>変換効率＝30÷100×100＝30％</T>
      <T x={290} y={164} size={8.5} anchor="end" color={MUTED}>数値は例</T>
    </svg>
  )
}

export const PHYSICS_DIAGRAMS = Object.freeze({
  soundTransmission: SoundTransmissionDiagram,
  forceEffects: ForceEffectsDiagram,
  weightMass: WeightMassDiagram,
  discharge: DischargeDiagram,
  inertia: InertiaDiagram,
  workExamples: WorkExamplesDiagram,
  energyFlow: EnergyFlowDiagram,
})
