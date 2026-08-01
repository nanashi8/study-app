export const BATTLE_STAR_PER_CORRECT = 10
export const MAX_BATTLE_STARS = 9_999_999
export const BATTLE_XP_PER_EXCHANGE = 50
export const BATTLE_STARS_PER_EXCHANGE = 25

export const BATTLE_BARRIER_MAP_IMAGE = '/assets/battle/world/barrier-district-night-v2.webp'

// 夜景の窓明かり。百分率座標なので画面幅が変わっても建物の上に留まる。
export const BATTLE_BARRIER_WINDOW_LIGHTS = [
  [6, 7, 0.1, 3.8, 1.4], [13, 14, 1.7, 4.6, 1.1],
  [20, 6, 2.4, 5.2, 1.3], [28, 12, 0.8, 4.1, 1.2],
  [36, 8, 3.1, 5.8, 1.4], [43, 17, 1.2, 3.9, 1.1],
  [47, 14, 2.1, 4.4, 1.5], [50, 13, 0.4, 5.1, 1.7],
  [53, 14, 2.8, 4.7, 1.4], [59, 8, 1.5, 5.5, 1.2],
  [67, 12, 3.4, 4.2, 1.4], [75, 8, 0.7, 3.7, 1.1],
  [84, 15, 2.5, 5.6, 1.4], [93, 8, 1.1, 4.8, 1.2],
  [15, 26, 2.9, 4.3, 1.7], [23, 31, 0.3, 5.3, 1.3],
  [72, 25, 1.9, 3.6, 1.5], [78, 27, 0.9, 4.9, 1.8],
  [84, 30, 3.2, 5.4, 1.2], [41, 39, 1.4, 4.5, 1.4],
  [46, 40, 2.7, 5.1, 1.6], [50, 37, 0.5, 3.8, 1.8],
  [56, 41, 2.2, 4.7, 1.5], [60, 45, 1.0, 5.7, 1.2],
  [47, 48, 3.0, 4.2, 1.7], [22, 71, 0.6, 5.0, 1.3],
  [25, 74, 2.3, 3.9, 1.6], [73, 69, 1.6, 4.6, 1.3],
  [78, 76, 0.2, 5.2, 1.6], [83, 72, 2.6, 4.1, 1.2],
  [35, 82, 1.3, 5.5, 1.4], [45, 88, 3.3, 4.8, 1.2],
  [60, 84, 0.8, 3.7, 1.5], [90, 80, 2.0, 5.3, 1.3],
].map(([x, y, delay, duration, size], index) => ({
  id: `window-${index + 1}`,
  x,
  y,
  delay,
  duration,
  size,
}))

// 画像内の主要道路に沿う車灯。白系は前照灯、赤系は尾灯、青系は列車灯。
export const BATTLE_BARRIER_TRAFFIC_LIGHTS = [
  {
    id: 'ring-eastbound',
    kind: 'headlight',
    path: 'M -5 54 C 12 51 20 39 35 38 C 46 37 50 31 59 31 C 73 32 84 40 105 38',
    duration: 13,
    delay: -1,
  },
  {
    id: 'ring-westbound',
    kind: 'taillight',
    path: 'M 105 41 C 83 42 71 36 59 35 C 49 34 44 42 34 43 C 20 44 12 56 -5 59',
    duration: 15,
    delay: -8,
  },
  {
    id: 'south-eastbound',
    kind: 'headlight',
    path: 'M -5 68 C 16 62 28 63 40 68 C 54 74 63 64 71 58 C 82 48 92 49 105 52',
    duration: 17,
    delay: -4,
  },
  {
    id: 'south-westbound',
    kind: 'taillight',
    path: 'M 105 55 C 91 53 82 52 73 61 C 63 70 55 78 40 72 C 26 66 12 66 -5 72',
    duration: 18,
    delay: -12,
  },
  {
    id: 'shrine-to-library',
    kind: 'headlight',
    path: 'M 18 105 C 20 88 28 75 39 67 C 47 61 50 55 50 45 C 50 31 49 19 51 -5',
    duration: 16,
    delay: -10,
  },
  {
    id: 'library-to-shrine',
    kind: 'taillight',
    path: 'M 53 -5 C 51 20 53 34 52 46 C 51 58 46 64 39 70 C 28 79 24 91 22 105',
    duration: 19,
    delay: -3,
  },
  {
    id: 'park-loop-headlight',
    kind: 'headlight',
    path: 'M 69 69 C 75 63 85 65 88 75 C 90 84 81 92 72 88 C 65 84 63 75 69 69 Z',
    duration: 11,
    delay: -2,
  },
  {
    id: 'park-loop-taillight',
    kind: 'taillight',
    path: 'M 72 88 C 63 84 65 72 70 67 C 77 61 88 67 89 77 C 89 86 80 92 72 88 Z',
    duration: 14,
    delay: -9,
  },
  {
    id: 'north-arterial',
    kind: 'taillight',
    path: 'M -5 10 C 18 7 23 17 38 17 C 54 16 66 9 82 12 C 92 14 98 8 105 5',
    duration: 20,
    delay: -6,
  },
  {
    id: 'station-train',
    kind: 'train',
    path: 'M 64 18 C 77 17 89 15 106 17',
    duration: 8,
    delay: -5,
  },
]

export const BATTLE_BARRIER_CENTER = {
  id: 'school',
  name: '学校',
  role: '中央核',
  emoji: '🏫',
  x: 50,
  y: 53,
  accent: '#fde68a',
  description: '五つの結界脈を束ねる中心核。生徒たちの学びが結界を安定させる。',
}

// 背景画像のランドマーク位置に合わせた百分率座標。
// outer は外周、star は五芒星を描く順番として画面側で使う。
export const BATTLE_BARRIER_NODES = [
  {
    id: 'library',
    name: '図書館',
    role: '知識の頂点',
    emoji: '📚',
    x: 50,
    y: 17,
    accent: '#a78bfa',
    description: '街に蓄えられた記憶と言葉を守る、北端の結界点。',
  },
  {
    id: 'station',
    name: '駅前',
    role: '交流の頂点',
    emoji: '🚉',
    x: 79,
    y: 29,
    accent: '#38bdf8',
    description: '人とことばが行き交い、新しい物語を運び込む東の玄関。',
  },
  {
    id: 'central-park',
    name: '中央公園',
    role: '調和の頂点',
    emoji: '🌳',
    x: 75,
    y: 76,
    accent: '#34d399',
    description: '噴水と緑が街の呼吸を整える、憩いの結界点。',
  },
  {
    id: 'shrine',
    name: '神社',
    role: '継承の頂点',
    emoji: '⛩️',
    x: 25,
    y: 77,
    accent: '#fb7185',
    description: '古い誓いと地域の記憶を受け継ぐ、静かな結界点。',
  },
  {
    id: 'stadium',
    name: '競技場',
    role: '意志の頂点',
    emoji: '🏟️',
    x: 20,
    y: 32,
    accent: '#f59e0b',
    description: '挑戦する身体と意志の熱を蓄える、西側の結界点。',
  },
]

export const BATTLE_BARRIER_STAR_ORDER = [
  'library',
  'central-park',
  'stadium',
  'station',
  'shrine',
  'library',
]

const BARRIER_LOCATION_BY_ID = new Map(
  [BATTLE_BARRIER_CENTER, ...BATTLE_BARRIER_NODES].map((location) => [
    location.id,
    location,
  ]),
)

export function battleBarrierLocationById(id) {
  return BARRIER_LOCATION_BY_ID.get(id) ?? BATTLE_BARRIER_CENTER
}

export const BATTLE_THEMES = [
  {
    id: 'music-pastel',
    name: '夕映え音楽室',
    shortName: '音楽室',
    emoji: '🎼',
    unlockAt: 0,
    description: 'ラベンダーとミントの、きらめく放課後',
    lore: '音が気持ちを整え、正解のリズムを力に変える「旋律棟」。',
    ability: {
      id: 'encore',
      name: 'アンコール',
      emoji: '🎵',
      kind: 'heal',
      every: 3,
      healPercent: 5,
      label: '3正解ごとにHPを5%回復',
    },
    preview: '/assets/battle/pixel/music-preview.webp',
    stage: '/assets/battle/pixel/music-stage.webp',
    heroPortrait: '/assets/battle/pixel/music-hero.webp',
    rivalPortrait: '/assets/battle/pixel/music-rival.webp',
    actorsSheet: '/assets/battle/pixel/music-actors-v2.webp',
    particles: ['♪', '♫', '✦', '♬', '♡', '♩'],
    scenes: [
      {
        id: 'overture',
        name: '序曲',
        overlay: 'linear-gradient(115deg,rgba(124,58,237,.3),transparent 48%,rgba(94,234,212,.22))',
        position: 'center 40%',
      },
      {
        id: 'crescendo',
        name: 'クレッシェンド',
        overlay: 'radial-gradient(circle at 52% 42%,rgba(253,230,138,.34),transparent 38%),linear-gradient(120deg,rgba(236,72,153,.22),transparent 58%)',
        position: 'center 52%',
      },
      {
        id: 'encore',
        name: 'アンコール',
        overlay: 'linear-gradient(135deg,rgba(167,139,250,.32),transparent 45%,rgba(251,207,232,.28))',
        position: 'center 64%',
      },
    ],
    accent: '#a78bfa',
    accentStrong: '#7c3aed',
    accentSoft: '#f3e8ff',
    enemy: '#5eead4',
    surface: '#fff7fb',
    gradient: 'linear-gradient(135deg,#7c3aed 0%,#a78bfa 46%,#ec4899 100%)',
  },
  {
    id: 'art-tactics',
    name: '図工室タクティクス',
    shortName: '図工室',
    emoji: '🎨',
    unlockAt: 150,
    description: '校内を盤面にする、アイソメトリック演出',
    lore: '机も画材も地形になる、作戦重視の「創作棟」。',
    ability: {
      id: 'draft-guard',
      name: '下書きガード',
      emoji: '🖌️',
      kind: 'guard',
      reductionPercent: 50,
      label: '最初の反撃ダメージを半減',
    },
    preview: '/assets/battle/pixel/art-preview.webp',
    stage: '/assets/battle/pixel/art-stage.webp',
    heroPortrait: '/assets/battle/pixel/art-hero.webp',
    rivalPortrait: '/assets/battle/pixel/art-rival.webp',
    actorsSheet: '/assets/battle/pixel/art-actors-v2.webp',
    particles: ['◆', '●', '▲', '■', '✦', '◇'],
    scenes: [
      {
        id: 'sketch',
        name: '下書き',
        overlay: 'repeating-linear-gradient(135deg,rgba(56,189,248,.16) 0 2px,transparent 2px 18px),linear-gradient(90deg,rgba(15,23,42,.28),transparent)',
        position: 'center 38%',
      },
      {
        id: 'color',
        name: '彩色',
        overlay: 'radial-gradient(circle at 30% 35%,rgba(45,212,191,.3),transparent 32%),radial-gradient(circle at 72% 60%,rgba(251,113,133,.28),transparent 34%)',
        position: 'center 52%',
      },
      {
        id: 'finish',
        name: '完成',
        overlay: 'linear-gradient(125deg,rgba(14,116,144,.3),transparent 48%,rgba(180,83,9,.28))',
        position: 'center 66%',
      },
    ],
    accent: '#38bdf8',
    accentStrong: '#0369a1',
    accentSoft: '#e0f2fe',
    enemy: '#fb7185',
    surface: '#f8fafc',
    gradient: 'linear-gradient(135deg,#0f172a 0%,#0e7490 54%,#b45309 100%)',
  },
  {
    id: 'library-cinema',
    name: '黄昏の大図書室',
    shortName: '図書室',
    emoji: '📚',
    unlockAt: 400,
    description: '夕日とネオンが交差するシネマティック演出',
    lore: '覚えた言葉が光るページとなって飛ぶ、学園最深部の「記憶塔」。',
    ability: {
      id: 'page-burst',
      name: 'ページバースト',
      emoji: '✨',
      kind: 'power',
      every: 3,
      bonusPercent: 35,
      label: '3正解ごとに追加ダメージ',
    },
    preview: '/assets/battle/pixel/library-preview.webp',
    stage: '/assets/battle/pixel/library-stage.webp',
    heroPortrait: '/assets/battle/pixel/library-hero.webp',
    rivalPortrait: '/assets/battle/pixel/library-rival.webp',
    actorsSheet: '/assets/battle/pixel/library-actors-v2.webp',
    particles: ['▱', '✦', '◇', '⌁', '✧', '▰'],
    scenes: [
      {
        id: 'archive',
        name: '書庫',
        overlay: 'linear-gradient(110deg,rgba(2,6,23,.48),transparent 48%,rgba(245,158,11,.2))',
        position: 'center 36%',
      },
      {
        id: 'spell',
        name: '魔導',
        overlay: 'radial-gradient(circle at 35% 52%,rgba(34,211,238,.34),transparent 34%),radial-gradient(circle at 70% 48%,rgba(244,114,182,.32),transparent 36%)',
        position: 'center 50%',
      },
      {
        id: 'memory',
        name: '記憶',
        overlay: 'linear-gradient(135deg,rgba(3,105,161,.34),transparent 42%,rgba(157,23,77,.34))',
        position: 'center 64%',
      },
    ],
    accent: '#22d3ee',
    accentStrong: '#0369a1',
    accentSoft: '#cffafe',
    enemy: '#f472b6',
    surface: '#f8fafc',
    gradient: 'linear-gradient(135deg,#020617 0%,#0c4a6e 48%,#9d174d 100%)',
  },
]

const THEME_BY_ID = new Map(BATTLE_THEMES.map((theme) => [theme.id, theme]))

export function normalizeBattleStars(value) {
  const stars = Number(value)
  if (!Number.isFinite(stars)) return 0
  return Math.max(0, Math.min(MAX_BATTLE_STARS, Math.floor(stars)))
}

function normalizeTotalXp(value) {
  const xp = Number(value)
  if (!Number.isFinite(xp)) return 0
  return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(xp)))
}

// LV判定には累計XPを残したまま、ゲームへ変換済みのXPだけを台帳で管理する。
// totalXp を上限にすることで、古い保存値や壊れた同期値から二重交換が起きない。
export function normalizeBattleXpSpent(value, totalXp = Number.MAX_SAFE_INTEGER) {
  const spent = Number(value)
  const safeTotalXp = normalizeTotalXp(totalXp)
  if (!Number.isFinite(spent)) return 0
  return Math.max(0, Math.min(safeTotalXp, Math.floor(spent)))
}

// 未変換XPを固定レートでまとめて放課後スターへ変換する見積もり。
// 端数XPは次回へ持ち越し、スター上限を超える交換は行わない。
export function battleXpExchange(totalXp, spentXp, battleStars) {
  const safeTotalXp = normalizeTotalXp(totalXp)
  const safeSpentXp = normalizeBattleXpSpent(spentXp, safeTotalXp)
  const safeBattleStars = normalizeBattleStars(battleStars)
  const availableXp = safeTotalXp - safeSpentXp
  const exchangesByXp = Math.floor(availableXp / BATTLE_XP_PER_EXCHANGE)
  const exchangesByCapacity = Math.floor(
    (MAX_BATTLE_STARS - safeBattleStars) / BATTLE_STARS_PER_EXCHANGE,
  )
  const exchanges = Math.max(0, Math.min(exchangesByXp, exchangesByCapacity))
  const xpCost = exchanges * BATTLE_XP_PER_EXCHANGE
  const starsGained = exchanges * BATTLE_STARS_PER_EXCHANGE

  return {
    totalXp: safeTotalXp,
    spentXp: safeSpentXp,
    availableXp,
    availableAfter: availableXp - xpCost,
    exchanges,
    xpCost,
    starsGained,
    canExchange: exchanges > 0,
    starCapacityReached: exchangesByCapacity === 0,
    xpUntilNext: exchanges > 0
      ? 0
      : Math.max(0, BATTLE_XP_PER_EXCHANGE - availableXp),
    nextSpentXp: safeSpentXp + xpCost,
    nextBattleStars: safeBattleStars + starsGained,
  }
}

export function battleStarsEarned(correct) {
  return normalizeBattleStars(correct) * BATTLE_STAR_PER_CORRECT
}

export function isBattleThemeId(id) {
  return THEME_BY_ID.has(id)
}

export function unlockedBattleThemes(stars) {
  const total = normalizeBattleStars(stars)
  return BATTLE_THEMES.filter((theme) => total >= theme.unlockAt)
}

export function battleThemeById(id, stars = MAX_BATTLE_STARS) {
  const total = normalizeBattleStars(stars)
  const requested = THEME_BY_ID.get(id)
  if (requested && requested.unlockAt <= total) return requested
  return unlockedBattleThemes(total).at(-1) ?? BATTLE_THEMES[0]
}

export function nextBattleTheme(stars) {
  const total = normalizeBattleStars(stars)
  return BATTLE_THEMES.find((theme) => theme.unlockAt > total) ?? null
}

export function newlyUnlockedBattleThemes(before, after) {
  const start = normalizeBattleStars(before)
  const end = normalizeBattleStars(after)
  return BATTLE_THEMES.filter(
    (theme) => theme.unlockAt > start && theme.unlockAt <= end,
  )
}
