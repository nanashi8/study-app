import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  KANBUN_COLLECTIONS,
  kanbunDomainMeta,
  kanbunItems,
  shuffleKanbun,
} from '../data/kanbun-content.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { Button, Chip, IconButton } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { KanbunText, KanbunHeadword } from '../components/KanbunFurigana.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import { growDeck } from '../lib/session.js'
import { CardStudyFooter, CardSwipeRegion } from '../components/CardStudyControls.jsx'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useIndexedSessionState,
} from '../components/QuestionSessionControls.jsx'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  Close,
  Lightbulb,
} from '../components/Icons.jsx'

function AnswerDetails({ domain, item }) {
  return (
    <div className="mt-6 space-y-3 animate-slide-up">
      <div className="rounded-2xl bg-rose-50 p-4">
        <p className="text-[10px] font-extrabold tracking-wide text-rose-700">答え</p>
        <p className="mt-1 font-display text-lg font-extrabold leading-relaxed text-ink">{item.answer}</p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-[10px] font-extrabold tracking-wide text-slate-500">くわしい説明</p>
        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/70">{item.detail}</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-1.5 text-amber-700">
          <Lightbulb size={16} />
          <span className="text-[10px] font-extrabold tracking-wide">見分けるヒント</span>
        </div>
        <p className="mt-1.5 text-sm font-bold leading-relaxed text-amber-950/75">{item.clue}</p>
      </div>

      {(item.original || item.scene) && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-rose-950 p-4 text-white">
          <p className="text-[10px] font-extrabold text-rose-200">{domain === 'culture' ? '本文で使う場面' : '用例'}</p>
          <p className="mt-2 font-serif text-lg font-bold leading-[1.8]">{item.original || item.scene}</p>
          {item.kakikudashi && <p className="mt-2 text-sm font-bold leading-relaxed text-white/80"><KanbunText>{item.kakikudashi}</KanbunText></p>}
          {item.translation && <p className="mt-1 text-xs font-bold leading-relaxed text-white/60">{item.translation}</p>}
          {item.application && <p className="mt-2 text-xs font-bold leading-relaxed text-white/70">{item.application}</p>}
        </div>
      )}

      <div className="rounded-2xl border border-rose-200 bg-white p-4">
        <p className="text-[10px] font-extrabold tracking-wide text-rose-600">まちがえやすい点</p>
        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65">{item.pitfall}</p>
      </div>
    </div>
  )
}

export function KanbunStudyScreen() {
  const params = useStore((state) => state.params)
  const returnTo = useStore((state) => state.returnTo)
  const review = useStore((state) => state.reviewKanbun)
  const toggleSaved = useStore((state) => state.toggleKanbunList)
  const domain = KANBUN_COLLECTIONS[params.domain] ? params.domain : 'vocab'
  const meta = kanbunDomainMeta(domain)
  const savedIds = useStore((state) => state[meta.listField])
  const revealAll = useStore((state) => state.settings.revealAnswers)
  // size を指定しないときは設定した問題数まで絞る。
  const buildFor = (ids, size) => {
    const selected = kanbunItems(domain, ids)
    const items = params.preserveOrder && Array.isArray(ids)
      ? ids.map((id) => selected.find((item) => item.id === id)).filter(Boolean)
      : shuffleKanbun(selected)
    return size > 0 ? items.slice(0, size) : items
  }
  const [poolSize] = useState(() => kanbunItems(domain, params.ids).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildFor(params.ids, params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(revealAll)
  const [remembered, setRemembered] = useState(0)
  const [forgottenIds, setForgottenIds] = useState([])
  const [done, setDone] = useState(false)
  const {
    value: recordedAnswer,
    setValue: setRecordedAnswer,
    clear: clearRecordedAnswers,
    values: recordedAnswers,
  } = useIndexedSessionState(index)
  const item = deck[index]

  // コンテンツ画面の「戻る」は履歴でなく、この分野の内容選択画面へ。
  const backToKanbunCatalog = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    returnTo('kanbunCatalog', { domain })
  }

  if (!deck.length || !item) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📕</div>
        <p className="font-display text-lg font-extrabold text-ink">学習できる項目がありません</p>
        <Button onClick={backToKanbunCatalog}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids) => {
    setDeck(buildFor(ids, deck.length))
    setIndex(0)
    setRevealed(revealAll)
    setRemembered(0)
    setForgottenIds([])
    setDone(false)
    clearRecordedAnswers()
  }

  const answer = (rememberedNow) => {
    if (recordedAnswer !== null) return
    review(domain, item.id, rememberedNow ? 'remembered' : 'forgot')
    if (rememberedNow) setRemembered((count) => count + 1)
    else setForgottenIds((ids) => [...new Set([...ids, item.id])])
    const nextAnswers = { ...recordedAnswers, [index]: rememberedNow }
    setRecordedAnswer(rememberedNow)
    if (Object.keys(nextAnswers).length >= deck.length) setDone(true)
    else moveToCard(nextUnansweredSessionIndex(index, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setIndex(nextIndex)
    setRevealed(revealAll || Object.hasOwn(answers, nextIndex))
  }

  if (done) {
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center">
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{meta.emoji}</div>
          <div>
            <p className="font-display text-2xl font-extrabold text-ink">暗記カード完了</p>
            <p className="mt-1 text-sm font-bold text-ink/55">
              {deck.length}{meta.itemLabel}のうち {remembered}{meta.itemLabel}を「覚えた」
            </p>
          </div>
          {forgottenIds.length > 0 && (
            <button
              type="button"
              onClick={() => restart(forgottenIds)}
              className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-left text-sm font-extrabold text-rose-900"
            >
              まだ覚えていない {forgottenIds.length}{meta.itemLabel}だけ、もう一度
            </button>
          )}
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart()}>全てもう一度</Button>
            <Button onClick={backToKanbunCatalog}>{meta.label}へ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const saved = savedIds.includes(item.id)
  const level = KANBUN_LEVEL_BY_ID[item.level]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-rose-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={backToKanbunCatalog} aria-label="学習をやめる"><Close size={22} /></IconButton>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-extrabold text-ink/40">{params.title ?? `${meta.label}を暗記`}</p>
          </div>
          <RevealAnswersToggle label="答え" onChange={(on) => setRevealed(on)} />
          <SpeechSettingsButton compact />
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            label="項目"
            onResize={(size, { discard }) => {
              if (discard) {
                setDeck(buildFor(params.ids, size))
                setIndex(0)
                setRevealed(revealAll)
                setRemembered(0)
                setForgottenIds([])
                setDone(false)
                clearRecordedAnswers()
              } else {
                setDeck((current) => growDeck(current, index + 1, buildFor(params.ids, size), size))
              }
            }}
          />
        </div>
      </div>

      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => moveToCard(Math.max(0, index - 1))}
        onNext={() => moveToCard(Math.min(deck.length - 1, index + 1))}
        nextDisabled={index + 1 >= deck.length}
        itemLabel="カード"
        progressColor="#be123c"
      />

      <CardSwipeRegion
        index={index}
        total={deck.length}
        onIndexChange={moveToCard}
        className="flex-1 overflow-y-auto px-4 pb-4 pt-3"
      >
        <article
          key={item.id}
          onClick={() => !revealed && setRevealed(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Chip color={level?.color}>{level?.label}</Chip>
              <Chip color={meta.color}>{meta.label}</Chip>
            </div>
            <IconButton
              onClick={(event) => { event.stopPropagation(); toggleSaved(domain, item.id) }}
              aria-label={saved ? `${item.title}を登録から外す` : `${item.title}を登録する`}
              aria-pressed={saved}
              className={saved ? 'text-amber-600' : 'text-ink/25'}
            >
              {saved ? <BookmarkFilled size={22} /> : <Bookmark size={22} />}
            </IconButton>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[10px] font-extrabold text-rose-600">漢文を暗記</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-snug text-ink"><KanbunHeadword item={item} /></h1>
            {/* 見出しのルビと同じ読みしかないときは、下の読み行を重ねて出さない。 */}
            {item.reading && item.reading.includes('・') && (
              <p className="mt-1 text-sm font-extrabold text-rose-700">{item.reading}</p>
            )}
            {item.pattern && <p className="mt-2 rounded-xl bg-slate-100 px-3 py-2 font-mono text-sm font-extrabold text-slate-800">{item.pattern}</p>}
            <p className="mt-3 text-sm font-bold leading-relaxed text-ink/45">{item.front}</p>
          </div>

          {!revealed ? (
            <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 py-9 text-rose-700">
              <span className="text-sm font-extrabold">タップして答えを見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : <AnswerDetails domain={domain} item={item} />}
        </article>
      </CardSwipeRegion>

      <CardStudyFooter className="border-rose-100">
        {recordedAnswer !== null ? (
          <Button full size="lg" variant={recordedAnswer ? 'success' : 'danger'} disabled>
            {recordedAnswer ? '覚えた' : 'まだ'}（回答済み）
          </Button>
        ) : !revealed ? (
          <Button full size="lg" onClick={() => setRevealed(true)}>答えを見る</Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>まだ 🤔</Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>覚えた 👍</Button>
          </div>
        )}
      </CardStudyFooter>
    </div>
  )
}
