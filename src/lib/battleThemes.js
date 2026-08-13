import { publicAssetUrl } from './publicAssetUrl.js'

export const BATTLE_STAR_PER_CORRECT = 10
export const MAX_BATTLE_STARS = 9_999_999

export const BATTLE_BARRIER_MAP_IMAGE = publicAssetUrl('/assets/battle/world/dragon-vein-district.webp')

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
  role: '龍脈観測拠点',
  emoji: '🏫',
  x: 50,
  y: 53,
  accent: '#fde68a',
  description: '先生と生徒が英語記憶の欠落を持ち寄り、五つの龍脈を観測する学校。',
}

// 背景画像のランドマーク位置に合わせた百分率座標。
// outer は外周、star は五芒星を描く順番として画面側で使う。
export const BATTLE_BARRIER_NODES = [
  {
    id: 'library',
    name: '図書館',
    role: '5級・記憶の頂点',
    emoji: '📚',
    x: 50,
    y: 17,
    accent: '#a78bfa',
    description: '如月先生と、英単語100語・熟語と構文100題を古い索引から復元する。',
  },
  {
    id: 'station',
    name: '駅前',
    role: '4級・交流の頂点',
    emoji: '🚉',
    x: 79,
    y: 29,
    accent: '#38bdf8',
    description: 'エレナ先生と、案内表示から消えた英語を100語・100題ずつ復元する。',
  },
  {
    id: 'central-park',
    name: '中央公園',
    role: '3級・生命の頂点',
    emoji: '🌳',
    x: 75,
    y: 76,
    accent: '#34d399',
    description: '森先生と、生き物や環境に残る英語の違和感を100語・100題ずつ調べる。',
  },
  {
    id: 'shrine',
    name: '神社',
    role: '準2級・継承の頂点',
    emoji: '⛩️',
    x: 25,
    y: 77,
    accent: '#fb7185',
    description: '榊先生と、古い奉納文へ紛れた英語を100語・100題ずつ読み解く。',
  },
  {
    id: 'stadium',
    name: '競技場',
    role: '2級・意志の頂点',
    emoji: '🏟️',
    x: 20,
    y: 32,
    accent: '#f59e0b',
    description: '風早先生と、記録や戦術から消えた英語を100語・100題ずつ再構成する。',
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

// 背景・生徒・対戦相手を別レイヤーで合成するための、人物なし背景プレート。
// 相手IDから決定的に1枚を選び、同じ対戦中に場所が切り替わらないようにする。
export const BATTLE_STAGE_BACKGROUNDS = Object.freeze([
  { id: 'music-room', name: '夕映え音楽室', location: 'school', image: publicAssetUrl('/assets/battle/stages/v2/music-room.webp') },
  { id: 'art-room', name: '放課後の美術室', location: 'school', image: publicAssetUrl('/assets/battle/stages/v2/art-room.webp') },
  { id: 'grand-library', name: '黄昏の大図書室', location: 'library', image: publicAssetUrl('/assets/battle/stages/v2/grand-library.webp') },
  { id: 'classroom', name: '夕方の教室', location: 'school', image: publicAssetUrl('/assets/battle/stages/v2/classroom.webp') },
  { id: 'science-lab', name: '理科実験室', location: 'school', image: publicAssetUrl('/assets/battle/stages/v2/science-lab.webp') },
  { id: 'school-rooftop', name: '校舎屋上', location: 'school', image: publicAssetUrl('/assets/battle/stages/v2/school-rooftop.webp') },
  { id: 'school-courtyard', name: '中央校庭', location: 'school', image: publicAssetUrl('/assets/battle/stages/v2/school-courtyard.webp') },
  { id: 'station-platform', name: '駅前ホーム', location: 'station', image: publicAssetUrl('/assets/battle/stages/v2/station-platform.webp') },
  { id: 'central-park', name: '中央公園', location: 'central-park', image: publicAssetUrl('/assets/battle/stages/v2/central-park.webp') },
  { id: 'shrine-forecourt', name: '神社境内', location: 'shrine', image: publicAssetUrl('/assets/battle/stages/v2/shrine-forecourt.webp') },
  { id: 'stadium-field', name: '競技場', location: 'stadium', image: publicAssetUrl('/assets/battle/stages/v2/stadium-field.webp') },
  { id: 'riverside-promenade', name: '川沿い遊歩道', location: 'town', image: publicAssetUrl('/assets/battle/stages/v2/riverside-promenade.webp') },
])

const BATTLE_STAGE_BY_ID = new Map(
  BATTLE_STAGE_BACKGROUNDS.map((stage) => [stage.id, stage]),
)

export function battleStageById(id) {
  return BATTLE_STAGE_BY_ID.get(id) ?? BATTLE_STAGE_BACKGROUNDS[0]
}

const BATTLE_STAGE_GROUP_POOLS = Object.freeze({
  humanities: ['grand-library', 'classroom', 'shrine-forecourt', 'station-platform', 'central-park', 'riverside-promenade'],
  stem: ['science-lab', 'school-rooftop', 'classroom', 'station-platform', 'stadium-field', 'school-courtyard'],
  arts: ['music-room', 'art-room', 'school-courtyard', 'central-park', 'stadium-field', 'grand-library'],
  campus: ['stadium-field', 'school-courtyard', 'school-rooftop', 'riverside-promenade', 'station-platform', 'central-park'],
  mystery: ['shrine-forecourt', 'grand-library', 'station-platform', 'central-park', 'riverside-promenade', 'science-lab'],
})

function battleStageHash(value) {
  let hash = 2166136261
  for (const char of String(value || 'school')) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function battleStageForEncounter(rivalId, groupId = 'campus') {
  const pool = BATTLE_STAGE_GROUP_POOLS[groupId]
    ?? BATTLE_STAGE_BACKGROUNDS.map((stage) => stage.id)
  const stageId = pool[battleStageHash(`${groupId}:${rivalId}`) % pool.length]
  return BATTLE_STAGE_BY_ID.get(stageId) ?? BATTLE_STAGE_BACKGROUNDS[0]
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
    preview: publicAssetUrl('/assets/battle/pixel/music-preview.webp'),
    stage: publicAssetUrl('/assets/battle/stages/v2/music-room.webp'),
    heroPortrait: publicAssetUrl('/assets/battle/pixel/music-hero.webp'),
    rivalPortrait: publicAssetUrl('/assets/battle/pixel/music-rival.webp'),
    actorsSheet: publicAssetUrl('/assets/battle/pixel/music-actors-v2.webp'),
    presentation: {
      layout: 'music-duel',
      modeLabel: 'SCORE DUEL',
      commandLabel: 'MELODY',
      prompt: '音符を選び、旋律をつなぐ',
      choiceGlyphs: ['𝄞', '♪', '𝄢'],
      unknownGlyph: '♩',
      turnGlyph: '♪',
      effectGlyphs: ['♪', '♫', '✦'],
    },
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
    name: '美術室タクティクス',
    shortName: '美術室',
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
    preview: publicAssetUrl('/assets/battle/pixel/art-preview.webp'),
    stage: publicAssetUrl('/assets/battle/stages/v2/art-room.webp'),
    heroPortrait: publicAssetUrl('/assets/battle/pixel/art-hero.webp'),
    rivalPortrait: publicAssetUrl('/assets/battle/pixel/art-rival.webp'),
    actorsSheet: publicAssetUrl('/assets/battle/pixel/art-actors-v2.webp'),
    presentation: {
      layout: 'art-grid',
      modeLabel: 'ART TACTICS',
      commandLabel: 'TOOLS',
      prompt: '画材カードを選び、盤面を進める',
      choiceGlyphs: ['✎', '▤', '▰'],
      unknownGlyph: '⌫',
      turnGlyph: '◆',
      effectGlyphs: ['✎', '◆', '✦'],
    },
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
    preview: publicAssetUrl('/assets/battle/pixel/library-preview.webp'),
    stage: publicAssetUrl('/assets/battle/stages/v2/grand-library.webp'),
    heroPortrait: publicAssetUrl('/assets/battle/pixel/library-hero.webp'),
    rivalPortrait: publicAssetUrl('/assets/battle/pixel/library-rival.webp'),
    actorsSheet: publicAssetUrl('/assets/battle/pixel/library-actors-v2.webp'),
    presentation: {
      layout: 'library-duel',
      modeLabel: 'ARCHIVE DUEL',
      commandLabel: 'FORMULA',
      prompt: '意味を見抜き、術式を完成させる',
      choiceGlyphs: ['＋', '−', '×'],
      unknownGlyph: '÷',
      turnGlyph: '◇',
      effectGlyphs: ['＋', '×', '✦'],
    },
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
