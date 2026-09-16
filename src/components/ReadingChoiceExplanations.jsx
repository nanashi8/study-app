import { readingChoiceNoteFor } from '../lib/readingChoiceNotes.js'
import { ChoiceExplanations } from './ChoiceExplanations.jsx'

// 長文の内容理解の答え合わせ。設問の和訳と、出題した選択肢それぞれの和訳・本文と合う（合わない）理由を並べる。
export function ReadingChoiceExplanations({ passageId, questionIndex, question, selectedChoice }) {
  return (
    <div className="mt-2 space-y-2" data-reading-choice-explanations>
      <div
        className="rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2.5"
        data-reading-question-translation
      >
        <p className="text-[10px] font-extrabold text-sky-700">設問の和訳</p>
        <p lang="en" className="mt-1 text-xs font-bold leading-relaxed text-ink/65">{question.q}</p>
        <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink">{question.questionJa}</p>
      </div>
      <ChoiceExplanations
        title={`選択肢解説（${question.choices.length}択すべて）`}
        name="reading"
        rows={question.choices.map((choice) => ({
          id: choice,
          heading: <span lang="en">{choice}</span>,
          body: (
            <>
              <p className="text-ink/80" data-reading-choice-translation>和訳：{question.choiceTranslations?.[choice]}</p>
              <p className="mt-0.5">{readingChoiceNoteFor(passageId, questionIndex, choice)}</p>
            </>
          ),
          correct: choice === question.answer,
          chosen: selectedChoice === choice,
        }))}
      />
    </div>
  )
}
