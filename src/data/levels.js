// 英検の級メタdata。color は級ごとの識別色（難易度が上がるほど寒色→暖色）。
export const LEVELS = [
  { id: '5',    label: '5級',   sub: '中1程度',     cefr: 'A1',     color: '#10b981', emoji: '🌱' },
  { id: '4',    label: '4級',   sub: '中2程度',     cefr: 'A1',     color: '#14b8a6', emoji: '🍀' },
  { id: '3',    label: '3級',   sub: '中3程度',     cefr: 'A1–A2',  color: '#0ea5e9', emoji: '🐬' },
  { id: 'pre2', label: '準2級', sub: '高1・高2程度', cefr: 'A2–B1',  color: '#6366f1', emoji: '🚀' },
  { id: '2',    label: '2級',   sub: '高校卒業程度', cefr: 'B1–B2',  color: '#8b5cf6', emoji: '🔥' },
  { id: 'pre1', label: '準1級', sub: '大学中級程度', cefr: 'B2',     color: '#d946ef', emoji: '💎' },
  { id: '1',    label: '1級',   sub: '大学上級程度', cefr: 'C1',     color: '#f43f5e', emoji: '👑' },
]

// 準2級プラスは読解・リスニング教材で先行対応する。通常単語帳の7段階には混ぜず、
// 準2級・2級の既存語彙を横断して学べるようにする。
export const PRE2_PLUS_LEVEL = {
  id: 'pre2plus',
  label: '準2級プラス',
  sub: '高校上級程度',
  cefr: 'A2',
  color: '#2563eb',
  emoji: '📈',
}

export const READING_LEVELS = [
  ...LEVELS.slice(0, 4),
  PRE2_PLUS_LEVEL,
  ...LEVELS.slice(4),
]

export const LEVELS_BY_ID = Object.fromEntries(READING_LEVELS.map((l) => [l.id, l]))

export const getLevel = (id) => LEVELS_BY_ID[id] ?? LEVELS[0]
