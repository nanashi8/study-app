import { grammarChoiceNoteFor } from '../lib/grammarChoiceNotes.js'
import { ChoiceExplanations } from './ChoiceExplanations.jsx'

// 英文法の答え合わせで、出題した選択肢を1つずつ説明する。
// 正解には「なぜその形になるか」、誤答には「なぜこの文に入らないか」を、その問題の文に当てはめて出す。
export function GrammarChoiceExplanations({
  item,
  choices = item?.choices ?? [],
  selected,
  className,
}) {
  if (!item) return null

  return (
    <ChoiceExplanations
      title={`選択肢解説（${choices.length}択すべて）`}
      name="grammar"
      className={className}
      rows={choices.map((choice) => ({
        id: choice,
        heading: choice,
        body: grammarChoiceNoteFor(item, choice),
        correct: choice === item.answer,
        chosen: selected === choice,
      }))}
    />
  )
}
