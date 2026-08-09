export const DRAGON_VEIN_TARGET = 100

export const DRAGON_VEIN_MAIN_NODE_IDS = Object.freeze([
  'library',
  'station',
  'central-park',
  'shrine',
  'stadium',
])

export const DRAGON_VEIN_NODES = Object.freeze([
  {
    id: 'library',
    name: '図書館',
    levelId: '5',
    levelLabel: '5級',
    emoji: '📚',
    accent: '#8b5cf6',
    stageId: 'grand-library',
    guideId: 'librarian-kisaragi',
    guideName: '如月 栞先生',
    guideRole: '司書教諭',
    fields: ['文学', '言語', '教育', '歴史'],
    clue: '書名から消えた英語を、語源と文脈から復元する。',
  },
  {
    id: 'station',
    name: '駅前',
    levelId: '4',
    levelLabel: '4級',
    emoji: '🚉',
    accent: '#0ea5e9',
    stageId: 'station-platform',
    guideId: 'international-elena',
    guideName: 'エレナ先生',
    guideRole: '国際交流教師',
    fields: ['交通', 'コミュニケーション', '地理', '社会'],
    clue: '案内表示の空白を、人と街の流れから読み解く。',
  },
  {
    id: 'central-park',
    name: '中央公園',
    levelId: '3',
    levelLabel: '3級',
    emoji: '🌳',
    accent: '#10b981',
    stageId: 'central-park',
    guideId: 'biology-mori',
    guideName: '森 葉子先生',
    guideRole: '生物教師',
    fields: ['自然', '環境', '科学', '医学', '心理'],
    clue: '植物と人の生命活動に残る“名前の欠落”を観察する。',
  },
  {
    id: 'shrine',
    name: '神社',
    levelId: 'pre2',
    levelLabel: '準2級',
    emoji: '⛩️',
    accent: '#f43f5e',
    stageId: 'shrine-forecourt',
    guideId: 'history-sakaki',
    guideName: '榊 時生先生',
    guideRole: '歴史教師',
    fields: ['歴史', '宗教', '芸術', '言語'],
    clue: '古い奉納文の中に紛れ込んだ英語の断片をつなぐ。',
  },
  {
    id: 'stadium',
    name: '競技場',
    levelId: '2',
    levelLabel: '2級',
    emoji: '🏟️',
    accent: '#f59e0b',
    stageId: 'stadium-field',
    guideId: 'track-hayate',
    guideName: '風早 颯先生',
    guideRole: '陸上部顧問',
    fields: ['スポーツ', '医学', '測定', '心理', '性質・状態'],
    clue: '消えた記録名と戦術語を、身体の感覚と数値から再構成する。',
  },
  {
    id: 'extra-archive',
    name: '中央校舎・龍脈記憶庫',
    levelId: '1',
    levelLabel: '1級 EXTRA',
    emoji: '👑',
    accent: '#d946ef',
    stageId: 'classroom',
    guideId: 'principal-albert',
    guideName: 'アルバート校長',
    guideRole: '校長・記憶保全責任者',
    fields: [],
    extra: true,
    clue: '五つの龍脈が揃ったときだけ開く、最後の記憶層。',
  },
])

const NODE_BY_ID = new Map(DRAGON_VEIN_NODES.map((node) => [node.id, node]))

export const DRAGON_VEIN_DAILY_DISTORTIONS = Object.freeze([
  { id: 'morning-broadcast', title: '朝の放送から消えた一語', place: '学校・放送室', stageId: 'classroom', guideId: 'english-kanda', levelId: '5', kind: 'vocab', fields: ['コミュニケーション', '教育'], summary: 'チャイム後のアナウンスに、誰も気づかない不自然な空白がある。' },
  { id: 'station-sign', title: '駅の案内板が読めない', place: '駅前', stageId: 'station-platform', guideId: 'international-elena', levelId: '4', kind: 'vocab', fields: ['交通', '地理'], summary: '日本語はあるのに、外国人が見ていた部分だけをみんな思い出せない。' },
  { id: 'science-label', title: '理科室のラベルの違和感', place: '理科室', stageId: 'science-lab', guideId: 'chemistry-shirabe', levelId: '3', kind: 'vocab', fields: ['科学', '測定'], summary: '器具名の一部が空白なのに、授業はそのまま進んでいる。' },
  { id: 'library-index', title: '検索索引の欠番', place: '図書館', stageId: 'grand-library', guideId: 'librarian-kisaragi', levelId: 'pre2', kind: 'phrase', summary: '本はそこにあるのに、検索用の言い回しだけが記憶から落ちている。' },
  { id: 'news-caption', title: 'ニュース速報の消えた表現', place: '放課後・街頭モニター', stageId: 'station-platform', guideId: 'social-takamine', levelId: '2', kind: 'phrase', summary: '速報の因果関係が一箇所だけつながらず、街の人は違和感すら抱かない。' },
  { id: 'club-score', title: '部活の指示から消えた表現', place: '音楽室', stageId: 'music-room', guideId: 'piano-ayane', levelId: '3', kind: 'phrase', summary: '楽譜の表現指示に空白があり、合奏の意図が揃わない。' },
  { id: 'lunch-menu', title: '食堂メニューの正体不明料理', place: '学校食堂', stageId: 'school-courtyard', guideId: 'international-elena', levelId: '5', kind: 'vocab', fields: ['料理', '食・生活'], summary: 'いつもの料理なのに、名前の由来だけがぽっかり消えている。' },
  { id: 'weather-app', title: '天気アプリの警報文', place: '通学路', stageId: 'riverside-promenade', guideId: 'astronomy-tsukishiro', levelId: '4', kind: 'phrase', summary: '雨雲は近づいているのに、注意を促す表現が理解されていない。' },
  { id: 'shop-poster', title: '商店街ポスターの空白', place: '駅前商店街', stageId: 'station-platform', guideId: 'design-maya', levelId: '3', kind: 'vocab', fields: ['ビジネス', '経済', '芸術'], summary: 'ロゴの下に不自然な空白があるが、店員は完成品だと思い込んでいる。' },
  { id: 'sports-record', title: '競技記録の項目消失', place: '競技場', stageId: 'stadium-field', guideId: 'track-hayate', levelId: '2', kind: 'vocab', fields: ['スポーツ', '測定'], summary: '数字だけが残り、何を測った記録なのか誰も説明できない。' },
  { id: 'old-plaque', title: '神社の古い案内板', place: '神社', stageId: 'shrine-forecourt', guideId: 'history-sakaki', levelId: 'pre2', kind: 'phrase', summary: '古い由緒と現代の案内をつなぐ表現だけが、誰の記憶にも残っていない。' },
  { id: 'class-handout', title: '授業プリントの暗号化', place: '教室', stageId: 'classroom', guideId: 'math-takagi', levelId: '4', kind: 'phrase', summary: '文のつながりが記号のように見え、先生にはかすかな既視感だけが残る。' },
])

export function dragonVeinNodeById(id) {
  return NODE_BY_ID.get(id) ?? DRAGON_VEIN_NODES[0]
}

const emptyTrack = () => ({ correct: 0, answered: 0, sessions: 0 })

export function createDragonVeinProgress() {
  return {
    version: 1,
    nodes: Object.fromEntries(DRAGON_VEIN_NODES.map((node) => [
      node.id,
      { vocab: emptyTrack(), phrase: emptyTrack() },
    ])),
    daily: { repairs: 0, correct: 0, answered: 0 },
    recentSessionIds: [],
  }
}

// 進捗コードでは、同じキー名や 0 が並ぶ通常オブジェクトを短い配列へ畳む。
// localStorage / cloud の形は読みやすい通常オブジェクトのまま保つ。
const DRAGON_VEIN_PORTABLE_MARKER = 'dv1'

export function compactDragonVeinProgress(value) {
  const progress = normalizeDragonVeinProgress(value)
  return [
    DRAGON_VEIN_PORTABLE_MARKER,
    ...DRAGON_VEIN_NODES.flatMap((node) => {
      const tracks = progress.nodes[node.id]
      return [
        tracks.vocab.correct,
        tracks.vocab.answered,
        tracks.vocab.sessions,
        tracks.phrase.correct,
        tracks.phrase.answered,
        tracks.phrase.sessions,
      ]
    }),
    progress.daily.repairs,
    progress.daily.correct,
    progress.daily.answered,
    progress.recentSessionIds,
  ]
}

export function expandDragonVeinProgress(value) {
  const expectedLength = 1 + DRAGON_VEIN_NODES.length * 6 + 3 + 1
  if (
    !Array.isArray(value)
    || value[0] !== DRAGON_VEIN_PORTABLE_MARKER
    || value.length !== expectedLength
  ) return value

  const progress = createDragonVeinProgress()
  let offset = 1
  for (const node of DRAGON_VEIN_NODES) {
    progress.nodes[node.id] = {
      vocab: {
        correct: value[offset],
        answered: value[offset + 1],
        sessions: value[offset + 2],
      },
      phrase: {
        correct: value[offset + 3],
        answered: value[offset + 4],
        sessions: value[offset + 5],
      },
    }
    offset += 6
  }
  progress.daily = {
    repairs: value[offset],
    correct: value[offset + 1],
    answered: value[offset + 2],
  }
  progress.recentSessionIds = value[offset + 3]
  return progress
}

const safeCount = (value, max = Number.MAX_SAFE_INTEGER) => (
  Math.min(max, Math.max(0, Math.floor(Number(value) || 0)))
)

function normalizeTrack(track) {
  const answered = safeCount(track?.answered)
  return {
    correct: Math.min(answered, safeCount(track?.correct, DRAGON_VEIN_TARGET)),
    answered,
    sessions: safeCount(track?.sessions),
  }
}

export function normalizeDragonVeinProgress(value) {
  const base = createDragonVeinProgress()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return base
  for (const node of DRAGON_VEIN_NODES) {
    base.nodes[node.id] = {
      vocab: normalizeTrack(value.nodes?.[node.id]?.vocab),
      phrase: normalizeTrack(value.nodes?.[node.id]?.phrase),
    }
  }
  base.daily = {
    repairs: safeCount(value.daily?.repairs),
    correct: safeCount(value.daily?.correct),
    answered: safeCount(value.daily?.answered),
  }
  base.recentSessionIds = [...new Set(
    (Array.isArray(value.recentSessionIds) ? value.recentSessionIds : [])
      .filter((id) => typeof id === 'string' && id.length > 0 && id.length <= 120),
  )].slice(0, 40)
  return base
}

export function isValidDragonVeinProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const normalized = normalizeDragonVeinProgress(value)
  return JSON.stringify(normalized) === JSON.stringify(value)
}

export function dragonVeinTrack(progress, nodeId, kind) {
  const normalized = normalizeDragonVeinProgress(progress)
  return normalized.nodes[dragonVeinNodeById(nodeId).id]?.[kind === 'phrase' ? 'phrase' : 'vocab']
}

export function dragonVeinNodeStatus(progress, nodeId) {
  const node = dragonVeinNodeById(nodeId)
  const normalized = normalizeDragonVeinProgress(progress)
  const tracks = normalized.nodes[node.id]
  const vocabDone = tracks.vocab.correct >= DRAGON_VEIN_TARGET
  const phraseDone = tracks.phrase.correct >= DRAGON_VEIN_TARGET
  return {
    node,
    vocab: tracks.vocab,
    phrase: tracks.phrase,
    vocabDone,
    phraseDone,
    complete: vocabDone && phraseDone,
    restored: tracks.vocab.correct + tracks.phrase.correct,
    target: DRAGON_VEIN_TARGET * 2,
  }
}

export function dragonVeinMainComplete(progress) {
  return DRAGON_VEIN_MAIN_NODE_IDS.every((id) => dragonVeinNodeStatus(progress, id).complete)
}

export function dragonVeinSummary(progress) {
  const main = DRAGON_VEIN_MAIN_NODE_IDS.map((id) => dragonVeinNodeStatus(progress, id))
  const restored = main.reduce((sum, status) => sum + status.restored, 0)
  return {
    restored,
    target: DRAGON_VEIN_MAIN_NODE_IDS.length * DRAGON_VEIN_TARGET * 2,
    completeNodes: main.filter((status) => status.complete).length,
    totalNodes: main.length,
    extraUnlocked: main.every((status) => status.complete),
  }
}

export function recordDragonVeinResult(progress, source, { correct = 0, answered = 0 } = {}) {
  const normalized = normalizeDragonVeinProgress(progress)
  const safeAnswered = safeCount(answered)
  const safeCorrect = Math.min(safeAnswered, safeCount(correct))
  if (source?.isDaily) {
    normalized.daily.repairs += 1
    normalized.daily.correct += safeCorrect
    normalized.daily.answered += safeAnswered
    return normalized
  }
  const node = dragonVeinNodeById(source?.locationId)
  if (node.extra && !dragonVeinMainComplete(normalized)) return normalized
  const kind = source?.restorationKind === 'phrase' ? 'phrase' : 'vocab'
  const track = normalized.nodes[node.id][kind]
  track.correct = Math.min(DRAGON_VEIN_TARGET, track.correct + safeCorrect)
  track.answered += safeAnswered
  track.sessions += 1
  return normalized
}

export function isDragonVeinSource(source) {
  return ['dragonVein', 'dragonVeinPhrase', 'battle'].includes(source?.type)
    || source?.gameMode === 'dragonVein'
}

export function dragonVeinSourceKind(source) {
  return source?.type === 'dragonVeinPhrase' || source?.restorationKind === 'phrase'
    ? 'phrase'
    : 'vocab'
}

export function dragonVeinExpression({ answered = false, lastAnswer = null, streak = 0, wrongStreak = 0 } = {}) {
  if (!answered) return streak >= 2 ? 'focused' : 'thinking'
  if (lastAnswer === 'correct') {
    if (streak >= 5) return 'delighted'
    if (streak >= 3) return 'confident'
    return 'relieved'
  }
  if (lastAnswer === 'unknown' || wrongStreak >= 3) return 'thinking'
  if (wrongStreak >= 2) return 'hurt'
  return 'worried'
}

export function dailyDistortionForDay(day = 0) {
  const index = Math.abs(Math.floor(Number(day) || 0)) % DRAGON_VEIN_DAILY_DISTORTIONS.length
  return DRAGON_VEIN_DAILY_DISTORTIONS[index]
}

export function dragonVeinSessionSource(nodeId, kind = 'vocab', extras = {}) {
  const node = dragonVeinNodeById(nodeId)
  const phrase = kind === 'phrase'
  return {
    type: phrase ? 'dragonVeinPhrase' : 'dragonVein',
    gameMode: 'dragonVein',
    restorationKind: phrase ? 'phrase' : 'vocab',
    locationId: node.id,
    levelId: node.levelId,
    guideId: node.guideId,
    fields: node.fields,
    stageId: node.stageId,
    ...extras,
  }
}
