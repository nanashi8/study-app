import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getKoten } from '../data/koten.js'
import { getKotenGrammar } from '../data/koten-grammar.js'
import {
  getKotenInterpretation,
  KOTEN_INTERPRETATION_FOCUS,
} from '../data/koten-interpretations.js'
import { Button, Chip, cx, IconButton, ProgressBar } from '../components/ui.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { KotenText, KotenWord } from '../components/KotenFurigana.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  Check,
  Close,
} from '../components/Icons.jsx'
import { growDeck } from '../lib/session.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildKotenInterpretationInstructorExplanation } from '../lib/instructorExplanations.js'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// size=0 は「絞り込みなし」。
function buildDeck(ids, size = 12, preserveOrder = false) {
  const selected = (ids ?? []).map(getKotenInterpretation).filter(Boolean)
  const items = preserveOrder ? selected : shuffle(selected)
  return size > 0 ? items.slice(0, size) : items
}

function SaveButton({ saved, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={saved ? `${label}を登録から外す` : `${label}を登録する`}
      aria-pressed={saved}
      className={cx(
        'flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-extrabold transition-colors active:scale-95',
        saved ? 'bg-amber-100 text-amber-700' : 'bg-paper text-ink/45',
      )}
    >
      {saved ? <BookmarkFilled size={16} /> : <Bookmark size={16} />}
      {saved ? '登録済み' : '登録'}
    </button>
  )
}

export function KotenInterpretationQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const review = useStore((state) => state.reviewKotenInterpretation)
  const wordList = useStore((state) => state.kotenWordList)
  const grammarList = useStore((state) => state.kotenGrammarList)
  const toggleWord = useStore((state) => state.toggleKotenWordList)
  const toggleGrammar = useStore((state) => state.toggleKotenGrammarList)

  const [run, setRun] = useState(0)
  const [poolSize] = useState(() => buildDeck(params.ids, 0, params.preserveOrder).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildDeck(params.ids, params.size ?? sessionSize, params.preserveOrder))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)

  const item = deck[index]
  const choices = useMemo(() => (item ? shuffle(item.choices) : []), [item?.id, run]) // eslint-disable-line react-hooks/exhaustive-deps
  const answered = selected !== null
  const isCorrect = answered && selected === item?.answer

  // コンテンツ画面の「戻る」は履歴でなく、短文解釈の内容選択画面へ。
  const backToKotenInterpretationList = () => params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo('kotenInterpretationList')

  const restart = () => {
    const nextRun = run + 1
    setRun(nextRun)
    setDeck(buildDeck(params.ids, deck.length, params.preserveOrder))
    setIndex(0)
    setSelected(null)
    setCorrect(0)
    setDone(false)
  }

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📜</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる短文がありません</p>
        <Button onClick={backToKotenInterpretationList}>戻る</Button>
      </div>
    )
  }

  if (done) {
    const percent = Math.round((correct / deck.length) * 100)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">{percent >= 80 ? '🏆' : percent >= 50 ? '👏' : '📚'}</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">
            {correct} / {deck.length} 正解
          </p>
          <p className="mt-1 text-sm font-bold text-ink/55">正答率 {percent}%</p>
        </div>
        <p className="max-w-xs text-sm font-bold leading-relaxed text-ink/55">
          登録した単語と文法は「登録リスト」からいつでも見直せます。
        </p>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={backToKotenInterpretationList}>戻る</Button>
        </div>
      </div>
    )
  }

  const choose = (choice) => {
    if (answered) return
    setSelected(choice)
    const ok = choice === item.answer
    review(item.id, choice === UNKNOWN_CHOICE_ID ? 'unknown' : ok ? 'correct' : 'wrong')
    if (ok) setCorrect((value) => value + 1)
  }

  const next = () => {
    if (index + 1 >= deck.length) {
      setDone(true)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
  }

  const focus = KOTEN_INTERPRETATION_FOCUS[item.focus]
  const words = item.wordIds.map(getKoten).filter(Boolean)
  const grammarItems = item.grammarIds.map(getKotenGrammar).filter(Boolean)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={backToKotenInterpretationList} aria-label="短文解釈をやめる">
          <Close size={22} />
        </IconButton>
        <div className="flex-1">
          <ProgressBar value={index / deck.length} color="#d97706" />
        </div>
        <SpeechSettingsButton compact />
        <SessionCounter
          index={index}
          total={deck.length}
          max={poolSize}
          onResize={(size, { discard }) => {
            if (discard) {
              setRun((current) => current + 1)
              setDeck(buildDeck(params.ids, size, params.preserveOrder))
              setIndex(0)
              setSelected(null)
              setCorrect(0)
              setDone(false)
            } else {
              setDeck((current) => growDeck(current, index + 1, buildDeck(params.ids, size, params.preserveOrder), size))
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-5">
        <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={focus.color}>{focus.emoji} {focus.label}</Chip>
            <span className="text-[11px] font-bold text-ink/40">{item.source}</span>
          </div>
          <p className="mt-4 font-serif text-[1.45rem] font-bold leading-[1.85] tracking-wide text-ink">
            <KotenText
              readings={words.map((word) => [word.word, word.kana])}
            >
              {item.text}
            </KotenText>
          </p>
          <p className="mt-4 rounded-2xl bg-white/75 p-3 text-sm font-extrabold leading-relaxed text-ink/65">
            <KotenText>{item.question}</KotenText>
          </p>
        </div>

        <div className="mt-4 space-y-2.5">
          {choices.map((choice) => {
            const correctChoice = choice === item.answer
            const chosen = choice === selected
            let tone = 'idle'
            if (answered) {
              if (correctChoice) tone = 'correct'
              else if (chosen) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                key={choice}
                disabled={answered}
                onClick={() => choose(choice)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-bold leading-relaxed transition-all',
                  tone === 'idle' && 'border-amber-100 bg-white text-ink active:scale-[0.99] active:bg-amber-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/30',
                )}
              >
                <span className="min-w-0 flex-1"><KotenText>{choice}</KotenText></span>
                {tone === 'correct' && <Check size={20} className="mt-0.5 shrink-0 text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="mt-0.5 shrink-0 text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
          />
        </div>

        {answered && (
          <div className="mt-4 space-y-3 animate-slide-up">
            <div className="rounded-3xl bg-white p-4 shadow-card">
              <p className={cx('font-display text-lg font-extrabold', isCorrect ? 'text-emerald-600' : 'text-rose-500')}>
                {isCorrect ? '正解！' : selected === UNKNOWN_CHOICE_ID ? '答えを確認しよう' : 'ここを確認しよう'}
              </p>
              <p className="mt-2 text-sm font-bold leading-relaxed text-ink">
                <KotenText>{item.translation}</KotenText>
              </p>
              <InstructorExplanation
                explanation={buildKotenInterpretationInstructorExplanation(item, selected)}
                className="mt-3"
                renderText={(text) => <KotenText>{text}</KotenText>}
              />
            </div>

            <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">📖</span>
                <h3 className="font-display font-extrabold text-sky-900">古典単語</h3>
              </div>
              <p className="mb-3 text-sm font-bold leading-relaxed text-sky-950/70">
                <KotenText>{item.vocabTip}</KotenText>
              </p>
              <div className="space-y-2">
                {words.map((word) => (
                  <div key={word.id} className="flex items-center gap-2 rounded-2xl bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-extrabold leading-relaxed text-ink">
                        <KotenWord word={word} />
                      </div>
                      <div className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">
                        <KotenText>{word.meanings.join('・')}</KotenText>
                      </div>
                    </div>
                    <SaveButton
                      saved={wordList.includes(word.id)}
                      onClick={() => toggleWord(word.id)}
                      label={word.word}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">🧩</span>
                <h3 className="font-display font-extrabold text-amber-900">古典文法</h3>
              </div>
              <p className="mb-3 text-sm font-bold leading-relaxed text-amber-950/70">
                <KotenText>{item.grammarTip}</KotenText>
              </p>
              <div className="space-y-2">
                {grammarItems.map((grammar) => (
                  <div key={grammar.id} className="flex items-center gap-2 rounded-2xl bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-extrabold text-ink">{grammar.title}</div>
                      <div className="mt-0.5 text-xs font-bold text-ink/55">{grammar.meaning}</div>
                    </div>
                    <SaveButton
                      saved={grammarList.includes(grammar.id)}
                      onClick={() => toggleGrammar(grammar.id)}
                      label={grammar.title}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-purple-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏯</span>
                <h3 className="font-display font-extrabold leading-relaxed text-purple-900">
                  <KotenText>{item.culture.title}</KotenText>
                </h3>
              </div>
              <p className="mt-2 text-sm font-bold leading-relaxed text-purple-950/70">
                <KotenText>{item.culture.body}</KotenText>
              </p>
              <button
                onClick={() => navigate('kotenCulture')}
                className="mt-3 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-xs font-extrabold text-purple-800"
              >
                古典常識で覚え直す
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-amber-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の短文へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
