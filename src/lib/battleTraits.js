import {
  BATTLE_STUDENTS,
  isRestorableBattleStudentId,
  normalizeBattleStudentId,
} from './battleCast.js'
import { normalizeBattleStars } from './battleThemes.js'

// 放課後スターは演出解放の累計値として残したまま、100個ごとに
// 人物育成へ配分できる「星彩ポイント」を1点生む。学習の正答率は変えない。
export const BATTLE_TRAIT_POINT_STARS = 100
export const MAX_BATTLE_TRAIT_LEVEL = 5

export const BATTLE_TRAITS = [
  {
    id: 'insight',
    name: '知性',
    colorName: '紫',
    color: '#a78bfa',
    softColor: '#ede9fe',
    emoji: '🔮',
    description: '手がかりをつなぎ、答えへの道筋を見抜く力。',
    voice: '「手がかりをつなげれば、答えはきっと見えてくる。」',
    x: 120,
    y: 18,
  },
  {
    id: 'empathy',
    name: '共感',
    colorName: '青',
    color: '#38bdf8',
    softColor: '#e0f2fe',
    emoji: '🤝',
    description: '相手の思いを受け取り、ことばを届ける力。',
    voice: '「一人で抱えなくていい。ことばは誰かへ届くから。」',
    x: 214,
    y: 86,
  },
  {
    id: 'harmony',
    name: '調和',
    colorName: '緑',
    color: '#34d399',
    softColor: '#d1fae5',
    emoji: '🍀',
    description: '呼吸を整え、仲間の力を一つに合わせる力。',
    voice: '「急がなくて大丈夫。呼吸を合わせて、もう一度。」',
    x: 178,
    y: 198,
  },
  {
    id: 'resolve',
    name: '信念',
    colorName: '桃',
    color: '#fb7185',
    softColor: '#ffe4e6',
    emoji: '🌸',
    description: '大切な記憶や約束を、最後まで守り抜く力。',
    voice: '「大切な約束は、絶対に忘れさせない。」',
    x: 62,
    y: 198,
  },
  {
    id: 'courage',
    name: '勇気',
    colorName: '橙',
    color: '#f59e0b',
    softColor: '#fef3c7',
    emoji: '⚡',
    description: 'こわさを抱えたまま、最初の一歩を踏み出す力。',
    voice: '「こわくても一歩出る。次はきっと間に合う。」',
    x: 26,
    y: 86,
  },
]

const TRAIT_BY_ID = new Map(BATTLE_TRAITS.map((trait) => [trait.id, trait]))
const STUDENT_IDS = new Set(BATTLE_STUDENTS.map((student) => student.id))

// 各人物が物語開始時から持つ輪郭。育成値とは分け、既存プロフィールの
// 性格がいきなり無色にならないようにする。
export const BATTLE_STUDENT_BASE_TRAITS = {
  mio: { insight: 1, empathy: 2, harmony: 3, resolve: 2, courage: 1 },
  ren: { insight: 3, empathy: 1, harmony: 1, resolve: 2, courage: 2 },
  haru: { insight: 3, empathy: 1, harmony: 2, resolve: 2, courage: 1 },
  akari: { insight: 3, empathy: 1, harmony: 1, resolve: 1, courage: 3 },
  kaito: { insight: 1, empathy: 2, harmony: 1, resolve: 2, courage: 3 },
  rei: { insight: 3, empathy: 1, harmony: 2, resolve: 3, courage: 1 },
  nao: { insight: 1, empathy: 3, harmony: 2, resolve: 1, courage: 2 },
  tsubaki: { insight: 1, empathy: 2, harmony: 2, resolve: 3, courage: 3 },
  noa: { insight: 3, empathy: 2, harmony: 1, resolve: 1, courage: 1 },
  yuu: { insight: 2, empathy: 2, harmony: 2, resolve: 3, courage: 1 },
}

export function battleTraitById(traitId) {
  return TRAIT_BY_ID.get(traitId) ?? BATTLE_TRAITS[0]
}

export function battleTraitPointBudget(battleStars = 0) {
  return Math.floor(normalizeBattleStars(battleStars) / BATTLE_TRAIT_POINT_STARS)
}

function safeInvestment(value) {
  if (!Number.isSafeInteger(value)) return 0
  return Math.max(0, Math.min(MAX_BATTLE_TRAIT_LEVEL, value))
}

function rawStudentInvestments(value, studentId) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  if (studentId === 'kaito') {
    return {
      ...(value.sora && typeof value.sora === 'object' ? value.sora : {}),
      ...(value.kaito && typeof value.kaito === 'object' ? value.kaito : {}),
    }
  }
  const student = value[studentId]
  return student && typeof student === 'object' && !Array.isArray(student)
    ? student
    : {}
}

export function normalizeBattleTraitInvestments(value, battleStars = 0) {
  const budget = battleTraitPointBudget(battleStars)
  const normalized = {}
  let used = 0

  for (const student of BATTLE_STUDENTS) {
    const raw = rawStudentInvestments(value, student.id)
    const base = BATTLE_STUDENT_BASE_TRAITS[student.id] ?? {}
    const next = {}
    for (const trait of BATTLE_TRAITS) {
      const room = Math.max(0, MAX_BATTLE_TRAIT_LEVEL - (base[trait.id] ?? 0))
      const amount = Math.min(safeInvestment(raw[trait.id]), room, budget - used)
      if (amount > 0) {
        next[trait.id] = amount
        used += amount
      }
    }
    if (Object.keys(next).length) normalized[student.id] = next
  }

  return normalized
}

export function isValidBattleTraitInvestments(value, battleStars = 0) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  let spent = 0
  for (const [rawStudentId, investments] of Object.entries(value)) {
    if (!isRestorableBattleStudentId(rawStudentId)) return false
    const studentId = normalizeBattleStudentId(rawStudentId)
    if (!STUDENT_IDS.has(studentId)) return false
    if (!investments || typeof investments !== 'object' || Array.isArray(investments)) {
      return false
    }
    const base = BATTLE_STUDENT_BASE_TRAITS[studentId] ?? {}
    for (const [traitId, amount] of Object.entries(investments)) {
      if (!TRAIT_BY_ID.has(traitId) || !Number.isSafeInteger(amount) || amount < 0) {
        return false
      }
      if (amount > MAX_BATTLE_TRAIT_LEVEL - (base[traitId] ?? 0)) return false
      spent += amount
    }
  }
  return spent <= battleTraitPointBudget(battleStars)
}

export function battleTraitPointsSpent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 0
  return Object.values(value).reduce((studentTotal, investments) => {
    if (!investments || typeof investments !== 'object' || Array.isArray(investments)) {
      return studentTotal
    }
    return studentTotal + Object.values(investments).reduce(
      (total, amount) => total + safeInvestment(amount),
      0,
    )
  }, 0)
}

export function battleTraitPointSummary(battleStars = 0, value = {}) {
  const investments = normalizeBattleTraitInvestments(value, battleStars)
  const budget = battleTraitPointBudget(battleStars)
  const spent = battleTraitPointsSpent(investments)
  const remainder = normalizeBattleStars(battleStars) % BATTLE_TRAIT_POINT_STARS
  return {
    budget,
    spent,
    available: Math.max(0, budget - spent),
    starsUntilNext: remainder === 0 && budget > 0
      ? BATTLE_TRAIT_POINT_STARS
      : BATTLE_TRAIT_POINT_STARS - remainder,
    investments,
  }
}

export function battleStudentTraitProfile(studentId, value = {}, battleStars = 0) {
  const normalizedStudentId = normalizeBattleStudentId(studentId)
  const summary = battleTraitPointSummary(battleStars, value)
  const base = BATTLE_STUDENT_BASE_TRAITS[normalizedStudentId]
    ?? BATTLE_STUDENT_BASE_TRAITS.mio
  const invested = summary.investments[normalizedStudentId] ?? {}
  const levels = Object.fromEntries(BATTLE_TRAITS.map((trait) => [
    trait.id,
    Math.min(MAX_BATTLE_TRAIT_LEVEL, (base[trait.id] ?? 0) + (invested[trait.id] ?? 0)),
  ]))
  const ranked = [...BATTLE_TRAITS].sort((a, b) => {
    const levelDifference = levels[b.id] - levels[a.id]
    if (levelDifference) return levelDifference
    const investedDifference = (invested[b.id] ?? 0) - (invested[a.id] ?? 0)
    if (investedDifference) return investedDifference
    return BATTLE_TRAITS.indexOf(a) - BATTLE_TRAITS.indexOf(b)
  })
  const dominant = ranked[0]
  const secondary = ranked[1]
  const investedTotal = Object.values(invested).reduce((sum, amount) => sum + amount, 0)

  return {
    studentId: normalizedStudentId,
    base,
    invested,
    investedTotal,
    levels,
    dominant,
    secondary,
    colorLabel: `${dominant.colorName}・${dominant.name}`,
    aura: `linear-gradient(135deg, ${dominant.color}, ${secondary.color})`,
    voice: dominant.voice,
    summary,
  }
}

export function canRaiseBattleTrait({
  battleStars = 0,
  investments = {},
  studentId,
  traitId,
}) {
  const trait = TRAIT_BY_ID.get(traitId)
  const normalizedStudentId = normalizeBattleStudentId(studentId)
  if (!trait || !STUDENT_IDS.has(normalizedStudentId)) return false
  const profile = battleStudentTraitProfile(
    normalizedStudentId,
    investments,
    battleStars,
  )
  return profile.summary.available > 0
    && profile.levels[trait.id] < MAX_BATTLE_TRAIT_LEVEL
}

export function raiseBattleTrait({
  battleStars = 0,
  investments = {},
  studentId,
  traitId,
}) {
  const normalizedStudentId = normalizeBattleStudentId(studentId)
  const normalized = normalizeBattleTraitInvestments(investments, battleStars)
  if (!canRaiseBattleTrait({
    battleStars,
    investments: normalized,
    studentId: normalizedStudentId,
    traitId,
  })) return normalized

  return {
    ...normalized,
    [normalizedStudentId]: {
      ...(normalized[normalizedStudentId] ?? {}),
      [traitId]: (normalized[normalizedStudentId]?.[traitId] ?? 0) + 1,
    },
  }
}

export function resetBattleStudentTraits({
  battleStars = 0,
  investments = {},
  studentId,
}) {
  const normalizedStudentId = normalizeBattleStudentId(studentId)
  const normalized = normalizeBattleTraitInvestments(investments, battleStars)
  if (!(normalizedStudentId in normalized)) return normalized
  const { [normalizedStudentId]: _removed, ...rest } = normalized
  return rest
}
