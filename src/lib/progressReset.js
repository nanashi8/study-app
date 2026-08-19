import { PERSISTED_PROGRESS_FIELDS } from './progressCode.js'

const resetGroup = (id, label, description, fields, implies = []) => Object.freeze({
  id,
  label,
  description,
  fields: Object.freeze(fields),
  // この分類を消したとき、同じ履歴から作られていて数字が残ってしまう分類。
  implies: Object.freeze(implies),
})

// 学習履歴のリセット画面で選べる分類。
// 保存対象を追加したときに未分類のまま消去されないよう、下段で全件照合する。
export const PROGRESS_RESET_GROUPS = Object.freeze([
  resetGroup(
    'review',
    '復習段階・習熟度',
    '英単語・語源・古典・漢文のSRSと復習予定',
    [
      'srs',
      'etymologySrs',
      'kotenSrs',
      'kotenGrammarSrs',
      'kotenCultureSrs',
      'kotenInterpretationSrs',
      'kanbunVocabSrs',
      'kanbunGrammarSrs',
      'kanbunCultureSrs',
      'kanbunKundokuSrs',
    ],
    // 復習段階を消すと、そこから作られる成績・分析だけが残って数字が合わなくなる。
    ['results'],
  ),
  resetGroup(
    'completion',
    '学習済み・達成記録',
    '英作文、長文、数学の完了・理解度',
    ['writingProgress', 'readingsDone', 'mathDone', 'mathMastery'],
    ['results'],
  ),
  resetGroup(
    'results',
    '診断・成績・分析',
    '正答数、診断結果、分野・時間帯の分析',
    [
      'skillStats',
      'learningAnalytics',
      'contentQuizResults',
      'diagnosticHistory',
      'diagnosticAttempt',
      'diagnosticSeed',
      'engPos',
      'grammarStrandPos',
      'stats',
    ],
  ),
  resetGroup(
    'saved',
    '保存した教材・ノート',
    'マイ単語、マイ文法、学習ノート、古典・漢文の登録項目',
    [
      'myList',
      'myGrammarList',
      'learningNotebook',
      'kotenWordList',
      'kotenGrammarList',
      'kotenCultureList',
      'kanbunVocabList',
      'kanbunGrammarList',
      'kanbunCultureList',
    ],
  ),
  resetGroup(
    'dictionary',
    '辞書の参照履歴',
    '最近検索・参照した英単語の履歴',
    ['vocabHistory'],
  ),
  resetGroup(
    'legacy',
    '以前のバージョンの記録',
    '旧バージョンから引き継いだ進行・表示互換データ',
    [
      'battleRelicLevel',
      'battleStars',
      'battleXpSpent',
      'battleThemeId',
      'battleStudentId',
      'battleTraitInvestments',
      'battleStoryStep',
      'battleStoryLastDay',
      'afterSchoolBonds',
      'unlockedBattleStudentIds',
      'storyKeyVisualAlbum',
      'dragonVeinProgress',
    ],
  ),
])

// 学習履歴ではなく端末の使い方に属するため、どの選択でも保持する。
export const RESET_PRESERVED_PROGRESS_FIELDS = Object.freeze([
  'settings',
  'portalOrder',
  'portalHidden',
])

export const ALL_PROGRESS_RESET_GROUP_IDS = Object.freeze(
  PROGRESS_RESET_GROUPS.map((group) => group.id),
)

export const RESETTABLE_PROGRESS_FIELDS = Object.freeze(
  PROGRESS_RESET_GROUPS.flatMap((group) => group.fields),
)

const resettableSet = new Set(RESETTABLE_PROGRESS_FIELDS)
const coveredFields = [...RESETTABLE_PROGRESS_FIELDS, ...RESET_PRESERVED_PROGRESS_FIELDS]
const duplicateFields = coveredFields.filter(
  (field, index) => coveredFields.indexOf(field) !== index,
)
const missingFields = PERSISTED_PROGRESS_FIELDS.filter(
  (field) => !coveredFields.includes(field),
)
const unknownFields = coveredFields.filter(
  (field) => !PERSISTED_PROGRESS_FIELDS.includes(field),
)

if (duplicateFields.length || missingFields.length || unknownFields.length) {
  throw new Error(
    `進捗リセット分類が保存契約と不一致です。重複:${duplicateFields.join(',') || 'なし'} `
      + `未分類:${missingFields.join(',') || 'なし'} 不明:${unknownFields.join(',') || 'なし'}`,
  )
}

const groupById = new Map(PROGRESS_RESET_GROUPS.map((group) => [group.id, group]))

// 選んだ分類の派生先まで広げる。
// 例：復習段階を消したのに成績分析の数値だけ残る、という食い違いを防ぐ。
export function expandProgressResetGroupIds(groupIds = []) {
  const expanded = new Set()
  const queue = [...(Array.isArray(groupIds) ? groupIds : [])]
  while (queue.length) {
    const id = queue.shift()
    if (!groupById.has(id) || expanded.has(id)) continue
    expanded.add(id)
    queue.push(...groupById.get(id).implies)
  }
  return expanded
}

export function normalizeProgressResetGroupIds(groupIds = ALL_PROGRESS_RESET_GROUP_IDS) {
  const requested = expandProgressResetGroupIds(groupIds)
  return ALL_PROGRESS_RESET_GROUP_IDS.filter((id) => requested.has(id))
}

export function progressResetFieldsForGroups(groupIds = ALL_PROGRESS_RESET_GROUP_IDS) {
  const selected = new Set(normalizeProgressResetGroupIds(groupIds))
  return PROGRESS_RESET_GROUPS
    .filter((group) => selected.has(group.id))
    .flatMap((group) => group.fields)
    .filter((field) => resettableSet.has(field))
}
