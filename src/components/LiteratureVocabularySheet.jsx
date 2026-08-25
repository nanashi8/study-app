import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { Sheet } from './Sheet.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { RevealAnswersToggle } from './RevealAnswers.jsx'
import { Button, Chip, ProgressBar, cx } from './ui.jsx'
import { Book, Check, Search } from './Icons.jsx'

const FILTERS = Object.freeze([
  { id: 'all', label: 'すべて' },
  { id: 'dictionary', label: '共通単語' },
  { id: 'phrase', label: '本文語句' },
])

const normalized = (value) => String(value ?? '').normalize('NFKC').toLowerCase()

function reviewEntryState(entry, stores) {
  if (entry.reviewDomain === 'koten') return stores.kotenSrs[entry.id]
  if (entry.reviewDomain === 'kanbun') return stores.kanbunVocabSrs[entry.id]
  return stores.srs[entry.id]
}
function EntryMeta({ entry }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold text-ink/45">
      <span className={cx(
        'rounded-full px-2 py-1',
        entry.entryType === 'phrase'
          ? 'bg-amber-100 text-amber-800'
          : entry.literatureOnly
            ? 'bg-violet-100 text-violet-800'
            : 'bg-emerald-100 text-emerald-800',
      )}>
        {entry.entryType === 'phrase'
          ? '本文の意味区切り'
          : entry.literatureOnly
            ? '作品専用語'
            : '共通辞書'}
      </span>
      {entry.occurrences > 1 && <span>{entry.occurrences}回出現</span>}
      {entry.sceneNumbers?.length > 0 && (
        <span>場面 {entry.sceneNumbers.join('・')}</span>
      )}
    </div>
  )
}

export function LiteratureVocabularySheet({
  open,
  onClose,
  work,
  vocabulary,
  onOpenSharedStudy,
}) {
  const review = useStore((state) => state.review)
  const reviewKoten = useStore((state) => state.reviewKoten)
  const reviewKanbun = useStore((state) => state.reviewKanbun)
  const srs = useStore((state) => state.srs)
  const kotenSrs = useStore((state) => state.kotenSrs)
  const kanbunVocabSrs = useStore((state) => state.kanbunVocabSrs)
  const revealAll = useStore((state) => state.settings.revealAnswers === true)
  const stores = { srs, kotenSrs, kanbunVocabSrs }

  const [mode, setMode] = useState('list')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [deck, setDeck] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [remembered, setRemembered] = useState(0)
  const [forgotten, setForgotten] = useState(0)

  useEffect(() => {
    if (!open) return
    setMode('list')
    setFilter('all')
    setQuery('')
    setDeck([])
    setCardIndex(0)
    setRevealed(revealAll)
    setRemembered(0)
    setForgotten(0)
  }, [open, work?.id])

  const filteredEntries = useMemo(() => {
    const needle = normalized(query).trim()
    return (vocabulary?.entries ?? []).filter((entry) => {
      if (filter === 'dictionary' && entry.entryType === 'phrase') return false
      if (filter === 'phrase' && entry.entryType !== 'phrase') return false
      if (!needle) return true
      const haystack = normalized([
        entry.word,
        entry.speech,
        ...(entry.meanings ?? []),
        ...(entry.sourceForms ?? []),
      ].join(' '))
      return haystack.includes(needle)
    })
  }, [filter, query, vocabulary])

  const learnedCount = (vocabulary?.entries ?? []).filter(
    (entry) => Boolean(reviewEntryState(entry, stores)),
  ).length

  const startCards = () => {
    if (!filteredEntries.length) return
    setDeck(filteredEntries)
    setCardIndex(0)
    setRevealed(revealAll)
    setRemembered(0)
    setForgotten(0)
    setMode('cards')
  }

  const answer = (rememberedNow) => {
    const entry = deck[cardIndex]
    if (!entry) return
    const result = rememberedNow ? 'remembered' : 'forgot'
    if (entry.reviewDomain === 'koten') reviewKoten(entry.id, result)
    else if (entry.reviewDomain === 'kanbun') reviewKanbun('vocab', entry.id, result)
    else review(entry.id, result, entry.reviewSkill)

    if (rememberedNow) setRemembered((count) => count + 1)
    else setForgotten((count) => count + 1)

    if (cardIndex + 1 >= deck.length) {
      setMode('done')
      return
    }
    setCardIndex((index) => index + 1)
    setRevealed(revealAll)
  }

  const card = deck[cardIndex]

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`${work?.titleJa ?? '名作'}・本文語彙`}
      maxH="92svh"
    >
      <div
        className="pb-2"
        data-literature-vocabulary-sheet={work?.id}
        data-literature-vocabulary-missing={vocabulary?.missingOccurrences?.length ?? 0}
      >
        {mode === 'list' && (
          <div className="space-y-4">
            <section className="rounded-2xl border-2 border-sky-100 bg-sky-50 p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="block text-xl font-extrabold text-sky-800">
                    {vocabulary.coveredOccurrences}
                  </span>
                  <span className="text-[10px] font-bold text-ink/50">
                    本文{vocabulary.coverageUnitLabel}
                  </span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-violet-800">
                    {vocabulary.entries.length}
                  </span>
                  <span className="text-[10px] font-bold text-ink/50">学習カード</span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-emerald-800">
                    {learnedCount}
                  </span>
                  <span className="text-[10px] font-bold text-ink/50">学習済み</span>
                </div>
              </div>
              <p className="mt-3 text-xs font-bold leading-relaxed text-sky-950/65">
                {work?.kind === 'english'
                  ? `本文${vocabulary.totalOccurrences}語をすべて確認し、${vocabulary.uniqueForms}出現形を見出し語にまとめています。活用形・固有名詞も省いていません。`
                  : `共通単語${vocabulary.sharedEntries.length}件と、本文全体を覆う${vocabulary.contextEntries.length}個の意味区切りを学べます。`}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
                <Check size={14} /> 未対応 {vocabulary.missingOccurrences.length}件
              </p>
            </section>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={startCards} disabled={!filteredEntries.length}>
                <Book size={16} /> カードで暗記
              </Button>
              <Button
                variant="secondary"
                onClick={onOpenSharedStudy}
                disabled={!vocabulary.sharedEntries.length}
              >
                共通単語 {vocabulary.sharedEntries.length}
              </Button>
            </div>

            <label className="flex min-h-11 items-center gap-2 rounded-2xl border-2 border-ink/10 bg-white px-3 focus-within:border-sky-300">
              <Search size={17} className="shrink-0 text-ink/35" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="語・意味・場面を検索"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm font-bold text-ink outline-none placeholder:text-ink/30"
                aria-label="本文語彙を検索"
              />
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1" aria-label="語彙の種類">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  className={cx(
                    'min-h-10 shrink-0 rounded-full px-4 text-xs font-extrabold',
                    filter === item.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-ink/55 ring-1 ring-ink/10',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-extrabold text-ink/45">
              <span>{filteredEntries.length}件を表示</span>
              <span>{learnedCount}/{vocabulary.entries.length} 学習済み</span>
            </div>

            <div className="space-y-2">
              {filteredEntries.map((entry) => {
                const learned = Boolean(reviewEntryState(entry, stores))
                return (
                  <article
                    key={entry.id}
                    className="rounded-2xl border border-ink/10 bg-white p-3.5"
                    data-literature-vocabulary-entry={entry.id}
                  >
                    <div className="flex items-start gap-3">
                      <SpeakButton
                        text={entry.speech || entry.word}
                        lang={entry.lang}
                        size="sm"
                        title="名作の本文語彙"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            lang={work?.kind === 'english' ? 'en' : 'ja'}
                            className={cx(
                              'font-display font-extrabold leading-relaxed text-ink',
                              entry.entryType === 'phrase' ? 'text-base' : 'text-lg',
                            )}
                          >
                            {entry.word}
                          </p>
                          {learned && (
                            <Chip color="#059669"><Check size={11} /> 学習済み</Chip>
                          )}
                        </div>
                        {entry.speech && entry.speech !== entry.word && (
                          <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/45">
                            {entry.speech}
                          </p>
                        )}
                        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65">
                          {entry.meanings.join('・')}
                        </p>
                        <EntryMeta entry={entry} />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {mode === 'cards' && card && (
          <div className="space-y-4" data-literature-vocabulary-card={card.id}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="min-h-10 shrink-0 rounded-full bg-white px-3 text-xs font-extrabold text-ink/55 ring-1 ring-ink/10"
              >
                一覧へ
              </button>
              <div className="min-w-0 flex-1">
                <ProgressBar value={cardIndex / deck.length} color="#0284c7" />
                <p className="mt-1 text-right text-[10px] font-extrabold text-ink/40">
                  {cardIndex + 1} / {deck.length}
                </p>
              </div>
              <RevealAnswersToggle
                label="意味"
                onChange={(on) => on && setRevealed(true)}
              />
            </div>

            <article
              className="rounded-[2rem] bg-white p-5 text-center shadow-card"
              onClick={() => !revealed && setRevealed(true)}
            >
              <div className="flex justify-center">
                <SpeakButton
                  text={card.speech || card.word}
                  lang={card.lang}
                  size="lg"
                  title="名作の本文語彙"
                />
              </div>
              <p
                lang={work?.kind === 'english' ? 'en' : 'ja'}
                className={cx(
                  'mt-4 font-display font-extrabold leading-relaxed text-ink',
                  card.entryType === 'phrase' ? 'text-xl' : 'text-3xl',
                )}
              >
                {card.word}
              </p>
              {card.speech && card.speech !== card.word && (
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink/45">
                  {card.speech}
                </p>
              )}
              <EntryMeta entry={card} />

              {!revealed ? (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="mt-6 min-h-24 w-full rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50 text-sm font-extrabold text-sky-700"
                >
                  タップして意味を見る
                </button>
              ) : (
                <div className="mt-6 space-y-3 text-left">
                  <div className="rounded-2xl bg-sky-50 p-4">
                    <p className="text-[10px] font-extrabold text-sky-700">本文での意味</p>
                    <p className="mt-1 font-display text-lg font-extrabold leading-relaxed text-ink">
                      {card.meanings.join('・')}
                    </p>
                  </div>
                  {card.firstSceneOriginal && (
                    <div className="rounded-2xl bg-paper p-3 text-left">
                      <p lang="en" className="text-xs font-bold leading-relaxed text-ink">
                        {card.firstSceneOriginal}
                      </p>
                      <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                        {card.firstSceneTranslation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </article>

            {!revealed ? (
              <Button full size="lg" onClick={() => setRevealed(true)}>
                意味を見る
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="danger" size="lg" onClick={() => answer(false)}>
                  まだ
                </Button>
                <Button variant="success" size="lg" onClick={() => answer(true)}>
                  覚えた
                </Button>
              </div>
            )}
          </div>
        )}

        {mode === 'done' && (
          <div className="py-8 text-center" data-literature-vocabulary-complete>
            <div className="text-6xl">📚</div>
            <h3 className="mt-4 font-display text-2xl font-extrabold text-ink">
              本文語彙の予習完了
            </h3>
            <p className="mt-2 text-sm font-bold text-ink/55">
              {deck.length}件中、覚えた {remembered}件・まだ {forgotten}件
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={startCards}>もう一度</Button>
              <Button onClick={() => setMode('list')}>一覧へ</Button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  )
}
