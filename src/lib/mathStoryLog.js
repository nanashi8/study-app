// 数学の歴史の話の学習記録。話を読んで図を動かしたら「理解した」「まだまだ」を押し、その日の日付と一緒に残す。
// 目次と話の末尾に、学習日と結果の履歴として出す。記録の形と決まりは文法の参考書と共通（studyLog.js）。
//
//   pageId: 話のID（mh-…）
import { appendStudyLog, latestStudyLog, normalizeStudyLog } from './studyLog.js'

const PAGE_ID = /^mh-[a-z0-9-]+$/

/** 端末の保存・進捗コード・クラウドから読んだ記録を、形の正しいものだけにそろえる。 */
export const normalizeMathStoryLog = (value) => normalizeStudyLog(value, PAGE_ID)

/** その日の結果を足す。同じ日の記録は置き換える。 */
export const appendMathStoryLog = (log, pageId, result, day) => appendStudyLog(log, pageId, result, day, PAGE_ID)

/** いちばん新しい結果が「理解した」の話。全教材の一覧・学習の記録では、これを学習を終えた話として数える。 */
export const understoodMathStories = (log) => Object.keys(log ?? {})
  .filter((pageId) => latestStudyLog(log, pageId)?.result === 'understood')

/** いちばん新しい結果が「まだまだ」の話。全教材の一覧・学習の記録では、復習中として数える。 */
export const notYetMathStories = (log) => Object.keys(log ?? {})
  .filter((pageId) => latestStudyLog(log, pageId)?.result === 'notYet')

/** 続きを読む話：いちばん新しく記録した話の次の、まだ記録のない話。記録が1つもなければ最初の話。 */
export function nextMathStory(chapters = [], log = {}) {
  let latestDay = -1
  let latestIndex = -1
  chapters.forEach((chapter, index) => {
    const latest = latestStudyLog(log, chapter.id)
    if (latest && (latest.day > latestDay || (latest.day === latestDay && index > latestIndex))) {
      latestDay = latest.day
      latestIndex = index
    }
  })
  const after = chapters.slice(latestIndex + 1).find((chapter) => !log?.[chapter.id]?.length)
  return after ?? chapters.find((chapter) => !log?.[chapter.id]?.length) ?? null
}
