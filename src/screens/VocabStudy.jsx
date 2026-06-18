import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDeck } from '../lib/session.js'
import { relatedByEtymology } from '../data/vocab.js'
import { speak } from '../lib/tts.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { EtymologyBlock } from '../components/WordBits.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, Bookmark, BookmarkFilled, ArrowRight, Lightbulb } from '../components/Icons.jsx'

export function VocabStudyScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)

  const srsAtStart = useRef(useStore.getState().srs)
  const xpAtStart = useRef(useStore.getState().stats.xp)
  const [deck] = useState(() =>
    buildDeck(params.source ?? { type: 'due' }, {
      srs: srsAtStart.current,
      size: params.source?.type === 'level' ? 10 : 20,
    }),
  )

  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const results = useRef({ remembered: 0, forgot: 0 })

  const word = deck[i]

  // カードが変わるたび自動で読み上げ
  useEffect(() => {
    if (word && settings.autoSpeak) {
      speak(word.word, { rate: settings.ttsRate, voiceURI: settings.ttsVoiceURI })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, word?.id])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🌳</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる単語がありません</p>
        <p className="text-sm font-bold text-ink/50">この条件では対象の単語が見つかりませんでした。</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? '単語学習',
      mode: 'study',
      total: deck.length,
      correct: results.current.remembered,
      wrong: results.current.forgot,
      xpGained,
      reviewIds: deck.map((w) => w.id),
      source: params.source,
    })
  }

  const answer = (remembered) => {
    review(word.id, remembered ? 'remembered' : 'forgot')
    if (remembered) results.current.remembered++
    else results.current.forgot++
    if (i + 1 >= deck.length) finish()
    else {
      setI(i + 1)
      setFlipped(false)
    }
  }

  const relatedCount = relatedByEtymology(word).length
  const saved = myList.includes(word.id)

  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー（進捗） */}
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる">
          <Close size={22} />
        </IconButton>
        <div className="flex-1">
          <ProgressBar value={(i) / deck.length} />
        </div>
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
          {/* 表：単語 */}
          <div className="flex items-start justify-between">
            <PosBadge pos={word.pos} />
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                toggleMyList(word.id)
              }}
              className={saved ? 'text-hint' : 'text-ink/30'}
              aria-label="マイ単語に保存"
            >
              {saved ? <BookmarkFilled size={22} /> : <Bookmark size={22} />}
            </IconButton>
          </div>

          <div className="mt-2 flex flex-col items-center text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
            {settings.showPhonetic && word.phonetic && (
              <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>
            )}
            <div className="mt-3">
              <SpeakButton text={word.word} size="lg" />
            </div>
          </div>

          {!flipped ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 py-8 text-brand-400">
              <span className="text-sm font-extrabold">タップして意味と語源を見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-5 space-y-4 animate-slide-up">
              {/* 意味 */}
              <div className="rounded-2xl bg-brand-50 p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">意味</div>
                <div className="mt-0.5 font-display text-xl font-extrabold text-ink">
                  {word.meanings.join('・')}
                </div>
              </div>

              {/* 例文 */}
              {word.example && (
                <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
                  <div className="flex items-start gap-2">
                    <SpeakButton text={word.example.en} size="sm" />
                    <div className="flex-1">
                      <p className="font-bold text-ink">{word.example.en}</p>
                      <p className="mt-0.5 text-sm font-bold text-ink/55">{word.example.ja}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 語源（ある単語のみ） */}
              {word.etymology && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
                  <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                    <Lightbulb size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wide">語源</span>
                  </div>
                  <EtymologyBlock
                    word={word}
                    onRoot={(rootId) => navigate('rootDetail', { rootId })}
                  />
                </div>
              )}

              <button
                onClick={() => navigate('wordDetail', { id: word.id })}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-100 py-3 text-sm font-extrabold text-brand-700 active:bg-brand-200"
              >
                くわしく見る{relatedCount > 0 && `（語源でつながる単語 ${relatedCount}）`}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* フッター操作 */}
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
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
