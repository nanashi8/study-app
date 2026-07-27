import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getWritingExercise,
  getWritingGrammar,
} from '../data/writing.js'
import { getLevel } from '../data/levels.js'
import { getWord } from '../data/vocab.js'
import {
  buildWritingText,
  resolveWritingTrail,
  selectedWritingGrammarIds,
  selectedWritingWordIds,
  writingCompletion,
  writingWordCount,
} from '../lib/writing.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
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
  Bookmark,
  BookmarkFilled,
  Check,
  ChevronLeft,
  Close,
  Lightbulb,
  Refresh,
  Sparkles,
} from '../components/Icons.jsx'

function MissingWriting({ onBack }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="text-5xl">🧭</div>
      <p className="font-display text-lg font-extrabold text-ink">
        お題を読み込めませんでした
      </p>
      <Button onClick={onBack}>お題へ戻る</Button>
    </div>
  )
}

function SaveGrammarButton({ grammarId, compact = false }) {
  const myGrammarList = useStore((s) => s.myGrammarList)
  const toggleMyGrammar = useStore((s) => s.toggleMyGrammar)
  const saved = myGrammarList.includes(grammarId)
  return (
    <button
      onClick={() => toggleMyGrammar(grammarId)}
      aria-pressed={saved}
      className={cx(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl font-extrabold transition-transform active:scale-95',
        compact ? 'h-9 px-2.5 text-xs' : 'h-10 px-3 text-sm',
        saved
          ? 'bg-amber-100 text-amber-700'
          : 'border border-brand-200 bg-white text-brand-600',
      )}
    >
      {saved ? <BookmarkFilled size={16} /> : <Bookmark size={16} />}
      {saved ? '保存済み' : 'マイ文法'}
    </button>
  )
}

function WordSaveRow({ ids }) {
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  const words = ids.map(getWord).filter(Boolean)
  if (!words.length) return null
  return (
    <div className="mt-3 border-t border-amber-200/70 pt-3">
      <p className="mb-2 text-[11px] font-extrabold tracking-wide text-amber-900/55">
        この表現の学習語
      </p>
      <div className="flex flex-wrap gap-2">
        {words.map((word) => {
          const saved = myList.includes(word.id)
          return (
            <button
              key={word.id}
              onClick={() => toggleMyList(word.id)}
              aria-pressed={saved}
              className={cx(
                'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-left transition-transform active:scale-95',
                saved
                  ? 'border-amber-300 bg-amber-100 text-amber-900'
                  : 'border-amber-200 bg-white text-ink',
              )}
            >
              <span>
                <span className="block font-display text-sm font-extrabold">
                  {word.word}
                </span>
                <span className="block max-w-32 truncate text-[10px] font-bold opacity-55">
                  {word.meaning}
                </span>
              </span>
              {saved ? (
                <BookmarkFilled size={15} className="text-amber-600" />
              ) : (
                <Bookmark size={15} className="text-amber-600" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function WritingPlayScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const navigate = useStore((s) => s.navigate)
  const recordWritingCompletion = useStore((s) => s.recordWritingCompletion)
  const addManyToMyList = useStore((s) => s.addManyToMyList)
  const addManyToMyGrammar = useStore((s) => s.addManyToMyGrammar)
  const myList = useStore((s) => s.myList)
  const myGrammarList = useStore((s) => s.myGrammarList)

  const exercise = getWritingExercise(params.exerciseId)
  const mode = params.mode === 'free' ? 'free' : 'guide'
  const [trail, setTrail] = useState([])
  const [selected, setSelected] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [finished, setFinished] = useState(false)

  if (!exercise) return <MissingWriting onBack={back} />

  const level = getLevel(exercise.level)
  const stepIndex = trail.length
  const currentStep = exercise.steps[stepIndex]
  const coachVisible = mode === 'guide' || showHint
  const draft = buildWritingText(exercise, trail, selected)
  const draftWords = writingWordCount(draft)
  const selectedGrammar = selected
    ? getWritingGrammar(selected.grammarId)
    : null
  const recommended =
    currentStep?.options.find((option) => option.recommended) ??
    currentStep?.options[0]

  const completedResult = finished
    ? writingCompletion(exercise, trail)
    : null

  const reset = () => {
    setTrail([])
    setSelected(null)
    setShowHint(false)
    setFinished(false)
  }

  const undo = () => {
    if (selected) {
      setSelected(null)
      return
    }
    if (!trail.length) return
    setTrail((items) => items.slice(0, -1))
    setShowHint(false)
    setFinished(false)
  }

  const advance = () => {
    if (!currentStep || !selected) return
    const nextTrail = [
      ...trail,
      { stepId: currentStep.id, choiceId: selected.id },
    ]
    if (nextTrail.length === exercise.steps.length) {
      const result = writingCompletion(exercise, nextTrail)
      recordWritingCompletion({
        exerciseId: exercise.id,
        text: result.text,
        mode,
        wordCount: result.wordCount,
        grammarIds: result.grammarIds,
      })
      setTrail(nextTrail)
      setSelected(null)
      setFinished(true)
      return
    }
    setTrail(nextTrail)
    setSelected(null)
    setShowHint(false)
  }

  if (finished && completedResult) {
    const wordItems = completedResult.wordIds.map(getWord).filter(Boolean)
    const grammarItems = completedResult.grammarIds
      .map(getWritingGrammar)
      .filter(Boolean)
    const allWordsSaved =
      wordItems.length > 0 &&
      wordItems.every((item) => myList.includes(item.id))
    const allGrammarSaved =
      grammarItems.length > 0 &&
      grammarItems.every((item) => myGrammarList.includes(item.id))

    return (
      <div className="min-h-full bg-gradient-to-b from-indigo-950 via-brand-800 to-paper">
        <div className="px-4 pb-10 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <div className="flex items-center justify-between text-white">
            <IconButton
              onClick={() => navigate('writing')}
              className="text-white active:bg-white/10"
              aria-label="お題へ戻る"
            >
              <Close size={22} />
            </IconButton>
            <Chip className="bg-white/12 text-white">
              {level.emoji} {level.label}・{exercise.genre}
            </Chip>
            <div className="w-11" />
          </div>

          <div className="mt-4 text-center text-white">
            <div className="mx-auto flex h-20 w-20 animate-pop-in items-center justify-center rounded-[1.7rem] bg-emerald-400 text-4xl shadow-[0_18px_45px_-15px_rgba(52,211,153,0.8)]">
              ✓
            </div>
            <p className="mt-4 text-xs font-extrabold tracking-[0.18em] text-cyan-200">
              ROUTE COMPLETE
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold">
              伝わる英文が完成！
            </h1>
            <p className="mt-1 text-sm font-bold text-white/65">
              選んだことばが、ひとつの論理になりました
            </p>
          </div>

          <Card className="mt-6 overflow-hidden">
            <div className="border-b border-brand-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold tracking-wide text-ink/40">
                    YOUR COMPOSITION
                  </p>
                  <h2 className="font-display text-lg font-extrabold text-ink">
                    {exercise.title}
                  </h2>
                </div>
                <SpeakButton text={completedResult.text} />
              </div>
            </div>
            <div className="p-5">
              <p className="font-serif text-[17px] font-semibold leading-[1.9] text-slate-800 selection:bg-brand-100">
                {completedResult.text}
              </p>
              <div className="mt-4 flex gap-2">
                <Chip color={level.color}>
                  {completedResult.wordCount} words
                </Chip>
                <Chip color="#8b5cf6">
                  {completedResult.grammarIds.length} grammar
                </Chip>
                <Chip color="#0ea5e9">
                  {mode === 'guide' ? 'ガイド練習' : '制約内フリー'}
                </Chip>
              </div>
            </div>
          </Card>

          <Card className="mt-4 p-4">
            <p className="font-display text-base font-extrabold text-ink">
              この級の作文チェック
            </p>
            <div className="mt-3 space-y-2">
              {completedResult.checks.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-3 py-2.5"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check size={14} />
                  </span>
                  <span className="text-sm font-extrabold text-emerald-900">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {wordItems.length > 0 && (
            <Card className="mt-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-base font-extrabold text-ink">
                    作文に出たマイ単語候補
                  </p>
                  <p className="text-xs font-bold text-ink/45">
                    保存すると、いつもの単語カードで復習できます
                  </p>
                </div>
                <button
                  onClick={() =>
                    addManyToMyList(wordItems.map((item) => item.id))
                  }
                  disabled={allWordsSaved}
                  className="shrink-0 rounded-xl bg-amber-100 px-3 py-2 text-xs font-extrabold text-amber-700 disabled:opacity-55"
                >
                  {allWordsSaved ? 'すべて保存済み' : 'すべて保存'}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {wordItems.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => useStore.getState().toggleMyList(word.id)}
                    className={cx(
                      'rounded-xl border px-2.5 py-2 text-left',
                      myList.includes(word.id)
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-brand-100 bg-white',
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="font-display text-sm font-extrabold text-ink">
                        {word.word}
                      </span>
                      {myList.includes(word.id) ? (
                        <BookmarkFilled
                          size={14}
                          className="text-amber-500"
                        />
                      ) : (
                        <Bookmark size={14} className="text-ink/30" />
                      )}
                    </span>
                    <span className="mt-0.5 block max-w-36 truncate text-[10px] font-bold text-ink/45">
                      {word.meaning}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="mt-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-base font-extrabold text-ink">
                  今回使った文法
                </p>
                <p className="text-xs font-bold text-ink/45">
                  マイ文法に保存して、カードで反復
                </p>
              </div>
              <button
                onClick={() =>
                  addManyToMyGrammar(grammarItems.map((item) => item.id))
                }
                disabled={allGrammarSaved}
                className="shrink-0 rounded-xl bg-violet-100 px-3 py-2 text-xs font-extrabold text-violet-700 disabled:opacity-55"
              >
                {allGrammarSaved ? 'すべて保存済み' : 'すべて保存'}
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {grammarItems.map((grammar) => (
                <div
                  key={grammar.id}
                  className="flex items-center gap-3 rounded-2xl border border-brand-100 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-extrabold text-ink">
                      {grammar.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] font-bold text-brand-600">
                      {grammar.pattern}
                    </p>
                  </div>
                  <SaveGrammarButton grammarId={grammar.id} compact />
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={reset}>
              <Refresh size={17} /> 別ルート
            </Button>
            <Button onClick={() => navigate('writing')}>
              別のお題 <ArrowRight size={17} />
            </Button>
          </div>
          <button
            onClick={() => navigate('myGrammar')}
            className="mt-3 w-full rounded-2xl py-3 text-sm font-extrabold text-white/75 active:bg-white/10"
          >
            マイ文法を開く
          </button>
        </div>
      </div>
    )
  }

  const resolved = resolveWritingTrail(exercise, trail)
  const progressValue =
    (trail.length + (selected ? 0.45 : 0)) / exercise.steps.length
  const nextStep = exercise.steps[stepIndex + 1]

  return (
    <div className="flex min-h-full flex-col bg-paper">
      <header className="sticky top-0 z-20 border-b border-brand-100 bg-white/92 px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] backdrop-blur">
        <div className="flex items-center gap-2">
          <IconButton onClick={back} aria-label="やめる">
            <Close size={21} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-display text-sm font-extrabold text-ink">
                {exercise.emoji} {exercise.title}
              </p>
              <span className="shrink-0 text-[11px] font-extrabold text-ink/42">
                {stepIndex + 1}/{exercise.steps.length}
              </span>
            </div>
            <ProgressBar
              className="mt-1.5 h-2"
              value={progressValue}
              color={level.color}
            />
          </div>
          <button
            onClick={undo}
            disabled={!selected && !trail.length}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-600 disabled:opacity-25"
            aria-label="ひとつ戻す"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-44 pt-4">
        <section className="mb-3 flex items-start gap-2.5 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
            style={{ background: `${level.color}18` }}
          >
            🎯
          </span>
          <div>
            <p className="text-[10px] font-extrabold tracking-wide text-ink/38">
              今回のお題
            </p>
            <p className="mt-0.5 text-xs font-extrabold leading-relaxed text-ink/68">
              {exercise.task}
            </p>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-brand-800 p-4 text-white shadow-card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-cyan-200">
              YOUR COMPOSITION
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-white/50">
                {draftWords} words
              </span>
              {draft && <SpeakButton text={draft} size="sm" />}
            </div>
          </div>
          {draft ? (
            <p className="mt-2 min-h-20 font-serif text-[16px] font-semibold leading-[1.8] text-white">
              {draft}
            </p>
          ) : (
            <div className="mt-2 flex min-h-20 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 text-center text-sm font-bold text-white/45">
              下の英語カードを選ぶと、
              <br />
              ここに作文が育ちます
            </div>
          )}
          {resolved.length > 0 && (
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
              {resolved.map(({ step }, index) => (
                <span
                  key={`${step.id}-${index}`}
                  className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-extrabold text-white/65"
                >
                  ✓ {step.phase}
                </span>
              ))}
              {selected && (
                <span className="shrink-0 animate-pop-in rounded-full bg-cyan-300 px-2 py-1 text-[10px] font-extrabold text-indigo-950">
                  {currentStep.phase}
                </span>
              )}
            </div>
          )}
        </section>

        <section className="mt-4">
          <div className="flex items-start justify-between gap-3 px-1">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-extrabold text-white"
                  style={{ background: level.color }}
                >
                  {currentStep.phase}
                </span>
                <span className="text-[11px] font-bold text-ink/40">
                  次につなぐ英語
                </span>
              </div>
              <h1 className="mt-2 font-display text-xl font-extrabold leading-tight text-ink">
                {currentStep.prompt}
              </h1>
              <p className="mt-1 text-xs font-bold text-ink/52">
                制約：{currentStep.constraint}
              </p>
            </div>
            {mode === 'free' && !showHint && !selected && (
              <button
                onClick={() => setShowHint(true)}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-amber-100 px-2.5 py-2 text-xs font-extrabold text-amber-700"
              >
                <Lightbulb size={14} /> ヒント
              </button>
            )}
          </div>

          {coachVisible && !selected && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-cyan-50 p-3 text-cyan-950">
              <span className="mt-0.5 text-cyan-600">
                <Sparkles size={17} />
              </span>
              <div>
                <p className="text-[11px] font-extrabold text-cyan-700">
                  ルートガイド
                </p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-cyan-950/75">
                  {currentStep.guide}
                </p>
              </div>
            </div>
          )}

          <div className="mt-3 space-y-2.5">
            {currentStep.options.map((option) => {
              const on = selected?.id === option.id
              const recommendedOn =
                coachVisible && recommended?.id === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setSelected(option)}
                  aria-pressed={on}
                  className={cx(
                    'relative w-full rounded-2xl border-2 p-3.5 text-left transition-all active:scale-[0.99]',
                    on
                      ? 'border-brand-500 bg-brand-50 shadow-card'
                      : 'border-transparent bg-white shadow-sm',
                    !on && selected && 'opacity-48',
                  )}
                >
                  {recommendedOn && (
                    <span className="absolute -top-2 right-3 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-amber-950 shadow-sm">
                      おすすめ
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <span
                      className={cx(
                        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2',
                        on
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-brand-100 bg-paper text-transparent',
                      )}
                    >
                      <Check size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[15px] font-extrabold leading-relaxed text-ink">
                        {option.text}
                      </p>
                      <p className="mt-1 text-xs font-bold leading-relaxed text-ink/46">
                        {option.ja}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {selected && selectedGrammar && (
          <section className="mt-4 animate-slide-up">
            <div className="overflow-hidden rounded-[1.6rem] border border-amber-200 bg-amber-50 shadow-card">
              <div className="flex items-center gap-3 border-b border-amber-200/70 bg-white/65 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-amber-950">
                  <Lightbulb size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold tracking-[0.12em] text-amber-700">
                    WHY THIS WORKS
                  </p>
                  <h2 className="truncate font-display text-base font-extrabold text-ink">
                    {selectedGrammar.title}
                  </h2>
                </div>
                <SaveGrammarButton grammarId={selectedGrammar.id} compact />
              </div>
              <div className="p-4">
                <div className="rounded-xl bg-amber-100/75 px-3 py-2 font-mono text-sm font-extrabold text-amber-900">
                  {selectedGrammar.pattern}
                </div>
                <p className="mt-3 text-sm font-bold leading-relaxed text-ink/72">
                  {selectedGrammar.explanation}
                </p>
                <div className="mt-3 rounded-xl border-l-4 border-brand-400 bg-white p-3">
                  <p className="text-[10px] font-extrabold text-brand-500">
                    今選んだ表現では
                  </p>
                  <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75">
                    {selected.tip}
                  </p>
                </div>
                <WordSaveRow ids={selected.wordIds ?? []} />
              </div>
            </div>

            {nextStep && (
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <ArrowRight size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-ink/40">
                    次のガイド
                  </p>
                  <p className="truncate text-xs font-extrabold text-ink/70">
                    {nextStep.phase}：{nextStep.prompt}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-brand-100 bg-white/94 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" disabled={!selected} onClick={advance}>
          {stepIndex + 1 >= exercise.steps.length
            ? '作文を完成する'
            : 'この表現でつなぐ'}
          <ArrowRight size={18} />
        </Button>
        <p className="mt-2 text-center text-[10px] font-bold text-ink/35">
          選択後に文法を確認してから次へ進みます
        </p>
      </div>
    </div>
  )
}
