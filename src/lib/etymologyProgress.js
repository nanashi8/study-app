export const ETYMOLOGY_MASTER_BOX = 4
export const ETYMOLOGY_SESSION_SIZE = 10

export const ETYMOLOGY_STATUS_META = {
  all: { label: 'すべて', short: '全件' },
  unstarted: { label: '未着手', short: '未着手' },
  learning: { label: '学習中', short: '学習中' },
  mastered: { label: '習得', short: '習得' },
  due: { label: '復習待ち', short: '復習' },
}

const localDay = () =>
  Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000)

const boxOf = (entry) =>
  Math.max(0, Math.floor(Number(entry?.box) || 0))

export function etymologyKnowledgeStatus(entry) {
  if (!entry) return 'unstarted'
  return boxOf(entry) >= ETYMOLOGY_MASTER_BOX ? 'mastered' : 'learning'
}

export function isEtymologyDue(entry, day = localDay()) {
  return Boolean(entry && Number.isFinite(entry.due) && entry.due <= day)
}

export function etymologyProgress(packs = [], etymologySrs = {}, day = localDay()) {
  const result = {
    total: packs.length,
    started: 0,
    unstarted: 0,
    learning: 0,
    mastered: 0,
    due: 0,
    points: 0,
    ratio: 0,
  }

  for (const pack of packs) {
    const entry = etymologySrs[pack.id]
    const status = etymologyKnowledgeStatus(entry)
    result[status] += 1
    if (entry) result.started += 1
    if (isEtymologyDue(entry, day)) result.due += 1
    result.points += Math.min(boxOf(entry), ETYMOLOGY_MASTER_BOX)
  }

  result.ratio = result.total
    ? result.points / (result.total * ETYMOLOGY_MASTER_BOX)
    : 0
  return result
}

export function filterEtymologyPacks(
  packs = [],
  etymologySrs = {},
  { mode = 'all', status = 'all', day = localDay(), packIds } = {},
) {
  const ids = Array.isArray(packIds) && packIds.length
    ? new Set(packIds)
    : null

  return packs.filter((pack) => {
    if (ids && !ids.has(pack.id)) return false
    if (mode !== 'all' && pack.mode !== mode) return false
    if (status === 'all' || status === 'priority') return true
    const entry = etymologySrs[pack.id]
    if (status === 'due') return isEtymologyDue(entry, day)
    return etymologyKnowledgeStatus(entry) === status
  })
}

const comparePriority = (a, b, etymologySrs, day) => {
  const aEntry = etymologySrs[a.pack.id]
  const bEntry = etymologySrs[b.pack.id]
  const rank = (entry) => {
    if (isEtymologyDue(entry, day)) return 0
    if (!entry) return 1
    if (boxOf(entry) < ETYMOLOGY_MASTER_BOX) return 2
    return 3
  }
  const rankDiff = rank(aEntry) - rank(bEntry)
  if (rankDiff) return rankDiff

  if (isEtymologyDue(aEntry, day) && isEtymologyDue(bEntry, day)) {
    const dueDiff = (aEntry.due ?? day) - (bEntry.due ?? day)
    if (dueDiff) return dueDiff
  }
  const boxDiff = boxOf(aEntry) - boxOf(bEntry)
  return boxDiff || a.index - b.index
}

export function buildEtymologyDeck(
  packs = [],
  etymologySrs = {},
  {
    mode = 'all',
    status = 'priority',
    day = localDay(),
    packIds,
    size = ETYMOLOGY_SESSION_SIZE,
  } = {},
) {
  const filtered = filterEtymologyPacks(packs, etymologySrs, {
    mode,
    status,
    day,
    packIds,
  })
  const ordered = filtered
    .map((pack, index) => ({ pack, index }))
    .sort((a, b) => comparePriority(a, b, etymologySrs, day))
    .map(({ pack }) => pack)
  const limit = Math.max(1, Math.floor(Number(size) || ETYMOLOGY_SESSION_SIZE))
  return ordered.slice(0, limit)
}
