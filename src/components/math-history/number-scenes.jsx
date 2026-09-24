import {
  decimalText,
  gcd,
  lcm,
  parseFraction,
  sieveRemovedBy,
  toKanjiNumeral,
  toRomanNumeral,
  unitFractionDenominators,
} from '../../data/math-history/controls.js'
import { GOOD, GRID, INK, MUTED, PAPER, ROSE, Stage, SvgText, WARM, num } from './stage.jsx'

// 第1部「算数の基本」の数と計算の話の図。

// ── 数えることのはじまり：小石・刻み目・「正」の字 ─────────────────────
// 「正」の書き順：上の横線 → 中の縦線 → 右の短い横線 → 左の縦線 → 下の横線。
const SEI_STROKES = [
  (x, y) => `M${x + 4} ${y + 3}H${x + 28}`,
  (x, y) => `M${x + 16} ${y + 3}V${y + 29}`,
  (x, y) => `M${x + 16} ${y + 16}H${x + 26}`,
  (x, y) => `M${x + 7} ${y + 15}V${y + 29}`,
  (x, y) => `M${x + 2} ${y + 29}H${x + 30}`,
]

function TallyScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const groups = Array.from({ length: Math.ceil(n / 5) }, (_, index) => Math.min(5, n - index * 5))
  const groupX = (index) => 64 + index * 48
  const toneFor = (size) => (size === 5 ? color : WARM)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="8" y="44" anchor="start" size={10} fill={MUTED}>小石</SvgText>
      <SvgText x="8" y="104" anchor="start" size={10} fill={MUTED}>刻み目</SvgText>
      <SvgText x="8" y="166" anchor="start" size={10} fill={MUTED}>正の字</SvgText>
      {groups.map((size, index) => {
        const x = groupX(index)
        const tone = toneFor(size)
        return (
          <g key={index} data-tally-group={index} data-tally-size={size}>
            {/* 小石：5つで1まとまり */}
            {Array.from({ length: size }, (_, stone) => (
              <circle
                key={stone}
                cx={x + 8 + (stone % 3) * 12}
                cy={36 + Math.floor(stone / 3) * 14}
                r="5"
                fill={tone}
              />
            ))}
            {/* 刻み目：4本の縦線と、5本目の斜めの線 */}
            {Array.from({ length: Math.min(size, 4) }, (_, mark) => (
              <line key={mark} x1={x + 6 + mark * 8} y1="88" x2={x + 6 + mark * 8} y2="120" stroke={tone} strokeWidth="3" strokeLinecap="round" />
            ))}
            {size === 5 && (
              <line x1={x + 1} y1="116" x2={x + 35} y2="92" stroke={tone} strokeWidth="3" strokeLinecap="round" />
            )}
            {/* 正の字：1画ずつ */}
            {SEI_STROKES.slice(0, size).map((stroke, strokeIndex) => (
              <path key={strokeIndex} d={stroke(x + 2, 150)} stroke={tone} strokeWidth="3.4" strokeLinecap="round" fill="none" />
            ))}
          </g>
        )
      })}
      <SvgText x="180" y="206" size={12}>
        {`5のまとまり ${Math.floor(n / 5)}つ ＋ ${n % 5}  ＝  ${n}`}
      </SvgText>
    </Stage>
  )
}

// ── 位取り：百・十・一のブロックと、3つの書き方 ─────────────────────
function PlaceValueScene({ values, color, markerId, label }) {
  const h = num(values.h)
  const t = num(values.t)
  const o = num(values.o)
  const n = h * 100 + t * 10 + o
  const roman = toRomanNumeral(n)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="52" y="12" size={11} fill={MUTED}>百の位</SvgText>
      <SvgText x="150" y="12" size={11} fill={MUTED}>十の位</SvgText>
      <SvgText x="232" y="12" size={11} fill={MUTED}>一の位</SvgText>
      {Array.from({ length: h }, (_, index) => {
        const x = 12 + (index % 3) * 28
        const y = 22 + Math.floor(index / 3) * 28
        return (
          <g key={`h${index}`} data-place-block="100">
            <rect x={x} y={y} width="24" height="24" rx="2" fill={`${color}30`} stroke={color} strokeWidth="1.6" />
            {[1, 2, 3, 4].map((line) => (
              <g key={line}>
                <line x1={x + line * 4.8} y1={y} x2={x + line * 4.8} y2={y + 24} stroke={color} strokeWidth="0.5" />
                <line x1={x} y1={y + line * 4.8} x2={x + 24} y2={y + line * 4.8} stroke={color} strokeWidth="0.5" />
              </g>
            ))}
          </g>
        )
      })}
      {Array.from({ length: t }, (_, index) => (
        <g key={`t${index}`} data-place-block="10">
          <rect x={112 + index * 9} y="22" width="6" height="80" rx="1.5" fill={`${color}30`} stroke={color} strokeWidth="1.4" />
        </g>
      ))}
      {Array.from({ length: o }, (_, index) => (
        <rect
          key={`o${index}`}
          data-place-block="1"
          x={212 + (index % 3) * 15}
          y={30 + Math.floor(index / 3) * 15}
          width="11"
          height="11"
          rx="1.5"
          fill={`${color}30`}
          stroke={color}
          strokeWidth="1.4"
        />
      ))}
      <SvgText x="52" y="120" size={20} weight={800} fill={h ? color : MUTED}>{h}</SvgText>
      <SvgText x="150" y="120" size={20} weight={800} fill={t ? color : MUTED}>{t}</SvgText>
      <SvgText x="232" y="120" size={20} weight={800} fill={o ? color : MUTED}>{o}</SvgText>
      <line x1="10" y1="134" x2="350" y2="134" stroke={GRID} strokeWidth="1.5" />
      <SvgText x="14" y="152" anchor="start" size={11} fill={MUTED}>算用数字</SvgText>
      <SvgText x="96" y="152" anchor="start" size={16} weight={800}>{String(n)}</SvgText>
      <SvgText x="14" y="178" anchor="start" size={11} fill={MUTED}>漢数字</SvgText>
      <SvgText x="96" y="178" anchor="start" size={16} weight={800}>{toKanjiNumeral(n)}</SvgText>
      <SvgText x="14" y="204" anchor="start" size={11} fill={MUTED}>ローマ数字</SvgText>
      <SvgText x="96" y="204" anchor="start" size={roman.length > 10 ? 13 : 16} weight={800} fill={roman ? INK : ROSE}>
        {roman || '0を表す記号がない'}
      </SvgText>
    </Stage>
  )
}

// ── ゼロ：たす・ひく・かける・わるで0がどうはたらくか ───────────────────
function Dots({ count, x, y, color, columns = 3, gap = 13 }) {
  return Array.from({ length: count }, (_, index) => (
    <circle
      key={index}
      cx={x + (index % columns) * gap}
      cy={y + Math.floor(index / columns) * gap}
      r="4.6"
      fill={color}
    />
  ))
}

function ZeroRulesScene({ values, color, markerId, label }) {
  const op = values.op
  const a = num(values.a)
  if (op === 'divide') {
    const tries = [1, 2, 3, 4, 5]
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <SvgText x="180" y="22" size={13}>{`□ × 0 ＝ ${a} となる □ をさがす`}</SvgText>
        {tries.map((value, index) => (
          <g key={value} data-zero-try={value}>
            <SvgText x="96" y={52 + index * 28} size={14}>{`${value} × 0 ＝ 0`}</SvgText>
            <SvgText x="200" y={52 + index * 28} size={14} fill={ROSE}>{`${a} にならない`}</SvgText>
          </g>
        ))}
        <SvgText x="180" y="202" size={13} fill={ROSE}>{`${a} ÷ 0 の答えは決められない`}</SvgText>
      </Stage>
    )
  }
  if (op === 'multiply') {
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <rect x="24" y="44" width="92" height="92" rx="10" fill={PAPER} stroke={color} strokeWidth="2" strokeDasharray="5 4" />
        <Dots count={a} x={46} y={66} color={color} gap={22} />
        <SvgText x="70" y="152" size={11} fill={MUTED}>{`${a}のまとまり`}</SvgText>
        <SvgText x="150" y="90" size={20} weight={800}>×</SvgText>
        <SvgText x="196" y="90" size={16} weight={800} fill={color}>0こ分</SvgText>
        <SvgText x="240" y="90" size={20} weight={800}>＝</SvgText>
        <rect x="262" y="52" width="76" height="76" rx="10" fill={PAPER} stroke={MUTED} strokeWidth="2" strokeDasharray="5 4" />
        <SvgText x="300" y="90" size={24} weight={800}>0</SvgText>
        <SvgText x="180" y="196" size={13}>1つ分もないので、何もない</SvgText>
      </Stage>
    )
  }
  const sign = op === 'add' ? '＋' : '−'
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <rect x="18" y="44" width="92" height="92" rx="10" fill={PAPER} stroke={color} strokeWidth="2" />
      <Dots count={a} x={40} y={66} color={color} gap={22} />
      <SvgText x="64" y="152" size={11} fill={MUTED}>{`${a}こ`}</SvgText>
      <SvgText x="128" y="90" size={20} weight={800}>{sign}</SvgText>
      <rect x="146" y="58" width="64" height="64" rx="10" fill={PAPER} stroke={MUTED} strokeWidth="2" strokeDasharray="5 4" />
      <SvgText x="178" y="90" size={20} weight={800} fill={MUTED}>0</SvgText>
      <SvgText x="228" y="90" size={20} weight={800}>＝</SvgText>
      <rect x="248" y="44" width="92" height="92" rx="10" fill={PAPER} stroke={color} strokeWidth="2" />
      <Dots count={a} x={270} y={66} color={color} gap={22} />
      <SvgText x="294" y="152" size={11} fill={MUTED}>{`${a}こ`}</SvgText>
      <SvgText x="180" y="196" size={13}>{op === 'add' ? '0こ増えても、数は変わらない' : '0こ減っても、数は変わらない'}</SvgText>
    </Stage>
  )
}

// ── たし算・ひき算とそろばん：答えを置いたそろばんと、筆算のくり上がり・くり下がり ────────
function SorobanBead({ x, y, active, color }) {
  return <ellipse cx={x} cy={y} rx="15" ry="7" fill={active ? color : GRID} stroke={active ? color : MUTED} strokeWidth="1.4" />
}

function SorobanScene({ values, color, markerId, label }) {
  const op = values.op
  const a = num(values.a)
  const b = num(values.b)
  const result = op === 'add' ? a + b : a - b
  const digits = [Math.floor(result / 100), Math.floor(result / 10) % 10, result % 10]
  const rods = [44, 94, 144]
  const ao = a % 10
  const at = Math.floor(a / 10)
  const bo = b % 10
  const bt = Math.floor(b / 10)
  const carryOnes = op === 'add' && ao + bo >= 10
  const carryTens = op === 'add' && at + bt + (carryOnes ? 1 : 0) >= 10
  const borrow = op === 'subtract' && ao < bo
  const columns = { h: 262, t: 292, o: 322 }
  const resultDigits = String(result).padStart(3, ' ').split('')
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="94" y="12" size={11} fill={MUTED}>そろばん（答え）</SvgText>
      <rect x="14" y="20" width="160" height="160" rx="8" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      <line x1="14" y1="68" x2="174" y2="68" stroke={INK} strokeWidth="3" />
      {rods.map((x, index) => {
        const digit = digits[index]
        const pushed = digit % 5
        return (
          <g key={x} data-soroban-rod={index} data-soroban-digit={digit}>
            <line x1={x} y1="22" x2={x} y2="178" stroke={MUTED} strokeWidth="2" />
            <SorobanBead x={x} y={digit >= 5 ? 56 : 34} active={digit >= 5} color={color} />
            {Array.from({ length: 4 }, (_, bead) => (
              <SorobanBead
                key={bead}
                x={x}
                y={bead < pushed ? 82 + bead * 15 : 168 - (3 - bead) * 15}
                active={bead < pushed}
                color={color}
              />
            ))}
            <SvgText x={x} y="196" size={11} fill={MUTED}>{['百', '十', '一'][index]}</SvgText>
          </g>
        )
      })}
      <SvgText x="292" y="12" size={11} fill={MUTED}>筆算</SvgText>
      {carryOnes && <SvgText x={columns.t} y="44" size={12} fill={WARM}>1</SvgText>}
      {carryTens && <SvgText x={columns.h} y="44" size={12} fill={WARM}>1</SvgText>}
      {borrow && (
        <>
          <SvgText x={columns.t} y="44" size={12} fill={WARM}>{at - 1}</SvgText>
          <SvgText x={columns.o} y="44" size={12} fill={WARM}>+10</SvgText>
          <line x1={columns.t - 8} y1="78" x2={columns.t + 8} y2="62" stroke={WARM} strokeWidth="2" />
        </>
      )}
      <SvgText x={columns.t} y="70" size={20} weight={800}>{at}</SvgText>
      <SvgText x={columns.o} y="70" size={20} weight={800}>{ao}</SvgText>
      <SvgText x="226" y="102" size={20} weight={800}>{op === 'add' ? '+' : '−'}</SvgText>
      {bt > 0 && <SvgText x={columns.t} y="102" size={20} weight={800}>{bt}</SvgText>}
      <SvgText x={columns.o} y="102" size={20} weight={800}>{bo}</SvgText>
      <line x1="214" y1="120" x2="340" y2="120" stroke={INK} strokeWidth="2" />
      {resultDigits.map((digit, index) => (
        digit.trim()
          ? <SvgText key={index} x={[columns.h, columns.t, columns.o][index]} y="146" size={20} weight={800} fill={color}>{digit}</SvgText>
          : null
      ))}
      <SvgText x="276" y="196" size={11} fill={borrow || carryOnes ? WARM : MUTED}>
        {op === 'add'
          ? carryOnes ? '10をこえたら上の位へ1' : 'くり上がりなし'
          : borrow ? '上の位から10を借りる' : 'くり下がりなし'}
      </SvgText>
    </Stage>
  )
}

// ── かけ算：点の長方形と、エジプトの倍々の方法 ────────────────────────
function MultiplyScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  if (values.mode === 'double') {
    const powers = [1, 2, 4, 8].filter((power) => power <= a)
    const chosen = powers.filter((power) => a & power)
    return (
      <Stage label={label} markerId={markerId} color={color}>
        <SvgText x="70" y="16" size={11} fill={MUTED}>何倍</SvgText>
        <SvgText x="170" y="16" size={11} fill={MUTED}>{`${b}の何倍`}</SvgText>
        <SvgText x="280" y="16" size={11} fill={MUTED}>使う行</SvgText>
        {powers.map((power, index) => {
          const used = chosen.includes(power)
          const y = 40 + index * 34
          return (
            <g key={power} data-double-row={power} data-double-used={used ? 'true' : 'false'}>
              <rect x="20" y={y - 14} width="320" height="28" rx="8" fill={used ? `${color}22` : PAPER} stroke={used ? color : GRID} strokeWidth="1.5" />
              <SvgText x="70" y={y} size={14} fill={used ? color : MUTED}>{`${power}倍`}</SvgText>
              <SvgText x="170" y={y} size={14} fill={used ? color : MUTED}>{power * b}</SvgText>
              <SvgText x="280" y={y} size={14} fill={used ? GOOD : MUTED}>{used ? '✓ 使う' : '—'}</SvgText>
            </g>
          )
        })}
        <SvgText x="180" y="182" size={12}>{`${a} ＝ ${chosen.join(' ＋ ')}`}</SvgText>
        <SvgText x="180" y="204" size={13} fill={color}>
          {`${a} × ${b} ＝ ${chosen.map((power) => power * b).join(' ＋ ')} ＝ ${a * b}`}
        </SvgText>
      </Stage>
    )
  }
  const cell = Math.min(320 / b, 160 / a, 20)
  const width = cell * b
  const height = cell * a
  const x0 = (360 - width) / 2
  const y0 = 28
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="180" y="14" size={11} fill={MUTED}>{`横に${b}こ`}</SvgText>
      <rect x={x0 - 3} y={y0 - 3} width={width + 6} height={height + 6} rx="6" fill={PAPER} stroke={color} strokeWidth="1.5" />
      {Array.from({ length: a * b }, (_, index) => (
        <circle
          key={index}
          cx={x0 + (index % b) * cell + cell / 2}
          cy={y0 + Math.floor(index / b) * cell + cell / 2}
          r={Math.max(1.6, cell * 0.3)}
          fill={color}
        />
      ))}
      <SvgText x={Math.max(22, x0 - 26)} y={y0 + height / 2} size={11} fill={MUTED}>{`縦に${a}こ`}</SvgText>
      <SvgText x="180" y="204" size={14} weight={800}>{`${a} × ${b} ＝ ${a * b}`}</SvgText>
    </Stage>
  )
}

// ── わり算とあまり：同じ数ずつの組と、あまり ──────────────────────────
function DivideScene({ values, color, markerId, label }) {
  const n = num(values.n)
  const k = num(values.k)
  const q = Math.floor(n / k)
  const r = n % k
  const groups = [...Array.from({ length: q }, () => ({ size: k, rest: false })), ...(r ? [{ size: r, rest: true }] : [])]
  // 組が少ないときは大きく、多いときは小さく並べる（1段に最大8組）。
  const perRow = Math.min(8, groups.length)
  const box = Math.min(64, 332 / perRow - 6)
  const rows = Math.ceil(groups.length / perRow)
  const top = 20 + Math.max(0, (144 - rows * (box + 8)) / 2)
  const left = (360 - perRow * (box + 6) + 6) / 2
  const dot = box / 3
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {groups.map((group, index) => {
        const x = left + (index % perRow) * (box + 6)
        const y = top + Math.floor(index / perRow) * (box + 8)
        const tone = group.rest ? WARM : color
        return (
          <g key={index} data-divide-group={group.rest ? 'rest' : 'full'} data-divide-size={group.size}>
            <rect x={x} y={y} width={box} height={box} rx="7" fill={PAPER} stroke={tone} strokeWidth="1.8" strokeDasharray={group.rest ? '4 3' : undefined} />
            {Array.from({ length: group.size }, (_, index2) => (
              <circle key={index2} cx={x + dot / 2 + (index2 % 3) * dot} cy={y + dot / 2 + Math.floor(index2 / 3) * dot} r={dot * 0.32} fill={tone} />
            ))}
          </g>
        )
      })}
      <SvgText x="180" y="182" size={13}>
        {r ? `${k}こずつ ${q}組・あまり ${r}こ` : `${k}こずつ ${q}組・あまりなし`}
      </SvgText>
      <SvgText x="180" y="204" size={12} fill={MUTED}>{`${k} × ${q} ＋ ${r} ＝ ${n}`}</SvgText>
    </Stage>
  )
}

// ── 計算のきまり：長方形を切り分けて見る分配のきまり ──────────────────────
function DistributiveScene({ values, color, markerId, label }) {
  const a = num(values.a)
  const b = num(values.b)
  const c = num(values.c)
  const cell = Math.min(300 / (b + c), 130 / a, 30)
  const x0 = (360 - (b + c) * cell) / 2
  const y0 = 30
  const split = x0 + b * cell
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x={(x0 + split) / 2} y="16" size={12} fill={color}>{`横 ${b}`}</SvgText>
      <SvgText x={split + (c * cell) / 2} y="16" size={12} fill={WARM}>{`横 ${c}`}</SvgText>
      <rect x={x0} y={y0} width={b * cell} height={a * cell} fill={`${color}30`} stroke={color} strokeWidth="2" data-distributive-part="left" />
      <rect x={split} y={y0} width={c * cell} height={a * cell} fill={`${WARM}30`} stroke={WARM} strokeWidth="2" data-distributive-part="right" />
      {Array.from({ length: b + c - 1 }, (_, index) => (
        <line key={`v${index}`} x1={x0 + (index + 1) * cell} y1={y0} x2={x0 + (index + 1) * cell} y2={y0 + a * cell} stroke={index + 1 === b ? INK : GRID} strokeWidth={index + 1 === b ? 2.5 : 1} />
      ))}
      {Array.from({ length: a - 1 }, (_, index) => (
        <line key={`h${index}`} x1={x0} y1={y0 + (index + 1) * cell} x2={x0 + (b + c) * cell} y2={y0 + (index + 1) * cell} stroke={GRID} strokeWidth="1" />
      ))}
      <SvgText x={x0 - 6} y={y0 + (a * cell) / 2} anchor="end" size={12}>{`縦 ${a}`}</SvgText>
      <SvgText x="20" y={y0 + a * cell + 18} anchor="start" size={12} fill={color}>{`左：${a} × ${b} ＝ ${a * b}`}</SvgText>
      <SvgText x="340" y={y0 + a * cell + 18} anchor="end" size={12} fill={WARM}>{`右：${a} × ${c} ＝ ${a * c}`}</SvgText>
      <SvgText x="180" y="206" size={13} weight={800}>{`${a} × (${b} ＋ ${c}) ＝ ${a * b} ＋ ${a * c} ＝ ${a * (b + c)}`}</SvgText>
    </Stage>
  )
}

// ── 分数：分数の大きさと、単位分数の和への分け方 ──────────────────────
const SEGMENT_TONES = [null, WARM, GOOD, ROSE]

function UnitFractionsScene({ values, color, markerId, label }) {
  const p = num(values.p)
  const q = num(values.q)
  const whole = Math.floor(p / q)
  const rest = p % q
  const units = Math.ceil(p / q)
  const unitWidth = 320 / units
  const denominators = rest ? unitFractionDenominators(rest, q) : []
  let cursor = 20
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="20" y="14" anchor="start" size={11} fill={MUTED}>{`${p}/${q} の大きさ（1本が1）`}</SvgText>
      {Array.from({ length: units }, (_, unit) => (
        <g key={unit}>
          {Array.from({ length: q }, (_, cell) => {
            const index = unit * q + cell
            return (
              <rect
                key={cell}
                x={20 + unit * unitWidth + (cell * unitWidth) / q}
                y="26"
                width={unitWidth / q}
                height="30"
                fill={index < p ? color : PAPER}
                stroke={INK}
                strokeWidth="0.8"
                data-fraction-cell={index < p ? 'on' : 'off'}
              />
            )
          })}
          <SvgText x={20 + (unit + 1) * unitWidth} y="68" anchor="end" size={10} fill={MUTED}>{unit + 1}</SvgText>
        </g>
      ))}
      {rest ? (
        <>
          <SvgText x="20" y="94" anchor="start" size={11} fill={MUTED}>
            {whole ? `あまりの ${rest}/${q} を単位分数に分ける` : `${rest}/${q} を単位分数に分ける`}
          </SvgText>
          <rect x="20" y="104" width="320" height="30" fill={PAPER} stroke={INK} strokeWidth="1" />
          {denominators.map((denominator, index) => {
            const width = 320 / denominator
            const x = cursor
            cursor += width
            const tone = SEGMENT_TONES[index % SEGMENT_TONES.length] ?? color
            return (
              <g key={index} data-unit-fraction={denominator}>
                <rect x={x} y="104" width={width} height="30" fill={tone} stroke={PAPER} strokeWidth="1" />
                {width >= 26 && <SvgText x={x + width / 2} y="148" size={11} fill={tone}>{`1/${denominator}`}</SvgText>}
              </g>
            )
          })}
          <SvgText x="180" y="178" size={12}>
            {`${rest}/${q} ＝ ${denominators.map((denominator) => `1/${denominator}`).join(' ＋ ')}`}
          </SvgText>
        </>
      ) : (
        <SvgText x="180" y="120" size={14} fill={color}>{`${p}/${q} ＝ ${whole}（分子が分母でわり切れる）`}</SvgText>
      )}
      <SvgText x="180" y="206" size={11} fill={MUTED}>引ける中でいちばん大きい単位分数を引いていく</SvgText>
    </Stage>
  )
}

// ── 分数の計算：分母をそろえてたす ────────────────────────────────
function FractionBar({ y, cells, shaded, tone, offset = 0, extraTone, extra = 0 }) {
  const width = 280 / cells
  return Array.from({ length: cells }, (_, index) => {
    const on = index >= offset && index < offset + shaded
    const extraOn = !on && index >= offset + shaded && index < offset + shaded + extra
    return (
      <rect
        key={index}
        x={60 + index * width}
        y={y}
        width={width}
        height="24"
        fill={on ? tone : extraOn ? extraTone : PAPER}
        stroke={INK}
        strokeWidth="0.8"
      />
    )
  })
}

function CommonDenominatorScene({ values, color, markerId, label }) {
  const [a, b] = parseFraction(values.x)
  const [c, d] = parseFraction(values.y)
  const L = lcm(b, d)
  const left = a * (L / b)
  const right = c * (L / d)
  const sum = left + right
  const g = gcd(sum, L)
  const firstUnit = Math.min(sum, L)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="52" y="22" anchor="end" size={12} fill={color}>{`${a}/${b}`}</SvgText>
      <FractionBar y={10} cells={b} shaded={a} tone={color} />
      <SvgText x="52" y="56" anchor="end" size={12} fill={WARM}>{`${c}/${d}`}</SvgText>
      <FractionBar y={44} cells={d} shaded={c} tone={WARM} />
      <SvgText x="200" y="88" size={11} fill={MUTED}>{`分母を ${L} にそろえる`}</SvgText>
      <SvgText x="52" y="112" anchor="end" size={12}>合計</SvgText>
      <FractionBar y={100} cells={L} shaded={Math.min(left, L)} tone={color} extraTone={WARM} extra={firstUnit - Math.min(left, L)} />
      {sum > L && (
        <>
          <SvgText x="52" y="140" anchor="end" size={11} fill={MUTED}>1をこえた分</SvgText>
          <FractionBar y={128} cells={L} shaded={0} tone={color} extraTone={WARM} extra={sum - L} />
        </>
      )}
      <SvgText x="200" y="178" size={13}>
        {`${left}/${L} ＋ ${right}/${L} ＝ ${sum}/${L}${g > 1 ? ` ＝ ${sum / g}/${L / g}` : ''}`}
      </SvgText>
      <SvgText x="200" y="204" size={11} fill={MUTED}>{b === d ? '分母がそろっているので分子をたす' : `${b}と${d}の最小公倍数は${L}`}</SvgText>
    </Stage>
  )
}

// ── 小数：1を10等分していく拡大図 ────────────────────────────────
function DecimalBar({ y, filled, focus, tone, size }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, index) => (
        <rect
          key={index}
          x={40 + index * 30}
          y={y}
          width="30"
          height="22"
          fill={index < filled ? tone : PAPER}
          stroke={index === focus ? WARM : INK}
          strokeWidth={index === focus ? 2.4 : 0.8}
        />
      ))}
      <SvgText x="34" y={y + 11} anchor="end" size={9} fill={MUTED}>{size}</SvgText>
    </g>
  )
}

function DecimalZoomScene({ values, color, markerId, label }) {
  const digits = [num(values.t), num(values.h), num(values.th)]
  const buai = [['割', digits[0]], ['分', digits[1]], ['厘', digits[2]]]
    .filter(([, digit]) => digit)
    .map(([name, digit]) => `${digit}${name}`)
    .join('')
  const zoom = (fromY, index) => (
    <g>
      <line x1={40 + index * 30} y1={fromY + 22} x2="40" y2={fromY + 44} stroke={WARM} strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={70 + index * 30} y1={fromY + 22} x2="340" y2={fromY + 44} stroke={WARM} strokeWidth="1.2" strokeDasharray="3 3" />
    </g>
  )
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="190" y="12" size={12} weight={800}>{`${decimalText(digits)}${buai ? `（${buai}）` : ''}`}</SvgText>
      <DecimalBar y={26} filled={digits[0]} focus={digits[0]} tone={color} size="0.1" />
      {zoom(26, digits[0])}
      <DecimalBar y={92} filled={digits[1]} focus={digits[1]} tone={color} size="0.01" />
      {zoom(92, digits[1])}
      <DecimalBar y={158} filled={digits[2]} focus={-1} tone={color} size="0.001" />
      <SvgText x="190" y="200" size={11} fill={MUTED}>オレンジの枠を10等分したのが、次の段</SvgText>
    </Stage>
  )
}

// ── 約数と倍数：エラトステネスのふるい ────────────────────────────
const SIEVE_TONES = { 2: ROSE, 3: WARM, 5: GOOD, 7: '#1d4ed8' }

function SieveScene({ values, color, markerId, label }) {
  const step = num(values.step)
  const done = [2, 3, 5, 7].slice(0, step)
  return (
    <Stage label={label} markerId={markerId} color={color}>
      {Array.from({ length: 100 }, (_, index) => {
        const value = index + 1
        const x = 26 + (index % 10) * 34
        const y = 14 + Math.floor(index / 10) * 20
        const removedBy = value > 1 ? sieveRemovedBy(value, step) : null
        const isChecked = done.includes(value)
        const isPrime = step === 4 && value > 1 && !removedBy
        return (
          <g key={value} data-sieve-number={value} data-sieve-state={value === 1 ? 'one' : removedBy ? `removed-${removedBy}` : isPrime ? 'prime' : 'open'}>
            {(isPrime || isChecked) && <rect x={x - 14} y={y - 8} width="28" height="16" rx="5" fill={`${color}22`} stroke={color} strokeWidth="1.2" />}
            <SvgText x={x} y={y} size={11} weight={isPrime || isChecked ? 800 : 600} fill={removedBy || value === 1 ? MUTED : isPrime || isChecked ? color : INK}>
              {value}
            </SvgText>
            {removedBy && <line x1={x - 11} y1={y + 5} x2={x + 11} y2={y - 5} stroke={SIEVE_TONES[removedBy]} strokeWidth="1.6" />}
          </g>
        )
      })}
    </Stage>
  )
}

// ── 文字の式：数当てを文字で説明する ──────────────────────────────
function ThinkNumberScene({ values, color, markerId, label }) {
  const x = num(values.x)
  const k = num(values.k)
  const rows = [
    ['思った数', x, 'x'],
    ['2倍する', 2 * x, '2x'],
    [`${k}をたす`, 2 * x + k, `2x＋${k}`],
    ['2でわる', x + k / 2, `x＋${k / 2}`],
    ['はじめの数をひく', k / 2, `${k / 2}`],
  ]
  return (
    <Stage label={label} markerId={markerId} color={color}>
      <SvgText x="18" y="14" anchor="start" size={11} fill={MUTED}>手順</SvgText>
      <SvgText x="196" y="14" size={11} fill={MUTED}>{`数で（${x}のとき）`}</SvgText>
      <SvgText x="300" y="14" size={11} fill={MUTED}>文字で</SvgText>
      {rows.map(([step, value, expression], index) => {
        const y = 42 + index * 34
        const last = index === rows.length - 1
        return (
          <g key={step} data-think-step={index}>
            <rect x="10" y={y - 14} width="340" height="28" rx="8" fill={last ? `${color}22` : PAPER} stroke={last ? color : GRID} strokeWidth="1.5" />
            <SvgText x="20" y={y} anchor="start" size={13}>{step}</SvgText>
            <SvgText x="196" y={y} size={15} weight={800} fill={last ? color : INK}>{value}</SvgText>
            <SvgText x="300" y={y} size={15} weight={800} fill={last ? color : INK}>{expression}</SvgText>
          </g>
        )
      })}
    </Stage>
  )
}

export const NUMBER_SCENES = Object.freeze({
  tally: TallyScene,
  'place-value': PlaceValueScene,
  'zero-rules': ZeroRulesScene,
  soroban: SorobanScene,
  multiply: MultiplyScene,
  divide: DivideScene,
  distributive: DistributiveScene,
  'unit-fractions': UnitFractionsScene,
  'common-denominator': CommonDenominatorScene,
  'decimal-zoom': DecimalZoomScene,
  sieve: SieveScene,
  'think-number': ThinkNumberScene,
})
