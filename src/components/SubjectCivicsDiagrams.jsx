// 公民の図解（三権分立など）。SubjectDiagrams.jsx から名前で呼び出す。
// どの図も幅300の座標で描き、画面では約300pxに出る。矢印には番号を付け、番号の意味は図の下の表で示す。

const INK = '#1f2937'
const POWER = '#334155'
const PEOPLE = '#b45309'

function Box({ x, y, w, h, title, sub, dark = true }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="9" fill={dark ? POWER : '#fef3c7'} stroke={dark ? POWER : PEOPLE} strokeWidth="1.4" />
      <text x={x} y={sub ? y - 1 : y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={dark ? '#ffffff' : '#78350f'}>{title}</text>
      {sub && <text x={x} y={y + 13} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={dark ? '#e2e8f0' : '#92400e'}>{sub}</text>}
    </g>
  )
}

/** 番号つきの矢印。from→to に引き、線の t の位置に番号の丸を置く。 */
function NumberedArrow({ from, to, number, t = 0.5, color }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const head = (a) => `${x2 + 8 * Math.cos(angle + a)},${y2 + 8 * Math.sin(angle + a)}`
  const cx = x1 + (x2 - x1) * t
  const cy = y1 + (y2 - y1) * t
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 4 * Math.cos(angle)} y2={y2 - 4 * Math.sin(angle)} stroke={color} strokeWidth="2" />
      <path d={`M${x2},${y2} L${head(Math.PI * 0.84)} L${head(-Math.PI * 0.84)} Z`} fill={color} />
      <circle cx={cx} cy={cy} r="7.5" fill="#ffffff" stroke={color} strokeWidth="1.4" />
      <text x={cx} y={cy + 3.4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK}>{number}</text>
    </g>
  )
}

// ── 三権分立 ───────────────────────────────────────────────────────────
//   { name: 'separationOfPowers' }
// 国会（立法権）・内閣（行政権）・裁判所（司法権）を三角形に置き、たがいのはたらきかけ（①〜⑥）と、
// 主権者の国民からのはたらきかけ（⑦〜⑨）を番号つきの矢印で示す（丸の中に数字）。番号の意味は、同じ図の組の表で示す。
function SeparationOfPowersDiagram() {
  const arrows = [
    { number: '1', from: [96, 52], to: [44, 178], t: 0.35, color: POWER },
    { number: '2', from: [60, 178], to: [112, 52], t: 0.35, color: POWER },
    { number: '3', from: [204, 52], to: [256, 178], t: 0.35, color: POWER },
    { number: '4', from: [240, 178], to: [188, 52], t: 0.35, color: POWER },
    { number: '5', from: [112, 193], to: [188, 193], t: 0.3, color: POWER },
    { number: '6', from: [188, 207], to: [112, 207], t: 0.3, color: POWER },
    { number: '7', from: [150, 104], to: [150, 52], t: 0.5, color: PEOPLE },
    { number: '8', from: [118, 140], to: [86, 178], t: 0.5, color: PEOPLE },
    { number: '9', from: [182, 140], to: [214, 178], t: 0.5, color: PEOPLE },
  ]
  return (
    <svg viewBox="0 0 300 226" className="h-auto w-full" role="img" aria-label="三権分立のしくみ" data-subject-diagram="separationOfPowers">
      {arrows.map((arrow) => <NumberedArrow key={arrow.number} {...arrow} />)}
      <Box x={150} y={30} w={132} h={40} title="国会" sub="立法権" />
      <Box x={58} y={200} w={104} h={40} title="内閣" sub="行政権" />
      <Box x={242} y={200} w={104} h={40} title="裁判所" sub="司法権" />
      <Box x={150} y={122} w={96} h={34} title="国民" sub="主権者" dark={false} />
    </svg>
  )
}

// ── 地方公共団体のしくみ（二元代表制） ─────────────────────────────────────
//   { name: 'localGovernment' }
// 首長と地方議会を並べ、住民がそれぞれを選挙で選ぶこと（①②）と、議会と首長のはたらきかけ（③④）を番号つきの矢印で示す。
function LocalGovernmentDiagram() {
  const arrows = [
    { number: '1', from: [118, 150], to: [74, 58], t: 0.5, color: PEOPLE },
    { number: '2', from: [182, 150], to: [226, 58], t: 0.5, color: PEOPLE },
    { number: '3', from: [175, 26], to: [127, 26], t: 0.5, color: POWER },
    { number: '4', from: [125, 42], to: [173, 42], t: 0.5, color: POWER },
  ]
  return (
    <svg viewBox="0 0 300 192" className="h-auto w-full" role="img" aria-label="地方公共団体のしくみ" data-subject-diagram="localGovernment">
      {arrows.map((arrow) => <NumberedArrow key={arrow.number} {...arrow} />)}
      <Box x={66} y={34} w={116} h={42} title="首長" sub="知事・市（区）町村長" />
      <Box x={234} y={34} w={116} h={42} title="地方議会" sub="条例・予算を議決" />
      <Box x={150} y={168} w={116} h={36} title="住民" sub="有権者" dark={false} />
    </svg>
  )
}

export const CIVICS_DIAGRAMS = Object.freeze({
  separationOfPowers: SeparationOfPowersDiagram,
  localGovernment: LocalGovernmentDiagram,
})
