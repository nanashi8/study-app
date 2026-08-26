import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SUMMARY,
  getWord,
} from '../data/vocab.js'
import {
  ETYMOLOGY_STATUS_META,
  etymologyWordCardReviewState,
  etymologyWordProgress,
  filterEtymologyWordCards,
} from '../lib/etymologyProgress.js'
import { SESSION_SIZE } from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { StatusDistributionBar } from '../components/LearningStatusBars.jsx'
import { Button, Card, cx } from '../components/ui.jsx'
import { ArrowRight, Book } from '../components/Icons.jsx'

const PAGE_SIZE = 24
const STATUSES = ['all', 'due', 'unstarted', 'learning', 'mastered']

const statusCount = (progress, status) => {
  if (status === 'all') return progress.total
  return progress[status] ?? 0
}

const statusPresentation = (state) => {
  if (state.due) return { label: '今日復習', className: 'bg-rose-50 text-rose-700' }
  if (state.status === 'mastered') return { label: '学習済み', className: 'bg-emerald-50 text-emerald-700' }
  if (state.status === 'learning') return { label: '学習中', className: 'bg-amber-50 text-amber-700' }
  return { label: '未学習', className: 'bg-slate-100 text-slate-600' }
}

const priorityRank = (state) => {
  if (state.due) return 0
  if (state.status === 'unstarted') return 1
  if (state.status === 'learning') return 2
  return 3
}

export function RootsScreen() {
  const rootRef = useRef(null)
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  const initialStatus = STATUSES.includes(params.status) ? params.status : 'all'
  const [status, setStatus] = useState(initialStatus)
  const [visible, setVisible] = useState(PAGE_SIZE)

  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const progress = useMemo(
    () => etymologyWordProgress(ETYMOLOGY_PACKS, srs),
    [srs],
  )
  const cards = useMemo(() => {
    const filtered = filterEtymologyWordCards(ETYMOLOGY_PACKS, srs, { status })
    if (status !== 'all') return filtered
    return [...filtered].sort((left, right) => {
      const leftState = etymologyWordCardReviewState(left, srs)
      const rightState = etymologyWordCardReviewState(right, srs)
      return priorityRank(leftState) - priorityRank(rightState)
        || left.title.localeCompare(right.title, 'ja')
    })
  }, [srs, status])
  const learningCounts = useMemo(() => ({
    learned: progress.mastered,
    reviewing: progress.learning,
    unlearned: progress.unstarted,
  }), [progress])
  const studyIds = useMemo(() => [...new Set(
    cards.flatMap((card) => card.studyIds),
  )], [cards])

  const selectStatus = (nextStatus) => {
    setStatus(nextStatus)
    setVisible(PAGE_SIZE)
  }

  const studyWords = () => navigate('vocabStudy', {
    source: { type: 'deck', ids: studyIds, preserveOrder: true },
    title: status === 'all' ? '語源から単語を暗記' : `${ETYMOLOGY_STATUS_META[status].label}の単語`,
    mode: 'study',
    size: Math.min(SESSION_SIZE, studyIds.length),
    returnTo: { screen: 'roots', params: { status } },
  })

  return (
    <div ref={rootRef} className="pb-6">
      <ScreenHeader title="語源" subtitle="語根から英単語を暗記" />

      <div className="space-y-4 px-4">
        <section
          className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-600 p-4 text-white shadow-card"
          aria-labelledby="etymology-flow-heading"
          data-etymology-intro
        >
          <p className="text-xs font-extrabold text-white/75">語根から意味をつなぐ</p>
          <h1 id="etymology-flow-heading" className="mt-1 font-display text-xl font-extrabold">
            形が分かると、意味を思い出せる
          </h1>
          <p className="mt-1 text-sm font-bold leading-relaxed text-white/80">
            語根の形と意味をつなぎ、関連する英単語をまとめて覚えます。ここでの結果も英単語の学習記録に入ります。
          </p>
          <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="語源から単語を暗記する3ステップ">
            {[
              ['1', '形を見る'],
              ['2', '意味をつなぐ'],
              ['3', '単語を暗記'],
            ].map(([number, label]) => (
              <li key={number} className="rounded-2xl bg-white/12 px-2 py-2.5 text-center">
                <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-extrabold text-violet-700">{number}</span>
                <span className="mt-1.5 block text-xs font-extrabold leading-snug">{label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl bg-white p-3 ring-1 ring-slate-200" data-etymology-actions>
          <div className="mb-3 text-center">
            <p className="text-sm font-extrabold text-slate-800">
              {status === 'all' ? '今日の復習と未学習を先に出します' : ETYMOLOGY_STATUS_META[status].label}
            </p>
            <p className="mt-0.5 text-xs font-bold text-slate-500">
              {cards.length}カードに紐づく{studyIds.length}語から出題
            </p>
          </div>
          <Button
            full
            onClick={studyWords}
            disabled={studyIds.length === 0}
            data-etymology-word-study-action
          >
            <Book size={18} /> 紐づく単語を暗記
          </Button>
        </section>

        <section
          className="rounded-2xl border border-slate-200 bg-white p-3"
          aria-labelledby="etymology-progress-heading"
          data-etymology-dashboard
        >
          <div className="flex items-start justify-between gap-3 px-1">
            <div>
              <h2 id="etymology-progress-heading" className="font-display text-base font-extrabold text-slate-900">語源カードの進み具合</h2>
              <p className="text-xs font-bold text-slate-500">取り組み {progress.started} / {progress.total}枚</p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-extrabold text-rose-700">
              今日復習 {progress.due}
            </span>
          </div>
          <StatusDistributionBar
            kind="learning"
            counts={learningCounts}
            className="mt-3"
            compact
            unit="枚"
          />
          <div className="mt-3 grid grid-cols-2 gap-2" aria-label="語源カードの進み具合で絞り込む">
            {STATUSES.map((id) => {
              const selected = status === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectStatus(id)}
                  className={cx(
                    'min-h-11 rounded-xl px-3 text-left text-xs font-extrabold ring-1 transition-colors',
                    selected
                      ? 'bg-violet-600 text-white ring-violet-600'
                      : 'bg-white text-slate-600 ring-slate-200',
                  )}
                >
                  {ETYMOLOGY_STATUS_META[id].short} {statusCount(progress, id)}枚
                </button>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="etymology-card-heading" data-etymology-card-browser>
          <div className="mb-2 px-1">
            <h2 id="etymology-card-heading" className="font-display text-base font-extrabold text-slate-900">カードを選ぶ</h2>
            <p className="text-xs font-bold leading-relaxed text-slate-500">
              語根を選ぶと、意味と関連する単語を確認できます。
            </p>
          </div>

          {cards.length ? (
            <div className="space-y-2.5">
              {cards.slice(0, visible).map((card) => {
                const examples = card.exampleIds.map(getWord).filter(Boolean)
                const state = etymologyWordCardReviewState(card, srs)
                const cardStatus = statusPresentation(state)
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => navigate('etymologyPack', { packId: card.id })}
                    className="w-full text-left transition active:scale-[0.99]"
                  >
                    <Card className="p-3.5">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-xl" aria-hidden="true">{card.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-start gap-2">
                            <h3 className="min-w-0 flex-1 font-display text-base font-extrabold leading-tight text-ink">
                              {card.title}
                            </h3>
                            <span className={cx('shrink-0 rounded-full px-2 py-1 text-xs font-extrabold', cardStatus.className)}>
                              {cardStatus.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-500">{card.rootOrigin}</p>
                          <p className="mt-1 line-clamp-2 text-xs font-extrabold leading-relaxed text-violet-700">
                            {examples.map((word) => word.word).join('・')}
                            {card.coverageIds.length > examples.length ? ` ほか${card.coverageIds.length - examples.length}語` : ''}
                          </p>
                        </div>
                        <span className="mt-3 text-brand-300"><ArrowRight size={17} /></span>
                      </div>
                    </Card>
                  </button>
                )
              })}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="font-display text-base font-extrabold text-ink">この進み具合のカードはありません</p>
              <p className="mt-1 text-xs font-bold text-ink/45">別の進み具合へ切り替えてください。</p>
            </Card>
          )}

          {visible < cards.length && (
            <Button full variant="secondary" className="mt-3" onClick={() => setVisible(visible + PAGE_SIZE)}>
              次の{Math.min(PAGE_SIZE, cards.length - visible)}枚を表示
            </Button>
          )}
        </section>

        <p className="px-1 text-xs font-bold leading-relaxed text-slate-400">
          {ETYMOLOGY_SUMMARY.cards.toLocaleString()}枚・関連する{ETYMOLOGY_SUMMARY.total.toLocaleString()}語。
          出典は各カードから確認できます。
        </p>
      </div>
    </div>
  )
}
