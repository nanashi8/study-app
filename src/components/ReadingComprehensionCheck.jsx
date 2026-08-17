import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getReadingQuestions } from '../data/reading-questions.js'
import { readingRuleForQuestion } from '../data/reading-rules.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildReadingInstructorExplanation } from '../lib/instructorExplanations.js'
import { InstructorExplanation } from './InstructorExplanation.jsx'
import { ReadingRuleCard } from './ReadingRuleCard.jsx'
import { UnknownChoiceButton } from './UnknownChoiceButton.jsx'
import { Button, Card, cx } from './ui.jsx'
import { Check, Refresh } from './Icons.jsx'

const draftKey = (passageId) => `study-app:reading-check:${passageId}`

function readDraft(passageId) {
  if (typeof sessionStorage === 'undefined') return { answers: {}, checked: false }
  try {
    const parsed = JSON.parse(sessionStorage.getItem(draftKey(passageId)) ?? 'null')
    return {
      answers: parsed?.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      checked: parsed?.checked === true,
    }
  } catch {
    return { answers: {}, checked: false }
  }
}

function writeDraft(passageId, draft) {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(draftKey(passageId), JSON.stringify(draft))
  } catch {
    // 学習機能は続行し、保存領域を使えない環境だけ一時保持に戻す。
  }
}

export function ReadingComprehensionCheck({ passageId, onStatusChange }) {
  const markReadingDone = useStore((state) => state.markReadingDone)
  const recordSkillResult = useStore((state) => state.recordSkillResult)
  const recordContentQuizResult = useStore((state) => state.recordContentQuizResult)
  const initial = useRef(readDraft(passageId)).current
  const [answers, setAnswers] = useState(initial.answers)
  const [checked, setChecked] = useState(initial.checked)
  const recorded = useRef(initial.checked)
  const questions = getReadingQuestions(passageId)
  const answeredAll = questions.length > 0 && questions.every((_, index) => (
    Object.prototype.hasOwnProperty.call(answers, index)
  ))
  const correct = questions.filter((question, index) => answers[index] === question.answer).length

  useEffect(() => {
    writeDraft(passageId, { answers, checked })
  }, [answers, checked, passageId])

  useEffect(() => {
    onStatusChange?.(checked)
  }, [checked, onStatusChange])

  const choose = (questionIndex, choice) => {
    if (checked) return
    setAnswers((current) => ({ ...current, [questionIndex]: choice }))
  }

  const checkReading = () => {
    if (!answeredAll) return
    setChecked(true)
    if (recorded.current) return
    recorded.current = true
    markReadingDone(passageId)
    recordContentQuizResult('reading', passageId, correct, questions.length)
    recordSkillResult('reading', correct, questions.length)
  }

  const retry = () => {
    recorded.current = true
    setAnswers({})
    setChecked(false)
  }

  return (
    <Card
      className="p-4"
      data-reading-check-under-passage={passageId}
      data-reading-answer-count={Object.keys(answers).length}
    >
      <div className="text-center">
        <div className="text-3xl" aria-hidden="true">🧠</div>
        <h2 className="mt-1 font-display text-lg font-extrabold text-ink">読解チェック</h2>
        <p className="text-xs font-bold text-ink/50">長文をすぐ上で確認しながら、本文の内容に合う答えを選ぼう</p>
      </div>

      <div className="mt-4 space-y-5">
        {questions.map((question, questionIndex) => (
          <fieldset key={question.q}>
            <legend className="mb-2 text-sm font-extrabold leading-relaxed text-ink">
              {questionIndex + 1}. {question.q}
            </legend>
            <div className="space-y-2">
              {question.choices.map((choice) => {
                const selected = answers[questionIndex] === choice
                const isCorrect = choice === question.answer
                const tone = checked
                  ? isCorrect
                    ? 'border-emerald-400 bg-correct-soft text-emerald-800'
                    : selected
                      ? 'border-rose-400 bg-wrong-soft text-rose-800'
                      : 'border-transparent bg-paper text-ink/35'
                  : selected
                    ? 'border-brand-400 bg-brand-50 text-brand-800'
                    : 'border-brand-100 bg-white text-ink'
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={checked}
                    onClick={() => choose(questionIndex, choice)}
                    className={cx(
                      'w-full rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition-colors',
                      tone,
                    )}
                  >
                    {choice}
                  </button>
                )
              })}
              <UnknownChoiceButton
                selected={answers[questionIndex] === UNKNOWN_CHOICE_ID}
                disabled={checked}
                onClick={() => choose(questionIndex, UNKNOWN_CHOICE_ID)}
                className="rounded-xl py-2.5"
              />
            </div>
            {checked && (
              <>
                <InstructorExplanation
                  explanation={buildReadingInstructorExplanation(question, answers[questionIndex])}
                  className="mt-3"
                  compact
                />
                <div className="mt-2">
                  <p className="mb-1 text-[11px] font-extrabold text-sky-700">読解ルール</p>
                  <ReadingRuleCard rule={readingRuleForQuestion(question.q)} compact />
                </div>
              </>
            )}
          </fieldset>
        ))}
      </div>

      {checked ? (
        <div className="mt-4 space-y-2">
          <div className="rounded-2xl bg-brand-50 p-3 text-center">
            <div className="font-display text-lg font-extrabold text-brand-700">
              {correct}/{questions.length}問 正解
            </div>
            <div className="text-xs font-bold text-brand-600/70">読了として記録しました</div>
          </div>
          <Button full variant="ghost" onClick={retry}>
            <Refresh size={16} /> 回答をやり直す
          </Button>
        </div>
      ) : (
        <Button full className="mt-4" disabled={!answeredAll} onClick={checkReading}>
          <Check size={16} /> 答え合わせ
        </Button>
      )}
    </Card>
  )
}
