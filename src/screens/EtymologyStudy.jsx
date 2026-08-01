import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SOURCE_META,
  getRoot,
  getWord,
} from '../data/vocab.js'
import {
  buildEtymologyDeck,
  etymologyKnowledgeStatus,
  ETYMOLOGY_STATUS_META,
} from '../lib/etymologyProgress.js'
import { EtymologyFormula, EtymologyHistoryTrail } from '../components/WordBits.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, IconButton, ProgressBar } from '../components/ui.jsx'
import { ArrowRight, Check, Close } from '../components/Icons.jsx'

const wordsFor = (pack) => pack.studyIds.map(getWord).filter(Boolean)

function WordHeads({ words }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {words.map((word) => (
        <span
          key={word.id}
          className="rounded-xl bg-brand-50 px-3 py-1.5 font-display text-sm font-extrabold text-brand-700 ring-1 ring-brand-100"
        >
          {word.word}
        </span>
      ))}
    </div>
  )
}

function KnowledgePrompt({ pack, words }) {
  const lead = words[0]
  const root = pack.rootId ? getRoot(pack.rootId) : null

  if (pack.mode === 'formula') {
    const examples = words.filter((word) => word.etymology?.parts?.length).slice(0, 3)
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm font-extrabold leading-relaxed text-ink/55">
          部品の意味を前から足して、単語全体の意味を説明できますか？
        </p>
        <div className="space-y-3">
          {examples.map((word) => (
            <div key={word.id} className="rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
              <p className="font-display text-2xl font-extrabold text-ink">{word.word}</p>
              <p className="mt-2 text-sm font-black text-brand-500">
                {word.etymology.parts.map((part) => part.t).join(' ＋ ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (pack.mode === 'root') {
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm font-extrabold text-ink/55">この語根の「意味の核」は何でしょう？</p>
        <p className="font-display text-5xl font-extrabold tracking-tight text-brand-700">
          {root?.form ?? pack.rootId}
        </p>
        <WordHeads words={words.slice(0, 5)} />
      </div>
    )
  }

  if (pack.mode === 'family') {
    const anchor = getWord(pack.anchorId) ?? lead
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm font-extrabold leading-relaxed text-ink/55">
          基語から、綴りと意味がどう派生したか説明できますか？
        </p>
        <p className="font-display text-4xl font-extrabold tracking-tight text-brand-700">
          {anchor?.word}
        </p>
        <ArrowRight className="mx-auto rotate-90 text-brand-300" size={24} />
        <WordHeads words={words.filter((word) => word.id !== anchor?.id).slice(0, 6)} />
      </div>
    )
  }

  const formation = ETYMOLOGY_FORMATION_META[pack.formationKey]
  const source = ETYMOLOGY_SOURCE_META[pack.sourceKey]
  const domain = ETYMOLOGY_DOMAIN_META[pack.domainKey]
  return (
    <div className="space-y-5 text-center">
      <p className="text-sm font-extrabold leading-relaxed text-ink/55">
        この束の3つの共通軸と、各語が現在義へ進んだ道筋を説明できますか？
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ['成り立ち', formation?.emoji, formation?.short],
          ['出発言語', source?.emoji, source?.short],
          ['意味分野', domain?.emoji, pack.fieldLabel ?? domain?.label],
        ].map(([label, emoji, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 px-2 py-2 ring-1 ring-slate-100">
            <p className="text-[9px] font-extrabold text-ink/35">{label}</p>
            <p className="mt-1 truncate text-[10px] font-extrabold text-ink/70">
              {emoji} {value}
            </p>
          </div>
        ))}
      </div>
      <p className="font-display text-4xl font-extrabold tracking-tight text-brand-700">
        {lead?.word}
      </p>
      <WordHeads words={words.slice(1, 5)} />
      <p className="text-[11px] font-bold leading-relaxed text-amber-700">
        同じ語根とは限りません。共通するのは上の3軸です。
      </p>
    </div>
  )
}

function KnowledgeAnswer({ pack, words }) {
  const root = pack.rootId ? getRoot(pack.rootId) : null

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <p className="text-[10px] font-extrabold tracking-wide text-emerald-600">このカードの要点</p>
        <h2 className="mt-1 font-display text-lg font-extrabold leading-snug text-ink">
          {pack.title}
        </h2>
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
          {root ? `${root.form} ＝ ${root.meaning}` : pack.description}
        </p>
      </div>

      {pack.caution && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-amber-800 ring-1 ring-amber-100">
          {pack.caution}
        </p>
      )}

      <div className="space-y-2">
        {words.map((word) => (
          <div key={word.id} className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-extrabold text-ink">{word.word}</span>
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink/50">
                {word.meaning}
              </span>
            </div>
            {pack.mode === 'formula' ? (
              <div className="mt-2">
                <EtymologyFormula word={word} compact />
              </div>
            ) : pack.mode === 'origin' ? (
              <div className="mt-2">
                <EtymologyHistoryTrail word={word} compact />
              </div>
            ) : (
              word.etymology?.note && (
                <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/55">
                  {word.etymology.note}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function EtymologyStudyScreen() {
  const rootRef = useRef(null)
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const reviewEtymology = useStore((state) => state.reviewEtymology)
  const srsAtStart = useRef(useStore.getState().etymologySrs)
  const [deck] = useState(() =>
    buildEtymologyDeck(ETYMOLOGY_PACKS, srsAtStart.current, {
      mode: params.mode ?? 'all',
      status: params.status ?? 'priority',
      packIds: params.packIds,
      size: params.size,
    }),
  )
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)
  const results = useRef({ remembered: 0, forgot: 0 })
  const pack = deck[index]

  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [index])

  if (!deck.length) {
    return (
      <div ref={rootRef} className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">この条件の語源カードはありません</p>
        <p className="text-sm font-bold text-ink/50">別の分類や進捗状態を選んでください。</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  if (done) {
    return (
      <div ref={rootRef} className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check size={42} />
        </span>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">語源カードを完了</p>
          <p className="mt-1 text-sm font-bold text-ink/50">
            覚えた {results.current.remembered}・まだ {results.current.forgot}
          </p>
        </div>
        <p className="rounded-2xl bg-brand-50 px-4 py-3 text-xs font-bold leading-relaxed text-brand-700">
          結果は単語とは別の「語源知識」として保存しました。次の復習日も自動で決まります。
        </p>
        <Button full size="lg" onClick={back}>語源マップへ戻る</Button>
      </div>
    )
  }

  const words = wordsFor(pack)
  const mode = ETYMOLOGY_MODE_META[pack.mode]
  const beforeStatus = etymologyKnowledgeStatus(srsAtStart.current[pack.id])

  const answer = (remembered) => {
    reviewEtymology(pack.id, remembered ? 'remembered' : 'forgot')
    if (remembered) results.current.remembered += 1
    else results.current.forgot += 1

    if (index + 1 >= deck.length) {
      setDone(true)
      return
    }
    setIndex((current) => current + 1)
    setRevealed(false)
  }

  return (
    <div ref={rootRef} className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="語源カードをやめる">
          <Close size={22} />
        </IconButton>
        <div className="flex-1">
          <ProgressBar value={index / deck.length} color="#7c3aed" />
        </div>
        <SpeechSettingsButton compact />
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">
          {index + 1}/{deck.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="min-h-full rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-700">
              <span>{mode.emoji}</span>{mode.label}
            </span>
            <span className="text-[10px] font-extrabold text-ink/40">
              開始時：{ETYMOLOGY_STATUS_META[beforeStatus].label}
            </span>
          </div>

          <div className="mt-7">
            <KnowledgePrompt pack={pack} words={words} />
          </div>

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-7 flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 py-7 text-brand-500 active:bg-brand-50"
            >
              <span className="text-sm font-extrabold">タップして要点を見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </button>
          ) : (
            <div className="mt-6 animate-slide-up">
              <KnowledgeAnswer pack={pack} words={words} />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!revealed ? (
          <Button full size="lg" onClick={() => setRevealed(true)}>
            要点を見る
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>
              まだ 🤔
            </Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>
              覚えた 👍
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
