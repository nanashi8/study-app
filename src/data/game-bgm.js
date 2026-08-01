// 放課後バトル専用のオリジナルBGM設計。
// 外部の楽曲・録音・サンプルは使わず、Web Audioで決定論的に演奏する。
// 1曲は4小節単位で約3分になるように小節数を決め、終端から先頭へ循環する。

export const GAME_BGM_TARGET_SECONDS = 180
export const GAME_BGM_STEPS_PER_BAR = 16

const freezeList = (items) => Object.freeze([...items])

function barsNearThreeMinutes(tempo) {
  const exactBars = (GAME_BGM_TARGET_SECONDS * tempo) / 240
  return Math.max(64, Math.round(exactBars / 4) * 4)
}

function track(spec) {
  const bars = barsNearThreeMinutes(spec.tempo)
  return Object.freeze({
    ...spec,
    bars,
    beatsPerBar: 4,
    stepsPerBar: GAME_BGM_STEPS_PER_BAR,
    durationSeconds: Number(((bars * 240) / spec.tempo).toFixed(3)),
    progression: freezeList(spec.progression),
    motif: freezeList(spec.motif),
    license: 'original-procedural',
  })
}

const DAILY_TRACKS = [
  {
    id: 'daily-morning',
    title: '朝の一ページ',
    category: 'daily',
    contextId: 'morning',
    tempo: 92,
    rootMidi: 60,
    mode: 'major',
    progression: [0, 4, 5, 3],
    motif: [0, 2, 4, 7, 4, 2, 1, null, 2, 4, 5, 4, 2, 1, 0, null],
    lead: 'bell',
    pad: 'warm',
    bass: 'round',
    drums: 'brush',
    ornament: 'sparkle',
    energy: 0.34,
    swing: 0.05,
    seed: 101,
  },
  {
    id: 'daily-commute',
    title: '雨粒の通学路',
    category: 'daily',
    contextId: 'commute',
    tempo: 100,
    rootMidi: 62,
    mode: 'major',
    progression: [0, 5, 3, 4],
    motif: [0, null, 2, 4, 5, 4, 2, null, 1, 2, 4, 6, 5, 4, 2, null],
    lead: 'glass',
    pad: 'air',
    bass: 'round',
    drums: 'soft',
    ornament: 'droplets',
    energy: 0.4,
    swing: 0.08,
    seed: 113,
  },
  {
    id: 'daily-classroom',
    title: 'チョークのひらめき',
    category: 'daily',
    contextId: 'classroom',
    tempo: 108,
    rootMidi: 67,
    mode: 'major',
    progression: [0, 3, 4, 0],
    motif: [0, 2, 4, null, 4, 5, 7, null, 6, 5, 4, 2, 3, 2, 0, null],
    lead: 'pluck',
    pad: 'warm',
    bass: 'pluck',
    drums: 'pop',
    ornament: 'counter',
    energy: 0.47,
    swing: 0.02,
    seed: 127,
  },
  {
    id: 'daily-everyday',
    title: '木陰のランチタイム',
    category: 'daily',
    contextId: 'everyday',
    tempo: 96,
    rootMidi: 65,
    mode: 'mixolydian',
    progression: [0, 4, 5, 4],
    motif: [4, 2, 0, null, 1, 2, 4, null, 5, 4, 2, 1, 0, null, 2, null],
    lead: 'triangle',
    pad: 'warm',
    bass: 'round',
    drums: 'lofi',
    ornament: 'none',
    energy: 0.32,
    swing: 0.14,
    seed: 139,
  },
  {
    id: 'daily-park',
    title: 'カードを囲む木漏れ日',
    category: 'daily',
    contextId: 'park',
    tempo: 90,
    rootMidi: 62,
    mode: 'mixolydian',
    progression: [0, 3, 4, 5],
    motif: [0, 2, null, 4, 5, 4, 2, null, 3, 5, 7, 5, 4, 2, 0, null],
    lead: 'reed',
    pad: 'air',
    bass: 'round',
    drums: 'brush',
    ornament: 'pages',
    energy: 0.3,
    swing: 0.12,
    seed: 149,
  },
  {
    id: 'daily-club',
    title: '放課後アンサンブル',
    category: 'daily',
    contextId: 'club',
    tempo: 112,
    rootMidi: 64,
    mode: 'major',
    progression: [0, 5, 3, 4],
    motif: [0, 2, 4, 5, 7, null, 5, 4, 2, 4, 6, 7, 9, 7, 5, null],
    lead: 'pulse',
    pad: 'strings',
    bass: 'pluck',
    drums: 'pop',
    ornament: 'counter',
    energy: 0.56,
    swing: 0.03,
    seed: 151,
  },
  {
    id: 'daily-cafe',
    title: '地図をひらくカフェ',
    category: 'daily',
    contextId: 'cafe',
    tempo: 106,
    rootMidi: 61,
    mode: 'dorian',
    progression: [0, 4, 3, 5],
    motif: [0, 3, 5, null, 4, 2, 1, null, 2, 4, 6, 5, 3, 1, 0, null],
    lead: 'triangle',
    pad: 'warm',
    bass: 'pluck',
    drums: 'lofi',
    ornament: 'droplets',
    energy: 0.39,
    swing: 0.16,
    seed: 157,
  },
  {
    id: 'daily-snack',
    title: '揚げたて夕焼け',
    category: 'daily',
    contextId: 'snack',
    tempo: 104,
    rootMidi: 69,
    mode: 'major',
    progression: [0, 3, 5, 4],
    motif: [0, 4, 2, 5, 4, 2, 1, null, 0, 2, 4, 7, 5, 4, 2, null],
    lead: 'reed',
    pad: 'warm',
    bass: 'round',
    drums: 'brush',
    ornament: 'sparkle',
    energy: 0.43,
    swing: 0.11,
    seed: 163,
  },
  {
    id: 'daily-shopping',
    title: '文具店パレード',
    category: 'daily',
    contextId: 'shopping',
    tempo: 120,
    rootMidi: 58,
    mode: 'major',
    progression: [0, 4, 1, 5],
    motif: [0, 2, 4, 2, 5, 4, 7, null, 6, 4, 2, 1, 2, 4, 0, null],
    lead: 'square',
    pad: 'air',
    bass: 'pluck',
    drums: 'pop',
    ornament: 'sparkle',
    energy: 0.58,
    swing: 0.04,
    seed: 179,
  },
  {
    id: 'daily-library',
    title: '琥珀色の図書館',
    category: 'daily',
    contextId: 'library',
    tempo: 84,
    rootMidi: 64,
    mode: 'dorian',
    progression: [0, 3, 5, 4],
    motif: [0, null, 2, 3, 5, null, 4, 2, 1, null, 3, 5, 7, 5, 3, null],
    lead: 'bell',
    pad: 'choir',
    bass: 'round',
    drums: 'none',
    ornament: 'pages',
    energy: 0.27,
    swing: 0.02,
    seed: 191,
  },
  {
    id: 'daily-arcade',
    title: '四拍先のハイスコア',
    category: 'daily',
    contextId: 'arcade',
    tempo: 132,
    rootMidi: 65,
    mode: 'major',
    progression: [0, 5, 4, 3],
    motif: [0, 4, 7, 9, 7, 5, 4, 2, 5, 7, 11, 9, 7, 4, 2, null],
    lead: 'pulse',
    pad: 'air',
    bass: 'pulse',
    drums: 'electro',
    ornament: 'arp',
    energy: 0.72,
    swing: 0,
    seed: 199,
  },
  {
    id: 'daily-homeward',
    title: '明日へつづく川沿い',
    category: 'daily',
    contextId: 'homeward',
    tempo: 88,
    rootMidi: 57,
    mode: 'major',
    progression: [0, 5, 3, 4],
    motif: [0, 2, 4, null, 7, 5, 4, null, 2, 1, 0, null, 1, 2, 0, null],
    lead: 'triangle',
    pad: 'strings',
    bass: 'round',
    drums: 'soft',
    ornament: 'counter',
    energy: 0.31,
    swing: 0.06,
    seed: 211,
  },
]

const RANK_TRACKS = [
  {
    id: 'rank-5', title: 'ノートをひらく初陣', category: 'rank', contextId: '5',
    tempo: 116, rootMidi: 60, mode: 'major', progression: [0, 4, 5, 3],
    motif: [0, 2, 4, 7, 5, 4, 2, null, 0, 4, 5, 7, 9, 7, 5, null],
    lead: 'square', pad: 'warm', bass: 'pulse', drums: 'electro', ornament: 'arp',
    energy: 0.58, swing: 0.02, seed: 223,
  },
  {
    id: 'rank-4', title: '緑の廊下を駆けて', category: 'rank', contextId: '4',
    tempo: 120, rootMidi: 62, mode: 'mixolydian', progression: [0, 5, 3, 4],
    motif: [0, 2, 3, 5, 7, 5, 3, 2, 0, 3, 5, 8, 7, 5, 3, null],
    lead: 'pulse', pad: 'air', bass: 'pluck', drums: 'electro', ornament: 'counter',
    energy: 0.64, swing: 0.03, seed: 239,
  },
  {
    id: 'rank-3', title: '青いベルの挑戦状', category: 'rank', contextId: '3',
    tempo: 124, rootMidi: 64, mode: 'dorian', progression: [0, 3, 5, 4],
    motif: [0, 3, 5, 7, 8, 7, 5, 3, 2, 5, 7, 9, 8, 7, 5, null],
    lead: 'saw', pad: 'strings', bass: 'pulse', drums: 'rock', ornament: 'arp',
    energy: 0.7, swing: 0.01, seed: 251,
  },
  {
    id: 'rank-pre2', title: '文法ロケット・ラン', category: 'rank', contextId: 'pre2',
    tempo: 128, rootMidi: 66, mode: 'minor', progression: [0, 5, 2, 6],
    motif: [0, 2, 3, 7, 5, 3, 2, 0, 4, 5, 7, 10, 8, 7, 5, null],
    lead: 'saw', pad: 'air', bass: 'pulse', drums: 'rock', ornament: 'arp',
    energy: 0.76, swing: 0, seed: 269,
  },
  {
    id: 'rank-2', title: '紫炎の語彙試練', category: 'rank', contextId: '2',
    tempo: 132, rootMidi: 67, mode: 'minor', progression: [0, 5, 3, 6],
    motif: [0, 3, 5, 7, 10, 8, 7, 5, 3, 6, 8, 12, 10, 8, 7, null],
    lead: 'brass', pad: 'strings', bass: 'deep', drums: 'rock', ornament: 'counter',
    energy: 0.82, swing: 0.01, seed: 281,
  },
  {
    id: 'rank-pre1', title: 'ダイヤモンド構文嵐', category: 'rank', contextId: 'pre1',
    tempo: 136, rootMidi: 61, mode: 'harmonicMinor', progression: [0, 3, 6, 4],
    motif: [0, 2, 3, 7, 11, 10, 7, 5, 3, 6, 8, 11, 14, 11, 8, null],
    lead: 'saw', pad: 'choir', bass: 'deep', drums: 'cinematic', ornament: 'arp',
    energy: 0.89, swing: 0, seed: 293,
  },
  {
    id: 'rank-1', title: '千のことばの王冠', category: 'rank', contextId: '1',
    tempo: 144, rootMidi: 62, mode: 'harmonicMinor', progression: [0, 5, 3, 6],
    motif: [0, 3, 7, 11, 14, 12, 10, 7, 5, 8, 11, 15, 14, 11, 8, null],
    lead: 'brass', pad: 'choir', bass: 'deep', drums: 'cinematic', ornament: 'counter',
    energy: 0.96, swing: 0, seed: 307,
  },
]

const BOSS_TRACKS = [
  {
    id: 'boss-grass-wolf', title: 'チョーク・スナイプ小テスト', category: 'boss', contextId: 'grass-wolf',
    tempo: 128, rootMidi: 60, mode: 'minor', progression: [0, 5, 3, 4],
    motif: [7, 7, 5, 3, 2, 3, 5, null, 8, 7, 5, 3, 5, 7, 10, null],
    lead: 'square', pad: 'warm', bass: 'pulse', drums: 'pop', ornament: 'counter',
    energy: 0.78, swing: 0.03, seed: 317,
  },
  {
    id: 'boss-forest-keeper', title: '黒板消しと五七五', category: 'boss', contextId: 'forest-keeper',
    tempo: 112, rootMidi: 62, mode: 'pentatonic', progression: [0, 3, 1, 4],
    motif: [0, null, 2, 4, 7, null, 4, 2, 0, 2, 4, null, 9, 7, 4, null],
    lead: 'reed', pad: 'air', bass: 'round', drums: 'wood', ornament: 'pages',
    energy: 0.67, swing: 0.08, seed: 331,
  },
  {
    id: 'boss-chronos', title: '巨大コンパスの時計仕掛け', category: 'boss', contextId: 'chronos',
    tempo: 132, rootMidi: 64, mode: 'minor', progression: [0, 4, 2, 5],
    motif: [0, 3, 7, 10, 7, 3, 0, 3, 5, 8, 12, 8, 5, 3, 2, null],
    lead: 'pulse', pad: 'organ', bass: 'pulse', drums: 'clockwork', ornament: 'arp',
    energy: 0.84, swing: 0, seed: 347,
  },
  {
    id: 'boss-leviathan', title: '地球儀スピン・ボヤージュ', category: 'boss', contextId: 'leviathan',
    tempo: 124, rootMidi: 67, mode: 'dorian', progression: [0, 5, 3, 4],
    motif: [0, 2, 5, 7, 9, 7, 5, 2, 3, 5, 8, 10, 8, 5, 3, null],
    lead: 'reed', pad: 'strings', bass: 'round', drums: 'world', ornament: 'counter',
    energy: 0.77, swing: 0.06, seed: 359,
  },
  {
    id: 'boss-librarian', title: 'ビーカー・バブル反応式', category: 'boss', contextId: 'librarian',
    tempo: 130, rootMidi: 59, mode: 'minor', progression: [0, 2, 5, 4],
    motif: [0, 2, 3, 7, 8, 10, 8, 7, 5, 3, 6, 10, 12, 10, 8, null],
    lead: 'glass', pad: 'air', bass: 'pulse', drums: 'electro', ornament: 'droplets',
    energy: 0.8, swing: 0.01, seed: 373,
  },
  {
    id: 'boss-silent-dragon', title: '音叉レゾナンス', category: 'boss', contextId: 'silent-dragon',
    tempo: 120, rootMidi: 57, mode: 'harmonicMinor', progression: [0, 3, 4, 6],
    motif: [0, 7, 4, 11, 7, 14, 11, 7, 5, 12, 8, 5, 3, 10, 7, null],
    lead: 'bell', pad: 'organ', bass: 'deep', drums: 'cinematic', ornament: 'counter',
    energy: 0.82, swing: 0, seed: 389,
  },
  {
    id: 'boss-tempest', title: 'ホイッスル・スプリント決勝', category: 'boss', contextId: 'tempest',
    tempo: 144, rootMidi: 64, mode: 'dorian', progression: [0, 3, 5, 4],
    motif: [0, 2, 3, 5, 7, 10, 8, 7, 5, 7, 10, 12, 14, 12, 10, null],
    lead: 'brass', pad: 'strings', bass: 'pulse', drums: 'sports', ornament: 'arp',
    energy: 0.94, swing: 0, seed: 401,
  },
  {
    id: 'boss-nameless-king', title: '工作台リビルド', category: 'boss', contextId: 'nameless-king',
    tempo: 134, rootMidi: 65, mode: 'minor', progression: [0, 6, 3, 4],
    motif: [0, 3, 7, 5, 2, 5, 8, 7, 3, 6, 10, 8, 5, 3, 2, null],
    lead: 'saw', pad: 'organ', bass: 'deep', drums: 'industrial', ornament: 'arp',
    energy: 0.86, swing: 0.01, seed: 419,
  },
  {
    id: 'boss-archive-angel', title: '絵の具スプラッシュ狂詩曲', category: 'boss', contextId: 'archive-angel',
    tempo: 126, rootMidi: 60, mode: 'lydian', progression: [0, 1, 4, 3],
    motif: [0, 4, 6, 9, 7, 6, 4, 2, 3, 6, 8, 11, 9, 8, 6, null],
    lead: 'glass', pad: 'choir', bass: 'round', drums: 'world', ornament: 'sparkle',
    energy: 0.79, swing: 0.05, seed: 431,
  },
  {
    id: 'boss-word-emperor', title: '出席簿プレス行進曲', category: 'boss', contextId: 'word-emperor',
    tempo: 138, rootMidi: 67, mode: 'minor', progression: [0, 4, 5, 3],
    motif: [0, 0, 3, 5, 7, 7, 5, 3, 2, 2, 5, 8, 10, 8, 7, null],
    lead: 'brass', pad: 'strings', bass: 'deep', drums: 'march', ornament: 'counter',
    energy: 0.91, swing: 0, seed: 443,
  },
  {
    id: 'boss-endless-book', title: '短く一言、卒業試験', category: 'boss', contextId: 'endless-book',
    tempo: 146, rootMidi: 62, mode: 'harmonicMinor', progression: [0, 5, 3, 6],
    motif: [0, 3, 7, 11, 14, 15, 14, 11, 8, 12, 15, 18, 17, 14, 11, null],
    lead: 'brass', pad: 'choir', bass: 'deep', drums: 'cinematic', ornament: 'counter',
    energy: 1, swing: 0, seed: 457,
  },
]

const RESULT_TRACKS = [
  {
    id: 'result-victory', title: '特大の花まる', category: 'result', contextId: 'victory',
    tempo: 120, rootMidi: 60, mode: 'major', progression: [0, 3, 4, 0],
    motif: [0, 4, 7, 9, 11, 9, 7, 4, 5, 7, 9, 12, 11, 9, 7, null],
    lead: 'brass', pad: 'strings', bass: 'round', drums: 'pop', ornament: 'sparkle',
    energy: 0.72, swing: 0.02, seed: 467,
  },
  {
    id: 'result-draw', title: 'あと一ページ', category: 'result', contextId: 'draw',
    tempo: 96, rootMidi: 57, mode: 'dorian', progression: [0, 3, 5, 4],
    motif: [0, 2, 3, null, 5, 3, 2, null, 0, 3, 5, 7, 5, 3, 2, null],
    lead: 'triangle', pad: 'warm', bass: 'round', drums: 'soft', ornament: 'counter',
    energy: 0.38, swing: 0.07, seed: 479,
  },
  {
    id: 'result-retreat', title: '明日の作戦ノート', category: 'result', contextId: 'retreat',
    tempo: 86, rootMidi: 65, mode: 'major', progression: [0, 5, 3, 4],
    motif: [0, null, 2, 4, 2, null, 1, 0, 2, null, 4, 5, 4, 2, 1, null],
    lead: 'bell', pad: 'air', bass: 'round', drums: 'none', ornament: 'pages',
    energy: 0.25, swing: 0.04, seed: 487,
  },
]

export const GAME_BGM_TRACKS = Object.freeze(
  [...DAILY_TRACKS, ...RANK_TRACKS, ...BOSS_TRACKS, ...RESULT_TRACKS].map(track),
)

export const GAME_BGM_TRACK_BY_ID = new Map(
  GAME_BGM_TRACKS.map((item) => [item.id, item]),
)

const byContext = (category) => new Map(
  GAME_BGM_TRACKS
    .filter((item) => item.category === category)
    .map((item) => [item.contextId, item]),
)

export const DAILY_BGM_BY_SCENE_ID = byContext('daily')
export const RANK_BGM_BY_LEVEL_ID = byContext('rank')
export const BOSS_BGM_BY_ENEMY_ID = byContext('boss')
export const RESULT_BGM_BY_VERDICT_ID = byContext('result')

export function gameBgmTrackById(id) {
  return GAME_BGM_TRACK_BY_ID.get(id) ?? null
}

export function dailyBgmTrack(sceneId) {
  return DAILY_BGM_BY_SCENE_ID.get(sceneId) ?? GAME_BGM_TRACK_BY_ID.get('daily-morning')
}

export function rankBgmTrack(levelId) {
  return RANK_BGM_BY_LEVEL_ID.get(String(levelId)) ?? GAME_BGM_TRACK_BY_ID.get('rank-5')
}

export function bossBgmTrack(enemyId) {
  return BOSS_BGM_BY_ENEMY_ID.get(enemyId) ?? null
}

export function resultBgmTrack(verdictId) {
  const normalized = verdictId === 'legendary' ? 'victory' : verdictId
  return RESULT_BGM_BY_VERDICT_ID.get(normalized) ?? GAME_BGM_TRACK_BY_ID.get('result-retreat')
}
