import { GRAMMAR_CHOICE_NOTES } from '../data/grammar-choice-notes.js'

// 英文法テストの答え合わせで、選択肢1つずつに出す説明。
// 自動生成の問題は問題データの choiceNotes、手作り・形式拡充・試験型の問題は grammar-choice-notes.js から引く。
export function grammarChoiceNoteFor(item, choice) {
  return item?.choiceNotes?.[choice] ?? GRAMMAR_CHOICE_NOTES[item?.id]?.[choice] ?? ''
}
