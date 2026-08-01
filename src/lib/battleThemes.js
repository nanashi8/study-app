export const BATTLE_STAR_PER_CORRECT = 10
export const MAX_BATTLE_STARS = 9_999_999
export const BATTLE_XP_PER_EXCHANGE = 50
export const BATTLE_STARS_PER_EXCHANGE = 25

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
