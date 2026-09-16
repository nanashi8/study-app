import { READING_CHOICE_NOTES } from '../data/reading-choice-notes.js'

// 長文の内容理解の答え合わせで、選択肢1つずつに出す説明。設問は「長文ID#設問番号（1から）」で引く。
export const readingQuestionKey = (passageId, questionIndex) => `${passageId}#${questionIndex + 1}`

export function readingChoiceNoteFor(passageId, questionIndex, choice) {
  return READING_CHOICE_NOTES[readingQuestionKey(passageId, questionIndex)]?.[choice] ?? ''
}
