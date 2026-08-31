import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getReadingQuestions } from '../data/reading-questions.js'
import {
  getReadingPracticeQuestions,
  READING_PRACTICE_TYPE_META,
} from '../data/reading-current-affairs-practice-questions.js'
import { READING_RULES_BY_ID, readingRuleForQuestion } from '../data/reading-rules.js'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildReadingInstructorExplanation } from '../lib/instructorExplanations.js'
import { InstructorExplanation } from './InstructorExplanation.jsx'
import { ReadingChoiceExplanations } from './ReadingChoiceExplanations.jsx'
import { ReadingPracticeExplanation } from './ReadingPracticeExplanation.jsx'
import { ReadingRuleCard } from './ReadingRuleCard.jsx'
import { UnknownChoiceButton } from './UnknownChoiceButton.jsx'
import { WordOrderExercise } from './WordOrderExercise.jsx'
import { Button, Card, cx } from './ui.jsx'
import { Check, Refresh } from './Icons.jsx'

const draftKey = (passageId) => `study-app:reading-check:v2:${passageId}`

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
  const [attempt, setAttempt] = useState(0)
  const recorded = useRef(initial.checked)
  const contentQuestions = getReadingQuestions(passageId)
  const practiceQuestions = getReadingPracticeQuestions(passageId)
  const questions = [...contentQuestions, ...practiceQuestions]
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

  const arrange = (questionIndex, text, status) => {
    if (checked) return
    setAnswers((current) => {
      const next = { ...current }
      if (status.complete) next[questionIndex] = text
      else delete next[questionIndex]
      return next
    })
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
    setAttempt((value) => value + 1)
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
        <p className="text-xs font-bold text-ink/50">
          長文をすぐ上で確認しながら、内容・語順・文法・語法を確かめよう
        </p>
        {practiceQuestions.length > 0 && (
          <div
            className="mt-2 flex flex-wrap justify-center gap-1.5"
            data-reading-practice-type-count={practiceQuestions.length}
          >
            {Object.entries(READING_PRACTICE_TYPE_META).map(([type, meta]) => (
              <span key={type} className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-extrabold text-violet-700">
                {meta.label} {practiceQuestions.filter((question) => question.questionType === type).length}問
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {questions.map((question, questionIndex) => {
          const practiceMeta = READING_PRACTICE_TYPE_META[question.questionType]
          const orderQuestion = question.questionType === 'word-order'
          const questionRule = question.readingRuleId
            ? READING_RULES_BY_ID[question.readingRuleId]
            : readingRuleForQuestion(question.q)
          // 教材は4択だが、出題は「3択＋わからない」にそろえる。
          // 解説も出題した選択肢だけを扱うよう、絞ったあとの設問を渡す。
          const shown = question.choices?.length
            ? {
              ...question,
              choices: limitQuizChoices(question.choices, question.answer, { seed: question.id ?? question.q }),
            }
            : question
          return (
          <fieldset key={question.id ?? question.q} data-reading-question-type={question.questionType ?? 'content'}>
            <legend className="mb-2 text-sm font-extrabold leading-relaxed text-ink">
              <span>{questionIndex + 1}. </span>
              {practiceMeta && (
                <span className="mr-1.5 inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-[10px] text-violet-700">
                  {practiceMeta.label}
                </span>
              )}
              {orderQuestion ? question.questionJa : question.q}
            </legend>
            {practiceMeta && !orderQuestion && (
              <p className="mb-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold leading-relaxed text-violet-900">
                {question.questionJa}<br />
                <span className="text-ink/55">意味：{question.cueJa}</span>
              </p>
            )}
            {orderQuestion ? (
              <>
                <p className="mb-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold leading-relaxed text-violet-900">
                  意味：{question.cueJa}
                </p>
                <WordOrderExercise
                  key={`${question.id}:${attempt}`}
                  targetText={question.answer}
                  seed={`${passageId}:${question.id}:${attempt}`}
                  initialText={answers[questionIndex] === UNKNOWN_CHOICE_ID
                    ? ''
                    : answers[questionIndex]}
                  checked={checked}
                  onChange={(text, status) => arrange(questionIndex, text, status)}
                />
                <UnknownChoiceButton
                  selected={answers[questionIndex] === UNKNOWN_CHOICE_ID}
                  disabled={checked}
                  onClick={() => choose(questionIndex, UNKNOWN_CHOICE_ID)}
                  className="mt-2 rounded-xl py-2.5"
                />
              </>
            ) : (
            <div className="space-y-2">
              {shown.choices.map((choice) => {
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
            )}
            {checked && (
              <>
                {practiceMeta ? (
                  <ReadingPracticeExplanation
                    question={shown}
                    selectedAnswer={answers[questionIndex]}
                  />
                ) : (
                  <>
                    <InstructorExplanation
                      explanation={buildReadingInstructorExplanation(question, answers[questionIndex])}
                      className="mt-3"
                      compact
                    />
                    <ReadingChoiceExplanations
                      question={shown}
                      selectedChoice={answers[questionIndex]}
                    />
                  </>
                )}
                <div className="mt-2">
                  <p className="mb-1 text-[11px] font-extrabold text-sky-700">読解ルール</p>
                  <ReadingRuleCard rule={questionRule} compact />
                </div>
              </>
            )}
          </fieldset>
          )
        })}
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
