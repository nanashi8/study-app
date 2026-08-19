import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
} from '../data/vocab.js'
import {
  buildEtymologyDeck,
} from '../lib/etymologyProgress.js'
import { learningStatusForSrsEntry } from '../lib/contentProgress.js'
import { growDeck } from '../lib/session.js'
import {
  EtymologyKnowledgeAnswer,
  EtymologyKnowledgePrompt,
  wordsForEtymologyPack,
} from '../components/EtymologyKnowledge.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { Button, IconButton, ProgressBar } from '../components/ui.jsx'
import { Bookmark, BookmarkFilled, Check, Close } from '../components/Icons.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

const LEARNING_STATUS_LABEL = {
  learned: '学習済',
  reviewing: '復習中',
  unlearned: '未学習',
}

export function EtymologyStudyScreen() {
  const rootRef = useRef(null)
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const reviewEtymology = useStore((state) => state.reviewEtymology)
  const settings = useStore((state) => state.settings)
  // 暗記モード：ONなら毎カード、タップせず最初から答えと説明を開いて見せる。
  const revealAll = settings.revealAnswers
  const toggleNotebookItem = useStore((state) => state.toggleNotebookItem)
  const learningNotebook = useStore((state) => state.learningNotebook)
  const srsAtStart = useRef(useStore.getState().etymologySrs)
  // 実際に出せる枚数を数えて、1回の枚数の選択肢に反映する。
  const buildFor = (size) =>
    buildEtymologyDeck(ETYMOLOGY_PACKS, srsAtStart.current, {
      mode: params.mode ?? 'all',
      status: params.status ?? 'priority',
      packIds: params.packIds,
      size,
    })
  const [poolSize] = useState(() => buildFor(Infinity).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildFor(params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(revealAll)
  const [done, setDone] = useState(false)
  const results = useRef({ remembered: 0, forgot: 0 })
  const pack = deck[index]

  // コンテンツ画面の「戻る」は履歴でなく、語源カードの種類を選ぶ画面へ。
  const backToEtymologyParent = () => (
    params.packIds?.length === 1
      ? navigate('etymologyPack', { packId: params.packIds[0] })
      : navigate('roots')
  )

  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [index])

  if (!deck.length) {
    return (
      <div ref={rootRef} className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">この条件の語源カードはありません</p>
        <p className="text-sm font-bold text-ink/50">別の分類や進捗状態を選んでください。</p>
        <Button onClick={backToEtymologyParent}>もどる</Button>
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
          <p className="font-display text-2xl font-extrabold text-ink">語源の学習完了</p>
          <p className="mt-1 text-sm font-bold text-ink/50">
            覚えた {results.current.remembered}・もう一度 {results.current.forgot}
          </p>
        </div>
        <p className="rounded-2xl bg-brand-50 px-4 py-3 text-xs font-bold leading-relaxed text-brand-700">
          結果は英単語の暗記記録とは分けて、語源の学習記録に保存しました。
        </p>
        <Button full size="lg" onClick={backToEtymologyParent}>語源カードへ戻る</Button>
      </div>
    )
  }

  const words = wordsForEtymologyPack(pack)
  const mode = ETYMOLOGY_MODE_META[pack.mode]
  const beforeStatus = learningStatusForSrsEntry(srsAtStart.current[pack.id])
  const saved = learningNotebook?.entries?.[`etymology:${pack.id}`]?.saved === true

  const answer = (remembered) => {
    reviewEtymology(pack.id, remembered ? 'remembered' : 'forgot')
    if (remembered) results.current.remembered += 1
    else results.current.forgot += 1

    if (index + 1 >= deck.length) {
      setDone(true)
      return
    }
    setIndex((current) => current + 1)
    setRevealed(revealAll)
  }

  return (
    <div ref={rootRef} className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 px-3 py-3">
        <IconButton onClick={backToEtymologyParent} aria-label="語源カードをやめる">
          <Close size={22} />
        </IconButton>
        <div className="flex-1">
          <ProgressBar value={index / deck.length} color="#7c3aed" />
        </div>
        <IconButton
          onClick={() => toggleNotebookItem('etymology', pack.id)}
          aria-label={saved ? `${pack.title}をマイ学習ノートから外す` : `${pack.title}をマイ学習ノートへ保存`}
          aria-pressed={saved}
          className={saved ? 'text-amber-600' : 'text-ink/30'}
        >
          {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
        </IconButton>
        <RevealAnswersToggle label="答え" onChange={(on) => on && setRevealed(true)} />
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
              setRevealed(revealAll)
              setDone(false)
              results.current = { remembered: 0, forgot: 0 }
            } else {
              setDeck((current) => growDeck(current, index + 1, buildFor(size), size))
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="min-h-full rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-700">
              <span>{mode.emoji}</span>{mode.label}
            </span>
            <span className="text-xs font-extrabold text-ink/45">
              学習前：{LEARNING_STATUS_LABEL[beforeStatus]}
            </span>
          </div>

          <p className="mt-4 rounded-xl bg-violet-50 px-3 py-2 text-center text-xs font-extrabold leading-relaxed text-violet-700">
            形を見る → 意味をつなぐ → 関連語で確かめる
          </p>
          {!revealed ? (
            <div className="mt-7">
              <EtymologyKnowledgePrompt pack={pack} />
            </div>
          ) : (
            <div className="mt-5 animate-slide-up">
              <EtymologyKnowledgeAnswer pack={pack} words={words} />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        {!revealed ? (
          <Button full size="lg" onClick={() => setRevealed(true)}>
            答えと説明を見る
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
