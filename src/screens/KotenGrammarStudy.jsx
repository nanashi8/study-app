import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getKotenGrammar,
  KOTEN_GRAMMAR_CATEGORIES,
} from '../data/koten-grammar.js'
import { Button, Chip, ProgressBar, IconButton } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  Close,
  Lightbulb,
} from '../components/Icons.jsx'

const SESSION_SIZE = 20

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const picked = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[picked]] = [result[picked], result[index]]
  }
  return result
}

function buildDeck(ids) {
  const unique = [...new Set(ids ?? [])]
  return shuffle(unique.map(getKotenGrammar).filter(Boolean)).slice(0, SESSION_SIZE)
}

export function KotenGrammarStudyScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const reviewGrammar = useStore((state) => state.reviewKotenGrammar)
  const savedIds = useStore((state) => state.kotenGrammarList)
  const toggleSaved = useStore((state) => state.toggleKotenGrammarList)
  const settings = useStore((state) => state.settings)
  const revealAll = settings.revealAnswers

  const [deck, setDeck] = useState(() => buildDeck(params.ids))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  const [done, setDone] = useState(false)
  const [remembered, setRemembered] = useState(0)

  const item = deck[index]
  const category = item
    ? KOTEN_GRAMMAR_CATEGORIES.find((candidate) => candidate.id === item.category)
    : null
  const saved = item ? savedIds.includes(item.id) : false

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる文法がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const restart = () => {
    setDeck(buildDeck(params.ids))
    setIndex(0)
    setFlipped(revealAll)
    setDone(false)
    setRemembered(0)
  }

  const answer = (ok) => {
    reviewGrammar(item.id, ok ? 'remembered' : 'forgot')
    if (ok) setRemembered((count) => count + 1)
    if (index + 1 >= deck.length) setDone(true)
    else {
      setIndex((current) => current + 1)
      setFlipped(revealAll)
    }
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">🪶</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">暗記カード完了</p>
          <p className="mt-1 text-sm font-bold text-ink/55">
            {deck.length}項目のうち {remembered}項目を「覚えた」
          </p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={back}>文法へ戻る</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-amber-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label="学習をやめる">
            <Close size={22} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <ProgressBar value={index / deck.length} color="#d97706" />
            <p className="mt-1 truncate text-[10px] font-extrabold text-ink/40">
              {params.title ?? '古典文法を覚える'}
            </p>
          </div>
          <SpeechSettingsButton compact />
          <span className="w-12 text-right text-sm font-extrabold text-ink/50">
            {index + 1}/{deck.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
        <div
          key={item.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            {category && <Chip color={category.color}>{category.emoji} {category.label}</Chip>}
            <IconButton
              onClick={(event) => {
                event.stopPropagation()
                toggleSaved(item.id)
              }}
              className={saved ? '-mr-2 -mt-2 text-amber-600' : '-mr-2 -mt-2 text-ink/25'}
              aria-label={saved ? `${item.title}を登録文法から外す` : `${item.title}を登録文法へ追加`}
              aria-pressed={saved}
            >
              {saved ? <BookmarkFilled size={22} /> : <Bookmark size={22} />}
            </IconButton>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-amber-600">CLASSICAL GRAMMAR</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-snug text-ink">
              {item.title}
            </h1>
            <p className="mt-3 text-sm font-bold leading-relaxed text-ink/45">
              意味・接続・活用を思い出そう
            </p>
          </div>

          {!flipped ? (
            <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 py-9 text-amber-600">
              <span className="text-sm font-extrabold">タップして答えを見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-6 space-y-3 animate-slide-up">
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-[10px] font-extrabold tracking-wide text-amber-600">意味・働き</p>
                <p className="mt-1 font-display text-lg font-extrabold leading-relaxed text-ink">
                  {item.meaning}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-3.5">
                  <p className="text-[10px] font-extrabold tracking-wide text-sky-600">接続</p>
                  <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink/75">
                    {item.connection}
                  </p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-3.5">
                  <p className="text-[10px] font-extrabold tracking-wide text-violet-600">活用・形</p>
                  <p className="mt-1 text-sm font-extrabold leading-relaxed text-ink/75">
                    {item.forms}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-amber-700">
                  <Lightbulb size={16} />
                  <span className="text-[10px] font-extrabold tracking-wide">入試の見抜き方</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-ink/65">{item.summary}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-serif text-base font-bold leading-relaxed text-ink">{item.example.ja}</p>
                <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/50">
                  {item.example.gendai}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-amber-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!flipped ? (
          <Button full size="lg" onClick={() => setFlipped(true)}>
            答えを見る
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>
              まだ🤔
            </Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>
              覚えた👍
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
