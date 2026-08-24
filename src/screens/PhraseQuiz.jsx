import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildPhraseDeck, growDeck, pickPhraseDistractors } from '../lib/session.js'
import { shuffle } from '../data/vocab.js'
import { quizMeaning } from '../data/compact.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { longSentenceTranslationFor } from '../data/long-sentence-translations.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { LongSentenceTranslation } from '../components/LongSentenceTranslation.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { DragonVeinCipherStage } from '../components/DragonVeinCipherStage.jsx'
import { Button, ProgressBar, IconButton, Chip } from '../components/ui.jsx'
import { ArrowRight, Bookmark, BookmarkFilled, Check, Close } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildPhraseInstructorExplanation } from '../lib/instructorExplanations.js'
import { isDragonVeinSource } from '../lib/dragonVein.js'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

const newSessionId = () => (
  globalThis.crypto?.randomUUID?.()
  ?? `dragon-phrase-${Date.now()}-${Math.random().toString(36).slice(2)}`
)

function streaksFromLog(log) {
  let streak = 0
  let wrongStreak = 0
  for (const answer of log) {
    if (answer === 'correct') {
      streak += 1
      wrongStreak = 0
    } else {
      streak = 0
      wrongStreak += 1
    }
  }
  return { streak, wrongStreak, lastAnswer: log.at(-1) ?? null }
}

export function PhraseQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const review = useStore((state) => state.review)
  const toggleNotebookItem = useStore((state) => state.toggleNotebookItem)
  const learningNotebook = useStore((state) => state.learningNotebook)
  const selectedStudentId = useStore((state) => state.battleStudentId)
  const source = params.source ?? { type: 'phrase', kind: 'idiom' }
  const isDragonVein = isDragonVeinSource(source)

  const sessionId = useRef(newSessionId())
  // size=0 は「絞り込みなし」。在庫数から、選べる問題数の上限を決める。
  const buildFor = (size) => buildPhraseDeck(source, { srs: useStore.getState().srs, size })
  const [poolSize] = useState(() => buildFor(0).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildFor(params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const results = useRef({ correct: 0, wrong: 0, unknown: 0, wrongIds: [], answerLog: [] })

  const item = deck[index]
  const options = useMemo(() => {
    if (!item) return []
    return shuffle([item, ...pickPhraseDistractors(item, 2)])
  }, [item?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // コンテンツ画面の「戻る」は履歴でなく、熟語・構文の内容選択画面へ。
  const backToPhrases = () => returnTo('phrases')

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる項目がありません</p>
        <Button onClick={backToPhrases}>もどる</Button>
      </div>
    )
  }

  const answered = selected !== null
  const streakState = streaksFromLog(results.current.answerLog)
  const isCorrectPick = answered && selected === item.id
  const instructorExplanation = answered
    ? buildPhraseInstructorExplanation(
        item,
        selected === UNKNOWN_CHOICE_ID
          ? UNKNOWN_CHOICE_ID
          : options.find((option) => option.id === selected),
      )
    : null
  const longSentenceTranslation = longSentenceTranslationFor(item)
  const saved = learningNotebook?.entries?.[`phrases:${item.id}`]?.saved === true

  const finish = () => {
    navigate('sessionResult', {
      title: params.title ?? (isDragonVein ? '龍脈の熟語・構文解読' : '熟語・構文'),
      mode: 'quiz',
      engine: 'phrase',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      reviewIds: results.current.wrongIds,
      source,
      size: params.size,
      sessionId: sessionId.current,
      answerLog: [...results.current.answerLog],
      continueTo: params.continueTo,
      returnTo: params.returnTo,
    })
  }

  const choose = (optionId) => {
    if (answered) return
    setSelected(optionId)
    let answer
    if (optionId === UNKNOWN_CHOICE_ID) {
      review(item.id, 'unknown', 'usage')
      results.current.unknown += 1
      results.current.wrongIds.push(item.id)
      answer = 'unknown'
    } else if (optionId === item.id) {
      review(item.id, 'correct', 'usage')
      results.current.correct += 1
      answer = 'correct'
    } else {
      review(item.id, 'wrong', 'usage')
      results.current.wrong += 1
      results.current.wrongIds.push(item.id)
      answer = 'wrong'
    }
    results.current.answerLog.push(answer)
  }

  const next = () => {
    if (index + 1 >= deck.length) finish()
    else {
      setIndex((current) => current + 1)
      setSelected(null)
    }
  }

  const feedback = isCorrectPick
    ? streakState.streak >= 5
      ? `連続${streakState.streak}正解！ 消えた言い回しが鮮明に戻った`
      : '正解。文脈のつながりを1つ復元した'
    : selected === UNKNOWN_CHOICE_ID
      ? '未解読として記録。例文の語順を手掛かりにしよう'
      : '文脈がつながらない。例文で使われる場面を確かめよう'

  return (
    <div className={cx('flex h-full flex-col', isDragonVein && 'dragon-vein-quiz-screen')}>
      <div className="flex items-center gap-3 border-b border-brand-100 bg-white/90 px-3 py-3 backdrop-blur">
        <IconButton onClick={backToPhrases} aria-label={isDragonVein ? '解読を中断' : 'やめる'}><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={index / deck.length} color={isDragonVein ? '#8b5cf6' : '#0ea5e9'} /></div>
        <IconButton
          onClick={() => toggleNotebookItem('phrases', item.id)}
          aria-label={saved ? `${item.phrase}をマイ学習ノートから外す` : `${item.phrase}をマイ学習ノートへ保存`}
          aria-pressed={saved}
          className={saved ? 'text-amber-600' : 'text-ink/30'}
        >
          {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
        </IconButton>
        <SpeechSettingsButton compact />
        <SessionCounter
          index={index}
          total={deck.length}
          max={poolSize}
          onResize={(size, { discard }) => {
            if (discard) {
              setDeck(buildFor(size))
              setIndex(0)
              setSelected(null)
              results.current = { correct: 0, wrong: 0, unknown: 0, wrongIds: [], answerLog: [] }
            } else {
              setDeck((current) => growDeck(current, index + 1, buildFor(size), size))
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {isDragonVein && (
          <DragonVeinCipherStage
            source={source}
            studentId={selectedStudentId}
            answered={answered}
            lastAnswer={streakState.lastAnswer}
            streak={streakState.streak}
            wrongStreak={streakState.wrongStreak}
            current={index + 1}
            total={deck.length}
            className="mx-auto mt-2 w-full max-w-xl"
          />
        )}

        <div className={cx(
          'mx-auto mt-3 flex w-full max-w-xl flex-col items-center bg-white text-center shadow-card',
          isDragonVein ? 'rounded-2xl px-4 py-3' : 'rounded-[2rem] p-6',
        )}>
          <Chip color={item.kind === 'syntax' ? '#8b5cf6' : '#0ea5e9'} className="self-start">
            {item.kind === 'syntax' ? '構文' : '熟語'}
          </Chip>
          <div className="mt-2 flex items-center justify-center gap-3">
            <h2 className={cx('font-display font-extrabold tracking-tight text-ink', isDragonVein ? 'text-2xl' : 'text-3xl')}>
              {item.phrase}
            </h2>
            <SpeakButton text={phraseSpeechText(item)} size="md" />
          </div>
          <p className="mt-3 text-sm font-extrabold text-ink/55">
            {isDragonVein ? 'この文脈暗号が指す意味は？' : 'この意味は？'}
          </p>
        </div>

        <div className={cx(
          'mx-auto w-full max-w-xl',
          isDragonVein ? 'mt-2 grid grid-cols-2 gap-2' : 'mt-4 space-y-2.5',
        )}>
          {options.map((option, optionIndex) => {
            const correct = option.id === item.id
            const chosen = selected === option.id
            let tone = 'idle'
            if (answered) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
            return (
              <button
                key={option.id}
                disabled={answered}
                onClick={() => choose(option.id)}
                className={cx(
                  'flex w-full items-center gap-3 border-2 text-left font-bold transition-all',
                  isDragonVein ? 'min-h-14 rounded-xl px-3 py-2.5 text-sm' : 'rounded-2xl px-4 py-3.5',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:scale-[0.99] active:bg-brand-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                {isDragonVein && <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-900 text-xs font-black text-amber-100">{optionIndex + 1}</span>}
                <span className="flex-1">{quizMeaning(option)}</span>
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
            className={isDragonVein ? 'min-h-14 rounded-xl py-2.5' : ''}
          />
        </div>

        {answered && (
          <div className="mx-auto mt-4 w-full max-w-xl animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx('font-display text-lg font-extrabold', isCorrectPick ? 'text-emerald-600' : 'text-rose-500')}>
              {isDragonVein ? feedback : isCorrectPick ? '正解！🎉' : selected === UNKNOWN_CHOICE_ID ? '答えはこちら' : 'ざんねん…'}
            </p>
            <p className="mt-1 font-bold text-ink"><span className="font-display">{item.phrase}</span> ＝ {item.meanings.join('・')}</p>
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-50/70 p-3">
              <SpeakButton text={item.example.en} size="sm" />
              <div className="min-w-0 text-left">
                <p className="text-sm font-bold leading-relaxed text-ink">{item.example.en}</p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">
                  {longSentenceTranslation && <span className="mr-1 text-[10px] text-ink/35">自然な和訳</span>}
                  {item.example.ja}
                </p>
              </div>
            </div>
            <LongSentenceTranslation guide={longSentenceTranslation} className="mt-3" />
            <InstructorExplanation explanation={instructorExplanation} className="mt-3" />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-3 pb-3 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length
            ? isDragonVein ? '修復結果を確認' : '結果を見る'
            : '次の断片へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
