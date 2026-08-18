import { useMemo, useState } from 'react'
import { useStore, isDue } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getWritingGrammar } from '../data/writing.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, Chip, IconButton, ProgressBar } from '../components/ui.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { growDeck } from '../lib/session.js'
import {
  ArrowRight,
  Check,
  Close,
  Eye,
  Refresh,
} from '../components/Icons.jsx'

export function WritingGrammarReviewScreen() {
  const back = useStore((s) => s.back)
  const navigate = useStore((s) => s.navigate)
  const myGrammarList = useStore((s) => s.myGrammarList)
  const srs = useStore((s) => s.srs)
  const review = useStore((s) => s.review)
  // 復習どきのカードを優先し、なければ保存カード全体から出す。size=0 は「絞り込みなし」。
  const buildFor = (size) => {
    const items = useStore
      .getState()
      .myGrammarList.map(getWritingGrammar)
      .filter(Boolean)
    const due = items.filter((item) =>
      isDue(useStore.getState().srs[item.id]),
    )
    const pool = due.length ? due : items
    return size > 0 ? pool.slice(0, size) : pool
  }
  const [poolSize] = useState(() => buildFor(0).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildFor(sessionSize))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState({ remembered: 0, forgot: 0 })

  const item = deck[index]
  const level = item ? getLevel(item.level) : null
  const finished = deck.length > 0 && index >= deck.length

  const savedCount = useMemo(
    () =>
      myGrammarList
        .map(getWritingGrammar)
        .filter(Boolean)
        .filter((grammar) => isDue(srs[grammar.id])).length,
    [myGrammarList, srs],
  )

  if (!deck.length) {
    return (
      <div className="relative flex min-h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="absolute right-3 top-3">
          <SpeechSettingsButton compact />
        </div>
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">
          復習する文法がありません
        </p>
        <Button onClick={() => navigate('writing')}>英作文へ</Button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="relative flex min-h-full flex-col bg-gradient-to-b from-violet-700 to-brand-900 px-5 pb-10 pt-8 text-white">
        <div className="absolute right-3 top-3">
          <SpeechSettingsButton compact inverse />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/15 text-5xl shadow-pop">
            🧠
          </div>
          <p className="mt-5 text-xs font-extrabold tracking-[0.2em] text-violet-200">
            REVIEW COMPLETE
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold">
            文法の型を復習しました
          </h1>
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-display text-3xl font-extrabold">
                {results.remembered}
              </p>
              <p className="text-xs font-bold text-white/60">わかった</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-display text-3xl font-extrabold">
                {results.forgot}
              </p>
              <p className="text-xs font-bold text-white/60">もう一度</p>
            </div>
          </div>
          <p className="mt-4 text-xs font-bold text-white/55">
            現在の復習どき：{savedCount}項目
          </p>
        </div>
        <Button
          className="bg-white text-violet-700 shadow-none active:bg-violet-50"
          full
          size="lg"
          onClick={() => navigate('myGrammar')}
        >
          マイ文法へ <ArrowRight size={18} />
        </Button>
      </div>
    )
  }

  const answer = (result) => {
    review(item.id, result, 'grammar')
    setResults((current) => ({
      ...current,
      [result === 'remembered' ? 'remembered' : 'forgot']:
        current[result === 'remembered' ? 'remembered' : 'forgot'] + 1,
    }))
    setIndex((value) => value + 1)
    setRevealed(false)
  }

  return (
    <div className="flex min-h-full flex-col bg-paper">
      <header className="flex items-center gap-3 px-3 pb-3 pt-2">
        <IconButton onClick={back} aria-label="復習を終わる">
          <Close size={21} />
        </IconButton>
        <ProgressBar
          className="flex-1"
          value={index / deck.length}
          color={level.color}
        />
        <SpeechSettingsButton compact />
        <SessionCounter
          index={index}
          total={deck.length}
          max={poolSize}
          label="カード"
          onResize={(size, { discard }) => {
            if (discard) {
              setDeck(buildFor(size))
              setIndex(0)
              setRevealed(false)
              setResults({ remembered: 0, forgot: 0 })
            } else {
              setDeck((current) => growDeck(current, index + 1, buildFor(size), size))
            }
          }}
        />
      </header>

      <main className="flex flex-1 flex-col px-4 pb-4">
        <div className="mb-3 text-center">
          <Chip color={level.color}>
            {level.emoji} {level.label}
          </Chip>
          <p className="mt-2 text-xs font-extrabold tracking-[0.14em] text-ink/38">
            この型を説明できる？
          </p>
        </div>

        <div
          className="relative flex min-h-[25rem] flex-1 flex-col overflow-hidden rounded-[2rem] bg-white p-5 shadow-card"
          style={{ borderTop: `6px solid ${level.color}` }}
        >
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold text-ink">
              {item.title}
            </h1>
            <p className="mt-3 rounded-2xl bg-brand-50 px-4 py-3 font-mono text-base font-extrabold text-brand-700">
              {item.pattern}
            </p>
          </div>

          {!revealed ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Eye size={28} />
              </div>
              <p className="mt-4 max-w-xs text-sm font-bold leading-relaxed text-ink/50">
                形の意味と、語順のポイントを頭の中で説明してから答えを開きます。
              </p>
            </div>
          ) : (
            <div className="mt-5 animate-slide-up">
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-[10px] font-extrabold tracking-wider text-amber-600">
                  POINT
                </p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-amber-950/80">
                  {item.explanation}
                </p>
              </div>
              <div className="mt-3 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <SpeakButton text={item.example.en} size="sm" />
                <div>
                  <p className="font-display text-base font-extrabold leading-relaxed text-ink">
                    {item.example.en}
                  </p>
                  <p className="mt-1 text-xs font-bold text-ink/45">
                    {item.example.ja}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="border-t border-brand-100 bg-white/92 p-4 pb-4 backdrop-blur">
        {!revealed ? (
          <Button full size="lg" onClick={() => setRevealed(true)}>
            <Eye size={18} /> 解説を見る
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="hint"
              size="lg"
              onClick={() => answer('forgot')}
            >
              <Refresh size={17} /> もう一度
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => answer('remembered')}
            >
              <Check size={17} /> わかった
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
