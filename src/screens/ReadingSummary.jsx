import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getReadingQuestions } from '../data/reading-questions.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { Card, Button, Chip, IconButton, cx } from '../components/ui.jsx'
import { Book, Cards, Bookmark, BookmarkFilled, Check, ArrowRight } from '../components/Icons.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildReadingInstructorExplanation } from '../lib/instructorExplanations.js'

export function ReadingSummaryScreen() {
  const passageId = useStore((s) => s.params.passageId)
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  const addManyToMyList = useStore((s) => s.addManyToMyList)
  const markReadingDone = useStore((s) => s.markReadingDone)
  const recordSkillResult = useStore((s) => s.recordSkillResult)

  const passage = getPassage(passageId)
  const [savedAll, setSavedAll] = useState(false)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const recorded = useRef(false)

  if (!passage) {
    return (
      <div>
        <ScreenHeader title="まとめ" />
        <div className="p-8 text-center font-bold text-ink/50">長文が見つかりませんでした。</div>
      </div>
    )
  }

  const words = passage.vocab.map(getWord).filter(Boolean)
  const ids = words.map((w) => w.id)
  const allSaved = ids.every((id) => myList.includes(id))
  const questions = getReadingQuestions(passageId)
  const answeredAll = questions.length > 0 && questions.every((_, i) => answers[i])
  const correct = questions.filter((q, i) => answers[i] === q.answer).length

  const checkReading = () => {
    if (!answeredAll) return
    setChecked(true)
    if (!recorded.current) {
      recorded.current = true
      markReadingDone(passageId)
      recordSkillResult('reading', correct, questions.length)
    }
  }

  return (
    <div className="pb-6">
      <ScreenHeader title="長文のまとめ" subtitle={passage.titleJa} />

      <div className="space-y-4 px-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl">🧠</div>
            <h2 className="mt-1 font-display text-lg font-extrabold text-ink">読解チェック</h2>
            <p className="text-xs font-bold text-ink/50">本文の内容に合う答えを選ぼう</p>
          </div>

          <div className="mt-4 space-y-5">
            {questions.map((q, qi) => (
              <fieldset key={q.q}>
                <legend className="mb-2 text-sm font-extrabold leading-relaxed text-ink">
                  {qi + 1}. {q.q}
                </legend>
                <div className="space-y-2">
                  {q.choices.map((choice) => {
                    const selected = answers[qi] === choice
                    const isCorrect = choice === q.answer
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
                        onClick={() => setAnswers((prev) => ({ ...prev, [qi]: choice }))}
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
                    selected={answers[qi] === UNKNOWN_CHOICE_ID}
                    disabled={checked}
                    onClick={() => setAnswers((prev) => ({ ...prev, [qi]: UNKNOWN_CHOICE_ID }))}
                    className="rounded-xl py-2.5"
                  />
                </div>
                {checked && (
                  <InstructorExplanation
                    explanation={buildReadingInstructorExplanation(q, answers[qi])}
                    className="mt-3"
                    compact
                  />
                )}
              </fieldset>
            ))}
          </div>

          {checked ? (
            <div className="mt-4 rounded-2xl bg-brand-50 p-3 text-center">
              <div className="font-display text-lg font-extrabold text-brand-700">
                {correct}/{questions.length}問 正解
              </div>
              <div className="text-xs font-bold text-brand-600/70">読了として記録しました</div>
            </div>
          ) : (
            <Button full className="mt-4" disabled={!answeredAll} onClick={checkReading}>
              <Check size={16} /> 答え合わせ
            </Button>
          )}
        </Card>

        <Card className="p-4 text-center">
          <div className="text-4xl">🎯</div>
          <h2 className="mt-1 font-display text-lg font-extrabold text-ink">この長文に出てきた単語</h2>
          <p className="text-sm font-bold text-ink/50">{words.length}語をまとめて覚えよう</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={() => navigate('vocabStudy', { source: { type: 'mylist', ids }, title: passage.title, mode: 'study' })}>
              <Book size={16} /> 覚える
            </Button>
            <Button variant="secondary" onClick={() => navigate('vocabQuiz', { source: { type: 'mylist', ids }, title: passage.title })}>
              <Cards size={16} /> クイズ
            </Button>
          </div>
          <Button
            full
            variant={allSaved || savedAll ? 'soft' : 'hint'}
            className="mt-2"
            disabled={allSaved}
            onClick={() => {
              addManyToMyList(ids)
              setSavedAll(true)
            }}
          >
            {allSaved || savedAll ? <><Check size={16} /> マイ単語に保存済み</> : <><Bookmark size={16} /> 全部マイ単語に保存</>}
          </Button>
        </Card>

        <div className="space-y-2">
          {words.map((w) => {
            const level = getLevel(w.level)
            const saved = myList.includes(w.id)
            return (
              <div key={w.id} className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
                <SpeakButton text={w.word} size="sm" />
                <button onClick={() => navigate('wordDetail', { id: w.id })} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <PosBadge pos={w.pos} />
                      <span className="font-display font-extrabold text-ink">{w.word}</span>
                      <Chip color={level.color}>{level.label}</Chip>
                    </div>
                    <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>
                  </div>
                  <span className="text-brand-300"><ArrowRight size={16} /></span>
                </button>
                <IconButton onClick={() => toggleMyList(w.id)} className={saved ? 'text-hint' : 'text-ink/30'} aria-label="マイ単語に保存">
                  {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                </IconButton>
              </div>
            )
          })}
        </div>

        <Button full variant="ghost" onClick={() => navigate('reader', { passageId })}>
          もう一度読む
        </Button>
      </div>
    </div>
  )
}
