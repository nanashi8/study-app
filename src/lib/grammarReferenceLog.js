// 文法の参考書の学習記録。ページを読み終えたら「理解した」「まだまだ」を押し、その日の日付と一緒に残す。
// 目次・級をまたいだ一覧・ページの末尾に、学習日と結果の履歴として出す。
// 記録の形と決まりは読んで学ぶ教材で共通（studyLog.js）。
//
//   pageId: 単元は参考書の単元ID（gref_…）、級をまたいだ系統は gstrand_<系統ID>
import {
  STUDY_LOG_LIMIT,
  STUDY_LOG_RESULTS,
  appendStudyLog,
  latestStudyLog,
  normalizeStudyLog,
  studyLogHistory,
  studyLogStatusCounts,
} from './studyLog.js'

export { formatStudyDay } from './studyLog.js'

export const GRAMMAR_REFERENCE_LOG_LIMIT = STUDY_LOG_LIMIT
export const GRAMMAR_REFERENCE_RESULTS = STUDY_LOG_RESULTS

export const strandReferencePageId = (strandId) => `gstrand_${strandId}`

const PAGE_ID = /^g(?:ref|strand)_[\w-]+$/

/** 端末の保存・進捗コード・クラウドから読んだ記録を、形の正しいものだけにそろえる。 */
export const normalizeGrammarReferenceLog = (value) => normalizeStudyLog(value, PAGE_ID)

/** その日の結果を足す。同じ日の記録は置き換える。 */
export const appendGrammarReferenceLog = (log, pageId, result, day) => appendStudyLog(log, pageId, result, day, PAGE_ID)

/** 新しい順の履歴。 */
export const grammarReferenceHistory = studyLogHistory

/** いちばん新しい記録（無ければ null）。 */
export const latestGrammarReference = latestStudyLog

/** ページの集まりを、いちばん新しい結果で「理解した／まだまだ／未学習」に数える。 */
export const grammarReferenceStatusCounts = studyLogStatusCounts
