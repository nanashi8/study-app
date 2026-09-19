// 文法の参考書の学習記録。ページを読み終えたら「理解した」「まだまだ」を押し、その日の日付と一緒に残す。
// 目次・級をまたいだ一覧・ページの末尾に、学習日と結果の履歴として出す。
//
//   log   : { [pageId]: [{ day, result }, ...] }  古い順。1日1件（同じ日に押し直したら置き換える）
//   pageId: 単元は参考書の単元ID（gref_…）、級をまたいだ系統は gstrand_<系統ID>
//   day   : 端末の日付の日番号（todayIndex と同じ数え方）

const DAY_MS = 86400000
export const GRAMMAR_REFERENCE_LOG_LIMIT = 20

export const GRAMMAR_REFERENCE_RESULTS = Object.freeze({
  understood: Object.freeze({ label: '理解した', color: '#059669' }),
  notYet: Object.freeze({ label: 'まだまだ', color: '#d97706' }),
})

export const strandReferencePageId = (strandId) => `gstrand_${strandId}`

const PAGE_ID = /^g(?:ref|strand)_[\w-]+$/
const isResult = (result) => Object.hasOwn(GRAMMAR_REFERENCE_RESULTS, result)
const isEntry = (entry) => Boolean(entry)
  && Number.isSafeInteger(entry.day)
  && entry.day >= 0
  && isResult(entry.result)

/** 端末の保存・進捗コード・クラウドから読んだ記録を、形の正しいものだけにそろえる。 */
export function normalizeGrammarReferenceLog(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const log = {}
  for (const [pageId, entries] of Object.entries(value)) {
    if (!PAGE_ID.test(pageId) || !Array.isArray(entries)) continue
    const byDay = new Map()
    for (const entry of entries) {
      if (isEntry(entry)) byDay.set(entry.day, { day: entry.day, result: entry.result })
    }
    const list = [...byDay.values()]
      .sort((a, b) => a.day - b.day)
      .slice(-GRAMMAR_REFERENCE_LOG_LIMIT)
    if (list.length) log[pageId] = list
  }
  return log
}

/** その日の結果を足す。同じ日の記録は置き換える。 */
export function appendGrammarReferenceLog(log, pageId, result, day) {
  const current = log ?? {}
  if (!PAGE_ID.test(pageId) || !isResult(result) || !Number.isSafeInteger(day) || day < 0) return current
  const entries = (current[pageId] ?? []).filter((entry) => entry.day !== day)
  return {
    ...current,
    [pageId]: [...entries, { day, result }]
      .sort((a, b) => a.day - b.day)
      .slice(-GRAMMAR_REFERENCE_LOG_LIMIT),
  }
}

/** 新しい順の履歴。 */
export const grammarReferenceHistory = (log, pageId) => [...(log?.[pageId] ?? [])].reverse()

/** いちばん新しい記録（無ければ null）。 */
export const latestGrammarReference = (log, pageId) => log?.[pageId]?.at(-1) ?? null

/** ページの集まりを、いちばん新しい結果で「理解した／まだまだ／未学習」に数える。 */
export function grammarReferenceStatusCounts(log, pageIds = []) {
  const counts = { understood: 0, notYet: 0, unstudied: 0 }
  for (const pageId of pageIds) {
    counts[latestGrammarReference(log, pageId)?.result ?? 'unstudied'] += 1
  }
  return counts
}

/** 日番号を「9/19」の形にする。 */
export function formatStudyDay(day) {
  const date = new Date(day * DAY_MS)
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`
}
