import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getWritingExamUnit } from '../data/writing-exam.js'
import { getLevel } from '../data/levels.js'
import {
  maskWritingSentence,
  writingSentenceReview,
  writingWordCount,
  writingWordTokens,
} from '../lib/writing.js'
import { WordOrderExercise } from '../components/WordOrderExercise.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import {
  Button,
  Card,
  Chip,
  IconButton,
  ProgressBar,
  cx,
} from '../components/ui.jsx'
import {
  ArrowRight,
  Cards,
  Check,
  Close,
  Eye,
  Lightbulb,
  Refresh,
  Target,
} from '../components/Icons.jsx'

// 単語カードは1問ごとに置き直す。問題を切り替えるたび、この空の並びへ戻す。
const EMPTY_ARRANGEMENT = { text: '', complete: false, correct: false, wrongPosition: false }

function MissingUnit({ onBack }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="text-5xl">🧭</div>
      <p className="font-display text-lg font-extrabold text-ink">
        文法単元を読み込めませんでした
      </p>
      <Button onClick={onBack}>単元一覧へ戻る</Button>
    </div>
  )
}

// 型と決まりの札。ヒントありでは最初から、チャレンジでは
// 自分でヒントを開いたときだけ出す。
function FormCard({ unit, level }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-3.5 shadow-sm">
      <p className="text-[10px] font-extrabold tracking-wide text-brand-500">
        英文の型
      </p>
      <p
        className="mt-1 rounded-xl px-3 py-2 font-mono text-[11px] font-extrabold leading-relaxed"
        style={{ background: `${level.color}14`, color: level.color }}
      >
        {unit.form}
      </p>
      <ul className="mt-2 space-y-1.5">
        {unit.rule.map((rule) => (
          <li key={rule} className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-emerald-600">
              <Check size={14} />
            </span>
            <span className="text-[11px] font-bold leading-relaxed text-ink/68">
              {rule}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ExplanationCard({ question, correct, repeatAnswer = true }) {
  return (
    <div
      className={cx(
        'mt-3 overflow-hidden rounded-2xl border shadow-sm',
        correct ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/70 bg-white/65 px-3.5 py-2.5">
        <span
          className={cx(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
            correct ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950',
          )}
        >
          {correct ? <Check size={17} /> : <Lightbulb size={17} />}
        </span>
        <p className="font-display text-sm font-extrabold text-ink">
          {correct ? 'この型で正しく書けています' : 'ここを直すと通ります'}
        </p>
      </div>
      <div className="space-y-2.5 p-3.5">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/75 px-3 py-2.5">
          <SpeakButton text={question.answer} size="sm" />
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold tracking-wide text-ink/40">
              模範解答{repeatAnswer ? '' : 'を聞く'}
            </p>
            {repeatAnswer && (
              <p lang="en" className="mt-0.5 font-display text-sm font-extrabold leading-relaxed text-ink">
                {question.answer}
              </p>
            )}
          </div>
        </div>
        {question.alt.length > 0 && (
          <div className="rounded-xl bg-white/75 px-3 py-2.5">
            <p className="text-[10px] font-extrabold tracking-wide text-ink/40">
              こう書いても正解
            </p>
            {question.alt.map((item) => (
              <p
                key={item}
                lang="en"
                className="mt-0.5 text-[11px] font-extrabold leading-relaxed text-ink/70"
              >
                {item}
              </p>
            ))}
          </div>
        )}
        <div>
          <p className="text-[10px] font-extrabold tracking-wide text-brand-500">
            確かめる判断
          </p>
          <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/72">
            {question.point}
          </p>
        </div>
        <div className="rounded-xl bg-rose-50 px-3 py-2.5">
          <p className="text-[10px] font-extrabold tracking-wide text-rose-600">
            減点されやすい誤り
          </p>
          <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-rose-900/80">
            {question.trap}
          </p>
        </div>
      </div>
    </div>
  )
}

export function WritingExamScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const returnTo = useStore((s) => s.returnTo)
  const recordWritingCompletion = useStore((s) => s.recordWritingCompletion)
  const recordContentQuizResult = useStore((s) => s.recordContentQuizResult)

  const unit = getWritingExamUnit(params.unitId)
  const mode = params.mode === 'free' ? 'free' : 'guide'

  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [hintStep, setHintStep] = useState(0)
  const [arranging, setArranging] = useState(mode === 'guide')
  const [arranged, setArranged] = useState(EMPTY_ARRANGEMENT)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)

  const leave = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    back()
  }

  if (!unit) return <MissingUnit onBack={leave} />

  const level = getLevel(unit.level)
  const total = unit.questions.length
  const question = unit.questions[index]
  const review = checked && !arranging ? writingSentenceReview(typed, question) : null
  const correct = arranging ? arranged.correct : Boolean(review?.correct)
  const answerWordCount = writingWordTokens(question.answer).length

  const startQuestion = (nextIndex) => {
    setIndex(nextIndex)
    setTyped('')
    setHintStep(0)
    setArranging(mode === 'guide')
    setArranged(EMPTY_ARRANGEMENT)
    setChecked(false)
  }

  const restart = () => {
    setResults([])
    setFinished(false)
    startQuestion(0)
  }

  const check = () => {
    if (checked) return
    setChecked(true)
    setResults((items) => [
      ...items,
      {
        questionId: question.id,
        correct: arranging ? arranged.correct : writingSentenceReview(typed, question).correct,
        text: arranging ? arranged.text : typed.trim(),
      },
    ])
  }

  // 自分で書いた英文が模範解答と別の形でも正しいことはある。
  // 本人の申告で記録を正解へ直せるようにする。
  const acceptOwnSentence = () => {
    setResults((items) => items.map((item) => (
      item.questionId === question.id ? { ...item, correct: true } : item
    )))
  }

  const finish = (allResults) => {
    const correctCount = allResults.filter((item) => item.correct).length
    const lastText = [...allResults].reverse().find((item) => item.text)?.text ?? ''
    if (lastText) {
      recordWritingCompletion({
        exerciseId: unit.id,
        text: lastText,
        mode,
        wordCount: writingWordCount(lastText),
        grammarIds: [],
      })
    }
    recordContentQuizResult('writing', unit.id, correctCount, allResults.length)
    setFinished(true)
  }

  const advance = () => {
    if (index + 1 >= total) {
      finish(results)
      return
    }
    startQuestion(index + 1)
  }

  if (finished) {
    const correctCount = results.filter((item) => item.correct).length
    return (
      <div className="flex h-full flex-col bg-paper">
        <header className="relative z-20 shrink-0 border-b border-brand-100 bg-white/92 px-3 pb-3 pt-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <IconButton onClick={leave} aria-label="単元一覧へ戻る">
              <Close size={21} />
            </IconButton>
            <p className="min-w-0 flex-1 truncate font-display text-sm font-extrabold text-ink">
              {unit.title}
            </p>
            <SpeechSettingsButton compact />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4">
          <section
            className="rounded-[1.8rem] p-5 text-white shadow-pop"
            style={{ background: `linear-gradient(135deg, ${level.color}, #1e1b4b)` }}
          >
            <Chip className="bg-white/12 text-white">
              {level.emoji} {level.label}・{unit.topic}
            </Chip>
            <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight">
              {correctCount}／{total}問を、型どおりに書けました
            </h1>
            <p className="mt-2 text-xs font-bold leading-relaxed text-white/75">
              {correctCount === total
                ? 'この文法はもう英文にできます。別の文法単元へ進みましょう。'
                : '直した問題は、日をおいてもう一度書くと形が残ります。'}
            </p>
          </section>

          <section className="mt-4 space-y-3">
            {unit.questions.map((item, position) => {
              const result = results.find((entry) => entry.questionId === item.id)
              return (
                <Card key={item.id} className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={cx(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold text-white',
                        result?.correct ? 'bg-emerald-500' : 'bg-rose-400',
                      )}
                    >
                      {position + 1}
                    </span>
                    <p className="min-w-0 flex-1 text-xs font-extrabold leading-relaxed text-ink/72">
                      {item.ja}
                    </p>
                    <SpeakButton text={item.answer} size="sm" />
                  </div>
                  <p lang="en" className="mt-2 rounded-xl bg-paper px-3 py-2 font-display text-sm font-extrabold leading-relaxed text-ink">
                    {item.answer}
                  </p>
                  <p className="mt-1.5 text-[11px] font-bold leading-relaxed text-ink/55">
                    {item.point}
                  </p>
                </Card>
              )
            })}
          </section>
        </main>

        <div className="shrink-0 border-t border-brand-100 bg-white/94 p-4 backdrop-blur">
          <div className="flex gap-2.5">
            <Button variant="hint" size="lg" onClick={restart}>
              <Refresh size={17} /> もう一度
            </Button>
            <Button full size="lg" onClick={leave}>
              単元一覧へ戻る <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const showForm = mode === 'guide' || hintStep >= 1
  const showSkeleton = hintStep >= 2
  const canCheck = arranging ? arranged.complete : typed.trim().length > 0

  return (
    <div className="flex h-full flex-col bg-paper">
      <header className="relative z-20 shrink-0 border-b border-brand-100 bg-white/92 px-3 pb-3 pt-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <IconButton onClick={leave} aria-label="やめる">
            <Close size={21} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-display text-sm font-extrabold text-ink">
                {unit.title}
              </p>
              <span className="shrink-0 text-[11px] font-extrabold text-ink/42">
                {index + 1}/{total}
              </span>
            </div>
            <ProgressBar
              className="mt-1.5 h-2"
              value={(index + (checked ? 1 : 0)) / total}
              color={level.color}
            />
          </div>
          <SpeechSettingsButton compact />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4">
        <section className="flex items-start gap-2.5 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${level.color}18`, color: level.color }}
          >
            <Target size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold tracking-wide text-ink/38">
              {level.label}・{unit.topic}
            </p>
            <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-ink/62">
              {unit.focus}
            </p>
          </div>
        </section>

        <section className="mt-3">
          <p className="px-1 text-[11px] font-extrabold text-ink/45">
            次の日本語を英語にしよう
          </p>
          <div
            className="mt-2 rounded-2xl border-l-4 bg-white px-4 py-3.5 shadow-sm"
            style={{ borderColor: level.color }}
          >
            <p className="font-display text-lg font-extrabold leading-relaxed text-ink">
              {question.ja}
            </p>
            <p className="mt-1.5 text-[10px] font-extrabold text-ink/38">
              模範解答は{answerWordCount}語
            </p>
          </div>
        </section>

        {showForm && (
          <section className="mt-3">
            <FormCard unit={unit} level={level} />
          </section>
        )}

        {showSkeleton && !checked && (
          <section className="mt-3 rounded-2xl bg-cyan-50 px-3.5 py-3">
            <p className="text-[10px] font-extrabold tracking-wide text-cyan-700">
              語数と頭文字だけのヒント
            </p>
            <p lang="en" className="mt-1 break-words font-mono text-sm font-extrabold text-indigo-900">
              {maskWritingSentence(question.answer)}
            </p>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-cyan-900/70">
              残りの文字は伏せています。型を思い出しながら埋めよう。
            </p>
          </section>
        )}

        <section className="mt-3">
          {arranging ? (
            <>
              {/* 注記は横に置くと375px幅で見出しへ重なるため、下の行へ回す。 */}
              <div className="mb-2 px-1">
                <p className="text-[11px] font-extrabold text-ink/48">
                  与えられた語を並べる
                </p>
                <p className="text-[10px] font-bold text-ink/35">
                  正しい位置ならすぐ緑。赤いカードは押して戻せます
                </p>
              </div>
              <WordOrderExercise
                key={`${question.id}-order`}
                targetText={question.answer}
                seed={question.id}
                checked={checked}
                liveFeedback
                onChange={(text, state) => setArranged({ text, ...state })}
              />
            </>
          ) : (
            <>
              <label
                htmlFor="writing-exam-input"
                className="mb-2 block px-1 text-[11px] font-extrabold text-ink/48"
              >
                英文を書く
              </label>
              <textarea
                id="writing-exam-input"
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                readOnly={checked}
                rows={3}
                lang="en"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="英文をここに書く"
                className="w-full rounded-2xl border-2 border-brand-200 bg-white px-3.5 py-3 font-display text-base font-extrabold leading-relaxed text-ink outline-none focus:border-brand-400"
              />
            </>
          )}
        </section>

        {!checked && (
          <section className="mt-3 flex flex-wrap gap-2">
            {mode === 'free' && hintStep < 2 && (
              <button
                onClick={() => setHintStep(hintStep + 1)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-2 text-[11px] font-extrabold text-amber-700 active:scale-95"
              >
                <Lightbulb size={15} />
                {hintStep === 0 ? '型のヒントを見る' : '頭文字のヒントを見る'}
              </button>
            )}
            {!arranging && (
              <button
                onClick={() => setArranging(true)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-[11px] font-extrabold text-brand-700 active:scale-95"
              >
                <Cards size={15} /> 単語カードで組み立てる
              </button>
            )}
            {arranging && mode === 'free' && (
              <button
                onClick={() => setArranging(false)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-[11px] font-extrabold text-brand-700 active:scale-95"
              >
                <Eye size={15} /> 自分で書く画面へ戻る
              </button>
            )}
          </section>
        )}

        {checked && review && !review.correct && (
          <section className="mt-3 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
            <p className="text-[10px] font-extrabold tracking-wide text-ink/38">
              あなたの英文
            </p>
            <p lang="en" className="mt-0.5 font-display text-sm font-extrabold leading-relaxed text-ink/75">
              {typed.trim()}
            </p>
            {review.missing.length > 0 && (
              <p className="mt-2 text-[11px] font-bold leading-relaxed text-rose-700">
                足りない語：{review.missing.join(' / ')}
              </p>
            )}
            {review.extra.length > 0 && (
              <p className="mt-1 text-[11px] font-bold leading-relaxed text-amber-700">
                模範解答にない語：{review.extra.join(' / ')}
              </p>
            )}
            {!results.find((item) => item.questionId === question.id)?.correct && (
              <button
                onClick={acceptOwnSentence}
                className="mt-2.5 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-extrabold text-emerald-700 active:scale-95"
              >
                <Check size={15} /> 自分の英文も正しいので正解にする
              </button>
            )}
          </section>
        )}

        {checked && (
          <ExplanationCard
            question={question}
            correct={correct}
            repeatAnswer={!arranging}
          />
        )}
      </main>

      <div className="shrink-0 border-t border-brand-100 bg-white/94 p-4 backdrop-blur">
        {checked ? (
          <Button full size="lg" onClick={advance}>
            {index + 1 >= total ? '結果を見る' : '次の問題へ'}
            <ArrowRight size={18} />
          </Button>
        ) : (
          <Button full size="lg" disabled={!canCheck} onClick={check}>
            答え合わせ <Check size={18} />
          </Button>
        )}
        <p className="mt-2 text-center text-[10px] font-bold text-ink/35">
          {checked
            ? '型と誤りやすい点を読んでから次へ進みます'
            : arranging
              ? arranged.wrongPosition
                ? '赤いカードを押して戻すと、その場で置き直せます'
                : 'すべての語を並べると答え合わせできます'
              : '書いたところまでで答え合わせできます'}
        </p>
      </div>
    </div>
  )
}
