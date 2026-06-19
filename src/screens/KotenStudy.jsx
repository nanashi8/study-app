import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getKoten } from '../data/koten.js'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, ArrowRight, Eye, EyeOff, Lightbulb } from '../components/Icons.jsx'

// 渡された id 配列から学習デッキを作る（1回だけシャッフル）。
function buildKotenDeck(ids, seed) {
  const words = (ids ?? []).map(getKoten).filter(Boolean)
  // seed を変えるたびに並べ替え（「もう一度」用）。Math.random でよい。
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[words[i], words[j]] = [words[j], words[i]]
  }
  return words
}

export function KotenStudyScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const navigate = useStore((s) => s.navigate)
  const reviewKoten = useStore((s) => s.reviewKoten)
  const settings = useStore((s) => s.settings)
  const setSetting = useStore((s) => s.setSetting)
  const revealAll = settings.revealAnswers

  const [seed, setSeed] = useState(0)
  const [deck, setDeck] = useState(() => buildKotenDeck(params.ids, 0))
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(revealAll)
  const [done, setDone] = useState(false)
  const [remembered, setRemembered] = useState(0)

  const word = deck[i]

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📜</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる語がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const restart = () => {
    const next = seed + 1
    setSeed(next)
    setDeck(buildKotenDeck(params.ids, next))
    setI(0)
    setFlipped(revealAll)
    setDone(false)
    setRemembered(0)
  }

  const answer = (ok) => {
    reviewKoten(word.id, ok ? 'remembered' : 'forgot')
    if (ok) setRemembered((n) => n + 1)
    if (i + 1 >= deck.length) setDone(true)
    else {
      setI(i + 1)
      setFlipped(revealAll)
    }
  }

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">🎉</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">おつかれさま！</p>
          <p className="mt-1 text-sm font-bold text-ink/55">
            {deck.length}語のうち {remembered}語を「覚えた」
          </p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={back}>もどる</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー（進捗） */}
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる">
          <Close size={22} />
        </IconButton>
        <div className="flex-1">
          <ProgressBar value={i / deck.length} color="#f59e0b" />
        </div>
        <IconButton
          onClick={() => {
            const next = !revealAll
            setSetting('revealAnswers', next)
            if (next) setFlipped(true)
          }}
          className={revealAll ? 'text-amber-500' : 'text-ink/35'}
          aria-label={revealAll ? '答えを隠してタップ式にする' : '答えを開いたまま見せる'}
        >
          {revealAll ? <Eye size={22} /> : <EyeOff size={22} />}
        </IconButton>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">
          {i + 1}/{deck.length}
        </span>
      </div>

      {/* カード */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div
          key={word.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-6 shadow-card"
        >
          <div className="flex items-start justify-between">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
              {word.pos}
            </span>
          </div>

          <div className="mt-2 flex flex-col items-center text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
            {word.kana && word.kana !== word.word && (
              <p className="mt-1 text-sm font-bold text-ink/45">{word.kana}</p>
            )}
          </div>

          {!flipped ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-amber-200 py-8 text-amber-500">
              <span className="text-sm font-extrabold">タップして意味を見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-5 space-y-4 animate-slide-up">
              {/* 意味 */}
              <div className="rounded-2xl bg-amber-50 p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-amber-500">意味</div>
                <div className="mt-0.5 font-display text-xl font-extrabold text-ink">
                  {word.meanings.join('・')}
                </div>
              </div>

              {/* ポイント */}
              {word.note && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-amber-100">
                  <div className="mb-1.5 flex items-center gap-1.5 text-amber-600">
                    <Lightbulb size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wide">覚え方・ポイント</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-ink/70">{word.note}</p>
                </div>
              )}

              {/* 用例 */}
              {word.example && (
                <div className="rounded-2xl bg-white p-3 ring-1 ring-amber-100">
                  <p className="font-bold text-ink">{word.example.ja}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55">{word.example.gendai}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* フッター操作 */}
      <div className="shrink-0 border-t border-amber-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!flipped ? (
          <Button full size="lg" onClick={() => setFlipped(true)}>
            意味を見る
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
