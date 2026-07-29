import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getKotenCulture,
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_LEVELS,
} from '../data/koten-culture.js'
import { Button, Chip, ProgressBar, IconButton } from '../components/ui.jsx'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  Close,
  Eye,
  EyeOff,
  Lightbulb,
} from '../components/Icons.jsx'
import { KotenText } from '../components/KotenFurigana.jsx'

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
  return shuffle(unique.map(getKotenCulture).filter(Boolean)).slice(0, SESSION_SIZE)
}

export function KotenCultureStudyScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const reviewCulture = useStore((state) => state.reviewKotenCulture)
  const savedIds = useStore((state) => state.kotenCultureList)
  const toggleSaved = useStore((state) => state.toggleKotenCultureList)
  const settings = useStore((state) => state.settings)
  const setSetting = useStore((state) => state.setSetting)
  const revealAll = settings.revealAnswers

  const [deck, setDeck] = useState(() => buildDeck(params.ids))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  const [done, setDone] = useState(false)
  const [remembered, setRemembered] = useState(0)

  const item = deck[index]
  const category = item
    ? KOTEN_CULTURE_CATEGORIES.find((candidate) => candidate.id === item.category)
    : null
  const level = item ? KOTEN_CULTURE_LEVELS[item.level] : null
  const saved = item ? savedIds.includes(item.id) : false

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🏯</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる古典常識がありません</p>
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
    reviewCulture(item.id, ok ? 'remembered' : 'forgot')
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
        <div className="text-6xl">🏯</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">古典常識カード完了</p>
          <p className="mt-1 text-sm font-bold text-ink/55">
            {deck.length}テーマのうち {remembered}テーマを「覚えた」
          </p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={back}>常識へ戻る</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-violet-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label="学習をやめる">
            <Close size={22} />
          </IconButton>
          <div className="min-w-0 flex-1">
            <ProgressBar value={index / deck.length} color="#7c3aed" />
            <p className="mt-1 truncate text-[10px] font-extrabold text-ink/40">
              {params.title ?? '古典常識を覚える'}
            </p>
          </div>
          <IconButton
            onClick={() => {
              const next = !revealAll
              setSetting('revealAnswers', next)
              if (next) setFlipped(true)
            }}
            className={revealAll ? 'text-violet-600' : 'text-ink/35'}
            aria-label={revealAll ? '答えを隠してタップ式にする' : '答えを開いたまま見せる'}
          >
            {revealAll ? <Eye size={21} /> : <EyeOff size={21} />}
          </IconButton>
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
            <div className="flex flex-wrap gap-2">
              {category && <Chip color={category.color}>{category.emoji} {category.label}</Chip>}
              {level && <Chip color={level.color}>{level.label}</Chip>}
            </div>
            <IconButton
              onClick={(event) => {
                event.stopPropagation()
                toggleSaved(item.id)
              }}
              className={saved ? '-mr-2 -mt-2 text-violet-600' : '-mr-2 -mt-2 text-ink/25'}
              aria-label={saved ? `${item.title}を登録から外す` : `${item.title}を登録する`}
              aria-pressed={saved}
            >
              {saved ? <BookmarkFilled size={22} /> : <Bookmark size={22} />}
            </IconButton>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-violet-600">CLASSICAL CULTURE</p>
            <h1 className="mt-2 pt-2 font-display text-2xl font-extrabold leading-relaxed text-ink">
              <KotenText>{item.title}</KotenText>
            </h1>
            <p className="mt-3 text-sm font-extrabold leading-relaxed text-ink/65">
              <KotenText>{item.prompt}</KotenText>
            </p>
          </div>

          {!flipped ? (
            <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 py-9 text-violet-600">
              <span className="text-sm font-extrabold">思い出してからタップ</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-6 space-y-3 animate-slide-up">
              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-[10px] font-extrabold tracking-wide text-violet-600">まず一言で</p>
                <p className="mt-1 font-display text-lg font-extrabold leading-relaxed text-ink">
                  <KotenText>{item.core}</KotenText>
                </p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-[10px] font-extrabold tracking-wide text-sky-600">背景をつなぐ</p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65">
                  <KotenText>{item.detail}</KotenText>
                </p>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-white p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-violet-700">
                  <Lightbulb size={16} />
                  <span className="text-[10px] font-extrabold tracking-wide">入試本文の読み方</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-ink/65">
                  <KotenText>{item.examTip}</KotenText>
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-serif text-base font-bold leading-relaxed text-ink">
                  <KotenText>{item.scene.text}</KotenText>
                </p>
                <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/50">
                  <KotenText>{item.scene.note}</KotenText>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
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
